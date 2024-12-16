import '../css/scrollbar.css';
import "../css/scrollbar.theme.css";
import { EventEmitter } from './events';

interface ScrollBarOptions {
    parent?;
    content?;
    type?: ScrollType;
    autoScroll?: boolean;
}

interface ScrollState {
    dragging: boolean;
    dragPosition: number;
    position: number;
}

export enum ScrollType { vertical = 0, horizontal = 1 }

/**
 * Scroll bar control
 *
 * @export
 * @class ScrollBar
 * @extends {EventEmitter}
 */
export class ScrollBar extends EventEmitter {
    private _parent;
    private _content;
    private _contentSize;
    private _parentSize;
    private _percentView;
    private _visible = true;
    private _offset = 0;
    private $padding = 0;
    private _os = { left: 0, top: 0 };
    private _padding = [0, 0, 0, 0];
    private _position: number = 0;
    private _thumbSize: number = 0;
    private _ratio: number = 0;
    private _ratio2: number = 0;

    private _lastMouse: MouseEvent;

    private _maxDrag: number = 0;
    private _wMove;
    private _wUp;
    private _wResize;

    private $resizeObserver;
    private $resizeObserverCache;
    private $observer: MutationObserver;
    private _type: ScrollType = ScrollType.vertical;
    private _autoHide: boolean = false;

    public maxPosition: number = 0;

    public thumb: HTMLElement;
    public track: HTMLElement;
    public scrollSize: number = 0;
    public trackSize: number = 0;
    public trackOffset: number = 0;
    public trackOffsetSize = { width: 0, height: 0 };
    public autoScroll = true;

    public state: ScrollState = {
        dragging: false,
        dragPosition: 0,
        position: 0
    };

    /**
     * set or return the content element
     *
     * @memberof ScrollBar
     */
    get content() { return this._content; }
    set content(value) {
        if (this._content === value) return;
        this._content = value;
        this.resize();
    }

    /**
     * Current size of scroll bar
     *
     * @readonly
     * @type {number}
     * @memberof ScrollBar
     */
    get size(): number { return this._visible ? (this._type === ScrollType.horizontal ? this.track.offsetHeight : this.track.offsetWidth) : 0; }

    /**
     * Current position of the scroll bar
     *
     * @readonly
     * @type {number}
     * @memberof ScrollBar
     */
    get position(): number { return Math.round(this._position - (this._type === ScrollType.horizontal ? this._padding[3] : this._padding[0])); }

    get positionRaw(): number { return this._position - (this._type === ScrollType.horizontal ? this._padding[3] : this._padding[0]); }

    /**
     * An offset amount to adjust the whole scroll bar by that effects total size
     *
     * @type {number}
     * @memberof ScrollBar
     */
    get offset(): number { return this._offset; }
    set offset(value: number) {
        if (value !== this._offset) {
            this._offset = value;
            this.updateLocation();
            this.resize();
        }
    }

    /**
     * A padding amount to adjust the scroll bar by and effects track size
     *
     * @type {number}
     * @memberof ScrollBar
     */
    get padding(): number { return this.$padding; }
    set padding(value: number) {
        if (value !== this.$padding) {
            this.$padding = value;
            this.updateLocation();
            this.resize();
        }
    }

    /**
     * The type of scroll bar, either vertical or horizontal
     *
     * @type {ScrollType}
     * @memberof ScrollBar
     */
    get type(): ScrollType { return this._type; }
    set type(value: ScrollType) {
        if (this._type !== value) {
            this._type = value;
            this.trackOffsetSize = { width: 0, height: 0 };
            if (this._type === ScrollType.horizontal) {
                this.track.classList.add('scroll-horizontal');
                this.track.classList.remove('scroll-vertical');
            }
            else {
                this.track.classList.remove('scroll-horizontal');
                this.track.classList.add('scroll-vertical');
            }
            this.updateLocation();
            this.resize();
        }
    }

    /**
     * Is scroll var visible
     *
     * @type {boolean}
     * @memberof ScrollBar
     */
    get visible(): boolean { return this._visible; }
    set visible(value: boolean) {
        if (!this._visible === value) {
            this._visible = value;
            this.track.style.display = value ? 'block' : 'none';
            this.resize();
        }
    }

