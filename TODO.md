 - create chat plugin and use on('function') event to add custom chat commnads
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
- mapper plugin and all related options
- backup plugin for shadowmud
- immortal tool plugin for shadowmud
- Profile manager:
    - Add undo system
    - Add options for profile sort order and direction
    - Add option which profile to select on load
    - Add option to expand selected profile on load
- status plugin and related and move all lag meter to here
- skip more prompt
- skip more prompt delay
- fix hidden windows
- recode advanced editor to not use jquery when possible






