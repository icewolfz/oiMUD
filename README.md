# oiMUD

A mud wen client that can connect to muds that expose a websocket port

## Installation

- Copy all files from the dist folder to desired location
- Remove \*.core.* and \*.interface.* files if you plan to use full client and do not want to customize interface

## Build

  To build oiMUD you must have nodejs 20 LTS or >=22, npm, typescript 2.3+
  Steps to build:

### Prerequisites

Install or download Node: https://nodejs.org/en/download/
  - Npm comes with most node installs, if not see: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
Install or download Typescript: https://www.typescriptlang.org/download/
  - easiest to just use `npm install typescript -g` after node/npm installed

### Steps

1. `git clone https://github.com/icewolfz/oiMUD.git` or `git pull` if already ready cloned, or you can download and unzip the source archive
1. `npm install` install all required modules, if already installed and do not need to update this skip can be skipped
1. `nmp run build:all` Build all required files and create them in dist folder

### Advanced build options

For more advanced control you can run the build script directly using  node build.js [arguments]

#### Build script arguments

1. `-d,--debug,-debug` Build just debug version
1. `-r,--release,-release` Build just release version
1. `-a,--all,-all` Build all scripts and css
1. `-b,--bundled,-bundled` Build just final bundle
1. `-c,--css,-css` Build css files
1. `-core,--core` Build just core version of scripts skipping any interface related code
1. `-i,--interface,-interface` Build just interface code and only adding minimum required core code
1. `-te,--tinymce,-tinymce` Build tinymce content css file
1. `-t,--test,-test` Build and include test plugin

**Note** All arguments but all and tinymce need release or debug flag to build


The build script includes several advanced arguments to control what is built

## FAQ

Basic questions answered about oiMUD

- [oiMUD FAQ](dist/docs/faq.md)

## References

- [Interface](dist/docs/interface.md)
- [Profiles](dist/docs/profiles.md)
- [Speedpaths](dist/docs/speedpaths.md)
- [Commands](dist/docs/commands.md)
- [Functions](dist/docs/functions.md)
- [Preferences](dist/docs/preferences.md)
- [Scripting](dist/docs/scripting.md)
- [Mapper](dist/docs/mapper.md)

## Known Issues

- `Edge` There are possible issues with websockets sending extra data causing data to buffer and corrupt sent commands, simply resend if it happens.
- `IE 11` Not officially supported
- `Chrome` Screen readers may re-read the main display text from the beginning
- `Mapper` Due to browser storage limits mapping data may not correctly save.
  - `Firefox` you can increase your storage limits by changing the 'dom.storage.default_quota' setting open about:config, search for dom.storage.default_quota, and enter a larger #
- `CClearer` If installed or similar apps, it may monitor browsers and clear data on close or on a schedule, either turn off monitoring or check to ignore your browser
- `All browsers` ensure you do not have clear cookies or site data on close enabled or you will lose profiles and map data unless backed up to the mud or locally as text files