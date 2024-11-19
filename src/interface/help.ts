import "../css/help.css";
import { Dialog } from "./dialog";
import { Splitter, Orientation, PanelAnchor } from "./splitter";
import { removeHash, updateHash, closeDropdowns } from "./interface";
import { buildBreadcrumb } from "./breadcrumb";
import { debounce, scrollChildIntoView, capitalize } from "../library";

export class HelpDialog extends Dialog {
    private _menu;
    private _contents;
    private _splitter;
    private _small: boolean = false;
    private _page;
    private _menuData: any[];
    private _md;
    private _path;
    private _lastSelected;
    private _history = [];
    private _current = 0;
    private _client;

    constructor() {
        super(Object.assign({}, client.getWindowState('help') || { center: true }, { title: '<ol class="float-start breadcrumb"><li class="breadcrumb-icon"><i class="bi bi-question-circle" style="margin-right: 2px;"></i></li><li class="breadcrumb-item active">Help</li></ol>', minWidth: 410, noFooter: true }));
        this._client = client;
        this.on('resized', e => {
            this._updateSmall(e.width);
            debounce(() => {
                this._splitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
            }, 25, 'help-resize');
            this._client.setOption('windows.help', e);
        });
        this._client.on('options-loaded', () => {
            this.resetState(this._client.getWindowState('help') || { center: true });
        });
        this.on('closed', () => {
            this._client.setOption('windows.help', this.windowState);
            this._setContents('');
            removeHash(this._page);
            delete this._md;
            this._md = null;
        });
        this.on('canceled', () => {
            this._client.setOption('windows.help', this.windowState);
            removeHash(this._page);
            delete this._md;
            this._md = null;
        });
        this.on('moved', e => {
            this._updateSmall(this.dialog.offsetWidth || this.dialog.clientWidth);
            this._client.setOption('windows.help', e);
        })
        this.on('maximized', () => {
            this._client.setOption('windows.help', this.windowState);
        });
        this.on('restored', () => {
            this._updateSmall(this.dialog.offsetWidth || this.dialog.clientWidth);
            this._client.setOption('windows.help', this.windowState);
            this._splitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
        });
        this.on('shown', () => {
            this._updateSmall(this.dialog.offsetWidth || this.dialog.clientWidth);
            this._client.setOption('windows.help', this.windowState);
            this._splitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
        });

        this.body.style.padding = '10px';
        this._splitter = new Splitter({ id: 'help', parent: this.body, orientation: Orientation.vertical, anchor: PanelAnchor.panel1 });
        if (this._client.getOption('help.split') >= 200)
            this._splitter.SplitterDistance = this._client.getOption('help.split');
        this._splitter.on('splitter-moved', distance => {
            this._client.setOption('help.split', distance);
        });
        this._menu = this._splitter.panel1;
        this._menu.style.overflow = 'hidden';
        this._menu.style.overflowY = 'auto';
        this._contents = document.createElement('iframe');
        this._contents.src = 'about:blank';
        this._contents.addEventListener('load', () => {
            this._contents.contentWindow.document.body.onclick = () => {
                this.focus();
                closeDropdowns();
            }
            let script = this._contents.contentWindow.document.createElement('script');
            script.addEventListener('load', () => {
                this._md = this._contents.contentWindow.markdownit({ html: true, typographer: true });
                let old_render = this._md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
                    return self.renderToken(tokens, idx, options);
                };
                this._md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                    let ref = tokens[idx].attrGet('href');
                    if (ref) {
                        if (ref.startsWith('https:') || ref.startsWith('http:') || ref.startsWith('mailto:'))
                            tokens[idx].attrPush(['target', '_blank']);
                        else {
                            tokens[idx].attrs[tokens[idx].attrIndex('href')][1] = '#';
                            tokens[idx].attrPush(['onclick', `event.preventDefault();openLink('${ref}', 1);return false;`]);
                        }
                    }
                    return old_render(tokens, idx, options, env, self);
                };
            });
            script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js');
            script.setAttribute('type', 'text/javascript');
            this._contents.contentWindow.document.querySelector('head').appendChild(script);
            script = this._contents.contentWindow.document.createElement('link');
            script.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
            script.setAttribute('rel', 'stylesheet');
            this._contents.contentWindow.document.querySelector('head').appendChild(script);
            this._contents.contentWindow.document.openLink = (url, p) => {
                this._lastSelected = document.querySelector('#help-jump-menu option:checked');
                if (url.startsWith('docs/'))
                    url = url.substr(5);
                else if (p)
                    url = this._path + url;
                url = url.split('#');
                url = url[0].substr(0, url[0].length - 3);
                //this.body.querySelector('#help-jump-menu').value = url);
                updateHash('help/' + url, this._page);
            }
            this._contents.contentWindow.document.body.style.margin = '10px';
        });

        this._contents.classList.add('full-page');
        this._contents.style.backgroundColor = 'white';
        this._splitter.panel2.append(this._contents);
        const toolbar = document.createElement('nav');
        toolbar.id = 'help-toolbar';
        toolbar.classList.add('navbar', 'bg-light', 'align-items-center');
        toolbar.innerHTML = `<form class="container-fluid justify-content-start"><div class="btn-group me-2 mb-1" role="group" aria-label="History navigation"><button id="btn-help-back" type="button" class="btn btn-sm btn-outline-secondary" title="Back" disabled><i class="bi bi-arrow-left"></i></button><button id="btn-help-forward" type="button" class="btn btn-sm btn-outline-secondary" title="Forward" disabled><i class="bi bi-arrow-right"></i></button><button id="btn-help-history" type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" disabled><span class="visually-hidden">Toggle Dropdown</span></button><ul class="dropdown-menu" id="help-history-menu"></ul></div><select id="help-jump-menu" class="form-select form-select-sm mb-1" title="Select help topic"></select></form>`;
        //<li><a class="dropdown-item" href="#">Dropdown link</a></li>
        this.body.appendChild(toolbar);
        toolbar.querySelector('#help-jump-menu').addEventListener('change', e => {
            let value = (<HTMLSelectElement>toolbar.querySelector('#help-jump-menu')).value;
            if ((!value || !value.length))
                value = this._lastSelected ? this._lastSelected.value : '';
            else
                this._updateHistory('help/' + value);
            if (!value || !value.length)
                updateHash('help', this._page);
            else
                updateHash('help/' + value, this._page);
        });
        toolbar.querySelector('#btn-help-back').addEventListener('click', () => this._navigate(-1));
        toolbar.querySelector('#btn-help-forward').addEventListener('click', () => this._navigate(1));
        toolbar.querySelector('#btn-help-history').addEventListener('show.bs.dropdown', () => {
            let h = '';
            const menu = document.getElementById('help-history-menu');
            let history = this._history;
            for (let i = 0, il = history.length; i < il; i++)
                h += `<li id="help-history-item-${i}"><a data-index="${i}" class="dropdown-item${i === this._current ? ' active' : ''}" href="#${history[i]}">${toolbar.querySelector(`#help-jump-menu option[value="${history[i].substring(5)}"]`).textContent.trim()}</a></li>`;
            menu.innerHTML = h;
            const items = document.querySelectorAll('[id^="help-history-item"] a');
            for (let i = 0, il = items.length; i < il; i++) {
                items[i].addEventListener('click', e => {
                    this._current = +(<HTMLElement>e.currentTarget).dataset.index;
                });
            }
        });
        toolbar.querySelector('#btn-help-history').addEventListener('shown.bs.dropdown', () => {
            setTimeout(() => {
                let el = toolbar.querySelector('#help-history-menu') as HTMLElement;
                let rect = el.getBoundingClientRect();
                if (rect.height > this.body.clientHeight - 50 && rect.height > 150) {
                    if (this.body.clientHeight - 50 < 150)
                        el.style.height = '150px';
                    else
                        el.style.height = (this.body.clientHeight - 50) + 'px';
                }
            }, 0);
        })
        toolbar.querySelector('#btn-help-history').addEventListener('hidden.bs.dropdown', function () {
            let el = toolbar.querySelector('#help-history-menu') as HTMLElement;
            el.style.height = '';
        });
        this._splitter.panel1.parentElement.style.top = toolbar.offsetHeight + 'px';
        this._splitter.panel2Collapsed = location.hash.indexOf('help-') === -1;
        this._buildMenu();
    }

    public setBody(contents: string, args?: any) {
        if (!this._menuData) {
            setTimeout(() => {
                this.setBody(contents, args);
            }, 10);
            return;
        }
        if (this._page === this.dialog.dataset.path) return;
        this._page = this.dialog.dataset.path;
        if (this._page === 'help')
            this.dialog.dataset.panel = 'left';
        else
            this.dialog.dataset.panel = 'right';
        const pages = this._page.split('/');
        if (!this._history.length || this._history[this._current] !== this._page)
            this._updateHistory(this._page);
        this._expandPath(pages);
        this.body.querySelector('#help-jump-menu').value = pages.slice(1).join('/');
        this.title = buildBreadcrumb(pages, {
            small: this._small, sep: '/', icon: '<i class="bi bi-question-circle" style="margin-right: 2px;"></i>',
            formatter: (item, index) => {
                if (index === 0) return capitalize(item);
                let d = this._menuData.findIndex(value => value.id === pages[1]);
                if (d === -1 || !this._menuData[d])
                    return item;
                if (index === 1 || !this._menuData[d].nodes)
                    return this._menuData[d].text;
                const id = pages.slice(1, index + 1).join('/');
                let d2 = this._menuData[d].nodes.findIndex(value => value.id === id);
                if (d2 === -1)
                    return item;
                return this._menuData[d].nodes[d2].text;
            }
        });
        this._splitter.panel2Collapsed = pages.length < 2;
        if (this._splitter.panel2Collapsed) {
            this._setContents('');
            this._path = '';
        }
        else {
            if (pages.length < 3)
                this._path = '';
            else
                this._path = pages.slice(1, pages.length - 1).join('/') + '/';
            this._loadPage(pages.slice(1).join('/')).then(data => this._setContents(data)).catch(() => this._setContents('<h1 id="empty" style="width: 100%;text-align:center">Help not found for: ' + pages[pages.length - 1] + '.</h1>'));
        }
    }

    private _setContents(contents) {
        if (!this._contents.contentWindow || !this._md) {
            setTimeout(() => {
                this._setContents(contents);
            }, 10);
            return;
        }
        this._contents.contentWindow.document.body.innerHTML = this._md.render(contents);
        this._contents.contentWindow.scroll(0, 0);
        this.emit('content-changed');
    }

    private _sanitizeID(name) {
        return name.toLowerCase().replace(/[^a-z0-9:.-]+/gi, '_');
    }

    private _expandPath(pages, select?) {
        if (!Array.isArray(pages))
            pages = pages.split('/');
        let id;
        let el;
        let expand;
        let po = 0;
        if (pages[0] === 'help')
            po = 1;
        let last = pages.length - 1;
        for (let p = po, pl = pages.length; p < pl; p++) {
            id = this._sanitizeID(pages.slice(po, p + 1).join('/'));
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
                if (!expand || expand.classList.contains('show')) continue;
                el = el.querySelector('i');
                if (el) {
                    el.closest('li').querySelector('.dropdown-menu').classList.toggle('show');
                    el.classList.toggle('bi-chevron-right');
                    el.classList.toggle('bi-chevron-down');
                }
            }
        }

    }

    private _loadPage(page) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'docs/' + page + '.md',
                cache: false,
                type: 'GET',
            }).done(resolve).fail(reject);
        });
    }

    private _menuItem(data, indent?) {
        let menu = '';
        indent = indent || 0;
        let padding = indent * 20 + 16;
        indent++;
        menu += `<li class="nav-item" title="${data.text}" id="${this._sanitizeID(data.id)}">`;
        if (data.nodes && data.nodes.length) {
            menu += `<a data-id="help/${data.id}" style="padding-left: ${padding}px" class="nav-link text-dark" href="#help/${data.id}"><i class="align-middle float-start bi bi-chevron-right"></i> ${data.text}</a>`;
            menu += '<ul class="dropdown-menu dropdown-inline">';
            for (let n = 0, nl = data.nodes.length; n < nl; n++)
                menu += this._menuItem(data.nodes[n], indent);
            menu += '</ul>';
        }
        else
            menu += `<a data-id="help/${data.id}" style="padding-left: ${padding}px" class="nav-link text-dark" href="#help/${data.id}"><i class="align-middle float-start no-icon"></i> ${data.text}</a>`;
        menu += '</li>';
        return menu;
    }

    private _menuItemEvents(item) {
        let items = item.querySelectorAll('.bi-chevron-right');
        let i, il;
        for (i = 0, il = items.length; i < il; i++)
            items[i].addEventListener('click', e => {
                e.target.closest('li').querySelector('.dropdown-menu').classList.toggle('show');
                e.target.classList.toggle('bi-chevron-right');
                e.target.classList.toggle('bi-chevron-down');
                e.preventDefault();
            });
    }

    private _buildMenu() {
        if (this._menuData) return;
        $.ajax({
            url: 'docs/menu.json',
            cache: false,
            type: 'GET',
            dataType: "json",
        }).done(data => {
            this._menuData = data;
            let nav = '';
            for (let m = 0, ml = data.length; m < ml; m++)
                nav += this._menuItem(data[m]);
            this._menu.innerHTML = '<ul class="nav" id="help-menu">' + nav + '</ul>';
            let items = this._menu.querySelectorAll('a');
            for (let i = 0, il = items.length; i < il; i++) {
                this._menuItemEvents(items[i]);
                items[i].addEventListener('click', e => {
                    if (!this._history.length || this._history[this._current] !== e.currentTarget.dataset.id)
                        this._updateHistory(e.currentTarget.dataset.id);
                });
            }
            let ops = ['<option value="">Table of contents</option>'];
            for (let i = 0; i < data.length; i++) {
                ops.push('<option value="', data[i].id, '">', data[i].text, '</option>');
                if (data[i].nodes && data[i].nodes.length)
                    for (let c = 0; c < data[i].nodes.length; c++)
                        ops.push('<option value="', data[i].nodes[c].id, '">&nbsp;&nbsp;&nbsp;&nbsp;', data[i].nodes[c].text, '</option>');
            }
            this.body.querySelector('#help-jump-menu').innerHTML = ops.join('');
        }).fail(err => this._client.error(err));
    }

    private _updateButtons() {
        if (this._current === 0 || this._history.length === 0)
            this.body.querySelector('#btn-help-back').disabled = true;
        else
            this.body.querySelector('#btn-help-back').disabled = false;
        if (this._current === this._history.length - 1 || this._history.length === 0)
            this.body.querySelector('#btn-help-forward').disabled = true;
        else
            this.body.querySelector('#btn-help-forward').disabled = false;
        this.body.querySelector('#btn-help-history').disabled = this._history.length <= 1;
    }

    private _navigate(direction) {
        this._current += direction;
        if (this._current < 0)
            this._current = 0;
        if (this._current >= this._history.length)
            this._current = this._history.length;
        this._updateButtons();
        this.body.querySelector('#help-jump-menu').value = this._history[this._current];
        updateHash(this._history[this._current], this._page);
    }

    private _updateHistory(page) {
        if (this._history.length !== 0)
            this._history.length = this._current + 1;
        this._history.push(page);
        this._current = this._history.length - 1;
        this._updateButtons();
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
}