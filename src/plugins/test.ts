import { Plugin } from '../plugin';
import { MenuItem, FunctionEvent } from '../types';
import { Client } from '../client';
import { Ansi, AnsiColorCode } from '../ansi';
import { openFileDialog, readFile, StringToUint8Array } from '../library'

export class Test extends Plugin {
    /**
     * Contains a list of functions
     * @type {object}
     * @memberof Tests
     */
    public functions: object = {};
    private _event;

    constructor(client: Client) {
        super(client);
        this._event = data => this._processFunction(data);
        this.functions['testfile'] = data => {
            if (data && data.args && data.args.length)
                throw new Error('Invalid syntax use ' + this.client.getOption('commandChar') + 'testfile');
            openFileDialog().then(files => {
                console.time('testfile readFile');
                readFile(files[0]).then((contents: any) => {
                    console.timeEnd('testfile readFile');
                    if (data && data.raw && (this.client.getOption('echo') & 4) === 4)
                        this.client.echo(data.raw, -3, -4, true, true);
                    let n = this.client.getOption('enableCommands');
                    this.client.setOption('enableCommands', true);
                    let i = new Date().getTime();
                    console.time('testfile parse');
                    this.client.sendCommand(contents, null, this.client.getOption('allowCommentsFromCommand'));
                    console.timeEnd('testfile parse');
                    let p = new Date().getTime();
                    this.client.setOption('enableCommands', n);
                    this.client.print(`Time: ${p - i}\n`, true);
                }).catch(this.client.error);
            }).catch(() => { });
        };
        this.functions['testfiler'] = data => {
            if (data && data.args && data.args.length)
                throw new Error('Invalid syntax use ' + this.client.getOption('commandChar') + 'testfile');
            openFileDialog().then(files => {
                console.time('testfile readFile');
                readFile(files[0]).then((contents: any) => {
                    console.timeEnd('testfile readFile');
                    if (data && data.raw && (this.client.getOption('echo') & 4) === 4)
                        this.client.echo(data.raw, -3, -4, true, true);
                    let n = this.client.getOption('enableCommands');
                    this.client.setOption('enableCommands', true);
                    let i = new Date().getTime();
                    console.time('testfiler parse');
                    this.client.telnet.receivedData(StringToUint8Array(contents), true, true);
                    console.timeEnd('testfiler parse');
                    let p = new Date().getTime();
                    this.client.setOption('enableCommands', n);
                    this.client.print(`Time: ${p - i}\n`, true);
                }).catch(this.client.error);
            }).catch(() => { });
        };
        this.functions['testspeedfile'] = data => {
            if (data && data.args && data.args.length)
                throw new Error('Invalid syntax use ' + this.client.getOption('commandChar') + 'testspeedfile');
            openFileDialog().then(files => {
                console.time('testspeedfile readFile');
                readFile(files[0]).then((contents: any) => {
                    console.timeEnd('testspeedfile readFile');
                    if (data && data.raw && (this.client.getOption('echo') & 4) === 4)
                        this.client.echo(data.raw, -3, -4, true, true);
                    let avg = 0;
                    let max = 0;
                    let min = 0;
                    let items = [];
                    let p;
                    console.time(`testspeedfile`);
                    for (let i = 0; i < 10; i++) {
                        const start = new Date().getTime();
                        console.time(`testspeedfile parse ${i}`);
                        this.client.sendCommand(contents, null, this.client.getOption('allowCommentsFromCommand'));
                        console.timeEnd(`testspeedfile parse ${i}`);
                        const end = new Date().getTime();
                        p = end - start;
                        avg += p;
                        if (p > max) max = p;
                        if (!min || p < min) min = p;
                        items.push(`${i} - ${p}`);
                    }
                    console.timeEnd(`testspeedfile`);
                    items.push(`Total - ${avg}`);
                    items.push(`Average - ${avg / 10}`);
                    items.push(`Min - ${min}`);
                    items.push(`Max - ${max}`);
                    this.client.print(items.join('\n') + '\n', true);
                }).catch(this.client.error);
            }).catch(() => { });
        };
        this.functions['testspeedfiler'] = data => {
            if (data && data.args && data.args.length)
                throw new Error('Invalid syntax use ' + this.client.getOption('commandChar') + 'testspeedfiler');
            openFileDialog().then(files => {
                console.time('testspeedfile readFile');
                readFile(files[0]).then(contents => {
                    console.timeEnd('testspeedfile readFile');
                    if (data && data.raw && (this.client.getOption('echo') & 4) === 4)
                        this.client.echo(data.raw, -3, -4, true, true);
                    let avg = 0;
                    let max = 0;
                    let min = 0;
                    let items = [];
                    let p;
                    console.time(`testspeedfile`);
                    for (let i = 0; i < 10; i++) {
                        const start = new Date().getTime();
                        console.time(`testspeedfile parse ${i}`);
                        this.client.telnet.receivedData(StringToUint8Array(contents), true, true);
                        console.timeEnd(`testspeedfile parse ${i}`);
                        const end = new Date().getTime();
                        p = end - start;
                        avg += p;
                        if (p > max) max = p;
                        if (!min || p < min) min = p;
                        items.push(`${i} - ${p}`);
                    }
                    console.timeEnd(`testspeedfile`);
                    items.push(`Total - ${avg}`);
                    items.push(`Average - ${avg / 10}`);
                    items.push(`Min - ${min}`);
                    items.push(`Max - ${max}`);
                    this.client.print(items.join('\n') + '\n', true);
                }).catch(this.client.error);
            }).catch(() => { });
        };

        this.functions['testlist'] = () => {
            let sample = 'Test commands:\n';
            let t;
            for (t in this.functions) {
                if (!this.functions.hasOwnProperty(t)) continue;
                sample += `\t${this.client.getOption('commandChar') + t}\n`;
            }
            this.client.print(sample, true);
        };

        this.functions['testcolors'] = () => {
            let r;
            let sample = 'Colors and Styles\n-------------------------------------------------------------------------------------------\n';
            for (r = 30; r < 38; r++) {
                sample += '\x1b[' + r + ';0m' + r + '\x1b[0m ';
                sample += '\x1b[' + r + ';1mBold\x1b[0m ';
                sample += '\x1b[' + r + ';2mFaint\x1b[0m ';
                sample += '\x1b[' + r + ';3mItalic\x1b[0m ';
                sample += '\x1b[' + r + ';4mUnderline\x1b[0m ';
                sample += '\x1b[' + r + ';5mFlash\x1b[0m ';
                sample += '\x1b[' + r + ';7mInverse\x1b[0m ';
                sample += '\x1b[' + r + ';8mConceal\x1b[0m ';
                sample += '\x1b[' + r + ';9mStrikeout\x1b[0m ';
                sample += '\x1b[' + r + ';21mDoubleUnderline\x1b[0m ';
                sample += '\x1b[' + r + ';53mOverline\x1b[0m ';
                sample += '\x1b[' + r + ';1;2;3;4;5;9;21;53mAll\x1b[0m';
                sample += '\x1b[0m\n';
            }
            for (r = 40; r < 48; r++) {
                sample += '\x1b[' + r + ';0m' + r + '\x1b[0m ';
                sample += '\x1b[' + r + ';1mBold\x1b[0m ';
                sample += '\x1b[' + r + ';2mFaint\x1b[0m ';
                sample += '\x1b[' + r + ';3mItalic\x1b[0m ';
                sample += '\x1b[' + r + ';4mUnderline\x1b[0m ';
                sample += '\x1b[' + r + ';5mFlash\x1b[0m ';
                sample += '\x1b[' + r + ';7mInverse\x1b[0m ';
                sample += '\x1b[' + r + ';8mConceal\x1b[0m ';
                sample += '\x1b[' + r + ';9mStrikeout\x1b[0m ';
                sample += '\x1b[' + r + ';21mDoubleUnderline\x1b[0m ';
                sample += '\x1b[' + r + ';53mOverline\x1b[0m ';
                sample += '\x1b[' + r + ';1;2;3;4;5;9;21;53mAll\x1b[0m';
                sample += '\x1b[0m\n';
            }
            sample += '-------------------------------------------------------------------------------------------\n';
            this.client.print(sample, true);
        };

        this.functions['testcolorsdetails'] = () => {
            let sample = '';
            if (this.client.telnet.prompt)
                sample = '\n';
            sample += 'Table for 16-color terminal escape sequences.\n';
            sample += '\n';
            sample += 'Background        | Foreground colors\n';
            sample += '------------------------------------------------------------------------------------\n';
            for (let bg = 40; bg <= 47; bg++) {
                let a;
                for (a in Ansi) {
                    if (typeof Ansi[a] !== 'number') continue;
                    if (a === 'Rapid') continue;
                    //-16
                    if (a === 'None')
                        sample += '\x1B[0m ' + AnsiColorCode[(bg - 10)].toString().padEnd(16) + ' | ';
                    else
                        sample += '\x1B[0m ' + a.padEnd(16) + ' | ';
                    //-7
                    for (let fg = 30; fg <= 37; fg++) {
                        if (a === 'None')
                            sample += '\x1B[' + bg + 'm\x1B[' + fg + 'm ' + ('[' + fg + 'm').padEnd(7);
                        else
                            sample += '\x1B[' + bg + 'm\x1B[' + Ansi[a] + ';' + fg + 'm ' + ('[' + Ansi[a] + ';' + fg + 'm').padEnd(7);
                    }
                    sample += '\x1B[0m\n';
                }
                /*
                for (int bold = 0; bold <= 9; bold++)
                {
                    if (bold == 6)
                        continue;
                    if (bold == 0)
                        sample += "\x001B[0m " + string.Format("{0, -10}", "ESC[" + bg.ToString() + "m") + " | ";
                    else
                        sample += "\x001B[0m " + string.Format("{0, -10}", ((Ansi)bold).ToString()) + " | ";
                    for (int fg = 30; fg <= 37; fg++)
                    {
                        if (bold == 0)
                            sample += "\x001B[" + bg.ToString() + "m\x001B[" + fg.ToString() + "m [" + fg.ToString() + "m  ";
                        else
                            sample += "\x001B[" + bg.ToString() + "m\x001B[" + bold.ToString() + ";" + fg.ToString() + "m [" + bold.ToString() + ";" + fg.ToString() + "m";
                    }
                    sample += "\x001B[0m\n";
                }
                */
                sample += '------------------------------------------------------------------------------------\n';
            }
            this.client.print(sample, true);
        };

        this.functions['testxterm'] = title => {
            let r;
            let g;
            let b;
            let c;
            let sample = '';
            if (typeof title !== 'undefined' && title.length > 0) {
                sample += 'Set Title: ';
                sample += title;
                sample += '\x1B]0;';
                sample += title;
                sample += '\u0007\n';
            }
            sample += 'System colors:\n';

            for (c = 0; c < 8; c++)
                sample += '\x1B[48;5;' + c + 'm  ';
            sample += '\x1B[0m\n';
            for (c = 8; c < 16; c++)
                sample += '\x1B[48;5;' + c + 'm  ';
            sample += '\x1B[0m\n\n';
            sample += 'Color cube, 6x6x6:\n';

            for (g = 0; g < 6; g++) {
                for (r = 0; r < 6; r++) {
                    for (b = 0; b < 6; b++) {
                        c = (16 + (r * 36) + (g * 6) + b);
                        sample += '\x1B[48;5;' + c + 'm  ';
                    }
                    sample += '\x1B[0m ';
                }
                sample += '\n';
            }
            sample += 'Grayscale ramp:\n';

            for (c = 232; c < 256; c++)
                sample += '\x1B[48;5;' + c + 'm  ';
            sample += '\x1B[0m\n';
            this.client.print(sample, true);
        };
        //spell-checker:disable
        this.functions['testmxp'] = () => {
            let sample = 'Text Formatting\n';
            sample += '\t\x1B[6z';
            sample += '<!--Test-->&lt;!--Test--&gt;\n';
            sample += '\t<!--Test>-->&lt;!--Test&gt;--&gt;\n';
            sample += '\t<STRONG>STRONG</STRONG>\n';
            sample += '\t<BOLD>BOLD</BOLD>\n';
            sample += '\t<B>B</B>\n';
            sample += '\t<I>I</I>\n';
            sample += '\t<ITALIC>ITALIC</ITALIC>\n';
            sample += '\t<EM>EM</EM>\n';
            sample += '\t<U>U</U>\n';
            sample += '\t<UNDERLINE>UNDERLINE</UNDERLINE>\n';
            sample += '\t<S>S</S>\n';
            sample += '\t<STRIKEOUT>STRIKEOUT</STRIKEOUT>\n';
            sample += '\t<H>H</H>\n';
            sample += '\t<HIGH>HIGH</HIGH>\n';
            sample += '\t<C RED>C RED</C>\n';
            sample += '\t<COLOR #F00>COLOR #F00</COLOR>\n';
            sample += '\t<C Maroon>C Maroon</C>\n';
            sample += '\t<COLOR #800000>COLOR #800000</COLOR>\n';
            sample += '\t<H><C Maroon>H C Maroon</C></H>\n';
            sample += '\t<H><COLOR #800000>H COLOR #800000</COLOR></H>\n';
            sample += '\tRun <send PROMPT>#testmxpcolors</send> for a detailed list.\n';
            sample += '\t<FONT "Times New Roman">FONT "Times New Roman"</FONT>\n';
            sample += '\t<FONT "Webdings">FONT "Webdings"</FONT>\n';
            sample += '\t<FONT COLOR=Red,Blink>FONT COLOR=Red,Blink</FONT>\n';
            sample += '\t<FONT "Times New Roman" 24 RED GREEN>FONT "Times New Roman" 24 RED GREEN</FONT>\n';
            sample += 'Line Spacing\n';
            sample += '\tNOBR<NOBR>\n';
            sample += ' Continued<NOBR>\n';
            sample += ' More\n';
            sample += '\t<P>P\n';
            sample += '\t1\n';
            sample += '\t2\n';
            sample += '\t3\n';
            sample += '\t4</P>\n';
            sample += '\tBR Line<BR>Break\n';
            sample += '\tSBR Soft<SBR>Break\n';
            sample += 'Links\n';
            sample += '\t<A "http://shadowmud.com">Click here for ShadowMUD</A> \n';
            sample += '\t<send>test command</send>\n';
            sample += '\t<send href="command2">test command2</send>\n';
            sample += '\t<send "command1|command2|command3" hint="click to see menu|Item 1|Item 2|Item 3">this is a menu link</SEND>\n';
            sample += '\t<SEND "sample" PROMPT EXPIRE=prompt>Prompt sample</SEND>\n';
            sample += '\t<send PROMPT href="#testmxpexpire">&lt;EXPIRE&gt; - #testmxpexpire</send> \n';
            sample += 'Horizontal Rule\n';
            sample += '<hr>\n';
            sample += '<hr>Text After\n';
            sample += 'Text Before<hr>\n';
            sample += '<c red blue><hr></c>\n';
            sample += 'Text Before<hr>Text After\n';
            sample += 'Custom Element\n';
            sample += '\t<!ELEMENT help \'<send href="help &text;">\'>&lt;!ELEMENT help \'&lt;send href="help &amp;text;"&gt;\'&gt;\n';
            sample += '\t&lt;help&gt;test&lt;/help&gt; = <help>test</help>\n';
            sample += '\t<!ELEMENT redbu \'<c red><b><u>\'>&lt;!ELEMENT redbu \'&lt;c red&gt;&lt;b&gt;&lt;u&gt;\'&gt;\n';
            sample += '\t&lt;redbu&gt;test&lt;/redbu&gt; = <redbu>test</redbu>\n';
            sample += 'Entities\n';
            sample += '\t&#243;&brvbar;&copy;&plusmn;&sup3;&para;&frac34;&infin;&Dagger;&dagger;&spades;&clubs;&hearts;&diams;\n';
            sample += 'Custom Entity\n';
            sample += '\t<!ENTITY version "' + this.client.version + '">&lt;!ENTITY version "' + this.client.version + '"&gt;\n';
            sample += '\t&amp;version; = &version;\n';
            sample += '\t&lt;V Hp&gt;<V Hp>100</V>&lt;/V&gt; &amp;Hp; = &Hp; &amp;hp; = &hp;\n';
            sample += '\t&lt;VAR Sp&gt;<VAR Sp>200</VAR>&lt;/VAR&gt; &amp;Sp; = &Sp; &amp;sp; = &sp;\n';
            sample += 'Image\n';
            sample += 'default      <image connected.png URL="./images/" w=48 h=48>\n';
            sample += 'align left <image connected.png URL="./images/" align=left w=48 h=48> align left\n';
            sample += 'align right  <image connected.png URL="./images/" align=right w=48 h=48> align right\n';
            sample += 'align top    <image connected.png URL="./images/" align=top w=48 h=48> align top \n';
            sample += 'align middle <image connected.png URL="./images/" align=middle w=48 h=48> align middle\n';
            sample += 'align bottom <image connected.png URL="./images/" align=bottom w=48 h=48> align bottom\n';
            sample += 'map          <send showmap><image connected.png URL="./images/" ismap w=48 h=48></send>\n';
            sample += '<STAT Hp version Test>';
            sample += '<GAUGE Hp version Test>';
            sample += '\x1B[0z';
            this.client.print(sample, true);
        };

        this.functions['testmxp2'] = () => {
            let sample = '\x1B[6z';
            sample += '<!-- Elements to support the Auto mapper -->';
            sample += '<!ELEMENT RName \'<FONT COLOR=Red><B>\' FLAG="RoomName">';
            sample += '<!ELEMENT RDesc FLAG=\'RoomDesc\'>';
            sample += '<!ELEMENT RExits \'<FONT COLOR=Blue>\' FLAG=\'RoomExit\'>';
            sample += '<!-- The next element is used to define a room exit link that sends ';
            sample += 'the exit direction to the MUD if the user clicks on it -->';
            sample += '<!ELEMENT Ex \'<SEND>\'>';
            sample += '<!ELEMENT Chat \'<FONT COLOR=Gray>\' OPEN>';
            sample += '<!ELEMENT Gossip \'<FONT COLOR=Cyan>\' OPEN>';
            sample += '<!-- in addition to standard HTML Color specifications, you can use ';
            sample += 'color attribute names such as blink -->';
            sample += '<!ELEMENT ImmChan \'<FONT COLOR=Red,Blink>\'>';
            sample += '<!ELEMENT Auction \'<FONT COLOR=Purple>\' OPEN>';
            sample += '<!ELEMENT Group \'<FONT COLOR=Blue>\' OPEN>';
            sample += '<!-- the next elements deal with the MUD prompt -->';
            sample += '<!ELEMENT Prompt FLAG="Prompt">';
            sample += '<!ELEMENT Hp FLAG="Set hp">';
            sample += '<!ELEMENT MaxHp FLAG="Set maxhp">';
            sample += '<!ELEMENT Mana FLAG="Set mana">';
            sample += '<!ELEMENT MaxMana FLAG="Set maxmana">';
            sample += '<!-- now the MUD text -->';
            sample += '<RName>The Main Temple</RName>\n';
            sample += '<RDesc>This is the main hall of the MUD where everyone starts.\n';
            sample += 'Marble arches lead south into the town, and there is a <i>lovely</i>\n';
            sample += '<send "drink &text;">fountain</send> in the center of the temple,</RDesc>\n';
            sample += '<RExits>Exits: <Ex>N</Ex>, <Ex>S</Ex>, <Ex>E</Ex>, <Ex>W</Ex></RExits>\n\n';
            sample += '<Prompt>[<Hp>100</Hp>/<MaxHp>120</MaxHp>hp <Mana>50</Mana>/<MaxMana>55</MaxMana>mana]</Prompt>\n<hr>';
            sample += '<!ELEMENT boldtext \'<COLOR &col;><B>\' ATT=\'col=red\'>';
            sample += '<boldtext>This is bold red</boldtext>\n';
            sample += '<boldtext col=blue>This is bold blue text</boldtext>\n';
            sample += '<boldtext blue>This is also bold blue text</boldtext>\n';
            sample += '\x1B[0z';
            this.client.print(sample, true);
        };
        //spell-checker:enable
        this.functions['testmxpexpire'] = () => {
            this.client.print('\t\x1B[6z<SEND "sample" PROMPT EXPIRE=prompt>Expire sample</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire sample2</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire sample3</SEND>\x1B[0z\n', true);
            this.client.print('\t\x1B[6z\x1b[36m<SEND "sample" PROMPT EXPIRE=prompt>Expire sample</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire sample2</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire sample3</SEND>\x1B[0z\x1b[0m\n', true);
            this.client.print('\t\x1B[6z\x1b[46;30m<SEND "sample" PROMPT EXPIRE=prompt>Expire sample</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire sample2</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire sample3</SEND>\x1B[0z\x1b[0m\n', true);
            this.client.print('\t\x1B[6z<SEND "sample" PROMPT EXPIRE=prompt>Expire \x1b[36msample\x1b[0m</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire \x1b[36msample2\x1b[0m</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire \x1b[36msample3\x1b[0m</SEND>\x1B[0z\n', true);
        };

        this.functions['testmxpcolors'] = () => {
            const colors = ['IndianRed', 'LightCoral', 'Salmon', 'DarkSalmon', 'LightSalmon',
                'Crimson', 'Red', 'FireBrick', 'DarkRed', 'Pink', 'LightPink', 'HotPink', 'DeepPink',
                'MediumVioletRed', 'PaleVioletRed', 'LightSalmon', 'Coral', 'Tomato', 'OrangeRed',
                'DarkOrange', 'Orange', 'Gold', 'Yellow', 'LightYellow', 'LemonChiffon',
                'LightGoldenrodYellow', 'PapayaWhip', 'Moccasin', 'PeachPuff', 'PaleGoldenrod',
                'Khaki', 'DarkKhaki', 'Lavender', 'Thistle', 'Plum', 'Violet', 'Orchid', 'Fuchsia',
                'Magenta', 'MediumOrchid', 'MediumPurple', 'BlueViolet', 'DarkViolet',
                'DarkOrchid', 'DarkMagenta', 'Purple', 'Indigo', 'SlateBlue', 'DarkSlateBlue',
                'MediumSlateBlue', 'GreenYellow', 'Chartreuse', 'LawnGreen', 'Lime', 'LimeGreen',
                'PaleGreen', 'LightGreen', 'MediumSpringGreen', 'SpringGreen', 'MediumSeaGreen',
                'SeaGreen', 'ForestGreen', 'Green', 'DarkGreen', 'YellowGreen', 'OliveDrab',
                'Olive', 'DarkOliveGreen', 'MediumAquamarine', 'DarkSeaGreen', 'LightSeaGreen',
                'DarkCyan', 'Teal', 'Aqua', 'Cyan', 'LightCyan', 'PaleTurquoise', 'Aquamarine',
                'Turquoise', 'MediumTurquoise', 'DarkTurquoise', 'CadetBlue', 'SteelBlue',
                'LightSteelBlue', 'PowderBlue', 'LightBlue', 'SkyBlue', 'LightSkyBlue',
                'DeepSkyBlue', 'DodgerBlue', 'CornflowerBlue', 'MediumSlateBlue', 'RoyalBlue',
                'Blue', 'MediumBlue', 'DarkBlue', 'Navy', 'MidnightBlue', 'Cornsilk',
                'BlanchedAlmond', 'Bisque', 'NavajoWhite', 'Wheat', 'BurlyWood', 'Tan',
                'RosyBrown', 'SandyBrown', 'Goldenrod', 'DarkGoldenrod', 'Peru', 'Chocolate',
                'SaddleBrown', 'Sienna', 'Brown', 'Maroon', 'White', 'Snow', 'Honeydew',
                'MintCream', 'Azure', 'AliceBlue', 'GhostWhite', 'WhiteSmoke', 'Seashell',
                'Beige', 'OldLace', 'FloralWhite', 'Ivory', 'AntiqueWhite', 'Linen',
                'LavenderBlush', 'MistyRose', 'Gainsboro', 'LightGrey', 'Silver', 'DarkGray',
                'Gray', 'DimGray', 'LightSlateGray', 'SlateGray', 'DarkSlateGray', 'Black'];
            let sample = '\x1B[6z';
            const cl = colors.length - 1;
            for (let c = 0; c < cl; c++) {
                sample += '' + colors[c] + ': ';
                sample += Array(22 - colors[c].length).join(' ');
                sample += '<C ' + colors[c] + '>Fore</C> ';
                sample += '<C black ' + colors[c] + '>Back</C> ';
                sample += '<h><C ' + colors[c] + '>High</C></h> ';
                sample += '<b><C ' + colors[c] + '>Bold</C></b> ';
                sample += '<C ' + colors[c] + '>\x1b[1mAnsiBold\x1b[0m ';
                sample += '\x1b[2mFaint\x1b[0m ';
                sample += '\x1b[3mItalic\x1b[0m ';
                sample += '\x1b[4mUnderline\x1b[0m ';
                sample += '\x1b[5mFlash\x1b[0m ';
                sample += '\x1b[7mInverse\x1b[0m ';
                sample += '\x1b[8mConceal\x1b[0m ';
                sample += '\x1b[9mStrikeout\x1b[0m ';
                sample += '\x1b[21mDoubleUnderline\x1b[0m ';
                sample += '\x1b[53mOverline\x1b[0m';
                sample += '</C>\n';
            }
            sample += 'Black: ';
            sample += Array(17).join(' ');
            sample += '<C Black silver>Fore</C> ';
            sample += '<C silver Black>Back</C> ';
            sample += '<h><C Black silver>High</C></h> ';
            sample += '<b><C Black silver>Bold</C></b> ';
            sample += '<C Black silver>\x1b[1mAnsiBold\x1b[0m ';
            sample += '\x1b[2mFaint\x1b[0m ';
            sample += '\x1b[3mItalic\x1b[0m ';
            sample += '\x1b[4mUnderline\x1b[0m ';
            sample += '\x1b[5mFlash\x1b[0m ';
            sample += '\x1b[7mInverse\x1b[0m ';
            sample += '\x1b[8mConceal\x1b[0m ';
            sample += '\x1b[9mStrikeout\x1b[0m ';
            sample += '\x1b[21mDoubleUnderline\x1b[0m ';
            sample += '\x1b[53mOverline\x1b[0m';
            sample += '</C>\n';
            sample += '\x1B[0z';
            this.client.print(sample, true);
        };

        this.functions['testmxpelements'] = () => {
            let sample = '\x1B[6z';
            sample += 'Custom Element\n';
            sample += '\t<!ELEMENT help \'<send href="help &text;">\'>&lt;!ELEMENT help \'&lt;send href="help &amp;text;"&gt;\'&gt;\n';
            sample += '\t&lt;help&gt;test&lt;/help&gt; = <help>test</help>\n';
            sample += '\t<!ELEMENT redbu \'<c red><b><u>\'>&lt;!ELEMENT redbu \'&lt;c red&gt;&lt;b&gt;&lt;u&gt;\'&gt;\n';
            sample += '\t&lt;redbu&gt;test&lt;/redbu&gt; = <redbu>test</redbu>\n';
            sample += '\x1B[0z';
            this.client.print(sample, true);
        };

        this.functions['testmxplines'] = () => {
            let sample = '\x1B[6z';
            sample += '<!ELEMENT Auction \'<FONT COLOR=red>\' TAG=20 OPEN>';
            sample += '\x1B[20zA nice shiny sword is being auctioned.\n';
            sample += '\x1B[6z<Auction>Also, a gold ring is being auctioned.</Auction>';
            sample += '<!ELEMENT Auction TAG=20>\n';
            sample += '<!TAG 20 Fore=red>\n';
            sample += '\x1B[20zA nice shiny sword is being auctioned.\n';
            sample += '\x1B[6z<Auction>Also, a gold ring is being auctioned.</Auction>\n';
            sample += '\x1B[6z<!TAG 20 Fore=blue>\n';
            sample += '\x1B[20zA nice shiny sword is being auctioned.\n';
            sample += '\x1B[6z<Auction>Also, a gold ring is being auctioned.</Auction>\n';
            sample += '\x1B[0z';
            this.client.print(sample, true);
        };

        this.functions['testmapper'] = () => {
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: 0, dir: '', area: '' },
                area: 'Doc Build Samples Area',
                exits: {
                    south: { num: 87723359, dir: 'south', area: 'Doc Build Samples Area', isdoor: 0 },
                    east: { num: -329701270, dir: 'east', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 1',
                num: 1968208336,
                indoors: 0
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: 1968208336, dir: 'east', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                environment: 'wood',
                exits: {
                    south: { num: 1916648905, dir: 'south', area: 'Doc Build Samples Area', isdoor: 0 },
                    east: { num: -1688332036, dir: 'east', area: 'Doc Build Samples Area', isdoor: 0 },
                    west: { num: 1968208336, dir: 'west', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 2',
                num: -329701270,
                indoors: 0
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: -329701270, dir: 'east', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                environment: 'jungle',
                exits: {
                    south: { num: -348853133, dir: 'south', area: 'Doc Build Samples Area', isdoor: 0 },
                    west: { num: -329701270, dir: 'west', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 3',
                num: -1688332036,
                indoors: 0
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: -1688332036, dir: 'south', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                environment: 'grass',
                exits: {
                    north: { num: -1688332036, dir: 'north', area: 'Doc Build Samples Area', isdoor: 0 },
                    south: { num: 2072768994, dir: 'south', area: 'Doc Build Samples Area', isdoor: 0 },
                    west: { num: 1916648905, dir: 'west', area: 'Doc Build Samples Area', isdoor: 0 }
                }, name: 'Sample room 6',
                num: -348853133,
                indoors: 0
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: -348853133, dir: 'west', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                environment: 'desert',
                exits: {
                    north: { num: -329701270, dir: 'north', area: 'Doc Build Samples Area', isdoor: 0 },
                    south: { num: 210551156, dir: 'south', area: 'Doc Build Samples Area', isdoor: 0 },
                    east: { num: -348853133, dir: 'east', area: 'Doc Build Samples Area', isdoor: 0 },
                    west: { num: 87723359, dir: 'west', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 5',
                num: 1916648905,
                indoors: 1
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: 1916648905, dir: 'west', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                environment: 'tundra',
                exits: {
                    north: { num: 1968208336, dir: 'north', area: 'Doc Build Samples Area', isdoor: 0 },
                    south: { num: -1674322715, dir: 'south', area: 'Doc Build Samples Area', isdoor: 0 },
                    east: { num: 87723359, dir: 'east', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 4',
                num: 87723359,
                indoors: 0
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: 87723359, dir: 'south', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                environment: 'water',
                exits: {
                    north: { num: 87723359, dir: 'north', area: 'Doc Build Samples Area', isdoor: 0 },
                    east: { num: 210551156, dir: 'east', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 7',
                num: -1674322715,
                indoors: 0
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: -1674322715, dir: 'east', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                environment: 'jungle',
                exits: {
                    north: { num: 1916648905, dir: 'north', area: 'Doc Build Samples Area', isdoor: 0 },
                    east: { num: 2072768994, dir: 'east', area: 'Doc Build Samples Area', isdoor: 0 },
                    west: { num: -1674322715, dir: 'west', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 8',
                num: 210551156,
                indoors: 0
            });
            this.client.emit('received-GMCP', 'Room.Info', {
                details: [],
                doors: {},
                prevroom: { num: 210551156, dir: 'east', area: 'Doc Build Samples Area' },
                area: 'Doc Build Samples Area',
                exits: {
                    north: { num: -348853133, dir: 'north', area: 'Doc Build Samples Area', isdoor: 0 },
                    west: { num: 210551156, dir: 'west', area: 'Doc Build Samples Area', isdoor: 0 }
                },
                name: 'Sample room 9',
                num: 2072768994,
                indoors: 0
            });
        };

        this.functions['teststatus'] = data => {
            this.client.emit('received-GMCP', 'Char.Base', {
                name: 'Tester',
                class: 'fighter',
                subclass: 'None',
                race: 'human',
                level: 1,
                gender: 'male'
            });
            this.client.emit('received-GMCP', 'Char.Vitals', {
                hp: 75,
                hpmax: 100,
                sp: 50,
                spmax: 100,
                mp: 25,
                mpmax: 100
            });
            this.client.emit('received-GMCP', 'Char.Experience', {
                current: 50,
                need: 100,
                needPercent: 50,
                earned: 200,
                banked: 300
            });
            this.client.emit('received-GMCP', 'oMUD.limb', {
                head: 10,
                torso: 20,
                'left arm': 30,
                'right arm': 40,
                'left hand': 50,
                'right hand': 60,
                'left leg': 70,
                'right leg': 80,
                'right foot': 90,
                'left foot': 100,
                'left wing': 90,
                'right wing': 80,
                tail: 70
            });
            this.client.emit('received-GMCP', 'oMUD.ac', {
                head: 0,
                torso: 1,
                'left arm': 2,
                'right arm': 3,
                'left hand': 3.5,
                'right hand': 4,
                'left leg': 4.5,
                'right leg': 5,
                'right foot': 5.5,
                'left foot': 6,
                'left wing': 6.5,
                'right wing': 5,
                tail: 4,
                overall: 4
            });
            this.client.emit('received-GMCP', 'oMUD.weapons', {
                "right hand": { "name": "knife", "type": "knife", "subtype": "dagger", "material": "iron", "quality": "pooor", "dominant": 1 },
                "left hand": { "name": "club", "type": "blunt", "subtype": "club", "material": "wood", "quality": "ordinary", "dominant": 0 }
            });
            if (data && data.args && data.args.length && data.args[0] === 'night')
                this.client.emit('received-GMCP', 'oMUD.Environment', { tod: 'night', moons: ['waning', 'full', 'waxing'] });
            else
                this.client.emit('received-GMCP', 'oMUD.Environment', { "tod": "day" });
            this.client.emit('received-GMCP', 'oMUD.skill', { skill: 'knife', percent: 60 });
            this.client.emit('received-GMCP', 'oMUD.skill', { skill: 'knife', amount: 100, bonus: 5, category: 'weapon' });
            this.client.emit('received-GMCP', 'oMUD.skill', { skill: 'small sword', percent: 100 });
            let found = false;
            this.client.emit('received-GMCP', 'oMUD.skill', { skill: 'small sword', amount: 1150, bonus: 0, category: 'weapon' });
            if (data && data.args && data.args.length) {
                data.args.forEach(arg => {
                    if (arg.startsWith('party:')) {
                        found = true;
                        let s = parseInt(arg.split(':')[1], 10);
                        for (let m = 0; m < s; m++)
                            this.client.emit('received-GMCP', 'oMUD.party', { "action": "update", "name": "Party " + (m + 1), "hp": 50, race: "human", "id": m });
                    }
                });
            }
            if (!found) {
                this.client.emit('received-GMCP', 'oMUD.party', { "action": "update", "name": "Elf", "hp": 50, race: "elf", "id": 1 });
                this.client.emit('received-GMCP', 'oMUD.party', { "action": "update", "name": "Dwarf", "hp": 100, race: "dwarf", "id": 2 });
            }
            found = false
            if (data && data.args && data.args.length) {
                data.args.forEach(arg => {
                    if (arg.startsWith('monster:')) {
                        found = true;
                        let s = parseInt(arg.split(':')[1], 10);
                        for (let m = 0; m < s; m++)
                            this.client.emit('received-GMCP', 'oMUD.combat', { "action": "update", "name": "Monster " + (m + 1), "hp": 50, race: "orc", "id": m, order: 0 });
                    }
                });
            }
            if (!found) {
                this.client.emit('received-GMCP', 'oMUD.combat', { "action": "update", "name": "Monster", "hp": 50, race: "orc", "id": 3, order: 0 });
                this.client.emit('received-GMCP', 'oMUD.combat', { "action": "update", "name": "Monster 2", "hp": 100, race: "dragon", "id": 4, order: 1 });
                this.client.emit('received-GMCP', 'oMUD.combat', { "action": "update", "name": "Monster with extra super long name to test", "hp": 100, race: "dragon", "id": 5, order: 2 });
            }
        };

        this.functions['testfansi'] = () => {
            let sample = '';
            let i;
            sample = String.fromCharCode(1);
            for (i = 3; i <= 6; i++)
                sample += String.fromCharCode(i);
            for (i = 14; i <= 26; i++)
                sample += String.fromCharCode(i);
            for (i = 28; i <= 31; i++)
                sample += String.fromCharCode(i);
            for (i = 127; i <= 254; i++)
                sample += String.fromCharCode(i);
            sample += '\n';
            const dcc = this.client.display.displayControlCodes;
            this.client.display.displayControlCodes = true;
            if (!this.client.display.emulateTerminal) {
                this.client.print(sample, true);
                this.client.display.emulateTerminal = true;
                this.client.print(sample, true);
                this.client.display.emulateTerminal = false;
            }
            else {
                this.client.display.emulateTerminal = false;
                this.client.print(sample, true);
                this.client.display.emulateTerminal = true;
                this.client.print(sample, true);
            }
            this.client.display.displayControlCodes = dcc;
        };

        this.functions['testcontrolchars'] = () => {
            let i;
            let sample = '1:  ' + String.fromCharCode(1) + ',';
            for (i = 3; i <= 9; i++)
                sample += `${i}: ${String.fromCharCode(i)},`;
            for (i = 11; i <= 27; i++)
                sample += `${i}: ${String.fromCharCode(i)},`;
            for (i = 28; i <= 31; i++)
                sample += `${i}: ${String.fromCharCode(i)},`;
            for (i = 127; i <= 254; i++)
                sample += `${i}: ${String.fromCharCode(i)},`;
            sample += '\n';
            const dcc = this.client.display.displayControlCodes;
            this.client.display.displayControlCodes = true;
            this.client.print(sample, true)
            this.client.display.displayControlCodes = dcc;
        }

        //spell-checker:disable
        this.functions['testurldetect'] = () => {
            let sample = '\x1B[0mhttp://www.google.com\n';
            sample += '\thttp://www.google.com\x1B[44m\n';
            sample += 'http://www.google.com\n';
            sample += '\ttry this http://www.google.com\n';
            sample += 'http://www.google.com try this\n';
            sample += '\ttry this http://www.google.com try this\n';
            sample += '\x1B[36mhttp://www.google.com\n';
            sample += '\t\x1B[0mhttp://www.google.com\n';
            sample += 'http://www.google.com\x1B[44m\n';
            sample += '\thttp://www.google.com\n';
            sample += 'try this http://www.google.com\n';
            sample += '\thttp://www.google.com try this\n';
            sample += 'try this http://www.google.com try this\n';
            sample += '\t\x1B[36mhttp://www.google.com\n';
            sample += '\thttps://localhost telnet://localhost\n';
            sample += '\tnews://test.edu/default.asp?t=1#1111 torrent://localhost/\n';
            sample += '\tftp://localhost gopher://localhost im://talk\n';
            sample += '\tmailto:address@localhost irc://<host>[:<port>]/[<channel>[?<password>]]\n';
            sample += 'awww... www.google.com awww.com\n';
            sample += 'www.google.com www.google.com\x1B[0m';
            this.client.print(sample, true);
        };
        //spell-checker:enable

        this.functions['testxtermrgb'] = () => {
            let sample = '';
            let r;
            let g;
            let b;
            let i = 0;
            for (r = 0; r < 256; r += 16) {
                for (g = 0; g < 256; g += 16) {
                    for (b = 0; b < 256; b += 16) {
                        sample += '\x1B[48;2;' + r + ';' + g + ';' + b + 'm  ';
                        if (i % 63 === 0)
                            sample += '\n';
                        i++;
                    }
                }
            }
            sample += '\x1B[0m';
            this.client.print(sample, true);
        };

        this.functions['testsize'] = () => {
            const ws = this.client.display.WindowSize;
            let sample = ws.width + 'x' + ws.height + ' ';
            ws.width -= sample.length;
            for (let w = 0; w < ws.width; w++)
                sample += 'w';
            for (let h = 1; h < ws.height; h++)
                sample += '\n' + h;
            this.client.print(sample, true);
        };

        this.functions['testspeed'] = () => {
            const sample = [];
            const commands = this.client.getOption('commandChar') + ['testmxpcolors', 'testmxp', 'testcolors', 'testcolorsdetails', 'testxterm', 'testxtermrgb'].join('\n' + this.client.getOption('commandChar'));
            const e = this.client.getOption('enableCommands');
            this.client.setOption('enableCommands', true);
            let avg = 0;
            let max = 0;
            let min = 0;
            let t;
            for (let i = 0; i < 10; i++) {
                const start = new Date().getTime();
                this.client.sendCommand(commands);
                const end = new Date().getTime();
                t = end - start;
                avg += t;
                if (t > max) max = t;
                if (!min || t < min) min = t;
                sample.push(`${i} - ${t}`);
            }
            sample.push(`Total - ${avg}`);
            sample.push(`Average - ${avg / 10}`);
            sample.push(`Min - ${min}`);
            sample.push(`Max - ${max}`);
            this.client.print(sample.join('\n') + '\n', true);
            this.client.setOption('enableCommands', e);
        };

        this.functions['testperiod'] = () => {
            if (window['periodID']) {
                clearInterval(window['periodID']);
                delete window['period'];
                delete window['periodID'];
                return;
            }
            window['period'] = 0;
            window['periodID'] = setInterval(() => {
                if (window['period'] % 3 === 1)
                    this.client.sendCommand('#testcolors');
                else if (window['period'] % 3 === 2)
                    this.client.sendCommand('#testxterm');
                else
                    this.client.sendCommand('#testlist');
                window['period']++;
            }, 2000);
        };

        this.functions['testutf8'] = () => {
            const sample = `Armenian
Ա Բ Գ Դ Ե Զ Է Ը Թ Ժ Ի Լ Խ Ծ Կ Հ Ձ Ղ Ճ Մ Յ Ն Շ Ո Չ Պ Ջ Ռ Ս Վ Տ Ր Ց Ւ Փ Ք Օ Ֆ ՙ ՚ ՛ ՜ ՝ ՞ ՟ ա բ գ դ ե զ է ը թ ժ ի լ խ ծ կ հ ձ ղ ճ մ յ ն շ ո չ պ ջ ռ ս վ տ ր ց ւ փ ք օ ֆ և ։
Hebrew
֑ ֒ ֓ ֔ ֕ ֖ ֗ ֘ ֙ ֚ ֛ ֜ ֝ ֞ ֟ ֠ ֡ ֣ ֤ ֥ ֦ ֧ ֨ ֩ ֪ ֫ ֬ ֭ ֮ ֯ ְ ֱ ֲ ֳ ִ ֵ ֶ ַ ָ ֹ ֻ ּ ֽ ־ ֿ ׀ ׁ ׂ ׃ ׄ א ב ג ד ה ו ז ח ט י ך כ ל ם מ ן נ ס ע ף פ ץ צ ק ר ש ת װ ױ ײ ׳ ״
Arabic
، ؛ ؟ ء آ أ ؤ إ ئ ا ب ة ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ـ ف ق ك ل م ن ه و ى ي ً ٌ ٍ َ ُ ِ ّ ْ ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٪ ٫ ٬ ٭ ٰ ٱ ٲ ٳ ٴ ٵ ٶ ٷ ٸ ٹ ٺ ٻ ټ ٽ پ ٿ ڀ ځ ڂ ڃ ڄ څ چ ڇ ڈ ډ ڊ ڋ ڌ ڍ ڎ ڏ ڐ ڑ ڒ ړ ڔ ڕ ږ ڗ ژ ڙ ښ ڛ ڜ ڝ ڞ ڟ ڠ ڡ ڢ ڣ ڤ ڥ ڦ ڧ ڨ ک ڪ ګ ڬ ڭ ڮ گ ڰ ڱ ...
Devanagari
ँ ं ः अ आ इ ई उ ऊ ऋ ऌ ऍ ऎ ए ऐ ऑ ऒ ओ औ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न ऩ प फ ब भ म य र ऱ ल ळ ऴ व श ष स ह ़ ऽ ा ि ी ु ू ृ ॄ ॅ ॆ े ै ॉ ॊ ो ौ ् ॐ ॑ ॒ ॓ ॔ क़ ख़ ग़ ज़ ड़ ढ़ फ़ य़ ॠ ॡ ॢ ॣ । ॥ ० १ २ ३ ४ ५ ६ ७ ८ ९ ॰
Armenian
Ա Բ Գ Դ Ե Զ Է Ը Թ Ժ Ի Լ Խ Ծ Կ \x1b[33mՀ Ձ Ղ Ճ Մ Յ Ն Շ Ո Չ Պ Ջ Ռ Ս Վ Տ Ր Ց Ւ \x1b[34mՓ Ք Օ Ֆ ՙ ՚ ՛ ՜ ՝ ՞ ՟ ա բ գ դ ե զ է ը թ ժ ի լ խ ծ կ հ\x1b[35m ձ ղ ճ մ յ ն շ ո չ պ ջ ռ ս վ տ ր ց ւ փ ք օ ֆ և ։\x1b[0m
Hebrew
֑ ֒ ֓ ֔ ֕ ֖ ֗ ֘ ֙ ֚ ֛ ֜ ֝ ֞\x1b[33m ֟ ֠ ֡ ֣ ֤ ֥ ֦ ֧ ֨ ֩ ֪ ֫ ֬ ֭ ֮ ֯ ְ ֱ ֲ ֳ ִ ֵ ֶ ַ ָ ֹ ֻ ּ ֽ ־ ֿ ׀ ׁ ׂ ׃ ׄ א ב ג ד ה ו ז ח ט י ך כ ל\x1b[34m ם מ ן נ ס ע ף פ ץ צ ק ר ש ת װ ױ ײ ׳ ״\x1b[0m
֑ ֒ ֓ ֔ ֕ ֖ ֗ ֘ ֙ ֚ ֛ ֜ ֝ ֞\x1b[33m ֟ ֠ ֡ ֣ ֤ ֥ ֦ ֧ ֨ ֩ ֪ ֫ ֬ ֭ ֮ ֯ ְ ֱ ֲ ֳ ִ ֵ ֶ ַ ָ ֹ ֻ ּ ֽ ־ ֿ ׀ ׁ ׂ ׃ ׄ א ב ג ד ה ו ז ח ט י ך כ לa\x1b[34m ם מ ן נ ס ע ף פ ץ צ ק ר ש ת װ ױ ײ ׳ ״\x1b[0m
Arabic
، ؛ ؟ ء آ أ ؤ إ ئ ا ب ة ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع\x1b[34m غ ـ ف ق ك ل م ن ه و ى ي ً ٌ ٍ َ ُ ِ ّ ْ ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٪ ٫ ٬ ٭ ٰ ٱ ٲ ٳ ٴ ٵ ٶ ٷ ٸ ٹ ٺ ٻ ټ ٽ پ ٿ ڀ ځ ڂ ڃ ڄ څ چ ڇ ڈ ډ ڊ ڋ ڌ ڍ ڎ ڏ ڐ ڑ ڒ ړ ڔ ڕ ږ ڗ ژ ڙ ښ ڛ ڜ ڝ ڞ ڟ ڠ ڡ ڢ ڣ ڤ ڥ ڦ \x1b[33mڧ ڨ ک ڪ ګ ڬ ڭ ڮ گ ڰ ڱ ...\x1b[0m
Devanagari
ँ ं ः अ आ इ ई उ ऊ ऋ ऌ ऍ ऎ ए ऐ ऑ ऒ ओ औ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न ऩ प \x1b[33mफ ब भ म य र ऱ ल ळ ऴ व श ष स ह ़ ऽ ा ि ी ु ू ृ ॄ ॅ ॆ े ै ॉ ॊ ो ौ ् ॐ ॑ ॒ ॓ ॔ क़ ख़ ग़ ज़\x1b[34m ड़ ढ़ फ़ य़ ॠ ॡ ॢ ॣ । ॥ ० १ २ ३ ४ ५ ६ ७ ८ ९ ॰\x1b[0m`;
            this.client.print(sample, true);
        };

        this.functions['testunicodeemoji'] = () => {
            let sample = '';
            //https://apps.timwhitlock.info/emoji/tables/unicode
            let emojiRange = [
                [0x1F601, 0x1F64F],//Emoticons ( 1F601 - 1F64F ) 
                [0x2702, 0x27B0], //Dingbats ( 2702 - 27B0 ) 
                [0x1F680, 0x1F6C0], //Transport and map symbols ( 1F680 - 1F6C0 ) 
                //[0x24C2, 0x1F251], //Enclosed characters ( 24C2 - 1F251 ) 
                [0x1F600, 0x1F636],  //Additional emoticons ( 1F600 - 1F636 )
                [0x1F681, 0x1F6C5], //Additional transport and map symbols ( 1F681 - 1F6C5 ) 
                [0x1F30D, 0x1F567] //Other additional symbols ( 1F30D - 1F567 ) 
            ];
            let n = 0;
            for (let i = 0; i < emojiRange.length; i++) {
                let range = emojiRange[i];
                for (let x = range[0]; x < range[1]; x++) {
                    sample += String.fromCodePoint(x);
                    n++;
                    if (n == 36) {
                        sample += '\n';
                        n = 0;
                    }
                }
                sample += '\x1B[4z<hr>';
                n = 0
            }
            let sample2 = '\x1B[4z<hr>' + `©®‼⁉#⃣8⃣9⃣7⃣0⃣6⃣5⃣4⃣3⃣2⃣1⃣™ℹ↔↕↖↗↘↙↩↪⌚⌛⏩⏪⏫⏬⏰⏳▪▫▶◀◻◼◽◾☀☁☎☑☔☕
☝☺♈♉♊♋♌♍♎♏♐♑♒♓♠♣♥♦♨♻♿⚓⚠⚡⚪⚫⚽⚾⛄⛅⛎⛔⛪⛲⛳⛵
⛺⛽⤴⤵⬅⬆⬇⬛⬜⭐⭕〰〽㊗㊙🀄🃏🌀🌁🌂🌃🌄🌅🌆🌇🌈🌉🌊🌋🌌🌏🌑🌓🌔🌕
🌙🌛🌟🌠🌰🌱🌴🌵🌷🌸🌹🌺🌻🌼🌽🌾🌿🍀🍁🍂🍃🍄🍅🍆🍇🍈🍉🍊🍌🍍🍎🍏🍑
🍒🍓🍔🍕🍖🍗🍘🍙🍚🍛🍜🍝🍞🍟🍠🍡🍢🍣🍤🍥🍦🍧🍨🍩🍪🍫🍬🍭🍮🍯🍰🍱🍲
🍳🍴🍵🍶🍷🍸🍹🍺🍻🎀🎁🎂🎃🎄🎅🎆🎇🎈🎉🎊🎋🎌🎍🎎🎏🎐🎑🎒🎓🎠🎡🎢🎣🎤
🎥🎦🎧🎨🎩🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄
🏆🏈🏊🏠🏡🏢🏣🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🐌🐍🐎🐑🐒🐔🐗🐘🐙🐚🐛🐜🐝
🐞🐟🐠🐡🐢🐣🐤🐥🐦🐧🐨🐩🐫🐬🐭🐮🐯🐰🐱🐲🐳🐴🐵🐶🐷🐸🐹🐺🐻🐼🐽🐾
👀👂👃👄👅👆👇👈👉👊👋👌👍👎👏👐👑👒👓👔👕👖👗👘👙👚👛👜👝👞👟👠👡👢
👣👤👦👧👨👩👪👫👮👯👰👱👲👳👴👵👶👷👸👹👺👻👼👽👾👿💀💁💂💃💄💅💆
💇💈💉💊💋💌💍💎💏💐💑💒💓💔💕💖💗💘💙💚💛💜💝💞💟💠💡💢💣💤💥💦💧
💨💩💪💫💬💮💯💰💱💲💳💴💵💸💹💺💻💼💽💾💿📀📁📂📃📄📅📆📇📈📉📊📋
📌📍📎📏📐📑📒📓📔📕📖📗📘📙📚📛📜📝📞📟📠📡📢📣📤📥📦📧📨📩📪📫📮📰
📱📲📳📴📶📷📹📺📻📼🔃🔊🔋🔌🔍🔎🔏🔐🔑🔒🔓🔔🔖🔗🔘🔙🔚🔛🔜🔝🔞🔟🔠
🔡🔢🔣🔤🔥🔦🔧🔨🔩🔪🔫🔮🔯🔰🔱🔲🔳🔴🔵🔶🔷🔸🔹🔺🔻🔼🔽🕐🕑🕒🕓🕔🕕
🕖🕗🕘🕙🕚🕛🗻🗼🗽🗾🗿`;
            this.client.print(sample, true);
            this.client.print(sample2, true);
        };

        this.functions['testlines'] = () => {
            const maxLines = this.client.display.maxLines;
            let sample = '';
            const id = this.client.display.model.getNextLineID;
            for (let h = 0; h < maxLines; h++)
                sample += `Line: ${h}, LineID: ${id + h}\n`;
            this.client.print(sample, true);
        };

        this.functions['testscreen'] = () => {
            let sample = 'Window innerWidth: ' + window.innerWidth;
            sample += '\nWindow innerHeight: ' + window.innerHeight;
            sample += '\nDocument clientWidth: ' + document.body.clientWidth;
            sample += '\nDocument clientHeight: ' + document.body.clientHeight;
            sample += '\nDisplay clientWidth: ' + this.client.display.container.clientWidth;
            sample += '\nDisplay clientHeight: ' + this.client.display.container.clientHeight;
            sample += '\nScreen orientation: ' + screen?.orientation?.type;
            this.client.print(sample, true);
        }
    }

    public remove(): void {
        if (!this.client) return;
        this.client.off('function', this._event);
    }

    public initialize(): void {
        if (!this.client) return;
        this.client.on('function', this._event);
    }
    get menu(): MenuItem[] {
        return [];
    }

    public get settings(): MenuItem[] {
        return [];
    }

    /**
     * Process function event to execute custom text functions
     * @param data {FunctionEvent} The data about the function to execute
     */
    private _processFunction(data: FunctionEvent) {
        let name;
        //const data = { name: fun, args: args, raw: raw, handled: false, return: null };
        if (!data) return;
        name = data.name.toLowerCase();
        //old name() format
        if (name.endsWith('()'))
            name = name.substring(0, name.length - 2);
        if (this.functions[name]) {
            console.time(name);
            this.functions[name].apply(this, [data || {}]);
            console.timeEnd(name);
            data.handled = true;
        }
    }
}