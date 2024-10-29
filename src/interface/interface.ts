
import "../css/interface.css";
import { initMenu } from './menu';
import { Client } from '../client';
import { Dialog, DialogButtons } from "./dialog";
import { openFileDialog, readFile, debounce, copyText, getParameterByName } from '../library';
import { AdvEditor } from './adv.editor';
import { SettingsDialog } from './settingsdialog';
import { ProfilesDialog } from "./profilesdialog";

declare global {
    interface Window {
        initializeInterface;
    }
    let client: Client;
}
declare let confirm_box;

//cache the objects once made for later use
let editor: AdvEditor;
let editorDialog: Dialog;
let _currentIcon = -1;

export function initializeInterface() {
    let options;
    _setIcon(0);
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
        if (_dialogs.history) editorDialog.resetState(client.getOption('windows.history') || { center: true, width: 400, height: 275 });
    });
    client.on('set-title', title => {
        window.document.title = title;
    });
    client.on('connected', () => _setIcon(1));
    client.on('closed', () => _setIcon(0));
    client.on('received-data', () => {
        if (!client.active && client.connected)
            _setIcon(2);
    })
    client.on('focus', () => {
        if (client.connected)
            _setIcon(1);
        else
            _setIcon(0);
    })
    client.on('print', () => {
        if (!client.active && client.connected)
            _setIcon(2);
    });
    client.display.on('selection-done', e => {
        if (client.getOption('AutoCopySelectedToClipboard') && client.display.hasSelection) {
            copyText(client.display.selection);
            client.display.clearSelection();
        }
    });
    client.on('notify', (title, message, options) => {
        if (!client.getOption('enableNotifications')) return;
        options = options || { silent: true };
        if (!Object.prototype.hasOwnProperty.call(options, 'silent'))
            options.silent = true;
        switch (_currentIcon) {
            case 1:
                options.icon = options.icon || 'images/connected.png';
                break;
            case 2:
                options.icon = options.icon || 'images/active.png';
                break;
            default:
                options.icon = options.icon || 'images/disconnected.png';
                break;
        }
        if (message) {
            options.body = message;
            if (options.body.length > 127)
                options.body = options.body.substr(0, 127) + '...';
        }
        var notify = new window.Notification(title, options);
        notify.onclick = () => {
            client.emit('notify-clicked', title, message);
            client.raise('notify-clicked', [title, message]);
        };
        notify.onclose = () => {
            client.emit('notify-closed', title, message);
            client.raise('notify-closed', [title, message]);
        };
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
            editorDialog.footer.innerHTML = `<button id="btn-adv-editor-clear" type="button" class="btn-sm float-start btn btn-light" title="Clear editor"><i class="bi bi-journal-x"></i><span class="icon-only"> Clear</span></button>
                <button id="btn-adv-editor-append" type="button" class="btn-sm float-start btn btn-light" title="Append file..."><i class="bi bi-box-arrow-in-down"></i><span class="icon-only"> Append file...</span></button>
                <button id="btn-adv-editor-send" type="button" class="btn-sm float-end btn btn-primary" title="Send"><i class="bi bi-send-fill"></i><span class="icon-only"> Send</span></button>`;
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
    options = client.getOption('windows.history');
    if (options && options.show)
        showDialog('history');


    document.getElementById('btn-command-history').addEventListener('show.bs.dropdown', function () {
        document.body.appendChild(document.getElementById('command-history-menu'));
        let h = '';
        const menu = document.getElementById('command-history-menu');
        let history = client.commandHistory;
        for (let i = 0, il = history.length; i < il; i++)
            h += `<li id="command-history-item-${i}"><a data-index="${i}" class="dropdown-item" href="javascript:void(0)">${history[i]}</a></li>`;
        if (history.length) {
            h += '<li><hr class="dropdown-divider"></li>';
            h += `<li><a id="history-clear" class="dropdown-item" href="javascript:void(0)">Clear history</a></li>`;
        }
        h += `<li><a id="history-show" class="dropdown-item" href="javascript:void(0)">Show history window...</a></li>`;
        menu.innerHTML = h;
        if (history.length)
            menu.querySelector('#history-clear').addEventListener('click', () => {
                confirm_box('Clear history?', `Clear all history`).then(e => {
                    if (e.button === DialogButtons.Yes) {
                        client.clearCommandHistory()
                    }
                });
            });
        menu.querySelector('#history-show').addEventListener('click', () => showDialog('history'));
        const items = document.querySelectorAll('[id^="command-history-item"] a');
        for (let i = 0, il = items.length; i < il; i++) {
            items[i].addEventListener('click', e => {
                var cmd = client.commandHistory[parseInt((e.currentTarget as HTMLElement).dataset.index, 10)];
                client.AddCommandToHistory(cmd);
                client.sendCommand(cmd, null, client.getOption('allowCommentsFromCommand'));
            });
        }
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

    client.on('command-history-changed', history => {
        _loadHistory();
    });
}

export function removeHash(string) {
    if (!string || string.length === 0) return;
    string = string.trim();
    if (string.startsWith('#'))
        string = string.substring(1);
    var hashes = decodeURI(window.location.hash.substring(1)).split(',').filter(s => s.trim() !== string);
    window.location.hash = hashes.join(',');
}

export function addHash(string) {
    if (!string || string.length === 0) return;
    string = string.trim();
    if (string.startsWith('#'))
        string = string.substring(1);
    var hashes = decodeURI(window.location.hash.substring(1)).split(',').filter(s => s.trim() !== string);
    hashes.push(string);
    window.location.hash = hashes.join(',');
}

export function updateHash(add: string | string[], remove?: string | string[]) {
    if (!Array.isArray(add))
        add = [add];
    remove = remove || [];
    if (!Array.isArray(remove))
        remove = [remove];
    //remove add, new to ensure no dups
    remove = remove.concat(...add);
    var hashes = decodeURI(window.location.hash.substring(1)).split(',').filter(s => !remove.includes(s.trim()));
    hashes = hashes.concat(...add);
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
                if (dialogs[d] === 'history' || dialogs[d].startsWith('settings') || dialogs[d].startsWith('profiles'))
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
        case 'history':
            if (!_dialogs.history) {
                _dialogs.history = new Dialog(Object.assign({}, client.getOption('windows.history') || { center: true, width: 400, height: 275 }, { title: '<i class="bi bi-clock-history"></i> Command history', id: 'command-history' }));
                _dialogs.history.on('closed', () => {
                    client.setOption('windows.history', _dialogs.history.windowState);
                    delete _dialogs.history;
                    removeHash(name);
                });
                _dialogs.history.on('canceled', () => {
                    client.setOption('windows.history', _dialogs.history.windowState);
                    removeHash('history');                    
                    delete _dialogs.history;
                    removeHash(name);
                });
                _dialogs.history.on('resized', e => {
                    client.setOption('windows.history', e);
                });
                _dialogs.history.on('moved', e => {
                    client.setOption('windows.history', e);
                })
                _dialogs.history.on('maximized', () => {
                    client.setOption('windows.history', _dialogs.history.windowState);
                });
                _dialogs.history.on('restored', () => {
                    client.setOption('windows.history', _dialogs.history.windowState);
                });
                _dialogs.history.on('shown', () => {
                    client.setOption('windows.history', _dialogs.history.windowState);
                });
                let footer = '';
                footer += `<button id="${_dialogs.history.id}-clear" type="button" class="btn-sm float-end btn btn-danger" title="Clear history"><i class="bi bi-trash"></i><span class="icon-only"> Clear</span></button>`;
                footer += `<button id="${_dialogs.history.id}-send" type="button" class="btn-sm float-end btn btn-primary" title="Send"><i class="bi bi-send-fill"></i><span class="icon-only"> Send</span></button>`;
                footer += `<button id="${_dialogs.history.id}-refresh" type="button" class="btn-sm float-start btn btn-light" title="Refresh"><i class="bi bi-arrow-repeat"></i><span class="icon-only"> Refresh</span></button>`
                _dialogs.history.footer.innerHTML = footer;
                _dialogs.history.body.innerHTML = `<select id="history-list" multiple="multiple" class="form-control"></select>`;

                _dialogs.history.body.querySelector('#history-list').addEventListener('dblclick', e => {
                    const cmd = e.currentTarget.value;
                    client.AddCommandToHistory(cmd);
                    client.sendCommand(cmd, false, client.getOption('allowCommentsFromCommand'));
                    _dialogs.history.close();
                });
                _dialogs.history.body.querySelector('#history-list').addEventListener('change', e => {
                    client.setHistoryIndex(e.currentTarget.selectedIndex);
                    _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-send`).style.display = history.length && _dialogs.history.body.querySelector('#history-list').selectedIndex !== -1 ? '' : 'none';
                });

                _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-refresh`).addEventListener('click', () => _loadHistory())
                _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-send`).addEventListener('click', () => {
                    const list = _dialogs.history.body.querySelector('#history-list');
                    let cmds = []
                    for (let l = 0, ll = list.options.length; l < ll; l++) {
                        if (list.options[l].selected) {
                            cmds.push(list.options[l].value);
                        }
                    }
                    for (let c = 0, cl = cmds.length; c < cl; c++) {
                        client.AddCommandToHistory(cmds[c]);
                        client.sendCommand(cmds[c], false, client.getOption('allowCommentsFromCommand'));
                    }
                });
                _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-clear`).addEventListener('click', () => {
                    confirm_box('Clear history?', `Clear all history`).then(e => {
                        if (e.button === DialogButtons.Yes) {
                            client.clearCommandHistory();
                        }
                    });
                });
            }
            _loadHistory();
            _dialogs.history.show();
            return _dialogs.history;
    }
    if (name.startsWith('settings')) {
        if (!_dialogs.settings) {
            _dialogs.settings = new SettingsDialog();
            _dialogs.settings.on('closed', () => {
                delete _dialogs.settings;
            });
            _dialogs.settings.on('canceled', () => {
                delete _dialogs.settings;
            });
        }
        if (name === 'settings') {
            _dialogs.settings.dialog.dataset.path = name;
            _dialogs.settings.dialog.dataset.fullPath = name;
            _dialogs.settings.dialog.dataset.hash = window.location.hash;
            _dialogs.settings.setBody('', { client: client });
            _dialogs.settings.showModal();
        }
        else
            loadDialog(_dialogs.settings, name, 2, false).catch(e => {
                client.error(e);
            });
        return _dialogs.settings;
    }
    if (name.startsWith('profiles')) {
        if (!_dialogs.profiles) {
            _dialogs.profiles = new ProfilesDialog();
            _dialogs.profiles.on('closed', () => {
                delete _dialogs.profiles;
            });
            _dialogs.profiles.on('canceled', () => {
                delete _dialogs.profiles;
            });
        }
        _dialogs.profiles.dialog.dataset.path = name;
        _dialogs.profiles.dialog.dataset.fullPath = name;
        _dialogs.profiles.dialog.dataset.hash = window.location.hash;
        _dialogs.profiles.setBody('', { client: client });
        _dialogs.profiles.show();
        return _dialogs.profiles;
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
                dialog.setBody(data, { client: client });
                if (show == 1)
                    dialog.show();
                else if (show === 2)
                    dialog.showModal();
                resolve(data);
            })
            .fail(function (err) {
                if (showError && client.enableDebug)
                    dialog.setBody(`<h1 style="width: 100%;text-align:center">Error loading ${path}</h1> ${err.statusText}`);
                else if (showError)
                    dialog.setBody(`<h1 style="width: 100%;text-align:center">Error loading ${path}</h1>`);
                else
                    dialog.setBody('');
                reject(path + ': ' + subpath.statusText);
            });
    });
}

