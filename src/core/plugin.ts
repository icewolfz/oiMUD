import { Client } from './client';
import { EventEmitter } from './events.js';
import { MenuItem } from './types';

export abstract class Plugin extends EventEmitter {
    #client;
    public get client() { return this.#client; }
    public set client(value: Client) {
        if (value === this.#client) return;
        this.remove();
        this.#client = value;
        this.initialize();
    }

    constructor(client: Client) {
        super();
        this.#client = client;
    }

    public abstract remove(): void;
    public abstract initialize(): void;
    abstract get menu(): MenuItem[];
    abstract get settings(): MenuItem[];
}