import { EventEmitter } from '../events';
import { MenuItem } from '../types';

export class Contextmenu extends EventEmitter {
    private _items: MenuItem[];
    private _menu;
    private _id;

    constructor(items?: MenuItem[], id?) {
        super();
        this._items = items || [];
        this._id = id || new Date().getTime();
        this._createMenu();
    }

    private _createMenu() {
        if (!this._menu) {
            let menu: any = `<ul id="${this._id}" class="dropdown-menu show">`;
            for (let i = 0, il = this._items.length; i < il; i++) {
                menu += `<li><a class="dropdown-item" data-index="${i}" href="#">${this._items[i].name}</a></li>`;
            }
            menu += '</ul>';
            document.body.insertAdjacentHTML('afterend', menu);
            this._menu = document.getElementById(this._id);
        }
        let items = this._menu.querySelectorAll('li a');
        for (let i = 0, il = items.length; i < il; i++) {
            items[i].addEventListener('click', e => {
                let index = +e.currentTarget.dataset.index;
                if (typeof this._items[index].action === 'function')
                    (this._items[index].action as any)(this._items[i], e);
                this._cleanUp();
            });
        }
    }

    private _cleanUp = () => {
        window.removeEventListener('click', this._cleanUp);
        window.removeEventListener('mousedown', this._mouseup);
        window.removeEventListener('keydown', this._cleanUp);
        if (this._menu)
            this._menu.remove();
    }
    private _mouseup = e => {
        if(this._menu.contains(e.srcElement)) return;
        this._cleanUp()
    }

    public close() {
        this._cleanUp();
    }

    public show(x, y) {
        this._menu.style.left = x + 'px';
        this._menu.style.top = y + 'px';
        this._menu.style.display = 'block';
        this._menu.style.position = 'absolute';
        setTimeout(() => {
            window.addEventListener('click', this._cleanUp);
            window.addEventListener('mousedown', this._mouseup);
            window.addEventListener('keydown', this._cleanUp);
        }, 100);
    }

    static popup(items, x, y) {
        new Contextmenu(items).show(x, y);
    }
}