const esbuild = require('esbuild');

let args = {
    all: process.argv.indexOf('-a') !== -1 || process.argv.indexOf('--all') !== -1 || process.argv.indexOf('-all') !== -1,
    debug: process.argv.indexOf('-d') !== -1 || process.argv.indexOf('--debug') !== -1 || process.argv.indexOf('-debug') !== -1,
    bundled: process.argv.indexOf('-b') !== -1 || process.argv.indexOf('--bundled') !== -1 || process.argv.indexOf('-bundled') !== -1,
    css: process.argv.indexOf('-c') !== -1 || process.argv.indexOf('--css') !== -1 || process.argv.indexOf('-css') !== -1,
    release: process.argv.indexOf('-r') !== -1 || process.argv.indexOf('--release') !== -1 || process.argv.indexOf('-release') !== -1,
    core: process.argv.indexOf('--core') !== -1 || process.argv.indexOf('-core') !== -1,
    interface: process.argv.indexOf('-i') !== -1 || process.argv.indexOf('--interface') !== -1 || process.argv.indexOf('-interface') !== -1,
    tinymce: process.argv.indexOf('-te') !== -1 || process.argv.indexOf('--tinymce') !== -1 || process.argv.indexOf('-tinymce') !== -1,
    test: process.argv.indexOf('-t') !== -1 || process.argv.indexOf('--test') !== -1 || process.argv.indexOf('-test') !== -1,
}

let config = {
    bundle: true,
    loader: {
        ['.png']: 'dataurl',
        ['.svg']: 'dataurl'
    },
    external: ['moment']
}
let release = Object.assign({}, config, { minify: true, sourcemap: true, define: { TEST: args.test ? 'true' : 'false', DEBUG: 'false', TINYMCE: args.all || args.tinymce ? 'true' : 'false' } });
let debug = Object.assign({}, config, { minify: false, sourcemap: false, define: { TEST: 'true', DEBUG: 'true', TINYMCE: args.all || args.tinymce ? 'true' : 'false' } });

if (args.all || args.release) {
    //core
    if (args.all || args.core) {
        console.time('Built release core');
        esbuild.build(Object.assign(release, {
            entryPoints: ['src/client.ts'],
            outfile: 'dist/oiMUD.core.min.js'
        })).then(console.timeEnd('Built release core'));
    }

    if (args.all || args.interface) {
        console.time('Built release interface');
        esbuild.build(Object.assign(release, {
            entryPoints: ['src/interface/interface.ts'],
            outfile: 'dist/oiMUD.interface.min.js'
        })).then(console.timeEnd('Built release interface'));
    }

    if (args.all || args.bundled) {
        console.time('Built release bundled');
        esbuild.build(Object.assign(release, {
            entryPoints: ['src/all.ts'],
            outfile: 'dist/oiMUD.min.js'
        })).then(console.timeEnd('Built release bundled'));
    }
}

if (args.all || args.argDebug) {
    //core debug
    if (args.all || args.core) {
        console.time('Built debug core');
        esbuild.build(Object.assign(debug, {
            entryPoints: ['src/client.ts'],
            outfile: 'dist/oiMUD.core.js'
        })).then(console.timeEnd('Built debug core'));
    }
    //interface
    if (args.all || args.interface) {
        console.time('Built debug interface');
        esbuild.build(Object.assign(debug, {
            entryPoints: ['src/interface/interface.ts'],
            outfile: 'dist/oiMUD.interface.js'
        })).then(console.timeEnd('Built debug interface'));
    }
    if (args.all || args.bundled) {
        console.time('Built debug bundled');
        esbuild.build(Object.assign(debug, {
            entryPoints: ['src/all.ts'],
            outfile: 'dist/oiMUD.js'
        })).then(console.timeEnd('Built debug bundled'));
    }
}

if (args.all || args.tinymce) {
    console.time('Built tinymce.content css');
    esbuild.build(Object.assign(release, {
        entryPoints: ['src/css/tinymce.content.css'],
        outfile: 'dist/css/tinymce.content.min.css'
    })).then(console.timeEnd('Built tinymce.content css'));
}
