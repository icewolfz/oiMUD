import "../css/panelbar.css";
import "../css/panelbar.theme.css";
import { Client } from '../client';
import { Plugin } from '../plugin';
import { MenuItem } from '../types';
import { MapDisplay } from '../interface/mapdisplay';
import { Display } from "../display";
import { Mapper } from "./mapper";
import { Chat } from "./chat";
import { Settings } from "../settings";
import { Splitter, Orientation, PanelAnchor } from "../interface/splitter";
import { isMobile } from "../library";
import { Room } from "../map";

interface PanelOptions {
    client: Client;
    chat: Chat;
    mapper: Mapper;
    location?: PanelBarLocation;
}

enum Panels {
    none = 0,
    map = 1 << 1,
    chat = 1 << 2,
    all = map | chat
}

enum PanelBarLocation {
    left = 0,
    top = 1
}
export class PanelBar extends Plugin {
    private _clientContainer;
    private _miniMap: MapDisplay;
    private _miniMapTitle: HTMLElement;
    private _chatDisplay: Display;
    private _mapper: Mapper;
    private _chat: Chat;
    private _panel: HTMLElement;
    private _splitterDistance;
    private _dragging = false;
    private _move;
    private _splitter: Splitter;
    private _panelLocation: PanelBarLocation = PanelBarLocation.top;

    get location(): PanelBarLocation {
        return this._panelLocation;
    }
    set location(value: PanelBarLocation) {
        if (value === this._panelLocation) return;
        if (this._panelLocation === PanelBarLocation.top) {
            this._clientContainer.style.top = '';
            this._panel.style.height = '';
            this._panel.style.right = '';
            document.getElementById('panel-bar-drag-bar').style.right = '';
        }
        else {
            this._clientContainer.style.left = '';
            this._panel.style.width = '';
        }
        this._panelLocation = value;
        this._panel.dataset.location = '' + value;
        document.getElementById('panel-bar-drag-bar').dataset.location = '' + value;
        this._splitter.orientation = this._panelLocation === PanelBarLocation.left ? Orientation.horizontal : Orientation.vertical;
        this._updateInterface();
    }

    constructor(options?: PanelOptions | Client) {
        super(options instanceof Client ? options : options?.client);
        if (options) {
            if ((<PanelOptions>options).mapper && (<PanelOptions>options).mapper instanceof Mapper)
                this._mapper = (<PanelOptions>options).mapper;
            if ((<PanelOptions>options).chat && (<PanelOptions>options).chat instanceof Chat)
                this._chat = (<PanelOptions>options).chat;
        }
        if (options && 'location' in options)
            this._panelLocation = options.location;
        if (!Settings.exist('showPanelBar'))
            Settings.setValue('showPanelBar', !isMobile());
        if (!Settings.exist('panelBar.panels'))
            Settings.setValue('panelBar.panels', Panels.all);
        if (!Settings.exist('panelBar.location'))
            Settings.setValue('panelBar.location', isMobile() ? PanelBarLocation.left : PanelBarLocation.top);
        if (!Settings.exist('panelBar.order'))
            Settings.setValue('panelBar.order', 0);
        this._clientContainer = document.getElementById('client-container');
        this._createSidebar();
    }

    private _createSidebar() {
        document.body.insertAdjacentHTML('beforeend', `<div id="panel-bar-drag-bar" data-location="${this._panelLocation}"></div><div id="panel-bar" data-location="${this._panelLocation}"><button id="panel-bar-close" style="padding: 4px;" type="button"
        class="button button-sm btn-close" title="Hide panel bar"></button></div>`);
        this._panel = document.getElementById('panel-bar');
        this._splitter = new Splitter({ id: 'panel-bar', parent: this._panel, orientation: this._panelLocation === PanelBarLocation.left ? Orientation.horizontal : Orientation.vertical, anchor: PanelAnchor.panel1 });
        this._splitter.splitterWidth = 3;
        this._splitter.live = false;
        if (this.client.getOption('panelBar.separator') >= 200)
            this._splitter.SplitterDistance = this.client.getOption('panelBar.separator');
        this._splitter.on('splitter-moved', distance => {
            this.client.setOption('panelBar.separator', distance);
        });
    }

