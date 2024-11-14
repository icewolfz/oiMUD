import "../css/chat.css";
import { Plugin } from '../plugin';
import { MenuItem } from '../types';
import { Dialog } from '../interface/dialog';
import { removeHash } from '../interface/interface';
import { Display } from '../display';
import { Logger } from './logger';
import { debounce } from '../library';

declare let localforage;

export enum chatType {
    none = 0,
    window = 1 << 0,
    dialog = 1 << 1,
}

export class Chat extends Plugin {
    private _capture = 0;
    private _captureReview = 0;
    private _captures = [];
    private _captureReviews = [];
    private _noCapture = false;
    private _noCaptureStore = 0;
    private _dialog: Dialog;
    private _window: WindowProxy;
    private _logger: Worker;
    private _loggerPlugin: Logger;

    private _unload = () => {
        let state = this._getWindowState();
        if (this._window && !this._window.closed) {
            this._window.close();
            state.show = true;
        }
        else
            state.show = false;
        this.client.setOption('windows.chatWindow', state);
    }

    public remove(): void {
        this.client.removeListenersFromCaller(this);
        delete (<any>this.client).sendChat
        window.removeEventListener('beforeunload', this._unload);
    }
    public initialize(): void {
        (<any>this.client).sendChat = data => { this.updateChat(this.client.parseInline(data)) };
        (<any>this.client).sendChatRaw = data => { this.updateChat(data) };
        window.addEventListener('beforeunload', this._unload);
        this.client.on('function', data => {
            if (!data) return;
            let args = data.args;
            switch (data.name.toLowerCase()) {
                //spell-checker:ignore chatprompt chatp
                case 'chatprompt':
                case 'chatp':
                    if ((this.client.getOption('echo') & 4) === 4)
                        this.client.echo(data.raw, -3, -4, true, true);
                    args = this.client.parseInline(args.join(' '));
                    this.updateChat(args);
                    data.handled = true;
                    break;
                case 'chat':
                case 'ch':
                    if ((this.client.getOption('echo') & 4) === 4)
                        this.client.echo(data.raw, -3, -4, true, true);
                    args = this.client.parseInline(args.join(' ') + '\n');
                    this.updateChat(args);
                    data.handled = true;
                    break;
            }
        }, this);
        this.client.on('add-line', data => {
            var res, c, cl;
            if (!data || typeof data.raw == 'undefined' || data.raw === null)
                return;
            if (data.fragment || this._captures.length === 0) return;
            //custom capture to ignore who list
            res = /^(-*)\s*\[ (.*) matching (users|user) \]\s*(-*)$/.exec(data.raw);
            if (res && res.length > 0) {
                this._capture = 0;
                this._noCapture = true;
                return;
            }
            //end capture blocking for who list
            res = /^(-*)\s*\[ .* \]\s*(-*)$/.exec(data.raw);
            if (this._noCapture && res && res.length > 0) {
                this._capture = 0;
                this._noCapture = false;
                return;
            }

            if (data.raw === 'Describers:' ||
                data.raw === 'You supply a list of nouns so when your object is complete it can correctly build an id list to allow you to properly interact with it.' ||
                data.raw === 'You supply a list of adjectives so when your object is complete it can correctly build an id list to allow you to properly interact with it.' ||
                data.raw === 'Available sizes:' ||
                data.raw === 'Available locations:' ||
                data.raw === 'Available tattoos:' ||
                data.raw === 'Available colors:'
            ) {
                this._capture = 0;
                this._noCapture = true;
                return;
            }

            if (this._noCapture && (
                data.raw.indexOf('Current name: ') === 0 ||
                data.raw.indexOf('Enter up to 2 nouns, [#] to remove, \'f\' to finish, \'q\' to quit:') === 0 ||
                data.raw.indexOf('Enter up to 3 adjectives, \'f\' to finish, \'q\' to quit:') === 0 ||
                data.raw.indexOf('Enter selection ') === 0
            )) {
                this._capture = 0;
                this._noCapture = false;
                return;
            }

            //locker/store list start
            res = /^ {2}# {2}Item.*$/.exec(data.raw);
            if (this._noCaptureStore === 0 && res && res.length > 0) {
                this._capture = 0;
                this._noCaptureStore = 1;
                return;
            }
            //locker/store list end
            res = /^(-*)$/.exec(data.raw);
            if (this._noCaptureStore > 0 && res && res.length > 0) {
                this._capture = 0;
                this._noCaptureStore++;
            }
            if (this._noCaptureStore > 2) {
                this._capture = 0;
                this._noCaptureStore = 0;
            }

            if (this._noCapture || this._noCaptureStore > 0) return;

            if (this.client.getOption('chat.CaptureOnlyOpen')) {
                if (!((this._window && !this._window.closed) || (this._dialog && !this._dialog.opened))) {
                    return;
                }
            }

            //capture indented text
            if (this._capture > 0 && data.raw.startsWith('    ')) {
                data.gagged |= this.client.getOption('chat.gag');
                this.updateChat(data);
                return;
            }
            //search capture review blocks
            for (c = 0, cl = this._captureReviews.length; c < cl; c++) {
                //re = new RegExp(_captureReviews[c], 'g');
                res = this._captureReviews[c].exec(data.raw);
                if (!res || res.length === 0)
                    continue;
                this._captureReview = 1;
                data.gagged |= this.client.getOption('chat.gag');
                this.updateChat(data);
                return;
            }
            //if in a review capture until end review
            if (this._captureReview > 0) {
                data.gagged |= this.client.getOption('chat.gag');
                this.updateChat(data);
                if (data.raw == '-=-=- End Review -=-=-')
                    this._captureReview = -1;
                /*
                res = /^-=-=- End Review -=-=-$/.exec(data.raw);
                if (res && res.length > 0)
                    captureReview = -1;
                */
                return;
            }
            //review requires 1 extra capture to get the current date/time
            if (this._captureReview === -1) {
                data.gagged |= this.client.getOption('chat.gag');
                this.updateChat(data);
                this._captureReview = 0;
                return;
            }

            //capture lines based on matching regex's
            for (c = 0, cl = this._captures.length; c < cl; c++) {
                //re = new RegExp(_captures[c], 'g');
                res = this._captures[c].exec(data.raw);
                if (!res || res.length === 0)
                    continue;
                if (this._capture > 0)
                    this._capture--;
                this._capture++;
                data.gagged |= this.client.getOption('chat.gag');
                this.updateChat(data);
                return;
            }
            //no matching capture so if in capture mode reduce
            if (this._capture > 0)
                this._capture--;
        }, this);
        this.client.on('window', (window, args, name) => {
            switch (window) {
                case 'chat-dialog':
                case 'chatdialog':
                case 'chat':
                    if (args === 'close') {
                        if (this._dialog)
                            this._dialog.close();
                        removeHash('chat');
                    }
                    else
                        this.showDialog();
                    break;
                case 'chatwin':
                case 'chatwindow':
                case 'chat-win':
                case 'chat-window':
                    if (args === 'close') {
                        if (this._window)
                            this._window.close();
                    }
                    else
                        this.showWindow();
                    break;
            }
        });
        this.client.on('close-window', window => {
            switch (window) {
                case 'chat-dialog':
                case 'chatdialog':
                case 'chat':
                    if (this._dialog)
                        this._dialog.close();
                    removeHash('chat');
                    break;
                case 'chatwin':
                case 'chatwindow':
                case 'chat-win':
                case 'chat-window':
                    if (this._window)
                        this._window.close();
                    break;
            }
        })
        this.client.on('options-loaded', () => {
            this._loadOptions();
        });
        this.client.on('set-title', (title, lag) => {
            this._post({ action: 'name', args: $character });
        }, this);
        this.client.on('connecting', () => {
            this._post({ action: 'connected', args: this.client.connected });
        }, this);
        this._buildCaptures();
        this._loadOptions();
        if (this.client.getOption('showChat') || this.client.getOption('chat.persistent') || this.client.getOption('chat.captureTells') || this.client.getOption('chat.captureTalk') || this.client.getOption('chat.captureLines'))
            this.show();
        let options = this.client.getOption('windows.chat')
        if (options && options.show)
            this.showDialog();
        options = this.client.getOption('windows.chatWindow')
        if (options && options.show)
            this.showWindow();
    }

