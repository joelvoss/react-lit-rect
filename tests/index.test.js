import * as React from 'react';
import { render } from './test-utils';

import { Rect, useRect } from '../src/index';

describe('<Rect />', () => {
	let oldGCR;
	beforeEach(() => {
		oldGCR = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = jest.fn(() => ({
			width: 20,
			height: 10,
			top: 1,
			left: 2,
			bottom: 3,
			right: 4,
		}));
	});
	afterEach(() => {
		Element.prototype.getBoundingClientRect = oldGCR;
	});

	it(`should render it's children`, async () => {
		const Element = () => (
			<Rect>
				{({ ref, rect }) => (
					<div>
						<pre data-testid="pre">{JSON.stringify(rect)}</pre>
						<div ref={ref} />
					</div>
				)}
			</Rect>
		);

		const { getByTestId } = render(<Element />);

		let preElement = getByTestId('pre');
		expect(preElement.innerHTML).toBe(
			'{"width":20,"height":10,"top":1,"left":2,"bottom":3,"right":4}',
		);
	});
});

describe('useRect', () => {
	let oldGCR;
	beforeEach(() => {
		oldGCR = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = jest.fn(() => ({
			width: 20,
			height: 10,
			top: 1,
			left: 2,
			bottom: 3,
			right: 4,
		}));
	});
	afterEach(() => {
		Element.prototype.getBoundingClientRect = oldGCR;
	});

	it(`should render it's children`, async () => {
		const Element = () => {
			const ref = React.useRef();
			const rect = useRect(ref, { observe: true });
			return (
				<div>
					<pre data-testid="pre">{JSON.stringify(rect)}</pre>
					<div ref={ref} />
				</div>
			);
		};

		const { getByTestId } = render(<Element />);

		let preElement = getByTestId('pre');
		expect(preElement.innerHTML).toBe(
			'{"width":20,"height":10,"top":1,"left":2,"bottom":3,"right":4}',
		);
	});
});
