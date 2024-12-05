import '../css/tinymce.css';
import { EventEmitter } from '../core/events';
import { RGBColor } from '../lib/rgbcolor';
import { insertValue, htmlEncode, getColors, copyText, openFileDialog, readFile, pinkfishToHTML, isPasteSupported, pasteText, pasteType } from '../core/library'
import { Dialog } from './dialog';

export class AdvEditor extends EventEmitter {
    private _element;
    private _simple = true;
    private _colors;
    private _ColorTable;
    private _init = false;
    //private _colorCodes;
    private _colorNames = {
        'No color': 'Default',
        'BLACK': 'Black',
        'RED': 'Maroon',
        'GREEN': 'Green',
        'ORANGE': 'Olive',
        'BLUE': 'Navy',
        'MAGENTA': 'Purple',
        'WHITE': 'Silver',
        'CYAN': 'Teal',
        'BOLD BLACK': 'Grey',
        'BOLD RED': 'Red',
        'BOLD GREEN': 'Lime',
        'YELLOW': 'Yellow',
        'BOLD YELLOW': 'Yellow',
        'BOLD BLUE': 'Blue',
        'BOLD MAGENTA': 'Fuchsia',
        'BOLD CYAN': 'Aqua',
        'BOLD': 'White',
        'BOLD WHITE': 'White',
        'RGB000': 'Black',
        'RGB001': 'Navy Blue',
        'RGB002': 'Dark Blue',
        'RGB003': 'Blue',
        'RGB004': 'Blue',
        'RGB005': 'Blue',
        'RGB010': 'Dark Green',
        'RGB011': 'Deep Sky Blue',
        'RGB012': 'Deep Sky Blue',
        'RGB013': 'Deep Sky Blue',
        'RGB014': 'Cobalt/Dodger Blue',
        'RGB015': 'Dodger Blue',
        'RGB020': 'Green',
        'RGB021': 'Spring Green',
        'RGB022': 'Turquoise',
        'RGB023': 'Deep Sky Blue',
        'RGB024': 'Deep Sky Blue',
        'RGB025': 'Dodger Blue',
        'RGB030': 'Green',
        'RGB031': 'Spring Green',
        'RGB032': 'Dark Cyan',
        'RGB033': 'Light Sea Green',
        'RGB034': 'Deep Sky Blue',
        'RGB035': 'Deep Sky Blue',
        'RGB040': 'Green',
        'RGB041': 'Spring Green',
        'RGB042': 'Spring Green',
        'RGB043': 'Cyan',
        'RGB044': 'Dark Turquoise',
        'RGB045': 'Turquoise',
        'RGB050': 'Green',
        'RGB051': 'Spring Green',
        'RGB052': 'Spring Green',
        'RGB053': 'Medium Spring Green',
        'RGB054': 'Cyan',
        'RGB055': 'Cyan',
        'RGB100': 'Dark Red',
        'RGB101': 'Deep Pink',
        'RGB102': 'Purple',
        'RGB103': 'Purple',
        'RGB104': 'Purple',
        'RGB105': 'Blue Violet',
        'RGB110': 'Orange',
        'RGB111': 'Dark Grey',
        'RGB112': 'Medium Purple',
        'RGB113': 'Slate Blue',
        'RGB114': 'Slate Blue',
        'RGB115': 'Royal Blue',
        'RGB120': 'Chartreuse',
        'RGB121': 'Dark Sea Green',
        'RGB122': 'Pale Turquoise',
        'RGB123': 'Steel Blue',
        'RGB124': 'Steel Blue',
        'RGB125': 'Cornflower Blue',
        'RGB130': 'Chartreuse',
        'RGB131': 'Dark Sea Green',
        'RGB132': 'Cadet Blue',
        'RGB133': 'Cadet Blue',
        'RGB134': 'Sky Blue',
        'RGB135': 'Steel Blue',
        'RGB140': 'Chartreuse',
        'RGB141': 'Pale Green',
        'RGB142': 'Sea Green',
        'RGB143': 'Aquamarine',
        'RGB144': 'Medium Turquoise',
        'RGB145': 'Steel Blue',
        'RGB150': 'Chartreuse',
        'RGB151': 'Sea Green',
        'RGB152': 'Sea Green',
        'RGB153': 'Sea Green',
        'RGB154': 'Aquamarine',
        'RGB155': 'Dark Slate Gray',
        'RGB200': 'Dark Red',
        'RGB201': 'Deep Pink',
        'RGB202': 'Dark Magenta',
        'RGB203': 'Dark Magenta',
        'RGB204': 'Dark Violet',
        'RGB205': 'Purple',
        'RGB210': 'Orange',
        'RGB211': 'Light Pink',
        'RGB212': 'Plum',
        'RGB213': 'Medium Purple',
        'RGB214': 'Medium Purple',
        'RGB215': 'Slate Blue',
        'RGB220': 'Yellow',
        'RGB221': 'Wheat',
        'RGB222': 'Grey',
        'RGB223': 'Light Slate Grey',
        'RGB224': 'Medium Purple',
        'RGB225': 'Light Slate Blue',
        'RGB230': 'Yellow',
        'RGB231': 'Dark Olive Green',
        'RGB232': 'Dark Sea Green',
        'RGB233': 'Light Sky Blue',
        'RGB234': 'Light Sky Blue',
        'RGB235': 'Sky Blue',
        'RGB240': 'Chartreuse',
        'RGB241': 'Dark Olive Green',
        'RGB242': 'Pale Green',
        'RGB243': 'Dark Sea Green',
        'RGB244': 'Dark Slate Gray',
        'RGB245': 'Sky Blue',
        'RGB250': 'Chartreuse',
        'RGB251': 'Light Green',
        'RGB252': 'Light Green',
        'RGB253': 'Pale Green',
        'RGB254': 'Aquamarine',
        'RGB255': 'Dark Slate Gray',
        'RGB300': 'Red',
        'RGB301': 'Deep Pink',
        'RGB302': 'Medium Violet Red',
        'RGB303': 'Magenta',
        'RGB304': 'Dark Violet',
        'RGB305': 'Purple',
        'RGB310': 'Dark Orange',
        'RGB311': 'Indian Red',
        'RGB312': 'Hot Pink',
        'RGB313': 'Medium Orchid',
        'RGB314': 'Medium Orchid',
        'RGB315': 'Medium Purple',
        'RGB320': 'Dark Goldenrod',
        'RGB321': 'Light Salmon',
        'RGB322': 'Rosy Brown',
        'RGB323': 'Grey',
        'RGB324': 'Medium Purple',
        'RGB325': 'Medium Purple',
        'RGB330': 'Gold',
        'RGB331': 'Dark Khaki',
        'RGB332': 'Navajo White',
        'RGB333': 'Grey',
        'RGB334': 'Light Steel Blue',
        'RGB335': 'Light Steel Blue',
        'RGB340': 'Yellow',
        'RGB341': 'Dark Olive Green',
        'RGB342': 'Dark Sea Green',
        'RGB343': 'Dark Sea Green',
        'RGB344': 'Light Cyan',
        'RGB345': 'Light Sky Blue',
        'RGB350': 'Green Yellow',
        'RGB351': 'Dark Olive Green',
        'RGB352': 'Pale Green',
        'RGB353': 'Dark Sea Green',
        'RGB354': 'Dark Sea Green',
        'RGB355': 'Pale Turquoise',
        'RGB400': 'Crimson/Red',
        'RGB401': 'Deep Pink',
        'RGB402': 'Deep Pink',
        'RGB403': 'Magenta',
        'RGB404': 'Magenta',
        'RGB405': 'Magenta',
        'RGB410': 'Dark Orange',
        'RGB411': 'Indian Red',
        'RGB412': 'Hot Pink',
        'RGB413': 'Hot Pink',
        'RGB414': 'Orchid',
        'RGB415': 'Medium Orchid',
        'RGB420': 'Orange',
        'RGB421': 'Light Salmon/Bronze',
        'RGB422': 'Light Pink',
        'RGB423': 'Pink',
        'RGB424': 'Plum',
        'RGB425': 'Violet',
        'RGB430': 'Gold',
        'RGB431': 'Light Goldenrod',
        'RGB432': 'Tan',
        'RGB433': 'Misty Rose',
        'RGB434': 'Thistle',
        'RGB435': 'Plum',
        'RGB440': 'Yellow',
        'RGB441': 'Khaki',
        'RGB442': 'Light Goldenrod',
        'RGB443': 'Light Yellow',
        'RGB444': 'Grey',
        'RGB445': 'Light Steel Blue',
        'RGB450': 'Yellow',
        'RGB451': 'Dark Olive Green',
        'RGB452': 'Dark Olive Green',
        'RGB453': 'Dark Sea Green',
        'RGB454': 'Honeydew',
        'RGB455': 'Light Cyan',
        'RGB500': 'Red',
        'RGB501': 'Deep Pink',
        'RGB502': 'Deep Pink',
        'RGB503': 'Deep Pink',
        'RGB504': 'Magenta',
        'RGB505': 'Magenta',
        'RGB510': 'Orangered',
        'RGB511': 'Indian Red',
        'RGB512': 'Indian Red',
        'RGB513': 'Hot Pink',
        'RGB514': 'Hot Pink',
        'RGB515': 'Medium Orchid',
        'RGB520': 'Dark Orange',
        'RGB521': 'Salmon',
        'RGB522': 'Light Coral',
        'RGB523': 'Pale Violet Red',
        'RGB524': 'Orchid',
        'RGB525': 'Orchid',
        'RGB530': 'Orange',
        'RGB531': 'Sandy Brown',
        'RGB532': 'Light Salmon',
        'RGB533': 'Light Pink',
        'RGB534': 'Pink',
        'RGB535': 'Plum',
        'RGB540': 'Gold',
        'RGB541': 'Light Goldenrod',
        'RGB542': 'Light Goldenrod',
        'RGB543': 'Navajo White',
        'RGB544': 'Misty Rose',
        'RGB545': 'Thistle',
        'RGB550': 'Yellow',
        'RGB551': 'Light Goldenrod',
        'RGB552': 'Khaki',
        'RGB553': 'Wheat',
        'RGB554': 'Corn Silk',
        'RGB555': 'White',
        'mono00': 'Grey 3',
        'mono01': 'Grey 7',
        'mono02': 'Grey 11',
        'mono03': 'Grey 15',
        'mono04': 'Grey 19',
        'mono05': 'Grey 23',
        'mono06': 'Grey 27',
        'mono07': 'Grey 30',
        'mono08': 'Grey 35',
        'mono09': 'Grey 39',
        'mono10': 'Grey 32',
        'mono11': 'Grey 46',
        'mono12': 'Grey 50',
        'mono13': 'Grey 54',
        'mono14': 'Grey 58',
        'mono15': 'Grey 62',
        'mono16': 'Grey 66',
        'mono17': 'Grey 70',
        'mono18': 'Grey 74',
        'mono19': 'Grey 78',
        'mono20': 'Grey 82',
        'mono21': 'Grey 85',
        'mono22': 'Grey 89',
        'mono23': 'Grey 93'
    };
    public options;

