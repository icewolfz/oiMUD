import { Plugin } from '../../core/plugin';
import { MenuItem } from '../../core/types';
import { Client } from '../../core/client';
import { Backup } from './backup';
import { removeHash } from '../../all';
import { Dialog } from '../../interface/dialog';
import { AdvEditor } from '../../interface/adv.editor';
import { openFileDialog, readFile } from '../../core/library';
import { Settings } from '../../core/settings';

declare global {
    interface Window {
        ShadowMUD;
    }
}

declare let alert_box;

export class ShadowMUD extends Plugin {
    public backup: Backup;

    private _skipMoreTimeout;
    private _skipMoreEvent;
    private _help;
    private _composer;
    private _composerDialog;
    private _composerData;
    private _inEditTimeout;

    constructor(client: Client) {
        super(client);
        this.backup = new Backup(client);
        if (!Settings.exist('mail.timeout'))
            this.client.setOption('mail.timeout', 5000);
    }

    public remove(): void {
        this.backup.remove();
        this.client.removeListenersFromCaller(this);
        let idx = this.client.telnet.GMCPSupports.indexOf('oMUD.Info 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
    }
    public initialize(): void {
        this.client.telnet.GMCPSupports.push('oMUD.Info 1');
        this.client.on('add-line', data => {
            if (!this._skipMoreTimeout && data.fragment && data.line.startsWith('--More--') && this.client.getOption('skipMore')) {
                this._skipMoreEvent = data => {
                    clearTimeout(this._skipMoreTimeout || 0);
                    this._skipMoreTimeout = 0;
                    this._skipMoreEvent = 0;
                }
                //clear skip if anything has been sent to the mud from the client
                this.client.once('parse-command', this._skipMoreEvent, this);
                this._skipMoreTimeout = setTimeout(() => {
                    this.client.removeListener('parse-command', this._skipMoreEvent); //clear event to prevent multiple triggers and free memory
                    this._skipMoreTimeout = 0;
                    this._skipMoreEvent = 0;
                    this.client.sendCommand('\n');
                }, this.client.getOption('skipMoreDelay') >= 0 ? this.client.getOption('skipMoreDelay') : 0);
            }
            //if composer not open or editor not readonly not sending mail so do not fire triggers
            if (!this._composerData) return;
            if (data.line === 'Subject: ' && data.fragment)
                this._sendCommand(this._composerData.subject, 4);
            else if (this._composerData.body !== null && data.line.length && data.line.split('').every(char => char === '_')) {
                this._sendCommand(this._composerData.body, 2);
                this._sendCommand('.', 4);
                this._composerData.body = null;
            }
            else if (data.line === 'Cc: ' && data.fragment) {
                this._sendCommand(this._composerData.cc, 1);
                this._composer.clear();
                this._composerData = null;
                if (this._composerDialog)
                    this._composerDialog.close();
            }
        }, this);
        this.client.on('window', (window, args, name) => {
            switch (window) {
                case 'shadowmudhelp':
                case 'shadowmud-help':
                case 'smhelp':
                    if (args === 'close') {
                        if (this._help)
                            this._help.close();
                    }
                    else
                        this._showHelp();
                    break;
                case 'composer':
                    if (args === 'close') {
                        if (this._composerDialog)
                            this._composerDialog.close();
                    }
                    else
                        this._showComposer();
                    break;
            }
        }, this);
        this.client.on('close-window', window => {
            switch (window) {
                case 'shadowmudhelp':
                case 'shadowmud-help':
                case 'smhelp':
                    if (this._help)
                        this._help.close();
                    break;
                case 'composer':
                    if (this._composerDialog)
                        this._composerDialog.close();
                    break;
            }
        }, this);
        this.client.on('options-loaded', () => {
            if (this._help) this._help.resetState(client.getWindowState('smhelp') || { center: true, width: 400, height: 275 });
            if (this._composerDialog) {
                this._composerDialog.resetState(client.getWindowState('composer') || { center: true });
                this._composerDialog.persistent = this._composerDialog.windowState.persistent;
                if (this._composer.simple != client.getOption('simpleComposer')) {
                    let value = '';
                    if (!this._composer.isSimple)
                        value = this._composer.getFormattedText().replace(/(?:\r)/g, '');
                    this._composer.simple = client.getOption('simpleComposer');
                    if (!this._composer.isSimple) {
                        this._composerDialog.hideFooter();
                        if (this._composerDialog.header.querySelector('#composer-switch'))
                            this._composerDialog.header.querySelector('#composer-switch').title = 'Switch to simple';
                        this._composerDialog.dialog.dataset.type = 'advanced';
                    }
                    else {
                        this._composer.value = value;
                        this._composerDialog.showFooter();
                        if (this._composerDialog.header.querySelector('#composer-switch'))
                            this._composerDialog.header.querySelector('#composer-switch').title = 'Switch to advanced';
                        setTimeout(() => this._composer.focus(), 100);
                        this._composerDialog.dialog.dataset.type = 'simple';
                    }
                }
            }
        });
        let options = this.client.getWindowState('smhelp')
        if (options && options.show)
            this._showHelp();
        options = this.client.getWindowState('composer')
        if (options && options.show)
            this._showComposer();
    }

    private _showHelp() {
        if (this.client.getOption('externalHelp')) {
            window.open('http://www.shadowmud.com/help.php', '_blank');
            return;
        }
        if (!this._help) {
            this._help = new Dialog(Object.assign({}, this.client.getWindowState('smhelp') || { center: true, width: 500, height: 375 }, { title: '<i class="shadowmud-icon"></i> ShadowMUD Help', id: 'smhelp', noFooter: true }));
            const frame = document.createElement('iframe');
            //<iframe id="smhelpframe" style="z-index:100;border:0px;margin:0px;width:100%;height:100%;overflow:auto" src="/OoMUD/smhelp.php"></iframe>
            frame.src = 'http://shadowmud.com/OoMUD/smhelp.php';
            frame.id = 'smhelp-frame';
            frame.classList.add('full-page');
            this._help.body.append(frame);
            this._help.on('closed', () => {
                this.client.setOption('windows.smhelp', this._help.windowState);
                this._help = null;
                removeHash('smhelp');
            });
            this._help.on('canceled', () => {
                this.client.setOption('windows.smhelp', this._help.windowState);
                this._help = null;
                removeHash('smhelp');
            });
            this._help.on('resized', e => {
                this.client.setOption('windows.smhelp', e);
            });
            this._help.on('moved', e => {
                this.client.setOption('windows.smhelp', e);
            })
            this._help.on('maximized', () => {
                this.client.setOption('windows.smhelp', this._help.windowState);
            });
            this._help.on('restored', () => {
                this.client.setOption('windows.smhelp', this._help.windowState);
            });
            this._help.on('shown', () => {
                this.client.setOption('windows.smhelp', this._help.windowState);
            });
        }
        this._help.show();
    }

    private _showComposer() {
        if (!this._composerDialog) {
            this._composerDialog = new Dialog(Object.assign({}, this.client.getWindowState('composer') || { center: true }, { title: '<i class="bi bi-envelope"></i> Compose mail', id: 'composer' }));
            this._composerDialog.on('resized', e => {
                this.client.setOption('windows.composer', e);
            });
            this._composerDialog.on('moved', e => {
                this.client.setOption('windows.composer', e);
            })
            this._composerDialog.on('maximized', () => {
                this.client.setOption('windows.composer', this._composerDialog.windowState);
            });
            this._composerDialog.on('restored', () => {
                this.client.setOption('windows.composer', this._composerDialog.windowState);
            });
            this._composerDialog.on('shown', () => {
                this.client.setOption('windows.composer', this._composerDialog.windowState);
                this._composer.initialize();
                if (this._composerData) {
                    this._setComposerState(true);
                    (document.getElementById('composer-to') as HTMLInputElement).value = this._composerData.to;
                    (document.getElementById('composer-cc') as HTMLInputElement).value = this._composerData.cc;
                    (document.getElementById('composer-subject') as HTMLInputElement).value = this._composerData.subject;
                    this._composer.value = this._composerData.body || '';
                    if (!this._inEditTimeout) {
                        let to = this.client.getOption('mail.timeout');
                        if (to < 1000) to = 1000;
                        if (to > 20000) to = 20000;
                        //setup a timeout just to be save
                        this._inEditTimeout = setTimeout(() => {
                            alert_box('Error', 'Sendmail timed out try again.', 3);
                            this._composerData = null;
                            this._setComposerState(false);
                            this._inEditTimeout = 0;
                        }, to);
                    }
                }
            });
            this._composerDialog.on('closing', () => {
                if (!this._composerDialog.windowState.persistent)
                    this._composer.remove();
                else
                    this._composer.clear();
            });
            this._composerDialog.on('closed', () => {
                this.client.setOption('windows.composer', this._composerDialog.windowState);
                if (!this._composerDialog.windowState.persistent) {
                    this._composerDialog.dialog.composer.removeAllListeners();
                    delete this._composerDialog.dialog.composer;
                    this._composerDialog.removeAllListeners();
                    this._composer.remove();
                    this._composer = null;
                    this._composerDialog = null;
                }
                else
                    this._setComposerState(false);
                removeHash('composer');
            });
            this._composerDialog.on('canceling', () => {
                if (!this._composerDialog.windowState.persistent)
                    this._composer.remove();
                else
                    this._composer.clear();
            });
            this._composerDialog.on('canceled', () => {
                this.client.setOption('windows.composer', this._composerDialog.windowState);
                if (!this._composerDialog.windowState.persistent) {
                    this._composerDialog.dialog.composer.removeAllListeners();
                    delete this._composerDialog.dialog.composer;
                    this._composer.removeAllListeners();
                    this._composer.remove();
                    this._composer = null;
                    this._composerDialog = null;
                }
                removeHash('composer');
            });
            this._composerDialog.on('focus', () => this._composer.focus());
            this._composerDialog.body.innerHTML = `<div class="m-1 input-group has-validation" style="width: auto"><div class="input-group-text" style="width: 85px"><label class="form-check-label ms-1" for="composer-to" style="width: 100%;text-align: left;">To</label></div><input type="text" class="form-control" id="composer-to" required><div class="invalid-tooltip" id="composer-to-feedback" style="left: 85px;z-index:100;"></div></div><div class="m-1 input-group" style="width: auto"><div class="input-group-text" style="width: 85px"><label class="form-check-label ms-1" for="composer-cc" style="width: 100%;text-align: left;">CC</label></div><input type="text" class="form-control" id="composer-cc"></div><div class="m-1 input-group" style="width: auto"><div class="input-group-text" style="width: 85px"><label class="form-check-label ms-1" for="composer-subject" style="width: 100%;text-align: left;">Subject</label></div><input type="text" class="form-control" id="composer-subject"></div>`;
            let body = document.createElement('div');
            body.id = 'composer-body';
            this._composerDialog.body.appendChild(body);
            const textarea = document.createElement('textarea');
            textarea.classList.add('form-control', 'form-control-sm');
            textarea.id = 'composer-txt';
            body.appendChild(textarea);
            this._composerDialog.body.style.overflow = 'hidden';
            if (!this._composer) this._composer = new AdvEditor(textarea, !this.client.getOption('simpleComposer'), {
                sendTitle: 'Send mail',
                sendFetch: [{
                    text: 'Formatted',
                    value: 'rawformatted',
                    type: 'choiceitem'
                },
                {
                    text: 'Text',
                    value: 'rawtext',
                    type: 'choiceitem'
                }]
            });
            this._composer.on('send-action', e => {
                e.preventDefault = true;
                this._sendMail(this._composer.getFormattedText().replace(/(?:\r)/g, ''), 3);
            });
            this._composer.on('send-item-action', e => {
                e.preventDefault = true;
                switch (e.value) {
                    case 'rawformatted':
                        this._sendMail(this._composer.getFormattedText().replace(/(?:\r)/g, ''), 3);
                        break;
                    case 'rawtext':
                        this._sendMail(this._composer.getText().replace(/(?:\r)/g, ''), 3);
                        break;
                }
            });
            this._composer.on('close', () => {
                this._composerDialog.close();
            });
            this._composer.on('editor-init', () => this._composer.focus());
            this._composer.on('click', () => this._composerDialog.focus());
            this._composerDialog.dialog.composer = this._composer;
            if (TINYMCE && tinymce)
                this._composerDialog.header.querySelector('#composer-max').insertAdjacentHTML('afterend', '<button type="button" class="btn btn-light float-end" id="composer-switch" title="Switch to advanced" style="padding: 0 4px;margin-top: -1px;"><i class="bi-shuffle"></i></button>');
            this._composerDialog.footer.innerHTML = `<button id="btn-composer-clear" type="button" class="btn-sm float-start btn btn-light" title="Clear composer"><i class="bi bi-journal-x"></i><span class="icon-only"> Clear</span></button><button id="btn-composer-append" type="button" class="btn-sm float-start btn btn-light" title="Append file..."><i class="bi bi-box-arrow-in-down"></i><span class="icon-only"> Append file...</span></button><button id="btn-composer-send" type="button" class="btn-sm float-end btn btn-primary" title="Send"><i class="bi bi-send-fill"></i><span class="icon-only"> Send</span></button>`;
            if (this._composerDialog.header.querySelector('#composer-switch')) {
                if (!this._composer.isSimple) {
                    this._composerDialog.header.querySelector('#composer-switch').title = 'Switch to simple';
                    this._composerDialog.dialog.dataset.type = 'advanced';
                }
                this._composerDialog.header.querySelector('#composer-switch').addEventListener('click', () => {
                    this.client.setOption('simpleComposer', !this._composer.simple);
                    let value = '';
                    if (!this._composer.isSimple)
                        value = this._composer.getFormattedText().replace(/(?:\r)/g, '');
                    this._composer.simple = !this._composer.simple;
                    if (!this._composer.isSimple) {
                        this._composerDialog.hideFooter();
                        this._composerDialog.header.querySelector('#composer-switch').title = 'Switch to simple';
                        this._composerDialog.dialog.dataset.type = 'advanced';
                    }
                    else {
                        this._composer.value = value;
                        this._composerDialog.showFooter();
                        this._composerDialog.header.querySelector('#composer-switch').title = 'Switch to advanced';
                        setTimeout(() => this._composer.focus(), 100);
                        this._composerDialog.dialog.dataset.type = 'simple';
                    }
                });
            }
            document.getElementById('btn-composer-append').addEventListener('click', () => {
                openFileDialog('Append file', false).then(files => {
                    readFile(files[0]).then((contents: any) => {
                        this._composer.insert(contents);
                    }).catch(err => this.client.error(err));
                }).catch(() => { });
            });
            document.getElementById('btn-composer-send').addEventListener('click', () => {
                this._sendMail(this._composer.getFormattedText().replace(/(?:\r)/g, ''), 3);
            });
            document.getElementById('btn-composer-clear').addEventListener('click', () => {
                this._composer.clear();
                this._composer.focus();
            });
            if (!this._composer.isSimple)
                this._composerDialog.hideFooter();
        }
        this._composerDialog.show();
        if (this._composer.isSimple)
            this._composer.focus();
    }

    get menu(): MenuItem[] {
        return [{
            name: ' ShadowMUD help',
            action: () => this._showHelp(),
            icon: '<i class="shadowmud-icon-light"></i>',
            position: -4
        },
        {
            name: ' Compose mail',
            action: () => this._showComposer(),
            icon: '<i class="bi bi-envelope"></i>',
            position: '#menu-editor'
        }];
    }
    get settings(): MenuItem[] {
        return [{
            name: ' ShadowMUD',
            action: 'settings-shadowmud',
            icon: '<i class="shadowmud-icon"></i>',
        }]
    }

    private async _sendMail(body, type) {
        if (!this.client.connected) {
            alert_box('Not connected', 'Must be connected to mud to send mail.', 3);
            return;
        }
        try {
            if (await this._inEdit()) {
                alert_box('In editor', 'Can not send mail while in editor.', 3);
                return;
            }
        }
        catch (err) {
            alert_box('Error', err, 3);
            this._setComposerState(false);
            return;
        }
        var toForm = (document.getElementById('composer-to') as HTMLInputElement);
        var to = (toForm.value.split(/ |,/) || []).filter((a) => { return a.length > 0; });
        toForm.classList.remove('is-invalid');
        if (to.length === 0) {
            toForm.classList.add('is-invalid');
            this._composerDialog.body.querySelector('#composer-to-feedback').textContent = 'Must supply at least one recipient';
            toForm.focus();
            return;
        }
        this._setComposerState(true);
        this._sendCommand('mail ' + to.join(' '), type);
        this._composerData = {
            to: to.join(' '),
            body: body || '',
            subject: (document.getElementById('composer-subject') as HTMLInputElement).value || '',
            cc: ((document.getElementById('composer-cc') as HTMLInputElement).value.split(/ |,/) || []).filter((a) => { return a.length > 0; }).join(' ')
        };
    }

    private _sendCommand(cmd, type) {
        cmd += '\n';
        switch (type) {
            case 1:
                this.client.sendBackground(cmd, true);
                break;
            case 2:
                this.client.send(cmd, false);
                break;
            case 3:
                this.client.sendRaw(cmd);
                break;
            case 4:
                this.client.send(cmd, true);
                break;
            default:
                this.client.sendCommand(cmd);
                break;
        }
    }

    private async _inEdit() {
        return new Promise((resolve, reject) => {
            let to = this.client.getOption('mail.timeout');
            if (to < 1000) to = 1000;
            if (to > 20000) to = 20000;
            //setup a timeout just to be save
            this._inEditTimeout = setTimeout(() => {
                reject('Sendmail timed out try again.');
                this._inEditTimeout = 0;
            }, to);
            this.client.sendGMCP('oMUD.inEdit');
            this.client.on('received-GMCP', (mod: string, obj: any) => {
                if (mod.toLowerCase() === 'omud.info') {
                    clearTimeout(this._inEditTimeout);
                    this.client.removeListenersFromCaller(this, 'received-GMCP');
                    this._inEditTimeout = 0;
                    resolve(obj.inEdit || false);
                }
                else if (mod.toLowerCase() === 'core.goodbye') {
                    clearTimeout(this._inEditTimeout);
                    this._inEditTimeout = 0;
                    this.client.removeListenersFromCaller(this, 'received-GMCP');
                    reject('Disconnected');
                }
            }, this);
        });
    }

    private _setComposerState(value) {
        this._composer.readOnly = value;
        (document.getElementById('composer-to') as HTMLInputElement).disabled = value;
        (document.getElementById('composer-cc') as HTMLInputElement).disabled = value;
        (document.getElementById('composer-subject') as HTMLInputElement).disabled = value;
    }
}

window.ShadowMUD = ShadowMUD;