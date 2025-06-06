//MSP = 90 // MUD Sound Protocol (MSP)(unofficial)
/**
 * Implementation of the MSP (MUD Sound Protocol) and GMCP Client.Media module for oiMUD as a plugin
 *
 * @author Icewolfz
 * @copyright Icewolfz 2013
 * @version 1.2
 * MSP requires the modules {@link module:telnet}.
 * MSP requires the modules {@link module:src/lib/buzz}.
 * @requires module:src/lib/buzz
 * @requires module:telnet
 * @namespace MSP
 * @constructor
 *
 * @property {Object} [server=false]	- Weather the server willing to do MSP
 * @property {Object} [enabled=true]	- Is MSP module enabled
 *
 * @todo make Music/Sound play music either using soundmanager2(larger but more compatible) or buzz (HTML5 old)
 */
declare global {
    interface Window {
        MSP: MSP;
    }
}

import * as buzz from './../lib/buzz.js'

import { EventEmitter } from '../core/events.js';
//import { stripQuotes } from '../core/library.js';
import { TelnetOption } from '../core/telnet.js';
import { Client } from '../core/client.js';
import { Plugin } from '../core/plugin.js';
import { AnsiColorCode } from '../core/ansi.js';
import { FunctionEvent, MenuItem } from '../core/types.js';

enum ParseMode {
    default = 0,
    inline = 1,
    strict = 2
}

interface MSPData {
    off: boolean;
    file?: string;
    url?: string;
    volume?: number;
    repeat?: number;
    priority?: number;
    type?: string;
    continue?: boolean;
}

class SoundState extends EventEmitter {
    public _file: string = '';
    private _repeats: number = 1;
    private _volume: number = 100;
    private _priority: number = 50;
    private _retries: number = 0;

    public current: number = 0;
    public sound = null;
    public playing: boolean = false;
    public url: string = '';
    public continue: boolean = true;
    public maxErrorRetries: number = 0;

    set file(file: string) {
        if (!this.continue)
            this.close();
        this._file = file;
    }
    get file(): string {
        return this._file;
    }

    set repeats(repeats: number) {
        if (repeats >= -1)
            this._repeats = repeats;
        else
            this._repeats = 1;
        this.current = 0;
    }

    get repeats(): number {
        return this._repeats;
    }

    set volume(volume: number) {
        if (volume >= 0 && volume <= 100)
            this._volume = volume;
        else
            this._volume = 1;
    }

    get volume(): number {
        return this._volume;
    }

    set priority(priority: number) {
        if (priority >= 0 && priority <= 100)
            this._priority = priority;
        else
            this._priority = 50;
    }

    get priority(): number {
        return this._priority;
    }

    public play() {
        this.playing = true;
        if (this._repeats > 0 && this.current < this._repeats) {
            this.current++;
            this.close();
            this.open().then(() => {
                //reset to 0 as it was successful in prep of next sound
                this._retries = 0;
                this.sound.setVolume(this._volume).play();
                if (this.current < this._repeats) {
                    this.sound.bind('ended abort', (e) => {
                        this.play();
                    });
                }
                else
                    this.sound.bind('ended abort', (e) => {
                        this.playing = false;
                        this.emit('ended');
                    });
                if (this.sound.isEnded())
                    this.playing = false;
            }).catch(err => {
                //only retry until reaches max error retries to prevent infinite looping
                if (this._retries < this.maxErrorRetries) {
                    //reduce current as failed to play
                    this.current--;
                    this.play();
                    this._retries++;
                }
                //if at max retries do nothing and reset to 0
                else
                    this._retries = 0;
            });
        }
        else if (this._repeats === -1) {
            this.close();
            this.open().then(() => {
                //reset to 0 as it was successful in prep of next sound
                this._retries = 0;
                this.sound.setVolume(this._volume).loop().play();
                if (this.sound.isEnded())
                    this.playing = false;
            }).catch(err => {
                //only retry until reaches max error retries to prevent infinite looping
                if (this._retries < this.maxErrorRetries) {
                    this.play();
                    this._retries++;
                }
                //if at max retries do nothing and reset to 0
                else
                    this._retries = 0;
            });
        }
        else
            this.playing = false;
    }

