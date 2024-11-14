import { EventEmitter } from "../events";
import { debounce } from "../library";

export interface DialogOptions {
    title?: string;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    x?: string | number;
    y?: string | number;
    id?: string;
    buttons?: DialogButtons;
    resizable?: boolean;
    moveable?: boolean;
    maximizable?: boolean;
    noAdaptive?: boolean;
    maximized?: boolean;
    showModal?: boolean;
    show?: boolean | number;
    center?: boolean;
    keepCentered?: boolean;
    noFooter?: boolean;
    position?: Position;
    closeable?: boolean;
    document?: Document;
}

enum ResizeType {
    None = 0,
    Right = 1 << 0,
    Bottom = 1 << 1,
    Left = 1 << 2,
    Top = 1 << 3,
}

enum Position {
    Left = 1 << 0,
    Right = 1 << 1,
    Top = 1 << 2,
    Bottom = 1 << 3,
    CenterVertical = 1 << 4,
    CenterHorizontal = 1 << 5,
    Center = Position.CenterHorizontal | Position.CenterVertical
}

export enum DialogButtons {
    None = 0,
    Ok = 1 << 0,
    Cancel = 1 << 1,
    Yes = 1 << 2,
    No = 1 << 3,
    YesNo = Yes | No,
    Standard = Ok | Cancel
}

export enum DialogIcon {
    question = 1,
    info = 2,
    error = 3,
    exclamation = 4
}

export class Dialog extends EventEmitter {
    private _dialog;
    private _body;
    private _footer;
    private _header;
    private _title;
    private _id;
    private _state = { x: 0, y: 0, height: 0, width: 0, zIndex: 100, maximized: false, show: 0 };
    private _resize = { x: 0, y: 0, height: 0, width: 0, type: ResizeType.None, minHeight: 150, minWidth: 300, borderHeight: 1, borderWidth: 1 };
    private _dragPosition = { x: 0, y: 0 };

    private _resizeObserver;
    private _resizeObserverCache;
    private _observer: MutationObserver;

    private _document;
    private _window;

    private _windowResize = () => {
        //if window resized ensure top left corner is visible
        debounce(() => {
            if (this.keepCentered || (this._state.show === 2 && !this.moveable))
                this.center();
            else
                this.makeVisible();
            if (this._footer.style.display !== 'none')
                this._body.style.bottom = (this._footer.clientHeight + 1) + 'px';
            this.emit('resizing');
        }, 250, this._id + 'dialogResize');
    };

    private _resizeDoDrag = e => {
        let t;
        if ((this._resize.type & ResizeType.Right) === ResizeType.Right) {
            t = this._resize.width + e.clientX - this._resize.x;
            if (t > window.innerWidth) t = window.innerWidth;
            this._dialog.style.width = t + "px";
        }
        if ((this._resize.type & ResizeType.Bottom) === ResizeType.Bottom) {
            t = this._resize.height + e.clientY - this._resize.y;
            if (t > window.innerWidth - 16) t = window.innerHeight - 16;
            this._dialog.style.height = t + "px";
        }
        if ((this._resize.type & ResizeType.Top) === ResizeType.Top) {
            t = this._resize.height - e.clientY + this._resize.y - this._resize.borderHeight;
            if (t + this._resize.borderHeight > window.innerHeight) t = window.innerHeight;
            if (t + this._resize.borderHeight <= this._resize.minHeight) {
                this._dialog.style.height = this._resize.minHeight + "px";
                return;
            }
            this._dialog.style.height = t + "px";
            t = e.clientY;
            if (t > window.innerHeight) t = window.innerHeight;
            this._dialog.style.top = t + "px";
        }
        if ((this._resize.type & ResizeType.Left) === ResizeType.Left) {
            t = this._resize.width - e.clientX + this._resize.x - this._resize.borderWidth;
            if (t + this._resize.borderWidth > window.innerWidth) t = window.innerWidth;
            if (t + this._resize.borderWidth <= this._resize.minWidth) {
                this._dialog.style.width = this._resize.minWidth + "px";
                return;
            }
            this._dialog.style.width = t + "px";
            t = e.clientX;
            if (t > window.innerWidth) t = window.innerWidth;
            this._dialog.style.left = t + "px";
        }
        if (this._footer.style.display !== 'none')
            this._body.style.bottom = (this._footer.clientHeight + 1) + 'px';
        this.emit('resizing');
    };

