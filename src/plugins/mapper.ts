import "../css/mapper.css";
import { Client } from './../client';
import { Plugin } from '../plugin';
import { MenuItem } from '../types';
import { MapDisplay } from '../interface/mapdisplay';
import { Map, Room, RoomDetails, ImportType } from '../map';
import { Dialog, DialogButtons, ProgressDialog } from '../interface/dialog';
import { removeHash } from '../interface/interface';
import { debounce, readFile, openFileDialog } from "../library";
import { Splitter, Orientation } from "../interface/splitter";

//store menu and room editor as htm file for easier editing
// @ts-ignore
import mapperMenu from '../html/mapper.menu.htm'
// @ts-ignore
import mapperRoom from '../html/mapper.room.htm'

declare let bootstrap;
declare let confirm_box;
declare let alert_box;
declare let progress_box;

interface MapperOptions {
    client: Client;
}

export class Mapper extends Plugin {
    private _map: Map;
    private _clientContainer;
    private _miniMap: MapDisplay;
    private _dialog: Dialog;
    private _dialogMap: MapDisplay;
    private _dialogSplitter: Splitter;
    private _dialogProgress: ProgressDialog;

    constructor(options?: MapperOptions | Client) {
        super(options instanceof Client ? options : options?.client);
        if (options && !(options instanceof Client)) {

        }
        //this._miniMap = new MapDisplay(document.createElement('div'));
        //this._miniMap.showNavigation = false;
        //document.body.appendChild(this._miniMap.container);
        //this._miniMap.container.classList.add('mini-map', 'map');
        //this._clientContainer = document.getElementById('client-container');
        //this._clientContainer.style.left = '205px';
        Map.load().then((map: Map) => {
            this.map = map;
            //this._miniMap.map = map;
            //onload lets query the mud for current room info, if not connect will do nothing
            this.client.sendGMCP('Room.Info');
        }).catch(err => this.client.error(err));
    }

