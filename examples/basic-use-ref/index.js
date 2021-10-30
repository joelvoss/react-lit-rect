import { useRef } from 'react';
import { useRect } from '../../src/index';

export function Example() {
	const ref = useRef();
	const rect = useRect(ref, { observe: true });

	return (
		<>
			<h2>Example: Basic useRef</h2>
			<div>
				<pre>{JSON.stringify(rect, null, 2)}</pre>
				<textarea defaultValue="resize this" />
				<span
					ref={ref}
					contentEditable
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: "Observing my rect, I'm also editable",
					}}
					style={{
						display: 'inline-block',
						padding: 10,
						margin: 10,
						border: 'solid 1px',
						background: '#f0f0f0',
					}}
				/>
			</div>
		</>
	);
}
