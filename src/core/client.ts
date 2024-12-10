import '../css/client.css';
import { EventEmitter } from './events';
import { Telnet } from './telnet';
import { AnsiColorCode } from './ansi';
import { SortItemArrayByPriority, selectAll, getParameterByName } from './library';
import { Settings } from './settings';
import { Input } from './input';
import { ProfileCollection, Alias, Trigger, Alarm, Macro, Profile, Button, Context, TriggerType, SubTriggerTypes } from './profile';
import { Display } from './display';
import { Plugin } from './plugin';
import { version } from '../../package.json'

//import core plugins
import { MSP } from '../plugins/msp';
import { Test } from '../plugins/test';
import { Mapper } from '../plugins/mapper';
import { Status } from '../plugins/status';
import { Logger } from '../plugins/logger';
import { Chat } from '../plugins/chat';
import { ShadowMUD } from '../plugins/ShadowMUD/shadowmud';
export { ShadowMUD };
import { PanelBar } from '../plugins/panelbar';

declare global {
    interface Window {
        Client;
        client: Client;
        oiMUD: Client;
        Display;
        Test;
        Dialog;
    }
}
declare let moment;
declare let localforage;

interface ClientOptions {
    display: HTMLInputElement | JQuery | string;
    commandInput: HTMLTextAreaElement | JQuery | string;
    host?: string;
    port?: number;
    scheme?: string;
    protocol?: string;
}

interface ItemCache {
    alarmPatterns: any[];
    alarms: Trigger[];
    triggers: Trigger[];
    aliases: Alias[];
    macros: Macro[];
    buttons: Button[];
    contexts: Context[];
    defaultContext: boolean;
}

/**
 * Mud client
 *
 * @export
 * @class Client
 * @extends {EventEmitter}
 */
export class Client extends EventEmitter {
    //#region Private properties
    private _enableDebug: boolean = false;
    private _input: Input;
    private _telnet: Telnet;
    private _itemCache: ItemCache = {
        triggers: null,
        aliases: null,
        macros: null,
        buttons: null,
        contexts: null,
        defaultContext: null,
        alarms: null,
        alarmPatterns: []
    }
    private _alarm;
    private _commandInput: HTMLTextAreaElement;
    private _display: Display;
    private _profiles: ProfileCollection;
    private _variables = {};
    private _plugins: Plugin[];
    private _options: any = {};
    private _autoConnectID;
    //#endregion
    //#region Public properties
    public active: boolean = true;
    public connecting: boolean = false;
    public version: string = version;
    public connectTime: number = 0;
    public disconnectTime: number = 0;
    public lastSendTime: number = 0;
    public defaultTitle = 'oiMUD';
    //#endregion
    //#region Public setter/getters
    public get telnet(): Telnet { return this._telnet; }
    public get variables() { return this._variables; }
    public get commandInput(): HTMLTextAreaElement { return this._commandInput; }
    public get display(): Display { return this._display; }
    public get profiles(): ProfileCollection { return this._profiles; }
    public get plugins(): Plugin[] { return this._plugins; }
    public get options(): Settings { return this._options; }
    public get input(): Input { return this._input; }


    set simpleAlarms(value) {
        this.setOption('simpleAlarms', value);
    }

    get simpleAlarms() { return this.getOption('simpleAlarms'); }

    set enableParsing(value) {
        this.setOption('enableParsing', value);
        this._input.enableParsing = value;
    }

    get enableParsing() { return this.getOption('enableParsing'); }

    set enableTriggers(value) {
        this.setOption('enableTriggers', value);
        this._input.enableTriggers = value;
        this.startAlarms();
    }

    get enableTriggers() { return this.getOption('enableTriggers'); }

    get enableDebug(): boolean {
        return this._enableDebug;
    }

    set enableDebug(enable: boolean) {
        this._enableDebug = enable;
        this._telnet.enableDebug = enable;
        this._display.enableDebug = enable;
    }

    get host(): string {
        return this._telnet.host;
    }
    set host(host: string) {
        this._telnet.host = host;
    }

    get port(): number {
        return this._telnet.port;
    }
    set port(port: number) {
        this._telnet.port = port;
    }

    get connected(): boolean {
        return this._telnet.connected;
    }

    public get activeProfile() {
        return this._profiles.active;
    };

    public get commandHistory() {
        return this._input.commandHistory;
    }

    public get indices() {
        return this._input.indices;
    }

    public get repeatnum() {
        return this._input.repeatnum;
    }