    private _colorDialog: Dialog;

    constructor(element: string | JQuery | HTMLElement, enabledAdvanced?: boolean, options?) {
        super();
        this.options = options || {};
        if (!element)
            throw new Error('AdvEditor must be a selector, element or jquery object');
        if (typeof element === 'string') {
            this._element = document.querySelector(element);
            if (!this._element)
                throw new Error('Invalid selector for AdvEditor.');
        }
        else if (element instanceof $)
            this._element = element[0];
        else if (element instanceof HTMLElement)
            this._element = element;
        else
            throw new Error('AdvEditor must be a selector, element or jquery object');
        this.simple = !enabledAdvanced;
    }

    get id() {
        if (this._element) return this._element.id;
        return '';
    }

    get element(): HTMLElement {
        return this._element;
    }

    get simple() { return this._simple; }
    set simple(value) {
        if (value === this._simple) return;
        this._simple = value;
        if (TINYMCE && !this.tinymceExist) return;
        //was disabled
        if (value)
            this.remove();
        else
            this.initialize();
    }
    public clear() {
        if (TINYMCE && !this.isSimple)
            tinymce.get(this._element.id).setContent('');
        else
            this._element.value = '';
    }
    public get value() {
        if (!this.isSimple)
            return this.getFormattedText().replace(/(?:\r)/g, '')
        return this._element.value;
    }
    public set value(value) {
        if (this.isSimple)
            this._element.value = value;
        else
            tinymce.get(this._element.id).setContent(value);
    }

    public set readOnly(value) {
        if (this.isSimple)
            this._element.disabled = value;
        else if (value)
            tinymce.get(this._element.id).mode.set('readonly');
        else
            tinymce.get(this._element.id).mode.set('design');
    }
    public get readOnly() {
        if (this.isSimple)
            return this._element.disabled;
        return tinymce.get(this._element.id).mode.isReadOnly();
    }

    public insert(value) {
        if (!this.isSimple) {
            value = htmlEncode(value);
            value = value.replace(/ /g, '&nbsp;');
            value = value.replace(/\t/g, '&nbsp;&nbsp;&nbsp;');
            value = value.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            let content = this.getText();
            if (content === '\n') {
                tinymce.get(this._element.id).undoManager.transact(() => {
                    tinymce.get(this._element.id).setContent(value);
                });
            }
            else {
                if (!content.endsWith('\n'))
                    value = '<br>' + value;
                tinymce.get(this._element.id).undoManager.transact(() => {
                    tinymce.get(this._element.id).dom.add(tinymce.get(this._element.id).getBody(), 'span', {}, value);
                });
            }

        }
        else
            insertValue(this._element, value); {
        }

    }

    get tinymceExist() {
        return TINYMCE && typeof (tinymce) !== 'undefined';
    }

    get isSimple(): boolean {
        return this._simple || !this.tinymceExist;
    }

