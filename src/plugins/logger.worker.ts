import { RGBColor } from '../lib/rgbcolor';
import { FormatType, FontStyle, ParserLine } from '../core/types';

importScripts('https://cdn.jsdelivr.net/npm/moment@2.30.1/moment.min.js');

declare let moment;

enum Log {
    None = 0,
    Html = 1,
    Text = 2,
    Raw = 4
}

interface LogOptions {
    offline?: boolean;
    gagged?: boolean;
    enabled?: boolean;
    unique?: boolean;
    prepend?: boolean;
    name?: string;
    what?: Log;
    debug?: boolean;
    postfix?: string;
    prefix?: string;
    format?: string;
    timestamp?: TimeStampStyle;
    timestampFormat?: string;
}

enum TimeStampStyle {
    None = 0,
    Simple = 1,
    Format = 2
}

let options: LogOptions = {
    offline: false,
    gagged: false,
    enabled: false,
    unique: true,
    prepend: false,
    name: '',
    what: Log.Html,
    debug: false,
    timestamp: TimeStampStyle.None,
    timestampFormat: '[[]MM-DD HH:mm:ss.SSS[]] '
};

let connected: boolean = false;
let timeStamp: number;
let fTimeStamp: string = '';
let logging: boolean = false;
let currentFile: string = '';
let colors = {};
let colorsCnt = 0;
let backgrounds = {};
let backgroundsCnt = 0;
let buffer = {};
let flushBuffer;
let _colorTable = null;

