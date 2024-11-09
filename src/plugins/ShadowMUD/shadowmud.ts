import { Plugin } from '../../plugin';
import { MenuItem, } from '../../types';
import { Client } from '../../client';
import { Backup } from './backup';

declare global {
    interface Window {
        ShadowMUD;
    }
}

export class ShadowMUD extends Plugin {
    public backup: Backup;

    private _skipMoreTimeout;
    private _skipMoreEvent;

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
    }
    get menu(): MenuItem[] {
        return [];
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