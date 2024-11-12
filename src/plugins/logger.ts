import "../css/logger.css";
import { Plugin } from '../plugin';
import { MenuItem } from '../types';
import { Dialog, DialogButtons } from '../interface/dialog';
import { Splitter, Orientation, PanelAnchor } from "../interface/splitter";
import { removeHash, updateHash } from "../interface/interface";
import { capitalize, scrollChildIntoView } from '../library';
import { buildBreadcrumb } from "../interface/breadcrumb";

declare let localforage;
declare let confirm_box;
declare let fileSaveAs;

// @ts-ignore
import workerSrc from 'inline-worker:./logger.worker.ts';
// @ts-ignore
import logHeader from '../html/log.header.html';

export enum Log {
    None = 0,
    Html = 1,
    Text = 2,
    Raw = 4
}

export interface LogOptions {
    path?: string;
    offline?: boolean;
    gagged?: boolean;
    enabled?: boolean;
    unique?: boolean;
    prepend?: boolean;
    name?: string;
    what?: Log;
    debug?: boolean;
}

export class Logger extends Plugin {
    private _logger;
    private _manager: LogManager

    public remove(): void {
        this.client.removeListenersFromCaller(this);
    }
    public initialize(): void {
        if (this.client.getOption('logEnabled'))
            this._createLogger();
        this.client.on('cleared', () => {
            this._post({ action: 'flush', args: true });
        }, this);
        this.client.on('connecting', () => {
            this._post({ action: 'connected', args: this.client.connected });
            this._post({
                action: 'start', args: {
                    lines: this.client.display.lines,
                    fragment: this.client.display.EndOfLine || this.client.telnet.prompt
                }
            });
        }, this);
        this.client.on('add-line-done', async data => {
            if (this.client.getOption('logEnabled'))
                this._post({ action: 'add-line', args: data });
        }, this);
        this.client.on('set-title', (title, lag) => {
            this._post({ action: 'name', args: $character });
        }, this);
        this.client.on('options-loaded', () => {
            this._updateMenuItem(this.client.getOption('logEnabled'));
            if (this.client.getOption('logEnabled'))
                this._createLogger();
            else
                this._loadLoggerOptions();
        }, this);
        this.client.on('closed', () => {
            this._post({ action: 'connected', args: client.connected });
            this._post({ action: 'stop' });
        }, this);
        this.client.on('reconnect', () => {
            if (this.client.connected) return;
            this._post({ action: 'connected', args: client.connected });
            this._post({ action: 'stop' });
        }, this);
        client.on('window', (window, args, name) => {
            let pages = window.split('/');
            if (!pages.length) return;
            switch (pages[0]) {
                case 'log-viewer':
                case 'logs':
                case 'log.viewer':
                    if (args === 'close') {
                        if (this._manager)
                            this._manager.close();
                        removeHash('logs');
                    }
                    else {
                        if (!this._manager)
                            this._manager = new LogManager();
                        this._manager.dialog.dataset.path = window;
                        this._manager.show();
                        this._manager.setBody(window);
                        //updateHash('logs');
                    }
                    break;
            }
        });
        this._post({ action: 'name', args: $character || '' });
        window.addEventListener('beforeunload', () => {
            this._post({ action: 'flush' });
        });
    }
    get menu(): MenuItem[] {
        return [{
            name: 'Enable logging',
            icon: '<i class="far fa-file-alt"></i>',
            position: '#menu-connect',
            active: this.client.getOption('logEnabled'),
            action: () => {
                if (!client.getOption('logEnabled'))
                    this._createLogger();
                this._post({ action: 'toggle' });
            }
        },
        {
            name: 'Manage logs',
            icon: '<i class="fas fa-list"></i>',
            position: '#menu-profiles',
            action: () => {
                if (!this._manager)
                    this._manager = new LogManager();
                //this._manager.show();
                updateHash('logs');
            }
        }];
    }
    get settings(): MenuItem[] {
        return [{
            name: ' Logging',
            action: 'settings-logging',
            icon: '<i class="far fa-file-alt"></i>',
            position: 2
        }]
    }

    private _post(data) {
        if (!this._logger) return;
        this._logger.postMessage(data);
    }