    public async open() {
        this.close();
        return new Promise((resolve, reject) => {
            this.sound = new buzz.sound(this.url + this._file);
            this.sound.bind('loadeddata', (e) => {
                this.emit('playing', { file: this._file, sound: this.sound, state: this, duration: buzz.toTimer(this.sound.getDuration()) });
                resolve(1);
            });
            this.sound.bind('error', (e) => {
                if (e && e.currentTarget && e.currentTarget.error) {
                    switch (e.currentTarget.error.code) {
                        case 1:
                            this.emit('error', new Error(`MSP - Aborted: ${this.url}${this._file}`));
                            break;
                        case 2:
                            this.emit('error', new Error(`MSP - Network error: ${this.url}${this._file}`));
                            break;
                        case 3:
                            this.emit('error', new Error(`MSP - Could not decode: ${this.url}${this._file}`));
                            break;
                        case 4:
                            this.emit('error', new Error(`MSP - Source not supported: ${this.url}${this._file}`));
                            break;
                    }
                }
                else if (e && e.currentTarget && e.currentTarget.networkState === 3)
                    this.emit('error', new Error(`MSP - Source not found or unable to play: ${this.url}${this._file}`));
                else
                    this.emit('error', new Error('MSP - Unknown error'));
                reject();
            });
            this.emit('opened');
        });
    }

    public close() {
        if (this.sound) {
            this.stop();
            delete this.sound;
            this.sound = null;
        }
        else if (this.playing)
            this.playing = false;
        this.emit('closed');
    }

    public stop() {
        if (this.sound)
            this.sound.stop();
        this.playing = false;
        this.emit('stopped');
    }
}

export interface MSPOptions {
    client: Client;
    forcedDefaultMusicURL?: string;
    forcedDefaultSoundURL?: string;
}

/**
 * Implementation of the MSP (MUD Sound Protocol)
 *
 * @author William
 * @copyright William 2013
 * @version 1.1
 * MSP requires the modules {@link module:telnet}.
 * MSP requires the modules {@link module:buzz}.
 * @requires module:buzz
 * @requires module:telnet
 * @namespace MSP
 * @constructor
 *
 * @property {Object} [server=false]	- Weather the server willing to do MSP
 * @property {Object} [enabled=true]	- Is MSP module enabled
 */
export class MSP extends Plugin {
    private _enabled: boolean = true;
    private _enableSound: boolean = true;
    private _maxErrorRetries: number = 1;
    public server: boolean = false;
    public enableDebug: boolean = false;

    public defaultSoundURL: string = '';
    public defaultMusicURL: string = '';
    public forcedDefaultMusicURL: string = 'http://' + window.location.hostname + '/sounds/';
    public forcedDefaultSoundURL: string = 'http://' + window.location.hostname + '/sounds/';
    public defaultSoundExt: string = '.m4a';
    public defaultMusicExt: string = '.m4a';
    public MusicState: SoundState = new SoundState();
    public SoundState: SoundState = new SoundState();
    public parseMode: ParseMode = ParseMode.default;

    constructor(options?: MSPOptions | Client) {
        super(options instanceof Client ? options : options?.client);
        if (options && !(options instanceof Client)) {
            if ('forcedDefaultMusicURL' in options)
                this.forcedDefaultMusicURL = options.forcedDefaultMusicURL;
            if ('forcedDefaultSoundURL' in options)
                this.forcedDefaultSoundURL = options.forcedDefaultSoundURL;
        }
        this.MusicState.on('playing', (data) => { data.type = 1; this.emit('playing', data); });
        this.SoundState.on('playing', (data) => { data.type = 0; this.emit('playing', data); });
        this.MusicState.on('error', (err) => { this.emit('error', err); });
        this.SoundState.on('error', (err) => { this.emit('error', err); });
        this.MusicState.maxErrorRetries = this._maxErrorRetries;
        this.SoundState.maxErrorRetries = this._maxErrorRetries;
    }

    public remove() {
        if (!this.client) return;
        this.client.removeListenersFromCaller(this);
        let idx = this.client.telnet.GMCPSupports.indexOf('Client.Media 1');
        this.client.telnet.GMCPSupports.splice(idx, 1);
    }

