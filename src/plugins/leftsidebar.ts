import "../css/leftsidebar.css";
import "../css/leftsidebar.theme.css";
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

interface LeftSidebarOptions {
    client: Client;
    chat: Chat;
    mapper: Mapper;
}

enum Panels {
    none = 0,
    map = 1 << 1,
    chat = 1 << 2,
    all = map | chat
}

export class LeftSidebar extends Plugin {
    private _clientContainer;
    private _miniMap: MapDisplay;
    private _chatDisplay: Display;
    private _mapper: Mapper;
    private _chat: Chat;
    private _sidebar: HTMLElement;
    private _splitterDistance;
    private _dragging = false;
    private _move;
    private _splitter: Splitter;

    constructor(options?: LeftSidebarOptions | Client) {
        super(options instanceof Client ? options : options?.client);
        if (options) {
            if ((<LeftSidebarOptions>options).mapper && (<LeftSidebarOptions>options).mapper instanceof Mapper)
                this._mapper = (<LeftSidebarOptions>options).mapper;
            if ((<LeftSidebarOptions>options).chat && (<LeftSidebarOptions>options).chat instanceof Chat)
                this._chat = (<LeftSidebarOptions>options).chat;
        }
        if (!Settings.exist('showLeftSidebar'))
            Settings.setValue('showLeftSidebar', !isMobile());
        if (!Settings.exist('leftSidebar.panels'))
            Settings.setValue('leftSidebar.panels', Panels.all);

        this._clientContainer = document.getElementById('client-container');
        this._createSidebar();
    }

    private _createSidebar() {
        document.body.insertAdjacentHTML('beforeend', `<div id="left-sidebar-drag-bar"></div><div id="left-sidebar"><button id="left-sidebar-close" style="padding: 4px;" type="button"
        class="button button-sm btn-close" title="Hide left sidebar"></button></div>`);
        this._sidebar = document.getElementById('left-sidebar');
        this._splitter = new Splitter({ id: 'left-sidebar', parent: this._sidebar, orientation: Orientation.horizontal, anchor: PanelAnchor.panel1 });
        this._splitter.splitterWidth = 3;
        if (this.client.getOption('leftSidebar.separator') >= 200)
            this._splitter.SplitterDistance = this.client.getOption('leftSidebar.separator');
        this._splitter.on('splitter-moved', distance => {
            this.client.setOption('leftSidebar.separator', distance);
        });
    }

