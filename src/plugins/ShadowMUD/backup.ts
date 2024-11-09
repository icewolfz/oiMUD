import { EventEmitter } from '../../events';
import { Client } from '../../client';
import { Mapper } from '../mapper';
import { Map } from '../../map';
import { Settings, SettingProperties } from '../../settings';
import { DialogIcon } from '../../interface/dialog';
import { ProfileCollection, Profile, Alias, Macro, Button, Trigger, Context } from '../../profile';
import { Log } from '../logger';

declare let LZString;
declare let alert_box;
declare let progress_box;

export enum BackupSelection {
    None = 0,
    Map = 2,
    Profiles = 4,
    Settings = 8,
    Windows = 16,
    Characters = 32,
    All = 30
}

export class Backup extends EventEmitter {
    private _port: number = 1034;
    private _abort: boolean = false;
    private _user;
    private _save;
    private _mapper: Mapper;
    public client: Client;

    private _dialogProgress;

    constructor(client: Client) {
        super();
        this.client = client;
        this.initialize();
    }

    public remove(): void {
        this.client.removeListenersFromCaller(this);
    }

    public initialize(): void {
        this.client.telnet.GMCPSupports.push('Client 1');

        this.client.on('connected', () => {
            this._port = this.client.port;
            this.closeDialog();
            this._save = 0;
            this._abort = false;
        }, this);

        this.client.on('closed', () => {
            this._port = this.client.port;
            this.closeDialog();
            this._save = 0;
            this._abort = false;
        }, this);

        this.client.on('received-GMCP', async (mod, obj) => {
            if (mod.toLowerCase() !== 'client' || !obj) return;
            this.getMapper();
            switch (obj.action) {
                case 'save':
                    if (this._abort) return;
                    this._user = obj.user;
                    this.showDialog('Saving data');
                    this._abort = false;
                    //if mapper make sure open map saved
                    if (this._mapper && this._mapper.map.changed) {
                        this._mapper.map.save().then(() => {
                            this.save(2);
                        });
                    }
                    else
                        this.save(2);
                    break;
                case 'load':
                    this.client.debug(`Starting load\n    Chunks: ${obj.chunks}\n    Start chunk: ${obj.chunk}\n    Size: ${obj.size}\n`);
                    this._abort = false;
                    this._user = obj.user;
                    this._save = [obj.chunks || 1, obj.chunk || 0, obj.size, ''];
                    this.showDialog('Loading data');
                    //if mapper make sure open map saved
                    if (this._mapper && this._mapper.map.changed) {
                        this._mapper.map.save().then(() => {
                            this.getChunk();
                        });
                    }
                    else
                        this.getChunk();
                    break;
                case 'error':
                    this.abort(obj.error);
                    break;
            }
        });
        this._port = this.client.port;
    }

    get URL(): string {
        if (this._port === 1039)
            return 'http://shadowmud.com:1132/client';
        return 'http://shadowmud.com:1130/client';
    }

    public save(version?: number) {
        Map.load().then((map: Map) => {
            const data = {
                version: 2,
                profiles: this.client.profiles.clone(2),
                settings: new Settings(),
                map: map ? map.Rooms : {}
            };
            let keys, k;

            const saveSelection = this.client.getOption('backupSave');

            if ((saveSelection & BackupSelection.Map) !== BackupSelection.Map) {
                delete data.map;
                this.client.debug('Backup save: setting for no mapper data enabled.');
            }
            if ((saveSelection & BackupSelection.Profiles) !== BackupSelection.Profiles) {
                delete data.profiles;
                this.client.debug('Backup save: setting for no profiles enabled.');
            }
            if ((saveSelection & BackupSelection.Windows) !== BackupSelection.Windows) {
                keys = Object.keys(data.settings);
                for (k = keys.length - 1; k >= 0; k--) {
                    if (keys[k].startsWith('windows.'))
                        delete data.settings[keys[k]];
                }
                this.client.debug('Backup save: setting for no window data enabled.');
            }
            if ((saveSelection & BackupSelection.Settings) !== BackupSelection.Settings) {
                let windows;
                if ((saveSelection & BackupSelection.Windows) === BackupSelection.Windows) {
                    windows = {};
                    keys = Object.keys(data.settings);
                    for (k = keys.length - 1; k >= 0; k--) {
                        if (keys[k].startsWith('windows.'))
                            windows[keys[k]] = data.settings[keys[k]];
                    }
                }
                delete data.settings;
                if ((saveSelection & BackupSelection.Windows) === BackupSelection.Windows)
                    data.settings = windows;
                this.client.debug('Backup save: setting for no settings data enabled.');
            }
            else {
                //convert flat setting format to object format
                let props = ['chat', 'mapper', 'profiles', 'codeEditor', 'buttons', 'find', 'display', 'extensions'];
                for (let p = 0, pl = props.length; p < pl; p++) {
                    let prop = {};
                    if (data.settings[props[p]])
                        prop = data.settings[props[p]];
                    let sProp = props[p] + '.';
                    keys = Object.keys(data.settings);
                    for (k = keys.length - 1; k >= 0; k--) {
                        if (keys[k].startsWith(sProp))
                            prop[keys[k].substring(sProp.length)] = data.settings[keys[k]];
                    }
                    data.settings[props[p]] = prop;
                }
            }

            let jData = JSON.stringify(data);
            jData = LZString.compressToEncodedURIComponent(jData);
            this._save = [jData.match(/((\S|\s|.){1,20000})/g), 0, 0];
            this._save[3] = this._save[0].length;
            this.saveChunk();
        }).catch(err => this.client.error(err));
    }