    private _createLogger() {
        if (this._logger) return;
        this._logger = new Worker(workerSrc);
        this._logger.addEventListener('message', e => {
            switch (e.data.event) {
                case 'started':
                    this._updateMenuItem(true);
                    break;
                case 'stopped':
                    this._updateMenuItem(false);
                    this._post({ action: 'flush' });
                    this._logger.terminate();
                    this._logger = null;
                    break;
                case 'logging':
                    break;
                case 'error':
                    this.client.error(e.data.args);
                    break;
                case 'debug':
                    if (!this.client)
                        console.log(e.data.args);
                    else if (this.client.getOption('enableDebug'))
                        this.client.debug(e.data.args);
                    break;
                case 'toggled':
                    if (this.client)
                        this.client.setOption('logEnabled', e.data.args);
                    this._updateMenuItem(e.data.args);
                    if (!e.data.args) {
                        this._post({ action: 'flush' });
                        this._logger.terminate();
                        this._logger = null;
                    }
                    break;
                case 'startInternal':
                case 'start':
                    this._post({ action: e.data.event, args: { lines: this.client.display.lines || [], fragment: this.client.display.EndOfLine || this.client.telnet.prompt } });
                    break;
                case 'write':
                    this._updateKey(e.data)
                    localforage.getItem('OoMUDLog' + e.data.file).then(value => {
                        if (!value) value = '';
                        value += e.data.data;
                        localforage.setItem('OoMUDLog' + e.data.file, value).then(() => {
                            if (this._manager) this._manager.logChanged(e.data.file, e.data.data);
                            this._post({ action: 'write-done', file: e.data.file });
                        });
                    });
                    break;
            }
        });
        this._logger.addEventListener('error', e => {
            if (!this.client)
                console.error(e);
            else
                this.client.error(e);
        });
        this._loadLoggerOptions();
    }

    private _keyQueue = [];
    private _keyPromise;
    private _updateKey(data) {
        this._keyQueue.push(data);
        if (this._keyPromise) return;
        this._keyPromise = localforage.getItem('OoMUDLogKeys').then(value => {
            if (!this._keyQueue.length) return;
            var _keys;
            if (!value)
                _keys = {};
            else
                _keys = value;
            this._keyQueue.forEach(key => {
                _keys[key.file] = { character: key.character, timeStamp: key.timeStamp };
            });
            this._keyQueue = [];
            this._keyPromise = null;
            localforage.setItem('OoMUDLogKeys', _keys);
        });
    }

    private _loadLoggerOptions() {
        this._post({
            action: 'options', args: {
                offline: this.client.getOption('logOffline'),
                gagged: this.client.getOption('logGagged'),
                enabled: this.client.getOption('logEnabled'),
                unique: this.client.getOption('logUniqueOnConnect'),
                prepend: this.client.getOption('logPrepend'),
                what: this.client.getOption('logWhat'),
                debug: this.client.getOption('enableDebug'),
                format: this.client.getOption('logTimeFormat'),
                colors: this.client.getOption('colors'),
                timestamp: this.client.getOption('logTimestamp'),
                timestampFormat: this.client.getOption('logTimestampFormat')
            }
        });
    }

    private _updateMenuItem(state) {
        const button = document.querySelector('#menu-enable-logging') as HTMLElement;
        if (state) {
            button.title = 'Disable logging';
            button.classList.add('active');
            document.querySelector('#menu-enable-logging a span').textContent = 'Disable logging';
        }
        else {
            button.title = 'Enable logging';
            button.classList.remove('active');
            document.querySelector('#menu-enable-logging a span').textContent = 'Enable logging';
        }
    }
}

class LogManager extends Dialog {
    private _menu;
    private _contents;
    private _splitter;
    private _page = 'logs';
    private _logs;
    private _current;