    private _resizeTouchDrag = e => {
        if (!e.touches.length) return;
        let t;
        if ((this._resize.type & ResizeType.Right) === ResizeType.Right) {
            t = this._resize.width + e.touches[0].clientX - this._resize.x;
            if (t > window.innerWidth) t = window.innerWidth;
            this._dialog.style.width = t + "px";
        }
        if ((this._resize.type & ResizeType.Bottom) === ResizeType.Bottom) {
            t = this._resize.height + e.touches[0].clientY - this._resize.y;
            if (t > window.innerWidth) t = window.innerHeight;
            this._dialog.style.height = t + "px";
        }
        if ((this._resize.type & ResizeType.Top) === ResizeType.Top) {
            t = this._resize.height - e.touches[0].clientY + this._resize.y - this._resize.borderHeight;
            if (t + this._resize.borderHeight > window.innerHeight) t = window.innerHeight;
            if (t + this._resize.borderHeight <= this._resize.minHeight) {
                this._dialog.style.height = this._resize.minHeight + "px";
                return;
            }
            this._dialog.style.height = t + "px";
            t = e.touches[0].clientY;
            if (t > window.innerHeight) t = window.innerHeight;
            this._dialog.style.top = t + "px";
        }
        if ((this._resize.type & ResizeType.Left) === ResizeType.Left) {
            t = this._resize.width - e.touches[0].clientX + this._resize.x - this._resize.borderWidth;
            if (t + this._resize.borderWidth > window.innerWidth) t = window.innerWidth;
            if (t + this._resize.borderWidth <= this._resize.minWidth) {
                this._dialog.style.width = this._resize.minWidth + "px";
                return;
            }
            this._dialog.style.width = t + "px";
            t = e.touches[0].clientX;
            if (t > window.innerWidth) t = window.innerWidth;
            this._dialog.style.left = t + "px";
        }
        if (this._footer.style.display !== 'none')
            this._body.style.bottom = (this._footer.clientHeight + 1) + 'px';
        this.emit('resizing');
    };

    private _resizeStopDrag = e => {
        this._document.documentElement.removeEventListener("mousemove", this._resizeDoDrag);
        this._document.documentElement.removeEventListener("mouseup", this._resizeStopDrag);
        this._document.documentElement.removeEventListener("touchmove", this._resizeTouchDrag);
        this._document.documentElement.removeEventListener("touchend", this._resizeStopDrag);
        const styles = this._window.getComputedStyle(this._dialog);
        this._state.x = parseInt(styles.left, 10);;
        this._state.width = parseInt(styles.width, 10);
        this._state.y = parseInt(styles.top, 10);;
        this._state.height = parseInt(styles.height, 10);
        this._body.style.pointerEvents = '';
        this.emit('resized', this._state);
    }

    private _dragMouseDown = e => {
        if (this.maximized) return;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        this._document.documentElement.addEventListener('mouseup', this._dragMouseUp);
        this._document.documentElement.addEventListener('mousemove', this._dragMouseMove);
        this._header.style.cursor = 'move';
    };

    private _dragTouchStart = e => {
        if (this.maximized) return;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        this._document.documentElement.addEventListener('touchend', this._dragMouseUp);
        this._document.documentElement.addEventListener('touchmove', this._dragTouchMove);
        this._header.style.cursor = 'move';
    };

    private _dragMouseMove = e => {
        let x = this._dragPosition.x - e.clientX;
        let y = this._dragPosition.y - e.clientY;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        this._state.x = this._dialog.offsetLeft - x;
        this._state.y = this._dialog.offsetTop - y;
        if (this._state.x > window.innerWidth - 16)
            this._state.x = window.innerWidth - 16;
        if (this._state.y > window.innerHeight - 16)
            this._state.y = window.innerHeight - 16;
        let size = this._size;
        if (this._state.x < 16 - size.width)
            this._state.x = 16 - size.width;
        if (this._state.y < 16 - size.height)
            this._state.y = 16 - size.height;
        this._dialog.style.left = this._state.x + 'px'
        this._dialog.style.top = this._state.y + 'px'
    };

    private _dragTouchMove = e => {
        if (!e.touches.length) return;
        let x = this._dragPosition.x - e.touches[0].clientX;
        let y = this._dragPosition.y - e.touches[0].clientY;
        this._dragPosition.x = e.touches[0].clientX;
        this._dragPosition.y = e.touches[0].clientY;
        this._state.x = this._dialog.offsetLeft - x;
        this._state.y = this._dialog.offsetTop - y;
        if (this._state.x > window.innerWidth - 16)
            this._state.x = window.innerWidth - 16;
        if (this._state.y > window.innerHeight - 16)
            this._state.y = window.innerHeight - 16;
        let size = this._size;
        if (this._state.x < 16 - size.width)
            this._state.x = 16 - size.width;
        if (this._state.y < 16 - size.height)
            this._state.y = 16 - size.height;
        this._dialog.style.left = this._state.x + 'px'
        this._dialog.style.top = this._state.y + 'px'
    };

    private _dragMouseUp = () => {
        this._document.documentElement.removeEventListener('mouseup', this._dragMouseUp);
        this._document.documentElement.removeEventListener('mousemove', this._dragMouseMove);
        this._document.documentElement.removeEventListener('touchend', this._dragMouseUp);
        this._document.documentElement.removeEventListener('touchmove', this._dragTouchMove);
        this._header.style.cursor = '';
        const styles = this._window.getComputedStyle(this._dialog);
        this._state.x = parseInt(styles.left, 10);;
        this._state.width = parseInt(styles.width, 10);
        this._state.y = parseInt(styles.top, 10);;
        this._state.height = parseInt(styles.height, 10);
        this.emit('moved', this._state);
    };

    public keepCentered: boolean = false;
    public moveable: boolean = true;
    public resizable: boolean = true;
    private _maximizable: boolean = true;
    private _closable: boolean = true;

    public get maximizable() { return this._maximizable; }
    public set maximizable(value) {
        if (value === this._maximizable) return;
        this._maximizable = value;
        if (this.maximizable)
            this._dialog.querySelector(`#${this._id}-max`).style.display = '';
        else
            this._dialog.querySelector(`#${this._id}-max`).style.display = 'none';
    }

