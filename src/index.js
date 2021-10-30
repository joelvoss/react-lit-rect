import { useCallback, useRef, useState } from 'react';
import {
	isBoolean,
	useIsomorphicLayoutEffect as useLayoutEffect,
} from '@react-lit/helper';
import { observeRect } from './observe-rect';

////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Partial<DOMRect>} PRect
 */

/**
 * @typedef {Object} UseRectOptions
 * @prop {boolean} [observe]
 * @prop {(rect: PRect) => void} [onChange]
 */

/**
 * Rect renders a component that passes the measured rect to its children.
 */
export const Rect = ({ onChange, observe = true, children }) => {
	const ref = useRef(null);
	const rect = useRect(ref, { observe, onChange });
	return children({ ref, rect });
};

////////////////////////////////////////////////////////////////////////////////

/**
 * useRect
 * @param {React.RefObject<T | undefined | null>} nodeRef
 * @param {boolean | UseRectOptions} [observeOrOptions]
 * @returns {null | DOMRect}
 * @template T
 */
export function useRect(nodeRef, observeOrOptions) {
	let observe;
	let onChange;
	if (isBoolean(observeOrOptions)) {
		observe = observeOrOptions;
	} else {
		observe = observeOrOptions?.observe ?? true;
		onChange = observeOrOptions?.onChange;
	}

	let [element, setElement] = useState(nodeRef.current);
	let initialRectIsSet = useRef(false);
	let initialRefIsSet = useRef(false);
	let [rect, setRect] = useState(null);
	let onChangeRef = useRef(onChange);
	let stableOnChange = useCallback(rect => {
		onChangeRef.current && onChangeRef.current(rect);
	}, []);

	// NOTE(joel): We stabalize the onChange handler in a ref but we want to
	// update the handler before every execution in following effects. This
	// is not expensive to do and doesn't force a re-render, so it is safe to
	// disable the exhastive-deps lint rule here.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useLayoutEffect(() => {
		onChangeRef.current = onChange;
		if (nodeRef.current !== element) {
			setElement(nodeRef.current);
		}
	});

	useLayoutEffect(() => {
		if (element && !initialRectIsSet.current) {
			initialRectIsSet.current = true;
			setRect(element.getBoundingClientRect());
		}
	}, [element]);

	useLayoutEffect(() => {
		let observer;
		let elem = element;

		function cleanup() {
			observer && observer.unobserve();
		}

		// NOTE(joel): State initializes before refs are placed, meaning the
		// element state will be undefined on the first render. We still want the
		// rect on the first render, so initially we'll use the nodeRef that was
		// passed instead of state for our measurements.
		if (!initialRefIsSet.current) {
			initialRefIsSet.current = true;
			elem = nodeRef.current;
		}

		if (!elem) return cleanup;

		observer = observeRect(elem, rect => {
			stableOnChange(rect);
			setRect(rect);
		});

		observe && observer.observe();
		return cleanup;
	}, [observe, element, nodeRef, stableOnChange]);

	return rect;
}

////////////////////////////////////////////////////////////////////////////////
