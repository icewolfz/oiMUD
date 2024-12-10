import '../css/ansi.css';
import '../css/display.css';
import { EventEmitter } from './events';
import { Parser } from './parser';
import { Size, DisplayOptions, ParserLine, FormatType, FontStyle, Point } from './types';
import { htmlEncode, formatUnit, getScrollbarWidth, debounce } from './library';

declare let moment;

/**
 * Contains parsed line data
 */
interface LineData {
    text: string;       //the line text
    formats: any[];     //the line formatting data
    raw: string;        //the raw line data including all ansi codes
    id: number;         //unique id for line
    timestamp: number;  //timestamp the line was added
}

export enum UpdateType {
    none = 0,
    update = 1 << 0,
    display = 1 << 1,
    trim = 1 << 2,
    scrollEnd = 1 << 3,
    updateWindow = 1 << 4,
    rebuildLines = 1 << 5,
    split = 1 << 6,
    toggleSplit = 1 << 7
}

export enum TimeStampStyle {
    None = 0,
    Simple = 1,
    Format = 2
}

export class Display extends EventEmitter {
    //#region Private properties
    private _model: DisplayModel;
    private _container: HTMLElement;
    private _view: HTMLElement;
    private _updating: UpdateType = UpdateType.none;
    private _enableDebug: boolean = false;
    private _lastMouse: MouseEvent;
    private _character: HTMLElement;
    private _charHeight: number;
    private _charWidth: number;
    private _innerHeight;
    private _maxView: number = 0;
    private _padding = [0, 0, 0, 0];
    private _enableColors: boolean = true;
    private _enableBackgroundColors: boolean = true;
    private _hideTrailingEmptyLine = true;
    private _styles: HTMLStyleElement;
    private _maxLines: number = 500;
    private _wordWrap = false;
    private _indent: number = 4;
    private _indentPadding: number = 0;
    private _wrapAt: number = 0;
    private _split;
    private _splitHeight: number;
    public splitLive: boolean = false;

    private _linkFunction;
    private _mxpLinkFunction;
    private _mxpSendFunction;
    private _mxpTooltipFunction;
    private _scrollAtEnd = false;

    private _resizeObserver;
    private _resizeObserverCache;
    private _observer: MutationObserver;

    private _wResize;
    private _wUp;
    private _wMove;
    private _selectionChange;

    private _lineCache: string[] = [];
    private _expireCache: number[] = [];

    private _timestamp: TimeStampStyle = TimeStampStyle.None;
    private _timestampFormat: string = '[[]MM-DD HH:mm:ss.SSS[]] ';
    private _timestampWidth: number = new Date().toISOString().length + 1;
    private _mouseDown = 0;
    private _document: Document;
    private _window: Window;
    private _scrollLock: boolean = false;
    private _selection = { start: null, end: null, timer: null };
    private _trackSelection = { down: null, up: null }
    private _customSelection: boolean = true;
    private _highlightRange;
    private _highlight;
    private _bounds;
    //cache scroll sizes as hardly changes once loaded
    private _hWidth;
    private _vWidth;
    private _dragPrevent;

    private get _horizontalScrollBarHeight() {
        return (this._view.scrollWidth > this._view.clientWidth ? this._hWidth : 0);
    }
    private get _verticalScrollBarHeight() {
        return this._vWidth;
    }
    //#endregion
    //#region Public properties
    get customSelection() { return this._customSelection || this._split }
    set customSelection(value) {
        if (value === this._customSelection) return;
        this._customSelection = value;
        if (!value && this._selection.timer) {
            this._window.clearTimeout(this._selection.timer);
            this._selection.timer = null;
        }
        if (value || this._split)
            this._container.style.userSelect = 'none';
        else
            this._container.style.userSelect = 'auto';
        this._updateSelectionHighlight();
    }

    get scrollLock() { return this._scrollLock; }
    set scrollLock(value) {
        if (this._scrollLock === value) return;
        this._scrollLock = value;
        if (!this._scrollLock && this._split && this._split.visible) {
            this.scrollDisplay(true);
        }
        else if (this._scrollLock && this._split && !this._split.visible)
            this.scrollUp();
    }

    get showTimestamp() { return this._timestamp; }
    set showTimestamp(value: TimeStampStyle) {
        if (value === this._timestamp) return;
        if (typeof value === 'boolean')
            this._timestamp = value ? TimeStampStyle.Format : TimeStampStyle.None;
        this._timestamp = value;
        if (!moment || this._timestamp !== TimeStampStyle.Format)
            this._timestampWidth = new Date().toISOString().length + 1;
        else
            this._timestampWidth = moment().format(this._timestampFormat).length;
        this._buildStyleSheet();
        this._doUpdate(UpdateType.display | UpdateType.update | UpdateType.rebuildLines | UpdateType.split);
    }

    get timestampFormat() { return this._timestampFormat; }
    set timestampFormat(value: string) {
        if (this._timestampFormat === value) return;
        this._timestampFormat = value;
        if (!moment || this._timestamp !== TimeStampStyle.Format)
            this._timestampWidth = new Date().toISOString().length + 1;
        else
            this._timestampWidth = moment().format(this._timestampFormat).length;
        this._doUpdate(UpdateType.display | UpdateType.rebuildLines | UpdateType.updateWindow | UpdateType.update | UpdateType.split);
    }

    get wordWrap(): boolean {
        return this._wordWrap;
    }

    set wordWrap(value: boolean) {
        if (value === this._wordWrap) return;
        this._wordWrap = value;
        this._buildStyleSheet();
        this._doUpdate(UpdateType.update | UpdateType.split);
    }

    get wrapAt() { return this._wrapAt; }
    set wrapAt(value: number) {
        if (value === this._wrapAt) return;
        this._wrapAt = value;
        this._buildStyleSheet();
        this._doUpdate(UpdateType.update | UpdateType.display | UpdateType.split);
    }

    get indent() { return this._indent; }
    set indent(value: number) {
        if (value === this._indent)
            return;
        this._indent = value;
        this._buildStyleSheet();
        this._doUpdate(UpdateType.update | UpdateType.display | UpdateType.split);
    }

    get splitHeight(): number { return this._splitHeight; }
    set splitHeight(value: number) {
        if (this._splitHeight !== value) {
            this._splitHeight = value;
            let h = this._horizontalScrollBarHeight - this._padding[2];
            if (this._splitHeight <= this._bounds.top + 150)
                this._splitHeight = 150;
            else if (this._splitHeight > this._bounds.bottom - 150 - h)
                this._splitHeight = this._bounds.height - 150 - h;
            this._updateSplitLocation();
        }
    }

    get enableSplit(): boolean { return this._split === null; }
    set enableSplit(value: boolean) {
        const id = this.id;
        if (!this._split && value) {
            this._split = {
                _view: document.createElement('div'),
                _bar: document.createElement('div'),
                visible: false
            }
            this._split._view.id = id + '-split-view';
            this._split._view.classList.add('view', 'display-split-view');
            this._split._view.style.right = this._verticalScrollBarHeight + 'px';
            this._split._bar.id = id + '-split-bar';
            this._split._bar.classList.add('display-split-bar', 'user-select-none');
            this._view.insertAdjacentElement('afterend', this._split._view);
            this._container.insertAdjacentElement('afterbegin', this._split._bar);
            this._updateSplitLocation();
            this._split._bar.style.right = this._verticalScrollBarHeight + 'px';
            this._split._bar.style.top = (this._view.clientHeight - this._split._view.clientHeight - this._horizontalScrollBarHeight) + 'px';
            this._split._bar.addEventListener('mousedown', (e) => {
                if (e.buttons !== 1) return;
                e.preventDefault();
                e.cancelBubble = true;
                this._split.ghostBar = document.createElement('div');
                this._split.ghostBar.id = id + '-split-ghost-bar';
                this._split.ghostBar.classList.add('display-split-ghost-bar');
                this._split.ghostBar.style.top = this._split._bar.style.top;
                this._split.ghostBar.style.display = 'block';
                this._split.ghostBar.style.right = this._verticalScrollBarHeight + 'px';
                this._container.appendChild(this._split.ghostBar);
                const bounds = this._bounds;
                let hm = this._horizontalScrollBarHeight - this._padding[2];

                this._split.mouseMove = (e) => {
                    e.preventDefault();
                    e.cancelBubble = true;
                    e.stopPropagation();
                    if (e.pageY < bounds.top + 150)
                        this._split.ghostBar.style.top = '150px';
                    else if (e.pageY > bounds.bottom - 150 - hm)
                        this._split.ghostBar.style.top = (bounds.height - 150 - hm) + 'px';
                    else
                        this._split.ghostBar.style.top = (e.pageY - bounds.top) + 'px';

                    if (this.splitLive) {
                        let h;
                        if (e.pageY < bounds.top + 150)
                            h = 150;
                        else if (e.pageY > bounds.bottom - 150 - hm)
                            h = bounds.height - 150 - hm;
                        else
                            h = e.pageY - bounds.top;
                        this._split._view.style.top = h + 'px';
                        this._split._bar.style.top = (this._view.clientHeight - this._split._view.clientHeight) + 'px';
                        this._split._view.scrollTop = this._split._view.scrollHeight;
                        this.emit('split-move', h);
                    }
                };
                this._container.addEventListener('mousemove', this._split.mouseMove);
                this._container.addEventListener('mouseup', this._split.moveDone);
            });

            this._split.moveDone = (e) => {
                if (this._split.ghostBar) {
                    const bounds = this._bounds;
                    let hm = this._horizontalScrollBarHeight - this._padding[2];
                    let h;
                    if (e.pageY < bounds.top + 150)
                        h = 150;
                    else if (e.pageY > bounds.bottom - 150 - hm)
                        h = bounds.height - 150 - hm;
                    else
                        h = e.pageY - bounds.top;
                    this._split._view.style.top = h + 'px';
                    this._split._bar.style.top = (this._view.clientHeight - this._split._view.clientHeight) + 'px';
                    this._split._view.scrollTop = this._split._view.scrollHeight;
                    this._splitHeight = h;
                    this._container.removeChild(this._split.ghostBar);
                    delete this._split.ghostBar;
                    this.emit('split-move-done', h);
                }
                this._container.removeEventListener('mousemove', this._split.mouseMove);
                this._container.removeEventListener('mouseup', this._split.moveDone);
                this._split.mouseMove = null;
            };
            this._split._view.addEventListener('mousedown', (e) => {
                this._container.focus();
                this.emit('mousedown', e);
                if (e.button === 0) {
                    e.preventDefault();
                    this._mouseDown = 2;
                    if (e.shiftKey && this._trackSelection.down)
                        this._endSelection(e);
                    else
                        this._startSelection(e);
                    this._split._bar.style.pointerEvents = 'none';
                }
                else if (e.button === 2 && this._trackSelection.down) {
                    if (!this._selection.start) this._setSelection();
                    let caret = this._getMouseEventCaretRange(e);
                    let range = this._document.createRange();
                    range.setStart(this._selection.start.node, this._selection.start.offset);
                    range.setEnd(this._selection.end.node, this._selection.end.offset);
                    if ((caret.offsetNode && range.intersectsNode(caret.offsetNode)) || (caret.startContainer && range.intersectsNode(caret.startContainer))) {
                        if (e.shiftKey)
                            this._endSelection(e);
                        else
                            this._setSelection();
                    }
                    else if (e.shiftKey)
                        this._endSelection(e);
                    else
                        this.clearSelection();
                }
            });
            this._split._view.addEventListener('mousemove', e => {
                if (this._mouseDown) {
                    this._lastMouse = e;
                    this._endSelection(e);
                    //when near edge of view start auto scroll
                    this._createScrollTimer();
                }
            });

            this._split._view.addEventListener('mouseleave', e => {
                if (this._mouseDown && e.toElement !== this._split._bar && e.target !== this._split._bar && (e.pageX >= this._split._bounds.right || e.pageY >= this._bounds.bottom - this._horizontalScrollBarHeight)) {
                    this._lastMouse = e;
                    if (this.customSelection) {
                        this._trackSelection.up = this._getMouseEventCaretRange(e) || this._document.createRange();
                        this._trackSelection.up.setStart(this._split._view.lastChild, this._split._view.lastChild.childNodes.length);
                        this._trackSelection.up.setEnd(this._split._view.lastChild, this._split._view.lastChild.childNodes.length);
                        this._setSelection();
                    }
                }
            });
            this._split._view.addEventListener('mouseenter', e => {
                if (this._mouseDown && (e.buttons & 1) !== 1) {
                    this._clearMouseDown(e);
                }
                else if (this._mouseDown) {
                    this._lastMouse = e;
                    this._createScrollTimer();
                    this._endSelection(e);
                }
            });
            this._split._view.addEventListener('mouseup', (e) => {
                this.emit('mouseup', e);
                if (e.button === 0)
                    this._clearMouseDown(e);
                if (e.detail === 2)
                    this._setSelectionRange(this.getWordRangeFromPosition(e.pageX, e.pageY));
                else if (e.detail === 3)
                    this._setSelectionRange(this.getLineRangeFromPosition(e.pageX, e.pageY));
                else if (e.detail === 4)
                    this.selectAll();
                if (!e.button)
                    this._view.click();
            });
            this._split._view.addEventListener('wheel', e => {
                const delta = e.deltaY || e.wheelDelta;
                this._view.scrollTop += delta;
            }, { passive: true });
            this._toggleSplit();
            this._doUpdate(UpdateType.split | UpdateType.toggleSplit);
        }
        else if (this._split && !value) {
            this._container.removeEventListener('mouseup', this._split.moveDone);
            this._container.removeEventListener('mouseleave', this._split.moveDone);
            this._container.removeChild(this._split._view);
            this._container.removeChild(this._split._bar);
            this._split = null;
        }
        if (this.customSelection)
            this._container.style.userSelect = 'none';
        else
            this._container.style.userSelect = 'auto';
    }

