import { Dialog, DialogButtons, AlertDialog, ConfirmDialog, DialogIcon } from "../dialog";
import { capitalize, clone, openFileDialog, readFile } from '../library';
import { Settings, SettingList } from "../settings";
import { RGBColor } from '../lib/rgbcolor';
import { removeHash } from "./interface";

declare let fileSaveAs;

export class SettingsDialog extends Dialog {
    private _menu;
    private _page;
    public settings: Settings;
    constructor() {
        super(({ title: '<i class="fas fa-cogs"></i> Settings', keepCentered: true, resizable: false, moveable: false, center: true, maximizable: false }));
        this.body.style.padding = '10px';
        this.buildMenu();
        let footer = '';
        footer += `<button id="${this.id}-cancel" type="button" class="float-end btn btn-light" title="Cancel dialog">Cancel</button>`;
        footer += `<button id="${this.id}-save" type="button" class="float-end btn btn-primary" title="Confirm dialog">Save</button>`;
        footer += `<button id="${this.id}-reset" type="button" class="float-start btn btn-light" title="Reset settings">Reset</button>`
        footer += `<button id="${this.id}-reset-all" type="button" class="float-start btn btn-light" title="Reset All settings">Reset All</button>`
        footer += '<div class="vr float-start" style="margin-right: 4px;height: 37px;"></div>';
        footer += `<button id="${this.id}-export" type="button" class="float-start btn btn-light" title="Export settings">Export</button>`;
        footer += `<button id="${this.id}-import" type="button" class="float-start btn btn-light" title="Import settings">Import</button>`;
        this.footer.innerHTML = footer;
        this.footer.querySelector(`#${this.id}-cancel`).addEventListener('click', () => {
            removeHash(this._page);
            this.close();
        });
        this.footer.querySelector(`#${this.id}-export`).addEventListener('click', () => {
            var data = clone(this.settings);
            data.version = 2;
            fileSaveAs.show(JSON.stringify(data), 'oiMUD.settings.txt', 'text/plain');
        });
        this.footer.querySelector(`#${this.id}-import`).addEventListener('click', () => {
            openFileDialog('Import settings').then(files => {
                readFile(files[0]).then((contents: any) => {
                    try {
                        var data = JSON.parse(contents);
                        var s, sl;
                        if (data.version === 1) {
                            for (s = 0, sl = SettingList.length; s < sl; s++) {
                                this.settings[SettingList[s][0]] = data[SettingList[s][0]];
                            }
                            //TODO not supported, should be sent to mapper to import
                            this.emit('import-rooms', data.rooms);
                        }
                        else if (data.version === 2 && !data.profiles) {
                            for (s = 0, sl = SettingList.length; s < sl; s++) {
                                this.settings[SettingList[s][0]] = data[SettingList[s][0]];
                            }
                        }
                        else
                            setTimeout(function () {
                                new AlertDialog('Invalid file', 'Unable to import file, not a valid settings file', DialogIcon.exclamation).showModal();
                            }, 50);
                        this.loadSettings();
                    }
                    catch (err) {
                        setTimeout(function () {
                            new AlertDialog('Error importing', 'Error importing file.', DialogIcon.error).showModal();
                        }, 50);
                        client.error(err);
                    }
                }).catch(client.error);
            }).catch(() => { });
        });

        this.footer.querySelector(`#${this.id}-reset`).addEventListener('click', () => {
            if (this._page === 'settings-colors') {
                const confirm = new ConfirmDialog('Reset colors', 'Reset colors?');
                confirm.on('button-click', e => {
                    if (e.button === DialogButtons.Yes) {
                        var c;
                        var colors = this.settings.colors = [];
                        for (c = 0; c < 16; c++)
                            this.setColor('color' + c, colors[c] || this.getDefaultColor(c));
                        for (c = 256; c < 280; c++)
                            this.setColor('color' + c, colors[c] || this.getDefaultColor(c));
                        this.body.querySelector(`#colorScheme`).value = 0;
                    }
                })
                confirm.showModal();
            }
            else if (this._page && this._page !== 'settings' && this._page.length) {
                const pages = this._page.split('-');
                let title = capitalize(pages[pages.length - 1].match(/([A-Z]|^[a-z])[a-z]+/g).join(' '));
                const confirm = new ConfirmDialog(`Reset ${title} settings`, `Reset ${title} settings?`);
                confirm.on('button-click', e => {
                    if (e.button === DialogButtons.Yes) {
                        const forms: HTMLInputElement[] = this.body.querySelectorAll('input,select,textarea');
                        for (let f = 0, fl = forms.length; f < fl; f++) {
                            this.settings[forms[f].id] = Settings.defaultValue(forms[f].id);
                            if (forms[f].type === 'checkbox')
                                forms[f].checked = this.settings[forms[f].id];
                            else
                                forms[f].value = this.settings[forms[f].id];
                        }
                    }
                })
                confirm.showModal();
            }
            else {
                const confirm = new ConfirmDialog('Reset all settings', 'Reset all settings?');
                confirm.on('button-click', e => {
                    if (e.button === DialogButtons.Yes)
                        this.settings.reset();
                })
                confirm.showModal();
            }
        })

        this.footer.querySelector(`#${this.id}-reset-all`).addEventListener('click', () => {
            const confirm = new ConfirmDialog('Reset all settings', 'Reset all settings?');
            confirm.on('button-click', e => {
                if (e.button === DialogButtons.Yes)
                    this.settings.reset();
            })
            confirm.showModal();
        })
        this.footer.querySelector(`#${this.id}-save`).addEventListener('click', () => {
            removeHash(this._page);
            for (var s in this.settings) {
                if (!this.settings.hasOwnProperty(s)) continue
                Settings.setValue(s, this.settings[s]);
            }
            client.clearCache();
            client.loadOptions();
            this.close();
        })
        this.settings = new Settings();
    }

