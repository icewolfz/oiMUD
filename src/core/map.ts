import { EventEmitter } from './events';
import { copy } from './library';

declare let localforage;

export enum ImportType {
    Merge = 0,
    Replace = 1
}

export enum RoomDetails {
    None = 0,
    Dock = 1,
    Pier = 2,
    Bank = 4,
    Shop = 8,
    Hospital = 16,
    Bar = 32,
    Restaurant = 64,
    WaterSource = 128,
    Trainer = 256,
    Stable = 512
}

export const RoomExits = {
    out: 4096,
    enter: 2048,
    unknown: 1024,
    up: 512,
    down: 256,
    north: 128,
    northeast: 64,
    east: 32,
    southeast: 16,
    south: 8,
    southwest: 4,
    west: 2,
    northwest: 1,
    none: 0
};

export class Room {
    public num: string = null;
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    public area: string = '';
    public zone: number = 0;
    public notes?: string;
    public background?: string;
    public env?: string;
    public details?: RoomDetails = RoomDetails.None;
    public indoors?: number;
    public exits?: any = {};
    public name?: string;

    constructor(data?) {
        if (data) {
            for (let prop in data) {
                if (!data.hasOwnProperty(prop)) continue;
                this[prop] = data[prop];
            }
        }
    }

    get exitsID() {
        return Object.keys(this.exits).map(exit => RoomExits[exit]).reduce((a, c) => a | c, 0);
    }

    public clone() {
        return new Room(copy(this));
    }
}

export class Map extends EventEmitter {
    private _rooms: object;
    private _areas: string[];
    private _zone: number;
    private _keys: string[];
    private _keysZones: string[];
    private _current: Room;
    public changed = false;

    public get current() { return this._current; }
    public set current(value) {
        this._current = value;
        this.emit('current-changed', value);
    }

    public get Rooms() { return this._rooms; }
    public set Rooms(value: object | Room[]) {
        if (Array.isArray(value)) {
            const or = value;
            const rooms = {};
            for (let r = 0, rl = or.length; r < rl; r++)
                rooms[or[r].num] = or[r];
            this._rooms = rooms;
        }
        else
            this._rooms = value || {};
        this._buildKeys();
        this._keys.forEach(key => {
            this._rooms[key] = this._normalizeRoom(this._rooms[key]);
            if (this._rooms[key].zone > this._zone)
                this._zone = this._rooms[key].zone;
            if (this._areas.indexOf(this._rooms[key].area) === -1)
                this._areas.push(this._rooms[key].area);
        });
        this._areas.sort();
    }
    public get Areas() {
        if (!this._areas) this._buildAreas();
        return this._areas;
    }
    public get zone() { return this._zone; }
    public set zone(value) { this._zone = value || 0; }

    public get count() { return this._keys.length; }

    constructor() {
        super();
        this._rooms = {};
        this._areas = [];
        this._zone = 0;
        this._keys = [];
        this._keysZones = [];
        this._current = new Room();
    }

    static load() {
        return new Promise((resolve, reject) => {
            localforage.getItem('nMapperData').then((value: any) => {
                const map = new Map()
                if (value && value.Rooms)
                    map.Rooms = value.Rooms;
                resolve(map);

            }).catch(reject);
        })
    }

    public save() {
        this.changed = false;
        return localforage.setItem('nMapperData', { Rooms: this._rooms, Areas: this.Areas, Keys: this._keys });
    }

    public getRoom(filter) {
        const keys = this._keys;
        const filterKeys = Object.keys(filter);
        const fl = filterKeys.length;
        roomLoop:
        for (let k = 0, kl = keys.length; k < kl; k++) {
            let room = this._rooms[keys[k]];
            for (let f = 0; f < fl; f++) {
                if (room[filterKeys[f]] !== filter[filterKeys[f]])
                    continue roomLoop;
            }
            return room;
        }
        return null;
    }

    public getRooms(filter) {
        const keys = this._keys;
        const filterKeys = Object.keys(filter);
        const fl = filterKeys.length;
        const rooms = [];
        roomLoop:
        for (let k = 0, kl = keys.length; k < kl; k++) {
            let room = this._rooms[keys[k]];
            for (let f = 0; f < fl; f++) {
                if (room[filterKeys[f]] !== filter[filterKeys[f]])
                    continue roomLoop;
            }
            rooms.push(room);
        }
        return rooms;
    }

    public roomExists(filter) {
        const keys = this._keysZones;
        const filterKeys = Object.keys(filter);
        const fl = filterKeys.length;
        if (keys.findIndex(key => {
            let room = this._rooms[key];
            for (let f = 0; f < fl; f++) {
                if (room[filterKeys[f]] !== filter[filterKeys[f]])
                    return false;
            }
            return true;
        }) !== -1)
            return true;
        return false;
    }

    public removeRoom(room) {
        if (typeof room === 'string')
            room = this._rooms[room];
        if (!room) return;
        if (this.Rooms[room.num]) {
            let idx = this._keys.indexOf(room.num);
            if (idx !== -1)
                this._keys.splice(idx, 1);
            idx = this._keysZones.indexOf(room.num);
            if (idx !== -1)
                this._keysZones.splice(idx, 1);
            delete this._rooms[room.num];
            this.changed = true;
            this.emit('rooms-removed', [room]);
            if (!this.getRoom({ area: room.area })) {
                let idx = this._areas.indexOf(room.area);
                this._areas.splice(idx, 1);
                this.emit('areas-removed', [room.area]);
            }
        }
    }

