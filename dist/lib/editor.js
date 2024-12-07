(() => {
  // src/editor.ts
  var CodeEditor = class {
    constructor(textarea, options) {
      if (!textarea)
        throw new Error("Container must be a selector, element, jquery object or display options");
      if (typeof textarea === "string") {
        textarea = document.querySelector(textarea);
        if (!textarea)
          throw new Error("Invalid selector for display.");
        this.textarea = textarea;
      } else if (textarea instanceof $)
        this.textarea = textarea[0];
      else if (textarea instanceof HTMLTextAreaElement)
        this.textarea = textarea;
      else if (textarea.ownerDocument.defaultView && textarea instanceof textarea.ownerDocument.defaultView.HTMLTextAreaElement)
        this.textarea = textarea;
      else
        throw new Error("Textarea must be a selector, element or jquery object");
      this._options = Object.assign({
        inline: true,
        block: true,
        inlineStr: ["/", "/"],
        blockStr: ["/", "*"],
        parameter: "%",
        nParameter: "$",
        command: "#",
        stacking: ";",
        speed: "!",
        verbatim: "`"
      }, options || {});
    }
    get textarea() {
      return this._textarea;
    }
    set textarea(textarea) {
      if (this._textarea) {
        this._textarea.style.display = "";
        if (this._editor)
          this.destroy();
      }
      this._textarea = textarea;
      this._textarea.editor = this;
      this._textarea.style.display = "none";
      this._container = document.createElement("pre");
      this._container.id = this._textarea.id + "-editor";
      this._container.classList.add("editor", "form-control");
      this._textarea.insertAdjacentElement("afterend", this._container);
      ace.require("ace/ext/language_tools");
      ace.require("ace/ext/spellcheck");
      this._editor = ace.edit(this._container.id);
      const session = this._editor.getSession();
      this._editor.$blockScrolling = Infinity;
      if (!this._aceTooltip) {
        const Tooltip = ace.require("ace/tooltip").Tooltip;
        this._aceTooltip = new Tooltip($("#content")[0]);
      }
      this._editor.setTheme("ace/theme/visual_studio");
      session.setMode("ace/mode/text");
      session.setUseSoftTabs(true);
      session.setValue(this._textarea.value);
      this._editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        newLineMode: "unix",
        tabSize: 3
      });
      this._editor.commands.addCommand({
        name: "expand all folds",
        bindKey: { win: "Ctrl-Shift-+", mac: "Command-Option-+" },
        exec: (editor) => {
          editor.getSession().unfold();
        }
      });
      this._editor.commands.addCommand({
        name: "collapse all folds",
        bindKey: { win: "Ctrl-Shift--", mac: "Command-Option--" },
        exec: (editor) => {
          editor.getSession().foldAll();
        }
      });
      session.on("change", (e) => {
        const value = session.getValue();
        if (this._textarea.value !== value) {
          this._textarea.value = value;
          const event = new Event("input", { bubbles: true });
          this._textarea.dispatchEvent(event);
        }
      });
      session.on("changeFold", () => {
        this._aceTooltip.hide();
      });
      this._editor.on("mousemove", (e) => {
        const pos = e.getDocumentPosition();
        const fold = e.editor.getSession().getFoldAt(pos.row, pos.column, 1);
        if (fold) {
          let t = e.editor.getSession().getDocument().getTextRange(fold.range).replace(/^\n+|\s+$/g, "");
          const s = t.split(/\n/);
          if (s.length > 10) {
            t = s.slice(0, 10).join("\n").replace(/\s+$/g, "") + "\n...";
          }
          const h = $(window).height();
          const th = this._aceTooltip.getHeight();
          const x = e.clientX + 32;
          let y = e.clientY;
          if (y + th > h)
            y = y - th;
          this._aceTooltip.show(t, x, y);
          e.stop();
        } else {
          this._aceTooltip.hide();
        }
      });
    }
    get options() {
      return this._options;
    }
    set options(value) {
      this._options = Object.assign({
        inline: true,
        block: true,
        inlineStr: ["/", "/"],
        blockStr: ["/", "*"],
        parameter: "%",
        nParameter: "$",
        command: "#",
        stacking: ";",
        speed: "!",
        verbatim: "`"
      }, value || {});
      if (this._editor.getSession().getMode().$id === "ace/mode/oimud" || this._editor.getSession().$modeId === "ace/mode/oimud")
        this.setParseSyntax();
    }
    setParseSyntax() {
      this._editor.getSession().setMode("ace/mode/oimud", () => {
        var session = this._editor.getSession();
        if (!session.$mode) return;
        var rules = session.$mode.$highlightRules.getRules();
        if (Object.prototype.hasOwnProperty.call(rules, "start")) {
          var b = rules["start"].pop();
          if (!this._options.inline) {
            rules["start"].pop();
            rules["start"].pop();
          } else {
            if (this._options.inlineStr.length === 1) {
              rules["start"][rules["start"].length - 2].regex = `\\${this._options.inlineStr[0]}$`;
              rules["start"][rules["start"].length - 1].regex = `\\${this._options.inlineStr[0]}`;
            } else {
              rules["start"][rules["start"].length - 2].regex = `\\${this._options.inlineStr[0]}\\${this._options.inlineStr[1]}$`;
              rules["start"][rules["start"].length - 1].regex = `\\${this._options.inlineStr[0]}\\${this._options.inlineStr[1]}`;
            }
          }
          if (this._options.block) {
            if (this._options.inlineStr.length === 1)
              b.regex = `\\${this._options.blockStr[0]}`;
            else
              b.regex = `\\${this._options.blockStr[0]}\\${this._options.blockStr[1]}`;
            rules["start"].push(b);
          }
          rules["start"][3].token = this._options.stacking;
          rules["start"][3].regex = this._options.stacking;
          rules["start"][5].regex = this._options.parameter + rules["start"][5].regex.substr(1);
          rules["start"][6].regex = this._options.parameter + rules["start"][6].regex.substr(1);
          rules["start"][7].regex = this._options.parameter + rules["start"][7].regex.substr(1);
          rules["start"][8].regex = "\\" + this._options.nParameter + rules["start"][8].regex.substr(2);
          rules["start"][9].regex = "[" + this._options.parameter + this._options.nParameter + "]\\*";
          rules["start"][10].regex = "[" + this._options.parameter + this._options.nParameter + "]{\\*}";
          rules["start"][11].regex = this._options.command + rules["start"][11].regex.substr(1);
          rules["start"][12].regex = "^" + this._options.command + rules["start"][12].regex.substr(2);
          rules["start"][12].splitRegex = new RegExp(rules["start"][12].regex);
          rules["start"][13].regex = "^" + this._options.verbatim + ".*$";
          rules["start"][14].regex = "^" + this._options.speed + ".*$";
          rules["start"][15].regex = "[" + this._options.parameter + this._options.nParameter + rules["start"][15].regex.substr(3);
          rules["start"][15].splitRegex = new RegExp(rules["start"][15].regex);
          rules["start"][16].regex = "[" + this._options.parameter + this._options.nParameter + rules["start"][16].regex.substr(3);
          rules["start"][16].splitRegex = new RegExp(rules["start"][16].regex);
          rules["start"][17].regex = "[" + this._options.parameter + this._options.nParameter + rules["start"][17].regex.substr(3);
          rules["start"][17].splitRegex = new RegExp(rules["start"][17].regex);
        }
        if (Object.prototype.hasOwnProperty.call(rules, "stacking")) {
          rules["stacking"][0].regex = this._options.command + rules["stacking"][0].regex.substr(1);
          rules["stacking"][0].splitRegex = new RegExp(rules["stacking"][0].regex);
          rules["stacking"][1].regex = this._options.command + rules["stacking"][1].regex.substr(1);
          rules["stacking"][2].regex = this._options.verbatim + ".*$";
          rules["stacking"][3].regex = this._options.speed + ".*$";
        }
        if (Object.prototype.hasOwnProperty.call(rules, "bracket")) {
          rules["bracket"][0].regex = "\\s*?" + this._options.command + rules["bracket"][0].regex.substr(5);
          rules["bracket"][0].splitRegex = new RegExp(rules["bracket"][0].regex);
          rules["bracket"][3].regex = this._options.verbatim + ".*$";
          rules["bracket"][4].regex = this._options.speed + ".*$";
          rules["bracket"][6].regex = this._options.command + rules["bracket"][6].regex.substr(1);
        }
        if (this._options.block && Object.prototype.hasOwnProperty.call(rules, "comment")) {
          if (this._options.blockStr.length === 1)
            rules["comment"][0].regex = `\\${this._options.blockStr[0]}`;
          else
            rules["comment"][0].regex = `\\${this._options.blockStr[1]}\\${this._options.blockStr[0]}`;
        }
        session.$mode.$tokenizer = null;
        session.bgTokenizer.setTokenizer(session.$mode.getTokenizer());
        session.bgTokenizer.start(0);
      });
    }
    setLanguage(mode) {
      mode = (mode || "").toLowerCase();
      if (mode === "javascript" || mode === "js")
        this._editor.getSession().setMode("ace/mode/javascript");
      else if (mode === "oimud" || mode === "script")
        this.setParseSyntax();
      else
        this._editor.getSession().setMode("ace/mode/text");
    }
    get value() {
      return this._editor.getSession().getValue();
    }
    set value(value) {
      this._editor.getSession().setValue(value);
    }
    focus() {
      this._editor.focus();
    }
    resize() {
      this._editor.resize(true);
    }
    destroy() {
      this._editor.destroy();
      this._container.remove();
      this._textarea.style.display = "";
      delete this._textarea.editor;
    }
  };
  window.CodeEditor = CodeEditor;
})();