    public setPage(page: string) {
        this._page = page;
        const pages = page.split('-');
        let breadcrumb = '';
        let last = pages.length - 1;
        for (let p = 0, pl = pages.length; p < pl; p++) {
            let title = capitalize(pages[p].match(/([A-Z]|^[a-z])[a-z]+/g).join(' '));
            if (p === last)
                breadcrumb += '<li class="breadcrumb-item">' + title + '</li>';
            else
                breadcrumb += '<li class="breadcrumb-item" aria-current="page"><a href="#' + pages.slice(0, p + 1).join('-') + '">' + title + '</a></li>';
        }
        this.title = '<i class="float-start fas fa-cogs" style="padding: 2px;margin-right: 2px;"></i> <ol class="float-start breadcrumb">' + breadcrumb + '</ol>';
        if (page === 'settings') {
            if (this._menu)
                this._menu.style.display = 'none';
            this.body.style.left = '';
            if (this.footer.querySelector(`#${this.id}-reset`))
                this.footer.querySelector(`#${this.id}-reset`).style.display = 'none';
            this.body.innerHTML = SettingsDialog.menuTemplate;
            SettingsDialog.addPlugins(this.body.querySelector('div.contents'));
        }
        else {
            if (this._menu)
                this._menu.style.display = '';
            if (this.footer.querySelector(`#${this.id}-reset`))
                this.footer.querySelector(`#${this.id}-reset`).style.display = '';
            this.body.style.left = '200px';
        }
        this.loadSettings();
    }

    private buildMenu() {
        this.dialog.insertAdjacentHTML("beforeend", SettingsDialog.menuTemplate.replace(' style="top:0;position: absolute;left:0;bottom:49px;right:0;"', ''));
        this._menu = this.dialog.querySelector('.contents');
        this._menu.classList.add('settings-menu');
        SettingsDialog.addPlugins(this._menu);
        if (this._page === 'settings')
            this._menu.style.display = 'none';
        this.body.style.left = '200px';
    }