    get menu(): MenuItem[] {
        return [{
            name: '-',
            position: 5,
            exists: '#menu-plugins',
            id: 'plugins'
        },
        {
            name: ' Show chat',
            action: e => { this.client.getOption('showChatWindow') ? this.show() : this.showDialog(); },
            icon: '<i class="bi bi-chat"></i>',
            position: '#menu-plugins'
        }];
    }

    get settings(): MenuItem[] {
        return [{
            name: ' Chat',
            action: 'settings-chat',
            icon: '<i class="bi bi-chat"></i>',
            position: 'a[href="#settings-specialCharacters"]'
        }, {
            name: ' Chat display',
            action: 'settings-chatDisplay',
            icon: '<i class="bi bi-chat"></i>',
            position: 'a[href="#settings-chat"]'
        }]
    }

    private _buildCaptures() {
        this._captures = [];
        this._captureReviews = [];
        if (this.client.getOption('chat.captureTells')) {
            this._captures.push(new RegExp('^([a-zA-Z\'\\s_-]*) tells you:(.*)$'),
                new RegExp('^(\\([a-zA-Z\'\\s_-]*\\)) tells you:(.*)$'),
                new RegExp('^You tell ([a-zA-Z\'\\s_-]*):(.*)$'),
                new RegExp('^\\*([a-zA-Z\'\\s_-]*)(\\s?)(.*?)$'),
                new RegExp('^([a-zA-Z\'\\s_-]*) is idle, and may not have been paying attention.$'),
                new RegExp('^([a-zA-Z\'\\s_-]*) is in combat and may not have heard you.$'),
                new RegExp('^([a-zA-Z\'\\s_-]*) is in edit and may not be in a position to respond.$'),
                new RegExp('^([a-zA-Z\'\\s_-]*) is arrested and can not respond.$'),
                new RegExp('^\\*You emote to ([a-zA-Z\'\\s_-]*):(.*)$'),
                new RegExp('^([a-zA-Z\'\\s_-]*) shouts in ([a-zA-Z\'\\s_-]*):(.*)$'),
                new RegExp('^You shout in ([a-zA-Z\'\\s_-]*):(.*)$')
            );
            if (this.client.getOption('chat.captureReviews'))
                this._captureReviews.push(new RegExp('^-=-=- Tell Review -=-=-$'));
        }
        if (this.client.getOption('chat.captureTalk')) {
            this._captures.push(new RegExp('^([a-zA-Z\'\\s_-]*) says:(.*)$'),
                new RegExp('^You say:(.*)$'),
                new RegExp('^([a-zA-Z\'\\s_-]*) whispers to you:(.*)$'),
                new RegExp('You whisper to ([a-zA-Z\'\\s_-]*):(.*)'),
                new RegExp('^([a-zA-Z\'\\s_-]*) yells:(.*)$'),
                new RegExp('^You yell:(.*)$'),
                new RegExp('You say in (.*):(.*)'),
                new RegExp('([a-zA-Z\'\\s_-]*) says something in (.*).'),
                new RegExp('([a-zA-Z\'\\s_-]*) says in (.*):(.*)'));
            if (this.client.getOption('chat.captureReviews'))
                this._captureReviews.push(new RegExp('^-=-=- Say Review -=-=-$'));
        }
        if (this.client.getOption('chat.captureLines')) {
            if (this.client.getOption('chat.captureAllLines')) {
                this._captures.push(new RegExp('^\\[(.*)\\](.*)$'));
                if (this.client.getOption('chat.captureReviews'))
                    this._captureReviews.push(new RegExp('^-=-=- ((?:(?!\\b(Say|Tell|End)\\b).)+) Review -=-=-$'));
            }
            else {
                const lines = this.client.getOption('chat.lines');
                for (var l = 0, ll = lines.length; l < ll; l++) {
                    if (lines[l].trim().length === 0) continue;
                    this._captures.push(new RegExp('\\[' + lines[l].trim() + '\\](.*)', 'i'));
                    if (this.client.getOption('chat.captureReviews'))
                        this._captureReviews.push(new RegExp('^-=-=- ' + lines[l].trim() + ' Review -=-=-$', 'i'));
                }
            }
        }
    }

