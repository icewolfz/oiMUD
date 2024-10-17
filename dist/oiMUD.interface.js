(() => {
  // src/interface/menu.ts
  function closeMenu() {
    bootstrap.Offcanvas.getInstance(document.getElementById("clientMenu")).hide();
  }
  function showMenu() {
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("clientMenu")).show();
  }
  function initMenu() {
    document.getElementById("btn-menu").addEventListener("click", showMenu);
    client.on("connected", () => {
      let el = document.getElementById("menu-connect");
      let text = document.querySelector("#menu-connect a span");
      let icon = document.querySelector("#menu-connect svg") || document.querySelector("#menu-connect i");
      el.title = "Disconnect";
      el.classList.add("active");
      text.textContent = "Disconnect";
      icon.classList.add("fa-plug-circle-xmark");
      icon.classList.remove("fa-plug");
    });
    client.on("closed", () => {
      let el = document.getElementById("menu-connect");
      let text = document.querySelector("#menu-connect a span");
      let icon = document.querySelector("#menu-connect svg") || document.querySelector("#menu-connect i");
      el.title = "Connect";
      el.classList.remove("active");
      text.textContent = "Connect";
      icon.classList.remove("fa-plug-circle-xmark");
      icon.classList.add("fa-plug");
    });
    client.on("scroll-lock", updateScrollLock);
    document.querySelector("#menu-connect a").addEventListener("click", (e) => {
      if (client.connected)
        client.close();
      else {
        client.connect();
        closeMenu();
      }
    });
    document.querySelector("#menu-clear a").addEventListener("click", (e) => {
      client.clear();
      closeMenu();
    });
    document.querySelector("#menu-lock a").addEventListener("click", (e) => {
      client.toggleScrollLock();
      closeMenu();
    });
    document.querySelector("#menu-editor a").addEventListener("click", (e) => {
      closeMenu();
      document.getElementById("btn-adv-edit").click();
    });
    updateScrollLock();
  }
  function updateScrollLock() {
    let el = document.getElementById("menu-lock");
    let text = document.querySelector("#menu-lock a span");
    let icon = document.querySelector("#menu-lock svg") || document.querySelector("#menu-lock i");
    if (client.scrollLock) {
      el.title = "Unlock display";
      el.classList.add("active");
      text.textContent = "Unlock display";
      icon.classList.add("fa-unlock");
      icon.classList.remove("fa-lock");
    } else {
      el.title = "Lock display";
      el.classList.remove("active");
      text.textContent = "Lock display";
      icon.classList.remove("fa-unlock");
      icon.classList.add("fa-lock");
    }
  }

  // src/events.ts
  var EventEmitter = class {
    #events = {};
    bind(type, listener) {
      if (!Array.isArray(this.#events[type]) || typeof this.#events[type] === "undefined")
        this.#events[type] = [];
      this.#events[type].push(listener);
    }
    on(type, listener) {
      this.bind(type, listener);
    }
    addEventListener(type, listener) {
      this.bind(type, listener);
    }
    fire(type, args, caller) {
      if (!type || typeof type !== "string")
        throw new Error("Event missing.");
      if (!Array.isArray(this.#events[type])) return;
      if (!args || args === null || typeof args === "undefined")
        args = [];
      else if (!Array.isArray(args))
        args = [args];
      caller = caller || this;
      var events = this.#events[type];
      for (var i = 0, len = events.length; i < len; i++)
        events[i].apply(caller, args);
    }
    emit(type, ...args) {
      this.fire(type, args);
    }
    dispatchEvent(type, args, caller) {
      this.fire(type, args, caller);
    }
    unbind(type, listener) {
      if (!type || !listener) return;
      if (!Array.isArray(this.#events[type])) return;
      const events = this.#events[type];
      for (let i = 0, len = events.length; i < len; i++) {
        if (events[i] === listener) {
          events.splice(i, 1);
          break;
        }
      }
    }
    remove(type, listener) {
      this.unbind(type, listener);
    }
    off(type, listener) {
      this.unbind(type, listener);
    }
    removeListener(type, listener) {
      this.unbind(type, listener);
    }
    removeAllListeners(type) {
      if (!type) {
        this.#events = [];
        return;
      }
      if (!Array.isArray(this.#events[type])) return;
      delete this.#events[type];
    }
    listeners(type) {
      if (!type) return this.#events;
      return this.#events[type] || [];
    }
  };

  // src/library.ts
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
      var len = this.length >>> 0;
      if (typeof fun != "function") {
        throw new TypeError();
      }
      ``;
      var res = [];
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in this) {
          var val = this[i];
          if (fun.call(thisp, val, i, this)) {
            res.push(val);
          }
        }
      }
      return res;
    };
  }
  var _edCache = document.createElement("div");
  function htmlEncode(value) {
    _edCache.textContent = value;
    return _edCache.innerHTML;
  }
  var StringBuffer = class {
    constructor(str) {
      //public rawbuffer: string[];
      this.length = 0;
      if (typeof str == "string" && str.length > 0)
        this.buffer = [str];
      else
        this.buffer = [];
      this.length = 0;
    }
    prepend(string) {
      this.buffer.unshift(string);
      this.length += string.length;
      return this;
    }
    append(string) {
      this.buffer.push(string);
      this.length += string.length;
      return this;
    }
    push(string) {
      if (typeof string === "number")
        this.appendCode(string);
      else
        this.append(string);
    }
    appendCode(b) {
      this.buffer.push(String.fromCharCode(b));
      this.length++;
      return this;
    }
    toString() {
      return this.buffer.join("");
    }
    clear(str) {
      this.buffer = [];
      this.length = 0;
      if (str && typeof str != "undefined" && str.length) {
        this.buffer.push(str);
        this.length = str.length;
      }
      return this;
    }
    concat(arr) {
      this.buffer = this.buffer.concat(arr);
    }
  };
  (function($2) {
    $2.fn.hasHorizontalScrollBar = function() {
      return $2(this)[0].scrollWidth > $2(this).innerWidth();
    };
  })(jQuery);
  CanvasRenderingContext2D.prototype.fillRoundedRect = function(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    this.fill();
  };
  CanvasRenderingContext2D.prototype.strokeRoundedRect = function(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    this.stroke();
  };
  if (!Object.keys) Object.keys = function(o) {
    if (o !== Object(o))
      throw new TypeError("Object.keys called on a non-object");
    var k = [], p;
    for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
    return k;
  };
  if (!Object.toType) Object.toType = function(obj) {
    return {}.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  };
  if (typeof String.prototype.startsWith != "function") {
    String.prototype.startsWith = function(str) {
      return this.slice(0, str.length) == str;
    };
  }
  if (typeof String.prototype.endsWith != "function") {
    String.prototype.endsWith = function(str) {
      return this.slice(-str.length) == str;
    };
  }
  if (typeof String.prototype.splice !== "function") {
    String.prototype.splice = function(idx, s, rem) {
      if (typeof rem === "undefined") rem = 0;
      return this.slice(0, idx) + s + this.slice(idx + Math.abs(rem));
    };
  }
  if (typeof String.prototype.padStart !== "function") {
    String.prototype.padStart = function(paddingValue) {
      if (typeof paddingValue === "number")
        paddingValue = " ".repeat(paddingValue);
      return String(paddingValue + this).slice(-paddingValue.length);
    };
  }
  if (typeof String.prototype.padEnd !== "function") {
    String.prototype.padEnd = function(paddingValue) {
      if (typeof paddingValue === "number") {
        if (paddingValue <= this.length) return this;
        paddingValue = " ".repeat(paddingValue - this.length);
        return this + paddingValue;
      }
      if (paddingValue.length <= this.length) return this;
      return this + paddingValue.slice(-this.length);
    };
  }
  if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(str, newStr) {
      if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
        return this.replace(str, newStr);
      }
      return this.replace(new RegExp(str, "g"), newStr);
    };
  }
  if (typeof Uint8Array.prototype.charAt != "function") {
    Uint8Array.prototype.charAt = function(idx) {
      return String.fromCharCode(this[idx]);
    };
  }
  if (typeof Uint8Array.prototype.charCodeAt != "function") {
    Uint8Array.prototype.charCodeAt = function(idx) {
      return this[idx];
    };
  }
  function addSlashes(string, all) {
    if (!string || !string.length) return string;
    if (all)
      return string.replace(/\\/g, "\\\\").replace(/\u0008/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\u0000/g, "\\0");
    return string.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"');
  }
  String.prototype.addSlashes = function() {
    return addSlashes(this);
  };
  String.prototype.splitQuote = function(sep, type, escape2, escapeChar) {
    if (this.length === 0)
      return [];
    if (!sep || !sep.length)
      return [this];
    if (!type) type = 1 | 2;
    if (!escape2) escape2 = 1 | 2;
    if (!escapeChar) escapeChar = "\\";
    let quote = false;
    let sQuote = false;
    const str = [];
    let pS = 0;
    let s = 0;
    let c;
    let pC = "";
    let sp;
    const spl = sep.length;
    let spC;
    const tl = this.length;
    for (; s < tl; s++) {
      c = this.charAt(s);
      if (c === '"' && (type & 2) === 2) {
        if ((escape2 & 2) === 2) {
          if (s === 0 || pC !== escapeChar)
            quote = !quote;
        } else
          quote = !quote;
      } else if (c === "'" && (type & 1) === 1) {
        if ((escape2 & 1) === 1) {
          if (s === 0 || pC !== escapeChar)
            sQuote = !sQuote;
        } else
          sQuote = !sQuote;
      } else if (!quote && !sQuote) {
        for (sp = 0; sp < spl; sp++) {
          spC = sep.charAt(sp);
          if (c === spC) {
            if (s > pS || s === 0) {
              str.push(this.substr(pS, s - pS));
              pS = s + 1;
              break;
            } else if (s === pS) {
              str.push("");
              pS = s + 1;
              break;
            } else if (s === tl - 1)
              str.push("");
          }
        }
      }
      pC = c;
    }
    if (s === tl && s === pS && sep.indexOf(pC) !== -1) {
      str.push("");
      pS = s + 1;
    }
    if (s > pS)
      str.push(this.substr(pS, s - pS));
    return str;
  };
  var _colorCodes;
  function pinkfishToHTML(text) {
    text = text || "";
    text = text.split("%^");
    if (!_colorCodes)
      loadColors();
    const stack = [];
    let codes = [];
    let t = 0;
    let tl = text.length;
    let bold = false;
    let boldNest = false;
    let classes = [];
    for (; t < tl; t++) {
      switch (text[t]) {
        case "ITALIC":
          stack.push("<em>");
          codes.push("</em>");
          break;
        case "UNDERLINE":
          classes.push("underline");
          break;
        case "STRIKEOUT":
          classes.push("strikeout");
          break;
        case "DBLUNDERLINE":
          classes.push("dblunderline");
          break;
        case "OVERLINE":
          classes.push("overline");
          break;
        case "FLASH":
          classes.push("noflash");
          break;
        case "REVERSE":
          classes.push("reverse");
          break;
        case "RESET":
        case "DEFAULT":
          const cl = codes.length;
          for (let c = 0; c < cl; c++)
            stack.push(codes[c]);
          codes = [];
          classes = [];
          break;
        case "BOLD":
          bold = true;
          break;
        case "":
          break;
        default:
          if (text[t].startsWith("B_")) {
            text[t] = text[t].substr(2);
            if (bold) {
              stack.push('<span style="border: inherit;text-decoration:inherit;color: #' + _colorCodes["BOLD%^%^WHITE"] + '">');
              codes.push("</span>");
            }
            stack.push('<span style="border: inherit;text-decoration:inherit;background-color: #' + _colorCodes[text[t]] + '">');
            codes.push("</span>");
            bold = false;
            continue;
          } else if (_colorCodes[text[t]]) {
            if (bold && !_colorCodes["BOLD%^%^" + text[t]]) {
              stack.push('<span style="border: inherit;text-decoration:inherit;color: #' + _colorCodes["BOLD%^%^WHITE"] + '">');
              codes.push("</span>");
              boldNest = true;
            } else if (bold) {
              stack.push('<span style="border: inherit;text-decoration:inherit;color: #' + _colorCodes["BOLD%^%^" + text[t]] + '">');
              codes.push("</span>");
              boldNest = true;
              continue;
            }
            stack.push('<span style="border: inherit;text-decoration:inherit;color: #' + _colorCodes[text[t]] + '">');
            codes.push("</span>");
            continue;
          } else if (bold && !boldNest) {
            stack.push('<span style="border: inherit;text-decoration:inherit;color: #' + _colorCodes["BOLD%^%^WHITE"] + '">');
            codes.push("</span>");
          }
          if (classes.length) {
            stack.push('<span class="' + classes.join(" ") + '">');
            codes.push("</span>");
            classes = [];
          }
          stack.push(text[t]);
          bold = false;
          boldNest = false;
          break;
      }
    }
    if (classes.length) {
      stack.push('<span class="' + classes.join(" ") + '">');
      codes.push("</span>");
    }
    for (t = 0, tl = codes.length; t < tl; t++)
      stack.push(codes[t]);
    return stack.join("");
  }
  function loadColors() {
    let c;
    let color;
    let r;
    let g;
    let b;
    let idx;
    _colorCodes = {};
    _colorCodes["BLACK"] = "000000";
    _colorCodes["RED"] = "800000";
    _colorCodes["GREEN"] = "008000";
    _colorCodes["ORANGE"] = "808000";
    _colorCodes["BLUE"] = "0000EE";
    _colorCodes["MAGENTA"] = "800080";
    _colorCodes["CYAN"] = "008080";
    _colorCodes["WHITE"] = "BBBBBB";
    _colorCodes["mono11"] = "808080";
    _colorCodes["BOLD%^%^RED"] = "FF0000";
    _colorCodes["BOLD%^%^GREEN"] = "00FF00";
    _colorCodes["YELLOW"] = "FFFF00";
    _colorCodes["BOLD%^%^YELLOW"] = "FFFF00";
    _colorCodes["BOLD%^%^BLUE"] = "5C5CFF";
    _colorCodes["BOLD%^%^MAGENTA"] = "FF00FF";
    _colorCodes["BOLD%^%^CYAN"] = "00FFFF";
    _colorCodes["BOLD%^%^WHITE"] = "FFFFFF";
    _colorCodes["BOLD%^%^BLACK"] = "808080";
    for (r = 0; r < 6; r++) {
      for (g = 0; g < 6; g++) {
        for (b = 0; b < 6; b++) {
          idx = `RGB${r}${g}${b}`;
          color = "";
          c = 0;
          c = r * 40 + 55;
          if (c < 16)
            color += "0";
          color += c.toString(16);
          c = 0;
          c = g * 40 + 55;
          if (c < 16)
            color += "0";
          color += c.toString(16);
          c = 0;
          c = b * 40 + 55;
          if (c < 16)
            color += "0";
          color += c.toString(16);
          if (!_colorCodes[idx])
            _colorCodes[idx] = color.toUpperCase();
        }
      }
    }
    for (r = 232; r <= 255; r++) {
      g = (r - 232) * 10 + 8;
      if (g < 16)
        g = "0" + g.toString(16).toUpperCase();
      else
        g = g.toString(16).toUpperCase();
      g = g + g + g;
      if (r < 242)
        _colorCodes["mono0" + (r - 232)] = g;
      else
        _colorCodes["mono" + (r - 232)] = g;
    }
  }
  function getColors() {
    const _ColorTable = [];
    let r;
    let g;
    let b;
    let idx;
    for (r = 0; r < 6; r++) {
      for (g = 0; g < 6; g++) {
        for (b = 0; b < 6; b++) {
          idx = 16 + r * 36 + g * 6 + b;
          _ColorTable[idx] = "rgb(";
          if (r > 0)
            _ColorTable[idx] += r * 40 + 55;
          else
            _ColorTable[idx] += "0";
          _ColorTable[idx] += ",";
          if (g > 0)
            _ColorTable[idx] += g * 40 + 55;
          else
            _ColorTable[idx] += "0";
          _ColorTable[idx] += ",";
          if (b > 0)
            _ColorTable[idx] += b * 40 + 55;
          else
            _ColorTable[idx] += "0";
          _ColorTable[idx] += ")";
        }
      }
    }
    for (r = 232; r <= 255; r++) {
      g = (r - 232) * 10 + 8;
      _ColorTable[r] = ["rgb(", g, ",", g, ",", g, ")"].join("");
    }
    _ColorTable[0] = "rgb(0,0,0)";
    _ColorTable[1] = "rgb(128, 0, 0)";
    _ColorTable[2] = "rgb(0, 128, 0)";
    _ColorTable[3] = "rgb(128, 128, 0)";
    _ColorTable[4] = "rgb(0, 0, 238)";
    _ColorTable[5] = "rgb(128, 0, 128)";
    _ColorTable[6] = "rgb(0, 128, 128)";
    _ColorTable[7] = "rgb(187, 187, 187)";
    _ColorTable[8] = "rgb(128, 128, 128)";
    _ColorTable[9] = "rgb(255, 0, 0)";
    _ColorTable[10] = "rgb(0, 255, 0)";
    _ColorTable[11] = "rgb(255, 255, 0)";
    _ColorTable[12] = "rgb(92, 92, 255)";
    _ColorTable[13] = "rgb(255, 0, 255)";
    _ColorTable[14] = "rgb(0, 255, 255)";
    _ColorTable[15] = "rgb(255, 255, 255)";
    _ColorTable[256] = "rgb(0, 0, 0)";
    _ColorTable[257] = "rgb(118, 0, 0)";
    _ColorTable[258] = "rgb(0, 108, 0)";
    _ColorTable[259] = "rgb(145, 136, 0)";
    _ColorTable[260] = "rgb(0, 0, 167)";
    _ColorTable[261] = "rgb(108, 0, 108)";
    _ColorTable[262] = "rgb(0, 108, 108)";
    _ColorTable[263] = "rgb(161, 161, 161)";
    _ColorTable[264] = "rgb(0, 0, 0)";
    _ColorTable[265] = "rgb(128, 0, 0)";
    _ColorTable[266] = "rgb(0, 128, 0)";
    _ColorTable[267] = "rgb(128, 128, 0)";
    _ColorTable[268] = "rgb(0, 0, 238)";
    _ColorTable[269] = "rgb(128, 0, 128)";
    _ColorTable[270] = "rgb(0, 128, 128)";
    _ColorTable[271] = "rgb(187, 187, 187)";
    _ColorTable[272] = "rgb(0,0,0)";
    _ColorTable[273] = "rgb(0, 255, 255)";
    _ColorTable[274] = "rgb(0,0,0)";
    _ColorTable[275] = "rgb(255, 255, 0)";
    _ColorTable[276] = "rgb(0, 0, 0)";
    _ColorTable[277] = "rgb(229, 229, 229)";
    _ColorTable[278] = "rgb(205, 0, 0)";
    _ColorTable[279] = "rgb(229, 229, 229)";
    _ColorTable[280] = "rgb(255,255,255)";
    return _ColorTable;
  }
  function insertValue(input, value) {
    if (!input) return;
    const active = document.activeElement;
    if (!active || active != input)
      input.focus();
    document.execCommand("insertText", false, value);
    if (active && active != input)
      active.focus();
  }
  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }
  function copyText(text) {
    return new Promise(function(resolve, reject) {
      try {
        if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && typeof navigator.permissions !== "undefined") {
          var blob = new Blob([text], { type: "text/plain" });
          var data = [new ClipboardItem({ "text/plain": blob })];
          navigator.permissions.query({ name: "clipboardWrite" }).then(function(permission) {
            if (permission.state === "granted" || permission.state === "prompt") {
              navigator.clipboard.write(data).then(resolve, reject).catch(reject);
            } else {
              reject(new Error("Permission not granted!"));
            }
          });
        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
          var textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.textContent = text;
          textarea.style.position = "fixed";
          textarea.style.width = "2em";
          textarea.style.height = "2em";
          textarea.style.padding = "0";
          textarea.style.border = "none";
          textarea.style.outline = "none";
          textarea.style.boxShadow = "none";
          textarea.style.background = "transparent";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          try {
            document.execCommand("copy");
            document.body.removeChild(textarea);
            resolve(null);
          } catch (e) {
            document.body.removeChild(textarea);
            reject(e);
          }
        } else {
          reject(new Error("None of copying methods are supported by this browser!"));
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  function pasteText() {
    return new Promise(function(resolve, reject) {
      try {
        if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && typeof navigator.permissions !== "undefined") {
          navigator.permissions.query({ name: "clipboardRead" }).then(function(permission) {
            if (permission.state === "granted" || permission.state === "prompt") {
              navigator.clipboard.readText().then(resolve, reject).catch(reject);
            } else {
              reject(new Error("Permission not granted!"));
            }
          });
        } else if (document.queryCommandSupported && document.queryCommandSupported("paste")) {
          var textarea = document.createElement("textarea");
          textarea.style.position = "fixed";
          textarea.style.width = "2em";
          textarea.style.height = "2em";
          textarea.style.padding = "0";
          textarea.style.border = "none";
          textarea.style.outline = "none";
          textarea.style.boxShadow = "none";
          textarea.style.background = "transparent";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          try {
            document.execCommand("paste", false, null);
            resolve(textarea.value);
            document.body.removeChild(textarea);
          } catch (e) {
            document.body.removeChild(textarea);
            reject(e);
          }
        } else {
          reject(new Error("None of pasting methods are supported by this browser!"));
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  function fSaveAs() {
    var DownloadAttributeSupport = "download" in document.createElement("a");
    var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
    window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;
    var BrowserSupportedMimeTypes = {
      "image/jpeg": true,
      "image/png": true,
      "image/gif": true,
      "image/svg+xml": true,
      "image/bmp": true,
      "image/x-windows-bmp": true,
      "image/webp": true,
      "audio/wav": true,
      "audio/mpeg": true,
      "audio/webm": true,
      "audio/ogg": true,
      "video/mpeg": true,
      "video/webm": true,
      "video/ogg": true,
      "text/plain": true,
      "text/html": true,
      "text/xml": true,
      "application/xhtml+xml": true,
      "application/json": true
    };
    if (BlobBuilder && (window.saveAs || navigator.saveBlob)) {
      this.show = function(data, name, mimetype) {
        var builder = new BlobBuilder();
        builder.append(data);
        var blob = builder.getBlob(mimetype || "application/octet-stream");
        if (!name) name = "Download.bin";
        if (window.saveAs) {
          window.saveAs(blob, name);
        } else {
          navigator.saveBlob(blob, name);
        }
      };
    } else if (BlobBuilder && URL) {
      this.show = function(data, name, mimetype) {
        var blob, url, builder = new BlobBuilder();
        builder.append(data);
        if (!mimetype) mimetype = "application/octet-stream";
        if (DownloadAttributeSupport) {
          blob = builder.getBlob(mimetype);
          url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", name || "Download.bin");
          var event = document.createEvent("MouseEvents");
          event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
          link.dispatchEvent(event);
        } else {
          if (BrowserSupportedMimeTypes[mimetype.split(";")[0]] === true) {
            mimetype = "application/octet-stream";
          }
          blob = builder.getBlob(mimetype);
          url = URL.createObjectURL(blob);
          window.open(url, "_blank", "");
        }
        setTimeout(function() {
          URL.revokeObjectURL(url);
        }, 250);
      };
    } else if (Blob && URL) {
      this.show = function(data, name, mimetype) {
        var blob, url;
        if (!mimetype) mimetype = "application/octet-stream";
        blob = new Blob([data], { type: mimetype });
        if (DownloadAttributeSupport) {
          url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", name || "Download.bin");
          var event = document.createEvent("MouseEvents");
          event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
          link.dispatchEvent(event);
        } else {
          if (BrowserSupportedMimeTypes[mimetype.split(";")[0]] === true) {
            mimetype = "application/octet-stream";
          }
          url = URL.createObjectURL(blob);
          window.open(url, "_blank", "");
        }
        setTimeout(function() {
          URL.revokeObjectURL(url);
        }, 250);
      };
    } else if (!/\bMSIE\b/.test(navigator.userAgent)) {
      this.show = function(data, name, mimetype) {
        if (!mimetype) mimetype = "application/octet-stream";
        if (BrowserSupportedMimeTypes[mimetype.split(";")[0]] === true) {
          mimetype = "application/octet-stream";
        }
        window.open("data:" + mimetype + "," + encodeURIComponent(data), "_blank", "");
      };
    }
  }
  window.fileSaveAs = new fSaveAs();
  function utf8() {
    var intc, i;
    function TryGetCharUTF8(b, count) {
      var c = b.charCodeAt(i);
      if ((c & 128) === 0)
        intc = c;
      else {
        if ((c & 224) == 192) {
          intc = (c & 31) << 6 | b.charCodeAt(i + 1) & 63;
          i += 1;
        } else if ((c & 240) == 224) {
          intc = (c & 15) << 12 | (b.charCodeAt(i + 1) & 63) << 6 | b.charCodeAt(i + 2) & 63;
          i += 2;
        } else if ((c & 248) == 240) {
          intc = (c & 7) << 18 | (b.charCodeAt(i + 1) & 63) << 12 | (b.charCodeAt(i + 2) & 63) << 6 | b.charCodeAt(i + 3) & 63;
          i += 1;
        } else
          return false;
      }
      return true;
    }
    this.decode = function(s) {
      var ss = new StringBuffer();
      var sl = s.length;
      for (i = 0; i < sl; i++) {
        if (TryGetCharUTF8(s, sl))
          ss.appendCode(intc);
      }
      return ss.toString();
    };
    this.decode2 = function(s) {
      var ss = new StringBuffer();
      var sl = s.length;
      var i2, c;
      for (i2 = 0; i2 < sl; i2++) {
        c = s.charCodeAt(i2);
        if ((c & 128) !== 0) {
          if ((c & 224) == 192) {
            c = (c & 31) << 6 | s.charCodeAt(i2 + 1) & 63;
            i2 += 1;
          } else if ((c & 240) == 224) {
            c = (c & 15) << 12 | (s.charCodeAt(i2 + 1) & 63) << 6 | s.charCodeAt(i2 + 2) & 63;
            i2 += 2;
          } else if ((c & 248) == 240) {
            c = (c & 7) << 18 | (s.charCodeAt(i2 + 1) & 63) << 12 | (s.charCodeAt(i2 + 2) & 63) << 6 | s.charCodeAt(i2 + 3) & 63;
            i2 += 1;
          } else
            continue;
        }
        ss.appendCode(c);
      }
      return ss.toString();
    };
  }
  window.UTF8 = new utf8();
  function openFileDialog(title, multiple, accept) {
    return new Promise((resolve, reject) => {
      let dialog = document.createElement("dialog");
      if (typeof dialog.showModal !== "function") {
        reject("Browser does not support dialogs.");
        return;
      }
      dialog.id = "openFileDialog";
      dialog.style.zIndex = "2000";
      dialog.style.height = "155px";
      dialog.style.width = "350px";
      dialog.innerHTML = `<div class="dialog-header" style="font-weight: bold"><button type="button" class="btn btn-close float-end btn-danger" data-dismiss="modal" onclick="document.getElementById('openFileDialog').close();"></button><div>${title || "Open file..."}</div></div><div class="dialog-body"><div class="m-3"><input class="form-control" type="file" id="openFileDialog-files"${multiple ? " multiple" : ""} required${accept && accept.length ? ' accept="' + accept + '"' : ""}></div></div><div class="dialog-footer"><button id="openFileDialog-cancel" style="float: right" type="button" class="btn btn-default" onclick="document.getElementById('openFileDialog').close();">Cancel</button><button id="openFileDialog-ok" style="float: right" type="button" class="btn btn-primary">Ok</button></div>`;
      document.body.appendChild(dialog);
      dialog.addEventListener("close", (e) => {
        if (e.target !== dialog) return;
        document.body.removeChild(dialog);
        if (dialog.returnValue !== "file-ok")
          reject("closed");
      });
      dialog.addEventListener("cancel", (e) => {
        if (e.target !== dialog) return;
        document.body.removeChild(dialog);
        if (dialog.returnValue !== "file-ok")
          reject("canceled");
      });
      document.getElementById("openFileDialog-ok").addEventListener("click", () => {
        const input = document.getElementById("openFileDialog-files");
        if (!input.files || input.files.length === 0) {
          input.classList.add("is-invalid");
          return;
        }
        input.classList.remove("is-invalid");
        dialog.close();
        dialog.returnValue = "files-ok";
        resolve(input.files);
      });
      dialog.showModal();
    });
  }
  function readFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) reject(new Error("Invalid file"));
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (evt) => {
        resolve(evt.target.result);
      };
      reader.readAsText(file);
    });
  }
  var _timers = {};
  function debounce(mainFunction, delay, key) {
    key = key || "default";
    clearTimeout(_timers[key]);
    _timers[key] = setTimeout(() => {
      mainFunction();
      delete _timers[key];
    }, delay);
  }

  // src/dialog.ts
  var Dialog = class extends EventEmitter {
    constructor(options) {
      super();
      this._state = { x: 0, y: 0, height: 0, width: 0, zIndex: 100, maximized: false, show: 0 };
      this._resize = { x: 0, y: 0, height: 0, width: 0, type: 0 /* None */, minHeight: 150, minWidth: 300, borderHeight: 1, borderWidth: 1 };
      this._dragPosition = { x: 0, y: 0 };
      this._windowResize = () => {
        debounce(() => {
          const styles = document.defaultView.getComputedStyle(this._dialog);
          if (this._state.x > window.innerWidth - 16) {
            this._state.x = window.innerWidth - 16;
            this._dialog.style.left = this._state.x + "px";
          }
          if (this._state.y > window.innerHeight - 16) {
            this._state.y = window.innerHeight - 16;
            this._dialog.style.top = this._state.y + "px";
          }
          this.emit("moved", this._state);
        }, 250, this._id + "dialogResize");
      };
      this.resizeDoDrag = (e) => {
        let t;
        if ((this._resize.type & 1 /* Right */) === 1 /* Right */) {
          t = this._resize.width + e.clientX - this._resize.x;
          if (t > window.innerWidth) t = window.innerWidth;
          this._dialog.style.width = t + "px";
        }
        if ((this._resize.type & 2 /* Bottom */) === 2 /* Bottom */) {
          t = this._resize.height + e.clientY - this._resize.y;
          if (t > window.innerWidth - 16) t = window.innerHeight - 16;
          this._dialog.style.height = t + "px";
        }
        if ((this._resize.type & 8 /* Top */) === 8 /* Top */) {
          t = this._resize.height - e.clientY + this._resize.y - this._resize.borderHeight;
          if (t + this._resize.borderHeight > window.innerHeight) t = window.innerHeight;
          if (t + this._resize.borderHeight <= this._resize.minHeight) {
            this._dialog.style.height = this._resize.minHeight + "px";
            return;
          }
          this._dialog.style.height = t + "px";
          t = e.clientY;
          if (t > window.innerHeight) t = window.innerHeight;
          this._dialog.style.top = t + "px";
        }
        if ((this._resize.type & 4 /* Left */) === 4 /* Left */) {
          t = this._resize.width - e.clientX + this._resize.x - this._resize.borderWidth;
          if (t + this._resize.borderWidth > window.innerWidth) t = window.innerWidth;
          if (t + this._resize.borderWidth <= this._resize.minWidth) {
            this._dialog.style.width = this._resize.minWidth + "px";
            return;
          }
          this._dialog.style.width = t + "px";
          t = e.clientX;
          if (t > window.innerWidth) t = window.innerWidth;
          this._dialog.style.left = t + "px";
        }
      };
      this.resizeTouchDrag = (e) => {
        if (!e.touches.length) return;
        let t;
        if ((this._resize.type & 1 /* Right */) === 1 /* Right */) {
          t = this._resize.width + e.touches[0].clientX - this._resize.x;
          if (t > window.innerWidth) t = window.innerWidth;
          this._dialog.style.width = t + "px";
        }
        if ((this._resize.type & 2 /* Bottom */) === 2 /* Bottom */) {
          t = this._resize.height + e.touches[0].clientY - this._resize.y;
          if (t > window.innerWidth) t = window.innerHeight;
          this._dialog.style.height = t + "px";
        }
        if ((this._resize.type & 8 /* Top */) === 8 /* Top */) {
          t = this._resize.height - e.touches[0].clientY + this._resize.y - this._resize.borderHeight;
          if (t + this._resize.borderHeight > window.innerHeight) t = window.innerHeight;
          if (t + this._resize.borderHeight <= this._resize.minHeight) {
            this._dialog.style.height = this._resize.minHeight + "px";
            return;
          }
          this._dialog.style.height = t + "px";
          t = e.touches[0].clientY;
          if (t > window.innerHeight) t = window.innerHeight;
          this._dialog.style.top = t + "px";
        }
        if ((this._resize.type & 4 /* Left */) === 4 /* Left */) {
          t = this._resize.width - e.touches[0].clientX + this._resize.x - this._resize.borderWidth;
          if (t + this._resize.borderWidth > window.innerWidth) t = window.innerWidth;
          if (t + this._resize.borderWidth <= this._resize.minWidth) {
            this._dialog.style.width = this._resize.minWidth + "px";
            return;
          }
          this._dialog.style.width = t + "px";
          t = e.touches[0].clientX;
          if (t > window.innerWidth) t = window.innerWidth;
          this._dialog.style.left = t + "px";
        }
      };
      this.resizeStopDrag = (e) => {
        document.documentElement.removeEventListener("mousemove", this.resizeDoDrag);
        document.documentElement.removeEventListener("mouseup", this.resizeStopDrag);
        document.documentElement.removeEventListener("touchmove", this.resizeTouchDrag);
        document.documentElement.removeEventListener("touchend", this.resizeStopDrag);
        const styles = document.defaultView.getComputedStyle(this._dialog);
        this._state.x = parseInt(styles.left, 10);
        ;
        this._state.width = parseInt(styles.width, 10);
        this._state.y = parseInt(styles.top, 10);
        ;
        this._state.height = parseInt(styles.height, 10);
        this._body.style.pointerEvents = "";
        this.emit("resized", this._state);
      };
      this.dragMouseDown = (e) => {
        if (this.maximized) return;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        document.documentElement.addEventListener("mouseup", this.dragMouseUp);
        document.documentElement.addEventListener("mousemove", this.dragMouseMove);
        this._header.style.cursor = "move";
      };
      this.dragTouchStart = (e) => {
        if (this.maximized) return;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        document.documentElement.addEventListener("touchend", this.dragMouseUp);
        document.documentElement.addEventListener("touchmove", this.dragTouchMove);
        this._header.style.cursor = "move";
      };
      this.dragMouseMove = (e) => {
        let x = this._dragPosition.x - e.clientX;
        let y = this._dragPosition.y - e.clientY;
        this._dragPosition.x = e.clientX;
        this._dragPosition.y = e.clientY;
        this._state.x = this._dialog.offsetLeft - x;
        this._state.y = this._dialog.offsetTop - y;
        if (this._state.x > window.innerWidth - 16)
          this._state.x = window.innerWidth - 16;
        if (this._state.y > window.innerHeight - 16)
          this._state.y = window.innerHeight - 16;
        if (this._state.x < 16 - this._dialog.clientWidth)
          this._state.x = 16 - this._dialog.clientWidth;
        if (this._state.y < 16 - this._dialog.clientHeight)
          this._state.y = 16 - this._dialog.clientHeight;
        this._dialog.style.left = this._state.x + "px";
        this._dialog.style.top = this._state.y + "px";
      };
      this.dragTouchMove = (e) => {
        if (!e.touches.length) return;
        let x = this._dragPosition.x - e.touches[0].clientX;
        let y = this._dragPosition.y - e.touches[0].clientY;
        this._dragPosition.x = e.touches[0].clientX;
        this._dragPosition.y = e.touches[0].clientY;
        this._state.x = this._dialog.offsetLeft - x;
        this._state.y = this._dialog.offsetTop - y;
        if (this._state.x > window.innerWidth - 16)
          this._state.x = window.innerWidth - 16;
        if (this._state.y > window.innerHeight - 16)
          this._state.y = window.innerHeight - 16;
        if (this._state.x < 16 - this._dialog.clientWidth)
          this._state.x = 16 - this._dialog.clientWidth;
        if (this._state.y < 16 - this._dialog.clientHeight)
          this._state.y = 16 - this._dialog.clientHeight;
        this._dialog.style.left = this._state.x + "px";
        this._dialog.style.top = this._state.y + "px";
      };
      this.dragMouseUp = () => {
        document.documentElement.removeEventListener("mouseup", this.dragMouseUp);
        document.documentElement.removeEventListener("mousemove", this.dragMouseMove);
        document.documentElement.removeEventListener("touchend", this.dragMouseUp);
        document.documentElement.removeEventListener("touchmove", this.dragTouchMove);
        this._header.style.cursor = "";
        const styles = document.defaultView.getComputedStyle(this._dialog);
        this._state.x = parseInt(styles.left, 10);
        ;
        this._state.width = parseInt(styles.width, 10);
        this._state.y = parseInt(styles.top, 10);
        ;
        this._state.height = parseInt(styles.height, 10);
        this.emit("moved", this._state);
      };
      this.moveable = true;
      this.resizable = true;
      this._maximizable = true;
      if (options && "type" in options && options.type == 1) {
        this._dialog = document.createElement("div");
        this._dialog.open = false;
      } else
        this._dialog = document.createElement("dialog");
      if (typeof this._dialog.showModal !== "function") {
        this._dialog.showModal = () => {
          if (this._dialog.open) return;
          this._dialog.style.display = "block";
          this._dialog.style.visibility = "visible";
          this._dialog.open = true;
          this._state.show = 2;
          this._dialog.focus();
          this.emit("shown", false);
          if (!this._dialog._keydown) {
            this._dialog._keydown = (e) => {
              if (e.key === "Escape" && e.srcElement.tagName !== "TEXTAREA" && e.srcElement.tagName !== "INPUT" && e.srcElement.tagName !== "SELECT")
                this.close();
            };
          }
          if (!this._dialog.backdrop_) {
            this._dialog.backdrop_ = document.createElement("div");
            this._dialog.backdrop_.className = "backdrop";
            this._dialog.backdrop_MouseEvent = function(e) {
              if (!this.hasAttribute("tabindex")) {
                var fake = document.createElement("div");
                this.insertBefore(fake, this.firstChild);
                fake.tabIndex = -1;
                fake.focus();
                this.removeChild(fake);
              } else
                this.focus();
              var redirectedEvent = document.createEvent("MouseEvents");
              redirectedEvent.initMouseEvent(
                e.type,
                e.bubbles,
                e.cancelable,
                window,
                e.detail,
                e.screenX,
                e.screenY,
                e.clientX,
                e.clientY,
                e.ctrlKey,
                e.altKey,
                e.shiftKey,
                e.metaKey,
                e.button,
                e.relatedTarget
              );
              this.dispatchEvent(redirectedEvent);
              e.stopPropagation();
            };
            this._dialog.backdrop_.addEventListener("mouseup", this._dialog.backdrop_MouseEvent.bind(this._dialog));
            this._dialog.backdrop_.addEventListener("mousedown", this._dialog.backdrop_MouseEvent.bind(this._dialog));
            this._dialog.backdrop_.addEventListener("click", this._dialog.backdrop_MouseEvent.bind(this._dialog));
          }
          this._dialog.parentNode.insertBefore(this._dialog.backdrop_, this._dialog.nextSibling);
          window.document.addEventListener("keydown", this._dialog._keydown);
          this.getMaxZIndex();
          this._dialog.backdrop_.style.zIndex = "" + ++this._state.zIndex;
          this._dialog.style.zIndex = "" + ++this._state.zIndex;
        };
      }
      if (typeof this._dialog.show !== "function") {
        this._dialog.show = () => {
          if (this._dialog.open) return;
          this._dialog.style.display = "block";
          this._dialog.style.visibility = "visible";
          this._dialog.open = true;
          this._state.show = 1;
          this._dialog.focus();
          this.emit("shown", false);
        };
      }
      if (typeof this._dialog.close !== "function") {
        this._dialog.close = () => {
          this._dialog.style.display = "";
          this._dialog.style.visibility = "";
          this._dialog.open = false;
          this._state.show = 0;
          window.removeEventListener("resize", this._windowResize);
          this.emit("closed");
        };
      }
      this._dialog.dialog = this;
      if (options && "id" in options && options.id && options.id.length)
        this._id = options.id;
      else if (!this._id || !this._id.length)
        this._id = "dialog" + (/* @__PURE__ */ new Date()).getTime();
      this._dialog.id = this._id;
      this._dialog.style.zIndex = "100";
      this._dialog.style.margin = "0";
      this._dialog.classList.add("dialog");
      if (!options || !options.noAdaptive)
        this._dialog.classList.add("adaptive");
      if (options && "moveable" in options)
        this.moveable = options.moveable;
      if (options && "resizable" in options)
        this.resizable = options.resizable;
      if (options && "maximizable" in options)
        this._maximizable = options.maximizable;
      if (typeof options?.height === "number")
        this._dialog.style.height = options.height + "px";
      else if (options?.height && options?.height.length > 0)
        this._dialog.style.height = options.height;
      else
        this._dialog.style.height = "480px";
      if (typeof options?.minHeight === "number")
        this._dialog.style.minHeight = options.minHeight + "px";
      else if (options?.minHeight && options?.minHeight.length > 0)
        this._dialog.style.minHeight = options.minHeight;
      else
        this._dialog.style.minHeight = "150px";
      if (typeof options?.minWidth === "number")
        this._dialog.style.minWidth = options.minWidth + "px";
      else if (options?.minWidth && options?.minWidth.length > 0)
        this._dialog.style.minWidth = options.minWidth;
      else
        this._dialog.style.minWidth = "300px";
      if (typeof options?.width === "number")
        this._dialog.style.width = options.width + "px";
      else if (options?.width && options?.width.length > 0)
        this._dialog.style.width = options.width;
      else
        this._dialog.style.width = "640px";
      if (typeof options?.y === "number")
        this._dialog.style.top = options.y + "px";
      else if (options?.y && options?.y.length > 0)
        this._dialog.style.top = options.y;
      else
        this._dialog.style.top = "0";
      if (typeof options?.x === "number")
        this._dialog.style.left = options.x + "px";
      else if (options?.x && options?.x.length > 0)
        this._dialog.style.left = options.x;
      else
        this._dialog.style.left = "0";
      let footer = "";
      if (options?.buttons)
        footer += `<button id="${this._id}-cancel" type="button" class="float-end btn btn-light" title="Cancel dialog">Cancel</button>
            <button id="${this._id}-ok" type="button" class="float-end btn btn-primary" title="Confirm dialog">Ok</button>`;
      this._dialog.innerHTML = `<div class="dialog-header">
        <button id="${this._id}-header-close" style="padding: 4px;" type="button" class="btn btn-close float-end btn-danger" data-dismiss="modal" title="Close window"></button>
        <button type="button" class="btn btn-light float-end maximize" id="${this._id}-max" title="Maximize window" style="padding: 0 4px;margin-top: -1px;"><i class="bi-arrows-fullscreen"></i></button>
        <div>${options?.title || ""}</div>
    </div>
    <div class="dialog-body"></div>
    <div class="dialog-footer">${footer}</div>`;
      this._dialog.querySelector(`#${this._id}-header-close`).addEventListener("click", () => {
        this.close();
      });
      this._dialog.querySelector(`#${this._id}-max`).addEventListener("click", () => {
        if (!this.maximized)
          this.maximize();
        else
          this.restore();
      });
      this._dialog.addEventListener("close", (e) => {
        if (e.target !== this._dialog) return;
        const ec = { preventDefault: false };
        this.emit("closing", ec);
        if (ec.preventDefault) {
          e.preventDefault();
          return;
        }
        document.body.removeChild(this._dialog);
        this._state.show = 0;
        if (this._dialog.backdrop_)
          this._dialog.parentNode.removeChild(this._dialog.backdrop_);
        if (this._dialog._keydown)
          window.document.removeEventListener("keydown", this._dialog._keydown);
        window.removeEventListener("resize", this._windowResize);
        this.emit("closed");
      });
      this._dialog.addEventListener("cancel", (e) => {
        if (e.target !== this._dialog) return;
        const ec = { preventDefault: false };
        this.emit("canceling", ec);
        if (ec.preventDefault) {
          e.preventDefault();
          return;
        }
        if (document.activeElement && (document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "iNPUT" || document.activeElement.tagName === "SELECT")) {
          e.preventDefault();
          return;
        }
        this._dialog.open = false;
        document.body.removeChild(this._dialog);
        this._state.show = 0;
        if (this._dialog.backdrop_)
          this._dialog.parentNode.removeChild(this._dialog.backdrop_);
        if (this._dialog._keydown)
          window.document.removeEventListener("keydown", this._dialog._keydown);
        window.removeEventListener("resize", this._windowResize);
        if (this._dialog.returnValue !== "ok")
          this.emit("canceled");
      });
      document.body.appendChild(this._dialog);
      if (this._maximizable)
        this._dialog.querySelector(`#${this._id}-max`).style.display = "";
      else
        this._dialog.querySelector(`#${this._id}-max`).style.display = "none";
      if (options?.buttons) {
        this._dialog.querySelector(`#${this._id}-cancel`).addEventListener("click", () => {
          this.close();
        });
        this._dialog.querySelector(`#${this._id}-ok`).addEventListener("click", () => {
          const e = { preventDefault: false };
          this.emit("ok", e);
          if (e.preventDefault) return;
          this._dialog.returnValue = "ok";
          this._dialog.close();
        });
      }
      this._body = this._dialog.querySelector('[class="dialog-body"]');
      this._title = this._dialog.querySelector('[class="dialog-header"] div');
      this._footer = this._dialog.querySelector('[class="dialog-footer"]');
      this._header = this._dialog.querySelector('[class="dialog-header"]');
      if (this.resizable) {
        this._dialog.classList.add("resizable");
        var right = document.createElement("div");
        right.className = "resizer-right";
        this._dialog.appendChild(right);
        right.addEventListener("mousedown", (e) => {
          this.initResize(e, 1 /* Right */);
        }, false);
        right.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 1 /* Right */);
        }, { passive: true });
        var bottom = document.createElement("div");
        bottom.className = "resizer-bottom";
        this._dialog.appendChild(bottom);
        bottom.addEventListener("mousedown", (e) => {
          this.initResize(e, 2 /* Bottom */);
        }, false);
        bottom.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 2 /* Bottom */);
        }, { passive: true });
        var corner = document.createElement("div");
        corner.className = "resizer-se";
        this._dialog.appendChild(corner);
        corner.addEventListener("mousedown", (e) => {
          this.initResize(e, 1 /* Right */ | 2 /* Bottom */);
        }, false);
        corner.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 1 /* Right */ | 2 /* Bottom */);
        }, { passive: true });
        corner = document.createElement("div");
        corner.className = "resizer-ne";
        this._dialog.appendChild(corner);
        corner.addEventListener("mousedown", (e) => {
          this.initResize(e, 1 /* Right */ | 8 /* Top */);
        }, false);
        corner.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 1 /* Right */ | 8 /* Top */);
        }, { passive: true });
        corner = document.createElement("div");
        corner.className = "resizer-nw";
        this._dialog.appendChild(corner);
        corner.addEventListener("mousedown", (e) => {
          this.initResize(e, 4 /* Left */ | 8 /* Top */);
        }, false);
        corner.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 4 /* Left */ | 8 /* Top */);
        }, { passive: true });
        corner = document.createElement("div");
        corner.className = "resizer-sw";
        this._dialog.appendChild(corner);
        corner.addEventListener("mousedown", (e) => {
          this.initResize(e, 4 /* Left */ | 2 /* Bottom */);
        }, false);
        corner.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 4 /* Left */ | 2 /* Bottom */);
        }, { passive: true });
        var left = document.createElement("div");
        left.className = "resizer-left";
        this._dialog.appendChild(left);
        left.addEventListener("mousedown", (e) => {
          this.initResize(e, 4 /* Left */);
        }, false);
        left.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 4 /* Left */);
        }, { passive: true });
        var top = document.createElement("div");
        top.className = "resizer-top";
        this._dialog.appendChild(top);
        top.addEventListener("mousedown", (e) => {
          this.initResize(e, 8 /* Top */);
        }, false);
        top.addEventListener("touchstart", (e) => {
          this.initResizeTouch(e, 8 /* Top */);
        }, { passive: true });
      }
      if (this.moveable) {
        this._dialog.addEventListener("mousedown", () => {
          this.getMaxZIndex();
          this._dialog.style.zIndex = "" + ++this._state.zIndex;
        });
        this._header.addEventListener("mousedown", this.dragMouseDown);
        this._header.addEventListener("touchstart", this.dragTouchStart, { passive: true });
      }
      const styles = document.defaultView.getComputedStyle(this._dialog);
      this._state.x = this._resize.x = parseInt(styles.left, 10);
      ;
      this._state.width = this._resize.width = parseInt(styles.width, 10);
      this._state.y = this._resize.y = parseInt(styles.top, 10);
      ;
      this._state.height = this._resize.height = parseInt(styles.height, 10);
      if (options && "noFooter" in options && options.noFooter)
        this.hideFooter();
      if (options && "maximized" in options && options.maximized)
        this.maximize();
      if (options && "showModal" in options && options.showModal)
        this.showModal();
      else if (options && "show" in options && options.show) {
        if (options.show === 2)
          this.showModal();
        else
          this.show();
      }
      if (options && "center" in options && options.center)
        this.center();
      if (options && "position" in options && options.position > 0)
        this.position(options.position);
    }
    get maximizable() {
      return this._maximizable;
    }
    set maximizable(value) {
      if (value === this._maximizable) return;
      this._maximizable = value;
      if (this.maximizable)
        this._dialog.querySelector(`#${this._id}-max`).style.display = "";
      else
        this._dialog.querySelector(`#${this._id}-max`).style.display = "none";
    }
    set maximized(value) {
      if (this._state.maximized === value) return;
      this._state.maximized = value;
    }
    get maximized() {
      return this._state.maximized;
    }
    initResize(e, type) {
      if (this.maximized) return;
      const styles = document.defaultView.getComputedStyle(this._dialog);
      this._resize.x = e.clientX;
      this._resize.width = parseInt(styles.width, 10);
      this._resize.y = e.clientY;
      this._resize.height = parseInt(styles.height, 10);
      this._resize.type = type;
      this._resize.minHeight = parseInt(styles.minHeight, 10);
      this._resize.minWidth = parseInt(styles.minWidth, 10);
      this._resize.borderHeight = e.offsetY + parseInt(styles.borderTopWidth);
      this._resize.borderWidth = e.offsetX + parseInt(styles.borderLeftWidth);
      this._body.style.pointerEvents = "none";
      document.documentElement.addEventListener("mousemove", this.resizeDoDrag, false);
      document.documentElement.addEventListener("mouseup", this.resizeStopDrag, false);
    }
    initResizeTouch(e, type) {
      if (!e.touches.length || this.maximized) return;
      const styles = document.defaultView.getComputedStyle(this._dialog);
      this._resize.x = e.touches[0].clientX;
      this._resize.width = parseInt(styles.width, 10);
      this._resize.y = e.touches[0].clientY;
      this._resize.height = parseInt(styles.height, 10);
      this._resize.type = type;
      this._resize.minHeight = parseInt(styles.minHeight, 10);
      this._resize.minWidth = parseInt(styles.minWidth, 10);
      var rect = e.target.getBoundingClientRect();
      var x = e.targetTouches[0].clientX - rect.x;
      var y = e.targetTouches[0].clientY - rect.y;
      this._resize.borderHeight = y + parseInt(styles.borderTopWidth);
      this._resize.borderWidth = x + parseInt(styles.borderLeftWidth);
      this._body.style.pointerEvents = "none";
      document.documentElement.addEventListener("touchmove", this.resizeTouchDrag, false);
      document.documentElement.addEventListener("touchend", this.resizeStopDrag, false);
    }
    get id() {
      return this._id;
    }
    set id(value) {
      if (this._id === value) return;
      this._id = value;
      if (this._dialog) {
        const old = this._dialog.id;
        this._dialog.id = this._id;
        let el = this._dialog.querySelector(`#${this._id}-cancel`);
        if (el) el.id = this._id + "-cancel";
        el = this._dialog.querySelector(`#${this._id}-ok`);
        if (el) el.id = this._id + "-ok";
        el = this._dialog.querySelector(`#${this._id}-max`);
        if (el) el.id = this._id + "-max";
        el = this._dialog.querySelector(`#${this._id}-header-close`);
        if (el) el.id = this._id + "-header-close";
      }
    }
    get title() {
      return this._title.innerHTML;
    }
    set title(value) {
      this._title.innerHTML = value;
    }
    showModal() {
      if (!this._dialog.parentElement)
        document.body.appendChild(this._dialog);
      if (this._dialog.open) return;
      this._dialog.showModal();
      this._state.show = 2;
      window.addEventListener("resize", this._windowResize);
      this.emit("shown", true);
    }
    show() {
      if (!this._dialog.parentElement)
        document.body.appendChild(this._dialog);
      if (this._dialog.open) return;
      this._dialog.show();
      this._state.show = 1;
      window.addEventListener("resize", this._windowResize);
      this.emit("shown", false);
    }
    get opened() {
      return this._dialog.open;
    }
    close() {
      if (!this._dialog.open) return;
      if (this._dialog.backdrop_)
        this._dialog.parentNode.removeChild(this._dialog.backdrop_);
      if (this._dialog._keydown)
        window.document.removeEventListener("keydown", this._dialog._keydown);
      this._dialog.close();
    }
    get header() {
      return this._header;
    }
    get body() {
      return this._body;
    }
    get footer() {
      return this._footer;
    }
    get dialog() {
      return this._dialog;
    }
    get left() {
      return this._dialog.style.left;
    }
    set left(value) {
      this._dialog.style.left = value;
    }
    get top() {
      return this._dialog.style.top;
    }
    set top(value) {
      this._dialog.style.top = value;
    }
    get width() {
      return this._dialog.style.width;
    }
    set width(value) {
      this._dialog.style.width = value;
    }
    get height() {
      return this._dialog.style.height;
    }
    set height(value) {
      this._dialog.style.top = value;
    }
    get windowState() {
      return this._state;
    }
    center() {
      this.position(48 /* Center */);
    }
    position(position) {
      if (position < 1) return;
      let w = this._dialog.clientWidth;
      let h = this._dialog.clientHeight;
      if (!w || !h) {
        const styles = document.defaultView.getComputedStyle(this._dialog);
        w = w || parseInt(styles.width, 10);
        h = h || parseInt(styles.height, 10);
      }
      if ((position & 4 /* Top */) === 4 /* Top */)
        this._state.y = 0;
      else if ((position & 8 /* Bottom */) === 8 /* Bottom */)
        this._state.y = window.innerHeight - h;
      else if ((position & 16 /* CenterVertical */) === 16 /* CenterVertical */)
        this._state.y = window.innerHeight / 2 - h / 2;
      if ((position & 1 /* Left */) === 1 /* Left */)
        this._state.x = 0;
      else if ((position & 2 /* Right */) === 2 /* Right */)
        this._state.x = window.innerWidth - w;
      else if ((position & 32 /* CenterHorizontal */) === 32 /* CenterHorizontal */)
        this._state.x = window.innerWidth / 2 - w / 2;
      this._dialog.style.left = this._state.x + "px";
      this._dialog.style.top = this._state.y + "px";
      this._state.width = this._dialog.clientWidth;
      this._state.height = this._dialog.clientHeight;
      this.emit("moved", this._state);
    }
    maximize() {
      if (this.maximized) return;
      this.maximized = true;
      this._dialog.classList.add("maximized");
      this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.remove("bi-arrows-fullscreen");
      this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.add("bi-arrows-angle-contract");
      this.emit("maximized");
    }
    restore() {
      if (!this.maximized) return;
      this.maximized = false;
      this._dialog.classList.remove("maximized");
      this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.add("bi-arrows-fullscreen");
      this._dialog.querySelector(`#${this._id}-max`).firstElementChild.classList.remove("bi-arrows-angle-contract");
      this.emit("restored");
    }
    getMaxZIndex(forceReset) {
      const dialogs = document.getElementsByTagName("dialog");
      let d = 0;
      const dl = dialogs.length;
      let i = parseInt(this._dialog.style.zIndex, 10);
      ;
      const order = [];
      for (; d < dl; d++) {
        if (!dialogs[d].style.zIndex || !dialogs[d].style.zIndex.length) continue;
        let z = parseInt(dialogs[d].style.zIndex, 10);
        if (z > i)
          i = z;
        order.push({ z, idx: d });
      }
      this._state.zIndex = i;
      if (forceReset || this._state.zIndex > 1e3) {
        this._state.zIndex = 100;
        d = 0;
        order.sort((a, b) => a.z < b.z ? -1 : a.z > b.z ? 1 : 0);
        for (; d < dl; d++)
          dialogs[order[d].idx].style.zIndex = "" + this._state.zIndex++;
      }
    }
    showFooter() {
      this._footer.style.display = "";
      this._body.bottom = "";
    }
    hideFooter() {
      this._footer.style.display = "none";
      this._body.style.bottom = "0";
    }
  };

  // src/lib/rgbcolor.js
  function RGBColor(color_string) {
    this.ok = false;
    if (color_string.charAt(0) == "#") {
      color_string = color_string.substr(1, 6);
    }
    color_string = color_string.replace(/ /g, "");
    color_string = color_string.toLowerCase();
    var simple_colors = {
      aliceblue: "f0f8ff",
      antiquewhite: "faebd7",
      aqua: "00ffff",
      aquamarine: "7fffd4",
      azure: "f0ffff",
      beige: "f5f5dc",
      bisque: "ffe4c4",
      black: "000000",
      blanchedalmond: "ffebcd",
      blue: "0000ff",
      blueviolet: "8a2be2",
      brown: "a52a2a",
      burlywood: "deb887",
      cadetblue: "5f9ea0",
      chartreuse: "7fff00",
      chocolate: "d2691e",
      coral: "ff7f50",
      cornflowerblue: "6495ed",
      cornsilk: "fff8dc",
      crimson: "dc143c",
      cyan: "00ffff",
      darkblue: "00008b",
      darkcyan: "008b8b",
      darkgoldenrod: "b8860b",
      darkgray: "a9a9a9",
      darkgreen: "006400",
      darkkhaki: "bdb76b",
      darkmagenta: "8b008b",
      darkolivegreen: "556b2f",
      darkorange: "ff8c00",
      darkorchid: "9932cc",
      darkred: "8b0000",
      darksalmon: "e9967a",
      darkseagreen: "8fbc8f",
      darkslateblue: "483d8b",
      darkslategray: "2f4f4f",
      darkturquoise: "00ced1",
      darkviolet: "9400d3",
      deeppink: "ff1493",
      deepskyblue: "00bfff",
      dimgray: "696969",
      dodgerblue: "1e90ff",
      feldspar: "d19275",
      firebrick: "b22222",
      floralwhite: "fffaf0",
      forestgreen: "228b22",
      fuchsia: "ff00ff",
      gainsboro: "dcdcdc",
      ghostwhite: "f8f8ff",
      gold: "ffd700",
      goldenrod: "daa520",
      gray: "808080",
      green: "008000",
      greenyellow: "adff2f",
      honeydew: "f0fff0",
      hotpink: "ff69b4",
      indianred: "cd5c5c",
      indigo: "4b0082",
      ivory: "fffff0",
      khaki: "f0e68c",
      lavender: "e6e6fa",
      lavenderblush: "fff0f5",
      lawngreen: "7cfc00",
      lemonchiffon: "fffacd",
      lightblue: "add8e6",
      lightcoral: "f08080",
      lightcyan: "e0ffff",
      lightgoldenrodyellow: "fafad2",
      lightgrey: "d3d3d3",
      lightgreen: "90ee90",
      lightpink: "ffb6c1",
      lightsalmon: "ffa07a",
      lightseagreen: "20b2aa",
      lightskyblue: "87cefa",
      lightslateblue: "8470ff",
      lightslategray: "778899",
      lightsteelblue: "b0c4de",
      lightyellow: "ffffe0",
      lime: "00ff00",
      limegreen: "32cd32",
      linen: "faf0e6",
      magenta: "ff00ff",
      maroon: "800000",
      mediumaquamarine: "66cdaa",
      mediumblue: "0000cd",
      mediumorchid: "ba55d3",
      mediumpurple: "9370d8",
      mediumseagreen: "3cb371",
      mediumslateblue: "7b68ee",
      mediumspringgreen: "00fa9a",
      mediumturquoise: "48d1cc",
      mediumvioletred: "c71585",
      midnightblue: "191970",
      mintcream: "f5fffa",
      mistyrose: "ffe4e1",
      moccasin: "ffe4b5",
      navajowhite: "ffdead",
      navy: "000080",
      oldlace: "fdf5e6",
      olive: "808000",
      olivedrab: "6b8e23",
      orange: "ffa500",
      orangered: "ff4500",
      orchid: "da70d6",
      palegoldenrod: "eee8aa",
      palegreen: "98fb98",
      paleturquoise: "afeeee",
      palevioletred: "d87093",
      papayawhip: "ffefd5",
      peachpuff: "ffdab9",
      peru: "cd853f",
      pink: "ffc0cb",
      plum: "dda0dd",
      powderblue: "b0e0e6",
      purple: "800080",
      red: "ff0000",
      rosybrown: "bc8f8f",
      royalblue: "4169e1",
      saddlebrown: "8b4513",
      salmon: "fa8072",
      sandybrown: "f4a460",
      seagreen: "2e8b57",
      seashell: "fff5ee",
      sienna: "a0522d",
      silver: "c0c0c0",
      skyblue: "87ceeb",
      slateblue: "6a5acd",
      slategray: "708090",
      snow: "fffafa",
      springgreen: "00ff7f",
      steelblue: "4682b4",
      tan: "d2b48c",
      teal: "008080",
      thistle: "d8bfd8",
      tomato: "ff6347",
      turquoise: "40e0d0",
      violet: "ee82ee",
      violetred: "d02090",
      wheat: "f5deb3",
      white: "ffffff",
      whitesmoke: "f5f5f5",
      yellow: "ffff00",
      yellowgreen: "9acd32"
    };
    for (var key in simple_colors) {
      if (color_string == key) {
        color_string = simple_colors[key];
      }
    }
    var color_defs = [
      {
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
        process: function(bits2) {
          return [
            parseInt(bits2[1], 10),
            parseInt(bits2[2], 10),
            parseInt(bits2[3], 10)
          ];
        }
      },
      {
        re: /^(\w{2})(\w{2})(\w{2})$/,
        example: ["#00ff00", "336699"],
        process: function(bits2) {
          return [
            parseInt(bits2[1], 16),
            parseInt(bits2[2], 16),
            parseInt(bits2[3], 16)
          ];
        }
      },
      {
        re: /^(\w{1})(\w{1})(\w{1})$/,
        example: ["#fb0", "f0f"],
        process: function(bits2) {
          return [
            parseInt(bits2[1] + bits2[1], 16),
            parseInt(bits2[2] + bits2[2], 16),
            parseInt(bits2[3] + bits2[3], 16)
          ];
        }
      }
    ];
    for (var i = 0, cl = color_defs.length; i < cl; i++) {
      var re = color_defs[i].re;
      var processor = color_defs[i].process;
      var bits = re.exec(color_string);
      if (bits) {
        var channels = processor(bits);
        this.r = channels[0];
        this.g = channels[1];
        this.b = channels[2];
        this.ok = true;
      }
    }
    this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
    this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
    this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;
    this.toRGB = function() {
      return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    };
    this.toHex = function() {
      var r = this.r.toString(16);
      var g = this.g.toString(16);
      var b = this.b.toString(16);
      if (r.length == 1) r = "0" + r;
      if (g.length == 1) g = "0" + g;
      if (b.length == 1) b = "0" + b;
      return "#" + r + g + b;
    };
  }

  // src/interface/adv.editor.ts
  var AdvEditor = class extends EventEmitter {
    constructor(element, enabledAdvanced) {
      super();
      this._simple = true;
      //private _colorCodes;
      this.colorNames = {
        "No color": "Default",
        "BLACK": "Black",
        "RED": "Maroon",
        "GREEN": "Green",
        "ORANGE": "Olive",
        "BLUE": "Navy",
        "MAGENTA": "Purple",
        "WHITE": "Silver",
        "CYAN": "Teal",
        "BOLD BLACK": "Grey",
        "BOLD RED": "Red",
        "BOLD GREEN": "Lime",
        "YELLOW": "Yellow",
        "BOLD YELLOW": "Yellow",
        "BOLD BLUE": "Blue",
        "BOLD MAGENTA": "Fuchsia",
        "BOLD CYAN": "Aqua",
        "BOLD": "White",
        "BOLD WHITE": "White",
        "RGB000": "Black",
        "RGB001": "Navy Blue",
        "RGB002": "Dark Blue",
        "RGB003": "Blue",
        "RGB004": "Blue",
        "RGB005": "Blue",
        "RGB010": "Dark Green",
        "RGB011": "Deep Sky Blue",
        "RGB012": "Deep Sky Blue",
        "RGB013": "Deep Sky Blue",
        "RGB014": "Cobalt/Dodger Blue",
        "RGB015": "Dodger Blue",
        "RGB020": "Green",
        "RGB021": "Spring Green",
        "RGB022": "Turquoise",
        "RGB023": "Deep Sky Blue",
        "RGB024": "Deep Sky Blue",
        "RGB025": "Dodger Blue",
        "RGB030": "Green",
        "RGB031": "Spring Green",
        "RGB032": "Dark Cyan",
        "RGB033": "Light Sea Green",
        "RGB034": "Deep Sky Blue",
        "RGB035": "Deep Sky Blue",
        "RGB040": "Green",
        "RGB041": "Spring Green",
        "RGB042": "Spring Green",
        "RGB043": "Cyan",
        "RGB044": "Dark Turquoise",
        "RGB045": "Turquoise",
        "RGB050": "Green",
        "RGB051": "Spring Green",
        "RGB052": "Spring Green",
        "RGB053": "Medium Spring Green",
        "RGB054": "Cyan",
        "RGB055": "Cyan",
        "RGB100": "Dark Red",
        "RGB101": "Deep Pink",
        "RGB102": "Purple",
        "RGB103": "Purple",
        "RGB104": "Purple",
        "RGB105": "Blue Violet",
        "RGB110": "Orange",
        "RGB111": "Dark Grey",
        "RGB112": "Medium Purple",
        "RGB113": "Slate Blue",
        "RGB114": "Slate Blue",
        "RGB115": "Royal Blue",
        "RGB120": "Chartreuse",
        "RGB121": "Dark Sea Green",
        "RGB122": "Pale Turquoise",
        "RGB123": "Steel Blue",
        "RGB124": "Steel Blue",
        "RGB125": "Cornflower Blue",
        "RGB130": "Chartreuse",
        "RGB131": "Dark Sea Green",
        "RGB132": "Cadet Blue",
        "RGB133": "Cadet Blue",
        "RGB134": "Sky Blue",
        "RGB135": "Steel Blue",
        "RGB140": "Chartreuse",
        "RGB141": "Pale Green",
        "RGB142": "Sea Green",
        "RGB143": "Aquamarine",
        "RGB144": "Medium Turquoise",
        "RGB145": "Steel Blue",
        "RGB150": "Chartreuse",
        "RGB151": "Sea Green",
        "RGB152": "Sea Green",
        "RGB153": "Sea Green",
        "RGB154": "Aquamarine",
        "RGB155": "Dark Slate Gray",
        "RGB200": "Dark Red",
        "RGB201": "Deep Pink",
        "RGB202": "Dark Magenta",
        "RGB203": "Dark Magenta",
        "RGB204": "Dark Violet",
        "RGB205": "Purple",
        "RGB210": "Orange",
        "RGB211": "Light Pink",
        "RGB212": "Plum",
        "RGB213": "Medium Purple",
        "RGB214": "Medium Purple",
        "RGB215": "Slate Blue",
        "RGB220": "Yellow",
        "RGB221": "Wheat",
        "RGB222": "Grey",
        "RGB223": "Light Slate Grey",
        "RGB224": "Medium Purple",
        "RGB225": "Light Slate Blue",
        "RGB230": "Yellow",
        "RGB231": "Dark Olive Green",
        "RGB232": "Dark Sea Green",
        "RGB233": "Light Sky Blue",
        "RGB234": "Light Sky Blue",
        "RGB235": "Sky Blue",
        "RGB240": "Chartreuse",
        "RGB241": "Dark Olive Green",
        "RGB242": "Pale Green",
        "RGB243": "Dark Sea Green",
        "RGB244": "Dark Slate Gray",
        "RGB245": "Sky Blue",
        "RGB250": "Chartreuse",
        "RGB251": "Light Green",
        "RGB252": "Light Green",
        "RGB253": "Pale Green",
        "RGB254": "Aquamarine",
        "RGB255": "Dark Slate Gray",
        "RGB300": "Red",
        "RGB301": "Deep Pink",
        "RGB302": "Medium Violet Red",
        "RGB303": "Magenta",
        "RGB304": "Dark Violet",
        "RGB305": "Purple",
        "RGB310": "Dark Orange",
        "RGB311": "Indian Red",
        "RGB312": "Hot Pink",
        "RGB313": "Medium Orchid",
        "RGB314": "Medium Orchid",
        "RGB315": "Medium Purple",
        "RGB320": "Dark Goldenrod",
        "RGB321": "Light Salmon",
        "RGB322": "Rosy Brown",
        "RGB323": "Grey",
        "RGB324": "Medium Purple",
        "RGB325": "Medium Purple",
        "RGB330": "Gold",
        "RGB331": "Dark Khaki",
        "RGB332": "Navajo White",
        "RGB333": "Grey",
        "RGB334": "Light Steel Blue",
        "RGB335": "Light Steel Blue",
        "RGB340": "Yellow",
        "RGB341": "Dark Olive Green",
        "RGB342": "Dark Sea Green",
        "RGB343": "Dark Sea Green",
        "RGB344": "Light Cyan",
        "RGB345": "Light Sky Blue",
        "RGB350": "Green Yellow",
        "RGB351": "Dark Olive Green",
        "RGB352": "Pale Green",
        "RGB353": "Dark Sea Green",
        "RGB354": "Dark Sea Green",
        "RGB355": "Pale Turquoise",
        "RGB400": "Crimson/Red",
        "RGB401": "Deep Pink",
        "RGB402": "Deep Pink",
        "RGB403": "Magenta",
        "RGB404": "Magenta",
        "RGB405": "Magenta",
        "RGB410": "Dark Orange",
        "RGB411": "Indian Red",
        "RGB412": "Hot Pink",
        "RGB413": "Hot Pink",
        "RGB414": "Orchid",
        "RGB415": "Medium Orchid",
        "RGB420": "Orange",
        "RGB421": "Light Salmon/Bronze",
        "RGB422": "Light Pink",
        "RGB423": "Pink",
        "RGB424": "Plum",
        "RGB425": "Violet",
        "RGB430": "Gold",
        "RGB431": "Light Goldenrod",
        "RGB432": "Tan",
        "RGB433": "Misty Rose",
        "RGB434": "Thistle",
        "RGB435": "Plum",
        "RGB440": "Yellow",
        "RGB441": "Khaki",
        "RGB442": "Light Goldenrod",
        "RGB443": "Light Yellow",
        "RGB444": "Grey",
        "RGB445": "Light Steel Blue",
        "RGB450": "Yellow",
        "RGB451": "Dark Olive Green",
        "RGB452": "Dark Olive Green",
        "RGB453": "Dark Sea Green",
        "RGB454": "Honeydew",
        "RGB455": "Light Cyan",
        "RGB500": "Red",
        "RGB501": "Deep Pink",
        "RGB502": "Deep Pink",
        "RGB503": "Deep Pink",
        "RGB504": "Magenta",
        "RGB505": "Magenta",
        "RGB510": "Orangered",
        "RGB511": "Indian Red",
        "RGB512": "Indian Red",
        "RGB513": "Hot Pink",
        "RGB514": "Hot Pink",
        "RGB515": "Medium Orchid",
        "RGB520": "Dark Orange",
        "RGB521": "Salmon",
        "RGB522": "Light Coral",
        "RGB523": "Pale Violet Red",
        "RGB524": "Orchid",
        "RGB525": "Orchid",
        "RGB530": "Orange",
        "RGB531": "Sandy Brown",
        "RGB532": "Light Salmon",
        "RGB533": "Light Pink",
        "RGB534": "Pink",
        "RGB535": "Plum",
        "RGB540": "Gold",
        "RGB541": "Light Goldenrod",
        "RGB542": "Light Goldenrod",
        "RGB543": "Navajo White",
        "RGB544": "Misty Rose",
        "RGB545": "Thistle",
        "RGB550": "Yellow",
        "RGB551": "Light Goldenrod",
        "RGB552": "Khaki",
        "RGB553": "Wheat",
        "RGB554": "Corn Silk",
        "RGB555": "White",
        "mono00": "Grey 3",
        "mono01": "Grey 7",
        "mono02": "Grey 11",
        "mono03": "Grey 15",
        "mono04": "Grey 19",
        "mono05": "Grey 23",
        "mono06": "Grey 27",
        "mono07": "Grey 30",
        "mono08": "Grey 35",
        "mono09": "Grey 39",
        "mono10": "Grey 32",
        "mono11": "Grey 46",
        "mono12": "Grey 50",
        "mono13": "Grey 54",
        "mono14": "Grey 58",
        "mono15": "Grey 62",
        "mono16": "Grey 66",
        "mono17": "Grey 70",
        "mono18": "Grey 74",
        "mono19": "Grey 78",
        "mono20": "Grey 82",
        "mono21": "Grey 85",
        "mono22": "Grey 89",
        "mono23": "Grey 93"
      };
      //{ color: 'red', hex: '#EA4235', rgb: { r: 234, g: 66, b: 53 } },
      this.colorList = [];
      if (!element)
        throw new Error("AdvEditor must be a selector, element or jquery object");
      if (typeof element === "string") {
        this._element = document.querySelector(element);
        if (!this._element)
          throw new Error("Invalid selector for AdvEditor.");
      } else if (element instanceof $)
        this._element = element[0];
      else if (element instanceof HTMLElement)
        this._element = element;
      else
        throw new Error("AdvEditor must be a selector, element or jquery object");
      this.simple = !enabledAdvanced;
    }
    get id() {
      if (this._element) return this._element.id;
      return "";
    }
    get element() {
      return this._element;
    }
    get simple() {
      return this._simple;
    }
    set simple(value) {
      if (value === this._simple) return;
      this._simple = value;
      if (!this.tinymceExist) return;
      if (value)
        this.remove();
      else
        this.initialize();
    }
    clear() {
      if (!this.isSimple)
        tinymce.activeEditor.setContent("");
      else
        this._element.value = "";
    }
    get value() {
      if (!this.isSimple)
        return this.getFormattedText().replace(/(?:\r)/g, "");
      return this._element.value;
    }
    set value(value) {
      if (this.isSimple)
        this._element.value = value;
      else
        tinymce.activeEditor.setContent(value);
    }
    insert(value) {
      if (!this.isSimple) {
        value = htmlEncode(value);
        value = value.replace(/ /g, "&nbsp;");
        value = value.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
        value = value.replace(/(?:\r\n|\r|\n)/g, "<br/>");
        var content = this.getText();
        if (content === "\n") {
          tinymce.activeEditor.undoManager.transact(() => {
            tinymce.activeEditor.setContent(value);
          });
        } else {
          if (!content.endsWith("\n"))
            value = "<br>" + value;
          tinymce.activeEditor.undoManager.transact(() => {
            tinymce.activeEditor.dom.add(tinymce.activeEditor.getBody(), "span", {}, value);
          });
        }
      } else
        insertValue(this._element, value);
      {
      }
    }
    get tinymceExist() {
      return typeof tinymce !== "undefined";
    }
    get isSimple() {
      return this._simple || !this.tinymceExist;
    }
    loadColors() {
      var _dColors = getColors();
      var c, color, r, g, b, idx, _bold = [], bl;
      this._ColorTable = [];
      this._colors = {};
      var clientColors = client.getOption("colors") || [];
      color = new RGBColor(clientColors[0] || _dColors[0]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BLACK";
      this._ColorTable.push(color, "BLACK");
      color = new RGBColor(clientColors[1] || _dColors[1]).toHex().substr(1).toUpperCase();
      this._colors[color] = "RED";
      this._ColorTable.push(color, "RED");
      color = new RGBColor(clientColors[2] || _dColors[2]).toHex().substr(1).toUpperCase();
      this._colors[color] = "GREEN";
      this._ColorTable.push(color, "GREEN");
      color = new RGBColor(clientColors[3] || _dColors[3]).toHex().substr(1).toUpperCase();
      this._colors[color] = "ORANGE";
      this._ColorTable.push(color, "ORANGE");
      color = new RGBColor(clientColors[4] || _dColors[4]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BLUE";
      this._ColorTable.push(color, "BLUE");
      color = new RGBColor(clientColors[5] || _dColors[5]).toHex().substr(1).toUpperCase();
      this._colors[color] = "MAGENTA";
      this._ColorTable.push(color, "MAGENTA");
      color = new RGBColor(clientColors[6] || _dColors[6]).toHex().substr(1).toUpperCase();
      this._colors[color] = "CYAN";
      this._ColorTable.push(color, "CYAN");
      color = new RGBColor(clientColors[7] || _dColors[7]).toHex().substr(1).toUpperCase();
      this._colors[color] = "WHITE";
      this._ColorTable.push(color, "WHITE");
      color = new RGBColor(clientColors[8] || _dColors[8]).toHex().substr(1).toUpperCase();
      this._colors[color] = "mono11";
      this._ColorTable.push(color, "BOLD BLACK");
      _bold.push(color);
      color = new RGBColor(clientColors[9] || _dColors[9]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BOLD%^%^RED";
      this._ColorTable.push(color, "BOLD RED");
      _bold.push(color);
      color = new RGBColor(clientColors[10] || _dColors[10]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BOLD%^%^GREEN";
      this._ColorTable.push(color, "BOLD GREEN");
      _bold.push(color);
      color = new RGBColor(clientColors[11] || _dColors[11]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BOLD%^%^YELLOW";
      this._ColorTable.push(color, "BOLD YELLOW");
      _bold.push(color);
      color = new RGBColor(clientColors[11] || _dColors[11]).toHex().substr(1).toUpperCase();
      this._colors[color] = "YELLOW";
      this._ColorTable.push(color, "YELLOW");
      _bold.push(color);
      color = new RGBColor(clientColors[12] || _dColors[12]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BOLD%^%^BLUE";
      this._ColorTable.push(color, "BOLD BLUE");
      _bold.push(color);
      color = new RGBColor(clientColors[13] || _dColors[13]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BOLD%^%^MAGENTA";
      this._ColorTable.push(color, "BOLD MAGENTA");
      _bold.push(color);
      color = new RGBColor(clientColors[14] || _dColors[14]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BOLD%^%^CYAN";
      this._ColorTable.push(color, "BOLD CYAN");
      _bold.push(color);
      color = new RGBColor(clientColors[15] || _dColors[15]).toHex().substr(1).toUpperCase();
      this._colors[color] = "BOLD%^%^WHITE";
      this._ColorTable.push(color, "BOLD WHITE");
      for (r = 0; r < 6; r++) {
        for (g = 0; g < 6; g++) {
          for (b = 0; b < 6; b++) {
            idx = `RGB${r}${g}${b}`;
            color = "";
            c = 0;
            c = r * 40 + 55;
            if (c < 16)
              color += "0";
            color += c.toString(16);
            c = 0;
            c = g * 40 + 55;
            if (c < 16)
              color += "0";
            color += c.toString(16);
            c = 0;
            c = b * 40 + 55;
            if (c < 16)
              color += "0";
            color += c.toString(16);
            color = color.toUpperCase();
            if (!this._colors[color])
              this._colors[color] = idx;
            this.colorList.push({ color: idx, hex: "#" + color, rgb: { r: r * 40 + 55, g: g * 40 + 55, b: b * 40 + 55 } });
          }
        }
      }
      for (r = 232; r <= 255; r++) {
        g = (r - 232) * 10 + 8;
        if (g < 16)
          g = "0" + g.toString(16).toUpperCase();
        else
          g = g.toString(16).toUpperCase();
        g = g + g + g;
        if (r < 242) {
          if (!this._colors[g])
            this._colors[g] = "mono0" + (r - 232);
        } else {
          if (!this._colors[g])
            this._colors[g] = "mono" + (r - 232);
        }
      }
      for (b = 0, bl = _bold.length; b < bl; b++) {
        this._colors["B" + _bold[b]] = this._colors[this.nearestHex("#" + _bold[b]).substr(1)].toUpperCase();
      }
      this._colors["BFFFFFF"] = "RGB555";
      tinymce.activeEditor.options.set("color_map", this._ColorTable);
    }
    initPlugins() {
      if (false) return;
      const _editor = this;
      tinymce.PluginManager.add("pinkfishtextcolor", function(editor2, url) {
        const fallbackColor = "#000000";
        const _colors = ["000000", "BLACK", "800000", "RED", "008000", "GREEN", "808000", "ORANGE", "0000EE", "BLUE", "800080", "MAGENTA", "008080", "CYAN", "BBBBBB", "WHITE", "808080", "BOLD BLACK", "FF0000", "BOLD RED", "00FF00", "BOLD GREEN", "FFFF00", "YELLOW", "5C5CFF", "BOLD YELLOW", "5C5CFF", "BOLD BLUE", "FF00FF", "BOLD MAGENTA", "00FFFF", "BOLD CYAN", "FFFFFF", "BOLD WHITE"];
        let _lastButton;
        const Cell = (initial) => {
          let value = initial;
          const get = () => {
            return value;
          };
          const set = (v) => {
            value = v;
          };
          return {
            get,
            set
          };
        };
        let _forecolor = Cell(fallbackColor);
        let _backcolor = Cell(fallbackColor);
        const getCurrentColor = (editor3, format) => {
          let color;
          editor3.dom.getParents(editor3.selection.getStart(), (elm) => {
            let value;
            if (value = elm.style[format === "forecolor" ? "color" : "background-color"]) {
              color = color ? color : value;
            }
          });
          return color;
        };
        const applyFormat = (editor3, format, value) => {
          editor3.undoManager.transact(() => {
            editor3.focus();
            editor3.formatter.apply(format, { value });
            editor3.nodeChanged();
          });
        };
        const removeFormat = (editor3, format) => {
          editor3.undoManager.transact(() => {
            editor3.focus();
            editor3.formatter.remove(format, { value: null }, null, true);
            editor3.nodeChanged();
          });
        };
        const registerCommands = (editor3) => {
          editor3.addCommand("mceApplyTextcolor", (format, value) => {
            applyFormat(editor3, format, value);
          });
          editor3.addCommand("mceRemoveTextcolor", (format) => {
            removeFormat(editor3, format);
          });
          editor3.addCommand("mceSetTextcolor", (name, color) => {
            if (_lastButton) {
              setIconColor(_lastButton, name === "forecolor" ? "pinkfishforecolor" : name, color);
              (name === "forecolor" ? _forecolor : _backcolor).set(color);
            }
          });
        };
        const getAdditionalColors = (hasCustom) => {
          const type = "choiceitem";
          const remove = {
            type,
            text: "Remove color",
            icon: "color-swatch-remove-color",
            value: "remove"
          };
          const custom = {
            type,
            text: "Custom color",
            icon: "color-picker",
            value: "custom"
          };
          return hasCustom ? [
            remove,
            custom
          ] : [remove];
        };
        const applyColor = (editor3, format, value, onChoice) => {
          if (value === "custom") {
            _editor.openColorDialog(format, "");
          } else if (value === "remove") {
            onChoice("");
            editor3.execCommand("mceRemoveTextcolor", format);
          } else {
            onChoice(value);
            editor3.execCommand("mceApplyTextcolor", format, value);
          }
        };
        const mapColors = (colorMap) => {
          const colors = [];
          for (let i = 0; i < colorMap.length; i += 2) {
            colors.push({
              text: colorMap[i + 1],
              value: "#" + colorMap[i],
              type: "choiceitem"
            });
          }
          return colors;
        };
        const getColors2 = (colors, hasCustom) => mapColors(_colors).concat(getAdditionalColors(hasCustom));
        const getFetch = (colors, hasCustom) => (callback) => {
          callback(getColors2(colors, hasCustom));
        };
        const setIconColor = (splitButtonApi, name, newColor) => {
          const id = name === "pinkfishforecolor" ? "tox-icon-text-color__color" : "tox-icon-highlight-bg-color__color";
          splitButtonApi.setIconFill(id, newColor);
        };
        const registerTextColorButton = (editor3, name, format, tooltip, lastColor) => {
          editor3.ui.registry.addSplitButton(name, {
            tooltip,
            presets: "color",
            icon: name === "pinkfishforecolor" ? "text-color" : "highlight-bg-color",
            select: (value) => {
              const optCurrentRgb = new RGBColor(getCurrentColor(editor3, format) || "").toHex();
              return optCurrentRgb.toLowerCase() === value.toLowerCase();
            },
            columns: 5,
            fetch: getFetch(_colors, true),
            onAction: (_splitButtonApi) => {
              _lastButton = _splitButtonApi;
              applyColor(editor3, format, lastColor.get(), () => {
              });
            },
            onItemAction: (_splitButtonApi, value) => {
              _lastButton = _splitButtonApi;
              applyColor(editor3, format, value, (newColor) => {
                lastColor.set(newColor);
                editor3.fire("TextColorChange", {
                  name,
                  color: newColor
                });
              });
            },
            onSetup: (splitButtonApi) => {
              setIconColor(splitButtonApi, name, lastColor.get());
              const handler = (e) => {
                if (e.name === name) {
                  setIconColor(splitButtonApi, e.name, e.color);
                }
              };
              editor3.on("TextColorChange", handler);
              return () => {
                editor3.off("TextColorChange", handler);
              };
            }
          });
        };
        const registerTextColorMenuItem = (editor3, name, format, text) => {
          editor3.ui.registry.addNestedMenuItem(name, {
            text,
            icon: name === "pinkfishforecolor" ? "text-color" : "highlight-bg-color",
            getSubmenuItems: () => [
              {
                type: "fancymenuitem",
                fancytype: "colorswatch",
                onAction: (data) => {
                  applyColor(editor3, format, data.value, () => {
                  });
                }
              }
            ]
          });
        };
        registerCommands(editor2);
        registerTextColorButton(editor2, "pinkfishforecolor", "forecolor", "Text color", _forecolor);
        registerTextColorButton(editor2, "pinkfishbackcolor", "hilitecolor", "Background color", _backcolor);
        registerTextColorMenuItem(editor2, "pinkfishforecolor", "forecolor", "Text color");
        registerTextColorMenuItem(editor2, "pinkfishbackcolor", "hilitecolor", "Background color");
      });
      tinymce.PluginManager.add("pinkfish", function(editor2) {
        editor2.addCommand("mceApplyFormat", (format, value) => {
          editor2.undoManager.transact(() => {
            editor2.focus();
            _editor.clearReverse($(".reverse", $(editor2.getDoc()).contents()));
            if (value)
              editor2.formatter.apply(format, { value });
            else
              editor2.formatter.apply(format);
            _editor.addReverse($(".reverse", $(editor2.getDoc()).contents()));
            editor2.nodeChanged();
          });
        });
        editor2.addCommand("mceRemoveFormat", (format) => {
          editor2.undoManager.transact(() => {
            editor2.focus();
            _editor.clearReverse($(".reverse", $(editor2.getDoc()).contents()));
            editor2.formatter.remove(format, { value: null }, null, true);
            _editor.addReverse($(".reverse", $(editor2.getDoc()).contents()));
            editor2.nodeChanged();
          });
        });
        function buttonPostRender(buttonApi, format) {
          editor2.on("init", () => {
            editor2.formatter.formatChanged(format, function(state) {
              buttonApi.setActive(state);
            });
          });
        }
        function toggleFormat(format) {
          if (!format || typeof format !== "string") format = this.settings.format;
          tinymce.activeEditor.undoManager.transact(() => {
            $("#tinymce", tinymce.activeEditor.getDoc()).removeClass("animate");
            this.clearReverse($(".reverse", $(editor2.getDoc()).contents()));
            editor2.execCommand("mceToggleFormat", false, format);
            this.addReverse($(".reverse", $(editor2.getDoc()).contents()));
            $("#tinymce", tinymce.activeEditor.getDoc()).addClass("animate");
          });
        }
        editor2.ui.registry.addIcon("overline", '<i class="mce-i-overline"></i>');
        editor2.ui.registry.addIcon("dblunderline", '<i class="mce-i-dblunderline"></i>');
        editor2.ui.registry.addIcon("flash", '<i class="mce-i-flash"></i>');
        editor2.ui.registry.addIcon("reverse", '<i class="mce-i-reverse"></i>');
        editor2.ui.registry.addIcon("pasteformatted", '<i class="mce-i-pasteformatted"></i>');
        editor2.ui.registry.addIcon("copyformatted", '<i class="mce-i-copyformatted"></i>');
        editor2.ui.registry.addSplitButton("send", {
          icon: "arrow-right",
          tooltip: "Send to mud",
          onAction: () => {
            client.sendCommand(_editor.getFormattedText().replace(/(?:\r)/g, ""));
            if (client.getOption("editorClearOnSend"))
              tinymce.activeEditor.setContent("");
            if (client.getOption("editorCloseOnSend"))
              _editor.emit("close");
          },
          onItemAction: (api, value) => {
            switch (value) {
              case "formatted":
                client.sendCommand(_editor.getFormattedText().replace(/(?:\r)/g, ""));
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
              case "text":
                client.sendCommand(_editor.getText().replace(/(?:\r)/g, ""));
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
              case "formattednoecho":
                client.sendBackground(_editor.getFormattedText().replace(/(?:\r)/g, ""), true);
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
              case "textnoecho":
                client.sendBackground(_editor.getText().replace(/(?:\r)/g, ""), true);
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
              case "formattedverbatim":
                client.send(_editor.getFormattedText().replace(/(?:\r)/g, ""));
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
              case "textverbatim":
                client.send(_editor.getText().replace(/(?:\r)/g, ""));
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
              case "rawformatted":
                client.sendRaw(_editor.getFormattedText().replace(/(?:\r)/g, ""));
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
              case "rawtext":
                client.sendRaw(_editor.getText().replace(/(?:\r)/g, ""));
                if (client.getOption("editorClearOnSend"))
                  tinymce.activeEditor.setContent("");
                if (client.getOption("editorCloseOnSend"))
                  _editor.emit("close");
                break;
            }
          },
          fetch: (callback) => {
            callback([
              {
                text: "Formatted as commands",
                value: "formatted",
                type: "choiceitem"
              },
              {
                text: "Text as commands",
                value: "text",
                type: "choiceitem"
              },
              {
                text: "Formatted as commands (No echo)",
                value: "formattednoecho",
                type: "choiceitem"
              },
              {
                text: "Text as commands (No echo)",
                value: "textnoecho",
                type: "choiceitem"
              },
              {
                text: "Formatted verbatim (No echo)",
                value: "formattedverbatim",
                type: "choiceitem"
              },
              {
                text: "Text verbatim (No echo)",
                value: "textverbatim",
                type: "choiceitem"
              },
              {
                text: "Raw formatted (No echo)",
                value: "rawformatted",
                type: "choiceitem"
              },
              {
                text: "Raw text (No echo)",
                value: "rawtext",
                type: "choiceitem"
              }
            ]);
          }
        });
        editor2.ui.registry.addButton("append", {
          icon: "browse",
          tooltip: "Append file...",
          onAction: () => _editor.appendFile()
        });
        editor2.ui.registry.addButton("clear", {
          icon: "remove",
          tooltip: "Clear",
          onAction: () => _editor.clear()
        });
        editor2.ui.registry.addButton("pasteformatted", {
          icon: "pasteformatted",
          tooltip: "Paste formatted",
          onAction: (buttonApi) => {
            pasteText().then((text) => {
              _editor.insertFormatted(text || "");
            }).catch((err) => {
              if (client.enableDebug)
                client.debug(err);
              if (err.message && err.message === "Permission not granted!")
                alert("Paste permission not granted.");
              else
                alert("Paste not supported.");
            });
          }
        });
        editor2.ui.registry.addButton("pasteastext", {
          icon: "paste-text",
          tooltip: "Paste as text",
          onAction: (buttonApi) => {
            pasteText().then((text) => {
              tinymce.activeEditor.execCommand("mceInsertContent", false, (text || "").replace(/(\r\n|\r|\n)/g, "<br/>").replaceAll("  ", "&nbsp;&nbsp;"));
            }).catch((err) => {
              if (client.enableDebug)
                client.debug(err);
              if (err.message && err.message === "Permission not granted!")
                alert("Paste permission not granted.");
              else
                alert("Paste not supported.");
            });
          }
        });
        editor2.ui.registry.addButton("copyformatted", {
          icon: "copyformatted",
          tooltip: "Copy formatted",
          onAction: (buttonApi) => copyText(_editor.getFormattedSelection().replace(/(?:\r)/g, ""))
        });
        editor2.ui.registry.addToggleButton("overline", {
          icon: "overline",
          tooltip: "Overline",
          format: "overline",
          onAction: (buttonApi) => toggleFormat("overline"),
          onSetup: (buttonApi) => buttonPostRender(buttonApi, "overline")
        });
        editor2.ui.registry.addToggleButton("dblunderline", {
          icon: "dblunderline",
          tooltip: "Double Underline",
          format: "dblunderline",
          onAction: (buttonApi) => toggleFormat("dblunderline"),
          onSetup: (buttonApi) => buttonPostRender(buttonApi, "dblunderline")
        });
        editor2.ui.registry.addToggleButton("flash", {
          tooltip: "Flash",
          format: "flash",
          icon: "flash",
          onAction: (buttonApi) => toggleFormat("flash"),
          onSetup: (buttonApi) => buttonPostRender(buttonApi, "flash")
        });
        editor2.ui.registry.addToggleButton("reverse", {
          icon: "reverse",
          tooltip: "Reverse",
          format: "reverse",
          onAction: (buttonApi) => toggleFormat("reverse"),
          onSetup: (buttonApi) => buttonPostRender(buttonApi, "reverse")
        });
        editor2.ui.registry.addMenuItem("style", {
          text: "Style",
          menu: [
            {
              image: "overline",
              text: "Overline",
              format: "overline",
              onclick: toggleFormat,
              onpostrender: buttonPostRender
            },
            {
              image: "dblunderline",
              text: "Double Underline",
              format: "dblunderline",
              onclick: toggleFormat,
              onpostrender: buttonPostRender
            },
            {
              text: "Flash",
              format: "flash",
              image: "flash",
              onclick: toggleFormat,
              onpostrender: buttonPostRender
            },
            {
              image: "reverse",
              text: "Reverse",
              format: "reverse",
              onclick: toggleFormat,
              onpostrender: buttonPostRender
            }
          ]
        });
        editor2.ui.registry.addMenuItem("overline", {
          image: "overline",
          text: "Overline",
          format: "overline",
          onclick: toggleFormat,
          onpostrender: buttonPostRender
        });
        editor2.ui.registry.addMenuItem("dblunderline", {
          image: "dblunderline",
          text: "Double Underline",
          format: "dblunderline",
          onclick: toggleFormat,
          onpostrender: buttonPostRender
        });
        editor2.ui.registry.addMenuItem("flash", {
          text: "Flash",
          format: "flash",
          image: "flash",
          onclick: toggleFormat,
          onpostrender: buttonPostRender
        });
        editor2.ui.registry.addMenuItem("reverse", {
          image: "reverse",
          text: "Reverse",
          format: "reverse",
          onclick: toggleFormat,
          onpostrender: buttonPostRender
        });
        editor2.on("Change", () => {
          _editor.addReverse($(".reverse", $(editor2.getDoc()).contents()));
        });
        editor2.addShortcut("ctrl+s", "Strikethrough", () => {
          toggleFormat("strikethrough");
        });
        editor2.addShortcut("ctrl+o", "Overline", () => {
          toggleFormat("overline");
        });
        editor2.addShortcut("ctrl+d", "Double Underline", () => {
          toggleFormat("dblunderline");
        });
        editor2.addShortcut("ctrl+f", "Flash", () => {
          toggleFormat("flash");
        });
        editor2.addShortcut("ctrl+r", "Reverse", () => {
          toggleFormat("reverse");
        });
      });
    }
    clearReverse(els, c) {
      els.each(
        function() {
          if (!$(this).data("reverse"))
            return;
          if (c && $(this).hasClass("reverse"))
            return;
          var back, fore;
          if (c) {
            back = $(this).css("color");
            fore = $(this).css("background-color");
          } else {
            fore = $(this).parent().css("color");
            back = $(this).parent().css("background-color");
          }
          if (back === "black")
            back = "";
          if (fore === "rgba(0, 0, 0, 0)")
            fore = "black";
          $(this).css("color", fore);
          $(this).css("background-color", back);
          if ($(this).children().length)
            this.clearReverse($(this).children(), true);
        }
      );
    }
    addReverse(els, c) {
      els.each(
        function() {
          if (c && $(this).hasClass("reverse"))
            return;
          var back, fore;
          if (c) {
            back = $(this).css("color");
            fore = $(this).css("background-color");
          } else {
            back = $(this).parent().css("color");
            fore = $(this).parent().css("background-color");
          }
          if (back === "rgba(0, 0, 0, 0)")
            back = "black";
          if (fore === "rgba(0, 0, 0, 0)")
            fore = "black";
          if ($(this).children().length) {
            this.clearReverse($(this).children(), true);
            this.addReverse($(this).children(), true);
          }
          $(this).css("color", fore);
          $(this).css("background-color", back);
          $(this).data("reverse", true);
        }
      );
    }
    colorCell(color, idx) {
      var cell = '<td class="mce-grid-cell' + (color === "transparent" ? " mce-colorbtn-trans" : "") + '">';
      cell += '<div id="' + idx + '"';
      cell += ' data-mce-color="' + color + '"';
      cell += ' role="option"';
      cell += ' tabIndex="-1"';
      cell += ' style="background-color: ' + (color === "transparent" ? color : "#" + color) + '"';
      if (this.colorNames[idx])
        cell += ' title="' + idx + ", " + this.colorNames[idx] + '">';
      else
        cell += ' title="' + idx + '">';
      if (color === "transparent") cell += "&#215;";
      cell += "</div>";
      cell += "</td>";
      return cell;
    }
    openColorDialog(type, color) {
      if (!this._colorDialog) {
        this._colorDialog = new Dialog({ noFooter: true, title: '<i class="fas fa-palette"></i> Pick color', center: true, resizable: false, moveable: false, maximizable: false, width: 380, height: 340 });
        this._colorDialog.body.style.alignItems = "center";
        this._colorDialog.body.style.display = "flex";
        let c;
        let cl;
        let r;
        let g;
        let b;
        let idx;
        var html = '<table style="margin : auto !important;" class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody><tr>';
        for (c = 0, cl = this._ColorTable.length; c < cl; c += 2) {
          html += this.colorCell(this._ColorTable[c], this._ColorTable[c + 1]);
          if (c / 2 % 6 === 5)
            html += '<td class="mce-grid-cell"></td>';
        }
        html += '<td class="mce-grid-cell"></td>';
        html += this.colorCell("transparent", "No color");
        html += "</tr><tr><td></td></tr>";
        var html2 = "";
        for (r = 0; r < 6; r++) {
          if (g < 3)
            html += "<tr>";
          else
            html2 += "<tr>";
          for (g = 0; g < 6; g++) {
            for (b = 0; b < 6; b++) {
              idx = `RGB${r}${g}${b}`;
              color = "";
              c = 0;
              c = r * 40 + 55;
              if (c < 16)
                color += "0";
              color += c.toString(16);
              c = 0;
              c = g * 40 + 55;
              if (c < 16)
                color += "0";
              color += c.toString(16);
              c = 0;
              c = b * 40 + 55;
              if (c < 16)
                color += "0";
              color += c.toString(16);
              color = color.toUpperCase();
              if (g < 3)
                html += this.colorCell(color, idx);
              else
                html2 += this.colorCell(color, idx);
            }
            if (g === 2)
              html += "</tr>";
            else if (g < 3)
              html += '<td class="mce-grid-cell"></td>';
            else if (g < 5)
              html2 += '<td class="mce-grid-cell"></td>';
          }
          if (g < 3)
            html += "</tr>";
          else
            html2 += "</tr>";
        }
        html += html2;
        html += "<tr><td></td></tr><tr>";
        for (r = 232; r <= 255; r++) {
          g = (r - 232) * 10 + 8;
          if (g < 16)
            g = "0" + g.toString(16).toUpperCase();
          else
            g = g.toString(16).toUpperCase();
          g = g + g + g;
          html += this.colorCell(g, color);
          if (r === 237 || r === 249)
            html += '<td class="mce-grid-cell"></td>';
          if (r === 243)
            html += "</tr><tr>";
        }
        html += "</tr></tbody></table>";
        html += `<style>
.mce-colorbtn-trans div {line-height: 14px;overflow: hidden;}
.mce-grid td.mce-grid-cell div{border:1px solid #c5c5c5;width:15px;height:15px;margin:0;cursor:pointer}.mce-grid td.mce-grid-cell div:focus{border-color:#91bbe9}.mce-grid td.mce-grid-cell div[disabled]{cursor:not-allowed}            
.mce-grid{border-spacing:2px;border-collapse:separate}.mce-grid a{display:block;border:1px solid transparent}.mce-grid a:hover,.mce-grid a:focus{border-color:#91bbe9}.mce-grid-border{margin:0 4px 0 4px}.mce-grid-border a{border-color:#c5c5c5;width:13px;height:13px}.mce-grid-border a:hover,.mce-grid-border a.mce-active{border-color:#91bbe9;background:#bdd6f2}            
            </style>`;
        this._colorDialog.body.innerHTML = html;
        let cells = this._colorDialog.body.querySelectorAll("div");
        for (c = 0, cl = cells.length; c < cl; c++)
          cells[c].addEventListener("click", (e) => {
            color = e.currentTarget.dataset.mceColor;
            if (color === "transparent")
              tinymce.activeEditor.execCommand("mceRemoveFormat", this._colorDialog.dialog.dataset.type);
            else
              tinymce.activeEditor.execCommand("mceApplyFormat", this._colorDialog.dialog.dataset.type, "#" + color);
            tinymce.activeEditor.execCommand("mceSetTextcolor", this._colorDialog.dialog.dataset.type, "#" + color);
            this._colorDialog.close();
          });
      }
      this._colorDialog.dialog.dataset.type = type;
      this._colorDialog.showModal();
    }
    appendFile() {
      openFileDialog("Append file(s)", true).then((files) => {
        for (var f = 0, fl = files.length; f < fl; f++)
          readFile(files[f]).then((contents) => {
            this.insert(contents);
          }).catch(client.error);
      }).catch(() => {
      });
    }
    insertFormatted(text) {
      if (this.isSimple)
        insertValue(this._element, text);
      else
        tinymce.activeEditor.execCommand("insertHTML", false, pinkfishToHTML(text).replace(/(\r\n|\r|\n)/g, "<br/>"));
    }
    setFormatted(text) {
      if (this.isSimple)
        this._element.value = text;
      else {
        tinymce.activeEditor.setContent(pinkfishToHTML(text).replace(/(\r\n|\r|\n)/g, "<br/>"), { format: "html" });
      }
    }
    buildHTMLStack(els) {
      var tag, $el, t, tl;
      var stack = [];
      for (var e = 0, el = els.length; e < el; e++) {
        $el = $(els[e]);
        tag = $el.prop("tagName");
        if (tag === "EM" || tag === "I")
          tag = "ITALIC";
        else if (tag === "STRONG" || tag === "B")
          tag = "BOLD";
        if (!tag)
          stack.push('"' + $el.text() + '"');
        else if (tag === "SPAN") {
          if (els[e].className != "") {
            tag = els[e].className.toUpperCase().split(/\s+/g);
            tl = tag.length;
            for (t = 0; t < tl; t++) {
              if (tag[t] === "NOFLASH")
                stack.push("FLASH");
              else if (tag[t].length > 0)
                stack.push(tag[t]);
            }
            stack = stack.concat(this.buildHTMLStack($el.contents()));
            for (t = 0; t < tl; t++) {
              if (tag[t] === "NOFLASH")
                stack.push("FLASH");
              else if (tag[t].length > 0)
                stack.push("/" + tag[t]);
            }
            continue;
          } else if ($el.css("text-decoration") === "line-through")
            tag = "STRIKEOUT";
          else if ($el.css("text-decoration") === "underline")
            tag = "UNDERLINE";
          else if ($el.data("mce-style")) {
            tag = $el.data("mce-style").toUpperCase().split(";");
            tl = tag.length;
            for (t = 0; t < tl; t++) {
              if (tag[t].endsWith("INHERIT") || tag[t].endsWith("BLACK"))
                continue;
              tag[t] = tag[t].trim();
              tag[t] = tag[t].replace("BACKGROUND:", "BACKGROUND-COLOR:");
              if (tag[t].length > 0)
                stack.push(tag[t]);
            }
            stack = stack.concat(this.buildHTMLStack($el.contents()));
            for (t = 0; t < tl; t++) {
              if (tag[t].endsWith("INHERIT") || tag[t].endsWith("BLACK"))
                continue;
              if (tag[t].length > 0)
                stack.push("/" + tag[t].trim());
            }
            continue;
          } else if ($el.css("color") || $el.css("background-color") || $el.css("background")) {
            tag = [];
            if ($el.css("color"))
              tag.push("COLOR: " + new RGBColor($el.css("color")).toHex().toUpperCase());
            if ($el.css("background-color"))
              tag.push("BACKGROUND-COLOR: " + new RGBColor($el.css("background-color")).toHex().toUpperCase());
            if ($el.css("background"))
              tag.push("BACKGROUND-COLOR: " + new RGBColor($el.css("background")).toHex().toUpperCase());
            tl = tag.length;
            for (t = 0; t < tl; t++) {
              if (tag[t].length > 0)
                stack.push(tag[t].trim());
            }
            stack = stack.concat(this.buildHTMLStack($el.contents()));
            for (t = 0; t < tl; t++) {
              if (tag[t].length > 0)
                stack.push("/" + tag[t].trim());
            }
            continue;
          }
          stack.push(tag);
          stack = stack.concat(this.buildHTMLStack($el.contents()));
          stack.push("/" + tag);
        } else if (tag == "BR" && $el.data("mce-bogus"))
          stack.push("RESET");
        else {
          stack.push(tag);
          stack = stack.concat(this.buildHTMLStack($el.contents()));
          stack.push("/" + tag);
        }
      }
      return stack;
    }
    getFormattedSelection() {
      var nodes = tinymce.activeEditor.dom.getParents(tinymce.activeEditor.selection.getNode());
      var n = 0, nl = nodes.length;
      var start = "<html>";
      var end = "</html>";
      for (; n < nl; n++) {
        var tag = nodes[n].tagName;
        if (tag === "EM" || tag === "I" || tag === "STRONG" || tag === "B") {
          start += "<" + tag + ">";
          end = "</" + tag + ">" + end;
        } else if (tag === "SPAN") {
          start += "<" + tag;
          if (nodes[n].className != "")
            start += ' class="' + nodes[n].className + '"';
          var style = "";
          if (nodes[n].style.textDecoration != "")
            style += "text-decoration:" + nodes[n].style.textDecoration + ";";
          if (nodes[n].style.color != "")
            style += "color:" + nodes[n].style.color + ";";
          if (nodes[n].style.background != "")
            style += "background:" + nodes[n].style.background + ";";
          if (nodes[n].style.backgroundColor != "")
            style += "background-color:" + nodes[n].style.backgroundColor + ";";
          if (style.length > 0)
            start += ' style="' + style + '"';
          if (nodes[n].dataset && nodes[n].dataset.mceStyle)
            start += ' data-mce-style="' + nodes[n].dataset.mceStyle + '"';
          start += " >";
          end = "</" + tag + ">" + end;
        } else if (tag === "BODY") {
          start += "<" + tag + ">";
          end = "</" + tag + ">" + end;
          break;
        }
      }
      return this.formatHtml($(start + tinymce.activeEditor.selection.getContent({ format: "raw" }).replace(/<\/div><div>/g, "<br>") + end));
    }
    getFormattedText() {
      if (this.isSimple)
        return this._element.value;
      return this.formatHtml($("<html>" + this.getRaw().replace(/<\/div><div>/g, "<br>") + "</html>"));
    }
    getText() {
      if (this.isSimple)
        return this._element.value;
      return tinymce.activeEditor.getContent({ format: "text" });
    }
    // eslint-disable-next-line no-unused-vars
    getHTML() {
      if (this.isSimple)
        return this._element.value;
      return tinymce.activeEditor.getContent({ format: "html" });
    }
    getRaw() {
      if (this.isSimple)
        return this._element.value;
      return tinymce.activeEditor.getContent({ format: "raw" });
    }
    formatHtml(text) {
      var data = this.buildHTMLStack(text);
      var buffer = [];
      var codes = [];
      var color, d, dl, rgb;
      if (client.getOption("enableDebug"))
        client.debug("Advanced Editor Get Raw HTML: " + this.getRaw());
      for (d = data.length - 1; d >= 0; d--) {
        if (!data[d].startsWith('"') && data[d] != "BR" && data[d] != "RESET")
          data.pop();
        else
          break;
      }
      if (data[0] === "DIV")
        data.shift();
      for (d = 0, dl = data.length; d < dl; d++) {
        switch (data[d]) {
          case "BOLD":
          case "ITALIC":
          case "UNDERLINE":
          case "STRIKEOUT":
          case "DBLUNDERLINE":
          case "OVERLINE":
          case "FLASH":
          case "REVERSE":
            codes.push("%^" + data[d] + "%^");
            buffer.push("%^" + data[d] + "%^");
            break;
          case "/DBLUNDERLINE":
          case "/OVERLINE":
          case "/FLASH":
          case "/REVERSE":
          case "/UNDERLINE":
          case "/BOLD":
          case "/ITALIC":
          case "/STRIKEOUT":
            codes.pop();
            this.cleanReset(buffer);
            buffer.push("%^RESET%^");
            if (codes.length > 0)
              buffer.push(codes.join(""));
            break;
          case "SPAN":
          case "/SPAN":
          case "/BR":
          case "/DIV":
            break;
          case "DIV":
          case "BR":
            if (codes.length > 0 && buffer.length > 0 && !buffer[buffer.length - 1].endsWith("%^RESET%^")) {
              this.cleanReset(buffer);
              buffer.push("%^RESET%^");
            }
            buffer.push("\n");
            if (codes.length > 0)
              buffer.push(codes.join(""));
            break;
          case "RESET":
            if (codes.length > 0 && buffer.length > 0 && !buffer[buffer.length - 1].endsWith("%^RESET%^")) {
              this.cleanReset(buffer);
              buffer.push("%^RESET%^");
            }
            if (codes.length > 0)
              buffer.push(codes.join(""));
            break;
          default:
            if (data[d].startsWith("COLOR: #")) {
              color = data[d].substr(8);
              if (!this._colors[color]) {
                rgb = new RGBColor(color);
                color = this.nearestHex(rgb.toHex()).substr(1);
              }
              color = this._colors[color];
              if (color === "BOLD BLACK" || color === "BOLD%^%^BLACK")
                color = "mono11";
              codes.push("%^" + color + "%^");
              buffer.push("%^" + color + "%^");
            } else if (data[d].startsWith("COLOR: ")) {
              color = new RGBColor(data[d].substr(7)).toHex().substr(1);
              if (!this._colors[color])
                color = this.nearestHex("#" + color).substr(1);
              color = this._colors[color];
              if (color === "BOLD BLACK" || color === "BOLD%^%^BLACK")
                color = "mono11";
              codes.push("%^" + color + "%^");
              buffer.push("%^" + color + "%^");
            } else if (data[d].startsWith("/COLOR: ")) {
              codes.pop();
              this.cleanReset(buffer);
              buffer.push("%^RESET%^");
              if (codes.length > 0)
                buffer.push(codes.join(""));
            } else if (data[d].startsWith("BACKGROUND-COLOR: #")) {
              color = data[d].substr(19);
              if (!this._colors[color]) {
                rgb = new RGBColor(color);
                color = this.nearestHex(rgb.toHex()).substr(1);
              }
              if (this._colors["B" + color])
                color = this._colors["B" + color];
              else
                color = this._colors[color];
              color = "%^B_" + color + "%^";
              codes.push(color);
              buffer.push(color);
            } else if (data[d].startsWith("BACKGROUND-COLOR: ")) {
              color = new RGBColor(data[d].substr(18)).toHex().substr(1);
              if (!this._colors[color])
                color = this.nearestHex("#" + color).substr(1);
              if (this._colors["B" + color])
                color = this._colors["B" + color];
              else
                color = this._colors[color];
              color = "%^B_" + color + "%^";
              codes.push(color);
              buffer.push(color);
            } else if (data[d].startsWith("/BACKGROUND-COLOR: ")) {
              codes.pop();
              this.cleanReset(buffer);
              buffer.push("%^RESET%^");
              if (codes.length > 0)
                buffer.push(codes.join(""));
            } else if (data[d].startsWith('"'))
              buffer.push(data[d].substring(1, data[d].length - 1));
            break;
        }
      }
      return buffer.join("");
    }
    cleanReset(buffer) {
      let b = buffer.length - 1;
      for (; b >= 0; b--) {
        if (buffer[b].startsWith("%^"))
          buffer.pop();
        else
          return buffer;
      }
      return buffer;
    }
    nearestHex(hex) {
      var _editor = this;
      var hexToRgb = function(hex2) {
        var shortRegEx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex2 = hex2.replace(shortRegEx, function(full, r, g, b) {
          return [r, r, g, g, b, b].join();
        });
        var longRegEx = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i;
        var rgbArray = longRegEx.exec(hex2);
        var rgbObj = rgbArray ? {
          r: parseInt(rgbArray[1], 16),
          g: parseInt(rgbArray[2], 16),
          b: parseInt(rgbArray[3], 16)
        } : null;
        return rgbObj;
      };
      var closestHexFromRgb = function(rgbObj) {
        if (!rgbObj) {
          throw new Error("The hex you provided is not formatted correctly. Please try in a format such as '#FFF' or '#DDFFDD'.");
        }
        var minDistance = Number.MAX_SAFE_INTEGER;
        var nearestHex = null;
        for (var i = 0; i < _editor.colorList.length; i++) {
          var currentColor = _editor.colorList[i];
          var distance = Math.sqrt(
            Math.pow(rgbObj.r - currentColor.rgb.r, 2) + Math.pow(rgbObj.g - currentColor.rgb.g, 2) + Math.pow(rgbObj.b - currentColor.rgb.b, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestHex = currentColor.hex;
          }
        }
        return nearestHex;
      };
      return closestHexFromRgb(hexToRgb(hex));
    }
    remove() {
      tinymce.remove(`#${this._element.id}`);
    }
    initialize() {
      if (this.isSimple) return;
      this.initPlugins();
      tinymce.init({
        license_key: "gpl",
        custom_colors: false,
        selector: `textarea#${this._element.id}`,
        height: 500,
        menubar: false,
        browser_spellcheck: true,
        //contextmenu: false,
        resize: true,
        statusbar: false,
        nowrap: true,
        force_br_newlines: true,
        forced_root_block: "div",
        plugins: "pinkfish insertdatetime pinkfishtextcolor nonbreaking",
        color_picker_callback: (editor2, color, format) => {
          this.openColorDialog(format, color || "");
        },
        color_picker_caption: "More&hellip;",
        textcolor_rows: "3",
        textcolor_cols: "8",
        toolbar: "send | append | undo redo | pinkfishforecolor pinkfishbackcolor | italic underline strikethrough overline dblunderline flash reverse | clear | copy copyformatted | insertdatetime",
        toolbar_mode: "sliding",
        content_css: "css/tinymce.content.min.css",
        formats: {
          bold: { inline: "strong", exact: true, links: true, remove_similar: true },
          italic: { inline: "em", exact: true, links: true, remove_similar: true },
          overline: { inline: "span", "classes": "overline", links: true, remove_similar: true },
          dblunderline: { inline: "span", "classes": "dblunderline", links: true, remove_similar: true },
          flash: { inline: "span", "classes": "flash", links: true, remove_similar: true },
          reverse: { inline: "span", "classes": "reverse", links: true, remove_similar: true },
          underline: { inline: "span", "classes": "underline", links: true, remove_similar: true },
          strikethrough: { inline: "span", "classes": "strikeout", links: true, remove_similar: true },
          forecolor: { inline: "span", styles: { textDecoration: "inherit", border: "inherit", color: "%value" }, exact: true, links: true, remove_similar: true },
          hilitecolor: { inline: "span", styles: { textDecoration: "inherit", border: "inherit", backgroundColor: "%value" }, exact: true, links: true, remove_similar: true }
          //forecolor: { block: 'span', attributes: { 'data-color': '%value' }, styles: { textDecoration: 'inherit', border: 'inherit', color: '%value' }, exact: true, links: true, remove_similar: true },
          //hilitecolor: { block: 'span', attributes: { 'data-backcolor': '%value' }, styles: { textDecoration: 'inherit', border: 'inherit', backgroundColor: '%value' }, exact: true, links: true, remove_similar: true }
        },
        init_instance_callback: (editor2) => {
          editor2.shortcuts.add("ctrl+shift+c", "Copy formatted", () => copyText(this.getFormattedSelection().replace(/(?:\r)/g, "")));
          editor2.on("PastePreProcess", (e) => {
            if (client.getOption("enableDebug"))
              client.debug("Advanced Before Editor PastePreProcess: " + e.content);
            this.clearReverse($(".reverse", $(editor2.getDoc()).contents()));
            e.content = e.content.replace(/<\/p>/g, "<br>");
            e.content = e.content.replace(/<\/h[1-6]>/g, "<br>");
            e.content = e.content.replace(/<\/li>/g, "<br>");
            var regex = /<pre(.*?)>((.|\s)*)<\/pre>/mgi;
            var m;
            while ((m = regex.exec(e.content)) !== null) {
              if (m.index === regex.lastIndex) {
                regex.lastIndex++;
              }
              e.content = e.content.substring(0, m.index) + e.content.substring(m.index, regex.lastIndex).replace(/(\r\n|\r|\n)/g, "<br/>").replaceAll("  ", "&nbsp;&nbsp;") + e.content.substring(regex.lastIndex);
            }
            if (client.getOption("enableDebug"))
              client.debug("Advanced After Editor PastePreProcess: " + e.content);
          });
          editor2.on("PastePreProcess", () => {
            this.addReverse($(".reverse", $(editor2.getDoc()).contents()));
          });
          $(".mce-content-body", tinymce.activeEditor.getDoc()).css("font-size", client.getOption("cmdfontSize"));
          $(".mce-content-body", tinymce.activeEditor.getDoc()).css("font-family", client.getOption("cmdfont") + ", monospace");
          if (tinymce.activeEditor.formatter)
            tinymce.activeEditor.formatter.register("flash", { inline: "span", "classes": client.getOption("flashing") ? "flash" : "noflash", links: true, remove_similar: true });
          else
            tinymce.activeEditor.settings.formats["flash"] = { inline: "span", "classes": client.getOption("flashing") ? "flash" : "noflash", links: true, remove_similar: true };
          this.loadColors();
          this.setFormatted(this.value);
          this.emit("editor-init");
        },
        paste_data_images: false,
        paste_webkit_styles: "color background background-color text-decoration",
        valid_elements: "strong/b,em/i,u,span[style],span[class],strike/s,br",
        valid_styles: {
          "*": "color,background,background-color,text-decoration,font-weight"
        },
        color_map: this._ColorTable
      });
    }
    focus() {
      if (this.isSimple)
        this._element.focus();
      else if (tinymce.activeEditor)
        tinymce.activeEditor.focus();
    }
  };

  // src/interface/interface.ts
  var editor;
  var editorDialog;
  function initializeInterface() {
    let options;
    initMenu();
    client.input.on("history-navigate", () => {
      if (client.getOption("commandAutoSize") || client.getOption("commandScrollbars"))
        resizeCommandInput();
    });
    client.on("options-loaded", () => {
      client.commandInput.removeEventListener("input", resizeCommandInput);
      client.commandInput.removeEventListener("change", resizeCommandInput);
      initCommandInput();
      updateCommandInput();
      if (client.getOption("commandAutoSize") || client.getOption("commandScrollbars"))
        resizeCommandInput();
    });
    document.getElementById("btn-adv-edit").addEventListener("click", (e) => {
      if (!editorDialog) {
        editorDialog = new Dialog(Object.assign({}, client.getOption("windows.editor") || { center: true }, { title: '<i class="fas fa-edit"></i> Advanced editor', id: "adv-editor" }));
        editorDialog.on("resized", (e2) => {
          client.setOption("windows.editor", e2);
        });
        editorDialog.on("moved", (e2) => {
          client.setOption("windows.editor", e2);
        });
        editorDialog.on("maximized", () => {
          client.setOption("windows.editor", editorDialog.windowState);
        });
        editorDialog.on("restored", () => {
          client.setOption("windows.editor", editorDialog.windowState);
        });
        editorDialog.on("shown", () => {
          client.setOption("windows.editor", editorDialog.windowState);
          editor.initialize();
        });
        editorDialog.on("closing", () => {
          editor.remove();
        });
        editorDialog.on("closed", () => {
          client.setOption("windows.editor", editorDialog.windowState);
        });
        editorDialog.on("canceling", () => {
          editor.remove();
        });
        editorDialog.on("canceled", () => {
          client.setOption("windows.editor", editorDialog.windowState);
        });
        const textarea = document.createElement("textarea");
        textarea.classList.add("form-control", "form-control-sm");
        textarea.id = "txt-adv-editor";
        editorDialog.body.appendChild(textarea);
        editorDialog.body.style.overflow = "hidden";
        if (!editor) editor = new AdvEditor(textarea, !client.getOption("simpleEditor"));
        editor.on("close", () => {
          editorDialog.close();
        });
        editor.on("editor-init", () => editor.focus());
        editorDialog.dialog.editor = editor;
        if (tinymce)
          editorDialog.header.querySelector("#adv-editor-max").insertAdjacentHTML("afterend", '<button type="button" class="btn btn-light float-end" id="adv-editor-switch" title="Switch to advanced" style="padding: 0 4px;margin-top: -1px;"><i class="bi-shuffle"></i></button>');
        editorDialog.footer.innerHTML = `<button id="btn-adv-edit-clear" type="button" class="float-start btn btn-light" title="Clear editor">Clear</button>
                <button id="btn-adv-edit-append" type="button" class="float-start btn btn-light" title="Append file...">Append file...</button>
                <button id="btn-adv-edit-send" type="button" class="float-end btn btn-primary" title="Send">Send</button>`;
        if (!editor.isSimple)
          editorDialog.header.querySelector("#adv-editor-switch").title = "Switch to simple";
        editorDialog.header.querySelector("#adv-editor-switch").addEventListener("click", () => {
          client.setOption("simpleEditor", !editor.simple);
          let value = "";
          if (!editor.isSimple)
            value = editor.getFormattedText().replace(/(?:\r)/g, "");
          editor.simple = !editor.simple;
          if (!editor.isSimple) {
            editorDialog.hideFooter();
            editorDialog.header.querySelector("#adv-editor-switch").title = "Switch to simple";
          } else {
            editor.value = value;
            editorDialog.showFooter();
            editorDialog.header.querySelector("#adv-editor-switch").title = "Switch to advanced";
            setTimeout(() => editor.focus(), 100);
          }
        });
        document.getElementById("btn-adv-edit-append").addEventListener("click", () => {
          openFileDialog("Append file", false).then((files) => {
            readFile(files[0]).then((contents) => {
              editor.insert(contents);
            }).catch(client.error);
          }).catch(() => {
          });
        });
        document.getElementById("btn-adv-edit-send").addEventListener("click", () => {
          client.sendCommand(editor.value());
          if (client.getOption("editorClearOnSend"))
            editor.clear();
          if (client.getOption("editorCloseOnSend"))
            editorDialog.close();
        });
        document.getElementById("btn-adv-edit-clear").addEventListener("click", () => {
          editor.clear();
          editor.focus();
        });
        if (!editor.isSimple)
          editorDialog.hideFooter();
      }
      editorDialog.show();
      editor.focus();
    });
    options = client.getOption("windows.editor");
    if (options && options.show)
      document.getElementById("btn-adv-edit").click();
    document.getElementById("btn-command-history").addEventListener("show.bs.dropdown", function() {
      document.body.appendChild(document.getElementById("command-history-menu"));
    });
    document.getElementById("btn-command-history").addEventListener("hidden.bs.dropdown", function() {
      document.getElementById("btn-command-history").parentElement.appendChild(document.getElementById("command-history-menu"));
    });
    client.commandInput.removeEventListener("input", resizeCommandInput);
    client.commandInput.removeEventListener("change", resizeCommandInput);
    initCommandInput();
    updateCommandInput();
    if (client.getOption("commandAutoSize") || client.getOption("commandScrollbars"))
      resizeCommandInput();
  }
  function resizeCommandInput() {
    debounce(() => {
      _resizeCommandInput();
    }, 250, "resizeCommand");
  }
  async function initCommandInput() {
    if (client.getOption("commandAutoSize") || client.getOption("commandScrollbars")) {
      client.commandInput.addEventListener("input", resizeCommandInput);
      client.commandInput.addEventListener("change", resizeCommandInput);
    }
    if (client.getOption("commandWordWrap")) {
      document.getElementById("commandMeasure").style.whiteSpace = "pre-wrap";
      document.getElementById("commandMeasure").style.overflowWrap = "anywhere";
    } else {
      document.getElementById("commandMeasure").style.whiteSpace = "";
      document.getElementById("commandMeasure").style.overflowWrap = "";
    }
    if (client.getOption("commandScrollbars")) {
      document.getElementById("commandMeasure").style.overflow = "auto";
      client.commandInput.style.overflow = "auto";
    } else {
      document.getElementById("commandMeasure").style.overflow = "";
      client.commandInput.style.overflow = "";
    }
  }
  var commandInputResize = {};
  function updateCommandInput() {
    const measure = document.getElementById("commandMeasure");
    document.body.appendChild(measure);
    const cmd = client.commandInput.parentElement;
    const cmdSize = window.getComputedStyle(cmd);
    measure.style.fontSize = client.commandInput.style.fontSize;
    measure.style.fontFamily = client.commandInput.style.fontFamily;
    measure.style.width = client.commandInput.offsetWidth + "px";
    const oldMeasure = measure.innerHTML;
    measure.innerHTML = "W";
    let minHeight = client.getOption("commandMinLines");
    const height = measure.offsetHeight;
    minHeight = height * (minHeight < 1 ? 1 : minHeight);
    let padding = parseFloat(cmdSize.borderTopWidth) || 0;
    padding += parseFloat(cmdSize.borderBottomWidth) || 0;
    padding += parseFloat(cmdSize.paddingTop) || 0;
    padding += parseFloat(cmdSize.paddingBottom) || 0;
    let inset = cmdSize.inset.split(" ");
    padding += (parseFloat(inset[0]) || 0) * 2;
    measure.innerHTML = oldMeasure;
    cmd.style.height = height + padding + "px";
    client.commandInput.parentElement.style.height = height + "px";
    client.commandInput.closest("nav").style.height = height + 6 + "px";
    client.display.container.style.bottom = height + padding + "px";
    commandInputResize = {
      measure,
      cmd,
      cmdSize,
      height,
      padding,
      minHeight
    };
  }
  function _resizeCommandInput() {
    const measure = commandInputResize.measure;
    const cmd = commandInputResize.cmd;
    measure.innerHTML = client.commandInput.value + "\n";
    let height = measure.offsetHeight;
    if (height < commandInputResize.minHeight)
      height = commandInputResize.minHeight;
    const padding = commandInputResize.padding;
    cmd.style.height = height + padding + "px";
    client.commandInput.parentElement.style.height = height + "px";
    client.commandInput.closest("nav").style.height = height + 6 + "px";
    client.display.container.style.bottom = height + padding + "px";
  }
  window.initializeInterface = initializeInterface;
})();
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
