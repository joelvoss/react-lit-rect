import { Rect } from '../../src/index';

export function Example() {
	return (
		<>
			<h2>Example: Basic</h2>
			<Rect>
				{({ ref, rect }) => (
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
				)}
			</Rect>
		</>
	);
}