    public updateChat(data) {
        if (typeof data === 'string') {
            let display;
            let line = -1;
            if (this._dialog && this._dialog.opened) {
                line = (<any>this._dialog).display.lines.length - 1;
                (<any>this._dialog).display.append(data);
                display = (<any>this._dialog).display;
            }
            if (this._window && !this._window.closed) {
                if (!display) line = (<any>this._dialog).display.lines.length - 1;
                (<any>this._window).display.append(data);
                display = display || (<any>this._window).display;
            }
            if (display) {
                if (line < 0) line = 0;
                data = Object.assign({ fragment: display.EndOfLine, line: display.lines[line].text }, display.lines[line]);
            }
            else
                data = {
                    line: data,
                    formats: [{
                        formatType: 0,
                        offset: 0,
                        color: 37,
                        background: 40,
                        size: 0,
                        font: 0,
                        style: 0,
                        unicode: false
                    }],
                    raw: data,
                    timestamp: Date.now()
                };
        }
        else {
            if (this._dialog && this._dialog.opened)
                (<any>this._dialog).display.model.addParserLine(data);
            if (this._window && !this._window.closed)
                (<any>this._window).display.model.addParserLine(data);
        }
        if (this.client.getOption('chat.log'))
            this._post({ action: 'add-line', args: data });
    };

