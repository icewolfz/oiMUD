import '../css/status.css';
import '../css/status.theme.css';
import { Client } from '../core/client';
import { Plugin } from '../core/plugin';
import { MenuItem } from '../core/types';
import { Dialog } from '../interface/dialog';
import { removeHash } from '../interface/interface';
import { capitalize, isMobile } from '../core/library';
import { Settings } from '../core/settings';

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
    private _skillsDialog: Dialog;
    private _skillCategories;

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
            this._updateInterface();
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
        if (!Settings.exist('statusMode'))
            client.setOption('statusMode', isMobile() ? 1 : 0)
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
        this.client.on('received-GMCP', this._processGMCP, this);
        this.client.on('window', (window, args, name) => {
            if (window === 'skills') {
                if (args === 'close') {
                    if (this._skillsDialog) this._skillsDialog.close();
                }
                else
                    this._showSkills();
            }
        });
        this.client.on('close-window', window => {
            if (window === 'skills' && this._skillsDialog)
                this._skillsDialog.close();
        });
        this._lagMeter = document.getElementById('lagMeter');
        this.client.telnet.on('latency-changed', (lag, avg) => {
            this._updateLagMeter(lag);
        });
        this.client.on('closed', () => {
            this._updateLagMeter(0, true);
        });
        this.client.telnet.GMCPSupports.push('oMUD 1');
        this.client.telnet.GMCPSupports.push('Char.Skills 1');
        this.client.on('add-line', (data) => {
            switch (data.line) {
                case 'Connected...':
                    this._initializeStatus();
                    return;
                case 'You feel a tingle as you are surrounded by magical shield.':
                case 'You feel a tingle as you are surrounded by a magical shield.':
                case 'You feel a tingle as you are surrounded by magical buffer.':
                case 'You feel a tingle as you are surrounded by a magical buffer.':
                case 'You feel a tingle as you are surrounded by magical protection.':
                case 'You feel a tingle as you are surrounded by a magical protection.':
                case 'Blood flows and covers you forming a protective skin.':
                case 'You feel your skin strengthen.':
                case 'You feel your skin harden.':
                case '^You feel your skin toughen.':
                    document.getElementById('fullbody').classList.add('aura-blue');
                    return;
                case 'Your aura of protection wears off.':
                case 'You feel your skin soften.':
                case 'Blood flows off of you.':
                case 'You remove a spell of protection from yourself.':
                    document.getElementById('fullbody').classList.remove('aura-blue');
                    return;
                case 'You feel more protected as Makkairi\'s Shield envelops you.':
                    document.getElementById('fullbody').classList.add('aura-red');
                    return;
                case 'You feel more vulnerable as Makkairi\'s Shield leaves you.':
                    document.getElementById('fullbody').classList.remove('aura-red');
                    return;
            }
            if (data.line.match(/^.* removes a spell of protection from you.$/))
                document.getElementById('fullbody').classList.remove('aura-blue');
        });
        this.client.on('options-loaded', () => {
            this._info['EXPERIENCE_NEED'] = this._info['EXPERIENCE_NEED_RAW'] - this._info['EXPERIENCE'];

            if (this.client.getOption('showArmor')) {
                this.ac = true;
                this._status.querySelector('#health').classList.remove('active');
                this._status.querySelector('#armor').classList.add('active');
            }
            let w = client.getOption('statusWidth');
            if (w > document.body.clientWidth - this.maxWidth) w = document.body.clientWidth - this.maxWidth;
            //Always want min width even if maxWidth is smaller
            if (w < 184 && w != -1) w = 184;
            this.splitterDistance = w;
            this._updateInterface();
            this._updateMenuItem();
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
            //Use max with unless minWidth is larger
            const maxWidth = Math.min(this.maxWidth, document.body.clientWidth - bounds.width);
            this._move = e => {
                if (e.pageX <= maxWidth)
                    ghostBar.style.left = maxWidth - bounds2.width + 'px';
                else if (e.pageX > bounds.left - bounds2.width)
                    ghostBar.style.left = bounds.left + parseInt(this._styles.right, 10) - bounds2.width + 'px';
                else
                    ghostBar.style.left = e.pageX + 'px';
            }
            document.addEventListener('mousemove', this._move);
        });

        window.addEventListener('resize', () => this._resize());
        document.addEventListener('mouseup', e => {
            if (!this._dragging) return;
            const w = this._status.style.width;
            this._status.style.width = '';
            const bounds = this._status.getBoundingClientRect();
            const minWidth = (bounds.width + parseInt(this._styles.right, 10));
            const l = document.getElementById('status-drag-bar').getBoundingClientRect().width;
            const maxWidth = Math.min(this.maxWidth, document.body.clientWidth - minWidth);
            this._status.style.width = w;
            if (e.pageX <= maxWidth)
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
            this._updateInterface();
        });
        document.getElementById('status-close').addEventListener('click', () => {
            this.client.setOption('showStatus', false);
            this._updateInterface();
            this._updateMenuItem();
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
        let w = client.getOption('statusWidth');
        if (w > document.body.clientWidth - this.maxWidth) w = document.body.clientWidth - this.maxWidth;
        if (w < 184 && w != -1) w = 184;
        this.splitterDistance = w;

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
        this._updateInterface();
        this._initializeStatus();
        let options = client.getWindowState('skills');
        if (options && options.show)
            this._showSkills();
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
                name: this.client.getOption('showStatus') ? ' Hide status' : ' Show status',
                active: this.client.getOption('showStatus'),
                action: e => {
                    this.client.setOption('showStatus', !this.client.getOption('showStatus'));
                    this._updateInterface();
                    this._updateMenuItem();
                },
                icon: '<i class="bi bi-heart-pulse-fill"></i>',
                position: 6
            },
            {
                name: ' Show skills',
                action: () => this._showSkills(),
                icon: '<i class="bi bi-graph-up"></i>',
                position: '#menu-status'
            }]
    }
    get settings(): MenuItem[] {
        return [{
            name: ' Status',
            action: 'settings-status',
            icon: '<i class="bi bi-heart-pulse-fill"></i>',
            position: 7
        }]
    }

    private async _processGMCP(mod: string, obj: any) {
        try {
            let limb;
            switch (mod.toLowerCase()) {
                case 'char.name':
                    this._info['name'] = obj.name;
                    this._setTitle(obj.name);
                    break;
                case 'char.base':
                    this._initializeStatus();
                    this._info['name'] = obj.name;
                    this._setTitle(obj.name);
                    break;
                case 'char.vitals':
                    this._updateBar('hp-bar', obj.hp, obj.hpmax);
                    this._updateBar('sp-bar', obj.sp, obj.spmax);
                    this._updateBar('mp-bar', obj.mp, obj.mpmax);
                    this._info['hp'] = obj.hp;
                    this._info['hpmax'] = obj.hpmax;
                    this._info['sp'] = obj.sp;
                    this._info['spmax'] = obj.spmax;
                    this._info['mp'] = obj.mp;
                    this._info['mpmax'] = obj.mpmax;
                    this._updateSimpleBar('status-simple-hp');
                    this._updateSimpleBar('status-simple-sp');
                    this._updateSimpleBar('status-simple-mp');
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
                        this._setLimbAC(limb, obj[limb]);
                        this._updateLimb(limb);
                    }
                    break;
                case 'omud.limb':
                    for (limb in obj) {
                        if (!obj.hasOwnProperty(limb)) continue;
                        this._setLimbHealth(limb, obj[limb]);
                        this._updateLimb(limb);
                    }
                    break;
                case 'omud.weapons':
                    for (limb in obj) {
                        if (!obj.hasOwnProperty(limb)) continue;
                        this._setWeapon(limb, obj[limb]);
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
                            return (className.match(/(^|\s)moon\d(-\S+)?/g) || []).join(' ');
                        });
                        if (obj.moons) {
                            env.classList.add('moon1', 'moon1-' + obj.moons[0]);
                            env.classList.add('moon2', 'moon2-' + obj.moons[1]);
                            env.classList.add('moon3', 'moon3-' + obj.moons[2]);
                        }
                    }
                    break;
                case 'omud.combat':
                    if (obj.action === 'leave') {
                        this._clear('combat');
                        this.emit('leave combat');
                    }
                    else if (obj.action === 'add')
                        this._createIconBar('#combat', this._getID(obj, 'combat_'), obj.name, obj.hp, 100, this._livingClass(obj, 'monster-'), obj.order);
                    else if (obj.action === 'update') {
                        if (obj.hp === 0)
                            this._removeBar(this._getID(obj, 'combat_'));
                        else
                            this._createIconBar('#combat', this._getID(obj, 'combat_'), obj.name, obj.hp, 100, this._livingClass(obj, 'monster-'), obj.order);
                    }
                    else if (obj.action === 'remove')
                        this._removeBar(this._getID(obj, 'combat_'));
                    break;
                case 'omud.party':
                    if (obj.action === 'leave') {
                        this._clear('party');
                        this.emit('leave party');
                    }
                    else if (obj.action === 'add') {
                        this._createIconBar('#party', this._getID(obj, 'party_'), obj.name, obj.hp, 100, this._livingClass(obj, 'party-'), obj.name.replace('"', ''));
                    }
                    else if (obj.action === 'update') {
                        if (obj.hp === 0)
                            this._removeBar(this._getID(obj, 'party_'), true);
                        else
                            this._createIconBar('#party', this._getID(obj, 'party_'), obj.name, obj.hp, 100, this._livingClass(obj, 'party-'), obj.name.replace('"', ''));
                    }
                    else if (obj.action === 'remove')
                        this._removeBar(this._getID(obj, 'party_'), true);

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
                        this._updateSkill(obj.skill, this._info['skills'][obj.skill])
                        this.emit('skill updated', obj.skill, this._info['skills'][obj.skill]);
                    }
                    break;
            }
        }
        catch (e) {
            this.emit('error', e);
        }
    }

    private _updateInterface(noSplitter?) {
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
                this._updateLagMeter(0, true);
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

    private _setTitle(title: string, lag?: string) {
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

    private _initializeStatus() {
        document.getElementById('fullbody').classList.remove('aura-red', 'aura-blue');
        this._setTitle('');
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
        this._updateBar('hp-bar', 0, 0);
        this._updateBar('sp-bar', 0, 0);
        this._updateBar('mp-bar', 0, 0);
        this._updateSimpleBar('status-simple-hp');
        this._updateSimpleBar('status-simple-sp');
        this._updateSimpleBar('status-simple-mp');
        document.getElementById('xp-value').textContent = '0';
        document.getElementById('xp-banked').textContent = '0';
        document.getElementById('need-value').textContent = '0';
        document.getElementById('earn-value').textContent = '0';
        this._updateBar('need-percent', 0, 0, '0');
        this._updateBar('status-simple-xp', 0, 0, '', true);
        this._clear('combat');
        this._clear('party');
        document.getElementById('party').classList.remove('hasmembers');
        this._updateOverall();
        this._updateStatus();
        this._resetSkills();
        this.emit('skill init');
    }

    private _clear(id) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    }

    private _updateStatus() {
        let limb;
        if (this._ac)
            for (limb in this._infoAC)
                this._updateLimb(limb);
        else
            for (limb in this._infoLimb)
                this._updateLimb(limb);
        this._doUpdate(UpdateType.overall | UpdateType.xp);
    }

    private _updateOverall() {
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

    private _updateLimb(limb) {
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
    private _updateBar(id: string, value: number, max?: number, text?: string, noText?: boolean) {
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

    private _updateSimpleBar(bar) {
        let p;
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

    private _createIconBar(parent, id, label, value, max, icon?, order?) {
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

    private _removeBar(id, party?) {
        const el = document.getElementById(id);
        if (!el) return;
        el.parentNode.removeChild(el);
        this._doUpdate(party ? UpdateType.sortParty : UpdateType.sortCombat);
    }

    private _sortBars(p) {
        const listItems = p.children('div').get();
        listItems.sort((a, b) => {
            const compA = +a.getAttribute('data-order');
            const compB = +b.getAttribute('data-order');
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        $.each(listItems, (idx, itm) => { p.append(itm); });
    }

    private _updateLagMeter(lag: number, force?: boolean) {
        if (!this._lagMeter) return;
        if (this.client.getOption('showLagInTitle'))
            this._setTitle(this._info['name'] || '', `${lag / 1000}s`);
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
                this._updateStatus();
                this._updating &= ~UpdateType.status;
            }
            if ((this._updating & UpdateType.sortCombat) === UpdateType.sortCombat) {
                this._sortBars($('#combat'));
                this._updating &= ~UpdateType.sortCombat;
            }
            if ((this._updating & UpdateType.sortParty) === UpdateType.sortParty) {
                this._sortBars($('#party'));
                this._updating &= ~UpdateType.sortParty;
            }
            if ((this._updating & UpdateType.overall) === UpdateType.overall) {
                this._updateOverall();
                this._updating &= ~UpdateType.overall;
            }
            if ((this._updating & UpdateType.xp) === UpdateType.xp) {
                this._updateXP();
                this._updating &= ~UpdateType.xp;
            }
            this._rTimeout = 0;
            this._doUpdate(this._updating);
        });
    }

    private _updateXP() {
        $('#xp-value').text(this._info['EXPERIENCE']);
        $('#xp-banked').text(this._info['EXPERIENCE_BANKED']);
        if (this._info['EXPERIENCE_NEED'] < 0) {
            $('#need-value').text(this.client.getOption('allowNegativeNumberNeeded') ? this._info['EXPERIENCE_NEED'] : 0);
            this._updateBar('need-percent', 100 - this._info['EXPERIENCE_NEED_P'], 100, this.client.getOption('allowNegativeNumberNeeded') ? this._info['EXPERIENCE_NEED'].toString() : '0');
            this._updateBar('status-simple-xp', 100 - this._info['EXPERIENCE_NEED_P'], 100, '', true);
        }
        else {
            $('#need-value').text(this._info['EXPERIENCE_NEED']);
            this._updateBar('need-percent', 100 - this._info['EXPERIENCE_NEED_P'], 100, this._info['EXPERIENCE_NEED'].toString());
            this._updateBar('status-simple-xp', 100 - this._info['EXPERIENCE_NEED_P'], 100, '', true);
        }
        $('#earn-value').text(this._info['EXPERIENCE_EARNED']);
    }

    private _resize() {
        if (!this.client.getOption('showStatus')) return;
        const w = this._status.style.width;
        this._status.style.width = '';
        const bounds = this._status.getBoundingClientRect();
        const minWidth = (bounds.width + parseInt(this._styles.right, 10));
        const maxWidth = Math.min(document.body.clientWidth - this.maxWidth, document.body.clientWidth - minWidth);
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

    private _setWeapon(limb, weapon) {
        const l = limb;
        limb = limb.replace(/\s/g, '');
        limb = limb.toLowerCase();
        const eLimb = document.getElementById(limb + 'weapon');
        if (!eLimb)
            return;
        eLimb.className = '';
        if (!weapon) return;
        eLimb.classList.add('weapons');
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

    private _setLimbAC(limb, ac) {
        limb = limb.replace(/\s/g, '');
        limb = limb.toLowerCase();
        if (limb === 'righthoof')
            limb = 'rightfoot';
        else if (limb === 'lefthoof')
            limb = 'leftfoot';
        this._infoAC[limb] = ac;
    }

    private _setLimbHealth(limb, health) {
        limb = limb.replace(/\s/g, '');
        limb = limb.toLowerCase();
        if (limb === 'righthoof')
            limb = 'rightfoot';
        else if (limb === 'lefthoof')
            limb = 'leftfoot';
        this._infoLimb[limb] = health;
    }

    private _showSkills() {
        if (!this._skillsDialog) {
            this._skillsDialog = new Dialog(Object.assign({}, client.getWindowState('skills') || { center: true }, { title: '<i class="bi bi-graph-up"></i><select id="filter-skills" class="form-select form-select-sm me-2 mb-1" title="Filter skills"><option value="All">All</option></select>', id: 'win-skills', noFooter: true, minHeight: 350 }));
            this._skillsDialog.body.classList.add('skills');
            this._skillsDialog.on('resized', e => {
                this.client.setOption('windows.skills', e);
            });
            this._skillsDialog.on('moved', e => {
                this.client.setOption('windows.skills', e);
            })
            this._skillsDialog.on('maximized', () => {
                this.client.setOption('windows.skills', this._skillsDialog.windowState);
            });
            this._skillsDialog.on('restored', () => {
                this.client.setOption('windows.skills', this._skillsDialog.windowState);
            });
            this._skillsDialog.on('shown', () => {
                this.client.setOption('windows.skills', this._skillsDialog.windowState);
            });
            this._skillsDialog.on('closed', () => {
                this.client.setOption('windows.skills', this._skillsDialog.windowState);
                removeHash('skills');
                if (this._skillsDialog && !this._skillsDialog.persistent) {
                    delete this._skillsDialog;
                    this._skillsDialog = null;
                }
            });
            this._skillsDialog.on('canceled', () => {
                this.client.setOption('windows.skills', this._skillsDialog.windowState);
                removeHash('skills');
                if (this._skillsDialog && !this._skillsDialog.persistent) {
                    delete this._skillsDialog;
                    this._skillsDialog = null;
                }
            });
            const filter = this._skillsDialog.header.querySelector('#filter-skills') as HTMLSelectElement;
            filter.addEventListener('change', e => {
                const cats = this._skillsDialog.body.querySelectorAll('.category');
                const selected = this._skillsDialog.header.querySelector('#filter-skills option:checked').textContent;
                if (selected === 'All')
                    cats.forEach(cat => cat.style.display = '');
                else {
                    cats.forEach(cat => cat.style.display = 'none');
                    this._skillsDialog.body.querySelector(`#${selected.toLowerCase()}`).style.display = '';
                }
            });
        }
        this._loadSkills();
        this._skillsDialog.show();
    }

    private _loadSkills() {
        const _skills = this._info['skills'];
        let cats = {};
        let cnt = 0;
        let keys = Object.keys(_skills).sort();
        for (let key in keys) {
            let skill = keys[key];
            if (!Object.prototype.hasOwnProperty.call(_skills, skill))
                continue;
            if (!cats[_skills[skill].category || 'default'])
                cats[_skills[skill].category || 'default'] = this._createLabel(skill);
            else
                cats[_skills[skill].category || 'default'] += this._createLabel(skill);
            cnt++;;
        }
        var body = '';
        if (cnt > 0) {
            this._skillCategories = Object.keys(cats).sort();
            let opts = '';
            for (let key in this._skillCategories) {
                let cat = this._skillCategories[key];
                opts += `<option value="${capitalize(cat)}">${capitalize(cat)}</option>`;
                if (cats[cat].length === 0 || !Object.prototype.hasOwnProperty.call(cats, cat))
                    continue;
                body += '<div class="category" id="' + cat.toLowerCase() + '">';
                if (cnt > 1 || cat != 'default')
                    body += '<div class="category-title">' + capitalize(cat) + '</div>';
                body += '<div class="category-body" id="' + cat + 'Body">' + cats[cat] + '</div></div>';
            }
            this._skillsDialog.header.querySelector('#filter-skills').insertAdjacentHTML('beforeend', opts);
        }
        else {
            this._skillCategories = [];
            body = body += '<div class="category" id="default">No skills</div>';
        }
        this._skillsDialog.body.innerHTML = body;
    };

    private _updateSkill(skill, data) {
        if (!this._skillsDialog) return;
        let _el = this._skillsDialog.body.querySelector(`#${this._sanitizeID(skill)}.label`);
        if (!_el) {
            _el = this._skillsDialog.body.querySelector(`#${(data.category || 'default')}Body`)
            var found = 0;
            var nodes;
            if (!_el) {
                var cat = capitalize(data.category || 'default');
                this._skillCategories.push(cat.toLowerCase());
                let body = '<div class="category" id="' + cat.toLowerCase() + '">';
                body += '<div class="category-title">' + cat + '</div>';
                body += '<div class="category-body" id="' + (data.category || 'default') + 'Body">' + this._createLabel(skill) + '</div></div>';
                nodes = this._skillsDialog.body.querySelectorAll('.category');
                for (var n = 0, nl = nodes.length; n < nl; n++) {
                    if (nodes[n].children[0].textContent < cat)
                        continue;
                    nodes[n].insertAdjacentHTML('beforebegin', body);
                    found = 1;
                    break;
                }
                if (!found)
                    this._skillsDialog.body.insertAdjacentHTML('beforeend', body);
                this._updateFilter();
            }
            else {
                nodes = this._skillsDialog.body.querySelector(`#${(data.category || 'default')}Body`).children;
                found = 0;
                for (var n = 0, nl = nodes.length; n < nl; n++) {
                    if (nodes[n].getAttribute('title') < skill)
                        continue;
                    nodes[n].insertAdjacentHTML('beforebegin', this._createLabel(skill));
                    found = 1;
                    break;
                }
                if (!found)
                    _el.insertAdjacentHTML('beforeend', this._createLabel(skill));
            }
        }
        else {
            this._skillsDialog.body.querySelector(`#${this._sanitizeID(skill)}Amount`).innerHTML = data.amount;
            if (data.bonus > 0)
                this._skillsDialog.body.querySelector(`#${this._sanitizeID(skill)}Bonus`).innerHTML = '+' + data.bonus;
            else if (data.bonus < 0)
                this._skillsDialog.body.querySelector(`#${this._sanitizeID(skill)}Bonus`).innerHTML = '<span class="neg">-' + data.bonus + '</span>';
            else
                this._skillsDialog.body.querySelector(`#${this._sanitizeID(skill)}Bonus`).innerHTML = data.bonus;
            if (data.percent === 100)
                this._skillsDialog.body.querySelector(`#${this._sanitizeID(skill)}Percent`).innerHTML = '<span class="maxed">MAX!</span>';
            else
                this._skillsDialog.body.querySelector(`#${this._sanitizeID(skill)}Percent`).innerHTML = data.percent + '%';
        }
    };

    private _updateFilter() {
        const filter = this._skillsDialog.header.querySelector('#filter-skills');
        let val = filter.value;
        filter.innerHTML = '<option value="All">All</option>';
        this._skillCategories.sort();
        let opts = '';
        for (let key in this._skillCategories)
            opts += `<option value="${capitalize(this._skillCategories[key])}">${capitalize(this._skillCategories[key])}</option>`;
        filter.insertAdjacentHTML('beforeend', opts);
        filter.value = val;
    }

    private _resetSkills() {
        if (!this._skillsDialog) return;
        this._skillsDialog.body.innerHTML = '';
        const filter = this._skillsDialog.header.querySelector('#filter-skills');
        filter.innerHTML = '<option value="All" selected>All</option>';
        this._skillCategories = [];
    }

    private _createLabel(skill) {
        const data = this._info['skills'][skill];
        const id = this._sanitizeID(skill);
        let label = '<div title="' + skill + '" class="label" id="' + id + '">';
        label += '<div class="skill" id="' + id + 'Label">' + id + '</div>';
        label += '<div class="amount" id="' + id + 'Amount">' + data.amount + '</div>';
        if (data.bonus > 0)
            label += '<div class="bonus" id="' + id + 'Bonus">+' + data.bonus + '</div>';
        else if (data.bonus < 0)
            label += '<div class="bonus" id="' + id + 'Bonus"><span class="neg">-' + data.bonus + '</span></div>';
        else
            label += '<div class="bonus" id="' + id + 'Bonus">' + data.bonus + '</div>';
        if (data.percent === 100)
            label += '<div class="percent" id="' + id + 'Percent"><span class="maxed">MAX!</span></div>';
        else
            label += '<div class="percent" id="' + id + 'Percent">' + data.percent + '%</div>';
        label += '</div>';
        return label;
    }

    private _updateMenuItem() {
        let button = document.querySelector('#menu-status') as HTMLElement;
        if (client.getOption('showStatus')) {
            button.title = 'Hide status';
            button.classList.add('active');
            document.querySelector('#menu-status a span').textContent = ' Hide status';
        }
        else {
            button.title = 'Show status';
            button.classList.remove('active');
            document.querySelector('#menu-status a span').textContent = ' Show status';
        }
    }
}