//import "../css/help.css";
import { Dialog } from "./dialog";
import { Splitter, Orientation, PanelAnchor } from "./splitter";
import { removeHash, updateHash } from "./interface";
import { buildBreadcrumb } from "./breadcrumb";

export class HelpDialog extends Dialog {
    constructor() {
        super(Object.assign({}, client.getOption('windows.help') || { center: true }, { title: '<i class="bi bi-question-circle"></i> Help', minWidth: 410 }));
        this.on('resized', e => {
            client.setOption('windows.help', e);
        });
        client.on('options-loaded', () => {
            this.resetState(client.getOption('windows.help') || { center: true });
        });
        this.on('closed', () => {
            client.setOption('windows.help', this.windowState);
            removeHash('help');
        });
        this.on('canceled', () => {
            client.setOption('windows.help', this.windowState);
            removeHash('help');
        });
        this.on('moved', e => {
            client.setOption('windows.help', e);
        })
        this.on('maximized', () => {
            client.setOption('windows.help', this.windowState);
        });
        this.on('restored', () => {
            client.setOption('windows.help', this.windowState);
        });
        this.on('shown', () => {
            client.setOption('windows.help', this.windowState);
        });        
    }
}