    /**
     * is scroll bar at the bottom
     *
     * @readonly
     * @type {boolean}
     * @memberof ScrollBar
     */
    get atBottom(): boolean { return this.position >= this.scrollSize; }

    /**
     * The type of scroll bar, either vertical or horizontal
     *
     * @type {ScrollType}
     * @memberof ScrollBar
     */
    get autohide(): boolean { return this._autoHide; }
    set autohide(value: boolean) {
        if (this._autoHide !== value) {
            this._autoHide = value;
            if (value)
                this.track.classList.add('scroll-auto-hide');
            else
                this.track.classList.remove('scroll-auto-hide');
            this.thumb.style[this._type === ScrollType.horizontal ? 'height' : 'width'] = value ? '50%' : '100%';
        }
    }

    /**
     * Creates an instance of ScrollBar.
     *
     * @param {HTMLElement} [parent] element that will contain the scroll bar
     * @param {HTMLElement} [content] element that will be scrolled, if left off will default to parent
     * @param {ScrollType} [type=ScrollType.vertical] type of scroll bar
     * @memberof ScrollBar
     */
    constructor(options: ScrollBarOptions) {
        super();
        if (options) {
            if (options.hasOwnProperty('autoScroll'))
                this.autoScroll = options.autoScroll;
            this._type = options.type || ScrollType.vertical;
            this.setParent(options.parent, options.content);
        }
        else
            this.type = ScrollType.vertical;
    }

    /**
     * sets the parent element with optional content element
     *
     * @param {HTMLElement} parent element that will contain the scroll bar
     * @param {HTMLElement} [content] element that will be scrolled, if left off will default to parent
     * @memberof ScrollBar
     */
    public setParent(parent: HTMLElement, content?: HTMLElement) {
        if (this.track)
            this._parent.removeChild(this.track);
        this._parent = parent;
        this._content = content || parent;
        this.createBar();
    }

    /**
     * Updates the location of the scroll bar in the parent based on type
     *
     * @private
     * @memberof ScrollBar
     */
    private updateLocation() {
        if (this._type === ScrollType.horizontal) {
            this.track.style.top = '';
            this.track.style.right = (this.offset + this.padding) + 'px';
            this.track.style.left = '0';
            this.track.style.bottom = '0';
            this.track.style.width = 'auto';
            this.track.style.height = '';
            if (this._autoHide)
                this.thumb.style.height = '50%';
            else
                this.thumb.style.height = '100%';
            this.thumb.style.width = '';
            this.thumb.style.bottom = '0';
        }
        else {
            this.track.style.top = '0';
            this.track.style.right = '0';
            this.track.style.left = '';
            this.track.style.bottom = (this.offset + this.padding) + 'px';
            this.track.style.width = '';
            this.track.style.height = 'auto';
            if (this._autoHide)
                this.thumb.style.width = '50%';
            else
                this.thumb.style.width = '100%';
            this.thumb.style.right = '0';
        }
        //this._os = this.elOffset(this.track);
    }