    public abort(err?) {
        if (err)
            this.client.debug('client load/save aborted for' + err);
        else
            this.client.debug('client load/save aborted');
        this.closeDialog();
        alert_box('Aborted', err || 'Aborted importing or exporting data.', DialogIcon.exclamation);
        this._save = 0;
        this._abort = true;
        $.ajax({
            type: 'POST',
            url: this.URL,
            data:
            {
                user: this._user,
                a: 'abort'
            }
        });
    }

    public close() {
        this.closeDialog();
        this._save = 0;
        this._abort = false;
        $.ajax({
            type: 'POST',
            url: this.URL,
            data:
            {
                user: this._user,
                a: 'done'
            }
        });
    }

    public getChunk() {
        this.client.debug('Requesting client chunk ' + this._save[1]);
        $.ajax(
            {
                type: 'POST',
                url: this.URL,
                data:
                {
                    user: this._user,
                    a: 'get',
                    c: ++this._save[1]
                },
                dataType: 'json',
                success: (data) => {
                    if (this._abort) return;
                    if (!data)
                        this.abort('No data returned');
                    else if (data.msg)
                        this.abort(data.msg || 'Error');
                    else if (data.error)
                        this.abort(data.error);
                    else {
                        this._save[1] = data.chunk || 0;
                        this._save[3] += data.data || '';
                        this.client.debug('Got client chunk ' + this._save[1]);
                        this.updateProgress((this._save[1] + 1) / this._save[0] * 100);
                        if (this._save[1] >= this._save[0] - 1)
                            this.finishLoad();
                        else
                            this.getChunk();
                    }
                },
                error: (data, error, errorThrown) => {
                    this.abort(error);
                }
            });
    }

    public saveChunk() {
        $.ajax(
            {
                type: 'POST',
                url: this.URL,
                data:
                {
                    user: this._user,
                    a: 'save',
                    data: this._save[0].shift(),
                    append: (this._save[1] > 0 ? 1 : 0)
                },
                dataType: 'json',
                success: (data) => {
                    if (!data)
                        this.abort('No data returned');
                    else if (data.msg !== 'Successfully saved')
                        this.abort(data.msg || 'Error');
                    else if (data.error)
                        this.abort(data.error);
                    else if (this._save[0].length > 0) {
                        this.updateProgress(this._save[1] / this._save[3] * 100);
                        this._save[1]++;
                        this.saveChunk();
                    }
                    else {
                        if (typeof (this._save[2]) === 'function') this._save[2]();
                        client.raise('backup-saved');
                        this.close();
                    }
                },
                error: (data, error, errorThrown) => {
                    this.abort(error);
                }
            });
    }