    get aliases(): Alias[] {
        if (this._itemCache.aliases)
            return this._itemCache.aliases;
        const keys = this.profiles.keys;
        const tmp = [];
        let k = 0;
        const kl = keys.length;
        if (kl === 0) return [];
        if (kl === 1) {
            if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableAliases)
                this._itemCache.aliases = [];
            else
                this._itemCache.aliases = SortItemArrayByPriority(this.profiles.items[keys[k]].aliases);
            return this._itemCache.aliases;
        }
        for (; k < kl; k++) {
            if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableAliases || this.profiles.items[keys[k]].aliases.length === 0)
                continue;
            tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].aliases));
        }
        this._itemCache.aliases = tmp;
        return this._itemCache.aliases;
    }

    get macros(): Macro[] {
        if (this._itemCache.macros)
            return this._itemCache.macros;
        const keys = this.profiles.keys;
        const tmp = [];
        let k = 0;
        const kl = keys.length;
        if (kl === 0) return [];
        if (kl === 1) {
            if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableMacros)
                this._itemCache.macros = [];
            else
                this._itemCache.macros = SortItemArrayByPriority(this.profiles.items[keys[k]].macros);
            return this._itemCache.macros;
        }
        for (; k < kl; k++) {
            if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableMacros || this.profiles.items[keys[k]].macros.length === 0)
                continue;
            tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].macros));
        }
        this._itemCache.macros = tmp;
        return this._itemCache.macros;
    }

    get triggers(): Trigger[] {
        if (this._itemCache.triggers)
            return this._itemCache.triggers;
        const keys = this.profiles.keys;
        const tmp = [];
        let k = 0;
        const kl = keys.length;
        if (kl === 0) return [];
        if (kl === 1) {
            if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableTriggers)
                this._itemCache.triggers = [];
            else
                this._itemCache.triggers = SortItemArrayByPriority(this.profiles.items[keys[0]].triggers);
            return this._itemCache.triggers;
        }
        for (; k < kl; k++) {
            if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableTriggers || this.profiles.items[keys[k]].triggers.length === 0)
                continue;
            tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].triggers));
        }
        this._itemCache.triggers = tmp;
        return this._itemCache.triggers;
    }

    public removeTrigger(trigger: Trigger) {
        const keys = this.profiles.keys;
        let k = 0;
        const kl = keys.length;
        let idx = -1;
        if (kl === 0)
            return;
        if (kl === 1) {
            if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableTriggers)
                return;
            idx = this.profiles.items[keys[k]].triggers.indexOf(trigger);
        }
        else
            for (; k < kl && idx !== -1; k++) {
                if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableTriggers || this.profiles.items[keys[k]].triggers.length === 0)
                    continue;
                idx = this.profiles.items[keys[k]].triggers.indexOf(trigger);
                //found trigger bail, or it will keep looking and k index will be wrong profile
                if (idx !== -1)
                    break;
            }
        //check to be sure trigger found
        if (idx === -1)
            return;
        this.profiles.items[keys[k]].triggers.splice(idx, 1);
        this._itemCache.triggers = null;
        //an alarm or has sub types see if cached
        if ((trigger.triggers.length || trigger.type === TriggerType.Alarm) && this._itemCache.alarms) {
            idx = this._itemCache.alarms.indexOf(trigger);
            if (idx !== -1) {
                this._itemCache.alarms.splice(idx, 1);
                this._itemCache.alarmPatterns.splice(idx, 1);
            }
        }
        this.saveProfiles();
        this.emit('item-removed', 'trigger', keys[k], idx, trigger);
    }

    get alarms(): Trigger[] {
        if (this._itemCache.alarms)
            return this._itemCache.alarms;
        const keys = this.profiles.keys;
        const tmp = [];
        let k = 0;
        const kl = keys.length;
        if (kl === 0) return [];
        if (kl === 1) {
            if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableTriggers)
                this._itemCache.alarms = [];
            else
                this._itemCache.alarms = SortItemArrayByPriority(this.profiles.items[keys[k]].triggers).filter((a: Trigger) => {
                    //has sub triggers of type alarm so cache them for future use as well
                    if (a && a.enabled && a.triggers.length) {
                        if (a.type === TriggerType.Alarm) return true;
                        //loop sub states if one is alarm cache it for future
                        for (let s = 0, sl = a.triggers.length; s < sl; s++)
                            if (a.triggers[s].enabled && a.triggers[s].type === TriggerType.Alarm)
                                return true;
                        return false;
                    }
                    return a && a.enabled && a.type === TriggerType.Alarm;
                });
            this._itemCache.alarms.reverse();
            return this._itemCache.alarms;
        }
        for (; k < kl; k++) {
            if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableTriggers || this.profiles.items[keys[k]].triggers.length === 0)
                continue;
            tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].triggers));
        }
        this._itemCache.alarms = tmp.filter((a) => {
            //has sub triggers of type alarm so cache them for future use as well
            if (a && a.enabled && a.triggers.length) {
                if (a.type === TriggerType.Alarm) return true;
                //loop sub states if one is alarm cache it for future
                for (let s = 0, sl = a.triggers.length; s < sl; s++)
                    if (a.triggers[s].enabled && a.triggers[s].type === TriggerType.Alarm)
                        return true;
                return false;
            }
            return a && a.enabled && a.type === TriggerType.Alarm;
        });
        this._itemCache.alarms.reverse();
        return this._itemCache.alarms;
    }

    get buttons(): Button[] {
        if (this._itemCache.buttons)
            return this._itemCache.buttons;
        const keys = this.profiles.keys;
        const tmp = [];
        let k = 0;
        const kl = keys.length;
        if (kl === 0) return [];
        if (kl === 1) {
            if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableButtons)
                this._itemCache.buttons = [];
            else
                this._itemCache.buttons = SortItemArrayByPriority(this.profiles.items[keys[k]].buttons);
            return this._itemCache.buttons;
        }
        for (; k < kl; k++) {
            if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableButtons || this.profiles.items[keys[k]].buttons.length === 0)
                continue;
            tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].buttons));
        }
        this._itemCache.buttons = tmp;
        return this._itemCache.buttons;
    }

    get contexts(): Context[] {
        if (this._itemCache.contexts)
            return this._itemCache.contexts;
        const keys = this.profiles.keys;
        const tmp = [];
        let k = 0;
        const kl = keys.length;
        if (kl === 0) return [];
        if (kl === 1) {
            if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableContexts)
                this._itemCache.contexts = [];
            else
                this._itemCache.contexts = SortItemArrayByPriority(this.profiles.items[keys[k]].contexts);
            return this._itemCache.contexts;
        }
        for (; k < kl; k++) {
            if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableContexts || this.profiles.items[keys[k]].contexts.length === 0)
                continue;
            tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].contexts));
        }
        this._itemCache.contexts = tmp;
        return this._itemCache['contexts'];
    }

    get defaultContext(): boolean {
        if (this._itemCache.defaultContext !== null)
            return this._itemCache.defaultContext;
        this._itemCache.defaultContext = this.profiles.defaultContext;
        return this._itemCache.defaultContext;
    }

    //#endregion    

    public addPlugin(plugin: Plugin) {
        if (!plugin) return;
        this.plugins.push(plugin);
        plugin.initialize();
        this.emit('plugin-added', plugin);
    }

    public removePlugin(plugin: Plugin) {
        if (!this.plugins.length) return;
        const idx = this.plugins.indexOf(plugin);
        if (idx !== -1) {
            plugin.remove();
            this.plugins.splice(idx, 1);
            this.emit('plugin-removed', plugin);
        }
    }

    public getVariable(name: string) {
        return this.variables[name];
    }

    public setVariable(name: string, value) {
        this.variables[name] = value;
    }

    public setVariables(variables) {
        const names = Object.keys(variables);
        if (names.length === 0) return;
        const nl = names.length;
        let name;
        for (let n = 0; n < nl; n++) {
            name = names[n];
            this.variables[name] = variables[name];
        }
    }

    public hasVariable(name: string) {
        return this.variables.hasOwnProperty(name);
    }

    public removeVariable(name: string) {
        if (!this.variables.hasOwnProperty(name))
            return;
        delete this.variables[name];
    }

    public setHistoryIndex(index) {
        this._input.setHistoryIndex(index);
    }

    public clearCommandHistory() {
        this._input.clearCommandHistory();
    }

    public AddCommandToHistory(txt) {
        this._input.AddCommandToHistory(txt);
    }

    public loadProfiles() {
        return new Promise((resolve) => {
            ProfileCollection.load().then((profiles: ProfileCollection) => {
                this._profiles = profiles;
                //ensure default exist and is loaded
                if (!this.profiles.contains('default')) {
                    this.profiles.add(Profile.Default);
                    this.saveProfiles();
                }
                this.clearCache();
                this.startAlarms();
                this.emit('profiles-loaded');
                resolve(this._profiles);
            });
        });
    }

    public removeProfile(profile) {
        if (!profile) return;
        this.profiles.remove(profile);
        this.clearCache();
        this.startAlarms();
        this.emit('profile-removed', profile);
    }

    public saveProfiles() {
        this._profiles.save();
        this.clearCache();
        this.emit('profiles-updated');
    }

    public toggleProfile(profile: string) {
        this.profiles.toggle(profile);
        this.saveProfiles();
        this.clearCache();
        this.startAlarms();
        this.emit('profile-toggled', profile, this.profiles[profile].enabled);
    }

    public startAlarms() {
        const al = this.alarms.length;
        if ((al === 0 || !this.getOption('enableTriggers')) && this._alarm) {
            clearInterval(this._alarm);
            this._alarm = null;
        }
        else if (al && !this._alarm)
            this._alarm = setInterval((client) => { client.process_alarms(); }, 1000, this);
    }

    public setAlarmState(idx, state: boolean) {
        if (typeof idx === 'object')
            idx = this.alarms.indexOf(idx);
        if (idx === -1 || idx >= this.alarms.length)
            return;
        let pattern = this._itemCache.alarmPatterns[idx];
        if (!pattern) {
            //use an object to store to prevent having to loop over large array
            pattern = {};
            if (this.alarms[idx].type === TriggerType.Alarm)
                pattern[0] = Alarm.parse(this.alarms[idx]);
            for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
                //enabled and is alarm
                if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === TriggerType.Alarm)
                    pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
            }
            this._itemCache.alarmPatterns[idx] = pattern;
        }
        for (const p in pattern) {
            if (!pattern.hasOwnProperty(p)) continue;
            if (state) {
                pattern[p].startTime += Date.now() - pattern[p].suspended;
                pattern[p].prevTime += Date.now() - pattern[p].suspended;
                if (pattern[p].tempTime)
                    pattern[p].tempTime += Date.now() - pattern[p].suspended;
                pattern[p].suspended = 0;
            }
            else
                pattern[p].suspended = Date.now();
        }
    }

    public setAlarmTempTime(idx, temp: number) {
        if (typeof idx === 'object')
            idx = this.alarms.indexOf(idx);
        if (idx === -1 || idx >= this.alarms.length)
            return;
        let pattern = this._itemCache.alarmPatterns[idx];
        if (!pattern) {
            //use an object to store to prevent having to loop over large array
            pattern = {};
            if (this.alarms[idx].type === TriggerType.Alarm)
                pattern[0] = Alarm.parse(this.alarms[idx]);
            for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
                //enabled and is alarm
                if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === TriggerType.Alarm)
                    pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
            }
            this._itemCache.alarmPatterns[idx] = pattern;
        }
        if (pattern[0])
            pattern[0].setTempTime(temp);
    }

    public restartAlarmState(idx, oldState, newState) {
        if (oldState === newState)
            return;
        if (typeof idx === 'object')
            idx = this.alarms.indexOf(idx);
        if (idx === -1 || idx >= this.alarms.length)
            return;
        let pattern = this._itemCache.alarmPatterns[idx];
        if (!pattern) {
            //use an object to store to prevent having to loop over large array
            pattern = {};
            if (this.alarms[idx].type === TriggerType.Alarm)
                pattern[0] = Alarm.parse(this.alarms[idx]);
            for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
                //enabled and is alarm
                if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === TriggerType.Alarm)
                    pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
            }
            this._itemCache.alarmPatterns[idx] = pattern;
        }
        if (pattern[oldState])
            pattern[oldState].restart = Date.now();
        if (pattern[newState])
            pattern[newState].restart = Date.now();
    }

    public getRemainingAlarmTime(idx) {
        if (typeof idx === 'object')
            idx = this.alarms.indexOf(idx);
        if (idx === -1 || idx >= this.alarms.length)
            return 0;
        if (!this.alarms[idx].enabled)
            return 0;
        let pattern = this._itemCache.alarmPatterns[idx];
        if (!pattern) {
            //use an object to store to prevent having to loop over large array
            pattern = {};
            if (this.alarms[idx].type === TriggerType.Alarm)
                pattern[0] = Alarm.parse(this.alarms[idx]);
            for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
                //enabled and is alarm
                if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === TriggerType.Alarm)
                    pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
            }
            this._itemCache.alarmPatterns[idx] = pattern;
        }
        if (pattern[0]) {
            const alarm = pattern[0];
            const now = Date.now();
            const dNow = new Date();
            let future = now;
            let fend = future + 90000000;
            let mod = 1000;
            if (alarm.seconds !== -1)
                mod = 1000;
            else if (alarm.minutes !== -1)
                mod = 60000;
            else if (alarm.hours !== -1)
                mod = 3600000;
            if (alarm.tempTime) {
                if (alarm.tempTime - now > 0)
                    return alarm.tempTime - now;
                return 0;
            }
            else {
                while (future < fend) {
                    if (this._alarm_match(alarm, future, dNow))
                        return future - now;
                    future += mod;
                    dNow.setTime(dNow.getTime() + mod);
                }
                return -1;
            }
        }
        return 0;
    }

    public updateAlarms() {
        if (this._itemCache.alarmPatterns) {
            const old = this._itemCache.alarmPatterns;
            const oAlarms = this.alarms;
            this._itemCache.alarmPatterns = [];
            this._itemCache.alarms = null;
            const al = this.alarms.length;
            let idx = -1;
            for (let a = 0; a < al; a++) {
                idx = oAlarms.indexOf(this.alarms[a]);
                if (idx !== -1)
                    this._itemCache.alarmPatterns[a] = old[idx];
            }
        }
        this.startAlarms();
    }

    public process_alarms() {
        if (!this.getOption('enableTriggers'))
            return;
        let a = 0;
        let changed = false;
        const al = this.alarms.length;
        if (al === 0 && this._alarm) {
            clearInterval(this._alarm);
            this._alarm = null;
            return;
        }
        const patterns = this._itemCache.alarmPatterns;
        const now = Date.now();
        const alarms = this.alarms;
        const dNow = new Date();
        for (a = al - 1; a >= 0; a--) {
            let trigger = alarms[a];
            const parent = trigger;
            //not enabled skip
            if (!trigger.enabled) continue;
            //safety check in case a state was deleted
            if (trigger.state > trigger.triggers.length)
                trigger.state = 0;
            //get sub state
            if (trigger.state !== 0 && trigger.triggers && trigger.triggers.length) {
                //trigger states are 1 based as 0 is parent trigger
                trigger = trigger.triggers[trigger.state - 1];
                //skip disabled states
                while (!trigger.enabled && parent.state !== 0) {
                    //advance state
                    parent.state++;
                    //if no more states start over and stop
                    if (parent.state > parent.triggers.length) {
                        parent.state = 0;
                        //reset to first state
                        trigger = trigger.triggers[parent.state - 1];
                        //stop checking
                        break;
                    }
                    if (parent.state)
                        trigger = trigger.triggers[parent.state - 1];
                    else
                        trigger = parent;
                    changed = true;
                }
                if (changed) {
                    if (this.getOption('saveTriggerStateChanges'))
                        this.saveProfiles();
                    this.emit('item-updated', 'trigger', parent.profile.name, parent.profile.triggers.indexOf(parent), parent);
                }
                //last check to be 100% sure enabled
                if (!trigger.enabled) continue;
            }
            //reparse type
            if (trigger.type === SubTriggerTypes.ReParse || trigger.type === SubTriggerTypes.ReParsePattern) {
                const val = this._input.adjustLastLine(this.display.lines.length, true);
                const line = this.display.lines[val];
                a = this._input.TestTrigger(trigger, parent, a, line, this.display.lines[val].raw || line, val === this.display.lines.length - 1);
                continue;
            }
            //not an alarm either has sub alarms or was updated
            if (trigger.type !== TriggerType.Alarm) continue;
            let alarm = patterns[a];
            //not found build cache
            if (!alarm) {
                try {
                    patterns[a] = {};
                    if (trigger.type === TriggerType.Alarm)
                        patterns[a][0] = Alarm.parse(trigger);
                    for (let s = 0, sl = trigger.triggers.length; s < sl; s++) {
                        if (trigger.triggers[s].type === TriggerType.Alarm)
                            patterns[a][s] = Alarm.parse(trigger.triggers[s]);
                    }
                }
                catch (e) {
                    patterns[a] = null;
                    if (this.getOption('disableTriggerOnError')) {
                        trigger.enabled = false;
                        setTimeout(() => {
                            this.saveProfiles();
                            this.emit('item-updated', 'trigger', parent.profile, parent.profile.triggers.indexOf(parent), parent);
                        });
                    }
                    throw e;
                }
                alarm = patterns[a];
                //what ever reason the alarm failed to create so move on to next alarm
                if (!alarm) continue;
            }
            //we want to sub state pattern
            alarm = alarm[trigger.state];
            if (alarm.restart) {
                alarm.startTime = Date.now();
                alarm.prevTime = alarm.startTime;
                if (alarm.tempTime)
                    alarm.tempTime += Date.now() - alarm.restart;
                alarm.restart = 0;
            }
            let match: boolean = true;
            //a temp time was set so it overrides all matches as once the temp time has been reached end
            if (alarm.tempTime) {
                match = now >= alarm.tempTime;
                if (match)
                    alarm.tempTime = 0;
            }
            else
                match = this._alarm_match(alarm, now, dNow);
            if (match && !alarm.suspended) {
                alarm.prevTime = now;
                //save as if temp alarm as execute trigger advances state and temp alarms will need different state shifts
                const state = parent.state;
                this._input.lastTriggered = alarm.pattern;
                //_Triggered = string.Format('{0}:{1}:{2}', Fired.Hour, Fired.Minute, Fired.Second);
                this._input.ExecuteTrigger(trigger, [alarm.pattern], false, -a, null, null, parent);
                if (state !== parent.state)
                    alarm.restart = Date.now();
                if (alarm.temp) {
                    //has sub state so only remove the temp alarm state
                    if (parent.triggers.length) {
                        if (state === 0) {
                            const item = parent.triggers.shift();
                            //restore previous state as shifted state may have skipped next state
                            item.state = state;
                            item.priority = parent.priority;
                            item.name = parent.name;
                            item.profile = parent.profile;
                            //if removed temp shift state adjust
                            if (item.state > item.triggers.length)
                                item.state = 0;
                            item.triggers = parent.triggers;
                            alarms[a] = item;
                            patterns[a] = null;
                            this.saveProfiles();
                            const idx = parent.profile.triggers.indexOf(parent)
                            parent.profile.triggers[idx] = item;
                            this.emit('item-updated', 'trigger', parent.profile.name, idx, item);
                        }
                        else {
                            parent.triggers.splice(state - 1, 1);
                            patterns[a].splice(state - 1, 1);
                            //restore previous state as shifted state may have skipped next state
                            parent.state = state;
                            //if removed temp shift state adjust
                            if (parent.state > parent.triggers.length)
                                parent.state = 0;
                            this.saveProfiles();
                            const idx = parent.profile.triggers.indexOf(parent);
                            this.emit('item-updated', 'trigger', parent.profile.name, idx, parent);
                        }
                    }
                    else {
                        this._input.clearTriggerState(a);
                        this.removeTrigger(parent);
                    }
                }
                //remove after temp as temp requires old index
                a = -this._input.cleanUpTriggerState(-a);
            }
        }
    }

    private _alarm_match(alarm, now, dNow) {
        if (!alarm || alarm.suspended) return false;
        let match: boolean = true;
        let ts;
        let sec;
        let min;
        let hr;
        let hours;
        let minutes;
        let seconds;
        //no moment fall back to simple math
        if (!moment || this.simpleAlarms) {
            ts = now - this.connectTime;
            if (ts < 1000)
                return false;
            sec = Math.round(ts / 1000);
            min = Math.floor(sec / 60);
            hr = Math.floor(min / 60);
            hours = hr;
            minutes = Math.floor(min % 60);
            seconds = Math.floor(sec % 60);
        }
        else {
            if (alarm.start)
                ts = moment.duration(now - this.connectTime);
            else
                ts = moment.duration(now - alarm.startTime);
            if (ts.asMilliseconds() < 1000)
                return false;
            sec = Math.round(ts.asMilliseconds() / 1000);
            min = Math.floor(sec / 60);
            hr = Math.floor(min / 60);
            hours = ts.hours();
            minutes = ts.minutes();
            seconds = ts.seconds();
        }
        if (alarm.hoursWildCard) {
            if (alarm.hours === 0)
                match = match && hours === 0;
            else if (alarm.hours !== -1)
                match = match && hr !== 0 && hr % alarm.hours === 0;
        }
        else if (alarm.hours !== -1)
            match = match && alarm.hours === (alarm.start ? hours : dNow.getHours());
        if (alarm.minutesWildcard) {
            if (alarm.minutes === 0)
                match = match && minutes === 0;
            else if (alarm.minutes !== -1)
                match = match && min !== 0 && min % alarm.minutes === 0;
        }
        else if (alarm.minutes !== -1)
            match = match && alarm.minutes === (alarm.start ? minutes : dNow.getMinutes());
        if (alarm.secondsWildcard) {
            if (alarm.seconds === 0)
                match = match && seconds === 0;
            else if (alarm.seconds !== -1)
                match = match && sec % alarm.seconds === 0;
        }
        else if (alarm.seconds !== -1)
            match = match && alarm.seconds === (alarm.start ? seconds : dNow.getSeconds());
        return match;
    }

    constructor(options?: ClientOptions) {
        super();
        window.client = this;
        window.oiMUD = this;
        this._plugins = [];
        options = Object.assign({ display: '#display', commandInput: '#commandInput' }, options || {});
        if (!('display' in options) || typeof options.display === undefined)
            options.display = '#display';
        if (!('commandInput' in options) || typeof options.commandInput === undefined)
            options.commandInput = '#commandInput';

        this._display = new Display(options.display);

        this.display.on('click', e => {
            if (this.getOption('CommandonClick'))
                this._commandInput.focus();
        });
        this.display.on('scroll-lock', (lock) => {
            this.scrollLock = lock;
        });
        this.display.on('split-move-done', (h) => {
            this.setOption('display.splitHeight', h);
        });
        this.display.on('update-window', (width, height) => {
            this.telnet.updateWindow(width, height);
        });

        this.display.on('update-window', (width, height) => {
            this.telnet.updateWindow(width, height);
        });

        this.display.on('debug', (msg) => { this.debug(msg); });
        this.display.on('add-line', data => {
            this.emit('add-line', data);
        });
        this.display.on('add-line-done', data => {
            this.emit('add-line-done', data);
        });
        this.display.on('MXP-tag-reply', (tag, args) => {
            const e = { tag: tag, args: args, preventDefault: false };
            this.emit('MXP-tag-reply', e);
            if (e.preventDefault)
                return;
            switch (tag) {
                case 'VERSION':
                    if (this.display.MXPStyleVersion && this.display.MXPStyleVersion.length) {
                        this.debug(`MXP Tag REPLY: <VERSION MXP=1.0 STYLE=${this.display.MXPStyleVersion} CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>`);
                        this.send(`\x1b[1z<VERSION MXP=1.0 STYLE=${this.display.MXPStyleVersion} CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>\r\n`);
                    }
                    else {
                        this.debug(`MXP Tag REPLY: <VERSION MXP=1.0 CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>`);
                        this.send(`\x1b[1z<VERSION MXP=1.0 CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>\r\n`);
                    }
                    break;
                case 'SUPPORT':
                    this.debug(`MXP Tag REPLY: <SUPPORTS ${args.join(' ')}>`);
                    this.send(`\x1b[1z<SUPPORTS ${args.join(' ')}>\r\n`);
                    break;
                case 'USER':
                    this.emit('sendUsername', e);
                    break;
                case 'PASSWORD':
                    this.emit('sendPassword', e);
                    break;
            }
        });
        this.display.on('expire-links', (args) => {
            this.emit('expire-links', args);
        });

        this.display.on('parse-done', () => {
            this.emit('parse-done');
        });
        this.display.on('set-title', (title, type) => {
            if (typeof title === 'undefined' || title == null || title.length === 0)
                this.emit('set-title', this.getOption('title').replace('$t', this.defaultTitle) || this.defaultTitle);
            else if (type !== 1)
                this.emit('set-title', this.getOption('title').replace('$t', title) || '')
        });
        this.display.on('music', (data) => {
            this.emit('music', data);
        });
        this.display.on('sound', (data) => {
            this.emit('sound', data);
        });

        this.display.on('bell', () => {
            this.emit('bell');
        });

        if (typeof options.commandInput === 'string') {
            this._commandInput = document.querySelector(options.commandInput) as HTMLTextAreaElement;
            if (!this._commandInput)
                throw new Error('Invalid selector for command input.');
        }
        else if (options.commandInput instanceof $)
            this._commandInput = options.commandInput[0];
        else if (options.commandInput instanceof HTMLElement)
            this._commandInput = options.commandInput as HTMLTextAreaElement;
        else
            throw new Error('Command input must be a selector, element or jquery object');

        this._telnet = new Telnet({ protocol: options.protocol, scheme: options.scheme });
        this._telnet.terminal = 'oiMUD';
        this._telnet.version = this.version;
        this._telnet.GMCPSupports.push('oMUD 1');

        this._telnet.on('error', (err) => {
            if (this.enableDebug) this.debug(err);
            if (err) {
                if (err.type === 'close' && err.code === 1006)
                    return;
                const msg = [];
                if (err.type)
                    msg.push(err.type);
                if (err.text)
                    msg.push(err.text);
                if (err.message)
                    msg.push(err.message);
                if (err.reason)
                    msg.push(err.reason);
                if (err.code)
                    this.error(err.code + ' : ' + msg.join(', '));
                else
                    this.error(msg.join(', '));
            }
            else
                this.error('Unknown telnet error.');
            this.autoConnect();
            this.emit('reconnect');
        });
        this.telnet.on('connecting', () => {
            this.connecting = true;
            this.echo('Trying to connect to ' + this.host + ':' + this.port, AnsiColorCode.InfoText, AnsiColorCode.InfoBackground, true, true);
        });
        this.telnet.on('connect', () => {
            this.connecting = false;
            this.echo('Connected...', AnsiColorCode.InfoText, AnsiColorCode.InfoBackground, true, true);
            this.connectTime = Date.now();
            this.disconnectTime = 0;
            this.lastSendTime = Date.now();
            if (this._autoConnectID) {
                clearTimeout(this._autoConnectID);
                this._autoConnectID = null;
            }
            this.emit('connected');
            this.raise('connected');
        });

        this.telnet.on('debug', msg => {
            this.debug(msg);
        });
        this.telnet.on('receive-option', data => {
            this.emit('received-option', data);
        });
        this.telnet.on('close', () => {
            this.connecting = false;
            this.echo('Connection closed to ' + this.host + ':' + this.port, AnsiColorCode.InfoText, AnsiColorCode.InfoBackground, true, true);
            this.disconnectTime = Date.now();
            this.emit('closed');
            this.raise('disconnected');
            //clear after in case events need the times
            this.connectTime = 0;
            this.lastSendTime = 0;
        });
        this.telnet.on('received-data', data => {
            data = { value: data };
            this.emit('received-data', data);
            if (data == null || typeof data === 'undefined' || data.value == null || typeof data.value === 'undefined')
                return;
            this._printInternal(data.value, false, true);
            this.debug('Latency: ' + this.telnet.latency + 'ms');
            this.debug('Latency: ' + (this.telnet.latency / 1000) + 's');
        });
        this.telnet.on('received-MSDP', data => {
            this.emit('received-MSDP', data);
        });
        this.telnet.on('received-GMCP', data => {
            let val: string = data.value;
            let mod: string;
            let idx: number = 0;
            const dl: number = val.length;
            let c;
            if (dl === 0) return;
            for (idx = 0; idx < dl; idx++) {
                c = val.charAt(idx);
                if (c === ' ' || c === '{' || c === '[')
                    break;
            }
            mod = val.substr(0, idx).trim();
            val = val.substr(idx).trim();
            this.debug('GMCP Module: ' + mod);
            this.debug('GMCP Data: ' + val);
            let obj;
            if (mod.toLowerCase() === 'client.gui') {
                obj = val.split('/n');
                if (val.length >= 2) {
                    obj = {
                        version: parseInt(obj[0], 10),
                        url: obj[1]
                    };
                }
                else if (val.length > 0) {
                    obj = {
                        version: parseInt(obj[0], 10),
                        url: obj[1]
                    };
                }
                else
                    obj = { version: obj, url: '' };
                this.emit('received-GMCP', mod, obj);
                return;
            }
            try {
                if (val.length > 0)
                    obj = JSON.parse(val);
            }
            catch (e) {
                this.error('Invalid GMCP');
                return;
            }
            this.emit('received-GMCP', mod, obj);
        });
        this.telnet.on('windowSize', () => { this.UpdateWindow(); });

        let tmp: any = getParameterByName('host');
        if (tmp !== null && tmp.length)
            this.host = tmp;
        else if (options && 'host' in options)
            this.host = options.host;
        else
            this.host = '127.0.0.1';
        tmp = +getParameterByName('port');
        if (!isNaN(tmp) && tmp > 0)
            this.port = tmp;
        else if (options && 'port' in options)
            this.port = options.port;
        else
            this.port = 23;

        this._input = new Input(this);
        this._input.on('scroll-lock', (lock) => {
            this.display.scrollLock = lock;
            this.emit('scroll-lock', lock);
        });
        this._input.on('command-history-changed', history => this.emit('command-history-changed', history));

        this._input.on('item-added', (type, profile, idx, item) => {
            this.emit('item-added', type, profile, idx, item);
        });

        this._input.on('item-updated', (type, profile, idx, item) => {
            this.emit('item-updated', type, profile, idx, item);
        });

        this._input.on('item-removed', (type, profile, idx, item) => {
            this.emit('item-removed', type, profile, idx, item);
        });
        this.loadOptions();
        this._commandInput.value = '';
        this._commandInput.focus();
        window.addEventListener('blur', () => {
            this.active = false;
            this.emit('blur');
            this.raise('blur');
        });
        window.addEventListener('focus', () => {
            this.active = true;
            this.emit('focus');
            this.raise('focus');
        });
        window.addEventListener('beforeunload', e => {
            if (this.connected) {
                if (e)
                    e.returnValue = 'Closing or reloading will disconnect you from the mud.';
                return 'Closing or reloading will disconnect you from the mud.';
            }
            this.raise('closed');
        });
        window.addEventListener('unload', () => {
            if (this.connected)
                this.close();
        })
        //Add core plugins
        if (MSP_PLUGIN)
            this.addPlugin(new MSP(this));
        if (MAPPER_PLUGIN)
            this.addPlugin(new Mapper(this));
        if (STATUS_PLUGIN)
            this.addPlugin(new Status(this));
        if (LOGGER_PLUGIN)
            this.addPlugin(new Logger(this));
        if (CHAT_PLUGIN)
            this.addPlugin(new Chat(this));
        if (PANELBAR_PLUGIN)
            this.addPlugin(new PanelBar(this));
        if (SHADOWMUD_PLUGIN)
            this.addPlugin(new ShadowMUD(this));
        if (DEBUG || TEST_PLUGIN)
            this.addPlugin(new Test(this));
        this.autoConnect();
        this.emit('initialized');
    }

    public loadOptions() {
        this._options = new Settings();

        this.enableDebug = this._options.enableDebug;
        this.display.maxLines = this._options.bufferSize;
        this.display.enableFlashing = this._options.flashing;
        this.display.enableMXP = this._options.enableMXP;
        this.display.showInvalidMXPTags = this._options['display.showInvalidMXPTags'];
        this.display.enableURLDetection = this._options.enableURLDetection;
        this.display.enableMSP = this._options.enableMSP;
        this.display.enableColors = this._options['display.enableColors'];
        this.display.enableBackgroundColors = this._options['display.enableBackgroundColors'];

        this.display.wordWrap = this._options['display.wordWrap'];
        this.display.wrapAt = this._options['display.wrapAt'];
        this.display.indent = this._options['display.indent'];
        this.display.showTimestamp = this._options['display.showTimestamp'];
        this.display.tabWidth = this._options['display.tabWidth'];
        this.display.timestampFormat = this._options['display.timestampFormat'];
        this.display.splitHeight = this._options['display.splitHeight'];
        this.display.enableSplit = this._options['display.split'];
        this.display.splitLive = this._options['display.splitLive'];
        this.display.customSelection = this._options['display.customSelection'];

        const colors = this.getOption('colors');
        if (colors && colors.length > 0) {
            let c;
            const cl = colors.length;
            for (c = 0; c < cl; c++) {
                if (!colors[c] || colors[c].length === 0) continue;
                this.display.SetColor(c, colors[c]);
            }
        }

        if (this._telnet) {
            this._telnet.options.MCCP = this._options.enableMCCP;
            this._telnet.options.MXP = this._options.enableMXP;
            this._telnet.UTF8 = this._options.enableUTF8;
            this._telnet.options.ECHO = this._options.enableEcho;
            this._telnet.enableLatency = this._options.lagMeter;
            this._telnet.enablePing = this._options.enablePing;
        }
        this._input.scrollLock = this._options.scrollLocked;
        this._input.enableParsing = this._options.enableParsing;
        this._input.enableTriggers = this._options.enableTriggers;
        this.display.scrollLock = this._options.scrollLocked;
        this.display.hideTrailingEmptyLine = this._options['display.hideTrailingEmptyLine'];
        this.display.displayControlCodes = this.getOption('display.displayControlCodes');
        this.display.emulateTerminal = this.getOption('display.emulateTerminal');
        this.display.emulateControlCodes = this.getOption('display.emulateControlCodes');

        this._commandInput.wrap = this.getOption('commandWordWrap') ? 'on' : 'off';

        if (this.UpdateFonts) this.UpdateFonts();
        this.display.scrollDisplay();
        this.loadProfiles();
        this.emit('options-loaded');
    }

    public setOption(name, value) {
        if (name === -1 || name === '-1')
            return;
        this._options[name] = value;
        Settings.setValue(name, value);
        this.emit('option-changed', name, value);
    }

    public getOption(name: string): any {
        if (this._options && name in this._options)
            return this._options[name];
        return this._options[name] = Settings.getValue(name);
    }

    public UpdateFonts() {
        //can only update if display has been setup
        if (!this.display) return;
        this.display.updateFont(this._options.font + ', monospace', this._options.fontSize);
        this._commandInput.style.fontSize = this._options.cmdfontSize;
        this._commandInput.style.fontFamily = this._options.cmdfont + ', monospace';
    }

    public parse(txt: string) {
        this._parseInternal(txt, false, false, true);
    }

    private _parseInternal(txt: string, remote: boolean, force?: boolean, prependSplit?: boolean) {
        this.display.append(txt, remote, force, prependSplit);
    }

    public error(err: any) {
        if (this.enableDebug) this.debug(err);
        let msg = '';
        if (err == null || typeof err === 'undefined')
            err = new Error('Unknown');
        else if (typeof err === 'string' && err.length === 0)
            err = new Error('Unknown');
        if (err.stack && this.getOption('showErrorsExtended'))
            msg = err.name + ': ' + err.message + '\n' + err.stack;
        else if (err instanceof Error || err instanceof TypeError)
            msg = err.name + ': ' + err.message;
        else if (err.message)
            msg = err.message;
        else
            msg = '' + err;

        if (msg.match(/^.*Error: /g) || msg.match(/^.*Error - /g))
            this.echo(msg, AnsiColorCode.ErrorText, AnsiColorCode.ErrorBackground, true, true);
        else
            this.echo('Error: ' + msg, AnsiColorCode.ErrorText, AnsiColorCode.ErrorBackground, true, true);

        if (this.getOption('logErrors')) {
            if (!this.getOption('showErrorsExtended')) {
                if (err.stack)
                    msg += '\n' + err.stack;
                else {
                    err = new Error(err || msg);
                    msg += '\n' + err.stack;
                }
            }
            else if (!err.stack) {
                err = new Error(err || msg);
                msg += '\n' + err.stack;
            }
            window.console.log(new Date().toLocaleString());
            window.console.log(msg);
            localforage.getItem('oiMUDErrorLog').then(value => {
                localforage.setItem('oiMUDErrorLog', value = (value || '') + new Date().toLocaleString() + '\n' + msg + '\n');
            }).catch(err => this.error(err));
        }
        if (err === 'Error: ECONNRESET - read ECONNRESET.' && this.telnet.connected)
            this.close();
        this.raise('error', msg);
    }

    public echo(str: string, fore?: number, back?: number, newline?: boolean, forceLine?: boolean) {
        if (str == null) str = '';
        if (newline == null) newline = false;
        if (forceLine == null) forceLine = false;
        if (fore == null) fore = AnsiColorCode.LocalEcho;
        if (back == null) back = AnsiColorCode.LocalEchoBack;
        const codes = '\x1b[0m' + this.display.CurrentAnsiCode() + '\n';
        //make its a string in case raw js passes number or something else
        str = '' + str;
        if (str.endsWith('\n'))
            str = str.substr(0, str.length - 1);
        if (this.telnet.prompt && forceLine) {
            this.print('\n\x1b[' + fore + ';' + back + 'm' + str + codes, newline);
            this.telnet.prompt = false;
        }
        else
            this.print('\x1b[' + fore + ';' + back + 'm' + str + codes, newline);
    }

    public print(txt: string, newline?: boolean) {
        this._printInternal(txt, newline, false, true);
    }

    private _printInternal(txt: string, newline?: boolean, remote?: boolean, prependSplit?: boolean) {
        if (txt == null || typeof txt === 'undefined') return;
        if (newline == null) newline = false;
        if (remote == null) remote = false;
        if (newline && this.display.textLength > 0 && !this.display.EndOfLine && this.display.EndOfLineLength !== 0 && !this.telnet.prompt && !this.display.parseQueueEndOfLine)
            txt = '\n' + txt;
        this.emit('print');
        this._parseInternal(txt, remote, false, prependSplit);
    }

    public send(data, echo?: boolean) {
        this.telnet.sendData(data);
        this.lastSendTime = Date.now();
        if (echo && this.telnet.echo && this.getOption('commandEcho'))
            this.echo(data);
        else if (echo)
            this.echo('\n');
    }

    public sendRaw(data) {
        this.telnet.sendData(data, true);
        this.lastSendTime = Date.now();
    }

    public sendGMCP(data) {
        this.telnet.sendGMCP(data);
        this.lastSendTime = Date.now();
    }

    public debug(str: string, style?) {
        const data = { value: str };
        this.emit('debug', data);
        if (!this._enableDebug || data == null || typeof data === 'undefined' || data.value == null || typeof data.value === 'undefined' || data.value.length === 0)
            return;
        if (window.console) {
            if (style)
                window.console.log('%c' + str, style);
            else
                window.console.log(data.value);
        }
    }

    public sendCommand(txt?: string, noEcho?: boolean, comments?: boolean) {
        if (txt == null) {
            txt = this._commandInput.value;
            if (!this.telnet.echo)
                this._commandInput.value = '';
            else
                this._input.AddCommandToHistory(txt);
        }
        //make its a string in case raw js passes number or something else
        txt = '' + txt;
        if (!txt.endsWith('\n'))
            txt = txt + '\n';
        const data = { value: txt, handled: false, comments: comments };
        this.emit('parse-command', data);
        if (data == null || typeof data === 'undefined') return;
        if (data.handled || data.value == null || typeof data.value === 'undefined') return;
        if (data.value.length > 0)
            this.send(data.value, !noEcho);
        if (!this.getOption('keepLastCommand'))
            this._commandInput.value = '';
        else if (this.getOption('selectLastCommand'))
            selectAll(this._commandInput);
    }

    public sendBackground(txt: string, noEcho?: boolean, comments?: boolean) {
        if (txt == null) {
            txt = this._commandInput.value;
            if (!this.telnet.echo)
                this._commandInput.value = '';
            else
                this._input.AddCommandToHistory(txt);
        }
        //make its a string in case raw js passes number or something else
        txt = '' + txt;
        if (!txt.endsWith('\n'))
            txt = txt + '\n';
        const data = { value: txt, handled: false, comments: comments };
        this.emit('parse-command', data);
        if (data == null || typeof data === 'undefined') return;
        if (data.value == null || typeof data.value === 'undefined') return;
        if (!data.handled && data.value.length > 0)
            this.send(data.value, !noEcho);
    }

    get scrollLock(): boolean {
        return this._input.scrollLock;
    }

    set scrollLock(enabled: boolean) {
        this._input.scrollLock = enabled;
    }

    public toggleScrollLock() {
        this._input.toggleScrollLock();
    }

    public UpdateWindow() {
        this.display.updateWindow();
    }

    public close() {
        this.telnet.close();
    }

    public connect() {
        this.emit('connecting');
        this.display.ClearMXP();
        this.display.ResetMXPLine();
        this.telnet.connect();
        this.emit('connect');
        this._commandInput.focus();
    }

    public receivedData(data) {
        this.telnet.receivedData(data);
    }

    public notify(title: string, message: string, options?: NotificationOptions) {
        if (this.enableDebug) {
            this.emit('debug', 'notify title: ' + title);
            this.emit('debug', 'notify msg: ' + message);
        }
        this.emit('notify', title, message, options);
    }

    public clear() {
        this.display.clear();
        this.emit('cleared');
    }

    public parseInline(text: string) {
        return this._input.parseInline(text);
    }

    public parseOutgoing(text: string, eAlias?: boolean, stacking?: boolean, noFunction?: boolean) {
        return this._input.parseOutgoing(text, eAlias, stacking, noFunction);
    }

    public clearCache() {
        this._input.clearCaches();
        this._itemCache = {
            triggers: null,
            aliases: null,
            macros: null,
            buttons: null,
            contexts: null,
            defaultContext: null,
            alarms: null,
            alarmPatterns: []
        };
    };

    public beep() {
        this.emit('bell');
    }

    public raise(event: string, args?, delay?: number) {
        //if profiles not loaded, try again until loaded as profiles are loaded async
        if (!this.profiles) {
            setTimeout(() => {
                this.raise(event, args, delay);
            }, 100);
            return;
        }
        if (!delay || delay < 1)
            this._input.triggerEvent(event, args);
        else
            setTimeout(() => {
                this._input.triggerEvent(event, args);
            }, delay);
    }

    public show() {
        this.emit('show');
    }

    public hide() {
        this.emit('hide');
    }

    public toggle() {
        this.emit('toggle');
    }

    public autoConnect() {
        if (!this._autoConnectID && this.getOption('autoConnect') && !this._telnet.connected)
            this._autoConnectID = setTimeout(() => { this.connect(); this._autoConnectID = null; }, this.getOption('autoConnectDelay'));
    }

    public getWindowState(windowName) {
        let state = this.getOption('windows.' + windowName);
        if (state && this.getOption('fixHiddenWindows')) {
            if (state.x + state.width / 2 > document.body.clientWidth)
                state.x = document.body.clientWidth - state.width / 2;
            if (state.x < 0)
                state.x = 0;
            if (state.y + state.height / 2 > document.body.clientHeight)
                state.y = document.body.clientHeight - state.height / 2;
            if (state.y < 0)
                state.y = 0;
        }
        return state;
    }
}
window.Client = Client;
window.Display = Display;