function _loadHistory() {
    if (!_dialogs.history) return;
    const list: HTMLSelectElement = document.getElementById('history-list') as HTMLSelectElement;
    list.innerHTML = '';
    let history = client.commandHistory;
    var fragment = document.createDocumentFragment();
    for (var i = 0, l = history.length; i < l; i++) {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(history[i]));
        opt.value = history[i];
        fragment.append(opt);
    }
    list.appendChild(fragment);
    _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-clear`).style.display = history.length ? '' : 'none';
    _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-send`).style.display = history.length && list.selectedIndex !== -1 ? '' : 'none';
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

// eslint-disable-next-line no-unused-vars
function _setIcon(ico) {
    if (_currentIcon === ico)
        return;
    _currentIcon = ico;
    let icon = 'disconnected';
    switch (ico) {
        case 1:
            icon = 'connected';
            break;
        case 2:
            icon = 'active';
            break;
    }
    document.getElementById('icon1').remove();
    document.getElementById('icon2').remove();
    document.getElementById('icon3').remove();
    document.querySelector('head').insertAdjacentHTML('afterbegin', `<link id="icon1" rel="shortcut icon" href="images/${icon}.ico" />
        <link id="icon2" rel="icon" href="images/${icon}.ico" />
        <link id="icon3" rel="icon" type="image/x-icon" href="images/${icon}.png" />`);
}

window.initializeInterface = initializeInterface;