    private _loadColors() {
        let _dColors = getColors();
        let c, color, r, g, b, idx, _bold = [], bl;
        this._ColorTable = [];
        this._colors = {};
        let clientColors = client.getOption('colors') || [];
        let cNames = ['BLACK', 'RED', 'GREEN', 'ORANGE', 'BLUE', 'MAGENTA', 'CYAN', 'WHITE'];
        for (c = 0, bl = cNames.length; c < bl; c++) {
            color = new RGBColor(clientColors[c] || _dColors[c]).toHex().substr(1).toUpperCase();
            this._colors[color] = cNames[c];
            this._ColorTable.push(color, cNames[c]);
        }

        color = new RGBColor(clientColors[8] || _dColors[8]).toHex().substr(1).toUpperCase();
        this._colors[color] = 'mono11';
        this._ColorTable.push(color, 'BOLD BLACK');
        _bold.push(color);
        cNames[3] = 'YELLOW';
        //cNames = ['BOLD BLACK', 'BOLD RED', 'BOLD GREEN', 'BOLD YELLOW', 'BOLD BLUE', 'BOLD MAGENTA', 'BOLD CYAN'];
        for (c = 1, bl = cNames.length - 1; c < bl; c++) {
            color = new RGBColor(clientColors[c + 8] || _dColors[c + 8]).toHex().substr(1).toUpperCase();
            this._colors[color] = 'BOLD%^%^' + cNames[c];
            this._ColorTable.push(color, 'BOLD ' + cNames[c]);
            _bold.push(color);
            if (c === 3) {
                color = new RGBColor(clientColors[11] || _dColors[11]).toHex().substr(1).toUpperCase();
                this._colors[color] = 'YELLOW';
                this._ColorTable.push(color, 'YELLOW');
                _bold.push(color);
            }
        }
        color = new RGBColor(clientColors[15] || _dColors[15]).toHex().substr(1).toUpperCase();
        this._colors[color] = 'BOLD%^%^WHITE';
        this._ColorTable.push(color, 'BOLD WHITE');


        for (r = 0; r < 6; r++) {
            for (g = 0; g < 6; g++) {
                for (b = 0; b < 6; b++) {
                    idx = `RGB${r}${g}${b}`;
                    color = '';
                    c = 0;
                    c = r * 40 + 55;
                    if (c < 16)
                        color += '0';
                    color += c.toString(16);
                    c = 0;
                    c = g * 40 + 55;
                    if (c < 16)
                        color += '0';
                    color += c.toString(16);
                    c = 0;
                    c = b * 40 + 55;
                    if (c < 16)
                        color += '0';
                    color += c.toString(16);
                    color = color.toUpperCase();
                    //_ColorTable.push(color);
                    //_ColorTable.push(idx);
                    if (!this._colors[color])
                        this._colors[color] = idx;
                    this._colorList.push({ color: idx, hex: '#' + color, rgb: { r: r * 40 + 55, g: g * 40 + 55, b: b * 40 + 55 } });
                }
            }
        }

        for (r = 232; r <= 255; r++) {
            g = (r - 232) * 10 + 8;
            if (g < 16)
                g = '0' + g.toString(16).toUpperCase();
            else
                g = g.toString(16).toUpperCase();
            g = g + g + g;
            //_ColorTable.push(g);
            if (r < 242) {
                //_ColorTable.push('mono0' + (r - 232));
                if (!this._colors[g])
                    this._colors[g] = 'mono0' + (r - 232);
            }
            else {
                //_ColorTable.push('mono' + (r - 232));
                if (!this._colors[g])
                    this._colors[g] = 'mono' + (r - 232);
            }
        }
        //this._colorCodes = invert(this._colors);
        for (b = 0, bl = _bold.length; b < bl; b++) {
            this._colors['B' + _bold[b]] = this._colors[this._nearestHex('#' + _bold[b]).substr(1)].toUpperCase();
        }
        this._colors['BFFFFFF'] = 'RGB555';
        tinymce.get(this._element.id).options.set('color_map', this._ColorTable);
    }