self.addEventListener('message', (e: MessageEvent) => {
    let c;
    if (!e.data) return;
    switch (e.data.action) {
        case 'options':
            let option;
            let oldEnabled = options.enabled;
            for (option in e.data.args) {
                if (!e.data.args.hasOwnProperty(option))
                    continue;
                if (option === 'colors') {
                    const _colors = e.data.args[option];
                    if (_colors && _colors.length > 0) {
                        let clr;
                        const cl = _colors.length;
                        for (clr = 0; clr < cl; clr++) {
                            if (!_colors[clr] || _colors[clr].length === 0) continue;
                            SetColor(clr, _colors[clr]);
                        }
                    }
                    continue;
                }
                else if (flushBuffer && option === 'what' && options[option] !== e.data.args[option]) {
                    c = Log.None;
                    //Test to see what options where removed, and flush just those
                    if ((options[option] & Log.Html) === Log.Html && (e.data.args[option] & Log.Html) !== Log.Html)
                        c |= Log.Html;
                    if ((options[option] & Log.Text) === Log.Text && (e.data.args[option] & Log.Text) !== Log.Text)
                        c |= Log.Text;
                    if ((options[option] & Log.Raw) === Log.Raw && (e.data.args[option] & Log.Raw) !== Log.Raw)
                        c |= Log.Raw;
                    //Options changed so flush the ones removed
                    if (c !== Log.None) {
                        //store old buffer data
                        const fOld = flushBuffer;
                        //sett options that got removed
                        flushBuffer.what = c;
                        //flush using those options
                        flush(true);
                        //set old options to new options
                        fOld.what = options[option];
                        //restore buffer with new options
                        flushBuffer = fOld;
                    }
                    //store options
                    options[option] = e.data.args[option];
                }
                else
                    options[option] = e.data.args[option];
            }
            if (typeof options.timestamp === 'boolean')
                options.timestamp = options.timestamp ? TimeStampStyle.Format : TimeStampStyle.None;

            if (timeStamp !== 0) {
                fTimeStamp = new moment(timeStamp).format(options.format || 'YYYYMMDD-HHmmss');
                buildFilename();
                flush(true);
            }
            //if enabled changed setup
            if (oldEnabled != options.enabled) {
                //if was not enabled and not logging start loggin
                if (!oldEnabled && !logging)
                    postMessage({ event: 'start' });
                //if enabled but logging stop
                else if (oldEnabled && logging)
                    stop();
                else if (options.offline)
                    postMessage({ event: 'start' });
            }
            else if (options.offline)
                postMessage({ event: 'start' });
            break;
        case 'name':
            options.name = e.data.args;
            if (logging)
                fileChanged();
            break;
        case 'connected':
            connected = e.data.args;
            buildFilename();
            break;
        case 'logging':
            postMessage({ event: 'logging', args: logging });
            break;
        case 'toggle':
            toggle();
            break;
        case 'stop':
            stop();
            break;
        case 'startInternal':
            c = options.unique;
            options.unique = false;
            if (!e.data.args)
                start([], false);
            else
                start(e.data.args.lines, e.data.args.fragment);
            options.unique = c;
            break;

        case 'start':
            if (!e.data.args)
                start([], false);
            else
                start(e.data.args.lines, e.data.args.fragment);
            break;
        case 'flush':
            flush(e.data.args);
            break;
        case 'add-line':
            const data: ParserLine = e.data.args;
            //if a fragment buffer as next full line will probably start with fragment
            if (data.fragment) {
                flushBuffer = data;
                flushBuffer.logging = logging;
                flushBuffer.file = currentFile;
                flushBuffer.connected = connected;
                flushBuffer.offline = options.offline;
                flushBuffer.what = options.what;
                flushBuffer.gagged = data.gagged || (options.gagged && data.gagged);
                return;
            }
            //clear buffer
            flushBuffer = null;
            if (!logging || (!options.offline && !connected)) return;
            if (data.gagged && !options.gagged) return;
            if ((options.what & Log.Html) === Log.Html)
                writeHtml(createLine({ text: data.line, formats: data.formats, timestamp: data.timestamp || Date.now() }));
            if ((options.what & Log.Text) === Log.Text || options.what === Log.None) {
                if (options.timestamp === TimeStampStyle.Format)
                    writeText(moment(data.timestamp).format(options.timestampFormat));
                else if (options.timestamp !== TimeStampStyle.None)
                    writeText(new Date(data.timestamp).toISOString());
                writeText(data.line + '\n');
            }
            if ((options.what & Log.Raw) === Log.Raw) {
                if (options.timestamp === TimeStampStyle.Format)
                    writeText('\x1b[-7;-8m' + moment(data.timestamp).format(options.timestampFormat) + '\x1b[0m');
                else if (options.timestamp !== TimeStampStyle.None)
                    writeText('\x1b[-7;-8m' + new Date(data.timestamp).toISOString() + '\x1b[0m');
                writeRaw(data.raw);
            }
            break;
        case 'write-done':
            if (!buffer[e.data.file]) return;
            buffer[e.data.file].shift();
            if (buffer[e.data.file].length) {
                const tmp = buffer[e.data.file].shift();
                appendFile(tmp.file, tmp.data, true);
            }
            else
                delete buffer[e.data.file];
            break;
    }
}, false);

function fileChanged() {
    //previous file
    const pFile = currentFile;
    //generate current file
    buildFilename();
    //same info so move on
    if (pFile === currentFile) return;
    postMessage({ event: 'debug', args: 'File changed: "' + pFile + '" to "' + currentFile + '"' });
    //if flush buffer and file is not the same as previous file flush it
    if (flushBuffer && flushBuffer.currentFile !== pFile)
        flush(true);
    else if (flushBuffer) // if buffer set to new file name
        flushBuffer.currentFile = currentFile;
}

function buildFilename() {
    const o = currentFile;
    if (options.prefix)
        currentFile = options.prefix + fTimeStamp;
    else
        currentFile = fTimeStamp;
    if (options.name && options.name.length > 0)
        currentFile += '.' + options.name;
    if (options.postfix)
        currentFile += options.postfix;
    if (options.debug && o !== currentFile)
        postMessage({ event: 'debug', args: 'Log file: "' + currentFile + '"' });
}