    public initialize() {
        if (!this.client) return;
        this.client.telnet.GMCPSupports.push('Client.Media 1');
        this.client.on('connecting', () => this.reset(), this);
        this.client.on('close', () => this.reset(), this);
        this.client.on('received-option', this._processOption, this);
        this.client.on('received-GMCP', this._processGMCP, this);
        this.client.on('music', this.music, this);
        this.client.on('sound', this.sound, this);
        this.client.on('options-loaded', this._loadOptions, this);
        this.client.on('option-loaded', this._setOption, this);
        this.client.on('function', this._processFunction, this);
        this.on('playing', (data) => {
            if (!this.client) return;
            this.debug('MSP ' + (data.type ? 'Music' : 'Sound') + ' Playing ' + data.file + ' for ' + data.duration);
            this.debug(data);
            if (!this.client.getOption('notifyMSPPlay')) return;
            this.client.echo((data.type ? 'Music' : 'Sound') + ' Playing ' + data.file + ' for ' + data.duration, AnsiColorCode.InfoText, AnsiColorCode.InfoBackground, true, true);
        });
        this.on('debug', e => this.client.debug(e), this);
        this.on('error', e => this.client.error(e), this);
        this._loadOptions();
    }

    public get menu() {
        return [];
    }

    public get settings(): MenuItem[] {
        return [];
    }

    private _loadOptions() {
        this.enableDebug = this.client.getOption('enableDebug');
        this.enabled = this.client.getOption('enableMSP');
        this.enableSound = this.client.getOption('enableSound');
        this.maxErrorRetries = this.client.getOption('mspMaxRetriesOnError');
    }

    private _setOption(option, value) {
        switch (option) {
            case 'enableMSP':
                this.enabled = this.client.getOption('enableMSP');
                break;
            case 'mspMaxRetriesOnError':
                this.maxErrorRetries = this.client.getOption('mspMaxRetriesOnError');
                break;
            case 'enableSound':
            case 'enableDebug':
                this[option] = value;
                break;
        }
    }

    /**
     * enable or disable MSP
     *
     * @type {boolean}
     * @memberof MSP
     */
    get enabled() { return this._enabled; }
    set enabled(value) {
        if (value === this._enabled) return;
        this._enabled = value;
        this.MusicState?.close();
        this.SoundState?.close();
    }

    /**
     * the number of retries to try before stopping when an error happens MSP
     *
     * @type {boolean}
     * @memberof MSP
     */
    get maxErrorRetries() { return this._maxErrorRetries; }
    set maxErrorRetries(value) {
        if (value === this._maxErrorRetries) return;
        this._maxErrorRetries = value;
        if (this.MusicState)
            this.MusicState.maxErrorRetries = value;
        if (this.SoundState)
            this.SoundState.maxErrorRetries = value;
    }


    /**
     * enable or disable enableSound, allow processing of msp
     *
     * @type {boolean}
     * @memberof MSP
     */
    get enableSound() { return this._enableSound; }
    set enableSound(value) {
        if (value === this._enableSound) return;
        this._enableSound = value;
        this.MusicState?.close();
        this.SoundState?.close();
    }