    private _initPlugins() {
        if (!TINYMCE) return
        const _editor = this;
        tinymce.PluginManager.add('pinkfishtextcolor', function (editor, url) {
            type ColorFormat = 'forecolor' | 'hilitecolor';

            const fallbackColor = '#000000';
            const _colors = ['000000', 'BLACK', '800000', 'RED', '008000', 'GREEN', '808000', 'ORANGE', '0000EE', 'BLUE', '800080', 'MAGENTA', '008080', 'CYAN', 'BBBBBB', 'WHITE', '808080', 'BOLD BLACK', 'FF0000', 'BOLD RED', '00FF00', 'BOLD GREEN', 'FFFF00', 'YELLOW', '5C5CFF', 'BOLD BLUE', 'FF00FF', 'BOLD MAGENTA', '00FFFF', 'BOLD CYAN', 'FFFFFF', 'BOLD WHITE'];

            let _lastButton;

            interface Cell<T> {
                get: () => T;
                set: (value: T) => void;
            }

            const Cell = <T>(initial: T): Cell<T> => {
                let value = initial;

                const get = () => {
                    return value;
                };

                const set = (v: T) => {
                    value = v;
                };

                return {
                    get,
                    set
                };
            };

            let _forecolor = Cell(fallbackColor);
            let _backcolor = Cell(fallbackColor);

            const getCurrentColor = (editor, format: ColorFormat) => {
                let color: string | undefined;

                editor.dom.getParents(editor.selection.getStart(), (elm) => {
                    let value;

                    if ((value = elm.style[format === 'forecolor' ? 'color' : 'background-color'])) {
                        color = color ? color : value;
                    }
                });

                return color;
            };

            const applyFormat = (editor, format, value) => {
                editor.undoManager.transact(() => {
                    editor.focus();
                    editor.formatter.apply(format, { value });
                    editor.nodeChanged();
                });
            };

            const removeFormat = (editor, format) => {
                editor.undoManager.transact(() => {
                    editor.focus();
                    editor.formatter.remove(format, { value: null }, null, true);
                    editor.nodeChanged();
                });
            };

            const registerCommands = (editor) => {
                editor.addCommand('mceApplyPinkfishcolor', (format, value) => {
                    applyFormat(editor, format, value);
                });

                editor.addCommand('mceRemovePinkfishcolor', (format) => {
                    removeFormat(editor, format);
                });

                editor.addCommand('mceSetPinkfishcolor', (name, color) => {
                    if (_lastButton) {
                        setIconColor(_lastButton, name === 'forecolor' ? 'pinkfishforecolor' : name, color);
                        (name === 'forecolor' ? _forecolor : _backcolor).set(color);
                    }
                });
            };

            const getAdditionalColors = (hasCustom: boolean) => {
                const type: 'choiceitem' = 'choiceitem';
                const remove = {
                    type,
                    text: 'Remove color',
                    icon: 'color-swatch-remove-color',
                    value: 'remove'
                };
                const custom = {
                    type,
                    text: 'Custom color',
                    icon: 'color-picker',
                    value: 'custom'
                };
                return hasCustom ? [
                    remove,
                    custom
                ] : [remove];
            };

            const applyColor = (editor, format, value, onChoice: (v: string) => void) => {
                if (value === 'custom') {
                    _editor._openColorDialog(format, '');
                } else if (value === 'remove') {
                    onChoice('');
                    editor.execCommand('mceRemovePinkfishcolor', format);
                } else {
                    onChoice(value);
                    editor.execCommand('mceApplyPinkfishcolor', format, value);
                }
            };

            const mapColors = (colorMap: string[]) => {
                const colors = [];

                for (let i = 0; i < colorMap.length; i += 2) {
                    colors.push({
                        text: colorMap[i + 1],
                        value: '#' + colorMap[i],
                        type: 'choiceitem'
                    });
                }

                return colors;
            }

            const getColors = (colors, hasCustom: boolean) => mapColors(_colors).concat(getAdditionalColors(hasCustom));

            const getFetch = (colors, hasCustom: boolean) => (callback) => {
                callback(getColors(colors, hasCustom));
            };

            const setIconColor = (splitButtonApi, name: string, newColor: string) => {
                const id = name === 'pinkfishforecolor' ? 'tox-icon-text-color__color' : 'tox-icon-highlight-bg-color__color';
                splitButtonApi.setIconFill(id, newColor);
            };

            const registerTextColorButton = (editor, name: string, format: ColorFormat, tooltip: string, lastColor) => {
                editor.ui.registry.addSplitButton(name, {
                    tooltip,
                    presets: 'color',
                    icon: name === 'pinkfishforecolor' ? 'text-color' : 'highlight-bg-color',
                    select: (value) => {
                        const optCurrentRgb = new RGBColor(getCurrentColor(editor, format) || '').toHex();
                        return optCurrentRgb.toLowerCase() === value.toLowerCase();
                    },
                    columns: 5,
                    fetch: getFetch(_colors, true),
                    onAction: (_splitButtonApi) => {
                        _lastButton = _splitButtonApi;
                        applyColor(editor, format, lastColor.get(), () => { });
                    },
                    onItemAction: (_splitButtonApi, value) => {
                        _lastButton = _splitButtonApi;
                        applyColor(editor, format, value, (newColor) => {
                            lastColor.set(newColor);
                            editor.fire('TextColorChange', {
                                name,
                                color: newColor
                            });
                        });
                    },
                    onSetup: (splitButtonApi) => {
                        setIconColor(splitButtonApi, name, lastColor.get());

                        const handler = (e) => {
                            if (e.name === name) {
                                setIconColor(splitButtonApi, e.name, e.color);
                            }
                        };

                        editor.on('TextColorChange', handler);

                        return () => {
                            editor.off('TextColorChange', handler);
                        };
                    }
                });
            };

            const registerTextColorMenuItem = (editor, name: string, format: ColorFormat, text: string) => {
                editor.ui.registry.addNestedMenuItem(name, {
                    text,
                    icon: name === 'pinkfishforecolor' ? 'text-color' : 'highlight-bg-color',
                    getSubmenuItems: () => [
                        {
                            type: 'fancymenuitem',
                            fancytype: 'colorswatch',
                            onAction: (data) => {
                                applyColor(editor, format, data.value, () => { });
                            }
                        }
                    ]
                });
            };

            registerCommands(editor);
            registerTextColorButton(editor, 'pinkfishforecolor', 'forecolor', 'Text color', _forecolor);
            registerTextColorButton(editor, 'pinkfishbackcolor', 'hilitecolor', 'Background color', _backcolor);

            registerTextColorMenuItem(editor, 'pinkfishforecolor', 'forecolor', 'Text color');
            registerTextColorMenuItem(editor, 'pinkfishbackcolor', 'hilitecolor', 'Background color');
        });
        tinymce.PluginManager.add('pinkfish', function (editor) {

            editor.addCommand('mceApplyFormat', (format, value) => {
                editor.undoManager.transact(() => {
                    editor.focus();
                    _editor._clearReverse($('.reverse', $(editor.getDoc()).contents()));
                    if (value)
                        editor.formatter.apply(format, { value: value });
                    else
                        editor.formatter.apply(format);
                    _editor._addReverse($('.reverse', $(editor.getDoc()).contents()));
                    editor.nodeChanged();
                });
            });

            editor.addCommand('mceRemoveFormat', (format) => {
                editor.undoManager.transact(() => {
                    editor.focus();
                    _editor._clearReverse($('.reverse', $(editor.getDoc()).contents()));
                    editor.formatter.remove(format, { value: null }, null, true);
                    _editor._addReverse($('.reverse', $(editor.getDoc()).contents()));
                    editor.nodeChanged();
                });
            });

            function buttonPostRender(buttonApi, format) {
                editor.on('init', () => {
                    editor.formatter.formatChanged(format, function (state) {
                        buttonApi.setActive(state);
                    });
                });
            }

            function toggleFormat(format) {
                if (!format || typeof format !== 'string') format = this.settings.format;
                tinymce.get(_editor.id).undoManager.transact(() => {
                    $('#tinymce', tinymce.get(_editor.id).getDoc()).removeClass('animate');
                    this.clearReverse($('.reverse', $(editor.getDoc()).contents()));
                    editor.execCommand('mceToggleFormat', false, format);
                    this.addReverse($('.reverse', $(editor.getDoc()).contents()));
                    $('#tinymce', tinymce.get(_editor.id).getDoc()).addClass('animate');
                });
            }

            editor.ui.registry.addIcon('overline', '<i class="mce-i-overline"></i>');
            editor.ui.registry.addIcon('dblunderline', '<i class="mce-i-dblunderline"></i>');
            editor.ui.registry.addIcon('flash', '<i class="mce-i-flash"></i>');
            editor.ui.registry.addIcon('reverse', '<i class="mce-i-reverse"></i>');
            if (isPasteSupported())
                editor.ui.registry.addIcon('pasteformatted', '<i class="mce-i-pasteformatted"></i>');
            editor.ui.registry.addIcon('copyformatted', '<i class="mce-i-copyformatted"></i>');

            editor.ui.registry.addSplitButton('send', {
                icon: 'send',
                tooltip: _editor.options.sendTitle || 'Send to mud',
                onAction: () => {
                    const e = { preventDefault: false, contents: _editor.getFormattedText().replace(/(?:\r)/g, '') };
                    _editor.emit('send-action', e);
                    if (e.preventDefault) return;
                    client.sendCommand(e.contents);
                    if (client.getOption('editorClearOnSend'))
                        tinymce.get(_editor.id).setContent('');
                    if (client.getOption('editorCloseOnSend'))
                        _editor.emit('close');
                },
                onItemAction: (api, value) => {
                    const e = { preventDefault: false, value: value };
                    _editor.emit('send-item-action', e);
                    if (e.preventDefault) return;
                    switch (value) {
                        case 'formatted':
                            client.sendCommand(_editor.getFormattedText().replace(/(?:\r)/g, ''));
                            break;
                        case 'text':
                            client.sendCommand(_editor.getText().replace(/(?:\r)/g, ''));
                            break;
                        case 'formattednoecho':
                            client.sendBackground(_editor.getFormattedText().replace(/(?:\r)/g, ''), true);
                            break;
                        case 'textnoecho':
                            client.sendBackground(_editor.getText().replace(/(?:\r)/g, ''), true);
                            break;
                        case 'formattedverbatim':
                            client.send(_editor.getFormattedText().replace(/(?:\r)/g, ''));
                            break;
                        case 'textverbatim':
                            client.send(_editor.getText().replace(/(?:\r)/g, ''));
                            break;
                        case 'rawformatted':
                            client.sendRaw(_editor.getFormattedText().replace(/(?:\r)/g, ''));
                            break;
                        case 'rawtext':
                            client.sendRaw(_editor.getText().replace(/(?:\r)/g, ''));
                            break;
                    }
                    if (client.getOption('editorClearOnSend'))
                        tinymce.get(_editor.id).setContent('');
                    if (client.getOption('editorCloseOnSend'))
                        _editor.emit('close');
                },
                fetch: callback => {
                    callback(_editor.options.sendFetch || [
                        {
                            text: 'Formatted as commands',
                            value: 'formatted',
                            type: 'choiceitem'
                        },
                        {
                            text: 'Text as commands',
                            value: 'text',
                            type: 'choiceitem'
                        },
                        {
                            text: 'Formatted as commands (No echo)',
                            value: 'formattednoecho',
                            type: 'choiceitem'
                        },
                        {
                            text: 'Text as commands (No echo)',
                            value: 'textnoecho',
                            type: 'choiceitem'
                        },
                        {
                            text: 'Formatted verbatim (No echo)',
                            value: 'formattedverbatim',
                            type: 'choiceitem'
                        },
                        {
                            text: 'Text verbatim (No echo)',
                            value: 'textverbatim',
                            type: 'choiceitem'
                        },
                        {
                            text: 'Raw formatted (No echo)',
                            value: 'rawformatted',
                            type: 'choiceitem'
                        },
                        {
                            text: 'Raw text (No echo)',
                            value: 'rawtext',
                            type: 'choiceitem'
                        }
                    ]);
                }
            });
            editor.ui.registry.addButton('append', {
                icon: 'browse',
                tooltip: 'Append file...',
                onAction: () => _editor._appendFile()
            });
            editor.ui.registry.addButton('clear', {
                icon: 'remove',
                tooltip: 'Clear',
                onAction: () => _editor.clear()
            });
            if (isPasteSupported()) {
                editor.ui.registry.addButton('pastecustom', {
                    icon: 'paste',
                    tooltip: 'Paste',
                    onAction: buttonApi => {
                        pasteType('text/html', 'text/plain').then(text => {
                            _editor.insertFormatted(text || '');
                        }).catch(err => {
                            if (client.enableDebug)
                                client.debug(err);
                            if (err.message && err.message === 'Permission not granted!')
                                alert('Paste permission not granted.');
                            else
                                alert('Paste not supported.');
                        });
                    }
                });
                editor.ui.registry.addButton('pasteformatted', {
                    icon: 'pasteformatted',
                    tooltip: 'Paste formatted',
                    onAction: buttonApi => {
                        pasteText().then(text => {
                            _editor.insertFormatted(text || '');
                        }).catch(err => {
                            if (client.enableDebug)
                                client.debug(err);
                            if (err.message && err.message === 'Permission not granted!')
                                alert('Paste permission not granted.');
                            else
                                alert('Paste not supported.');
                        });
                    }
                });
                editor.ui.registry.addButton('pasteastext', {
                    icon: 'paste-text',
                    tooltip: 'Paste as text',
                    onAction: buttonApi => {
                        pasteText().then(text => {
                            tinymce.get(_editor.id).execCommand('mceInsertContent', false, (text || '').replace(/(\r\n|\r|\n)/g, '<br/>').replaceAll('  ', '&nbsp;&nbsp;'));
                        }).catch(err => {
                            if (client.enableDebug)
                                client.debug(err);
                            if (err.message && err.message === 'Permission not granted!')
                                alert('Paste permission not granted.');
                            else
                                alert('Paste not supported.');
                        });
                    }
                });
            }
            editor.ui.registry.addButton('copyformatted', {
                icon: 'copyformatted',
                tooltip: 'Copy formatted',
                onAction: buttonApi => copyText(_editor.getFormattedSelection().replace(/(?:\r)/g, ''))
            });

            editor.ui.registry.addToggleButton('overline', {
                icon: 'overline',
                tooltip: 'Overline',
                format: 'overline',
                onAction: buttonApi => toggleFormat('overline'),
                onSetup: buttonApi => buttonPostRender(buttonApi, 'overline')
            });
            editor.ui.registry.addToggleButton('dblunderline', {
                icon: 'dblunderline',
                tooltip: 'Double Underline',
                format: 'dblunderline',
                onAction: buttonApi => toggleFormat('dblunderline'),
                onSetup: buttonApi => buttonPostRender(buttonApi, 'dblunderline')
            });
            editor.ui.registry.addToggleButton('flash', {
                tooltip: 'Flash',
                format: 'flash',
                icon: 'flash',
                onAction: buttonApi => toggleFormat('flash'),
                onSetup: buttonApi => buttonPostRender(buttonApi, 'flash')
            });
            editor.ui.registry.addToggleButton('reverse', {
                icon: 'reverse',
                tooltip: 'Reverse',
                format: 'reverse',
                onAction: buttonApi => toggleFormat('reverse'),
                onSetup: buttonApi => buttonPostRender(buttonApi, 'reverse')
            });

            editor.ui.registry.addMenuItem('style', {
                text: 'Style',
                menu: [
                    {
                        image: 'overline',
                        text: 'Overline',
                        format: 'overline',
                        onclick: toggleFormat,
                        onpostrender: buttonPostRender
                    }, {
                        image: 'dblunderline',
                        text: 'Double Underline',
                        format: 'dblunderline',
                        onclick: toggleFormat,
                        onpostrender: buttonPostRender
                    },
                    {
                        text: 'Flash',
                        format: 'flash',
                        image: 'flash',
                        onclick: toggleFormat,
                        onpostrender: buttonPostRender
                    },
                    {
                        image: 'reverse',
                        text: 'Reverse',
                        format: 'reverse',
                        onclick: toggleFormat,
                        onpostrender: buttonPostRender
                    }
                ]
            });

            editor.ui.registry.addMenuItem('overline', {
                image: 'overline',
                text: 'Overline',
                format: 'overline',
                onclick: toggleFormat,
                onpostrender: buttonPostRender
            });

            editor.ui.registry.addMenuItem('dblunderline', {
                image: 'dblunderline',
                text: 'Double Underline',
                format: 'dblunderline',
                onclick: toggleFormat,
                onpostrender: buttonPostRender
            });

            editor.ui.registry.addMenuItem('flash', {
                text: 'Flash',
                format: 'flash',
                image: 'flash',
                onclick: toggleFormat,
                onpostrender: buttonPostRender
            });
            editor.ui.registry.addMenuItem('reverse', {
                image: 'reverse',
                text: 'Reverse',
                format: 'reverse',
                onclick: toggleFormat,
                onpostrender: buttonPostRender
            });

            editor.on('Change', () => {
                _editor._addReverse($('.reverse', $(editor.getDoc()).contents()));
            });
            editor.addShortcut('ctrl+s', 'Strikethrough', () => {
                toggleFormat('strikethrough');
            });
            editor.addShortcut('ctrl+o', 'Overline', () => {
                toggleFormat('overline');
            });
            editor.addShortcut('ctrl+d', 'Double Underline', () => {
                toggleFormat('dblunderline');
            });
            editor.addShortcut('ctrl+f', 'Flash', () => {
                toggleFormat('flash');
            });
            editor.addShortcut('ctrl+r', 'Reverse', () => {
                toggleFormat('reverse');
            });
        });
    }

