# Node DotA2 Loading Screen

Extract (and decompile) DotA2 loading screens.

## Install 

```Bash
npm install git+https://github.com/Luluno01/node-dota2-loading-screen.git --save
```

## Usage

Extract all loading screens:

```TypeScript
import LoadingScreenList from 'dota2-loading-screen'


async function main() {
  // ...
  const list = await LoadingScreenList.fromVPKFile('/path/to/dota 2 beta/game/dota/pak01_dir.vpk')
  const extracted /* The number of extracted loading screen `.vtex_c` files */ = await list.extractAll('/path/to/extraction/folder')
  // ...
}

// ...
main()
// ...

```

Decompile extracted loading screens (using decompiler from [SteamDatabase](https://github.com/SteamDatabase/ValveResourceFormat)):

```TypeScript
import { decompile } from 'dota2-loading-screen'


async function main() {
  // ...
  await decompile(
    '/path/to/extracted/loading-screens/folder',
    '/path/to/decompilation/folder',
    /* Do not print decompiler output to the console */
    false
  )
  // ...
}

// ...
main()
// ...

```

Extract all loading screens and decompile them:

```TypeScript
import LoadingScreenList from 'dota2-loading-screen'


async function main() {
  // ...
  const list = await LoadingScreenList.fromVPKFile('/path/to/dota 2 beta/game/dota/pak01_dir.vpk')
  const extracted /* The number of extracted loading screen `.vtex_c` files */ = await list.extracAndDecompileAll('/path/to/extraction/and/decompilation/folder')
  // ...
}

// ...
main()
// ...

```

## CLI Usage

Clone and build:

```Bash
git clone https://github.com/Luluno01/node-dota2-loading-screen.git --depth=1
cd node-dota2-loading-screen
npm install

npm run bulid
```

Extract all loading screens:

```Bash
npm run e -- "/path/to/dota 2 beta/game/dota/pak01_dir.vpk" "/path/to/extraction/folder"
```

*Default destination foler for extraction is `loading-screens`.*

Extract all loading screens and decompile them:

```Bash
npm run ed -- "/path/to/dota 2 beta/game/dota/pak01_dir.vpk" "/path/to/extraction/folder" "/path/to/decompilation/folder"
```

*Default destination foler for extraction is `loading-screens`.*

*Default decompilation output foler is a sub-folder named `decompiled` under the extraction folder.*
