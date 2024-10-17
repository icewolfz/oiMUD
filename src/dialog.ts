import { EventEmitter } from "./events";
import { debounce } from "./library";

export interface DialogOptions {
    title?: string;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    x?: string | number;
    y?: string | number;
    id?: string;
    buttons?: boolean;
    resizable?: boolean;
    moveable?: boolean;
    maximizable?: boolean;
    noAdaptive?: boolean;
    maximized?: boolean;
    showModal?: boolean;
    show?: boolean | number;
    center?: boolean;
    noFooter?: boolean;
    position?: Position;
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
    private _windowResize = () => {
        //if window resized ensure top left corner is visible
        debounce(() => {
            const styles = document.defaultView.getComputedStyle(this._dialog);
            if (this._state.x > window.innerWidth - 16) {
                this._state.x = (window.innerWidth - 16);
                this._dialog.style.left = this._state.x + "px";
            }
            if (this._state.y > window.innerHeight - 16) {
                this._state.y = (window.innerHeight - 16);
                this._dialog.style.top = this._state.y + "px";
            }
            this.emit('moved', this._state);
        }, 250, this._id + 'dialogResize');
    };

    private resizeDoDrag = e => {
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
    };

    private resizeTouchDrag = e => {
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
    };

    private resizeStopDrag = e => {
        document.documentElement.removeEventListener("mousemove", this.resizeDoDrag);
        document.documentElement.removeEventListener("mouseup", this.resizeStopDrag);
        document.documentElement.removeEventListener("touchmove", this.resizeTouchDrag);
        document.documentElement.removeEventListener("touchend", this.resizeStopDrag);
        const styles = document.defaultView.getComputedStyle(this._dialog);
        this._state.x = parseInt(styles.left, 10);;
        this._state.width = parseInt(styles.width, 10);
        this._state.y = parseInt(styles.top, 10);;
        this._state.height = parseInt(styles.height, 10);
        this._body.style.pointerEvents = '';
        this.emit('resized', this._state);
    }

    private dragMouseDown = e => {
        if (this.maximized) return;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        document.documentElement.addEventListener('mouseup', this.dragMouseUp);
        document.documentElement.addEventListener('mousemove', this.dragMouseMove);
        this._header.style.cursor = 'move';
    };

    private dragTouchStart = e => {
        if (this.maximized) return;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        document.documentElement.addEventListener('touchend', this.dragMouseUp);
        document.documentElement.addEventListener('touchmove', this.dragTouchMove);
        this._header.style.cursor = 'move';
    };

    private dragMouseMove = e => {
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
        if (this._state.x < 16 - this._dialog.clientWidth)
            this._state.x = 16 - this._dialog.clientWidth;
        if (this._state.y < 16 - this._dialog.clientHeight)
            this._state.y = 16 - this._dialog.clientHeight;
        this._dialog.style.left = this._state.x + 'px'
        this._dialog.style.top = this._state.y + 'px'
    };

    private dragTouchMove = e => {
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
        if (this._state.x < 16 - this._dialog.clientWidth)
            this._state.x = 16 - this._dialog.clientWidth;
        if (this._state.y < 16 - this._dialog.clientHeight)
            this._state.y = 16 - this._dialog.clientHeight;
        this._dialog.style.left = this._state.x + 'px'
        this._dialog.style.top = this._state.y + 'px'
    };

    private dragMouseUp = () => {
        document.documentElement.removeEventListener('mouseup', this.dragMouseUp);
        document.documentElement.removeEventListener('mousemove', this.dragMouseMove);
        document.documentElement.removeEventListener('touchend', this.dragMouseUp);
        document.documentElement.removeEventListener('touchmove', this.dragTouchMove);
        this._header.style.cursor = '';
        const styles = document.defaultView.getComputedStyle(this._dialog);
        this._state.x = parseInt(styles.left, 10);;
        this._state.width = parseInt(styles.width, 10);
        this._state.y = parseInt(styles.top, 10);;
        this._state.height = parseInt(styles.height, 10);
        this.emit('moved', this._state);
    };

    public moveable: boolean = true;
    public resizable: boolean = true;
    private _maximizable: boolean = true;