    public removeRooms(filter) {
        const keys = this._keys;
        const filterKeys = Object.keys(filter);
        const fl = filterKeys.length;
        const rooms = [];
        let idx;
        let areas = {};
        roomLoop:
        for (let k = keys.length - 1; k >= 0; k--) {
            let room = this._rooms[keys[k]];
            for (let f = 0; f < fl; f++) {
                if (room[filterKeys[f]] !== filter[filterKeys[f]])
                    continue roomLoop;
            }
            rooms.push(room);
            idx = this._keys.indexOf(room.num);
            if (idx !== -1)
                this._keys.splice(idx, 1);
            idx = this._keysZones.indexOf(room.num);
            if (idx !== -1)
                this._keysZones.splice(idx, 1);
            areas[room.area] = true;
            delete this._rooms[room.num];
        }
        if (rooms.length) {
            this.changed = true;
            this.emit('rooms-removed', rooms);
            for (let area in areas) {
                if (!this.getRoom({ area: area })) {
                    let idx = this._areas.indexOf(area);
                    this._areas.splice(idx, 1);
                }
            }
            this.emit('areas-removed', Object.keys(areas));
        }
    }

    public removeAllRooms() {
        const rooms = this._keys.map(key => this._rooms[key]);
        const areas = this._areas;
        this._rooms = {};
        this._keys = [];
        this._keysZones = [];
        this._areas = [];
        this._zone = 0;
        this.current = new Room();
        this.changed = true;
        this.emit('rooms-removed', rooms);
        this.emit('areas-removed', areas);
    }

    public setRoom(room: Room) {
        if (!room) return;
        this.changed = true;
        room = this._normalizeRoom(room);
        this.emit('before-room-changed', this._rooms[room.num]);
        this._rooms[room.num] = room;
        if (room.zone > this._zone)
            this._zone = room.zone;
        this._buildKeys();
        this.addArea(room.area);
        this.emit('room-changed', this._rooms[room.num]);
        return this._rooms[room.num];
    }

    public addArea(area) {
        if (!area) return 0;
        if (this._areas.indexOf(area) !== -1) return;
        this._areas.push(area);
        this._areas.sort();
        this.emit('areas-added', [area]);
    }

    public getFreeZone(zone) {
        if (!zone) zone = 0;
        if (zone > this.zone)
            return zone;
        return ++this.zone;
    }

    private _normalizeRoom(r) {
        const id = '' + (r.num || r.ID);
        const room = {
            area: r.Area || r.area || '',
            details: r.Details || r.details || RoomDetails.None,
            name: r.Name || r.name || '',
            env: r.Env || r.env || r.environment || '',
            x: +r.X || +r.x || 0,
            y: +r.Y || +r.y || 0,
            z: +r.Z || +r.z || 0,
            zone: +r.Zone || +r.zone || 0,
            indoors: +r.Indoors || +r.indoors || 0,
            background: r.Background || r.background || '',
            notes: r.Notes || r.notes || '',
            num: id ? '' + id : null,
            exits: r.exits || {}
        };
        if (room.exits) {
            let exit;
            let dest;
            for (exit in room.exits) {
                if (!room.exits.hasOwnProperty(exit)) continue;
                dest = room.exits[exit].DestID || room.exits[exit].num || null;
                room.exits[exit] = {
                    num: dest ? '' + dest : null,
                    isdoor: +room.exits[exit].IsDoor || +room.exits[exit].isdoor || null,
                    isclosed: +room.exits[exit].IsClosed || +room.exits[exit].isclosed || null
                };
            }
        }
        return new Room(room);
    }

    private _buildKeys() {
        this._keys = Object.keys(this._rooms).sort((a, b) => {
            const aRoom = this._rooms[a];
            const bRoom = this._rooms[b];
            if (aRoom.x > bRoom.x) return 1;
            if (aRoom.x < bRoom.x) return -1;
            if (aRoom.y > bRoom.y) return 1;
            if (aRoom.y < bRoom.y) return -1;
            if (aRoom.z > bRoom.z) return 1;
            if (aRoom.z < bRoom.z) return -1;
            if (aRoom.zone > bRoom.zone) return 1;
            if (aRoom.zone < bRoom.zone) return -1;
            return a.localeCompare(b);
        });
        this._keysZones = this._keys.slice().sort((a, b) => {
            const aRoom = this._rooms[a];
            const bRoom = this._rooms[b];
            if (aRoom.zone > bRoom.zone) return 1;
            if (aRoom.zone < bRoom.zone) return -1;
            return a.localeCompare(b);
        });
    }

    private _buildAreas() {
        this._areas = [];
        this._keys.forEach(key => {
            if (this._areas.indexOf(this._rooms[key].area) === -1)
                this._areas.push(this._rooms[key].area);
        });
        this._areas.sort();
    }

    private _cancel;
    public cancelImport() {
        this._cancel = true;
    }

    public async import(data, type: ImportType) {
        if (!data || data === null || typeof data == 'undefined') {
            return;
        }
        this._cancel = false;
        if (!Array.isArray(data))
            data = Object.values(data);
        if (type === ImportType.Replace)
            this.removeAllRooms();
        this.emit('import-progress', 0);
        const rl = data.length;
        let room;
        const areas = {};
        this._areas.forEach(area => areas[area] = true);
        const rooms = [];
        for (let r = 0; r < rl; r++) {
            if (this._cancel)
                break;
            this.emit('import-progress', Math.floor(r / rl * 100));
            if (data[r] === null) continue;
            room = this._normalizeRoom(data[r]);
            this._rooms[room.num] = room;
            if (room.zone > this._zone)
                this._zone = room.zone;
            areas[room.area] = true;
            rooms.push(room);
        }
        this.emit('rooms-changed', rooms);
        this._areas = Object.keys(areas);
        this._areas.sort();
        this.emit('areas-added', Object.keys(areas));
        this._buildKeys();
        this.changed = true;
        if (this._cancel)
            this.emit('import-canceled');
        else
            this.emit('import-complete');

    }
}
