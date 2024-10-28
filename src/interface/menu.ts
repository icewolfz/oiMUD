declare let client;
declare let bootstrap;

import { showDialog } from "./interface";

export function closeMenu() {
    const instance = bootstrap.Offcanvas.getInstance(document.getElementById('clientMenu'));
    if (!instance) return
    instance.hide();
}

export function showMenu() {
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('clientMenu')).show();
}

export function initMenu() {
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
    document.querySelector('#menu-fullscreen a').addEventListener('click', e => {
        var doc: any = window.document;
        var docEl: any = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
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
    updateScrollLock();

    let pl = client.plugins.length;
    let s;
    let sl;
    const list = document.querySelector('#clientMenu ul')
    for (let p = 0; p < pl; p++) {
        if (!client.plugins[p].settings) continue;
        if (client.plugins[p].settings.length) {
            sl = client.plugins[p].settings.length;
            for (s = 0; s < sl; s++) {
                let item = client.plugins[p].settings[s];
                let code;
                let id = 'menu-' + (item.name || '').toLowerCase().replace(/ /g, '-');
                if(item.name === '-')
                    code = '<li><hr class="dropdown-divider"></li>';
                else if (typeof item.action === 'string')
                    code = `<li id="menu-${id}" class="nav-item" title="${item.name || ''}"><a class="nav-link" href="#${item.action}">${item.icon || ''}${item.name || ''}</i><span>${item.name || ''}</span></a></li>`;
                else
                    code = `<li id="menu-${id}" class="nav-item" title="${item.name || ''}"><a class="nav-link" href="javascript:void(0)">${item.icon || ''}${item.name || ''}<span>${item.name || ''}</span></a></li>`;
                if ('position' in item) {
                    if (typeof item.position === 'string') {
                        if (list.querySelector(item.position)) {
                            list.querySelector(item.position).insertAdjacentHTML('afterend', code);
                            continue;
                        }
                    }
                    else if (item.position >= 0 && item.position < list.children.length) {
                        list.children[item.position].insertAdjacentHTML('afterend', code);
                        continue;
                    }
                }
                list.insertAdjacentHTML('beforeend', code);
                if(item.name === '-') continue;
                if (typeof item.action === 'function')
                    document.querySelector(`#${id} a`).addEventListener('click', e => {
                        const ie = { client: client, preventDefault: false };
                        item.action(ie);
                        if (ie.preventDefault) return;
                        closeMenu();
                    });
            }
        }
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