 - create chat plugin and use on('function') event to add custom chat commands
             client.sendChat = updateChat;
```
//spell-checker:ignore chatprompt chatp
case 'chatprompt':
case 'chatp':
    if ((this.client.getOption('echo') & 4) === 4)
        this.client.echo(raw, -3, -4, true, true);
    args = this.parseInline(args.join(' '));
    if ((<any>this.client).sendChat)
        (<any>this.client).sendChat(args);
    return null;
case 'chat':
case 'ch':
    if ((this.client.getOption('echo') & 4) === 4)
        this.client.echo(raw, -3, -4, true, true);
    args = this.parseInline(args.join(' ') + '\n');
    if ((<any>this.client).sendChat)
        (<any>this.client).sendChat(args);
    return null;
```
-Add on disconnect option and dialog

- New options
    - enableParsing - quick enabled triggered by interface?
    - enableTriggers - quick enabled triggered by interface?

```
//sample contextmenu
    client.display.on('contextmenu', e => {
        e.preventDefault();
        let menu = document.getElementById('context-menu');
        if (!menu) {
            document.body.insertAdjacentHTML('afterend', `<ul id="context-menu" class="dropdown-menu show">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item" href="#">Separated link</a></li>
                </ul>`);
            menu = document.getElementById('context-menu');
        }
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        menu.style.display = 'block';
        menu.style.position = 'absolute';
    });
```

- logger plugin and all related options
    - ensure add #window support by hooking the client events
    - hook set-title event and run oiMUDLogger.setLogCharacter('');
- backup plugin for shadowmud
- immortal tool plugin for shadowmud            
    - client.telnet.GMCPSupports.push('IED 1');
    - Add #win support if added
- A general shadowmud plugin that groups all sm related like backup and immortal tools?
    - Add help for sm mud if create a sm plugin
    - Add mail compose like jiMUD using advanced editor dialog as a base as exact same code but adds to/cc/subject fields and instead of sending directly it executes a set of commands to open mail and send contents
    - skip more prompt
    - skip more prompt delay
- Profile manager:
    - Add undo system
    - Add options for profile sort order and direction
    - Add option which profile to select on load
    - Add option to expand selected profile on load
    - Add search system
- status plugin
    - create skills dialog
    - add way to reset status width
- fix hidden windows
- Add settings to reset windows states to defaults
- recode advanced editor to not use jquery when possible
- Add paste special? may not be possible as cant control paste
- recode mapper import/export to use web workers
- Add help docs/help browser
- run firefox/chrome performance tools to optimize code/loading