    public get maximizable() { return this._maximizable; }
    public set maximizable(value) {
        if (value === this._maximizable) return;
        this._maximizable = value;
        if (this.maximizable)
            this._dialog.querySelector(`#${this._id}-max`).style.display = '';
        else
            this._dialog.querySelector(`#${this._id}-max`).style.display = 'none';
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
        if (options && 'type' in options && options.type == 1) {
            this._dialog = document.createElement('div');
            this._dialog.open = false;
        }
        else
            this._dialog = document.createElement('dialog');

        if (typeof this._dialog.showModal !== "function") {
            this._dialog.showModal = () => {
                if (this._dialog.open) return;
                this._dialog.style.display = 'block';
                this._dialog.style.visibility = 'visible';
                this._dialog.open = true;
                this._state.show = 2;
                this._dialog.focus();
                this.emit('shown', false);
                if (!this._dialog._keydown) {
                    this._dialog._keydown = e => {
                        if (e.key === 'Escape' && e.srcElement.tagName !== 'TEXTAREA' && e.srcElement.tagName !== 'INPUT' && e.srcElement.tagName !== 'SELECT')
                            this.close();
                    }
                }
                if (!this._dialog.backdrop_) {
                    this._dialog.backdrop_ = document.createElement('div');
                    this._dialog.backdrop_.className = 'backdrop';
                    this._dialog.backdrop_MouseEvent = function (e) {
                        if (!this.hasAttribute('tabindex')) {
                            var fake = document.createElement('div');
                            this.insertBefore(fake, this.firstChild);
                            fake.tabIndex = -1;
                            fake.focus();
                            this.removeChild(fake);
                        }
                        else
                            this.focus();
                        var redirectedEvent = document.createEvent('MouseEvents');
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
                window.document.addEventListener('keydown', this._dialog._keydown);
                this.getMaxZIndex();
                this._dialog.backdrop_.style.zIndex = '' + ++this._state.zIndex;
                this._dialog.style.zIndex = '' + ++this._state.zIndex;
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
                this._dialog.focus();
                this.emit('shown', false);
            };
        }
        if (typeof this._dialog.close !== "function") {
            this._dialog.close = () => {
                this._dialog.style.display = '';
                this._dialog.style.visibility = '';
                this._dialog.open = false;
                this._state.show = 0;
                window.removeEventListener('resize', this._windowResize);
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
        if (options?.buttons)
            footer += `<button id="${this._id}-cancel" type="button" class="float-end btn btn-light" title="Cancel dialog">Cancel</button>
            <button id="${this._id}-ok" type="button" class="float-end btn btn-primary" title="Confirm dialog">Ok</button>`;
        this._dialog.innerHTML = `<div class="dialog-header">
        <button id="${this._id}-header-close" style="padding: 4px;" type="button" class="btn btn-close float-end btn-danger" data-dismiss="modal" title="Close window"></button>
        <button type="button" class="btn btn-light float-end maximize" id="${this._id}-max" title="Maximize window" style="padding: 0 4px;margin-top: -1px;"><i class="bi-arrows-fullscreen"></i></button>
        <div>${options?.title || ''}</div>
    </div>
    <div class="dialog-body"></div>
    <div class="dialog-footer">${footer}</div>`;
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
            document.body.removeChild(this._dialog);
            this._state.show = 0;
            if (this._dialog.backdrop_)
                this._dialog.parentNode.removeChild(this._dialog.backdrop_);
            if (this._dialog._keydown)
                window.document.removeEventListener('keydown', this._dialog._keydown);
            window.removeEventListener('resize', this._windowResize);
            this.emit('closed');
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
            if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' ||
                document.activeElement.tagName === 'iNPUT' ||
                document.activeElement.tagName === 'SELECT')
            ) {
                e.preventDefault();
                return;
            }
            //left true sometimes so lets just always make it false to ensure modal dialogs open right
            this._dialog.open = false;
            document.body.removeChild(this._dialog);
            this._state.show = 0;
            if (this._dialog.backdrop_)
                this._dialog.parentNode.removeChild(this._dialog.backdrop_);
            if (this._dialog._keydown)
                window.document.removeEventListener('keydown', this._dialog._keydown);
            window.removeEventListener('resize', this._windowResize);
            if (this._dialog.returnValue !== 'ok')
                this.emit('canceled');
        });
        document.body.appendChild(this._dialog);

        if (this._maximizable)
            this._dialog.querySelector(`#${this._id}-max`).style.display = '';
        else
            this._dialog.querySelector(`#${this._id}-max`).style.display = 'none';
        if (options?.buttons) {
            this._dialog.querySelector(`#${this._id}-cancel`).addEventListener('click', () => {
                this.close();
            });
            this._dialog.querySelector(`#${this._id}-ok`).addEventListener('click', () => {
                const e = { preventDefault: false };
                this.emit('ok', e);
                if (e.preventDefault) return;
                this._dialog.returnValue = 'ok';
                this._dialog.close();
            });
        }
        this._body = this._dialog.querySelector('[class="dialog-body"]');
        this._title = this._dialog.querySelector('[class="dialog-header"] div');
        this._footer = this._dialog.querySelector('[class="dialog-footer"]');
        this._header = this._dialog.querySelector('[class="dialog-header"]');

        if (this.resizable) {
            this._dialog.classList.add('resizable');
            var right = document.createElement("div");
            right.className = "resizer-right";
            this._dialog.appendChild(right);
            right.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Right) }, false);
            right.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Right) }, { passive: true });

            var bottom = document.createElement("div");
            bottom.className = "resizer-bottom";
            this._dialog.appendChild(bottom);
            bottom.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Bottom) }, false);
            bottom.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Bottom) }, { passive: true });

            var corner = document.createElement("div");
            corner.className = "resizer-se";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Right | ResizeType.Bottom) }, false);
            corner.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Right | ResizeType.Bottom) }, { passive: true });

            corner = document.createElement("div");
            corner.className = "resizer-ne";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Right | ResizeType.Top) }, false);
            corner.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Right | ResizeType.Top) }, { passive: true });

            corner = document.createElement("div");
            corner.className = "resizer-nw";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Left | ResizeType.Top) }, false);
            corner.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Left | ResizeType.Top) }, { passive: true });

            corner = document.createElement("div");
            corner.className = "resizer-sw";
            this._dialog.appendChild(corner);
            corner.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Left | ResizeType.Bottom) }, false);
            corner.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Left | ResizeType.Bottom) }, { passive: true });

            var left = document.createElement("div");
            left.className = "resizer-left";
            this._dialog.appendChild(left);
            left.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Left) }, false);
            left.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Left) }, { passive: true });

            var top = document.createElement("div");
            top.className = "resizer-top";
            this._dialog.appendChild(top);
            top.addEventListener("mousedown", e => { this.initResize(e, ResizeType.Top) }, false);
            top.addEventListener("touchstart", e => { this.initResizeTouch(e, ResizeType.Top) }, { passive: true });
        }

        if (this.moveable) {
            this._dialog.addEventListener('mousedown', () => {
                this.getMaxZIndex();
                this._dialog.style.zIndex = '' + ++this._state.zIndex;
            })
            this._header.addEventListener('mousedown', this.dragMouseDown);
            this._header.addEventListener('touchstart', this.dragTouchStart, { passive: true });
        }

        const styles = document.defaultView.getComputedStyle(this._dialog);
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
        if (options && 'center' in options && options.center)
            this.center();
        if (options && 'position' in options && options.position > 0)
            this.position(options.position);
    }

    private initResize(e, type) {
        if (this.maximized) return;
        const styles = document.defaultView.getComputedStyle(this._dialog);
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
        document.documentElement.addEventListener("mousemove", this.resizeDoDrag, false);
        document.documentElement.addEventListener("mouseup", this.resizeStopDrag, false);
    }

    private initResizeTouch(e, type) {
        if (!e.touches.length || this.maximized) return;
        const styles = document.defaultView.getComputedStyle(this._dialog);
        this._resize.x = e.touches[0].clientX;
        this._resize.width = parseInt(styles.width, 10);
        this._resize.y = e.touches[0].clientY;
        this._resize.height = parseInt(styles.height, 10);
        this._resize.type = type;
        this._resize.minHeight = parseInt(styles.minHeight, 10);
        this._resize.minWidth = parseInt(styles.minWidth, 10);
        var rect = e.target.getBoundingClientRect();
        var x = e.targetTouches[0].clientX - rect.x;
        var y = e.targetTouches[0].clientY - rect.y;
        this._resize.borderHeight = y + parseInt(styles.borderTopWidth);
        this._resize.borderWidth = x + parseInt(styles.borderLeftWidth);
        this._body.style.pointerEvents = 'none';
        document.documentElement.addEventListener("touchmove", this.resizeTouchDrag, false);
        document.documentElement.addEventListener("touchend", this.resizeStopDrag, false);
    }

    public get id() {
        return this._id;
    }

    public set id(value) {
        if (this._id === value) return;
        this._id = value;
        if (this._dialog) {
            const old = this._dialog.id;
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
            document.body.appendChild(this._dialog);
        if (this._dialog.open) return;
        this._dialog.showModal();
        this._state.show = 2;
        window.addEventListener('resize', this._windowResize);
        this.emit('shown', true);
    }

    public show() {
        if (!this._dialog.parentElement)
            document.body.appendChild(this._dialog);
        if (this._dialog.open) return;
        this._dialog.show();
        this._state.show = 1;
        window.addEventListener('resize', this._windowResize);
        this.emit('shown', false);
    }

    public get opened() {
        return this._dialog.open;
    }

    public close() {
        if (!this._dialog.open) return;
        if (this._dialog.backdrop_)
            this._dialog.parentNode.removeChild(this._dialog.backdrop_);
        if (this._dialog._keydown)
            window.document.removeEventListener('keydown', this._dialog._keydown);
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

    public center() {
        this.position(Position.Center);
    }

    public position(position: Position) {
        if (position < 1) return;
        //styles2.width
        let w = this._dialog.clientWidth;
        let h = this._dialog.clientHeight;
        if (!w || !h) {
            const styles = document.defaultView.getComputedStyle(this._dialog);
            w = w || parseInt(styles.width, 10);
            h = h || parseInt(styles.height, 10);
        }
        if ((position & Position.Top) === Position.Top)
            this._state.y = 0;
        else if ((position & Position.Bottom) === Position.Bottom)
            this._state.y = window.innerHeight - h;
        else if ((position & Position.CenterVertical) === Position.CenterVertical)
            this._state.y = (window.innerHeight / 2 - h / 2);

        if ((position & Position.Left) === Position.Left)
            this._state.x = 0;
        else if ((position & Position.Right) === Position.Right)
            this._state.x = window.innerWidth - w;
        else if ((position & Position.CenterHorizontal) === Position.CenterHorizontal)
            this._state.x = (window.innerWidth / 2 - w / 2);

        this._dialog.style.left = this._state.x + 'px';
        this._dialog.style.top = this._state.y + 'px';
        this._state.width = this._dialog.clientWidth;
        this._state.height = this._dialog.clientHeight;
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

    private getMaxZIndex(forceReset?: boolean) {
        const dialogs = document.getElementsByTagName('dialog');
        let d = 0;
        const dl = dialogs.length;
        let i = parseInt(this._dialog.style.zIndex, 10);;
        const order = [];
        for (; d < dl; d++) {
            if (!dialogs[d].style.zIndex || !dialogs[d].style.zIndex.length) continue;
            let z = parseInt(dialogs[d].style.zIndex, 10);
            if (z > i)
                i = z;
            order.push({ z: z, idx: d });
        }
        this._state.zIndex = i;
        if (forceReset || this._state.zIndex > 1000) {
            this._state.zIndex = 100;
            d = 0;
            order.sort((a, b) => ((a.z < b.z) ? -1 : (a.z > b.z ? 1 : 0)))
            for (; d < dl; d++)
                dialogs[order[d].idx].style.zIndex = '' + (this._state.zIndex++);
        }
    }

    public showFooter() {
        this._footer.style.display = '';
        this._body.bottom = '';
    }

    public hideFooter() {
        this._footer.style.display = 'none';
        this._body.style.bottom = '0';
    }
}