# @react-lit/rect

Provides `<Rect />` and `useRect` to measure Elements via
`Element.getBoundingClientRect()`.

## Installation

```bash
$ npm i @react-lit/rect
# or
$ yarn add @react-lit/rect
```

## Example

```js
import * as React from 'react';
import { Rect, useRect } from "@react-lit/rect";

// (1) Example using <Rect />
function RectExample() {
  return (
    <Rect>
      {({ ref, rect }) => (
        <div>
          <pre>{JSON.stringify(rect, null, 2)}</pre>
          <span
            ref={ref}
            contentEditable
            dangerouslySetInnerHTML={{
              __html: "Edit this to change the size!",
            }}
          />
        </div>
      )}
    </Rect>
  );
}

// (2) Example using useRect()
function UseRefExample() {
  const ref = React.useRef();
  const rect = useRect(ref);

  return (
    <div>
      <pre>{JSON.stringify(rect, null, 2)}</pre>
      <div
        ref={ref}
        contentEditable
        dangerouslySetInnerHTML={{
          __html: "Edit this to change the size!",
        }}
      />
    </div>
  );
}
```

## Development

(1) Install dependencies

```bash
$ npm i
# or
$ yarn
```

(2) Run initial validation

```bash
$ ./Taskfile.sh validate
```

(3) Run tests in watch-mode to validate functionality.

```bash
$ ./Taskfile test -w
```

---

_This project was set up by @jvdx/core_