    private _clearReverse(els, c?) {
        els.each(
            function () {
                if (!$(this).data('reverse'))
                    return;
                if (c && $(this).hasClass('reverse'))
                    return;
                let back, fore;
                if (c) {
                    back = $(this).css('color');
                    fore = $(this).css('background-color');
                }
                else {
                    fore = $(this).parent().css('color');
                    back = $(this).parent().css('background-color');
                }
                if (back === 'black')
                    back = '';
                if (fore === 'rgba(0, 0, 0, 0)')
                    fore = 'black';
                $(this).css('color', fore);
                $(this).css('background-color', back);
                if ($(this).children().length)
                    this.clearReverse($(this).children(), true);
            }
        );
    }

    private _addReverse(els, c?) {
        els.each(
            function () {
                if (c && $(this).hasClass('reverse'))
                    return;
                let back, fore;
                if (c) {
                    back = $(this).css('color');
                    fore = $(this).css('background-color');
                }
                else {
                    back = $(this).parent().css('color');
                    fore = $(this).parent().css('background-color');
                }
                if (back === 'rgba(0, 0, 0, 0)')
                    back = 'black';
                if (fore === 'rgba(0, 0, 0, 0)')
                    fore = 'black';
                if ($(this).children().length) {
                    this.clearReverse($(this).children(), true);
                    this.addReverse($(this).children(), true);
                }
                $(this).css('color', fore);
                $(this).css('background-color', back);
                $(this).data('reverse', true);

            }
        );
    }

    private _colorCell(color, idx) {
        let cell = '<td class="mce-grid-cell' + (color === 'transparent' ? ' mce-colorbtn-trans' : '') + '">';
        cell += '<div id="' + idx + '"';
        cell += ' data-mce-color="' + color + '"';
        cell += ' role="option"';
        cell += ' tabIndex="-1"';
        cell += ' style="background-color: ' + (color === 'transparent' ? color : '#' + color) + '"';
        if (this._colorNames[idx])
            cell += ' title="' + idx + ', ' + this._colorNames[idx] + '">';
        else
            cell += ' title="' + idx + '">';
        if (color === 'transparent') cell += '&#215;';
        cell += '</div>';
        cell += '</td>';
        return cell;
    }