    get linkFunction(): string {
        return this._linkFunction || 'doLink';
    }

    set linkFunction(val: string) {
        this._linkFunction = val;
    }

    get mxpLinkFunction(): string {
        return this._mxpLinkFunction || 'doMXPLink';
    }

    set mxpLinkFunction(val: string) {
        this._mxpLinkFunction = val;
    }

    get mxpSendFunction(): string {
        return this._mxpSendFunction || 'doMXPSend';
    }

    set mxpSendFunction(val: string) {
        this._mxpSendFunction = val;
    }

    get mxpTooltipFunction(): string {
        return this._mxpTooltipFunction || 'doMXPTooltip';
    }

    set mxpTooltipFunction(val: string) {
        this._mxpTooltipFunction = val;
    }

    get id() {
        if (this._container) return this._container.id;
        return '';
    }

    get container(): HTMLElement {
        return this._container;
    }

    get lines(): LineData[] {
        return this._model.lines;
    }

    get model() { return this._model; }
    set model(value: DisplayModel) {
        if (this._model === value) return;
        //if model set remove all listeners
        if (this._model)
            this._model.removeAllListeners();
        //set model and assign all the events needed
        this._model = value;
        this._model.on('debug', this.debug, this);
        this._model.on('bell', () => { this.emit('bell'); });
        this._model.on('add-line', data => { this.emit('add-line', data); });
        this._model.on('add-line-done', data => { this.emit('add-line-done', data); });
        this._model.on('line-added', (data, noUpdate) => {
            this._lineCache.push(this.getLineHTML(data.idx));
        });
        this._model.on('expire-links', args => {
            if (this._expireCache.length) {
                for (let x = 0, xl = this._expireCache.length; x < xl; x++)
                    this._rebuildLine(this._expireCache[x]);
            }
            this._expireCache = [];
            this.emit('expire-links');
        });
        this._model.on('parse-done', () => {
            //little speed op if more lines then can display lets just skip the trim for a boost
            //this would be a rare edge case and mostly from large file sending
            if (this._lineCache.length >= this._maxLines) {
                const amt = this.lines.length - this._maxLines;
                this._lineCache.slice(this._lineCache.length - this._maxLines);
                this._view.innerHTML = this._lineCache.join('');
                this._model.removeLines(0, amt);
            }
            else
                this._view.insertAdjacentHTML('beforeend', this._lineCache.join(''));
            this._lineCache = [];
            this._doUpdate(UpdateType.display | UpdateType.split);
            this.emit('parse-done');
        });

        this._model.on('set-title', (title, type) => {
            this.emit('set-title', title, type);
        });
        this._model.on('music', (data) => {
            this.emit('music', data);
        });
        this._model.on('sound', (data) => {
            this.emit('sound', data);
        });

        this._model.on('MXP-tag-reply', (tag, args) => {
            this.emit('MXP-tag-reply', tag, args);
        });

        this._model.on('expire-link-line', idx => {
            this._expireCache.push(idx);
            this._doUpdate(UpdateType.display | UpdateType.split);
        });
    }

    get maxLines(): number { return this._maxLines; }
    set maxLines(value: number) {
        if (value !== this._maxLines) {
            this._maxLines = value;
            this._doUpdate(UpdateType.trim);
        }
    }

    get enableDebug(): boolean {
        return this._enableDebug;
    }

    get enableColors() { return this._enableColors; }
    set enableColors(value) {
        if (value === this._enableColors) return;
        this._enableColors = value;
        this._buildStyleSheet();
    }

    get enableBackgroundColors() { return this._enableBackgroundColors; }
    set enableBackgroundColors(value) {
        if (value === this._enableBackgroundColors) return;
        this._enableBackgroundColors = value;
        this._buildStyleSheet();
    }

    get hideTrailingEmptyLine() { return this._hideTrailingEmptyLine; }
    set hideTrailingEmptyLine(value) {
        if (value === this._hideTrailingEmptyLine) return;
        this._hideTrailingEmptyLine = value;
        this._doUpdate(UpdateType.display);
    }

    set enableDebug(enable: boolean) {
        this._enableDebug = enable;
        this._model.enableDebug = enable;
    }

    get tabWidth(): number {
        return this._model.tabWidth;
    }

    set tabWidth(value) {
        this._model.tabWidth = value;
    }

    get textLength(): number {
        return this._model.textLength;
    }

    get EndOfLine(): boolean {
        return this._model.EndOfLine;
    }

    get parseQueueLength(): number {
        return this._model.parseQueueLength;
    }

    get parseQueueEndOfLine(): boolean {
        return this._model.parseQueueEndOfLine;
    }

    get EndOfLineLength(): number {
        if (this.lines.length === 0)
            return 0;
        return this.lines[this.lines.length - 1].text.length;
    }

    set enableFlashing(value: boolean) {
        this._model.enableFlashing = value;
    }
    get enableFlashing(): boolean {
        return this._model.enableFlashing;
    }

    set enableMXP(value: boolean) {
        this._model.enableMXP = value;
    }
    get enableMXP(): boolean {
        return this._model.enableMXP;
    }

    set showInvalidMXPTags(value: boolean) {
        this._model.showInvalidMXPTags = value;
    }
    get showInvalidMXPTags(): boolean {
        return this._model.showInvalidMXPTags;
    }

    set enableBell(value: boolean) {
        this._model.enableBell = value;
    }
    get enableBell(): boolean {
        return this._model.enableBell;
    }

    set enableURLDetection(value: boolean) {
        this._model.enableURLDetection = value;
    }
    get enableURLDetection(): boolean {
        return this._model.enableURLDetection;
    }

    set enableMSP(value: boolean) {
        this._model.enableMSP = value;
    }
    get enableMSP(): boolean {
        return this._model.enableMSP;
    }

    set displayControlCodes(value: boolean) {
        this._model.displayControlCodes = value;
    }
    get displayControlCodes(): boolean {
        return this._model.displayControlCodes;
    }

    set emulateTerminal(value: boolean) {
        this._model.emulateTerminal = value;
    }
    get emulateTerminal(): boolean {
        return this._model.emulateTerminal;
    }

    set emulateControlCodes(value: boolean) {
        this._model.emulateControlCodes = value;
    }
    get emulateControlCodes(): boolean {
        return this._model.emulateControlCodes;
    }

    set MXPStyleVersion(value: string) {
        this._model.MXPStyleVersion = value;
    }
    get MXPStyleVersion(): string {
        return this._model.MXPStyleVersion;
    }

    get WindowSize(): Size {
        return new Size(this.WindowWidth, this.WindowHeight);
    }

    get WindowWidth(): number {
        return Math.trunc(this._maxView / this._charWidth);
    }

    get WindowHeight(): number {
        if (this._view.scrollWidth > this._view.clientWidth)
            return Math.trunc((this._innerHeight - this._verticalScrollBarHeight - this._padding[0] - this._padding[2]) / this._charHeight);
        return Math.trunc((this._innerHeight - this._padding[0] - this._padding[2]) / this._charHeight);
    }

    get html(): string {
        const l = this.lines.length;
        const html: string[] = [];
        for (let idx = 0; idx < l; idx++)
            html.push(this.getLineHTML(idx));
        return html.join('');
    }

    get text(): string {
        return this._model.text;
    }

    get raw(): string {
        return this._model.raw;
    }

