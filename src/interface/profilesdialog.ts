import '../css/nav.css';
import '../css/profiles.css';
import { Dialog, DialogButtons, DialogIcon } from './dialog';
import { Splitter, Orientation, PanelAnchor } from './splitter';
import { capitalize, openFileDialog, readFile, keyCodeToChar, keyCharToCode, scrollChildIntoView, debounce, FilterArrayByKeyValue, htmlEncode } from '../core/library';
import { removeHash, updateHash } from './interface';
import { ProfileCollection, MacroDisplay, Profile, Alias, Trigger, Button, Macro, Context } from '../core/profile';
import { buildBreadcrumb } from './breadcrumb';
import { ProfileSearch } from './profilesdialog.search';

declare let confirm_box;
declare let fileSaveAs;
declare let alert_box;

enum ClipAction {
    cut, copy
}

export class ProfilesDialog extends Dialog {
    private _client;
    private _menu;
    private _contents;
    private _splitter;
    private _page;
    private _contentPage;
    public profiles: ProfileCollection;
    private _profilesChanged = false;
    private _outsideChange = false;
    private _errorField;
    private _current = {
        profile: null,
        profileName: '',
        item: null,
        parent: null,
        itemIdx: -1,
        collection: '',
        itemSubIdx: -1
    }
    private _canClose: boolean = false;
    private _small: boolean = false;
    private _clip;
    private _clipId;
    private _search;

    public set errorField(value) {
        this._errorField = value;
    }
    public get errorField() { return this._errorField; }

    public get current() { return this._current; }

    public set changed(value) {
        if (value === this._profilesChanged) return;
        this._profilesChanged = value;
        this.footer.querySelector(`#${this.id}-save`).disabled = !value;
        this.footer.querySelector(`#${this.id}-apply`).disabled = !value;

    }
    public get changed() { return this._profilesChanged }

    public get contents() { return this._contents; }