    private _openColorDialog(type, color) {
        if (!this._colorDialog) {
            this._colorDialog = new Dialog({ noFooter: true, title: '<i class="fas fa-palette"></i> Pick color', center: true, resizable: false, moveable: false, maximizable: false, width: 380, height: 340 });
            this._colorDialog.body.style.alignItems = 'center';
            this._colorDialog.body.style.display = 'flex';
            let c;
            let cl;
            let r;
            let g;
            let b;
            let idx;
            let html = '<table style="border-spacing: 0;margin : auto !important;" class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody><tr>';
            for (c = 0, cl = this._ColorTable.length; c < cl; c += 2) {
                if (this._ColorTable[c + 1] === 'BOLD YELLOW') continue;
                html += this._colorCell(this._ColorTable[c], this._ColorTable[c + 1]);
                if (c / 2 % 6 === 5 || this._ColorTable[c + 1] === 'YELLOW')
                    html += '<td class="mce-grid-cell"></td>';
            }
            html += '<td class="mce-grid-cell"></td>';
            html += this._colorCell('transparent', 'No color');
            html += '</tr><tr><td></td></tr>';
            let html2 = '';
            for (r = 0; r < 6; r++) {
                if (g < 3)
                    html += '<tr>';
                else
                    html2 += '<tr>';
                for (g = 0; g < 6; g++) {
                    for (b = 0; b < 6; b++) {
                        idx = `RGB${r}${g}${b}`;
                        color = '';
                        c = 0;
                        c = r * 40 + 55;
                        if (c < 16)
                            color += '0';
                        color += c.toString(16);
                        c = 0;
                        c = g * 40 + 55;
                        if (c < 16)
                            color += '0';
                        color += c.toString(16);
                        c = 0;
                        c = b * 40 + 55;
                        if (c < 16)
                            color += '0';
                        color += c.toString(16);
                        color = color.toUpperCase();
                        if (g < 3)
                            html += this._colorCell(color, idx);
                        else
                            html2 += this._colorCell(color, idx);
                    }
                    if (g === 2)
                        html += '</tr>';
                    else if (g < 3)
                        html += '<td class="mce-grid-cell"></td>';
                    else if (g < 5)
                        html2 += '<td class="mce-grid-cell"></td>';
                }
                if (g < 3)
                    html += '</tr>';
                else
                    html2 += '</tr>';
            }
            html += html2;
            html += '<tr><td></td></tr><tr>';
            for (r = 232; r <= 255; r++) {
                g = (r - 232) * 10 + 8;
                if (g < 16)
                    g = '0' + g.toString(16).toUpperCase();
                else
                    g = g.toString(16).toUpperCase();
                g = g + g + g;
                html += this._colorCell(g, color);
                if (r === 237 || r === 249)
                    html += '<td class="mce-grid-cell"></td>';
                if (r === 243)
                    html += '</tr><tr>';
            }
            html += '</tr></tbody></table>';
            html += `<style>.mce-colorbtn-trans div {line-height: 14px;overflow: hidden;}.mce-grid td.mce-grid-cell div{border:1px solid #c5c5c5;width:15px;height:15px;margin:0;cursor:pointer}.mce-grid td.mce-grid-cell div:focus{border-color:#91bbe9}.mce-grid td.mce-grid-cell div[disabled]{cursor:not-allowed}.mce-grid{border-spacing:2px;border-collapse:separate}.mce-grid a{display:block;border:1px solid transparent}.mce-grid a:hover,.mce-grid a:focus{border-color:#91bbe9}.mce-grid-border{margin:0 4px 0 4px}.mce-grid-border a{border-color:#c5c5c5;width:13px;height:13px}.mce-grid-border a:hover,.mce-grid-border a.mce-active{border-color:#91bbe9;background:#bdd6f2}</style>`;
            this._colorDialog.body.innerHTML = html;
            let cells = this._colorDialog.body.querySelectorAll('div');
            for (c = 0, cl = cells.length; c < cl; c++)
                cells[c].addEventListener('click', e => {
                    color = (e.currentTarget as HTMLElement).dataset.mceColor;
                    if (color === 'transparent')
                        tinymce.get(this._element.id).execCommand('mceRemoveFormat', this._colorDialog.dialog.dataset.type);
                    else
                        tinymce.get(this._element.id).execCommand('mceApplyFormat', this._colorDialog.dialog.dataset.type, '#' + color);
                    tinymce.get(this._element.id).execCommand('mceSetTextcolor', this._colorDialog.dialog.dataset.type, '#' + color);
                    this._colorDialog.close();
                });
        }
        this._colorDialog.dialog.dataset.type = type;
        this._colorDialog.showModal();
    }

    private _appendFile() {
        openFileDialog('Append file(s)', true).then(files => {
            for (let f = 0, fl = files.length; f < fl; f++)
                readFile(files[f]).then((contents: any) => {
                    this.insert(contents);
                }).catch(err => client.error(err));
        }).catch(() => { });
    }

    public insertFormatted(text) {
        if (this.isSimple)
            insertValue(this._element, text);
        else
            tinymce.get(this._element.id).execCommand('insertHTML', false, pinkfishToHTML(text).replace(/(\r\n|\r|\n)/g, '<br/>'));
    }

    public setFormatted(text) {
        if (this.isSimple)
            this._element.value = text;
        else {
            tinymce.get(this._element.id).getBody().innerHTML = pinkfishToHTML(text).replace(/(\r\n|\r|\n)/g, '<br/>');
            //tinymce.get(this._element.id).setContent(pinkfishToHTML(text).replace(/(\r\n|\r|\n)/g, '<br/>'), { format: 'html' });
        }
    }

    private _buildHTMLStack(els) {
        let tag, $el, t, tl;
        let stack = [];
        let tags;
        for (let e = 0, el = els.length; e < el; e++) {
            $el = $(els[e]);
            tag = $el.prop('tagName');
            if (tag === 'EM' || tag === 'I')
                tag = 'ITALIC';
            else if (tag === 'STRONG' || tag === 'B')
                tag = 'BOLD';
            if (!tag)
                stack.push('"' + $el.text() + '"');
            else if (tag === 'SPAN') {
                tags = [];
                if (els[e].className != '') {
                    tag = els[e].className.toUpperCase().split(/\s+/g);
                    tl = tag.length;
                    for (t = 0; t < tl; t++) {
                        if (tag[t] === 'NOFLASH')
                            tags.push('FLASH');
                        else if (tag[t].length > 0)
                            tags.push(tag[t]);
                    }
                }
                if ($el.css('text-decoration') === 'line-through')
                    tags.push('STRIKEOUT');
                if ($el.css('text-decoration') === 'underline')
                    tags.push('UNDERLINE');
                if ($el.data('mce-style')) {
                    tag = $el.data('mce-style').toUpperCase().split(';');
                    tl = tag.length;
                    for (t = 0; t < tl; t++) {
                        if (tag[t].endsWith('INHERIT') || tag[t].endsWith('BLACK'))
                            continue;
                        tag[t] = tag[t].trim();
                        tag[t] = tag[t].replace('BACKGROUND:', 'BACKGROUND-COLOR:');
                        if (tag[t].length > 0)
                            tags.push(tag[t]);
                    }
                }
                else if ($el.css('color') || $el.css('background-color') || $el.css('background')) {
                    tag = [];
                    if ($el.css('color'))
                        tag.push('COLOR: ' + new RGBColor($el.css('color')).toHex().toUpperCase());
                    if ($el.css('background-color'))
                        tag.push('BACKGROUND-COLOR: ' + new RGBColor($el.css('background-color')).toHex().toUpperCase());
                    if ($el.css('background'))
                        tag.push('BACKGROUND-COLOR: ' + new RGBColor($el.css('background')).toHex().toUpperCase());
                    tl = tag.length;
                    for (t = 0; t < tl; t++) {
                        if (tag[t].length > 0)
                            tags.push(tag[t].trim());
                    }
                }
                tl = tags.length;
                for (t = 0; t < tl; t++) {
                    if (!tags[t].length) continue;
                    stack.push(tags[t].trim());
                }
                stack = stack.concat(this._buildHTMLStack($el.contents()));
                for (t = tl - 1; t >= 0; t--) {
                    if (!tags[t].length) continue;
                    stack.push('/' + tags[t].trim());
                }
            }
            else if (tag == 'BR' && $el.data('mce-bogus'))
                stack.push('RESET');
            else {
                stack.push(tag);
                stack = stack.concat(this._buildHTMLStack($el.contents()));
                stack.push('/' + tag);
            }
        }
        return stack;
    }

