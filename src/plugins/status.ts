import "../css/status.css";
import "../css/status.theme.css";
import { Client } from './../client';
import { Plugin } from '../plugin';
import { MenuItem } from '../types';

export enum UpdateType { none = 0, sortCombat = 1, sortParty = 2, overall = 4, xp = 8, status = 16 }

//import status html layout
// @ts-ignore
import statusDisplay from '../html/status.htm'

export class Status extends Plugin {
    private _clientContainer;
    private _info = [];
    private _infoAC = [];
    private _infoLimb = [];
    private _ac: boolean = false;
    private _lagMeter: HTMLElement;
    private _updating: UpdateType;
    private _rTimeout = 0;
    private _dragging = false;
    private _splitterDistance;
    private _status: HTMLElement;
    private _styles: CSSStyleDeclaration;
    private _move;

    get splitterDistance(): number { return this._splitterDistance; }
    set splitterDistance(value: number) {
        if (value === this._splitterDistance) return;
        this._splitterDistance = value;
        this._updateSplitter();
    }

    get maxWidth() {
        return Math.floor(document.body.clientWidth * 0.66);
    }

    get currentLag(): string {
        if (!this._lagMeter || !this._lagMeter.firstElementChild) return '';
        return this._lagMeter.firstElementChild.textContent || '';
    }

    private _updateSplitter() {
        const p = parseInt(this._styles.right, 10) * 2;
        if (!this._splitterDistance || this._splitterDistance < 1) {
            const bounds = this._status.getBoundingClientRect();
            this._splitterDistance = bounds.width + document.body.clientWidth - bounds.right;
        }
        if (!this.client.getOption('showStatus'))
            this.updateInterface();
        else {
            if (!this.client.getOption('statusMode'))
                this._clientContainer.style.right = this._splitterDistance + 'px';
            this._status.style.width = this._splitterDistance - p + 'px';
            document.getElementById('status-drag-bar').style.right = this.splitterDistance + 'px'
        }
        this.client.setOption('statusWidth', this._splitterDistance);
        this.emit('split-moved', this._splitterDistance);
    }

