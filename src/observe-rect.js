/**
 * @typedef {Object} RectProps
 * @prop {DOMRect | undefined} rect
 * @prop {boolean} hasRectChanged
 * @prop {Array<Function>} callbacks
 */

/**
 * @typedef {Partial<DOMRect>} PartialRect
 */

/**
 * @type {Array<keyof DOMRect>}
 */
const props = ['bottom', 'height', 'left', 'right', 'top', 'width'];

/**
 * rectChanged
 * @param {DOMRect} [a={}]
 * @param {DOMRect} [b={}]
 */
const rectChanged = (a, b) => props.some(prop => a?.[prop] !== b?.[prop]);

/** @type {Map<Element, RectProps>} */
const observedNodes = new Map();
/** @type {number} */
let rafId;

const run = () => {
	/** @type {Array<RectProps>} */
	const changedStates = [];
	observedNodes.forEach((state, node) => {
		let newRect = node.getBoundingClientRect();
		if (rectChanged(newRect, state.rect)) {
			state.rect = newRect;
			changedStates.push(state);
		}
	});

	changedStates.forEach(state => {
		state.callbacks.forEach(cb => cb(state.rect));
	});

	rafId = window.requestAnimationFrame(run);
};

/**
 * observeRect
 * @param {Element} node
 * @param {(rect: DOMRect) => void} cb
 */
export function observeRect(node, cb) {
	return {
		observe() {
			let wasEmpty = observedNodes.size === 0;
			if (observedNodes.has(node)) {
				observedNodes.get(node).callbacks.push(cb);
			} else {
				observedNodes.set(node, {
					rect: undefined,
					hasRectChanged: false,
					callbacks: [cb],
				});
			}
			if (wasEmpty) run();
		},

		unobserve() {
			let state = observedNodes.get(node);
			if (state) {
				// NOTE(joel): Remove the callback...
				const index = state.callbacks.indexOf(cb);
				if (index >= 0) state.callbacks.splice(index, 1);

				// NOTE(joel): ...remove the node reference...
				if (!state.callbacks.length) observedNodes.delete(node);

				// NOTE(joel): ...stop the loop
				if (!observedNodes.size) cancelAnimationFrame(rafId);
			}
		},
	};
}
