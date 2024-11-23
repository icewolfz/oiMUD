import { Plugin } from '../../core/plugin';
import { MenuItem } from '../../core/types';
import { Client } from '../../core/client';
import { Backup } from './backup';
import { removeHash } from '../../all';
import { Dialog } from '../../interface/dialog';

declare global {
    interface Window {
        ShadowMUD;
    }
}

export class ShadowMUD extends Plugin {
    public backup: Backup;

    private _skipMoreTimeout;
    private _skipMoreEvent;
    private _help;

    constructor(client: Client) {
        super(client);
        this.backup = new Backup(client);
    }

    public remove(): void {
        this.backup.remove();
        this.client.removeListenersFromCaller(this);
    }
    public initialize(): void {
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
            }
        }, this);
        this.client.on('options-loaded', () => {
            if (this._help) this._help.resetState(client.getWindowState('smhelp') || { center: true, width: 400, height: 275 });
        });
        let options = this.client.getWindowState('smhelp')
        if (options && options.show)
            this._showHelp();
    }

    private _showHelp() {
        if (client.getOption('externalHelp')) {
            window.open('http://www.shadowmud.com/help.php', '_blank');
            return;
        }
        if (!this._help) {
            this._help = new Dialog(Object.assign({}, client.getWindowState('smhelp') || { center: true, width: 500, height: 375 }, { title: '<i class="shadowmud-icon"></i> ShadowMUD Help', id: 'smhelp', noFooter: true }));
            const frame = document.createElement('iframe');
            //<iframe id="smhelpframe" style="z-index:100;border:0px;margin:0px;width:100%;height:100%;overflow:auto" src="/OoMUD/smhelp.php"></iframe>
            frame.src = 'http://shadowmud.com/OoMUD/smhelp.php';
            frame.id = 'smhelp-frame';
            frame.classList.add('full-page');
            this._help.body.append(frame);
            this._help.on('closed', () => {
                client.setOption('windows.smhelp', this._help.windowState);
                this._help = null;
                removeHash('smhelp');
            });
            this._help.on('canceled', () => {
                client.setOption('windows.smhelp', this._help.windowState);
                this._help = null;
                removeHash('smhelp');
            });
            this._help.on('resized', e => {
                client.setOption('windows.smhelp', e);
            });
            this._help.on('moved', e => {
                client.setOption('windows.smhelp', e);
            })
            this._help.on('maximized', () => {
                client.setOption('windows.smhelp', this._help.windowState);
            });
            this._help.on('restored', () => {
                client.setOption('windows.smhelp', this._help.windowState);
            });
            this._help.on('shown', () => {
                client.setOption('windows.smhelp', this._help.windowState);
            });
        }
        this._help.show();
    }

    get menu(): MenuItem[] {
        return [{
            name: ' ShadowMUD help',
            action: () => {
                this._showHelp();
            },
            icon: '<i class="shadowmud-icon-light"></i>',
            position: -4
        }];
    }
    get settings(): MenuItem[] {
        return [{
            name: ' ShadowMUD',
            action: 'settings-shadowmud',
            icon: '<i class="shadowmud-icon"></i>',
        }]
    }
}

window.ShadowMUD = ShadowMUD;