    constructor() {
        super(Object.assign({}, client.getWindowState('profiles') || { center: true }, { id: 'profiles', title: '<i class="fas fa-users"></i> Profiles', minWidth: 550, minHeight: 350 }));
        this._client = client;
        this.on('resized', e => {
            this._updateSmall(e.width);
            this._client.setOption('windows.profiles', e);
        });
        this.on('closed', () => {
            if (this.persistent) return;
            this.emit('content-changing');
            this._client.removeListenersFromCaller(this);
        });
        this.on('canceled', () => {
            if (this.persistent) return;
            this.emit('content-changing');
            this._client.removeListenersFromCaller(this);
        });
        this._client.on('profiles-loaded', () => {
            if (!this.profiles) {
                this.profiles = this._client.profiles.clone();
                this.profiles.SortByPriority();
                this._buildMenu();
            }
        }, this);
        this._client.on('profiles-updated', () => {

        }, this);
        this._client.on('options-loaded', () => {
            this.resetState(this._client.getWindowState('profiles') || { center: true });
        }, this)
        this._client.on('initialized', () => {
            if (!this.profiles) {
                this.profiles = this._client.profiles.clone();
                this.profiles.SortByPriority();
                this._buildMenu();
            }
        }, this);
        this._client.on('item-added', (type, profileName, index, item) => {
            if (!this._client.getOption('profiles.updateOnChange'))
                this._outsideChange = true;
            else if (this.profiles.contains(profileName))
                this._addItem(type + (type === 'alias' ? 'es' : 's'), item, this.profiles.items[profileName]);

        }, this);
        this._client.on('item-removed', (type, profileName, index, item) => {
            if (!this._client.getOption('profiles.updateOnChange'))
                this._outsideChange = true;
            else if (this.profiles.contains(profileName)) {
                let collection = type + (type === 'alias' ? 'es' : 's');
                let profile = this.profiles.items[profileName];
                if (index < 0 || index >= profile[collection].length || !profile[collection][index].equals(item)) return;
                const id = `${this._sanitizeID(profileName)}-${collection}`;
                const items = profile[collection];
                items.splice(index, 1);
                this._menu.querySelector(`#${id}-${index}`).remove();
                if (this._current.itemIdx === -1)
                    this.setBody(this._page);
                if (items.length === 0) {
                    this._menu.querySelector(`#${id} i`).remove();
                    this._menu.querySelector(`#${id} a`).insertAdjacentHTML('afterbegin', '<i class="align-middle float-start no-icon"></i>');
                    if (this._menu.querySelector(`#${id} a`).dataset.lazy !== 'true')
                        this._menu.querySelector(`#${id} .dropdown-menu`).innerHTML = '';
                }
                else {
                    const menuItems = this._menu.querySelector(`#${id} ul`);
                    let i = menuItems.children.length;
                    const href = `#profiles/${encodeURIComponent(profileName)}/${collection}/`;
                    for (; index < i; index++) {
                        const item = menuItems.children[index];
                        item.id = `${id}-${index}`;
                        item.firstChild.href = `${href}${index}`;
                        item.firstChild.children[1].id = `enabled-${id}-${index}`;
                    }
                }
                this.changed = true;
                if (id === this._clipId)
                    this._resetClip(true);
            }
        }, this);
        this._client.on('item-updated', (type, profileName, index, item) => {
            if (!this._client.getOption('profiles.updateOnChange'))
                this._outsideChange = true;
            else if (this.profiles.contains(profileName)) {
                let collection = type + (type === 'alias' ? 'es' : 's');
                let profile = this.profiles.items[profileName];
                if (index < 0 || index >= profile[collection].length) return;
                profile[collection][index] = item;
                if (this._menu.querySelector(`#enabled-${this._sanitizeID(this._current.profileName)}-${this._current.collection}-${index}`))
                    this._menu.querySelector(`#enabled-${this._sanitizeID(this._current.profileName)}-${this._current.collection}-${index}`).checked = item.enabled;
                if (this._current.profileName === profileName && collection === this._current.collection && this._current.itemIdx === index)
                    this.loadPage(this._page);
            }
        }, this);
        this.body.style.padding = '10px';
        this._splitter = new Splitter({ id: 'profile', parent: this.body, orientation: Orientation.vertical, anchor: PanelAnchor.panel1 });
        if (this._client.getOption('profiles.split') >= 200)
            this._splitter.SplitterDistance = this._client.getOption('profiles.split');
        this._splitter.on('splitter-moved', distance => {
            this._client.setOption('profiles.split', distance);
        });
        this._menu = this._splitter.panel1;
        this._menu.style.overflow = 'hidden';
        this._menu.style.overflowY = 'auto';
        this._contents = this._splitter.panel2;
        this._contents.style.overflow = 'auto';
        this._contents.style.padding = '10px';
        if (this._client.profiles) {
            this.profiles = this._client.profiles.clone();
            this.profiles.SortByPriority();
            this._buildMenu();
        }
        let footer = '';
        footer += `<button id="${this.id}-back" type="button" class="btn-sm float-start btn btn-light" title="Go back"><i class="bi bi-arrow-left"></i><span class="icon-only"> Back</span></button>`;
        footer += `<button id="btn-profile-menu" class="btn-sm float-start btn btn-outline-secondary" type="button" aria-controls="profile-menu" title="Show menu" data-bs-toggle="dropdown" aria-expanded="false" style="margin-right: 4px;"><i class="fa-solid fa-bars"></i></button>`;
        footer += `<ul id="${this.id}-dropdown-menu" class="dropdown-menu" style="overflow: auto;">`;
        footer += `<li id="${this.id}-add-profile"><a class="dropdown-item">Add profile</a></li>`;
        footer += `<li id="${this.id}-add-empty-profile"><a class="dropdown-item">Add empty profile</a></li>`;
        footer += `<li id="${this.id}-add-sep"><hr class="dropdown-divider"></li>`;
        footer += `<li id="${this.id}-add-alias"><a class="dropdown-item">Add alias</a></li>`;
        footer += `<li id="${this.id}-add-macro"><a class="dropdown-item">Add macro</a></li>`;
        footer += `<li id="${this.id}-add-trigger"><a class="dropdown-item">Add trigger</a></li>`;
        footer += `<li id="${this.id}-add-button"><a class="dropdown-item">Add button</a></li>`;
        footer += `<li id="${this.id}-add-sep2"><hr class="dropdown-divider"></li>`;
        footer += `<li id="${this.id}-add-default-buttons"><a class="dropdown-item">Add default buttons</a></li>`;
        footer += `<li id="${this.id}-add-default-macros"><a class="dropdown-item">Add default macros</a></li>`;
        footer += '<li><hr class="dropdown-divider"></li>';
        footer += `<li id="${this.id}-export-current"><a class="dropdown-item">Export current profile</a></li>`;
        footer += `<li id="${this.id}-export"><a class="dropdown-item">Export profiles</a></li>`;
        footer += `<li id="${this.id}-import"><a class="dropdown-item">Import profiles</a></li>`;
        footer += '<li><hr class="dropdown-divider"></li>';
        footer += `<li id="${this.id}-refresh"><a class="dropdown-item">Refresh</a></li>`;
        footer += `<li id="${this.id}-reload"><a class="dropdown-item">Reload</a></li>`;
        footer += '</ul>';
        footer += `<button id="btn-profile-edit-menu" class="btn-sm float-start btn btn-outline-secondary" type="button" aria-controls="edit-menu" title="Show edit menu" data-bs-toggle="dropdown" aria-expanded="false" style="margin-right: 4px;"><i class="bi bi-pencil-square"></i></button>`;
        footer += `<ul id="${this.id}-edit-menu" class="dropdown-menu" style="overflow: auto;">`;
        footer += `<li id="${this.id}-find"><a class="dropdown-item">Find <span class="float-end" style="padding-left: 40px;">(Ctrl or Cmd)+F</span></a></li>`;
        footer += `<li id="${this.id}-find-div"><hr class="dropdown-divider"></li>`;
        footer += `<li id="${this.id}-cut"><a class="dropdown-item">Cut <span class="float-end" style="padding-left: 40px;">(Ctrl or Cmd)+X</span></a></li>`;
        footer += `<li id="${this.id}-copy"><a class="dropdown-item">Copy <span class="float-end" style="padding-left: 40px;">(Ctrl or Cmd)+C</span></a></li>`;
        footer += `<li id="${this.id}-paste"><a class="dropdown-item">Paste <span class="float-end" style="padding-left: 40px;">(Ctrl or Cmd)+V</span></a></li>`;
        footer += '</ul>';
        footer += '<span id="profile-page-buttons"></span>';
        footer += `<button id="${this.id}-cancel" type="button" class="btn-sm float-end btn btn-light" title="Close dialog"><i class="bi bi-x-lg"></i><span class="icon-only"> Cancel</span></button>`;
        footer += `<button id="${this.id}-save" type="button" class="btn-sm float-end btn btn-primary" title="Save changes" disabled><i class="bi bi-save"></i><span class="icon-only"> Save</span></button>`;
        footer += `<button id="${this.id}-apply" type="button" class="btn-sm float-end btn btn-secondary" title="Apply changes" disabled><i class="bi bi-check-lg"></i><span class="icon-only"> Apply</span></button>`;
        this.footer.id = 'profiles-footer';
        this.footer.innerHTML = footer;
        this.footer.classList.add('dropup');

        document.getElementById('btn-profile-menu').addEventListener('shown.bs.dropdown', () => {
            setTimeout(() => {
                let el = this.footer.querySelector('#' + this.id + '-dropdown-menu');
                let rect = el.getBoundingClientRect();
                if (rect.y < 10)
                    el.style.height = (rect.height + rect.y - 10) + 'px';
                if (rect.bottom > document.body.clientHeight - 10)
                    el.style.height = (document.body.clientHeight - rect.y - 10) + 'px';
            }, 0);
        })

        document.getElementById('btn-profile-menu').addEventListener('hidden.bs.dropdown', () => {
            let el = this.footer.querySelector('#' + this.id + '-dropdown-menu');
            el.style.height = '';
        });
        this.footer.querySelector(`#${this.id}-cancel`).addEventListener('click', () => {
            removeHash(this._page);
            this.close();
        });
        this.footer.querySelector(`#${this.id}-back`).addEventListener('click', () => {
            this._goBack();
        });
        this.footer.querySelector(`#${this.id}-cut`).addEventListener('click', () => {
            this._cutItem();
        });
        this.footer.querySelector(`#${this.id}-copy`).addEventListener('click', () => {
            this._copyItem();
        });
        this.footer.querySelector(`#${this.id}-paste`).addEventListener('click', () => {
            this._paste();
        });
        this.footer.querySelector(`#${this.id}-find`).addEventListener('click', () => {
            this._search.show();
        });
        this.on('closed', () => {
            this._client.setOption('windows.profiles', this.windowState);
            removeHash(this._page);
        });
        this.on('canceled', () => {
            this._client.setOption('windows.profiles', this.windowState);
            removeHash(this._page);
        });
        this.on('moved', e => {
            this._updateSmall(this.dialog.offsetWidth || this.dialog.clientWidth);
            this._client.setOption('windows.profiles', e);
        })
        this.on('maximized', () => {
            this._client.setOption('windows.profiles', this.windowState);
        });
        this.on('restored', () => {
            this._updateSmall(this.dialog.offsetWidth || this.dialog.clientWidth);
            this._client.setOption('windows.profiles', this.windowState);
        });
        this.on('shown', () => {
            this._updateSmall(this.dialog.offsetWidth || this.dialog.clientWidth);
            this._client.setOption('windows.profiles', this.windowState);
        });
        this.footer.querySelector(`#${this.id}-add-profile a`).addEventListener('click', () => {
            this._createProfile(true);
        });

        this.footer.querySelector(`#${this.id}-add-empty-profile a`).addEventListener('click', () => {
            this._createProfile(false);
        });
        this.footer.querySelector(`#${this.id}-add-alias a`).addEventListener('click', () => {
            this._addItem('aliases');
        });
        this.footer.querySelector(`#${this.id}-add-macro a`).addEventListener('click', () => {
            this._addItem('macros');
        });
        this.footer.querySelector(`#${this.id}-add-trigger a`).addEventListener('click', () => {
            this._addItem('triggers');
        });
        this.footer.querySelector(`#${this.id}-add-button a`).addEventListener('click', () => {
            this._addItem('buttons');
        });
        this.footer.querySelector(`#${this.id}-add-default-buttons a`).addEventListener('click', () => {
            const items = Profile.DefaultButtons;
            let il = items.length;
            for (let i = 0; i < il; i++)
                this._addItem('buttons', items[i]);

        });
        this.footer.querySelector(`#${this.id}-add-default-macros a`).addEventListener('click', () => {
            const items = Profile.DefaultMacros;
            let il = items.length;
            for (let i = 0; i < il; i++)
                this._addItem('macros', items[i]);
        });
        this.footer.querySelector(`#${this.id}-export-current a`).addEventListener('click', () => {
            const data = {
                version: 2, profiles: {}
            };
            data.profiles[this._current.profileName] = this._current.profile.clone(2);
            fileSaveAs.show(JSON.stringify(data), `oiMUD.${this._current.profileName}.txt`, 'text/plain');
        });
        this.footer.querySelector(`#${this.id}-export a`).addEventListener('click', () => {
            const data = {
                version: 2, profiles: this.profiles.clone(2)
            };
            fileSaveAs.show(JSON.stringify(data), 'oiMUD.profiles.txt', 'text/plain');
        });
        this.footer.querySelector(`#${this.id}-import a`).addEventListener('click', () => {
            openFileDialog('Import profile(s)').then(files => {
                readFile(files[0]).then((contents: any) => {
                    try {
                        let data = JSON.parse(contents);
                        if (data.version == 2) {
                            if (data.profiles) {
                                let keys = Object.keys(data.profiles);
                                let k = 0, kl = keys.length;
                                for (; k < kl; k++) {
                                    //set the new name
                                    data.profiles[keys[k]].name = this._profileCopyName(keys[k]);
                                    //load the profile
                                    const p = Profile.load(data.profiles[keys[k]]);
                                    //add to collection
                                    this.profiles.add(p);
                                }
                                //no profiles so just bail
                                if (kl === 0) return;
                                this.changed = true;
                                //rebuild the menu as could have added multiple profiles or not and this ensures ordered correctly by priority
                                this._buildMenu();
                                //reselect current item
                                this.expandPath(this._page);
                            }
                        }
                        else
                            setTimeout(function () {
                                alert_box('Invalid file', 'Unable to import file, not a valid profile file', DialogIcon.exclamation);
                            }, 50);
                    }
                    catch (err) {
                        setTimeout(function () {
                            alert_box('Error importing', 'Error importing file.', DialogIcon.error);
                        }, 50);
                        this._client.error(err);
                    }
                }).catch(err => this._client.error(err));
            }).catch(() => { });
        });
        this.footer.querySelector(`#${this.id}-refresh a`).addEventListener('click', () => {
            this._buildMenu();
            this.setBody(this._page);
        });

        this.footer.querySelector(`#${this.id}-reload a`).addEventListener('click', () => {
            if (this.changed) {
                confirm_box('Reload profiles?', `Reload and lose changes?`).then(e => {
                    if (e.button === DialogButtons.Yes) {
                        this.profiles = this._client.profiles.clone();
                        this.profiles.SortByPriority();
                        this._buildMenu();
                        this.setBody(this._page);
                    }
                })
            }
            else {
                this.profiles = this._client.profiles.clone();
                this.profiles.SortByPriority();
                this._buildMenu();
                this.setBody(this._page);
            }
        });

        this.footer.querySelector(`#${this.id}-save`).addEventListener('click', () => {
            if (this._errorField) {
                this._errorField.focus();
                return;
            }
            if (this._outsideChange) {
                confirm_box('Profiles changed', `Profiles have been changed outside of manager, overwrite?`, null, DialogButtons.YesNo).then(e => {
                    if (e.button === DialogButtons.Yes) {
                        this._save();
                        this.close();
                        this._outsideChange = false;
                    }
                });
            }
            else {
                this._save();
                this.close();
            }
        });
        this.footer.querySelector(`#${this.id}-apply`).addEventListener('click', () => {
            if (this._errorField) {
                this._errorField.focus();
                return;
            }
            if (this._outsideChange) {
                confirm_box('Profiles changed', `Profiles have been changed outside of manager, overwrite?`, null, DialogButtons.YesNo).then(e => {
                    if (e.button === DialogButtons.Yes) {
                        this._save();
                        this._outsideChange = false;
                    }
                });
            }
            else
                this._save();
        });
        this.dialog.addEventListener('keydown', e => {
            if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                if (e.code === 'KeyF') {
                    const sOpen = this._search.open;
                    this._search.show();
                    //if it was not open prevent browser find open for first time
                    if (!sOpen) {
                        e.preventDefault();
                        e.returnValue = false;
                        return false;
                    }
                    return true;
                }
                if (document.activeElement) {
                    if (document.activeElement.nodeName === 'TEXTAREA' || (document.activeElement as HTMLElement).isContentEditable)
                        return;
                    if (document.activeElement.nodeName === 'INPUT' && (document.activeElement as HTMLInputElement).type !== 'checkbox' && (document.activeElement as HTMLInputElement).type !== 'radio')
                        return
                }
                if (e.code === 'KeyC') {
                    this._copyItem();
                    e.preventDefault();
                    e.returnValue = false;
                    return false;
                }
                else if (e.code === 'KeyX') {
                    this._cutItem();
                    e.preventDefault();
                    e.returnValue = false;
                    return false;
                }
                else if (e.code === 'KeyV' && this._clip) {
                    this._paste();
                    e.preventDefault();
                    e.returnValue = false;
                    return false;
                }
            }

        });
        this._search = new ProfileSearch(this, this.footer);
        this._search.MatchCase = this._client.getOption('profiles.find.case');
        this._search.MatchWord = this._client.getOption('profiles.find.word');
        this._search.Reverse = this._client.getOption('profiles.find.reverse');
        this._search.RegularExpression = this._client.getOption('profiles.find.regex');
        this._search.SearchValue = this._client.getOption('profiles.find.value');
        if (this._client.getOption('profiles.find.show'))
            this._search.show();
        this._search.on('word', () => {
            this._client.setOption('profiles.find.word', this._search.MatchWord);
        });
        this._search.on('case', () => {
            this._client.setOption('profiles.find.case', this._search.MatchCase);
        });
        this._search.on('reverse', () => {
            this._client.setOption('profiles.find.reverse', this._search.Reverse);
        });
        this._search.on('regex', () => {
            this._client.setOption('profiles.find.regex', this._search.RegularExpression);
        });
        this._search.on('value', () => {
            this._client.setOption('profiles.find.value', this._search.SearchValue);
        });
        this._search.on('shown', () => {
            this._client.setOption('profiles.find.show', true);
        });
        this._search.on('closed', () => {
            this._client.setOption('profiles.find.show', false);
        });
    }

    private _getItem(collection, index, idPrefix, hrefPrefix, indent?) {
        if (!collection || collection.length === 0) return '';
        let menu = '';
        indent = indent || 0;
        let padding = indent * 20 + 16;
        const id = `${idPrefix + '-' + (collection[index].useName ? this._sanitizeID(collection[index].name.toLowerCase()) : index)}`;
        menu += `<li class="nav-item${this._clipId === id ? ' cut-item' : ''}" title="${htmlEncode(GetDisplay(collection[index]))}" id="${id}">`;
        if (collection[index].items && collection[index].items.length)
            menu += `<a data-indent="${indent}" data-id="${idPrefix + '-' + this._sanitizeID(collection[index].name.toLowerCase())}" data-lazy="true" style="padding-left: ${padding}px" class="nav-link text-dark" href="#${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}"><i class="align-middle float-start bi bi-chevron-right"></i> <input data-page="${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}" type="checkbox" class="form-check-input" id="enabled-${idPrefix}-${this._sanitizeID(collection[index].name.toLowerCase())}"${collection[index].enabled ? ' checked' : ''}> ${htmlEncode(GetDisplay(collection[index]))}</a>`;
        else if (collection[index].useName)
            menu += `<a style="padding-left: ${padding}px" class="nav-link text-dark " href="#${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}"><i class="align-middle float-start no-icon"></i> <input data-page="${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}" type="checkbox" class="form-check-input" id="enabled-${idPrefix}-${this._sanitizeID(collection[index].name.toLowerCase())}"${collection[index].enabled ? ' checked' : ''}> ${htmlEncode(GetDisplay(collection[index]))}</a>`;
        else
            menu += `<a style="padding-left: ${padding}px" class="nav-link text-dark" href="#${hrefPrefix}/${index}"><i class="align-middle float-start no-icon"></i><input type="checkbox" class="form-check-input" data-page="${hrefPrefix}/${index}" id="enabled-${idPrefix}-${index}"${collection[index].enabled ? ' checked' : ''}> ${htmlEncode(GetDisplay(collection[index]))}</a>`;
        menu += '</li>';
        return menu;
    }

    private _getItems(collection, idPrefix, hrefPrefix, indent?) {
        if (!collection || collection.length === 0) return '';
        let menu = '';
        for (let c = 0, cl = collection.length; c < cl; c++) {
            menu += this._getItem(collection, c, idPrefix, hrefPrefix, indent);
        }
        return '<ul class="dropdown-menu dropdown-inline">' + menu + '</ul>';
    }

    private _buildMenu() {
        let nav = '';
        for (let k = 0, kl = this.profiles.keys.length; k < kl; k++) {
            nav += this._profile(this.profiles.keys[k]);
        }
        this._menu.innerHTML = '<ul class="nav" id="profile-menu">' + nav + '</ul>'
        let items = this._menu.querySelectorAll('a');
        for (let i = 0, il = items.length; i < il; i++) {
            this._profileEvents(items[i]);
        }
    }

    private _lazyLoad(item) {
        const data = item.getAttribute('href').split('/');
        if (item.dataset.type === 'profile') {
            item.insertAdjacentHTML('afterend', this._getItems([{
                name: 'Aliases',
                items: this.profiles.items[data[1]].aliases,
                useName: true,
                enabled: this.profiles.items[data[1]].enableAliases,
            },
            {
                name: 'Macros',
                items: this.profiles.items[data[1]].macros,
                useName: true,
                enabled: this.profiles.items[data[1]].enableMacros
            },
            {
                name: 'Triggers',
                items: this.profiles.items[data[1]].triggers,
                useName: true,
                enabled: this.profiles.items[data[1]].enableTriggers
            },
            {
                name: 'Buttons',
                items: this.profiles.items[data[1]].buttons,
                useName: true,
                enabled: this.profiles.items[data[1]].enableButtons
            }], this._sanitizeID(data[1]), 'profiles/' + encodeURIComponent(data[1]), 1));
        }
        else {
            const collection = this.profiles.items[data[1]][data[2]];
            item.insertAdjacentHTML('afterend', this._getItems(collection, item.dataset.id, item.getAttribute('href').substring(1), +item.dataset.indent + 1))
        }
        item.dataset.lazy = 'false';
        this._profileEvents(item.nextElementSibling);
    }

    private _profileEvents(item) {
        let items = item.querySelectorAll('.bi-chevron-right');
        let i, il;
        for (i = 0, il = items.length; i < il; i++)
            items[i].addEventListener('click', e => {
                if (e.currentTarget.parentElement.dataset.lazy === 'true')
                    this._lazyLoad(e.currentTarget.parentElement);
                e.target.closest('li').querySelector('.dropdown-menu').classList.toggle('show');
                e.target.classList.toggle('bi-chevron-right');
                e.target.classList.toggle('bi-chevron-down');
                //e.stopPropagation();
                //e.cancelBubble = true;
                e.preventDefault();
            });
        items = item.querySelectorAll('input');
        for (i = 0, il = items.length; i < il; i++)
            items[i].addEventListener('change', e => {
                const data = e.target.dataset.page.split('/');
                const value = e.target.checked;
                switch (data.length) {
                    case 2:
                        if (!value && this.profiles.keys.filter(k => this.profiles.enabled(k)).length === 1) {
                            alert_box('Cannot disable', 'One profile must always be enabled.');
                            e.target.checked = true;
                            return;
                        }
                        this._menu.querySelector(`#enabled-${this._sanitizeID(data[1])}`).checked = value;
                        this._menu.querySelector(`#enabled-${this._sanitizeID(data[1])}-switch`).checked = value;
                        if (this._page === e.target.dataset.page)
                            this._contents.querySelector('#enabled').checked = value;
                        this.profiles.items[data[1]].enabled = value;
                        this.changed = true;
                        break;
                    case 3:
                        this._menu.querySelector(`#enabled-${this._sanitizeID(data[1])}-${data[2]}`).checked = value;
                        if (this._page === `profiles/${data[1]}`)
                            this._contents.querySelector('#enable' + capitalize(data[2])).checked = value;
                        this.profiles.items[data[1]]['enable' + capitalize(data[2])] = value;
                        this.changed = true;
                        break;
                    case 4:
                        this._menu.querySelector(`#enabled-${this._sanitizeID(data[1])}-${data[2]}-${data[3]}`).checked = value;
                        if (this._page === e.target.dataset.page)
                            this._contents.querySelector('#enabled').checked = value;
                        else if (this._page === `profiles/${data[1]}/${data[2]}`)
                            this._contents.querySelector('#check-' + data[3]).checked = value;
                        this.profiles.items[data[1]][data[2]][+data[3]].enabled = value;
                        this.changed = true;
                        break;
                }
                e.stopPropagation();
                e.cancelBubble = true;
            });
        items = item.querySelectorAll('.list-badge-button.text-bg-danger');
        for (i = 0, il = items.length; i < il; i++)
            items[i].addEventListener('click', (e: MouseEvent) => {
                this._deleteProfile((e.target as HTMLElement).parentElement.dataset.profile);
                e.preventDefault();
            });
        items = item.querySelectorAll('.list-badge-button.text-bg-light');
        for (i = 0, il = items.length; i < il; i++)
            items[i].addEventListener('click', (e: MouseEvent) => {
                this._copyItem({ type: 'profile', profileName: (e.target as HTMLElement).parentElement.dataset.profile });
                e.preventDefault();
            });
        items = item.querySelectorAll('.list-badge-button.text-bg-warning');
        for (i = 0, il = items.length; i < il; i++)
            items[i].addEventListener('click', (e: MouseEvent) => {
                this._cutItem({ type: 'profile', profileName: (e.target as HTMLElement).parentElement.dataset.profile });
                e.preventDefault();
            });
    }

    private _profile(profile) {
        let nav = `<li class="nav-item" data-profile="${profile}" title="${capitalize(profile)}" id="${this._sanitizeID(profile)}">`;
        nav += `<a data-lazy="true" data-type="profile" data-id="${this._sanitizeID(profile)}" class="nav-link text-dark" href="#profiles/${encodeURIComponent(profile)}">`;
        if (profile !== 'default')
            nav += `<span class="list-badge-button badge text-bg-danger" data-profile="${profile}" title="Remove profile"><i class="bi bi-trash"></i></span>`;
        nav += `<span class="list-badge-button badge text-bg-light me-1" data-profile="${profile}" title="Copy profile"><i class="bi bi-copy"></i></span>`;
        if (profile !== 'default')
            nav += `<span class="list-badge-button badge text-bg-warning me-1" data-profile="${profile}" title="Cut profile"><i class="bi bi-scissors"></i></span>`;
        nav += `<i class="align-middle float-start bi bi-chevron-right"></i> `;
        nav += this._item(capitalize(profile), 'enabled-' + profile, this.profiles.items[profile].enabled);
        nav += `</a>`;
        nav += '</li>';
        return nav;
    }

    private _item(title, id, enabled) {
        return `<span><input type="checkbox" data-page="profiles/${title.toLowerCase()}" class="form-check-input" id="${this._sanitizeID(id)}"${enabled ? ' checked' : ''}> ${title}</span><div class="form-check form-switch"><input type="checkbox" class="form-check-input" id="${id}-switch"${enabled ? ' checked' : ''}> ${title}</div>`;
    }

    public setBody(contents: string, args?: any) {
        if (!this.profiles) {
            setTimeout(() => {
                this.setBody(contents, args);
            }, 100);
            return;
        }
        if (this._errorField) {
            setTimeout(() => this._errorField.focus(), 100);
            window.location.hash = this._page;
            return;
        }
        this._page = this.dialog.dataset.path;
        if (this._page === 'profiles')
            this.dialog.dataset.panel = 'left';
        else
            this.dialog.dataset.panel = 'right';
        const pages = this._page.split('/');
        let k, kl, p;
        this.expandPath(pages);
        this.footer.querySelector('#profile-page-buttons').innerHTML = '';
        this.footer.querySelector(`#${this.id}-export-current`).style.display = '';
        this._contents.scrollTop = 0;
        if (!this._setCurrent(pages)) {
            this.title = buildBreadcrumb(pages, { small: this._small, sep: '/', icon: '<i class="fas fa-users" style="padding: 2px;margin-right: 2px;"></i>' });
            if (pages.length > 2)
                this._splitter.panel2Collapsed = false;
            return;
        }
        if (pages.length === 4)
            this.title = buildBreadcrumb(pages, { small: this._small, sep: '/', formatter: (item, index, last) => index === last ? htmlEncode(GetDisplay(this._current.item)) : capitalize(item), icon: '<i class="fas fa-users" style="padding: 2px;margin-right: 2px;"></i>' });
        else if (pages.length === 5)
            this.title = buildBreadcrumb(pages, { small: this._small, sep: '/', formatter: (item, index, last) => index === last ? htmlEncode(GetDisplay(this._current.parent)) : index === last - 1 ? htmlEncode(GetDisplay(this._current.item)) : capitalize(item), icon: '<i class="fas fa-users" style="padding: 2px;margin-right: 2px;"></i>' });
        else
            this.title = buildBreadcrumb(pages, { small: this._small, sep: '/', icon: '<i class="fas fa-users" style="padding: 2px;margin-right: 2px;"></i>' });
        if (pages.length < 2) {
            this.footer.querySelector(`#${this.id}-export-current`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-sep`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-alias`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-macro`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-trigger`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-button`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-sep2`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-default-buttons`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-add-default-macros`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-cut`).style.display = 'none';
            this.footer.querySelector(`#${this.id}-copy`).style.display = 'none';
            this._splitter.panel2Collapsed = true;
            this.footer.querySelector(`#${this.id}-back`).style.display = 'none';
        }
        else {
            this.footer.querySelector(`#${this.id}-add-sep`).style.display = '';
            this.footer.querySelector(`#${this.id}-add-alias`).style.display = '';
            this.footer.querySelector(`#${this.id}-add-macro`).style.display = '';
            this.footer.querySelector(`#${this.id}-add-trigger`).style.display = '';
            this.footer.querySelector(`#${this.id}-add-button`).style.display = '';
            this.footer.querySelector(`#${this.id}-back`).style.display = '';
            this.footer.querySelector(`#${this.id}-add-sep2`).style.display = '';
            this.footer.querySelector(`#${this.id}-add-default-buttons`).style.display = '';
            this.footer.querySelector(`#${this.id}-add-default-macros`).style.display = '';
            this.footer.querySelector(`#${this.id}-cut`).style.display = '';
            this.footer.querySelector(`#${this.id}-copy`).style.display = '';
            this._splitter.panel2Collapsed = false;
        }
        this._updateEditMenu();
        if (pages.length === 2) {
            if (this._contentPage !== 'properties') {
                this._loadPage('properties').then(contents => {
                    this._contentPage = 'properties';
                    this._setContents(contents);
                    const forms = this._contents.querySelectorAll('input');
                    this._contents.querySelector('#name').disabled = this._current.profileName === 'default';
                    for (let f = 0, fl = forms.length; f < fl; f++)
                        if (forms[f].type === 'checkbox') {
                            forms[f].checked = this._current.profile[forms[f].id];
                            forms[f].addEventListener('change', e => {
                                const value = e.target.checked;
                                if (e.target.id === 'enabled') {

                                    if (!value && this.profiles.keys.filter(k => this.profiles.enabled(k)).length === 1) {
                                        alert_box('Cannot disable', 'One profile must always be enabled.');
                                        e.target.checked = true;
                                        return;
                                    }
                                    this._menu.querySelector(`#enabled-${this._sanitizeID(this._current.profileName)}`).checked = value;
                                    this._menu.querySelector(`#enabled-${this._sanitizeID(this._current.profileName)}-switch`).checked = value;
                                    if (this._page === e.target.dataset.page)
                                        this._contents.querySelector('#enabled').checked = value;
                                    this.profiles.items[this._current.profileName].enabled = value;
                                }
                                else {
                                    this._current.profile[e.target.id] = value;
                                    this._menu.querySelector(`#enabled-${this._sanitizeID(this._current.profileName)}-${e.target.id.substring(6).toLowerCase()}`).checked = value;
                                    this.changed = true;
                                }
                                this.changed = true;
                            });
                        }
                        else {
                            forms[f].value = this._current.profile[forms[f].id];
                            forms[f].addEventListener('change', e => {
                                const target = (e.currentTarget || e.target) as HTMLInputElement;
                                if (target.id === 'name') {
                                    debounce(() => {
                                        let err = this._renameProfile(target.value);
                                        if (err === true) {
                                            forms[f].classList.remove('is-invalid');
                                            this._errorField = null;
                                        }
                                        else {
                                            forms[f].classList.add('is-invalid');
                                            this._errorField = forms[f];
                                            this._contents.querySelector('#name-feedback').textContent = err;
                                        }
                                        this._sortProfiles();
                                    }, 200, 'renameProfile');
                                }
                                else {
                                    this._current.profile[target.id] = target.value;
                                    debounce(() => this._sortProfiles(), 200, 'sortProfiles');
                                }
                                this.changed = true;
                            });
                            forms[f].addEventListener('input', e => {
                                const target = (e.currentTarget || e.target) as HTMLInputElement;
                                if (target.id === 'name') {
                                    debounce(() => {
                                        let err = this._renameProfile(target.value);
                                        if (err === true) {
                                            forms[f].classList.remove('is-invalid');
                                            this._errorField = null;
                                        }
                                        else {
                                            forms[f].classList.add('is-invalid');
                                            this._errorField = forms[f];
                                            this._contents.querySelector('#name-feedback').textContent = err;
                                        }
                                        this._sortProfiles();
                                    }, 200, 'renameProfile');
                                }
                                else {
                                    this._current.profile[target.id] = target.value;
                                    debounce(() => this._sortProfiles(), 200, 'sortProfiles');
                                }
                                this.changed = true;
                            });
                        }
                }
                ).catch(() => {
                });
            }
            else {
                this._contents.querySelector('#name').disabled = this._current.profileName === 'default';
                const forms = this._contents.querySelectorAll('input');
                for (let f = 0, fl = forms.length; f < fl; f++) {
                    if (forms[f].type === 'checkbox')
                        forms[f].checked = this._current.profile[forms[f].id];
                    else
                        forms[f].value = this._current.profile[forms[f].id];
                }
            }
            if (this._current.profileName !== 'default') {
                let b = `<button id="${this.id}-remove" type="button" class="btn-sm btn btn-danger" title="Remove profile"><i class="bi bi-trash"></i></button>`;
                this.footer.querySelector('#profile-page-buttons').innerHTML = b;
                this.footer.querySelector(`#${this.id}-remove`).addEventListener('click', (e: MouseEvent) => {
                    if (this._errorField)
                        this._errorField = null;
                    this._deleteProfile(this._current.profileName);
                });
            }
            this.footer.querySelector(`#${this.id}-cut`).style.display = 'none';
        }
        else if (pages.length === 3) {
            let pp = '';
            let b = `<button id="${this.id}-add" type="button" class="btn-sm float-start btn btn-outline-secondary" title="Add ${this._getItemType()}"><i class="bi bi-plus-lg"></i></button>`;
            if (this._current.item.length === 0) {
                p = '<h1 id="empty" style="width: 100%;text-align:center">No ' + this._current.collection + '.</h1>';
                p += `<button id="${this.id}-add-contents" type="button" class="btn-sm float-start btn btn-outline-secondary" title="Add ${this._getItemType()}"><i class="bi bi-plus-lg"></i> Add ${this._getItemType()}</button>`;
                this.footer.querySelector(`#${this.id}-cut`).style.display = 'none';
                this.footer.querySelector(`#${this.id}-copy`).style.display = 'none';
                this._updateEditMenu();
            }
            else {
                p = '';
                for (k = 0, kl = this._current.item.length; k < kl; k++) {
                    p += `<a data-profile ="${this._current.profileName}" id="item-${k}" data-index="${k}" href="#profiles/${encodeURIComponent(this._current.profileName)}/${this._current.collection}/${k}" class="list-group-item list-group-item-action">`
                    p += `<span data-index="${k}" class="list-badge-button badge text-bg-danger"><i class="bi bi-trash" title="Remove ${this._getItemType()}"></i></span>`;
                    p += `<span data-index="${k}" class="list-badge-button badge text-bg-light me-1" title="Copy ${this._getItemType()}"><i class="bi bi-copy"></i></span>`;
                    p += `<span data-index="${k}" class="list-badge-button badge text-bg-warning me-1" title="Cut ${this._getItemType()}"><i class="bi bi-scissors"></i></span>`;
                    p += `<div class="form-check-inline form-switch" style="margin: 0;">`;
                    p += `<input type="checkbox" class="form-check-input" id="check-${k}" data-profile="${this._current.profileName}" data-index="${k}" data-field="enabled" data-items="${this._current.collection}"${this._current.item[k].enabled ? ' checked="checked"' : ''}>`
                    p += `</div>${htmlEncode(GetDisplay(this._current.item[k]))}</a>`;
                }
                pp = `<button id="${this.id}-add-contents" type="button" class="btn-sm btn btn-outline-secondary" title="Add ${this._getItemType()}" style="margin-bottom: 5px;width:100%;"><i class="bi bi-plus-lg"></i> Add ${this._getItemType()}</button>`;
                b = `<button id="${this.id}-remove-all" type="button" class="btn-sm float-start btn btn-danger" title="Remove all ${this._getItemType() === 'alias' ? 'aliases' : this._getItemType() + 's'}"><i class="bi bi-trash"></i></button>` + b;
            }
            this.footer.querySelector('#profile-page-buttons').innerHTML = b;
            this._setContents(pp + '<div class="list-group">' + p + '</div>');
            let items = this._contents.querySelectorAll('.list-badge-button.text-bg-danger');
            for (let i = 0, il = items.length; i < il; i++)
                items[i].addEventListener('click', e => {
                    this._removeItem(+e.target.parentElement.dataset.index);
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e.preventDefault();
                });
            items = this._contents.querySelectorAll('.list-badge-button.text-bg-light,.list-badge-button.text-bg-warning');
            for (let i = 0, il = items.length; i < il; i++)
                items[i].addEventListener('click', e => {
                    let idx = +e.target.parentElement.dataset.index;
                    let data = {
                        type: this._getItemType(),
                        item: this._current.item[idx],
                        index: idx,
                        profile: this._current.profile,
                        profileName: this._current.profileName,
                        collection: this._current.collection
                    };
                    if (e.currentTarget.classList.contains('text-bg-warning'))
                        this._cutItem(data);
                    else
                        this._copyItem(data);
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e.preventDefault();
                });

            this._contentPage = null;
            this.footer.querySelector(`#${this.id}-add`).addEventListener('click', () => {
                this._addItem();
            });
            if (this.footer.querySelector(`#${this.id}-remove-all`))
                this.footer.querySelector(`#${this.id}-remove-all`).addEventListener('click', () => {
                    this._removeItems();
                });
            if (this._contents.querySelector(`#${this.id}-add-contents`))
                this._contents.querySelector(`#${this.id}-add-contents`).addEventListener('click', () => {
                    this._addItem();
                });

            items = this._contents.querySelectorAll('input');
            for (let i = 0, il = items.length; i < il; i++)
                items[i].addEventListener('change', (e: MouseEvent) => {
                    const target = (e.currentTarget || e.target) as HTMLInputElement;
                    const value = target.checked;
                    this._menu.querySelector(`#enabled-${this._sanitizeID(this._current.profileName)}-${this._current.collection}-${target.dataset.index}`).checked = value;
                    this._current.profile[this._current.collection][+target.dataset.index].enabled = value;
                    this.changed = true;
                });

        }
        else if (pages.length === 4) {
            let b = `<button id="${this.id}-remove" type="button" class="btn-sm btn btn-danger" title="Remove ${this._getItemType()}"><i class="bi bi-trash"></i></button>`;
            this.footer.querySelector('#profile-page-buttons').innerHTML = b;
            this.footer.querySelector(`#${this.id}-remove`).addEventListener('click', e => {
                this._removeItem(this._current.itemIdx, 0, true);
                e.stopPropagation();
                e.cancelBubble = true;
                e.preventDefault();
            });
            if (this._contentPage !== this._current.collection) {
                this._contentPage = this._current.collection;
                this._loadPage(this._current.collection).then(contents => {
                    this._setContents(contents);
                    this._loadItem(true);
                }).catch(() => { });
            }
            else
                this._loadItem();

        }
        else if (pages.length === 5) {
            let b = `<button id="${this.id}-remove" type="button" class="btn-sm btn btn-danger" title="Remove ${this._getItemType()}"><i class="bi bi-trash"></i></button>`;
            this.footer.querySelector('#profile-page-buttons').innerHTML = b;
            this.footer.querySelector(`#${this.id}-remove`).addEventListener('click', e => {
                this._removeItem(this._current.itemIdx, 0, true);
                e.stopPropagation();
                e.cancelBubble = true;
                e.preventDefault();
            });
            if (this._contentPage !== this._current.collection) {
                this._contentPage = this._current.collection;
                this._loadPage(this._current.collection).then(contents => this._setContents(contents)).catch(() => {
                    this._loadItem(true);
                });
            }
            else
                this._loadItem();
        }
        else {
            let b = `<button id="btn-${this.id}-add-profile" type="button" class="btn-sm btn btn-outline-secondary" title="Add profile"><i class="bi bi-plus-lg"></i></button>`;
            this.footer.querySelector('#profile-page-buttons').innerHTML = b;
            this.footer.querySelector(`#btn-${this.id}-add-profile`).addEventListener('click', () => {
                this._createProfile(true);
            });
            this._contentPage = null;
            this._setContents('');
        }
    }

    private _setCurrent(pages) {
        if (!pages)
            return false;
        this._current.itemIdx = this._current.itemSubIdx = -1;
        this._current.parent = null;
        this._current.collection = '';
        this._current.item = null;
        if (pages.length > 1) {
            this._current.profileName = pages[1];
            if (!this.profiles.contains(this._current.profileName)) {
                this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">Profile ${this._current.profileName} not found.</h1>`);
                this._contentPage = null;
                return false;
            }
            this._current.profile = this.profiles.items[this._current.profileName];
        }
        if (pages.length > 2) {
            this._current.collection = pages[2];
            if (!this._current.profile[this._current.collection]) {
                this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">${capitalize(this._current.collection)} not found in ${this._current.profileName}.</h1>`);
                this._contentPage = null;
                return false;
            }
            this._current.item = this._current.profile[pages[2]];
        }
        if (pages.length > 3) {
            this._current.itemIdx = +pages[3];
            if (isNaN(this._current.itemIdx) || this._current.itemIdx < 0 || this._current.itemIdx >= this._current.item.length) {
                this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">${capitalize(this._getItemType())} not found.</h1>`);
                this._contentPage = null;
                return false;
            }
            this._current.item = this._current.profile[pages[2]][this._current.itemIdx];
        }
        if (pages.length > 4) {
            this._current.itemSubIdx = +pages[4];
            if (!this._current.item.triggers) {
                this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">Invalid trigger.</h1>`);
                this._contentPage = null;
                return;
            }
            if (this._current.itemSubIdx < 0 || this._current.itemSubIdx >= this._current.item.triggers.length) {
                this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">Trigger state not found.</h1>`);
                this._contentPage = null;
                return;
            }
            this._current.parent = this._current.item;
            this._current.item = this._current.item.triggers[this._current.itemSubIdx];
        }
        return true;
    }

    private _loadPage(page) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'dialogs/profiles-' + page + '.htm',
                cache: false,
                type: 'GET',
            })
                .done((data) => {
                    data = data.replace(/{profileURL}/g, encodeURIComponent(this._current.profileName)).replace(/{profile}/g, this._current.profileName)
                    resolve(data);
                })
                .fail(function () {
                    reject('');
                });
        });
    }

    private _setContents(contents) {
        this._contents.innerHTML = contents;
        const scripts: HTMLScriptElement[] = this._contents.querySelectorAll('script');
        const args = {
            client: client,
            item: this._current.item,
            FilterArrayByKeyValue: FilterArrayByKeyValue,
            keyCharToCode: keyCharToCode,
            profile: this._current.profile,
            profileName: this._current.profileName,
            parent: this._current.parent,
            current: this._current,
            GetDisplay: GetDisplay,
            Trigger: Trigger,
            debounce: debounce,
            updateHash: updateHash,
            DialogButtons: DialogButtons
        };
        this.emit('content-changing');
        for (let s = 0, sl = scripts.length; s < sl; s++) {
            /*jslint evil: true */
            let script = new Function('body', 'dialog', ...Object.keys(args), 'try { ' + scripts[s].textContent + '}catch(e){this._client.error(e)}');
            script.apply(client, [this._contents, this, ...Object.values(args), this]);
        }
        this.emit('content-changed');
    }

    private _loadItem(events?) {
        const forms: HTMLInputElement[] = this._contents.querySelectorAll('input,select,textarea');

        for (let f = 0, fl = forms.length; f < fl; f++) {
            if (!(forms[f].id in this._current.item) && forms[f].dataset.enum !== 'true')
                continue;
            if (forms[f].type === 'checkbox') {
                if (forms[f].dataset.enum === 'true') {
                    const name = forms[f].name || forms[f].id.substring(0, forms[f].id.lastIndexOf('-'));
                    const value = +forms[f].id.substring(forms[f].id.lastIndexOf('-') + 1);
                    forms[f].checked = (this._current.item[name] & value) === value;
                }
                else
                    forms[f].checked = this._current.item[forms[f].id];
                if (events)
                    forms[f].addEventListener('change', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        if (target.style.display === 'none') return;
                        if (target.dataset.enum === 'true') {
                            const name = target.name || target.id.substring(0, target.id.lastIndexOf('-'));
                            const enums = this.body.querySelectorAll(`[name=${name}]`);
                            let value = 0;
                            for (let e = 0, el = enums.length; e < el; e++) {
                                if (enums[e].checked)
                                    value |= +enums[e].value;
                            }
                            this._current.item[name] = value;
                        }
                        else {
                            this._current.item[target.id] = target.checked || false;
                            if (target.id === 'enabled')
                                this._menu.querySelector(`#enabled-${this._sanitizeID(this._current.profileName)}-${this._current.collection}-${this._current.itemIdx}`).checked = this._current.item[target.id];
                        }
                        this.changed = true;
                        this._updateItemMenu();
                    });
            }
            else {
                forms[f].value = this._current.item[forms[f].id];
                if (events) {
                    forms[f].addEventListener('change', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        if (target.style.display === 'none' && !target.required) return;
                        this.setValue(this._current.item, target.id, target.value);
                        this.changed = true;
                        this._updateItemMenu();
                    });
                    forms[f].addEventListener('input', e => {
                        const target = (e.currentTarget || e.target) as HTMLInputElement;
                        if (target.style.display === 'none' && !target.required) return;
                        this.setValue(this._current.item, target.id, target.value);
                        this.changed = true;
                        this._updateItemMenu();
                    });
                }
                let c = this.changed;
                forms[f].dispatchEvent(new Event('change'));
                this.changed = c;
            }
        }
        this.emit('item-loaded', this._current);
    }

    private _updateItemMenu(currentItem?, profile?, collection?, index?) {
        profile = profile || this._current.profileName;
        collection = collection || this._current.collection;
        if (typeof index !== 'number')
            index = this._current.itemIdx;
        const currentParent = this._current.parent;
        currentItem = currentItem || this._current.item;
        debounce(() => {
            let item = this.body.querySelector(`#${this._sanitizeID(profile)}-${collection}-${index}`);
            if (!item) return;
            let display
            display = GetDisplay(currentParent || currentItem);
            item.title = display;
            item.firstChild.childNodes[2].textContent = ' ' + display;
            let bc = this.header.querySelector('ol').children;
            if (bc.length > 4) {
                if (bc[4].children.length)
                    bc[4].children[0].textContent = display;
                else
                    bc[4].textContent = display;
            }
            if (bc.length > 5) {
                bc[5].textContent = GetDisplay(currentItem);
            }
        }, 200, 'updateItemMenu');
    }

    public expandPath(pages, select?) {
        if (!Array.isArray(pages))
            pages = pages.split('/');
        let id;
        let el;
        let expand;
        let po = 0;
        if (pages[0] === 'profiles')
            po = 1;
        let last = pages.length - 1;
        for (let p = po, pl = pages.length; p < pl; p++) {
            id = this._sanitizeID(pages.slice(po, p + 1).join('-'));
            el = document.getElementById(id);
            if (!el) continue;
            if (p === last) {
                setTimeout(() => {
                    const items = this._menu.querySelectorAll('.active');
                    for (let i = 0, il = items.length; i < il; i++)
                        items[i].classList.remove('active');
                    scrollChildIntoView(this._menu, el);
                    el.classList.add('active');
                    if (select)
                        el.firstChild.click();
                }, 100);
            }
            else {
                expand = el.querySelector('.dropdown-menu');
                if (!expand) {
                    expand = el.querySelector('[data-lazy="true"]')
                    if (!expand) return;
                    this._lazyLoad(expand);
                    expand = el.querySelector('.dropdown-menu');
                }
                if (!expand || expand.classList.contains('show')) continue;
                el = el.querySelector('i.bi-chevron-right') || el.querySelector('i.bi-chevron-down');
                if (el) {
                    el.closest('li').querySelector('.dropdown-menu').classList.toggle('show');
                    el.classList.toggle('bi-chevron-right');
                    el.classList.toggle('bi-chevron-down');
                }
            }
        }

    }

    private _goBack() {
        if (this._errorField) {
            this._errorField.focus();
            return;
        }
        const pages = this._page.split('/');
        if (pages.length === 5)
            this.loadPage(pages.slice(0, pages.length - 2).join('/'));
        else
            this.loadPage(pages.slice(0, pages.length - 1).join('/'));
    }

    private _createProfile(defaults: boolean) {
        let i = this.profiles.length;
        let name = 'NewProfile' + i;
        while (this.profiles.contains(name)) {
            i++;
            name = 'NewProfile' + i
        }
        const profile = new Profile(name, defaults);
        name = name.toLowerCase();
        this.profiles.add(profile);
        this.profiles.SortByPriority();
        let menuItem = this._profile(name);
        i = this.profiles.keys.indexOf(name);
        const menu = document.getElementById('profile-menu');
        if (i === -1 || i >= menu.children.length)
            i = menu.children.length - 1;
        if (i < 0) i = 0;
        menu.children[i].insertAdjacentHTML("afterend", menuItem);
        this._profileEvents(menu.children[i + 1]);
        this.changed = true;
        this.loadPage('profiles/' + name);
    }

    private _deleteProfile(profile) {
        if (!profile) return false;
        confirm_box('Remove profile?', `Delete "${profile}"?`).then(e => {
            if (e.button === DialogButtons.Yes) {
                this.profiles.remove(profile);
                this._menu.querySelector('#' + profile).remove();
                if (this._page.startsWith('profiles/' + profile))
                    this.loadPage('profiles');
                this.changed = true;
            }
        });
    }

    private _renameProfile(name, oldProfile?) {
        if (!name) return 'Name can not be empty!';
        oldProfile = (oldProfile || this._current.profileName).toLowerCase();
        name = name.toLowerCase();
        if (name === oldProfile) return true;
        if (this.profiles.contains(name))
            return 'A profile named ' + name + ' already exists!';
        this.profiles.remove(oldProfile);
        this._current.profile.name = name;
        this._current.profileName = name;
        this.profiles.add(this._current.profile);
        const oldID = this._sanitizeID(oldProfile);
        const newID = this._sanitizeID(name);
        let items;
        items = this.body.querySelector(`#${oldID} a`);
        items.children[2].childNodes[1].textContent = ' ' + capitalize(name);
        document.querySelector(`#${oldID} a`).children[3].childNodes[1].textContent = ' ' + capitalize(name);
        items = this.body.querySelector(`#${oldID}`);
        items.id = newID;
        items.title = name;
        this._replaceProfileName(this._menu.firstChild, oldProfile, name);
        this._replaceProfileName(this._contents, oldProfile, name);
        this.header.querySelector('ol').children[2].textContent = capitalize(name);
        return true;
    }

    private _replaceProfileName(container, oldName, newName) {
        let items;
        let i, il;
        const oldID = this._sanitizeID(oldName);
        const newID = this._sanitizeID(newName);
        items = container.querySelectorAll(`[id*="-${oldID}-"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].id = items[i].id.replace(`-${oldID}-`, `-${newID}-`);
        items = container.querySelectorAll(`[id$="-${oldID}"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].id = items[i].id.replace(`-${oldID}`, `-${newID}`);
        items = container.querySelectorAll(`[id^="${oldID}-"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].id = items[i].id.replace(`${oldID}-`, `${newID}-`);
        items = container.querySelectorAll(`[data-profile="${oldID}"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].dataset.profile = newID;
        const oldPath = encodeURIComponent(oldName);
        const newPath = encodeURIComponent(newName);
        items = container.querySelectorAll(`[href*="/${oldPath}/"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].href = items[i].getAttribute('href').replace(`/${oldPath}/`, `/${newPath}/`);
        items = container.querySelectorAll(`[href$="/${oldPath}"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].href = items[i].getAttribute('href').replace(`/${oldPath}`, `/${newPath}`);
        items = container.querySelectorAll(`[href^="${oldPath}/"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].href = items[i].getAttribute('href').replace(`${oldPath}/`, `${newPath}/`);
        items = container.querySelectorAll(`[data-path*="/${oldPath}/"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].dataset.path = items[i].dataset.path.replace(`/${oldPath}`, `/${newPath}`);
        items = container.querySelectorAll(`[data-page*="/${oldPath}/"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].dataset.page = items[i].dataset.page.replace(`/${oldPath}/`, `/${newPath}/`);
        items = container.querySelectorAll(`[data-page$="/${oldPath}"]`);
        for (i = 0, il = items.length; i < il; i++)
            items[i].dataset.page = items[i].dataset.page.replace(`/${oldPath}`, `/${newPath}`);
    }

    private _sortProfiles() {
        this.profiles.SortByPriority();
        const menu = this._menu.firstChild;
        const items = Array.from(menu.children);
        items.sort((a: HTMLElement, b: HTMLElement) => {
            let ap = this.profiles.items[a.dataset.profile].priority
            let bp = this.profiles.items[b.dataset.profile].priority
            if (ap > bp)
                return -1;
            if (ap < bp)
                return 1;
            if (a.dataset.profile === 'default')
                return -1;
            if (b.dataset.profile === 'default')
                return 1;
            ap = a.dataset.profile;
            bp = b.dataset.profile;
            if (ap > bp)
                return 1;
            if (ap < bp)
                return -1;
            return 0;
        })

        items.forEach(item => menu.appendChild(item));
    }

    private _save() {
        if (!this.changed) return true;
        if (this._errorField) {
            this._errorField.focus();
            return false;
        }
        this.profiles.save().then(() => {
            this._client.loadProfiles().then(() => {
            });
        })
        this.changed = false;
        return true;
    }

    public close() {
        if (!this._canClose) {
            if (this._outsideChange) {
                confirm_box('Profiles changed', `Profiles have been changed outside of manager, overwrite?`, null, DialogButtons.YesNo).then(e => {
                    if (e.button === DialogButtons.Yes) {
                        this._outsideChange = false;
                        this.close();
                    }
                });
            }
            else
                this._confirmSave().then(r => {
                    if (r)
                        if (!this._save()) return;
                    this._canClose = true;
                    this.close();
                }).catch(() => {
                    this._canClose = false;
                });
        }
        else
            super.close();
    }

    public reload() {
        if (!this._setCurrent(this._page.split('/')))
            return
        this._loadItem();
        this._updateItemMenu();
    }

    private _confirmSave() {
        return new Promise((resolve, reject) => {
            if (this._profilesChanged) {
                confirm_box('Save changes?', `Save changes to profiles?`, null, DialogButtons.YesNo | DialogButtons.Cancel).then(e => {
                    if (e.button === DialogButtons.Yes)
                        resolve(true);
                    else if (e.button === DialogButtons.No)
                        resolve(false);
                    else
                        reject();
                }).catch(e => {
                    reject();
                });
            }
            else
                resolve(true);
        });
    }

    private _sanitizeID(name) {
        return name.toLowerCase().replace(/[^a-z0-9:.-]+/gi, '_');
    }

    private _getItemType(collection?) {
        collection = collection || this._current.collection;
        if (!collection) return;
        if (collection === 'aliases') return 'alias';
        return collection.substring(0, collection.length - 1);
    }

    private _addItem(collection?, item?, profile?) {
        if (!collection) collection = this._current.collection;
        if (!collection) return;
        if (!profile) profile = this._current.profile;
        let profileName = profile.name.toLowerCase();
        let index = profile[collection].length;
        let menuItem;
        if (!item) {
            if (collection === 'aliases')
                item = new Alias();
            else if (collection === 'triggers')
                item = new Trigger();
            else if (collection === 'buttons')
                item = new Button();
            else if (collection === 'macros')
                item = new Macro();
            else if (collection === 'context')
                item = new Context();
        }
        profile[collection].push(item);
        let m = this._menu.querySelector(`#${this._sanitizeID(profileName)}-${collection}`);
        //if no m it has not been loaded yet so let the updateHash expand it
        if (m)
            if (index === 0) {
                menuItem = this._getItem([{
                    name: capitalize(collection),
                    items: profile[collection],
                    useName: true,
                    enabled: profile[collection],
                }], 0, this._sanitizeID(profileName), 'profiles/' + encodeURIComponent(profileName), 1);
                let newNode = document.createElement('div');
                newNode.innerHTML = menuItem;
                if (m.replaceWith)
                    m.replaceWith(newNode.firstChild);
                else if (m.replaceChild)
                    m.parentNode.replaceChild(newNode.firstChild, m);
                else
                    m.outerHTML = menuItem;
                m = this._menu.querySelector(`#${this._sanitizeID(profileName)}-${collection}`);
                this._profileEvents(m);
            }
            else {
                menuItem = this._getItem(profile[collection], index, `${this._sanitizeID(profileName)}-${collection}`, `profiles/${encodeURIComponent(profileName)}/${collection}`, 2);
                //only add if already loaded as the tree will be created when the alias is selected below
                if (m.firstChild.dataset.lazy !== 'true') {
                    m = m.querySelector('ul');
                    m.insertAdjacentHTML('beforeend', menuItem);
                    m = this._menu.querySelector(`#${this._sanitizeID(profileName)}-${collection}`);
                    this._profileEvents(m.lastChild);
                }
            }
        this.loadPage(`profiles/${encodeURIComponent(profileName)}/${collection}/${index}`);
        this.changed = true;
    }

    private _removeItem(index, collection?, back?, profile?) {
        if (!collection) collection = this._current.collection;
        if (!collection) return;
        if (!profile) profile = this._current.profile;
        let profileName = profile.name.toLowerCase();
        confirm_box(`Remove ${this._getItemType()}?`, `Delete ${this._getItemType()}?`).then(e => {
            if (e.button === DialogButtons.Yes) {
                const id = `${this._sanitizeID(profileName)}-${collection}`;
                const items = profile[collection];
                items.splice(index, 1);
                this._menu.querySelector(`#${id}-${index}`).remove();
                if (this._current.itemIdx === -1)
                    this.setBody(this._page);
                if (items.length === 0) {
                    this._menu.querySelector(`#${id} i`).remove();
                    this._menu.querySelector(`#${id} a`).insertAdjacentHTML('afterbegin', '<i class="align-middle float-start no-icon"></i>');
                    if (this._menu.querySelector(`#${id} a`).dataset.lazy !== 'true')
                        this._menu.querySelector(`#${id} .dropdown-menu`).innerHTML = '';
                }
                else {
                    const menuItems = this._menu.querySelector(`#${id} ul`);
                    let i = menuItems.children.length;
                    const href = `#profiles/${encodeURIComponent(profileName)}/${collection}/`;
                    for (; index < i; index++) {
                        const item = menuItems.children[index];
                        item.id = `${id}-${index}`;
                        item.firstChild.href = `${href}${index}`;
                        item.firstChild.children[1].id = `enabled-${id}-${index}`;
                    }
                }
                this.changed = true;
                if (back)
                    this._goBack();
                if (id === this._clipId)
                    this._resetClip(true);
            }
        });
    }

    private _removeItems(collection?, back?, profile?) {
        if (!collection) collection = this._current.collection;
        if (!collection) return;
        if (!profile) profile = this._current.profile;
        let profileName = profile.name.toLowerCase();
        let type = this._getItemType();
        type += type === 'alias' ? 'es' : 's';
        confirm_box(`Remove all ${type}?`, `Delete all ${type}?`).then(e => {
            if (e.button === DialogButtons.Yes) {
                const id = `${this._sanitizeID(profileName)}-${collection}`;
                profile[collection] = [];
                this.setBody(this._page);
                this._menu.querySelector(`#${id} i`).remove();
                this._menu.querySelector(`#${id} a`).insertAdjacentHTML('afterbegin', '<i class="align-middle float-start no-icon"></i>');
                if (this._menu.querySelector(`#${id} a`).dataset.lazy !== 'true')
                    this._menu.querySelector(`#${id} .dropdown-menu`).innerHTML = '';
                this.changed = true;
                if (back)
                    this._goBack();
                if (id === this._clipId)
                    this._resetClip(true);
            }
        });
    }

    private _resetClip(clear?) {
        if (this._clip && this._clip.action === ClipAction.cut) {
            let items = this.body.querySelectorAll('.cut-item');
            items.forEach(item => item.classList.remove('cut-item'));
        }
        if (clear) {
            this._clip = null;
            this._clipId = null;
            this._updateEditMenu();
        }
    }

    private _copyItem(data?) {
        this._resetClip();
        this._clip = data || this._getClipData();
        this._clip.action = ClipAction.copy;
        this._updateEditMenu();
    }

    private _cutItem(data?) {
        this._resetClip();
        this._clip = data || this._getClipData();
        this._clip.action = ClipAction.cut;
        this._updateEditMenu();
        if (this._clip.type.endsWith('s') && !this._clip.collection)
            this._clipId = `${this._sanitizeID(this._clip.profileName)}-${this._clip.type}`;
        else if (this._clip.type === 'profile')
            this._clipId = `${this._sanitizeID(this._clip.profileName)}`;
        else
            this._clipId = `${this._sanitizeID(this._clip.profileName)}-${this._clip.type === 'alias' ? 'aliase' : this._clip.type}s-${this._clip.index}`;
        if (this.body.querySelector('#' + this._clipId))
            this.body.querySelector('#' + this._clipId).classList.add('cut-item');
    }

    private _getClipData() {
        let data: any = {
            type: 'profile',
            profileName: this._current.profileName
        }
        if (this._current.itemIdx != -1) {
            data.type = this._getItemType();
            data.item = this._current.itemSubIdx !== -1 ? this._current.parent : this._current.item;
            data.index = this._current.itemIdx;
            data.profile = this._current.profile;
            data.collection = this._current.collection;
        }
        else if (this._current.collection.length) {
            data.type = this._current.collection;
            data.items = this._current.item;
            data.profile = this._current.profile;
        }
        return data;
    }

    private _paste() {
        let i;
        let il;
        let item;
        if (!this._clip) return;
        //as long as not same profile and not cutting, as pasting back a cut just leaves it where it started
        if (!(this._clip.profileName === this._current.profileName && this._clip.action === ClipAction.cut)) {
            if (this._clip.type.endsWith('s') && !this._clip.collection) {
                let items = this._clip.items;
                for (i = 0, il = items.length; i < il; i++) {
                    item = items[i].clone();
                    item.profile = this._current.profile;
                    this._addItem(this._clip.type, item);
                }
                if (this._clip.action === ClipAction.cut) {
                    const id = `${this._sanitizeID(this._clip.profileName)}-${this._clip.type}`;
                    this._clip.profile[this._clip.type] = [];
                    this.setBody(this._page);
                    this._menu.querySelector(`#${id} i`).remove();
                    this._menu.querySelector(`#${id} a`).insertAdjacentHTML('afterbegin', '<i class="align-middle float-start no-icon"></i>');
                    if (this._menu.querySelector(`#${id} a`).dataset.lazy !== 'true')
                        this._menu.querySelector(`#${id} .dropdown-menu`).innerHTML = '';
                }
            }
            else if (this._clip.type === 'profile') {
                if (this.profiles.contains(this._clip.profileName)) {
                    const profile = this.profiles.items[this._clip.profileName].clone();
                    profile.name = this._profileCopyName(profile.name);
                    let name = profile.name.toLowerCase();
                    this.profiles.add(profile);
                    this.profiles.SortByPriority();
                    let menuItem = this._profile(name);
                    i = this.profiles.keys.indexOf(name);
                    const menu = document.getElementById('profile-menu');
                    if (i === -1 || i >= menu.children.length)
                        i = menu.children.length - 1;
                    if (i < 0) i = 0;
                    menu.children[i].insertAdjacentHTML("afterend", menuItem);
                    this._profileEvents(menu.children[i + 1]);
                }
            }
            else {
                if (this._clip.action === ClipAction.copy)
                    item = this._clip.item.clone();
                else
                    item = this._clip.item;
                item.profile = this._current.profile;
                this._addItem(this._clip.collection, item);
                if (this._clip.action === ClipAction.cut) {
                    const id = `${this._sanitizeID(this._clip.profileName)}-${this._clip.collection}`;
                    const items = this._clip.profile[this._clip.collection];
                    items.splice(this._clip.index, 1);
                    this._menu.querySelector(`#${id}-${this._clip.index}`).remove();
                    this.setBody(this._page);
                    if (items.length === 0) {
                        this._menu.querySelector(`#${id} i`).remove();
                        this._menu.querySelector(`#${id} a`).insertAdjacentHTML('afterbegin', '<i class="align-middle float-start no-icon"></i>');
                        if (this._menu.querySelector(`#${id} a`).dataset.lazy !== 'true')
                            this._menu.querySelector(`#${id} .dropdown-menu`).innerHTML = '';
                    }
                    else {
                        const menuItems = this._menu.querySelector(`#${id} ul`);
                        let i = menuItems.children.length;
                        const href = `#profiles/${encodeURIComponent(this._clip.profileName)}/${this._clip.collection}/`;
                        let index = this._clip.index;
                        for (; index < i; index++) {
                            const item = menuItems.children[index];
                            item.id = `${id}-${index}`;
                            item.firstChild.href = `${href}${index}`;
                            item.firstChild.children[1].id = `enabled-${id}-${index}`;
                        }
                    }
                }
            }
            this.changed = true;
            //only reset if cut as the data has been moved
            if (this._clip.action === ClipAction.cut)
                this._resetClip(true);
        }
    }

    private _updateEditMenu() {
        this.footer.querySelector(`#${this.id}-paste`).style.display = this._clip && (this._clip.action === ClipAction.copy || this._clip.profileName !== this._current.profileName || this._clip.type === 'profile') ? '' : 'none';
        this.footer.querySelector(`#${this.id}-find-div`).style.display = this.footer.querySelector(`#${this.id}-paste`).style.display === 'none' && this.footer.querySelector(`#${this.id}-cut`).style.display === 'none' && this.footer.querySelector(`#${this.id}-copy`).style.display === 'none' ? 'none' : '';
    }

    public setValue(obj, prop, value) {
        if (value == 'false') value = false;
        if (value == 'true') value = true;
        if (value == 'null') value = null;
        if (value == 'undefined') value = undefined;
        if (typeof value == 'string' && parseFloat(value).toString() == value)
            value = parseFloat(value);
        obj[prop] = this.convertType(value, typeof obj[prop]);
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

    private _updateSmall(width) {
        if (!this.header.querySelector('.breadcrumb')) {
            setTimeout(() => {
                this._updateSmall(width);
            }, 10);
            return;
        }
        if (width < 430) {
            if (this._small) return;
            const item = this.header.querySelector('.breadcrumb');
            item.classList.add('breadcrumb-sm');
            this._small = true;
        }
        else if (this._small) {
            const item = this.header.querySelector('.breadcrumb');
            item.classList.remove('breadcrumb-sm');
            this._small = false;
        }
    }

    private _profileCopyName(name) {
        let n = name;
        let i = 0;
        while (this.profiles.contains(n)) {
            if (i === 0)
                n = name + ' Copy';
            else
                n = name + ' Copy (' + i + ')';
            i++;
        }
        return n
    }

    public loadPage(page) {
        updateHash(page, this._page);
    }
}

export function GetDisplay(arr) {
    if (!arr) return '';
    if (arr.displaytype === 1) {
        /*jslint evil: true */
        const f = new Function('item', 'keyCodeToChar', 'MacroDisplay', arr.display);
        return f(arr, keyCodeToChar, MacroDisplay);
    }
    if ($.isFunction(arr.display))
        return arr.display(arr);
    if ($.isFunction(arr[arr.display]))
        return arr[arr.display](arr);
    if (!arr[arr.display])
        return arr['name'];
    return arr[arr.display];
}