    public remove(): void {
        if (!this.client) return;
        this.client.removeListenersFromCaller(this);
        let idx = this.client.telnet.GMCPSupports.indexOf('Room 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
    }
    public initialize(): void {
        if (!this.client) return;
        this.client.telnet.GMCPSupports.push('Room 1');
        this.client.on('received-GMCP', this.processGMCP, this);
        this.client.on('window', (window, args, name) => {
            if (window === 'mapper') {
                if (args === 'close') {
                    if (this._dialog) this._dialog.close();
                }
                else
                    this.show();
            }
        });
        this.client.on('close-window', window => {
            if (window === 'mapper' && this._dialog) this._dialog.close();
        });
        this.client.on('options-loaded', () => {
            if (this._dialogMap) {
                this._dialogMap.commandDelay = client.getOption('commandDelay');
                this._dialogMap.commandDelayCount = client.getOption('commandDelayCount');

                this._dialogMap.enabled = this.client.getOption('mapper.enabled');
                if (this._dialogMap.enabled)
                    this._dialog.body.querySelector('#mapper-enable').classList.add('active');
                else
                    this._dialog.body.querySelector('#mapper-enable').classList.remove('active');

                this._dialogMap.showLegend = this.client.getOption('mapper.legend');
                if (this._dialogMap.showLegend)
                    this._dialog.body.querySelector('#mapper-legend').classList.add('active');
                else
                    this._dialog.body.querySelector('#mapper-legend').classList.remove('active');

                this._dialogMap.follow = this.client.getOption('mapper.follow');
                if (this._dialogMap.follow)
                    this._dialog.body.querySelector('#mapper-follow').classList.add('active');
                else
                    this._dialog.body.querySelector('#mapper-follow').classList.remove('active');

                this._dialogMap.splitArea = this.client.getOption('mapper.split');
                if (this._dialogMap.splitArea)
                    this._dialog.body.querySelector('#mapper-split').classList.add('active');
                else
                    this._dialog.body.querySelector('#mapper-split').classList.remove('active');

                this._dialogMap.fillWalls = this.client.getOption('mapper.fill');
                if (this._dialogMap.fillWalls)
                    this._dialog.body.querySelector('#mapper-fill').classList.add('active');
                else
                    this._dialog.body.querySelector('#mapper-fill').classList.remove('active');

                if (this._dialogMap.follow)
                    this._dialogMap.focusCurrentRoom();
            }
            if (this._dialog)
                this._dialog.resetState(Object.assign({ persistent: true }, client.getWindowState('mapper') || { center: true }));
            let options = client.getWindowState('mapper');
            if ((options && options.show) || this.client.getOption('showMapper'))
                this.show();
        });
        this.on('debug', e => this.client.debug(e), this);
        this.on('error', e => this.client.error(e), this);
        let options = client.getWindowState('mapper');
        if ((options && options.show) || this.client.getOption('showMapper'))
            this.show();
    }
    get menu(): MenuItem[] {
        return [
            {
                name: '-',
                position: 5,
                exists: '#menu-plugins',
                id: 'plugins'
            },
            {
                name: ' Show mapper',
                action: e => { this.show() },
                icon: '<i class="bi bi-map"></i>',
                position: 6
            }]
    }
    get settings(): MenuItem[] {
        return [{
            name: ' Mapper',
            action: 'settings-mapper',
            icon: '<i class="bi bi-map"></i>',
            position: 7
        }]
    }

    get map(): Map { return this._map; }
    set map(map: Map) {
        this._map = map;
        if (this._dialogMap)
            this._dialogMap.map = map;
        this.emit('map-loaded');
        //this.miniMap.map = this._map;
    }

    /**
     * processGMCP - process incoming GMCP for Room events
     * @param {string} mod Client#received-GMCP module
     * @param {Object} data Client#received-GMCP data object
     */
    public async processGMCP(mod: string, data: any) {
        if (!this.client.getOption('mapper.enabled')) return;
        switch (mod) {
            case 'Room.Info':
                this.processData(data);
                break;
            case 'Room.WrongDir':
                break;
        }
    }

    public processData(data) {
        if (!this._map) {
            setTimeout(() => {
                this.processData(data);
            }, 10);
            return;
        }
        try {

            let room = this._map.getRoom({ num: '' + data.num });;
            if (!room) {
                room = new Room();
                room.zone = this._map.current.zone;
                if (this._map.current.num !== null) {
                    switch (data.prevroom.dir) {
                        case 'west':
                            room.x--;
                            break;
                        case 'east':
                            room.x++;
                            break;
                        case 'north':
                            room.y--;
                            break;
                        case 'south':
                            room.y++;
                            break;
                        case 'northeast':
                            room.y--;
                            room.x++;
                            break;
                        case 'northwest':
                            room.y--;
                            room.x--;
                            break;
                        case 'southeast':
                            room.y++;
                            room.x++;
                            break;
                        case 'southwest':
                            room.y++;
                            room.x--;
                            break;
                        case 'up':
                            room.z++;
                            break;
                        case 'down':
                            room.z--;
                            break;
                        //out means you leave a zone
                        case 'out':
                            room.zone = this._map.current.zone - 1;
                            break;
                        //enter or unknown exits new zone
                        default:
                            //if (val.area == currentRoom.area)
                            room.zone = this._map.current.zone + 1;
                            break;
                    }
                    room.x += this._map.current.x;
                    room.y += this._map.current.y;
                    room.z += this._map.current.z;
                }
                if (data.area === this._map.current.area) {
                    if (this._map.roomExists({ x: room.x, y: room.y, z: room.z, zone: this._map.current.zone, area: this._map.current.area }) || data.prevroom.zone) {
                        room.zone = this._map.getFreeZone(this._map.current.zone);
                        this._updateCurrent(room, data);
                    }
                    else {
                        this._updateCurrent(room, data);
                    }
                }
                else if (this._map.roomExists({ x: room.x, y: room.y, z: room.z, zone: this._map.current.zone }) || data.prevroom.zone) {
                    room.zone = this._map.getFreeZone(this._map.current.zone);
                    this._updateCurrent(room, data);
                }
                else {
                    this._updateCurrent(room, data);
                }
            }
            else {
                this._updateCurrent(room, data);
            }
            this._map.save().catch(err => this.client.error(err));
        }
        catch (e) {
            this.emit('error', e);
        }
    }

    private _updateCurrent(room, data) {
        room.num = data.num;
        room.area = data.area;
        room.name = data.name;
        room.env = data.environment;
        room.indoors = data.indoors;
        let exit;
        for (exit in data.exits)
            room.exits[exit] = data.exits[exit];
        //start with none
        room.details = RoomDetails.None;
        if (typeof data.details === 'number')
            room.details = data.details;
        else
            for (let x = 0; x < data.details.length; x++) {
                switch (data.details[x]) {
                    case 'dock':
                        room.details |= RoomDetails.Dock;
                        break;
                    case 'pier':
                        room.details |= RoomDetails.Pier;
                        break;
                    case 'bank':
                        room.details |= RoomDetails.Bank;
                        break;
                    case 'shop':
                        room.details |= RoomDetails.Shop;
                        break;
                    case 'hospital':
                        room.details |= RoomDetails.Hospital;
                        break;
                    case 'bar':
                        room.details |= RoomDetails.Bar;
                        break;
                    case 'restaurant':
                        room.details |= RoomDetails.Restaurant;
                        break;
                    case 'watersource':
                        room.details |= RoomDetails.WaterSource;
                        break;
                    case 'trainer':
                    case 'training':
                    case 'advance':
                        room.details |= RoomDetails.Trainer;
                        break;
                    case 'stable':
                        room.details |= RoomDetails.Stable;
                        break;
                }
            }
        room = this._map.setRoom(room);
        this._map.current = room.clone();
        this.emit('current-changed', this._map.current);
    }

    /**
     * debug - emit debug event if enabledDebug on
     * @param {string | object} e The debug message or an object of data 
     */
    public debug(e) {
        this.emit('debug', e);
    }

    public refresh() {
        //this.miniMap.refresh();
    }

    public createDialog() {
        if (this._dialog) return;
        this._dialog = new Dialog(Object.assign({ persistent: true }, client.getWindowState('mapper') || { center: true }, { title: '<i class="bi bi-map"></i><select id="mapper-area" class="form-select form-select-sm me-2 mb-1" title="Select Area"></select>', id: 'win-mapper', noFooter: true, minHeight: 350 }));
        this._dialog.on('resized', e => {
            this.client.setOption('windows.mapper', e);
            debounce(() => {
                this._dialogSplitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
            }, 25, 'mapper-resize');
        });
        this._dialog.on('moved', e => {
            this.client.setOption('windows.mapper', e);
        })
        this._dialog.on('maximized', () => {
            this.client.setOption('windows.mapper', this._dialog.windowState);
            debounce(() => {
                this._dialogSplitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
            }, 25, 'mapper-resize');
        });
        this._dialog.on('restored', () => {
            this.client.setOption('windows.mapper', this._dialog.windowState);
            debounce(() => {
                this._dialogSplitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
            }, 25, 'mapper-resize');
        });
        this._dialog.on('shown', () => {
            this.client.setOption('windows.mapper', this._dialog.windowState);
            this.client.setOption('showMapper', this._dialog.windowState.show !== 0);
            this._dialogSplitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
        });
        this._dialog.on('closing', () => {

        });
        this._dialog.on('closed', () => {
            this.client.setOption('windows.mapper', this._dialog.windowState);
            this.client.setOption('showMapper', this._dialog.windowState.show !== 0);
            if (this._dialog && !this._dialog.persistent) {
                if (this._map)
                    this._map.removeListenersFromCaller(this._dialog);
                this._dialogMap.map = null;
                delete this._dialogMap;
                this._dialogMap = null;
                delete this._dialog;
                this._dialog = null;
            }
            removeHash('mapper');
        });
        this._dialog.on('canceling', () => {

        });
        this._dialog.on('canceled', () => {
            this.client.setOption('windows.mapper', this._dialog.windowState);
            this.client.setOption('showMapper', this._dialog.windowState.show !== 0);
            if (this._dialog && !this._dialog.persistent) {
                if (this._map)
                    this._map.removeListenersFromCaller(this._dialog);
                this._dialogMap.map = null;
                delete this._dialogMap;
                this._dialogMap = null;
                delete this._dialog;
                this._dialog = null;
            }
            removeHash('mapper');
        });
        this._dialog.on('resizing', () => {
            this._dialogSplitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
        });

        const toolbar = document.createElement('nav');
        toolbar.id = 'mapper-toolbar';
        toolbar.classList.add('navbar', 'bg-light', 'align-items-center');
        toolbar.innerHTML = `<form class="container-fluid justify-content-start"><button id="btn-mapper-menu" class="me-2 mb-1 btn-sm btn btn-outline-secondary" type="button" aria-controls="mapper-menu" title="Show menu" aria-expanded="false" data-bs-toggle="offcanvas" data-bs-target="#mapper-menu" aria-controls="mapper-menu"><i class="fa-solid fa-bars"></i></button><button id="btn-mapper-focus" type="button" class="btn btn-sm btn-outline-secondary me-2 mb-1" title="Focus on current room"><i class="fa fa-crosshairs"></i></button><div class="btn-group me-2 mb-1"><label for="mapper-level" class="mt-1 me-1">Level: </label><input id="mapper-level" class="form-control form-control-sm" type="number" title="Map Level"></div><div class="btn-group me-2 mb-1"><label for="mapper-zone" class="mt-1 me-1">Zone: </label><input id="mapper-zone" class="form-control form-control-sm" type="number" title="Map Zone"></div><div class="btn-group me-2 mb-1"><label for="mapper-zoom" class="me-1">Zoom: </label><input id="mapper-zoom" class="form-range" type="range" min="25" max="300" step="5""><label id="mapper-zoom-display">100%</label></div></form>`;
        this._dialog.body.appendChild(toolbar);
        this._dialog.body.insertAdjacentHTML('afterbegin', mapperMenu);
        this._dialog.body.querySelector('#mapper-enable a').addEventListener('click', () => {
            this._dialogMap.enabled = !this._dialogMap.enabled;
            if (this._dialogMap.enabled)
                this._dialog.body.querySelector('#mapper-enable').classList.add('active');
            else
                this._dialog.body.querySelector('#mapper-enable').classList.remove('active');
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-legend a').addEventListener('click', () => {
            this._dialogMap.showLegend = !this._dialogMap.showLegend;
            if (this._dialogMap.showLegend)
                this._dialog.body.querySelector('#mapper-legend').classList.add('active');
            else
                this._dialog.body.querySelector('#mapper-legend').classList.remove('active');
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-room a').addEventListener('click', () => {
            this._dialogSplitter.panel2Collapsed = !this._dialogSplitter.panel2Collapsed;
            if (this._dialogSplitter.panel2Collapsed) {
                this._dialog.dialog.dataset.panel = "left";
                this._dialog.body.querySelector('#mapper-room').classList.remove('active');
                this._dialog.body.querySelector('#mapper-room').title = 'Show room properties';
                this._dialog.body.querySelector('#mapper-room a span').textContent = 'Show room properties';
            }
            else {
                this._dialog.dialog.dataset.panel = "right";
                this._dialog.body.querySelector('#mapper-room').classList.add('active');
                this._dialog.body.querySelector('#mapper-room').title = 'Hide room properties';
                this._dialog.body.querySelector('#mapper-room a span').textContent = 'Hide room properties';
            }
            this._dialogSplitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
            this.client.setOption('mapper.room', !this._dialogSplitter.panel2Collapsed);
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-refresh a').addEventListener('click', () => {
            this._dialogMap.refresh();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-split a').addEventListener('click', () => {
            this._dialogMap.splitArea = !this._dialogMap.splitArea;
            if (this._dialogMap.splitArea)
                this._dialog.body.querySelector('#mapper-split').classList.add('active');
            else
                this._dialog.body.querySelector('#mapper-split').classList.remove('active');
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-fill a').addEventListener('click', () => {
            this._dialogMap.fillWalls = !this._dialogMap.fillWalls;
            if (this._dialogMap.fillWalls)
                this._dialog.body.querySelector('#mapper-fill').classList.add('active');
            else
                this._dialog.body.querySelector('#mapper-fill').classList.remove('active');
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-follow a').addEventListener('click', () => {
            this._dialogMap.follow = !this._dialogMap.follow;
            if (this._dialogMap.follow)
                this._dialog.body.querySelector('#mapper-follow').classList.add('active');
            else
                this._dialog.body.querySelector('#mapper-follow').classList.remove('active');
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-focus a').addEventListener('click', () => {
            this._dialogMap.focusCurrentRoom();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-set-current a').addEventListener('click', () => {
            this._dialogMap.current = this._dialogMap.selected;
            closeMenu();
        });

        this._dialog.body.querySelector('#btn-mapper-focus').addEventListener('click', () => {
            this._dialogMap.focusCurrentRoom();
            closeMenu();
        });


        this._dialog.body.querySelector('#mapper-highlight-path a').addEventListener('click', () => {
            this._dialogMap.focusCurrentRoom();
            this._dialogMap.showPath();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-clear-path a').addEventListener('click', () => {
            this._dialogMap.clearPath();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-walk-path a').addEventListener('click', () => {
            this._dialogMap.walkPath();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-walk-highlighted-path a').addEventListener('click', () => {
            this._dialogMap.walkMarkedPath();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-copy-path a').addEventListener('click', () => {
            this._dialogMap.copyPath('\n');
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-copy-stacked a').addEventListener('click', () => {
            this._dialogMap.copyPath(this.client.getOption('commandStackingChar'));
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-copy-speedpath a').addEventListener('click', () => {
            this._dialogMap.copySpeedpath();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-copy-highlighted-path a').addEventListener('click', () => {
            this._dialogMap.copyMarkedPath('\n');
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-copy-highlighted-stacked a').addEventListener('click', () => {
            this._dialogMap.copyMarkedPath(this.client.getOption('commandStackingChar'));
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-remove-selected a').addEventListener('click', () => {
            confirm_box('Remove selected room?', `Are you sure you want to remove selected room?`).then(e => {
                if (e.button === DialogButtons.Yes)
                    this._dialogMap.clearSelectedRoom();
            });
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-remove-current a').addEventListener('click', () => {
            confirm_box('Remove current room?', `Are you sure you want to remove current room?`).then(e => {
                if (e.button === DialogButtons.Yes)
                    this._dialogMap.clearCurrentRoom();
            });
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-remove-current-area a').addEventListener('click', () => {
            confirm_box('Remove current area?', `Are you sure you want to remove all rooms from current area?`).then(e => {
                if (e.button === DialogButtons.Yes)
                    this._dialogMap.clearArea();
            });
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-remove-all a').addEventListener('click', () => {
            confirm_box('Remove all rooms and areas?', `Are you sure you want to remove all rooms?`).then(e => {
                if (e.button === DialogButtons.Yes)
                    this._dialogMap.clearAll();
            });
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-export-image a').addEventListener('click', () => {
            this._dialogMap.exportImage();
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-export-scaled-image a').addEventListener('click', () => {
            this._dialogMap.exportImage(true);
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-export-current-image a').addEventListener('click', () => {
            this._dialogMap.exportCurrentImage();
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-export-current-area a').addEventListener('click', () => {
            this._dialogMap.exportArea();
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-export-all a').addEventListener('click', () => {
            this._dialogMap.exportAll();
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-import-merge a').addEventListener('click', () => {
            openFileDialog('Import map and merge', false).then(files => {
                readFile(files[0]).then((data: any) => {
                    this.import(data, ImportType.Merge);
                }).catch(client.error);
            }).catch(() => { });
            closeMenu();
        });
        this._dialog.body.querySelector('#mapper-import-replace a').addEventListener('click', () => {
            confirm_box('Import and Replace?', `Are you sure you want to remove all rooms and replace them?`).then(e => {
                if (e.button === DialogButtons.Yes)
                    openFileDialog('Import map and replace', false).then(files => {
                        readFile(files[0]).then((data: any) => {
                            this.import(data, ImportType.Replace);
                        }).catch(client.error);
                    }).catch(() => { });
            });
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-copy-highlighted-speedpath a').addEventListener('click', () => {
            this._dialogMap.copyMarkedSpeedpath();
            closeMenu();
        });

        this._dialog.body.querySelector('#mapper-about a').addEventListener('click', () => {
            alert_box({ title: '<i class="fa-solid fa-circle-info"></i> Map information', width: 300, height: 200, keepCentered: true, center: true, resizable: false, moveable: false, maximizable: false, buttons: DialogButtons.Ok }, `Areas: ${this._map.Areas.length}<br>Rooms: ${this._map.count}<br>Highest zone: ${this._map.zone}`, 2);
            closeMenu();
        });

        this._dialogMap = new MapDisplay(document.createElement('div'), { map: this._map });

        this._dialogMap.on('error', e => this.client.error(e), this);

        this._dialogMap.on('remove-selected', () => {
            confirm_box('Remove selected room?', `Are you sure you want to remove selected room?`).then(e => {
                if (e.button === DialogButtons.Yes)
                    this._dialogMap.clearSelectedRoom();
            });
        });

        this._dialogMap.on('active-room-changed', room => {
            const area = this._dialog.header.querySelector('#mapper-area') as HTMLSelectElement;
            if (!room.area || room.area.length === 0) {
                if (area.options.length)
                    area.value = area.options[0].value;
            }
            else {
                if (!area.querySelectorAll(`option[value="${room.area.replace(/"/g, '&quot;')}"]`).length) {
                    area.insertAdjacentHTML('beforeend', `<option value="${room.area.replace(/"/g, '&quot;')}">${room.area}</option>`);
                    this._dialog.body.querySelector('#mapper-room-area').insertAdjacentHTML('beforeend', `<option value="${room.area.replace(/"/g, '&quot;')}">${room.area}</option>`);
                }
                area.value = room.area;
            }
            (this._dialog.body.querySelector('#mapper-level') as HTMLInputElement).value = room.z;
            (this._dialog.body.querySelector('#mapper-zone') as HTMLInputElement).value = room.zone;
            room = room.clone();
            room.ID = room.num;
            delete room.num;
            this.client.setOption('mapper.active', room);
        });

        this._dialogMap.on('setting-changed', (setting, value) => {
            if (setting === 'active') {
                (this._dialog.header.querySelector('#mapper-area') as HTMLInputElement).value = value.area;
                (this._dialog.body.querySelector('#mapper-level') as HTMLInputElement).value = value.z;
                (this._dialog.body.querySelector('#mapper-zone') as HTMLInputElement).value = value.zone;
            }
            else if (setting === 'scale') {
                (this._dialog.body.querySelector('#mapper-zoom') as HTMLInputElement).value = value;
                this._dialog.body.querySelector('#mapper-zoom-display').textContent = value + '%';
            }
            this.client.setOption(`mapper.${setting}`, value);
        });

        this._dialog.header.querySelector('#mapper-area').addEventListener('change', e => {
            this._dialogMap.setArea((e.currentTarget as HTMLSelectElement).value);
        });
        this._dialog.body.querySelector('#mapper-level').addEventListener('change', e => {
            this._dialogMap.setLevel(parseInt((e.currentTarget as HTMLInputElement).value, 10));
        });
        this._dialog.body.querySelector('#mapper-zone').addEventListener('change', e => {
            this._dialogMap.setZone(parseInt((e.currentTarget as HTMLInputElement).value, 10));
        });

        this._dialogSplitter = new Splitter({ id: 'mapper', parent: this._dialog.body, orientation: Orientation.vertical });
        this._dialogSplitter.on('splitter-moved', (e) => {
            this.client.setOption('mapper.roomWidth', e);
        });
        this._dialogSplitter.panel2Collapsed = true;
        if (this.client.getOption('mapper.room'))
            this._dialog.body.querySelector('#mapper-room a').click();
        this._dialogSplitter.SplitterDistance = client.getOption('mapper.roomWidth');
        this._dialogSplitter.panel2.innerHTML = mapperRoom;
        this._dialog.body.querySelector('#mapper-room-close').addEventListener('click', () => {
            this._dialog.body.querySelector('#mapper-room a').click();
        });
        this._dialog.body.querySelector('#mapper-room-accordion').querySelectorAll('input,textarea,select,.accordion-body button').forEach((f: HTMLInputElement) => {
            f.disabled = true;
            if (f.tagName === 'BUTTON') return;
            if (f.type === 'checkbox') {
                f.addEventListener('change', e => {
                    if (this._dialogMap.selected === null || this._dialogMap.selected.num === null) return;
                    const target = (e.currentTarget || e.target) as HTMLInputElement;
                    const name = f.name || (f.id).substring(12);
                    if (target.dataset.enum === 'true') {
                        const name = target.name || target.id.substring(0, target.id.lastIndexOf('-'));
                        const enums = this._dialog.body.querySelector('#mapper-room-accordion').querySelectorAll(`[name=${name}]`);
                        let value = 0;
                        for (let e = 0, el = enums.length; e < el; e++) {
                            if ((enums[e] as HTMLInputElement).checked)
                                value |= +(enums[e] as HTMLInputElement).value;
                        }
                        this._dialogMap.selected[name] = value;
                    }
                    else
                        this._dialogMap.selected[name] = target.checked;
                    this._map.setRoom(this._dialogMap.selected);
                    this._map.save().catch(err => this.client.error(err));
                });
            }
            else {
                f.addEventListener('change', e => {
                    if (this._dialogMap.selected === null || this._dialogMap.selected.num === null) return;
                    const name = f.name || f.id.substring(12);
                    debounce(() => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        this._dialogMap.selected[name] = target.value;
                        this._map.setRoom(this._dialogMap.selected);
                        this._map.save().catch(err => this.client.error(err));
                    }, 100, name);
                });
                f.addEventListener('input', e => {
                    if (this._dialogMap.selected === null || this._dialogMap.selected.num === null) return;
                    const name = f.name || f.id.substring(12);
                    debounce(() => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        this._dialogMap.selected[name] = target.value;
                        this._map.setRoom(this._dialogMap.selected);
                    }, 100, name);
                });
            }
        });
        this._dialogMap.on('room-selected', room => {
            this._dialog.body.querySelector('#mapper-room-accordion').querySelectorAll('input,textarea,select,.accordion-body button').forEach((f: HTMLInputElement) => {
                if (room === null || room.num === null) {
                    f.disabled = true;
                    if (f.tagName === 'BUTTON') return;
                    if (f.type === 'checkbox')
                        f.checked = false;
                    else
                        f.value = '';
                }
                else {
                    f.disabled = false;
                    if (f.tagName === 'BUTTON') return;
                    const name = f.name || (f.id).substring(12);
                    if (f.type === 'checkbox') {
                        if (f.dataset.enum === 'true') {
                            const value = +f.value;
                            f.checked = (room[name] & value) === value;
                        }
                        else
                            f.checked = room[name];
                    }
                    else
                        f.value = room[name];
                }
            });
            const selected = room;
            const current = this._map.current;
            this._updateMenu('#mapper-remove-selected a', selected === null || selected.num === null);
            this._updateMenu('#mapper-set-current a', selected === null || selected.num === null);
            this._updateMenu('#mapper-highlight-path a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-walk-path a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-copy-path a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-copy-stacked a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-copy-speedpath a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
        });
        this._dialogMap.on('current-changed', room => {
            const selected = this._dialogMap.selected;
            const current = room;
            this._updateMenu('#mapper-remove-current a', current === null || current.num === null);
            this._updateMenu('#mapper-remove-selected a', selected === null || selected.num === null);
            this._updateMenu('#mapper-set-current a', selected === null || selected.num === null);
            this._updateMenu('#mapper-highlight-path a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-walk-path a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-copy-path a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-copy-stacked a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
            this._updateMenu('#mapper-copy-speedpath a', selected === null || selected.num === null || !current || current.num === null || selected.num === current.num);
        });

        this._dialogMap.on('path-shown', () => {
            this._updateMenu('#mapper-highlight-path a', false);
            this._updateMenu('#mapper-walk-path a', false);
            this._updateMenu('#mapper-walk-highlighted-path a', false);
            this._updateMenu('#mapper-clear-path a', false);
            this._updateMenu('#mapper-copy-highlighted-path a', false);
            this._updateMenu('#mapper-copy-highlighted-stacked a', false);
            this._updateMenu('#mapper-copy-highlighted-speedpath a', false);
        });

        this._dialogMap.on('path-cleared', () => {
            this._updateMenu('#mapper-clear-path a', true);
            this._updateMenu('#mapper-walk-highlighted-path a', true);
            this._updateMenu('#mapper-copy-highlighted-path a', true);
            this._updateMenu('#mapper-copy-highlighted-stacked a', true);
            this._updateMenu('#mapper-copy-highlighted-speedpath a', true);
        });

        const el = this._dialog.body.querySelector('#mapper-room-env')
        let items = this._dialog.body.querySelectorAll('#mapper-room-terrains .active');
        let i, il;
        for (i = 0, il = items.length; i < il; i++)
            items[i].classList.remove('active');
        items = this._dialog.body.querySelectorAll('#mapper-room-terrains .dropdown-item');
        for (i = 0, il = items.length; i < il; i++) {
            items[i].addEventListener('click', function () {
                el.value = this.textContent;
                el.dispatchEvent(new Event('change'));
            });
        }
        el.nextElementSibling.addEventListener('show.bs.dropdown', event => {
            let items = this._dialog.body.querySelectorAll('#mapper-room-terrains .dropdown-item');
            for (i = 0, il = items.length; i < il; i++) {
                items[i].classList.remove('active');
                if (el.value === items[i].textContent)
                    items[i].classList.add('active');
            };
        });

        this._dialogSplitter.panel1.append(this._dialogMap.container);
        this._dialogMap.container.classList.add('map');

        this._dialogMap.active = new Room(client.getOption('mapper.active'));
        this._dialogMap.active.num = this._dialogMap.active.num || (this._dialogMap.active as any).ID;
        this._dialogMap.commandDelay = client.getOption('commandDelay');
        this._dialogMap.commandDelayCount = client.getOption('commandDelayCount');

        this._dialogMap.on('debug', msg => {
            this.client.debug(msg);
        });
        (this._dialog.body.querySelector('#mapper-level') as HTMLInputElement).value = '' + this._dialogMap.active.z;
        (this._dialog.body.querySelector('#mapper-zone') as HTMLInputElement).value = '' + this._dialogMap.active.zone;
        this._dialog.body.querySelector('#mapper-zoom').addEventListener('input', e => {
            this._dialogMap.scale = +(e.currentTarget as HTMLInputElement).value;
        });

        const initMapper = () => {
            const m = this._map.Areas.length;
            const area = this._dialog.header.querySelector('#mapper-area') as HTMLSelectElement;
            let h = '';
            for (let i = 0; i < m; i++)
                h += `<option value="${this._map.Areas[i].replace(/"/g, '&quot;')}">${this._map.Areas[i]}</option>`;
            area.innerHTML = h;
            this._dialog.body.querySelector('#mapper-room-area').innerHTML = h;
            if (this._dialogMap.active.area && this._map.Areas.indexOf(this._dialogMap.active.area) !== -1)
                area.value = this._dialogMap.active.area;
            else if (m > 0) {
                this._dialogMap.active.area = this.map.Areas[0];
                this._dialogMap.emit('setting-changed', 'active', this._dialogMap.active.area);
                area.value = this._dialogMap.active.area;
            }
            this._dialogMap.refresh();

            this._dialogMap.enabled = this.client.getOption('mapper.enabled');
            if (this._dialogMap.enabled)
                this._dialog.body.querySelector('#mapper-enable').classList.add('active');

            this._dialogMap.showLegend = this.client.getOption('mapper.legend');
            if (this._dialogMap.showLegend)
                this._dialog.body.querySelector('#mapper-legend').classList.add('active');

            this._dialogMap.follow = this.client.getOption('mapper.follow');
            if (this._dialogMap.follow)
                this._dialog.body.querySelector('#mapper-follow').classList.add('active');

            this._dialogMap.splitArea = this.client.getOption('mapper.split');
            if (this._dialogMap.splitArea)
                this._dialog.body.querySelector('#mapper-split').classList.add('active');

            this._dialogMap.fillWalls = this.client.getOption('mapper.fill');
            if (this._dialogMap.fillWalls)
                this._dialog.body.querySelector('#mapper-fill').classList.add('active');

            if (this._dialogMap.follow)
                this._dialogMap.focusCurrentRoom();
            this._dialogMap.scale = this.client.getOption('mapper.scale');
            this._map.on('rooms-removed', rooms => {
                this._map.save();
            }, this._dialog);

            this._map.on('areas-removed', areas => {
                const area = this._dialog.header.querySelector('#mapper-area') as HTMLSelectElement;
                const roomArea = this._dialog.body.querySelector('#mapper-room-area') as HTMLSelectElement;
                if (this._map.Areas.length === 0) {
                    area.innerHTML = '';
                    roomArea.innerHTML = '';
                }
                else {
                    for (let i = area.length - 1; i >= 0; i--) {
                        if (areas.indexOf(area.options[i].value) !== -1)
                            area.remove(i);
                    }
                    for (let i = roomArea.length - 1; i >= 0; i--) {
                        if (areas.indexOf(roomArea.options[i].value) !== -1)
                            roomArea.remove(i);
                    }
                }
            }, this._dialog);
            this._map.on('areas-added', areas => {
                //TODO recode to insert the area at correct index instead of rebuilding full list
                let h = '';
                const m = this._map.Areas.length;
                for (let i = 0; i < m; i++)
                    h += `<option value="${this._map.Areas[i].replace(/"/g, '&quot;')}">${this._map.Areas[i]}</option>`;
                this._dialog.header.querySelector('#mapper-area').innerHTML = h;
                this._dialog.body.querySelector('#mapper-room-area').innerHTML = h;
                if (this._dialogMap.active.area && this._map.Areas.indexOf(this._dialogMap.active.area) !== -1)
                    (this._dialog.header.querySelector('#mapper-area') as HTMLSelectElement).value = this._dialogMap.active.area;
                else if (m > 0) {
                    this._dialogMap.active.area = this.map.Areas[0];
                    this._dialogMap.emit('setting-changed', 'active', this._dialogMap.active.area);
                    (this._dialog.header.querySelector('#mapper-area') as HTMLSelectElement).value = this._dialogMap.active.area;
                }
            }, this._dialog);

            this._map.on('import-progress', progress => {
                if (this._dialogProgress)
                    this._dialogProgress.progress = progress;
            }, this._dialog);
            this._map.on('import-complete', () => {
                client.sendGMCP('Room.Info');
                if (this._dialogProgress)
                    this._dialogProgress.close();
                this._dialogProgress = null;
                this._dialogMap.refresh();
                this._map.save();
            }, this._dialog);
            this._map.on('import-canceled', () => {
                client.sendGMCP('Room.Info');
                if (this._dialogProgress)
                    this._dialogProgress.close();
                this._dialogProgress = null;
                this._dialogMap.refresh();
                this._map.save();
            }, this._dialog);
            //onload query the mud for current room info
            this.client.sendGMCP('Room.Info');
        }

        this.on('map-loaded', () => {
            initMapper();
        });
        if (this._map)
            initMapper();
    }

    public show() {
        this.createDialog();
        this._dialog.show();
    }

    private _updateMenu(selector, disabled) {
        if (disabled)
            this._dialog.body.querySelector(selector).classList.add('disabled');
        else
            this._dialog.body.querySelector(selector).classList.remove('disabled');
    }

    public import(data, type: ImportType) {
        if (this._dialogProgress)
            throw new Error('Import already in progress');
        if (typeof data === 'string')
            data = JSON.parse(data);
        this._dialogProgress = progress_box('Importing map');
        this._dialogProgress.on('canceled', () => {
            this.map.cancelImport();
        });
        this._dialogProgress.on('closed', reason => {
            if (reason === 'canceled')
                this.map.cancelImport();
        });
        this._dialogProgress.on('shown', () => {
            this.map.import(data, type);
        });
        this._dialogProgress.showModal();
    }
}

function closeMenu() {
    const instance = bootstrap.Offcanvas.getInstance(document.getElementById('mapper-menu'));
    if (!instance) return
    instance.hide();
}