    public remove(): void {
        this._clearMapper();
        this._clearChat();
        this.client.removeListenersFromCaller(this);
        this.client.display.removeListenersFromCaller(this);
    }
    public initialize(): void {
        this._findPlugins();
        this._initChat();
        this._initMapper();
        this.client.on('plugin-added', plugin => {
            if (!this._chat && plugin instanceof Chat) {
                this._chat = plugin;
                this._initChat();
            }
            if (!this._mapper && plugin instanceof Mapper) {
                this._mapper = plugin;
                this._initMapper();
            }
        }, this);
        this.client.on('plugin-removed', plugin => {
            if (this._chat === plugin) {
                this._clearChat();
                this._chat = null;
            }
            if (this._mapper === plugin) {
                this._clearMapper();
                this._mapper = null;
            }
        }, this);
        this.client.on('options-loaded', () => {
            let w = client.getOption('panelBarSize');
            if (w > this.maxWidth) w = this.maxWidth;
            //Always want min width even if maxWidth is smaller
            if (w < 184 && w != -1) w = 184;
            this.splitterDistance = w;
            this._updateInterface();
            this._loadOptions();
            this._updateMenuItem();
        }, this);
        this.client.on('option-changed', (name: string, value) => {
            if (name.startsWith('mapper.') || name.startsWith('chat.') || name === 'commandDelay' || name === 'commandDelayCount' || name === 'enableMXP' || name === 'enableURLDetection' || name === 'display.showInvalidMXPTags' || name === 'display.hideTrailingEmptyLine') {
                this._loadOptions();
                this._updateMenuItem();
            }
        });
        this.client.display.on('resize', () => {
            this._updateInterface();
        }, this);
        document.getElementById('panel-bar-drag-bar').addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0) return;
            e.preventDefault();
            this._dragging = true;
            const main = document.getElementById('panel-bar-drag-bar');
            let d = 'width';
            let l = 'left';
            let c = 'pageX';
            let b = 'right';
            if (this._panelLocation === PanelBarLocation.top) {
                d = 'height';
                l = 'top';
                c = 'pageY';
                b = 'bottom';
            }

            const w = this._panel.style[d];
            this._panel.style[d] = '';
            const bounds = this._panel.getBoundingClientRect();
            this._panel.style[d] = w;
            const bounds2 = main.getBoundingClientRect();
            const ghostBar = document.createElement('div');

            ghostBar.id = 'panel-bar-ghost-bar';
            if (this._panelLocation === PanelBarLocation.top) {
                ghostBar.style.left = '0';
                ghostBar.style.right = '0';
                ghostBar.style.top = bounds2.top + 'px';
                ghostBar.style.cursor = 'ns-resize';
                ghostBar.style.right = this._clientContainer.style.right;
            }
            else {
                ghostBar.style.top = '0';
                ghostBar.style.bottom = '0';
                ghostBar.style.left = bounds2.left + 'px';
                ghostBar.style.cursor = 'ew-resize';
            }
            ghostBar.dataset.location = '' + this._panelLocation;