function appendFile(file, data, force?) {
    try {
        if (!buffer[file]) buffer[file] = [];
        if (buffer[file].length && !force) {
            buffer[file].push({ file: file, data: data });
            return;
        }
        buffer[file].unshift({ file: file, data: data });
        postMessage({ event: 'write', file: file, data: data, character: options.name || '', timeStamp: timeStamp, postfix: options.postfix, prefix: options.prefix });
    }
    catch (err) {
        postMessage({ event: 'error', args: err });
    }
}

function writeText(data) {
    if (!logging || (!options.offline && !connected)) return;
    if (!currentFile || currentFile.length === 0)
        buildFilename();
    appendFile(currentFile + '.txt', data);
}

function writeHtml(data) {
    if (!logging || (!options.offline && !connected)) return;
    if (!currentFile || currentFile.length === 0)
        buildFilename();
    appendFile(currentFile + '.htm', data);
}

function writeRaw(data) {
    if (!logging || (!options.offline && !connected)) return;
    if (!currentFile || currentFile.length === 0)
        buildFilename();
    appendFile(currentFile + '.raw', data);
}

function flush(newline?) {
    //no buffer or not logging at that point so bail
    if (!flushBuffer || !flushBuffer.logging || (!flushBuffer.offline && !flushBuffer.connected)) return;
    //store current state
    const c = connected;
    const f = currentFile;
    const l = logging;
    //restore state when buffer saved
    logging = flushBuffer.logging;
    connected = flushBuffer.connected;
    currentFile = flushBuffer.currentFile;
    //write buffer based on buffer state
    if (!flushBuffer.gagged) {
        let nl = '';
        //some times we may want to force a new line, eg when the screen has been cleared as we do not want to lose data so the fragment becomes a full line
        if (newline)
            nl = '\n';
        if ((flushBuffer.what & Log.Html) === Log.Html)
            writeHtml(createLine({ text: flushBuffer.line, formats: flushBuffer.formats, timestamp: flushBuffer.timestamp || Date.now() }));
        if ((flushBuffer.what & Log.Text) === Log.Text || flushBuffer.what === Log.None) {
            if (options.timestamp === TimeStampStyle.Format)
                writeText(moment(flushBuffer.timestamp).format(options.timestampFormat));
            else if (options.timestamp !== TimeStampStyle.None)
                writeText(new Date(flushBuffer.timestamp).toISOString());
            writeText(flushBuffer.line + nl);
        }
        if ((flushBuffer.what & Log.Raw) === Log.Raw) {
            if (moment && options.timestamp === TimeStampStyle.Format)
                writeText('\x1b[-7;-8m' + moment(flushBuffer.timestamp).format(options.timestampFormat) + '\x1b[0m');
            else if (options.timestamp !== TimeStampStyle.None)
                writeText('\x1b[-7;-8m' + new Date(flushBuffer.timestamp).toISOString() + '\x1b[0m');
            writeRaw(flushBuffer.raw + nl);
        }
    }
    //restore previous state and clear buffer
    logging = l;
    connected = c;
    currentFile = f;
    flushBuffer = null;
}

function start(lines: any[], fragment: boolean) {
    if (!options.enabled) {
        if (logging)
            stop();
        return;
    }
    logging = true;
    if (options.unique || timeStamp === 0) {
        timeStamp = new Date().getTime();
        fTimeStamp = new moment(timeStamp).format(options.format || 'YYYYMMDD-HHmmss');
        flush(true);
    }
    buildFilename();
    if (options.prepend && lines && lines.length > 0) {
        if ((options.what & Log.Html) === Log.Html)
            writeHtml(createLines(lines || []));
        if ((options.what & Log.Text) === Log.Text || options.what === Log.None) {
            if (options.timestamp === TimeStampStyle.Format)
                writeText(lines.map(l => moment(l.timestamp).format(options.timestampFormat) + l.text).join('\n') + (fragment || lines.length === 0 ? '' : '\n'));
            else if (options.timestamp !== TimeStampStyle.None)
                writeText(lines.map(l => new Date(l.timestamp).toISOString() + l.text).join('\n') + (fragment || lines.length === 0 ? '' : '\n'));
            else
                writeText(lines.map(l => l.text).join('\n') + (fragment || lines.length === 0 ? '' : '\n'));
        }
        if ((options.what & Log.Raw) === Log.Raw) {
            if (options.timestamp === TimeStampStyle.Format)
                writeText(lines.map(l => '\x1b[-7;-8m' + moment(l.timestamp).format(options.timestampFormat) + '\x1b[0m' + l.raw).join(''));
            else if (options.timestamp !== TimeStampStyle.None)
                writeText(lines.map(l => '\x1b[-7;-8m' + new Date(l.timestamp).toISOString() + '\x1b[0m' + l.raw).join(''));
            else
                writeRaw(lines.map(l => l.raw).join(''));
        }
    }
    postMessage({ event: 'started', args: logging });
}