    public get closeable() { return this._closable; }
    public set closeable(value) {
        if (value === this._closable) return;
        this._closable = value;
        if (this._closable)
            this._dialog.querySelector(`#${this._id}-header-close`).style.display = '';
        else
            this._dialog.querySelector(`#${this._id}-header-close`).style.display = 'none';
    }

    public set maximized(value: boolean) {
        if (this._state.maximized === value) return;
        this._state.maximized = value;
    }
    public get maximized(): boolean {
        return this._state.maximized;
    }

    constructor(options?: DialogOptions) {
        super();
        this._window = window;
        this._document = options ? options.document || document : document;
        this._window = this._document.defaultView;
        if (options && 'type' in options && options.type == 1) {
            this._dialog = this._document.createElement('div');
            this._dialog.open = false;
        }
        else
            this._dialog = this._document.createElement('dialog');

        if (typeof this._dialog.showModal !== "function") {
            this._dialog.showModal = () => {
                if (this._dialog.open) return;
                this._dialog.style.display = 'block';
                this._dialog.style.visibility = 'visible';
                this._dialog.open = true;
                this._state.show = 2;
                this._dialog.dataset.show = '' + this._state.show;
                if (!this._dialog._keydown) {
                    this._dialog._keydown = e => {
                        if (e.key === 'Escape' && e.srcElement.tagName !== 'TEXTAREA' && e.srcElement.tagName !== 'INPUT' && e.srcElement.tagName !== 'SELECT') {
                            this._dialog.returnValue = 'canceled';
                            this.close();
                        }
                    }
                }
                if (!this._dialog.backdrop_) {
                    this._dialog.backdrop_ = this._document.createElement('div');
                    this._dialog.backdrop_.className = 'backdrop';
                    this._dialog.backdrop_MouseEvent = function (e) {
                        if (!this.hasAttribute('tabindex')) {
                            let fake = this._document.createElement('div');
                            this.insertBefore(fake, this.firstChild);
                            fake.tabIndex = -1;
                            fake.focus();
                            this.removeChild(fake);
                        }
                        else
                            this.focus();
                        let redirectedEvent = this._document.createEvent('MouseEvents');
                        redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window,
                            e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey,
                            e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                        this.dispatchEvent(redirectedEvent);
                        e.stopPropagation();
                    }
                    this._dialog.backdrop_.addEventListener('mouseup', this._dialog.backdrop_MouseEvent.bind(this._dialog));
                    this._dialog.backdrop_.addEventListener('mousedown', this._dialog.backdrop_MouseEvent.bind(this._dialog));
                    this._dialog.backdrop_.addEventListener('click', this._dialog.backdrop_MouseEvent.bind(this._dialog));
                }
                this._dialog.parentNode.insertBefore(this._dialog.backdrop_, this._dialog.nextSibling);
                this._document.addEventListener('keydown', this._dialog._keydown);
            };
        }
        //poly fill functions if not found to fake dialog
        if (typeof this._dialog.show !== "function") {
            this._dialog.show = () => {
                if (this._dialog.open) return;
                this._dialog.style.display = 'block';
                this._dialog.style.visibility = 'visible';
                this._dialog.open = true;
                this._state.show = 1;
                this._dialog.dataset.show = '' + this._state.show;
            };
        }
        if (typeof this._dialog.close !== "function") {
            this._dialog.close = () => {
                this._dialog.style.display = '';
                this._dialog.style.visibility = '';
                this._dialog.open = false;
                this._state.show = 0;
                this._dialog.dataset.show = '' + this._state.show;
                this._window.removeEventListener('resize', this._windowResize);
                this.emit('closed');
            };
        }
        this._dialog.dialog = this;
        if (options && 'id' in options && options.id && options.id.length)
            this._id = options.id;
        else if (!this._id || !this._id.length)
            this._id = 'dialog' + new Date().getTime();
        this._dialog.id = this._id;
        this._dialog.style.zIndex = '100';
        this._dialog.style.margin = '0';
        this._dialog.classList.add('dialog');
        if (!options || !options.noAdaptive)
            this._dialog.classList.add('adaptive');
        if (options && 'moveable' in options)
            this.moveable = options.moveable;
        if (options && 'resizable' in options)
            this.resizable = options.resizable;
        if (options && 'maximizable' in options)
            this._maximizable = options.maximizable;
        if (typeof options?.height === 'number')
            this._dialog.style.height = options.height + 'px';
        else if (options?.height && options?.height.length > 0)
            this._dialog.style.height = options.height;
        else
            this._dialog.style.height = '480px';

        if (typeof options?.minHeight === 'number')
            this._dialog.style.minHeight = options.minHeight + 'px';
        else if (options?.minHeight && options?.minHeight.length > 0)
            this._dialog.style.minHeight = options.minHeight;
        else
            this._dialog.style.minHeight = '150px';

        if (typeof options?.minWidth === 'number')
            this._dialog.style.minWidth = options.minWidth + 'px';
        else if (options?.minWidth && options?.minWidth.length > 0)
            this._dialog.style.minWidth = options.minWidth;
        else
            this._dialog.style.minWidth = '300px';

        if (typeof options?.width === 'number')
            this._dialog.style.width = options.width + 'px';
        else if (options?.width && options?.width.length > 0)
            this._dialog.style.width = options.width;
        else
            this._dialog.style.width = '640px';
        if (typeof options?.y === 'number')
            this._dialog.style.top = options.y + 'px';
        else if (options?.y && options?.y.length > 0)
            this._dialog.style.top = options.y;
        else
            this._dialog.style.top = '0';
        if (typeof options?.x === 'number')
            this._dialog.style.left = options.x + 'px';
        else if (options?.x && options?.x.length > 0)
            this._dialog.style.left = options.x;
        else
            this._dialog.style.left = '0';
        let footer = '';
        if (options && (options.buttons & DialogButtons.Cancel) === DialogButtons.Cancel)
            footer += `<button id="${this._id}-cancel" type="button" class="btn-sm float-end btn btn-light" title="Cancel dialog">Cancel</button>`
        if (options && (options.buttons & DialogButtons.Ok) === DialogButtons.Ok)
            footer += `<button id="${this._id}-ok" type="button" class="btn-sm float-end btn btn-primary" title="Confirm dialog">Ok</button>`;
        if (options && (options.buttons & DialogButtons.No) === DialogButtons.No)
            footer += `<button id="${this._id}-no" type="button" class="btn-sm float-end btn btn-light" title="No">No</button>`
        if (options && (options.buttons & DialogButtons.Yes) === DialogButtons.Yes)
            footer += `<button id="${this._id}-yes" type="button" class="btn-sm float-end btn btn-primary" title="Yes">Yes</button>`;
        this._dialog.innerHTML = `<div class="dialog-header"><button id="${this._id}-header-close" style="padding: 4px;" type="button" class="btn btn-close float-end btn-danger" data-dismiss="modal" title="Close window"></button><button type="button" class="btn btn-light float-end maximize" id="${this._id}-max" title="Maximize window" style="padding: 0 4px;margin-top: -1px;"><i class="bi-arrows-fullscreen"></i></button><div>${options?.title || ''}</div></div><div class="dialog-body"></div><div class="dialog-footer">${footer}</div>`;
        this._dialog.querySelector(`#${this._id}-header-close`).addEventListener('click', () => {
            this.close();
        });
        this._dialog.querySelector(`#${this._id}-max`).addEventListener('click', () => {
            if (!this.maximized)
                this.maximize();
            else
                this.restore();
        });
        this._dialog.addEventListener('close', e => {
            if (e.target !== this._dialog) return;
            const ec = { preventDefault: false };
            this.emit('closing', ec);
            if (ec.preventDefault) {
                e.preventDefault();
                return;
            }
            this._document.body.removeChild(this._dialog);
            this._state.show = 0;
            this._dialog.dataset.show = '' + this._state.show;
            if (this._dialog.backdrop_)
                this._dialog.parentNode.removeChild(this._dialog.backdrop_);
            if (this._dialog._keydown)
                this._window.document.removeEventListener('keydown', this._dialog._keydown);
            this._window.removeEventListener('resize', this._windowResize);
            this.emit('closed', this._dialog.returnValue);
        });
        this._dialog.addEventListener('cancel', e => {
            if (e.target !== this._dialog) return;
            const ec = { preventDefault: false };
            this.emit('canceling', ec);
            if (ec.preventDefault) {
                e.preventDefault();
                return;
            }
            //prevent closing ig in edit field, note this does not stop chrome from closing dialog if esc is pressed multiple times
            if (this._document.activeElement && (this._document.activeElement.tagName === 'TEXTAREA' ||
                this._document.activeElement.tagName === 'iNPUT' ||
                this._document.activeElement.tagName === 'SELECT')
            ) {
                e.preventDefault();
                return;
            }
            //left true sometimes so lets just always make it false to ensure modal dialogs open right
            this._dialog.open = false;
            this._document.body.removeChild(this._dialog);
            this._state.show = 0;
            this._dialog.dataset.show = '' + this._state.show;
            if (this._dialog.backdrop_)
                this._dialog.parentNode.removeChild(this._dialog.backdrop_);
            if (this._dialog._keydown)
                this._window.document.removeEventListener('keydown', this._dialog._keydown);
            this._window.removeEventListener('resize', this._windowResize);
            if (this._dialog.returnValue !== 'ok')
                this.emit('canceled');
        });
        this._document.body.appendChild(this._dialog);

        if (this._maximizable)
            this._dialog.querySelector(`#${this._id}-max`).style.display = '';
        else
            this._dialog.querySelector(`#${this._id}-max`).style.display = 'none';
        if (options && 'closeable' in options)
            this.closeable = options.closeable;
        if (options && (options.buttons & DialogButtons.Cancel) === DialogButtons.Cancel)
            this._dialog.querySelector(`#${this._id}-cancel`).addEventListener('click', () => {
                const e = { preventDefault: false, button: DialogButtons.Cancel };
                this.emit('button-click', e);
                if (e.preventDefault) return;
                this._dialog.returnValue = 'cancel';
                this.close();
            });
        if (options && (options.buttons & DialogButtons.No) === DialogButtons.No)
            this._dialog.querySelector(`#${this._id}-no`).addEventListener('click', () => {
                const e = { preventDefault: false, button: DialogButtons.No };
                this.emit('button-click', e);
                if (e.preventDefault) return;
                this._dialog.returnValue = 'no';
                this.close();
            });
        if (options && (options.buttons & DialogButtons.Ok) === DialogButtons.Ok)
            this._dialog.querySelector(`#${this._id}-ok`).addEventListener('click', () => {
                const e = { preventDefault: false, button: DialogButtons.Ok };
                this.emit('button-click', e);
                if (e.preventDefault) return;
                this._dialog.returnValue = 'ok';
                this._dialog.close();
            });
        if (options && (options.buttons & DialogButtons.Yes) === DialogButtons.Yes)
            this._dialog.querySelector(`#${this._id}-yes`).addEventListener('click', () => {
                const e = { preventDefault: false, button: DialogButtons.Yes };
                this.emit('button-click', e);
                if (e.preventDefault) return;
                this._dialog.returnValue = 'yes';
                this._dialog.close();
            });
        this._body = this._dialog.querySelector('[class="dialog-body"]');
        this._title = this._dialog.querySelector('[class="dialog-header"] div');
        this._footer = this._dialog.querySelector('[class="dialog-footer"]');
        this._header = this._dialog.querySelector('[class="dialog-header"]');

        if (this.resizable) {
            this._dialog.classList.add('resizable');
            let right = this._document.createElement("div");
            right.className = "resizer-right";
            this._dialog.appendChild(right);
            right.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Right) }, false);
            right.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Right) }, { passive: true });

            let bottom = this._document.createElement("div");
            bottom.className = "resizer-bottom";
            this._dialog.appendChild(bottom);
            bottom.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Bottom) }, false);
            bottom.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Bottom) }, { passive: true });

            let corner = this._document.createElement("div");
            corner.className = "resizer-se";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Right | ResizeType.Bottom) }, false);
            corner.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Right | ResizeType.Bottom) }, { passive: true });

            corner = this._document.createElement("div");
            corner.className = "resizer-ne";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Right | ResizeType.Top) }, false);
            corner.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Right | ResizeType.Top) }, { passive: true });

            corner = this._document.createElement("div");
            corner.className = "resizer-nw";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Left | ResizeType.Top) }, false);
            corner.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Left | ResizeType.Top) }, { passive: true });

            corner = this._document.createElement("div");
            corner.className = "resizer-sw";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Left | ResizeType.Bottom) }, false);
            corner.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Left | ResizeType.Bottom) }, { passive: true });

            let left = this._document.createElement("div");
            left.className = "resizer-left";
            this._dialog.appendChild(left);
            left.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Left) }, false);
            left.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Left) }, { passive: true });

            let top = this._document.createElement("div");
            top.className = "resizer-top";
            this._dialog.appendChild(top);
            top.addEventListener("mousedown", e => { this._initResize(e, ResizeType.Top) }, false);
            top.addEventListener("touchstart", e => { this._initResizeTouch(e, ResizeType.Top) }, { passive: true });
        }

        if (this.moveable) {
            this._dialog.addEventListener('mousedown', () => {
                this.focus();
            })
            this._header.addEventListener('mousedown', this._dragMouseDown);
            this._header.addEventListener('touchstart', this._dragTouchStart, { passive: true });
        }

        const styles = this._window.getComputedStyle(this._dialog);
        this._state.x = this._resize.x = parseInt(styles.left, 10);;
        this._state.width = this._resize.width = parseInt(styles.width, 10);
        this._state.y = this._resize.y = parseInt(styles.top, 10);;
        this._state.height = this._resize.height = parseInt(styles.height, 10);
        if (options && 'noFooter' in options && options.noFooter)
            this.hideFooter();
        if (options && 'maximized' in options && options.maximized)
            this.maximize();
        if (options && 'showModal' in options && options.showModal)
            this.showModal();
        else if (options && 'show' in options && options.show) {
            if (options.show === 2)
                this.showModal();
            else
                this.show();
        }
        if ((options && 'keepCentered' in options && options.keepCentered))
            this.keepCentered = options.keepCentered;
        if (this.keepCentered || (options && 'center' in options && options.center))
            this.center();
        if (options && 'position' in options && options.position > 0)
            this.position(options.position);
        this._windowResize();
        this._resizeObserver = new ResizeObserver((entries, observer) => {
            if (entries.length === 0) return;
            if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
                return;
            //debounce(() => {
            if (!this._resizeObserverCache || this._resizeObserverCache.height !== entries[0].contentRect.height) {
                this._resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
                if (this._footer.style.display !== 'none')
                    this._body.style.bottom = (this._footer.clientHeight + 1) + 'px';
            }
            //}, 50, 'resize');
        });
        this._resizeObserver.observe(this._footer);
        this._observer = new MutationObserver((mutationsList) => {
            let mutation;
            for (mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (this._footer.style.display !== 'none')
                        this._body.style.bottom = (this._footer.clientHeight + 1) + 'px';
                }
            }
        });
        this._observer.observe(this._footer, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });
    }

    private _initResize(e, type) {
        if (this.maximized) return;
        const styles = this._window.getComputedStyle(this._dialog);
        this._resize.x = e.clientX;
        this._resize.width = parseInt(styles.width, 10);
        this._resize.y = e.clientY;
        this._resize.height = parseInt(styles.height, 10);
        this._resize.type = type;
        this._resize.minHeight = parseInt(styles.minHeight, 10);
        this._resize.minWidth = parseInt(styles.minWidth, 10);
        this._resize.borderHeight = e.offsetY + parseInt(styles.borderTopWidth);
        this._resize.borderWidth = e.offsetX + parseInt(styles.borderLeftWidth);
        this._body.style.pointerEvents = 'none';
        this._document.documentElement.addEventListener("mousemove", this._resizeDoDrag, false);
        this._document.documentElement.addEventListener("mouseup", this._resizeStopDrag, false);
    }

    private _initResizeTouch(e, type) {
        if (!e.touches.length || this.maximized) return;
        const styles = this._window.getComputedStyle(this._dialog);
        this._resize.x = e.touches[0].clientX;
        this._resize.width = parseInt(styles.width, 10);
        this._resize.y = e.touches[0].clientY;
        this._resize.height = parseInt(styles.height, 10);
        this._resize.type = type;
        this._resize.minHeight = parseInt(styles.minHeight, 10);
        this._resize.minWidth = parseInt(styles.minWidth, 10);
        let rect = e.target.getBoundingClientRect();
        let x = e.targetTouches[0].clientX - rect.x;
        let y = e.targetTouches[0].clientY - rect.y;
        this._resize.borderHeight = y + parseInt(styles.borderTopWidth);
        this._resize.borderWidth = x + parseInt(styles.borderLeftWidth);
        this._body.style.pointerEvents = 'none';
        this._document.documentElement.addEventListener("touchmove", this._resizeTouchDrag, false);
        this._document.documentElement.addEventListener("touchend", this._resizeStopDrag, false);
    }

    public get id() {
        return this._id;
    }

    public set id(value) {
        if (this._id === value) return;
        this._id = value;
        if (this._dialog) {
            this._dialog.id = this._id;
            let el = this._dialog.querySelector(`#${this._id}-cancel`);
            if (el) el.id = this._id + '-cancel';
            el = this._dialog.querySelector(`#${this._id}-ok`);
            if (el) el.id = this._id + '-ok';
            el = this._dialog.querySelector(`#${this._id}-max`);
            if (el) el.id = this._id + '-max';
            el = this._dialog.querySelector(`#${this._id}-header-close`);
            if (el) el.id = this._id + '-header-close';
        }
    }

    public get title() {
        return this._title.innerHTML;
    }
    public set title(value) {
        this._title.innerHTML = value;
    }

    public showModal() {
        if (!this._dialog.parentElement)
            this._document.body.appendChild(this._dialog);
        this.makeVisible(true);
        this._dialog.returnValue = '';
        if (this._dialog.open) {
            this.focus();
            return;
        }
        this._dialog.showModal();
        this._state.show = 2;
        this._dialog.dataset.show = '' + this._state.show;
        this._window.addEventListener('resize', this._windowResize);
        this.emit('shown', true);
        this.focus();
    }

    public show() {
        if (!this._dialog.parentElement)
            this._document.body.appendChild(this._dialog);
        this.makeVisible(true);
        this._dialog.returnValue = '';
        if (this._dialog.open) {
            this.focus();
            return;
        }
        this._dialog.show();
        this._state.show = 1;
        this._dialog.dataset.show = '' + this._state.show;
        this._window.addEventListener('resize', this._windowResize);
        this.emit('shown', false);
        this.focus();
    }

    public get opened() {
        return this._dialog.open;
    }

    public close(returnValue?) {
        if (!this._dialog.open) return;
        if (this._dialog.backdrop_)
            this._dialog.parentNode.removeChild(this._dialog.backdrop_);
        if (this._dialog._keydown)
            this._document.removeEventListener('keydown', this._dialog._keydown);
        if (returnValue)
            this._dialog.returnValue = returnValue;
        this._dialog.close();
    }

    public get header() {
        return this._header;
    }
    public get body() {
        return this._body;
    }
    public get footer() {
        return this._footer;
    }
    public get dialog() {
        return this._dialog;
    }

    public get left() {
        return this._dialog.style.left;
    }
    public set left(value) {
        this._dialog.style.left = value;
    }

    public get top() {
        return this._dialog.style.top;
    }
    public set top(value) {
        this._dialog.style.top = value;
    }

    public get width() {
        return this._dialog.style.width;
    }
    public set width(value) {
        this._dialog.style.width = value;
    }

    public get height() {
        return this._dialog.style.height;
    }
    public set height(value) {
        this._dialog.style.top = value;
    }

    public get windowState() {
        return this._state;
    }

    /*
    private _width() {
        let w = this.dialog.offsetWidth || this._dialog.clientWidth;
        if (!w) {
            const styles = this._window.getComputedStyle(this._dialog);
            w = w || parseInt(styles.width, 10);
        }
        return w;
    }

    private _height() {
        let h = this.dialog.offsetHeight || this._dialog.clientHeight;
        if (!h) {
            const styles = this._window.getComputedStyle(this._dialog);
            h = h || parseInt(styles.height, 10);
        }
        return h;
    }
    */

    private get _size() {
        let w = this._dialog.offsetWidth || this._dialog.clientWidth;
        let h = this._dialog.offsetHeight || this._dialog.clientHeight;
        if (!w || !h) {
            const styles = this._window.getComputedStyle(this._dialog);
            w = w || parseInt(styles.width, 10);
            h = h || parseInt(styles.height, 10);
        }
        return { width: w, height: h };
    }

    public center() {
        this.position(Position.Center);
    }

    public position(position: Position) {
        if (position < 1) return;
        //styles2.width
        let size = this._size;
        if ((position & Position.Top) === Position.Top)
            this._state.y = 0;
        else if ((position & Position.Bottom) === Position.Bottom)
            this._state.y = this._window.innerHeight - size.height;
        else if ((position & Position.CenterVertical) === Position.CenterVertical)
            this._state.y = (this._window.innerHeight / 2 - size.height / 2);

        if ((position & Position.Left) === Position.Left)
            this._state.x = 0;
        else if ((position & Position.Right) === Position.Right)
            this._state.x = this._window.innerWidth - size.width;
        else if ((position & Position.CenterHorizontal) === Position.CenterHorizontal)
            this._state.x = (this._window.innerWidth / 2 - size.width / 2);

        this._dialog.style.left = this._state.x + 'px';
        this._dialog.style.top = this._state.y + 'px';
        this._state.width = size.width;
        this._state.height = size.height;
        this.emit('moved', this._state);
    }

    public maximize() {
        if (this.maximized) return;
        this.maximized = true;
        this._dialog.classList.add('maximized');
        this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.remove('bi-arrows-fullscreen');
        this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.add('bi-arrows-angle-contract');
        this.emit('maximized');
    }

    public restore() {
        if (!this.maximized) return;
        this.maximized = false;
        this._dialog.classList.remove('maximized');
        this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.add('bi-arrows-fullscreen');
        this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.remove('bi-arrows-angle-contract');
        this.emit('restored');
    }

    private _getMaxZIndex(forceReset?: boolean) {
        const dialogs = this._document.getElementsByTagName('dialog');
        let d = 0;
        const dl = dialogs.length;
        let i = parseInt(this._dialog.style.zIndex, 10);;
        const order = [];
        for (; d < dl; d++) {
            if (!dialogs[d].style.zIndex || !dialogs[d].style.zIndex.length) continue;
            let z = parseInt(dialogs[d].style.zIndex, 10);
            if (z > i)
                i = z;
            order.push({ z: z, idx: d, show: parseInt(dialogs[d].dataset.show || '', 10) || 0 });
        }
        this._state.zIndex = i;
        if (forceReset || this._state.zIndex > 1000) {
            this._state.zIndex = 100;
            d = 0;
            //show by show type then old z-index, we do this to ensure modal style dialogs are on top
            order.sort((a, b) => ((a.show > b.show) ? 1 : (a.z < b.z) ? -1 : (a.z > b.z ? 1 : 0)))
            for (; d < dl; d++) {
                if ((<any>dialogs[order[d]]).backdrop_)
                    (<any>dialogs[order[d]]).backdrop_.style.zIndex = '' + (this._state.zIndex++);
                dialogs[order[d].idx].style.zIndex = '' + (this._state.zIndex++);
            }
        }
    }

    public showFooter() {
        this._footer.style.display = '';
        this._body.style.bottom = (this._footer.clientHeight + 1) + 'px';
    }

    public hideFooter() {
        this._footer.style.display = 'none';
        this._body.style.bottom = '0';
    }

    public focus() {
        this._dialog.focus();
        this._getMaxZIndex();
        this._dialog.style.zIndex = '' + ++this._state.zIndex;
        this.emit('focus');
    }

    public makeVisible(full?, silent?) {
        let rect = this._dialog.getBoundingClientRect();
        if (full) {
            if (rect.right > this._window.innerWidth) {
                this._state.x = this._window.innerWidth - this._state.width - 16;
                if (rect.left < 0) this._state.x = 0;
                this._dialog.style.left = this._state.x + "px";
            }
            if (rect.bottom > this._window.innerHeight) {
                this._state.y = this._window.innerHeight - this._state.height - 16;
                if (rect.top < 0) this._state.y = 0;
                this._dialog.style.top = this._state.y + "px";
            }
        }
        else {
            if (rect.left > this._window.innerWidth - 16) {
                this._state.x = (this._window.innerWidth - 16);
                this._dialog.style.left = this._state.x + "px";
            }
            if (rect.top > this._window.innerHeight - 16) {
                this._state.y = (this._window.innerHeight - 16);
                this._dialog.style.top = this._state.y + "px";
            }
        }
        if (!silent)
            this.emit('moved', this._state);
    }

    public resetState(options: DialogOptions) {
        if (typeof options?.height === 'number')
            this._dialog.style.height = options.height + 'px';
        else if (options?.height && options?.height.length > 0)
            this._dialog.style.height = options.height;
        else
            this._dialog.style.height = '480px';

        if (typeof options?.minHeight === 'number')
            this._dialog.style.minHeight = options.minHeight + 'px';
        else if (options?.minHeight && options?.minHeight.length > 0)
            this._dialog.style.minHeight = options.minHeight;
        else
            this._dialog.style.minHeight = '150px';

        if (typeof options?.minWidth === 'number')
            this._dialog.style.minWidth = options.minWidth + 'px';
        else if (options?.minWidth && options?.minWidth.length > 0)
            this._dialog.style.minWidth = options.minWidth;
        else
            this._dialog.style.minWidth = '300px';

        if (typeof options?.width === 'number')
            this._dialog.style.width = options.width + 'px';
        else if (options?.width && options?.width.length > 0)
            this._dialog.style.width = options.width;
        else
            this._dialog.style.width = '640px';
        if (typeof options?.y === 'number')
            this._dialog.style.top = options.y + 'px';
        else if (options?.y && options?.y.length > 0)
            this._dialog.style.top = options.y;
        else
            this._dialog.style.top = '0';
        if (typeof options?.x === 'number')
            this._dialog.style.left = options.x + 'px';
        else if (options?.x && options?.x.length > 0)
            this._dialog.style.left = options.x;
        else
            this._dialog.style.left = '0';

        const styles = this._window.getComputedStyle(this._dialog);
        this._state.x = this._resize.x = parseInt(styles.left, 10);;
        this._state.width = this._resize.width = parseInt(styles.width, 10);
        this._state.y = this._resize.y = parseInt(styles.top, 10);;
        this._state.height = this._resize.height = parseInt(styles.height, 10);
        if (options && 'maximized' in options && options.maximized)
            this.maximize();
        else
            this.restore();
        if (this.keepCentered || (options && 'center' in options && options.center))
            this.center();
        if (options && 'position' in options && options.position > 0)
            this.position(options.position);
        this._windowResize();
    }

    public setBody(contents: string, args?: any) {
        this._body.innerHTML = contents;
        args = args || {};
        const scripts: HTMLScriptElement[] = this._body.querySelectorAll('script');
        for (let s = 0, sl = scripts.length; s < sl; s++) {
            /*jslint evil: true */
            let script = new Function('body', 'dialog', ...Object.keys(args), scripts[s].textContent);
            script.apply(client, [this._body, this, ...Object.values(args), this]);
        }
    }
}