            document.body.append(ghostBar);
            //Use max with unless minWidth is larger
            const maxWidth = Math.max(this.maxWidth, bounds[d]);
            this._move = e => {
                if (e[c] >= maxWidth)
                    ghostBar.style[l] = maxWidth + 'px';
                else if (e[c] < bounds[b])
                    ghostBar.style[l] = bounds[b] + 'px';
                else
                    ghostBar.style[l] = e[c] + 'px';
            }
            document.addEventListener('mousemove', this._move);
        });

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mouseup', e => {
            if (!this._dragging) return;
            let d = 'width';
            let c = 'pageX';
            let b = 'right';
            if (this._panelLocation === PanelBarLocation.top) {
                d = 'height';
                c = 'pageY';
                b = 'bottom';
            }

            const w = this._panel.style[d];
            this._panel.style[d] = '';
            const minWidth = this._panel.getBoundingClientRect()[b];
            const bh = document.getElementById('panel-bar-drag-bar').getBoundingClientRect()[d];
            const maxWidth = Math.max(this.maxWidth, minWidth);
            this._panel.style[d] = w;
            if (e[c] >= maxWidth)
                this.splitterDistance = maxWidth;
            else if (e[c] < minWidth)
                this.splitterDistance = minWidth;
            else
                this.splitterDistance = e[c] - bh;
            document.getElementById('panel-bar-ghost-bar').remove();
            document.removeEventListener('mousemove', this._move);
            this._dragging = false;
            this._updateInterface();
        });
        document.getElementById('panel-bar-close').addEventListener('click', () => {
            this.client.setOption('showPanelBar', false);
            this._updateInterface();
            this._updateMenuItem();
        });
        let w = client.getOption('panelBarSize');
        if (w > this.maxWidth) w = this.maxWidth;
        if (w < 184 && w != -1) w = 184;
        this.splitterDistance = w;
        this._updateSplitter();
        this._updateInterface();
        this._miniMapTitle = document.createElement('div');
        this._miniMapTitle.id = 'mini-map-title';
        this._miniMap = new MapDisplay(document.createElement('div'), { map: this._mapper ? this._mapper.map : null });
        this._miniMap.showNavigation = false;
        this._miniMap.container.classList.add('mini-map', 'map', 'panel-container');
        this._miniMap.on('active-room-changed', room => {
            this._setMapTitle(room ? room.area : '');
        });
        this._miniMap.on('current-changed', room => {
            this._setMapTitle(room ? room.area : '');
        })
        this._miniMap.active = new Room(client.getOption('mapper.active'));
        this._miniMap.active.num = this._miniMap.active.num || (this._miniMap.active as any).ID;
        this._chatDisplay = new Display(document.createElement('div'));
        this._chatDisplay.container.classList.add('panel-container');
        this._updateOrder();
        const toolbar = document.createElement('div');
        toolbar.id = 'panel-bar-chat-toolbar';
        toolbar.classList.add('navbar', 'bg-light', 'align-items-center');
        toolbar.innerHTML = '<form class="container-fluid justify-content-start"><button id="btn-chat-panel-clear" type="button" class="ms-2 btn btn-sm btn-outline-secondary me-2 button button-sm" title="Clear display"><i class="bi bi-trash"></i></button><button id="btn-chat-panel-lock" type="button" class="btn btn-sm btn-outline-secondary me-2  button button-sm" title="Lock display"><i class="bi bi-lock-fill"></i></button><div class="vr me-2" style="height: 29px;"></div><button id="btn-chat-panel-wrap" type="button" class="btn btn-sm btn-outline-secondary me-2  button button-sm" title="Toggle word wrap"><i class="bi bi-text-wrap"></i></button></form>';
        this._chatDisplay.container.append(toolbar);

        toolbar.querySelector('#btn-chat-panel-clear').addEventListener('click', () => {
            this._chatDisplay.clear();
        });
        toolbar.querySelector('#btn-chat-panel-lock').addEventListener('click', () => {
            this.client.setOption('chat.scrollLocked', !this.client.getOption('chat.scrollLocked'));
            this._chatDisplay.scrollLock = this.client.getOption('chat.scrollLocked');
            this._updateScrollLockButton(toolbar.querySelector('#btn-chat-panel-lock'), this.client.getOption('chat.scrollLocked'));
        });

        toolbar.querySelector('#btn-chat-panel-wrap').addEventListener('click', () => {
            this.client.setOption('chat.wordWrap', !this.client.getOption('chat.wordWrap'));
            this._updateButtonState(toolbar.querySelector('#btn-chat-panel-wrap'), this.client.getOption('chat.wordWrap'));
            this._chatDisplay.wordWrap = this.client.getOption('chat.wordWrap');
        });
        if (this._miniMap.map)
            this._setMapTitle(this._miniMap.current ? this._miniMap.current.area : '');
        this._loadOptions();
    }
    get menu(): MenuItem[] {
        return [{
            name: '-',
            position: 5,
            exists: '#menu-plugins',
            id: 'plugins'
        },
        {
            id: 'panel-bar',
            name: this.client.getOption('showPanelBar') ? ' Hide panel bar' : ' Show panel bar',
            active: this.client.getOption('showPanelBar'),
            action: e => {
                this.client.setOption('showPanelBar', !this.client.getOption('showPanelBar'));
                this._updateInterface();
                this._updateMenuItem();
            },
            icon: '<i class="bi bi-layout-sidebar"></i>',
            position: '#menu-plugins',
            hidden: this.client.getOption('panelBar.panels') === Panels.none
        }];
    }
    get settings(): MenuItem[] {
        return [{
            name: ' Panel bar',
            action: 'settings-panelBar',
            icon: '<i class="bi bi-layout-sidebar"></i>',
            position: 'a[href="#settings-specialCharacters"]'
        }]
    }

    private _findPlugins() {
        if (this._chat && this._mapper) return;
        for (let p = 0, pl = this.client.plugins.length; p < pl; p++) {
            if (!this._chat && this.client.plugins[p] instanceof Chat) {
                this._chat = this.client.plugins[p] as Chat;
            }
            if (!this._mapper && this.client.plugins[p] instanceof Mapper) {
                this._mapper = this.client.plugins[p] as Mapper;
            }
        }
    }

    private _initChat() {
        if (!this._chat) return;
        this._chat.on('update-chat', data => {
            if (this._chatDisplay) {
                if (typeof data === 'string')
                    this._chatDisplay.append(data);
                else
                    this._chatDisplay.model.appendLines([data]);
            }
        }, this);
    }

    private _initMapper() {
        if (!this._mapper) return;
        this._mapper.on('map-loaded', () => {
            if (this._miniMap) {
                this._miniMap.map = this._mapper.map;
                this._setMapTitle(this._miniMap.active ? this._miniMap.active.area : '');
            }
        }, this);
    }

    private _clearMapper() {
        if (!this._mapper) return;
        this._mapper.map.removeListenersFromCaller(this);
        this._mapper.removeListenersFromCaller(this);
    }

    private _clearChat() {
        if (!this._chat) return;
        this._chat.removeListenersFromCaller(this);
    }

    get splitterDistance(): number { return this._splitterDistance; }
    set splitterDistance(value: number) {
        if (value === this._splitterDistance) return;
        this._splitterDistance = value;
        this._updateSplitter();
    }

    get maxWidth() {
        if (this._panelLocation === PanelBarLocation.top)
            return Math.floor(document.body.clientHeight * 0.33);
        return Math.floor(document.body.clientWidth * 0.33);
    }

    private _updateSplitter() {
        if (!this._splitterDistance || this._splitterDistance < 1) {
            const bounds = this._panel.getBoundingClientRect();
            if (this._panelLocation === PanelBarLocation.top)
                this._splitterDistance = bounds.bottom;
            else
                this._splitterDistance = bounds.right;
        }
        this._updateInterface()
        this.client.setOption('panelBarSize', this._splitterDistance);
        this.emit('split-moved', this._splitterDistance);
    }

    public resize() {
        if (!this.client.getOption('showPanelBar') || this.client.getOption('panelBar.panels') === Panels.none) return;
        let d = 'width';
        let b = 'right';
        if (this._panelLocation === PanelBarLocation.top) {
            d = 'height';
            b = 'bottom';
        }

        const w = this._panel.style[d];
        this._panel.style[d] = '';
        const minWidth = this._panel.getBoundingClientRect()[b];
        const maxWidth = Math.max(this.maxWidth, minWidth);
        this._panel.style[d] = w;
        const bounds = this._panel.getBoundingClientRect();
        if (bounds[d] < minWidth) {
            this.splitterDistance = minWidth;
        }
        else if (bounds[d] > maxWidth) {
            this.splitterDistance = maxWidth;
        }
    }

    private _updateInterface() {
        if (!this.client.getOption('showPanelBar') || this.client.getOption('panelBar.panels') === Panels.none) {
            if (this._panelLocation === PanelBarLocation.top)
                this._clientContainer.style.top = '';
            else
                this._clientContainer.style.left = '';
            this._panel.style.visibility = 'hidden';
            this._panel.style.display = 'none';
            document.getElementById('panel-bar-drag-bar').style.display = 'none';
            this.emit('updated-interface');
            return;
        }
        if (this._panelLocation === PanelBarLocation.top) {
            this._clientContainer.style.top = this._splitterDistance + 'px';
            this._panel.style.height = this._splitterDistance + 'px';
            this._panel.style.right = this._clientContainer.style.right;
            document.getElementById('panel-bar-drag-bar').style.right = this._clientContainer.style.right;
            document.getElementById('panel-bar-drag-bar').style.top = this.splitterDistance + 'px'
        }
        else {
            this._clientContainer.style.left = this._splitterDistance + 'px';
            this._panel.style.width = this._splitterDistance + 'px';
            this._panel.style.right = '';
            document.getElementById('panel-bar-drag-bar').style.left = this.splitterDistance + 'px'
        }
        this._panel.style.visibility = '';
        this._panel.style.display = '';
        document.getElementById('panel-bar-drag-bar').style.display = '';
        this.emit('updated-interface');
    }

    private _loadDisplayOptions(display) {
        if (!display) return;
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

    private _loadOptions() {
        this._loadDisplayOptions(this._chatDisplay);
        this._miniMap.commandDelay = client.getOption('commandDelay');
        this._miniMap.commandDelayCount = client.getOption('commandDelayCount');
        this._miniMap.enabled = this.client.getOption('mapper.enabled');
        this._miniMap.follow = this.client.getOption('mapper.follow');
        this._miniMap.splitArea = this.client.getOption('mapper.split');
        this._miniMap.fillWalls = this.client.getOption('mapper.fill');
        if (this._miniMap.follow)
            this._miniMap.focusCurrentRoom();
        this._splitter.panel1Collapsed = (this.client.getOption('panelBar.panels') & Panels.map) !== Panels.map;
        this._splitter.panel2Collapsed = (this.client.getOption('panelBar.panels') & Panels.chat) !== Panels.chat;
        this.location = this.client.getOption('panelBar.location');
        this._updateOrder();
        this._updateScrollLockButton(this._splitter.panel2.querySelector('#btn-chat-panel-lock'), this.client.getOption('chat.scrollLocked'));
        this._updateButtonState(this._splitter.panel2.querySelector('#btn-chat-panel-wrap'), this.client.getOption('chat.wordWrap'));
    }

    private _updateMenuItem() {
        let button = document.querySelector('#menu-panel-bar') as HTMLElement;
        if (client.getOption('showPanelBar')) {
            button.title = 'Hide panel bar';
            button.classList.add('active');
            document.querySelector('#menu-panel-bar a span').textContent = ' Hide panel bar';
        }
        else {
            button.title = 'Show panel bar';
            button.classList.remove('active');
            document.querySelector('#menu-panel-bar a span').textContent = ' Show panel bar';
        }
        if (this.client.getOption('panelBar.panels') === Panels.none) {
            button.style.display = 'none';
            button.style.visibility = 'hidden';
        }
        else {
            button.style.display = 'list-item';
            button.style.visibility = 'visible';
        }
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

    private _setMapTitle(title) {
        this._miniMapTitle.textContent = title || '';
    }
    
    private _updateOrder() {
        if (this.client.getOption('panelBar.order') === 1) {
            this._splitter.panel2.append(this._miniMap.container);
            this._splitter.panel1.append(this._chatDisplay.container);
        }
        else {
            this._splitter.panel1.append(this._miniMap.container);
            this._splitter.panel2.append(this._chatDisplay.container);
        }
        this._miniMap.container.insertAdjacentElement('beforebegin', this._miniMapTitle);
    }
}