    private _getWindowState() {
        let state = Object.assign({}, { show: false, width: 640, height: 480, x: window.screenLeft + 200, y: window.screenTop + 200 }, this.client.getOption('windows.chatWindow'));
        if (this._window && !this._window.closed) {
            state.width = this._window.document.body.clientWidth;
            state.height = this._window.document.body.clientHeight;
            state.x = this._window.screenLeft || this._window.screenX;
            state.y = this._window.screenTop || this._window.screenY;
        }
        return state;
    }

    private _buildToolbar(doc, display) {
        const toolbar = doc.createElement('nav');
        toolbar.id = 'chat-toolbar';
        toolbar.classList.add('navbar', 'bg-light', 'align-items-center');
        toolbar.innerHTML = `<form class="container-fluid justify-content-start"><button id="btn-chat-clear" type="button" class="btn btn-sm btn-outline-secondary me-2 mb-1" title="Clear display"><i class="bi bi-trash"></i></button><button id="btn-chat-lock" type="button" class="btn btn-sm btn-outline-secondary me-2 mb-1" title="Lock display"><i class="bi bi-lock-fill"></i></button><div class="vr me-2" style="height: 29px;"></div><button id="btn-chat-log" type="button" class="btn btn-sm btn-outline-secondary me-2 mb-1" title="Log chat"><i class="bi bi-file-text"></i></button><div class="vr me-2" style="height: 29px;"></div><button id="btn-chat-wrap" type="button" class="btn btn-sm btn-outline-secondary me-2 mb-1" title="Toggle word wrap"><i class="bi bi-text-wrap"></i></button></form>`;
        toolbar.querySelector('#btn-chat-clear').addEventListener('click', () => {
            display.clear();
        });
        toolbar.querySelector('#btn-chat-lock').addEventListener('click', () => {
            this.client.setOption('chat.scrollLocked', !this.client.getOption('chat.scrollLocked'));
            if (this._window) {
                (this._window as any).display.scrollLock = this.client.getOption('chat.scrollLocked');
                this._updateScrollLockButton(this._window.document.querySelector('#btn-chat-lock'), this.client.getOption('chat.scrollLocked'));
            }
            if (this._dialog) {
                (this._dialog as any).display.scrollLock = this.client.getOption('chat.scrollLocked');
                this._updateScrollLockButton(this._dialog.body.querySelector('#btn-chat-lock'), this.client.getOption('chat.scrollLocked'));
            }
        });
        toolbar.querySelector('#btn-chat-log').addEventListener('click', () => {
            this.client.setOption('chat.log', !this.client.getOption('chat.log'));
            if (this.client.getOption('chat.log'))
                this._createLogger();
            if (this._window)
                this._updateButtonState(this._window.document.querySelector('#btn-chat-log'), this.client.getOption('chat.log'));
            if (this._dialog)
                this._updateButtonState(this._dialog.body.querySelector('#btn-chat-log'), this.client.getOption('chat.log'));
            if (this._logger)
                this._post({ action: 'toggle' });
        });
        toolbar.querySelector('#btn-chat-wrap').addEventListener('click', () => {
            this.client.setOption('chat.wrap', !this.client.getOption('chat.wrap'));
            if (this._window) {
                this._updateButtonState(this._window.document.querySelector('#btn-chat-wrap'), this.client.getOption('chat.wrap'));
                (this._window as any).display.wordWrap = this.client.getOption('chat.wrap');
            }
            if (this._dialog) {
                this._updateButtonState(this._dialog.body.querySelector('#btn-chat-wrap'), this.client.getOption('chat.wrap'));
                (this._dialog as any).display.wordWrap = this.client.getOption('chat.wrap');
            }

        });
        this._updateScrollLockButton(toolbar.querySelector('#btn-chat-lock'), this.client.getOption('chat.scrollLocked'));
        this._updateButtonState(toolbar.querySelector('#btn-chat-wrap'), this.client.getOption('chat.wrap'));
        this._updateButtonState(toolbar.querySelector('#btn-chat-log'), this.client.getOption('chat.log'));
        return toolbar;
    }