    /**
     * getArguments - process a line of text and extract any arguments and return
     * them as an object for consuming and handle it due to being a web browser can't
     * save sounds, so they either need a url or be on the local http server using
     * the default url set
     *
     * @param {String} text the line of text extract arguments from
     * @param {Number} type the type of arguments to process, 0 SOUND, 1 MUSIC
     * @returns {Object} return a MUSIC or SOUND argument object
     */
    /*
    public getArguments(text: string, type: number) {
        const e: MSPData = { off: false, file: '', url: '', volume: 100, repeat: 1, priority: 50, type: '', continue: true };
        const args = [];
        let state: number = 0;
        let str = [];
        let x: number = 0;
        let xl: number = text.length;
        let c: string;
        let arg;
        let tmp;
        for (; x < xl; x++) {
            c = text.charAt(x);
            switch (state) {
                case 1:
                    if (c === '\'') {
                        state = 0;
                        str.push(c);
                    }
                    else
                        str.push(c);
                    break;
                case 2:
                    if (c === '\'') {
                        state = 0;
                        str.push(c);
                    }
                    else
                        str.push(c);
                    break;
                default:
                    if (c === ' ') {
                        args.push(str.join(''));
                        str = [];
                    }
                    else if (c === '\'') {
                        state = 1;
                        str.push(c);
                    }
                    else if (c === '\'') {
                        state = 2;
                        str.push(c);
                    }
                    else
                        str.push(c);

                    break;
            }
        }
        if (str.length > 0) {
            args.push(str.join(''));
            str = [];
        }
        x = 0;
        xl = args.length;
        this.debug('MSP arguments found: ' + args);
        for (x = 0; x < xl; x++) {
            arg = args[x].split('=');
            if (arg.length > 1) {
                switch (arg[0].toUpperCase()) {
                    case 'FNAME':
                        e.file = stripQuotes(arg[1]);
                        if (e.file.toLowerCase() === 'off') {
                            e.off = true;
                            e.file = '';
                        }
                        break;
                    case 'V': //volume
                        tmp = parseInt(arg[1], 10);
                        if (isNaN(tmp))
                            tmp = 100;
                        e.volume = tmp;
                        break;
                    case 'L': //repeat
                        tmp = parseInt(arg[1], 10);
                        if (isNaN(tmp))
                            tmp = 1;
                        e.repeat = tmp;
                        break;
                    //Sound only
                    case 'P': //priority
                        tmp = parseInt(arg[1], 10);
                        if (isNaN(tmp))
                            tmp = 1;
                        e.priority = tmp;
                        break;
                    //Music only
                    case 'C': //continue
                        e.continue = arg[1] !== '0';
                        break;
                    case 'T': //type
                        if (arg[1].length > 0)
                            e.type = arg[1];
                        break;
                    case 'U': //url
                        e.url = stripQuotes(arg[1]);
                        if (!e.url.endsWith('/') && e.url.length > 0)
                            e.url += '/';
                        break;
                }
            }
            else if (x === 0) {
                e.file = stripQuotes(args[x]);
                if (e.file.toLowerCase() === 'off') {
                    e.off = true;
                    e.file = '';
                }
            }
            else if (x === 1) {
                tmp = parseInt(args[x], 10);
                if (isNaN(tmp))
                    tmp = 100;
                e.volume = tmp;
            }
            else if (x === 2) {
                tmp = parseInt(args[x], 10);
                if (isNaN(tmp))
                    tmp = 1;
                e.repeat = tmp;
            }
            else if (x === 3 && type === 1)
                e.continue = args[x] !== '0';
            else if (x === 3) {
                tmp = parseInt(args[x], 10);
                if (isNaN(tmp))
                    tmp = 1;
                e.priority = tmp;
            }
            else if (x === 4) {
                if (args[x].length > 0)
                    e.type = args[x];
            }
            else if (x === 5) {
                e.url = stripQuotes(args[x]);
                if (!e.url.endsWith('/') && e.url.length > 0)
                    e.url += '/';
            }
        }
        this.debug(e);
        return e;
    }
    */

    public reset() {
        this.server = false;
    }

    /**
     * music - process music object and player/stop based on object options
     *
     * @param {Object} data Music argument object, contains all settings
     */
    public music(data: MSPData) {
        if (!this.enabled && !this.enableSound) return false;
        if (!data.file || data.file.length === 0) {
            if (data.off && data.url && data.url.length > 0)
                this.defaultMusicURL = data.url;
            else if (data.off)
                this.MusicState.stop();
            return;
        }
        else if (data.off) {
            this.MusicState.stop();
            return;
        }
        this.MusicState.volume = data.volume;
        this.MusicState.repeats = data.repeat;
        this.MusicState.continue = data.continue;
        const old = this.MusicState.file;

        if (data.file.lastIndexOf('.') === -1)
            this.MusicState.file = data.file + this.defaultMusicExt;
        else
            this.MusicState.file = data.file;
        if (data.url && data.url.length > 0)
            this.MusicState.url = data.url;
        else if (this.forcedDefaultMusicURL && this.forcedDefaultMusicURL.length > 0)
            this.MusicState.url = this.forcedDefaultMusicURL;
        else if (this.defaultMusicURL && this.defaultMusicURL.length > 0)
            this.MusicState.url = this.defaultMusicURL;
        else
            this.MusicState.url = '';
        if (this.MusicState.url.length > 0 && !this.MusicState.url.endsWith('/'))
            this.MusicState.url += '/';
        if (data.type && data.type.length > 0) {
            this.MusicState.url += data.type;
            if (this.MusicState.url.length > 0 && !this.MusicState.url.endsWith('/'))
                this.MusicState.url += '/';
        }
        if (old !== this.MusicState.file || !data.continue || !this.MusicState.playing) {
            if (this.enableSound)
                this.MusicState.play();
            else
                this.emit('playing', { type: 1, file: this.MusicState.file, sound: this.MusicState.sound, state: this.MusicState, duration: '--:--' });
        }
    }