export class AlertDialog extends Dialog {
    constructor(title: string | DialogOptions, message?, icon?: string | DialogIcon, win?: Window) {
        super(typeof title === 'string' ? { title: getIcon(icon || DialogIcon.exclamation) + title, width: 300, height: 150, keepCentered: true, center: true, resizable: false, moveable: false, maximizable: false, buttons: DialogButtons.Ok, document: win ? win.document : document } : title);
        this.body.classList.add('d-flex', 'justify-content-center', 'align-content-center', 'align-items-center');
        if (message)
            this.body.innerHTML = `<div class="text-center" style="width: 64px;height:64px;font-size: 40px;">${getIcon(icon || DialogIcon.exclamation)}</div><div class="ms-3 align-self-center flex-fill">${message}</div></div>`;
    }
}


export class ConfirmDialog extends Dialog {
    constructor(title: string | DialogOptions, message?, icon?: string | DialogIcon, buttons?: DialogButtons, win?: Window) {
        super(typeof title === 'string' ? { title: getIcon(icon || DialogIcon.question) + title, width: 300, height: 150, keepCentered: true, center: true, resizable: false, moveable: false, maximizable: false, buttons: buttons === undefined ? DialogButtons.YesNo : buttons, document: win ? win.document : document } : title);
        this.body.classList.add('d-flex', 'justify-content-center', 'align-content-center', 'align-items-center');
        if (message)
            this.body.innerHTML = `<div class="text-center" style="width: 64px;height:64px;font-size: 40px;">${getIcon(icon || DialogIcon.question)}</div><div class="ms-3 align-self-center flex-fill">${message}</div></div>`;
    }
}

