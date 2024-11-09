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

    constructor(client: Client) {
        super(client);
        this.backup = new Backup(client);
    }

    public remove(): void {

    }
    public initialize(): void {

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