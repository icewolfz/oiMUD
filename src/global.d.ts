/*
interface Object {
	toType(obj: any): string;
}
*/
//spellchecker:disable
interface CanvasRenderingContext2D {
	fillRoundedRect(x: number, y: number, w: number, h: number, r: number): void;
	strokeRoundedRect(x: number, y: number, w: number, h: number, r: number): void;
}

interface String {
	splice(idx: number, s: string, rem?: number): string;
	padStart(paddingvalue: (string | number)): string;
	padEnd(paddingvalue: (string | number)): string;
	splitQuote(sep: string, type?, escape?): string[];
	replaceAll(pattern, replacement);
}

interface Event {
	gamepad: any;
}

declare let DEBUG: boolean;
declare let TEST: boolean;
declare let TINYMCE: boolean;
declare let tinymce;

declare let $selected: string;
declare let $character: string;
declare let $selectedurl: string;
declare let $selectedline: string;
declare let $selectedword: string;
declare let $selurl: string;
declare let $selline: string;
declare let $selword: string;
declare let $copied: string;
declare let $action: string;
declare let $trigger: string;
declare let $caption: string;
declare let $characterid: number;

interface JQuery {
	treeview: any;
	selectpicker: any;
	hasHorizontalScrollBar: any;
}

interface Window {
	i: any;
	repeatnum: any;
	$copied: string;
	$character: string;
	ResizeObserver: ResizeObserver;
	UTF8;
	fileSaveAs;
	BlobBuilder;
	WebKitBlobBuilder;
	MozBlobBuilder;
	MSBlobBuilder;
	mozURL;
	msURL;
	saveAs;
	webkitSaveAs;
	mozSaveAs;
	msSaveAs;
}

interface Navigator {
	saveBlob;
	msSaveBlob;
	mozSaveBlob;
	webkitSaveBlob;
}

interface CanvasRenderingContext2D {
	webkitImageSmoothingEnabled: boolean;
	mozImageSmoothingEnabled: boolean;
}