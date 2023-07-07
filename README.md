![🚧 Under construction 👷‍♂️](https://i.imgur.com/LEP2R3N.png)

# File API polyfill

📂 Isomorphic `File`, `FileReader`, and `FileReaderSync` for Node.js, Deno, Bun, and browsers

<div align="center">

![]()

</div>

## Installation

You can install this package using npm, [Yarn], or [pnpm]. Whatever floats your boat! ⛵

```sh
npm install @webfill/fileapi
```

## Usage

```js
import "@webfill/fileapi";

const blob = new Blob(["Hello world!"]);
const text = new FileReaderSync().readAsText(blob);
```

## Development

TODO: Add development section

[file api]: https://developer.mozilla.org/en-US/docs/Web/API/File_API
