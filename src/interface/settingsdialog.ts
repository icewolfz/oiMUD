import { Dialog, DialogButtons, DialogIcon } from "./dialog";
import { capitalize, clone, openFileDialog, readFile } from '../library';
import { Settings, SettingList } from "../settings";
import { RGBColor } from '../lib/rgbcolor';
import { removeHash } from "./interface";
import { buildBreadcrumb } from './breadcrumb'

// @ts-ignore
import menuTemplate from '../html/settings.menu.htm'

declare let fileSaveAs;
declare let confirm_box;
declare let alert_box;
export class SettingsDialog extends Dialog {
    private _menu;
    private _page;
    public settings: Settings;
    constructor() {
        super(({ title: '<i class="fas fa-cogs"></i> Settings', keepCentered: true, resizable: false, moveable: false, center: true, maximizable: false }));
        this.body.style.padding = '10px';
        this._buildMenu();
        let footer = '';
        footer += `<button id="${this.id}-cancel" type="button" class="btn-sm float-end btn btn-light" title="Cancel dialog"><i class="bi bi-x-lg"></i><span class="icon-only"> Cancel</span></button>`;
        footer += `<button id="${this.id}-save" type="button" class="btn-sm float-end btn btn-primary" title="Confirm dialog"><i class="bi bi-save"></i><span class="icon-only"> Save</span></button>`;
        footer += `<button id="${this.id}-reset" type="button" class="btn-sm float-start btn btn-warning" title="Reset settings"><i class="bi bi-arrow-clockwise"></i><span class="icon-only"> Reset</span></button>`
        footer += `<button id="${this.id}-reset-all" type="button" class="btn-sm float-start btn btn-warning" title="Reset All settings"><i class="bi bi-arrow-repeat"></i><span class="icon-only"> Reset All</span></button>`
        footer += '<div class="vr float-start" style="margin-right: 4px;height: 29px;"></div>';
        footer += `<button id="${this.id}-export" type="button" class="btn-sm float-start btn btn-light" title="Export settings"><i class="bi bi-box-arrow-up"></i><span class="icon-only"> Export</span></button>`;
        footer += `<button id="${this.id}-import" type="button" class="btn-sm float-start btn btn-light" title="Import settings"><i class="bi bi-box-arrow-in-down"></i><span class="icon-only"> Import</span></button>`;
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
                                alert_box('Invalid file', 'Unable to import file, not a valid settings file', DialogIcon.exclamation);
                            }, 50);
                        this._loadPageSettings();
                    }
                    catch (err) {
                        setTimeout(function () {
                            alert_box('Error importing', 'Error importing file.', DialogIcon.error);
                        }, 50);
                        client.error(err);
                    }
                }).catch(client.error);
            }).catch(() => { });
        });

        this.footer.querySelector(`#${this.id}-reset`).addEventListener('click', () => {
            if (this._page === 'settings-colors') {
                confirm_box('Reset colors', 'Reset colors?').then(e => {
                    if (e.button === DialogButtons.Yes) {
                        var c;
                        var colors = this.settings.colors = [];
                        for (c = 0; c < 16; c++)
                            this.setColor('color' + c, colors[c] || this.getDefaultColor(c));
                        for (c = 256; c < 280; c++)
                            this.setColor('color' + c, colors[c] || this.getDefaultColor(c));
                        this.body.querySelector(`#colorScheme`).value = 0;
                    }
                });
            }
            else if (this._page && this._page !== 'settings' && this._page.length) {
                const pages = this._page.split('-');
                let title = capitalize(pages[pages.length - 1].match(/([A-Z]|^[a-z])[a-z]+/g).join(' '));
                confirm_box(`Reset ${title} settings`, `Reset ${title} settings?`).then(e => {
                    if (e.button === DialogButtons.Yes) {
                        const forms: HTMLInputElement[] = this.body.querySelectorAll('input,select,textarea');
                        for (let f = 0, fl = forms.length; f < fl; f++) {
                            let id = forms[f].name || forms[f].id;
                            this.settings[id] = Settings.defaultValue(id);
                            if (forms[f].type === 'checkbox' || forms[f].type === 'radio')
                                forms[f].checked = this.settings[id];
                            else
                                forms[f].value = this.settings[id];
                        }
                    }
                })
            }
            else {
                confirm_box('Reset all settings', 'Reset all settings?').then(e => {
                    if (e.button === DialogButtons.Yes)
                        this.settings.reset();
                });
            }
        })

        this.footer.querySelector(`#${this.id}-reset-all`).addEventListener('click', () => {
            confirm_box('Reset all settings', 'Reset all settings?').then(e => {
                if (e.button === DialogButtons.Yes)
                    this.settings.reset();
            });
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
        this.on('closed', () => {
            removeHash(this._page);
        });
        this.on('canceled', () => {
            removeHash(this._page);
        });
    }

    public setBody(contents: string, args?: any) {
        super.setBody(this.dialog.dataset.path === 'settings' ? menuTemplate : contents, args);
        this._page = this.dialog.dataset.path;
        const pages = this._page.split('-');
        this.title = buildBreadcrumb(pages);
        if (this._menu) {
            let items = this._menu.querySelectorAll('a.active');
            items.forEach(item => item.classList.remove('active'));
            items = this._menu.querySelector(`a[href="#${this._page}"]`);
            if (items)
                items.classList.add('active');
        }
        if (this._page === 'settings') {
            if (this._menu)
                this._menu.style.display = 'none';
            this.body.style.left = '';
            if (this.footer.querySelector(`#${this.id}-reset`))
                this.footer.querySelector(`#${this.id}-reset`).style.display = 'none';
            SettingsDialog.addPlugins(this.body.querySelector('div.contents'));
        }
        else {
            if (this._menu)
                this._menu.style.display = '';
            if (this.footer.querySelector(`#${this.id}-reset`))
                this.footer.querySelector(`#${this.id}-reset`).style.display = '';
            this.body.style.left = '200px';
        }
        this.body.scrollTop = 0;
        this._loadPageSettings();
    }

    private _buildMenu() {
        this.dialog.insertAdjacentHTML("beforeend", menuTemplate.replace(' style="top:0;position:absolute;left:0;bottom:49px;right:0"', ''));
        this._menu = this.dialog.querySelector('.contents');
        this._menu.classList.add('settings-menu');
        SettingsDialog.addPlugins(this._menu);
        if (this._page === 'settings')
            this._menu.style.display = 'none';
        this.body.style.left = '200px';
    }

    private _loadPageSettings() {
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
                        forms[f].checked = (this.settings[name] & value) === value;
                    }
                    else
                        forms[f].checked = this.settings[forms[f].name || forms[f].id];
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
                            this.settings[target.name || target.id] = target.checked || false;
                    });
                }
                else {
                    forms[f].value = this.settings[forms[f].id];
                    forms[f].addEventListener('change', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        this.setValue(target.name || target.id, target.value);
                    });
                    forms[f].addEventListener('input', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        this.setValue(target.name || target.id, target.value);
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
        this.settings[option] = this.convertType(value, typeof this.settings[option]);
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
            case 'string':
                return '' + value;
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
}