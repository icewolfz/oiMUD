import { EditorState, Compartment } from '@codemirror/state';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { indentWithTab, history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { foldGutter, indentOnInput, indentUnit, bracketMatching, foldKeymap, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, rectangularSelection, crosshairCursor, highlightActiveLine, keymap, EditorView, dropCursor } from '@codemirror/view';
import { lintKeymap } from "@codemirror/lint"

import { javascript } from "@codemirror/lang-javascript"
import { oiMUD } from './editor/language'

declare global {
    interface Window {
        CodeEditor;
    }
}

export class CodeEditor {
    private _textarea;
    private _languageConf = new Compartment();
    private _historyCompartment = new Compartment();
    private _container: HTMLDivElement;

    public view;
    public get textarea() {
        return this._textarea;
    }
    public set textarea(textarea) {
        if (this._textarea) {
            this._textarea.style.display = '';
            this._container.remove();
            if (this.view)
                this.destroy();
        }
        this._textarea = textarea;
        textarea.editor = this;
        let extensions = [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            foldGutter({
                markerDOM: open => {
                    let icon = document.createElement('span');
                    icon.className = open ? 'bi bi-chevron-down' : 'bi bi-chevron-right';
                    return icon;
                },
            }),
            drawSelection(),
            indentUnit.of("    "),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap,
                indentWithTab,
            ]),
            this._languageConf.of([]),
            this._historyCompartment.of(history())
        ];
        //, EditorView.editorAttributes.of({ class: "form-control" })
        extensions.push(EditorView.updateListener.of(function (e) {
            if (e.docChanged) {
                const value = e.state.doc.toString();
                if (value !== textarea.value) {
                    textarea.value = e.state.doc.toString();
                    const event = new Event('input', { bubbles: true });
                    textarea.dispatchEvent(event);
                }
            }
        }));
        this._container = document.createElement('div');
        this._container.classList.add('form-control', 'editor-container');
        this._container.id = textarea.id + '-editor';
        textarea.parentNode.appendChild(this._container);
        this.view = new EditorView({
            doc: textarea.value,
            extensions,
            parent: this._container
        });
        textarea.style.display = "none";
    }

    constructor(textarea) {
        this.textarea = textarea;
    }

    public clearHistory() {
        this.view.dispatch({ effects: this._historyCompartment.reconfigure([]) });
        this.view.dispatch({ effects: this._historyCompartment.reconfigure([history()]) });
    }

    public setContents(contents) {
        this.view.dispatch({
            changes: {
                from: 0,
                to: this.view.state.doc.length,
                insert: contents || ''
            }
        });
        this.clearHistory();
    }

    public setLanguage(lang?) {
        if (lang === 'js' || lang === 'javascript')
            this.view.dispatch({ effects: this._languageConf.reconfigure(javascript()) })
        else if (lang === 'oiMUD')
            this.view.dispatch({ effects: this._languageConf.reconfigure(oiMUD()) });
        else
            this.view.dispatch({ effects: this._languageConf.reconfigure([]) });
    }

    public destroy() {
        this.view.destroy();
    }
}
window.CodeEditor = CodeEditor;

// document.querySelector('.cm-editor').querySelector('.cm-content').cmView.view