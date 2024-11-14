import "../css/mapper.css";
import { EventEmitter } from "../events";
import { copyText } from "../library";
import * as PF from './../lib/pathfinding3D.js'
import { Map, Room, RoomDetails } from "../map";

declare let fileSaveAs;

interface MouseData {
    x: number;
    y: number;
    button: number;
    state: boolean;
}

export enum UpdateType { none = 0, draw = 1 }

interface MapOptions {
    container?: string | JQuery | HTMLElement;
    map?: Map;
}

export class MapDisplay extends EventEmitter {
    private _container: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _MousePrev: MouseData;
    private _Mouse: MouseData;
    private _MouseDown: MouseData;
    private _MouseDrag: MouseData = { x: 0, y: 0, button: 0, state: false };
    private _drag: boolean = false;
    private _vscroll: number = 0;
    private _hscroll: number = 0;
    private _markers = {};
    private _markedRooms;
    private _updating: UpdateType = UpdateType.none;
    private _rTimeout = 0;
    private _drawCache;
    private _focused = false;

    private _resizeObserver;
    private _resizeObserverCache;
    private _observer: MutationObserver;

    private _active: Room;
    private _selected: Room;
    private _showLegend: boolean = false;
    private _splitArea: boolean = false;
    private _fillWalls: boolean = false;
    private _enabled: boolean = true;
    private _follow: boolean = true;
    public commandDelay: number = 500;
    public commandDelayCount: number = 5;
    private _scale: number = 1.0;
    private _mapperNavDown = false;
    private _pointerCache: PointerEvent[] = [];
    private _pointerDistance: number = -1;
    private _showNav: boolean = true;
    private _document;
    private _window;
    private _map: Map;

    get showNavigation() { return this._showNav; }
    set showNavigation(value) {
        if (value === this._showNav) return;
        this._showNav = value;
        this._container.querySelectorAll('.MapperNavButton').forEach((e: HTMLElement) => {
            e.style.display = this._showNav ? '' : 'none';
        });
        this._canvas.style.top = this._showNav ? '' : '0';
        this._canvas.style.left = this._showNav ? '' : '0';
        this._canvas.style.right = this._showNav ? '' : '0';
        this._canvas.style.bottom = this._showNav ? '' : '0';
        this._resizeCanvas();
    }
    get selected() { return this._selected; }
    set selected(value: Room) {
        this.emit('room-before-selected', this._selected ? this._selected.clone() : null);
        this._selected = value.clone();
        this.emit('room-selected', value.clone());
        this._doUpdate(UpdateType.draw);
    }

    get container() { return this._container; }

    set scale(value: number) {
        if (value < 25)
            value = 25;
        if (value > 300)
            value = 300;
        if (this._scale !== value) {
            this._scale = value / 100;
            this.emit('setting-changed', 'scale', value);
            this._drawCache = 0;
            this._doUpdate(UpdateType.draw);
        }
    }
    get scale(): number { return Math.round(this._scale * 100); }
    set enabled(value: boolean) {
        if (this._enabled !== value) {
            this._enabled = value;
            this.emit('setting-changed', 'enabled', value);
        }
    }
    get enabled(): boolean { return this._enabled; }
    set follow(value: boolean) {
        if (this._follow !== value) {
            this._follow = value;
            this.emit('setting-changed', 'follow', value);
        }
    }
    get follow(): boolean { return this._follow; }

    set showLegend(value: boolean) {
        if (this._showLegend !== value) {
            this._showLegend = value;
            this._drawCache = 0;
            this._doUpdate(UpdateType.draw);
            this.emit('setting-changed', 'legend', value);
        }
    }
    get showLegend(): boolean { return this._showLegend; }

    set splitArea(value: boolean) {
        if (this._splitArea !== value) {
            this._splitArea = value;
            this._drawCache = 0;
            this._doUpdate(UpdateType.draw);
            this.emit('setting-changed', 'split', value);
        }
    }

    get splitArea(): boolean { return this._splitArea; }

    set fillWalls(value: boolean) {
        if (this._fillWalls !== value) {
            this._fillWalls = value;
            this._drawCache = 0;
            this._doUpdate(UpdateType.draw);
            this.emit('setting-changed', 'fill', value);
        }
    }

    get fillWalls(): boolean { return this._fillWalls; }