    /**
     * sound - process music object and player/stop based on object options
     *
     * @param {Object} data Sound argument object, contains all settings
     * @todo make it play/stop sound
     */
    public sound(data: MSPData) {
        if (!this.enabled && !this.enableSound) return false;
        if (!data.file || data.file.length === 0) {
            if (data.off && data.url && data.url.length > 0)
                this.defaultSoundURL = data.url;
            else if (data.off)
                this.SoundState.stop();
            return;
        }
        else if (data.off) {
            this.SoundState.stop();
            return;
        }
        //if playing and new priority is lower, do not play new sound
        if (this.SoundState.playing && data.priority < this.SoundState.priority)
            return false;

        this.SoundState.volume = data.volume;
        this.SoundState.repeats = data.repeat;
        this.SoundState.priority = data.priority;
        if (data.file.lastIndexOf('.') === -1)
            this.SoundState.file = data.file + this.defaultSoundExt;
        else
            this.SoundState.file = data.file;
        if (data.url && data.url.length > 0)
            this.SoundState.url = data.url;
        else if (this.forcedDefaultSoundURL && this.forcedDefaultSoundURL.length > 0)
            this.SoundState.url = this.forcedDefaultSoundURL;
        else if (this.defaultSoundURL && this.defaultSoundURL.length > 0)
            this.SoundState.url = this.defaultSoundURL;
        else
            this.SoundState.url = '';
        if (this.SoundState.url.length > 0 && !this.SoundState.url.endsWith('/'))
            this.SoundState.url += '/';
        if (data.type && data.type.length > 0) {
            this.SoundState.url += data.type;
            if (this.SoundState.url.length > 0 && !this.SoundState.url.endsWith('/'))
                this.SoundState.url += '/';
        }
        if (this.enableSound)
            this.SoundState.play();
        else
            this.emit('playing', { type: 0, file: this.SoundState.file, sound: this.SoundState.sound, state: this.SoundState, duration: '--:--' });
    }

    /**
     * processOption - process telnet options, if its MSP handle it and correctly reply yes we support MSP or no don't
     *
     * @param {Object} data Telnet#replyToOption event object
     */
    private _processOption(data: TelnetOption) {
        if (data.option === 90) {
            this.debug('<MSP>');
            if (data.verb === 253) {
                this.server = true;
                if (this.enabled) {
                    this.debug('REPLY: <IAC><WILL><MSP>');
                    data.telnet.sendData([255, 251, 90], true);
                }
                else {
                    this.debug('REPLY: <IAC><DONT><MSP>');
                    data.telnet.sendData([255, 254, 90], true);
                }
            }
            else if (data.verb === 254) {
                this.server = false;
                this.debug('REPLY: <IAC><WONT><MSP>');
                data.telnet.sendData([255, 252, 90], true);
            }
            else if (data.verb === 251) {
                this.server = true;
                if (this.enabled) {
                    this.debug('REPLY: <IAC><DO><MSP>');
                    data.telnet.sendData([255, 253, 90], true);
                }
                else {
                    this.debug('REPLY: <IAC><DONT><MSP>');
                    data.telnet.sendData([255, 254, 90], true);
                }
            }
            else if (data.verb === 252) {
                this.server = false;
                this.debug('REPLY: <IAC><DONT><MSP>');
                data.telnet.sendData([255, 254, 90], true);
            }
            data.handled = true;
        }
    }