    constructor(client: Client) {
        super(client);
        this._clientContainer = document.getElementById('client-container');
    }
    public remove(): void {
        let idx = this.client.telnet.GMCPSupports.indexOf('Char 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
        idx = this.client.telnet.GMCPSupports.indexOf('Char.Vitals 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
        idx = this.client.telnet.GMCPSupports.indexOf('Char.Experience 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
        idx = this.client.telnet.GMCPSupports.indexOf('oMUD 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
        idx = this.client.telnet.GMCPSupports.indexOf('Char.Skills 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
        this.client.removeListenersFromCaller(this);
        this.client.telnet.removeListenersFromCaller(this);
        delete window.$character;
        delete window.$characterid;
    }
    public initialize(): void {
        document.body.insertAdjacentHTML('beforeend', statusDisplay);
        this._status = document.getElementById('status');
        this._styles = getComputedStyle(this._status);
        this.client.telnet.GMCPSupports.push('oMUD 1', 'Char 1', 'Char.Vitals 1', 'Char.Experience 1', 'Char.Skills 1');
        this.client.on('received-GMCP', this.processGMCP, this);
        this.client.on('window', (window, args, name) => {
            //TODO add skills dialog
            /*
            if (window === 'mapper') {
                if (args === 'close') {
                    if (this._dialog) this._dialog.close();
                }
                else
                    this.show();
            }
            */
        });
        this.client.on('close-window', window => {
            //TODO add skills dialog
            //if (window === 'skills') 
        });        
        this._lagMeter = document.getElementById('lagMeter');
        this.client.telnet.on('latency-changed', (lag, avg) => {
            this.updateLagMeter(lag);
        });
        this.client.on('closed', () => {
            this.updateLagMeter(0, true);
        });
        this.client.telnet.GMCPSupports.push('oMUD 1');
        this.client.telnet.GMCPSupports.push('Char.Skills 1');
        this.client.on('add-line', (data) => {
            if (data.line === 'Connected...')
                this.init();
        });
        this.client.on('options-loaded', () => {
            this._info['EXPERIENCE_NEED'] = this._info['EXPERIENCE_NEED_RAW'] - this._info['EXPERIENCE'];

            if (this.client.getOption('showArmor')) {
                this.ac = true;
                this._status.querySelector('#health').classList.remove('active');
                this._status.querySelector('#armor').classList.add('active');
            }
            this.splitterDistance = client.getOption('statusWidth');
            this.updateInterface();
        });
        this.on('debug', e => this.client.debug(e), this);
        this.on('error', e => this.client.error(e), this);
        document.getElementById('status-drag-bar').addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0) return;
            e.preventDefault();
            this._dragging = true;
            const main = document.getElementById('status-drag-bar');
            const w = this._status.style.width;
            this._status.style.width = '';
            const bounds = this._status.getBoundingClientRect();
            this._status.style.width = w;
            const bounds2 = main.getBoundingClientRect();
            const ghostBar = document.createElement('div');
            ghostBar.id = 'status-ghost-bar';
            ghostBar.style.top = '0';
            ghostBar.style.bottom = '0';
            ghostBar.style.left = bounds2.left + 'px';
            ghostBar.style.cursor = 'ew-resize';
            document.body.append(ghostBar);
            const maxWidth = this.maxWidth;
            this._move = e => {
                if (e.pageX < maxWidth)
                    ghostBar.style.left = maxWidth - bounds2.width + 'px';
                else if (e.pageX > bounds.left - bounds2.width)
                    ghostBar.style.left = bounds.left + parseInt(this._styles.right, 10) - bounds2.width + 'px';
                else
                    ghostBar.style.left = e.pageX + 'px';
            }
            document.addEventListener('mousemove', this._move);
        });

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mouseup', e => {
            if (!this._dragging) return;
            const w = this._status.style.width;
            this._status.style.width = '';
            const bounds = this._status.getBoundingClientRect();
            const minWidth = (bounds.width + parseInt(this._styles.right, 10));
            const maxWidth = this.maxWidth;
            const l = document.getElementById('status-drag-bar').getBoundingClientRect().width;
            this._status.style.width = w;
            if (e.pageX < maxWidth)
                this.splitterDistance = document.body.clientWidth - maxWidth;
            else if (e.pageX > bounds.left - l)
                this.splitterDistance = minWidth;
            else
                this.splitterDistance = document.body.clientWidth - e.pageX - l;
            //this.splitterDistance = document.body.clientWidth - e.pageX + Math.abs(parseInt(document.getElementById('status-drag-bar').style.right, 10) || 0);
            //this.splitterDistance = document.body.clientWidth - e.pageX + Math.abs(parseInt((this._status.querySelector('#status-drag-bar') as HTMLElement).style.left, 10) || 0);
            document.getElementById('status-ghost-bar').remove();
            document.removeEventListener('mousemove', this._move);
            this._dragging = false;
            this.updateInterface();
        });
        document.getElementById('status-close').addEventListener('click', () => {
            this.client.setOption('showStatus', false);
            this.updateInterface();
            let button = document.querySelector('#menu-status') as HTMLElement;
            if (client.getOption('showStatus')) {
                button.title = 'Hide status';
                button.classList.add('active');
                document.querySelector('#menu-status a span').textContent = 'Hide status';
            }
            else {
                button.title = 'Show status';
                button.classList.remove('active');
                document.querySelector('#menu-status a span').textContent = 'Show status';
            }
        });

        this._status.querySelector('#health').addEventListener('click', () => {
            if (!this.ac) return;
            this.ac = false;
            this._status.querySelector('#health').classList.add('active');
            this._status.querySelector('#armor').classList.remove('active');
            this.client.setOption('showArmor', this.ac);
        });

        this._status.querySelector('#armor').addEventListener('click', () => {
            if (this.ac) return;
            this.ac = true;
            this._status.querySelector('#health').classList.remove('active');
            this._status.querySelector('#armor').classList.add('active');
            this.client.setOption('showArmor', this.ac);
        });

        if (this.client.getOption('showArmor')) {
            this.ac = true;
            this._status.querySelector('#health').classList.remove('active');
            this._status.querySelector('#armor').classList.add('active');
        }
        this.splitterDistance = client.getOption('statusWidth');

        Object.defineProperty(window, '$character', {
            get: () => {
                if (!this._info) return '';
                return this._info['name'] || '';
            },
            configurable: true
        });

        //no character manager so return -1 to prevent breaking
        Object.defineProperty(window, '$characterid', {
            get: function () {
                return -1;
            },
            configurable: true
        });
        this.client.display.container.append(document.getElementById('status-simple-lagMeter'));
        this._updateSplitter();
        this.updateInterface();
        this.init();
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
                id: 'status',
                name: this.client.getOption('showStatus') ? 'Hide status' : 'Show status',
                active: this.client.getOption('showStatus'),
                action: e => {
                    this.client.setOption('showStatus', !this.client.getOption('showStatus'));
                    this.updateInterface();
                    let button = document.querySelector('#menu-status') as HTMLElement;
                    if (client.getOption('showStatus')) {
                        button.title = 'Hide status';
                        button.classList.add('active');
                        document.querySelector('#menu-status a span').textContent = 'Hide status';
                    }
                    else {
                        button.title = 'Show status';
                        button.classList.remove('active');
                        document.querySelector('#menu-status a span').textContent = 'Show status';
                    }
                },
                icon: '<i class="fa-solid fa-heart"></i>',
                position: 6
            }]
    }
    get settings(): MenuItem[] {
        return [{
            name: ' Status',
            action: 'settings-status',
            icon: '<i class="fa-solid fa-heart"></i>',
            position: 7
        }]
    }

    public async processGMCP(mod: string, obj: any) {
        try {
            let limb;
            switch (mod.toLowerCase()) {
                case 'char.name':
                    this._info['name'] = obj.name;
                    this.setTitle(obj.name);
                    break;
                case 'char.base':
                    this.init();
                    this._info['name'] = obj.name;
                    this.setTitle(obj.name);
                    break;
                case 'char.vitals':
                    this.updateBar('hp-bar', obj.hp, obj.hpmax);
                    this.updateBar('sp-bar', obj.sp, obj.spmax);
                    this.updateBar('mp-bar', obj.mp, obj.mpmax);
                    this._info['hp'] = obj.hp;
                    this._info['hpmax'] = obj.hpmax;
                    this._info['sp'] = obj.sp;
                    this._info['spmax'] = obj.spmax;
                    this._info['mp'] = obj.mp;
                    this._info['mpmax'] = obj.mpmax;
                    this.updateSimpleBar('status-simple-hp');
                    this.updateSimpleBar('status-simple-sp');
                    this.updateSimpleBar('status-simple-mp');
                    this._doUpdate(UpdateType.overall);
                    break;
                case 'char.experience':
                    this._info['EXPERIENCE'] = obj.current;
                    this._info['EXPERIENCE_NEED_RAW'] = obj.need;
                    this._info['EXPERIENCE_NEED'] = obj.need - obj.current;
                    this._info['EXPERIENCE_NEED_P'] = obj.needPercent;
                    this._info['EXPERIENCE_EARNED'] = obj.earned;
                    this._info['EXPERIENCE_BANKED'] = obj.banked;
                    this._doUpdate(UpdateType.xp);
                    break;
                case 'omud.ac':
                    for (limb in obj) {
                        if (!obj.hasOwnProperty(limb)) continue;
                        this.setLimbAC(limb, obj[limb]);
                        this.updateLimb(limb);
                    }
                    break;
                case 'omud.limb':
                    for (limb in obj) {
                        if (!obj.hasOwnProperty(limb)) continue;
                        this.setLimbHealth(limb, obj[limb]);
                        this.updateLimb(limb);
                    }
                    break;
                case 'omud.weapons':
                    for (limb in obj) {
                        if (!obj.hasOwnProperty(limb)) continue;
                        this.setWeapon(limb, obj[limb]);
                    }
                    break;
                case 'omud.environment':
                    if (obj.weather) {
                        const env = document.getElementById('environment');
                        //env.className = env.className.split(' ').filter(c => !c.match(/^(weather-.*|intensity-hard)$/)).join(' ');
                        env.classList.remove('weather-' + this._info['WEATHER'], 'intensity-hard');
                        this._info['WEATHER'] = obj.weather;
                        this._info['WEATHER_INTENSITY'] = obj.weather_intensity;
                        if (obj.weather !== '0' && obj.weather !== 'none')
                            env.classList.add('weather-' + obj.weather);
                        if (obj.weather_intensity > 6)
                            env.classList.add('intensity-hard');
                    }
                    if (obj.tod) {
                        const env = document.getElementById('environment');
                        env.classList.remove('day', 'night', 'twilight', 'dawn');
                        env.classList.add(obj.tod);
                        $('#environment').removeClass((index, className) => {
                            return (className.match(/(^|\s)moon\d-\S+/g) || []).join(' ');
                        });
                        if (obj.moons) {
                            env.classList.add('moon1-' + obj.moons[0]);
                            env.classList.add('moon2-' + obj.moons[1]);
                            env.classList.add('moon3-' + obj.moons[2]);
                        }
                    }
                    break;
                case 'omud.combat':
                    if (obj.action === 'leave') {
                        this._clear('combat');
                        this.emit('leave combat');
                    }
                    else if (obj.action === 'add')
                        this.createIconBar('#combat', this._getID(obj, 'combat_'), obj.name, obj.hp, 100, this._livingClass(obj, 'monster-'), obj.order);
                    else if (obj.action === 'update') {
                        if (obj.hp === 0)
                            this.removeBar(this._getID(obj, 'combat_'));
                        else
                            this.createIconBar('#combat', this._getID(obj, 'combat_'), obj.name, obj.hp, 100, this._livingClass(obj, 'monster-'), obj.order);
                    }
                    else if (obj.action === 'remove')
                        this.removeBar(this._getID(obj, 'combat_'));
                    break;
                case 'omud.party':
                    if (obj.action === 'leave') {
                        this._clear('party');
                        this.emit('leave party');
                    }
                    else if (obj.action === 'add') {
                        this.createIconBar('#party', this._getID(obj, 'party_'), obj.name, obj.hp, 100, this._livingClass(obj, 'party-'), obj.name.replace('"', ''));
                    }
                    else if (obj.action === 'update') {
                        if (obj.hp === 0)
                            this.removeBar(this._getID(obj, 'party_'), true);
                        else
                            this.createIconBar('#party', this._getID(obj, 'party_'), obj.name, obj.hp, 100, this._livingClass(obj, 'party-'), obj.name.replace('"', ''));
                    }
                    else if (obj.action === 'remove')
                        this.removeBar(this._getID(obj, 'party_'), true);

                    if ((limb = document.getElementById('party')).children.length)
                        limb.classList.add('hasmembers');
                    else
                        limb.classList.remove('hasmembers');
                    break;
                case 'omud.skill':
                    if (obj.skill && obj.skill.length) {
                        if (!this._info['skills'][obj.skill]) this._info['skills'][obj.skill] = { amount: 0, bonus: 0, percent: 0 };
                        if (obj.hasOwnProperty('percent'))
                            this._info['skills'][obj.skill].percent = obj.percent || 0;
                        if (obj.hasOwnProperty('amount')) {
                            this._info['skills'][obj.skill].amount = obj.amount;
                            this._info['skills'][obj.skill].bonus = obj.bonus || 0;
                            this._info['skills'][obj.skill].category = obj.category;
                        }
                        this.emit('skill updated', obj.skill, this._info['skills'][obj.skill]);
                    }
                    break;
            }
        }
        catch (e) {
            this.emit('error', e);
        }
    }

    public updateInterface(noSplitter?) {

        if (!this.client.getOption('showStatus')) {
            this._clientContainer.style.right = '';
            this._status.style.visibility = 'hidden';
            this._status.style.display = 'none';
            document.getElementById('status-drag-bar').style.display = 'none';
            this.emit('updated-interface');
            document.getElementById('status-simple').style.display = 'none';
            document.getElementById('status-simple-lagMeter').style.visibility = this.client.getOption('lagMeter') ? 'visible' : '';
            return;
        }
        if (this.client.getOption('statusMode')) {
            this._clientContainer.style.right = '';
            this._status.style.visibility = 'hidden';
            this._status.style.display = 'none';
            document.getElementById('status-drag-bar').style.display = 'none';
            document.getElementById('status-simple').style.display = '';
            document.getElementById('status-simple-lagMeter').style.visibility = this.client.getOption('lagMeter') ? 'visible' : '';
            this.emit('updated-interface');
            return;
        }
        document.getElementById('status-simple').style.display = 'none';
        document.getElementById('status-simple-lagMeter').style.visibility = '';

        const p = parseInt(this._styles.right, 10) * 2;
        this._clientContainer.style.right = this._splitterDistance + 'px';
        this._status.style.width = this._splitterDistance - p + 'px';

        this._status.style.visibility = '';
        this._status.style.display = '';
        document.getElementById('status-drag-bar').style.display = '';

        if (this.client.getOption('statusExperienceNeededProgressbar')) {
            $('#need-value').css('display', 'none');
            $('#need-percent').css('display', 'block');
        }
        else {
            $('#need-value').css('display', '');
            $('#need-percent').css('display', 'none');
        }

        if (this.client.getOption('showStatusWeather'))
            $('#environment').css('display', '');
        else
            $('#environment').css('display', 'none');

        if (!this.client.getOption('showStatusLimbs') && !this.client.getOption('showStatusHealth'))
            $('#body').css('display', 'none');
        else
            $('#body').css('display', '');

        if (!this.client.getOption('showStatusLimbs'))
            $('#limbs').css('display', 'none');
        else
            $('#limbs').css('display', '');
        if (!this.client.getOption('showStatusHealth'))
            $('#hp-status').css('display', 'none');
        else
            $('#hp-status').css('display', '');

        if (this.client.getOption('showStatusExperience'))
            $('#experience').css('display', '');
        else
            $('#experience').css('display', 'none');

        if (!this.client.getOption('showStatusPartyHealth') && !this.client.getOption('showStatusCombatHealth'))
            $('#bars').css('min-height', '');
        else
            $('#bars').css('min-height', '0');

        if (this.client.getOption('showStatusPartyHealth'))
            $('#party').css('display', '');
        else
            $('#party').css('display', 'none');

        if (this.client.getOption('showStatusCombatHealth'))
            $('#combat').css('display', '');
        else
            $('#combat').css('display', 'none');

        if (this._lagMeter) {
            if (this.client.getOption('lagMeter')) {
                this._lagMeter.style.visibility = '';
                this._lagMeter.style.display = '';
                this.updateLagMeter(0, true);
            }
            else {
                this._lagMeter.style.visibility = 'hidden';
                this._lagMeter.style.display = 'none';
            }
        }
        if (!noSplitter)
            this._updateSplitter();
        this.emit('updated-interface');
    }

    public setTitle(title: string, lag?: string) {
        if (!title || title.length === 0)
            this._status.querySelector('#character-name').innerHTML = '&nbsp;';
        else
            this._status.querySelector('#character-name').textContent = title;

        if (this.client.connected && lag && lag.length) {
            if (title && title.length)
                title = `${title} - ${lag}`;
            else
                title = `${lag}`;
        }
        client.emit('set-title', title || '');
    }

    public init() {
        this.setTitle('');
        this._info = [];
        this._info['WEATHER'] = 'none';
        this._info['WEATHER_INTENSITY'] = 0;
        this._info['EXPERIENCE'] = 0;
        this._info['EXPERIENCE_NEED'] = 0;
        this._info['EXPERIENCE_NEED_P'] = 0;
        this._info['EXPERIENCE_NEED_RAW'] = 0;
        this._info['EXPERIENCE_EARNED'] = 0;
        this._info['EXPERIENCE_BANKED'] = 0;
        this._info['skills'] = {};

        this._infoAC = [];
        this._infoAC['head'] = 0;
        this._infoAC['leftarm'] = 0;
        this._infoAC['leftfoot'] = 0;
        this._infoAC['lefthand'] = 0;
        this._infoAC['leftleg'] = 0;
        this._infoAC['rightarm'] = 0;
        this._infoAC['rightfoot'] = 0;
        this._infoAC['righthand'] = 0;
        this._infoAC['rightleg'] = 0;
        this._infoAC['torso'] = 0;
        this._infoAC['overall'] = 0;

        this._infoLimb = [];
        this._infoLimb['head'] = 0;
        this._infoLimb['leftarm'] = 0;
        this._infoLimb['leftfoot'] = 0;
        this._infoLimb['lefthand'] = 0;
        this._infoLimb['leftleg'] = 0;
        this._infoLimb['rightarm'] = 0;
        this._infoLimb['rightfoot'] = 0;
        this._infoLimb['righthand'] = 0;
        this._infoLimb['rightleg'] = 0;
        this._infoLimb['torso'] = 0;

        document.getElementById('leftwing').style.display = 'none';
        document.getElementById('rightwing').style.display = 'none';
        document.getElementById('tail').style.display = 'none';
        this.updateBar('hp-bar', 0, 0);
        this.updateBar('sp-bar', 0, 0);
        this.updateBar('mp-bar', 0, 0);
        this.updateSimpleBar('status-simple-hp');
        this.updateSimpleBar('status-simple-sp');
        this.updateSimpleBar('status-simple-mp');
        document.getElementById('xp-value').textContent = '0';
        document.getElementById('xp-banked').textContent = '0';
        document.getElementById('need-value').textContent = '0';
        document.getElementById('earn-value').textContent = '0';
        this.updateBar('need-percent', 0, 0, '0');
        this.updateBar('status-simple-xp', 0, 0, '', true);
        this._clear('combat');
        this._clear('party');
        document.getElementById('party').classList.remove('hasmembers');
        this.updateOverall();
        this.updateStatus();
        this.emit('skill init');
    }

    private _clear(id) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    }

    public updateStatus() {
        let limb;
        if (this._ac)
            for (limb in this._infoAC)
                this.updateLimb(limb);
        else
            for (limb in this._infoLimb)
                this.updateLimb(limb);
        this._doUpdate(UpdateType.overall | UpdateType.xp);
    }

    public updateOverall() {
        const el = document.getElementById('overall');
        el.className = '';
        if (this._ac) {
            if (this._infoAC['overall'] === 6.5) {
                el.textContent = 'Extensively';
                el.classList.add('armor-extensively');
            }
            else if (this._infoAC['overall'] === 6) {
                el.textContent = 'Completely';
                el.classList.add('armor-completely');
            }
            else if (this._infoAC['overall'] === 5.5) {
                el.textContent = 'Significantly';
                el.classList.add('armor-significantly');
            }
            else if (this._infoAC['overall'] === 5) {
                el.textContent = 'Considerably';
                el.classList.add('armor-considerably');
            }
            else if (this._infoAC['overall'] === 4.5) {
                el.textContent = 'Well';
                el.classList.add('armor-well');
            }
            else if (this._infoAC['overall'] === 4) {
                el.textContent = 'Adequately';
                el.classList.add('armor-adequately');
            }
            else if (this._infoAC['overall'] === 3.5) {
                el.textContent = 'Fairly';
                el.classList.add('armor-fairly');
            }
            else if (this._infoAC['overall'] === 3) {
                el.textContent = 'Moderately';
                el.classList.add('armor-moderately');
            }
            else if (this._infoAC['overall'] === 2.5) {
                el.textContent = 'Somewhat';
                el.classList.add('armor-somewhat');
            }
            else if (this._infoAC['overall'] === 2) {
                el.textContent = 'Slightly';
                el.classList.add('armor-slightly');
            }
            else if (this._infoAC['overall'] === 1) {
                el.textContent = 'Barely';
                el.classList.add('armor-barely');
            }
            else {
                el.textContent = 'UNARMORED';
                el.classList.add('armor-unarmored');
            }
        }
        else {
            let v = 100;
            if (this._info['hpmax'] !== 0 && !isNaN(this._info['hpmax']))
                v *= this._info['hp'] / this._info['hpmax'];
            if (v > 90) {
                el.textContent = 'Top shape';
                el.classList.add('health-full');
            }
            else if (v > 75) {
                el.textContent = 'Decent shape';
                el.classList.add('health-1-19');
            }
            else if (v > 60) {
                el.textContent = 'Slightly injured';
                el.classList.add('health-20-39');
            }
            else if (v > 45) {
                el.textContent = 'Hurting';
                el.classList.add('health-40-59');
            }
            else if (v > 30) {
                el.textContent = 'Badly injured';
                el.classList.add('health-60-79');
            }
            else if (v > 15) {
                el.textContent = 'Terribly injured';
                el.classList.add('health-80-99');
            }
            else {
                el.textContent = 'Near death';
                el.classList.add('health-100');
            }
        }
    }

    public updateLimb(limb) {
        limb = limb.replace(/\s/g, '');
        limb = limb.toLowerCase();
        if (limb === 'overall') {
            this._doUpdate(UpdateType.overall);
            return;
        }
        if (limb === 'righthoof')
            limb = 'rightfoot';
        else if (limb === 'lefthoof')
            limb = 'leftfoot';
        const eLimb = document.getElementById(limb);
        if (!eLimb)
            return;
        eLimb.setAttribute('class', '');
        eLimb.style.display = 'block';
        //eLimb.style.visibility = 'visible';
        if (this._ac) {
            if (this._infoAC[limb] === 6.5)
                eLimb.classList.add('armor-extensively');
            else if (this._infoAC[limb] === 6)
                eLimb.classList.add('armor-completely');
            else if (this._infoAC[limb] === 5.5)
                eLimb.classList.add('armor-significantly');
            else if (this._infoAC[limb] === 5)
                eLimb.classList.add('armor-considerably');
            else if (this._infoAC[limb] === 4.5)
                eLimb.classList.add('armor-well');
            else if (this._infoAC[limb] === 4)
                eLimb.classList.add('armor-adequately');
            else if (this._infoAC[limb] === 3.5)
                eLimb.classList.add('armor-fairly');
            else if (this._infoAC[limb] === 3)
                eLimb.classList.add('armor-moderately');
            else if (this._infoAC[limb] === 2.5)
                eLimb.classList.add('armor-somewhat');
            else if (this._infoAC[limb] === 2)
                eLimb.classList.add('armor-slightly');
            else if (this._infoAC[limb] === 1)
                eLimb.classList.add('armor-barely');
            else
                eLimb.classList.add('armor-unarmored');
        }
        else {
            if (this._infoLimb[limb] === 100)
                eLimb.classList.add('health-100');
            else if (this._infoLimb[limb] >= 80)
                eLimb.classList.add('health-80-99');
            else if (this._infoLimb[limb] >= 60)
                eLimb.classList.add('health-60-79');
            else if (this._infoLimb[limb] >= 40)
                eLimb.classList.add('health-40-59');
            else if (this._infoLimb[limb] >= 20)
                eLimb.classList.add('health-20-39');
            else if (this._infoLimb[limb] >= 1)
                eLimb.classList.add('health-1-19');
            else
                eLimb.classList.add('health-full');
        }
    }
    public updateBar(id: string, value: number, max?: number, text?: string, noText?: boolean) {
        const bar = document.getElementById(id);
        if (!bar)
            return;
        else {
            let p = 100;
            if (max !== 0)
                p = value / max * 100;
            if (!noText)
                bar.firstElementChild.textContent = text || (value + '/' + max);
            (<HTMLElement>bar.lastElementChild).style.width = (100 - p) + '%';
            (<HTMLElement>bar.lastElementChild).ariaValueNow = '' + p;
        }
    }

    public updateSimpleBar(bar) {
        var p;
        const el = document.getElementById(bar);
        if (!el) return;
        const v = el.dataset.var.toLowerCase();
        if (!this._info || !this._info[v + 'max'])
            p = 100;
        else
            p = this._info[v] / this._info[v + 'max'] * 100;
        const progress = (document.querySelector(`#${bar}  .progress-bar`) as HTMLElement);
        progress.style.width = (100 - p) + '%';
        progress.ariaValueNow = '' + p;
    }

    public createIconBar(parent, id, label, value, max, icon?, order?) {
        let p = 100;
        if (max !== 0)
            p = value / max * 100;
        p = Math.floor(p);
        id = id.replace(' ', '');
        let bar: any = document.getElementById(id);
        if (!bar) {
            if (!icon)
                icon = label.replace(/\d+$/, '').trim().replace(' ', '-');
            bar = '<div title="' + label + '" class="combat-bar" id="' + id + '" data-value="' + ((100 - p) / 20 * 20) + '" data-order="' + order + '">';
            bar += '<div class="combat-icon ' + icon + '"></div>';
            bar += '<div class="combat-name"> ' + label + '</div>';
            bar += '<div class="progressbar"><div class="progressbar-text">' + p + '%</div>';
            bar += '<div class="progressbar-value" style="width: ' + (100 - p) + '%"></div>';
            bar += '</div></div>';
            $(parent).append(bar);
            this._doUpdate(parent === '#party' ? UpdateType.sortParty : UpdateType.sortCombat);
        }
        else {
            if (order !== +bar.getAttribute('data-order')) {
                bar.setAttribute('data-order', order);
                this._doUpdate(parent === '#party' ? UpdateType.sortParty : UpdateType.sortCombat);
            }
            bar.setAttribute('data-value', (100 - p) / 20 * 20);
            bar.children[1].textContent = label;
            p = value / max * 100;
            bar.lastElementChild.firstElementChild.textContent = Math.ceil(p) + '%';
            (<HTMLElement>bar.lastElementChild.lastElementChild).style.width = (100 - p) + '%';
        }
    }

    public removeBar(id, party?) {
        const el = document.getElementById(id);
        if (!el) return;
        el.parentNode.removeChild(el);
        this._doUpdate(party ? UpdateType.sortParty : UpdateType.sortCombat);
    }

    public sortBars(p) {
        const listItems = p.children('div').get();
        listItems.sort((a, b) => {
            const compA = +a.getAttribute('data-order');
            const compB = +b.getAttribute('data-order');
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        $.each(listItems, (idx, itm) => { p.append(itm); });
    }

    public updateLagMeter(lag: number, force?: boolean) {
        if (!this._lagMeter) return;
        if (this.client.getOption('showLagInTitle'))
            this.setTitle(this._info['name'] || '', `${lag / 1000}s`);
        if (!this.client.getOption('lagMeter') && !force) return;
        let p = 100;
        p = lag / 200 * 100;
        if (p > 100) p = 100;
        (<HTMLElement>this._lagMeter.lastElementChild).style.width = (100 - p) + '%';
        this._lagMeter.firstElementChild.textContent = (lag / 1000) + 's';

        const lm = document.querySelector('#status-simple-lagMeter .progress-bar') as HTMLElement;
        lm.style.width = (100 - p) + '%';
        lm.ariaValueNow = '' + p;
    }

    private _doUpdate(type?: UpdateType) {
        if (!type) return;
        this._updating |= type;
        if (this._updating === UpdateType.none || this._rTimeout)
            return;
        this._rTimeout = window.requestAnimationFrame(() => {
            if ((this._updating & UpdateType.status) === UpdateType.status) {
                this.updateStatus();
                this._updating &= ~UpdateType.status;
            }
            if ((this._updating & UpdateType.sortCombat) === UpdateType.sortCombat) {
                this.sortBars($('#combat'));
                this._updating &= ~UpdateType.sortCombat;
            }
            if ((this._updating & UpdateType.sortParty) === UpdateType.sortParty) {
                this.sortBars($('#party'));
                this._updating &= ~UpdateType.sortParty;
            }
            if ((this._updating & UpdateType.overall) === UpdateType.overall) {
                this.updateOverall();
                this._updating &= ~UpdateType.overall;
            }
            if ((this._updating & UpdateType.xp) === UpdateType.xp) {
                this.updateXP();
                this._updating &= ~UpdateType.xp;
            }
            this._rTimeout = 0;
            this._doUpdate(this._updating);
        });
    }

    public updateXP() {
        $('#xp-value').text(this._info['EXPERIENCE']);
        $('#xp-banked').text(this._info['EXPERIENCE_BANKED']);
        if (this._info['EXPERIENCE_NEED'] < 0) {
            $('#need-value').text(this.client.getOption('allowNegativeNumberNeeded') ? this._info['EXPERIENCE_NEED'] : 0);
            this.updateBar('need-percent', 100 - this._info['EXPERIENCE_NEED_P'], 100, this.client.getOption('allowNegativeNumberNeeded') ? this._info['EXPERIENCE_NEED'].toString() : '0');
            this.updateBar('status-simple-xp', 100 - this._info['EXPERIENCE_NEED_P'], 100, '', true);
        }
        else {
            $('#need-value').text(this._info['EXPERIENCE_NEED']);
            this.updateBar('need-percent', 100 - this._info['EXPERIENCE_NEED_P'], 100, this._info['EXPERIENCE_NEED'].toString());
            this.updateBar('status-simple-xp', 100 - this._info['EXPERIENCE_NEED_P'], 100, '', true);
        }
        $('#earn-value').text(this._info['EXPERIENCE_EARNED']);
    }

    public resize() {
        if (!this.client.getOption('showStatus')) return;
        const w = this._status.style.width;
        this._status.style.width = '';
        const bounds = this._status.getBoundingClientRect();
        const minWidth = (bounds.width + parseInt(this._styles.right, 10));
        const maxWidth = this.maxWidth;
        this._status.style.width = w;
        const bounds2 = this._status.getBoundingClientRect();
        if (bounds2.width < minWidth) {
            this.splitterDistance = minWidth;
        }
        else if (bounds2.width > maxWidth) {
            this.splitterDistance = maxWidth;
        }
    }

    get skills() {
        return this._info['skills'];
    }

    public getSkill(skill: string) {
        if (!skill) return 0;
        return this._info['skills'][skill] || 0;
    }

    get name() {
        return this._info['name'];
    }

    get ac(): boolean {
        return this._ac;
    }

    set ac(enable: boolean) {
        if (this._ac !== enable) {
            this._ac = enable;
            this._doUpdate(UpdateType.status);
            this.emit('display-changed');
        }
    }

    private _sanitizeID(id: string): string {
        id = id.replace(/\s/gi, '-');
        return id.replace(/[^a-zA-Z0-9_-]/gi, '');
    }

    private _getID(obj, prefix?: string): string {
        if (!obj) return;
        if (!obj.id) return this._sanitizeID(obj.name || '');
        return (prefix || 'obj_') + obj.id;
    }

    private _livingClass(obj, prefix?: string): string {
        const cls = [];
        if (!prefix) prefix = '';
        if (obj.class && obj.class.length > 0)
            cls.push(prefix + this._sanitizeID(obj.class));
        if (obj.gender && obj.gender.length > 0)
            cls.push(prefix + this._sanitizeID(obj.gender));
        if (obj.race && obj.race.length > 0)
            cls.push(prefix + this._sanitizeID(obj.race));
        if (obj.guild && obj.guild.length > 0)
            cls.push(prefix + this._sanitizeID(obj.guild));
        if (obj.name && obj.name.length > 0)
            cls.push(prefix + this._sanitizeID(obj.name.replace(/\d+$/, '').trim()));
        return cls.join(' ').toLowerCase();
    }

    public setWeapon(limb, weapon) {
        const l = limb;
        limb = limb.replace(/\s/g, '');
        limb = limb.toLowerCase();
        const eLimb = document.getElementById(limb + 'weapon');
        if (!eLimb)
            return;
        eLimb.className = '';
        if (!weapon) return;
        if (weapon.quality && weapon.quality.length > 0)
            eLimb.classList.add('weapon-' + this._sanitizeID(weapon.quality));
        if (weapon.material && weapon.material.length > 0)
            eLimb.classList.add('weapon-' + this._sanitizeID(weapon.material));
        if (weapon.type && weapon.type.length > 0)
            eLimb.classList.add('weapon-' + this._sanitizeID(weapon.type));
        if (weapon.subtype && weapon.subtype.length > 0)
            eLimb.classList.add('weapon-' + this._sanitizeID(weapon.subtype));
        if (weapon.name && weapon.name.length > 0)
            eLimb.classList.add('weapon-' + this._sanitizeID(weapon.name));
        if (weapon.dominant)
            eLimb.classList.add('weapon-dominant');
        if (weapon.subtype && weapon.subtype.length > 0)
            eLimb.title = weapon.subtype + ' in ' + l;
        else if (weapon.type && weapon.type.length > 0)
            eLimb.title = weapon.type + ' in ' + l;
        else
            eLimb.title = 'weapon in ' + l;
    }

    public setLimbAC(limb, ac) {
        limb = limb.replace(/\s/g, '');
        limb = limb.toLowerCase();
        if (limb === 'righthoof')
            limb = 'rightfoot';
        else if (limb === 'lefthoof')
            limb = 'leftfoot';
        this._infoAC[limb] = ac;
    }

    public setLimbHealth(limb, health) {
        limb = limb.replace(/\s/g, '');
        limb = limb.toLowerCase();
        if (limb === 'righthoof')
            limb = 'rightfoot';
        else if (limb === 'lefthoof')
            limb = 'leftfoot';
        this._infoLimb[limb] = health;
    }
}