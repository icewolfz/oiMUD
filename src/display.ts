import { EventEmitter } from "./events";
import { Parser } from "./parser";
import { Size, DisplayOptions, ParserLine, FormatType, FontStyle, Point } from "./types";
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
    rebuildLines = 1 << 5
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

    private _linkFunction;
    private _mxpLinkFunction;
    private _mxpSendFunction;
    private _mxpTooltipFunction;
    private _scrollAtEnd = false;

    private _resizeObserver;
    private _resizeObserverCache;
    private _observer: MutationObserver;

    private _wResize;
    private _selection;

    private _lineCache: string[] = [];
    private _expireCache: number[] = [];

    private _timestamp: TimeStampStyle = TimeStampStyle.None;
    private _timestampFormat: string = '[[]MM-DD HH:mm:ss.SSS[]] ';
    private _timestampWidth: number = new Date().toISOString().length + 1;
    private _mouseDown = false;
    //#endregion
    //#region Public properties
    public scrollLock: boolean = false;

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
        this._doUpdate(UpdateType.display | UpdateType.update | UpdateType.rebuildLines);
    }

    get timestampFormat() { return this._timestampFormat; }
    set timestampFormat(value: string) {
        if (this._timestampFormat === value) return;
        this._timestampFormat = value;
        if (!moment || this._timestamp !== TimeStampStyle.Format)
            this._timestampWidth = new Date().toISOString().length + 1;
        else
            this._timestampWidth = moment().format(this._timestampFormat).length;
        this._doUpdate(UpdateType.display | UpdateType.rebuildLines | UpdateType.updateWindow | UpdateType.update);
    }
    z
    get wordWrap(): boolean {
        return this._wordWrap;
    }

    set wordWrap(value: boolean) {
        if (value === this._wordWrap) return;
        this._wordWrap = value;
        this._buildStyleSheet();
        this._doUpdate(UpdateType.update);
    }

    get wrapAt() { return this._wrapAt; }
    set wrapAt(value: number) {
        if (value === this._wrapAt) return;
        this._wrapAt = value;
        this._buildStyleSheet();
        this._doUpdate(UpdateType.update | UpdateType.display);
    }

    get indent() { return this._indent; }
    set indent(value: number) {
        if (value === this._indent)
            return;
        this._indent = value;
        this._buildStyleSheet();
        this._doUpdate(UpdateType.update | UpdateType.display);
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
            this._view.insertAdjacentHTML('beforeend', this._lineCache.join(''));
            this._lineCache = [];
            this._doUpdate(UpdateType.display);
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
            this._doUpdate(UpdateType.display);
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
            return Math.trunc((this._innerHeight - getScrollbarWidth() - this._padding[0] - this._padding[2]) / this._charHeight);
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
        else
            throw new Error('Container must be a selector, element or jquery object');
        this._styles = document.createElement('style');
        this._container.appendChild(this._styles);
        this._character = document.createElement('span');
        this._character.id = this.id + '-Character';
        this._character.className = 'line';
        this._character.innerHTML = '<span style="border-bottom: 1px solid rgb(0, 0, 0);">W</span>';
        this._character.style.visibility = 'hidden';
        this._container.appendChild(this._character);

        this._view = document.createElement('div');
        this._view.className = 'view';
        this._view.addEventListener('scroll', () => {
            this._scrollAtEnd = this._view.clientHeight + this._view.scrollTop >= this._view.scrollHeight;
        });
        this._view.addEventListener('click', e => {
            this.emit('click', e);
        })
        this._view.addEventListener('contextmenu', e => {
            this.emit('contextmenu', e);
        });
        this._view.addEventListener('mousedown', e => {
            this.emit('mousedown', e);
            this._mouseDown = true
        });
        this._view.addEventListener('mouseup', e => {
            this.emit('mouseup', e);
            //only trigger if the mouse started in this element
            if (this._mouseDown)
                this.emit('selection-done');
            this._mouseDown = false;
        });
        this._container.appendChild(this._view);

        this._charHeight = parseFloat(window.getComputedStyle(this._character).height);
        this._charWidth = parseFloat(window.getComputedStyle(this._character.firstElementChild).width);
        if (!options)
            options = { display: this };
        else
            options.display = this;
        this.model = new DisplayModel(options);

        this._wResize = (e) => {
            if (this._scrollAtEnd)
                this.scrollDisplay();
            debounce(() => {
                this._doUpdate(UpdateType.update | UpdateType.updateWindow);
            }, 250, 'resize');
        };
        this._selection = e => {
            if (this._mouseDown)
                debounce(() => {
                    this.emit('selection-changed');
                }, 250, 'selection-changed');
        };
        window.addEventListener('resize', this._wResize.bind(this));
        document.addEventListener("selectionchange", this._selection.bind(this));

        this._resizeObserver = new ResizeObserver((entries, observer) => {
            if (entries.length === 0) return;
            if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
                return;
            debounce(() => {
                if (!this._resizeObserverCache || this._resizeObserverCache.width !== entries[0].contentRect.width || this._resizeObserverCache.height !== entries[0].contentRect.height) {
                    if (this._scrollAtEnd)
                        this.scrollDisplay();
                    this._resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
                    this._doUpdate(UpdateType.update | UpdateType.updateWindow);
                    this.emit('resize');
                }
            }, 250, 'resize');
        });
        this._resizeObserver.observe(this._container);
        this._observer = new MutationObserver((mutationsList) => {
            let mutation;
            for (mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (this._scrollAtEnd)
                        this.scrollDisplay();
                    this._doUpdate(UpdateType.update | UpdateType.updateWindow);
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
    }

    public debug(msg) {
        this.emit('debug', msg);
    }

    public scrollDisplay(): void {
        if (!this.scrollLock)
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
        if (this.lines.length > this._maxLines) {
            const amt = this.lines.length - this._maxLines;
            let r = amt;
            while (r-- > 0)
                this._view.removeChild(this._view.firstChild);
            this._model.removeLines(0, amt);
        }
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
        const elLine = document.querySelector(`[data-id="${id}"]`);
        this._view.removeChild(elLine);
        this._model.removeLine(line);
    }

    public removeLines(line: number, amt: number) {
        if (line < 0 || line >= this.lines.length) return;
        if (amt < 1) amt = 1;
        this.emit('lines-removed', line, this.lines.slice(line, line + amt - 1));
        //const id = this._model.getLineID(line);
        //const elLine = document.querySelector(`[data-id="${id}"]`);
        //this._view.removeChild(elLine);
        this._view.replaceChildren(...[].slice.call(this._view.children, 0, line), ...[].slice.call(this._view.children, line + amt));
        this._model.removeLines(line, amt);
    }

    private _updateDisplay() {
        //disable animation
        this._view.classList.remove('animate');
        this._doUpdate(UpdateType.trim);
        if (this._hideTrailingEmptyLine && this.lines.length && this.lines[this.lines.length - 1].text.length === 0)
            (<HTMLElement>this._view.lastChild).style.display = 'none';
        this._doUpdate(UpdateType.scrollEnd | UpdateType.updateWindow);
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
        document.body.removeChild(this._character);
        document.body.removeChild(this._styles);
        while (this._container.firstChild)
            this._view.removeChild(this._view.firstChild);
        window.removeEventListener('resize', this._wResize);
        document.removeEventListener("selectionchange", this._selection);
    }

    private _update() {
        const scrollWidth = getScrollbarWidth();
        this._maxView = this._view.clientWidth - this._padding[1] - this._padding[3] - scrollWidth - this._indentPadding;
        if (this._timestamp !== TimeStampStyle.None)
            this._maxView -= this._timestampWidth * this._charWidth;
        this._innerHeight = this._view.clientHeight;
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
            this._charHeight = parseFloat(window.getComputedStyle(this._character).height);
            this._charWidth = parseFloat(window.getComputedStyle(this._character.firstElementChild).width);
            setTimeout(() => {
                this._charHeight = parseFloat(window.getComputedStyle(this._character).height);
                this._charWidth = parseFloat(window.getComputedStyle(this._character.firstElementChild).width);
            }, 250);
            this._buildStyleSheet();
            this._doUpdate(UpdateType.scrollEnd | UpdateType.updateWindow | UpdateType.update);
        }
        const pc = window.getComputedStyle(this._view);
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
            styles += '.view > span span {color: inherit !important;}';
        if (!this._enableColors || !this._enableBackgroundColors)
            styles += '.background > span span {background-color: inherit !important;}';
        if (this._wordWrap)
            styles += '.view {white-space: break-spaces; }';
        else if (this._wrapAt > 0)
            styles += `.view {white-space: break-spaces; } .line {width: ${this._wrapAt * this._charWidth}px !important;max-width:  ${this._wrapAt * this._charWidth}px;min-width:  ${this._wrapAt * this._charWidth}px;display: block;}`
        if ((this._wordWrap || this._wrapAt > 0) && this._indent > 0)
            styles += `.view {  padding-left: 0px !important; text-indent: ${this._indent * this._charWidth}px hanging; }`;
        //styles += `.view { padding-left: ${this._indent * this._charWidth * 2}px;text-indent: -${this._indent * this._charWidth}px; }@-moz-document url-prefix() { .view {  padding-left: 0px !important; text-indent: ${this._indent * this._charWidth}px hanging; } }`;
        styles += `.line > span { min-height: ${this._charHeight}}`;
        if (this._timestamp !== TimeStampStyle.None)
            styles += '.timestamp { display: inline-block; }';
        //else
        //styles += '.timestamp { display: none !important; }';
        this._styles.innerHTML = styles;
        if ((this._wordWrap || this._wrapAt > 0) && this._indent > 0)
            this._indentPadding = parseFloat(window.getComputedStyle(this._view).paddingLeft) / 2;
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
                return parts.join('') + '<br>';
            if (len < this.lines[idx].text.length)
                return parts.join('');
            return parts.join('') + '<br>';
        }
        if (right && len < this.lines[idx].text.length)
            return `<span data-id="${id}" class="line" style="min-width:100%">${parts.join('')}</span>`;
        if (right)
            return `<span data-id="${id}" class="line" style="min-width:100%">${parts.join('')}<br></span>`;
        if (len < this.lines[idx].text.length)
            return `<span data-id="${id}" class="line">${parts.join('')}</span>`;
        return `<span  data-id="${id}" class="line">${parts.join('')}<br></span>`;
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
        window.requestAnimationFrame(() => {
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
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            return this._view.contains(range.commonAncestorContainer) && selection.toString().length !== 0;
        }
        return false;
    }

    get selection(): string {
        if (window.getSelection) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (this._view.contains(range.startContainer) || this._view.contains(range.endContainer)) {
                    return selection.toString();
                }
            }
        }
        return '';
    }

    get selectionAsHTML(): string {
        var range;
        if (window.getSelection) {
            var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
                if (!this._view.contains(range.startContainer) && !this._view.contains(range.endContainer))
                    return '';
                var clonedSelection = range.cloneContents();
                var div = document.createElement('div');
                div.appendChild(clonedSelection);
                return div.innerHTML;
            }
            else {
                return '';
            }
        }
        else if ((document as any).selection && (document as any).selection.createRange) {
            range = (document as any).selection.createRange();
            return range.htmlText;
        }
        else {
            return '';
        }
    }

    public selectAll() {
        let range;
        if (window.getSelection) {
            if (window.getSelection().selectAllChildren)
                window.getSelection().selectAllChildren(this._view);
            else {
                range = document.createRange();
                range.selectNode(this._view);
                window.getSelection().addRange(range);
            }
        }
        else if ((document as any).selection) { //IE
            range = (document.body as any).createTextRange();
            range.moveToElementText(this._view);
            range.select();
        }
    }

    public clearSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (this._view.contains(range.startContainer) || this._view.contains(range.endContainer)) {
                selection.removeAllRanges();
            }
        }
    }

    public getLineOffset(x, y): Point {
        const elements = document.elementsFromPoint(x, y);
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
        const line = element.closest('.line') as HTMLElement;
        if (line)
            return { x: 0, y: this.model.getLineFromID(+line.dataset.id), lineID: +line.dataset.id };
        return { x: -1, y: -1, lineID: -1 };
    }

    public getWordFromPosition(x, y): string {
        // Get the element at the specified coordinates
        const elements = document.elementsFromPoint(x, y);
        let element;
        for (let e = 0, el = elements.length; e < el; e++) {
            if (this._view === elements[e]) return '';
            if (this._view.contains(elements[e])) {
                element = elements[e];
                break;
            }
        }

        // Check if the element exists and contains text
        if (element && element.textContent) {
            // Get the text content of the element
            const text = element.textContent;

            // Find the word boundaries around the specified position
            let start = text.lastIndexOf(' ', x) + 1;
            let end = text.indexOf(' ', x);
            if (end === -1) {
                end = text.length;
            }

            // Extract the word
            const word = text.substring(start, end);

            return word;
        }

        return '';
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
