const esbuild = require('esbuild');
const fs = require('fs/promises');
const { minify } = require('html-minifier-terser');
const { resolve } = require('path');
const terser = require('terser');

let args = {
    all: process.argv.indexOf('-a') !== -1 || process.argv.indexOf('--all') !== -1 || process.argv.indexOf('-all') !== -1,
    debug: process.argv.indexOf('-d') !== -1 || process.argv.indexOf('--debug') !== -1 || process.argv.indexOf('-debug') !== -1,
    bundled: process.argv.indexOf('-b') !== -1 || process.argv.indexOf('--bundled') !== -1 || process.argv.indexOf('-bundled') !== -1,
    css: process.argv.indexOf('-c') !== -1 || process.argv.indexOf('--css') !== -1 || process.argv.indexOf('-css') !== -1,
    release: process.argv.indexOf('-r') !== -1 || process.argv.indexOf('--release') !== -1 || process.argv.indexOf('-release') !== -1,
    core: process.argv.indexOf('--core') !== -1 || process.argv.indexOf('-core') !== -1,
    interface: process.argv.indexOf('-i') !== -1 || process.argv.indexOf('--interface') !== -1 || process.argv.indexOf('-interface') !== -1,
    tinymce: process.argv.indexOf('-te') !== -1 || process.argv.indexOf('--tinymce') !== -1 || process.argv.indexOf('-tinymce') !== -1,
    plugins: { SHADOWMUD_PLUGIN: 'false', TEST_PLUGIN: 'false', MAPPER_PLUGIN: 'false', CHAT_PLUGIN: 'false', LOGGER_PLUGIN: 'false', MSP_PLUGIN: 'false', PANELBAR_PLUGIN: 'false', STATUS_PLUGIN: 'false' },
    editor: process.argv.indexOf('-e') !== -1 || process.argv.indexOf('--editor') !== -1 || process.argv.indexOf('-editor') !== -1,
    metafile: process.argv.indexOf('-mf') !== -1 || process.argv.indexOf('--metafile') !== -1 || process.argv.indexOf('-metafile') !== -1,
    analyze: process.argv.indexOf('-az') !== -1 || process.argv.indexOf('--analyze') !== -1 || process.argv.indexOf('-analyze') !== -1,
}

process.argv.forEach(arg => {
    arg = arg.toLowerCase();
    let plugins;
    if (arg.startsWith('-p:'))
        plugins = arg.substring(3).toUpperCase().split(',');
    else if (arg.startsWith('--plugin:'))
        plugins = arg.substring(9).toUpperCase().split(',');
    else if (arg.startsWith('-plugin:'))
        plugins = arg.substring(8).toUpperCase().split(',');
    if (plugins && plugins.length)
        plugins.forEach(plugin => {
            if (plugin === 'ALL')
                Object.keys(args.plugins).forEach(plugin => args.plugins[plugin] = 'true');
            else if (plugin === 'CORE') {
                args.plugins.MAPPER_PLUGIN = 'true';
                args.plugins.LOGGER_PLUGIN = 'true';
                args.plugins.MSP_PLUGIN = 'true';
            }
            else
                args.plugins[plugin + '_PLUGIN'] = 'true';
        })
});

const HTMLMinifyPlugin = {
    name: "HTMLMinifyPlugin",
    setup(build) {
        build.onLoad({ filter: /\.htm|.html$/, namespace: 'file' }, async (args) => {
            const f = await fs.readFile(args.path, { encoding: 'utf8' });
            const m = await minify(f, { collapseWhitespace: true, minifyCSS: true, removeComments: true });
            return { loader: "text", contents: m };
        });
    }
}

/**
 * @param {Pick<import('esbuild').BuildOptions, 'minify' | 'format' | 'plugins'>}
 * @return {import('esbuild').Plugin}
 */
const PluginInlineWorker = (opt = { minify: true }) => {
    const namespace = "inline-worker";
    const prefix = `${namespace}:`;
    return {
        name: namespace,
        setup(build) {
            build.onResolve({ filter: new RegExp(`^${prefix}`) }, (args) => {
                return {
                    path: resolve(args.resolveDir, args.path.slice(prefix.length)),
                    namespace,
                };
            });
            build.onLoad({ filter: /.*/, namespace }, async (args) => {
                const { outputFiles } = await esbuild.build({
                    entryPoints: [args.path],
                    bundle: true,
                    write: false,
                    format: opt.format || "iife",
                    minify: false,
                    target: build.initialOptions.target,
                    plugins: [
                        ...(build.initialOptions.plugins || []),
                        ...(opt.plugins || []),
                    ],
                });
                if (outputFiles.length !== 1) {
                    throw new Error("Too many files built for worker bundle.");
                }
                let contents;
                if (opt.minify) {
                    contents = (await terser.minify(outputFiles[0].text, {
                        ecma: 2017,
                        format: {
                            comments: false,
                            ecma: 2017
                        },
                        mangle: {
                            properties: {
                                regex: /^[_\$]/
                            }
                        }
                    })).code;
                }
                else
                    contents = outputFiles[0].contents;
                const base64 = Buffer.from(contents).toString("base64");
                return {
                    loader: "js",
                    contents: `export default "data:application/javascript;base64,${base64}";`,
                };
            });
        },
    };
};