    public remove(): void {
        this._clearMapper();
        this._clearChat();
        this.client.removeListenersFromCaller(this);
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
            let w = client.getOption('leftSidebarWidth');
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
        })
        document.getElementById('left-sidebar-drag-bar').addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0) return;
            e.preventDefault();
            this._dragging = true;
            const main = document.getElementById('left-sidebar-drag-bar');
            const w = this._sidebar.style.width;
            this._sidebar.style.width = '';
            const bounds = this._sidebar.getBoundingClientRect();
            this._sidebar.style.width = w;
            const bounds2 = main.getBoundingClientRect();
            const ghostBar = document.createElement('div');
            ghostBar.id = 'left-sidebar-ghost-bar';
            ghostBar.style.top = '0';
            ghostBar.style.bottom = '0';
            ghostBar.style.left = bounds2.left + 'px';
            ghostBar.style.cursor = 'ew-resize';
            document.body.append(ghostBar);
            //Use max with unless minWidth is larger
            const maxWidth = Math.max(this.maxWidth, bounds.width);
            this._move = e => {
                if (e.pageX >= maxWidth)
                    ghostBar.style.left = maxWidth + 'px';
                else if (e.pageX < bounds.right)
                    ghostBar.style.left = bounds.right + 'px';
                else
                    ghostBar.style.left = e.pageX + 'px';
            }
            document.addEventListener('mousemove', this._move);
        });

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mouseup', e => {
            if (!this._dragging) return;
            const w = this._sidebar.style.width;
            this._sidebar.style.width = '';
            const bounds = this._sidebar.getBoundingClientRect();
            const minWidth = bounds.right;
            const l = document.getElementById('left-sidebar-drag-bar').getBoundingClientRect().width;
            const maxWidth = Math.max(this.maxWidth, minWidth);
            this._sidebar.style.width = w;
            if (e.pageX >= maxWidth)
                this.splitterDistance = maxWidth;
            else if (e.pageX < minWidth)
                this.splitterDistance = minWidth;
            else
                this.splitterDistance = e.pageX - l;
            document.getElementById('left-sidebar-ghost-bar').remove();
            document.removeEventListener('mousemove', this._move);
            this._dragging = false;
            this._updateInterface();
        });
        document.getElementById('left-sidebar-close').addEventListener('click', () => {
            this.client.setOption('showLeftSidebar', false);
            this._updateInterface();
            this._updateMenuItem();
        });
        let w = client.getOption('leftSidebarWidth');
        if (w > this.maxWidth) w = this.maxWidth;
        if (w < 184 && w != -1) w = 184;
        this.splitterDistance = w;
        this._updateSplitter();
        this._updateInterface();
        this._miniMap = new MapDisplay(this._splitter.panel1, { map: this._mapper ? this._mapper.map : null });
        this._miniMap.showNavigation = false;
        this._miniMap.container.classList.add('mini-map', 'map');
        this._chatDisplay = new Display(this._splitter.panel2);
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
            id: 'left-sidebar',
            name: this.client.getOption('showLeftSidebar') ? ' Hide left sidebar' : ' Show left sidebar',
            active: this.client.getOption('showLeftSidebar'),
            action: e => {
                this.client.setOption('showLeftSidebar', !this.client.getOption('showLeftSidebar'));
                this._updateInterface();
                this._updateMenuItem();
            },
            icon: '<i class="bi bi-layout-sidebar"></i>',
            position: '#menu-plugins',
            hidden: this.client.getOption('leftSidebar.panels') === Panels.none
        }];
    }
    get settings(): MenuItem[] {
        return [{
            name: ' Left sidebar',
            action: 'settings-leftSidebar',
            icon: '<i class="bi bi-layout-sidebar"></i>',
            position: 7
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
            if (this._miniMap)
                this._miniMap.map = this._mapper.map;
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
        return Math.floor(document.body.clientWidth * 0.33);
    }

    private _updateSplitter() {
        if (!this._splitterDistance || this._splitterDistance < 1) {
            const bounds = this._sidebar.getBoundingClientRect();
            this._splitterDistance = bounds.right;
        }
        this._updateInterface()
        this.client.setOption('leftSidebarWidth', this._splitterDistance);
        this.emit('split-moved', this._splitterDistance);
    }

    public resize() {
        if (!this.client.getOption('showLeftSidebar') || this.client.getOption('leftSidebar.panels') === Panels.none) return;
        const w = this._sidebar.style.width;
        this._sidebar.style.width = '';
        const bounds = this._sidebar.getBoundingClientRect();
        const minWidth = bounds.right;
        const maxWidth = Math.max(this.maxWidth, minWidth);
        this._sidebar.style.width = w;
        const bounds2 = this._sidebar.getBoundingClientRect();
        if (bounds2.width < minWidth) {
            this.splitterDistance = minWidth;
        }
        else if (bounds2.width > maxWidth) {
            this.splitterDistance = maxWidth;
        }
    }

    private _updateInterface() {
        if (!this.client.getOption('showLeftSidebar') || this.client.getOption('leftSidebar.panels') === Panels.none) {
            this._clientContainer.style.left = '';
            this._sidebar.style.visibility = 'hidden';
            this._sidebar.style.display = 'none';
            document.getElementById('left-sidebar-drag-bar').style.display = 'none';
            this.emit('updated-interface');
            return;
        }
        this._clientContainer.style.left = this._splitterDistance + 'px';
        this._sidebar.style.width = this._splitterDistance + 'px';
        document.getElementById('left-sidebar-drag-bar').style.left = this.splitterDistance + 'px'
        this._sidebar.style.visibility = '';
        this._sidebar.style.display = '';
        document.getElementById('left-sidebar-drag-bar').style.display = '';
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
        this._splitter.panel1Collapsed = (this.client.getOption('leftSidebar.panels') & Panels.map) !== Panels.map;
        this._splitter.panel2Collapsed = (this.client.getOption('leftSidebar.panels') & Panels.chat) !== Panels.chat;
    }

    private _updateMenuItem() {
        let button = document.querySelector('#menu-left-sidebar') as HTMLElement;
        if (client.getOption('showLeftSidebar')) {
            button.title = 'Hide left sidebar';
            button.classList.add('active');
            document.querySelector('#menu-left-sidebar a span').textContent = ' Hide left sidebar';
        }
        else {
            button.title = 'Show left sidebar';
            button.classList.remove('active');
            document.querySelector('#menu-left-sidebar a span').textContent = ' Show left sidebar';
        }
        if (this.client.getOption('leftSidebar.panels') === Panels.none) {
            button.style.display = 'none';
            button.style.visibility = 'hidden';
        }
        else {
            button.style.display = 'list-item';
            button.style.visibility = 'visible';
        }
    }
}