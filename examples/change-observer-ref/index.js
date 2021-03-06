import * as React from 'react';
import { useRect } from '../../src/index';

export function Example() {
	const refLeft = React.useRef();
	const refRight = React.useRef();
	const [whichRect, setWhichRect] = React.useState(true);
	const rect = useRect(whichRect ? refLeft : refRight);

	return (
		<>
			<h2>Example: Change Observer Ref</h2>
			<div>
				<pre>
					{whichRect ? 'left' : 'right'}: {JSON.stringify(rect, null, 2)}
				</pre>
				<button onClick={() => setWhichRect(!whichRect)}>
					Toggle Observed Ref
				</button>
				<div>
					<textarea ref={refLeft} defaultValue="resize this" />
					<textarea ref={refRight} defaultValue="resize this" />
				</div>
			</div>
		</>
	);
}