    /**
     * processGMCP - process incoming GMCP for Client.Media events
     * @param {string} mod Client#received-GMCP module
     * @param {Object} data Client#received-GMCP data object
     */
    private async _processGMCP(mod: string, data: any) {
        switch (mod) {
            case 'Client.Media.Default':
                if (data.type === 'sound' || !data.type)
                    this.sound({ off: true, url: data.url });
                else if (data.type === 'music')
                    this.music({ off: true, url: data.url });
                break;
            //as we don't support loading and caching of media ignore this
            case 'Client.Media.Load':
                break;
            case 'Client.Media.Play':
                //start off with default values
                const sound: MSPData = { off: false, file: data.name, url: '', volume: 50, repeat: 1, priority: 50, type: '', continue: true };
                //process incoming data and set as needed
                if (data.hasOwnProperty('url'))
                    sound.url = data.url;
                if (data.hasOwnProperty('tag'))
                    sound.type = data.tag;
                if (data.hasOwnProperty('volume'))
                    sound.volume = data.volume;
                if (data.hasOwnProperty('loops'))
                    sound.repeat = data.loops;
                if (data.hasOwnProperty('priority'))
                    sound.priority = data.priority;
                if (data.type === 'sound' || !data.type)
                    this.sound(sound);
                else if (data.type === 'music') {
                    if (data.hasOwnProperty('continue') && (data.continue === 'false' || !data.continue))
                        sound.continue = false;
                    this.music(sound);
                }
                break;
            case 'Client.Media.Stop':
                if (data.type === 'sound' || !data.type)
                    this.sound({ off: true });
                else if (data.type === 'music')
                    this.music({ off: true });
                break;
        }
    }

    /**
     * debug - emit debug event if enabledDebug on
     * @param {string | object} e The debug message or an object of data 
     */
    public debug(e) {
        if (!this.enableDebug) return;
        this.emit('debug', e);
    }

    /**
     * Process function event to execute custom text functions
     * @param data {FunctionEvent} The data about the function to execute
     */
    private _processFunction(data: FunctionEvent) {
        let args;
        let tmp;
        let i;
        if (!data) return;
        switch (data.name.toLowerCase()) {
            case 'soundinfo':
                if (this.SoundState.playing)
                    this.client.echo('Playing Sound - ' + this.SoundState.file + ' - ' + buzz.toTimer(this.SoundState.sound.getTime()) + '/' + buzz.toTimer(this.SoundState.sound.getDuration()), -7, -8, true, true);
                else
                    this.client.echo('No sound currently playing.', -7, -8, true, true);
                data.handled = true;
                break;
            case 'musicinfo':
                if (this.MusicState.playing)
                    this.client.echo('Playing Music - ' + this.MusicState.file + ' -  ' + buzz.toTimer(this.MusicState.sound.getTime()) + '/' + buzz.toTimer(this.MusicState.sound.getDuration()), -7, -8, true, true);
                else
                    this.client.echo('No music currently playing.', -7, -8, true, true);
                data.handled = true;
                break;
            case 'playmusic':
            case 'playm':
                args = this.client.input.parseOutgoing(data.args.join(' '), false);
                tmp = { off: false, file: '', url: '', volume: 100, repeat: 1, priority: 50, type: '', continue: true };
                i = args.lastIndexOf('/');
                if (i === -1)
                    tmp.file = args;
                else {
                    tmp.file = args.substring(i + 1);
                    tmp.url = args.substring(0, i + 1);
                }
                this.music(tmp);
                data.handled = true;
                break;
            case 'playsound':
            case 'plays':
                args = this.client.input.parseOutgoing(data.args.join(' '), false);
                tmp = { off: false, file: '', url: '', volume: 100, repeat: 1, priority: 50, type: '', continue: true };
                i = args.lastIndexOf('/');
                if (i === -1)
                    tmp.file = args;
                else {
                    tmp.file = args.substring(i + 1);
                    tmp.url = args.substring(0, i + 1);
                }
                this.sound(tmp);
                data.handled = true;
                break;
            case 'stopmusic':
            case 'stopm':
                this.MusicState.close();
                data.handled = true;
                break;
            case 'stopsound':
            case 'stops':
                this.SoundState.close();
                data.handled = true;
                break;
            case 'stopallsound':
            case 'stopa':
                this.MusicState.close();
                this.SoundState.close();
                data.handled = true;
                break;

        }
    }
}