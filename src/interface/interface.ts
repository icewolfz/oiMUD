
import "../css/interface.css";
import { initMenu } from './menu';
import { Client } from '../client';
import { Dialog } from "../dialog";
import { openFileDialog, readFile, debounce, getParameterByName } from '../library';
import { AdvEditor } from './adv.editor';
import { SettingsDialog } from './settingsdialog';

declare global {
    interface Window {
        initializeInterface;
    }
    let client: Client;
}

//cache the objects once made for later use
let editor: AdvEditor;
let editorDialog: Dialog;

export function initializeInterface() {
    let options;
    initMenu();
    client.input.on('history-navigate', () => {
        if (client.getOption('commandAutoSize') || client.getOption('commandScrollbars'))
            resizeCommandInput();
    });
    client.on('options-loaded', () => {
        client.commandInput.removeEventListener('input', resizeCommandInput);
        client.commandInput.removeEventListener('change', resizeCommandInput);
        initCommandInput();
        updateCommandInput();
        if (client.getOption('commandAutoSize') || client.getOption('commandScrollbars'))
            resizeCommandInput();
        if (editorDialog) {
            editorDialog.resetState(client.getOption('windows.editor') || { center: true });
            if (editor.simple != client.getOption('simpleEditor')) {
                let value = '';
                if (!editor.isSimple)
                    value = editor.getFormattedText().replace(/(?:\r)/g, '');
                editor.simple = client.getOption('simpleEditor');
                if (!editor.isSimple) {
                    editorDialog.hideFooter();
                    editorDialog.header.querySelector('#adv-editor-switch').title = 'Switch to simple';
                }
                else {
                    editor.value = value;
                    editorDialog.showFooter();
                    editorDialog.header.querySelector('#adv-editor-switch').title = 'Switch to advanced';
                    setTimeout(() => editor.focus(), 100);
                }
            }
        }
    });
    client.on('set-title', title => {
        window.document.title = title;
    });
    //setup advanced editor footer button
    document.getElementById('btn-adv-editor').addEventListener('click', e => {
        if (!editorDialog) {
            editorDialog = new Dialog(Object.assign({}, client.getOption('windows.editor') || { center: true }, { title: '<i class="fas fa-edit"></i> Advanced editor', id: 'adv-editor' }));
            editorDialog.on('resized', e => {
                client.setOption('windows.editor', e);
            });
            editorDialog.on('moved', e => {
                client.setOption('windows.editor', e);
            })
            editorDialog.on('maximized', () => {
                client.setOption('windows.editor', editorDialog.windowState);
            });
            editorDialog.on('restored', () => {
                client.setOption('windows.editor', editorDialog.windowState);
            });
            editorDialog.on('shown', () => {
                client.setOption('windows.editor', editorDialog.windowState);
                editor.initialize();
            });
            editorDialog.on('closing', () => {
                editor.remove();
            });
            editorDialog.on('closed', () => {
                client.setOption('windows.editor', editorDialog.windowState);
                removeHash('editor');
            });
            editorDialog.on('canceling', () => {
                editor.remove();
            });
            editorDialog.on('canceled', () => {
                client.setOption('windows.editor', editorDialog.windowState);
                removeHash('editor');
            });
            editorDialog.on('focus', () => editor.focus());
            const textarea = document.createElement('textarea');
            textarea.classList.add('form-control', 'form-control-sm');
            textarea.id = 'adv-editor-txt';
            editorDialog.body.appendChild(textarea);
            editorDialog.body.style.overflow = 'hidden';
            if (!editor) editor = new AdvEditor(textarea, !client.getOption('simpleEditor'));
            editor.on('close', () => {
                editorDialog.close();
            });
            editor.on('editor-init', () => editor.focus());
            editor.on('click', () => editorDialog.focus());
            editorDialog.dialog.editor = editor;
            if (TINYMCE && tinymce)
                editorDialog.header.querySelector('#adv-editor-max').insertAdjacentHTML('afterend', '<button type="button" class="btn btn-light float-end" id="adv-editor-switch" title="Switch to advanced" style="padding: 0 4px;margin-top: -1px;"><i class="bi-shuffle"></i></button>');
            editorDialog.footer.innerHTML = `<button id="btn-adv-editor-clear" type="button" class="float-start btn btn-light" title="Clear editor">Clear</button>
                <button id="btn-adv-editor-append" type="button" class="float-start btn btn-light" title="Append file...">Append file...</button>
                <button id="btn-adv-editor-send" type="button" class="float-end btn btn-primary" title="Send">Send</button>`;
            if (!editor.isSimple)
                editorDialog.header.querySelector('#adv-editor-switch').title = 'Switch to simple';
            editorDialog.header.querySelector('#adv-editor-switch').addEventListener('click', () => {
                client.setOption('simpleEditor', !editor.simple);
                let value = '';
                if (!editor.isSimple)
                    value = editor.getFormattedText().replace(/(?:\r)/g, '');
                editor.simple = !editor.simple;
                if (!editor.isSimple) {
                    editorDialog.hideFooter();
                    editorDialog.header.querySelector('#adv-editor-switch').title = 'Switch to simple';
                }
                else {
                    editor.value = value;
                    editorDialog.showFooter();
                    editorDialog.header.querySelector('#adv-editor-switch').title = 'Switch to advanced';
                    setTimeout(() => editor.focus(), 100);
                }
            });
            document.getElementById('btn-adv-editor-append').addEventListener('click', () => {
                openFileDialog('Append file', false).then(files => {
                    readFile(files[0]).then((contents: any) => {
                        editor.insert(contents);
                    }).catch(client.error);
                }).catch(() => { });
            });
            document.getElementById('btn-adv-editor-send').addEventListener('click', () => {
                client.sendCommand(editor.value());
                if (client.getOption('editorClearOnSend'))
                    editor.clear();
                if (client.getOption('editorCloseOnSend'))
                    editorDialog.close();
            });
            document.getElementById('btn-adv-editor-clear').addEventListener('click', () => {
                editor.clear();
                editor.focus();
            });
            if (!editor.isSimple)
                editorDialog.hideFooter();
        }
        editorDialog.show();
        if (editor.isSimple)
            editor.focus();
    });
    //restore advanced editor
    options = client.getOption('windows.editor');
    if (options && options.show)
        document.getElementById('btn-adv-editor').click();

    document.getElementById('btn-command-history').addEventListener('show.bs.dropdown', function () {
        document.body.appendChild(document.getElementById('command-history-menu'));
    });
    document.getElementById('btn-command-history').addEventListener('hidden.bs.dropdown', function () {
        document.getElementById('btn-command-history').parentElement.appendChild(document.getElementById('command-history-menu'));
    });
    client.commandInput.removeEventListener('input', resizeCommandInput);
    client.commandInput.removeEventListener('change', resizeCommandInput);
    initCommandInput();
    updateCommandInput();
    if (client.getOption('commandAutoSize') || client.getOption('commandScrollbars'))
        resizeCommandInput();
    window.addEventListener('hashchange', hashChange, false);
    window.addEventListener('load', hashChange);
}