    get scrollAtBottom() {
        return this._scrollAtEnd;
    }
    //#endregion
    constructor(container: string | JQuery | HTMLElement | DisplayOptions, options?: DisplayOptions) {
        super();
        if (!container)
            throw new Error('Container must be a selector, element, jquery object or display options');
        if (typeof container === 'object' && 'container' in container) {
            options = Object.assign(options || {}, container);
            container = options.container;
            delete options.container;
        }
        if (typeof container === 'string') {
            this._container = document.querySelector(container);
            if (!this._container)
                throw new Error('Invalid selector for display.');
        }
        else if (container instanceof $)
            this._container = container[0];
        else if (container instanceof HTMLElement)
            this._container = container;
        else if ((<HTMLElement>container).ownerDocument.defaultView && container instanceof (<HTMLElement>container).ownerDocument.defaultView.HTMLElement)
            this._container = container;
        else
            throw new Error('Container must be a selector, element or jquery object');

        this._document = this._container.ownerDocument;
        this._window = this._document.defaultView;
        this._container.tabIndex = -1;
        this._container.classList.add('display');
        this._dragPrevent = e => {
            if (this.customSelection)
                e.preventDefault();
        };
        this._container.addEventListener('dragstart', this._dragPrevent.bind(this));
        (<any>this._container).display = this;
        this._styles = this._document.createElement('style');
        this._container.appendChild(this._styles);
        this._character = this._document.createElement('span');
        this._character.id = this.id + '-Character';
        this._character.className = 'line';
        this._character.innerHTML = '<span style="border-bottom: 1px solid rgb(0, 0, 0);">W</span>';
        this._character.style.visibility = 'hidden';
        this._container.appendChild(this._character);

        this._view = this._document.createElement('div');
        this._view.className = 'view';
        this._view.addEventListener('scroll', () => {
            this._scrollAtEnd = this._view.clientHeight + this._view.scrollTop >= this._view.scrollHeight;
            this._doUpdate(UpdateType.toggleSplit);
        });
        this._view.addEventListener('click', e => {
            this.emit('click', e);
        })
        this._view.addEventListener('contextmenu', e => {
            this.emit('contextmenu', e);
        });
        this._view.addEventListener('mousedown', e => {
            this._container.focus();
            this.emit('mousedown', e);
            const bounds = this._bounds;
            let w = bounds.width - this._view.clientWidth;
            let h = bounds.height - this._view.clientHeight;
            if (e.button === 0 && e.pageX < bounds.right - w && e.pageY < bounds.bottom - h) {
                if (this.customSelection) {
                    if (!e.shiftKey) {
                        this.clearSelection();
                        this._startSelection(e);
                    }
                    else if (this._trackSelection.down && e.shiftKey)
                        this._endSelection(e);
                    else
                        this._startSelection(e);
                }
                this._mouseDown = 1;
                if (this._split)
                    this._split._bar.style.pointerEvents = 'none';
            }
            else if (this.customSelection && e.button === 2 && this._trackSelection.down) {
                if (!this._selection.start) this._setSelection();
                let caret = this._getMouseEventCaretRange(e);
                let range = this._document.createRange();
                range.setStart(this._selection.start.node, this._selection.start.offset);
                range.setEnd(this._selection.end.node, this._selection.end.offset);
                if ((caret.offsetNode && range.intersectsNode(caret.offsetNode)) || (caret.startContainer && range.intersectsNode(caret.startContainer))) {
                    if (e.shiftKey)
                        this._endSelection(e);
                    else
                        this._setSelection();
                }
                else if (e.shiftKey)
                    this._endSelection(e);
                else
                    this.clearSelection();
            }
        });
        this._view.addEventListener('mousemove', e => {
            this._lastMouse = e;
            if (this._mouseDown) {
                this._endSelection(e);
                //when near edge of view start auto scroll
                this._createScrollTimer();
            }
        });
        this._view.addEventListener('mouseup', e => {
            if (this._mouseDown === 2)
                this._view.click();
            if (e.button === 0)
                this._clearMouseDown(e);
            if (e.detail === 2)
                this._setSelectionRange(this.getWordRangeFromPosition(e.pageX, e.pageY));
            else if (e.detail === 3)
                this._setSelectionRange(this.getLineRangeFromPosition(e.pageX, e.pageY));
            else if (e.detail === 4)
                this.selectAll();
            this.emit('mouseup', e);
        });
        this._view.addEventListener('mouseenter', e => {
            //mouse left and came back with button up so fake a mouseup
            if (this._mouseDown && (e.buttons & 1) !== 1)
                this._clearMouseDown(e);
            else
                this._clearScrollTimer();
        });
        this._view.addEventListener('mouseleave', e => {
            if (this._mouseDown) {
                this._lastMouse = e;
                if (this.customSelection && this._view.lastChild && e.pageY >= (this._bounds.bottom - this._horizontalScrollBarHeight)) {
                    this._trackSelection.up = this._getMouseEventCaretRange(e) || this._document.createRange();
                    this._trackSelection.up.setStart(this._view.lastChild, this._view.lastChild.childNodes.length);
                    this._trackSelection.up.setEnd(this._view.lastChild, this._view.lastChild.childNodes.length);
                    this._setSelection();
                }
                this._createScrollTimer();
            }
        });
        /*
        this._view.addEventListener('touchstart', e => {
            this._container.focus();
            this.emit('mousedown', e);
            const bounds = this._bounds;
            let w = bounds.width - this._view.clientWidth;
            let h = bounds.height - this._view.clientHeight;
            if (e.touches && e.touches.length && e.touches[0].pageX < bounds.right - w && e.touches[0].pageY < bounds.bottom - h) {
                if (this.customSelection) {
                    if (!e.shiftKey) {
                        this.clearSelection();
                        this._startSelection(e.touches[0]);
                    }
                    else if (this._trackSelection.down && e.shiftKey)
                        this._endSelection(e.touches[0]);
                    else
                        this._startSelection(e.touches[0]);
                }
                this._mouseDown = 1;
                if (this._split)
                    this._split._bar.style.pointerEvents = 'none';
            }
        });
        this._view.addEventListener('touchend', e => {
            if (this._mouseDown === 2)
                this._view.click();
            if (e.touches && e.touches.length)
                this._clearMouseDown(e.touches[0]);
            this.emit('mouseup', e);
        });
        this._view.addEventListener('touchmove', e => {
            if (this._mouseDown && e.touches && e.touches.length) {
                this._endSelection(e.touches[0]);
                //when near edge of view start auto scroll
                this._createScrollTimer();
            }
        });
        */
        this._container.appendChild(this._view);

        this._charHeight = parseFloat(this._window.getComputedStyle(this._character).height);
        this._charWidth = parseFloat(this._window.getComputedStyle(this._character.firstElementChild).width);
        if (!options)
            options = { display: this };
        else
            options.display = this;
        this.model = new DisplayModel(options);

        this._wResize = (e) => {
            if (this._scrollAtEnd)
                this.scrollDisplay();
            debounce(() => {
                this._doUpdate(UpdateType.update | UpdateType.updateWindow | UpdateType.split);
            }, 250, this.id + 'resize');
        };
        this._selectionChange = e => {
            //some weird bug in chrome that with out this causes the end/start container to be the wrong nodes
            if (this._window.getSelection().rangeCount)
                this._window.getSelection().getRangeAt(0);
        };
        this._wUp = e => {
            if (this._mouseDown && e.button === 0) {
                this._lastMouse = e;
                this._clearMouseDown(e);
            }
        };
        this._wMove = e => {
            if (this._mouseDown)
                this._lastMouse = e;
        };
        this._window.addEventListener('resize', this._wResize.bind(this));
        this._window.addEventListener('mouseup', this._wUp.bind(this));
        this._window.addEventListener('mousemove', this._wMove.bind(this));
        this._document.addEventListener('selectionchange', this._selectionChange.bind(this));

        this._resizeObserver = new ResizeObserver((entries, observer) => {
            if (entries.length === 0) return;
            if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
                return;
            debounce(() => {
                if (!this._resizeObserverCache || this._resizeObserverCache.width !== entries[0].contentRect.width || this._resizeObserverCache.height !== entries[0].contentRect.height) {
                    if (this._scrollAtEnd)
                        this.scrollDisplay();
                    this._resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
                    this._doUpdate(UpdateType.update | UpdateType.updateWindow | UpdateType.split);
                }
            }, 250, this.id + 'resize');
            this._updateSplit();
            this.emit('resize');
        });
        this._resizeObserver.observe(this._container);
        this._observer = new MutationObserver((mutationsList) => {
            let mutation;
            for (mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (this._scrollAtEnd)
                        this.scrollDisplay();
                    this._doUpdate(UpdateType.update | UpdateType.updateWindow | UpdateType.split);
                    this.emit('resize');
                }
            }
        });
        this._observer.observe(this._container, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });
        if (!moment || this._timestamp !== TimeStampStyle.Format)
            this._timestampWidth = new Date().toISOString().length + 1;
        else
            this._timestampWidth = moment().format(this._timestampFormat).length;
        this.updateFont();
        this._bounds = this._view.getBoundingClientRect();
        this._hWidth = getScrollbarWidth();
        this._vWidth = getScrollbarWidth();
        this.splitHeight = -1;
    }

    public debug(msg) {
        this.emit('debug', msg);
    }

    public scrollDisplay(force?): void {
        if (this._split) {
            if (force || !this.scrollLock && !this._split.visible)
                this._view.scrollTop = this._view.scrollHeight;
        }
        else if (!this.scrollLock)
            this._view.scrollTop = this._view.scrollHeight;
    };

    public scrollTo(x: number, y: number) {
        this._view.scrollTo(x, y);
    }

    public scrollToCharacter(x: number, y: number) {
        this._view.scrollTo(x * this._charHeight, y * this._charWidth);
    }

    public scrollBy(x: number, y: number) {
        this._view.scrollBy(x, y);
    }

    public scrollUp() {
        this._view.scrollBy(0, -this._charHeight);
    }

    public scrollDown() {
        this._view.scrollBy(0, this._charHeight);
    }

    public pageUp() {
        this._view.scrollBy(0, -this._view.clientHeight)
    }

    public pageDown() {
        this._view.scrollBy(0, this._view.clientHeight)
    }

    public trimLines() {
        if (this._maxLines === -1)
            return;
        //debounce on top of delay in case called multiple times manually
        debounce(() => {
            if (this.lines.length > this._maxLines) {
                const amt = this.lines.length - this._maxLines;
                let r = amt;
                while (r-- > 0)
                    this._view.removeChild(this._view.firstChild);
                this._model.removeLines(0, amt);
            }
        }, 100, this.id + 'trimLines');
    }

    public append(txt: string, remote?: boolean, force?: boolean, prependSplit?: boolean) {
        this._model.append(txt, remote || false, force || false, prependSplit || false);
    }

    public CurrentAnsiCode() {
        return this._model.CurrentAnsiCode();
    }

    public removeLine(line: number, noUpdate?: boolean) {
        if (line < 0 || line >= this.lines.length) return;
        this.emit('line-removed', line, this.lines[line].text);
        const id = this._model.getLineID(line);
        const elLine = this._view.querySelector(`[data-id="${id}"]`);
        this._view.removeChild(elLine);
        this._model.removeLine(line);
        this._doUpdate(UpdateType.split);
    }

    public removeLines(line: number, amt: number) {
        if (line < 0 || line >= this.lines.length) return;
        if (amt < 1) amt = 1;
        this.emit('lines-removed', line, this.lines.slice(line, line + amt - 1));
        this._view.replaceChildren(...[].slice.call(this._view.children, 0, line), ...[].slice.call(this._view.children, line + amt));
        this._model.removeLines(line, amt);
        this._doUpdate(UpdateType.split);
    }

    private _updateDisplay() {
        //disable animation
        this._view.classList.remove('animate');
        this._doUpdate(UpdateType.trim);
        if (this._hideTrailingEmptyLine && this.lines.length && this.lines[this.lines.length - 1].text.length === 0)
            (<HTMLElement>this._view.lastChild).style.display = 'none';
        this._doUpdate(UpdateType.scrollEnd | UpdateType.updateWindow | UpdateType.split);
        //re-enable animation so they are all synced
        this._view.classList.add('animate');
    }

    public updateWindow(width?, height?) {
        if (width === undefined) {
            width = this.WindowWidth;
            height = this.WindowHeight;
        }
        this._model.updateWindow(width, height);
        this.emit('update-window', width, height);
    }

    public clear() {
        this._model.clear();
        this._view.innerHTML = '';
    }

    public dispose() {
        this._document.body.removeChild(this._character);
        this._document.body.removeChild(this._styles);
        while (this._container.firstChild)
            this._view.removeChild(this._view.firstChild);
        this._window.removeEventListener('resize', this._wResize);
        this._window.removeEventListener('mouseup', this._wUp);
        this._window.removeEventListener('mousemove', this._wMove);
        this._document.removeEventListener('selectionchange', this._selectionChange);
        this._container.removeEventListener('dragstart', this._dragPrevent);
    }

    private _update() {
        this._maxView = this._view.clientWidth - this._padding[1] - this._padding[3] - this._verticalScrollBarHeight - this._indentPadding;
        if (this._timestamp !== TimeStampStyle.None)
            this._maxView -= this._timestampWidth * this._charWidth;
        this._innerHeight = this._view.clientHeight;
        this._bounds = this._view.getBoundingClientRect();
        this._hWidth = getScrollbarWidth();
        this._vWidth = getScrollbarWidth();
    }

    public updateFont(font?: string, size?: string) {
        if (!font || font.length === 0)
            font = '"Courier New", Courier, monospace';
        else //fall back just incase
            font += ', monospace';
        if (!size || size.length === 0)
            size = '1em';
        if (font !== this._container.style.fontFamily || size !== this._container.style.fontSize) {
            //set styles using raw javascript for minor speed
            this._container.style.fontSize = size;
            this._container.style.fontFamily = font;
            this._character.style.fontSize = size;
            this._character.style.fontFamily = font;
            //recalculate height/width of characters so display can be calculated
            this._charHeight = parseFloat(this._window.getComputedStyle(this._character).height);
            this._charWidth = parseFloat(this._window.getComputedStyle(this._character.firstElementChild).width);
            setTimeout(() => {
                this._charHeight = parseFloat(this._window.getComputedStyle(this._character).height);
                this._charWidth = parseFloat(this._window.getComputedStyle(this._character.firstElementChild).width);
            }, 250);
            this._buildStyleSheet();
            this._doUpdate(UpdateType.scrollEnd | UpdateType.updateWindow | UpdateType.update);
        }
        const pc = this._window.getComputedStyle(this._view);
        const padding = [
            parseInt(pc.getPropertyValue('padding-top')) || 0,
            parseInt(pc.getPropertyValue('padding-right')) || 0,
            parseInt(pc.getPropertyValue('padding-bottom')) || 0,
            parseInt(pc.getPropertyValue('padding-left')) || 0
        ];
        if (padding[0] !== this._padding[0] ||
            padding[1] !== this._padding[1] ||
            padding[2] !== this._padding[2] ||
            padding[3] !== this._padding[3]
        ) {
            this._padding = padding;
            this._doUpdate(UpdateType.update);
        }
    }

    private _buildStyleSheet() {
        let styles = ''; // `.background > span, .view > span, .line, .background-line { height: ${this._charHeight}px; line-height: ${this._charHeight - 2}px; }`;
        if (!this._enableColors)
            styles += '#' + this.id + ' .view > span span {color: inherit !important;}';
        if (!this._enableColors || !this._enableBackgroundColors)
            styles += '#' + this.id + ' .background > span span {background-color: inherit !important;}';
        if (this._wordWrap)
            styles += '#' + this.id + ' .view {white-space: break-spaces; }';
        else if (this._wrapAt > 0)
            styles += `#${this.id} .view {white-space: break-spaces; } .line {width: ${this._wrapAt * this._charWidth}px !important;max-width:  ${this._wrapAt * this._charWidth}px;min-width:  ${this._wrapAt * this._charWidth}px;display: block;}`
        if ((this._wordWrap || this._wrapAt > 0) && this._indent > 0)
            styles += `#${this.id} .view {  text-indent: ${this._indent * this._charWidth}px hanging; }`;
        //styles += `.view { padding-left: ${this._indent * this._charWidth * 2}px;text-indent: -${this._indent * this._charWidth}px; }@-moz-document url-prefix() { .view {  padding-left: 0px !important; text-indent: ${this._indent * this._charWidth}px hanging; } }`;
        styles += `#${this.id} .line > span { min-height: ${this._charHeight}}`;
        if (this._timestamp !== TimeStampStyle.None)
            styles += '#' + this.id + ' .timestamp { display: inline-block; }';
        //else
        //styles += '.timestamp { display: none !important; }';
        this._styles.innerHTML = styles;
        if ((this._wordWrap || this._wrapAt > 0) && this._indent > 0)
            this._indentPadding = parseFloat(this._window.getComputedStyle(this._view).paddingLeft) / 2;
        else
            this._indentPadding = 0;
    }

    public getLineHTML(idx?: number, start?: number, len?: number, inner?: boolean) {
        if (idx === undefined || idx >= this.lines.length)
            idx = this.lines.length - 1;
        else if (idx < 0)
            idx = 0;
        if (start === undefined || start < 0)
            start = 0;
        if (len === undefined || len === -1)
            len = this.lines[idx].text.length;
        const parts: string[] = [];
        let offset = 0;
        let style: any = '';
        let fCls: any = '';
        const text = this.lines[idx].text;
        const formats = this.lines[idx].formats;
        const fLen = formats.length;
        let right = false;
        const id = this._model.getLineID(idx);
        if (this._timestamp === TimeStampStyle.Format && moment)
            parts.push('<span class="timestamp" style="color:', this._model.GetColor(-7), ';background:', this._model.GetColor(-8), ';"', fCls, '>', moment(this.lines[idx].timestamp).format(this._timestampFormat), '</span>');
        else if (this._timestamp !== TimeStampStyle.None)
            parts.push('<span class="timestamp" style="color:', this._model.GetColor(-7), ';background:', this._model.GetColor(-8), ';"', fCls, '>', new Date(this.lines[idx].timestamp).toISOString(), ' </span>');
        for (let f = 0; f < fLen; f++) {
            const format = formats[f];
            let nFormat;
            let end;
            const td: string[] = [];
            //let oSize;
            //let oFont;
            if (f < fLen - 1) {
                nFormat = formats[f + 1];
                //skip empty blocks
                if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
                    continue;
                end = nFormat.offset;
            }
            else
                end = text.length;
            offset = format.offset;

            if (end > len)
                end = len;
            if (offset < start)
                offset = start;

            if (format.formatType === FormatType.Normal) {
                style = [];
                fCls = [];
                if (typeof format.background === 'number')
                    style.push('background:', this._model.GetColor(format.background), ';');
                else if (format.background)
                    style.push('background:', format.background, ';');
                if (typeof format.color === 'number')
                    style.push('color:', this._model.GetColor(format.color), ';');
                else if (format.color)
                    style.push('color:', format.color, ';');
                if (format.font)
                    style.push('font-family: ', format.font, ';');
                if (format.size)
                    style.push('font-size: ', format.size, ';');
                if (format.style !== FontStyle.None) {
                    if ((format.style & FontStyle.Bold) === FontStyle.Bold)
                        style.push('font-weight: bold;');
                    if ((format.style & FontStyle.Italic) === FontStyle.Italic)
                        style.push('font-style: italic;');
                    if ((format.style & FontStyle.Overline) === FontStyle.Overline)
                        td.push('overline ');
                    if ((format.style & FontStyle.DoubleUnderline) === FontStyle.DoubleUnderline || (format.style & FontStyle.Underline) === FontStyle.Underline)
                        td.push('underline ');
                    if ((format.style & FontStyle.DoubleUnderline) === FontStyle.DoubleUnderline)
                        style.push('border-bottom: 1px solid ', (typeof format.color === 'number' ? this._model.GetColor(format.color) : format.color), ';');
                    else
                        //style.push('padding-bottom: 1px;');
                        style.push('border-bottom: 1px solid ', (typeof format.background === 'number' ? this._model.GetColor(format.background) : format.background), ';');
                    if ((format.style & FontStyle.Rapid) === FontStyle.Rapid || (format.style & FontStyle.Slow) === FontStyle.Slow) {
                        if (this.enableFlashing)
                            fCls.push(' ansi-blink');
                        else if ((format.style & FontStyle.DoubleUnderline) !== FontStyle.DoubleUnderline && (format.style & FontStyle.Underline) !== FontStyle.Underline)
                            td.push('underline ');
                    }
                    if ((format.style & FontStyle.Strikeout) === FontStyle.Strikeout)
                        td.push('line-through ');
                    if (td.length > 0)
                        style.push('text-decoration:', td.join('').trim(), ';');
                }
                else
                    style.push('border-bottom: 1px solid ', (typeof format.background === 'number' ? this._model.GetColor(format.background) : format.background), ';');
                //style.push('padding-bottom: 1px;');
                if (offset < start || end < start)
                    continue;
                style = style.join('').trim();
                if (fCls.length !== 0)
                    fCls = ' class="' + fCls.join('').trim() + '"';
                else
                    fCls = '';
                if (format.hr)
                    parts.push('<span style="', style, 'min-width:100%;width:100%;"', fCls, '><div style="position:relative;top: 50%;transform: translateY(-50%);height:4px;width:100%; background-color:', (typeof format.color === 'number' ? this._model.GetColor(format.color) : format.color), '"></div></span>');
                else if (end - offset !== 0)
                    parts.push('<span style="', style, '"', fCls, '>', htmlEncode(text.substring(offset, end)), '</span>');
            }
            else if (format.formatType === FormatType.Link) {
                if (offset < start || end < start)
                    continue;
                parts.push('<a draggable="false" class="URLLink" href="javascript:void(0);" title="');
                parts.push(format.href.replace(/"/g, '&quot;'));
                parts.push('" onclick="', this.linkFunction, '(\'', format.href.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), '\');return false;">');
                if (end - offset === 0) continue;
                parts.push('<span style="', style, '"', fCls, '>');
                parts.push(htmlEncode(text.substring(offset, end)));
                parts.push('</span>');
            }
            else if (format.formatType === FormatType.LinkEnd || format.formatType === FormatType.MXPLinkEnd || format.formatType === FormatType.MXPSendEnd) {
                if (offset < start || end < start)
                    continue;
                parts.push('</a>');
            }
            else if (format.formatType === FormatType.MXPLink) {
                if (offset < start || end < start)
                    continue;
                parts.push('<a draggable="false" class="MXPLink" href="javascript:void(0);" title="');
                parts.push(format.href.replace(/"/g, '&quot;'));
                parts.push('"');
                if (format.expire && format.expire.length)
                    parts.push(` data-expire="${format.expire}"`);
                parts.push(' onclick="', this.mxpLinkFunction, '(this, \'', format.href.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), '\');return false;">');
                if (end - offset === 0) continue;
                parts.push('<span style="', style, '"', fCls, '>');
                parts.push(htmlEncode(text.substring(offset, end)));
                parts.push('</span>');
            }
            else if (format.formatType === FormatType.MXPSend) {
                if (offset < start || end < start)
                    continue;
                parts.push('<a draggable="false" class="MXPLink" href="javascript:void(0);" title="');
                parts.push(format.hint.replace(/"/g, '&quot;'));
                parts.push('"');
                if (format.expire && format.expire.length)
                    parts.push(` data-expire="${format.expire}"`);
                parts.push(' onmouseover="', this.mxpTooltipFunction, '(this);"');
                parts.push(' onclick="', this.mxpSendFunction, '(event||window.event, this, ', format.href.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), ', ', format.prompt ? '1' : '0', ', ', format.tt.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), ');return false;">');
                if (end - offset === 0) continue;
                parts.push('<span style="', style, '"', fCls, '>');
                parts.push(htmlEncode(text.substring(offset, end)));
                parts.push('</span>');
            }
            else if (format.formatType === FormatType.MXPExpired && end - offset !== 0) {
                if (offset < start || end < start)
                    continue;
                parts.push('<span style="', style, '"', fCls, '>');
                parts.push(htmlEncode(text.substring(offset, end)));
                parts.push('</span>');
            }
            else if (format.formatType === FormatType.Image) {
                if (offset < start || end < start)
                    continue;
                let tmp = '';
                parts.push('<img src="');
                if (format.url.length > 0) {
                    parts.push(format.url);
                    tmp += format.url;
                    if (!format.url.endsWith('/')) {
                        parts.push('/');
                        tmp += '/';
                    }
                }
                if (format.t.length > 0) {
                    parts.push(format.t);
                    tmp += format.t;
                    if (!format.t.endsWith('/')) {
                        parts.push('/');
                        tmp += '/';
                    }
                }
                tmp += format.name;
                parts.push(format.name, '"  style="');
                if (format.w.length > 0)
                    parts.push('width:', formatUnit(format.w, this._charWidth), ';');
                if (format.h.length > 0)
                    parts.push('height:', formatUnit(format.h, this._charHeight), ';');
                switch (format.align.toLowerCase()) {
                    case 'left':
                        parts.push('float:left;');
                        break;
                    case 'right':
                        parts.push('float:right;');
                        right = true;
                        break;
                    case 'top':
                    case 'middle':
                    case 'bottom':
                        parts.push('vertical-align:', format.align, ';');
                        break;
                }
                if (format.hspace.length > 0 && format.vspace.length > 0) {
                    parts.push('margin:');
                    parts.push(formatUnit(format.vspace, this._charWidth), ' ');
                    parts.push(formatUnit(format.hspace, this._charHeight), ';');
                }
                else if (format.hspace.length > 0) {
                    parts.push('margin:');
                    parts.push('0px ', formatUnit(format.hspace, this._charHeight), ';');
                }
                else if (format.vspace.length > 0) {
                    parts.push('margin:');
                    parts.push(formatUnit(format.vspace, this._charWidth), ' 0px;');
                }
                parts.push('"');
                if (format.ismap) parts.push(' ismap onclick="return false;"');
                parts.push(`src="${tmp}"/>`);
            }
        }
        if (inner) {
            if (right && len < this.lines[idx].text.length)
                return parts.join('');
            if (right)
                return parts.join('') + '<br>\n';
            if (len < this.lines[idx].text.length)
                return parts.join('');
            return parts.join('') + '<br>\n';
        }
        if (right && len < this.lines[idx].text.length)
            return `<span data-id="${id}" class="line" style="min-width:100%">${parts.join('')}</span>`;
        if (right)
            return `<span data-id="${id}" class="line" style="min-width:100%">${parts.join('')}<br>\n</span>`;
        if (len < this.lines[idx].text.length)
            return `<span data-id="${id}" class="line">${parts.join('')}</span>`;
        return `<span data-id="${id}" class="line">${parts.join('')}<br>\n</span>`;
    }

    public getLineText(line, full?: boolean) {
        //if line out of range, or if for what ever reason the line is missing data return empty string
        if (line < 0 || line >= this.lines.length || !this.lines[line]) return '';
        //get line from id in case lines where removed
        return this.lines[line].text;
    }

    private _rebuildLine(start: number) {
        this._rebuildLines(start, start);
    }

    private _rebuildLines(start?: number, end?: number) {
        if (!this.lines.length) return;
        if (start === undefined || start < 0)
            start = 0;
        if (end === undefined || end === -1 || end >= this.lines.length)
            end = this.lines.length - 1;
        let _html = [];
        let line = start;
        for (; line <= end; line++) {
            _html.push(this.getLineHTML(line));
        }

        //if all lines can speed up and reduce load by setting all view at once
        if (start === 0 && end === this.lines.length - 1)
            this._view.innerHTML = _html.join('');
        //if selection of lines will need to update each line one at atime to not break other lines
        else {
            this._view.replaceChildren(...[].slice.call(this._view.children, 0, start), ...[].slice.call(this._view.children, end + 1));
            if (start === 0)
                this._view.firstElementChild.insertAdjacentHTML('beforebegin', _html.join(''));
            else {
                this._view.children[start - 1].insertAdjacentHTML('afterend', _html.join(''));
            }
        }
    }

    private _doUpdate(type?: UpdateType) {
        if (!type) return;
        this._updating |= type;
        if (this._updating === UpdateType.none)
            return;
        this._window.requestAnimationFrame(() => {
            if (this._updating === UpdateType.none)
                return;
            if ((this._updating & UpdateType.rebuildLines) === UpdateType.rebuildLines) {
                this._rebuildLines();
                this._updating &= ~UpdateType.rebuildLines;
            }
            if ((this._updating & UpdateType.update) === UpdateType.update) {
                this._update();
                this._updating &= ~UpdateType.update;
            }
            if ((this._updating & UpdateType.display) === UpdateType.display) {
                this._updateDisplay();
                this._updating &= ~UpdateType.display;
            }
            if ((this._updating & UpdateType.trim) === UpdateType.trim) {
                this.trimLines();
                this._updating &= ~UpdateType.trim;
            }
            if ((this._updating & UpdateType.scrollEnd) === UpdateType.scrollEnd) {
                this.scrollDisplay();
                this._updating &= ~UpdateType.scrollEnd;
            }
            if ((this._updating & UpdateType.updateWindow) === UpdateType.updateWindow) {
                this.updateWindow();
                this._updating &= ~UpdateType.updateWindow;
            }
            if ((this._updating & UpdateType.split) === UpdateType.split) {
                this._updateSplit();
                this._updating &= ~UpdateType.split;
            }
            if ((this._updating & UpdateType.toggleSplit) === UpdateType.toggleSplit) {
                this._toggleSplit();
                this._updating &= ~UpdateType.toggleSplit;
            }
            this._doUpdate(this._updating);
        });
    }

    public colorSubStrByLine(idx: number, fore, back?, start?: number, len?: number, style?: FontStyle) {
        this.colorSubStringByLine(idx, fore, back, start, (start || 0) + (len || 0), style);
    }

    public colorSubStringByLine(idx: number, fore, back?, start?: number, end?: number, style?: FontStyle) {
        //only update if something changed
        if (!this._model.colorSubStringByLine(idx, fore, back, start, end, style))
            return;
        this._rebuildLine(idx);
    }

    public removeStyleSubStrByLine(idx: number, style: FontStyle, start?: number, len?: number) {
        this.removeStyleSubStringByLine(idx, style, start, (start || 0) + (len || 0));
    }

    //color like javascript.substring using 0 index for start and end
    public removeStyleSubStringByLine(idx: number, style: FontStyle, start?: number, end?: number) {
        //only update if something changed
        if (!this._model.removeStyleSubStringByLine(idx, style, start, end))
            return;
        this._rebuildLine(idx);
    }

    public highlightSubStrByLine(idx: number, start?: number, len?: number) {
        this.highlightStyleSubStringByLine(idx, start, (start || 0) + (len || 0));
    }

    //color like javascript.substring using 0 index for start and end
    public highlightStyleSubStringByLine(idx: number, start?: number, end?: number, color?: boolean) {
        //only update if something changed
        if (!this._model.highlightStyleSubStringByLine(idx, start, end, color))
            return;
        this._rebuildLine(idx);
    }

    public SetColor(code: number, color) {
        this._model.SetColor(code, color);
    }

    public ClearMXP() {
        this._model.ClearMXP();
    }

    public ResetMXPLine() {
        this._model.ResetMXPLine();
    }

    get hasSelection(): boolean {
        if (!this.customSelection) {
            const selection = this._window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                return this._view.contains(range.commonAncestorContainer) && selection.toString().length !== 0;
            }
        }
        else if (this._selection.start)
            return true;
        return false;
    }

    get selection(): string {
        if (!this.customSelection) {
            const selection = this._window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (this._view.contains(range.startContainer) || this._view.contains(range.endContainer)) {
                    return selection.toString();
                }
            }
        }
        if (!this.hasSelection) return '';
        const range = this._document.createRange();
        if (this._split && this._split.visible)
            this._adjustSplitSelection(this._view, this._split._view);
        range.setStart(this._selection.start.node, this._selection.start.offset);
        range.setEnd(this._selection.end.node, this._selection.end.offset);
        if (this._split && this._split.visible)
            this._adjustSplitSelection(this._split._view, this._view);
        return range.toString();
    }

    get selectionAsHTML(): string {
        if (!this.customSelection) {
            let selection = this._window.getSelection();
            if (selection.rangeCount > 0) {
                let range = selection.getRangeAt(0);
                if (!this._view.contains(range.startContainer) && !this._view.contains(range.endContainer))
                    return '';
                let clonedSelection = range.cloneContents();
                let div = this._document.createElement('div');
                div.appendChild(clonedSelection);
                return div.innerHTML;
            }
            return '';
        }
        if (!this.hasSelection) return '';
        const range = this._document.createRange();
        if (this._split && this._split.visible)
            this._adjustSplitSelection(this._view, this._split._view);
        range.setStart(this._selection.start.node, this._selection.start.offset);
        range.setEnd(this._selection.end.node, this._selection.end.offset);
        if (this._split && this._split.visible)
            this._adjustSplitSelection(this._split._view, this._view);
        let clonedSelection = range.cloneContents();
        let div = this._document.createElement('div');
        div.appendChild(clonedSelection);
        return div.innerHTML;
    }

    public selectAll() {
        let range;
        if (this._window.getSelection) {
            range = document.createRange();
            range.setStart(this._view.firstChild, 0);
            range.setEnd(this._view.lastChild, this._view.lastChild.childNodes.length);
            this._window.getSelection().removeAllRanges();
            this._window.getSelection().addRange(range);
        }
        if (this.customSelection) {
            this._trackSelection.down = document.createRange();
            this._trackSelection.down.setStart(this._view.firstChild, 0);
            this._trackSelection.down.setEnd(this._view.firstChild, 0);
            this._trackSelection.up = document.createRange();
            this._trackSelection.up.setStart(this._view.lastChild, this._view.lastChild.childNodes.length);
            this._trackSelection.up.setEnd(this._view.lastChild, this._view.lastChild.childNodes.length);
            this._selection = {
                start: {
                    node: this._view.firstChild,
                    offset: 0
                },
                end: {
                    node: this._view.lastChild,
                    offset: this._view.lastChild.childNodes.length
                },
                timer: null
            }
            if (this._split && this._split.visible)
                this._adjustSplitSelection(this._split._view, this._view);
            this._updateSelectionHighlight();
        }
        this.emit('selection-changed', this._window.getSelection());
    }

    public clearSelection() {
        const selection = this._window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (this._view.contains(range.startContainer) || this._view.contains(range.endContainer)) {
                selection.removeAllRanges();
            }
        }
        this._trackSelection = { down: null, up: null };
        this._selection = { start: null, end: null, timer: null };
        this._updateSelectionHighlight();
        this.emit('selection-changed', this._window.getSelection());
    }

    public getLineOffset(x, y): Point {
        const elements = this._document.elementsFromPoint(x, y);
        let element;
        for (let e = 0, el = elements.length; e < el; e++) {
            if (this._view === elements[e]) break;
            if (this._view.contains(elements[e])) {
                element = elements[e];
                break;
            }
        }
        //not in view so fail
        if (!element || !this._view.contains(element) && this._view != element)
            return { x: -1, y: -1, lineID: -1 };
        if (element.classList.contains('line'))
            return { x: 0, y: this.model.getLineFromID(+element.dataset.id), lineID: +element.dataset.id };
        const line = this._getLineNode(element);
        if (line)
            return { x: 0, y: this.model.getLineFromID(+line.dataset.id), lineID: +line.dataset.id };
        return { x: -1, y: -1, lineID: -1 };
    }

    public getWordFromPosition(x, y): string {
        const range = this.getWordRangeFromPosition(x, y);
        if (range) return range.toString();
        return '';
    }

    public getWordRangeFromPosition(x, y): Range {
        let line = document.elementFromPoint(x, y) as HTMLElement;
        if (!line || line === this._view || (this._split && this._split._view === line) || line.classList.contains('line')) return null;
        const range = this._getMouseEventCaretRange({ clientX: x, clientY: y });
        if (!range) return null;
        let n = this._rangeToNode(range);
        if (!n || !n.node) return null;
        line = this._getLineNode(n.node);
        if (!line) return null;
        const textNodes = this._textNodesUnder(line);
        const offset = this._findIndexOfSymbol(line, n.node, n.offset);
        const lineIndex = this._model.getLineFromID(+line.dataset.id);
        if (lineIndex === -1) return null;
        const text = this.getLineText(lineIndex);
        const len = text.length;
        let sPos = offset;
        let ePos = offset;
        while (text.substr(sPos, 1).match(/([^\s.,/#!$%^&*;:{}=`~()[\]@&|\\?><"'+])/gu) && sPos >= 0) {
            sPos--;
            if (sPos < 0)
                break;
        }
        sPos++;
        if (sPos > offset)
            sPos = offset;
        while (text.substr(ePos, 1).match(/([^\s.,/#!$%^&*;:{}=`~()[\]@&|\\?><"'+])/gu) && ePos < len) {
            ePos++;
        }
        if (ePos <= sPos)
            ePos = sPos + 1;
        if (sPos >= 0 && ePos <= len) {
            let tl = textNodes.length;
            let l = 0;
            let t = 0;
            for (; t < tl; t++) {
                if (sPos >= l && sPos < l + textNodes[t].length) {
                    range.setStart(textNodes[t], sPos - l);
                    break;
                }
                l += textNodes[t].length;
            }
            for (; t < tl; t++) {
                if (ePos >= l && ePos < l + textNodes[t].length) {
                    range.setEnd(textNodes[t], ePos - l);
                    break;
                }
                l += textNodes[t].length;
            }
        }
        return range;
    }

    public getLineRangeFromPosition(x, y): Range {
        const range = this._getMouseEventCaretRange({ clientX: x, clientY: y });
        if (!range) return null;
        let n = this._rangeToNode(range);
        const line = this._getLineNode(n.node);
        if (line.childNodes.length) {
            range.setStart(line.firstChild, 0);
            if (line.lastChild.nodeType === 3)
                range.setEnd(line.lastChild, (line.lastChild as Text).length);
            else
                range.setEnd(line.lastChild, line.childNodes.length);
        }
        else {
            range.setStart(line, 0);
            range.setEnd(line, 0);
        }
        return range;
    }

    private _getLineNode(node): HTMLElement {
        if (!node) return null;
        if (node.nodeType === 3)
            return node.parentNode.closest('.line') as HTMLElement;
        return node.closest('.line') as HTMLElement;
    }

    private _updateSplit() {
        if (!this._split || this._view.clientHeight >= this._view.scrollHeight) return;
        let ll = this.lines.length;
        //no height line to ensure scroll width
        let lines = [];
        for (let l = ll - this.WindowHeight; l < ll; l++)
            lines.push(this.getLineHTML(l));
        //lines.push(`<span style="width: ${this._view.scrollWidth}px;display: inline-block;"></span>`);
        this._split._view.classList.remove('animate');
        this._split._view.innerHTML = lines.join('');
        this._split._view.firstChild.style.width = this._view.scrollWidth + 'px';
        if (this._hideTrailingEmptyLine && this.lines.length && this.lines[this.lines.length - 1].text.length === 0)
            this._split._view.lastChild.style.display = 'none';
        this._updateSplitLocation();
        this._split._view.classList.add('animate');
        this._split._view.scrollTop = this._split._view.scrollHeight;
        this._split._bar.style.top = (this._view.clientHeight - this._split._view.clientHeight) + 'px';
    }

    private _updateSplitLocation() {
        if (!this._split) return;
        this._split._view.style.top = this._splitHeight + 'px';
        if (this._view.scrollWidth > this._view.clientWidth)
            this._split._view.style.bottom = this._horizontalScrollBarHeight + 'px';
        else
            this._split._view.style.bottom = '';
        this._split._bounds = this._split._view.getBoundingClientRect();
    }

    private _toggleSplit() {
        if (!this._split) return;
        if (this._view.clientHeight + this._view.scrollTop >= this._view.scrollHeight) {
            //only adjust if not already hidden
            if (this._split.visible) {
                this._split._view.style.visibility = 'hidden';
                this._split._bar.style.display = 'none';
                this._split.visible = false;
                //if selected text in split adjust end container
                this._adjustSplitSelection(this._view, this._split._view);
                this.emit('scroll-lock', false);
            }
        }
        else {
            this._split._view.scrollTop = this._split._view.scrollHeight;
            this._split._view.scrollLeft = this._view.scrollLeft;
            //only adjust if not visible
            if (!this._split.visible) {
                this._split._view.style.visibility = 'visible';
                this._split._bar.style.display = 'block';
                this._split._bar.style.top = (this._view.clientHeight - this._split._view.clientHeight) + 'px';
                this._split.visible = true;
                this._split._bounds = this._split._view.getBoundingClientRect();
                this._adjustSplitSelection(this._split._view, this._view);
                this.emit('scroll-lock', true);
            }
        }
    }

    private _adjustSplitSelection(target, source) {
        let so;
        let sElement;
        let n;
        if (this._trackSelection.down) {
            n = this._rangeToNode(this._trackSelection.down);
            so = n.offset;
            sElement = this._getElement(target, source, n.node);
            if (sElement && this._isElementVisible(sElement, target)) {
                this._trackSelection.down.setStart(sElement, so);
                this._trackSelection.down.setEnd(sElement, so);
            }
        }
        if (this._trackSelection.up) {
            n = this._rangeToNode(this._trackSelection.up);
            so = n.offset;
            sElement = this._getElement(target, source, n.node);
            if (sElement && this._isElementVisible(sElement, target)) {
                this._trackSelection.up.setStart(sElement, so);
                this._trackSelection.up.setEnd(sElement, so);
            }
        }
        this._setSelection();
        this._updateSelectionHighlight();
    }

    private _getMouseEventCaretRange(evt) {
        var range, x = evt.clientX, y = evt.clientY;
        // Try the simple IE way first
        if ((<any>this._document.body).createTextRange) {
            range = (<any>this._document.body).createTextRange();
            range.moveToPoint(x, y);
        }

        else if (typeof this._document.createRange != "undefined" && this._document.createRange !== null) {
            // Try Mozilla's rangeOffset and rangeParent properties,
            // which are exactly what we want
            if (typeof evt.rangeParent != "undefined" && evt.rangeParent !== null) {
                range = document.createRange();
                range.setStart(evt.rangeParent, evt.rangeOffset);
                range.collapse(true);
            }

            // Try the standards-based way next
            else if ((<any>this._document.body).caretPositionFromPoint) {
                var pos = (<any>this._document.body).caretPositionFromPoint(x, y);
                if (!pos || !this._container.contains(pos.offsetNode)) return null;
                range = pos.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
            }
            // Try the standards-based way next
            else if ((<any>this._document).caretPositionFromPoint) {
                var pos = (<any>this._document).caretPositionFromPoint(x, y);
                if (!pos || !this._container.contains(pos.offsetNode)) return null;
                range = this._document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
            }
            // Next, the WebKit way
            else if (this._document.caretRangeFromPoint) {
                range = this._document.caretRangeFromPoint(x, y);
            }
        }

        return range;
    }

    private _getElement(target, source, node) {
        let id = -1;
        let element;
        let tree
        let idx;
        //already extended so no need
        if (!target.contains(node)) {
            tree = [{ node: node, idx: -1 }];
            element = node;
            while (element && element.parentNode && source.contains(element) && source.contains(element.parentNode) && (!element.classList || !element.classList.contains('line'))) {
                tree.push({ node: element.parentNode, idx: Array.from(element.parentNode.childNodes).indexOf(element) })
                element = element.parentNode;
            }
            idx = tree.length - 1;
            if (tree[idx].node && tree[idx].node.dataset)
                id = tree[idx].node.dataset.id;
            if (element = target.querySelector(`[data-id="${id}"]`)) {
                for (; idx > 0; idx--) {
                    element = element.childNodes[tree[idx].idx];
                }
                return element;
            }
        }
        return null;
    }

    private _isElementVisible(element, container) {
        if (!element || !container) return false;
        if (!container.contains(element)) return false;
        let elRect;
        if (element.nodeType === 3) {
            if (element.parentNode.style.display === 'none') return true;
            elRect = element.parentNode.getBoundingClientRect();
        }
        else {
            if (element.style.display === 'none') return true;
            elRect = element.getBoundingClientRect();
        }
        const conRect = container.getBoundingClientRect();
        if (elRect.y >= conRect.y)
            return true;
        return false;
    }

    private _updateSelectionHighlight() {
        if (!('Highlight' in window)) return;
        if (!this._selection.start || !this.customSelection) {
            if (this._highlightRange) {
                this._highlight.delete(this._highlightRange);
                this._highlightRange = null;
            }
            if (!this.customSelection && this._highlight) {
                CSS.highlights.delete('oiMUD-selection');
                this._highlight = null;
            }
            return;
        }
        this._highlight = this._highlight || CSS.highlights.get('oiMUD-selection');
        if (!this._highlight) {
            this._highlight = new Highlight();
            CSS.highlights.set('oiMUD-selection', this._highlight);
        }
        if (!this._highlightRange) {
            this._highlightRange = this._document.createRange();
            this._highlight.add(this._highlightRange);
        }
        this._highlightRange.setStart(this._selection.start.node, this._selection.start.offset);
        if (this._selection.end)
            this._highlightRange.setEnd(this._selection.end.node, this._selection.end.offset);
        else
            this._highlightRange.setEnd(this._selection.start.node, this._selection.start.offset);

    }

    private _clearMouseDown(e) {
        if (this._mouseDown) {
            this._endSelection(e);
            this.emit('selection-done');
        }
        this._mouseDown = 0;
        if (this._split)
            this._split._bar.style.pointerEvents = '';
        this._clearScrollTimer();
    }

    private _clearScrollTimer() {
        if (this.customSelection || this._selection.timer) {
            clearInterval(this._selection.timer);
            this._selection.timer = null;
        }
    }

    private _createScrollTimer() {
        if (!this.customSelection) return;
        var bounds = this._bounds;
        var viewportX = this._lastMouse.clientX;
        var viewportY = this._lastMouse.clientY;
        var viewportWidth = this._view.clientWidth;
        var viewportHeight = this._view.clientHeight;
        var edgeSize = 20
        var edgeTop = bounds.top + edgeSize;
        var edgeLeft = bounds.left + edgeSize;
        var edgeBottom = bounds.top + (viewportHeight - edgeSize);
        var edgeRight = bounds.left + (viewportWidth - edgeSize);

        var isInLeftEdge = (viewportX < edgeLeft);
        var isInRightEdge = (viewportX > edgeRight);
        var isInTopEdge = (viewportY < edgeTop);
        var isInBottomEdge = (viewportY > edgeBottom);
        if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
            this._clearScrollTimer();
            return;
        }
        var viewWidth = Math.max(
            this._view.scrollWidth,
            this._view.offsetWidth,
            this._view.clientWidth
        );
        var viewHeight = Math.max(
            this._view.scrollHeight,
            this._view.offsetHeight,
            this._view.clientHeight
        );
        var maxScrollX = (viewWidth - viewportWidth);
        var maxScrollY = (viewHeight - viewportHeight);
        var _display = this;
        var _selection = this._selection;
        var _view = this._view;
        (function checkForViewScroll() {
            clearTimeout(_selection.timer);
            if (_adjustViewScroll()) {
                _selection.timer = setTimeout(checkForViewScroll, 30);
            }
        })();

        function _adjustViewScroll() {

            // Get the current scroll position of the document.
            var currentScrollX = _view.scrollLeft;
            var currentScrollY = _view.scrollTop;

            // Determine if the window can be scrolled in any particular direction.
            var canScrollUp = (currentScrollY > 0);
            var canScrollDown = (currentScrollY < maxScrollY);
            var canScrollLeft = (currentScrollX > 0);
            var canScrollRight = (currentScrollX < maxScrollX);

            // Since we can potentially scroll in two directions at the same time,
            // let's keep track of the next scroll, starting with the current scroll.
            // Each of these values can then be adjusted independently in the logic
            // below.
            var nextScrollX = currentScrollX;
            var nextScrollY = currentScrollY;

            // As we examine the mouse position within the edge, we want to make the
            // incremental scroll changes more "intense" the closer that the user
            // gets the viewport edge. As such, we'll calculate the percentage that
            // the user has made it "through the edge" when calculating the delta.
            // Then, that use that percentage to back-off from the "max" step value.
            var maxStep = 50;

            // Should we scroll left?
            if (isInLeftEdge && canScrollLeft) {
                var intensity = ((edgeLeft - viewportX) / edgeSize);
                nextScrollX = (nextScrollX - (maxStep * intensity));
                // Should we scroll right?
            } else if (isInRightEdge && canScrollRight) {
                var intensity = ((viewportX - edgeRight) / edgeSize);
                nextScrollX = (nextScrollX + (maxStep * intensity));
            }

            // Should we scroll up?
            if (isInTopEdge && canScrollUp) {
                var intensity = ((edgeTop - viewportY) / edgeSize);
                nextScrollY = (nextScrollY - (maxStep * intensity));
                // Should we scroll down?
            } else if (isInBottomEdge && canScrollDown) {
                var intensity = ((viewportY - edgeBottom) / edgeSize);
                nextScrollY = (nextScrollY + (maxStep * intensity));
            }
            nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
            nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));
            if (
                (nextScrollX !== currentScrollX) ||
                (nextScrollY !== currentScrollY)
            ) {
                _display.scrollTo(nextScrollX, nextScrollY);
                return true;
            }
            return false;
        }
        /*
        this._currentSelection.scrollTimer = setInterval(() => {
            /// pull as long as you can scroll either direction

            if (!this._lastMouse) {
                clearInterval(this._currentSelection.scrollTimer);
                this._currentSelection.scrollTimer = null;
                return;
            }
            const os = this._os;
            let x = this._lastMouse.pageX - os.left;
            let y = this._lastMouse.pageY - os.top;

            if (y <= 0 && this._VScroll.position > 0) {
                y = -1 * this._charHeight;
                this._currentSelection.end.y--;
            }
            else if (y >= this._innerHeight && this._VScroll.position < this._VScroll.scrollSize) {
                y = this._charHeight;
                this._currentSelection.end.y++;
                if (this._lines.length === 0)
                    this._currentSelection.end.x = 0;
                else if (this._currentSelection.end.y >= this._lines.length)
                    this._currentSelection.end.x = this.getLineText(this._lines.length - 1).length;
            }
            else
                y = 0;

            if (x < 0 && this._HScroll.position > 0) {
                x = -1 * this._charWidth;
                this._currentSelection.end.x--;
            }
            else if (x >= this._innerWidth && this._HScroll.position < this._HScroll.scrollSize) {
                x = this._charWidth;
                this._currentSelection.end.x++;
            }
            else if (x > 0 && this._currentSelection.end.y >= this._lines.length) {
                x = 0;
                if (this._lines.length === 0)
                    this._currentSelection.end.x = 0;
                else
                    this._currentSelection.end.x = this.getLineText(this.lines.length - 1).length;
            }
            else {
                x = 0;
                this._currentSelection.end.x = 0;
            }
            if (this._lines.length === 0) {
                this._currentSelection.end.lineID = null;
                this._currentSelection.end.lineOffset = null;
            }
            else if (this._currentSelection.end.y >= this._lines.length) {
                this._currentSelection.end.lineID = this._lines[this._lines.length - 1].id;
                this._currentSelection.end.lineOffset = this._lines[this._lines.length - 1].endOffset;
            }
            else {
                this._currentSelection.end.lineID = this._lines[this._currentSelection.end.y].id;
            }
            if (x === 0 && y === 0)
                return;

            this.emit('selection-changed');
            this._VScroll.scrollBy(y);
            this._HScroll.scrollBy(x);
            this.doUpdate(UpdateType.selection);
        }, 20);
        */
    }

    private _isBefore(nodeA, nodeB) {
        var position = nodeA.compareDocumentPosition(nodeB);
        //after
        if (position & 0x04) return false;
        //before
        //if (position & 0x02) return true;
        return true;
    }

    private _rangeToNode(range) {
        if (range.startContainer)
            return { node: range.startContainer, offset: range.startOffset };
        return { node: range.offsetNode, offset: range.offset };
    }

    private _startSelection(e) {
        if (!this.customSelection) return;
        this._trackSelection.down = this._getMouseEventCaretRange(e);
        this._selection.start = this._rangeToNode(this._trackSelection.down);
        this._selection.end = this._selection.start;
        this._updateSelectionHighlight();
    }

    private _setSelection() {
        if (!this.customSelection || !this._trackSelection.down) return;
        let down = this._rangeToNode(this._trackSelection.down);
        let up = this._rangeToNode(this._trackSelection.up);
        if (down.node === up.node) {
            if (down.offset < up.offset) {
                this._selection.start = down;
                this._selection.end = up;
            }
            else {
                this._selection.start = up;
                this._selection.end = down;
            }
        }
        else if (!this._isBefore(down.node, up.node)) {
            this._selection.start = down;
            this._selection.end = up;
        }
        else {
            this._selection.start = up;
            this._selection.end = down;
        }
        debounce(() => {
            let range;
            if (this._document.activeElement !== this._container) return;
            //firefox hack, seems it likes to use current range
            if (this._window.getSelection().rangeCount === 0) {
                range = this._document.createRange();
                range.setStart(this._selection.start.node, this._selection.start.offset);
                range.setEnd(this._selection.end.node, this._selection.end.offset);
                this._window.getSelection().addRange(range);
            }
            else {
                range = this._window.getSelection().getRangeAt(0);
                range.setStart(this._selection.start.node, this._selection.start.offset);
                range.setEnd(this._selection.end.node, this._selection.end.offset);
            }
        }, 1, this.id + 'set-selection');
        this.emit('selection-changed');
        this._updateSelectionHighlight();
    }

    private _endSelection(e) {
        if (!this.customSelection) return;
        const caret = this._getMouseEventCaretRange(e);
        if (caret)
            this._trackSelection.up = caret;
        this._setSelection();
    }

    private _setSelectionRange(range) {
        if (!range) return;
        this._trackSelection.down = document.createRange();
        this._trackSelection.down.setStart(range.startContainer, range.startOffset);
        this._trackSelection.down.setEnd(range.startContainer, range.startOffset);
        this._trackSelection.up = document.createRange();
        this._trackSelection.up.setStart(range.endContainer, range.endOffset);
        this._trackSelection.up.setEnd(range.endContainer, range.endOffset);
        this._setSelection();
    }

    /**
     * Retrieves an array of all text nodes under a given element.
     *
     * @param { Node } el - The element under which to search for text nodes.
     * @returns { Node[] } An array of text nodes found under the given element.
     */
    private _textNodesUnder(el) {
        const children = [] // Type: Node[]
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        while (walker.nextNode()) {
            children.push(walker.currentNode)
        }
        return children
    }

    private _findIndexOfSymbol(el, node, offset) {
        node = node.parentNode == el ? node : node.parentNode;
        let nodes = [...el.childNodes];
        let index = nodes.indexOf(node);
        let num = 0;
        for (let i = 0; i < index; i++) {
            num += nodes[i].textContent.length;
        }
        return num + offset;
    }
}

export class DisplayModel extends EventEmitter {
    private _lineID = 0;
    private _parser: Parser;
    public lines: LineData[] = [];
    private _lineIDs: number[] = [];
    private _expire = {};
    private _expire2 = [];

    get enableDebug() {
        return this._parser.enableDebug;
    }

    set enableDebug(value) {
        this._parser.enableDebug = value;
    }

    get tabWidth(): number {
        return this._parser.tabWidth;
    }

    set tabWidth(value) {
        this._parser.tabWidth = value;
    }

    get textLength(): number {
        return this._parser.textLength;
    }

    get EndOfLine(): boolean {
        return this._parser.EndOfLine;
    }

    get parseQueueLength(): number {
        return this._parser.parseQueueLength;
    }

    get parseQueueEndOfLine(): boolean {
        return this._parser.parseQueueEndOfLine;
    }

    set enableFlashing(value: boolean) {
        this._parser.enableFlashing = value;
    }
    get enableFlashing(): boolean {
        return this._parser.enableFlashing;
    }

    set enableMXP(value: boolean) {
        this._parser.enableMXP = value;
    }
    get enableMXP(): boolean {
        return this._parser.enableMXP;
    }

    set showInvalidMXPTags(value: boolean) {
        this._parser.showInvalidMXPTags = value;
    }
    get showInvalidMXPTags(): boolean {
        return this._parser.showInvalidMXPTags;
    }

    set enableBell(value: boolean) {
        this._parser.enableBell = value;
    }
    get enableBell(): boolean {
        return this._parser.enableBell;
    }

    set enableURLDetection(value: boolean) {
        this._parser.enableURLDetection = value;
    }
    get enableURLDetection(): boolean {
        return this._parser.enableURLDetection;
    }

    set enableMSP(value: boolean) {
        this._parser.enableMSP = value;
    }
    get enableMSP(): boolean {
        return this._parser.enableMSP;
    }

    set displayControlCodes(value: boolean) {
        this._parser.displayControlCodes = value;
    }
    get displayControlCodes(): boolean {
        return this._parser.displayControlCodes;
    }

    set emulateTerminal(value: boolean) {
        this._parser.emulateTerminal = value;
    }
    get emulateTerminal(): boolean {
        return this._parser.emulateTerminal;
    }

    set emulateControlCodes(value: boolean) {
        this._parser.emulateControlCodes = value;
    }
    get emulateControlCodes(): boolean {
        return this._parser.emulateControlCodes;
    }

    set MXPStyleVersion(value: string) {
        this._parser.StyleVersion = value;
    }
    get MXPStyleVersion(): string {
        return this._parser.StyleVersion;
    }

    constructor(options: DisplayOptions) {
        super();
        this._parser = new Parser(options);
        this._parser.on('debug', (msg) => { this.emit('debug', msg); });

        this._parser.on('bell', () => { this.emit('bell'); });

        this._parser.on('add-line', (data: ParserLine) => {
            this.addParserLine(data, true);
        });

        this._parser.on('expire-links', (args) => {
            let lines;
            let line;
            let expire;
            if (!args || args.length === 0) {
                for (line in this._expire2) {
                    if (!this._expire2.hasOwnProperty(line))
                        continue;
                    this._expireLineLinkFormat(this._expire2[line], +line);
                }
                for (expire in this._expire) {
                    if (!this._expire.hasOwnProperty(expire))
                        continue;
                    lines = this._expire[expire];
                    for (line in lines) {
                        if (!lines.hasOwnProperty(line))
                            continue;
                        this._expireLineLinkFormat(lines[line], +line);
                    }
                }
                this._expire2 = [];
                this._expire = {};
                this.emit('expire-links', args);
            }
            else if (this._expire[args]) {
                lines = this._expire[args];
                for (line in lines) {
                    if (!lines.hasOwnProperty(line))
                        continue;
                    this._expireLineLinkFormat(lines[line], +line);
                }
                delete this._expire[args];
                this.emit('expire-links', args);
            }
        });

        this._parser.on('parse-done', () => {
            this.emit('parse-done');
        });

        this._parser.on('set-title', (title, type) => {
            this.emit('set-title', title, type);
        });
        this._parser.on('music', (data) => {
            this.emit('music', data);
        });
        this._parser.on('sound', (data) => {
            this.emit('sound', data);
        });

        this._parser.on('MXP-tag-reply', (tag, args) => {
            this.emit('MXP-tag-reply', tag, args);
        });

    }

    public addParserLine(data: ParserLine, noUpdate?: boolean) {
        data.timestamp = Date.now();
        this.emit('add-line', data);
        if (data == null || typeof data === 'undefined' || data.line == null || typeof data.line === 'undefined')
            return;
        this.emit('add-line-done', data);
        if (data.gagged)
            return;
        const line: LineData = {
            text: (data.line === '\n' || data.line.length === 0) ? '' : data.line,
            raw: data.raw,
            formats: data.formats,
            id: this._lineID,
            timestamp: data.timestamp
        }
        this.lines.push(line);
        this._lineIDs.push(this._lineID);
        this._lineID++;
        this._buildLineExpires(this.lines.length - 1);
        this.emit('line-added', data, noUpdate);
    }

    public appendLines(data: ParserLine[]) {
        for (let d = 0, dl = data.length; d < dl; d++)
            this.addParserLine(data[d]);
        this._parser.emit('parse-done');
    }

    private _expireLineLinkFormat(formats, idx: number) {
        let f;
        let fs;
        let fl;
        let fsl;
        let type;
        let eType;
        let format;
        let n = 0;
        for (fs = 0, fsl = formats.length; fs < fsl; fs++) {
            fl = this.lines[idx].formats.length;
            f = formats[fs];
            format = this.lines[idx].formats[f];
            type = format.formatType;
            if (format.formatType === FormatType.MXPLink)
                eType = FormatType.MXPLinkEnd;
            else
                eType = FormatType.MXPSendEnd;
            format.formatType = FormatType.MXPExpired;
            f++;
            for (; f < fl; f++) {
                if (this.lines[idx].formats[f] === eType) {
                    if (n === 0) {
                        this.lines[idx].formats[f].formatType = FormatType.MXPSkip;
                        break;
                    }
                    else
                        n--;
                }
                else if (this.lines[idx].formats[f] === type)
                    n++;
            }
        }
        this.emit('expire-link-line', idx);
    }

    public clear() {
        this._parser.Clear();
        this.lines = [];
        this._expire = {};
        this._expire2 = [];
        this._lineIDs = [];
        this._lineID = 0;
    }

    public IncreaseColor(color, percent) {
        return this._parser.IncreaseColor(color, percent);
    }

    public GetColor(color) {
        return this._parser.GetColor(color);
    }

    public append(txt: string, remote?: boolean, force?: boolean, prependSplit?: boolean) {
        this._parser.parse(txt, remote || false, force || false, prependSplit || false);
    }

    public CurrentAnsiCode() {
        return this._parser.CurrentAnsiCode();
    }

    public updateWindow(width?, height?) {
        this._parser.updateWindow(width, height);
    }

    public SetColor(code: number, color) {
        this._parser.SetColor(code, color);
    }

    public ClearMXP() {
        this._parser.ClearMXP();
    }

    public ResetMXPLine() {
        this._parser.ResetMXPLine();
    }

    get busy() {
        return this._parser.busy;
    }

    public removeLine(line: number) {
        this.lines.splice(line, 1);
        this._lineIDs.splice(line, 1);
        this._expire2.splice(line, 1);
    }

    public removeLines(line: number, amt: number) {
        this.lines.splice(line, amt);
        this._lineIDs.splice(line, amt);
        this._expire2.splice(line, amt);
        for (let ol in this._expire) {
            if (!this._expire.hasOwnProperty(ol) || this._expire[ol].length === 0 || line >= this._expire[ol].length)
                continue;
            this._expire[ol].splice(line, amt);
        }
    }

    public getLineID(line: number) {
        if (line < 0 || line >= this._lineIDs.length) return -1;
        return this._lineIDs[line];
    }

    public get getNextLineID() {
        return this._lineID;
    }

    public getLineFromID(id) {
        return this._lineIDs.indexOf(id);
    }

    private _buildLineExpires(idx) {
        if (idx === undefined)
            idx = this.lines.length - 1;
        const formats = this.lines[idx].formats;
        for (const ol in this._expire) {
            if (!this._expire.hasOwnProperty(ol))
                continue;
            if (this._expire[ol][idx])
                delete this._expire[ol][idx];
        }
        delete this._expire2[idx];
        let f = formats.length;
        let format;
        while (f--) {
            format = formats[f];
            if (format.formatType === FormatType.MXPSend || format.formatType === FormatType.MXPLink) {
                if (format.expire && format.expire.length > 0) {
                    if (!this._expire[format.expire])
                        this._expire[format.expire] = [];
                    if (!this._expire[format.expire][idx])
                        this._expire[format.expire][idx] = [];
                    this._expire[format.expire][idx].push(f);
                }
                else {
                    if (!this._expire2[idx])
                        this._expire2[idx] = [];
                    this._expire2[idx].push(f);
                }
            }
        }
    }

    //color like javascript.substr using 0 index and length
    public colorSubStrByLine(idx: number, fore, back?, start?: number, len?: number, style?: FontStyle) {
        return this.colorSubStringByLine(idx, fore, back, start, start + len, style);
    }

    //color like javascript.substring using 0 index for start and end
    public colorSubStringByLine(idx: number, fore, back?, start?: number, end?: number, style?: FontStyle) {
        //invalid line bail
        if (idx < 0 || idx >= this.lines.length) return false;
        const lineLength = this.lines[idx].text.length;
        //passed line skip
        if (start >= lineLength) return false;
        if (!start || start < 0) start = 0;
        if (!end || end > lineLength)
            end = lineLength;
        if (start === end)
            return false;
        const formats = this.lines[idx].formats;
        let len = formats.length;
        let found: boolean = false;
        //whole line so just do everything
        if (start === 0 && end >= lineLength) {
            for (let f = 0; f < len; f++) {
                const format = formats[f];
                //only worry about normal types
                if (format.formatType !== FormatType.Normal)
                    continue;
                found = true;
                if (format.bStyle) {
                    format.bStyle = 0;
                    format.fStyle = 0;
                    format.fCls = 0;
                }
                format.color = fore || format.color;
                format.background = back || format.background;
                format.style |= style || FontStyle.None;
            }
            //found no text block must create one
            if (!found) {
                formats.unshift({
                    formatType: FormatType.Normal,
                    offset: 0,
                    color: fore || 0,
                    background: back || 0,
                    size: 0,
                    font: 0,
                    style: style || FontStyle.None,
                    unicode: false
                });
            }
        }
        else {
            let nFormat;
            let formatEnd;
            for (let f = 0; f < len; f++) {
                const format = formats[f];
                //only worry about normal types
                if (format.formatType !== FormatType.Normal)
                    continue;
                //find the end of he format
                if (f < len - 1) {
                    let nF = f + 1;
                    nFormat = formats[nF];
                    //skip empty blocks
                    if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
                        continue;
                    //find next block that is not same offset
                    while (format.offset === nFormat.offset && nFormat.formatType === format.formatType && nF < len - 1)
                        nFormat = formats[++nF];
                    //last block same offset use total length
                    if (nF === len && format.offset === nFormat.offset)
                        formatEnd = lineLength;
                    else
                        formatEnd = nFormat.offset;
                }
                else
                    formatEnd = lineLength;
                if (start < format.offset) continue;
                //passed end so try next block
                if (start >= formatEnd) continue;
                //after this block move on.
                //not offset so need to insert a new block
                found = true;
                if (format.bStyle) {
                    format.bStyle = 0;
                    format.fStyle = 0;
                    format.fCls = 0;
                }
                //if end middle of block, add new block with old info to split
                if (end < formatEnd) {
                    format.width = 0;
                    formats.splice(f + 1, 0, {
                        formatType: format.formatType,
                        offset: end,
                        color: format.color,
                        background: format.background,
                        size: format.size,
                        font: format.font,
                        style: format.style,
                        unicode: format.unicode
                    });
                    len++;
                }
                if (start != format.offset) {
                    //clean old width
                    format.width = 0;
                    //insert new block with new colors
                    formats.splice(f + 1, 0, {
                        formatType: format.formatType,
                        offset: start,
                        color: fore || format.color,
                        background: back || format.background,
                        size: format.size,
                        font: format.font,
                        style: format.style | (style || FontStyle.None),
                        unicode: format.unicode
                    });
                    len++;
                }
                else {
                    format.color = fore || format.color;
                    format.background = back || format.background;
                    format.style |= (style || FontStyle.None);
                }
                //not end so shift start to next block
                if (end > formatEnd)
                    start = formatEnd;
            }
            //clean out duplicates and other no longer needed blocks
            this.lines[idx].formats = this._pruneFormats(formats, this.textLength);
        }
        return true;
    }

    public removeStyleSubStrByLine(idx: number, style: FontStyle, start?: number, len?: number) {
        return this.removeStyleSubStringByLine(idx, style, start, start + len);
    }

    //color like javascript.substring using 0 index for start and end
    public removeStyleSubStringByLine(idx: number, style: FontStyle, start?: number, end?: number) {
        //invalid line bail
        if (idx < 0 || idx >= this.lines.length) return false;
        const lineLength = this.lines[idx].text.length;
        //passed line skip
        if (start >= lineLength) return false;
        if (!start || start < 0) start = 0;
        if (!end || end > lineLength)
            end = lineLength;

        const formats = this.lines[idx].formats;
        let len = formats.length;
        let found: boolean = false;
        //whole line so just do everything
        if (start === 0 && end >= lineLength) {
            for (let f = 0; f < len; f++) {
                const format = formats[f];
                //only worry about normal types
                if (format.formatType !== FormatType.Normal)
                    continue;
                found = true;
                if (format.bStyle) {
                    format.bStyle = 0;
                    format.fStyle = 0;
                    format.fCls = 0;
                }
                format.style &= ~(style || FontStyle.None);
            }
            //found no text block must create one
            if (!found) {
                formats.unshift({
                    formatType: FormatType.Normal,
                    offset: 0,
                    color: 0,
                    background: 0,
                    size: 0,
                    font: 0,
                    style: FontStyle.None,
                    unicode: false
                });
            }
        }
        else {
            let nFormat;
            let formatEnd;
            for (let f = 0; f < len; f++) {
                const format = formats[f];
                //only worry about normal types
                if (format.formatType !== FormatType.Normal)
                    continue;
                //find the end of he format
                if (f < len - 1) {
                    let nF = f + 1;
                    nFormat = formats[nF];
                    //skip empty blocks
                    if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
                        continue;
                    //find next block that is not same offset
                    while (format.offset === nFormat.offset && nFormat.formatType === format.formatType && nF < len - 1)
                        nFormat = formats[++nF];
                    //last block same offset use total length
                    if (nF === len && format.offset === nFormat.offset)
                        formatEnd = lineLength;
                    else
                        formatEnd = nFormat.offset;
                }
                else
                    formatEnd = lineLength;
                if (start < format.offset) continue;
                //passed end so try next block
                if (start >= formatEnd) continue;
                //after this block move on.
                //not offset so need to insert a new block
                found = true;
                if (format.bStyle) {
                    format.bStyle = 0;
                    format.fStyle = 0;
                    format.fCls = 0;
                }
                //if end middle of block, add new block with old info to split
                if (end < formatEnd) {
                    format.width = 0;
                    formats.splice(f + 1, 0, {
                        formatType: format.formatType,
                        offset: end,
                        color: format.color,
                        background: format.background,
                        size: format.size,
                        font: format.font,
                        style: format.style,
                        unicode: format.unicode
                    });
                    len++;
                }
                if (start != format.offset) {
                    //clean old width
                    format.width = 0;
                    //insert new block with new colors
                    formats.splice(f + 1, 0, {
                        formatType: format.formatType,
                        offset: start,
                        color: format.color,
                        background: format.background,
                        size: format.size,
                        font: format.font,
                        style: format.style & ~(style || FontStyle.None),
                        unicode: format.unicode
                    });
                    len++;
                }
                else {
                    format.style &= ~(style || FontStyle.None);
                }
                //not end so shift start to next block
                if (end > formatEnd)
                    start = formatEnd;
            }
            //clean out duplicates and other no longer needed blocks
            this.lines[idx].formats = this._pruneFormats(formats, this.textLength);
        }
        return true;
    }

    public highlightSubStrByLine(idx: number, start?: number, len?: number) {
        return this.highlightStyleSubStringByLine(idx, start, start + len);
    }

    //color like javascript.substring using 0 index for start and end
    public highlightStyleSubStringByLine(idx: number, start?: number, end?: number, color?: boolean) {
        //invalid line bail
        if (idx < 0 || idx >= this.lines.length) return false;
        const lineLength = this.lines[idx].text.length;
        //passed line skip
        if (start >= lineLength) return false;
        if (!start || start < 0) start = 0;
        if (!end || end > lineLength)
            end = lineLength;

        const formats = this.lines[idx].formats;
        let len = formats.length;
        let found: boolean = false;
        //whole line so just do everything
        if (start === 0 && end >= lineLength) {
            for (let f = 0; f < len; f++) {
                const format = formats[f];
                //only worry about normal types
                if (format.formatType !== FormatType.Normal)
                    continue;
                found = true;
                if (format.bStyle) {
                    format.bStyle = 0;
                    format.fStyle = 0;
                    format.fCls = 0;
                }
                if (color || (format.style & FontStyle.Bold) === FontStyle.Bold) {
                    if (typeof format.color === 'number')
                        format.color = this._parser.IncreaseColor(this._parser.GetColor(format.color), 0.25);
                    else
                        format.color = this._parser.IncreaseColor(format.color, 0.25);
                }
                else
                    format.style |= FontStyle.Bold;
            }
            //found no text block must create one
            if (!found) {
                formats.unshift({
                    formatType: FormatType.Normal,
                    offset: 0,
                    color: color ? 370 : 0,
                    background: 0,
                    size: 0,
                    font: 0,
                    style: color ? FontStyle.None : FontStyle.Bold,
                    unicode: false
                });
            }
        }
        else {
            let nFormat;
            let formatEnd;
            for (let f = 0; f < len; f++) {
                const format = formats[f];
                //only worry about normal types
                if (format.formatType !== FormatType.Normal)
                    continue;
                //find the end of he format
                if (f < len - 1) {
                    let nF = f + 1;
                    nFormat = formats[nF];
                    //skip empty blocks
                    if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
                        continue;
                    //find next block that is not same offset
                    while (format.offset === nFormat.offset && nFormat.formatType === format.formatType && nF < len - 1)
                        nFormat = formats[++nF];
                    //last block same offset use total length
                    if (nF === len && format.offset === nFormat.offset)
                        formatEnd = lineLength;
                    else
                        formatEnd = nFormat.offset;
                }
                else
                    formatEnd = lineLength;
                if (start < format.offset) continue;
                //passed end so try next block
                if (start >= formatEnd) continue;
                //after this block move on.
                //not offset so need to insert a new block
                found = true;
                if (format.bStyle) {
                    format.bStyle = 0;
                    format.fStyle = 0;
                    format.fCls = 0;
                }
                //if end middle of block, add new block with old info to split
                if (end < formatEnd) {
                    format.width = 0;
                    formats.splice(f + 1, 0, {
                        formatType: format.formatType,
                        offset: end,
                        color: format.color,
                        background: format.background,
                        size: format.size,
                        font: format.font,
                        style: format.style,
                        unicode: format.unicode
                    });
                    len++;
                }
                if (start != format.offset) {
                    //clean old width
                    format.width = 0;
                    //insert new block with new colors
                    nFormat = {
                        formatType: format.formatType,
                        offset: start,
                        color: format.color,
                        background: format.background,
                        size: format.size,
                        font: format.font,
                        style: format.style,
                        unicode: format.unicode
                    }
                    if (color || (format.style & FontStyle.Bold) === FontStyle.Bold) {
                        if (typeof format.color === 'number')
                            nFormat.color = this._parser.IncreaseColor(this._parser.GetColor(format.color), 0.25);
                        else
                            nFormat.color = this._parser.IncreaseColor(format.color, 0.25);
                    }
                    else
                        nFormat.style |= FontStyle.Bold;
                    formats.splice(f + 1, 0, nFormat);
                    len++;
                }
                else if (color || (format.style & FontStyle.Bold) === FontStyle.Bold) {
                    if (typeof format.color === 'number')
                        format.color = this._parser.IncreaseColor(this._parser.GetColor(format.color), 0.25);
                    else
                        format.color = this._parser.IncreaseColor(format.color, 0.25);
                }
                else
                    format.style |= FontStyle.Bold;

                //not end so shift start to next block
                if (end > formatEnd)
                    start = formatEnd;
            }
            //clean out duplicates and other no longer needed blocks
            this.lines[idx].formats = this._pruneFormats(formats, this.textLength);
        }
        return true;
    }

    private _pruneFormats(formats, textLen) {
        //no formats or only 1 format
        if (!formats || formats.length < 2) return formats;
        const l = formats.length;
        const nF = [];
        for (let f = 0; f < l; f++) {
            const format = formats[f];
            let end;
            if (f < l - 1) {
                const nFormat = formats[f + 1];
                //old links that have expired so no longer needed clean
                //if (format.formatType === FormatType.MXPSkip) continue;
                //skip format until find one that has different offset
                if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
                    continue;
                end = nFormat.offset;
                //empty link
                if (format.formatType === FormatType.Link && end - format.offset === 0 && nFormat.formatType === FormatType.LinkEnd)
                    continue;
                //empty send
                if (format.formatType === FormatType.MXPSend && end - format.offset === 0 && nFormat.formatType === FormatType.MXPSendEnd)
                    continue;
                //empty link
                if (format.formatType === FormatType.MXPLink && end - format.offset === 0 && nFormat.formatType === FormatType.MXPLinkEnd)
                    continue;
                //same data but offset is higher, set next block current offset, clear width and continue;
                if (
                    format.formatType === nFormat.formatType &&
                    format.color === nFormat.color &&
                    format.background === nFormat.background &&
                    format.size === nFormat.size &&
                    format.font === nFormat.font &&
                    format.style === nFormat.style &&
                    format.unicode === nFormat.unicode
                ) {
                    nFormat.offset = format.offset;
                    nFormat.width = 0;
                    continue;
                }
            }
            //trailing link with no text or empty format block and not fragment
            else if (format.offset === textLen && textLen !== 0 && ((format.formatType === FormatType.Normal && !format.hr) || format.formatType === FormatType.Link || format.formatType === FormatType.MXPSend || format.formatType === FormatType.MXPLink))
                continue;
            nF.push(format);
        }
        return nF;
    }

    get text(): string {
        return this.lines.map(line => line.text).join('\n');
    }

    get raw(): string {
        return this.lines.map(line => line.raw).join('');
    }

    public getText(line, start, end?) {
        if (line < 0 || line >= this.lines.length) return '';
        if (start < 0) start = 0;
        if (typeof end === 'undefined' || end > this.lines[line].text.length)
            return this.lines[line].text.substring(start);
        return this.lines[line].text.substring(start, end);
    }
}