export class ProgressDialog extends Dialog {
    private _progress;
    constructor(title: string | DialogOptions, message?, icon?: string | DialogIcon, win?: Window) {
        super(typeof title === 'string' ? { title: getIcon(icon || DialogIcon.question) + title, width: 300, height: 150, keepCentered: true, center: true, resizable: false, moveable: false, maximizable: false, buttons: DialogButtons.Cancel, closeable: false, document: win ? win.document : document } : title);
        this.body.classList.add('text-center', 'justify-content-center', 'align-content-center', 'align-items-center');
        this.body.innerHTML = `<div class="align-self-center flex-fill" id="progress-message" style="padding:0 5px">${message || ''}</div></div><div class="progress" role="progressbar" aria-label="${title}" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="margin: 5px;"><div class="progress-bar" style="width: 0%"></div></div>`;
        this._progress = this.body.querySelector('.progress-bar');
    }

    public set label(value) {
        this._progress.innerHTML = value;
    }
    public get label() { return this._progress.innerHTML; }
    public set progress(value: number) {
        if (value < 0) value = 0;
        if (value > 100) value = 100;
        this._progress.style.width = value + '%';
    }
    public get progress() {
        return parseInt(this._progress.style.width, 10);
    }

    public get message() { return this.body.querySelector('#progress-message').textContent; }
    public set message(value) { this.body.querySelector('#progress-message').textContent = value; }
}

function getIcon(icon: string | DialogIcon) {
    if (typeof icon === 'string')
        return icon + ' ';
    switch (icon) {
        case DialogIcon.error:
            return '<i class="fa-regular fa-circle-xmark"></i> ';
        case DialogIcon.exclamation:
            return '<i class="fa-solid fa-circle-exclamation"></i> ';
        case DialogIcon.question:
            return '<i class="fa-regular fa-circle-question"></i> '
    }
    return '<i class="fa-solid fa-circle-info"></i> ';
}

window.confirm_box = (title, message?, icon?, buttons?, win?) => {
    return new Promise((resolve, reject) => {
        const confirm = new ConfirmDialog(title, message, icon, buttons, win);
        confirm.showModal();
        confirm.on('button-click', e => resolve(e));
        confirm.on('canceled', () => reject(null));
        confirm.on('closed', reason => reason === 'Yes' ? 0 : reject(null));
    });

}
window.alert_box = (title, message?, icon?, win?) => {
    new AlertDialog(title, message, icon, win).showModal();
}
window.progress_box = (title, message?, icon?, win?) => {
    return new ProgressDialog(title, message, icon, win);
}

window.Dialog = Dialog;