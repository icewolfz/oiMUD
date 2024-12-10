declare let client;
declare let bootstrap;

import { showDialog, toggleButtons, doPasteSpecial } from './interface';
import { isPasteSupported, pasteText } from '../core/library';

export function closeMenu() {
    const instance = bootstrap.Offcanvas.getInstance(document.getElementById('clientMenu'));
    if (!instance) return
    instance.hide();
}

export function showMenu() {
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('clientMenu')).show();
}

export function initMenu() {
    var clientMenu = document.getElementById('clientMenu')
    clientMenu.addEventListener('hidden.bs.offcanvas', function () {
        client.commandInput.focus();
    });

    document.getElementById('btn-menu').addEventListener('click', showMenu);
    client.on('connected', () => {
        let el = document.getElementById('menu-connect');
        let text = document.querySelector('#menu-connect a span');
        let icon = document.querySelector('#menu-connect svg') || document.querySelector('#menu-connect i');
        el.title = 'Disconnect';
        el.classList.add('active');
        text.textContent = 'Disconnect';
        icon.classList.add('fa-plug-circle-xmark');
        icon.classList.remove('fa-plug');
    });
    client.on('closed', () => {
        let el = document.getElementById('menu-connect');
        let text = document.querySelector('#menu-connect a span');
        let icon = document.querySelector('#menu-connect svg') || document.querySelector('#menu-connect i');
        el.title = 'Connect';
        el.classList.remove('active');
        text.textContent = 'Connect';
        icon.classList.remove('fa-plug-circle-xmark');
        icon.classList.add('fa-plug');
    })
    client.on('scroll-lock', updateScrollLock);
    document.querySelector('#menu-connect a').addEventListener('click', e => {
        if (client.connected)
            client.close();
        else {
            client.connect();
            closeMenu();
        }
    });
    document.querySelector('#menu-clear a').addEventListener('click', e => {
        client.clear();
        closeMenu()
    });
    document.querySelector('#menu-lock a').addEventListener('click', e => {
        client.toggleScrollLock();
        closeMenu();
    });
    document.querySelector('#menu-editor a').addEventListener('click', e => {
        closeMenu();
        document.getElementById('btn-adv-editor').click();
    });
    document.querySelector('#menu-about a').addEventListener('click', e => {
        showDialog('about');
        closeMenu();
    });
    document.querySelector('#menu-settings a').addEventListener('click', e => {
        showDialog('settings');
        closeMenu();
    });
    document.querySelector('#menu-profiles a').addEventListener('click', e => {
        showDialog('profiles');
        closeMenu();
    });
    document.querySelector('#menu-help a').addEventListener('click', e => {
        showDialog('help');
        closeMenu();
    });
    document.querySelector('#menu-fullscreen a').addEventListener('click', e => {
        let doc: any = window.document;
        let docEl: any = doc.documentElement;

        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        let el = document.getElementById('menu-fullscreen');
        let icon = document.querySelector('#menu-fullscreen svg') || document.querySelector('#menu-fullscreen i');
        let text = document.querySelector('#menu-fullscreen a span');
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            el.title = 'Exit fullscreen';
            text.textContent = 'Exit fullscreen';
            requestFullScreen.call(docEl);
            icon.classList.add('fa-minimize');
            icon.classList.remove('fa-maximize');
        }
        else {
            el.title = 'Enter fullscreen';
            text.textContent = 'Enter fullscreen';
            cancelFullScreen.call(doc);
            icon.classList.add('fa-maximize');
            icon.classList.remove('fa-minimize');
        }
        closeMenu();
    });
    document.querySelector('#menu-buttons a').addEventListener('click', e => {
        toggleButtons();
        let button = document.querySelector('#menu-buttons') as HTMLElement;
        if (client.getOption('showButtons')) {
            button.title = 'Hide buttons';
            button.classList.add('active');
            document.querySelector('#menu-buttons a span').textContent = 'Hide buttons';
        }
        else {
            button.title = 'Show buttons';
            button.classList.remove('active');
            document.querySelector('#menu-buttons a span').textContent = 'Show buttons';
        }
        closeMenu();
    });
    document.querySelector('#menu-paste a').addEventListener('click', e => {
        if (isPasteSupported())
            pasteText().then(doPasteSpecial);
        else {
            document.querySelector('#menu-paste').classList.toggle('active');
            client.commandInput.focus();
        }
        closeMenu();
    })
    updateScrollLock();

    let pl = client.plugins.length;
    let s;
    let sl;
    const list = document.querySelector('#clientMenu ul')
    for (let p = 0; p < pl; p++) {
        if (!client.plugins[p].menu) continue;
        if (client.plugins[p].menu.length) {
            sl = client.plugins[p].menu.length;
            for (s = 0; s < sl; s++) {
                let item = client.plugins[p].menu[s];
                let code;
                let id = 'menu-' + (item.id || item.name || s).trim().toLowerCase().replace(/ /g, '-');
                if (item.name === '-')
                    code = `<li id="${id}"${item.hidden ? ' style=" display:none;visibility:hiddem"' : ''}><hr class="dropdown-divider"></li>`;
                else if (typeof item.action === 'string')
                    code = `<li id="${id}"${item.hidden ? ' style=" display:none;visibility:hiddem"' : ''} class="nav-item${item.active ? ' active' : ''}" title="${item.name || ''}"><a class="nav-link" href="#${item.action}">${item.icon || ''}<span>${item.name || ''}</span></a></li>`;
                else
                    code = `<li id="${id}"${item.hidden ? ' style=" display:none;visibility:hiddem"' : ''} class="nav-item${item.active ? ' active' : ''}" title="${item.name || ''}"><a class="nav-link" href="javascript:void(0)">${item.icon || ''}<span>${item.name || ''}</span></a></li>`;
                if (item.exists && list.querySelector(item.exists)) continue;
                if ('position' in item) {
                    if (typeof item.position === 'string') {
                        if (list.querySelector(item.position))
                            list.querySelector(item.position).insertAdjacentHTML('afterend', code);
                    }
                    else if (item.position < 0 || item.position >= 0) {
                        let pos = item.position;
                        if (pos >= list.children.length)
                            pos = list.children.length - 1;
                        else if (pos < 0)
                            pos = list.children.length + item.position;
                        if (pos < 0) pos = 0;
                        if (pos < list.children.length)
                            list.children[pos].insertAdjacentHTML('afterend', code);
                    }
                    else
                        list.insertAdjacentHTML('beforeend', code);
                }
                else
                    list.insertAdjacentHTML('beforeend', code);
                if (item.name === '-') continue;
                if (typeof item.action === 'function' && document.querySelector(`#${id} a`))
                    document.querySelector(`#${id} a`).addEventListener('click', e => {
                        const ie = { client: client, preventDefault: false };
                        item.action(ie);
                        if (ie.preventDefault) return;
                        closeMenu();
                    });
            }
        }
    }
    let button = document.querySelector('#menu-buttons') as HTMLElement;
    if (client.getOption('showButtons')) {
        button.title = 'Hide buttons';
        button.classList.add('active');
        document.querySelector('#menu-buttons a span').textContent = 'Hide buttons';
    }
    else {
        button.title = 'Show buttons';
        button.classList.remove('active');
        document.querySelector('#menu-buttons a span').textContent = 'Show buttons';
    }
}

function updateScrollLock() {
    let el = document.getElementById('menu-lock');
    let text = document.querySelector('#menu-lock a span');
    let icon = document.querySelector('#menu-lock svg') || document.querySelector('#menu-lock i');
    if (client.scrollLock) {
        el.title = 'Unlock display';
        el.classList.add('active');
        text.textContent = 'Unlock display';
        icon.classList.add('fa-unlock');
        icon.classList.remove('fa-lock');
    }
    else {
        el.title = 'Lock display';
        el.classList.remove('active');
        text.textContent = 'Lock display';
        icon.classList.remove('fa-unlock');
        icon.classList.add('fa-lock');
    }
}