    constructor() {
        super(Object.assign({}, client.getOption('windows.log-viewer') || { center: true }, { title: '<i class="fas fa-list"></i> Log viewer', minWidth: 410 }));
        this.on('resized', e => {
            client.setOption('windows.log-viewer', e);
        });
        this.on('closed', () => {
            client.setOption('windows.log-viewer', this.windowState);
            removeHash(this._page);
        });
        this.on('canceled', () => {
            client.setOption('windows.log-viewer', this.windowState);
            removeHash(this._page);
        });
        this.on('moved', e => {
            client.setOption('windows.log-viewer', e);
        })
        this.on('maximized', () => {
            client.setOption('windows.log-viewer', this.windowState);
        });
        this.on('restored', () => {
            client.setOption('windows.log-viewer', this.windowState);
        });
        this.on('shown', () => {
            client.setOption('windows.log-viewer', this.windowState);
        });
        this.body.style.padding = '10px';
        this._splitter = new Splitter({ id: 'log-viewer', parent: this.body, orientation: Orientation.vertical, anchor: PanelAnchor.panel1 });
        if (client.getOption('logger.split') >= 200)
            this._splitter.SplitterDistance = client.getOption('logger.split');
        this._splitter.on('splitter-moved', distance => {
            client.setOption('logger.split', distance);
        });
        this._menu = this._splitter.panel1;
        this._menu.style.overflow = 'hidden';
        this._menu.style.overflowY = 'auto';
        this._contents = document.createElement('iframe');
        this._contents.classList.add('viewer');
        this._splitter.panel2.append(this._contents);
        this._splitter.panel2.style.overflow = 'auto';
        this._splitter.panel2.style.padding = '0';
        this._splitter.panel2.style.paddingLeft = '4px';

        this._buildMenu();
        let footer = '';
        footer += `<button id="${this.id}-back" type="button" class="btn-sm float-start btn btn-light" title="Go back"><i class="bi bi-arrow-left"></i><span class="icon-only"> Back</span></button>`;
        footer += `<button id="${this.id}-refresh" type="button" class="btn-sm float-start btn btn-light" title="Go back"><i class="bi bi-arrow-repeat"></i></i><span class="icon-only"> Refresh</span></button>`;
        footer += '<div class="vr float-start" style="margin-right: 4px;height: 29px;"></div>';
        footer += '<span id="logs-page-buttons"></span>';
        footer += `<button id="${this.id}-cancel" type="button" class="btn-sm float-end btn btn-light" title="Close dialog"><i class="bi bi-x-lg"></i><span class="icon-only"> Close</span></button>`;
        this.footer.innerHTML = footer;
        this.footer.classList.add('dropup');
        this.footer.querySelector(`#${this.id}-cancel`).addEventListener('click', () => {
            removeHash(this._page);
            this.close();
        });
        this.footer.querySelector(`#${this.id}-refresh`).addEventListener('click', () => {
            this._buildMenu(true).then(() => {
                const item = this._menu.querySelector(`a[href="#logs/${this._current}"]`);
                if (item) {
                    item.classList.add('active');
                    scrollChildIntoView(this._menu, item);
                }
            });
            this.setBody('');
        });
        this.footer.querySelector(`#${this.id}-back`).addEventListener('click', () => {
            this._goBack();
        });
        this.dialog.dataset.path = 'logs';
        this.setBody('');
    }

