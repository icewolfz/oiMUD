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
    private _backup: Backup;

    constructor(client: Client) {
        super(client);
        this._backup = new Backup(client);
    }

    public remove(): void {

    }
    public initialize(): void {

    }
    get menu(): MenuItem[] {
        return [];
    }
    get settings(): MenuItem[] {
        return [];
    }
}

window.ShadowMUD = ShadowMUD;