let config = {
    bundle: true,
    treeShaking: true,
    loader: {
        ['.png']: 'dataurl',
        ['.svg']: 'dataurl',
        ['.htm']: 'text'
    },
    external: ['moment'],
    metafile: args.metafile || args.analyze
}
let release = Object.assign({}, config, { mangleProps: /^[_\$]/, minify: true, sourcemap: true, define: Object.assign({ MINIFY: '"min."', DEBUG: 'false', TINYMCE: args.all || args.tinymce ? 'true' : 'false' }, args.plugins) });
let debug = Object.assign({}, config, { minify: false, sourcemap: false, define: Object.assign({ MINIFY: '""', DEBUG: 'true', TINYMCE: args.all || args.tinymce ? 'true' : 'false' }, args.plugins) });
release.plugins = [HTMLMinifyPlugin, PluginInlineWorker()];
debug.plugins = [HTMLMinifyPlugin, PluginInlineWorker({ minify: false })];
async function main() {
    console.time('Finish building');
    if (args.all || args.release) {
        //core
        if (args.all || args.core) {
            console.time('Built release core');
            processMetaFile(await esbuild.build(Object.assign(release, {
                entryPoints: ['src/core/client.ts'],
                outfile: 'dist/oiMUD.core.min.js'
            })), 'out/core.min.meta.json', args);
            console.timeEnd('Built release core');
        }

        if (args.all || args.interface) {
            console.time('Built release interface');
            processMetaFile(await esbuild.build(Object.assign(release, {
                entryPoints: ['src/interface/interface.ts'],
                outfile: 'dist/oiMUD.interface.min.js'
            })), 'out/interface.meta.json', args);
            console.timeEnd('Built release interface');
        }

        if (args.all || args.bundled) {
            console.time('Built release bundled');
            processMetaFile(await esbuild.build(Object.assign(release, {
                entryPoints: ['src/all.ts'],
                outfile: 'dist/oiMUD.min.js'
            })), 'out/min.meta.json', args);
            console.timeEnd('Built release bundled');
        }
    }

    if (args.all || args.debug) {
        //core debug
        if (args.all || args.core) {
            console.time('Built debug core');
            processMetaFile(await esbuild.build(Object.assign(debug, {
                entryPoints: ['src/core/client.ts'],
                outfile: 'dist/oiMUD.core.js'
            })), 'out/core.meta.json', args);
            console.timeEnd('Built debug core');
        }
        //interface
        if (args.all || args.interface) {
            console.time('Built debug interface');
            processMetaFile(await esbuild.build(Object.assign(debug, {
                entryPoints: ['src/interface/interface.ts'],
                outfile: 'dist/oiMUD.interface.js'
            })), 'out/interface.meta.json', args);
            console.timeEnd('Built debug interface');
        }
        if (args.all || args.bundled) {
            console.time('Built debug bundled');
            processMetaFile(await esbuild.build(Object.assign(debug, {
                entryPoints: ['src/all.ts'],
                outfile: 'dist/oiMUD.js'
            })), 'out/meta.json', args);
            console.timeEnd('Built debug bundled');
        }
    }

    if (args.all || args.tinymce) {
        console.time('Built tinymce.content css');
        processMetaFile(await esbuild.build(Object.assign(release, {
            entryPoints: ['src/css/tinymce.content.css'],
            outfile: 'dist/css/tinymce.content.min.css'
        })), 'out/tinymce.meta.json', args);
        console.timeEnd('Built tinymce.content css');
    }

    if (args.all || args.editor) {
        if (args.debug) {
            console.time('Built editor debug');
            processMetaFile(await esbuild.build(Object.assign(debug, {
                entryPoints: ['src/editor.ts'],
                outfile: 'dist/lib/editor.js'
            })), 'out/editor.meta.json', args);
            console.timeEnd('Built editor debug');
        }
        if (args.release) {
            console.time('Built editor release');
            processMetaFile(await esbuild.build(Object.assign(release, {
                entryPoints: ['src/editor.ts'],
                outfile: 'dist/lib/editor.min.js'
            })), 'out/editor.min.meta.json', args);
            console.timeEnd('Built editor release');
        }
    }

    /*
    if (args.all || args.workers) {
        if (args.all || args.release) {
            console.time('Built logger release');
            processMetaFile(await esbuild.build(Object.assign(release, {
                entryPoints: ['src/plugins/logger.worker.ts'],
                outfile: 'dist//oiMUD.logger.worker.min.js'
            })).then(console.timeEnd('Built logger release'))
        }

        if (args.all || args.debug) {
            console.time('Built logger debug');
            processMetaFile(await esbuild.build(Object.assign(debug, {
                entryPoints: ['src/plugins/logger.worker.ts'],
                outfile: 'dist/oiMUD.logger.worker.js'
            })).then(console.timeEnd('Built logger debug'));
        }
    }
    */

    console.timeEnd('Finish building');
}

async function processMetaFile(result, file, args) {
    if (args.metafile)
        fs.writeFile(file, JSON.stringify(result.metafile))
    if (args.analyze) {
        console.log(await esbuild.analyzeMetafile(result.metafile));
    }
}
main();