export function removeHash(string) {
    if (!string || string.length === 0) return;
    string = string.trim();
    if (string.startsWith('#'))
        string = string.substring(1);
    var hashes = decodeURI(window.location.hash.substring(1)).split(',').filter(s => s.trim() !== string);
    window.location.hash = hashes.join(',');
}

function hashChange() {
    if (!window.location.hash || window.location.hash.length < 2) return;
    var dialogs = decodeURI(window.location.hash.substring(1)).split(',').map(s => s.trim());
    for (let d = dialogs.length - 1; d >= 0; d--)
        switch (dialogs[d]) {
            case 'about':
                showDialog('about');
                break;
            case 'editor':
                document.getElementById('btn-adv-editor').click();
                break;
            default:
                if (dialogs[d].startsWith('settings'))
                    showDialog(dialogs[d]);
                break;
        }
}

let _dialogs: any = {};
export function showDialog(name: string) {
    switch (name) {
        case 'about':
            if (!_dialogs.about) {
                _dialogs.about = new Dialog(({ title: '<i class="bi-info-circle"></i> About', noFooter: true, resizable: false, center: true, maximizable: false }));
                _dialogs.about.on('closed', () => {
                    delete _dialogs.about;
                    removeHash(name);
                });
                _dialogs.about.on('canceled', () => {
                    delete _dialogs.about;
                    removeHash(name);
                });
            }
            loadDialog(_dialogs.about, name, 1, true).catch(e => {
                client.error(e);
            });
            return _dialogs.about;
    }
    if (name.startsWith('settings')) {
        if (!_dialogs.settings) {
            _dialogs.settings = new SettingsDialog();
            _dialogs.settings.on('closed', () => {
                delete _dialogs.settings;
                removeHash(name);
            });
            _dialogs.settings.on('canceled', () => {
                delete _dialogs.settings;
                removeHash(name);
            });
        }
        if (name === 'settings') {
            _dialogs.settings.dialog.dataset.path = name;
            _dialogs.settings.dialog.dataset.fullPath = name;
            _dialogs.settings.dialog.dataset.hash = window.location.hash;
            _dialogs.settings.setPage(name);
            _dialogs.settings.showModal();
        }
        else
            loadDialog(_dialogs.settings, name, 2, false).then(() => {
                _dialogs.settings.setPage(name);
            }).catch(e => {
                client.error(e);
            });
        return _dialogs.settings;
    }
}