function stop() {
    logging = false;
    postMessage({ event: 'stopped', args: logging });
}

function toggle() {
    options.enabled = !options.enabled;
    postMessage({ event: 'toggled', args: options.enabled });
    const c = options.unique;
    options.unique = false;
    if (options.enabled && !logging)
        postMessage({ event: 'startInternal' });
    else if (!options.enabled && logging)
        stop();
    options.unique = c;
}

function createLines(lines: any[]) {
    const text = [];
    const ll = lines.length;
    for (let l = 0; l < ll; l++)
        text.push(createLine(lines[l]));
    return text.join('');
}

function getClassName(str) {
    if (!str || str.length === 0) return null;
    return str.replace(/[,]/g, '-').replace(/[\(\)\s;]/g, '');
}

function createLine(line) {
    const parts: string[] = [];
    let offset = 0;
    let fCls;
    const text = line.text;
    const formats = line.formats;
    const fLen = formats.length;
    let right = false;
    const styles = [];
    //build classes to reduce log size
    if (options.timestamp !== TimeStampStyle.None) {
        fCls = [];
        let color = GetColor(-8);
        if (backgrounds[getClassName(color)])
            fCls.push(' b', backgrounds[getClassName(color)]);
        else {
            backgrounds[getClassName(color)] = backgroundsCnt;
            fCls.push(' b', backgroundsCnt);
            styles.push(`.b${backgroundsCnt} { background-color: ${color}; }`);
            backgroundsCnt++;
        }
        color = GetColor(-7);
        if (colors[getClassName(color)])
            fCls.push(' c', colors[getClassName(color)]);
        else {
            colors[getClassName(color)] = colorsCnt;
            fCls.push(' c', colorsCnt);
            styles.push(`.c${colorsCnt} { color: ${color}; }`);
            colorsCnt++;
        }
    }
    if (options.timestamp === TimeStampStyle.Format && moment)
        parts.push('<span class="timestamp', ...fCls, '"', ...fCls, '>', moment(line.timestamp).format(options.timestampFormat), '</span>');
    else if (options.timestamp !== TimeStampStyle.None) {
        parts.push('<span class="timestamp', ...fCls, '"', ...fCls, '>', new Date(line.timestamp).toISOString(), ' </span>');
    }
    fCls = null;
    for (let f = 0; f < fLen; f++) {
        const format = formats[f];
        let nFormat;
        let end;
        let color;
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


        if (format.formatType === FormatType.Normal) {
            fCls = [];
            color = format.background;
            if (typeof color === 'number')
                color = GetColor(color);
            if (backgrounds[getClassName(color)])
                fCls.push(' b', backgrounds[getClassName(color)]);
            else if (color) {
                backgrounds[getClassName(color)] = backgroundsCnt;
                fCls.push(' b', backgroundsCnt);
                styles.push(`.b${backgroundsCnt} { background-color: ${color}; }`);
                backgroundsCnt++;
            }
            color = format.color;
            if (typeof color === 'number')
                color = GetColor(color);
            if (colors[getClassName(color)])
                fCls.push(' c', colors[getClassName(color)]);
            else if (color) {
                colors[getClassName(color)] = colorsCnt;
                fCls.push(' c', colorsCnt);
                styles.push(`.c${colorsCnt} { color: ${color}; }`);
                colorsCnt++;
            }

            if (colors[getClassName(format.font)])
                fCls.push(' f', colors[getClassName(format.font)]);
            else if (format.font) {
                colors[getClassName(format.font)] = colorsCnt;
                fCls.push(' f', colorsCnt);
                styles.push(`.f${colorsCnt} { font-family: ${format.font}; }`);
                colorsCnt++;
            }
            if (colors[getClassName(format.size)])
                fCls.push(' f', colors[getClassName(format.size)]);
            else if (format.size) {
                colors[getClassName(format.size)] = colorsCnt;
                fCls.push(' f', colorsCnt);
                styles.push(`.f${colorsCnt} { font-size: ${format.size}; }`);
                colorsCnt++;
            }
            if (format.style !== FontStyle.None) {
                if ((format.style & FontStyle.Bold) === FontStyle.Bold)
                    fCls.push(' b');
                if ((format.style & FontStyle.Italic) === FontStyle.Italic)
                    fCls.push(' i');
                if ((format.style & FontStyle.Overline) === FontStyle.Overline)
                    fCls.push(' o');
                if ((format.style & FontStyle.DoubleUnderline) === FontStyle.DoubleUnderline || (format.style & FontStyle.Underline) === FontStyle.Underline)
                    fCls.push(' u');
                if ((format.style & FontStyle.DoubleUnderline) === FontStyle.DoubleUnderline)
                    color = format.color;
                else
                    color = format.background;
                if (typeof color === 'number')
                    color = GetColor(color);
                if (colors['bb' + getClassName(color)])
                    fCls.push(' bb', colors['bb' + getClassName(color)]);
                else if (color) {
                    colors['bb' + getClassName(color)] = colorsCnt;
                    fCls.push(' bb', colorsCnt);
                    styles.push(`.bb${colorsCnt} { border-bottom: 1px solid ${color}; }`);
                    colorsCnt++;
                }
                if ((format.style & FontStyle.Rapid) === FontStyle.Rapid || (format.style & FontStyle.Slow) === FontStyle.Slow) {
                    if (this.enableFlashing)
                        fCls.push(' ansi-blink');
                    else if ((format.style & FontStyle.DoubleUnderline) !== FontStyle.DoubleUnderline && (format.style & FontStyle.Underline) !== FontStyle.Underline)
                        fCls.push(' u');
                }
                if ((format.style & FontStyle.Strikeout) === FontStyle.Strikeout)
                    fCls.push(' s');
            }
            else {
                color = format.background;
                if (typeof color === 'number')
                    color = GetColor(color);
                if (colors['bb' + getClassName(color)])
                    fCls.push(' bb', colors['bb' + getClassName(color)]);
                else if (color) {
                    colors['bb' + getClassName(color)] = colorsCnt;
                    fCls.push(' bb', colorsCnt);
                    styles.push(`.bb${colorsCnt} { border-bottom: 1px solid ${color}; }`);
                    colorsCnt++;
                }
            }
            if (fCls.length !== 0)
                fCls = ' class="' + fCls.join('').trim() + '"';
            else
                fCls = '';
            if (format.hr)
                parts.push('<span style="min-width:100%;width:100%;position: relative;"', fCls, '><hr style="position:absolute;top: 50%;transform: translateY(-50%);height:4px;width:100%; background-color:', (typeof format.color === 'number' ? GetColor(format.color) : format.color), '"/><span>---</span></span>');
            else if (end - offset !== 0)
                parts.push('<span', ...fCls, '>', htmlEncode(text.substring(offset, end)), '</span>');
        }
        else if (format.formatType === FormatType.Link) {
            parts.push('<a draggable="false" class="URLLink" href="javascript:void(0);" title="');
            parts.push(format.href.replace(/"/g, '&quot;'));
            parts.push('" onclick="', this.linkFunction, '(\'', format.href.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), '\');return false;">');
            if (end - offset === 0) continue;
            parts.push('<span', ...fCls, '>');
            parts.push(htmlEncode(text.substring(offset, end)));
            parts.push('</span>');
        }
        else if (format.formatType === FormatType.LinkEnd || format.formatType === FormatType.MXPLinkEnd || format.formatType === FormatType.MXPSendEnd) {
            parts.push('</a>');
        }
        else if (format.formatType === FormatType.MXPLink) {
            parts.push('<a draggable="false" class="MXPLink" href="javascript:void(0);" title="');
            parts.push(format.href.replace(/"/g, '&quot;'));
            parts.push('"');
            if (format.expire && format.expire.length)
                parts.push(` data-expire="${format.expire}"`);
            parts.push(' onclick="', this.mxpLinkFunction, '(this, \'', format.href.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), '\');return false;">');
            if (end - offset === 0) continue;
            parts.push('<span', ...fCls, '>');
            parts.push(htmlEncode(text.substring(offset, end)));
            parts.push('</span>');
        }
        else if (format.formatType === FormatType.MXPSend) {
            parts.push('<a draggable="false" class="MXPLink" href="javascript:void(0);" title="');
            parts.push(format.hint.replace(/"/g, '&quot;'));
            parts.push('"');
            if (format.expire && format.expire.length)
                parts.push(` data-expire="${format.expire}"`);
            parts.push(' onmouseover="', this.mxpTooltipFunction, '(this);"');
            parts.push(' onclick="', this.mxpSendFunction, '(event||window.event, this, ', format.href.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), ', ', format.prompt ? '1' : '0', ', ', format.tt.replace(/\\/g, '\\\\').replace(/"/g, '&quot;'), ');return false;">');
            if (end - offset === 0) continue;
            parts.push('<span', ...fCls, '>');
            parts.push(htmlEncode(text.substring(offset, end)));
            parts.push('</span>');
        }
        else if (format.formatType === FormatType.MXPExpired && end - offset !== 0) {
            parts.push('<span', ...fCls, '>');
            parts.push(htmlEncode(text.substring(offset, end)));
            parts.push('</span>');
        }
        else if (format.formatType === FormatType.Image) {
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
                parts.push('width:', formatUnit(format.w), ';');
            if (format.h.length > 0)
                parts.push('height:', formatUnit(format.h), ';');
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
                parts.push(formatUnit(format.vspace), ' ');
                parts.push(formatUnit(format.hspace), ';');
            }
            else if (format.hspace.length > 0) {
                parts.push('margin:');
                parts.push('0px ', formatUnit(format.hspace), ';');
            }
            else if (format.vspace.length > 0) {
                parts.push('margin:');
                parts.push(formatUnit(format.vspace), ' 0px;');
            }
            parts.push('"');
            if (format.ismap) parts.push(' ismap onclick="return false;"');
            parts.push(`src="${tmp}"/>`);
        }
    }
    if (styles.length)
        parts.push('<style>', ...styles, '</style>');
    if (right)
        return `<span class="line" style="min-width:100%">${parts.join('')}<br></span>`;
    return `<span class="line">${parts.join('')}<br></span>`;
}

//no dom so requires using replace
function htmlEncode(text) {
    if (!text || text.length === 0)
        return;
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatUnit(str) {
    if (!str) return str;
    if (/^\d+c$/.test(str))
        return str + 'h';
    if (/^\d+$/.test(str))
        return parseInt(str, 10) + 'px';
    return str;
}

function buildColorTable() {
    const _ColorTable: string[] = [];
    let r;
    let g;
    let b;
    let idx;
    for (r = 0; r < 6; r++) {
        for (g = 0; g < 6; g++) {
            for (b = 0; b < 6; b++) {
                idx = 16 + (r * 36) + (g * 6) + b;
                _ColorTable[idx] = 'rgb(';
                if (r > 0)
                    _ColorTable[idx] += r * 40 + 55;
                else
                    _ColorTable[idx] += '0';
                _ColorTable[idx] += ',';
                if (g > 0)
                    _ColorTable[idx] += g * 40 + 55;
                else
                    _ColorTable[idx] += '0';
                _ColorTable[idx] += ',';
                if (b > 0)
                    _ColorTable[idx] += b * 40 + 55;
                else
                    _ColorTable[idx] += '0';
                _ColorTable[idx] += ')';
            }
        }
    }
    for (r = 232; r <= 255; r++)//grayscale
    {
        g = (r - 232) * 10 + 8;
        _ColorTable[r] = ['rgb(', g, ',', g, ',', g, ')'].join('');
    }
    _ColorTable[0] = 'rgb(0,0,0)'; //black fore
    _ColorTable[1] = 'rgb(128, 0, 0)'; //red fore
    _ColorTable[2] = 'rgb(0, 128, 0)'; //green fore
    _ColorTable[3] = 'rgb(128, 128, 0)'; //yellow fore
    _ColorTable[4] = 'rgb(0, 0, 238)'; //blue fore
    _ColorTable[5] = 'rgb(128, 0, 128)'; //magenta fore
    _ColorTable[6] = 'rgb(0, 128, 128)'; //cyan fore
    _ColorTable[7] = 'rgb(187, 187, 187)'; //white fore
    _ColorTable[8] = 'rgb(128, 128, 128)'; //black  bold
    _ColorTable[9] = 'rgb(255, 0, 0)'; //Red bold
    _ColorTable[10] = 'rgb(0, 255, 0)'; //green bold
    _ColorTable[11] = 'rgb(255, 255, 0)'; //yellow bold
    _ColorTable[12] = 'rgb(92, 92, 255)'; //blue bold
    _ColorTable[13] = 'rgb(255, 0, 255)'; //magenta bold
    _ColorTable[14] = 'rgb(0, 255, 255)'; //cyan bold
    _ColorTable[15] = 'rgb(255, 255, 255)'; //white bold
    _ColorTable[256] = 'rgb(0, 0, 0)'; //black faint
    _ColorTable[257] = 'rgb(118, 0, 0)'; //red  faint
    _ColorTable[258] = 'rgb(0, 108, 0)'; //green faint
    _ColorTable[259] = 'rgb(145, 136, 0)'; //yellow faint
    _ColorTable[260] = 'rgb(0, 0, 167)'; //blue faint
    _ColorTable[261] = 'rgb(108, 0, 108)'; //magenta faint
    _ColorTable[262] = 'rgb(0, 108, 108)'; //cyan faint
    _ColorTable[263] = 'rgb(161, 161, 161)'; //white faint
    _ColorTable[264] = 'rgb(0, 0, 0)'; //BackgroundBlack
    _ColorTable[265] = 'rgb(128, 0, 0)'; //red back
    _ColorTable[266] = 'rgb(0, 128, 0)'; //greenback
    _ColorTable[267] = 'rgb(128, 128, 0)'; //yellow back
    _ColorTable[268] = 'rgb(0, 0, 238)'; //blue back
    _ColorTable[269] = 'rgb(128, 0, 128)'; //magenta back
    _ColorTable[270] = 'rgb(0, 128, 128)';  //cyan back
    _ColorTable[271] = 'rgb(187, 187, 187)';  //white back

    _ColorTable[272] = 'rgb(0,0,0)'; //InfoBackground
    _ColorTable[273] = 'rgb(0, 255, 255)';  //InfoText
    _ColorTable[274] = 'rgb(0,0,0)'; //LocalEchoBackground
    _ColorTable[275] = 'rgb(255, 255, 0)';  //LocalEchoText
    _ColorTable[276] = 'rgb(0, 0, 0)';  //DefaultBack
    _ColorTable[277] = 'rgb(229, 229, 229)';  //DefaultFore

    _ColorTable[278] = 'rgb(205, 0, 0)';  //ErrorFore
    _ColorTable[279] = 'rgb(229, 229, 229)';  //ErrorBack

    _ColorTable[280] = 'rgb(255,255,255)';  //DefaultBrightFore
    _colorTable = _ColorTable;
}

function GetColor(code) {
    if (_colorTable == null)
        buildColorTable();
    switch (code) {
        case -12:
            return _colorTable[279];  //ErrorBack
        case -11:
            return _colorTable[278];  //ErrorFore
        case -10:
            return _colorTable[280];  //DefaultBrightFore
        case -8:
            return _colorTable[272]; //InfoBackground
        case -7:
            return _colorTable[273];  //InfoText
        case -4:
            return _colorTable[274]; //LocalEchoBackground
        case -3:
            return _colorTable[275];  //LocalEchoText
        case 49:
        case -2:
            return _colorTable[276];  //DefaultBack
        case 39:
        case -1:
            return _colorTable[277];  //DefaultBack
        case 0:
        case 30: //set foreground color to black
            return _colorTable[0];
        case 1:
        case 31: //set foreground color to red
            return _colorTable[1];
        case 2:
        case 32: //set foreground color to green
            return _colorTable[2];
        case 3:
        case 33:  //set foreground color to yellow
            return _colorTable[3];
        case 4:
        case 34: //set foreground color to blue
            return _colorTable[4];
        case 5:
        case 35:  //set foreground color to magenta (purple)
            return _colorTable[5];
        case 6:
        case 36:  //set foreground color to cyan
            return _colorTable[6];
        case 7:
        case 37:  //set foreground color to white
            return _colorTable[7];
        case 40:  //background black
            return _colorTable[264];
        case 41:  //background red
            return _colorTable[265];
        case 42:  //background green
            return _colorTable[266];
        case 43:  //background yellow
            return _colorTable[267];
        case 44:  //background blue
            return _colorTable[268];
        case 45:  //background magenta
            return _colorTable[269];
        case 46:  //cyan
            return _colorTable[270];
        case 47:  //white
            return _colorTable[271];
        case 8:
        case 90:
        case 100:
        case 300: //set foreground color to black
        case 400:
            return _colorTable[8];
        case 9:
        case 91:
        case 101:
        case 310: //set foreground color to red
        case 410:
            return _colorTable[9];
        case 10:
        case 92:
        case 102:
        case 320: //set foreground color to green
        case 420:
            return _colorTable[10];
        case 11:
        case 93:
        case 103:
        case 330:  //set foreground color to yellow
        case 430:
            return _colorTable[11];
        case 12:
        case 94:
        case 104:
        case 340: //set foreground color to blue
        case 440:
            return _colorTable[12];
        case 13:
        case 95:
        case 105:
        case 350:  //set foreground color to magenta (purple)
        case 450:
            return _colorTable[13];
        case 14:
        case 96:
        case 106:
        case 360:  //set foreground color to cyan
        case 460:
            return _colorTable[14];
        case 15:
        case 97:
        case 107:
        case 370:  //set foreground color to white
        case 470:
            return _colorTable[15];
        case 4000:
        case 3000: //set foreground color to black
            return _colorTable[256];
        case 4100:
        case 3100: //set foreground color to red
            return _colorTable[257];
        case 4200:
        case 3200: //set foreground color to green
            return _colorTable[258];
        case 4300:
        case 3300:  //set foreground color to yellow
            return _colorTable[259];
        case 4400:
        case 3400: //set foreground color to blue
            return _colorTable[260];
        case 4500:
        case 3500:  //set foreground color to magenta (purple)
            return _colorTable[261];
        case 4600:
        case 3600:  //set foreground color to cyan
            return _colorTable[262];
        case 4700:
        case 3700:  //set foreground color to white
            return _colorTable[263];
        default:
            if (code <= -16) {
                code += 16;
                code *= -1;
            }
            if (code >= 0 && code < 281)
                return _colorTable[code];
            return _colorTable[277];
    }
}

function SetColor(code: number, color) {
    if (_colorTable == null)
        buildColorTable();
    if (code < 0 || code >= _colorTable.length)
        return;
    color = new RGBColor(color);
    if (!color.ok) return;
    _colorTable[code] = color.toRGB();
}