    constructor(container: string | JQuery | HTMLElement | MapOptions, options?: MapOptions) {
        super();
        if (!container)
            throw new Error('Container must be a selector, element, jquery object or Map options');
        if (typeof container === 'object' && 'container' in container) {
            options = Object.assign(options || {}, container);
            container = options.container;
            delete options.container;
        }
        else if (!options)
            options = {};
        if (typeof container === 'string') {
            this._container = document.querySelector(container);
            if (!this._container)
                throw new Error('Invalid selector for display.');
        }
        else if (container instanceof $)
            this._container = container[0];
        else if (container instanceof HTMLElement)
            this._container = container;
        else if ((<HTMLElement>container).ownerDocument.defaultView && container instanceof (<HTMLElement>container).ownerDocument.defaultView.HTMLElement)
            this._container = container;        
        else
            throw new Error('Container must be a selector, element or jquery object');

        this._document = this._container.ownerDocument;
        this._window = this._document.defaultView;

        this._resizeObserver = new ResizeObserver((entries, observer) => {
            if (entries.length === 0) return;
            if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
                return;
            //debounce(() => {
            if (!this._resizeObserverCache || this._resizeObserverCache.height !== entries[0].contentRect.height || this._resizeObserverCache.width !== entries[0].contentRect.width) {
                this._resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
                this._resizeCanvas();
            }
            //}, 50, 'resize');
        });
        this._resizeObserver.observe(this._container);
        this._observer = new MutationObserver((mutationsList) => {
            let mutation;
            for (mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    this._resizeCanvas()
                }
            }
        });
        this._observer.observe(this._container, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });

        this._canvas = this._document.createElement('canvas');
        this._canvas.id = this._container.id + '-canvas';
        this._canvas.classList.add('map-canvas');
        this._canvas.style.touchAction = "none";
        this._canvas.tabIndex = 1;
        this._resizeCanvas()
        this._container.appendChild(this._canvas);

        this._container.insertAdjacentHTML('afterbegin', `<div class="MapperNavButton" title="Scroll northwest" style="top:4px;left:4px;background-position: 0px 0px;" data-x="-1" data-y="-1"></div><div class="MapperNavButton" title="Scroll north" style="top:4px;left:50%;background-position: -22px 0px;margin-left:-11px;" data-x="0" data-y="-1"></div><div class="MapperNavButton" title="Scroll northeast" style="top:4px;left:100%;background-position: -44px 0px;margin-left:-26px;" data-x="1" data-y="-1"></div><div class="MapperNavButton" title="Scroll west" style="top:50%;left:4px;background-position: 0px -22px;margin-top:-11px;" data-x="-1" data-y="0"></div><div class="MapperNavButton" title="Scroll east" style="top:50%;left:100%;background-position: -44px -22px;margin-top:-11px;margin-left:-26px;" data-x="1" data-y="0"></div><div class="MapperNavButton" title="Scroll southwest" style="bottom:4px;left:4px;background-position: 0px -44px;" data-x="-1" data-y="1"></div><div class="MapperNavButton" title="Scroll south" style="bottom:4px;left:50%;background-position: -22px -44px;margin-left:-11px;" data-x="0" data-y="1"></div><div class="MapperNavButton" title="Scroll southeast" style="bottom:4px;left:100%;background-position: -44px -44px;margin-left:-26px;" data-x="1" data-y="1"></div>`);
        this._container.querySelectorAll('.MapperNavButton').forEach(e => {
            e.addEventListener('wheel', (e: WheelEvent) => {
                this._mapperNavDown = true;
                const target = (e.currentTarget || e.target) as HTMLElement;
                if (e.deltaY >= 0)
                    this._mapperNavClick(-parseInt(target.dataset.x, 10), -parseInt(target.dataset.y, 10));
                else
                    this._mapperNavClick(parseInt(target.dataset.x, 10), parseInt(target.dataset.y, 10));
                this._mapperNavDown = false;
            }, { passive: true });
            e.addEventListener('mouseleave', () => this._mapperNavDown = false);
            e.addEventListener('mouseup', () => this._mapperNavDown = false);
            e.addEventListener('mousedown', e => {
                this._mapperNavDown = true;
                const target = (e.currentTarget || e.target) as HTMLElement;
                this._mapperNavClick(parseInt(target.dataset.x, 10), parseInt(target.dataset.y, 10));
            });
        });

        this._context = this._canvas.getContext('2d');
        this._context.mozImageSmoothingEnabled = false;
        this._context.webkitImageSmoothingEnabled = false;
        this._context.imageSmoothingEnabled = false;

        this._canvas.addEventListener('pointerdown', e => {
            this._pointerCache.push(e);
            //if (this._pointerCache.length === 2)
            //this._pointerDistance = Math.hypot(this._pointerCache[0].clientX - this._pointerCache[1].clientX, this._pointerCache[0].clientY - this._pointerCache[1].clientY);
        });
        this._canvas.addEventListener('pointermove', e => {
            const index = this._pointerCache.findIndex(
                (cached) => cached.pointerId === e.pointerId,
            );
            this._pointerCache[index] = e;
            if (this._pointerCache.length === 2) {
                // Calculate the distance between the two pointers
                const curDiff = Math.abs(this._pointerCache[0].clientX - this._pointerCache[1].clientX);

                if (this._pointerDistance > 0) {
                    if (curDiff > this._pointerDistance) {
                        // The distance between the two pointers has increased
                        if (this.scale < 300)
                            this.scale += 1;
                    }
                    if (curDiff < this._pointerDistance) {
                        if (this.scale > 25)
                            this.scale -= 1;
                    }
                }

                // Cache the distance for the next move event
                this._pointerDistance = curDiff;
            }
        });

        const pointerUp = e => {
            // Remove this event from the target's cache
            const index = this._pointerCache.findIndex(
                (cachedEv) => cachedEv.pointerId === e.pointerId,
            );
            this._pointerCache.splice(index, 1);
            if (this._pointerCache.length < 2) {
                this._pointerDistance = -1;
            }
        };
        this._canvas.addEventListener('pointerup', pointerUp);
        this._canvas.addEventListener('pointercancel', pointerUp);
        this._canvas.addEventListener('pointerout', pointerUp);
        this._canvas.addEventListener('pointerleave', pointerUp);


        this._canvas.addEventListener('touchstart', e => {
            this._Mouse = this.getMapMousePos(e);
            this._MouseDown = this.getMapMousePos(e);
            this._MouseDrag.state = true;
            this._drag = e.touches.length === 1;
        }, { passive: true });
        this._canvas.addEventListener('touchmove', e => {
            this._MousePrev = this._Mouse;
            this._Mouse = this.getMapMousePos(event);
            if (this._drag) {
                this._MouseDrag.x += this._MousePrev.x - this._Mouse.x;
                this._MouseDrag.y += this._MousePrev.y - this._Mouse.y;
                const x = Math.floor(this._MouseDrag.x / 32 / this._scale);
                const y = Math.floor(this._MouseDrag.y / 32 / this._scale);
                if (x > 0 || x < 0 || y < 0 || y > 0) {
                    this._MouseDrag.x -= x * 32 * this._scale;
                    this._MouseDrag.y -= y * 32 * this._scale;
                    this.scrollBy(x, y);
                }
                this._canvas.style.cursor = 'move';
            }
            e.preventDefault();
        }, { passive: true });
        this._canvas.addEventListener('touchend', e => {
            this._Mouse = this.getMapMousePos(e);
            if (!this._MouseDown)
                this._MouseDown = this.getMapMousePos(e);
            if (this._Mouse.button === 0 && Math.floor(this._Mouse.x / 32 / this._scale) === Math.floor(this._MouseDown.x / 32 / this._scale) && Math.floor(this._Mouse.y / 32 / this._scale) === Math.floor(this._MouseDown.y / 32 / this._scale)) {
                const x = this._Mouse.x;
                const y = this._Mouse.y;
                const room = this.findActiveRoomByCoords(x, y);
                if (!this.selected || (room && room.num !== this.selected.num))
                    this.selected = room;
            }
            this._MouseDrag.state = false;
            this._drag = false;
            this._canvas.style.cursor = 'default;'
        }, { passive: true });
        this._canvas.addEventListener('mousemove', event => {
            this._MousePrev = this._Mouse;
            this._Mouse = this.getMapMousePos(event);
            if (this._drag) {
                this._MouseDrag.x += this._MousePrev.x - this._Mouse.x;
                this._MouseDrag.y += this._MousePrev.y - this._Mouse.y;
                const x = Math.floor(this._MouseDrag.x / 32 / this._scale);
                const y = Math.floor(this._MouseDrag.y / 32 / this._scale);
                if (x > 0 || x < 0 || y < 0 || y > 0) {
                    this._MouseDrag.x -= x * 32 * this._scale;
                    this._MouseDrag.y -= y * 32 * this._scale;
                    this.scrollBy(x, y);
                }
                this._canvas.style.cursor = 'move';
            }
            event.preventDefault();
        });
        this._canvas.addEventListener('mousedown', event => {
            this._Mouse = this.getMapMousePos(event);
            this._MouseDown = this.getMapMousePos(event);
            this._MouseDrag.state = true;
            this._drag = this._MouseDown.button === 0;
        });
        this._canvas.addEventListener('mouseup', event => {
            this._Mouse = this.getMapMousePos(event);
            if (!this._MouseDown)
                this._MouseDown = this.getMapMousePos(event);
            if (this._Mouse.button === 0 && Math.floor(this._Mouse.x / 32 / this._scale) === Math.floor(this._MouseDown.x / 32 / this._scale) && Math.floor(this._Mouse.y / 32 / this._scale) === Math.floor(this._MouseDown.y / 32 / this._scale)) {
                const x = this._Mouse.x;
                const y = this._Mouse.y;
                const room = this.findActiveRoomByCoords(x, y);
                if (!this.selected || (room && room.num !== this.selected.num))
                    this.selected = room;
            }
            this._MouseDrag.state = false;
            this._drag = false;
            this._canvas.style.cursor = 'default;'
        });
        this._canvas.addEventListener('wheel', e => {
            if (e.deltaY >= 0)
                this.scale -= 5;
            else
                this.scale += 5;
        }, { passive: true });
        this._canvas.addEventListener('mouseenter', event => {
            this._Mouse = this.getMapMousePos(event);
        });
        this._canvas.addEventListener('mouseleave', event => {
            this._Mouse = this.getMapMousePos(event);
            if (this._drag) {
                this._doUpdate(UpdateType.draw);
                this._drag = false;
                $(this._canvas).css('cursor', 'default');
            }
        });
        this._canvas.addEventListener('contextmenu', event => {
            event.preventDefault();
            const m = this.getMapMousePos(event);
            this.emit('context-menu', this.findActiveRoomByCoords(m.x, m.y).clone());
            return false;
        });
        this._canvas.addEventListener('click', event => {
            event.preventDefault();
            this._MouseDrag.state = false;
            this._drag = false;
            $(this._canvas).css('cursor', 'default');
        });
        this._canvas.addEventListener('dblclick', event => {
            event.preventDefault();
            this._Mouse = this.getMapMousePos(event);
            this._MouseDown = this.getMapMousePos(event);
            this._MouseDrag.state = true;
            this._drag = true;
            $(this._canvas).css('cursor', 'move');
        });
        this._canvas.onselectstart = () => { return false; };
        this._canvas.addEventListener('focus', (e) => {
            this._setFocus(true);
        });
        this._canvas.addEventListener('blur', (e) => {
            this._setFocus(false);
        });
        this._canvas.addEventListener('keydown', (e) => {
            if (!this._focused) return;
            switch (e.which) {
                case 27:
                    e.preventDefault();
                    this._MouseDrag.state = false;
                    this._drag = false;
                    $(this._canvas).css('cursor', 'default');
                    break;
                case 38: //up
                    e.preventDefault();
                    this.scrollBy(0, -1);
                    break;
                case 40: //down
                    e.preventDefault();
                    this.scrollBy(0, 1);
                    break;
                case 37: //left
                    e.preventDefault();
                    this.scrollBy(-1, 0);
                    break;
                case 39: //right
                    e.preventDefault();
                    this.scrollBy(1, 0);
                    break;
                case 110:
                case 46: //delete
                    e.preventDefault();
                    this.emit('delete-selected');
                    break;
                case 97: //num1
                    e.preventDefault();
                    this.scrollBy(-1, 1);
                    break;
                case 98: //num2
                    e.preventDefault();
                    this.scrollBy(0, 1);
                    break;
                case 99: //num3
                    e.preventDefault();
                    this.scrollBy(1, 1);
                    break;
                case 100: //num4
                    e.preventDefault();
                    this.scrollBy(-1, 0);
                    break;
                case 101: //num5
                    e.preventDefault();
                    this.focusCurrentRoom();
                    break;
                case 102: //num6
                    e.preventDefault();
                    this.scrollBy(1, 0);
                    break;
                case 103: //num7
                    e.preventDefault();
                    this.scrollBy(-1, -1);
                    break;
                case 104: //num8
                    e.preventDefault();
                    this.scrollBy(0, -1);
                    break;
                case 105: //num9
                    e.preventDefault();
                    this.scrollBy(1, -1);
                    break;
                case 107: //+
                    e.preventDefault();
                    this.setLevel(this.active.z + 1);
                    break;
                case 109: //-
                    e.preventDefault();
                    this.setLevel(this.active.z - 1);
                    break;
                case 111: // /
                    e.preventDefault();
                    this.setZone(this.active.zone - 1);
                    break;
                case 106: // *
                    e.preventDefault();
                    this.setZone(this.active.zone + 1);
                    break;
            }
        });
        this._map = options.map;
        this.reset();
        this.refresh();
    }

    public getMapMousePos(evt): MouseData {
        const rect = this._canvas.getBoundingClientRect();
        if (evt.touches && evt.touches.length)
            return {
                x: evt.touches[0].clientX - rect.left,
                y: evt.touches[0].clientY - rect.top,
                button: 0,
                state: false
            };

        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
            button: evt.button,
            state: false
        };
    }

    public scrollBy(x: number, y: number) {
        this._vscroll += x;
        this._hscroll += y;
        this._doUpdate(UpdateType.draw);
        this.emit('setting-changed', 'vscroll', this._vscroll);
        this.emit('setting-changed', 'hscroll', this._hscroll);
    }

    public scrollTo(x: number, y: number) {
        this._vscroll = x;
        this._hscroll = y;
        this._doUpdate(UpdateType.draw);
        this.emit('setting-changed', 'vscroll', this._vscroll);
        this.emit('setting-changed', 'hscroll', this._hscroll);
    }

    public findActiveRoomByCoords(rx: number, ry: number) {
        let x = this._vscroll - (this._canvas.width / 32 / 2 / this._scale);
        let y = this._hscroll - (this._canvas.height / 32 / 2 / this._scale);
        let ox = 15.5 * this._scale;
        let oy = 15.5 * this._scale;
        if (this._canvas.width % 2 !== 0)
            ox = 15 * this._scale;
        if (this._canvas.height % 2 !== 0)
            oy = 15 * this._scale;
        x += (rx - ox) / 32 / this._scale;
        y += (ry - oy) / 32 / this._scale;
        x = Math.floor(x);
        y = Math.floor(y);
        if (this._splitArea)
            return this.map.getRoom({ x: x, y: y, z: this.active.z, zone: this.active.zone, area: this.active.area }) || new Room();
        return this.map.getRoom({ x: x, y: y, z: this.active.z, zone: this.active.zone }) || new Room();
    }

    public draw(canvas?: HTMLCanvasElement, context?: CanvasRenderingContext2D, ex?: boolean) {
        return new Promise((resolve, reject) => {
            if (!canvas)
                canvas = this._canvas;
            if (!context)
                context = this._context;
            if (!ex) ex = false;
            //cant get map canvas bail
            if (!canvas || !context || !this._map) {
                reject();
                return;
            }

            const x = this._vscroll - (canvas.width / 32 / 2 / this._scale);
            const y = this._hscroll - (canvas.height / 32 / 2 / this._scale);
            const z = this.active.z || 0;
            const area = this.active.area || '';
            const zone = this.active.zone || 0;
            let ox = 15.5 * this._scale;
            let oy = 15.5 * this._scale;
            if (canvas.width % 2 !== 0)
                ox = 15 * this._scale;
            if (canvas.height % 2 !== 0)
                oy = 15 * this._scale;

            context.font = '8pt Arial';
            const s = new Date().getTime();
            const $w = canvas.width / 32 / this._scale + 1;
            const $h = canvas.height / 32 / this._scale + 1;
            const $x = x - 1;
            const $y = y - 1;
            const rooms: Room[] = Object.values(this._map.Rooms).filter(room => {
                if (room.zone !== zone || room.z !== z) return false;
                if (this._splitArea && room.area !== area) return false;
                if (((0 <= (room.x - $x) && (room.x - $x) <= $w) && (0 <= (room.y - $y) && (room.y - $y) <= $h) || (0 <= (room.x - $x) && (room.x - $x) <= $w) && (0 <= (room.y - $y + 1) && (room.y - $y + 1) <= $h) || (0 <= (room.x - $x + 1) && (room.x - $x + 1) <= $w) && (0 <= (room.y - $y + 1) && (room.y - $y + 1) <= $h) || (0 <= (room.x - $x + 1) && (room.x - $x + 1) <= $w) && (0 <= (room.y - $y) && (room.y - $y) <= $h)))
                    return true;
                return false;
            });


            this.emit('debug', 'Mapper: Draw - room query time: ' + (new Date().getTime() - s));
            const d = new Date().getTime();
            if (ex) {
                context.fillStyle = '#eae4d6';
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            else
                context.clearRect(0, 0, canvas.width, canvas.height);

            this.emit('debug', 'Mapper: Draw - room calculations time: ' + (new Date().getTime() - s));
            for (let r = 0, rl = rooms.length; r < rl; r++) {
                const room = rooms[r];
                this.DrawRoom(context, (room.x - x) * 32 * this._scale + ox, (room.y - y) * 32 * this._scale + oy, room, ex, this._scale);
            }

            this.emit('debug', 'Mapper: Draw - display time: ' + (new Date().getTime() - d));
            this.emit('debug', 'Mapper: Draw - final time: ' + (new Date().getTime() - s));
            this.DrawLegend(context, 1, -4, 0);
            resolve(true);
        });
    }

    public reset(type?) {
        if (this._map && (!type || type === 1)) {
            this._map.current = new Room();
            this.emit('current-changed', this._map.current);
        }
        if (!type) {
            this.active = new Room();
            this.selected = new Room();
        }
    }

    public refresh() {
        this._drawCache = 0;
        this._doUpdate(UpdateType.draw);
        this.emit('refresh');
    }

    public focusCurrentRoom() {
        if (this._map.current.num) {
            this.active = this._map.current;
            this.emit('active-room-changed', this.active.clone());
        }
        this.focusActiveRoom();
    }

    public focusActiveRoom() {
        this.scrollTo(this.active.x + 1, this.active.y + 1);
    }

    public set active(value) {
        this._active = value && value.clone ? value.clone() : value;
        this.emit('active-room-changed', this._active);
    }
    public get active() { return this._active; }

    public get current() { return this._map.current; }
    public set current(value) {
        this.emit('path-cleared');
        if (!value || !value.num) value = this.selected;
        this._map.current = value.clone();
        this._markers = {};
        this._markedRooms = 0;
        this._doUpdate(UpdateType.draw);
    }

    public setArea(area: string) {
        this.active.area = area;
        if (this._map.current.num !== null && this._map.current.area === this.active.area) {
            this.active = this._map.current;
            this.focusActiveRoom();
            this.emit('setting-changed', 'active', this.active);
        }
        else {
            const room = this._map.getRoom({ area: area });
            if (room) {
                this.active = room;
                this.focusActiveRoom();
                this.emit('setting-changed', 'active', this.active);
            }
        }
    }

    public setLevel(level: number) {
        if (level !== this.active.z) {
            this.active.z = level;
            this._doUpdate(UpdateType.draw);
            this.emit('setting-changed', 'active', this.active);
        }
    }

    public setZone(zone: number) {
        if (zone !== this.active.zone) {
            this.active.zone = zone;
            this._doUpdate(UpdateType.draw);
            this.emit('setting-changed', 'active', this.active);
        }
    }

    public removeRoom(room) {
        if (this._map.roomExists({ num: room.num })) {
            this._map.removeRoom(room);
            this.emit('remove-done', room);
            if (room.num === this._map.current.num) {
                this._map.current = new Room();
                this.emit('current-changed', this._map.current);
                this.clearPath();
            }
            else if (this._markers[room.num])
                this.clearPath();
            if (room.num === this.active.num)
                this.active = new Room();
            if (room.num === this.selected.num)
                this.selected = new Room();
            this.refresh();
        }
    }

    public clearSelectedRoom() {
        const es = { preventDefault: false };
        this.emit('clear-selected', es)
        if (es.preventDefault) return;
        this.removeRoom(this.selected);
    }

    public clearCurrentRoom() {
        const es = { preventDefault: false };
        this.emit('clear-current', es)
        if (es.preventDefault) return;
        this.removeRoom(this._map.current);
    }

    public clearArea() {
        const es = { preventDefault: false };
        this.emit('clear-area', es)
        if (es.preventDefault) return;
        this._map.removeRooms({ area: this.active.area });
        this.emit('clear-area-done', this.active.area);
        this.reset();
        this.refresh();
    }

    public clearAll() {
        const es = { preventDefault: false };
        this.emit('clear-all', es)
        if (es.preventDefault) return;
        this._map.removeAllRooms();
        this.emit('clear-done');
        this.reset();
        this.refresh();
        this.focusActiveRoom();
    }

    public set map(map: Map) {
        this._map = map;
        map.on('current-changed', room => {
            this.clearPath();
            this.emit('current-changed', this._map.current);
            if (this.selected && this.selected.num === room.num)
                this.emit('room-selected', room.clone());
            if (this.follow)
                this.focusCurrentRoom();
            else
                this.active = room;
            this.refresh();
        });
        map.on('before-room-changed', room => {
            if (room)
                delete this._drawCache[(room.background ? room.background : room.env) + ',' + room.indoors + ',' + room.exitsID + ',' + room.details];
        });
        map.on('room-changed', room => {
            if (this.selected && this.selected.num === room.num)
                this.selected = room;
            if (this.follow)
                this.focusCurrentRoom();
            else
                this.active = this.current;
            this.refresh();
        });
        map.on('rooms-changed', rooms => {
            if (this.selected && this.selected.num) {
                const idx = rooms.findIndex(room => room.num === this.selected.num);
                if (idx !== -1)
                    this.selected = rooms[idx];
            }
            if (this.follow)
                this.focusCurrentRoom();
            else
                this.active = this.current;
            this.refresh();
        });
        this.refresh();
    }
    public get map() { return this._map; }

    public set rooms(rooms: object | Room[]) {
        this._map.Rooms = rooms;
    }
    public get rooms() { return this._map.Rooms; }

    public roomExists(x, y, z, zone, area?) {
        if (area)
            return this._map.roomExists({ x: x, y: y, z: z, zone: zone || 0, area: area });
        return this._map.roomExists({ x: x, y: y, z: z, zone: zone || 0 });
    }

    public setRoom(room: Room) {
        this._map.setRoom(room);
    }

    public DrawLegend(ctx, x, y, nc) {
        if (!this._showLegend) return;
        ctx.strokeStyle = 'black';
        if (!nc) {
            ctx.fillStyle = '#eae4d6';
            //ctx.clearRect(x + 30, y + 35, 130, 145);
            ctx.fillRect(x + 30, y + 35, 130, 175);
        }
        ctx.fillStyle = 'black';
        ctx.strokeRect(x + 30, y + 35, 130, 175);
        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillText('Dock', x + 50, y + 50);
        ctx.fillStyle = 'chocolate';
        ctx.beginPath();
        ctx.arc(x + 40, y + 45, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fillText('Pier', x + 50, y + 65);
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(x + 40, y + 60, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fillText('Water Source', x + 50, y + 80);
        ctx.fillStyle = 'aqua';
        ctx.beginPath();
        ctx.arc(x + 40, y + 75, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fillText('Bank', x + 50, y + 95);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'goldenrod';
        ctx.beginPath();
        ctx.fillText('$', x + 38, y + 95);
        ctx.closePath();
        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Shop', x + 50, y + 110);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.fillText('\u23CF', x + 38, y + 110);
        ctx.closePath();
        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Hospital', x + 50, y + 125);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.fillText('\u2665', x + 38, y + 125);
        ctx.closePath();
        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Bar & Restaurant', x + 50, y + 140);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.fillText('\u2617', x + 38, y + 140);
        ctx.closePath();
        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Bar', x + 50, y + 155);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.fillText('\u266A', x + 38, y + 155);
        ctx.closePath();
        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Restaurant', x + 50, y + 170);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.fillText('\u2616', x + 38, y + 170);
        ctx.closePath();

        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Train', x + 50, y + 185);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.fillText('\u260D', x + 38, y + 185);
        ctx.closePath();

        ctx.font = 'italic bold 8pt Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Stable', x + 50, y + 200);
        ctx.font = '8pt Arial';
        ctx.fillStyle = 'rgb(153, 102, 0)';
        ctx.beginPath();
        ctx.fillText('\u2658', x + 38, y + 200);
        ctx.closePath();

    }

    private _translate(ctx, amt, scale) {
        if (scale === 2) return;
        //if (scale < 1) {
        const o = amt - amt * scale;
        ctx.translate(amt * scale + o, amt * scale + o);
        /*
    }
    else if (scale % 0.25 === 0)
        ctx.translate(amt, amt);
    else
        ctx.translate(amt * scale, amt * scale);
        */
    }

    public DrawRoom(ctx, x, y, room, ex, scale?) {
        if (!this._drawCache)
            this._drawCache = {};
        if (!scale) scale = this._scale;
        const key = (room.background ? room.background : room.env) + ',' + room.indoors + ',' + room.exitsID + ',' + room.details;

        if (!this._drawCache[key]) {
            this._drawCache[key] = this._document.createElement('canvas');
            this._drawCache[key].classList.add('map-canvas');
            this._drawCache[key].height = 32 * scale;
            this._drawCache[key].width = 32 * scale;
            const tx = this._drawCache[key].getContext('2d');
            this._translate(tx, 0.5, scale);
            tx.beginPath();
            let f = false;
            if (room.background) {
                tx.fillStyle = room.background;
                f = true;
            }
            else if (room.env) {
                switch (room.env) {
                    case 'wood':
                        tx.fillStyle = '#966F33';
                        f = true;
                        break;
                    case 'jungle':
                        tx.fillStyle = '#347C2C';
                        f = true;
                        break;
                    case 'forest':
                        tx.fillStyle = '#4E9258';
                        f = true;
                        break;
                    case 'grass':
                    case 'grassland':
                    case 'plains':
                    case 'prairie':
                    case 'savannah':
                        tx.fillStyle = '#4AA02C';
                        f = true;
                        break;
                    case 'desert':
                    case 'dirt':
                    case 'dirtroad':
                    case 'beach':
                    case 'sand':
                    case 'sanddesert':
                        tx.fillStyle = '#C2B280';
                        f = true;
                        break;
                    case 'snow':
                        tx.fillStyle = '#F0F8FF';
                        f = true;
                        break;
                    case 'tundra':
                    case 'icesheet':
                        tx.fillStyle = '#368BC1';
                        f = true;
                        break;
                    case 'underwater':
                    case 'water':
                    case 'lake':
                    case 'river':
                        tx.fillStyle = '#EBF4FA';
                        f = true;
                        break;
                    case 'ocean':
                        tx.fillStyle = '#C2DFFF';
                        f = true;
                        break;
                    case 'bog':
                    case 'city':
                    case 'cliff':
                    case 'highmountain':
                    case 'hills':
                    case 'mountain':
                    case 'swamp':
                        f = false;
                        break;
                    case 'farmland':
                        f = true;
                        tx.fillStyle = '#A9DFBF';
                        break;
                    case 'rockdesert':
                        tx.fillStyle = '#6E2C00';
                        f = true;
                        break;
                    case 'pavedroad':
                        tx.fillStyle = '#D0D3D4';
                        f = true;
                        break;
                    case 'cobble':
                    case 'rocky':
                    case 'stone':
                        tx.fillStyle = '#D5DBDB';
                        f = true;
                        break;
                    default:
                        f = false;
                        break;
                }
            }
            else
                f = false;
            tx.strokeStyle = 'black';
            tx.lineWidth = 0.6 * scale;
            if (!room.indoors) {
                tx.arc(16 * scale, 16 * scale, 8 * scale, 0, Math.PI * 2, false);
                if (f) tx.fill();
                tx.stroke();
            }
            else {
                if (f) tx.fillRect(8 * scale, 8 * scale, 16 * scale, 16 * scale);
                tx.strokeRect(8 * scale, 8 * scale, 16 * scale, 16 * scale);
            }
            tx.closePath();

            tx.beginPath();
            tx.fillStyle = '#cccccc';
            if (room.exits.north) {
                tx.moveTo(16 * scale, 0 * scale);
                tx.lineTo(16 * scale, 8 * scale);
            }
            else if (this._fillWalls)
                tx.fillRect(9 * scale, 0 * scale, 14 * scale, 4 * scale);
            if (room.exits.northwest) {
                if (!room.Indoors) {
                    tx.moveTo(0 * scale, 0 * scale);
                    tx.lineTo(10 * scale, 10 * scale);
                }
                else {
                    tx.moveTo(0 * scale, 0 * scale);
                    tx.lineTo(8 * scale, 8 * scale);
                }
            }
            else if (this._fillWalls) {
                tx.fillRect(2 * scale, 0 * scale, 2 * scale, 2 * scale);
                tx.fillRect(0 * scale, 2 * scale, 4 * scale, 2 * scale);
                if (!room.exits.north)
                    tx.fillRect(4 * scale, 0 * scale, 5 * scale, 4 * scale);
                if (!room.exits.west)
                    tx.fillRect(0 * scale, 4 * scale, 4 * scale, 5 * scale);
            }
            if (room.exits.northeast) {
                if (!room.Indoors) {
                    tx.moveTo(32 * scale, 0 * scale);
                    tx.lineTo(22 * scale, 10 * scale);
                }
                else {
                    tx.moveTo(32 * scale, 0 * scale);
                    tx.lineTo(24 * scale, 8 * scale);
                }
            }
            else if (this._fillWalls) {
                tx.fillRect(28 * scale, 0 * scale, 2 * scale, 2 * scale);
                tx.fillRect(28 * scale, 2 * scale, 4 * scale, 2 * scale);
                tx.clearRect(30 * scale, 0 * scale, 2 * scale, 2 * scale);
                if (!room.exits.north)
                    tx.fillRect(23 * scale, 0 * scale, 5 * scale, 4 * scale);
                if (!room.exits.east)
                    tx.fillRect(28 * scale, 4 * scale, 4 * scale, 5 * scale);
            }
            if (room.exits.east) {
                tx.moveTo(24 * scale, 16 * scale);
                tx.lineTo(32 * scale, 16 * scale);
            }
            else if (this._fillWalls)
                tx.fillRect(28 * scale, 9 * scale, 4 * scale, 14 * scale);
            if (room.exits.west) {
                tx.moveTo(0 * scale, 16 * scale);
                tx.lineTo(8 * scale, 16 * scale);
            }
            else if (this._fillWalls)
                tx.fillRect(0 * scale, 9 * scale, 4 * scale, 14 * scale);
            if (room.exits.south) {
                tx.moveTo(16 * scale, 24 * scale);
                tx.lineTo(16 * scale, 32 * scale);
            }
            else if (this._fillWalls)
                tx.fillRect(9 * scale, 28 * scale, 14 * scale, 4 * scale);
            if (room.exits.southeast) {
                if (!room.Indoors) {
                    tx.moveTo(32 * scale, 32 * scale);
                    tx.lineTo(22 * scale, 22 * scale);
                }
                else {
                    tx.moveTo(32 * scale, 32 * scale);
                    tx.lineTo(24 * scale, 24 * scale);
                }
            }
            else if (this._fillWalls) {
                tx.fillRect(28 * scale, 28 * scale, 4 * scale, 2 * scale);
                tx.fillRect(28 * scale, 30 * scale, 2 * scale, 2 * scale);
                if (!room.exits.south)
                    tx.fillRect(23 * scale, 28 * scale, 5 * scale, 4 * scale);
                if (!room.exits.east)
                    tx.fillRect(28 * scale, 23 * scale, 4 * scale, 5 * scale);
            }
            if (room.exits.southwest) {
                if (!room.Indoors) {
                    tx.moveTo(0 * scale, 32 * scale);
                    tx.lineTo(10 * scale, 22 * scale);
                }
                else {
                    tx.moveTo(0 * scale, 32 * scale);
                    tx.lineTo(8 * scale, 24 * scale);
                }
            }
            else if (this._fillWalls) {
                tx.fillRect(0 * scale, 28 * scale, 4 * scale, 2 * scale);
                tx.fillRect(2 * scale, 30 * scale, 2 * scale, 2 * scale);
                if (!room.exits.south)
                    tx.fillRect(4 * scale, 28 * scale, 5 * scale, 4 * scale);
                if (!room.exits.west)
                    tx.fillRect(0 * scale, 23 * scale, 4 * scale, 5 * scale);
            }
            tx.closePath();
            tx.stroke();
            tx.fillStyle = 'black';
            tx.strokeStyle = 'black';
            if (room.exits.up) {
                tx.beginPath();
                tx.moveTo(1 * scale, 11 * scale);
                tx.lineTo(7 * scale, 11 * scale);
                tx.lineTo(4 * scale, 8 * scale);
                tx.closePath();
                tx.fill();
            }
            if (room.exits.down) {
                tx.beginPath();
                tx.moveTo(1 * scale, 21 * scale);
                tx.lineTo(7 * scale, 21 * scale);
                tx.lineTo(4 * scale, 24 * scale);
                tx.closePath();
                tx.fill();
            }
            if (room.exits.out) {
                tx.beginPath();
                tx.moveTo(26 * scale, 8 * scale);
                tx.lineTo(29 * scale, 11 * scale);
                tx.lineTo(26 * scale, 14 * scale);
                tx.closePath();
                tx.fill();

            }
            if (room.exits.enter) {
                tx.beginPath();
                tx.moveTo(29 * scale, 19 * scale);
                tx.lineTo(26 * scale, 22 * scale);
                tx.lineTo(29 * scale, 25 * scale);
                tx.closePath();
                tx.fill();
            }
            if ((room.details & RoomDetails.Dock) === RoomDetails.Dock) {
                tx.fillStyle = 'chocolate';
                tx.beginPath();
                tx.arc(20 * scale, 5 * scale, 2 * scale, 0, Math.PI * 2);
                tx.fill();
                tx.closePath();
            }
            else if ((room.details & RoomDetails.Pier) === RoomDetails.Pier) {
                tx.fillStyle = 'gray';
                tx.beginPath();
                tx.arc(12 * scale, 5 * scale, 2 * scale, 0, Math.PI * 2);
                tx.fill();
                tx.closePath();
            }
            if ((room.details & RoomDetails.WaterSource) === RoomDetails.WaterSource) {
                tx.fillStyle = 'aqua';
                tx.beginPath();
                tx.arc(12 * scale, 5 * scale, 2 * scale, 0, Math.PI * 2);
                tx.fill();
                tx.closePath();
            }
            tx.scale(scale, scale);
            if ((room.details & RoomDetails.Bank) === RoomDetails.Bank) {
                tx.fillStyle = 'goldenrod';
                tx.beginPath();
                tx.fillText('$', 9, 17);
                tx.closePath();
            }
            if ((room.details & RoomDetails.Shop) === RoomDetails.Shop) {
                tx.fillStyle = 'purple';
                tx.beginPath();
                tx.fillText('\u23CF', 15, 17);
                tx.closePath();
            }
            if ((room.details & RoomDetails.Hospital) === RoomDetails.Hospital) {
                tx.fillStyle = 'blue';
                tx.beginPath();
                tx.fillText('\u2665', 15, 17);
                tx.closePath();
            }
            if ((room.details & RoomDetails.Trainer) === RoomDetails.Trainer) {
                tx.fillStyle = 'red';
                tx.beginPath();
                tx.fillText('\u260D', 15, 17);
                tx.closePath();
            }
            if ((room.details & RoomDetails.Stable) === RoomDetails.Stable) {
                tx.fillStyle = 'rgb(153, 102, 0)';
                tx.beginPath();
                tx.fillText('\u2658', 7, 17);
                tx.closePath();
            }
            if ((room.details & RoomDetails.Restaurant) === RoomDetails.Restaurant && (room.details & RoomDetails.Bar) === RoomDetails.Bar) {
                tx.fillStyle = 'green';
                tx.beginPath();
                tx.fillText('\u2617', 15, 17);
                tx.closePath();
            }
            else if ((room.details & RoomDetails.Bar) === RoomDetails.Bar) {
                tx.fillStyle = 'green';
                tx.beginPath();
                tx.fillText('\u266A', 15, 17);
                tx.closePath();
            }
            else if ((room.details & RoomDetails.Restaurant) === RoomDetails.Restaurant) {
                tx.fillStyle = 'green';
                tx.beginPath();
                tx.fillText('\u2616', 15, 17);
                tx.closePath();
            }
            tx.setTransform(1, 0, 0, 1, 0, 0);
            this._translate(tx, -0.5, scale);
        }
        //this.translate(ctx, -0.5, scale);
        ctx.drawImage(this._drawCache[key], x | 0, y | 0);
        //this.translate(ctx, 0.5, scale);
        this.DrawDoor(ctx, x + 12 * scale, y - 2 * scale, 8 * scale, 3 * scale, room.exits.north);
        this.DrawDoor(ctx, x + 31 * scale, y + 12 * scale, 3 * scale, 8 * scale, room.exits.east);
        this.DrawDoor(ctx, x - 1 * scale, y + 12 * scale, 3 * scale, 8 * scale, room.exits.west);
        this.DrawDoor(ctx, x + 12 * scale, y + 30 * scale, 8 * scale, 3 * scale, room.exits.south);
        this.DrawDDoor(ctx, x, y, 5 * scale, 5 * scale, room.exits.northwest);
        this.DrawDDoor(ctx, x + 32 * scale, y, -5 * scale, 5 * scale, room.exits.northeast);
        this.DrawDDoor(ctx, x + 32 * scale, y + 32 * scale, -5 * scale, -5 * scale, room.exits.southeast);
        this.DrawDDoor(ctx, x, y + 32 * scale, 5 * scale, -5 * scale, room.exits.southwest);

        if (!ex && this.selected.num === room.num) {
            if (this._focused) {
                ctx.fillStyle = 'rgba(135, 206, 250, 0.5)';
                ctx.strokeStyle = 'LightSkyBlue';
            }
            else {
                ctx.fillStyle = 'rgba(142, 142, 142, 0.5)';
                ctx.strokeStyle = 'rgba(142, 142, 142, 0.5)';
            }
            ctx.fillRoundedRect(x, y, 32 * scale, 32 * scale, 8 * scale);
            ctx.strokeRoundedRect(x, y, 32 * scale, 32 * scale, 8 * scale);
        }
        if (this._markers[room.num] === 2)
            this.drawMarker(ctx, x, y, 'green', scale);
        else if (this._markers[room.num] === 3)
            this.drawMarker(ctx, x, y, 'blue', scale);
        else if (this._markers[room.num])
            this.drawMarker(ctx, x, y, 'yellow', scale);
        if (!ex && room.num === this._map.current.num)
            this.drawMarker(ctx, x, y, 'red', scale);
    }

    public drawMarker(ctx, x, y, color, scale) {
        if (!color) color = 'yellow';
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = 'black';
        ctx.arc(x + 16 * scale, y + 16 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    public DrawDoor(ctx, x, y, w, h, exit) {
        if (!exit || !exit.isdoor) return;
        ctx.beginPath();
        ctx.clearRect(x, y, w, h);
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        /*
        if (exit.islocked) {
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }
        else
        */
        if (exit.isclosed)
            ctx.fillRect(x, y, w, h);
        else
            ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }

    public DrawDDoor(ctx, x, y, w, h, exit) {
        if (!exit || !exit.isdoor) return;
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y);
        /*
        if (exit.islocked) {
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.stroke();
        }
        else
        */
        if (exit.isclosed)
            ctx.fill();
        else
            ctx.stroke();
        ctx.closePath();
    }

    public PointInRect(x, y, x1, x2, y1, y2) {
        if ((x1 <= x && x <= x2) && (y1 <= y && y <= y2))
            return true;
        return false;
    }

    public getRoom(id) {
        return this._map.Rooms[id];
    }

    public getRooms(filter?): Room[] {
        if (!filter)
            return Object.values(this._map.Rooms);
        return this._map.getRooms(filter);
    }

    public showPath(destRoom?: Room) {
        if (!destRoom || !destRoom.num)
            destRoom = this.selected;
        if (this._map.current.num == null || destRoom.num == null)
            return;
        if (this._splitArea && this._map.current.area !== destRoom.area)
            return;
        if (this._map.current.zone !== destRoom.zone)
            return;
        let rooms;
        if (this._splitArea)
            rooms = this.getRooms({ area: this._map.current.area, zone: this._map.current.zone });
        else
            rooms = this.getRooms({ zone: this._map.current.zone });
        let room;
        let id;
        const roomsC: Room[][][] = [];
        let ox = null;
        let oy = 0;
        let oz = 0;
        let w = 0;
        let h = 0;
        let d = 0;
        let r;
        let rl;
        let x;
        let y;
        let z;
        let cx;
        let cy;
        let cz;
        for (id in rooms) {
            if (!rooms.hasOwnProperty(id)) continue;
            room = rooms[id];
            if (ox == null) {
                ox = room.x;
                w = room.x + 1;
                oy = room.y;
                h = room.y + 1;
                oz = room.z;
                d = room.z + 1;
                continue;
            }
            if (room.x < ox) ox = room.x; else if (room.x > w) w = room.x;
            if (room.y < oy) oy = room.y; else if (room.y > h) h = room.y;
            if (room.z < oz) oz = room.z; else if (room.z > d) d = room.z;
        }

        for (id in rooms) {
            if (!rooms.hasOwnProperty(id)) continue;
            room = rooms[id];
            if (room == null) continue;
            if (!roomsC[room.y - oy]) roomsC[room.y - oy] = [];
            if (!roomsC[room.y - oy][room.x - ox]) roomsC[room.y - oy][room.x - ox] = [];
            roomsC[room.y - oy][room.x - ox][room.z - oz] = room;
        }

        w = Math.sqrt(Math.pow(w - ox, 2)) + 1;
        h = Math.sqrt(Math.pow(oy - h, 2)) + 1;
        d = Math.sqrt(Math.pow(oz - d, 2)) + 1;
        const matrix = [];

        for (y = 0; y < h; y++) {
            matrix[y] = [];
            for (x = 0; x < w; x++) {
                matrix[y][x] = [];
                for (z = 0; z < d; z++)
                    matrix[y][x][z] = 0;
            }
        }

        for (id in rooms) {
            if (!rooms.hasOwnProperty(id)) continue;
            room = rooms[id];
            x = (room.x - ox);
            y = (room.y - oy);
            z = (room.z - oz);
            if (room.exits.northwest)
                matrix[y][x][z] |= 1;
            if (room.exits.north)
                matrix[y][x][z] |= 128;
            if (room.exits.northeast)
                matrix[y][x][z] |= 64;
            if (room.exits.west)
                matrix[y][x][z] |= 2;
            if (room.exits.east)
                matrix[y][x][z] |= 32;
            if (room.exits.southwest)
                matrix[y][x][z] |= 4;
            if (room.exits.south)
                matrix[y][x][z] |= 8;
            if (room.exits.southeast)
                matrix[y][x][z] |= 16;
            if (room.exits.up)
                matrix[y][x][z] |= 512;
            if (room.exits.down)
                matrix[y][x][z] |= 256;
        }
        const grid = new PF.Grid(w, h, d, matrix);

        const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: false });
        x = (this._map.current.x - ox);
        y = (this._map.current.y - oy);
        z = (this._map.current.z - oz);
        cx = (destRoom.x - ox);
        cy = (destRoom.y - oy);
        cz = (destRoom.z - oz);
        const fPath = finder.findPath(x, y, z, cx, cy, cz, grid);
        rl = fPath.length;
        this._markers = {};
        this._markedRooms = [this._map.current, destRoom];
        for (r = 0; r < rl; r++) {
            x = Math.floor(fPath[r][0]);
            y = Math.floor(fPath[r][1]);
            z = Math.floor(fPath[r][2]);
            if (roomsC[y] && roomsC[y][x] && roomsC[y][x][z]) {
                if (roomsC[y][x][z].num === this._map.current.num)
                    this._markers[roomsC[y][x][z].num] = 2;
                else if (roomsC[y][x][z].num === destRoom.num)
                    this._markers[roomsC[y][x][z].num] = 3;
                else
                    this._markers[roomsC[y][x][z].num] = 1;
            }
        }
        this.emit('path-shown');
        this._doUpdate(UpdateType.draw);
    }

    public clearPath() {
        this.emit('path-cleared');
        this._markers = {};
        this._markedRooms = 0;
        this._doUpdate(UpdateType.draw);
    }

    public get hasMarked() {
        return this._markedRooms && this._markedRooms.length !== 0;
    }

    public get markedStart() {
        if (!this._markedRooms) return 0;
        return this._markedRooms[0];
    }

    public get markedEnd() {
        if (!this._markedRooms) return 0;
        return this._markedRooms[1];
    }

    public getMarkedPath() {
        return new Promise((resolve, reject) => {
            if (!this._markedRooms)
                this.getPath().then(resolve).catch(reject);
            else
                this.getPath(this._markedRooms[1], this._markedRooms[0]).then(resolve).catch(reject);
        });
    }

    public getPath(destRoom?: Room, startRoom?: Room) {
        return new Promise((resolve, reject) => {
            if (!destRoom || !destRoom.num)
                destRoom = this.selected;
            if (!startRoom || !startRoom.num)
                startRoom = this._map.current;
            if (startRoom.num == null || destRoom.num == null) {
                reject('Invalid start or end room.');
                return;
            }
            if (this._splitArea && startRoom.area !== destRoom.area) {
                reject('Start and end rooms must be in same the area.');
                return;
            }
            if (startRoom.zone !== destRoom.zone) {
                reject('Start and end rooms must be in the same zone.');
                return;
            }
            let rooms;
            if (this._splitArea)
                rooms = this.getRooms({ area: startRoom.area, zone: startRoom.zone });
            else
                rooms = this.getRooms({ zone: startRoom.zone });
            let room;
            let id;
            let ox = null;
            let oy = 0;
            let oz = 0;
            let w = 0;
            let h = 0;
            let d = 0;
            let r;
            let rl;
            let x;
            let y;
            let z;
            let cx;
            let cy;
            let cz;
            let x2;
            let y2;
            let z2;
            for (id in rooms) {
                if (!rooms.hasOwnProperty(id)) continue;
                room = rooms[id];
                if (ox == null) {
                    ox = room.x;
                    w = room.x + 1;
                    oy = room.y;
                    h = room.y + 1;
                    oz = room.z;
                    d = room.z + 1;
                    continue;
                }
                if (room.x < ox) ox = room.x; else if (room.x > w) w = room.x;
                if (room.y < oy) oy = room.y; else if (room.y > h) h = room.y;
                if (room.z < oz) oz = room.z; else if (room.z > d) d = room.z;
            }

            w = Math.sqrt(Math.pow(w - ox, 2)) + 1;
            h = Math.sqrt(Math.pow(oy - h, 2)) + 1;
            d = Math.sqrt(Math.pow(oz - d, 2)) + 1;
            const matrix = [];

            for (y = 0; y < h; y++) {
                matrix[y] = [];
                for (x = 0; x < w; x++) {
                    matrix[y][x] = [];
                    for (z = 0; z < d; z++)
                        matrix[y][x][z] = 0;
                }
            }

            for (id in rooms) {
                if (!rooms.hasOwnProperty(id)) continue;
                room = rooms[id];
                x = (room.x - ox);
                y = (room.y - oy);
                z = (room.z - oz);
                if (room.exits.northwest)
                    matrix[y][x][z] |= 1;
                if (room.exits.north)
                    matrix[y][x][z] |= 128;
                if (room.exits.northeast)
                    matrix[y][x][z] |= 64;
                if (room.exits.west)
                    matrix[y][x][z] |= 2;
                if (room.exits.east)
                    matrix[y][x][z] |= 32;
                if (room.exits.southwest)
                    matrix[y][x][z] |= 4;
                if (room.exits.south)
                    matrix[y][x][z] |= 8;
                if (room.exits.southeast)
                    matrix[y][x][z] |= 16;
                if (room.exits.up)
                    matrix[y][x][z] |= 512;
                if (room.exits.down)
                    matrix[y][x][z] |= 256;
            }
            const grid = new PF.Grid(w, h, d, matrix);

            const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: false });
            x = (startRoom.x - ox);
            y = (startRoom.y - oy);
            z = (startRoom.z - oz);
            cx = (destRoom.x - ox);
            cy = (destRoom.y - oy);
            cz = (destRoom.z - oz);
            const fPath = finder.findPath(x, y, z, cx, cy, cz, grid);
            rl = fPath.length;
            const walk = [];
            for (r = 0; r < rl - 1; r++) {
                x = Math.floor(fPath[r][0]);
                y = Math.floor(fPath[r][1]);
                z = Math.floor(fPath[r][2]);
                x2 = Math.floor(fPath[r + 1][0]);
                y2 = Math.floor(fPath[r + 1][1]);
                z2 = Math.floor(fPath[r + 1][2]);

                if (z - 1 === z2)
                    walk.push('down');
                else if (z + 1 === z2)
                    walk.push('up');
                else if (x - 1 === x2 && y - 1 === y2)
                    walk.push('northwest');
                else if (x === x2 && y - 1 === y2)
                    walk.push('north');
                else if (x + 1 === x2 && y - 1 === y2)
                    walk.push('northeast');

                else if (x - 1 === x2 && y + 1 === y2)
                    walk.push('southwest');
                else if (x === x2 && y + 1 === y2)
                    walk.push('south');
                else if (x + 1 === x2 && y + 1 === y2)
                    walk.push('southeast');
                else if (x - 1 === x2 && y === y2)
                    walk.push('west');
                else
                    walk.push('east');
            }
            resolve(walk);
        });
    }

    public walkPath(destRoom?: Room, startRoom?: Room) {
        this.getPath(destRoom, startRoom).then(walk => {
            this.SendCommands(walk);
        }).catch(() => { });
    }

    public walkMarkedPath() {
        const destRoom = this._markedRooms ? this._markedRooms[1] : 0;
        const startRoom = this._markedRooms ? this._markedRooms[0] : 0;
        return new Promise((resolve, reject) => {
            this.getPath(destRoom, startRoom).then(walk => {
                this.SendCommands(walk);
            }).catch(() => { });
        });
    }

    public SendCommands(cmds) {
        let tmp;
        let cnt = this.commandDelayCount;
        if (cnt < 0) cnt = 1;
        if (cmds.length > cnt) {
            tmp = cmds.slice(cnt);
            cmds = cmds.slice(0, cnt);
            setTimeout(() => { this.SendCommands(tmp); }, this.commandDelay);
        }
        this.emit('send-commands', cmds.join('\n') + '\n');
    }

    private _doUpdate(type?: UpdateType) {
        if (!type) return;
        this._updating |= type;
        if (this._updating === UpdateType.none || this._rTimeout)
            return;
        this._rTimeout = this._window.requestAnimationFrame(() => {
            if ((this._updating & UpdateType.draw) === UpdateType.draw) {
                this.draw().catch(() => { });
                this._updating &= ~UpdateType.draw;
            }
            this._rTimeout = 0;
            this._doUpdate(this._updating);
        });
    }

    private _setFocus(value) {
        if (this._focused === value) return;
        this._focused = value;
        this._doUpdate(UpdateType.draw);
    }

    public updateOptions(options) {
        if (!options) return;
        for (let option in options) {
            if (!Object.prototype.hasOwnProperty.call(options, option))
                continue;
            if (option in this)
                this[option] = options[option];
        }
    }

    private _resizeCanvas() {
        if (!this._context || this.container.clientHeight === 0 || this.container.clientWidth === 0) return;
        //buffer the current canvas state as when resizing canvases are cleared so we want to restore it after resizing
        //let temp = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
        //create a temp canvas to store current state
        const tempCanvas = this._document.createElement('canvas');
        tempCanvas.width = this._canvas.width;
        tempCanvas.height = this._canvas.height
        //create context to access data
        const tempContext = tempCanvas.getContext("2d");
        //draw current state to temp
        tempContext.drawImage(this._canvas, 0, 0);
        //resize canvas
        if (this._showNav) {
            this._canvas.width = this.container.clientWidth - 60;
            this._canvas.height = this.container.clientHeight - 60;
        }
        else {
            const computedStyle = this._window.getComputedStyle(this._canvas);
            const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth);
            const borderRightWidth = parseFloat(computedStyle.borderRightWidth);
            const borderTopWidth = parseFloat(computedStyle.borderTopWidth);
            const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth);

            this._canvas.width = this.container.clientWidth - borderLeftWidth - borderRightWidth;
            this._canvas.height = this.container.clientHeight - borderTopWidth - borderBottomWidth;
        }
        //this._context.putImageData(temp, 0, 0)
        //restore stae
        this._context.drawImage(tempCanvas, 0, 0);
        //redraw to ensure any new exposed areas are drawn
        this._doUpdate(UpdateType.draw);
    }

    private _mapperNavClick(x, y) {
        if (!this._mapperNavDown) return;
        this.scrollBy(x, y);
        setTimeout(() => { this._mapperNavClick(x, y); }, 100);
    }

    public copyPath(separator?) {
        separator = separator || client.getOption('commandStackingChar') || ';';
        this.getPath().then((walk: string[]) => {
            copyText(walk.join(separator || '\n'));
            this.emit('debug', 'Directions: ' + walk);
        }).catch(err => this.emit('error', err));
    }

    public copyMarkedPath(separator?) {
        separator = separator || client.getOption('commandStackingChar') || ';';
        this.getMarkedPath().then((walk: string[]) => {
            copyText(walk.join(separator || '\n'));
            this.emit('debug', 'Directions: ' + walk);
        }).catch(err => this.emit('error', err));
    }

    public copySpeedpath() {
        this.getPath().then((walk: string[]) => {
            let cnt = 0;
            let cmd = '';
            let cmds = [client.getOption('speedpathsChar') || '!'];
            const wl = walk.length;
            for (let w = 0; w < wl; w++) {
                if (cmd.length && cmd !== walk[w]) {
                    cmds.push(cnt);
                    cmds.push(cmd);
                    cnt = 0;
                }
                cnt++;
                cmd = walk[w];
            }
            cmds.push(cnt);
            cmds.push(cmd);
            copyText(cmds.join(''));
            this.emit('debug', 'Speedpath: ' + cmds);
        }).catch(err => this.emit('error', err))
    }

    public copyMarkedSpeedpath() {
        this.getMarkedPath().then((walk: string[]) => {
            let cnt = 0;
            let cmd = '';
            let cmds = [client.getOption('speedpathsChar') || '!'];
            const wl = walk.length;
            for (let w = 0; w < wl; w++) {
                if (cmd.length && cmd !== walk[w]) {
                    cmds.push(cnt);
                    cmds.push(cmd);
                    cnt = 0;
                }
                cnt++;
                cmd = walk[w];
            }
            cmds.push(cnt);
            cmds.push(cmd);
            copyText(cmds.join(''));
            this.emit('debug', 'Speedpath: ' + cmds);
        }).catch(err => this.emit('error', err))
    }

    public exportImage(scaled?) {
        const rooms = this.getRooms({ area: this.active.area, z: this.active.z, zone: this.active.zone });
        let x = null, y = 0, w = 0, h = 0, r;
        const rl = rooms.length;
        let room, cx, cy;
        const t = this.active.area === null || !this._splitArea ? '' : this.active.area;
        const scale = scaled ? this._scale : 1.0;
        for (r = 0; r < rl; r++) {
            room = rooms[r];
            if (room === null) continue;
            if (x === null) {
                x = room.x;
                w = room.x + 1;
                y = room.y;
                h = room.y + 1;
                continue;
            }
            if (room.x < x) x = room.x; else if (room.x > w) w = room.x;
            if (room.y < y) y = room.y; else if (room.y > h) h = room.y;
        }
        this._context.font = 'italic bold 16pt Georgia';
        let fx = this._context.measureText(t).width;
        let rectWidth = Math.ceil(Math.sqrt(Math.pow(w - x, 2)) * 32 * scale + 60 + 32);
        let rectHeight = Math.ceil(Math.sqrt(Math.pow(y - h, 2)) * 32 * scale + 60 + 32);
        if (rectWidth < fx) rectWidth = fx + 60;
        if (this._showLegend) {
            rectWidth += 155;
            if (rectHeight < 200) rectHeight = 200;
        }
        const tempCanvas = this._document.createElement('canvas');
        tempCanvas.id = 'mapper-export';
        tempCanvas.style.height = rectHeight + 'px';
        tempCanvas.style.width = rectWidth + 'px';
        tempCanvas.width = rectWidth;
        tempCanvas.height = rectHeight;


        let ctx;
        if (tempCanvas && tempCanvas.getContext)
            ctx = tempCanvas.getContext('2d');
        else {
            this.emit('error', 'Mapper image export: Error generating map!');
            return;
        }
        ctx.strokeStyle = 'black';
        ctx.fillStyle = '#eae4d6';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        ctx.font = '8pt Arial';
        for (r = 0; r < rl; r++) {
            room = rooms[r];
            //no room
            if (room === null) continue;
            cx = (room.x - x) * 32 * scale + 30.5;
            cy = (room.y - y) * 32 * scale + 30.5;
            this.DrawRoom(ctx, cx, cy, room, true, scale);
        }
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.font = 'italic bold 16pt Georgia';
        fx = rectWidth / 2 - fx / 2;
        ctx.fillText(t, fx, 20);
        ctx.translate(rectWidth - 25, rectHeight - 25);
        ctx.font = 'italic bold 12pt Georgia';
        ctx.fillText('N', 3, -5);
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(5, 15);
        ctx.lineTo(10, 20);
        ctx.lineTo(15, 15);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        this.DrawLegend(ctx, rectWidth - 185, -10, 1);

        tempCanvas.toBlob((blob) => {
            let reader = new FileReader();
            reader.addEventListener('loadend', (evt) => {
                fileSaveAs.show(evt.target.result, this._splitArea && t.length ? ('OoMUD.' + t + '.png') : ('OoMUD.png'), 'image/png');
            });
            reader.readAsArrayBuffer(blob);
        });
    }

    public exportCurrentImage() {
        let tempCanvas = this._document.createElement('canvas');
        let context = tempCanvas.getContext('2d');
        tempCanvas.width = this._canvas.width;
        tempCanvas.height = this._canvas.height;
        this.draw(tempCanvas, context, true).then(() => {
            tempCanvas.toBlob((blob) => {
                let reader = new FileReader();
                reader.addEventListener('loadend', (evt) => {
                    fileSaveAs.show(evt.target.result, 'OoMUD.current.png', 'image/png');
                });
                reader.readAsArrayBuffer(blob);
            });
        });
    }

    public exportArea() {
        fileSaveAs.show(JSON.stringify(this.getRooms({ area: this.active.area })), this._splitArea ? ('OoMUD.' + this.active.area + '.map.txt') : ('OoMUD.map.txt'), 'text/plain');
    }

    public exportAll() {
        fileSaveAs.show(JSON.stringify(this.map.Rooms), 'OoMUD.map.txt', 'text/plain');
    }
}