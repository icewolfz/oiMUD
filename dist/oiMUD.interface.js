(() => {
  // src/interface/menu.ts
  function closeMenu() {
    const instance = bootstrap.Offcanvas.getInstance(document.getElementById("clientMenu"));
    if (!instance) return;
    instance.hide();
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
      document.getElementById("btn-adv-editor").click();
    });
    document.querySelector("#menu-about a").addEventListener("click", (e) => {
      showDialog("about");
      closeMenu();
    });
    document.querySelector("#menu-settings a").addEventListener("click", (e) => {
      showDialog("settings");
      closeMenu();
    });
    document.querySelector("#menu-profiles a").addEventListener("click", (e) => {
      showDialog("profiles");
      closeMenu();
    });
    document.querySelector("#menu-fullscreen a").addEventListener("click", (e) => {
      var doc = window.document;
      var docEl = doc.documentElement;
      var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
      let el = document.getElementById("menu-fullscreen");
      let icon = document.querySelector("#menu-fullscreen svg") || document.querySelector("#menu-fullscreen i");
      let text = document.querySelector("#menu-fullscreen a span");
      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        el.title = "Exit fullscreen";
        text.textContent = "Exit fullscreen";
        requestFullScreen.call(docEl);
        icon.classList.add("fa-minimize");
        icon.classList.remove("fa-maximize");
      } else {
        el.title = "Enter fullscreen";
        text.textContent = "Enter fullscreen";
        cancelFullScreen.call(doc);
        icon.classList.add("fa-maximize");
        icon.classList.remove("fa-minimize");
      }
      closeMenu();
    });
    document.querySelector("#menu-buttons a").addEventListener("click", (e) => {
      toggleButtons();
      let button2 = document.querySelector("#menu-buttons");
      if (client.getOption("showButtons")) {
        button2.title = "Hide buttons";
        button2.classList.add("active");
        document.querySelector("#menu-buttons a span").textContent = "Hide buttons";
      } else {
        button2.title = "Show buttons";
        button2.classList.remove("active");
        document.querySelector("#menu-buttons a span").textContent = "Show buttons";
      }
      closeMenu();
    });
    updateScrollLock();
    let pl = client.plugins.length;
    let s;
    let sl;
    const list = document.querySelector("#clientMenu ul");
    for (let p = 0; p < pl; p++) {
      if (!client.plugins[p].menu) continue;
      if (client.plugins[p].menu.length) {
        sl = client.plugins[p].menu.length;
        for (s = 0; s < sl; s++) {
          let item = client.plugins[p].menu[s];
          let code;
          let id = "menu-" + (item.id || item.name || s).toLowerCase().replace(/ /g, "-");
          if (item.name === "-")
            code = `<li id="${id}"><hr class="dropdown-divider"></li>`;
          else if (typeof item.action === "string")
            code = `<li id="${id}" class="nav-item${item.active ? " active" : ""}" title="${item.name || ""}"><a class="nav-link" href="#${item.action}">${item.icon || ""}<span>${item.name || ""}</span></a></li>`;
          else
            code = `<li id="${id}" class="nav-item${item.active ? " active" : ""}" title="${item.name || ""}"><a class="nav-link" href="javascript:void(0)">${item.icon || ""}<span>${item.name || ""}</span></a></li>`;
          if (item.exists && list.querySelector(item.exists)) continue;
          if ("position" in item) {
            if (typeof item.position === "string") {
              if (list.querySelector(item.position))
                list.querySelector(item.position).insertAdjacentHTML("afterend", code);
            } else if (item.position >= 0 && item.position < list.children.length)
              list.children[item.position].insertAdjacentHTML("afterend", code);
            else
              list.insertAdjacentHTML("beforeend", code);
          } else
            list.insertAdjacentHTML("beforeend", code);
          if (item.name === "-") continue;
          if (typeof item.action === "function")
            document.querySelector(`#${id} a`).addEventListener("click", (e) => {
              const ie = { client, preventDefault: false };
              item.action(ie);
              if (ie.preventDefault) return;
              closeMenu();
            });
        }
      }
    }
    let button = document.querySelector("#menu-buttons");
    if (client.getOption("showButtons")) {
      button.title = "Hide buttons";
      button.classList.add("active");
      document.querySelector("#menu-buttons a span").textContent = "Hide buttons";
    } else {
      button.title = "Show buttons";
      button.classList.remove("active");
      document.querySelector("#menu-buttons a span").textContent = "Show buttons";
    }
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
    bind(type, listener, caller) {
      if (!Array.isArray(this.#events[type]) || typeof this.#events[type] === "undefined")
        this.#events[type] = [];
      this.#events[type].push({ listener, caller });
    }
    on(type, listener, caller) {
      this.bind(type, listener, caller);
    }
    addEventListener(type, listener, caller) {
      this.bind(type, listener, caller);
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
      for (var i = 0, len = events.length; i < len; i++) {
        events[i].listener.apply(events[i].caller || caller, args);
      }
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
      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].listener === listener) {
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
    removeListenersFromCaller(caller, type) {
      if (!type) {
        Object.keys(this.#events).forEach((key) => {
          const events2 = this.#events[key];
          for (let i = events2.length - 1; i >= 0; i--) {
            if (events2[i].caller === caller) {
              events2.splice(i, 1);
              break;
            }
          }
        });
        return;
      }
      if (!Array.isArray(this.#events[type])) return;
      const events = this.#events[type];
      for (let i = 0, len = events.length; i < len; i++) {
        if (events[i].caller === caller) {
          events.splice(i, 1);
          break;
        }
      }
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
  function SortArrayByPriority(a, b) {
    if (a.priority > b.priority)
      return -1;
    if (a.priority < b.priority)
      return 1;
    return 0;
  }
  function SortMapByPriority(a, b) {
    if (a.priority > b.priority)
      return -1;
    if (a.priority < b.priority)
      return 1;
    if (a.index < b.index)
      return -1;
    if (a.index > b.index)
      return 1;
    return 0;
  }
  function SortItemArrayByPriority(list) {
    const map = list.map((el, i) => {
      return { index: i, priority: el.priority };
    });
    map.sort(SortMapByPriority);
    return map.map((el) => {
      return list[el.index];
    });
  }
  function FilterArrayByKeyValue(array, k, v) {
    const res = [];
    if (!array || array.length === 0) return res;
    const al = array.length;
    for (let i = 0; i < al; i++) {
      if (array[i]["enabled"] && array[i][k] === v)
        res.push(array[i]);
    }
    if (res.length <= 1) return res;
    return res.sort(SortArrayByPriority);
  }
  var _edCache = document.createElement("div");
  function htmlEncode(value) {
    _edCache.textContent = value;
    return _edCache.innerHTML;
  }
  function offset(el) {
    const box = el.getBoundingClientRect();
    const docElem = document.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
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
  var keyCodeToChar = {
    3: "Cancel",
    6: "Help",
    8: "Backspace",
    9: "Tab",
    19: "Pause/Break",
    20: "Caps Lock",
    21: "Kana",
    22: "Eisu",
    23: "Junja",
    24: "Final",
    25: "Hanja",
    27: "Esc",
    28: "Convert",
    29: "Nonconvert",
    30: "Accept",
    31: "Modechange",
    32: "Space",
    33: "Page Up",
    34: "Page Down",
    35: "End",
    36: "Home",
    37: "Left",
    38: "Up",
    39: "Right",
    40: "Down",
    41: "Select",
    42: "Print",
    43: "Execute",
    44: "Printscreen",
    45: "Insert",
    46: "Delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    58: "Colon",
    59: "Semicolon",
    60: "Less Than",
    61: "Equals2",
    62: "Greater Than",
    63: "Question Mark",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    93: "Context Menu",
    95: "Sleep",
    96: "Numpad 0",
    97: "Numpad 1",
    98: "Numpad 2",
    99: "Numpad 3",
    100: "Numpad 4",
    101: "Numpad 5",
    102: "Numpad 6",
    103: "Numpad 7",
    104: "Numpad 8",
    105: "Numpad 9",
    106: "Numpad *",
    107: "Numpad +",
    109: "Numpad -",
    110: "Numpad .",
    111: "Numpad /",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    124: "F13",
    125: "F14",
    126: "F15",
    127: "F16",
    128: "F17",
    129: "F18",
    130: "F19",
    131: "F20",
    132: "F21",
    133: "F22",
    134: "F23",
    135: "F24",
    144: "Num Lock",
    145: "Scroll Lock",
    146: "Win Oem Fj Jisho",
    147: "Win Oem Fj Masshou",
    148: "Win Oem Fj Touroku",
    149: "Win Oem Fj Loya",
    150: "Win Oem Fj Roya",
    160: "Circumflex",
    161: "Exclamation",
    162: "Double Quote",
    163: "Hash",
    164: "Dollar",
    165: "Percent",
    166: "Ampersand",
    167: "Underscore",
    168: "Open Paren",
    169: "Close Paren",
    170: "Asterisk",
    171: "Plus",
    172: "Pipe",
    173: "Hyphen Minus",
    174: "Open Curly Bracket",
    175: "Close Curly Bracket",
    176: "Tilde",
    181: "Volume Mute",
    182: "Volume Down",
    183: "Volume Up",
    186: ";",
    187: "Equals",
    188: ",",
    189: "Minus",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
    227: "Win Ico Help",
    228: "Win Ico 00",
    230: "Win Ico Clear",
    233: "Win Oem Reset",
    234: "Win Oem Jump",
    235: "Win Oem Pa1",
    236: "Win Oem Pa2",
    237: "Win Oem Pa3",
    238: "Win Oem Wsctrl",
    239: "Win Oem Cusel",
    240: "Win Oem Attn",
    241: "Win Oem Finish",
    242: "Win Oem Copy",
    243: "Win Oem Auto",
    244: "Win Oem Enlw",
    245: "Win Oem Backtab",
    246: "Attn",
    247: "Crsel",
    248: "Exsel",
    249: "Ereof",
    250: "Play",
    251: "Zoom",
    253: "Pa1",
    254: "Win Oem Clear"
  };
  var keyCharToCode = {
    Cancel: 3,
    Help: 6,
    Backspace: 8,
    Tab: 9,
    "Pause/Break": 19,
    "Caps Lock": 20,
    Esc: 27,
    Space: 32,
    "Page Up": 33,
    "Page Down": 34,
    End: 35,
    Home: 36,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    Insert: 45,
    Delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    "Numpad 0": 96,
    "Numpad 1": 97,
    "Numpad 2": 98,
    "Numpad 3": 99,
    "Numpad 4": 100,
    "Numpad 5": 101,
    "Numpad 6": 102,
    "Numpad 7": 103,
    "Numpad 8": 104,
    "Numpad 9": 105,
    "Numpad *": 106,
    "Numpad +": 107,
    "Numpad -": 109,
    "Numpad .": 110,
    "Numpad /": 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    "Num Lock": 144,
    "Scroll Lock": 145,
    ";": 186,
    ",": 188,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222,
    Kana: 21,
    Eisu: 22,
    Junja: 23,
    Final: 24,
    Hanja: 25,
    Convert: 28,
    Nonconvert: 29,
    Accept: 30,
    Modechange: 31,
    Select: 41,
    Print: 42,
    Execute: 43,
    Printscreen: 44,
    Colon: 58,
    Semicolon: 59,
    "Less Than": 60,
    Equals2: 61,
    "Greater Than": 62,
    "Question Mark": 63,
    "Context Menu": 93,
    Sleep: 95,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135,
    "Win Oem Fj Jisho": 146,
    "Win Oem Fj Masshou": 147,
    "Win Oem Fj Touroku": 148,
    "Win Oem Fj Loya": 149,
    "Win Oem Fj Roya": 150,
    Circumflex: 160,
    Exclamation: 161,
    "Double Quote": 162,
    Hash: 163,
    Dollar: 164,
    Percent: 165,
    Ampersand: 166,
    Underscore: 167,
    "Open Paren": 168,
    "Close Paren": 169,
    Asterisk: 170,
    Plus: 171,
    Pipe: 172,
    "Hyphen Minus": 173,
    "Open Curly Bracket": 174,
    "Close Curly Bracket": 175,
    Tilde: 176,
    "Volume Mute": 181,
    "Volume Down": 182,
    "Volume Up": 183,
    Equals: 187,
    Minus: 189,
    "Win Ico Help": 227,
    "Win Ico 00": 228,
    "Win Ico Clear": 230,
    "Win Oem Reset": 233,
    "Win Oem Jump": 234,
    "Win Oem Pa1": 235,
    "Win Oem Pa2": 236,
    "Win Oem Pa3": 237,
    "Win Oem Wsctrl": 238,
    "Win Oem Cusel": 239,
    "Win Oem Attn": 240,
    "Win Oem Finish": 241,
    "Win Oem Copy": 242,
    "Win Oem Auto": 243,
    "Win Oem Enlw": 244,
    "Win Oem Backtab": 245,
    Attn: 246,
    Crsel: 247,
    Exsel: 248,
    Ereof: 249,
    Play: 250,
    Zoom: 251,
    Pa1: 253,
    "Win Oem Clear": 254
  };
  (function($2) {
    $2.fn.hasHorizontalScrollBar = function() {
      return $2(this)[0].scrollWidth > $2(this).innerWidth();
    };
  })(jQuery);
  function clone(obj, replacer) {
    return JSON.parse(JSON.stringify(obj, replacer));
  }
  function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      const range = input.createTextRange();
      range.collapse(true);
      range.moveEnd("character", selectionEnd);
      range.moveStart("character", selectionStart);
      range.select();
    }
  }
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
  function capitalize(s, first) {
    if (!s) return "";
    s = s.split(" ");
    let c;
    let i;
    let p;
    const il = first ? 1 : s.length;
    for (i = 0; i < il; i++) {
      const pl = s[i].length;
      for (p = 0; p < pl; p++) {
        c = s[i].charAt(p);
        if (c >= "a" && c <= "z" || c >= "A" && c <= "Z") {
          s[i] = s[i].substr(0, p) + c.toUpperCase() + s[i].substr(p + 1).toLowerCase();
          break;
        }
      }
    }
    return s.join(" ");
  }
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
            if (bold && !boldNest) {
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
      dialog.style.height = "158px";
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
  function readFile(file, progress) {
    return new Promise((resolve, reject) => {
      if (!file) reject(new Error("Invalid file"));
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (evt) => {
        resolve(evt.target.result);
      };
      reader.readAsText(file);
      if (progress)
        reader.onprogress = progress;
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
  function scrollChildIntoView(parent, child) {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    if (childRect.top < parentRect.top || childRect.bottom > parentRect.bottom || childRect.left < parentRect.left || childRect.right > parentRect.right) {
      child.scrollIntoView({
        behavior: "smooth",
        // Optional for smooth scrolling
        block: "nearest"
        // Scrolls to nearest edge of the parent
      });
    }
  }
  function isMobile(userAgent) {
    if (window.matchMedia("(orientation: landscape) and (max-width: 641px)").matches)
      return true;
    if (window.matchMedia("(orientation: landscape) and (max-height: 480px)").matches)
      return true;
    if (window.matchMedia("(orientation: portrait) and (max-width: 480px)").matches)
      return true;
    if (window.matchMedia(" (orientation: portrait) and (max-height: 641px)").matches)
      return true;
    if (userAgent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent || navigator.vendor || window.opera))
      return true;
    return false;
  }

  // src/interface/dialog.ts
  var DialogButtons = /* @__PURE__ */ ((DialogButtons2) => {
    DialogButtons2[DialogButtons2["None"] = 0] = "None";
    DialogButtons2[DialogButtons2["Ok"] = 1] = "Ok";
    DialogButtons2[DialogButtons2["Cancel"] = 2] = "Cancel";
    DialogButtons2[DialogButtons2["Yes"] = 4] = "Yes";
    DialogButtons2[DialogButtons2["No"] = 8] = "No";
    DialogButtons2[DialogButtons2["YesNo"] = 12] = "YesNo";
    DialogButtons2[DialogButtons2["Standard"] = 3] = "Standard";
    return DialogButtons2;
  })(DialogButtons || {});
  var Dialog = class extends EventEmitter {
    constructor(options) {
      super();
      this._state = { x: 0, y: 0, height: 0, width: 0, zIndex: 100, maximized: false, show: 0 };
      this._resize = { x: 0, y: 0, height: 0, width: 0, type: 0 /* None */, minHeight: 150, minWidth: 300, borderHeight: 1, borderWidth: 1 };
      this._dragPosition = { x: 0, y: 0 };
      this._windowResize = () => {
        debounce(() => {
          if (this.keepCentered || this._state.show === 2 && !this.moveable)
            this.center();
          else
            this.makeVisible();
          if (this._footer.style.display !== "none")
            this._body.style.bottom = this._footer.clientHeight + 1 + "px";
          this.emit("resizing");
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
        if (this._footer.style.display !== "none")
          this._body.style.bottom = this._footer.clientHeight + 1 + "px";
        this.emit("resizing");
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
        if (this._footer.style.display !== "none")
          this._body.style.bottom = this._footer.clientHeight + 1 + "px";
        this.emit("resizing");
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
        let size = this._size;
        if (this._state.x < 16 - size.width)
          this._state.x = 16 - size.width;
        if (this._state.y < 16 - size.height)
          this._state.y = 16 - size.height;
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
        let size = this._size;
        if (this._state.x < 16 - size.width)
          this._state.x = 16 - size.width;
        if (this._state.y < 16 - size.height)
          this._state.y = 16 - size.height;
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
      this.keepCentered = false;
      this.moveable = true;
      this.resizable = true;
      this._maximizable = true;
      this._closable = true;
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
          this._dialog.dataset.show = "" + this._state.show;
          if (!this._dialog._keydown) {
            this._dialog._keydown = (e) => {
              if (e.key === "Escape" && e.srcElement.tagName !== "TEXTAREA" && e.srcElement.tagName !== "INPUT" && e.srcElement.tagName !== "SELECT") {
                this._dialog.returnValue = "canceled";
                this.close();
              }
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
        };
      }
      if (typeof this._dialog.show !== "function") {
        this._dialog.show = () => {
          if (this._dialog.open) return;
          this._dialog.style.display = "block";
          this._dialog.style.visibility = "visible";
          this._dialog.open = true;
          this._state.show = 1;
          this._dialog.dataset.show = "" + this._state.show;
        };
      }
      if (typeof this._dialog.close !== "function") {
        this._dialog.close = () => {
          this._dialog.style.display = "";
          this._dialog.style.visibility = "";
          this._dialog.open = false;
          this._state.show = 0;
          this._dialog.dataset.show = "" + this._state.show;
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
      if (options && (options.buttons & 2 /* Cancel */) === 2 /* Cancel */)
        footer += `<button id="${this._id}-cancel" type="button" class="btn-sm float-end btn btn-light" title="Cancel dialog">Cancel</button>`;
      if (options && (options.buttons & 1 /* Ok */) === 1 /* Ok */)
        footer += `<button id="${this._id}-ok" type="button" class="btn-sm float-end btn btn-primary" title="Confirm dialog">Ok</button>`;
      if (options && (options.buttons & 8 /* No */) === 8 /* No */)
        footer += `<button id="${this._id}-no" type="button" class="btn-sm float-end btn btn-light" title="No">No</button>`;
      if (options && (options.buttons & 4 /* Yes */) === 4 /* Yes */)
        footer += `<button id="${this._id}-yes" type="button" class="btn-sm float-end btn btn-primary" title="Yes">Yes</button>`;
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
        this._dialog.dataset.show = "" + this._state.show;
        if (this._dialog.backdrop_)
          this._dialog.parentNode.removeChild(this._dialog.backdrop_);
        if (this._dialog._keydown)
          window.document.removeEventListener("keydown", this._dialog._keydown);
        window.removeEventListener("resize", this._windowResize);
        this.emit("closed", this._dialog.returnValue);
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
        this._dialog.dataset.show = "" + this._state.show;
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
      if (options && "closeable" in options)
        this.closeable = options.closeable;
      if (options && (options.buttons & 2 /* Cancel */) === 2 /* Cancel */)
        this._dialog.querySelector(`#${this._id}-cancel`).addEventListener("click", () => {
          const e = { preventDefault: false, button: 2 /* Cancel */ };
          this.emit("button-click", e);
          if (e.preventDefault) return;
          this._dialog.returnValue = "cancel";
          this.close();
        });
      if (options && (options.buttons & 8 /* No */) === 8 /* No */)
        this._dialog.querySelector(`#${this._id}-no`).addEventListener("click", () => {
          const e = { preventDefault: false, button: 8 /* No */ };
          this.emit("button-click", e);
          if (e.preventDefault) return;
          this._dialog.returnValue = "no";
          this.close();
        });
      if (options && (options.buttons & 1 /* Ok */) === 1 /* Ok */)
        this._dialog.querySelector(`#${this._id}-ok`).addEventListener("click", () => {
          const e = { preventDefault: false, button: 1 /* Ok */ };
          this.emit("button-click", e);
          if (e.preventDefault) return;
          this._dialog.returnValue = "ok";
          this._dialog.close();
        });
      if (options && (options.buttons & 4 /* Yes */) === 4 /* Yes */)
        this._dialog.querySelector(`#${this._id}-yes`).addEventListener("click", () => {
          const e = { preventDefault: false, button: 4 /* Yes */ };
          this.emit("button-click", e);
          if (e.preventDefault) return;
          this._dialog.returnValue = "yes";
          this._dialog.close();
        });
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
          this.focus();
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
      if (options && "keepCentered" in options && options.keepCentered)
        this.keepCentered = options.keepCentered;
      if (this.keepCentered || options && "center" in options && options.center)
        this.center();
      if (options && "position" in options && options.position > 0)
        this.position(options.position);
      this._windowResize();
      this._resizeObserver = new ResizeObserver((entries, observer) => {
        if (entries.length === 0) return;
        if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
          return;
        if (!this._resizeObserverCache || this._resizeObserverCache.height !== entries[0].contentRect.height) {
          this._resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
          if (this._footer.style.display !== "none")
            this._body.style.bottom = this._footer.clientHeight + 1 + "px";
        }
      });
      this._resizeObserver.observe(this._footer);
      this._observer = new MutationObserver((mutationsList) => {
        let mutation;
        for (mutation of mutationsList) {
          if (mutation.type === "attributes" && mutation.attributeName === "style") {
            if (this._footer.style.display !== "none")
              this._body.style.bottom = this._footer.clientHeight + 1 + "px";
          }
        }
      });
      this._observer.observe(this._footer, { attributes: true, attributeOldValue: true, attributeFilter: ["style"] });
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
    get closeable() {
      return this._closable;
    }
    set closeable(value) {
      if (value === this._closable) return;
      this._closable = value;
      if (this._closable)
        this._dialog.querySelector(`#${this._id}-header-close`).style.display = "";
      else
        this._dialog.querySelector(`#${this._id}-header-close`).style.display = "none";
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
      this.makeVisible(true);
      this._dialog.returnValue = "";
      if (this._dialog.open) {
        this.focus();
        return;
      }
      this._dialog.showModal();
      this._state.show = 2;
      this._dialog.dataset.show = "" + this._state.show;
      window.addEventListener("resize", this._windowResize);
      this.emit("shown", true);
      this.focus();
    }
    show() {
      if (!this._dialog.parentElement)
        document.body.appendChild(this._dialog);
      this.makeVisible(true);
      this._dialog.returnValue = "";
      if (this._dialog.open) {
        this.focus();
        return;
      }
      this._dialog.show();
      this._state.show = 1;
      this._dialog.dataset.show = "" + this._state.show;
      window.addEventListener("resize", this._windowResize);
      this.emit("shown", false);
      this.focus();
    }
    get opened() {
      return this._dialog.open;
    }
    close(returnValue) {
      if (!this._dialog.open) return;
      if (this._dialog.backdrop_)
        this._dialog.parentNode.removeChild(this._dialog.backdrop_);
      if (this._dialog._keydown)
        window.document.removeEventListener("keydown", this._dialog._keydown);
      if (returnValue)
        this._dialog.returnValue = returnValue;
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
    /*
        private _width() {
            let w = this.dialog.offsetWidth || this._dialog.clientWidth;
            if (!w) {
                const styles = document.defaultView.getComputedStyle(this._dialog);
                w = w || parseInt(styles.width, 10);
            }
            return w;
        }
    
        private _height() {
            let h = this.dialog.offsetHeight || this._dialog.clientHeight;
            if (!h) {
                const styles = document.defaultView.getComputedStyle(this._dialog);
                h = h || parseInt(styles.height, 10);
            }
            return h;
        }
        */
    get _size() {
      let w = this.dialog.offsetWidth || this._dialog.clientWidth;
      let h = this.dialog.offsetHeight || this._dialog.clientHeight;
      if (!w || !h) {
        const styles = document.defaultView.getComputedStyle(this._dialog);
        w = w || parseInt(styles.width, 10);
        h = h || parseInt(styles.height, 10);
      }
      return { width: w, height: h };
    }
    center() {
      this.position(48 /* Center */);
    }
    position(position) {
      if (position < 1) return;
      let size = this._size;
      if ((position & 4 /* Top */) === 4 /* Top */)
        this._state.y = 0;
      else if ((position & 8 /* Bottom */) === 8 /* Bottom */)
        this._state.y = window.innerHeight - size.height;
      else if ((position & 16 /* CenterVertical */) === 16 /* CenterVertical */)
        this._state.y = window.innerHeight / 2 - size.height / 2;
      if ((position & 1 /* Left */) === 1 /* Left */)
        this._state.x = 0;
      else if ((position & 2 /* Right */) === 2 /* Right */)
        this._state.x = window.innerWidth - size.width;
      else if ((position & 32 /* CenterHorizontal */) === 32 /* CenterHorizontal */)
        this._state.x = window.innerWidth / 2 - size.width / 2;
      this._dialog.style.left = this._state.x + "px";
      this._dialog.style.top = this._state.y + "px";
      this._state.width = size.width;
      this._state.height = size.height;
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
        order.push({ z, idx: d, show: parseInt(dialogs[d].dataset.show || "", 10) || 0 });
      }
      this._state.zIndex = i;
      if (forceReset || this._state.zIndex > 1e3) {
        this._state.zIndex = 100;
        d = 0;
        order.sort((a, b) => a.show > b.show ? 1 : a.z < b.z ? -1 : a.z > b.z ? 1 : 0);
        for (; d < dl; d++) {
          if (dialogs[order[d]].backdrop_)
            dialogs[order[d]].backdrop_.style.zIndex = "" + this._state.zIndex++;
          dialogs[order[d].idx].style.zIndex = "" + this._state.zIndex++;
        }
      }
    }
    showFooter() {
      this._footer.style.display = "";
      this._body.style.bottom = this._footer.clientHeight + 1 + "px";
    }
    hideFooter() {
      this._footer.style.display = "none";
      this._body.style.bottom = "0";
    }
    focus() {
      this._dialog.focus();
      this.getMaxZIndex();
      this._dialog.style.zIndex = "" + ++this._state.zIndex;
      this.emit("focus");
    }
    makeVisible(full, silent) {
      var rect = this._dialog.getBoundingClientRect();
      if (full) {
        if (rect.right > window.innerWidth) {
          this._state.x = window.innerWidth - this._state.width - 16;
          if (rect.left < 0) this._state.x = 0;
          this._dialog.style.left = this._state.x + "px";
        }
        if (rect.bottom > window.innerHeight) {
          this._state.y = window.innerHeight - this._state.height - 16;
          if (rect.top < 0) this._state.y = 0;
          this._dialog.style.top = this._state.y + "px";
        }
      } else {
        if (rect.left > window.innerWidth - 16) {
          this._state.x = window.innerWidth - 16;
          this._dialog.style.left = this._state.x + "px";
        }
        if (rect.top > window.innerHeight - 16) {
          this._state.y = window.innerHeight - 16;
          this._dialog.style.top = this._state.y + "px";
        }
      }
      if (!silent)
        this.emit("moved", this._state);
    }
    resetState(options) {
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
      const styles = document.defaultView.getComputedStyle(this._dialog);
      this._state.x = this._resize.x = parseInt(styles.left, 10);
      ;
      this._state.width = this._resize.width = parseInt(styles.width, 10);
      this._state.y = this._resize.y = parseInt(styles.top, 10);
      ;
      this._state.height = this._resize.height = parseInt(styles.height, 10);
      if (options && "maximized" in options && options.maximized)
        this.maximize();
      else
        this.restore();
      if (this.keepCentered || options && "center" in options && options.center)
        this.center();
      if (options && "position" in options && options.position > 0)
        this.position(options.position);
      this._windowResize();
    }
    setBody(contents, args) {
      this._body.innerHTML = contents;
      args = args || {};
      const scripts = this._body.querySelectorAll("script");
      for (let s = 0, sl = scripts.length; s < sl; s++) {
        let script = new Function("body", "dialog", ...Object.keys(args), scripts[s].textContent);
        script.apply(client, [this._body, this, ...Object.values(args), this]);
      }
    }
  };
  var AlertDialog = class extends Dialog {
    constructor(title, message, icon) {
      super(typeof title === "string" ? { title: getIcon(icon || 4 /* exclamation */) + title, width: 300, height: 150, keepCentered: true, center: true, resizable: false, moveable: false, maximizable: false, buttons: 1 /* Ok */ } : title);
      this.body.classList.add("d-flex", "justify-content-center", "align-content-center", "align-items-center");
      if (message)
        this.body.innerHTML = `<div class="text-center" style="width: 64px;height:64px;font-size: 40px;">${getIcon(icon || 4 /* exclamation */)}</div><div class="ms-3 align-self-center flex-fill">${message}</div></div>`;
    }
  };
  var ConfirmDialog = class extends Dialog {
    constructor(title, message, icon, buttons) {
      super(typeof title === "string" ? { title: getIcon(icon || 1 /* question */) + title, width: 300, height: 150, keepCentered: true, center: true, resizable: false, moveable: false, maximizable: false, buttons: buttons === void 0 ? 12 /* YesNo */ : buttons } : title);
      this.body.classList.add("d-flex", "justify-content-center", "align-content-center", "align-items-center");
      if (message)
        this.body.innerHTML = `<div class="text-center" style="width: 64px;height:64px;font-size: 40px;">${getIcon(icon || 1 /* question */)}</div><div class="ms-3 align-self-center flex-fill">${message}</div></div>`;
    }
  };
  var ProgressDialog = class extends Dialog {
    constructor(title, message, icon) {
      super(typeof title === "string" ? { title: getIcon(icon || 1 /* question */) + title, width: 300, height: 150, keepCentered: true, center: true, resizable: false, moveable: false, maximizable: false, buttons: 2 /* Cancel */, closeable: false } : title);
      this.body.classList.add("text-center", "justify-content-center", "align-content-center", "align-items-center");
      this.body.innerHTML = `<div class="align-self-center flex-fill" id="progress-message" style="padding:0 5px">${message || ""}</div></div><div class="progress" role="progressbar" aria-label="${title}" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="margin: 5px;"><div class="progress-bar" style="width: 0%"></div></div>`;
      this._progress = this.body.querySelector(".progress-bar");
    }
    set label(value) {
      this._progress.innerHTML = value;
    }
    get label() {
      return this._progress.innerHTML;
    }
    set progress(value) {
      if (value < 0) value = 0;
      if (value > 100) value = 100;
      this._progress.style.width = value + "%";
    }
    get progress() {
      return parseInt(this._progress.style.width, 10);
    }
    get message() {
      return this.body.querySelector("#progress-message").textContent;
    }
    set message(value) {
      this.body.querySelector("#progress-message").textContent = value;
    }
  };
  function getIcon(icon) {
    if (typeof icon === "string")
      return icon + " ";
    switch (icon) {
      case 3 /* error */:
        return '<i class="fa-regular fa-circle-xmark"></i> ';
      case 4 /* exclamation */:
        return '<i class="fa-solid fa-circle-exclamation"></i> ';
      case 1 /* question */:
        return '<i class="fa-regular fa-circle-question"></i> ';
    }
    return '<i class="fa-solid fa-circle-info"></i> ';
  }
  window.confirm_box = (title, message, icon, buttons) => {
    return new Promise((resolve, reject) => {
      const confirm = new ConfirmDialog(title, message, icon, buttons);
      confirm.showModal();
      confirm.on("button-click", (e) => resolve(e));
      confirm.on("canceled", () => reject(null));
      confirm.on("closed", (reason) => reason === "Yes" ? 0 : reject(null));
    });
  };
  window.alert_box = (title, message, icon) => {
    new AlertDialog(title, message, icon).showModal();
  };
  window.progress_box = (title, message, icon) => {
    return new ProgressDialog(title, message, icon);
  };
  window.Dialog = Dialog;

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
      this._init = false;
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
        const _colors = ["000000", "BLACK", "800000", "RED", "008000", "GREEN", "808000", "ORANGE", "0000EE", "BLUE", "800080", "MAGENTA", "008080", "CYAN", "BBBBBB", "WHITE", "808080", "BOLD BLACK", "FF0000", "BOLD RED", "00FF00", "BOLD GREEN", "FFFF00", "YELLOW", "5C5CFF", "BOLD BLUE", "FF00FF", "BOLD MAGENTA", "00FFFF", "BOLD CYAN", "FFFFFF", "BOLD WHITE"];
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
          editor3.addCommand("mceApplyPinkfishcolor", (format, value) => {
            applyFormat(editor3, format, value);
          });
          editor3.addCommand("mceRemovePinkfishcolor", (format) => {
            removeFormat(editor3, format);
          });
          editor3.addCommand("mceSetPinkfishcolor", (name, color) => {
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
            editor3.execCommand("mceRemovePinkfishcolor", format);
          } else {
            onChoice(value);
            editor3.execCommand("mceApplyPinkfishcolor", format, value);
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
          icon: "send",
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
        tinymce.activeEditor.getBody().innerHTML = pinkfishToHTML(text).replace(/(\r\n|\r|\n)/g, "<br/>");
      }
    }
    buildHTMLStack(els) {
      var tag, $el, t, tl;
      var stack = [];
      var tags;
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
          tags = [];
          if (els[e].className != "") {
            tag = els[e].className.toUpperCase().split(/\s+/g);
            tl = tag.length;
            for (t = 0; t < tl; t++) {
              if (tag[t] === "NOFLASH")
                tags.push("FLASH");
              else if (tag[t].length > 0)
                tags.push(tag[t]);
            }
          }
          if ($el.css("text-decoration") === "line-through")
            tags.push("STRIKEOUT");
          if ($el.css("text-decoration") === "underline")
            tags.push("UNDERLINE");
          if ($el.data("mce-style")) {
            tag = $el.data("mce-style").toUpperCase().split(";");
            tl = tag.length;
            for (t = 0; t < tl; t++) {
              if (tag[t].endsWith("INHERIT") || tag[t].endsWith("BLACK"))
                continue;
              tag[t] = tag[t].trim();
              tag[t] = tag[t].replace("BACKGROUND:", "BACKGROUND-COLOR:");
              if (tag[t].length > 0)
                tags.push(tag[t]);
            }
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
                tags.push(tag[t].trim());
            }
          }
          tl = tags.length;
          for (t = 0; t < tl; t++) {
            if (!tags[t].length) continue;
            stack.push(tags[t].trim());
          }
          stack = stack.concat(this.buildHTMLStack($el.contents()));
          for (t = tl - 1; t >= 0; t--) {
            if (!tags[t].length) continue;
            stack.push("/" + tags[t].trim());
          }
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
      return this.formatHtml($("<html>" + this.getRaw() + "</html>"));
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
          strikethrough: { inline: "span", "classes": "strikeout", links: true, remove_similar: true }
          //forecolor: { inline: 'span', styles: { textDecoration: 'inherit', border: 'inherit', color: '%value' }, exact: true, links: true, remove_similar: true },
          //hilitecolor: { inline: 'span', styles: { textDecoration: 'inherit', border: 'inherit', backgroundColor: '%value' }, exact: true, links: true, remove_similar: true }
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
            e.content = e.content.replace(/ background: #000000;/g, "");
            e.content = e.content.replace(/background: #000000;/g, "");
            e.content = e.content.replace(/ background-color: #000000;/g, "");
            e.content = e.content.replace(/background-color: #000000;/g, "");
            e.content = e.content.replace(/ color: #BBBBBB;/g, "");
            e.content = e.content.replace(/color: #BBBBBB;/g, "");
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
          this.setFormatted(this._element.value);
          editor2.on("click", (e) => {
            this.emit("click", e);
          });
          this.emit("editor-init");
          this._init = true;
        },
        paste_data_images: false,
        paste_webkit_styles: "color background background-color text-decoration",
        valid_elements: "strong/b,em/i,u,span[style|class],strike/s,br",
        valid_styles: {
          "*": "color,background,background-color,text-decoration,font-weight"
        },
        color_map: this._ColorTable
      });
    }
    focus() {
      if (this.isSimple)
        this._element.focus();
      else if (this._init && true && tinymce.activeEditor && tinymce.activeEditor.initialized)
        tinymce.activeEditor.focus();
    }
  };

  // src/settings.ts
  var SettingList = [
    ["bufferSize", 0, 2, 500],
    ["commandDelay", 0, 2, 500],
    ["commandDelayCount", 0, 2, 5],
    ["commandHistorySize", 0, 2, 20],
    ["fontSize", 0, 0, "1em", 0],
    ["cmdfontSize", 0, 0, "1em", 0],
    ["commandEcho", 0, 1, true],
    ["flashing", 0, 1, false],
    ["autoConnect", 0, 1, true],
    ["enableAliases", -1, 1, true],
    ["enableTriggers", -1, 1, true],
    ["enableMacros", -1, 1, true],
    ["showScriptErrors", 0, 1, false],
    ["commandStacking", 0, 1, true],
    ["commandStackingChar", 0, 0, ";", 1],
    ["htmlLog", 0, 1, true],
    ["keepLastCommand", 0, 1, true],
    ["enableMCCP", 0, 1, true],
    ["enableUTF8", 0, 1, true],
    ["font", 0, 5, "'Courier New', Courier, monospace", 0],
    ["cmdfont", 0, 5, "'Courier New', Courier, monospace", 0],
    ["aliases", -1, 4],
    ["macros", -1, 4],
    ["triggers", -1, 4],
    ["mapFollow", "mapper.follow", 1, true],
    ["mapEnabled", "mapper.enabled", 1, true],
    ["MapperSplitArea", "mapper.split", 1, false],
    ["MapperFillWalls", "mapper.fill", 1, false],
    ["MapperOpen", "showMapper", 1, false],
    ["fullScreen", -1, 3, false],
    ["enableMXP", 0, 1, true],
    ["enableMSP", 0, 1, true],
    ["parseCommands", 0, 3, true],
    ["lagMeter", 0, 1, true],
    ["enablePing", 0, 1, false],
    ["enableEcho", 0, 1, true],
    ["enableSpeedpaths", 0, 1, true],
    ["speedpathsChar", 0, 0, "!", 1],
    ["parseSpeedpaths", 0, 1, true],
    ["profile", -1, 0, "Default", 1],
    ["parseSingleQuotes", 0, 1, false],
    ["parseDoubleQuotes", 0, 1, true],
    ["logEnabled", 0, 1, false],
    ["logPrepend", 0, 1, false],
    ["logOffline", 0, 1, false],
    ["logUniqueOnConnect", 0, 1, true],
    ["enableURLDetection", 0, 1, true],
    ["colors", 0, 4],
    ["notifyMSPPlay", 0, 1, false],
    ["CommandonClick", 0, 1, true],
    ["allowEval", 0, 1, true],
    ["allowEscape", 0, 1, true],
    ["AutoCopySelectedToClipboard", 0, 1, false],
    ["enableDebug", 0, 1, false],
    ["editorPersistent", 0, 1, false],
    ["askonclose", 0, 1, true],
    ["dev", 0, 1, false],
    //New settings
    ["chat.captureLines", 0, 1, false],
    ["chat.captureAllLines", 0, 1, false],
    ["chat.captureReviews", 0, 1, false],
    ["chat.captureTells", 0, 1, false],
    ["chat.captureTalk", 0, 1, false],
    ["chat.gag", 0, 1, false],
    ["chat.CaptureOnlyOpen", 0, 1, false],
    ["checkForUpdates", 0, 1, false],
    ["autoCreateCharacter", 0, 1, false],
    ["askonchildren", 0, 1, true],
    ["mapper.legend", 0, 1, false],
    ["mapper.room", 0, 1, false],
    ["mapper.importType", 0, 2, 1],
    ["mapper.vscroll", 0, 2, 0],
    ["mapper.hscroll", 0, 2, 0],
    ["mapper.scale", 0, 2, 100],
    ["mapper.alwaysOnTop", 0, 1, false],
    ["mapper.alwaysOnTopClient", 0, 1, true],
    ["mapper.memory", 0, 1, false],
    ["mapper.memorySavePeriod", 0, 2, 9e5],
    ["mapper.active.ID", 0, 0, null],
    ["mapper.active.x", 0, 2, 0],
    ["mapper.active.y", 0, 2, 0],
    ["mapper.active.z", 0, 2, 0],
    ["mapper.active.area", 0, 0, null],
    ["mapper.active.zone", 0, 2, 0],
    ["mapper.persistent", 0, 1, true],
    ["profiles.split", 0, 2, 200],
    ["profiles.askoncancel", 0, 1, true],
    ["profiles.triggersAdvanced", 0, 1, false],
    ["profiles.aliasesAdvanced", 0, 1, false],
    ["profiles.buttonsAdvanced", 0, 1, false],
    ["profiles.macrosAdvanced", 0, 1, false],
    ["profiles.contextsAdvanced", 0, 1, false],
    ["profiles.codeEditor", 0, 1, true],
    ["profiles.watchFiles", 0, 1, true],
    ["chat.alwaysOnTop", 0, 1, false],
    ["chat.alwaysOnTopClient", 0, 1, true],
    ["chat.log", 0, 1, false],
    ["chat.persistent", 0, 1, false],
    ["chat.zoom", 0, 2, 1],
    ["chat.font", 0, 5, "'Courier New', Courier, monospace"],
    ["chat.fontSize", 0, 0, "1em"],
    ["title", 0, 0, "$t"],
    ["logGagged", 0, 1, false],
    ["logTimeFormat", 0, 0, "YYYYMMDD-HHmmss"],
    ["autoConnectDelay", 0, 2, 600],
    ["autoLogin", 0, 1, true],
    ["onDisconnect", 0, 2, 2 /* ReconnectDialog */],
    ["enableKeepAlive", 0, 1, false],
    ["keepAliveDelay", 0, 2, 0],
    ["newlineShortcut", 0, 2, 1 /* Ctrl */],
    ["logWhat", 0, 2, 1 /* Html */],
    ["logErrors", 0, 1, true],
    ["showErrorsExtended", 0, 1, false],
    ["reportCrashes", 0, 1, false],
    ["enableCommands", 0, 1, true],
    ["commandChar", 0, 0, "#", 1],
    ["escapeChar", 0, 0, "\\", 1],
    ["enableVerbatim", 0, 1, true],
    ["verbatimChar", 0, 0, "`"],
    ["soundPath", 0, 0, ""],
    ["logPath", 0, 0, ""],
    ["theme", 0, 0, ""],
    ["gamepads", 0, 1, false],
    ["buttons.connect", 0, 1, true],
    ["buttons.characters", 0, 1, true],
    ["buttons.preferences", 0, 1, true],
    ["buttons.log", 0, 1, true],
    ["buttons.clear", 0, 1, true],
    ["buttons.lock", 0, 1, true],
    ["buttons.map", 0, 1, true],
    ["buttons.user", 0, 1, true],
    ["buttons.mail", 0, 1, false],
    ["buttons.compose", 0, 1, false],
    ["buttons.immortal", 0, 1, true],
    ["buttons.codeEditor", 0, 1, false],
    ["find.case", 0, 1, false],
    ["find.word", 0, 1, false],
    ["find.reverse", 0, 1, false],
    ["find.regex", 0, 1, false],
    ["find.selection", 0, 1, false],
    ["find.show", 0, 1, false],
    ["display.split", 0, 1, false],
    ["display.splitHeight", 0, 2, -1],
    ["display.splitLive", 0, 1, true],
    ["display.roundedOverlays", 0, 1, true],
    ["backupLoad", 0, 2, 30 /* All */],
    ["backupSave", 0, 2, 30 /* All */],
    ["backupAllProfiles", 0, 1, true],
    ["scrollLocked", 0, 1, false],
    ["showStatus", 0, 1, !isMobile()],
    ["showCharacterManager", 0, 1, false],
    ["showChat", 0, 1, false],
    ["showEditor", 0, 1, false],
    ["showArmor", 0, 1, false],
    ["showStatusWeather", 0, 1, true],
    ["showStatusLimbs", 0, 1, true],
    ["showStatusHealth", 0, 1, true],
    ["showStatusExperience", 0, 1, true],
    ["showStatusPartyHealth", 0, 1, true],
    ["showStatusCombatHealth", 0, 1, true],
    ["showButtonBar", 0, 1, true],
    ["allowNegativeNumberNeeded", 0, 1, false],
    ["spellchecking", 0, 1, true],
    ["hideOnMinimize", 0, 1, false],
    ["showTrayIcon", 0, 1, false],
    ["statusExperienceNeededProgressbar", 0, 1, false],
    ["trayClick", 0, 2, 0],
    ["trayDblClick", 0, 2, 0],
    ["pasteSpecialPrefix", 0, 0, ""],
    ["pasteSpecialPostfix", 0, 0, ""],
    ["pasteSpecialReplace", 0, 0, ""],
    ["pasteSpecialPrefixEnabled", 0, 1, true],
    ["pasteSpecialPostfixEnabled", 0, 1, true],
    ["pasteSpecialReplaceEnabled", 0, 1, true],
    ["display.showSplitButton", 0, 1, true],
    ["chat.split", 0, 1, false],
    ["chat.splitHeight", 0, 2, -1],
    ["chat.splitLive", 0, 1, true],
    ["chat.roundedOverlays", 0, 1, true],
    ["chat.showSplitButton", 0, 1, true],
    ["chat.bufferSize", 0, 2, 500],
    ["chat.flashing", 0, 1, false],
    ["display.hideTrailingEmptyLine", 0, 1, true],
    ["display.enableColors", 0, 1, true],
    ["display.enableBackgroundColors", 0, 1, true],
    ["enableSound", 0, 1, true],
    ["allowHalfOpen", 0, 1, true],
    ["editorClearOnSend", 0, 1, true],
    ["editorCloseOnSend", 0, 1, true],
    ["askOnCloseAll", 0, 1, true],
    ["askonloadCharacter", 0, 1, true],
    ["mapper.roomWidth", 0, 2, 200],
    ["mapper.roomGroups", 0, 2, 1 | 2 | 4],
    ["mapper.showInTaskBar", 0, 1, false],
    ["profiles.enabled", 0, 4, []],
    ["profiles.sortOrder", 0, 2, 4 /* Priority */ | 8 /* Index */],
    ["profiles.sortDirection", 0, 2, 1],
    ["profiles.showInTaskBar", 0, 1, false],
    ["profiles.profileSelected", 0, 0, "default"],
    ["profiles.profileExpandSelected", 0, 1, true],
    ["chat.lines", 0, 4, []],
    ["chat.showInTaskBar", 0, 1, false],
    ["chat.showTimestamp", 0, 2 /* Number */, 0],
    ["chat.timestampFormat", 0, 0, "[[]MM-DD HH:mm:ss.SSS[]] "],
    ["chat.tabWidth", 0, 2, 8],
    ["chat.displayControlCodes", 0, 1, false],
    ["chat.emulateTerminal", 0, 1, false],
    ["chat.emulateControlCodes", 0, 1, true],
    ["chat.wordWrap", 0, 1, false],
    ["chat.wrapAt", 0, 2, 0],
    ["chat.indent", 0, 2, 4],
    ["chat.scrollLocked", 0, 1, false],
    ["chat.find.case", 0, 1, false],
    ["chat.find.word", 0, 1, false],
    ["chat.find.reverse", 0, 1, false],
    ["chat.find.regex", 0, 1, false],
    ["chat.find.selection", 0, 1, false],
    ["chat.find.show", 0, 1, false],
    ["chat.find.highlight", 0, 1, false],
    ["chat.find.location", 0, 4, [5, 20]],
    ["codeEditor.showInTaskBar", 0, 1, false],
    ["codeEditor.persistent", 0, 1, false],
    ["codeEditor.alwaysOnTop", 0, 1, false],
    ["codeEditor.alwaysOnTopClient", 0, 1, true],
    ["autoTakeoverLogin", 0, 1, false],
    ["fixHiddenWindows", 0, 1, true],
    ["maxReconnectDelay", 0, 2, 3600],
    ["enableBackgroundThrottling", 0, 1, true],
    ["enableBackgroundThrottlingClients", 0, 1, false],
    ["showInTaskBar", 0, 1, true],
    ["showLagInTitle", 0, 1, false],
    ["mspMaxRetriesOnError", 0, 2, 0],
    ["logTimestamp", 0, 1, false],
    ["logTimestampFormat", 0, 0, "[[]MM-DD HH:mm:ss.SSS[]] "],
    ["disableTriggerOnError", 0, 1, true],
    ["prependTriggeredLine", 0, 1, true],
    ["enableParameters", 0, 1, true],
    ["parametersChar", 0, 0, "%", 1],
    ["enableNParameters", 0, 1, true],
    ["nParametersChar", 0, 0, "$", 1],
    ["enableParsing", 0, 1, true],
    ["externalWho", 0, 1, true],
    ["externalHelp", 0, 1, true],
    ["watchForProfilesChanges", 0, 1, false],
    ["onProfileChange", 0, 2, 0 /* Nothing */],
    ["onProfileDeleted", 0, 2, 0 /* Nothing */],
    ["enableDoubleParameterEscaping", 0, 1, false],
    ["ignoreEvalUndefined", 0, 1, true],
    ["enableInlineComments", 0, 1, true],
    ["enableBlockComments", 0, 1, true],
    ["inlineCommentString", 0, 0, "//"],
    ["blockCommentString", 0, 0, "/*"],
    ["allowCommentsFromCommand", 0, 1, false],
    ["saveTriggerStateChanges", 0, 1, true],
    ["groupProfileSaves", 0, 1, false],
    ["groupProfileSaveDelay", 0, 2, 2e4],
    ["returnNewlineOnEmptyValue", 0, 1, false],
    ["pathDelay", 0, 2, 0],
    ["pathDelayCount", 0, 2, 1],
    ["echoSpeedpaths", 0, 1, false],
    ["alwaysShowTabs", 0, 1, false],
    ["scriptEngineType", 0, 2 /* Number */, 4 /* Simple */],
    ["initializeScriptEngineOnLoad", 0, 1 /* Boolean */, false],
    ["find.highlight", 0, 1 /* Boolean */, false],
    ["find.location", 0, 4 /* Custom */, [5, 20]],
    ["display.showInvalidMXPTags", 0, 1 /* Boolean */, false],
    ["display.showTimestamp", 0, 2 /* Number */, 0],
    ["display.timestampFormat", 0, 0 /* String */, "[[]MM-DD HH:mm:ss.SSS[]] "],
    ["display.displayControlCodes", 0, 1 /* Boolean */, false],
    ["display.emulateTerminal", 0, 1 /* Boolean */, false],
    ["display.emulateControlCodes", 0, 1 /* Boolean */, true],
    ["display.wordWrap", 0, 1 /* Boolean */, false],
    ["display.tabWidth", 0, 2 /* Number */, 8],
    ["display.wrapAt", 0, 2 /* Number */, 0],
    ["display.indent", 0, 2 /* Number */, 4],
    ["statusWidth", 0, 2 /* Number */, -1],
    ["showEditorInTaskBar", 0, 1 /* Boolean */, true],
    ["trayMenu", 0, 2 /* Number */, 0],
    ["lockLayout", 0, 1 /* Boolean */, false],
    ["loadLayout", 0, 0 /* String */, ""],
    ["useSingleInstance", 0, 1 /* Boolean */, true],
    ["onSecondInstance", 0, 2 /* Number */, 0],
    ["characterManagerDblClick", 0, 2 /* Number */, 0],
    ["enableTabCompletion", 1 /* Boolean */, true],
    ["ignoreCaseTabCompletion", 0, 1 /* Boolean */, false],
    ["tabCompletionBufferLimit", 0, 2 /* Number */, 100],
    ["enableNotifications", 0, 1 /* Boolean */, true],
    ["echo", 0, 2 /* Number */, 0 /* None */],
    ["commandAutoSize", 0, 1 /* Boolean */, false],
    ["commandWordWrap", 0, 1 /* Boolean */, false],
    ["commandScrollbars", 0, 1 /* Boolean */, false],
    ["tabCompletionList", 0, 0 /* String */, ""],
    ["tabCompletionLookupType", 0, 2 /* Number */, 1 /* PrependBuffer */],
    ["tabCompletionReplaceCasing", 0, 2 /* Number */, 0],
    ["characterManagerAddButtonAction", 0, 2 /* Number */, 0],
    ["enableCrashReporting", 0, 1 /* Boolean */, false],
    ["characterManagerPanelWidth", 0, 2 /* Number */, 0],
    ["ignoreInputLeadingWhitespace", 0, 1 /* Boolean */, false],
    ["profiles.find.case", 0, 1, false],
    ["profiles.find.word", 0, 1, false],
    ["profiles.find.reverse", 0, 1, false],
    ["profiles.find.regex", 0, 1, false],
    ["profiles.find.selection", 0, 1, false],
    ["profiles.find.show", 0, 1, false],
    ["profiles.find.value", 0, 1, false],
    ["skipMore", 0, 1, false],
    ["skipMoreDelay", 0, 2 /* Number */, 5e3],
    ["commandMinLines", 0, 2 /* Number */, 1],
    ["backupReplaceCharacters", 0, 1 /* Boolean */, true],
    ["simpleAlarms", 0, 1 /* Boolean */, false],
    ["simpleEditor", 0, 1 /* Boolean */, false],
    ["selectLastCommand", 0, 1 /* Boolean */, true]
  ];
  var Settings = class _Settings {
    constructor() {
      for (var s = 0, sl = SettingList.length; s < sl; s++) {
        if (SettingList[s][2] === 4 /* Custom */) continue;
        this[SettingList[s][0]] = _Settings.getValue(SettingList[s][0]);
        if (SettingList[s][1] && SettingList[s][1].length)
          this[SettingList[s][1]] = _Settings.getValue(SettingList[s][1]);
      }
      this.colors = _Settings.getValue("colors");
    }
    static {
      this.settingError = false;
    }
    static getValue(setting, defaultValue) {
      var tmp;
      if (_Settings.settingError) {
        if (defaultValue === null || typeof defaultValue == "undefined")
          return _Settings.defaultValue(setting);
        return defaultValue;
      }
      try {
        tmp = $.jStorage.get(setting);
        if (typeof tmp == "undefined" || tmp === null) {
          if (defaultValue === null || typeof defaultValue == "undefined")
            return _Settings.defaultValue(setting);
          return defaultValue;
        }
        switch (setting) {
          case "showChat":
          case "showStatus":
          case "showButtons":
          case "enableCommands":
          case "enableVerbatim":
          case "allowEscape":
          case "autoConnect":
          case "mapFollow":
          case "mapEnabled":
          case "flashing":
          case "commandEcho":
          case "enableAliases":
          case "enableTriggers":
          case "enableButtons":
          case "enableMacros":
          case "commandStacking":
          case "htmlLog":
          case "keepLastCommand":
          case "fullScreen":
          case "enableMXP":
          case "enableURLDetection":
          case "enableMCCP":
          case "enableUTF8":
          case "parseCommands":
          case "lagMeter":
          case "showScriptErrors":
          case "enablePing":
          case "enableEcho":
          case "enableSpeedpaths":
          case "parseSpeedpaths":
          case "mapper.enabled":
          case "MapperSplitArea":
          case "mapper.split":
          case "MapperFillWalls":
          case "mapper.fill":
          case "mapper.follow":
          case "MapperOpen":
          case "showMapper":
          case "parseSingleQuotes":
          case "parseDoubleQuotes":
          case "logEnabled":
          case "logOffline":
          case "logPrepend":
          case "logUniqueOnConnect":
          case "toolsPinned":
          case "notifyMSPPlay":
          case "CommandonClick":
          case "allowEval":
          case "disableTriggerOnError":
          case "prependTriggeredLine":
          case "chat.captureLines":
          case "chat.captureAllLines":
          case "chat.captureReviews":
          case "chat.captureTells":
          case "chat.captureTalk":
          case "chat.gag":
          case "chat.CaptureOnlyOpen":
          case "simpleAlarms":
          case "simpleEditor":
          case "selectLastCommand":
          case "showLagInTitle":
            if (tmp == 1)
              return true;
            return false;
          case "colors":
          case "chat.lines":
            if (tmp === null || typeof tmp == "undefined" || tmp.length === 0)
              return [];
            return JSON.parse(tmp);
        }
        return tmp;
      } catch (err) {
        if (!_Settings.settingError) {
          alert("Unable to save to localStorage so reverting to default,\n\nError description: " + err.message);
          _Settings.settingError = true;
        }
        if (defaultValue === null || typeof defaultValue == "undefined")
          return _Settings.defaultValue(defaultValue);
        return defaultValue;
      }
    }
    static setValue(setting, value) {
      switch (setting) {
        case "colors":
        case "chat.lines":
          if (value === null || typeof value == "undefined" || value.length === 0)
            $.jStorage.deleteKey(setting);
          else
            $.jStorage.set(setting, JSON.stringify(value));
          break;
        default:
          if (typeof value == "boolean") {
            if (value)
              $.jStorage.set(setting, 1);
            else
              $.jStorage.set(setting, 0);
          } else
            $.jStorage.set(setting, value);
          break;
      }
    }
    static clearValue(setting) {
      $.jStorage.deleteKey(setting);
    }
    static defaultValue(setting) {
      switch (setting) {
        case "bufferSize":
          return 500;
        case "commandDelay":
          return 500;
        case "commandDelayCount":
          return 5;
        case "commandHistorySize":
          return 20;
        case "fontSize":
          return "1em";
        case "cmdfontSize":
          return "1em";
        case "commandEcho":
          return true;
        case "flashing":
          return false;
        case "autoConnect":
          return true;
        case "enableAliases":
          return true;
        case "enableTriggers":
          return true;
        case "enableMacros":
          return true;
        case "showScriptErrors":
          return false;
        case "commandStacking":
          return true;
        case "commandStackingChar":
          return ";";
        case "htmlLog":
          return true;
        case "keepLastCommand":
          return true;
        case "enableMCCP":
          return true;
        case "enableUTF8":
          return true;
        case "font":
          return "'Courier New', Courier, monospace";
        case "cmdfont":
          return "'Courier New', Courier, monospace";
        case "mapFollow":
        case "mapper.follow":
          return true;
        case "mapEnabled":
        case "mapper.enabled":
          return true;
        case "MapperSplitArea":
        case "mapper.split":
          return false;
        case "MapperFillWalls":
        case "mapper.fill":
          return false;
        case "MapperOpen":
        case "showMapper":
          return false;
        case "fullScreen":
          return false;
        case "enableMXP":
          return true;
        case "enableMSP":
          return true;
        case "parseCommands":
          return true;
        case "lagMeter":
          return true;
        case "enablePing":
          return false;
        case "enableEcho":
          return true;
        case "enableSpeedpaths":
          return true;
        case "speedpathsChar":
          return "!";
        case "parseSpeedpaths":
          return true;
        case "profile":
          return "Default";
        case "parseSingleQuotes":
          return false;
        case "parseDoubleQuotes":
          return true;
        case "logEnabled":
          return false;
        case "logPrepend":
          return false;
        case "logOffline":
          return false;
        case "logUniqueOnConnect":
          return true;
        case "enableURLDetection":
          return true;
        case "notifyMSPPlay":
          return false;
        case "CommandonClick":
          return true;
        case "allowEval":
          return true;
        case "allowEscape":
          return true;
        case "AutoCopySelectedToClipboard":
          return false;
        case "enableDebug":
          return false;
        case "editorPersistent":
          return false;
        case "askonclose":
          return true;
        case "dev":
          return false;
        //New settings
        case "chat.captureLines":
          return false;
        case "chat.captureAllLines":
          return false;
        case "chat.captureReviews":
          return false;
        case "chat.captureTells":
          return false;
        case "chat.captureTalk":
          return false;
        case "chat.gag":
          return false;
        case "chat.CaptureOnlyOpen":
          return false;
        case "checkForUpdates":
          return false;
        case "autoCreateCharacter":
          return false;
        case "askonchildren":
          return true;
        case "mapper.legend":
          return false;
        case "mapper.room":
          return false;
        case "mapper.importType":
          return 1;
        case "mapper.vscroll":
          return 0;
        case "mapper.hscroll":
          return 0;
        case "mapper.scale":
          return 100;
        case "mapper.active":
          return {
            ID: null,
            x: 0,
            y: 0,
            z: 0,
            area: null,
            zone: 0
          };
        case "mapper.active.ID":
          return null;
        case "mapper.active.x":
          return 0;
        case "mapper.active.y":
          return 0;
        case "mapper.active.z":
          return 0;
        case "mapper.active.area":
          return null;
        case "mapper.active.zone":
          return 0;
        case "profiles.split":
          return 200;
        case "profiles.askoncancel":
          return true;
        case "profiles.triggersAdvanced":
          return false;
        case "profiles.aliasesAdvanced":
          return false;
        case "profiles.buttonsAdvanced":
          return false;
        case "profiles.macrosAdvanced":
          return false;
        case "profiles.contextsAdvanced":
          return false;
        case "profiles.codeEditor":
          return true;
        case "chat.log":
          return false;
        case "chat.zoom":
          return 1;
        case "chat.font":
          return "'Courier New', Courier, monospace";
        case "chat.fontSize":
          return "1em";
        case "title":
          return "$t";
        case "logGagged":
          return false;
        case "logTimeFormat":
          return "YYYYMMDD-HHmmss";
        case "autoConnectDelay":
          return 600;
        case "autoLogin":
          return true;
        case "onDisconnect":
          return 2 /* ReconnectDialog */;
        case "enableKeepAlive":
          return false;
        case "keepAliveDelay":
          return 0;
        case "newlineShortcut":
          return 1 /* Ctrl */;
        case "logWhat":
          return 1 /* Html */;
        case "logErrors":
          return true;
        case "showErrorsExtended":
          return false;
        case "reportCrashes":
          return false;
        case "enableCommands":
          return true;
        case "commandChar":
          return "#";
        case "escapeChar":
          return "\\";
        case "enableVerbatim":
          return true;
        case "verbatimChar":
          return "`";
        case "soundPath":
          return "";
        case "logPath":
          return "";
        case "theme":
          return "";
        case "gamepads":
          return false;
        case "backupLoad":
          return 30 /* All */;
        case "backupSave":
          return 30 /* All */;
        case "backupAllProfiles":
          return true;
        case "backupReplaceCharacters":
          return true;
        case "scrollLocked":
          return false;
        case "showStatus":
          return !isMobile();
        case "showChat":
          return false;
        case "showEditor":
          return false;
        case "showArmor":
          return false;
        case "showStatusWeather":
          return true;
        case "showStatusLimbs":
          return true;
        case "showStatusHealth":
          return true;
        case "showStatusExperience":
          return true;
        case "showStatusPartyHealth":
          return true;
        case "showStatusCombatHealth":
          return true;
        case "allowNegativeNumberNeeded":
          return false;
        case "spellchecking":
          return true;
        case "statusExperienceNeededProgressbar":
          return false;
        case "pasteSpecialPrefix":
          return "";
        case "pasteSpecialPostfix":
          return "";
        case "pasteSpecialReplace":
          return "";
        case "pasteSpecialPrefixEnabled":
          return true;
        case "pasteSpecialPostfixEnabled":
          return true;
        case "pasteSpecialReplaceEnabled":
          return true;
        case "display.showSplitButton":
          return true;
        case "chat.bufferSize":
          return 500;
        case "chat.flashing":
          return false;
        case "display.hideTrailingEmptyLine":
          return true;
        case "display.enableColors":
          return true;
        case "display.enableBackgroundColors":
          return true;
        case "enableSound":
          return true;
        case "editorClearOnSend":
          return true;
        case "editorCloseOnSend":
          return true;
        case "askOnCloseAll":
          return true;
        case "askonloadCharacter":
          return true;
        case "mapper.roomWidth":
          return 200;
        case "mapper.roomGroups":
          return 1 | 2 | 4;
        case "mapper.showInTaskBar":
          return false;
        case "profiles.enabled":
          return [];
        case "profiles.sortOrder":
          return 4 /* Priority */ | 8 /* Index */;
        case "profiles.sortDirection":
          return 1;
        case "profiles.profileSelected":
          return "default";
        case "profiles.profileExpandSelected":
          return true;
        case "chat.lines":
          return [];
        case "chat.showTimestamp":
          return 0;
        case "chat.timestampFormat":
          return "[[]MM-DD HH:mm:ss.SSS[]] ";
        case "chat.tabWidth":
          return 8;
        case "chat.displayControlCodes":
          return false;
        case "chat.emulateTerminal":
          return false;
        case "chat.emulateControlCodes":
          return true;
        case "chat.wordWrap":
          return false;
        case "chat.wrapAt":
          return 0;
        case "chat.indent":
          return 4;
        case "autoTakeoverLogin":
          return false;
        case "maxReconnectDelay":
          return 3600;
        case "showLagInTitle":
          return false;
        case "mspMaxRetriesOnError":
          return 0;
        case "logTimestamp":
          return false;
        case "logTimestampFormat":
          return "[[]MM-DD HH:mm:ss.SSS[]] ";
        case "disableTriggerOnError":
          return true;
        case "prependTriggeredLine":
          return true;
        case "enableParameters":
          return true;
        case "parametersChar":
          return "%";
        case "enableNParameters":
          return true;
        case "nParametersChar":
          return "$";
        case "enableParsing":
          return true;
        case "onProfileChange":
          return 0 /* Nothing */;
        case "onProfileDeleted":
          return 0 /* Nothing */;
        case "enableDoubleParameterEscaping":
          return false;
        case "ignoreEvalUndefined":
          return true;
        case "enableInlineComments":
          return true;
        case "enableBlockComments":
          return true;
        case "inlineCommentString":
          return "//";
        case "blockCommentString":
          return "/*";
        case "allowCommentsFromCommand":
          return false;
        case "saveTriggerStateChanges":
          return true;
        case "groupProfileSaves":
          return false;
        case "groupProfileSaveDelay":
          return 2e4;
        case "returnNewlineOnEmptyValue":
          return false;
        case "pathDelay":
          return 0;
        case "pathDelayCount":
          return 1;
        case "echoSpeedpaths":
          return false;
        case "scriptEngineType":
          return 4 /* Simple */;
        case "initializeScriptEngineOnLoad":
          return false;
        case "display.showInvalidMXPTags":
          return false;
        case "display.showTimestamp":
          return 0;
        case "display.timestampFormat":
          return "[[]MM-DD HH:mm:ss.SSS[]] ";
        case "display.displayControlCodes":
          return false;
        case "display.emulateTerminal":
          return false;
        case "display.emulateControlCodes":
          return true;
        case "display.wordWrap":
          return false;
        case "display.tabWidth":
          return 8;
        case "display.wrapAt":
          return 0;
        case "display.indent":
          return 4;
        case "statusWidth":
          return -1;
        case "extensions":
          return {};
        case "warnAdvancedSettings":
          return true;
        case "showAdvancedSettings":
          return false;
        case "enableTabCompletion":
          return true;
        case "ignoreCaseTabCompletion":
          return false;
        case "tabCompletionBufferLimit":
          return 100;
        case "enableNotifications":
          return true;
        case "echo":
          return 0 /* None */;
        case "commandAutoSize":
          return false;
        case "commandWordWrap":
          return false;
        case "commandMinLines":
          return 1;
        case "tabCompletionLookupType":
          return 1 /* PrependBuffer */;
        case "tabCompletionList":
          return "";
        case "tabCompletionReplaceCasing":
          return 0;
        case "ignoreInputLeadingWhitespace":
          return false;
        case "skipMore":
          return false;
        case "skipMoreDelay":
          return 5e3;
        case "simpleAlarms":
          return false;
        case "simpleEditor":
          return false;
        case "selectLastCommand":
          return true;
      }
      return null;
    }
    save() {
      for (var prop in this) {
        if (!this.hasOwnProperty(prop)) continue;
        _Settings.setValue(prop, this[prop]);
      }
    }
    reset() {
      for (var s = 0, sl = SettingList.length; s < sl; s++) {
        if (SettingList[s][2] === 4 /* Custom */) continue;
        this[SettingList[s][0]] = _Settings.defaultValue(SettingList[s][0]);
      }
      this.colors = [];
    }
  };

  // src/interface/settingsdialog.ts
  var SettingsDialog = class _SettingsDialog extends Dialog {
    constructor() {
      super({ title: '<i class="fas fa-cogs"></i> Settings', keepCentered: true, resizable: false, moveable: false, center: true, maximizable: false });
      this.body.style.padding = "10px";
      this.buildMenu();
      let footer = "";
      footer += `<button id="${this.id}-cancel" type="button" class="btn-sm float-end btn btn-light" title="Cancel dialog"><i class="bi bi-x-lg"></i><span class="icon-only"> Cancel</span></button>`;
      footer += `<button id="${this.id}-save" type="button" class="btn-sm float-end btn btn-primary" title="Confirm dialog"><i class="bi bi-save"></i><span class="icon-only"> Save</span></button>`;
      footer += `<button id="${this.id}-reset" type="button" class="btn-sm float-start btn btn-warning" title="Reset settings"><i class="bi bi-arrow-clockwise"></i><span class="icon-only"> Reset</span></button>`;
      footer += `<button id="${this.id}-reset-all" type="button" class="btn-sm float-start btn btn-warning" title="Reset All settings"><i class="bi bi-arrow-repeat"></i><span class="icon-only"> Reset All</span></button>`;
      footer += '<div class="vr float-start" style="margin-right: 4px;height: 29px;"></div>';
      footer += `<button id="${this.id}-export" type="button" class="btn-sm float-start btn btn-light" title="Export settings"><i class="bi bi-box-arrow-up"></i><span class="icon-only"> Export</span></button>`;
      footer += `<button id="${this.id}-import" type="button" class="btn-sm float-start btn btn-light" title="Import settings"><i class="bi bi-box-arrow-in-down"></i><span class="icon-only"> Import</span></button>`;
      this.footer.innerHTML = footer;
      this.footer.querySelector(`#${this.id}-cancel`).addEventListener("click", () => {
        removeHash(this._page);
        this.close();
      });
      this.footer.querySelector(`#${this.id}-export`).addEventListener("click", () => {
        var data = clone(this.settings);
        data.version = 2;
        fileSaveAs.show(JSON.stringify(data), "oiMUD.settings.txt", "text/plain");
      });
      this.footer.querySelector(`#${this.id}-import`).addEventListener("click", () => {
        openFileDialog("Import settings").then((files) => {
          readFile(files[0]).then((contents) => {
            try {
              var data = JSON.parse(contents);
              var s, sl;
              if (data.version === 1) {
                for (s = 0, sl = SettingList.length; s < sl; s++) {
                  this.settings[SettingList[s][0]] = data[SettingList[s][0]];
                }
                this.emit("import-rooms", data.rooms);
              } else if (data.version === 2 && !data.profiles) {
                for (s = 0, sl = SettingList.length; s < sl; s++) {
                  this.settings[SettingList[s][0]] = data[SettingList[s][0]];
                }
              } else
                setTimeout(function() {
                  new AlertDialog("Invalid file", "Unable to import file, not a valid settings file", 4 /* exclamation */).showModal();
                }, 50);
              this.loadPageSettings();
            } catch (err) {
              setTimeout(function() {
                new AlertDialog("Error importing", "Error importing file.", 3 /* error */).showModal();
              }, 50);
              client.error(err);
            }
          }).catch(client.error);
        }).catch(() => {
        });
      });
      this.footer.querySelector(`#${this.id}-reset`).addEventListener("click", () => {
        if (this._page === "settings-colors") {
          const confirm = new ConfirmDialog("Reset colors", "Reset colors?");
          confirm.on("button-click", (e) => {
            if (e.button === 4 /* Yes */) {
              var c;
              var colors = this.settings.colors = [];
              for (c = 0; c < 16; c++)
                this.setColor("color" + c, colors[c] || this.getDefaultColor(c));
              for (c = 256; c < 280; c++)
                this.setColor("color" + c, colors[c] || this.getDefaultColor(c));
              this.body.querySelector(`#colorScheme`).value = 0;
            }
          });
          confirm.showModal();
        } else if (this._page && this._page !== "settings" && this._page.length) {
          const pages = this._page.split("-");
          let title = capitalize(pages[pages.length - 1].match(/([A-Z]|^[a-z])[a-z]+/g).join(" "));
          const confirm = new ConfirmDialog(`Reset ${title} settings`, `Reset ${title} settings?`);
          confirm.on("button-click", (e) => {
            if (e.button === 4 /* Yes */) {
              const forms = this.body.querySelectorAll("input,select,textarea");
              for (let f = 0, fl = forms.length; f < fl; f++) {
                let id = forms[f].name || forms[f].id;
                this.settings[id] = Settings.defaultValue(id);
                if (forms[f].type === "checkbox" || forms[f].type === "radio")
                  forms[f].checked = this.settings[id];
                else
                  forms[f].value = this.settings[id];
              }
            }
          });
          confirm.showModal();
        } else {
          const confirm = new ConfirmDialog("Reset all settings", "Reset all settings?");
          confirm.on("button-click", (e) => {
            if (e.button === 4 /* Yes */)
              this.settings.reset();
          });
          confirm.showModal();
        }
      });
      this.footer.querySelector(`#${this.id}-reset-all`).addEventListener("click", () => {
        const confirm = new ConfirmDialog("Reset all settings", "Reset all settings?");
        confirm.on("button-click", (e) => {
          if (e.button === 4 /* Yes */)
            this.settings.reset();
        });
        confirm.showModal();
      });
      this.footer.querySelector(`#${this.id}-save`).addEventListener("click", () => {
        removeHash(this._page);
        for (var s in this.settings) {
          if (!this.settings.hasOwnProperty(s)) continue;
          Settings.setValue(s, this.settings[s]);
        }
        client.clearCache();
        client.loadOptions();
        this.close();
      });
      this.settings = new Settings();
      this.on("closed", () => {
        removeHash(this._page);
      });
      this.on("canceled", () => {
        removeHash(this._page);
      });
    }
    setBody(contents, args) {
      super.setBody(this.dialog.dataset.path === "settings" ? _SettingsDialog.menuTemplate : contents, args);
      this._page = this.dialog.dataset.path;
      const pages = this._page.split("-");
      let breadcrumb = "";
      let last = pages.length - 1;
      if (pages.length === 1)
        breadcrumb += '<li><i class="float-start fas fa-cogs" style="padding: 2px;margin-right: 2px;"></i></li>';
      else
        breadcrumb += '<li><a href="#' + pages.slice(0, 1).join("-") + '"><i class="float-start fas fa-cogs" style="padding: 2px;margin-right: 2px;"></i></a></li>';
      for (let p = 0, pl = pages.length; p < pl; p++) {
        let title = capitalize(pages[p].match(/([A-Z]|^[a-z])[a-z]+/g).join(" "));
        if (p === last)
          breadcrumb += '<li class="breadcrumb-item active">' + title + "</li>";
        else
          breadcrumb += '<li class="breadcrumb-item" aria-current="page"><a href="#' + pages.slice(0, p + 1).join("-") + '">' + title + "</a></li>";
      }
      this.title = '<ol class="float-start breadcrumb">' + breadcrumb + "</ol>";
      if (this._page === "settings") {
        if (this._menu)
          this._menu.style.display = "none";
        this.body.style.left = "";
        if (this.footer.querySelector(`#${this.id}-reset`))
          this.footer.querySelector(`#${this.id}-reset`).style.display = "none";
        _SettingsDialog.addPlugins(this.body.querySelector("div.contents"));
      } else {
        if (this._menu)
          this._menu.style.display = "";
        if (this.footer.querySelector(`#${this.id}-reset`))
          this.footer.querySelector(`#${this.id}-reset`).style.display = "";
        this.body.style.left = "200px";
      }
      this.body.scrollTop = 0;
      this.loadPageSettings();
    }
    buildMenu() {
      this.dialog.insertAdjacentHTML("beforeend", _SettingsDialog.menuTemplate.replace(' style="top:0;position: absolute;left:0;bottom:49px;right:0;"', ""));
      this._menu = this.dialog.querySelector(".contents");
      this._menu.classList.add("settings-menu");
      _SettingsDialog.addPlugins(this._menu);
      if (this._page === "settings")
        this._menu.style.display = "none";
      this.body.style.left = "200px";
    }
    loadPageSettings() {
      const forms = this.body.querySelectorAll("input,select,textarea");
      if (this._page === "settings-colors") {
        var c;
        var colors = this.settings.colors || [];
        for (c = 0; c < 16; c++)
          this.setColor("color" + c, colors[c] || this.getDefaultColor(c));
        for (c = 256; c < 280; c++)
          this.setColor("color" + c, colors[c] || this.getDefaultColor(c));
        for (let f = 0, fl = forms.length; f < fl; f++) {
          forms[f].addEventListener("change", (e) => {
            const target = e.currentTarget || e.target;
            let value = target.value;
            let id = parseInt(target.id.substring(5), 10);
            var colors2 = this.settings.colors || [];
            if (!colors2[id] || colors2[id].length === 0) {
              if (this.getDefaultColor(id) !== value)
                colors2[id] = value;
            } else if (this.getDefaultColor(id) !== value)
              delete colors2[id];
            else
              colors2[id] = value;
            this.settings.colors = colors2;
          });
          forms[f].addEventListener("input", (e) => {
            const target = e.currentTarget || e.target;
            let value = target.value;
            let id = parseInt(target.id.substring(5), 10);
            if (!this.settings.colors[id] || this.settings.colors[id].length === 0) {
              if (this.getDefaultColor(id) !== value)
                this.settings.colors[id] = value;
            } else if (this.getDefaultColor(id) !== value)
              delete this.settings.colors[id];
            else
              this.settings.colors[id] = value;
          });
        }
      } else {
        for (let f = 0, fl = forms.length; f < fl; f++) {
          if (forms[f].type === "radio") {
            forms[f].checked = "" + this.settings[forms[f].name] === forms[f].value;
            forms[f].addEventListener("change", (e) => {
              const target = e.currentTarget || e.target;
              if (target.checked)
                this.settings[target.name] = this.convertType(target.value, typeof this.settings[target.name]);
            });
          } else if (forms[f].type === "checkbox") {
            if (forms[f].dataset.enum === "true") {
              const name = forms[f].name || forms[f].id.substring(0, forms[f].id.lastIndexOf("-"));
              const value = +forms[f].id.substring(forms[f].id.lastIndexOf("-") + 1);
              forms[f].checked = (this.settings[name] & value) === value;
            } else
              forms[f].checked = this.settings[forms[f].name || forms[f].id];
            forms[f].addEventListener("change", (e) => {
              const target = e.currentTarget || e.target;
              if (target.dataset.enum === "true") {
                const name = target.name || target.id.substring(0, target.id.lastIndexOf("-"));
                const enums = this.body.querySelectorAll(`[name=${name}]`);
                let value = 0;
                for (let e2 = 0, el = enums.length; e2 < el; e2++) {
                  if (enums[e2].checked)
                    value |= +enums[e2].value;
                }
                this.settings[name] = value;
              } else
                this.settings[target.name || target.id] = target.checked || false;
            });
          } else {
            forms[f].value = this.settings[forms[f].id];
            forms[f].addEventListener("change", (e) => {
              const target = e.currentTarget || e.target;
              this.setValue(target.name || target.id, target.value);
            });
            forms[f].addEventListener("input", (e) => {
              const target = e.currentTarget || e.target;
              this.setValue(target.name || target.id, target.value);
            });
          }
        }
      }
    }
    setColor(id, color) {
      if (!color || typeof color === "undefined" || color.length === 0)
        this.body.querySelector("#" + id).value = "";
      else
        this.body.querySelector("#" + id).value = this.colorHex(color);
    }
    colorHex(color) {
      if (!color) return false;
      color = new RGBColor(color);
      if (!color.ok)
        return "";
      return color.toHex();
    }
    getDefaultColor(code) {
      if (code === 0) return "rgb(0,0,0)";
      if (code === 1) return "rgb(128, 0, 0)";
      if (code === 2) return "rgb(0, 128, 0)";
      if (code === 3) return "rgb(128, 128, 0)";
      if (code === 4) return "rgb(0, 0, 128)";
      if (code === 5) return "rgb(128, 0, 128)";
      if (code === 6) return "rgb(0, 128, 128)";
      if (code === 7) return "rgb(192, 192, 192)";
      if (code === 8) return "rgb(128, 128, 128)";
      if (code === 9) return "rgb(255, 0, 0)";
      if (code === 10) return "rgb(0, 255, 0)";
      if (code === 11) return "rgb(255, 255, 0)";
      if (code === 12) return "rgb(0, 0, 255)";
      if (code === 13) return "rgb(255, 0, 255)";
      if (code === 14) return "rgb(0, 255, 255)";
      if (code === 15) return "rgb(255, 255, 255)";
      if (code === 256) return "rgb(0, 0, 0)";
      if (code === 257) return "rgb(118, 0, 0)";
      if (code === 258) return "rgb(0, 108, 0)";
      if (code === 259) return "rgb(145, 136, 0)";
      if (code === 260) return "rgb(0, 0, 108)";
      if (code === 261) return "rgb(108, 0, 108)";
      if (code === 262) return "rgb(0, 108, 108)";
      if (code === 263) return "rgb(160, 160, 160)";
      if (code === 264) return "rgb(0, 0, 0)";
      if (code === 265) return "rgb(128, 0, 0)";
      if (code === 266) return "rgb(0, 128, 0)";
      if (code === 267) return "rgb(128, 128, 0)";
      if (code === 268) return "rgb(0, 0, 128)";
      if (code === 269) return "rgb(128, 0, 128)";
      if (code === 270) return "rgb(0, 128, 128)";
      if (code === 271) return "rgb(192, 192, 192)";
      if (code === 272) return "rgb(0,0,0)";
      if (code === 273) return "rgb(0, 255, 255)";
      if (code === 274) return "rgb(0,0,0)";
      if (code === 275) return "rgb(255, 255, 0)";
      if (code === 276) return "rgb(0, 0, 0)";
      if (code === 277) return "rgb(192, 192, 192)";
      if (code === 278) return "rgb(128, 0, 0)";
      if (code === 279) return "rgb(192, 192, 192)";
      if (code === 280) return "rgb(255,255,255)";
      return "";
    }
    setValue(option, value) {
      if (value == "false") value = false;
      if (value == "true") value = true;
      if (value == "null") value = null;
      if (value == "undefined") value = void 0;
      if (typeof value == "string" && parseFloat(value).toString() == value)
        value = parseFloat(value);
      this.settings[option] = this.convertType(value, typeof this.settings[option]);
    }
    convertType(value, type) {
      if (typeof value === type)
        return value;
      switch (type) {
        case "number":
          if (typeof value == "string" && parseFloat(value).toString() == value)
            return parseFloat(value);
          return Number(value);
        case "boolean":
          return Boolean(value);
        case "string":
          return "" + value;
      }
      return value;
    }
    static addPlugins(menu) {
      let pl = client.plugins.length;
      let s;
      let sl;
      for (let p = 0; p < pl; p++) {
        if (!client.plugins[p].settings) continue;
        if (client.plugins[p].settings.length) {
          sl = client.plugins[p].settings.length;
          for (s = 0; s < sl; s++) {
            let item = client.plugins[p].settings[s];
            if (typeof item.action !== "string") continue;
            let code = `<a href="#${item.action}" class="list-group-item list-group-item-action">${item.icon || ""}${item.name || ""}</a>`;
            if ("position" in item) {
              if (typeof item.position === "string") {
                if (menu.querySelector(item.position)) {
                  menu.querySelector(item.position).insertAdjacentHTML("afterend", code);
                  continue;
                }
              } else if (item.position >= 0 && item.position < menu.children.length) {
                menu.children[item.position].insertAdjacentHTML("afterend", code);
                continue;
              }
            }
            menu.insertAdjacentHTML("beforeend", code);
          }
        }
      }
    }
    static get menuTemplate() {
      return `<div class="contents list-group list-group-flush" style="top:0;position: absolute;left:0;bottom:49px;right:0;"><a href="#settings-general" class="list-group-item list-group-item-action"><i class="fas fa-cogs"></i> General</a><a href="#settings-display" class="list-group-item list-group-item-action"><i class="fas fa-display"></i> Display</a><a href="#settings-colors" class="list-group-item list-group-item-action"><i class="fas fa-palette"></i> Colors</a><a href="#settings-commandLine" class="list-group-item list-group-item-action"><i class="fas fa-terminal"></i> Command line</a><a href="#settings-tabCompletion" class="list-group-item list-group-item-action"><i class="fa-solid fa-arrow-right-to-bracket"></i> Tab completion</a><a href="#settings-telnet" class="list-group-item list-group-item-action"><i class="fas fa-network-wired"></i> Telnet</a><a href="#settings-scripting" class="list-group-item list-group-item-action"><i class="fas fa-code"></i> Scripting</a><a href="#settings-specialCharacters" class="list-group-item list-group-item-action"><i class="fa-regular fa-file-code"></i> Special characters</a><a href="#settings-advanced" class="list-group-item list-group-item-action"><i class="fa-solid fa-sliders"></i> Advanced</a></div>`;
    }
  };

  // src/interface/splitter.ts
  var Splitter = class extends EventEmitter {
    constructor(options) {
      super();
      this.$panel1MinSize = 200;
      this.$panel2MinSize = 200;
      this.$splitterWidth = 4;
      this.$splitterDistance = 200;
      this.$dragging = false;
      this.$collapsed = 0;
      this.live = true;
      if (options && options.id)
        this.$id = options.id;
      if (options) {
        this.$panel1 = options.panel1;
        this.$panel2 = options.panel2;
      }
      if (options && options.container)
        this.parent = options.container.container ? options.container.container : options.container;
      else if (options && options.parent)
        this.parent = options.parent;
      else
        this.parent = document.body;
      if (options) {
        if ("anchor" in options)
          this.$anchor = options.anchor;
        else
          this.$anchor = 2 /* panel2 */;
        this.orientation = options.orientation || 0 /* horizontal */;
      } else {
        this.$anchor = 2 /* panel2 */;
        this.orientation = 0 /* horizontal */;
      }
    }
    hide() {
      this.$el.style.display = "none";
    }
    show() {
      this.$el.style.display = "";
    }
    get id() {
      return this.$id || this.parent.id;
    }
    set id(value) {
      if (value === this.$id) return;
      this.$id = value;
      this.$el.id = this.id + "-splitter";
      this.$panel1.id = this.id + "-splitter-panel1";
      this.$panel2.id = this.id + "-splitter-panel2";
      this.$dragBar.id = this.id + "-splitter-drag-bar";
      if (this.$ghostBar)
        this.$ghostBar.id = this.id + "-ghost-bar";
    }
    set parent(parent) {
      if (typeof parent === "string") {
        if (parent.startsWith("#"))
          this.$parent = document.getElementById(parent.substr(1));
        else
          this.$parent = document.getElementById(parent);
      } else if (parent instanceof $)
        this.$parent = parent[0];
      else if (parent instanceof HTMLElement)
        this.$parent = parent;
      if (!this.$parent)
        this.$parent = document.body;
      this.createControl();
    }
    get parent() {
      return this.$parent;
    }
    get panel1() {
      return this.$panel1;
    }
    get panel2() {
      return this.$panel2;
    }
    get anchor() {
      return this.$anchor;
    }
    set anchor(value) {
      if (this.$anchor === value) return;
      this.$anchor = 2;
      this.updatePanels();
    }
    set SplitterDistance(value) {
      if (this.$splitterDistance === value)
        return;
      this.$splitterDistance = value;
      this.updatePanels();
      this.emit("splitter-moved", value);
    }
    get SplitterDistance() {
      return this.$splitterDistance;
    }
    set Panel1MinSize(value) {
      if (this.$panel1MinSize === value)
        return;
      this.$panel1MinSize = value;
      if (this.$orientation === 0 /* horizontal */) {
        if (this.$panel1.clientWidth < value)
          this.$splitterDistance = this.parent.clientWidth - this.$panel1MinSize;
      } else if (this.$panel1.clientHeight < value)
        this.$splitterDistance = this.parent.clientHeight - this.$panel1MinSize;
      this.updatePanels();
    }
    get Panel1MinSize() {
      return this.$panel1MinSize;
    }
    set Panel2MinSize(value) {
      if (this.$panel2MinSize === value)
        return;
      this.$panel2MinSize = value;
      if (this.$orientation === 0 /* horizontal */) {
        if (this.$panel2.clientWidth < value)
          this.$splitterDistance = value;
      } else if (this.$panel2.clientHeight < value)
        this.$splitterDistance = value;
      this.updatePanels();
    }
    get Panel2MinSize() {
      return this.$panel2MinSize;
    }
    get orientation() {
      return this.$orientation;
    }
    set orientation(value) {
      if (value === this.$orientation) return;
      this.$orientation = value;
      this.updatePanels();
    }
    get panel1Collapsed() {
      return this.$collapsed === 1;
    }
    set panel1Collapsed(value) {
      if (value) {
        if (this.$collapsed === 1) return;
        this.$collapsed = 1;
        this.panel1.dataset.collapsed = "true";
        this.panel2.dataset.collapsed = "false";
        this.emit("collapsed", 1);
        this.updatePanels();
      } else if (this.$collapsed === 1) {
        this.$collapsed = 0;
        delete this.panel1.dataset.collapsed;
        delete this.panel2.dataset.collapsed;
        this.emit("collapsed", 0);
        this.updatePanels();
      }
    }
    get panel2Collapsed() {
      return this.$collapsed === 2;
    }
    set panel2Collapsed(value) {
      if (value) {
        if (this.$collapsed === 2) return;
        this.$collapsed = 2;
        this.panel1.dataset.collapsed = "false";
        this.panel2.dataset.collapsed = "true";
        this.emit("collapsed", 2);
        this.updatePanels();
      } else if (this.$collapsed === 2) {
        this.$collapsed = 0;
        delete this.panel1.dataset.collapsed;
        delete this.panel2.dataset.collapsed;
        this.emit("collapsed", 0);
        this.updatePanels();
      }
    }
    updatePanels() {
      if (this.$orientation === 0 /* horizontal */) {
        this.$panel1.style.left = "0";
        this.$panel1.style.top = "0";
        this.$panel1.style.right = "0";
        this.$panel2.style.left = "0";
        this.$panel2.style.top = "";
        this.$panel2.style.right = "0";
        this.$panel2.style.bottom = "0";
        this.$dragBar.style.left = "0";
        this.$dragBar.style.right = "0";
        if (this.$anchor === 1 /* panel1 */) {
          this.$dragBar.style.bottom = "";
          this.$dragBar.style.top = this.$splitterDistance + "px";
        } else {
          this.$dragBar.style.top = "";
          this.$dragBar.style.bottom = this.$splitterDistance - this.$splitterWidth + "px";
        }
        this.$dragBar.style.height = this.$splitterWidth + "px";
        this.$dragBar.style.cursor = "ns-resize";
        if (this.$collapsed === 1) {
          this.$panel1.style.display = "none";
          this.$panel2.style.display = "";
          this.$panel2.style.top = "0";
          this.$panel2.style.height = "";
          this.$dragBar.style.display = "none";
        } else if (this.$collapsed === 2) {
          this.$panel1.style.display = "";
          this.$panel1.style.bottom = "0";
          this.$panel1.style.height = "";
          this.$panel2.style.display = "none";
          this.$dragBar.style.display = "none";
        } else if (this.$anchor === 1 /* panel1 */) {
          this.$panel1.style.display = "";
          this.$panel1.style.height = this.$splitterDistance - this.$splitterWidth + "px";
          this.$panel2.style.display = "";
          this.$panel2.style.top = this.$splitterDistance - this.$splitterWidth + "px";
          this.$panel2.style.height = "";
          this.$dragBar.style.display = "";
        } else {
          this.$panel1.style.display = "";
          this.$panel1.style.bottom = this.$splitterDistance + "px";
          this.$panel2.style.display = "";
          this.$panel2.style.height = this.$splitterDistance - this.$splitterWidth + "px";
          this.$dragBar.style.display = "";
        }
        this.$el.classList.remove("vertical");
        this.$el.classList.add("horizontal");
      } else {
        this.$panel1.style.left = "0";
        this.$panel1.style.top = "0";
        this.$panel1.style.bottom = "0";
        this.$panel1.classList.remove("horizontal");
        this.$panel1.classList.add("vertical");
        this.$panel2.style.left = "";
        this.$panel2.style.top = "0";
        this.$panel2.style.right = "0";
        this.$panel2.style.bottom = "0";
        if (this.$anchor === 1 /* panel1 */) {
          this.$dragBar.style.right = "";
          this.$dragBar.style.left = this.$splitterDistance - this.$splitterWidth + "px";
        } else {
          this.$dragBar.style.left = "";
          this.$dragBar.style.right = this.$splitterDistance - this.$splitterWidth + "px";
        }
        this.$dragBar.style.top = "0";
        this.$dragBar.style.bottom = "0";
        this.$dragBar.style.width = this.$splitterWidth + "px";
        this.$dragBar.style.cursor = "ew-resize";
        if (this.$collapsed === 1) {
          this.$panel1.style.display = "none";
          this.$panel2.style.display = "";
          this.$panel2.style.left = "0";
          this.$panel2.style.width = "";
          this.$dragBar.style.display = "none";
        } else if (this.$collapsed === 2) {
          this.$panel1.style.display = "";
          this.$panel1.style.right = "0";
          this.$panel1.style.width = "";
          this.$panel2.style.display = "none";
          this.$dragBar.style.display = "none";
        } else if (this.$anchor === 1 /* panel1 */) {
          this.$panel1.style.display = "";
          this.$panel1.style.width = this.$splitterDistance - this.$splitterWidth + "px";
          this.$panel2.style.display = "";
          this.$panel2.style.left = this.$splitterDistance - this.$splitterWidth + "px";
          this.$panel2.style.width = "";
          this.$dragBar.style.display = "";
        } else {
          this.$panel1.style.display = "";
          this.$panel1.style.right = this.$splitterDistance + "px";
          this.$panel2.style.display = "";
          this.$panel2.style.width = this.$splitterDistance - this.$splitterWidth + "px";
          this.$dragBar.style.display = "";
        }
        this.$el.classList.remove("horizontal");
        this.$el.classList.add("vertical");
      }
    }
    createControl() {
      this.$el = document.createElement("div");
      this.$el.id = this.id + "-splitter";
      this.$el.classList.add("splitter");
      if (!this.$panel1) {
        this.$panel1 = document.createElement("div");
        this.$panel1.id = this.id + "-splitter-panel1";
      }
      this.$panel1.classList.add("splitter-panel", "splitter-panel-1");
      this.$el.appendChild(this.$panel1);
      if (!this.$panel2) {
        this.$panel2 = document.createElement("div");
        this.$panel2.id = this.id + "-splitter-panel2";
      }
      this.$panel2.classList.add("splitter-panel", "splitter-panel-2");
      this.$el.appendChild(this.$panel2);
      this.$dragBar = document.createElement("div");
      this.$dragBar.id = this.id + "-splitter-drag-bar";
      this.$dragBar.classList.add("spitter-drag-bar");
      this.$el.appendChild(this.$dragBar);
      this.$dragBar.tabIndex = 1;
      this.$dragBar.addEventListener("mousedown", (e) => {
        this.$dragBar.focus();
        e.preventDefault();
        this.$dragging = true;
        this.$ghostBar = document.createElement("div");
        this.$ghostBar.id = this.id + "-ghost-bar";
        this.$ghostBar.classList.add("splitter-ghost-bar");
        let bnd = this.$panel2.getBoundingClientRect();
        if (this.$anchor === 1 /* panel1 */)
          bnd = this.$panel1.getBoundingClientRect();
        if (this.$orientation === 0 /* horizontal */) {
          this.$ghostBar.style.left = "0";
          if (this.$anchor === 1 /* panel1 */)
            this.$ghostBar.style.top = bnd.bottom - this.$elBounds.top + "px";
          else
            this.$ghostBar.style.top = bnd.top - this.$elBounds.top - this.$splitterWidth + "px";
          this.$ghostBar.style.right = "0";
          this.$ghostBar.style.bottom = "";
          this.$ghostBar.style.width = "";
          this.$ghostBar.style.height = this.$splitterWidth + "px";
          this.$ghostBar.style.cursor = "ns-resize";
        } else {
          if (this.$anchor === 1 /* panel1 */)
            this.$ghostBar.style.left = bnd.right - this.$elBounds.left + "px";
          else
            this.$ghostBar.style.left = bnd.left - this.$elBounds.left - this.$splitterWidth + "px";
          this.$ghostBar.style.top = "0";
          this.$ghostBar.style.bottom = "0";
          this.$ghostBar.style.right = "";
          this.$ghostBar.style.height = "";
          this.$ghostBar.style.width = this.$splitterWidth + "px";
          this.$ghostBar.style.cursor = "ew-resize";
        }
        this.$ghostBar.move = (ge) => {
          let l;
          if (this.$orientation === 0 /* horizontal */ && this.$anchor === 1 /* panel1 */) {
            l = ge.pageY - this.$elBounds.top;
            if (l < this.$panel1MinSize + this.$splitterWidth)
              this.$ghostBar.style.top = this.$panel1MinSize + "px";
            else if (l > this.parent.clientHeight - this.$panel2MinSize - this.$splitterWidth)
              this.$ghostBar.style.top = this.parent.clientHeight - this.$panel2MinSize - this.$splitterWidth + "px";
            else
              this.$ghostBar.style.top = l - 2 + "px";
            if (this.live) {
              if (l < this.$panel1MinSize + this.$splitterWidth)
                this.SplitterDistance = this.$panel1MinSize + this.$splitterWidth;
              else if (l > this.parent.clientHeight - this.$panel2MinSize - this.$splitterWidth)
                this.SplitterDistance = this.parent.clientHeight - this.$panel2MinSize;
              else
                this.SplitterDistance = l - 2 + this.$splitterWidth;
            }
          } else if (this.$orientation === 0 /* horizontal */) {
            l = ge.pageY - this.$elBounds.top;
            if (l < this.$panel1MinSize)
              this.$ghostBar.style.top = this.$panel1MinSize + "px";
            else if (l > this.parent.clientHeight - this.$panel2MinSize)
              this.$ghostBar.style.top = this.parent.clientHeight - this.$panel2MinSize + "px";
            else
              this.$ghostBar.style.top = l - 2 + "px";
            if (this.live) {
              if (l < this.$panel1MinSize)
                this.SplitterDistance = this.parent.clientHeight - this.$panel1MinSize;
              else if (l > this.parent.clientHeight - this.$panel2MinSize)
                this.SplitterDistance = this.$panel2MinSize;
              else
                this.SplitterDistance = this.parent.clientHeight - l + 2;
            }
          } else if (this.$orientation === 1 /* vertical */ && this.$anchor === 1 /* panel1 */) {
            l = ge.pageX - this.$elBounds.left;
            if (l < this.$panel1MinSize + this.$splitterWidth)
              this.$ghostBar.style.left = this.$panel1MinSize + "px";
            else if (l >= this.parent.clientWidth - this.$panel2MinSize - this.$splitterWidth)
              this.$ghostBar.style.left = this.parent.clientWidth - this.$panel2MinSize - this.$splitterWidth + "px";
            else
              this.$ghostBar.style.left = l - 2 + "px";
            if (this.live) {
              if (l < this.$panel1MinSize + this.$splitterWidth)
                this.SplitterDistance = this.$panel1MinSize + this.$splitterWidth;
              else if (l >= this.parent.clientWidth - this.$panel2MinSize - this.$splitterWidth)
                this.SplitterDistance = this.parent.clientWidth - this.$panel2MinSize;
              else
                this.SplitterDistance = l - 2 + this.$splitterWidth;
            }
          } else {
            l = ge.pageX - this.$elBounds.left;
            if (l < this.$panel1MinSize)
              this.$ghostBar.style.left = this.$panel1MinSize + "px";
            else if (l > this.parent.clientWidth - this.$panel2MinSize)
              this.$ghostBar.style.left = this.parent.clientWidth - this.$panel2MinSize + "px";
            else
              this.$ghostBar.style.left = l - 2 + "px";
            if (this.live) {
              if (l < this.$panel1MinSize)
                this.SplitterDistance = this.parent.clientWidth - this.$panel1MinSize;
              else if (l > this.parent.clientWidth - this.$panel2MinSize)
                this.SplitterDistance = this.$panel2MinSize;
              else
                this.SplitterDistance = this.parent.clientWidth - l + 2;
            }
          }
          this.emit("splitter-moving", l);
        };
        this.$el.appendChild(this.$ghostBar);
        document.addEventListener("mousemove", this.$ghostBar.move);
      });
      this.$dragBar.addEventListener("dblclick", (e) => {
        this.emit("dblclick", e);
      });
      window.addEventListener("resize", () => {
        this.resize();
      });
      document.addEventListener("mouseup", (e) => {
        if (!this.$dragging) return;
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        let l;
        if (this.$orientation === 0 /* horizontal */) {
          l = e.pageY - this.$elBounds.top;
          if (this.$anchor === 1 /* panel1 */) {
            if (l < this.$panel1MinSize + this.$splitterWidth)
              this.SplitterDistance = this.$panel1MinSize + this.$splitterWidth;
            else if (l > this.parent.clientHeight - this.$panel2MinSize - this.$splitterWidth)
              this.SplitterDistance = this.parent.clientHeight - this.$panel2MinSize;
            else
              this.SplitterDistance = l - 2 + this.$splitterWidth;
          } else if (l < this.$panel1MinSize)
            this.SplitterDistance = this.parent.clientHeight - this.$panel1MinSize - 2;
          else if (l > this.parent.clientHeight - this.$panel2MinSize)
            this.SplitterDistance = this.$panel2MinSize;
          else
            this.SplitterDistance = this.parent.clientHeight - l + 2;
        } else {
          l = e.pageX - this.$elBounds.left;
          if (this.$anchor === 1 /* panel1 */) {
            if (l < this.$panel1MinSize + this.$splitterWidth)
              this.SplitterDistance = this.$panel1MinSize + this.$splitterWidth;
            else if (l > this.parent.clientWidth - this.$panel2MinSize - this.$splitterWidth)
              this.SplitterDistance = this.parent.clientWidth - this.$panel2MinSize;
            else
              this.SplitterDistance = l - 2 + this.$splitterWidth;
          } else if (l < this.$panel1MinSize)
            this.SplitterDistance = this.parent.clientWidth - this.$panel1MinSize - 2;
          else if (l > this.parent.clientWidth - this.$panel2MinSize)
            this.SplitterDistance = this.$panel2MinSize;
          else
            this.SplitterDistance = this.parent.clientWidth - l + 2;
        }
        this.$el.removeChild(this.$ghostBar);
        document.removeEventListener("mousemove", this.$ghostBar.move);
        this.$ghostBar = null;
        this.$dragging = false;
      });
      this.parent.appendChild(this.$el);
      setTimeout(() => {
        this.$elBounds = this.$el.getBoundingClientRect();
      }, 10);
      this.$resizeObserver = new ResizeObserver((entries, observer) => {
        if (entries.length === 0) return;
        if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
          return;
        if (!this.$resizeObserverCache || this.$resizeObserverCache.width !== entries[0].contentRect.width || this.$resizeObserverCache.height !== entries[0].contentRect.height) {
          this.$resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
          this.resize();
        }
      });
      this.$resizeObserver.observe(this.$el);
      this.$observer = new MutationObserver((mutationsList) => {
        let mutation;
        for (mutation of mutationsList) {
          if (mutation.type === "attributes" && mutation.attributeName === "style") {
            if (mutation.oldValue === "display: none;")
              this.resize();
          }
        }
      });
      this.$observer.observe(this.$el, { attributes: true, attributeOldValue: true, attributeFilter: ["style"] });
    }
    resize() {
      if (this.$orientation === 0 /* horizontal */ && this.$anchor === 1 /* panel1 */) {
        if (this.$panel2.clientHeight && this.$panel2.clientHeight < this.$panel2MinSize && this.$panel1.clientHeight > this.$panel1MinSize)
          this.SplitterDistance = this.parent.clientHeight - this.$panel2MinSize;
      } else if (this.$orientation === 0 /* horizontal */) {
        if (this.$panel1.clientHeight && this.$panel1.clientHeight < this.$panel1MinSize && this.$panel2.clientHeight > this.$panel2MinSize)
          this.SplitterDistance = this.$panel1MinSize;
      } else if (this.$orientation === 1 /* vertical */ && this.$anchor === 1 /* panel1 */) {
        if (this.$panel2.clientWidth && this.$panel2.clientWidth < this.$panel2MinSize && this.$panel1.clientWidth > this.$panel1MinSize)
          this.SplitterDistance = this.parent.clientWidth - this.$panel2MinSize;
      } else if (this.$panel1.clientWidth < this.$panel1MinSize && this.$panel2.clientWidth > this.$panel2MinSize)
        this.SplitterDistance = this.$panel1MinSize;
      this.$elBounds = this.$el.getBoundingClientRect();
    }
  };

  // src/profile.ts
  function MacroDisplay(item) {
    const d = [];
    if (item.gamepad > 0) {
      d.push("Gamepad " + item.gamepad);
      if (item.key > 0)
        d.push("Button " + item.key);
      else if (item.gamepadAxes < 0)
        d.push("Axis " + -item.gamepadAxes);
      else if (item.gamepadAxes > 0)
        d.push("Axis " + item.gamepadAxes);
      if (d.length === 1)
        return "None";
      return d.join("+");
    }
    if (item.key === 0) {
      if (item.name && item.name.length > 0)
        return "None - " + item.name;
      return "None";
    }
    if ((item.modifiers & 4 /* Ctrl */) === 4 /* Ctrl */)
      d.push("Ctrl");
    if ((item.modifiers & 2 /* Alt */) === 2 /* Alt */)
      d.push("Alt");
    if ((item.modifiers & 8 /* Shift */) === 8 /* Shift */)
      d.push("Shift");
    if ((item.modifiers & 16 /* Meta */) === 16 /* Meta */)
      d.push("Meta");
    if (keyCodeToChar[item.key])
      d.push(keyCodeToChar[item.key]);
    else if (item.name && item.name.length > 0)
      return "None - " + item.name;
    else
      return "None";
    if (item.name && item.name.length > 0)
      return d.join("+") + " - " + item.name;
    return d.join("+");
  }
  var Item = class _Item {
    constructor(data, profile) {
      this.name = "";
      this.priority = 0;
      this.display = "name";
      this.displaytype = 0 /* Text */;
      this.value = "";
      this.style = 1 /* Parse */;
      this.group = "";
      this.enabled = true;
      this.notes = "";
      if (typeof data === "object") {
        let prop;
        for (prop in data) {
          if (!data.hasOwnProperty(prop)) {
            continue;
          }
          this[prop] = data[prop];
        }
      }
      this.profile = profile;
    }
    clone() {
      return new _Item(this);
    }
  };
  var Button = class _Button extends Item {
    constructor(data, profile) {
      super(data);
      this.caption = "";
      this.icon = "";
      this.append = false;
      this.send = true;
      this.chain = false;
      this.stretch = false;
      this.parse = false;
      this.top = -1;
      this.left = -1;
      this.right = -1;
      this.bottom = -1;
      this.width = 64;
      this.height = 64;
      this.iconOnly = false;
      this.caption = "NewButton";
      this.display = "caption";
      if (typeof data === "object") {
        let prop;
        for (prop in data) {
          if (!data.hasOwnProperty(prop)) {
            continue;
          }
          this[prop] = data[prop];
        }
      }
      this.profile = profile;
    }
    clone() {
      return new _Button(this);
    }
  };
  var Macro = class _Macro extends Item {
    constructor(data, profile) {
      super();
      this.key = 0;
      this.append = false;
      this.send = true;
      this.modifiers = 0 /* None */;
      this.chain = false;
      this.gamepad = 0;
      this.gamepadAxes = 0;
      this.display = "return MacroDisplay(item)";
      this.displaytype = 1 /* Function */;
      if (typeof data === "object") {
        let prop;
        for (prop in data) {
          if (!data.hasOwnProperty(prop)) {
            continue;
          }
          this[prop] = data[prop];
        }
      }
      this.profile = profile;
    }
    clone() {
      return new _Macro(this);
    }
  };
  var Alias = class _Alias extends Item {
    constructor(pattern, value, profile) {
      super();
      this.pattern = "NewAlias";
      this.regexp = false;
      this.multi = false;
      this.append = true;
      this.params = "";
      if (typeof pattern === "string")
        this.pattern = pattern;
      if (value != null)
        this.value = value;
      this.display = "pattern";
      if (typeof pattern === "object") {
        let prop;
        for (prop in pattern) {
          if (!pattern.hasOwnProperty(prop)) {
            continue;
          }
          this[prop] = pattern[prop];
        }
      }
      this.profile = profile;
    }
    clone() {
      return new _Alias(this);
    }
  };
  var Trigger = class _Trigger extends Item {
    constructor(data, profile) {
      super(data);
      this.pattern = "NewTrigger";
      this.verbatim = false;
      this.triggerNewline = true;
      this.triggerPrompt = false;
      this.type = 0 /* Regular */;
      this.temp = false;
      this.caseSensitive = false;
      this.raw = false;
      this.state = 0;
      this.params = "";
      this.triggers = [];
      this.fired = false;
      this.display = "pattern";
      if (typeof data === "object") {
        let prop;
        for (prop in data) {
          if (!data.hasOwnProperty(prop)) {
            continue;
          }
          if (prop === "triggers") {
            this.triggers = [];
            const il = data.triggers.length;
            for (let i = 0; i < il; i++) {
              this.triggers.push(new _Trigger(data.triggers[i]));
            }
          } else
            this[prop] = data[prop];
        }
      }
      this.profile = profile;
    }
    clone() {
      return new _Trigger(this);
    }
    getState(state) {
      if (state === 0)
        return this;
      state--;
      if (state >= this.triggers.length || state < 0) return null;
      return this.triggers[state];
    }
  };
  var Context = class _Context extends Item {
    constructor(data, profile) {
      super(data);
      this.caption = "";
      this.icon = "";
      this.append = false;
      this.send = true;
      this.chain = false;
      this.parent = "";
      this.items = [];
      this.parse = false;
      this.caption = "NewContext";
      this.display = "caption";
      if (typeof data === "object") {
        let prop;
        for (prop in data) {
          if (!data.hasOwnProperty(prop)) {
            continue;
          }
          if (prop === "items") {
            let i = 0;
            const il = data[prop].length;
            for (; i < il; i++)
              this.items.push(new _Context(data[prop][i]));
          } else
            this[prop] = data[prop];
        }
      }
      this.profile = profile;
    }
    clone() {
      return new _Context(this);
    }
  };
  var Profile = class _Profile {
    constructor(name, defaults) {
      this.name = "";
      this.file = "";
      this.priority = 0;
      this.enabled = true;
      this.aliases = [];
      this.triggers = [];
      this.macros = [];
      this.buttons = [];
      this.contexts = [];
      this.enableMacros = true;
      this.enableTriggers = true;
      this.enableAliases = true;
      this.enableButtons = true;
      this.enableContexts = true;
      this.enableDefaultContext = true;
      if (typeof name === "string") {
        this.name = name;
        this.file = name.toLowerCase();
        if (defaults == null || defaults)
          this.macros = _Profile.DefaultMacros;
      } else if (typeof name === "boolean") {
        if (name)
          this.macros = _Profile.DefaultMacros;
      } else if (defaults == null || defaults)
        this.macros = _Profile.DefaultMacros;
    }
    static get Default() {
      return new _Profile("Default");
    }
    static get DefaultMacros() {
      const data = [
        {
          key: 97,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "sw",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "SouthWest",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 98,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "s",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "South",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 99,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "se",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "SouthEast",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 100,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "w",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "West",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 101,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "l",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "Look",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 102,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "e",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "East",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 103,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "nw",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "NorthWest",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 104,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "n",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "North",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        },
        {
          key: 105,
          display: "return MacroDisplay(item)",
          displaytype: 1 /* Function */,
          value: "ne",
          style: 1 /* Parse */,
          append: false,
          send: true,
          name: "NorthEast",
          group: "",
          enabled: true,
          modifiers: 0 /* None */,
          chain: true,
          priority: 0,
          notes: ""
        }
      ];
      const m = [];
      const dl = data.length;
      for (let d = 0; d < dl; d++)
        m.push(new Macro(data[d]));
      return m;
    }
    static get DefaultButtons() {
      const buttons = [];
      let b;
      b = new Button();
      b.right = 176;
      b.top = 14;
      b.caption = "fa-solid fa-angle-double-up";
      b.value = "up";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 124;
      b.top = 14;
      b.caption = "fa-solid fa-caret-up,rotate--45";
      b.value = "northwest";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 72;
      b.top = 14;
      b.caption = "fa-solid fa-caret-up";
      b.value = "north";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 20;
      b.top = 14;
      b.caption = "fa-solid fa-caret-up,rotate-45";
      b.value = "northeast";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 176;
      b.top = 66;
      b.caption = "fa-solid fa-crosshairs";
      b.value = "kill ${selected}";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 124;
      b.top = 66;
      b.caption = "fa-solid fa-caret-left";
      b.value = "west";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 72;
      b.top = 66;
      b.caption = "fa-solid fa-magnifying-glass";
      b.value = "look ${selected}";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 20;
      b.top = 66;
      b.caption = "fa-solid fa-caret-right";
      b.value = "east";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 176;
      b.top = 118;
      b.caption = "fa-solid fa-angle-double-down";
      b.value = "down";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 124;
      b.top = 118;
      b.caption = "fa-solid fa-caret-down,rotate-45";
      b.value = "southwest";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 72;
      b.top = 118;
      b.caption = "fa-solid fa-caret-down";
      b.value = "south";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      b = new Button();
      b.right = 20;
      b.top = 118;
      b.caption = "fa-solid fa-caret-down,rotate--45";
      b.value = "southeast";
      b.width = 48;
      b.height = 48;
      buttons.push(b);
      return buttons;
    }
    static load(file) {
      let profile;
      let data;
      if (typeof file === "object")
        data = file;
      else
        return new _Profile();
      profile = new _Profile(false);
      let prop;
      for (prop in data) {
        if (!data.hasOwnProperty(prop)) {
          continue;
        }
        if (prop === "aliases" || prop === "triggers" || prop === "macros" || prop === "buttons" || prop === "contexts" || prop === "variables")
          continue;
        profile[prop] = data[prop];
      }
      let i;
      let il;
      if (data.aliases && data.aliases.length > 0) {
        il = data.aliases.length;
        for (i = 0; i < il; i++) {
          profile.aliases.push(new Alias(data.aliases[i], null, profile));
        }
      }
      if (data.triggers && data.triggers.length > 0) {
        il = data.triggers.length;
        for (i = 0; i < il; i++) {
          profile.triggers.push(new Trigger(data.triggers[i], profile));
        }
      }
      if (data.macros && data.macros.length > 0) {
        il = data.macros.length;
        profile.macros = [];
        for (i = 0; i < il; i++) {
          profile.macros.push(new Macro(data.macros[i], profile));
        }
      }
      if (data.buttons && data.buttons.length > 0) {
        il = data.buttons.length;
        for (i = 0; i < il; i++) {
          profile.buttons.push(new Button(data.buttons[i], profile));
        }
      }
      if (data.contexts && data.contexts.length > 0) {
        il = data.contexts.length;
        for (i = 0; i < il; i++) {
          profile.contexts.push(new Context(data.contexts[i], profile));
        }
      }
      profile.file = profile.name;
      return profile;
    }
    clone(version) {
      let data;
      let i;
      let il;
      if (version === 2) {
        data = {
          name: this.name,
          priority: this.priority,
          enabled: this.enabled,
          aliases: [],
          triggers: [],
          macros: [],
          buttons: [],
          contexts: [],
          enableMacros: this.enableMacros,
          enableTriggers: this.enableTriggers,
          enableAliases: this.enableAliases,
          enableButtons: this.enableButtons,
          enableContexts: this.enableContexts,
          enableDefaultContext: this.enableDefaultContext
        };
        if (this.aliases.length > 0) {
          il = this.aliases.length;
          for (i = 0; i < il; i++) {
            data.aliases.push({
              pattern: this.aliases[i].pattern,
              value: this.aliases[i].value,
              priority: this.aliases[i].priority,
              regexp: this.aliases[i].regexp,
              style: this.aliases[i].style,
              multi: this.aliases[i].multi,
              append: this.aliases[i].append,
              name: this.aliases[i].name,
              group: this.aliases[i].group,
              enabled: this.aliases[i].enabled,
              params: this.aliases[i].params,
              display: this.aliases[i].display,
              notes: this.aliases[i].notes || ""
            });
          }
        }
        if (this.triggers.length > 0) {
          il = this.triggers.length;
          for (i = 0; i < il; i++) {
            const t = {
              pattern: this.triggers[i].pattern,
              value: this.triggers[i].value,
              priority: this.triggers[i].priority,
              verbatim: this.triggers[i].verbatim,
              style: this.triggers[i].style,
              name: this.triggers[i].name,
              group: this.triggers[i].group,
              enabled: this.triggers[i].enabled,
              display: this.triggers[i].display,
              triggernewline: this.triggers[i].triggerNewline,
              caseSensitive: this.triggers[i].caseSensitive,
              triggerprompt: this.triggers[i].triggerPrompt,
              raw: this.triggers[i].raw,
              type: this.triggers[i].type,
              notes: this.triggers[i].notes || "",
              state: this.triggers[i].state || 0,
              params: this.triggers[i].params || "",
              triggers: []
            };
            if (this.triggers[i].triggers && this.triggers[i].triggers.length) {
              const sl = this.triggers[i].triggers.length;
              for (let s = 0; s < sl; s++) {
                t.triggers.push({
                  pattern: this.triggers[i].triggers[s].pattern,
                  value: this.triggers[i].triggers[s].value,
                  priority: this.triggers[i].triggers[s].priority,
                  verbatim: this.triggers[i].triggers[s].verbatim,
                  style: this.triggers[i].triggers[s].style,
                  name: this.triggers[i].triggers[s].name,
                  group: this.triggers[i].triggers[s].group,
                  enabled: this.triggers[i].triggers[s].enabled,
                  display: this.triggers[i].triggers[s].display,
                  triggernewline: this.triggers[i].triggers[s].triggerNewline,
                  caseSensitive: this.triggers[i].triggers[s].caseSensitive,
                  triggerprompt: this.triggers[i].triggers[s].triggerPrompt,
                  raw: this.triggers[i].triggers[s].raw,
                  type: this.triggers[i].triggers[s].type,
                  notes: this.triggers[i].triggers[s].notes || "",
                  state: this.triggers[i].triggers[s].state || 0,
                  params: this.triggers[i].triggers[s].params || "",
                  triggers: []
                });
              }
            }
            data.triggers.push(t);
          }
        }
        if (this.macros.length > 0) {
          il = this.macros.length;
          for (i = 0; i < il; i++) {
            data.macros.push({
              key: this.macros[i].key,
              value: this.macros[i].value,
              style: this.macros[i].style,
              append: this.macros[i].append,
              send: this.macros[i].send,
              name: this.macros[i].name,
              group: this.macros[i].group,
              enabled: this.macros[i].enabled,
              display: 'if(item.key === 0) return "None"; return keyCodeToChar[item.key]',
              displaytype: 1,
              modifiers: this.macros[i].modifiers,
              chain: this.macros[i].chain,
              notes: this.macros[i].notes || ""
            });
          }
        }
        if (this.buttons.length > 0) {
          il = this.buttons.length;
          for (i = 0; i < il; i++) {
            data.buttons.push(clone(this.buttons[i], (key, value) => {
              if (key === "profile") return void 0;
              return value;
            }));
          }
        }
        if (this.contexts.length > 0) {
          il = this.contexts.length;
          for (i = 0; i < il; i++) {
            data.contexts.push(clone(this.contexts[i], (key, value) => {
              if (key === "profile") return void 0;
              return value;
            }));
          }
        }
        return data;
      }
      data = clone(this, (key, value) => {
        if (key === "profile") return void 0;
        return value;
      });
      const profile = new _Profile(false);
      let prop;
      for (prop in data) {
        if (!data.hasOwnProperty(prop)) {
          continue;
        }
        if (prop === "aliases" || prop === "triggers" || prop === "macros" || prop === "buttons" || prop === "contexts" || prop === "variables")
          continue;
        profile[prop] = data[prop];
      }
      if (data.aliases && data.aliases.length > 0) {
        il = data.aliases.length;
        for (i = 0; i < il; i++) {
          profile.aliases.push(new Alias(data.aliases[i], null, profile));
        }
      }
      if (data.triggers && data.triggers.length > 0) {
        il = data.triggers.length;
        for (i = 0; i < il; i++) {
          profile.triggers.push(new Trigger(data.triggers[i], profile));
        }
      }
      if (data.macros && data.macros.length > 0) {
        il = data.macros.length;
        profile.macros = [];
        for (i = 0; i < il; i++) {
          profile.macros.push(new Macro(data.macros[i], profile));
        }
      }
      if (data.buttons && data.buttons.length > 0) {
        il = data.buttons.length;
        for (i = 0; i < il; i++) {
          profile.buttons.push(new Button(data.buttons[i], profile));
        }
      }
      if (data.contexts && data.contexts.length > 0) {
        il = data.contexts.length;
        for (i = 0; i < il; i++) {
          profile.contexts.push(new Context(data.contexts[i], profile));
        }
      }
      return profile;
    }
    find(type, field, value) {
      let tmp;
      if (!type || type.length === 0 || !this[type] || this[type].length === 0)
        return null;
      tmp = SortItemArrayByPriority(this[type]);
      const l = tmp.length;
      for (let t = 0; t < l; t++) {
        if (tmp[t][field] === value)
          return tmp[t];
      }
      return null;
    }
    findAny(type, field, value) {
      let tmp;
      if (!type || type.length === 0 || !this[type] || this[type].length === 0)
        return null;
      tmp = SortItemArrayByPriority(this[type]);
      const l = tmp.length;
      if (typeof field === "object") {
        for (let t = 0; t < l; t++) {
          for (const v in field) {
            if (!field.hasOwnProperty(v)) continue;
            if (tmp[t][v] === field[v])
              return tmp[t];
          }
        }
        return -1;
      }
      for (let t = 0; t < l; t++) {
        if (tmp[t][field] === value)
          return tmp[t];
      }
      return null;
    }
    indexOfAny(type, field, value) {
      let tmp;
      if (!type || type.length === 0 || !this[type] || this[type].length === 0)
        return null;
      tmp = SortItemArrayByPriority(this[type]);
      const l = tmp.length;
      if (typeof field === "object") {
        for (let t = 0; t < l; t++) {
          for (const v in field) {
            if (!field.hasOwnProperty(v)) continue;
            if (tmp[t][v] === field[v])
              return this[type].indexOf(tmp[t]);
          }
        }
        return -1;
      }
      for (let t = 0; t < l; t++) {
        if (tmp[t][field] === value)
          return this[type].indexOf(tmp[t]);
      }
      return -1;
    }
    indexOf(type, field, value) {
      let tmp;
      if (!type || type.length === 0 || !this[type] || this[type].length === 0)
        return null;
      tmp = SortItemArrayByPriority(this[type]);
      const l = tmp.length;
      if (typeof field === "object") {
        for (let t = 0; t < l; t++) {
          for (const v in field) {
            if (!field.hasOwnProperty(v)) continue;
            if (tmp[t][v] !== field[v]) continue;
          }
          return this[type].indexOf(tmp[t]);
        }
        return -1;
      }
      for (let t = 0; t < l; t++) {
        if (tmp[t][field] === value)
          return this[type].indexOf(tmp[t]);
      }
      return -1;
    }
  };

  // src/interface/profilesdialog.ts
  var ProfilesDialog = class extends Dialog {
    constructor() {
      super(Object.assign({}, client.getOption("windows.profiles") || { center: true }, { title: 'i class="fas fa-users"></i> Profiles', minWidth: 410 }));
      this._profilesChanged = false;
      this._current = {
        profile: null,
        profileName: "",
        item: null,
        parent: null,
        itemIdx: -1,
        collection: "",
        itemSubIdx: -1
      };
      this._canClose = false;
      this._small = false;
      this.on("resized", (e) => {
        if (e.width < 430) {
          if (this._small) return;
          const item = this.header.querySelector(".breadcrumb");
          item.classList.add("breadcrumb-sm");
          this._small = true;
        } else if (this._small) {
          const item = this.header.querySelector(".breadcrumb");
          item.classList.remove("breadcrumb-sm");
          this._small = false;
        }
        client.setOption("windows.profiles", e);
      });
      client.on("profiles-loaded", () => {
        if (!this.profiles) {
          this.profiles = client.profiles.clone();
          this.profiles.SortByPriority();
          this._buildMenu();
        }
      });
      client.on("profiles-updated", () => {
      });
      client.on("initialized", () => {
        if (!this.profiles) {
          this.profiles = client.profiles.clone();
          this.profiles.SortByPriority();
          this._buildMenu();
        }
      });
      this.body.style.padding = "10px";
      this._splitter = new Splitter({ id: "profile", parent: this.body, orientation: 1 /* vertical */, anchor: 1 /* panel1 */ });
      if (client.getOption("profiles.split") >= 200)
        this._splitter.SplitterDistance = client.getOption("profiles.split");
      this._splitter.on("splitter-moved", (distance) => {
        client.setOption("profiles.split", distance);
      });
      this._menu = this._splitter.panel1;
      this._menu.style.overflow = "hidden";
      this._menu.style.overflowY = "auto";
      this._contents = this._splitter.panel2;
      this._contents.style.overflow = "auto";
      this._contents.style.padding = "10px";
      this._contents.style.paddingLeft = "14px";
      if (client.profiles) {
        this.profiles = client.profiles.clone();
        this.profiles.SortByPriority();
        this._buildMenu();
      }
      let footer = "";
      footer += `<button id="${this.id}-back" type="button" class="btn-sm float-start btn btn-light" title="Go back"><i class="bi bi-arrow-left"></i><span class="icon-only"> Back</span></button>`;
      footer += `<button id="btn-profile-menu" class="btn-sm float-start btn btn-outline-secondary" type="button" aria-controls="profile-menu" title="Show menu" data-bs-toggle="dropdown" aria-expanded="false" style="margin-right: 4px;"><i class="fa-solid fa-bars"></i></button>`;
      footer += `<ul id="${this.id}-dropdown-menu" class="dropdown-menu" style="overflow: auto;">`;
      footer += `<li id="${this.id}-add-profile"><a class="dropdown-item">Add profile</a></li>`;
      footer += `<li id="${this.id}-add-empty-profile"><a class="dropdown-item">Add empty profile</a></li>`;
      footer += `<li id="${this.id}-add-sep"><hr class="dropdown-divider"></li>`;
      footer += `<li id="${this.id}-add-alias"><a class="dropdown-item">Add alias</a></li>`;
      footer += `<li id="${this.id}-add-macro"><a class="dropdown-item">Add macro</a></li>`;
      footer += `<li id="${this.id}-add-trigger"><a class="dropdown-item">Add trigger</a></li>`;
      footer += `<li id="${this.id}-add-button"><a class="dropdown-item">Add button</a></li>`;
      footer += `<li id="${this.id}-add-sep2"><hr class="dropdown-divider"></li>`;
      footer += `<li id="${this.id}-add-default-buttons"><a class="dropdown-item">Add default buttons</a></li>`;
      footer += `<li id="${this.id}-add-default-macros"><a class="dropdown-item">Add default macros</a></li>`;
      footer += '<li><hr class="dropdown-divider"></li>';
      footer += `<li id="${this.id}-export-current"><a class="dropdown-item">Export current profile</a></li>`;
      footer += `<li id="${this.id}-export"><a class="dropdown-item">Export profiles</a></li>`;
      footer += `<li id="${this.id}-import"><a class="dropdown-item">Import profiles</a></li>`;
      footer += '<li><hr class="dropdown-divider"></li>';
      footer += `<li id="${this.id}-refresh"><a class="dropdown-item">Refresh</a></li>`;
      footer += "</ul>";
      footer += '<span id="profile-page-buttons"></span>';
      footer += `<button id="${this.id}-cancel" type="button" class="btn-sm float-end btn btn-light" title="Close dialog"><i class="bi bi-x-lg"></i><span class="icon-only"> Cancel</span></button>`;
      footer += `<button id="${this.id}-save" type="button" class="btn-sm float-end btn btn-primary" title="Save changes" disabled><i class="bi bi-save"></i><span class="icon-only"> Save</span></button>`;
      footer += `<button id="${this.id}-apply" type="button" class="btn-sm float-end btn btn-secondary" title="Apply changes" disabled><i class="bi bi-check-lg"></i><span class="icon-only"> Apply</span></button>`;
      this.footer.innerHTML = footer;
      this.footer.classList.add("dropup");
      document.getElementById("btn-profile-menu").addEventListener("shown.bs.dropdown", () => {
        setTimeout(() => {
          let el = this.footer.querySelector("#" + this.id + "-dropdown-menu");
          let rect = el.getBoundingClientRect();
          if (rect.y < 10)
            el.style.height = rect.height + rect.y - 10 + "px";
          if (rect.bottom > document.body.clientHeight - 10)
            el.style.height = document.body.clientHeight - rect.y - 10 + "px";
        }, 0);
      });
      document.getElementById("btn-profile-menu").addEventListener("hidden.bs.dropdown", () => {
        let el = this.footer.querySelector("#" + this.id + "-dropdown-menu");
        el.style.height = "";
      });
      this.footer.querySelector(`#${this.id}-cancel`).addEventListener("click", () => {
        removeHash(this._page);
        this.close();
      });
      this.footer.querySelector(`#${this.id}-back`).addEventListener("click", () => {
        this._goBack();
      });
      this.on("closed", () => {
        client.setOption("windows.profiles", this.windowState);
        removeHash(this._page);
      });
      this.on("canceled", () => {
        client.setOption("windows.profiles", this.windowState);
        removeHash(this._page);
      });
      this.on("moved", (e) => {
        client.setOption("windows.profiles", e);
      });
      this.on("maximized", () => {
        client.setOption("windows.profiles", this.windowState);
      });
      this.on("restored", () => {
        client.setOption("windows.profiles", this.windowState);
      });
      this.on("shown", () => {
        client.setOption("windows.profiles", this.windowState);
      });
      this.footer.querySelector(`#${this.id}-add-profile a`).addEventListener("click", () => {
        this._createProfile(true);
      });
      this.footer.querySelector(`#${this.id}-add-empty-profile a`).addEventListener("click", () => {
        this._createProfile(false);
      });
      this.footer.querySelector(`#${this.id}-add-alias a`).addEventListener("click", () => {
        this._addItem("aliases");
      });
      this.footer.querySelector(`#${this.id}-add-macro a`).addEventListener("click", () => {
        this._addItem("macros");
      });
      this.footer.querySelector(`#${this.id}-add-trigger a`).addEventListener("click", () => {
        this._addItem("triggers");
      });
      this.footer.querySelector(`#${this.id}-add-button a`).addEventListener("click", () => {
        this._addItem("buttons");
      });
      this.footer.querySelector(`#${this.id}-add-default-buttons a`).addEventListener("click", () => {
        const items = Profile.DefaultButtons;
        let il = items.length;
        for (let i = 0; i < il; i++)
          this._addItem("buttons", items[i]);
      });
      this.footer.querySelector(`#${this.id}-add-default-macros a`).addEventListener("click", () => {
        const items = Profile.DefaultMacros;
        let il = items.length;
        for (let i = 0; i < il; i++)
          this._addItem("macros", items[i]);
      });
      this.footer.querySelector(`#${this.id}-export-current a`).addEventListener("click", () => {
        const data = {
          version: 2,
          profiles: {}
        };
        data.profiles[this._current.profileName] = this._current.profile.clone(2);
        fileSaveAs.show(JSON.stringify(data), `oiMUD.${this._current.profileName}.txt`, "text/plain");
      });
      this.footer.querySelector(`#${this.id}-export a`).addEventListener("click", () => {
        const data = {
          version: 2,
          profiles: this.profiles.clone(2)
        };
        fileSaveAs.show(JSON.stringify(data), "oiMUD.profiles.txt", "text/plain");
      });
      this.footer.querySelector(`#${this.id}-import a`).addEventListener("click", () => {
        openFileDialog("Import profile(s)").then((files) => {
          readFile(files[0]).then((contents) => {
            try {
              var data = JSON.parse(contents);
              if (data.version == 2) {
                if (data.profiles) {
                  var keys = Object.keys(data.profiles);
                  var n, i, k = 0, kl = keys.length;
                  for (; k < kl; k++) {
                    n = keys[k];
                    i = 0;
                    while (this.profiles.contains(n)) {
                      if (i === 0)
                        n = keys[k] + " Copy";
                      else
                        n = keys[k] + " Copy (" + i + ")";
                      i++;
                    }
                    data.profiles[keys[k]].name = n;
                    const p = Profile.load(data.profiles[keys[k]]);
                    this.profiles.add(p);
                  }
                  if (kl === 0) return;
                  this.changed = true;
                  this._buildMenu();
                  this._expandPath(this._page);
                }
              } else
                setTimeout(function() {
                  alert_box("Invalid file", "Unable to import file, not a valid profile file", 4 /* exclamation */);
                }, 50);
            } catch (err) {
              setTimeout(function() {
                alert_box("Error importing", "Error importing file.", 3 /* error */);
              }, 50);
              client.error(err);
            }
          }).catch(client.error);
        }).catch(() => {
        });
      });
      this.footer.querySelector(`#${this.id}-refresh a`).addEventListener("click", () => {
        this._buildMenu();
        this.setBody(this._page);
      });
      this.footer.querySelector(`#${this.id}-save`).addEventListener("click", () => {
        if (this._errorField) {
          this._errorField.focus();
          return;
        }
        this._save();
        this.close();
      });
      this.footer.querySelector(`#${this.id}-apply`).addEventListener("click", () => {
        if (this._errorField) {
          this._errorField.focus();
          return;
        }
        this._save();
      });
    }
    set errorField(value) {
      this._errorField = value;
    }
    get errorField() {
      return this._errorField;
    }
    get current() {
      return this._current;
    }
    set changed(value) {
      if (value === this._profilesChanged) return;
      this._profilesChanged = value;
      this.footer.querySelector(`#${this.id}-save`).disabled = !value;
      this.footer.querySelector(`#${this.id}-apply`).disabled = !value;
    }
    get changed() {
      return this._profilesChanged;
    }
    get contents() {
      return this._contents;
    }
    _getItem(collection, index, idPrefix, hrefPrefix, indent) {
      if (!collection || collection.length === 0) return "";
      let menu = "";
      indent = indent || 0;
      let padding = indent * 20 + 16;
      menu += `<li class="nav-item" title="${htmlEncode(GetDisplay(collection[index]))}" id="${idPrefix + "-" + (collection[index].useName ? this.sanitizeID(collection[index].name.toLowerCase()) : index)}">`;
      if (collection[index].items && collection[index].items.length) {
        menu += `<a style="padding-left: ${padding}px" class="nav-link text-dark" href="#${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}"><i class="align-middle float-start bi bi-chevron-right"></i> <input data-page="${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}" type="checkbox" class="form-check-input" id="enabled-${idPrefix}-${this.sanitizeID(collection[index].name.toLowerCase())}"${collection[index].enabled ? " checked" : ""}> ${htmlEncode(GetDisplay(collection[index]))}</a>`;
        menu += this._getItems(collection[index].items, idPrefix + "-" + this.sanitizeID(collection[index].name.toLowerCase()), hrefPrefix + "/" + encodeURIComponent(collection[index].name.toLowerCase()), indent + 1);
      } else if (collection[index].useName)
        menu += `<a style="padding-left: ${padding}px" class="nav-link text-dark " href="#${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}"><i class="align-middle float-start no-icon"></i> <input data-page="${hrefPrefix}/${encodeURIComponent(collection[index].name.toLowerCase())}" type="checkbox" class="form-check-input" id="enabled-${idPrefix}-${this.sanitizeID(collection[index].name.toLowerCase())}"${collection[index].enabled ? " checked" : ""}> ${htmlEncode(GetDisplay(collection[index]))}</a>`;
      else
        menu += `<a style="padding-left: ${padding}px" class="nav-link text-dark" href="#${hrefPrefix}/${index}"><i class="align-middle float-start no-icon"></i><input type="checkbox" class="form-check-input" data-page="${hrefPrefix}/${index}" id="enabled-${idPrefix}-${index}"${collection[index].enabled ? " checked" : ""}> ${htmlEncode(GetDisplay(collection[index]))}</a>`;
      menu += "</li>";
      return menu;
    }
    _getItems(collection, idPrefix, hrefPrefix, indent) {
      if (!collection || collection.length === 0) return "";
      let menu = "";
      for (let c = 0, cl = collection.length; c < cl; c++) {
        menu += this._getItem(collection, c, idPrefix, hrefPrefix, indent);
      }
      return '<ul class="dropdown-menu dropdown-inline">' + menu + "</ul>";
    }
    _buildMenu() {
      let nav = "";
      for (let k = 0, kl = this.profiles.keys.length; k < kl; k++) {
        nav += this._profile(this.profiles.keys[k]);
      }
      this._menu.innerHTML = '<ul class="nav" id="profile-menu">' + nav + "</ul>";
      let items = this._menu.querySelectorAll("a");
      for (let i = 0, il = items.length; i < il; i++) {
        this._profileEvents(items[i]);
      }
    }
    _profileEvents(item) {
      let items = item.querySelectorAll(".bi-chevron-right");
      let i, il;
      for (i = 0, il = items.length; i < il; i++)
        items[i].addEventListener("click", (e) => {
          e.target.closest("li").querySelector(".dropdown-menu").classList.toggle("show");
          e.target.classList.toggle("bi-chevron-right");
          e.target.classList.toggle("bi-chevron-down");
          e.preventDefault();
        });
      items = item.querySelectorAll("input");
      for (i = 0, il = items.length; i < il; i++)
        items[i].addEventListener("change", (e) => {
          const data = e.target.dataset.page.split("/");
          const value = e.target.checked;
          switch (data.length) {
            case 2:
              if (!value && this.profiles.keys.filter((k) => this.profiles.enabled(k)).length === 1) {
                alert_box("Cannot disable", "One profile must always be enabled.");
                e.target.checked = true;
                return;
              }
              this._menu.querySelector(`#enabled-${this.sanitizeID(data[1])}`).checked = value;
              this._menu.querySelector(`#enabled-${this.sanitizeID(data[1])}-switch`).checked = value;
              if (this._page === e.target.dataset.page)
                this._contents.querySelector("#enabled").checked = value;
              this.profiles.items[data[1]].enabled = value;
              this.changed = true;
              break;
            case 3:
              this._menu.querySelector(`#enabled-${this.sanitizeID(data[1])}-${data[2]}`).checked = value;
              if (this._page === `profiles/${data[1]}`)
                this._contents.querySelector("#enable" + capitalize(data[2])).checked = value;
              this.profiles.items[data[1]]["enable" + capitalize(data[2])] = value;
              this.changed = true;
              break;
            case 4:
              this._menu.querySelector(`#enabled-${this.sanitizeID(data[1])}-${data[2]}-${data[3]}`).checked = value;
              if (this._page === e.target.dataset.page)
                this._contents.querySelector("#enabled").checked = value;
              else if (this._page === `profiles/${data[1]}/${data[2]}`)
                this._contents.querySelector("#check-" + data[3]).checked = value;
              this.profiles.items[data[1]][data[2]][+data[3]].enabled = value;
              this.changed = true;
              break;
          }
          e.stopPropagation();
          e.cancelBubble = true;
        });
      items = item.querySelectorAll(".list-badge-button");
      for (i = 0, il = items.length; i < il; i++)
        items[i].addEventListener("click", (e) => {
          this._deleteProfile(e.target.parentElement.dataset.profile);
          e.preventDefault();
        });
    }
    _profile(profile) {
      let nav = `<li class="nav-item" data-profile="${profile}" title="${capitalize(profile)}" id="${this.sanitizeID(profile)}">`;
      nav += `<a class="nav-link text-dark" href="#profiles/${encodeURIComponent(profile)}">`;
      if (profile !== "default")
        nav += `<span class="list-badge-button badge text-bg-danger" data-profile="${profile}"><i class="bi bi-trash"></i></span>`;
      nav += `<i class="align-middle float-start bi bi-chevron-right"></i> `;
      nav += this._item(capitalize(profile), "enabled-" + profile, this.profiles.items[profile].enabled);
      nav += `</a>`;
      nav += this._getItems([
        {
          name: "Aliases",
          items: this.profiles.items[profile].aliases,
          useName: true,
          enabled: this.profiles.items[profile].enableAliases
        },
        {
          name: "Macros",
          items: this.profiles.items[profile].macros,
          useName: true,
          enabled: this.profiles.items[profile].enableMacros
        },
        {
          name: "Triggers",
          items: this.profiles.items[profile].triggers,
          useName: true,
          enabled: this.profiles.items[profile].enableTriggers
        },
        {
          name: "Buttons",
          items: this.profiles.items[profile].buttons,
          useName: true,
          enabled: this.profiles.items[profile].enableButtons
        }
      ], this.sanitizeID(profile), "profiles/" + encodeURIComponent(profile), 1);
      nav += "</li>";
      return nav;
    }
    _item(title, id, enabled) {
      return `<span><input type="checkbox" data-page="profiles/${title.toLowerCase()}" class="form-check-input" id="${this.sanitizeID(id)}"${enabled ? " checked" : ""}> ${title}</span><div class="form-check form-switch"><input type="checkbox" class="form-check-input" id="${id}-switch"${enabled ? " checked" : ""}> ${title}</div>`;
    }
    setBody(contents, args) {
      if (!this.profiles) {
        setTimeout(() => {
          this.setBody(contents, args);
        }, 100);
        return;
      }
      if (this._errorField) {
        setTimeout(() => this._errorField.focus(), 100);
        window.location.hash = this._page;
        return;
      }
      this._page = this.dialog.dataset.path;
      if (this._page === "profiles")
        this.dialog.dataset.panel = "left";
      else
        this.dialog.dataset.panel = "right";
      const pages = this._page.split("/");
      let breadcrumb = "";
      let last = pages.length - 1;
      if (pages.length === 1)
        breadcrumb += '<li><i class="float-start fas fa-users" style="padding: 2px;margin-right: 2px;"></i></li>';
      else
        breadcrumb += '<li><a href="#' + pages.slice(0, 1).join("-") + '"><i class="float-start fas fa-users" style="padding: 2px;margin-right: 2px;"></i></a></li>';
      if (pages.length < 4)
        for (let p2 = 0, pl = pages.length; p2 < pl; p2++) {
          let title = capitalize(pages[p2]);
          if (p2 === last)
            breadcrumb += '<li class="breadcrumb-item active">' + title + "</li>";
          else
            breadcrumb += '<li class="breadcrumb-item" aria-current="page"><a href="#' + pages.slice(0, p2 + 1).join("/") + '">' + title + "</a></li>";
        }
      let k, kl, p;
      this._expandPath(pages);
      this.footer.querySelector("#profile-page-buttons").innerHTML = "";
      this.footer.querySelector(`#${this.id}-export-current`).style.display = "";
      this.title = `<ol class="breadcrumb${this._small ? " breadcrumb-sm" : ""}" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;flex-wrap: nowrap;">${breadcrumb}</ol>`;
      this._contents.scrollTop = 0;
      if (!this._setCurrent(pages))
        return;
      if (pages.length < 2) {
        this.footer.querySelector(`#${this.id}-export-current`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-sep`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-alias`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-macro`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-trigger`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-button`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-sep2`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-default-buttons`).style.display = "none";
        this.footer.querySelector(`#${this.id}-add-default-macros`).style.display = "none";
        this._splitter.panel2Collapsed = true;
        this.footer.querySelector(`#${this.id}-back`).style.display = "none";
      } else {
        this.footer.querySelector(`#${this.id}-add-sep`).style.display = "";
        this.footer.querySelector(`#${this.id}-add-alias`).style.display = "";
        this.footer.querySelector(`#${this.id}-add-macro`).style.display = "";
        this.footer.querySelector(`#${this.id}-add-trigger`).style.display = "";
        this.footer.querySelector(`#${this.id}-add-button`).style.display = "";
        this.footer.querySelector(`#${this.id}-back`).style.display = "";
        this.footer.querySelector(`#${this.id}-add-sep2`).style.display = "";
        this.footer.querySelector(`#${this.id}-add-default-buttons`).style.display = "";
        this.footer.querySelector(`#${this.id}-add-default-macros`).style.display = "";
        this._splitter.panel2Collapsed = false;
      }
      if (pages.length === 2) {
        if (this._contentPage !== "properties") {
          this._loadPage("properties").then(
            (contents2) => {
              this._contentPage = "properties";
              this._setContents(contents2);
              const forms = this._contents.querySelectorAll("input");
              this._contents.querySelector("#name").disabled = this._current.profileName === "default";
              for (let f = 0, fl = forms.length; f < fl; f++)
                if (forms[f].type === "checkbox") {
                  forms[f].checked = this._current.profile[forms[f].id];
                  forms[f].addEventListener("change", (e) => {
                    const value = e.target.checked;
                    if (e.target.id === "enabled") {
                      if (!value && this.profiles.keys.filter((k2) => this.profiles.enabled(k2)).length === 1) {
                        alert_box("Cannot disable", "One profile must always be enabled.");
                        e.target.checked = true;
                        return;
                      }
                      this._menu.querySelector(`#enabled-${this.sanitizeID(this._current.profileName)}`).checked = value;
                      this._menu.querySelector(`#enabled-${this.sanitizeID(this._current.profileName)}-switch`).checked = value;
                      if (this._page === e.target.dataset.page)
                        this._contents.querySelector("#enabled").checked = value;
                      this.profiles.items[this._current.profileName].enabled = value;
                    } else {
                      this._current.profile[e.target.id] = value;
                      this._menu.querySelector(`#enabled-${this.sanitizeID(this._current.profileName)}-${e.target.id.substring(6).toLowerCase()}`).checked = value;
                      this.changed = true;
                    }
                    this.changed = true;
                  });
                } else {
                  forms[f].value = this._current.profile[forms[f].id];
                  forms[f].addEventListener("change", (e) => {
                    const target = e.currentTarget || e.target;
                    if (target.id === "name") {
                      debounce(() => {
                        let err = this._renameProfile(target.value);
                        if (err === true) {
                          forms[f].classList.remove("is-invalid");
                          this._errorField = null;
                        } else {
                          forms[f].classList.add("is-invalid");
                          this._errorField = forms[f];
                          this._contents.querySelector("#name-feedback").textContent = err;
                        }
                        this._sortProfiles();
                      }, 200, "renameProfile");
                    } else {
                      this._current.profile[target.id] = target.value;
                      debounce(() => this._sortProfiles(), 200, "sortProfiles");
                    }
                    this.changed = true;
                  });
                  forms[f].addEventListener("input", (e) => {
                    const target = e.currentTarget || e.target;
                    if (target.id === "name") {
                      debounce(() => {
                        let err = this._renameProfile(target.value);
                        if (err === true) {
                          forms[f].classList.remove("is-invalid");
                          this._errorField = null;
                        } else {
                          forms[f].classList.add("is-invalid");
                          this._errorField = forms[f];
                          this._contents.querySelector("#name-feedback").textContent = err;
                        }
                        this._sortProfiles();
                      }, 200, "renameProfile");
                    } else {
                      this._current.profile[target.id] = target.value;
                      debounce(() => this._sortProfiles(), 200, "sortProfiles");
                    }
                    this.changed = true;
                  });
                }
            }
          ).catch(() => {
          });
        } else {
          this._contents.querySelector("#name").disabled = this._current.profileName === "default";
          const forms = this._contents.querySelectorAll("input");
          for (let f = 0, fl = forms.length; f < fl; f++) {
            if (forms[f].type === "checkbox")
              forms[f].checked = this._current.profile[forms[f].id];
            else
              forms[f].value = this._current.profile[forms[f].id];
          }
        }
        if (this._current.profileName !== "default") {
          let b = `<button id="${this.id}-remove" type="button" class="btn-sm btn btn-danger" title="Remove profile"><i class="bi bi-trash"></i></button>`;
          this.footer.querySelector("#profile-page-buttons").innerHTML = b;
          this.footer.querySelector(`#${this.id}-remove`).addEventListener("click", (e) => {
            if (this._errorField)
              this._errorField = null;
            this._deleteProfile(this._current.profileName);
          });
        }
      } else if (pages.length === 3) {
        let pp = "";
        if (this._current.item.length === 0) {
          p = '<h1 id="empty" style="width: 100%;text-align:center">No ' + this._current.collection + ".</h1>";
          p += `<button id="${this.id}-add-contents" type="button" class="btn-sm float-start btn btn-outline-secondary" title="Add ${this._getItemType()}"><i class="bi bi-plus-lg"></i> Add ${this._getItemType()}</button>`;
        } else {
          p = "";
          for (k = 0, kl = this._current.item.length; k < kl; k++) {
            p += `<a data-profile ="${this._current.profileName}" id="item-${k}" data-index="${k}" href="#profiles/${encodeURIComponent(this._current.profileName)}/${this._current.collection}/${k}" class="list-group-item list-group-item-action">`;
            p += `<span data-index="${k}" class="list-badge-button badge text-bg-danger"><i class="bi bi-trash"></i></span>`;
            p += `<div class="form-check-inline form-switch" style="margin: 0;">`;
            p += `<input type="checkbox" class="form-check-input" id="check-${k}" data-profile="${this._current.profileName}" data-index="${k}" data-field="enabled" data-items="${this._current.collection}"${this._current.item[k].enabled ? ' checked="checked"' : ""}>`;
            p += `</div>${htmlEncode(GetDisplay(this._current.item[k]))}</a>`;
          }
          pp = `<button id="${this.id}-add-contents" type="button" class="btn-sm btn btn-outline-secondary" title="Add ${this._getItemType()}" style="margin-bottom: 5px;width:100%;"><i class="bi bi-plus-lg"></i> Add ${this._getItemType()}</button>`;
        }
        let b = `<button id="${this.id}-add" type="button" class="btn-sm float-start btn btn-outline-secondary" title="Add ${this._getItemType()}"><i class="bi bi-plus-lg"></i></button>`;
        this.footer.querySelector("#profile-page-buttons").innerHTML = b;
        this._setContents(pp + '<div class="list-group">' + p + "</div>");
        let items = this._contents.querySelectorAll(".list-badge-button");
        for (let i = 0, il = items.length; i < il; i++)
          items[i].addEventListener("click", (e) => {
            this._removeItem(+e.target.parentElement.dataset.index);
            e.stopPropagation();
            e.cancelBubble = true;
            e.preventDefault();
          });
        this._contentPage = null;
        this.footer.querySelector(`#${this.id}-add`).addEventListener("click", () => {
          this._addItem();
        });
        if (this._contents.querySelector(`#${this.id}-add-contents`))
          this._contents.querySelector(`#${this.id}-add-contents`).addEventListener("click", () => {
            this._addItem();
          });
        items = this._contents.querySelectorAll("input");
        for (let i = 0, il = items.length; i < il; i++)
          items[i].addEventListener("change", (e) => {
            const target = e.currentTarget || e.target;
            const value = target.checked;
            this._menu.querySelector(`#enabled-${this.sanitizeID(this._current.profileName)}-${this._current.collection}-${target.dataset.index}`).checked = value;
            this._current.profile[this._current.collection][+target.dataset.index].enabled = value;
            this.changed = true;
          });
      } else if (pages.length === 4) {
        let b = `<button id="${this.id}-remove" type="button" class="btn-sm btn btn-danger" title="Remove ${this._getItemType()}"><i class="bi bi-trash"></i></button>`;
        this.footer.querySelector("#profile-page-buttons").innerHTML = b;
        this.footer.querySelector(`#${this.id}-remove`).addEventListener("click", (e) => {
          this._removeItem(this._current.itemIdx, 0, true);
          e.stopPropagation();
          e.cancelBubble = true;
          e.preventDefault();
        });
        for (let p2 = 0, pl = pages.length; p2 < pl; p2++) {
          if (p2 === last)
            breadcrumb += '<li class="breadcrumb-item active">' + htmlEncode(GetDisplay(this._current.item)) + "</li>";
          else
            breadcrumb += '<li class="breadcrumb-item" aria-current="page"><a href="#' + pages.slice(0, p2 + 1).join("/") + '">' + capitalize(pages[p2]) + "</a></li>";
        }
        this.title = `<ol class="breadcrumb${this._small ? " breadcrumb-sm" : ""}" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;flex-wrap: nowrap;">${breadcrumb}</ol>`;
        if (this._contentPage !== this._current.collection) {
          this._contentPage = this._current.collection;
          this._loadPage(this._current.collection).then((contents2) => {
            this._setContents(contents2);
            this._loadItem(true);
          }).catch(() => {
          });
        } else
          this._loadItem();
      } else if (pages.length === 5) {
        let b = `<button id="${this.id}-remove" type="button" class="btn-sm btn btn-danger" title="Remove ${this._getItemType()}"><i class="bi bi-trash"></i></button>`;
        this.footer.querySelector("#profile-page-buttons").innerHTML = b;
        this.footer.querySelector(`#${this.id}-remove`).addEventListener("click", (e) => {
          this._removeItem(this._current.itemIdx, 0, true);
          e.stopPropagation();
          e.cancelBubble = true;
          e.preventDefault();
        });
        let last2 = pages.length - 1;
        for (let p2 = 0, pl = pages.length; p2 < pl; p2++) {
          if (p2 === last2 - 1)
            breadcrumb += '<li class="breadcrumb-item"><a href="#' + pages.slice(0, p2 + 1).join("/") + '">' + htmlEncode(GetDisplay(this._current.parent)) + "</a></li>";
          else if (p2 === last2)
            breadcrumb += '<li class="breadcrumb-item active">' + htmlEncode(GetDisplay(this._current.item)) + "</li>";
          else
            breadcrumb += '<li class="breadcrumb-item" aria-current="page"><a href="#' + pages.slice(0, p2 + 1).join("/") + '">' + capitalize(pages[p2]) + "</a></li>";
        }
        this.title = `<ol class="breadcrumb${this._small ? " breadcrumb-sm" : ""}" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;flex-wrap: nowrap;">${breadcrumb}</ol>`;
        if (this._contentPage !== this._current.collection) {
          this._contentPage = this._current.collection;
          this._loadPage(this._current.collection).then((contents2) => this._setContents(contents2)).catch(() => {
            this._loadItem(true);
          });
        } else
          this._loadItem();
      } else {
        let b = `<button id="btn-${this.id}-add-profile" type="button" class="btn-sm btn btn-outline-secondary" title="Add profile"><i class="bi bi-plus-lg"></i></button>`;
        this.footer.querySelector("#profile-page-buttons").innerHTML = b;
        this.footer.querySelector(`#btn-${this.id}-add-profile`).addEventListener("click", () => {
          this._createProfile(true);
        });
        this._contentPage = null;
        this._setContents("");
      }
    }
    _setCurrent(pages) {
      if (!pages)
        return false;
      this._current.itemIdx = this._current.itemSubIdx = -1;
      this._current.parent = null;
      if (pages.length > 1) {
        this._current.profileName = pages[1];
        if (!this.profiles.contains(this._current.profileName)) {
          this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">Profile ${this._current.profileName} not found.</h1>`);
          this._contentPage = null;
          return false;
        }
        this._current.profile = this.profiles.items[this._current.profileName];
      }
      if (pages.length > 2) {
        this._current.collection = pages[2];
        if (!this._current.profile[this._current.collection]) {
          this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">${capitalize(this._current.collection)} not found in ${this._current.profileName}.</h1>`);
          this._contentPage = null;
          return false;
        }
        this._current.item = this._current.profile[pages[2]];
      }
      if (pages.length > 3) {
        this._current.itemIdx = +pages[3];
        if (this._current.itemIdx < 0 || this._current.itemIdx >= this._current.item.length) {
          this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">${capitalize(this._getItemType())} not found.</h1>`);
          this._contentPage = null;
          return;
        }
        this._current.item = this._current.profile[pages[2]][this._current.itemIdx];
      }
      if (pages.length > 4) {
        this._current.itemSubIdx = +pages[4];
        if (!this._current.item.triggers) {
          this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">Invalid trigger.</h1>`);
          this._contentPage = null;
          return;
        }
        if (this._current.itemSubIdx < 0 || this._current.itemSubIdx >= this._current.item.triggers.length) {
          this._setContents(`<h1 id="empty" style="width: 100%;text-align:center">Trigger state not found.</h1>`);
          this._contentPage = null;
          return;
        }
        this._current.parent = this._current.item;
        this._current.item = this._current.item.triggers[this._current.itemSubIdx];
      }
      return true;
    }
    _loadPage(page) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "dialogs/profiles-" + page + ".htm",
          cache: false,
          type: "GET"
        }).done((data) => {
          data = data.replace(/{profileURL}/g, encodeURIComponent(this._current.profileName)).replace(/{profile}/g, this._current.profileName);
          resolve(data);
        }).fail(function() {
          reject("");
        });
      });
    }
    _setContents(contents) {
      this._contents.innerHTML = contents;
      const scripts = this._contents.querySelectorAll("script");
      const args = {
        client,
        item: this._current.item,
        FilterArrayByKeyValue,
        keyCharToCode,
        keyCodeToChar,
        profile: this._current.profile,
        profileName: this._current.profileName,
        parent: this._current.parent,
        current: this._current,
        GetDisplay,
        Trigger,
        debounce,
        updateHash,
        DialogButtons
      };
      this.emit("content-changing");
      for (let s = 0, sl = scripts.length; s < sl; s++) {
        let script = new Function("body", "dialog", ...Object.keys(args), "try { " + scripts[s].textContent + "}catch(e){client.error(e)}");
        script.apply(client, [this._contents, this, ...Object.values(args), this]);
      }
      this.emit("content-changed");
    }
    _loadItem(events) {
      const forms = this._contents.querySelectorAll("input,select,textarea");
      for (let f = 0, fl = forms.length; f < fl; f++) {
        if (!(forms[f].id in this._current.item) && forms[f].dataset.enum !== "true")
          continue;
        if (forms[f].type === "checkbox") {
          if (forms[f].dataset.enum === "true") {
            const name = forms[f].name || forms[f].id.substring(0, forms[f].id.lastIndexOf("-"));
            const value = +forms[f].id.substring(forms[f].id.lastIndexOf("-") + 1);
            forms[f].checked = (this._current.item[name] & value) === value;
          } else
            forms[f].checked = this._current.item[forms[f].id];
          if (events)
            forms[f].addEventListener("change", (e) => {
              const target = e.currentTarget || e.target;
              if (target.style.display === "none") return;
              if (target.dataset.enum === "true") {
                const name = target.name || target.id.substring(0, target.id.lastIndexOf("-"));
                const enums = this.body.querySelectorAll(`[name=${name}]`);
                let value = 0;
                for (let e2 = 0, el = enums.length; e2 < el; e2++) {
                  if (enums[e2].checked)
                    value |= +enums[e2].value;
                }
                this._current.item[name] = value;
              } else {
                this._current.item[target.id] = target.checked || false;
                if (target.id === "enabled")
                  this._menu.querySelector(`#enabled-${this.sanitizeID(this._current.profileName)}-${this._current.collection}-${this._current.itemIdx}`).checked = this._current.item[target.id];
              }
              this.changed = true;
              this._updateItemMenu();
            });
        } else {
          forms[f].value = this._current.item[forms[f].id];
          if (events) {
            forms[f].addEventListener("change", (e) => {
              const target = e.currentTarget || e.target;
              if (target.style.display === "none") return;
              this.setValue(this._current.item, target.id, target.value);
              this.changed = true;
              this._updateItemMenu();
            });
            forms[f].addEventListener("input", (e) => {
              const target = e.currentTarget || e.target;
              if (target.style.display === "none") return;
              this.setValue(this._current.item, target.id, target.value);
              this.changed = true;
              this._updateItemMenu();
            });
          }
          let c = this.changed;
          forms[f].dispatchEvent(new Event("change"));
          this.changed = c;
        }
      }
      this.emit("item-loaded", this._current);
    }
    _updateItemMenu(currentItem, profile, collection, index) {
      profile = profile || this._current.profileName;
      collection = collection || this._current.collection;
      if (typeof index !== "number")
        index = this._current.itemIdx;
      const currentParent = this._current.parent;
      currentItem = currentItem || this._current.item;
      debounce(() => {
        let item = this.body.querySelector(`#${this.sanitizeID(profile)}-${collection}-${index}`);
        if (!item) return;
        let display;
        display = GetDisplay(currentParent || currentItem);
        item.title = display;
        item.firstChild.childNodes[2].textContent = " " + display;
        let bc = this.header.querySelector("ol").children;
        if (bc.length > 4) {
          if (bc[4].children.length)
            bc[4].children[0].textContent = display;
          else
            bc[4].textContent = display;
        }
        if (bc.length > 5) {
          bc[5].textContent = GetDisplay(currentItem);
        }
      }, 200, "updateItemMenu");
    }
    _expandPath(pages, select) {
      if (!Array.isArray(pages))
        pages = pages.split("/");
      let id;
      let el;
      let expand;
      let po = 0;
      if (pages[0] === "profiles")
        po = 1;
      let last = pages.length - 1;
      for (let p = po, pl = pages.length; p < pl; p++) {
        id = this.sanitizeID(pages.slice(po, p + 1).join("-"));
        el = document.getElementById(id);
        if (!el) continue;
        if (p === last) {
          setTimeout(() => {
            const items = this._menu.querySelectorAll(".active");
            for (let i = 0, il = items.length; i < il; i++)
              items[i].classList.remove("active");
            scrollChildIntoView(this._menu, el);
            el.classList.add("active");
            if (select)
              el.firstChild.click();
          }, 100);
        } else {
          expand = el.querySelector(".dropdown-menu");
          if (!expand || expand.classList.contains("show")) continue;
          el = el.querySelector("i");
          if (el) {
            el.closest("li").querySelector(".dropdown-menu").classList.toggle("show");
            el.classList.toggle("bi-chevron-right");
            el.classList.toggle("bi-chevron-down");
          }
        }
      }
    }
    _goBack() {
      if (this._errorField) {
        this._errorField.focus();
        return;
      }
      const pages = this._page.split("/");
      if (pages.length === 5)
        updateHash(pages.slice(0, pages.length - 2).join("/"), this._page);
      else
        updateHash(pages.slice(0, pages.length - 1).join("/"), this._page);
    }
    _createProfile(defaults) {
      let i = this.profiles.length;
      let name = "NewProfile" + i;
      while (this.profiles.contains(name)) {
        i++;
        name = "NewProfile" + i;
      }
      const profile = new Profile(name, defaults);
      name = name.toLowerCase();
      this.profiles.add(profile);
      this.profiles.SortByPriority();
      let menuItem = this._profile(name);
      i = this.profiles.keys.indexOf(name);
      const menu = document.getElementById("profile-menu");
      if (i === -1 || i >= menu.children.length)
        i = menu.children.length - 1;
      if (i < 0) i = 0;
      menu.children[i].insertAdjacentHTML("afterend", menuItem);
      this._profileEvents(menu.children[i + 1]);
      this.changed = true;
      updateHash("profiles/" + name, this._page);
    }
    _deleteProfile(profile) {
      if (!profile) return false;
      confirm_box("Remove profile?", `Delete "${profile}"?`).then((e) => {
        if (e.button === 4 /* Yes */) {
          this.profiles.remove(profile);
          this._menu.querySelector("#" + profile).remove();
          if (this._page.startsWith("profiles/" + profile))
            updateHash("profiles", this._page);
          this.changed = true;
        }
      });
    }
    _renameProfile(name, oldProfile) {
      if (!name) return "Name can not be empty!";
      oldProfile = (oldProfile || this._current.profileName).toLowerCase();
      name = name.toLowerCase();
      if (name === oldProfile) return true;
      if (this.profiles.contains(name))
        return "A profile named " + name + " already exists!";
      this.profiles.remove(oldProfile);
      this._current.profile.name = name;
      this._current.profileName = name;
      this.profiles.add(this._current.profile);
      const oldID = this.sanitizeID(oldProfile);
      const newID = this.sanitizeID(name);
      let items;
      items = this.body.querySelector(`#${oldID} a`);
      items.children[2].childNodes[1].textContent = " " + capitalize(name);
      document.querySelector(`#${oldID} a`).children[3].childNodes[1].textContent = " " + capitalize(name);
      items = this.body.querySelector(`#${oldID}`);
      items.id = newID;
      items.title = name;
      this._replaceProfileName(this._menu.firstChild, oldProfile, name);
      this._replaceProfileName(this._contents, oldProfile, name);
      this.header.querySelector("ol").children[2].textContent = capitalize(name);
      return true;
    }
    _replaceProfileName(container, oldName, newName) {
      let items;
      let i, il;
      const oldID = this.sanitizeID(oldName);
      const newID = this.sanitizeID(newName);
      items = container.querySelectorAll(`[id*="-${oldID}-"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].id = items[i].id.replace(`-${oldID}-`, `-${newID}-`);
      items = container.querySelectorAll(`[id$="-${oldID}"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].id = items[i].id.replace(`-${oldID}`, `-${newID}`);
      items = container.querySelectorAll(`[id^="${oldID}-"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].id = items[i].id.replace(`${oldID}-`, `${newID}-`);
      items = container.querySelectorAll(`[data-profile="${oldID}"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].dataset.profile = newID;
      const oldPath = encodeURIComponent(oldName);
      const newPath = encodeURIComponent(newName);
      items = container.querySelectorAll(`[href*="/${oldPath}/"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].href = items[i].getAttribute("href").replace(`/${oldPath}/`, `/${newPath}/`);
      items = container.querySelectorAll(`[href$="/${oldPath}"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].href = items[i].getAttribute("href").replace(`/${oldPath}`, `/${newPath}`);
      items = container.querySelectorAll(`[href^="${oldPath}/"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].href = items[i].getAttribute("href").replace(`${oldPath}/`, `${newPath}/`);
      items = container.querySelectorAll(`[data-path*="/${oldPath}/"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].dataset.path = items[i].dataset.path.replace(`/${oldPath}`, `/${newPath}`);
      items = container.querySelectorAll(`[data-page*="/${oldPath}/"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].dataset.page = items[i].dataset.page.replace(`/${oldPath}/`, `/${newPath}/`);
      items = container.querySelectorAll(`[data-page$="/${oldPath}"]`);
      for (i = 0, il = items.length; i < il; i++)
        items[i].dataset.page = items[i].dataset.page.replace(`/${oldPath}`, `/${newPath}`);
    }
    _sortProfiles() {
      this.profiles.SortByPriority();
      const menu = this._menu.firstChild;
      const items = Array.from(menu.children);
      items.sort((a, b) => {
        let ap = this.profiles.items[a.dataset.profile].priority;
        let bp = this.profiles.items[b.dataset.profile].priority;
        if (ap > bp)
          return -1;
        if (ap < bp)
          return 1;
        if (a.dataset.profile === "default")
          return -1;
        if (b.dataset.profile === "default")
          return 1;
        ap = a.dataset.profile;
        bp = b.dataset.profile;
        if (ap > bp)
          return 1;
        if (ap < bp)
          return -1;
        return 0;
      });
      items.forEach((item) => menu.appendChild(item));
    }
    _save() {
      if (!this.changed) return true;
      if (this._errorField) {
        this._errorField.focus();
        return false;
      }
      this.profiles.save().then(() => {
        client.loadProfiles().then(() => {
        });
      });
      this.changed = false;
      return true;
    }
    close() {
      if (!this._canClose) {
        this.confirmSave().then((r) => {
          if (r) {
            if (!this._save()) return;
          }
          this._canClose = true;
          this.close();
        }).catch(() => {
          this._canClose = false;
        });
      } else
        super.close();
    }
    reload() {
      if (!this._setCurrent(this._page.split("/")))
        return;
      this._loadItem();
      this._updateItemMenu();
    }
    confirmSave() {
      return new Promise((resolve, reject) => {
        if (this._profilesChanged) {
          confirm_box("Save changes?", `Save changes to profiles?`, null, 12 /* YesNo */ | 2 /* Cancel */).then((e) => {
            if (e.button === 4 /* Yes */)
              resolve(true);
            else if (e.button === 8 /* No */)
              resolve(false);
            else
              reject();
          }).catch((e) => {
            reject();
          });
        } else
          resolve(true);
      });
    }
    sanitizeID(name) {
      return name.toLowerCase().replace(/[^a-z0-9:.-]+/gi, "_");
    }
    _getItemType(collection) {
      collection = collection || this._current.collection;
      if (!collection) return;
      if (collection === "aliases") return "alias";
      return collection.substring(0, collection.length - 1);
    }
    _addItem(collection, item) {
      if (!collection) collection = this._current.collection;
      if (!collection) return;
      var index = this._current.profile[collection].length;
      let menuItem;
      if (!item) {
        if (collection === "aliases")
          item = new Alias();
        else if (collection === "triggers")
          item = new Trigger();
        else if (collection === "buttons")
          item = new Button();
        else if (collection === "macros")
          item = new Macro();
        else if (collection === "context")
          item = new Context();
      }
      this._current.profile[collection].push(item);
      let m = this._menu.querySelector(`#${this.sanitizeID(this._current.profileName)}-${collection}`);
      if (index === 0) {
        menuItem = this._getItem([{
          name: capitalize(collection),
          items: this._current.profile[collection],
          useName: true,
          enabled: this._current.profile[collection]
        }], 0, this.sanitizeID(this._current.profileName), "profiles/" + encodeURIComponent(this._current.profileName), 1);
        var newNode = document.createElement("div");
        newNode.innerHTML = menuItem;
        if (m.replaceWith)
          m.replaceWith(newNode.firstChild);
        else if (m.replaceChild)
          m.parentNode.replaceChild(newNode.firstChild, m);
        else
          m.outerHTML = menuItem;
        m = this._menu.querySelector(`#${this.sanitizeID(this._current.profileName)}-${collection}`);
        this._profileEvents(m);
      } else {
        menuItem = this._getItem(this._current.profile[collection], index, `${this.sanitizeID(this._current.profileName)}-${collection}`, `profiles/${encodeURIComponent(this._current.profileName)}/${collection}`, 2);
        m = m.querySelector("ul");
        m.insertAdjacentHTML("beforeend", menuItem);
        m = this._menu.querySelector(`#${this.sanitizeID(this._current.profileName)}-${collection}`);
        this._profileEvents(m.lastChild);
      }
      updateHash(`profiles/${encodeURIComponent(this._current.profileName)}/${collection}/${index}`, this._page);
      this.changed = true;
    }
    _removeItem(index, collection, back) {
      if (!collection) collection = this._current.collection;
      if (!collection) return;
      confirm_box("Remove profile?", `Delete ${this._getItemType()}?`).then((e) => {
        if (e.button === 4 /* Yes */) {
          const id = `${this.sanitizeID(this._current.profileName)}-${collection}`;
          const items = this._current.profile[collection];
          items.splice(index, 1);
          this._menu.querySelector(`#${id}-${index}`).remove();
          if (this._current.itemIdx === -1)
            this.setBody(this._page);
          if (items.length === 0) {
            this._menu.querySelector(`#${id} i`).remove();
            this._menu.querySelector(`#${id} a`).insertAdjacentHTML("afterbegin", '<i class="align-middle float-start no-icon"></i>');
          } else {
            const menuItems = this._menu.querySelector(`#${id} ul`);
            let i = menuItems.children.length;
            const href = `#profiles/${encodeURIComponent(this._current.profileName)}/${collection}/`;
            for (; index < i; index++) {
              const item = menuItems.children[index];
              item.id = `${id}-${index}`;
              item.firstChild.href = `${href}${index}`;
              item.firstChild.children[1].id = `enabled-${id}-${index}`;
            }
          }
          this.changed = true;
          if (back)
            this._goBack();
        }
      });
    }
    setValue(obj, prop, value) {
      if (value == "false") value = false;
      if (value == "true") value = true;
      if (value == "null") value = null;
      if (value == "undefined") value = void 0;
      if (typeof value == "string" && parseFloat(value).toString() == value)
        value = parseFloat(value);
      obj[prop] = this.convertType(value, typeof obj[prop]);
    }
    convertType(value, type) {
      if (typeof value === type)
        return value;
      switch (type) {
        case "number":
          if (typeof value == "string" && parseFloat(value).toString() == value)
            return parseFloat(value);
          return Number(value);
        case "boolean":
          return Boolean(value);
        case "string":
          return "" + value;
      }
      return value;
    }
  };
  function GetDisplay(arr) {
    if (arr.displaytype === 1) {
      const f = new Function("item", "keyCodeToChar", "MacroDisplay", arr.display);
      return f(arr, keyCodeToChar, MacroDisplay);
    }
    if ($.isFunction(arr.display))
      return arr.display(arr);
    if ($.isFunction(arr[arr.display]))
      return arr[arr.display](arr);
    if (!arr[arr.display])
      return arr["name"];
    return arr[arr.display];
  }

  // src/interface/contextmenu.ts
  var Contextmenu = class _Contextmenu extends EventEmitter {
    constructor(items, id) {
      super();
      this._cleanUp = () => {
        window.removeEventListener("click", this._cleanUp);
        window.removeEventListener("mousedown", this._mouseup);
        window.removeEventListener("keydown", this._cleanUp);
        if (this._menu)
          this._menu.remove();
      };
      this._mouseup = (e) => {
        if (this._menu.contains(e.srcElement)) return;
        this._cleanUp();
      };
      this._items = items || [];
      this._id = id || (/* @__PURE__ */ new Date()).getTime();
      this._createMenu();
    }
    _createMenu() {
      if (!this._menu) {
        let menu = `<ul id="${this._id}" class="dropdown-menu show">`;
        for (var i = 0, il = this._items.length; i < il; i++) {
          menu += `<li><a class="dropdown-item" data-index="${i}" href="#">${this._items[i].name}</a></li>`;
        }
        menu += "</ul>";
        document.body.insertAdjacentHTML("afterend", menu);
        this._menu = document.getElementById(this._id);
      }
      let items = this._menu.querySelectorAll("li a");
      for (let i2 = 0, il2 = items.length; i2 < il2; i2++) {
        items[i2].addEventListener("click", (e) => {
          let index = +e.currentTarget.dataset.index;
          if (typeof this._items[index].action === "function")
            this._items[index].action(this._items[i2], e);
          this._cleanUp();
        });
      }
    }
    close() {
      this._cleanUp();
    }
    show(x, y) {
      this._menu.style.left = x + "px";
      this._menu.style.top = y + "px";
      this._menu.style.display = "block";
      this._menu.style.position = "absolute";
      setTimeout(() => {
        window.addEventListener("click", this._cleanUp);
        window.addEventListener("mousedown", this._mouseup);
        window.addEventListener("keydown", this._cleanUp);
      }, 100);
    }
    static popup(items, x, y) {
      new _Contextmenu(items).show(x, y);
    }
  };

  // src/interface/interface.ts
  var editor;
  var editorDialog;
  var _currentIcon = -1;
  var _selword = "";
  var _selurl = "";
  var _selline = "";
  var lastMouse;
  function doLink(url) {
    confirm_box("Open?", `Open '${url}'?`).then((e) => {
      if (e.button === 4 /* Yes */) {
        window.open(url);
        if (client.getOption("CommandonClick"))
          client.commandInput.focus();
      }
    });
  }
  function doMXPLink(el, url) {
    if (url.startsWith("OoMUD://") || url.startsWith("jiMUD://") || url.startsWith("client://"))
      doMXPSend(0, el, url.substring(8));
    else {
      confirm_box("Open?", `Open '${url}'?`).then((e) => {
        if (e.button === 4 /* Yes */) {
          window.open(url);
          if (client.getOption("CommandonClick"))
            client.commandInput.focus();
        }
      });
    }
  }
  function doMXPSend(e, el, url, pmt, tt) {
    var im = el.querySelector("img[ismap]");
    var extra = "";
    if (im) {
      var os = offset(im);
      var x = Math.floor(e.clientX - os.left);
      var y = Math.floor(e.clientY - os.top);
      extra = "?" + x + "," + y;
    }
    if (url.constructor === Array || url.__proto__.constructor === Array || Object.prototype.toString.call(url) === "[object Array]") {
      let items = [];
      for (var i = 0, il = url.length; i < il; i++) {
        url[i] = url[i].replace("&text;", el.textContent);
        if (i < tt.length)
          items.push({
            name: tt[i],
            action: (item) => MXPMenuHandler(item.cmd, item.pmt),
            pmt,
            cmd: url[i] + extra
          });
        else
          items.push({
            name: url[i],
            action: (item) => MXPMenuHandler(item.cmd, item.pmt),
            pmt,
            cmd: url[i] + extra
          });
      }
      Contextmenu.popup(items, e.clientX, e.clientY);
    } else if (pmt) {
      url = url.replace("&text;", el.textContent) + extra;
      client.commandInput.value = url;
      setSelectionRange(client.commandInput, url.length, url.length);
    } else
      client.send(url.replace("&text;", el.textContent) + extra + "\n", true);
    setTimeout(() => {
      if (client.getOption("CommandonClick"))
        client.commandInput.focus();
    }, 0);
  }
  function MXPMenuHandler(cmd, pmt) {
    if (pmt) {
      client.commandInput.value = cmd;
      setSelectionRange(client.commandInput, cmd.length, cmd.length);
    } else
      client.send(cmd, true);
    setTimeout(() => {
      if (client.getOption("CommandonClick"))
        client.commandInput.focus();
    }, 0);
  }
  function doMXPTooltip(el) {
    el.title = el.title.replace("&text;", el.textContent);
  }
  window.doLink = doLink;
  window.doMXPLink = doMXPLink;
  window.doMXPSend = doMXPSend;
  window.MXPMenuHandler = MXPMenuHandler;
  window.doMXPTooltip = doMXPTooltip;
  function initializeInterface() {
    let options;
    _setIcon(0);
    initMenu();
    window.readClipboard = () => pasteText();
    window.readClipboardHTML = () => pasteText();
    client.readClipboard = window.readClipboard;
    client.readClipboardHTML = window.readClipboardHTML;
    window.writeClipboard = (txt, html) => copyText(txt);
    client.writeClipboard = window.writeClipboard;
    client.closeWindow = (window2) => {
      switch (window2) {
        case "editor":
        case "help":
        case "about":
          closeDialog(window2);
          break;
        case "profiles":
        case "profiles-manager":
        case "profile-manager":
        case "manager":
          closeDialog("profiles");
          break;
        case "prefs":
        case "options":
        case "preferences":
          closeDialog("settings");
          break;
        case "history":
        case "command-history":
          closeDialog("history");
          break;
        default:
          client.emit("close-window", window2);
          break;
      }
    };
    ["repeatnum", "i"].forEach((a) => {
      Object.defineProperty(window, a, {
        get: function() {
          if (!client) return void 0;
          return client.repeatnum;
        },
        configurable: true
      });
    });
    Object.defineProperty(window, "$selected", {
      get: function() {
        if (!client) return "";
        return client.display.selection;
      },
      configurable: true
    });
    Object.defineProperty(window, "$copied", {
      get: function() {
        return "";
      },
      configurable: true
    });
    Object.defineProperty(window, "$selword", {
      get: function() {
        if (!client) return "";
        return client.input.vStack["$selword"] || _selword || (lastMouse ? client.display.getWordFromPosition(lastMouse.pageX, lastMouse.pageY) : "");
      },
      configurable: true
    });
    Object.defineProperty(window, "$selurl", {
      get: function() {
        if (!client) return "";
        let value = client.input.vStack["$selurl"] || _selurl || "";
        if (value) return value;
        if (!lastMouse) return "";
        var parent = lastMouse.srcElement.parentNode;
        if (parent && parent.classList && parent.classList.contains("URLLink"))
          return parent.title;
        else if (parent && parent.classList && parent.classList.contains("MXPLink") && parent.dataset && parent.dataset.href && parent.dataset.href.length > 0)
          return parent.dataset.href;
        return "";
      },
      configurable: true
    });
    Object.defineProperty(window, "$selline", {
      get: function() {
        if (!client) return "";
        let value = client.input.vStack["$selline"] || _selline || "";
        if (value) return value;
        if (!lastMouse) return "";
        var pos = client.display.getLineOffset(lastMouse.pageX, lastMouse.pageY);
        if (pos.y < 0 || pos.y >= client.display.lines.length)
          return "";
        return client.display.getLineText(pos.y, true);
      },
      configurable: true
    });
    Object.defineProperty(window, "$selectedword", {
      get: function() {
        if (!client) return "";
        return client.input.vStack["$selectedword"] || _selword || (lastMouse ? client.display.getWordFromPosition(lastMouse.pageX, lastMouse.pageY) : "");
      },
      configurable: true
    });
    Object.defineProperty(window, "$selectedurl", {
      get: function() {
        if (!client) return "";
        let value = client.input.vStack["$selectedurl"] || _selurl || "";
        if (value) return value;
        if (!lastMouse) return "";
        var parent = lastMouse.srcElement.parentNode;
        if (parent && parent.classList && parent.classList.contains("URLLink"))
          return parent.title;
        else if (parent && parent.classList && parent.classList.contains("MXPLink") && parent.dataset && parent.dataset.href && parent.dataset.href.length > 0)
          return parent.dataset.href;
        return "";
      },
      configurable: true
    });
    Object.defineProperty(window, "$selectedline", {
      get: function() {
        if (!client) return "";
        let value = client.input.vStack["$selectedline"] || _selline || "";
        if (value) return value;
        if (!lastMouse) return "";
        var pos = client.display.getLineOffset(lastMouse.pageX, lastMouse.pageY);
        if (pos.y < 0 || pos.y >= client.display.lines.length)
          return "";
        return client.display.getLineText(pos.y, true);
      },
      configurable: true
    });
    Object.defineProperty(window, "$action", {
      get: function() {
        if (!client) return "";
        return client.input.vStack["$action"] || (client.input.lastTriggerExecuted ? client.input.lastTriggerExecuted.value : "") || "";
      },
      configurable: true
    });
    Object.defineProperty(window, "$trigger", {
      get: function() {
        if (!client) return "";
        return client.input.vStack["$trigger"] || client.input.lastTriggered || "";
      },
      configurable: true
    });
    Object.defineProperty(window, "$caption", {
      get: function() {
        if (!client) return "";
        return client.input.vStack["$caption"] || "";
      },
      configurable: true
    });
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
      if (editorDialog) {
        editorDialog.resetState(client.getOption("windows.editor") || { center: true });
        if (editor.simple != client.getOption("simpleEditor")) {
          let value = "";
          if (!editor.isSimple)
            value = editor.getFormattedText().replace(/(?:\r)/g, "");
          editor.simple = client.getOption("simpleEditor");
          if (!editor.isSimple) {
            editorDialog.hideFooter();
            editorDialog.header.querySelector("#adv-editor-switch").title = "Switch to simple";
          } else {
            editor.value = value;
            editorDialog.showFooter();
            editorDialog.header.querySelector("#adv-editor-switch").title = "Switch to advanced";
            setTimeout(() => editor.focus(), 100);
          }
        }
      }
      if (_dialogs.history) _dialogs.history.resetState(client.getOption("windows.history") || { center: true, width: 400, height: 275 });
      if (_dialogs.profiles) _dialogs.profiles.resetState(client.getOption("windows.profiles") || { center: true, width: 400, height: 275 });
    });
    client.on("set-title", (title) => {
      if (!title || !title.length)
        title = client.defaultTitle;
      else if (title.indexOf(client.defaultTitle) === -1)
        title += " - " + client.defaultTitle;
      if (client.connecting)
        title = "Connecting - " + title;
      else if (client.connected)
        title = "Connected - " + title;
      else
        title = "Disconnected - " + title;
      window.document.title = title;
    });
    client.on("connected", () => _setIcon(1));
    client.on("closed", () => _setIcon(0));
    client.on("received-data", () => {
      if (!client.active && client.connected)
        _setIcon(2);
    });
    client.on("focus", () => {
      if (client.connected)
        _setIcon(1);
      else
        _setIcon(0);
    });
    client.on("print", () => {
      if (!client.active && client.connected)
        _setIcon(2);
    });
    client.display.on("selection-done", (e) => {
      if (client.getOption("AutoCopySelectedToClipboard") && client.display.hasSelection) {
        copyText(client.display.selection);
        client.display.clearSelection();
      }
    });
    client.on("profiles-loaded", () => {
      buildButtons();
    });
    client.on("notify", (title, message, options2) => {
      if (!client.getOption("enableNotifications") || !("Notification" in window)) return;
      options2 = options2 || { silent: true };
      if (!Object.prototype.hasOwnProperty.call(options2, "silent"))
        options2.silent = true;
      switch (_currentIcon) {
        case 1:
          options2.icon = options2.icon || "images/connected.png";
          break;
        case 2:
          options2.icon = options2.icon || "images/active.png";
          break;
        default:
          options2.icon = options2.icon || "images/disconnected.png";
          break;
      }
      if (message) {
        options2.body = message;
        if (options2.body.length > 127)
          options2.body = options2.body.substr(0, 127) + "...";
      }
      if (Notification.permission === "granted") {
        var notify = new window.Notification(title, options2);
        notify.onclick = () => {
          client.emit("notify-clicked", title, message);
          client.raise("notify-clicked", [title, message]);
        };
        notify.onclose = () => {
          client.emit("notify-closed", title, message);
          client.raise("notify-closed", [title, message]);
        };
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            var notify2 = new window.Notification(title, options2);
            notify2.onclick = () => {
              client.emit("notify-clicked", title, message);
              client.raise("notify-clicked", [title, message]);
            };
            notify2.onclose = () => {
              client.emit("notify-closed", title, message);
              client.raise("notify-closed", [title, message]);
            };
          } else
            client.echo("Notification permission denied.", -7, -8, true, true);
        });
      } else
        client.echo("Notification permission denied.", -7, -8, true, true);
    });
    client.on("window", (window2, args, name) => {
      switch (window2) {
        case "editor":
        case "help":
        case "about":
          if (args === "close")
            closeDialog(window2);
          else
            showDialog(window2);
          break;
        case "profiles":
        case "profiles-manager":
        case "profile-manager":
        case "manager":
          if (args === "close")
            closeDialog("profiles");
          else
            showDialog("profiles");
          break;
        case "prefs":
        case "options":
        case "preferences":
          if (args === "close")
            closeDialog("settings");
          else
            showDialog("settings");
          break;
        case "history":
        case "command-history":
          if (args === "close")
            closeDialog("history");
          else
            showDialog("history");
          break;
      }
    });
    document.getElementById("btn-adv-editor").addEventListener("click", (e) => {
      showDialog("editor");
    });
    options = client.getOption("windows.editor");
    if (options && options.show)
      document.getElementById("btn-adv-editor").click();
    options = client.getOption("windows.history");
    if (options && options.show)
      showDialog("history");
    options = client.getOption("windows.profiles");
    if (options && options.show)
      showDialog("profiles");
    document.getElementById("btn-command-history").addEventListener("show.bs.dropdown", function() {
      document.body.appendChild(document.getElementById("command-history-menu"));
      let h = "";
      const menu = document.getElementById("command-history-menu");
      let history2 = client.commandHistory;
      for (let i = 0, il = history2.length; i < il; i++)
        h += `<li id="command-history-item-${i}"><a data-index="${i}" class="dropdown-item" href="javascript:void(0)">${history2[i]}</a></li>`;
      if (history2.length) {
        h += '<li><hr class="dropdown-divider"></li>';
        h += `<li><a id="history-clear" class="dropdown-item" href="javascript:void(0)">Clear history</a></li>`;
      }
      h += `<li><a id="history-show" class="dropdown-item" href="javascript:void(0)">Show history window...</a></li>`;
      menu.innerHTML = h;
      if (history2.length)
        menu.querySelector("#history-clear").addEventListener("click", () => {
          confirm_box("Clear history?", `Clear all history`).then((e) => {
            if (e.button === 4 /* Yes */) {
              client.clearCommandHistory();
            }
          });
        });
      menu.querySelector("#history-show").addEventListener("click", () => showDialog("history"));
      const items = document.querySelectorAll('[id^="command-history-item"] a');
      for (let i = 0, il = items.length; i < il; i++) {
        items[i].addEventListener("click", (e) => {
          var cmd = client.commandHistory[parseInt(e.currentTarget.dataset.index, 10)];
          client.AddCommandToHistory(cmd);
          client.sendCommand(cmd, null, client.getOption("allowCommentsFromCommand"));
        });
      }
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
    window.addEventListener("keydown", (event) => {
      if (event.which === 33)
        client.display.pageUp();
      else if (event.which === 34)
        client.display.pageDown();
    });
    window.addEventListener("error", (e) => {
      const { message, filename, lineno, colno, error } = e;
      if (message.includes("ResizeObserver loop completed with undelivered notifications"))
        return;
      if (client) {
        if (error)
          client.error(error);
        else if (message.startsWith("Uncaught Error: "))
          client.error(`${message.substr(16)}`);
        else
          client.error(`${message}`);
        if (client.getOption("enableDebug")) {
          client.error("Url: " + filename);
          client.error("Line: " + lineno);
          client.error("Column: " + colno);
          client.error(error);
        }
      } else {
        console.error("Message: " + message);
        console.error("Url: " + filename);
        console.error("Line: " + lineno);
        console.error("Column: " + colno);
        console.error(error);
      }
      return true;
    });
    window.addEventListener("mousemove", (event) => {
      lastMouse = event;
    });
    window.addEventListener("hashchange", hashChange, false);
    window.addEventListener("load", hashChange);
    client.on("command-history-changed", (history2) => {
      _loadHistory();
    });
    showButtons();
  }
  function removeHash(string) {
    if (!string || string.length === 0) return;
    string = string.trim();
    if (string.startsWith("#"))
      string = string.substring(1);
    var hashes = decodeURI(window.location.hash.substring(1)).split(",").filter((s) => s.trim() !== string);
    window.location.hash = hashes.join(",");
  }
  function addHash(string) {
    if (!string || string.length === 0) return;
    string = string.trim();
    if (string.startsWith("#"))
      string = string.substring(1);
    var hashes = decodeURI(window.location.hash.substring(1)).split(",").filter((s) => s.trim() !== string);
    hashes.push(string);
    window.location.hash = hashes.join(",");
  }
  function updateHash(add, remove) {
    if (!Array.isArray(add))
      add = [add];
    remove = remove || [];
    if (!Array.isArray(remove))
      remove = [remove];
    remove = remove.concat(...add);
    var hashes = decodeURI(window.location.hash.substring(1)).split(",").filter((s) => !remove.includes(s.trim()));
    hashes = hashes.concat(...add);
    window.location.hash = hashes.join(",");
  }
  function hashChange() {
    if (!window.location.hash || window.location.hash.length < 2) return;
    var dialogs = decodeURI(window.location.hash.substring(1)).split(",").map((s) => s.trim());
    for (let d = dialogs.length - 1; d >= 0; d--)
      switch (dialogs[d]) {
        case "about":
          showDialog("about");
          break;
        case "editor":
          document.getElementById("btn-adv-editor").click();
          break;
        default:
          if (dialogs[d] === "history" || dialogs[d].startsWith("settings") || dialogs[d].startsWith("profiles"))
            showDialog(dialogs[d]);
          else
            client.emit("window", dialogs[d]);
          break;
      }
  }
  var _dialogs = {};
  function showDialog(name) {
    switch (name) {
      case "about":
        if (!_dialogs.about) {
          _dialogs.about = new Dialog({ title: '<i class="bi-info-circle"></i> About', noFooter: true, resizable: false, center: true, maximizable: false });
          _dialogs.about.on("closed", () => {
            delete _dialogs.about;
            removeHash(name);
          });
          _dialogs.about.on("canceled", () => {
            delete _dialogs.about;
            removeHash(name);
          });
        }
        loadDialog(_dialogs.about, name, 1, true).catch((e) => {
          client.error(e);
        });
        return _dialogs.about;
      case "history":
        if (!_dialogs.history) {
          _dialogs.history = new Dialog(Object.assign({}, client.getOption("windows.history") || { center: true, width: 400, height: 275 }, { title: '<i class="bi bi-clock-history"></i> Command history', id: "command-history" }));
          _dialogs.history.on("closed", () => {
            client.setOption("windows.history", _dialogs.history.windowState);
            delete _dialogs.history;
            removeHash(name);
          });
          _dialogs.history.on("canceled", () => {
            client.setOption("windows.history", _dialogs.history.windowState);
            removeHash("history");
            delete _dialogs.history;
            removeHash(name);
          });
          _dialogs.history.on("resized", (e) => {
            client.setOption("windows.history", e);
          });
          _dialogs.history.on("moved", (e) => {
            client.setOption("windows.history", e);
          });
          _dialogs.history.on("maximized", () => {
            client.setOption("windows.history", _dialogs.history.windowState);
          });
          _dialogs.history.on("restored", () => {
            client.setOption("windows.history", _dialogs.history.windowState);
          });
          _dialogs.history.on("shown", () => {
            client.setOption("windows.history", _dialogs.history.windowState);
          });
          let footer = "";
          footer += `<button id="${_dialogs.history.id}-clear" type="button" class="btn-sm float-end btn btn-danger" title="Clear history"><i class="bi bi-trash"></i><span class="icon-only"> Clear</span></button>`;
          footer += `<button id="${_dialogs.history.id}-send" type="button" class="btn-sm float-end btn btn-primary" title="Send"><i class="bi bi-send-fill"></i><span class="icon-only"> Send</span></button>`;
          footer += `<button id="${_dialogs.history.id}-refresh" type="button" class="btn-sm float-start btn btn-light" title="Refresh"><i class="bi bi-arrow-repeat"></i><span class="icon-only"> Refresh</span></button>`;
          _dialogs.history.footer.innerHTML = footer;
          _dialogs.history.body.innerHTML = `<select id="history-list" multiple="multiple" class="form-select"></select>`;
          _dialogs.history.body.querySelector("#history-list").addEventListener("dblclick", (e) => {
            const cmd = e.currentTarget.value;
            client.AddCommandToHistory(cmd);
            client.sendCommand(cmd, false, client.getOption("allowCommentsFromCommand"));
            _dialogs.history.close();
          });
          _dialogs.history.body.querySelector("#history-list").addEventListener("change", (e) => {
            client.setHistoryIndex(e.currentTarget.selectedIndex);
            _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-send`).style.display = history.length && _dialogs.history.body.querySelector("#history-list").selectedIndex !== -1 ? "" : "none";
          });
          _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-refresh`).addEventListener("click", () => _loadHistory());
          _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-send`).addEventListener("click", () => {
            const list = _dialogs.history.body.querySelector("#history-list");
            let cmds = [];
            for (let l = 0, ll = list.options.length; l < ll; l++) {
              if (list.options[l].selected) {
                cmds.push(list.options[l].value);
              }
            }
            for (let c = 0, cl = cmds.length; c < cl; c++) {
              client.AddCommandToHistory(cmds[c]);
              client.sendCommand(cmds[c], false, client.getOption("allowCommentsFromCommand"));
            }
          });
          _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-clear`).addEventListener("click", () => {
            confirm_box("Clear history?", `Clear all history`).then((e) => {
              if (e.button === 4 /* Yes */) {
                client.clearCommandHistory();
              }
            });
          });
        }
        _loadHistory();
        _dialogs.history.show();
        return _dialogs.history;
      case "editor":
        if (!editorDialog) {
          editorDialog = new Dialog(Object.assign({}, client.getOption("windows.editor") || { center: true }, { title: '<i class="fas fa-edit"></i> Advanced editor', id: "adv-editor" }));
          editorDialog.on("resized", (e) => {
            client.setOption("windows.editor", e);
          });
          editorDialog.on("moved", (e) => {
            client.setOption("windows.editor", e);
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
            removeHash("editor");
          });
          editorDialog.on("canceling", () => {
            editor.remove();
          });
          editorDialog.on("canceled", () => {
            client.setOption("windows.editor", editorDialog.windowState);
            removeHash("editor");
          });
          editorDialog.on("focus", () => editor.focus());
          const textarea = document.createElement("textarea");
          textarea.classList.add("form-control", "form-control-sm");
          textarea.id = "adv-editor-txt";
          editorDialog.body.appendChild(textarea);
          editorDialog.body.style.overflow = "hidden";
          if (!editor) editor = new AdvEditor(textarea, !client.getOption("simpleEditor"));
          editor.on("close", () => {
            editorDialog.close();
          });
          editor.on("editor-init", () => editor.focus());
          editor.on("click", () => editorDialog.focus());
          editorDialog.dialog.editor = editor;
          if (tinymce)
            editorDialog.header.querySelector("#adv-editor-max").insertAdjacentHTML("afterend", '<button type="button" class="btn btn-light float-end" id="adv-editor-switch" title="Switch to advanced" style="padding: 0 4px;margin-top: -1px;"><i class="bi-shuffle"></i></button>');
          editorDialog.footer.innerHTML = `<button id="btn-adv-editor-clear" type="button" class="btn-sm float-start btn btn-light" title="Clear editor"><i class="bi bi-journal-x"></i><span class="icon-only"> Clear</span></button>
                    <button id="btn-adv-editor-append" type="button" class="btn-sm float-start btn btn-light" title="Append file..."><i class="bi bi-box-arrow-in-down"></i><span class="icon-only"> Append file...</span></button>
                    <button id="btn-adv-editor-send" type="button" class="btn-sm float-end btn btn-primary" title="Send"><i class="bi bi-send-fill"></i><span class="icon-only"> Send</span></button>`;
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
          document.getElementById("btn-adv-editor-append").addEventListener("click", () => {
            openFileDialog("Append file", false).then((files) => {
              readFile(files[0]).then((contents) => {
                editor.insert(contents);
              }).catch(client.error);
            }).catch(() => {
            });
          });
          document.getElementById("btn-adv-editor-send").addEventListener("click", () => {
            client.sendCommand(editor.value());
            if (client.getOption("editorClearOnSend"))
              editor.clear();
            if (client.getOption("editorCloseOnSend"))
              editorDialog.close();
          });
          document.getElementById("btn-adv-editor-clear").addEventListener("click", () => {
            editor.clear();
            editor.focus();
          });
          if (!editor.isSimple)
            editorDialog.hideFooter();
        }
        editorDialog.show();
        if (editor.isSimple)
          editor.focus();
        return editorDialog;
    }
    if (name.startsWith("settings")) {
      if (!_dialogs.settings) {
        _dialogs.settings = new SettingsDialog();
        _dialogs.settings.on("closed", () => {
          delete _dialogs.settings;
        });
        _dialogs.settings.on("canceled", () => {
          delete _dialogs.settings;
        });
      }
      if (name === "settings") {
        _dialogs.settings.dialog.dataset.path = name;
        _dialogs.settings.dialog.dataset.fullPath = name;
        _dialogs.settings.dialog.dataset.hash = window.location.hash;
        _dialogs.settings.setBody("", { client });
        _dialogs.settings.showModal();
      } else
        loadDialog(_dialogs.settings, name, 2, false).catch((e) => {
          client.error(e);
        });
      return _dialogs.settings;
    }
    if (name.startsWith("profiles")) {
      if (!_dialogs.profiles) {
        _dialogs.profiles = new ProfilesDialog();
        _dialogs.profiles.on("closed", () => {
          delete _dialogs.profiles;
        });
        _dialogs.profiles.on("canceled", () => {
          delete _dialogs.profiles;
        });
      }
      _dialogs.profiles.dialog.dataset.path = name;
      _dialogs.profiles.dialog.dataset.fullPath = name;
      _dialogs.profiles.dialog.dataset.hash = window.location.hash;
      _dialogs.profiles.setBody("", { client });
      _dialogs.profiles.show();
      return _dialogs.profiles;
    }
  }
  function loadDialog(dialog, path, show, showError) {
    return new Promise((resolve, reject) => {
      var subpath = path.split("/");
      $.ajax({
        url: "dialogs/" + subpath[0] + ".htm",
        cache: false,
        type: "GET"
      }).done(function(data) {
        dialog.dialog.dataset.path = subpath[0];
        dialog.dialog.dataset.fullPath = path;
        dialog.dialog.dataset.hash = window.location.hash;
        dialog.setBody(data, { client });
        if (show == 1)
          dialog.show();
        else if (show === 2)
          dialog.showModal();
        resolve(data);
      }).fail(function(err) {
        if (showError && client.enableDebug)
          dialog.setBody(`<h1 style="width: 100%;text-align:center">Error loading ${path}</h1> ${err.statusText}`);
        else if (showError)
          dialog.setBody(`<h1 style="width: 100%;text-align:center">Error loading ${path}</h1>`);
        else
          dialog.setBody("");
        reject(path + ": " + subpath.statusText);
      });
    });
  }
  function closeDialog(dialog) {
    if (_dialogs[dialog])
      _dialogs[dialog].close();
    else if (dialog === "editor") {
      if (editorDialog)
        editorDialog.close();
    }
  }
  function _loadHistory() {
    if (!_dialogs.history) return;
    const list = document.getElementById("history-list");
    list.innerHTML = "";
    let history2 = client.commandHistory;
    var fragment = document.createDocumentFragment();
    for (var i = 0, l = history2.length; i < l; i++) {
      var opt = document.createElement("option");
      opt.appendChild(document.createTextNode(history2[i]));
      opt.value = history2[i];
      fragment.append(opt);
    }
    list.appendChild(fragment);
    _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-clear`).style.display = history2.length ? "" : "none";
    _dialogs.history.footer.querySelector(`#${_dialogs.history.id}-send`).style.display = history2.length && list.selectedIndex !== -1 ? "" : "none";
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
    client.commandInput.closest("nav").style.height = height + "px";
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
    client.commandInput.closest("nav").style.height = height + "px";
    client.display.container.style.bottom = height + padding + "px";
  }
  function _setIcon(ico) {
    if (_currentIcon === ico)
      return;
    _currentIcon = ico;
    let icon = "disconnected";
    switch (ico) {
      case 1:
        icon = "connected";
        break;
      case 2:
        icon = "active";
        break;
    }
    document.getElementById("icon1").remove();
    document.getElementById("icon2").remove();
    document.getElementById("icon3").remove();
    document.querySelector("head").insertAdjacentHTML("afterbegin", `<link id="icon1" rel="shortcut icon" href="images/${icon}.ico" />
        <link id="icon2" rel="icon" href="images/${icon}.ico" />
        <link id="icon3" rel="icon" type="image/x-icon" href="images/${icon}.png" />`);
  }
  function toggleButtons() {
    client.setOption("showButtons", !client.getOption("showButtons"));
    showButtons();
  }
  function createButton(button, index) {
    var c = "";
    var tt = "";
    var caption = button.caption;
    var bh = 0;
    if (caption.substring(0, 3) === "fa-") {
      caption = caption.split(",");
      if (caption.length > 1)
        caption = '<i class="fas ' + caption[0] + ' fa-fw" data-fa-transform="' + caption[1] + '"></i>';
      else
        caption = '<i class="fas ' + caption[0] + ' fa-fw"></i>';
      bh = 26;
    } else if (caption.substring(0, 4) === "fas-") {
      caption = caption.split(",");
      if (caption.length > 1)
        caption = '<i class="fas fa-' + caption[0].substring(4) + ' fa-fw" data-fa-transform="' + caption[1] + '"></i>';
      else
        caption = '<i class="fas fa-' + caption[0].substring(4) + ' fa-fw"></i>';
      bh = 26;
    } else if (caption.substring(0, 4) === "far-") {
      caption = caption.split(",");
      if (caption.length > 1)
        caption = '<i class="far fa-' + caption[0].substring(4) + ' fa-fw" data-fa-transform="' + caption[1] + '"></i>';
      else
        caption = '<i class="far fa-' + caption[0].substring(4) + ' fa-fw"></i>';
      bh = 26;
    } else if (caption.substring(0, 4) === "fab-") {
      caption = caption.split(",");
      if (caption.length > 1)
        caption = '<i class="fab fa-' + caption[0].substring(4) + ' fa-fw" data-fa-transform="' + caption[1] + '"></i>';
      else
        caption = '<i class="fab fa-' + caption[0].substring(4) + ' fa-fw"></i>';
      bh = 26;
    } else if (caption.substring(0, 7) === "http://" || caption.substring(0, 7) === "https://")
      caption = '<img src="' + caption + '" style="max-width: ' + button.width + "px;max-height:" + button.height + 'px"/>';
    else {
      if (!button.iconOnly)
        caption = button.caption;
      tt = button.caption;
    }
    if (button.icon && button.icon.length) {
      var icon = button.icon;
      if (icon.substring(0, 3) === "fa-") {
        icon = icon.split(",");
        if (icon.length > 1)
          icon = '<i class="fas ' + icon[0] + ' fa-fw" data-fa-transform="' + icon[1] + '"></i>';
        else
          icon = '<i class="fas ' + icon[0] + ' fa-fw"></i>';
        bh = 26;
      } else if (icon.substring(0, 4) === "fas-") {
        icon = icon.split(",");
        if (icon.length > 1)
          icon = '<i class="fas fa-' + icon[0].substring(4) + ' fa-fw" data-fa-transform="' + icon[1] + '"></i>';
        else
          icon = '<i class="fas fa-' + icon[0].substring(4) + ' fa-fw"></i>';
        bh = 26;
      } else if (icon.substring(0, 4) === "far-") {
        icon = icon.split(",");
        if (icon.length > 1)
          icon = '<i class="far fa-' + icon[0].substring(4) + ' fa-fw" data-fa-transform="' + icon[1] + '"></i>';
        else
          icon = '<i class="far fa-' + icon[0].substring(4) + ' fa-fw"></i>';
        bh = 26;
      } else if (icon.substring(0, 4) === "fab-") {
        icon = icon.split(",");
        if (icon.length > 1)
          icon = '<i class="fab fa-' + icon[0].substring(4) + ' fa-fw" data-fa-transform="' + icon[1] + '"></i>';
        else
          icon = '<i class="fab fa-' + icon[0].substring(4) + ' fa-fw"></i>';
        bh = 26;
      } else if (button.icon.length) {
        icon = '<img src="' + icon + '" style="max-width: ' + button.width + "px;max-height:" + button.height + 'px"/>';
      }
      if (button.iconOnly)
        caption = icon;
      else
        caption = icon + caption;
    }
    c += "<button";
    c += ' data-index="' + index + '"';
    if (button.name && button.name.length !== 0)
      c += ' id="button-' + button.name + '"';
    c += ' class="user-button" style="';
    if (button.left === -1 && button.right === -1 && button.top === -1 && button.bottom === -1) {
      c += "position: static;margin-right:2px;margin-top:2px;";
    } else {
      if (button.left >= 0)
        c += "left:" + (button.left || 0) + "px;";
      if (button.top >= 0)
        c += "top:" + (button.top || 0) + "px;";
      if (button.bottom >= 0)
        c += "bottom:" + (button.bottom || 0) + "px;";
      if (button.right >= 0)
        c += "right:" + (button.right || 0) + "px;";
      if (button.right === -1 && button.left === -1)
        c += "right:0px;";
      if (button.bottom === -1 && button.top === -1)
        c += "top:0px;";
    }
    if (button.width)
      c += "width: " + button.width + "px;";
    else if (bh === 26)
      c += "min-width: 26px;";
    if (button.height)
      c += "height: " + button.height + "px;";
    c += '" title="' + tt + '" draggable="true" data-index="' + index + '">' + caption + "</button>";
    return c;
  }
  function showButtons() {
    if (client.getOption("showButtons"))
      document.getElementById("buttons").style.visibility = "visible";
    else
      document.getElementById("buttons").style.visibility = "";
  }
  function buildButtons() {
    var c = "";
    var buttons = client.buttons;
    var b, bl;
    for (b = 0, bl = buttons.length; b < bl; b++) {
      if (!buttons[b].enabled) continue;
      c += createButton(buttons[b], b);
    }
    document.getElementById("buttons").innerHTML = c;
    const items = document.querySelectorAll("#buttons button");
    for (let i = 0, il = items.length; i < il; i++) {
      items[i].addEventListener("click", (e) => {
        ExecuteButton(e.currentTarget, +e.currentTarget.dataset.index);
      });
      dragButton(items[i]);
    }
  }
  function ExecuteButton(el, idx) {
    if (idx < 0) return false;
    if (el.dataset.moving === "true") {
      delete el.dataset.moving;
      return;
    }
    var buttons = client.buttons;
    if (idx >= buttons.length) return false;
    var button = buttons[idx];
    if (!button.enabled) return false;
    var ret;
    switch (button.style) {
      case 1:
        ret = client.parseOutgoing(button.value);
        break;
      case 2:
        var f = new Function("try { " + button.value + "} catch (e) { if(this.options.showScriptErrors) this.error(e);}");
        ret = f.apply(client);
        break;
      default:
        ret = button.value;
        break;
    }
    if (ret === null || typeof ret == "undefined")
      return true;
    if (button.send) {
      if (!ret.endsWith("\n"))
        ret += "\n";
      if (button.chain) {
        if (client.commandInput.value.endsWith(" ")) {
          client.commandInput.value += ret;
          client.sendCommand();
          return true;
        }
      }
      if (client.connected)
        client.send(ret);
      if (client.telnet.echo && client.getOption("commandEcho"))
        client.echo(ret);
    } else if (button.append)
      client.commandInput.value += ret;
    return true;
  }
  function dragButton(elmnt) {
    var pos3 = 0, pos4 = 0;
    var delay;
    if (document.getElementById(elmnt.id + "header")) {
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
      elmnt.ontouchstart = dragTouchStart;
      elmnt.onmouseleave = dragMouseleave;
    }
    function dragMouseDown(e) {
      e = e || window.event;
      if (e.buttons !== 1) return;
      e.preventDefault();
      var b = elmnt.getBoundingClientRect();
      pos3 = e.pageX - b.left;
      pos4 = e.pageY - b.top;
      document.onmouseup = closeDragButton;
      delay = setTimeout(function() {
        document.onmousemove = elementDrag;
        delay = null;
      }, 500);
    }
    function dragMouseleave() {
      if (delay)
        closeDragButton();
    }
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      elmnt.style.position = "absolute";
      elmnt.style.top = e.pageY - pos4 + "px";
      elmnt.style.left = e.pageX - document.body.clientWidth - pos3 + "px";
      elmnt.dataset.moving = "true";
    }
    function dragTouchStart(e) {
      e = e || window.event;
      if (!e.touches.length) return;
      var b = elmnt.getBoundingClientRect();
      pos3 = e.touches[0].pageX - b.left;
      pos4 = e.touches[0].pageY - b.top;
      document.ontouchend = closeDragButton;
      delay = setTimeout(function() {
        document.ontouchmove = elementMove;
        delay = null;
      }, 500);
    }
    function elementMove(e) {
      e = e || window.event;
      e.preventDefault();
      elmnt.style.position = "absolute";
      if (!e.touches.length) return;
      elmnt.style.top = e.touches[0].pageY - pos4 + "px";
      elmnt.style.left = e.touches[0].pageX - document.body.clientWidth - pos3 + "px";
      elmnt.dataset.moving = "true";
    }
    function closeDragButton() {
      var b = elmnt.getBoundingClientRect();
      var idx = parseInt(elmnt.dataset.index, 10);
      if (idx < 0) return;
      var buttons = client.buttons;
      if (idx >= buttons.length) return;
      var button = buttons[idx];
      if (!button.enabled) return;
      if (button.left === -1 && button.right === -1 && button.top === -1 && button.bottom === -1) {
        button.top = b.top || -1;
        button.right = document.body.clientWidth - b.right || -1;
      } else {
        if (button.left >= 0)
          button.left = document.body.clientWidth - b.left || -1;
        if (button.top >= 0)
          button.top = b.top || -1;
        if (button.bottom >= 0)
          button.bottom = b.bottom || -1;
        if (button.right >= 0)
          button.right = document.body.clientWidth - b.right || -1;
        if (button.right === -1 && button.left === -1)
          button.right = document.body.clientWidth - b.right || -1;
        if (button.bottom === -1 && button.top === -1)
          button.top = b.top || -1;
      }
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
      clearTimeout(delay);
      client.saveProfiles();
    }
  }
  window.initializeInterface = initializeInterface;
})();
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