    public getFormattedSelection() {
        //build all previous nodes to ensure all formatting is captures
        let nodes = tinymce.get(this._element.id).dom.getParents(tinymce.get(this._element.id).selection.getNode());
        let n = 0, nl = nodes.length;
        let start = '<html>';
        let end = '</html>';
        for (; n < nl; n++) {
            let tag = nodes[n].tagName;
            if (tag === 'EM' || tag === 'I' || tag === 'STRONG' || tag === 'B') {
                start += '<' + tag + '>';
                end = '</' + tag + '>' + end;
            }
            else if (tag === 'SPAN') {
                start += '<' + tag;
                if (nodes[n].className != '')
                    start += ' class="' + nodes[n].className + '"';
                let style = '';
                if (nodes[n].style.textDecoration != '')
                    style += 'text-decoration:' + nodes[n].style.textDecoration + ';';
                if (nodes[n].style.color != '')
                    style += 'color:' + nodes[n].style.color + ';';
                if (nodes[n].style.background != '')
                    style += 'background:' + nodes[n].style.background + ';';
                if (nodes[n].style.backgroundColor != '')
                    style += 'background-color:' + nodes[n].style.backgroundColor + ';';
                if (style.length > 0)
                    start += ' style="' + style + '"';
                if (nodes[n].dataset && nodes[n].dataset.mceStyle)
                    start += ' data-mce-style="' + nodes[n].dataset.mceStyle + '"';
                start += ' >';
                end = '</' + tag + '>' + end;
            }
            else if (tag === 'BODY') {
                start += '<' + tag + '>';
                end = '</' + tag + '>' + end;
                break;
            }
        }
        return this._formatHtml($(start + tinymce.get(this._element.id).selection.getContent({ format: 'raw' }).replace(/<\/div><div>/g, '<br>') + end));
    }

    public getFormattedText() {
        if (this.isSimple)
            return this._element.value;
        return this._formatHtml($('<html>' + this.getRaw() + '</html>'));
        //return this.formatHtml($('<html>' + this.getRaw().replace(/<\/div><div>/g, '<br>') + '</html>'));
    }

    public getText() {
        if (this.isSimple)
            return this._element.value;
        return tinymce.get(this._element.id).getContent({ format: 'text' });
    }

    // eslint-disable-next-line no-unused-vars
    public getHTML() {
        if (this.isSimple)
            return this._element.value;
        return tinymce.get(this._element.id).getContent({ format: 'html' });
    }

    public getRaw() {
        if (this.isSimple)
            return this._element.value;
        return tinymce.get(this._element.id).getContent({ format: 'raw' });
    }

    private _formatHtml(text) {
        let data = this._buildHTMLStack(text);
        let buffer = [];
        let codes = [];
        let color, d, dl, rgb;
        if (DEBUG && client.getOption('enableDebug'))
            client.debug('Advanced Editor Get Raw HTML: ' + this.getRaw());
        for (d = data.length - 1; d >= 0; d--) {
            if (!data[d].startsWith('"') && data[d] != 'BR' && data[d] != 'RESET')
                data.pop();
            else
                break;
        }
        if (data[0] === 'DIV')
            data.shift();

        for (d = 0, dl = data.length; d < dl; d++) {
            switch (data[d]) {
                case 'BOLD':
                case 'ITALIC':
                case 'UNDERLINE':
                case 'STRIKEOUT':
                case 'DBLUNDERLINE':
                case 'OVERLINE':
                case 'FLASH':
                case 'REVERSE':
                    codes.push('%^' + data[d] + '%^');
                    buffer.push('%^' + data[d] + '%^');
                    break;
                case '/DBLUNDERLINE':
                case '/OVERLINE':
                case '/FLASH':
                case '/REVERSE':
                case '/UNDERLINE':
                case '/BOLD':
                case '/ITALIC':
                case '/STRIKEOUT':
                    codes.pop();
                    this._cleanReset(buffer);
                    buffer.push('%^RESET%^');
                    if (codes.length > 0)
                        buffer.push(codes.join(''));
                    break;
                case 'SPAN':
                case '/SPAN':
                case '/BR':
                case '/DIV':
                    break;
                case 'DIV':
                case 'BR':
                    if (codes.length > 0 && buffer.length > 0 && !buffer[buffer.length - 1].endsWith('%^RESET%^')) {
                        this._cleanReset(buffer);
                        buffer.push('%^RESET%^');
                    }
                    buffer.push('\n');
                    if (codes.length > 0)
                        buffer.push(codes.join(''));
                    break;
                case 'RESET':
                    if (codes.length > 0 && buffer.length > 0 && !buffer[buffer.length - 1].endsWith('%^RESET%^')) {
                        this._cleanReset(buffer);
                        buffer.push('%^RESET%^');
                    }
                    if (codes.length > 0)
                        buffer.push(codes.join(''));
                    break;
                default:
                    if (data[d].startsWith('COLOR: #')) {
                        color = data[d].substr(8);
                        if (!this._colors[color]) {
                            rgb = new RGBColor(color);
                            color = this._nearestHex(rgb.toHex()).substr(1);
                        }
                        color = this._colors[color];
                        if (color === 'BOLD BLACK' || color === 'BOLD%^%^BLACK')
                            color = 'mono11';
                        codes.push('%^' + color + '%^');
                        buffer.push('%^' + color + '%^');
                    }
                    else if (data[d].startsWith('COLOR: ')) {
                        color = new RGBColor(data[d].substr(7)).toHex().substr(1);
                        if (!this._colors[color])
                            color = this._nearestHex('#' + color).substr(1);
                        color = this._colors[color];
                        if (color === 'BOLD BLACK' || color === 'BOLD%^%^BLACK')
                            color = 'mono11';
                        codes.push('%^' + color + '%^');
                        buffer.push('%^' + color + '%^');

                    }
                    else if (data[d].startsWith('/COLOR: ')) {
                        codes.pop();
                        this._cleanReset(buffer);
                        buffer.push('%^RESET%^');
                        if (codes.length > 0)
                            buffer.push(codes.join(''));
                    }
                    else if (data[d].startsWith('BACKGROUND-COLOR: #')) {
                        color = data[d].substr(19);
                        if (!this._colors[color]) {
                            rgb = new RGBColor(color);
                            color = this._nearestHex(rgb.toHex()).substr(1);
                        }
                        if (this._colors['B' + color])
                            color = this._colors['B' + color];
                        else
                            color = this._colors[color];
                        color = '%^B_' + color + '%^';
                        codes.push(color);
                        buffer.push(color);
                    }
                    else if (data[d].startsWith('BACKGROUND-COLOR: ')) {
                        color = new RGBColor(data[d].substr(18)).toHex().substr(1);
                        if (!this._colors[color])
                            color = this._nearestHex('#' + color).substr(1);
                        if (this._colors['B' + color])
                            color = this._colors['B' + color];
                        else
                            color = this._colors[color];
                        color = '%^B_' + color + '%^';
                        codes.push(color);
                        buffer.push(color);
                    }
                    else if (data[d].startsWith('/BACKGROUND-COLOR: ')) {
                        codes.pop();
                        this._cleanReset(buffer);
                        buffer.push('%^RESET%^');
                        if (codes.length > 0)
                            buffer.push(codes.join(''));
                    }
                    else if (data[d].startsWith('"'))
                        buffer.push(data[d].substring(1, data[d].length - 1));
                    break;
            }
        }
        return buffer.join('');
    }

    private _cleanReset(buffer) {
        let b = buffer.length - 1;
        for (; b >= 0; b--) {
            if (buffer[b].startsWith('%^'))
                buffer.pop();
            else
                return buffer;
        }
        return buffer;
    }

    //{ color: 'red', hex: '#EA4235', rgb: { r: 234, g: 66, b: 53 } },
    private _colorList = [];

