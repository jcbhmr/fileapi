# File API for Node.js

📂 Node.js polyfill for the rest of the File API

<div align="center">

![]()

</div>

## Installation

You can install this package using npm, [Yarn], or [pnpm]. Whatever floats your boat! ⛵

```sh
npm install @jcbhmr/fileapi
```

## Usage

```js
import "@jcbhmr/fileapi";

const blob = new Blob(["Hello world!"]);
const text = new FileReaderSync().readAsText(blob);
```

## Development

TODO: Add development section

[file api]: https://developer.mozilla.org/en-US/docs/Web/API/File_API