    /**
     * Creates scroll bar elements
     *
     * @private
     * @memberof ScrollBar
     */
    private createBar() {
        this._position = this._type === ScrollType.horizontal ? this._content.scrollLeft : this._content.scrollTop;
        this.track = document.createElement('div');
        this.track.className = 'scroll-track scroll-' + (this._type === ScrollType.horizontal ? 'horizontal' : 'vertical');
        this.track.style.position = 'absolute';
        this.track.style.overflow = 'hidden';
        this.track.addEventListener('mousedown', (e) => {
            if (e.button === 0 && e.buttons) {
                this._lastMouse = e;
                e.preventDefault();
                e.cancelBubble = true;
                this.state.dragging = true;
                this.state.position = 0;
                this.state.dragPosition = (this._type === ScrollType.horizontal ? (e.pageX - this._os.left) : (e.pageY - this._os.top)) - this.state.position;
                this.updatePosition(this.currentPosition());
            }
        });
        this.track.addEventListener('wheel', (event: any) => {
            this.scrollBy(this._type === ScrollType.horizontal ? event.deltaX : event.deltaY);
        }, { passive: true });
        this._parent.appendChild(this.track);

        this.thumb = document.createElement('div');
        this.thumb.className = 'scroll-thumb';
        this.thumb.style.position = 'absolute';
        this.track.appendChild(this.thumb);
        this.updateLocation();
        this.thumb.addEventListener('mousedown', (e) => {
            this._lastMouse = e;
            if (e.button === 0 && e.buttons) {
                e.preventDefault();
                e.cancelBubble = true;
                this.state.dragging = true;
                this.state.position = (this._type === ScrollType.horizontal ? e.pageX : e.pageY) - this.state.dragPosition;
                this.state.dragPosition = (this._type === ScrollType.horizontal ? (e.pageX - this._os.left) : (e.pageY - this._os.top)) - this.state.position;
            }
        });
        this._content.addEventListener('wheel', (event) => {
            this.scrollBy(this._type === ScrollType.horizontal ? event.deltaX : event.deltaY);
        }, { passive: true });
        this._wMove = (e) => {
            this._lastMouse = e;
            if (this.state.dragging) {
                this.updatePosition(this.currentPosition());
            }
        };
        this._wUp = (e) => {
            this._lastMouse = e;
            if (this.state.dragging) {
                this.state.dragging = false;
                this.updatePosition(this.currentPosition());
            }
        };
        this._wResize = (e) => {
            this.resize(true);
        };

        window.addEventListener('mousemove', this._wMove.bind(this));

        window.addEventListener('mouseup', this._wUp.bind(this));

        window.addEventListener('resize', this._wResize.bind(this));
        this.resize(true);
        this.$resizeObserver = new ResizeObserver((entries, observer) => {
            if (entries.length === 0) return;
            if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
                return;
            if (!this.$resizeObserverCache || this.$resizeObserverCache.width !== entries[0].contentRect.width || this.$resizeObserverCache.height !== entries[0].contentRect.height) {
                this.$resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
                this.resize(true);
            }
        });
        this.$resizeObserver.observe(this.track);
        this.$observer = new MutationObserver((mutationsList) => {
            let mutation;
            for (mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    this.updateLayout();
                }
            }
        });
        this.$observer.observe(this.track, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });
        this.updateLayout();
    }

    /**
     * resets the scroll bar to 0 position
     *
     * @memberof ScrollBar
     */
    public reset() {
        this.state = {
            dragging: false,
            dragPosition: 0,
            position: 0
        };
        this.maxPosition = 0;
        this.resize();
        this.updatePosition(0, true);
        this.update();
    }

    /**
     * Updates the scroll bar thumb and drag sizes
     *
     * @memberof ScrollBar
     */
    public update() {
        if (this.scrollSize > 0)
            this.track.classList.remove('scroll-disabled');
        else
            this.track.classList.add('scroll-disabled');
        this._thumbSize = Math.ceil(1 / this._percentView * this.trackSize) || 0;
        if (this._thumbSize > this.trackSize)
            this._thumbSize = this.trackSize;
        if (this._thumbSize < 15)
            this._thumbSize = 15;
        this.thumb.style[this._type === ScrollType.horizontal ? 'width' : 'height'] = this._thumbSize + 'px';
        this._maxDrag = this.trackSize - this._thumbSize;
        if (this._maxDrag <= 0) {
            this._maxDrag = 0;
            this._ratio = 1;
            this._ratio2 = 1;
        }
        else {
            this._ratio = (this._contentSize - this._parentSize) / (this._maxDrag);
            this._ratio2 = (this._maxDrag) / (this._contentSize - this._parentSize);
        }
    }

    /**
     * Scroll by a certain amount
     *
     * @param {number} amount the amount to scroll from current position
     * @returns
     * @memberof ScrollBar
     */
    public scrollBy(amount: number) {
        if (amount === 0) return;
        amount = this.positionRaw + (amount < 0 ? Math.floor(amount) : Math.ceil(amount));
        amount = amount * this._ratio2;
        this.updatePosition(amount);
    }

    /**
     * scroll to an exact position
     *
     * @param {number} position the position to scroll to
     * @memberof ScrollBar
     */
    public scrollTo(position: number) {
        position = (position < 0 ? Math.floor(position) : Math.ceil(position));
        position = position * this._ratio2;
        this.updatePosition(position);
    }

    /**
     * scroll to the end position of the scroll bar
     *
     * @memberof ScrollBar
     */
    public scrollToEnd() {
        this.updatePosition(this.maxPosition);
    }

    /**
     * scroll to the start position
     *
     * @memberof ScrollBar
     */
    public scrollToStart() {
        this.updatePosition(0);
    }

    public pageUp(offset?) {
        offset = offset || 0;
        this.scrollBy(-(this._parentSize - (this._type === ScrollType.horizontal ? this._padding[3] : this._padding[2]) - offset));
    }

    public pageDown(offset?) {
        offset = offset || 0;
        this.scrollBy(this._parentSize - (this._type === ScrollType.horizontal ? this._padding[3] : this._padding[2]) - offset);
    }

    /**
     * resize the scroll bar to the parent
     *
     * @memberof ScrollBar
     */
    public resize(bar?, contentSize?, parentSize?) {
        const bottom = this.atBottom;
        if (this._type === ScrollType.horizontal) {
            this._contentSize = contentSize || this._content.scrollWidth;
            this._parentSize = parentSize || this._content.clientWidth;
            if (bar || !this.trackSize) {
                this.trackSize = this.track.clientWidth;
                this.trackOffset = this.track.clientHeight;
            }
            this.scrollSize = this._contentSize - this._parentSize;
        }
        else {
            this._contentSize = contentSize || this._content.scrollHeight;
            this._parentSize = parentSize || this._content.clientHeight;
            if (bar) {
                this.trackSize = this.track.clientHeight;
                this.trackOffset = this.track.clientWidth;
            }
            this.scrollSize = this._contentSize - this._parentSize;
        }
        if (bar || !this.trackOffsetSize.width)
            this.trackOffsetSize = { height: this.track.offsetHeight, width: this.track.offsetWidth };
        this._percentView = this._contentSize / this._parentSize;
        //not sure why i subtracted from parent size to get maxPosition as it breaks resize and scroll to wne
        this.maxPosition = this._parentSize;// - Math.ceil(1 / this._percentView * this._parentSize);
        if (this.maxPosition < 0)
            this.maxPosition = 0;
        this.update();
        if (bottom && this.autoScroll)
            this.updatePosition(this.maxPosition);
        else
            this.updatePosition(this._position * this._ratio2);
    }

    public updateLayout() {
        /*
        const pc = window.getComputedStyle(this._content);
        this._padding = [
            parseInt(pc.getPropertyValue('padding-top')) || 0,
            parseInt(pc.getPropertyValue('padding-right')) || 0,
            parseInt(pc.getPropertyValue('padding-bottom')) || 0,
            parseInt(pc.getPropertyValue('padding-left')) || 0
        ];
        */
    }

    /**
     * current position of scroll bar
     *
     * @returns
     * @memberof ScrollBar
     */
    public currentPosition() {
        const p = this._type === ScrollType.horizontal ? (this._lastMouse.pageX - this.state.position - this._os.left) : (this._lastMouse.pageY - this.state.position - this._os.top);
        if (p < 0)
            return 0;
        if (p > this.maxPosition)
            return this.maxPosition;
        return p;
    }

    /**
     * update position of scroll bar
     *
     * @private
     * @param {*} p
     * @memberof ScrollBar
     * @fires ScrollBar#scroll
     */
    private updatePosition(p, force?) {
        if (p < 0 || this._maxDrag < 0)
            p = 0;
        else if (p > this._maxDrag)
            p = this._maxDrag;
        const prv = this.position;
        this.thumb.style[this._type === ScrollType.horizontal ? 'left' : 'top'] = p + 'px';
        this.state.dragPosition = p;
        this._position = p * this._ratio;
        if (this._position < 0)
            this._position = 0;
        this.update();
        this.emit('scroll', this.position, prv !== this.position || force);
    }

    /**
     * calculate the offset of an element
     *
     * @private
     * @param {*} elt element to get offset for
     * @returns {position} returns the top and left positions
     * @memberof ScrollBar
     */
    private elOffset(elt) {
        const rect = elt.getBoundingClientRect();
        const bodyElt = document.body;
        return {
            top: rect.top + bodyElt.scrollTop,
            left: rect.left + bodyElt.scrollLeft
        };
    }

    /**
     * remove the scroll bar
     *
     * @memberof ScrollBar
     */
    public dispose() {
        if (this.track)
            this.track.remove();
        window.removeEventListener('mousemove', this._wMove);
        window.removeEventListener('mouseup', this._wUp);
        window.removeEventListener('resize', this._wResize);
    }
}