    public setBody(contents: string, args?: any) {
        if (!this._logs) {
            setTimeout(() => {
                this.setBody(contents, args);
            });
            return;
        }
        this._page = this.dialog.dataset.path;
        if (this._page === 'logs')
            this.dialog.dataset.panel = 'left';
        else
            this.dialog.dataset.panel = 'right';
        const pages = this._page.split('/');
        this._current = pages[pages.length - 1];
        this.title = buildBreadcrumb(pages, false, '/', (item, index, last) => {
            if (index === last) {
                if (this._logs[item] && !item.endsWith('.txt') && !item.endsWith('.raw') && !item.endsWith('.htm'))
                    return `${formatDate(item)}${this._logs[item].character ? ', ' + this._logs[item].character : ''}>`;
                else if (this._logs[item] && this._logs[item].timeStamp)
                    return `${formatDate(this._logs[item].timeStamp)}${this._logs[item].character ? ', ' + this._logs[item].character : ''}, ${item.substring(item.length - 3, item.length)}`;
            }
            return capitalize(item);
        })
        let items = this._menu.querySelectorAll('a.active');
        items.forEach(item => item.classList.remove('active'));
        items = this._menu.querySelector(`a[href="#logs/${this._current}"]`);
        if (items)
            items.classList.add('active');

        if (pages.length < 2) {
            this._setContents('');
            this._splitter.panel2Collapsed = true;
            this.footer.querySelector(`#${this.id}-back`).style.display = 'none';
            this.footer.querySelector('#logs-page-buttons').innerHTML = `<button id="${this.id}-clear" type="button" class="btn-sm btn btn-danger" title="Clear logs"><i class="bi bi-trash"></i><span class="icon-only"> Clear</span></button>`;
            this.footer.querySelector(`#${this.id}-clear`).addEventListener('click', () => {
                confirm_box('Clear logs?', 'Remove all logs?').then(e => {
                    if (e.button === DialogButtons.Yes) {
                        var logs = Object.keys(this._logs);
                        for (var r = 0, rl = logs.length; r < rl; r++) {
                            localforage.removeItem('OoMUDLog' + logs[r]);
                        }
                        localforage.removeItem('OoMUDLogKeys').then(() => {
                            this._buildMenu();
                            this.setBody('');
                        });
                    }
                });
            });
            let clear = this.footer.querySelector(`#${this.id}-clear`);
            if (clear) clear.style.display = Object.keys(this._logs).length ? '' : 'none';
            (document.getElementById('logs-page-buttons').previousSibling as HTMLElement).style.display = Object.keys(this._logs).length ? '' : 'none';
        }
        else {
            //this._setContents('<html><head><link href="oiMUD.min.css" rel="stylesheet" type="text/css"></head><body style="background: white"><div class="loader"><div class="text">Loading... <div class="indicator"></div></div></div></body></html>');
            localforage.getItem('OoMUDLog' + pages[1]).then(value => {
                if (!pages[1].endsWith('.txt') && !pages[1].endsWith('.raw'))
                    this._setContents(logHeader + (value || '').replace(/\n/g, ''));
                else
                    this._setContents('<style>body {font-family: \'Courier New\', Courier, monospace;text-align: left;font-size: 1em;white-space: pre;background-color: white;}</style>' + (value || ''));
            });
            this.footer.querySelector(`#${this.id}-back`).style.display = '';
            this._splitter.panel2Collapsed = false;
            let b = `<button id="${this.id}-export" type="button" class="btn-sm float-start btn btn-light" title="Export log"><i class="bi bi-box-arrow-up"></i><span class="icon-only"> Export</span></button>`;
            b += `<button id="${this.id}-remove" type="button" class="btn-sm btn btn-danger" title="Remove log"><i class="bi bi-trash"></i><span class="icon-only"> Remove</span></button>`;
            this.footer.querySelector('#logs-page-buttons').innerHTML = b;
            this.footer.querySelector(`#${this.id}-remove`).addEventListener('click', (e: MouseEvent) => {
                this._removeLog(this._current);
            });
            this.footer.querySelector(`#${this.id}-export`).addEventListener('click', (e: MouseEvent) => {
                this._exportLog(this._current);
            });
        }

    }

    private _setContents(contents) {
        this._contents.contentWindow.document.open();
        this._contents.contentWindow.document.write(contents);
        this._contents.contentWindow.document.close();
        this._contents.contentWindow.document.body.scrollTop = 0;
        this._contents.contentWindow.document.body.scrollLeft = 0;
        this.emit('content-changed');
    }

    private _appendContents(contents, html?) {
        if (html)
            this._contents.contentWindow.document.body.insertAdjacentHTML('beforeend', contents);
        else
            this._contents.contentWindow.document.body.insertAdjacentText('beforeend', contents);
    }

    private _goBack() {
        const pages = this._page.split('/');
        if (pages.length === 5)
            updateHash(pages.slice(0, pages.length - 2).join('/'), this._page);
        else
            updateHash(pages.slice(0, pages.length - 1).join('/'), this._page);
    }