    private _nearestHex(hex) {
        let _editor = this;
        //https://codereview.stackexchange.com/questions/132225/given-hexadecimal-rgb-color-find-the-closest-predefined-color
        let hexToRgb = function (hex) {
            let shortRegEx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            //hex = hex.replace(shortRegEx, '$1$1$2$2$3$3');
            hex = hex.replace(shortRegEx, function (full, r, g, b) {
                return [r, r, g, g, b, b].join();
            });
            let longRegEx = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i;
            let rgbArray = longRegEx.exec(hex);
            let rgbObj = rgbArray ? {
                r: parseInt(rgbArray[1], 16),
                g: parseInt(rgbArray[2], 16),
                b: parseInt(rgbArray[3], 16)
            } : null;
            return rgbObj;
        };

        let closestHexFromRgb = function (rgbObj) {
            if (!rgbObj) {
                throw new Error('The hex you provided is not formatted correctly. Please try in a format such as \'#FFF\' or \'#DDFFDD\'.');
            }

            let minDistance = Number.MAX_SAFE_INTEGER;
            let nearestHex = null;

            for (let i = 0; i < _editor._colorList.length; i++) {
                let currentColor = _editor._colorList[i];
                let distance = Math.sqrt(
                    Math.pow((rgbObj.r - currentColor.rgb.r), 2) +
                    Math.pow((rgbObj.g - currentColor.rgb.g), 2) +
                    Math.pow((rgbObj.b - currentColor.rgb.b), 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestHex = currentColor.hex;
                }
            }
            return nearestHex;
        };

        return closestHexFromRgb(hexToRgb(hex));

    }

    public remove() {
        tinymce.remove(`#${this._element.id}`);
    }

    public initialize() {
        if (this.isSimple) return;
        this._initPlugins();
        tinymce.init({
            license_key: 'gpl',
            custom_colors: false,
            selector: `textarea#${this._element.id}`,
            height: 500,
            menubar: false,
            browser_spellcheck: true,
            //contextmenu: false,
            resize: true,
            statusbar: false,
            nowrap: true,
            force_br_newlines: true,
            forced_root_block: 'div',
            plugins: 'pinkfish insertdatetime pinkfishtextcolor nonbreaking',
            color_picker_callback: (editor, color, format) => { this._openColorDialog(format, color || ''); },
            color_picker_caption: 'More&hellip;',
            textcolor_rows: '3',
            textcolor_cols: '8',
            toolbar: `send | append | undo redo ${isPasteSupported() ? '| pastecustom pasteastext pasteformatted ' : ''}| pinkfishforecolor pinkfishbackcolor | italic underline strikethrough overline dblunderline flash reverse | clear | copy copyformatted | insertdatetime`,
            toolbar_mode: 'sliding',
            content_css: 'css/tinymce.content.min.css',
            formats: {
                bold: { inline: 'strong', exact: true, links: true, remove_similar: true },
                italic: { inline: 'em', exact: true, links: true, remove_similar: true },
                overline: { inline: 'span', 'classes': 'overline', links: true, remove_similar: true },
                dblunderline: { inline: 'span', 'classes': 'dblunderline', links: true, remove_similar: true },
                flash: { inline: 'span', 'classes': 'flash', links: true, remove_similar: true },
                reverse: { inline: 'span', 'classes': 'reverse', links: true, remove_similar: true },
                underline: { inline: 'span', 'classes': 'underline', links: true, remove_similar: true },
                strikethrough: { inline: 'span', 'classes': 'strikeout', links: true, remove_similar: true },
                //forecolor: { inline: 'span', styles: { textDecoration: 'inherit', border: 'inherit', color: '%value' }, exact: true, links: true, remove_similar: true },
                //hilitecolor: { inline: 'span', styles: { textDecoration: 'inherit', border: 'inherit', backgroundColor: '%value' }, exact: true, links: true, remove_similar: true }
                //forecolor: { block: 'span', attributes: { 'data-color': '%value' }, styles: { textDecoration: 'inherit', border: 'inherit', color: '%value' }, exact: true, links: true, remove_similar: true },
                //hilitecolor: { block: 'span', attributes: { 'data-backcolor': '%value' }, styles: { textDecoration: 'inherit', border: 'inherit', backgroundColor: '%value' }, exact: true, links: true, remove_similar: true }
            },
            init_instance_callback: (editor) => {
                editor.shortcuts.add('ctrl+shift+c', 'Copy formatted', () => copyText(this.getFormattedSelection().replace(/(?:\r)/g, '')));
                if (isPasteSupported()) {
                    editor.shortcuts.add('ctrl+shift+p', 'Paste formatted', () => {
                        pasteText().then(text => {
                            this.insertFormatted(text || '');
                        }).catch(err => {
                            if (client.enableDebug)
                                client.debug(err);
                            if (err.message && err.message === 'Permission not granted!')
                                alert('Paste permission not granted.');
                            else
                                alert('Paste not supported.');
                        });
                    });
                    editor.shortcuts.add('ctrl+alt+p', 'Paste as text', () => {
                        pasteText().then(text => {
                            tinymce.get(this._element.id).execCommand('mceInsertContent', false, (text || '').replace(/(\r\n|\r|\n)/g, '<br/>').replaceAll('  ', '&nbsp;&nbsp;'));
                        }).catch(err => {
                            if (client.enableDebug)
                                client.debug(err);
                            if (err.message && err.message === 'Permission not granted!')
                                alert('Paste permission not granted.');
                            else
                                alert('Paste not supported.');
                        });
                    });
                }
                editor.on('PastePreProcess', e => {
                    if (client.getOption('enableDebug'))
                        client.debug('Advanced Before Editor PastePreProcess: ' + e.content);
                    this._clearReverse($('.reverse', $(editor.getDoc()).contents()));
                    e.content = e.content.replace(/<\/p>/g, '<br>');
                    e.content = e.content.replace(/<\/h[1-6]>/g, '<br>');
                    e.content = e.content.replace(/<\/li>/g, '<br>');
                    e.content = e.content.replace(/ background: #000000;/g, '');
                    e.content = e.content.replace(/background: #000000;/g, '');
                    e.content = e.content.replace(/ background-color: #000000;/g, '');
                    e.content = e.content.replace(/background-color: #000000;/g, '');
                    e.content = e.content.replace(/ color: #BBBBBB;/g, '');
                    e.content = e.content.replace(/color: #BBBBBB;/g, '');
                    let regex = /<pre(.*?)>((.|\s)*)<\/pre>/mgi;
                    let m;
                    while ((m = regex.exec(e.content)) !== null) {
                        if (m.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }
                        e.content = e.content.substring(0, m.index) + e.content.substring(m.index, regex.lastIndex).replace(/(\r\n|\r|\n)/g, '<br/>').replaceAll('  ', '&nbsp;&nbsp;') + e.content.substring(regex.lastIndex);
                    }
                    if (client.getOption('enableDebug'))
                        client.debug('Advanced After Editor PastePreProcess: ' + e.content);
                });
                editor.on('PastePreProcess', () => {
                    this._addReverse($('.reverse', $(editor.getDoc()).contents()));
                });
                $('.mce-content-body', tinymce.get(this._element.id).getDoc()).css('font-size', client.getOption('cmdfontSize'));
                $('.mce-content-body', tinymce.get(this._element.id).getDoc()).css('font-family', client.getOption('cmdfont') + ', monospace');
                if (tinymce.get(this._element.id).formatter)
                    tinymce.get(this._element.id).formatter.register('flash', { inline: 'span', 'classes': client.getOption('flashing') ? 'flash' : 'noflash', links: true, remove_similar: true });
                else
                    tinymce.get(this._element.id).settings.formats['flash'] = { inline: 'span', 'classes': client.getOption('flashing') ? 'flash' : 'noflash', links: true, remove_similar: true };
                this._loadColors();
                this.setFormatted(this._element.value);
                editor.on('click', e => {
                    this.emit('click', e);
                })
                this.emit('editor-init');
                this._init = true;
            },
            paste_data_images: false,
            paste_webkit_styles: 'color background background-color text-decoration',
            valid_elements: 'strong/b,em/i,u,span[style|class],strike/s,br',
            valid_styles: {
                '*': 'color,background,background-color,text-decoration,font-weight'
            },
            color_map: this._ColorTable,
        });
    }

    public focus() {
        if (this.isSimple)
            this._element.focus();
        else if (this._init && TINYMCE && tinymce.get(this._element.id) && tinymce.get(this._element.id).initialized)
            tinymce.get(this._element.id).focus();
    }
}