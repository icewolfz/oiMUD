declare let client;
declare let bootstrap;

export function closeMenu() {
    bootstrap.Offcanvas.getInstance(document.getElementById('clientMenu')).hide();        
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
        document.getElementById('btn-adv-edit').click();        
    });        
    updateScrollLock();
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