    private loadSettings() {
        const forms: HTMLInputElement[] = this.body.querySelectorAll('input,select,textarea');
        if (this._page === 'settings-colors') {
            var c;
            var colors = this.settings.colors || [];
            for (c = 0; c < 16; c++)
                this.setColor('color' + c, colors[c] || this.getDefaultColor(c));
            for (c = 256; c < 280; c++)
                this.setColor('color' + c, colors[c] || this.getDefaultColor(c));
            for (let f = 0, fl = forms.length; f < fl; f++) {
                forms[f].addEventListener('change', e => {
                    const target = (e.currentTarget || e.target) as HTMLInputElement;
                    let value = target.value;
                    let id = parseInt(target.id.substring(5), 10);
                    var colors = this.settings.colors || [];
                    if (!colors[id] || colors[id].length === 0) {
                        if (this.getDefaultColor(id) !== value)
                            colors[id] = value;
                    }
                    else if (this.getDefaultColor(id) !== value)
                        delete colors[id];
                    else
                        colors[id] = value;
                    this.settings.colors = colors;
                });
                forms[f].addEventListener('input', e => {
                    const target = (e.currentTarget || e.target) as HTMLInputElement;
                    let value = target.value;
                    let id = parseInt(target.id.substring(5), 10);
                    if (!this.settings.colors[id] || this.settings.colors[id].length === 0) {
                        if (this.getDefaultColor(id) !== value)
                            this.settings.colors[id] = value;
                    }
                    else if (this.getDefaultColor(id) !== value)
                        delete this.settings.colors[id];
                    else
                        this.settings.colors[id] = value;

                })
            }
        }
        else {
            for (let f = 0, fl = forms.length; f < fl; f++) {
                if (forms[f].type === 'radio') {
                    forms[f].checked = '' + this.settings[forms[f].name] === forms[f].value;
                    forms[f].addEventListener('change', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        if (target.checked)
                            this.settings[target.name] = this.convertType(target.value, typeof this.settings[target.name]);
                    });
                }
                else if (forms[f].type === 'checkbox') {
                    if (forms[f].dataset.enum === 'true') {
                        const name = forms[f].name || forms[f].id.substring(0, forms[f].id.lastIndexOf('-'));
                        const value = +forms[f].id.substring(forms[f].id.lastIndexOf('-') + 1);
                        if ((this.settings[name] & value) === value)
                            forms[f].checked = true;
                    }
                    else
                        forms[f].checked = this.settings[forms[f].id];
                    forms[f].addEventListener('change', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        if (target.dataset.enum === 'true') {
                            const name = target.name || target.id.substring(0, target.id.lastIndexOf('-'));
                            const enums = this.body.querySelectorAll(`[name=${name}]`);
                            let value = 0;
                            for (let e = 0, el = enums.length; e < el; e++) {
                                if (enums[e].checked)
                                    value |= +enums[e].value;
                            }
                            this.settings[name] = value;
                        }
                        else
                            this.settings[target.id] = target.checked || false;
                    });
                }
                else {
                    forms[f].value = this.settings[forms[f].id];
                    forms[f].addEventListener('change', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        this.setValue(target.id, target.value);
                    });
                    forms[f].addEventListener('input', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        this.setValue(target.id, target.value);
                    });
                }
            }
        }
    }

    public setColor(id, color?) {
        if (!color || typeof color === 'undefined' || color.length === 0)
            this.body.querySelector('#' + id).value = '';
        else
            this.body.querySelector('#' + id).value = this.colorHex(color);
    }

    public colorHex(color) {
        if (!color) return false;
        color = new RGBColor(color);
        if (!color.ok)
            return '';
        return color.toHex();
    };

    public getDefaultColor(code) {
        if (code === 0) return 'rgb(0,0,0)'; //black fore
        if (code === 1) return 'rgb(128, 0, 0)';//red fore
        if (code === 2) return 'rgb(0, 128, 0)';//green fore
        if (code === 3) return 'rgb(128, 128, 0)';//yellow fore
        if (code === 4) return 'rgb(0, 0, 128)';//blue fore
        if (code === 5) return 'rgb(128, 0, 128)';//magenta fore
        if (code === 6) return 'rgb(0, 128, 128)';//cyan fore
        if (code === 7) return 'rgb(192, 192, 192)';//white fore
        if (code === 8) return 'rgb(128, 128, 128)';//black  bold
        if (code === 9) return 'rgb(255, 0, 0)'; //Red bold
        if (code === 10) return 'rgb(0, 255, 0)'; //green bold
        if (code === 11) return 'rgb(255, 255, 0)';//yellow bold
        if (code === 12) return 'rgb(0, 0, 255)';//blue bold
        if (code === 13) return 'rgb(255, 0, 255)';//magenta bold
        if (code === 14) return 'rgb(0, 255, 255)';//cyan bold
        if (code === 15) return 'rgb(255, 255, 255)';//white bold
        if (code === 256) return 'rgb(0, 0, 0)';//black faint
        if (code === 257) return 'rgb(118, 0, 0)';//red  faint
        if (code === 258) return 'rgb(0, 108, 0)';//green faint
        if (code === 259) return 'rgb(145, 136, 0)';//"rgb(108, 108, 0)";//yellow faint
        if (code === 260) return 'rgb(0, 0, 108)';//blue faint
        if (code === 261) return 'rgb(108, 0, 108)';//magenta faint
        if (code === 262) return 'rgb(0, 108, 108)';//cyan faint
        if (code === 263) return 'rgb(160, 160, 160)';//white faint
        if (code === 264) return 'rgb(0, 0, 0)'; //BackgroundBlack
        if (code === 265) return 'rgb(128, 0, 0)';//red back
        if (code === 266) return 'rgb(0, 128, 0)';//greenback
        if (code === 267) return 'rgb(128, 128, 0)';//yellow back
        if (code === 268) return 'rgb(0, 0, 128)';//blue back
        if (code === 269) return 'rgb(128, 0, 128)';//magenta back
        if (code === 270) return 'rgb(0, 128, 128)';//cyan back
        if (code === 271) return 'rgb(192, 192, 192)';//white back
        if (code === 272) return 'rgb(0,0,0)'; //iceMudInfoBackground
        if (code === 273) return 'rgb(0, 255, 255)';//iceMudInfoText
        if (code === 274) return 'rgb(0,0,0)'; //LocalEchoBackground
        if (code === 275) return 'rgb(255, 255, 0)';//LocalEchoText
        if (code === 276) return 'rgb(0, 0, 0)';//DefaultBack
        if (code === 277) return 'rgb(192, 192, 192)';//DefaultFore
        if (code === 278) return 'rgb(128, 0, 0)';//ErrorFore
        if (code === 279) return 'rgb(192, 192, 192)';//ErrorBack
        if (code === 280) return 'rgb(255,255,255)';//DefaultBrightFore	
        return '';
    }

    public setValue(option, value) {
        if (value == 'false') value = false;
        if (value == 'true') value = true;
        if (value == 'null') value = null;
        if (value == 'undefined') value = undefined;
        if (typeof value == 'string' && parseFloat(value).toString() == value)
            value = parseFloat(value);
        this.settings[option] = this.convertType(value, this.settings[option]);
    }

    public convertType(value, type) {
        if (typeof value === type)
            return value;
        switch (type) {
            case 'number':
                if (typeof value == 'string' && parseFloat(value).toString() == value)
                    return parseFloat(value);
                return Number(value);
            case 'boolean':
                return Boolean(value);
        }
        return value;
    }

    static addPlugins(menu) {
        let pl = client.plugins.length;
        let s;
        let sl;
        for (let p = 0; p < pl; p++) {
            if (!client.plugins[p].settings) continue;
            if (client.plugins[p].settings.length) {
                sl = client.plugins[p].settings.length;
                for (s = 0; s < sl; s++) {
                    let item = client.plugins[p].settings[s];
                    if (typeof item.action !== 'string') continue;
                    let code = `<a href="#${item.action}" class="list-group-item list-group-item-action">${item.icon || ''}${item.name || ''}</a>`;
                    if ('position' in item) {
                        if (typeof item.position === 'string') {
                            if (menu.querySelector(item.position)) {
                                menu.querySelector(item.position).insertAdjacentHTML('afterend', code);
                                continue;
                            }
                        }
                        else if (item.position >= 0 && item.position < menu.children.length) {
                            menu.children[item.position].insertAdjacentHTML('afterend', code);
                            continue;
                        }
                    }
                    menu.insertAdjacentHTML('beforeend', code);
                }
            }
        }
    }

    static get menuTemplate() {
        return `<div class="contents list-group list-group-flush" style="top:0;position: absolute;left:0;bottom:49px;right:0;">` +
            `<a href="#settings-general" class="list-group-item list-group-item-action"><i class="fas fa-cogs"></i> General</a>` +
            `<a href="#settings-display" class="list-group-item list-group-item-action"><i class="fas fa-display"></i> Display</a>` +
            `<a href="#settings-colors" class="list-group-item list-group-item-action"><i class="fas fa-palette"></i> Colors</a>` +
            `<a href="#settings-commandLine" class="list-group-item list-group-item-action"><i class="fas fa-terminal"></i> Command line</a>` +
            `<a href="#settings-tabCompletion" class="list-group-item list-group-item-action"><i class="fa-solid fa-arrow-right-to-bracket"></i> Tab completion</a>` +
            `<a href="#settings-telnet" class="list-group-item list-group-item-action"><i class="fas fa-network-wired"></i> Telnet</a>` +
            `<a href="#settings-scripting" class="list-group-item list-group-item-action"><i class="fas fa-code"></i> Scripting</a>` +
            `<a href="#settings-specialCharacters" class="list-group-item list-group-item-action"><i class="fa-regular fa-file-code"></i> Special characters</a>` +
            `<a href="#settings-advanced" class="list-group-item list-group-item-action"><i class="fa-solid fa-sliders"></i> Advanced</a>` +
            `</div>`;
    }
}