export function loadDialog(dialog: Dialog, path, show?, showError?) {
    return new Promise((resolve, reject) => {
        var subpath = path.split('/');
        $.ajax({
            url: 'dialogs/' + subpath[0] + '.htm',
            cache: false,
            type: 'GET',
        })
            .done(function (data) {
                dialog.dialog.dataset.path = subpath[0];
                dialog.dialog.dataset.fullPath = path;
                dialog.dialog.dataset.hash = window.location.hash;
                dialog.body.innerHTML = data;
                const scripts: HTMLScriptElement[] = dialog.body.querySelectorAll('script');
                for (let s = 0, sl = scripts.length; s < sl; s++) {
                    /*jslint evil: true */
                    let script = new Function('body', 'client', 'dialog', scripts[s].textContent);
                    script.apply(client, [dialog.body, client, dialog]);
                }
                if (show == 1)
                    dialog.show();
                else if (show === 2)
                    dialog.showModal();
                resolve(data);
            })
            .fail(function (err) {
                if (showError && client.enableDebug)
                    dialog.body.innerHTML = `<h1 style="width: 100%;text-align:center">Error loading ${path}</h1> ${err.statusText}`;
                else if (showError)
                    dialog.body.innerHTML = `<h1 style="width: 100%;text-align:center">Error loading ${path}</h1>`;
                else
                    dialog.body.innerHTML = '';
                reject(path + ': ' + subpath.statusText);
            });
    });
}

function resizeCommandInput() {
    debounce(() => {
        _resizeCommandInput();
    }, 250, 'resizeCommand');
}

async function initCommandInput() {
    if (client.getOption('commandAutoSize') || client.getOption('commandScrollbars')) {
        client.commandInput.addEventListener('input', resizeCommandInput);
        client.commandInput.addEventListener('change', resizeCommandInput);
    }
    if (client.getOption('commandWordWrap')) {
        document.getElementById('commandMeasure').style.whiteSpace = 'pre-wrap';
        document.getElementById('commandMeasure').style.overflowWrap = 'anywhere';
    }
    else {
        document.getElementById('commandMeasure').style.whiteSpace = '';
        document.getElementById('commandMeasure').style.overflowWrap = '';
    }
    if (client.getOption('commandScrollbars')) {
        document.getElementById('commandMeasure').style.overflow = 'auto';
        client.commandInput.style.overflow = 'auto';
    }
    else {
        document.getElementById('commandMeasure').style.overflow = '';
        client.commandInput.style.overflow = '';
    }
}

let commandInputResize: any = {};
function updateCommandInput() {
    const measure = document.getElementById('commandMeasure');
    document.body.appendChild(measure);
    const cmd = client.commandInput.parentElement;
    const cmdSize = window.getComputedStyle(cmd);
    measure.style.fontSize = client.commandInput.style.fontSize;
    measure.style.fontFamily = client.commandInput.style.fontFamily;
    measure.style.width = client.commandInput.offsetWidth + 'px';
    const oldMeasure = measure.innerHTML;
    measure.innerHTML = 'W';
    let minHeight = client.getOption('commandMinLines');
    const height = measure.offsetHeight;
    minHeight = height * (minHeight < 1 ? 1 : minHeight);
    let padding = parseFloat(cmdSize.borderTopWidth) || 0;
    padding += parseFloat(cmdSize.borderBottomWidth) || 0;
    padding += parseFloat(cmdSize.paddingTop) || 0;
    padding += parseFloat(cmdSize.paddingBottom) || 0;
    let inset = cmdSize.inset.split(' ');
    padding += (parseFloat(inset[0]) || 0) * 2;
    measure.innerHTML = oldMeasure;
    cmd.style.height = (height + padding) + 'px';
    /*
    TODO need to rethink this logic and in _resizeCommandInput, as the current interface has 3 layers the nav group, then input group, then the input itself
    may need to walk the chain up til body or until it finds shared container with display and resize each one based on positions/paddings/margins
    */
    client.commandInput.parentElement.style.height = height + 'px';
    client.commandInput.closest('nav').style.height = height + 6 + 'px';
    client.display.container.style.bottom = (height + padding) + 'px';

    commandInputResize = {
        measure: measure,
        cmd: cmd,
        cmdSize: cmdSize,
        height: height,
        padding: padding,
        minHeight: minHeight
    }
}

function _resizeCommandInput() {
    const measure = commandInputResize.measure;
    const cmd = commandInputResize.cmd;
    measure.innerHTML = client.commandInput.value + '\n';
    let height = measure.offsetHeight;
    if (height < commandInputResize.minHeight)
        height = commandInputResize.minHeight;
    const padding = commandInputResize.padding;
    cmd.style.height = (height + padding) + 'px';
    client.commandInput.parentElement.style.height = height + 'px';
    client.commandInput.closest('nav').style.height = height + 6 + 'px';
    client.display.container.style.bottom = (height + padding) + 'px';
}
window.initializeInterface = initializeInterface;