    private _updateScrollLockButton(button: HTMLElement, state) {
        if (!button) return;
        let icon = button.firstElementChild;
        if (state) {
            button.title = 'Unlock display';
            button.classList.add('active');
            icon.classList.add('bi-unlock-fill');
            icon.classList.remove('bi-lock-fill');
        }
        else {
            button.title = 'Lock display';
            button.classList.remove('active');
            icon.classList.remove('bi-unlock-fill');
            icon.classList.add('bi-lock-fill');
        }
    }

    private _updateButtonState(button: HTMLElement, state) {
        if (!button) return;
        if (state)
            button.classList.add('active');
        else
            button.classList.remove('active');
    }

    public showWindow() {
        if (!this._window || this._window.closed) {
            let state = this._getWindowState();
            this._window = window.open('window.htm', "chat-window", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=" + (state.width) + ",height=" + (state.height) + ",top=" + (state.y) + ",left=" + (state.x));
            state.show = true;
            this._window.addEventListener('resize', () => {
                this.client.setOption('windows.chatWindow', this._getWindowState());
                debounce(() => {
                    (<any>this._window).display.container.style.top = this._window.document.getElementById('chat-toolbar').offsetHeight + 'px';
                }, 25, 'chat-resize');
            });
            this._window.addEventListener('focus', () => {
                this.client.setOption('windows.chatWindow', this._getWindowState());
            });
            this._window.addEventListener('blur', () => {
                this.client.setOption('windows.chatWindow', this._getWindowState());
            });
            this._window.addEventListener('load', () => {
                this._window.document.querySelector('head').insertAdjacentHTML('afterbegin', `<<link id="icon1" rel="shortcut icon" href="images/chat.png" /><link id="icon2" rel="icon" href="images/chat.png" /><link id="icon3" rel="icon" type="image/x-icon" href="images/chat.png" /><link href="oiMUD.min.css" rel="stylesheet" type="text/css">>`);
                this._window.document.title = 'Chat';
                let el = this._window.document.createElement('div');
                el.id = 'chat-display';
                this._window.document.body.append(el);
                (<any>this._window).display = new Display(el);
                this._loadDisplayOptions((<any>this._window).display);
                this._loadWindowOptions(this._window.document);
                const toolbar = this._buildToolbar(this._window.document, (<any>this._window).display);
                this._window.document.body.appendChild(toolbar);
                this._window.focus();
            });
        }
    }

    public showDialog() {
        if (!this._dialog) {
            this._dialog = new Dialog(Object.assign({}, this.client.getOption('windows.chat') || { center: true }, { title: '<i class="bi bi-chat"></i> Chat', minWidth: 410, noFooter: true, id: 'chat-dialog' }));
            this._dialog.header.querySelector('#chat-dialog-max').insertAdjacentHTML('afterend', '<button type="button" class="btn btn-light float-end" id="chat-dialog-window" title="Open chat window" style="padding: 0 4px;margin-top: -1px;"><i class="bi bi-window"></i></button>');
            this._dialog.header.querySelector('#chat-dialog-window').addEventListener('click', () => {
                this.showWindow();
            });
            let el = document.createElement('div');
            el.id = 'chat-display';
            this._dialog.body.append(el);
            (<any>this._dialog).display = new Display(el);
            this._loadDisplayOptions((<any>this._dialog).display);
            this._loadWindowOptions(this._dialog.body);
            const toolbar = this._buildToolbar(document, (<any>this._dialog).display);
            this._dialog.body.appendChild(toolbar);

            this._dialog.on('resized', e => {
                this.client.setOption('windows.chat', e);
                debounce(() => {
                    el.style.top = toolbar.offsetHeight + 'px';
                }, 25, 'chat-resize');
            });
            this._dialog.on('closed', () => {
                this.client.setOption('windows.chat', this._dialog.windowState);
                removeHash('chat');
                this.client.setOption('showChat', false);
            });
            this._dialog.on('canceled', () => {
                this.client.setOption('windows.chat', this._dialog.windowState);
                removeHash('chat');
                this.client.setOption('showChat', false);
            });
            this._dialog.on('moved', e => {
                this.client.setOption('windows.chat', e);
            })
            this._dialog.on('maximized', () => {
                this.client.setOption('windows.chat', this._dialog.windowState);
            });
            this._dialog.on('restored', () => {
                this.client.setOption('windows.chat', this._dialog.windowState);
            });
            this._dialog.on('shown', () => {
                this.client.setOption('windows.chat', this._dialog.windowState);
                this.client.setOption('showChat', true);
            });
        }
        this._dialog.show();
    }

    public show() {
        if ((this.client.getOption('showChatWindow') & chatType.window) == chatType.window)
            this.showWindow();
        if (this.client.getOption('showChat') || (this.client.getOption('showChatWindow') & chatType.dialog) == chatType.dialog)
            this.showDialog();
    }

    public toggleDialog() {
        if (this._dialog && this._dialog.opened)
            this._dialog.close();
        else
            this.showDialog();
    }

    private _getLogger() {
        if (this._loggerPlugin) return;
        for (let p = 0, pl = this.client.plugins.length; p < pl; p++) {
            if (this.client.plugins[p] instanceof Logger) {
                this._loggerPlugin = this.client.plugins[p] as Logger;
                return;
            }
        }
    }

    private _createLogger() {
        if (this._logger || !client.getOption('chat.log')) return;
        this._getLogger();
        if (!this._loggerPlugin) return;
        this._logger = this._loggerPlugin.createLogger();
        this._logger.addEventListener('message', e => {
            switch (e.data.event) {
                case 'started':
                    this.client.setOption('chat.log', true);
                    if (this._window)
                        this._updateButtonState(this._window.document.querySelector('#btn-chat-log'), true);
                    if (this._dialog)
                        this._updateButtonState(this._dialog.body.querySelector('#btn-chat-log'), true);
                    break;
                case 'stopped':
                    this.client.setOption('chat.log', false);
                    if (this._window)
                        this._updateButtonState(this._window.document.querySelector('#btn-chat-log'), false);
                    if (this._dialog)
                        this._updateButtonState(this._dialog.body.querySelector('#btn-chat-log'), false);
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
                        this.client.setOption('chat.log', e.data.args);
                    if (this._window)
                        this._updateButtonState(this._window.document.querySelector('#btn-chat-log'), e.data.args);
                    if (this._dialog)
                        this._updateButtonState(this._dialog.body.querySelector('#btn-chat-log'), e.data.args);
                    if (!e.data.args) {
                        this._post({ action: 'flush' });
                        this._logger.terminate();
                        this._logger = null;
                    }
                    break;
                case 'startInternal':
                case 'start':
                    if (this._dialog && this._dialog.opened)
                        this._post({ action: e.data.event, args: { lines: (<any>this._dialog).display.lines, fragment: (<any>this._dialog).display.EndOfLine } });
                    else if (this._window && !this._window.closed)
                        this._post({ action: e.data.event, args: { lines: (<any>this._window).display.lines, fragment: (<any>this._window).display.EndOfLine } });
                    else
                        this._post({ action: e.data.event });
                    break;
                case 'write':
                    this._getLogger();
                    if (!this._loggerPlugin) return;
                    this._loggerPlugin.updateKey(e.data);
                    localforage.getItem('OoMUDLog' + e.data.file).then(value => {
                        if (!value) value = '';
                        value += e.data.data;
                        localforage.setItem('OoMUDLog' + e.data.file, value).then(() => {
                            if (this._loggerPlugin.manager) this._loggerPlugin.manager.logChanged(e.data.file, e.data.data);
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
        this._post({
            action: 'options', args: {
                offline: client.getOption('logOffline'),
                gagged: client.getOption('logGagged'),
                enabled: client.getOption('chat.log'),
                unique: client.getOption('logUniqueOnConnect'),
                prepend: client.getOption('logPrepend'),
                what: client.getOption('logWhat'),
                debug: client.getOption('enableDebug'),
                postfix: '.chat',
                format: client.getOption('logTimeFormat'),
                timestamp: client.getOption('logTimestamp'),
                timestampFormat: client.getOption('logTimestampFormat')
            }
        });
    }

    private _post(data) {
        if (!this._logger) return;
        this._logger.postMessage(data);
    }

    private _loadDisplayOptions(display) {
        display.updateFont(client.getOption('chat.font'), client.getOption('chat.fontSize'));
        display.maxLines = client.getOption('chat.bufferSize');
        display.enableFlashing = client.getOption('chat.flashing');
        display.showTimestamp = client.getOption('chat.showTimestamp');
        display.timestampFormat = client.getOption('chat.timestampFormat');
        display.enableMXP = client.getOption('enableMXP');
        display.enableURLDetection = client.getOption('enableURLDetection');
        display.showInvalidMXPTags = client.getOption('display.showInvalidMXPTags');
        display.hideTrailingEmptyLine = client.getOption('display.hideTrailingEmptyLine');
        display.enableColors = client.getOption('chat.enableColors');
        display.enableBackgroundColors = client.getOption('chat.enableBackgroundColors');
        display.tabWidth = client.getOption('chat.tabWidth');
        display.displayControlCodes = client.getOption('chat.displayControlCodes');
        display.emulateTerminal = client.getOption('chat.emulateTerminal');
        display.emulateControlCodes = client.getOption('chat.emulateControlCodes');
        display.wordWrap = client.getOption('chat.wordWrap');
        display.wrapAt = client.getOption('chat.wrapAt');
        display.indent = client.getOption('chat.indent');
        display.scrollLock = client.getOption('chat.scrollLocked');
        display.scrollDisplay();
    }

    private _loadWindowOptions(target) {
        this._updateScrollLockButton(target.querySelector('#btn-chat-lock'), this.client.getOption('chat.scrollLocked'));
        this._updateButtonState(target.querySelector('#btn-chat-wrap'), this.client.getOption('chat.wrap'));
        this._updateButtonState(target.querySelector('#btn-chat-log'), this.client.getOption('chat.log'));
    }

    private _loadOptions() {
        if (this._dialog) {
            this._dialog.resetState(client.getOption('windows.chat') || { center: true });
            this._loadDisplayOptions((<any>this._dialog).display);
            this._loadWindowOptions(this._dialog.body);
        }
        if (this._window) {
            this._loadDisplayOptions((<any>this._window).display);
            this._loadWindowOptions(this._window.document);
        }

        if (this._logger)
            this._post({
                action: 'options', args: {
                    offline: client.getOption('logOffline'),
                    gagged: client.getOption('logGagged'),
                    enabled: client.getOption('chat.log'),
                    unique: client.getOption('logUniqueOnConnect'),
                    prepend: client.getOption('logPrepend'),
                    what: client.getOption('logWhat'),
                    debug: client.getOption('enableDebug'),
                    prefix: 'chat.',
                    format: client.getOption('logTimeFormat'),
                    timestamp: client.getOption('logTimestamp'),
                    timestampFormat: client.getOption('logTimestampFormat')
                }
            });
        else
            this._createLogger();
        if (this._dialog && this._dialog.opened)
            this._post({ action: 'start', args: { lines: (<any>this._dialog).display.lines, fragment: (<any>this._dialog).display.EndOfLine } });
        else if (this._window && !this._window.closed)
            this._post({ action: 'start', args: { lines: (<any>this._window).display.lines, fragment: (<any>this._window).display.EndOfLine } });
        else
            this._post({ action: 'start' });
    }
}