    private _buildMenu(noLoader?) {
        return new Promise((resolve, reject) => {
            if (!noLoader)
                this._menu.innerHTML = '<div class="loader"><div class="text">Loading... <div class="indicator"></div></div></div>'
            localforage.getItem('OoMUDLogKeys').then(logs => {
                this._logs = logs || {};
                const keys = Object.keys(this._logs);
                keys.sort();
                if (keys.length === 0)
                    this._menu.innerHTML = '<h1 id="empty" style="width: 100%;text-align:center">No logs.</h1>';
                else {
                    let p = '';
                    for (let k = 0, kl = keys.length; k < kl; k++) {
                        let icon = 'code';
                        if (keys[k].endsWith('.txt'))
                            icon = 'text';
                        else if (keys[k].endsWith('.raw'))
                            icon = 'binary';
                        let title = keys[k];
                        if (!keys[k].endsWith('.txt') && !keys[k].endsWith('.raw') && !keys[k].endsWith('.htm'))
                            title = `${formatDate(keys[k])}${this._logs[keys[k]].character ? ', ' + this._logs[keys[k]].character : ''}`;
                        else if (this._logs[keys[k]].timeStamp)
                            title = `${formatDate(this._logs[keys[k]].timeStamp)}${this._logs[keys[k]].character ? ', ' + this._logs[keys[k]].character : ''}, ${keys[k].substring(keys[k].length - 3, keys[k].length)}`;
                        p += `<a id="${keys[k]}" href="#logs/${encodeURIComponent(keys[k])}" class="list-group-item list-group-item-action" title="${title}"><span class="list-badge-button badge text-bg-danger" data-key="${keys[k]}" data-type="delete" title="Remove log"><i class="bi bi-trash"></i></span><span class="me-1 list-badge-button badge text-bg-secondary" data-key="${keys[k]}" data-type="export" title="Export log"><i class="bi bi-box-arrow-up"></i></span><i class="bi bi-file-${icon}"></i>${title}</a>`;
                    }
                    this._menu.innerHTML = '<div class="list-group" id="logs-menu">' + p + '</div>';
                    this._menu.querySelectorAll('[data-type="delete"').forEach(item => {
                        item.addEventListener('click', e => {
                            this._removeLog(e.currentTarget.dataset.key);
                            e.stopPropagation();
                            e.cancelBubble = true;
                            e.preventDefault();
                        });
                    });
                    this._menu.querySelectorAll('[data-type="export"').forEach(item => {
                        item.addEventListener('click', e => {
                            this._exportLog(e.currentTarget.dataset.key);
                            e.stopPropagation();
                            e.cancelBubble = true;
                            e.preventDefault();
                        });
                    });
                }
                resolve('');
            });
        });
    }

    public async logChanged(log, value) {
        if (!this._logs || !this._logs[log]) {
            await this._buildMenu();
            const item = this._menu.querySelector(`a[href="#logs/${this._current}"]`);
            if (item) {
                item.classList.add('active');
                scrollChildIntoView(this._menu, item);
            }
            let clear = this.footer.querySelector(`#${this.id}-clear`);
            if (clear) clear.style.display = '';
            (document.getElementById('logs-page-buttons').previousSibling as HTMLElement).style.display = '';
        }
        if (this._current === log) {
            if (!log.endsWith('.txt') && !log.endsWith('.raw'))
                this._appendContents((value || '').replace(/\n/g, ''), true);
            else
                this._appendContents(value || '');
        }
    }

    private _removeLog(log) {
        confirm_box('Remove log', 'Remove log?').then(e => {
            if (e.button === DialogButtons.Yes) {
                localforage.removeItem('OoMUDLog' + log);
                delete this._logs[log];
                localforage.setItem('OoMUDLogKeys', this._logs);
                document.getElementById(log).remove();
                if (this._page !== 'logs')
                    this._goBack();
            }
        })
    }

    private _exportLog(log) {
        localforage.getItem('OoMUDLog' + log).then(value => {
            if (log.endsWith('.htm'))
                fileSaveAs.show(logHeader + (value || ''), `oiMUD.${log}l`, 'text/html');
            else if (log.endsWith('.raw'))
                fileSaveAs.show(value || '', `oiMUD.${log}.txt`, 'text/plain');
            else if (log.endsWith('.txt'))
                fileSaveAs.show(value || '', `oiMUD.${log}`, 'text/plain');
            else
                fileSaveAs.show(value || '', `oiMUD.${log}.html`, 'text/plain');
        });

    }
}

function formatDate(date) {
    if (typeof date === 'string')
        date = parseInt(date, 10);
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
}