    public finishLoad() {
        this.client.debug('Got last chunk, processing data');
        let data = LZString.decompressFromEncodedURIComponent(this._save[3]);
        data = JSON.parse(data);
        if (data.version === 2) {
            const loadSelection = this.client.getOption('backupLoad');
            if (data.map && (loadSelection & BackupSelection.Map) === BackupSelection.Map)
                this._mapper.import(data.map, client.getOption('mapper.importType'))

            if (data.profiles && (loadSelection & BackupSelection.Profiles) === BackupSelection.Profiles) {
                const profiles = new ProfileCollection();
                const keys = Object.keys(data.profiles);
                const kl = keys.length;
                let n;
                let k = 0;
                for (; k < kl; k++) {
                    n = keys[k];
                    const p = new Profile(n);
                    p.priority = data.profiles[keys[k]].priority;
                    p.enabled = data.profiles[keys[k]].enabled ? true : false;
                    p.enableMacros = data.profiles[keys[k]].enableMacros ? true : false;
                    p.enableTriggers = data.profiles[keys[k]].enableTriggers ? true : false;
                    p.enableAliases = data.profiles[keys[k]].enableAliases ? true : false;
                    p.enableDefaultContext = data.profiles[keys[k]].enableDefaultContext ? true : false;
                    p.macros = [];
                    let l = data.profiles[keys[k]].macros.length;
                    let item;
                    if (l > 0) {
                        for (let m = 0; m < l; m++) {
                            item = new Macro();
                            item.key = data.profiles[keys[k]].macros[m].key;
                            item.value = data.profiles[keys[k]].macros[m].value;
                            item.style = data.profiles[keys[k]].macros[m].style;
                            item.append = data.profiles[keys[k]].macros[m].append ? true : false;
                            item.send = data.profiles[keys[k]].macros[m].send ? true : false;
                            item.name = data.profiles[keys[k]].macros[m].name;
                            item.group = data.profiles[keys[k]].macros[m].group;
                            item.enabled = data.profiles[keys[k]].macros[m].enabled ? true : false;
                            item.modifiers = data.profiles[keys[k]].macros[m].modifiers;
                            item.chain = data.profiles[keys[k]].macros[m].chain ? true : false;
                            item.notes = data.profiles[keys[k]].macros[m].notes || '';
                            p.macros.push(item);
                        }
                    }

                    l = data.profiles[keys[k]].aliases.length;
                    if (l > 0) {
                        for (let m = 0; m < l; m++) {
                            item = new Alias();
                            item.pattern = data.profiles[keys[k]].aliases[m].pattern;
                            item.value = data.profiles[keys[k]].aliases[m].value;
                            item.style = data.profiles[keys[k]].aliases[m].style;
                            item.multi = data.profiles[keys[k]].aliases[m].multi ? true : false;
                            item.append = data.profiles[keys[k]].aliases[m].append ? true : false;
                            item.name = data.profiles[keys[k]].aliases[m].name;
                            item.group = data.profiles[keys[k]].aliases[m].group;
                            item.enabled = data.profiles[keys[k]].aliases[m].enabled ? true : false;
                            item.params = data.profiles[keys[k]].aliases[m].params;
                            item.priority = data.profiles[keys[k]].aliases[m].priority;
                            item.notes = data.profiles[keys[k]].aliases[m].notes || '';
                            p.aliases.push(item);
                        }
                    }

                    l = data.profiles[keys[k]].triggers.length;
                    if (l > 0) {
                        for (let m = 0; m < l; m++) {
                            item = new Trigger();
                            item.pattern = data.profiles[keys[k]].triggers[m].pattern;
                            item.value = data.profiles[keys[k]].triggers[m].value;
                            item.style = data.profiles[keys[k]].triggers[m].style;
                            item.verbatim = data.profiles[keys[k]].triggers[m].verbatim ? true : false;
                            item.name = data.profiles[keys[k]].triggers[m].name;
                            item.group = data.profiles[keys[k]].triggers[m].group;
                            item.enabled = data.profiles[keys[k]].triggers[m].enabled ? true : false;
                            item.priority = data.profiles[keys[k]].triggers[m].priority;
                            item.triggerNewline = data.profiles[keys[k]].triggers[m].triggernewline ? true : false;
                            item.caseSensitive = data.profiles[keys[k]].triggers[m].caseSensitive ? true : false;
                            item.triggerPrompt = data.profiles[keys[k]].triggers[m].triggerprompt ? true : false;
                            item.raw = data.profiles[keys[k]].triggers[m].raw ? true : false;
                            item.temp = data.profiles[keys[k]].triggers[m].temp ? true : false;
                            item.type = data.profiles[keys[k]].triggers[m].type;
                            item.notes = data.profiles[keys[k]].triggers[m].notes || '';
                            item.state = data.profiles[keys[k]].triggers[m].state || 0;
                            item.params = data.profiles[keys[k]].triggers[m].params || '';
                            item.fired = data.profiles[keys[k]].triggers[m].fired ? true : false;
                            if (data.profiles[keys[k]].triggers[m].triggers && data.profiles[keys[k]].triggers[m].triggers.length) {
                                const il = data.profiles[keys[k]].triggers[m].triggers.length;
                                for (let i = 0; i < il; i++) {
                                    item.triggers.push(new Trigger(data.profiles[keys[k]].triggers[m].triggers[i]));
                                }
                            }
                            p.triggers.push(item);
                        }
                    }

                    if (data.profiles[keys[k]].buttons) {
                        l = data.profiles[keys[k]].buttons.length;
                        if (l > 0) {
                            for (let m = 0; m < l; m++) {
                                item = new Button(data.profiles[keys[k]].buttons[m]);
                                p.buttons.push(item);
                            }
                        }
                    }

                    if (data.profiles[keys[k]].contexts) {
                        l = data.profiles[keys[k]].contexts.length;
                        if (l > 0) {
                            for (let m = 0; m < l; m++) {
                                item = new Context(data.profiles[keys[k]].contexts[m]);
                                p.contexts.push(item);
                            }
                        }
                    }
                    profiles.add(p, true);
                }
                profiles.update();
                profiles.save().then(() => {
                    this.client.loadProfiles();
                });
            }
            let keys, k;
            if ((loadSelection & BackupSelection.Settings) === BackupSelection.Settings) {
                this.client.setOption('mapper.enabled', data.settings.mapEnabled ? true : false);
                this.client.setOption('mapper.follow', data.settings.mapFollow ? true : false);
                this.client.setOption('mapper.legend', data.settings.legend ? true : false);
                this.client.setOption('mapper.split', data.settings.MapperSplitArea ? true : false);
                this.client.setOption('mapper.fill', data.settings.MapperFillWalls ? true : false);
                this.client.setOption('mapper.vscroll', data.settings.vscroll);
                this.client.setOption('mapper.hscroll', data.settings.hscroll);
                this.client.setOption('mapper.memory', data.settings.mapperMemory ? true : false);
                this.client.setOption('showScriptErrors', data.settings.showScriptErrors ? true : false);
                this.client.setOption('logWhat', data.settings ? Log.Html : Log.None);
                this.client.setOption('showMapper', data.settings.MapperOpen ? true : false);
                let p, pl;
                for (p = 0, pl = SettingProperties.length; p < pl; p++) {
                    let prop = SettingProperties[p];
                    if (!data.settings.hasOwnProperty(prop)) {
                        continue;
                    }
                    if (prop.startsWith('profiles.') || prop.startsWith('codeEditor.') || prop.startsWith('buttons.') || prop.startsWith('find.') || prop.startsWith('extensions.') || prop.startsWith('windows.'))
                        continue;
                    this.client.setOption(prop, data.settings[prop]);
                }
                if (data.settings.windows && (loadSelection & BackupSelection.Windows) === BackupSelection.Windows) {
                    if (data.settings['windows']) {
                        keys = Object.keys(data.settings['windows']);
                        for (k = keys.length - 1; k >= 0; k--) {
                            this.client.setOption(`windows.${keys[k]}`, data.settings['windows'][keys[k]]);
                        }
                    }
                    keys = Object.keys(data.settings);
                    for (k = keys.length - 1; k >= 0; k--) {
                        if (keys[k].startsWith('windows.'))
                            this.client.setOption(keys[k], data.settings[keys[k]]);
                    }
                }
                //convert object format to flat format
                let props = ['chat', 'mapper', 'profiles', 'codeEditor', 'buttons', 'find', 'display', 'extensions'];
                for (p = 0, pl = props.length; p < pl; p++) {
                    if (!data.settings[props[p]] || !data.settings.hasOwnProperty(props[p]))
                        continue;
                    keys = Object.keys(data.settings[props[p]]);
                    for (k = keys.length - 1; k >= 0; k--) {
                        this.client.setOption(`${props[p]}.${keys[k]}`, data.settings[props[p]][keys[k]]);
                    }
                }
                this.client.clearCache();
                this.client.loadOptions();
            }
            else if (data.settings && (loadSelection & BackupSelection.Windows) === BackupSelection.Windows) {
                if (data.settings['windows']) {
                    keys = Object.keys(data.settings['windows']);
                    for (k = keys.length - 1; k >= 0; k--) {
                        this.client.setOption(`windows.${keys[k]}`, data.settings['windows'][keys[k]]);
                    }
                }
                keys = Object.keys(data.settings);
                for (k = keys.length - 1; k >= 0; k--) {
                    if (keys[k].startsWith('windows.'))
                        this.client.setOption(keys[k], data.settings[keys[k]]);
                }
            }
        }
        client.raise('backup-loaded');
        this.close();
    }

    private showDialog(title) {
        if (this._dialogProgress)
            throw new Error('Client save/load is already in progress');
        this._dialogProgress = progress_box(title || 'Saving data');
        this._dialogProgress.on('canceled', () => {
            this.abort();
        });
        this._dialogProgress.on('closed', reason => {
            if (reason === 'canceled')
                this.abort();
        });
        this._dialogProgress.on('shown', () => {

        });
        this._dialogProgress.showModal();
    }

    private closeDialog() {
        if (this._dialogProgress)
            this._dialogProgress.close();
        this._dialogProgress = null;
    }

    private updateProgress(progress) {
        if (this._dialogProgress)
            this._dialogProgress.progress = progress;
    }

    private getMapper() {
        if (this._mapper) return;
        for (let p = 0, pl = this.client.plugins.length; p < pl; p++) {
            if (this.client.plugins[p] instanceof Mapper) {
                this._mapper = this.client.plugins[p] as Mapper;
                break;
            }
        }
    }



}