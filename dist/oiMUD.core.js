(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/lib/inflate_stream.min.js
  var require_inflate_stream_min = __commonJS({
    "src/lib/inflate_stream.min.js"(exports) {
      (function() {
        "use strict";
        var k = void 0, l = true, aa = this;
        function s(a, d) {
          var b = a.split("."), c = aa;
          !(b[0] in c) && c.execScript && c.execScript("var " + b[0]);
          for (var e; b.length && (e = b.shift()); ) !b.length && d !== k ? c[e] = d : c = c[e] ? c[e] : c[e] = {};
        }
        ;
        var x = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array && "undefined" !== typeof DataView;
        function y(a) {
          var d = a.length, b = 0, c = Number.POSITIVE_INFINITY, e, g, f, p, h, q, m, n, r, B;
          for (n = 0; n < d; ++n) a[n] > b && (b = a[n]), a[n] < c && (c = a[n]);
          e = 1 << b;
          g = new (x ? Uint32Array : Array)(e);
          f = 1;
          p = 0;
          for (h = 2; f <= b; ) {
            for (n = 0; n < d; ++n) if (a[n] === f) {
              q = 0;
              m = p;
              for (r = 0; r < f; ++r) q = q << 1 | m & 1, m >>= 1;
              B = f << 16 | n;
              for (r = q; r < e; r += h) g[r] = B;
              ++p;
            }
            ++f;
            p <<= 1;
            h <<= 1;
          }
          return [g, b, c];
        }
        ;
        function z(a, d, b) {
          this.u = [];
          this.i = b ? b : 32768;
          this.v = 0;
          this.a = d === k ? 0 : d;
          this.d = this.e = 0;
          this.input = x ? new Uint8Array(a) : a;
          this.b = new (x ? Uint8Array : Array)(this.i);
          this.c = 0;
          this.t = this.l = false;
          this.f = 0;
          this.status = A;
        }
        var A = 0;
        z.prototype.j = function(a, d) {
          var b = false;
          a !== k && (this.input = a);
          d !== k && (this.a = d);
          for (; !b; ) switch (this.status) {
            case A:
            case 1:
              var c;
              var e = k;
              this.status = 1;
              H(this);
              if (0 > (e = I(this, 3))) J(this), c = -1;
              else {
                e & 1 && (this.l = l);
                e >>>= 1;
                switch (e) {
                  case 0:
                    this.h = 0;
                    break;
                  case 1:
                    this.h = 1;
                    break;
                  case 2:
                    this.h = 2;
                    break;
                  default:
                    throw Error("unknown BTYPE: " + e);
                }
                this.status = 2;
                c = k;
              }
              0 > c && (b = l);
              break;
            case 2:
            case 3:
              switch (this.h) {
                case 0:
                  var g;
                  var f = k, p = k, h = this.input, q = this.a;
                  this.status = 3;
                  if (q + 4 >= h.length) g = -1;
                  else {
                    f = h[q++] | h[q++] << 8;
                    p = h[q++] | h[q++] << 8;
                    if (f === ~p) throw Error("invalid uncompressed block header: length verify");
                    this.d = this.e = 0;
                    this.a = q;
                    this.m = f;
                    this.status = 4;
                    g = k;
                  }
                  0 > g && (b = l);
                  break;
                case 1:
                  this.status = 3;
                  this.k = ba;
                  this.n = ca;
                  this.status = 4;
                  break;
                case 2:
                  var m;
                  a: {
                    var n = k, r = k, B = k, V = new (x ? Uint8Array : Array)(K.length), W = k;
                    this.status = 3;
                    H(this);
                    n = I(this, 5) + 257;
                    r = I(this, 5) + 1;
                    B = I(this, 4) + 4;
                    if (0 > n || 0 > r || 0 > B) J(this), m = -1;
                    else {
                      try {
                        for (var w = k, D = k, E = 0, C = k, u = k, t = k, X = k, t = 0; t < B; ++t) {
                          if (0 > (w = I(this, 3))) throw Error("not enough input");
                          V[K[t]] = w;
                        }
                        W = y(V);
                        u = new (x ? Uint8Array : Array)(n + r);
                        t = 0;
                        for (X = n + r; t < X; ) {
                          D = O(this, W);
                          if (0 > D) throw Error("not enough input");
                          switch (D) {
                            case 16:
                              if (0 > (w = I(this, 2))) throw Error("not enough input");
                              for (C = 3 + w; C--; ) u[t++] = E;
                              break;
                            case 17:
                              if (0 > (w = I(this, 3))) throw Error("not enough input");
                              for (C = 3 + w; C--; ) u[t++] = 0;
                              E = 0;
                              break;
                            case 18:
                              if (0 > (w = I(this, 7))) throw Error("not enough input");
                              for (C = 11 + w; C--; ) u[t++] = 0;
                              E = 0;
                              break;
                            default:
                              E = u[t++] = D;
                          }
                        }
                        new (x ? Uint8Array : Array)(n);
                        new (x ? Uint8Array : Array)(r);
                        this.k = x ? y(u.subarray(
                          0,
                          n
                        )) : y(u.slice(0, n));
                        this.n = x ? y(u.subarray(n)) : y(u.slice(n));
                      } catch (pa) {
                        J(this);
                        m = -1;
                        break a;
                      }
                      this.status = 4;
                      m = 0;
                    }
                  }
                  0 > m && (b = l);
              }
              break;
            case 4:
            case 5:
              switch (this.h) {
                case 0:
                  var L;
                  a: {
                    var Y = this.input, F = this.a, M = this.b, G = this.c, N = this.m;
                    for (this.status = 5; N--; ) {
                      G === M.length && (M = P(this, { o: 2 }));
                      if (F >= Y.length) {
                        this.a = F;
                        this.c = G;
                        this.m = N + 1;
                        L = -1;
                        break a;
                      }
                      M[G++] = Y[F++];
                    }
                    0 > N && (this.status = 6);
                    this.a = F;
                    this.c = G;
                    L = 0;
                  }
                  0 > L && (b = l);
                  break;
                case 1:
                case 2:
                  0 > da(this) && (b = l);
              }
              break;
            case 6:
              this.l ? b = l : this.status = A;
          }
          var Z, v = this.c, $2;
          Z = this.t ? x ? new Uint8Array(this.b.subarray(this.f, v)) : this.b.slice(this.f, v) : x ? this.b.subarray(this.f, v) : this.b.slice(this.f, v);
          this.f = v;
          v > 32768 + this.i && (this.c = this.f = 32768, x ? ($2 = this.b, this.b = new Uint8Array(this.i + 32768), this.b.set($2.subarray(v - 32768, v))) : this.b = this.b.slice(v - 32768));
          return Z;
        };
        var ea = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = x ? new Uint16Array(ea) : ea, fa = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258], ga = x ? new Uint16Array(fa) : fa, ha = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0], ia = x ? new Uint8Array(ha) : ha, ja = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577], ka = x ? new Uint16Array(ja) : ja, la = [
          0,
          0,
          0,
          0,
          1,
          1,
          2,
          2,
          3,
          3,
          4,
          4,
          5,
          5,
          6,
          6,
          7,
          7,
          8,
          8,
          9,
          9,
          10,
          10,
          11,
          11,
          12,
          12,
          13,
          13
        ], ma = x ? new Uint8Array(la) : la, Q = new (x ? Uint8Array : Array)(288), R, na;
        R = 0;
        for (na = Q.length; R < na; ++R) Q[R] = 143 >= R ? 8 : 255 >= R ? 9 : 279 >= R ? 7 : 8;
        var ba = y(Q), S = new (x ? Uint8Array : Array)(30), T, oa;
        T = 0;
        for (oa = S.length; T < oa; ++T) S[T] = 5;
        var ca = y(S);
        function I(a, d) {
          for (var b = a.e, c = a.d, e = a.input, g = a.a, f; c < d; ) {
            if (e.length <= g) return -1;
            f = e[g++];
            b |= f << c;
            c += 8;
          }
          f = b & (1 << d) - 1;
          a.e = b >>> d;
          a.d = c - d;
          a.a = g;
          return f;
        }
        function O(a, d) {
          for (var b = a.e, c = a.d, e = a.input, g = a.a, f = d[0], p = d[1], h, q, m; c < p; ) {
            if (e.length <= g) return -1;
            h = e[g++];
            b |= h << c;
            c += 8;
          }
          q = f[b & (1 << p) - 1];
          m = q >>> 16;
          if (m > c) throw Error("invalid code length: " + m);
          a.e = b >> m;
          a.d = c - m;
          a.a = g;
          return q & 65535;
        }
        function H(a) {
          a.s = a.a;
          a.r = a.d;
          a.q = a.e;
        }
        function J(a) {
          a.a = a.s;
          a.d = a.r;
          a.e = a.q;
        }
        function da(a) {
          var d = a.b, b = a.c, c, e, g, f, p = a.k, h = a.n, q = d.length, m;
          for (a.status = 5; ; ) {
            H(a);
            c = O(a, p);
            if (0 > c) return a.c = b, J(a), -1;
            if (256 === c) break;
            if (256 > c) b === q && (d = P(a), q = d.length), d[b++] = c;
            else {
              e = c - 257;
              f = ga[e];
              if (0 < ia[e]) {
                m = I(a, ia[e]);
                if (0 > m) return a.c = b, J(a), -1;
                f += m;
              }
              c = O(a, h);
              if (0 > c) return a.c = b, J(a), -1;
              g = ka[c];
              if (0 < ma[c]) {
                m = I(a, ma[c]);
                if (0 > m) return a.c = b, J(a), -1;
                g += m;
              }
              b + f >= q && (d = P(a), q = d.length);
              for (; f--; ) d[b] = d[b++ - g];
              if (a.a === a.input.length) return a.c = b, -1;
            }
          }
          for (; 8 <= a.d; ) a.d -= 8, a.a--;
          a.c = b;
          a.status = 6;
        }
        function P(a, d) {
          var b, c = a.input.length / a.a + 1 | 0, e, g, f, p = a.input, h = a.b;
          d && ("number" === typeof d.o && (c = d.o), "number" === typeof d.p && (c += d.p));
          2 > c ? (e = (p.length - a.a) / a.k[2], f = 258 * (e / 2) | 0, g = f < h.length ? h.length + f : h.length << 1) : g = h.length * c;
          x ? (b = new Uint8Array(g), b.set(h)) : b = h;
          a.b = b;
          return a.b;
        }
        ;
        function U(a) {
          this.input = a === k ? new (x ? Uint8Array : Array)() : a;
          this.a = 0;
          this.g = new z(this.input, this.a);
          this.b = this.g.b;
        }
        U.prototype.j = function(a) {
          var d;
          if (a !== k) if (x) {
            var b = new Uint8Array(this.input.length + a.length);
            b.set(this.input, 0);
            b.set(a, this.input.length);
            this.input = b;
          } else this.input = this.input.concat(a);
          var c;
          if (c = this.method === k) {
            var e;
            var g = this.a, f = this.input, p = f[g++], h = f[g++];
            if (p === k || h === k) e = -1;
            else {
              switch (p & 15) {
                case 8:
                  this.method = 8;
                  break;
                default:
                  throw Error("unsupported compression method");
              }
              if (0 !== ((p << 8) + h) % 31) throw Error("invalid fcheck flag:" + ((p << 8) + h) % 31);
              if (h & 32) throw Error("fdict flag is not supported");
              this.a = g;
              e = k;
            }
            c = 0 > e;
          }
          if (c) return new (x ? Uint8Array : Array)();
          d = this.g.j(this.input, this.a);
          0 !== this.g.a && (this.input = x ? this.input.subarray(this.g.a) : this.input.slice(this.g.a), this.a = 0);
          return d;
        };
        s("Zlib.InflateStream", U);
        s("Zlib.InflateStream.prototype.decompress", U.prototype.j);
      }).call(exports);
    }
  });

  // src/lib/buzz.js
  var require_buzz = __commonJS({
    "src/lib/buzz.js"(exports, module) {
      (function(context, factory) {
        "use strict";
        if (typeof module !== "undefined" && module.exports) {
          module.exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define([], factory);
        } else {
          context.buzz = factory();
        }
      })(exports, function() {
        "use strict";
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var buzz2 = {
          defaults: {
            autoplay: false,
            duration: 5e3,
            formats: [],
            loop: false,
            placeholder: "--",
            preload: "metadata",
            volume: 80,
            webAudioApi: false,
            document: window.document
          },
          types: {
            mp3: "audio/mpeg",
            ogg: "audio/ogg",
            wav: "audio/wav",
            aac: "audio/aac",
            m4a: "audio/x-m4a"
          },
          sounds: [],
          el: document.createElement("audio"),
          getAudioContext: function() {
            if (this.audioCtx === void 0) {
              try {
                this.audioCtx = AudioContext ? new AudioContext() : null;
              } catch (e) {
                this.audioCtx = null;
              }
            }
            return this.audioCtx;
          },
          sound: function(src, options) {
            options = options || {};
            var doc = options.document || buzz2.defaults.document;
            var pid = 0, events = [], eventsOnce = {}, supported = buzz2.isSupported();
            this.load = function() {
              if (!supported) {
                return this;
              }
              this.sound.load();
              return this;
            };
            this.play = function() {
              if (!supported) {
                return this;
              }
              this.sound.play();
              return this;
            };
            this.togglePlay = function() {
              if (!supported) {
                return this;
              }
              if (this.sound.paused) {
                this.sound.play();
              } else {
                this.sound.pause();
              }
              return this;
            };
            this.pause = function() {
              if (!supported) {
                return this;
              }
              this.sound.pause();
              return this;
            };
            this.isPaused = function() {
              if (!supported) {
                return null;
              }
              return this.sound.paused;
            };
            this.stop = function() {
              if (!supported) {
                return this;
              }
              this.setTime(0);
              this.sound.pause();
              return this;
            };
            this.isEnded = function() {
              if (!supported) {
                return null;
              }
              return this.sound.ended;
            };
            this.loop = function() {
              if (!supported) {
                return this;
              }
              this.sound.loop = "loop";
              this.bind("ended.buzzloop", function() {
                this.currentTime = 0;
                this.play();
              });
              return this;
            };
            this.unloop = function() {
              if (!supported) {
                return this;
              }
              this.sound.removeAttribute("loop");
              this.unbind("ended.buzzloop");
              return this;
            };
            this.mute = function() {
              if (!supported) {
                return this;
              }
              this.sound.muted = true;
              return this;
            };
            this.unmute = function() {
              if (!supported) {
                return this;
              }
              this.sound.muted = false;
              return this;
            };
            this.toggleMute = function() {
              if (!supported) {
                return this;
              }
              this.sound.muted = !this.sound.muted;
              return this;
            };
            this.isMuted = function() {
              if (!supported) {
                return null;
              }
              return this.sound.muted;
            };
            this.setVolume = function(volume) {
              if (!supported) {
                return this;
              }
              if (volume < 0) {
                volume = 0;
              }
              if (volume > 100) {
                volume = 100;
              }
              this.volume = volume;
              this.sound.volume = volume / 100;
              return this;
            };
            this.getVolume = function() {
              if (!supported) {
                return this;
              }
              return this.volume;
            };
            this.increaseVolume = function(value) {
              return this.setVolume(this.volume + (value || 1));
            };
            this.decreaseVolume = function(value) {
              return this.setVolume(this.volume - (value || 1));
            };
            this.setTime = function(time) {
              if (!supported) {
                return this;
              }
              var set = true;
              this.whenReady(function() {
                if (set === true) {
                  set = false;
                  this.sound.currentTime = time;
                }
              });
              return this;
            };
            this.getTime = function() {
              if (!supported) {
                return null;
              }
              var time = Math.round(this.sound.currentTime * 100) / 100;
              return isNaN(time) ? buzz2.defaults.placeholder : time;
            };
            this.setPercent = function(percent) {
              if (!supported) {
                return this;
              }
              return this.setTime(buzz2.fromPercent(percent, this.sound.duration));
            };
            this.getPercent = function() {
              if (!supported) {
                return null;
              }
              var percent = Math.round(buzz2.toPercent(this.sound.currentTime, this.sound.duration));
              return isNaN(percent) ? buzz2.defaults.placeholder : percent;
            };
            this.setSpeed = function(duration) {
              if (!supported) {
                return this;
              }
              this.sound.playbackRate = duration;
              return this;
            };
            this.getSpeed = function() {
              if (!supported) {
                return null;
              }
              return this.sound.playbackRate;
            };
            this.getDuration = function() {
              if (!supported) {
                return null;
              }
              var duration = Math.round(this.sound.duration * 100) / 100;
              return isNaN(duration) ? buzz2.defaults.placeholder : duration;
            };
            this.getPlayed = function() {
              if (!supported) {
                return null;
              }
              return timerangeToArray(this.sound.played);
            };
            this.getBuffered = function() {
              if (!supported) {
                return null;
              }
              return timerangeToArray(this.sound.buffered);
            };
            this.getSeekable = function() {
              if (!supported) {
                return null;
              }
              return timerangeToArray(this.sound.seekable);
            };
            this.getErrorCode = function() {
              if (supported && this.sound.error) {
                return this.sound.error.code;
              }
              return 0;
            };
            this.getErrorMessage = function() {
              if (!supported) {
                return null;
              }
              switch (this.getErrorCode()) {
                case 1:
                  return "MEDIA_ERR_ABORTED";
                case 2:
                  return "MEDIA_ERR_NETWORK";
                case 3:
                  return "MEDIA_ERR_DECODE";
                case 4:
                  return "MEDIA_ERR_SRC_NOT_SUPPORTED";
                default:
                  return null;
              }
            };
            this.getStateCode = function() {
              if (!supported) {
                return null;
              }
              return this.sound.readyState;
            };
            this.getStateMessage = function() {
              if (!supported) {
                return null;
              }
              switch (this.getStateCode()) {
                case 0:
                  return "HAVE_NOTHING";
                case 1:
                  return "HAVE_METADATA";
                case 2:
                  return "HAVE_CURRENT_DATA";
                case 3:
                  return "HAVE_FUTURE_DATA";
                case 4:
                  return "HAVE_ENOUGH_DATA";
                default:
                  return null;
              }
            };
            this.getNetworkStateCode = function() {
              if (!supported) {
                return null;
              }
              return this.sound.networkState;
            };
            this.getNetworkStateMessage = function() {
              if (!supported) {
                return null;
              }
              switch (this.getNetworkStateCode()) {
                case 0:
                  return "NETWORK_EMPTY";
                case 1:
                  return "NETWORK_IDLE";
                case 2:
                  return "NETWORK_LOADING";
                case 3:
                  return "NETWORK_NO_SOURCE";
                default:
                  return null;
              }
            };
            this.set = function(key, value) {
              if (!supported) {
                return this;
              }
              this.sound[key] = value;
              return this;
            };
            this.get = function(key) {
              if (!supported) {
                return null;
              }
              return key ? this.sound[key] : this.sound;
            };
            this.bind = function(types, func) {
              if (!supported) {
                return this;
              }
              types = types.split(" ");
              var self = this, efunc = function(e) {
                func.call(self, e);
              };
              for (var t = 0; t < types.length; t++) {
                var type = types[t], idx = type;
                type = idx.split(".")[0];
                events.push({
                  idx,
                  func: efunc
                });
                this.sound.addEventListener(type, efunc, true);
              }
              return this;
            };
            this.unbind = function(types) {
              if (!supported) {
                return this;
              }
              types = types.split(" ");
              for (var t = 0; t < types.length; t++) {
                var idx = types[t], type = idx.split(".")[0];
                for (var i2 = 0; i2 < events.length; i2++) {
                  var namespace = events[i2].idx.split(".");
                  if (events[i2].idx === idx || namespace[1] && namespace[1] === idx.replace(".", "")) {
                    this.sound.removeEventListener(type, events[i2].func, true);
                    events.splice(i2, 1);
                  }
                }
              }
              return this;
            };
            this.bindOnce = function(type, func) {
              if (!supported) {
                return this;
              }
              var self = this;
              eventsOnce[pid++] = false;
              this.bind(type + "." + pid, function() {
                if (!eventsOnce[pid]) {
                  eventsOnce[pid] = true;
                  func.call(self);
                }
                self.unbind(type + "." + pid);
              });
              return this;
            };
            this.trigger = function(types, detail) {
              if (!supported) {
                return this;
              }
              types = types.split(" ");
              for (var t = 0; t < types.length; t++) {
                var idx = types[t];
                for (var i2 = 0; i2 < events.length; i2++) {
                  var eventType = events[i2].idx.split(".");
                  if (events[i2].idx === idx || eventType[0] && eventType[0] === idx.replace(".", "")) {
                    var evt = doc.createEvent("HTMLEvents");
                    evt.initEvent(eventType[0], false, true);
                    evt.originalEvent = detail;
                    this.sound.dispatchEvent(evt);
                  }
                }
              }
              return this;
            };
            this.fadeTo = function(to, duration, callback) {
              if (!supported) {
                return this;
              }
              if (duration instanceof Function) {
                callback = duration;
                duration = buzz2.defaults.duration;
              } else {
                duration = duration || buzz2.defaults.duration;
              }
              var from = this.volume, delay = duration / Math.abs(from - to), self = this;
              this.play();
              function doFade() {
                setTimeout(function() {
                  if (from < to && self.volume < to) {
                    self.setVolume(self.volume += 1);
                    doFade();
                  } else if (from > to && self.volume > to) {
                    self.setVolume(self.volume -= 1);
                    doFade();
                  } else if (callback instanceof Function) {
                    callback.apply(self);
                  }
                }, delay);
              }
              this.whenReady(function() {
                doFade();
              });
              return this;
            };
            this.fadeIn = function(duration, callback) {
              if (!supported) {
                return this;
              }
              return this.setVolume(0).fadeTo(100, duration, callback);
            };
            this.fadeOut = function(duration, callback) {
              if (!supported) {
                return this;
              }
              return this.fadeTo(0, duration, callback);
            };
            this.fadeWith = function(sound2, duration) {
              if (!supported) {
                return this;
              }
              this.fadeOut(duration, function() {
                this.stop();
              });
              sound2.play().fadeIn(duration);
              return this;
            };
            this.whenReady = function(func) {
              if (!supported) {
                return null;
              }
              var self = this;
              if (this.sound.readyState === 0) {
                this.bind("canplay.buzzwhenready", function() {
                  func.call(self);
                });
              } else {
                func.call(self);
              }
            };
            this.addSource = function(src2) {
              var self = this, source = doc.createElement("source");
              source.src = src2;
              if (buzz2.types[getExt(src2)]) {
                source.type = buzz2.types[getExt(src2)];
              }
              this.sound.appendChild(source);
              source.addEventListener("error", function(e) {
                self.trigger("sourceerror", e);
              });
              return source;
            };
            function timerangeToArray(timeRange) {
              var array = [], length = timeRange.length - 1;
              for (var i2 = 0; i2 <= length; i2++) {
                array.push({
                  start: timeRange.start(i2),
                  end: timeRange.end(i2)
                });
              }
              return array;
            }
            function getExt(filename) {
              return filename.split(".").pop();
            }
            if (supported && src) {
              for (var i in buzz2.defaults) {
                if (buzz2.defaults.hasOwnProperty(i)) {
                  if (options[i] === void 0) {
                    options[i] = buzz2.defaults[i];
                  }
                }
              }
              this.sound = doc.createElement("audio");
              if (options.webAudioApi) {
                var audioCtx = buzz2.getAudioContext();
                if (audioCtx) {
                  this.source = audioCtx.createMediaElementSource(this.sound);
                  this.source.connect(audioCtx.destination);
                }
              }
              if (src instanceof Array) {
                for (var j in src) {
                  if (src.hasOwnProperty(j)) {
                    this.addSource(src[j]);
                  }
                }
              } else if (options.formats.length) {
                for (var k in options.formats) {
                  if (options.formats.hasOwnProperty(k)) {
                    this.addSource(src + "." + options.formats[k]);
                  }
                }
              } else {
                this.addSource(src);
              }
              if (options.loop) {
                this.loop();
              }
              if (options.autoplay) {
                this.sound.autoplay = "autoplay";
              }
              if (options.preload === true) {
                this.sound.preload = "auto";
              } else if (options.preload === false) {
                this.sound.preload = "none";
              } else {
                this.sound.preload = options.preload;
              }
              this.setVolume(options.volume);
              buzz2.sounds.push(this);
            }
          },
          group: function(sounds) {
            sounds = argsToArray(sounds, arguments);
            this.getSounds = function() {
              return sounds;
            };
            this.add = function(soundArray) {
              soundArray = argsToArray(soundArray, arguments);
              for (var a = 0; a < soundArray.length; a++) {
                sounds.push(soundArray[a]);
              }
            };
            this.remove = function(soundArray) {
              soundArray = argsToArray(soundArray, arguments);
              for (var a = 0; a < soundArray.length; a++) {
                for (var i = 0; i < sounds.length; i++) {
                  if (sounds[i] === soundArray[a]) {
                    sounds.splice(i, 1);
                    break;
                  }
                }
              }
            };
            this.load = function() {
              fn("load");
              return this;
            };
            this.play = function() {
              fn("play");
              return this;
            };
            this.togglePlay = function() {
              fn("togglePlay");
              return this;
            };
            this.pause = function(time) {
              fn("pause", time);
              return this;
            };
            this.stop = function() {
              fn("stop");
              return this;
            };
            this.mute = function() {
              fn("mute");
              return this;
            };
            this.unmute = function() {
              fn("unmute");
              return this;
            };
            this.toggleMute = function() {
              fn("toggleMute");
              return this;
            };
            this.setVolume = function(volume) {
              fn("setVolume", volume);
              return this;
            };
            this.increaseVolume = function(value) {
              fn("increaseVolume", value);
              return this;
            };
            this.decreaseVolume = function(value) {
              fn("decreaseVolume", value);
              return this;
            };
            this.loop = function() {
              fn("loop");
              return this;
            };
            this.unloop = function() {
              fn("unloop");
              return this;
            };
            this.setSpeed = function(speed) {
              fn("setSpeed", speed);
              return this;
            };
            this.setTime = function(time) {
              fn("setTime", time);
              return this;
            };
            this.set = function(key, value) {
              fn("set", key, value);
              return this;
            };
            this.bind = function(type, func) {
              fn("bind", type, func);
              return this;
            };
            this.unbind = function(type) {
              fn("unbind", type);
              return this;
            };
            this.bindOnce = function(type, func) {
              fn("bindOnce", type, func);
              return this;
            };
            this.trigger = function(type) {
              fn("trigger", type);
              return this;
            };
            this.fade = function(from, to, duration, callback) {
              fn("fade", from, to, duration, callback);
              return this;
            };
            this.fadeIn = function(duration, callback) {
              fn("fadeIn", duration, callback);
              return this;
            };
            this.fadeOut = function(duration, callback) {
              fn("fadeOut", duration, callback);
              return this;
            };
            function fn() {
              var args = argsToArray(null, arguments), func = args.shift();
              for (var i = 0; i < sounds.length; i++) {
                sounds[i][func].apply(sounds[i], args);
              }
            }
            function argsToArray(array, args) {
              return array instanceof Array ? array : Array.prototype.slice.call(args);
            }
          },
          all: function() {
            return new buzz2.group(buzz2.sounds);
          },
          isSupported: function() {
            return !!buzz2.el.canPlayType;
          },
          isOGGSupported: function() {
            return !!buzz2.el.canPlayType && buzz2.el.canPlayType('audio/ogg; codecs="vorbis"');
          },
          isWAVSupported: function() {
            return !!buzz2.el.canPlayType && buzz2.el.canPlayType('audio/wav; codecs="1"');
          },
          isMP3Supported: function() {
            return !!buzz2.el.canPlayType && buzz2.el.canPlayType("audio/mpeg;");
          },
          isAACSupported: function() {
            return !!buzz2.el.canPlayType && (buzz2.el.canPlayType("audio/x-m4a;") || buzz2.el.canPlayType("audio/aac;"));
          },
          toTimer: function(time, withHours) {
            var h, m, s;
            h = Math.floor(time / 3600);
            h = isNaN(h) ? "--" : h >= 10 ? h : "0" + h;
            m = withHours ? Math.floor(time / 60 % 60) : Math.floor(time / 60);
            m = isNaN(m) ? "--" : m >= 10 ? m : "0" + m;
            s = Math.floor(time % 60);
            s = isNaN(s) ? "--" : s >= 10 ? s : "0" + s;
            return withHours ? h + ":" + m + ":" + s : m + ":" + s;
          },
          fromTimer: function(time) {
            var splits = time.toString().split(":");
            if (splits && splits.length === 3) {
              time = parseInt(splits[0], 10) * 3600 + parseInt(splits[1], 10) * 60 + parseInt(splits[2], 10);
            }
            if (splits && splits.length === 2) {
              time = parseInt(splits[0], 10) * 60 + parseInt(splits[1], 10);
            }
            return time;
          },
          toPercent: function(value, total, decimal) {
            var r = Math.pow(10, decimal || 0);
            return Math.round(value * 100 / total * r) / r;
          },
          fromPercent: function(percent, total, decimal) {
            var r = Math.pow(10, decimal || 0);
            return Math.round(total / 100 * percent * r) / r;
          }
        };
        return buzz2;
      });
    }
  });

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
  function htmlDecode(value) {
    _edCache.innerHTML = value;
    return _edCache.textContent;
  }
  function stripQuotes(str) {
    str = str.replace(/^"(.+(?="$))?"$/, "$1");
    str = str.replace(/^'(.+(?='$))?'$/, "$1");
    return str;
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
  function CharAllowedInURL(chr, proto) {
    if (chr.length > 1)
      return false;
    if (chr === "-" || chr === "_" || chr === "." || chr === "~" || chr === "!" || chr === "*" || chr === "'" || chr === ";" || chr === ":" || chr === "@" || chr === "&" || chr === "=" || chr === "+" || chr === "$" || chr === "," || chr === "/" || chr === "\\" || chr === "?" || chr === "%" || chr === "#" || chr === "[" || chr === "]" || chr === "(" || chr === ")")
      return !proto;
    const i = chr.charCodeAt(0);
    if (i > 64 && i < 91)
      return true;
    if (i > 96 && i < 123)
      return true;
    if (i > 47 && i < 58)
      return true;
    if (i >= 160 && i <= 55295)
      return true;
    if (i >= 57344 && i <= 64975)
      return true;
    if (i >= 65008 && i <= 65533)
      return true;
    if (i >= 65536 && i <= 131069)
      return true;
    if (i >= 131072 && i <= 196605)
      return true;
    if (i >= 196608 && i <= 262141)
      return true;
    if (i >= 262144 && i <= 327677)
      return true;
    if (i >= 327680 && i <= 393213)
      return true;
    if (i >= 393216 && i <= 458749)
      return true;
    if (i >= 458752 && i <= 524285)
      return true;
    if (i >= 524288 && i <= 589821)
      return true;
    if (i >= 589824 && i <= 655357)
      return true;
    if (i >= 655360 && i <= 720893)
      return true;
    if (i >= 720896 && i <= 786429)
      return true;
    if (i >= 786432 && i <= 851965)
      return true;
    if (i >= 851968 && i <= 917501)
      return true;
    if (i >= 921600 && i <= 983037)
      return true;
    if (i >= 983040 && i <= 1048573)
      return true;
    if (i >= 1048576 && i <= 1114109)
      return true;
    return false;
  }
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
  (function($2) {
    $2.fn.hasHorizontalScrollBar = function() {
      return $2(this)[0].scrollWidth > $2(this).innerWidth();
    };
  })(jQuery);
  function clone(obj, replacer) {
    return JSON.parse(JSON.stringify(obj, replacer));
  }
  function selectAll(input) {
    if (!input || input.value.length === 0) return;
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(0, input.value.length);
    } else
      input.select();
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
  function getTimeSpan(i) {
    let al;
    const tmp = [];
    al = Math.floor(i / (1e3 * 60 * 60 * 24));
    i -= al * (1e3 * 60 * 60 * 24);
    if (al === 1) tmp.push(al + " day");
    else if (al > 0) tmp.push(al + " days");
    al = Math.floor(i / (1e3 * 60 * 60));
    i -= al * (1e3 * 60 * 60);
    if (al === 1) tmp.push(al + " hour");
    else if (al > 0) tmp.push(al + " hours");
    al = Math.floor(i / (1e3 * 60));
    i -= al * (1e3 * 60);
    if (al === 1) tmp.push(al + " minute");
    else if (al > 0) tmp.push(al + " minutes");
    al = Math.floor(i / 1e3);
    i -= al * 1e3;
    if (al === 1) tmp.push(al + " second");
    else if (al > 0) tmp.push(al + " seconds");
    if (tmp.length === 0)
      tmp.push("0 seconds");
    return tmp.join(", ");
  }
  function splitQuoted(str, sep, t, e, ec) {
    if (typeof t === "undefined") t = 1 | 2;
    if (typeof e === "undefined") e = 0;
    if (typeof ec === "undefined") ec = "\\";
    if (!str || str.length === 0)
      return [];
    if (!sep || sep.length === 0)
      return [str];
    sep = sep.split("");
    let q = false;
    let sq = false;
    const strings = [];
    let ps = 0;
    let s = 0;
    const sl = str.length;
    let c;
    for (; s < sl; s++) {
      c = str.charAt(s);
      if (c === '"' && (t & 2) === 2) {
        if ((e & 2) === 2 && s > 0) {
          if (s - 1 > 0 && str.charAt(s - 1) !== ec)
            q = !q;
        } else
          q = !q;
      } else if (c === "'" && (t & 1) === 1) {
        if ((e & 1) === 1 && s > 0) {
          if (s - 1 > 0 && str.charAt(s - 1) !== ec)
            sq = !sq;
        } else
          sq = !sq;
      } else if (!sq && !q) {
        const spl = sep.length;
        for (let sp = 0; sp < spl; sp++) {
          if (c === sep[sp]) {
            if (s > ps || s === 0) {
              strings.push(str.substring(ps, s));
              ps = s + 1;
              break;
            } else if (s === ps) {
              strings.push("");
              ps = s + 1;
              break;
            } else if (s === sl - 1)
              strings.push("");
          }
        }
      }
    }
    if (s === sl && s === ps && sep.indexOf(str.charAt(s - 1)) > -1) {
      strings.push("");
      ps = s + 1;
    }
    if (s > ps)
      strings.push(str.substring(ps, s));
    return strings;
  }
  function getCursor(el) {
    if (!el) return 0;
    if (typeof el.selectionStart === "number") {
      return el.selectionDirection == "backward" ? el.selectionStart : el.selectionEnd;
    } else if (document.selection) {
      el.focus();
      var oSel = document.selection.createRange();
      oSel.moveStart("character", -el.value.length);
      return oSel.text.length;
    }
    return 0;
  }
  function formatUnit(str, ch) {
    if (!str) return str;
    if (/^\d+c$/.test(str)) {
      if (ch)
        return parseInt(str, 10) * ch + "px";
      return str + "h";
    }
    if (/^\d+$/.test(str))
      return parseInt(str, 10) + "px";
    return str;
  }
  function isValidIdentifier(str) {
    if (!str || str.length === 0) return false;
    if (!str.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/g))
      return false;
    return ["break", "case", "catch", "continue", "debugger", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "class", "const", "enum", "export", "extends", "import", "super", "implements", "interface", "let", "package", "private", "protected", "public", "static", "yield", "null", "true", "false", "NaN", "Infinity", "undefined", "eval", "arguments"].indexOf(str) === -1;
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
  var txtDecoder;
  function ArrayBufferToString(buffer) {
    if (window.TextDecoder !== void 0) {
      return (txtDecoder || (txtDecoder = new TextDecoder())).decode(new Uint8Array(buffer));
    }
    return BinaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
  }
  function BinaryToString(binary) {
    var error;
    try {
      return decodeURIComponent(escape(binary));
    } catch (_error) {
      error = _error;
      if (error instanceof URIError) {
        return binary;
      } else {
        throw error;
      }
    }
  }
  function StringToBinary(string) {
    var chars, code, i, isUCS2, len, _i;
    len = string.length;
    chars = [];
    isUCS2 = false;
    for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
      code = String.prototype.charCodeAt.call(string, i);
      if (code > 255) {
        isUCS2 = true;
        chars = null;
        break;
      } else {
        chars.push(code);
      }
    }
    if (isUCS2 === true) {
      return unescape(encodeURIComponent(string));
    } else {
      return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
    }
  }
  var txtEncoder;
  function StringToUint8Array(string) {
    var binary, binLen, buffer, chars, i, _i;
    if (window.TextEncoder !== void 0)
      return (txtEncoder || (txtEncoder = new TextEncoder())).encode(string);
    binary = StringToBinary(string);
    binLen = binary.length;
    buffer = new ArrayBuffer(binLen);
    chars = new Uint8Array(buffer);
    for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
      chars[i] = String.prototype.charCodeAt.call(binary, i);
    }
    return chars;
  }
  function getParameterByName(name2, url) {
    if (!name2) return null;
    if (!url) url = window.location.href;
    name2 = name2.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name2 + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
      this.show = function(data, name2, mimetype) {
        var builder = new BlobBuilder();
        builder.append(data);
        var blob = builder.getBlob(mimetype || "application/octet-stream");
        if (!name2) name2 = "Download.bin";
        if (window.saveAs) {
          window.saveAs(blob, name2);
        } else {
          navigator.saveBlob(blob, name2);
        }
      };
    } else if (BlobBuilder && URL) {
      this.show = function(data, name2, mimetype) {
        var blob, url, builder = new BlobBuilder();
        builder.append(data);
        if (!mimetype) mimetype = "application/octet-stream";
        if (DownloadAttributeSupport) {
          blob = builder.getBlob(mimetype);
          url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", name2 || "Download.bin");
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
      this.show = function(data, name2, mimetype) {
        var blob, url;
        if (!mimetype) mimetype = "application/octet-stream";
        blob = new Blob([data], { type: mimetype });
        if (DownloadAttributeSupport) {
          url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", name2 || "Download.bin");
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
      this.show = function(data, name2, mimetype) {
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
  function printArray(data) {
    if (data === null || typeof data == "undefined") return data;
    var dl, ba;
    var idx = 0;
    dl = data.byteLength;
    ba = new StringBuffer();
    for (; idx < dl; idx++) {
      if (data[idx] < 32 || data[idx] >= 127)
        ba.append("<" + data[idx] + ">");
      else
        ba.append(String.fromCharCode(data[idx]));
    }
    return ba.toString();
  }
  function getScrollbarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);
    const inner = document.createElement("div");
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }
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

  // src/telnet.ts
  var import_inflate_stream_min = __toESM(require_inflate_stream_min());
  var Telnet = class extends EventEmitter {
    /**
     * Creates an instance of Telnet.
     *
     * @param {any} options a list of options to set
     *
     * @memberOf Telnet
     */
    constructor(options) {
      super();
      this._splitBuffer = [];
      this._connected = false;
      this._MTTS = 0;
      this.zStream = 0;
      this._latencyTime = null;
      this._doPing = false;
      this._closed = true;
      this._zlib = false;
      this.options = { MCCP: true, MXP: true, NAWS: true, MSDP: true, GMCP: true, MSSP: false, ECHO: true, TTYPE: true, EOR: true, NEWENVIRON: false, ZMP: false, ATCP: false, CHARSET: true };
      this.host = "";
      this.port = 23;
      this.prompt = false;
      this.echo = true;
      this.firstSent = true;
      this.firstReceived = true;
      this.server = { NAWS: false, MSDP: false, GMCP: false, MXP: false, MCCP1: false, MCCP2: false, MSSP: false, NEWENVIRON: false, ZMP: false, EOR: false, ATCP: false, CHARSET: false };
      this.version = "2.0";
      this.terminal = "ansi";
      this.UTF8 = true;
      this.MSSP = {};
      this.socket = null;
      this.latency = 0;
      this.latencyAvg = null;
      this.enableLatency = false;
      this.enablePing = false;
      this.GMCPSupports = ["Core 1", "Char 1", "Char.Vitals 1", "Char.Experience 1"];
      this.enableDebug = false;
      this.scheme = "ws://";
      this.protocol = "binary";
      if (options) {
        if ("host" in options) {
          if (options.host && options.host.length)
            this.host = options.host;
          delete options.host;
        }
        if ("port" in options) {
          this.port = options.port;
          delete options.port;
        }
        if ("scheme" in options) {
          if (options.scheme && options.scheme.length)
            this.scheme = options.scheme;
          delete options.scheme;
        }
        if ("protocol" in options) {
          if (options.protocol && options.protocol.length)
            this.protocol = options.protocol;
          delete options.protocol;
        }
      }
      this.options = Object.assign(this.options, options || {});
    }
    /**
     * @name connected
     * @desc determine if connected to host
     * @returns {Boolean} weather connected to host or not
     *
     * @readonly
     *
     * @memberOf Telnet
     */
    get connected() {
      if (!this.socket || typeof this.socket === "undefined")
        return false;
      return this._connected;
    }
    /**
         * @name Telnet#reset
         * @desc reset state in preparation for a connect
         */
    reset() {
      this._MTTS = 0;
      this.firstSent = true;
      this.firstReceived = true;
      this.prompt = false;
      this.echo = true;
      this.server = { NAWS: false, MSDP: false, GMCP: false, MXP: false, MCCP1: false, MCCP2: false, MSSP: false, EOR: false, NEWENVIRON: false, ATCP: false, CHARSET: false, ZMP: false };
      this._splitBuffer = [];
      this._endMCCP();
      this._connected = false;
      this._closed = false;
      if (this.enableDebug)
        this.emit("debug", "Reset");
    }
    /**
     * @name connect
     * @desc connect to target host
     *
     * @fires Telnet#connecting
     */
    connect() {
      this._destroySocket();
      this.reset();
      this.emit("connecting");
      this.socket = this._createSocket(this.host, this.port);
      if (this.enableDebug)
        this.emit("debug", "Connecting to " + this.host + ":" + this.port);
    }
    /**
     * @name Telnet#close
     * @desc close the connection ot host and reset state in preparation for next connection
     *
     * @fires Telnet#close
     */
    close() {
      if (this._closed) return;
      this._destroySocket();
      this.reset();
      this.emit("close");
      this._closed = true;
      if (this.enableDebug)
        this.emit("debug", "Closed");
    }
    /**
     * @name Telnet#receivedData
     * @desc data that is received from the host to be processed
     *
     * @param {String} data string received from host
     * @fires Telnet#received-data
     */
    receivedData(data, skipDecompress, prependSplit) {
      if (this.enableLatency) {
        if (this._latencyTime !== null) {
          this.latency = (/* @__PURE__ */ new Date()).getTime() - this._latencyTime.getTime();
          if (this.latencyAvg == null)
            this.latencyAvg = this.latency;
          else
            this.latencyAvg = (this.latency + this.latencyAvg) / 2;
          this._latencyTime = null;
          this._doPing = false;
          this.emit("latency-changed", this.latency, this.latencyAvg);
        } else if (!this._doPing && this.enablePing)
          this._doPing = true;
        else {
          this._latencyTime = null;
          this._doPing = false;
        }
      }
      if (this.enableDebug)
        this.emit("debug", "PreProcess:" + data, 1);
      data = this.processData(data, skipDecompress, false, prependSplit);
      if (this.enableDebug)
        this.emit("debug", "PostProcess:" + data, 1);
      this.emit("received-data", data);
      if (this.enableLatency) {
        if (this._splitBuffer.length > 0) {
          if (this.enablePing) this._doPing = true;
          this._latencyTime = null;
        } else if (this._doPing && this.enablePing) {
          setTimeout(() => {
            this._latencyTime = /* @__PURE__ */ new Date();
            this.sendGMCP("Core.Ping " + this.latencyAvg);
          });
        } else
          this._doPing = false;
      }
    }
    /**
     * @name Telnet#sendTerminal
     * @desc Send terminal type telnet option to mud to identify the terminal
     */
    sendTerminal() {
      if (this.enableDebug) {
        if (this._MTTS === 0)
          this.emit("debug", "REPLY: <IAC><SB><TERMINALTYPE><IS>" + this.terminal + "<IAC><SE>");
        else if (this._MTTS === 1)
          this.emit("debug", "REPLY: <IAC><SB><TERMINALTYPE><IS>ANSI-256COLOR<IAC><SE>");
        else if (this._MTTS >= 2)
          this.emit("debug", "REPLY: <IAC><SB><TERMINALTYPE><IS>MTTS 9<IAC><SE>");
      }
      if (this._MTTS === 0) {
        var tmp = new Uint8Array(6 + this.terminal.length);
        tmp.set([255, 250, 24, 0], 0);
        tmp.set(StringToUint8Array(this.terminal), 4);
        tmp.set([255, 240], 4 + this.terminal.length);
        this.sendData(tmp, true);
      } else if (this._MTTS === 1)
        this.sendData([255, 250, 24, 0, 65, 78, 83, 73, 45, 50, 53, 54, 67, 79, 76, 79, 82, 255, 240], true);
      else if (this._MTTS >= 2)
        this.sendData([255, 250, 24, 0, 77, 84, 84, 83, 32, 57, 255, 240], true);
    }
    /**
     * @name Telnet#sendData
     * @desc Send data to the host
     *
     * @param {String} data string to send
     * @param {Boolean} raw send raw unescaped telnet data to host, other wise it will escape the IAC for proper telnet
     * @fires Telnet#data-sent
     */
    sendData(data, raw) {
      if (data == null || typeof data === "undefined" || data.length === 0)
        return;
      if (this.connected) {
        try {
          if (!raw) {
            this.prompt = false;
            data = this._escapeData(data);
            if (this.enableLatency) this._latencyTime = /* @__PURE__ */ new Date();
          }
          if (this.socket !== null) {
            if (data instanceof Uint8Array) {
              if (this.enableDebug)
                this.emit("debug", "sendDataU8:" + printArray(data));
              this.socket.send(data);
            } else if (Array.isArray(data)) {
              if (this.enableDebug)
                this.emit("debug", "sendDataBA" + printArray(new Uint8Array(data)));
              this.socket.send(new Uint8Array(data));
            } else {
              if (this.enableDebug)
                this.emit("debug", "sendDataR:" + printArray(StringToUint8Array(data)));
              this.socket.send(data);
            }
            if (!raw) this.firstSent = false;
          }
        } catch (e) {
          this.emit("error", e);
        }
      } else if (this.enableLatency)
        this._latencyTime = null;
      this.emit("data-sent", data, raw);
    }
    /**
     * @name Telnet#processData
     * @desc Process raw incoming data
     *
     * @param {string} data The data to process
     * @returns {string} The results of the processed data
     * @fires Telnet#receive-option
     * @fires Telnet#receive-MSDP
     * @fires Telnet#receive-GMCP
     * @fires Telnet#receive-MSSP
     * @fires Telnet#receive-NEWENVIRON
     * @fires Telnet#receive-CHARSET
     */
    //this.processData = function(data) { return data; };
    processData(data, skipDecompress, returnRaw, prependSplit) {
      let len;
      let tmp = "";
      let _sb;
      if (data == null)
        return data;
      if (!skipDecompress)
        data = this._decompressData(data);
      len = data.byteLength;
      if (len === 0)
        return data;
      _sb = this._splitBuffer;
      if (_sb.length > 0) {
        if (this.enableDebug) this.emit("debug", "Split buffer length: " + _sb.length, 1);
        tmp = new Uint8Array(len + _sb.length);
        if (prependSplit) {
          tmp.set(data, 0);
          tmp.set(_sb, data.byteLength);
        } else {
          tmp.set(_sb, 0);
          tmp.set(data, _sb.length);
        }
        data = tmp;
        _sb = [];
        len = data.byteLength;
      }
      let state = 0;
      let pState = 0;
      let processed = new StringBuffer();
      const ga = this.prompt;
      let verb = 0;
      let option = 0;
      let msdp_val = "";
      let msdp_var = "";
      let _MSSP;
      let i = 0;
      let ne;
      let idx = 0;
      tmp = "";
      this.prompt = false;
      let debugOp = "";
      try {
        for (; idx < len; idx++) {
          i = data[idx];
          switch (state) {
            case 0:
              if (i === 255) {
                if (this.enableDebug) debugOp = "TELOP: <IAC>";
                _sb.push(i);
                state = 1;
              } else if (this.UTF8 || this.options.CHARSET && this.server.CHARSET) {
                if ((i & 128) === 128 && idx >= len - 4) {
                  let uLen = 0;
                  if ((i & 192) === 192)
                    uLen = 1;
                  else if ((i & 224) === 224)
                    uLen = 2;
                  else if ((i & 240) === 240)
                    uLen = 3;
                  if (idx + uLen >= len) {
                    _sb.push(...data.slice(idx));
                    if (this.enableDebug) {
                      this.emit("debug", "Unicode split length: " + uLen, 1);
                      this.emit("debug", "Split buffer length: " + _sb.length, 1);
                    }
                    break;
                  }
                }
                processed.appendCode(i);
              } else
                processed.appendCode(i);
              break;
            case 1:
              if (i === 255) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<IAC>");
                  debugOp = "";
                }
                processed.appendCode(i);
                _sb = [];
                state = 0;
              } else if ((!this.options.EOR || !this.server.EOR) && i === 239) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<NOP>");
                  debugOp = "";
                }
                _sb = [];
                state = 0;
              } else if (i === 241 || i === 130) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<NOP>");
                  debugOp = "";
                }
                _sb = [];
                state = 0;
              } else if (i === 249 || i === 239) {
                if (this.enableDebug) {
                  if (i === 239)
                    this.emit("debug", debugOp + "<EOR>");
                  else
                    this.emit("debug", debugOp + "<GA>");
                  debugOp = "";
                }
                if (idx + 1 < len && len - idx > 2) {
                  processed.push("\n");
                  this.prompt = false;
                } else
                  this.prompt = true;
                _sb = [];
                state = 0;
              } else if (i === 253 || i === 254 || i === 251 || i === 252) {
                if (this.enableDebug) {
                  switch (i) {
                    case 253:
                      debugOp += "<DO>";
                      break;
                    case 254:
                      debugOp += "<DONT>";
                      break;
                    case 251:
                      debugOp += "<WILL>";
                      break;
                    case 252:
                      debugOp += "<WONT>";
                      break;
                  }
                }
                _sb.push(i);
                verb = i;
                state = 2;
              } else if (i === 250) {
                if (this.enableDebug) debugOp += "<SB>";
                _sb.push(i);
                state = 3;
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                _sb = [];
                state = 0;
              }
              break;
            case 2:
              if (i === 1) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<ECHO>");
                  debugOp = "";
                }
                if (verb === 253) {
                  if (this.options.ECHO) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><ECHO>");
                    this.replyToOption(i, 251, verb);
                    this.echo = false;
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><ECHO>");
                    this.echo = true;
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><ECHO>");
                  this.replyToOption(i, 252, verb);
                  this.echo = true;
                } else if (verb === 251) {
                  if (this.options.ECHO) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><ECHO>");
                    this.replyToOption(i, 253, verb);
                    this.echo = false;
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><ECHO>");
                    this.echo = true;
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><ECHO>");
                  this.echo = true;
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 24) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<TERMINALTYPE>");
                  debugOp = "";
                }
                if (verb === 253) {
                  if (this.options.TTYPE) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><TERMINALTYPE>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><TERMINALTYPE>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><TERMINALTYPE>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  if (this.options.TTYPE) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><TERMINALTYPE>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><TERMINALTYPE>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><TERMINALTYPE>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 25) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<ENDOFRECORD>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.EOR = true;
                  if (this.options.EOR) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><ENDOFRECORD>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><ENDOFRECORD>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><ENDOFRECORD>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.EOR = true;
                  if (this.options.EOR) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><ENDOFRECORD>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><ENDOFRECORD>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><ENDOFRECORD>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 31) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<NAWS>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.NAWS = true;
                  if (this.options.NAWS) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><NAWS>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><NAWS>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.NAWS = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><NAWS>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.NAWS = true;
                  if (this.options.NAWS) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><NAWS>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><NAWS>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.NAWS = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><NAWS>");
                  this.replyToOption(i, 254, verb);
                }
                this.emit("windowSize");
                state = 0;
                _sb = [];
              } else if (i === 36 || i === 39) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<NEWENVIRON>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.NEWENVIRON = true;
                  if (this.options.NEWENVIRON) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><NEWENVIRON>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><NEWENVIRON>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><NEWENVIRON>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.NEWENVIRON = true;
                  if (this.options.NEWENVIRON) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><NEWENVIRON>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><NEWENVIRON>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><NEWENVIRON>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 69) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<MSDP>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.MSDP = true;
                  if (this.options.MSDP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><MSDP>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MSDP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.MSDP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><MSDP>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.MSDP = true;
                  if (this.options.MSDP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><MSDP>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MSDP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.MSDP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MSDP>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 70) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<MSSP>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.MSSP = true;
                  if (this.options.MSSP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><MSSP>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MSSP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.MSSP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><MSSP>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.MSSP = true;
                  if (this.options.MSSP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><MSSP>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MSSP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.MSSP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MSSP>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 85) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<MCCP1>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.MCCP1 = true;
                  if (this.options.MCCP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><MCCP1>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MCCP1>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.MCCP1 = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><MCCP1>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.MCCP1 = true;
                  if (this.options.MCCP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><MCCP1>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MCCP1>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.MCCP1 = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MCCP1>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 86) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<MCCP2>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.MCCP2 = true;
                  if (this.options.MCCP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><MCCP2>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MCCP2>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.MCCP2 = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><MCCP2>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.MCCP2 = true;
                  if (this.options.MCCP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><MCCP2>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MCCP2>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.MCCP2 = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MCCP2>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 91) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<MXP>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.MXP = true;
                  if (this.options.MXP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><MXP>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MXP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.MXP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><MXP>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.MXP = true;
                  if (this.options.MXP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><MXP>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MXP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.MXP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><MXP>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 130 || i === 241) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<NOP>");
                  debugOp = "";
                }
                this._fireReceiveOption(i, verb, "");
                _sb = [];
                state = 0;
              } else if (i === 201) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<GMCP>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.GMCP = true;
                  if (this.options.GMCP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><GMCP>");
                    this.replyToOption(i, 251, verb);
                    this._startGMCP();
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><GMCP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.GMCP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><GMCP>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.GMCP = true;
                  if (this.options.GMCP) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><GMCP>");
                    this.replyToOption(i, 253, verb);
                    this._startGMCP();
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><GMCP>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.GMCP = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><GMCP>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else if (i === 42) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<CHARSET>");
                  debugOp = "";
                }
                if (verb === 253) {
                  this.server.CHARSET = true;
                  if (this.options.CHARSET) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WILL><CHARSET>");
                    this.replyToOption(i, 251, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><CHARSET>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 254) {
                  this.server.CHARSET = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><CHARSET>");
                  this.replyToOption(i, 252, verb);
                } else if (verb === 251) {
                  this.server.CHARSET = true;
                  if (this.options.CHARSET) {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DO><CHARSET>");
                    this.replyToOption(i, 253, verb);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><CHARSET>");
                    this.replyToOption(i, 254, verb);
                  }
                } else if (verb === 252) {
                  this.server.CHARSET = false;
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><CHARSET>");
                  this.replyToOption(i, 254, verb);
                }
                state = 0;
                _sb = [];
              } else {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + this._formatByte(i));
                  debugOp = "";
                }
                if (verb === 251 || verb === 252) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><DONT><" + i + ">");
                  this.replyToOption(i, 254, verb);
                } else if (verb === 254 || verb === 253) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><WONT><" + i + ">");
                  this.replyToOption(i, 252, verb);
                }
                state = 0;
                _sb = [];
              }
              break;
            case 3:
              option = i;
              if (i === 24) {
                if (this.enableDebug) debugOp += "<TERMINALTYPE>";
                _sb.push(i);
                option = i;
                state = 4;
              } else if (i === 36 || i === 39) {
                if (this.enableDebug) debugOp += "<NEWENVIRON>";
                _sb.push(i);
                option = i;
                state = 12;
                ne = -1;
              } else if (i === 69) {
                if (this.enableDebug) debugOp += "<MSDP>";
                _sb.push(i);
                option = i;
                state = 4;
              } else if (i === 70) {
                if (this.enableDebug) debugOp += "<MSSP>";
                _sb.push(i);
                option = i;
                state = 8;
                _MSSP = {};
              } else if (i === 85 || i === 86) {
                if (this.enableDebug) debugOp += i === 85 ? "<MCCP1>" : "<MCCP2>";
                _sb.push(i);
                option = i;
                state = 11;
              } else if (i === 201) {
                if (this.enableDebug) debugOp += "<GMCP>";
                _sb.push(i);
                option = i;
                state = 7;
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                tmp = ArrayBufferToString(_sb.slice(1, _sb.length - 4));
                this._fireReceiveOption(option, 250, tmp);
                tmp = null;
                state = 0;
                _sb = [];
              } else if (i === 42) {
                if (this.enableDebug) debugOp += "<CHARSET>";
                _sb.push(i);
                option = i;
                state = 17;
                msdp_val = "";
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                _sb.push(i);
              }
              break;
            case 4:
              if (option === 24 && i === 1) {
                if (this.enableDebug) debugOp += "<SEND>";
                _sb.push(i);
                verb = 1;
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                if (option === 24 && verb === 1) {
                  tmp = false;
                  this._fireReceiveOption(option, 250, "");
                  if (!tmp) {
                    this.sendTerminal();
                    this.sendTerminal();
                    this._MTTS++;
                  }
                }
                state = 0;
                _sb = [];
              } else if (option === 69 && i === 1) {
                if (this.enableDebug) debugOp += "<MSDP_VAR>";
                _sb.push(i);
                msdp_var = "";
                state = 5;
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                _sb.push(i);
              }
              break;
            case 5:
              if (i === 2) {
                if (this.enableDebug) debugOp += "<MSDP_VAL>";
                _sb.push(i);
                msdp_val = "";
                state = 6;
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_var += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 6:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 1) {
                if (this.enableDebug) debugOp += "<MSDP_VAR>";
                this._fireReceiveMSDP(msdp_var, msdp_val);
                msdp_val = "";
                msdp_var = "";
                _sb.push(i);
                state = 5;
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                tmp = ArrayBufferToString(_sb.slice(1, _sb.length - 4));
                this._fireReceiveOption(option, 250, tmp);
                tmp = null;
                this._fireReceiveMSDP(msdp_var, msdp_val);
                msdp_val = "";
                msdp_var = "";
                state = 0;
                _sb = [];
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_val += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 7:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                tmp = ArrayBufferToString(_sb.slice(1, _sb.length - 4));
                this._fireReceiveOption(option, 250, tmp);
                tmp = null;
                this._fireReceiveGMCP(msdp_val);
                state = 0;
                msdp_val = "";
                _sb = [];
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_val += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 8:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  this.emit("debug", this.MSSP);
                  debugOp = "";
                }
                tmp = ArrayBufferToString(_sb.slice(1, _sb.length - 4));
                this._fireReceiveOption(option, 250, tmp);
                tmp = null;
                this.emit("receive-MSSP", _MSSP);
                msdp_val = "";
                msdp_var = "";
                _MSSP = 0;
                state = 0;
                _sb = [];
              } else if (i === 1) {
                if (this.enableDebug) debugOp += "<MSSP_VAR>";
                _sb.push(i);
                msdp_var = "";
                state = 9;
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                _sb.push(i);
              }
              break;
            case 9:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
                state = 8;
              } else if (i === 1) {
                if (this.enableDebug) debugOp += "<MSSP_VAR>";
                _sb.push(i);
                msdp_var = "";
              } else if (i === 2) {
                if (this.enableDebug) debugOp += "<MSSP_VAL>";
                _sb.push(i);
                this.MSSP[msdp_var] = "";
                _MSSP[msdp_var] = "";
                state = 10;
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_var += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 10:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
                state = 8;
              } else if (i === 1) {
                if (this.enableDebug) debugOp += "<MSSP_VAR>";
                _sb.push(i);
                msdp_var = "";
                state = 9;
              } else if (i === 2) {
                if (this.enableDebug) debugOp += "<MSSP_VAL>";
                _sb.push(i);
                this.MSSP[msdp_var] = "";
                _MSSP[msdp_var] = "";
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                this.MSSP[msdp_var] += String.fromCharCode(i);
                _MSSP[msdp_var] += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 11:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                this._fireReceiveOption(option, 86, "");
                this._startMCCP();
                state = 0;
                _sb = [];
                if (idx < len - 1)
                  processed.append(this.processData(data.subarray(idx + 1), skipDecompress, true));
                idx = len;
              }
              break;
            case 12:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                tmp = ArrayBufferToString(_sb.slice(1, _sb.length - 4));
                this._fireReceiveOption(option, 250, tmp);
                tmp = null;
                this._fireReceiveGMCP(msdp_val);
                state = 0;
                msdp_val = "";
                _sb = [];
              } else if (i === 0) {
                if (this.enableDebug) debugOp += "<IS>";
                _sb.push(i);
                state = 13;
                verb = i;
              } else if (i === 1) {
                if (this.enableDebug) debugOp += "<SEND>";
                _sb.push(i);
                state = 13;
                verb = i;
              } else if (i === 2) {
                if (this.enableDebug) debugOp += "<SEND>";
                _sb.push(i);
                state = 13;
                verb = i;
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_val += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 13:
              if (i === 0) {
                if (this.enableDebug) debugOp += "<VAR>";
                _sb.push(i);
                state = 14;
                verb = i;
                msdp_var = "";
                if (ne === -1) ne = 0;
              } else if (i === 1) {
                if (this.enableDebug) debugOp += "<VALUE>";
                _sb.push(i);
                state = 13;
                verb = i;
                if (ne === -1) ne = 1;
              } else if (i === 3) {
                if (this.enableDebug) debugOp += "<USERVAR>";
                _sb.push(i);
                state = 13;
                verb = i;
              } else if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                tmp = ArrayBufferToString(_sb.slice(1, _sb.length - 4));
                tmp = this._fireReceiveOption(option, 250, tmp);
                this.emit("receive-NEWENVIRON", msdp_val);
                if (!tmp) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><SB><NEWENVIRON><IS><IAC><SE>");
                  this.sendData(new Uint8Array([255, 250]), true);
                  this.sendData(option, true);
                  this.sendData(new Uint8Array([0, 255, 240]), true);
                }
                state = 0;
                msdp_val = "";
                _sb = [];
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_val += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 14:
              if (i === 2) {
                if (this.enableDebug) debugOp += this._formatByte(i);
                _sb.push(i);
                state = 15;
                pState = 14;
              } else if (i === 255 || i <= 3) {
                idx--;
                state = 13;
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_var += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 15:
              if (this.enableDebug) debugOp += this._formatByte(i);
              if (pState === 16)
                msdp_val += String.fromCharCode(i);
              else
                msdp_var += String.fromCharCode(i);
              state = pState;
              _sb.push(i);
              break;
            case 16:
              break;
            case 17:
              if (i === 1) {
                if (this.enableDebug) debugOp += "<REQUEST>";
                _sb.push(i);
                state = 18;
                msdp_val = "";
              } else if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                tmp = this._fireReceiveOption(option, 250, msdp_val);
                this.emit("receive-CHARSET", msdp_val);
                if (!tmp) {
                  if (this.enableDebug) this.emit("debug", "REPLY: <IAC><SB><CHARSET><REJECTED><IAC><SE>");
                  this.sendData(new Uint8Array([255, 250, 42, 3, 255, 240]), true);
                }
                state = 0;
                msdp_val = "";
                _sb = [];
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_val += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
            case 18:
              if (i === 255) {
                if (this.enableDebug) debugOp += "<IAC>";
                _sb.push(i);
              } else if (i === 240) {
                if (this.enableDebug) {
                  this.emit("debug", debugOp + "<SE>");
                  debugOp = "";
                }
                tmp = this._fireReceiveOption(option, 250, msdp_val);
                this.emit("receive-CHARSET", msdp_val.slice(1));
                if (!tmp) {
                  if (this.options.CHARSET && msdp_val.slice(1).toLowerCase() === "utf-8") {
                    this.server.CHARSET = true;
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><SB><ACCEPTED>UTF-8<IAC><SE>");
                    this.sendData(new Uint8Array([255, 250, 42, 2]), true);
                    this.sendData("UTF-8", true);
                    this.sendData(new Uint8Array([255, 240]), true);
                  } else {
                    if (this.enableDebug) this.emit("debug", "REPLY: <IAC><SB><CHARSET><REJECTED><IAC><SE>");
                    this.sendData(new Uint8Array([255, 250, 42, 3, 255, 240]), true);
                  }
                }
                state = 0;
                msdp_val = "";
                _sb = [];
              } else {
                if (this.enableDebug) debugOp += this._formatByte(i);
                msdp_val += String.fromCharCode(i);
                _sb.push(i);
              }
              break;
          }
        }
      } catch (e) {
        this.emit("error", e);
      }
      if (this.enableDebug) {
        {
          if (debugOp.length > 0)
            this.emit("debug", debugOp);
        }
        this.emit("debug", "Post Split buffer length: " + _sb.length, 1);
        this.emit("debug", "PostSplit buffer  " + printArray(new Uint8Array(_sb)), 1);
      }
      if (ga && processed.length > 0)
        processed.prepend("\n");
      else if (ga)
        this.prompt = true;
      if (processed.length > 0)
        this.firstReceived = false;
      this._splitBuffer = _sb;
      if (returnRaw)
        return processed;
      if (this.UTF8 || this.options.CHARSET && this.server.CHARSET)
        return UTF8.decode2(processed.toString());
      return processed.toString();
    }
    /**
     * @name Telnet#replyToOption
     * @desc Replay to a telnet option
     *
     * @param {Number} op The telnet option code
     * @param {Number} verb The telnet verb to reply with
     * @param {Number} reply The telnet verb your reply from
     * @param {String|undefined} val The value if the option has one
     * @return boolean returns if the reply was handled or not
     * @fires Telnet#receive-option
     */
    replyToOption(op, verb, reply, val) {
      if (typeof val === "undefined") val = "";
      if (this._fireReceiveOption(op, reply, val))
        return false;
      this.sendData(new Uint8Array([255, verb, op]), true);
      return true;
    }
    /**
     * @name Telnet#updateWindow
     * @desc Send a NAWS Window update
     *
     * @param {Number} w The current width in lines of the window
     * @param {Number} h The current height in characters of the window
     */
    updateWindow(w, h) {
      if (h < 1 || w < 1 || !this.connected || !this.server.NAWS) return;
      try {
        let w1;
        let w2;
        let h1;
        let h2;
        const mf = Math.floor;
        w1 = mf(w / 256);
        if (w1 > 256)
          w1 = 255;
        w2 = w % 256;
        h1 = mf(h / 256);
        if (h1 > 256)
          h1 = 255;
        h2 = h % 256;
        if (this.enableDebug) this.emit("debug", "REPLY: <IAC><SB><NAWS><" + w1 + "><" + w2 + "><" + h1 + "><" + h2 + "><IAC><SE>");
        this.sendData(new Uint8Array([255, 250, 31, w1, w2, h1, h2, 255, 240]), true);
      } catch (e) {
        this.emit("error", { message: "UpdateWindow Error: " + e, err: e });
      }
    }
    /**
     * @name Telnet#sendGMCP
     * @desc Send a GMCP formatted string
     *
     * @param {String} str The GMCP formatted string to send to the host
     */
    sendGMCP(str) {
      if (this.connected && this.server.GMCP) {
        if (this.enableDebug) this.emit("debug", "REPLY: <IAC><SB><GMCP>" + this._escapeData(str).toString("binary") + "<IAC><SE>");
        this.sendData(new Uint8Array([255, 250, 201]), true);
        this.sendData(this._escapeData(str), true);
        this.sendData(new Uint8Array([255, 240]), true);
      }
    }
    /**
     * @name Telnet#startGMCP
     * @desc Start GMCP and send Core.Hello and Core.Support.Set
     */
    _startGMCP() {
      if (this.server.GMCP) {
        if (this.enableDebug)
          this.emit("debug", 'REPLY: <IAC><SB><GMCP>Core.Hello { "client": "' + this.terminal + '", "version": "' + this.version + '" }<IAC><SE>');
        this.sendData(new Uint8Array([255, 250, 201]), true);
        this.sendData('Core.Hello { "client": "' + this.terminal + '", "version": "' + this.version + '" }', true);
        this.sendData(new Uint8Array([255, 240]), true);
        this.sendData(new Uint8Array([255, 250, 201]), true);
        if (this.GMCPSupports.length > 0) {
          if (this.GMCPSupports.indexOf("Core 1") === -1)
            this.GMCPSupports.unshift("Core 1");
          if (this.enableDebug)
            this.emit("debug", "REPLY: <IAC><SB><GMCP>" + JSON.stringify(this.GMCPSupports) + "<IAC><SE>");
          this.sendData("Core.Supports.Set " + JSON.stringify(this.GMCPSupports));
        } else {
          if (this.enableDebug)
            this.emit("debug", 'REPLY: <IAC><SB><GMCP>Core.Supports.Set [ "Core 1" ]<IAC><SE>');
          this.sendData('Core.Supports.Set [ "Core 1" ]', true);
        }
        this.sendData(new Uint8Array([255, 240]), true);
      }
    }
    /**
     * @name Telnet#startMCCP
     * @desc Start MCCP compression protocol and set compress state on
     */
    _startMCCP() {
      this._zlib = true;
    }
    /**
     * @name Telnet#endMCCP
     * @desc End MCCP compression protocol and set compress state off
     */
    _endMCCP() {
      this._zlib = false;
      this.zStream = 0;
    }
    /**
     * @name Telnet#decompressData
     * @desc Decompresses a ZLIB stream if ZLIB is present and compress state is on
     *
     * @param {String} data The compressed data string
     * @returns {String} The decompressed data or the original data i ZLIB is not found or compress state is off
     */
    _decompressData(data) {
      if (!this._zlib) return data;
      if (!this.zStream)
        this.zStream = new import_inflate_stream_min.Zlib.InflateStream();
      if (this.enableDebug) this.emit("debug", "Pre decompress:" + printArray(data), 1);
      data = this.zStream.decompress(data);
      if (this.enableDebug) this.emit("debug", "Post decompress:" + printArray(data), 1);
      return new Uint8Array(data);
    }
    /**
     * @name Telnet#escapeData
     * @desc Escape data for sending over telnet, IAC should become IAC IAC and \r to \r\0 and \n to \r\n
     *
     * @param {String} data the data to be escaped
     * @returns {String} the data after being escaped
     *
     */
    _escapeData(data) {
      if (data == null || typeof data === "undefined") return data;
      let dl;
      let ba;
      let idx = 0;
      let i;
      let c;
      if (data instanceof Uint8Array) {
        dl = data.byteLength;
        ba = new StringBuffer();
        for (; idx < dl; idx++) {
          ba.appendCode(data[idx]);
          if (data[idx] === 255)
            ba.appendCode(255);
          else if (data[idx] === 13 && dl === 1)
            ba.append("\r\n");
          else if (data[idx] === 10 && dl === 1)
            ba.append("\r\0");
        }
        return ba.toString();
      }
      dl = data.length;
      ba = new StringBuffer();
      for (; idx < dl; idx++) {
        c = data.charAt(idx);
        i = data.charCodeAt(idx);
        ba.append(c);
        if (i === 255)
          ba.append(c);
        else if (i === 13 && dl === 1)
          ba.append("\r\n");
        else if (i === 10 && dl === 1)
          ba.append("\r\0");
      }
      return ba.toString();
    }
    /**
     * @name Telnet#createSocket 
     * @desc Create a websocket object and assign events
     *
     * @returns {object} returns the socket object
     */
    _createSocket(host, port) {
      let _socket;
      try {
        const hasScheme = /^[a-z0-9]+:\/\//.test(host);
        if (hasScheme && port > 0)
          _socket = new WebSocket(host + ":" + port, this.protocol || "binary");
        else if (hasScheme)
          _socket = new WebSocket(host, this.protocol || "binary");
        else if (host && port > 0)
          _socket = new WebSocket((this.scheme || "ws://") + host + ":" + port, this.protocol || "binary");
        else if (host)
          _socket = new WebSocket((this.scheme || "ws://") + host, this.protocol || "binary");
        _socket.binaryType = "arraybuffer";
        _socket.onclose = (evt) => {
          if (evt.code === 1006 && evt.type === "close" && !this._closed)
            this.close();
          else if (evt.code !== 1e3 && !this._closed) {
            this.emit("error", { message: "Closed due to transmission error", err: evt });
            this.close();
          }
        };
        _socket.onopen = () => {
          this._connected = true;
          this.emit("connect");
        };
        _socket.onmessage = (evt) => {
          if (evt.data instanceof ArrayBuffer) {
            var data = new Uint8Array(evt.data);
            if (this.enableDebug) this.emit("debug", "Data ArrayBuffer received:" + printArray(data));
            this.receivedData(data);
          } else if (evt.data instanceof Blob) {
            var reader = new FileReader();
            reader.onloadend = () => {
              var data2 = new Uint8Array(reader.result);
              this.receivedData(data2);
              if (this.enableDebug) this.emit("debug", "Data Blob received:" + printArray(reader.result));
            };
            reader.readAsArrayBuffer(evt.data);
          } else {
            if (this.enableDebug) this.emit("debug", "Data received:" + evt.data);
            this.receivedData(evt.data);
          }
        };
        _socket.onerror = (evt) => {
          if (!this._closed)
            this.emit("error", evt);
        };
        return _socket;
      } catch (e) {
        this.emit("error", e);
      }
      return null;
    }
    /**
    * @name Telnet#destroySocket
    * @desc Destroy the current websocket object by assigning all functions to be empty
    *
    * @returns {object} returns null
    */
    _destroySocket() {
      if (!this.socket || this.socket == null) return;
      try {
        this.socket.onopen = function() {
        };
        this.socket.onclose = function() {
        };
        this.socket.onmessage = function() {
        };
        this.socket.onerror = function() {
        };
        if (this.connected)
          this.socket.close();
        delete this.socket;
      } catch (e) {
        this.emit("error", e);
      }
      this.socket = null;
    }
    /**
    * @name Telnet#fireTelnetOption 
    * @desc Fire the onTelnetOption e
    *
    * @returns {object} returns null
    */
    _fireReceiveOption(option, verb, val) {
      const data = { telnet: this, option, verb: 250, value: val, handled: false };
      this.emit("received-option", data);
      return data.handled;
    }
    _fireReceiveMSDP(msdp_var, msdp_val) {
      const data = { telnet: this, variable: msdp_var, value: msdp_val, handled: false };
      this.emit("received-MSDP", data);
      return data.handled;
    }
    _fireReceiveGMCP(val) {
      const data = { telnet: this, value: val, handled: false };
      this.emit("received-GMCP", data);
      return data.handled;
    }
    _formatByte(b) {
      if (b < 32 || b >= 127)
        return "<" + b + ">";
      return String.fromCharCode(b);
    }
    /**
     * @name Telnet#onError
     * @desc Fired when an error happens
     * @method 
     * @event Telnet#onError
     * @property {String|Object} err - the err object or message
     */
    /**
     * @name Telnet#onConnecting
     * @desc Fired when attempting to connect to host
     * @method  
     * @event Telnet#onConnecting
     */
    /**
     * @name Telnet#onConnect
     * @desc Fired when successfully connected to host
     * @method  
     * @event Telnet#onConnect
     */
    /**
    * @name Telnet#onClose
    * @desc Fired when connection is closed to host
    * @method  
    * @event Telnet#onClose
    */
    /**
     * @name Telnet#onReceivedData
     * @desc Fired when data is received from the host
     * @method  
     * @event Telnet#onReceivedData
     * @property {String} data - received from the host after being processed for telnet options
     */
    /**
     * @name Telnet#onDataSent
     * @desc Fired when data is sent to the host
     * @method  
     * @event Telnet#onDataSent
     * @property {String} data - data that was sent to the host
     */
    /**
     * @name Telnet#onReceiveMSDP
     * @desc Fired when a MSDP variable is received from host
     * @method  
     * @event Telnet#onReceiveMSDP
     * @property {String} msdp_var - MSDP variable name
     * @property {String} msdp_val - MSDP value of variable
     */
    /**
    * @name Telnet#onReceiveGMCP
    * @desc Fired when GMCP data is received from host
    * @method  
    * @event Telnet#onReceiveGMCP
    * @property {String} value - The raw GMCP string
    */
    /**
    * @name Telnet#onReceiveMSSP
    * @desc Fired when MSSP variables and values are found
    * @method  
    * @event Telnet#onReceiveMSSP
    * @type {object}
    * @property {object} - the MSSP object containing all variables and values found
    */
    /**
     * @name Telnet#onTelnetOption
     * @desc Fired when a telnet option is found and before any reply sent
     * @method  
     * @event Telnet#onTelnetOption
     * @type {object}
     * @property {Number} option - Telnet option code
     * @property {Number} verb - Telnet verb being replied to
     * @property {String} value - Telnet option value if it has one
     *
     * @returns {Boolean} true if the option was handled, false if not handled and to continue default action
     */
  };
  window.telnet = new Telnet();

  // src/ansi.ts
  var Ansi = /* @__PURE__ */ ((Ansi2) => {
    Ansi2[Ansi2["None"] = 0] = "None";
    Ansi2[Ansi2["Bold"] = 1] = "Bold";
    Ansi2[Ansi2["Faint"] = 2] = "Faint";
    Ansi2[Ansi2["Underline"] = 4] = "Underline";
    Ansi2[Ansi2["Italic"] = 3] = "Italic";
    Ansi2[Ansi2["Slow"] = 5] = "Slow";
    Ansi2[Ansi2["Rapid"] = 6] = "Rapid";
    Ansi2[Ansi2["Inverse"] = 7] = "Inverse";
    Ansi2[Ansi2["Hidden"] = 8] = "Hidden";
    Ansi2[Ansi2["Strikeout"] = 9] = "Strikeout";
    Ansi2[Ansi2["DoubleUnderline"] = 21] = "DoubleUnderline";
    Ansi2[Ansi2["Overline"] = 53] = "Overline";
    return Ansi2;
  })(Ansi || {});
  var AnsiColorCode = /* @__PURE__ */ ((AnsiColorCode2) => {
    AnsiColorCode2[AnsiColorCode2["ErrorBackground"] = -12] = "ErrorBackground";
    AnsiColorCode2[AnsiColorCode2["ErrorText"] = -11] = "ErrorText";
    AnsiColorCode2[AnsiColorCode2["InfoBackground"] = -8] = "InfoBackground";
    AnsiColorCode2[AnsiColorCode2["InfoText"] = -7] = "InfoText";
    AnsiColorCode2[AnsiColorCode2["LocalEcho"] = -3] = "LocalEcho";
    AnsiColorCode2[AnsiColorCode2["LocalEchoBack"] = -4] = "LocalEchoBack";
    AnsiColorCode2[AnsiColorCode2["Reset"] = 0] = "Reset";
    AnsiColorCode2[AnsiColorCode2["Bold"] = 1] = "Bold";
    AnsiColorCode2[AnsiColorCode2["Faint"] = 2] = "Faint";
    AnsiColorCode2[AnsiColorCode2["Italic"] = 3] = "Italic";
    AnsiColorCode2[AnsiColorCode2["Underline"] = 4] = "Underline";
    AnsiColorCode2[AnsiColorCode2["Blink"] = 5] = "Blink";
    AnsiColorCode2[AnsiColorCode2["BlinkRapid"] = 6] = "BlinkRapid";
    AnsiColorCode2[AnsiColorCode2["Reverse"] = 7] = "Reverse";
    AnsiColorCode2[AnsiColorCode2["Hidden"] = 8] = "Hidden";
    AnsiColorCode2[AnsiColorCode2["StrikeThrough"] = 9] = "StrikeThrough";
    AnsiColorCode2[AnsiColorCode2["DoubleUnderline"] = 21] = "DoubleUnderline";
    AnsiColorCode2[AnsiColorCode2["BoldOff"] = 22] = "BoldOff";
    AnsiColorCode2[AnsiColorCode2["ItalicOff"] = 23] = "ItalicOff";
    AnsiColorCode2[AnsiColorCode2["UnderlineOff"] = 24] = "UnderlineOff";
    AnsiColorCode2[AnsiColorCode2["BlinkOff"] = 25] = "BlinkOff";
    AnsiColorCode2[AnsiColorCode2["BlinkRapidOff"] = 26] = "BlinkRapidOff";
    AnsiColorCode2[AnsiColorCode2["ReverseOff"] = 27] = "ReverseOff";
    AnsiColorCode2[AnsiColorCode2["Visible"] = 28] = "Visible";
    AnsiColorCode2[AnsiColorCode2["StrikeThroughOff"] = 29] = "StrikeThroughOff";
    AnsiColorCode2[AnsiColorCode2["Black"] = 30] = "Black";
    AnsiColorCode2[AnsiColorCode2["Red"] = 31] = "Red";
    AnsiColorCode2[AnsiColorCode2["Green"] = 32] = "Green";
    AnsiColorCode2[AnsiColorCode2["Yellow"] = 33] = "Yellow";
    AnsiColorCode2[AnsiColorCode2["Blue"] = 34] = "Blue";
    AnsiColorCode2[AnsiColorCode2["Magenta"] = 35] = "Magenta";
    AnsiColorCode2[AnsiColorCode2["Cyan"] = 36] = "Cyan";
    AnsiColorCode2[AnsiColorCode2["White"] = 37] = "White";
    AnsiColorCode2[AnsiColorCode2["DefaultFore"] = 39] = "DefaultFore";
    AnsiColorCode2[AnsiColorCode2["BlackBackground"] = 40] = "BlackBackground";
    AnsiColorCode2[AnsiColorCode2["RedBackground"] = 41] = "RedBackground";
    AnsiColorCode2[AnsiColorCode2["GreenBackground"] = 42] = "GreenBackground";
    AnsiColorCode2[AnsiColorCode2["YellowBackground"] = 43] = "YellowBackground";
    AnsiColorCode2[AnsiColorCode2["BlueBackground"] = 44] = "BlueBackground";
    AnsiColorCode2[AnsiColorCode2["MagentaBackground"] = 45] = "MagentaBackground";
    AnsiColorCode2[AnsiColorCode2["CyanBackground"] = 46] = "CyanBackground";
    AnsiColorCode2[AnsiColorCode2["WhiteBackground"] = 47] = "WhiteBackground";
    AnsiColorCode2[AnsiColorCode2["DefaultBack"] = 49] = "DefaultBack";
    AnsiColorCode2[AnsiColorCode2["Subscript"] = 74] = "Subscript";
    AnsiColorCode2[AnsiColorCode2["Superscript"] = 73] = "Superscript";
    AnsiColorCode2[AnsiColorCode2["SubSuperOff"] = 75] = "SubSuperOff";
    AnsiColorCode2[AnsiColorCode2["XBlack"] = 90] = "XBlack";
    AnsiColorCode2[AnsiColorCode2["XRed"] = 91] = "XRed";
    AnsiColorCode2[AnsiColorCode2["XGreen"] = 92] = "XGreen";
    AnsiColorCode2[AnsiColorCode2["XYellow"] = 93] = "XYellow";
    AnsiColorCode2[AnsiColorCode2["XBlue"] = 94] = "XBlue";
    AnsiColorCode2[AnsiColorCode2["XMagenta"] = 95] = "XMagenta";
    AnsiColorCode2[AnsiColorCode2["XCyan"] = 96] = "XCyan";
    AnsiColorCode2[AnsiColorCode2["XWhite"] = 97] = "XWhite";
    AnsiColorCode2[AnsiColorCode2["XBlackBackground"] = 100] = "XBlackBackground";
    AnsiColorCode2[AnsiColorCode2["XRedBackground"] = 101] = "XRedBackground";
    AnsiColorCode2[AnsiColorCode2["XGreenBackground"] = 102] = "XGreenBackground";
    AnsiColorCode2[AnsiColorCode2["XYellowBackground"] = 103] = "XYellowBackground";
    AnsiColorCode2[AnsiColorCode2["XBlueBackground"] = 104] = "XBlueBackground";
    AnsiColorCode2[AnsiColorCode2["XMagentaBackground"] = 105] = "XMagentaBackground";
    AnsiColorCode2[AnsiColorCode2["XCyanBackground"] = 106] = "XCyanBackground";
    AnsiColorCode2[AnsiColorCode2["XWhiteBackground"] = 107] = "XWhiteBackground";
    return AnsiColorCode2;
  })(AnsiColorCode || {});
  function getAnsiColorCode(color, back) {
    switch (color.toLowerCase()) {
      case "black":
        return back ? 40 : 30;
      case "red":
        return back ? 41 : 31;
      case "green":
        return back ? 42 : 32;
      case "yellow":
        return back ? 43 : 33;
      case "blue":
        return back ? 44 : 34;
      case "magenta":
        return back ? 45 : 35;
      case "cyan":
        return back ? 46 : 36;
      case "white":
        return back ? 47 : 37;
      case "default":
        return back ? 49 : 39;
    }
    return -1;
  }
  function getColorCode(code) {
    let f = -1;
    let b = -1;
    let bold = false;
    if (code - 1024 >= 0) {
      code -= 1024;
    }
    if (code - 512 >= 0) {
      code -= 512;
    }
    if (code - 256 >= 0) {
      code -= 256;
    }
    if (code - 128 >= 0) {
      code -= 128;
      bold = true;
    }
    if (code - 112 >= 0) {
      code -= 112;
      b = 47;
    }
    if (code - 96 >= 0) {
      code -= 96;
      b = 43;
    }
    if (code - 80 >= 0) {
      code -= 80;
      b = 45;
    }
    if (code - 64 >= 0) {
      code -= 64;
      b = 41;
    }
    if (code - 48 >= 0) {
      code -= 48;
      b = 46;
    }
    if (code - 32 >= 0) {
      code -= 32;
      b = 42;
    }
    if (code - 16 >= 0) {
      code -= 16;
      b = 44;
    }
    if (code >= 8) {
      code -= 8;
      bold = true;
    }
    switch (code) {
      case 0:
        f = 30;
        break;
      case 1:
        f = 34;
        break;
      case 2:
        f = 32;
        break;
      case 3:
        f = 36;
        break;
      case 4:
        f = 31;
        break;
      case 5:
        f = 35;
        break;
      case 6:
        f = 33;
        break;
      case 7:
        f = 37;
        break;
    }
    if (bold && f === -1) f = 370;
    else if (bold) f *= 10;
    if (f === -1)
      return `,${b}`;
    if (b === -1)
      return f.toString();
    return `${f},${b}`;
  }
  function isMXPColor(color) {
    if (!color || color.length === 0) return false;
    return [
      "indianred",
      "lightcoral",
      "salmon",
      "darksalmon",
      "lightsalmon",
      "crimson",
      "red",
      "firebrick",
      "darkred",
      "pink",
      "lightpink",
      "hotpink",
      "deeppink",
      "mediumvioletred",
      "palevioletred",
      "lightsalmon",
      "coral",
      "tomato",
      "orangered",
      "darkorange",
      "orange",
      "gold",
      "yellow",
      "lightyellow",
      "lemonchiffon",
      "lightgoldenrodyellow",
      "papayawhip",
      "moccasin",
      "peachpuff",
      "palegoldenrod",
      "khaki",
      "darkkhaki",
      "lavender",
      "thistle",
      "plum",
      "violet",
      "orchid",
      "fuchsia",
      "magenta",
      "mediumorchid",
      "mediumpurple",
      "blueviolet",
      "darkviolet",
      "darkorchid",
      "darkmagenta",
      "purple",
      "indigo",
      "slateblue",
      "darkslateblue",
      "mediumslateblue",
      "greenyellow",
      "chartreuse",
      "lawngreen",
      "lime",
      "limegreen",
      "palegreen",
      "lightgreen",
      "mediumspringgreen",
      "springgreen",
      "mediumseagreen",
      "seagreen",
      "forestgreen",
      "green",
      "darkgreen",
      "yellowgreen",
      "olivedrab",
      "olive",
      "darkolivegreen",
      "mediumaquamarine",
      "darkseagreen",
      "lightseagreen",
      "darkcyan",
      "teal",
      "aqua",
      "cyan",
      "lightcyan",
      "paleturquoise",
      "aquamarine",
      "turquoise",
      "mediumturquoise",
      "darkturquoise",
      "cadetblue",
      "steelblue",
      "lightsteelblue",
      "powderblue",
      "lightblue",
      "skyblue",
      "lightskyblue",
      "deepskyblue",
      "dodgerblue",
      "cornflowerblue",
      "mediumslateblue",
      "royalblue",
      "blue",
      "mediumblue",
      "darkblue",
      "navy",
      "midnightblue",
      "cornsilk",
      "blanchedalmond",
      "bisque",
      "navajowhite",
      "wheat",
      "burlywood",
      "tan",
      "rosybrown",
      "sandybrown",
      "goldenrod",
      "darkgoldenrod",
      "peru",
      "chocolate",
      "saddlebrown",
      "sienna",
      "brown",
      "maroon",
      "white",
      "snow",
      "honeydew",
      "mintcream",
      "azure",
      "aliceblue",
      "ghostwhite",
      "whitesmoke",
      "seashell",
      "beige",
      "oldlace",
      "floralwhite",
      "ivory",
      "antiquewhite",
      "linen",
      "lavenderblush",
      "mistyrose",
      "gainsboro",
      "lightgrey",
      "silver",
      "darkgray",
      "gray",
      "dimgray",
      "lightslategray",
      "slategray",
      "darkslategray",
      "black"
    ].indexOf(color.toLowerCase()) != -1;
  }
  function getAnsiCode(str, back) {
    switch (str) {
      /** @desc  custom color for error information */
      case "errortextbackground":
      case "errorbackground":
        return -12;
      /** @desc  custom background color for error information */
      case "errortext":
        return back ? -12 : -11;
      /** @desc  custom background color for client information */
      case "infobackground":
        return -8;
      /** @desc  custom foreground color for client information */
      case "infotext":
        return back ? -8 : -7;
      /** @desc  custom tag for local echo */
      case "localecho":
        return back ? -4 : -3;
      /** @desc  custom tag for local echo */
      case "localechoback":
        return -4;
      /** @desc all attributes off */
      case "reset":
        return 0;
      /** @desc bold on */
      case "bold":
        return 1;
      /** @desc faint on */
      case "faint":
        return 2;
      /** @desc italic on */
      case "italic":
        return 3;
      /** @desc underscore */
      case "underline":
        return 4;
      /** @desc blink on (slow) */
      case "blink":
        return 5;
      /** @desc blink on (rapid) */
      case "blinkrapid":
        return 6;
      /** @desc reverse video on */
      case "reverse":
        return 7;
      /** @desc concealed on */
      case "hidden":
        return 8;
      /** @desc  strike through */
      case "strikethrough":
        return 9;
      /** @desc double underline on */
      case "doubleunderline":
        return 21;
      /** @desc bold off */
      case "boldoff":
        return 22;
      /** @desc italics off */
      case "italicoff":
        return 23;
      /** @desc underline off */
      case "underlineoff":
        return 24;
      /** @desc blink off (slow) */
      case "blinkoff":
        return 25;
      /** @desc blink off (rapid) */
      case "blinkrapidoff":
        return 26;
      /** @desc inverse off */
      case "reverseoff":
        return 27;
      /** @desc visible */
      case "visible":
        return 28;
      /** @desc strike through off */
      case "strikethroughoff":
        return 29;
      /** @desc black foreground */
      case "black":
        return back ? 40 : 30;
      /** @desc red foreground */
      case "red":
        return back ? 41 : 31;
      /** @desc green foreground */
      case "green":
        return back ? 42 : 32;
      /** @desc yellow foreground */
      case "yellow":
        return back ? 43 : 33;
      /** @desc blue foreground */
      case "blue":
        return back ? 44 : 34;
      /** @desc magenta foreground */
      case "magenta":
        return back ? 45 : 35;
      /** @desc cyan foreground */
      case "cyan":
        return back ? 46 : 36;
      /** @desc white foreground */
      case "white":
        return back ? 47 : 37;
      /** @desc default */
      case "default":
      case "defaultfore":
        return back ? 49 : 39;
      /** @desc black background */
      case "blackbackground":
        return 40;
      /** @desc red background */
      case "redbackground":
        return 41;
      /** @desc green background */
      case "greenbackground":
        return 42;
      /** @desc yellow background */
      case "yellowbackground":
        return 43;
      /** @desc blue background */
      case "bluebackground":
        return 44;
      /** @desc magenta background */
      case "magentabackground":
        return 45;
      /** @desc cyan background */
      case "cyanbackground":
        return 46;
      /** @desc white background */
      case "whitebackground":
        return 47;
      /** @desc default */
      case "defaultbackground":
      case "defaultback":
        return 49;
      case "overline":
        return 53;
      /** @desc subscript */
      case "subscript":
        return 74;
      /** @desc superscript */
      case "superscript":
        return 73;
      case "subsuperoff":
        return 75;
      // xterm 16 color support
      /** @desc set foreground color to black */
      case "xblack":
        return back ? 100 : 90;
      /** @desc set foreground color to red */
      case "xred":
        return back ? 101 : 91;
      /** @desc set foreground color to green */
      case "xgreen":
        return back ? 102 : 92;
      /** @desc set foreground color to yellow */
      case "xyellow":
        return back ? 103 : 93;
      /** @desc set foreground color to blue */
      case "xblue":
        return back ? 104 : 94;
      /** @desc set foreground color to magenta */
      case "xmagenta":
        return back ? 105 : 95;
      /** @desc set foreground color to cyan */
      case "xcyan":
        return back ? 106 : 96;
      /** @desc set foreground color to white */
      case "xwhite":
        return back ? 107 : 97;
      /** @desc set background color to black */
      case "xblackbackground":
        return 100;
      /** @desc set background color to red */
      case "xredbackground":
        return 101;
      /** @desc set background color to green */
      case "xgreenbackground":
        return 102;
      /** @desc set background color to yellow */
      case "xyellowbackground":
        return 103;
      /** @desc set background color to blue */
      case "xbluebackground":
        return 104;
      /** @desc set background color to magenta */
      case "xmagentabackground":
        return 105;
      /** @desc set background color to cyan */
      case "xcyanbackground":
        return 106;
      /** @desc set background color to white */
      case "xwhitebackground":
        return 107;
    }
    return -1;
  }

  // src/types.ts
  var Size = class {
    constructor(width, height) {
      this.width = 0;
      this.height = 0;
      this.width = width;
      this.height = height;
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
    ["lagMeter", 0, 1, false],
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
    ["mapper.scale", 0, 2, 1],
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
    ["profiles.split", 0, 2, -1],
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
    ["showStatus", 0, 1, true],
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
    ["chat.showTimestamp", 0, 1, false],
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
    ["display.showTimestamp", 0, 1 /* Boolean */, false],
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
    ["simpleEditor", 0, 1 /* Boolean */, false]
  ];
  var Settings = class _Settings {
    constructor() {
      for (var s = 0, sl = SettingList.length; s < sl; s++) {
        if (SettingList[s][2] === 4 /* Custom */) continue;
        this[SettingList[s][0]] = _Settings.getValue(SettingList[s][0]);
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
          case "MapperSplitArea":
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
          return false;
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
          return 1;
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
          return -1;
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
          return true;
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
          return false;
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
          return false;
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
      }
      return null;
    }
  };

  // src/profile.ts
  var TriggerType = /* @__PURE__ */ ((TriggerType2) => {
    TriggerType2[TriggerType2["Regular"] = 0] = "Regular";
    TriggerType2[TriggerType2["CommandInputRegular"] = 1] = "CommandInputRegular";
    TriggerType2[TriggerType2["Event"] = 2] = "Event";
    TriggerType2[TriggerType2["Alarm"] = 3] = "Alarm";
    TriggerType2[TriggerType2["Pattern"] = 8] = "Pattern";
    TriggerType2[TriggerType2["CommandInputPattern"] = 16] = "CommandInputPattern";
    TriggerType2[TriggerType2["Expression"] = 64] = "Expression";
    TriggerType2[TriggerType2["LoopExpression"] = 128] = "LoopExpression";
    return TriggerType2;
  })(TriggerType || {});
  var SubTriggerTypes = /* @__PURE__ */ ((SubTriggerTypes2) => {
    SubTriggerTypes2[SubTriggerTypes2["Skip"] = 512] = "Skip";
    SubTriggerTypes2[SubTriggerTypes2["Wait"] = 1024] = "Wait";
    SubTriggerTypes2[SubTriggerTypes2["LoopPattern"] = 4096] = "LoopPattern";
    SubTriggerTypes2[SubTriggerTypes2["LoopLines"] = 8192] = "LoopLines";
    SubTriggerTypes2[SubTriggerTypes2["Duration"] = 16384] = "Duration";
    SubTriggerTypes2[SubTriggerTypes2["WithinLines"] = 32768] = "WithinLines";
    SubTriggerTypes2[SubTriggerTypes2["Manual"] = 65536] = "Manual";
    SubTriggerTypes2[SubTriggerTypes2["ReParse"] = 131072] = "ReParse";
    SubTriggerTypes2[SubTriggerTypes2["ReParsePattern"] = 262144] = "ReParsePattern";
    return SubTriggerTypes2;
  })(SubTriggerTypes || {});
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
  var Alarm = class _Alarm {
    constructor(data, pattern) {
      this.temp = false;
      this.start = false;
      this.seconds = -1;
      this.secondsWildcard = true;
      this.hours = -1;
      this.hoursWildcard = true;
      this.minutes = -1;
      this.minutesWildcard = true;
      this.suspended = 0;
      this.restart = 0;
      if (typeof data === "string") {
        pattern = data;
        data = 0;
      }
      this.parent = data;
      this.pattern = pattern;
      this.startTime = Date.now();
      this.prevTime = this.startTime;
    }
    static parse(parent, pattern, readOnly) {
      if (typeof parent === "string") {
        pattern = parent;
        parent = 0;
      }
      if (!pattern || pattern.length === 0) {
        if (typeof parent === "object")
          pattern = parent.pattern;
        else
          throw new Error("Blank pattern");
      }
      const t = new _Alarm(parent, pattern);
      while (pattern[0] === "-" || pattern[0] === "+") {
        if (pattern[0] === "-")
          t.start = true;
        else if (pattern[0] === "+")
          t.temp = true;
        pattern = pattern.substr(1);
      }
      if (pattern !== "*") {
        const parts = pattern.split(":");
        let tmp;
        if (parts.length === 0)
          throw new Error("Invalid format: " + pattern);
        if (parts.length === 1) {
          if (parts[0] === "*") {
            t.secondsWildcard = true;
            t.seconds = -1;
          } else {
            if (parts[0][0] === "*") {
              t.secondsWildcard = true;
              parts[0] = parts[0].substr(1);
            } else
              t.secondsWildcard = false;
            tmp = parseInt(parts[0], 10);
            if (isNaN(tmp))
              throw new Error("Invalid Format: " + parts[0]);
            if (tmp < 0)
              throw new Error("Seconds must be greater than or equal to 0.");
            else if (tmp > 59)
              t.secondsWildcard = true;
            t.seconds = tmp;
          }
        } else if (parts.length === 2) {
          if (parts[0] === "*") {
            t.minutesWildcard = true;
            t.minutes = -1;
          } else {
            if (parts[0][0] === "*") {
              t.minutesWildcard = true;
              parts[0] = parts[0].substr(1);
            } else
              t.minutesWildcard = false;
            tmp = parseInt(parts[0], 10);
            if (isNaN(tmp))
              throw new Error("Invalid Format: " + parts[0]);
            if (tmp < 0 || tmp > 59)
              throw new Error("Minutes can only be 0 to 59");
            t.minutes = tmp;
          }
          if (parts[1] === "*") {
            t.secondsWildcard = true;
            t.seconds = -1;
          } else {
            if (parts[1][0] === "*") {
              t.secondsWildcard = true;
              parts[1] = parts[1].substr(1);
            } else
              t.secondsWildcard = false;
            tmp = parseInt(parts[1], 10);
            if (isNaN(tmp))
              throw new Error("Invalid Format: " + parts[1]);
            if (tmp < 0 || tmp > 59)
              throw new Error("Seconds can only be 0 to 59");
            t.seconds = tmp;
          }
        } else {
          if (parts[0] === "*") {
            t.hoursWildcard = true;
            t.hours = -1;
          } else {
            if (parts[0][0] === "*") {
              t.hoursWildcard = true;
              parts[0] = parts[0].substr(1);
            } else
              t.hoursWildcard = false;
            tmp = parseInt(parts[0], 10);
            if (isNaN(tmp))
              throw new Error("Invalid Format: " + parts[0]);
            if (tmp < 0 || tmp > 23)
              throw new Error("Hours can only be 0 to 23");
            t.hours = tmp;
          }
          if (parts[1] === "*") {
            t.minutesWildcard = true;
            t.seconds = -1;
          } else {
            if (parts[1][0] === "*") {
              t.minutesWildcard = true;
              parts[1] = parts[1].substr(1);
            } else
              t.minutesWildcard = false;
            tmp = parseInt(parts[1], 10);
            if (isNaN(tmp))
              throw new Error("Invalid Format: " + parts[1]);
            if (tmp < 0 || tmp > 59)
              throw new Error("Minutes can only be 0 to 59");
            t.minutes = tmp;
          }
          if (parts[2] === "*") {
            t.secondsWildcard = true;
            t.seconds = -1;
          } else {
            if (parts[2][0] === "*") {
              t.secondsWildcard = true;
              parts[2] = parts[2].substr(2);
            } else
              t.secondsWildcard = false;
            tmp = parseInt(parts[2], 10);
            if (isNaN(tmp))
              throw new Error("Invalid Format: " + parts[2]);
            if (tmp < 0 || tmp > 59)
              throw new Error("Seconds can only be 0 to 59");
            t.seconds = tmp;
          }
        }
      }
      if (readOnly)
        t.temp = false;
      return t;
    }
    setTempTime(value) {
      if (!value)
        this.tempTime = 0;
      else
        this.tempTime = Date.now() + value;
    }
  };
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
  var Variable = class _Variable extends Item {
    constructor(data, profile) {
      super(data);
      this._type = "string";
      this.type = 1 /* Auto */;
      this.defaultValue = "";
      this.useDefault = false;
      this.params = "";
      this.profile = profile;
      if (this.useDefault)
        this.setValue(this.defaultValue);
    }
    set setValue(value) {
      switch (this.type) {
        case 2 /* Integer */:
          if (typeof value === "string") {
            value = parseInt(value, 10);
            if (isNaN(value))
              value = 0;
          } else if (typeof value === "boolean")
            value = value ? 1 : 0;
          break;
        case 7 /* Float */:
          if (typeof value === "string") {
            value = parseFloat(value);
            if (isNaN(value))
              value = 0;
          } else if (typeof value === "boolean")
            value = value ? 1 : 0;
          break;
      }
      this.value = value;
      this._type = typeof value;
    }
    get getValue() {
      switch (this.type) {
        case 1 /* Auto */:
          if (typeof this.value !== this._type) {
            switch (this._type) {
              case "number":
                return Number(this.value);
              case "string":
                return this.value.toString();
              case "boolean":
                return Boolean(this.value);
            }
          }
          return this.value;
        case 7 /* Float */:
          return parseFloat(this.value);
        case 2 /* Integer */:
          return parseInt(this.value, 10);
        case 6 /* Record */:
          if (typeof this.value === "string")
            try {
              return JSON.parse(this.value);
            } catch {
              return this.value;
            }
          return this.value;
        case 5 /* StringList */:
          if (typeof this.value === "string")
            return splitQuoted(this.value, "|");
          return this.value;
      }
      return this.value;
    }
    clone() {
      return new _Variable(this);
    }
    toString() {
      switch (this.type) {
        case 6 /* Record */:
          if (typeof this.value === "string")
            return this.value;
          return JSON.stringify(this.value);
        case 5 /* StringList */:
          if (typeof this.value === "string")
            return this.value;
          return '"' + this.value.join('"|"') + '"';
      }
      return this.value?.toString();
    }
  };
  var Profile = class _Profile {
    constructor(name2, defaults) {
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
      if (typeof name2 === "string") {
        this.name = name2;
        this.file = name2.toLowerCase();
        if (defaults == null || defaults)
          this.macros = _Profile.DefaultMacros;
      } else if (typeof name2 === "boolean") {
        if (name2)
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
    clone(version2) {
      let data;
      let i;
      let il;
      if (version2 === 2) {
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
      data = clone(this);
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
          const item = data.contexts[i].clone();
          item.profile = profile;
          profile.contexts.push(item);
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
  var ProfileCollection = class _ProfileCollection {
    constructor(defaultProfile) {
      this.items = {};
      this.keys = [];
      this.add(defaultProfile == null ? Profile.Default : defaultProfile);
    }
    SortByPriority() {
      this.keys.sort((a, b) => {
        let ap = this.items[a].priority;
        let bp = this.items[b].priority;
        if (ap > bp)
          return -1;
        if (ap < bp)
          return 1;
        ap = this.items[a].name;
        bp = this.items[b].name;
        if (ap === "default")
          return -1;
        if (bp === "default")
          return 1;
        if (ap > bp)
          return -1;
        if (ap < bp)
          return 1;
        return 0;
      });
    }
    enabled(profile) {
      if (!profile || this.keys.length === 0) return false;
      if (typeof profile === "string") {
        if (!this.items[profile.toLowerCase()])
          return false;
        return this.items[profile.toLowerCase()].enabled;
      }
      return this.items[profile.name.toLowerCase()] ? this.items[profile.name.toLowerCase()].enabled : false;
    }
    contains(profile) {
      if (!profile || this.keys.length === 0) return false;
      if (typeof profile === "string")
        return this.items[profile.toLowerCase()] ? true : false;
      return this.items[profile.name.toLowerCase()] ? true : false;
    }
    canDisable(profile) {
      if (!profile || this.keys.length === 0) return false;
      let idx;
      if (typeof profile === "number") {
        if (profile < 0)
          return false;
        if (profile >= this.keys.length)
          return false;
        idx = this.keys[profile];
      } else if (typeof profile === "object")
        idx = profile.name.toLowerCase();
      else if (typeof profile === "string")
        idx = profile.toLowerCase();
      else
        return false;
      if (!this.items[idx]) return false;
      const e = !this.items[idx].enabled;
      if (!e) {
        let c = false;
        for (const key in this.items) {
          if (key === idx) continue;
          if (this.items[key].enabled) c = true;
          break;
        }
        if (!c)
          return false;
      }
      return true;
    }
    toggle(profile) {
      if (!profile || this.keys.length === 0) return false;
      let idx;
      if (typeof profile === "number") {
        if (profile < 0)
          return false;
        if (profile >= this.keys.length)
          return false;
        idx = this.keys[profile];
      } else if (typeof profile === "object")
        idx = profile.name.toLowerCase();
      else if (typeof profile === "string")
        idx = profile.toLowerCase();
      else
        return false;
      if (!this.items[idx]) return false;
      const e = !this.items[idx].enabled;
      if (!e) {
        let c = false;
        for (const key in this.items) {
          if (key === idx) continue;
          if (this.items[key].enabled) c = true;
          break;
        }
        if (!c)
          return false;
      }
      this.items[idx].enabled = e;
      return true;
    }
    update() {
      this.keys = Object.keys(this.items);
      this.SortByPriority();
    }
    add(profile) {
      if (!profile)
        return;
      this.items[profile.name.toLowerCase()] = profile;
      this.update();
    }
    remove(profile) {
      if (!profile || this.keys.length === 0) return;
      if (typeof profile === "string")
        delete this.items[profile.toLowerCase()];
      else if (typeof profile === "number") {
        if (profile < 0 || profile >= this.keys.length) return;
        delete this.items[this.keys[profile]];
      } else
        delete this.items[profile.name.toLowerCase()];
      this.update();
    }
    copy(profile) {
      if (!profile) return clone(this.items);
      if (this.keys.length === 0)
        return null;
      if (typeof profile === "string") {
        if (!this.items[profile.toLowerCase()])
          return null;
        return this.items[profile.toLowerCase()].clone();
      }
      if (typeof profile === "number") {
        if (profile < 0 || profile >= this.keys.length) return null;
        return this.items[this.keys[profile]].clone();
      }
      return profile.clone();
    }
    clone(version2) {
      if (version2 === 2) {
        const profiles = {};
        for (const p in this.items)
          profiles[this.items[p].name] = this.items[p].clone(2);
        return profiles;
      }
      const pc = new _ProfileCollection();
      for (const p in this.items)
        pc.items[this.items[p].name] = this.items[p].clone();
      pc.update();
      return pc;
    }
    load(key) {
      return new Promise((resolve, reject) => {
        localforage.getItem(key || "OoMUDProfiles").then((value) => {
          if (typeof value === "string")
            value = JSON.parse(value);
          if (!value)
            this.add(Profile.Default);
          else {
            const keys = Object.keys(value);
            let k = 0;
            let kl = keys.length;
            for (; k < kl; k++) {
              this.add(Profile.load(value[keys[k]]));
            }
          }
          resolve(this);
        }).catch(reject);
      });
    }
    save(key) {
      localforage.setItem(key || "OoMUDProfiles", JSON.stringify(this.items, (key2, value) => {
        if (key2 === "profile") return void 0;
        return value;
      }));
    }
    get length() {
      return this.keys.length;
    }
    count() {
      return this.keys.length;
    }
    get active() {
      const keys = this.keys;
      if (keys.length === 0) {
        this.add(Profile.Default);
        return this.items["default"];
      }
      if (keys.length === 1) {
        if (this.items[keys[0]].enabled)
          return this.items[keys[0]];
        if (this.items[keys[0]].name === "Default") {
          this.items[keys[0]].enable = true;
          return this.items["default"];
        }
        this.add(Profile.Default);
        return this.items["default"];
      }
      for (const key in keys) {
        if (this.items[key].enabled)
          return this.items[key];
      }
      if (this.items["default"]) {
        this.items["default"].enabled = true;
        return this.items["default"];
      }
      this.add(Profile.Default);
      return this.items["default"];
    }
    get aliases() {
      const keys = this.keys;
      let tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.items[keys[0]].enabled || !this.items[keys[0]].enableAliases)
          return [];
        return this.items[keys[0]].aliases;
      }
      for (; k < kl; k++) {
        if (!this.items[keys[k]].enabled || !this.items[keys[k]].enableAliases || this.items[keys[k]].aliases.length === 0)
          continue;
        tmp = tmp.concat(this.items[keys[k]].aliases);
      }
      return tmp;
    }
    get triggers() {
      const keys = this.keys;
      let tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.items[keys[0]].enabled || !this.items[keys[0]].enableTriggers)
          return [];
        return this.items[keys[0]].triggers;
      }
      for (; k < kl; k++) {
        if (!this.items[keys[k]].enabled || !this.items[keys[k]].enableTriggers || this.items[keys[k]].triggers.length === 0)
          continue;
        tmp = tmp.concat(this.items[keys[k]].triggers);
      }
      return tmp;
    }
    get macros() {
      const keys = this.keys;
      let tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.items[keys[0]].enabled || !this.items[keys[0]].enableMacros)
          return [];
        return this.items[keys[0]].macros;
      }
      for (; k < kl; k++) {
        if (!this.items[keys[k]].enabled || !this.items[keys[k]].enableMacros || this.items[keys[k]].macros.length === 0)
          continue;
        tmp = tmp.concat(this.items[keys[k]].macros);
      }
      return tmp;
    }
    get buttons() {
      const keys = this.keys;
      let tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.items[keys[0]].enabled || !this.items[keys[0]].enableButtons)
          return [];
        return this.items[keys[0]].buttons;
      }
      for (; k < kl; k++) {
        if (!this.items[keys[k]].enabled || !this.items[keys[k]].enableButtons || this.items[keys[k]].buttons.length === 0)
          continue;
        tmp = tmp.concat(this.items[keys[k]].buttons);
      }
      return tmp;
    }
    get contexts() {
      const keys = this.keys;
      let tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.items[keys[0]].enabled || !this.items[keys[0]].enableContexts)
          return [];
        return this.items[keys[0]].contexts;
      }
      for (; k < kl; k++) {
        if (!this.items[keys[k]].enabled || !this.items[keys[k]].enableContexts || this.items[keys[k]].contexts.length === 0)
          continue;
        tmp = tmp.concat(this.items[keys[k]].contexts);
      }
      return tmp;
    }
    get defaultContext() {
      const keys = this.keys;
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return true;
      if (kl === 1) {
        if (!this.items[keys[0]].enabled)
          return true;
        return this.items[keys[0]].enableDefaultContext;
      }
      for (; k < kl; k++) {
        if (!this.items[keys[k]].enabled)
          continue;
        if (!this.items[keys[k]].enableDefaultContext)
          return false;
      }
      return true;
    }
  };
  function convertPattern(pattern, client) {
    if (!pattern || !pattern.length) return "";
    let convertPatternState;
    ((convertPatternState2) => {
      convertPatternState2[convertPatternState2["None"] = 0] = "None";
      convertPatternState2[convertPatternState2["Ampersand"] = 1] = "Ampersand";
      convertPatternState2[convertPatternState2["Percent"] = 2] = "Percent";
      convertPatternState2[convertPatternState2["StringMatch"] = 3] = "StringMatch";
      convertPatternState2[convertPatternState2["SubPattern"] = 4] = "SubPattern";
      convertPatternState2[convertPatternState2["AmpersandPercent"] = 5] = "AmpersandPercent";
      convertPatternState2[convertPatternState2["AmpersandPattern"] = 6] = "AmpersandPattern";
      convertPatternState2[convertPatternState2["AmpersandRange"] = 7] = "AmpersandRange";
      convertPatternState2[convertPatternState2["PercentRegex"] = 8] = "PercentRegex";
      convertPatternState2[convertPatternState2["Escape"] = 9] = "Escape";
      convertPatternState2[convertPatternState2["Variable"] = 10] = "Variable";
    })(convertPatternState || (convertPatternState = {}));
    let state = 0 /* None */;
    let stringBuilder = [];
    let idx = 0;
    let tl = pattern.length;
    let c;
    let i;
    let arg;
    let pat;
    let nest = 0;
    for (idx = 0; idx < tl; idx++) {
      c = pattern.charAt(idx);
      i = pattern.charCodeAt(idx);
      switch (state) {
        case 1 /* Ampersand */:
          if (arg.length === 0 && (c === "*" || c === "?" || c === "^" || c === "$"))
            pat = c;
          else if (arg.length === 0 && c === "%")
            state = 5 /* AmpersandPercent */;
          else if (pat.length === 0 && c === "(") {
            pat = c;
            state = 6 /* AmpersandPattern */;
          } else if (pat.length === 0 && c === "[") {
            pat = c;
            state = 7 /* AmpersandRange */;
          } else if (c === "{")
            continue;
          else if (c === "}" || !(i >= 48 && i <= 57 || i >= 65 && i <= 90 || i >= 97 && i <= 122 || i === 95 || i === 36)) {
            if (!isValidIdentifier(arg))
              throw new Error("Invalid variable name");
            if (!pat.length && /^\d+$/.exec(arg))
              stringBuilder.push("{", arg, "}");
            else if (!pat.length)
              stringBuilder.push("(?<", arg, ">.*)");
            else
              stringBuilder.push("(?<", arg, ">", convertPattern(pat), ")");
            if (c !== "}")
              idx--;
            state = 0 /* None */;
          } else
            arg += c;
          break;
        case 5 /* AmpersandPercent */:
          pat += "%" + c;
          state = 1 /* Ampersand */;
          break;
        case 6 /* AmpersandPattern */:
          pat += c;
          if (c === ")")
            state = 1 /* Ampersand */;
          break;
        case 7 /* AmpersandRange */:
          pat += c;
          if (c === "]")
            state = 1 /* Ampersand */;
          break;
        case 2 /* Percent */:
          switch (c) {
            case "d":
              stringBuilder.push("\\d+");
              state = 0 /* None */;
              break;
            case "n":
              stringBuilder.push("[+-]?\\d+");
              state = 0 /* None */;
              break;
            case "w":
              stringBuilder.push("\\w");
              state = 0 /* None */;
              break;
            case "a":
              stringBuilder.push("[a-zA-Z0-9]*");
              state = 0 /* None */;
              break;
            case "s":
              stringBuilder.push("\\s*");
              state = 0 /* None */;
              break;
            case "x":
              stringBuilder.push("\\S*");
              state = 0 /* None */;
              break;
            case "y":
              stringBuilder.push("\\S*");
              state = 0 /* None */;
              break;
            case "p":
              stringBuilder.push(`[\\.\\?\\!\\:\\;\\-\\\u2014\\(\\)\\[\\]\\'\\"\\\\/\\,]{1}`);
              state = 0 /* None */;
              break;
            case "q":
              stringBuilder.push(`[\\.\\?\\!\\:\\;\\-\\\u2014\\(\\)\\[\\]\\'\\"\\\\/\\,]{1}`);
              state = 0 /* None */;
              break;
            case "t":
              state = 0 /* None */;
              break;
            case "e":
              stringBuilder.push("\x1B");
              state = 0 /* None */;
              break;
            case "/":
              state = 8 /* PercentRegex */;
              arg = "";
              break;
          }
          break;
        case 8 /* PercentRegex */:
          if (c === "%") {
            if (!arg.endsWith("/"))
              throw new Error("Invalid %/regex/% pattern");
            stringBuilder.push(arg.substr(0, arg.length - 1));
          } else
            arg += c;
          break;
        case 3 /* StringMatch */:
          if (c === "^" && arg.length === 0)
            pat = true;
          else if (c === "}") {
            if (pat)
              stringBuilder.push("[^", arg, "]");
            else
              stringBuilder.push(arg);
            state = 0 /* None */;
          } else
            arg += c;
          break;
        case 4 /* SubPattern */:
          if (c === ":") {
            stringBuilder.push("(?<", arg, ">");
            state = 0 /* None */;
          } else if (c === ")") {
            stringBuilder.push("(", convertPattern(arg), ")");
            state = 0 /* None */;
            nest--;
          } else
            arg += c;
          break;
        case 9 /* Escape */:
          stringBuilder.push("\\", c);
          state = 0 /* None */;
          break;
        case 10 /* Variable */:
          if (c === "{" && arg.length === 0)
            continue;
          else if (c === "}" || !(i >= 48 && i <= 57 || i >= 65 && i <= 90 || i >= 97 && i <= 122 || i === 95 || i === 36)) {
            if (!isValidIdentifier(arg))
              throw new Error("Invalid variable name");
            if (client) {
              if (client.variables[arg] instanceof Variable)
                stringBuilder.push(client.variables[arg].value || "");
              else
                stringBuilder.push(client.variables[arg] || "");
            }
            if (c !== "}")
              idx--;
            state = 0 /* None */;
          } else
            arg += c;
          break;
        default:
          if (c === "*")
            stringBuilder.push(".*");
          else if (c === "?")
            stringBuilder.push(".");
          else if (c === "~")
            state = 9 /* Escape */;
          else if (c === "@") {
            state = 10 /* Variable */;
            arg = "";
          } else if (c === "&") {
            arg = "";
            pat = "";
            state = 1 /* Ampersand */;
          } else if (c === "%")
            state = 2 /* Percent */;
          else if (c === "{") {
            state = 3 /* StringMatch */;
            arg = "";
          } else if (c === "(") {
            state = 4 /* SubPattern */;
            arg = "";
            nest++;
          } else {
            if (c === ")")
              nest--;
            stringBuilder.push(c);
          }
          break;
      }
    }
    switch (state) {
      case 1 /* Ampersand */:
        if (!isValidIdentifier(arg))
          throw new Error("Invalid variable name");
        if (!pat.length && /^\d+$/.exec(arg))
          stringBuilder.push("{", arg, "}");
        else if (!pat.length)
          stringBuilder.push("(?<", arg, ">.*)");
        else
          stringBuilder.push("(?<", arg, ">", convertPattern(pat), ")");
        break;
      case 5 /* AmpersandPercent */:
      case 6 /* AmpersandPattern */:
      case 7 /* AmpersandRange */:
        throw new Error("Invalid &VarName pattern");
      case 2 /* Percent */:
        throw new Error("Invalid % pattern");
      case 8 /* PercentRegex */:
        throw new Error("Invalid %/regex/% pattern");
      case 3 /* StringMatch */:
        throw new Error("Invalid string match pattern");
      case 4 /* SubPattern */:
        throw new Error("Invalid (sub:pattern) pattern");
      case 9 /* Escape */:
        throw new Error("Invalid escape pattern");
      case 10 /* Variable */:
        if (!isValidIdentifier(arg))
          throw new Error("Invalid variable name");
        if (client) {
          if (client.variables[arg] instanceof Variable)
            stringBuilder.push(client.variables[arg].getValue() || "");
          else
            stringBuilder.push(client.variables[arg] || "");
        }
        break;
    }
    if (nest)
      throw new Error("Invalid save matched pattern");
    return stringBuilder.join("");
  }

  // src/input.ts
  var mathjs;
  var _mathjs;
  var WindowVariables = ["$selectedword", "$selword", "$selectedurl", "$selurl", "$selectedline", "$selline", "$selected", "$character", "$copied", "$action", "$trigger", "$caption", "$characterid"];
  function ProperCase(str) {
    return str.replace(/\w*\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  function fudgeDice() {
    switch (~~(Math.random() * 6) + 1) {
      case 1:
      case 4:
        return -1;
      case 3:
      case 2:
        return 1;
    }
    return 0;
  }
  var Input = class extends EventEmitter {
    constructor(client) {
      super();
      this._historyIdx = -1;
      this._tabIdx = -1;
      this._tabWords = null;
      this._locked = 0;
      this._TriggerCache = null;
      this._TriggerStates = {};
      this._TriggerFunctionCache = {};
      this._TriggerRegExCache = {};
      this._LastTriggered = "";
      this._LastTrigger = null;
      this._scrollLock = false;
      this._gag = 0;
      this._gagID = [];
      this._gags = [];
      this._stack = [];
      this._vStack = [];
      this._controllers = {};
      this._controllersCount = 0;
      this._gamepadCaches = null;
      this._lastSuspend = -1;
      this._MacroCache = {};
      this._loops = [];
      this._pathQueue = [];
      this._pathTimeout = null;
      this._pathPaused = false;
      this.client = null;
      this.enableParsing = true;
      this.enableTriggers = true;
      if (!client)
        throw new Error("Invalid client!");
      this.client = client;
      mathjs = () => {
        if (_mathjs) return _mathjs;
        this.initMathJS();
        return _mathjs;
      };
      this._commandHistory = [];
      document.addEventListener("keydown", (event) => {
        if (!this.isLocked && this.ProcessMacros(event.which, event.altKey, event.ctrlKey, event.shiftKey, event.metaKey)) {
          event.preventDefault();
          event.stopPropagation();
        } else if (event.key === "ScrollLock")
          this.toggleScrollLock();
      });
      this.client.on("parse-command", (data) => {
        if (this.client.getOption("parseCommands"))
          data.value = this.parseOutgoing(data.value, null, null, null, null, !data.comments);
      });
      this.client.on("add-line", (data) => {
        this.ExecuteTriggers(4 /* Regular */ | 8 /* Pattern */ | 128 /* LoopExpression */, data.line, data.raw, data.fragment, false, true);
        if (this._gag > 0 && !data.fragment) {
          data.gagged = true;
          this._gag--;
        }
        if (!data.fragment)
          for (let state in this._TriggerStates) {
            if (this._TriggerStates[state].lineCount)
              this._TriggerStates[state].lineCount--;
          }
      });
      this.client.on("options-loaded", () => {
        if (!_mathjs && this.client.getOption("initializeScriptEngineOnLoad"))
          this.initMathJS();
        this.initPads();
      });
      this.client.commandInput.addEventListener("keyup", (event) => {
        if (event.key !== "Escape" && event.key !== "ArrowUp" && event.key !== "ArrowDown")
          this._historyIdx = this._commandHistory.length;
      });
      this.client.commandInput.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "Escape":
            if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
            this.client.commandInput.blur();
            this.client.commandInput.value = "";
            this.client.commandInput.select();
            this._historyIdx = this._commandHistory.length;
            this._tabIdx = -1;
            this._tabWords = null;
            this._tabSearch = null;
            this.emit("history-navigate", event);
            break;
          case "ArrowUp":
            if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
            if (this._historyIdx === this._commandHistory.length && this.client.commandInput.value.length > 0) {
              this.AddCommandToHistory(this.client.commandInput.value);
              if (this.client.commandInput.value === this._commandHistory[this._historyIdx - 1])
                this._historyIdx--;
            }
            this._historyIdx--;
            if (this._historyIdx < 0)
              this._historyIdx = 0;
            if (this._commandHistory.length < 0) {
              this._historyIdx = -1;
              this.client.commandInput.value = "";
            } else if (this._commandHistory.length > 0 && this._historyIdx < this._commandHistory.length && this._historyIdx >= 0) {
              this.client.commandInput.value = this._commandHistory[this._historyIdx];
            }
            setTimeout(() => this.client.commandInput.select(), 0);
            this.emit("history-navigate", event);
            break;
          case "ArrowDown":
            if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
            if (this._historyIdx === this._commandHistory.length && this.client.commandInput.value.length > 0)
              this.AddCommandToHistory(this.client.commandInput.value);
            this._historyIdx++;
            if (this._historyIdx >= this._commandHistory.length || this._commandHistory.length < 1) {
              this._historyIdx = this._commandHistory.length;
              this.client.commandInput.value = "";
            } else if (this._commandHistory.length > 0 && this._historyIdx < this._commandHistory.length && this._historyIdx >= 0) {
              this.client.commandInput.value = this._commandHistory[this._historyIdx];
            }
            setTimeout(() => this.client.commandInput.select(), 0);
            this.emit("history-navigate", event);
            break;
          case "Enter":
            switch (this.client.getOption("newlineShortcut")) {
              case 1 /* Ctrl */:
                if (event.ctrlKey && !event.shiftKey && !event.metaKey && !event.altKey) {
                  insertValue(this.client.commandInput, "\n");
                  this.emit("history-navigate", event);
                  this.client.commandInput.blur();
                  this.client.commandInput.focus();
                  return true;
                }
                break;
              case 8 /* CtrlAndShift */:
                if (event.ctrlKey && event.shiftKey && !event.metaKey && !event.altKey) {
                  insertValue(this.client.commandInput, "\n");
                  this.emit("history-navigate", event);
                  this.client.commandInput.blur();
                  this.client.commandInput.focus();
                  return true;
                }
                break;
              case 4 /* CtrlOrShift */:
                if ((event.ctrlKey || event.shiftKey) && !event.metaKey && !event.altKey) {
                  insertValue(this.client.commandInput, "\n");
                  this.emit("history-navigate", event);
                  this.client.commandInput.blur();
                  this.client.commandInput.focus();
                  return true;
                }
                break;
              case 2 /* Shift */:
                if (event.ctrlKey && event.shiftKey && !event.metaKey && !event.altKey) {
                  insertValue(this.client.commandInput, "\n");
                  this.emit("history-navigate", event);
                  this.client.commandInput.blur();
                  this.client.commandInput.focus();
                  return true;
                }
                break;
            }
            if (!event.ctrlKey && !event.shiftKey && !event.metaKey && !event.altKey) {
              this._tabIdx = -1;
              this._tabWords = null;
              this._tabSearch = null;
              event.preventDefault();
              this.client.sendCommand(null, null, this.client.getOption("allowCommentsFromCommand"));
              this.emit("history-navigate", event);
            }
            break;
          case "Tab":
            if (!this.client.getOption("enableTabCompletion") || this.client.commandInput.value.length === 0) return;
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.shiftKey)
              this._tabIdx--;
            else
              this._tabIdx++;
            let start = this.client.commandInput.selectionStart;
            let end = this.client.commandInput.selectionEnd;
            if (this._tabWords === null) {
              const cursorPos = getCursor(this.client.commandInput);
              let endPos = this.client.commandInput.value.indexOf(" ", cursorPos);
              if (endPos === -1)
                endPos = this.client.commandInput.value.indexOf("\n", cursorPos);
              let startPos = this.client.commandInput.value.lastIndexOf(" ", cursorPos - 1);
              if (startPos === -1)
                startPos = this.client.commandInput.value.indexOf("\n", cursorPos - 1);
              if (endPos === -1)
                endPos = this.client.commandInput.value.length;
              if (startPos === -1)
                startPos = 0;
              else
                startPos++;
              start = startPos;
              end = endPos;
              if (start === end)
                end++;
              const findStr = this.client.commandInput.value.substring(startPos, endPos);
              if (findStr.length === 0) return;
              this._tabSearch = { start: startPos, end: endPos, find: findStr.length };
              const regSearch = new RegExp(`^${findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, this.client.getOption("ignoreCaseTabCompletion") ? "i" : "");
              if (this.client.getOption("tabCompletionLookupType") === 8 /* List */)
                this._tabWords = [...new Set(this.client.getOption("tabCompletionList").split(/\s+/).filter((word) => word.match(regSearch)))];
              else {
                this._tabWords = [].concat(...this.client.display.lines.slice(this.client.display.lines.length - this.client.getOption("tabCompletionBufferLimit")).map((line) => line.text.split(/\s+/))).filter((word) => word.match(regSearch)).reverse();
                if (this.client.getOption("tabCompletionLookupType") === 1 /* PrependBuffer */)
                  this._tabWords = [...new Set(this.client.getOption("tabCompletionList").split(/\s+/).filter((word) => word.match(regSearch)).reverse())].concat(this._tabWords);
                else if (this.client.getOption("tabCompletionLookupType") === 2 /* AppendBuffer */)
                  this._tabWords = this._tabWords.concat([...new Set(this.client.getOption("tabCompletionList").split(/\s+/).filter((word) => word.match(regSearch)).reverse())]);
                this._tabWords = [...new Set(this._tabWords)];
              }
            } else
              start -= this._tabSearch.find;
            if (this._tabWords.length === 0) return;
            if (this._tabIdx < 0) this._tabIdx = this._tabWords.length - 1;
            if (this._tabIdx >= this._tabWords.length) this._tabIdx = 0;
            const tabCasing = this.client.getOption("tabCompletionReplaceCasing");
            this.client.commandInput.value = this.client.commandInput.value.substring(0, start) + (tabCasing === 1 ? this._tabWords[this._tabIdx].toLowerCase() : tabCasing === 2 ? this._tabWords[this._tabIdx].toUpperCase() : this._tabWords[this._tabIdx]) + this.client.commandInput.value.substring(end, this.client.commandInput.value.length);
            this.client.commandInput.selectionStart = this._tabSearch.start + this._tabSearch.find;
            this.client.commandInput.selectionEnd = this._tabSearch.start + this._tabWords[this._tabIdx].length;
            event.preventDefault();
            this.emit("history-navigate", event);
            break;
          case "Shift":
          case "Control":
          case "Meta":
          case "Alt":
          case "CapsLock":
          case "Fn":
          case "NumLock":
          case "ScrollLock":
          case "Super":
          case "PageDown":
          case "PageUp":
          case "End":
          case "Home":
          case "ArrowLeft":
          case "ArrowRight":
          case "ContextMenu":
            break;
          default:
            this._tabIdx = -1;
            this._tabWords = null;
            this._tabSearch = null;
            break;
        }
      });
      this.client.commandInput.addEventListener("mouseup", (event) => {
        this._tabIdx = -1;
        this._tabWords = null;
        this._tabSearch = null;
      });
      window.addEventListener("gamepadconnected", (e) => {
        if (!this.client.getOption("gamepads")) return;
        if (!this._gamepadCaches)
          this._gamepadCaches = [];
        this._controllers[e.gamepad.index] = { pad: e.gamepad, axes: clone(e.gamepad.axes), state: { axes: [], buttons: [] }, pState: { axes: [], buttons: [] } };
        this._controllersCount++;
        this.updatePads();
      });
      window.addEventListener("gamepaddisconnected", (e) => {
        if (!this.client.getOption("gamepads")) return;
        delete this._controllers[e.gamepad.index];
        this._controllersCount--;
      });
      this.initPads();
    }
    getScope() {
      let scope = {};
      Object.assign(scope, this.client.variables);
      WindowVariables.forEach((a) => {
        scope[a] = window[a];
        scope[a.substr(1)] = window[a];
      });
      if (this._stack.length === 0)
        return scope;
      if (!this.stack.named && !this.loops.length)
        return scope;
      if (this.stack.named)
        Object.assign(scope, this.stack.named);
      if (this.loops.length) {
        scope.repeatnum = this.repeatnum;
        const ll = this.loops.length;
        for (let l = 0; l < ll && l < 18; l++)
          scope[String.fromCharCode(105 + l)] = this.loops[l];
      }
      return scope;
    }
    setScope(scope) {
      if (scope === this.client.variables) return;
      const ll = this.loops.length;
      for (const name2 in scope) {
        if (!Object.prototype.hasOwnProperty.call(scope, name2) || name2 === "i" || name2 === "repeatnum")
          continue;
        if (WindowVariables.indexOf(name2) !== -1 || WindowVariables.indexOf("$" + name2) !== -1)
          continue;
        switch (name2) {
          case "clientid":
            continue;
        }
        if (name2.length === 1 && ll && name2.charCodeAt(0) >= 105 && name2.charCodeAt(0) < 105 + ll)
          continue;
        if (this.stack.named && Object.prototype.hasOwnProperty.call(this.stack.named, name2))
          continue;
        this.client.variables[name2] = scope[name2];
      }
    }
    evaluate(expression) {
      let scope = this.getScope();
      let results = mathjs().evaluate(expression, scope);
      this.setScope(scope);
      return results;
    }
    get stack() {
      if (this._stack.length === 0)
        this._stack.push({ args: 0, named: 0, used: 0, append: false });
      return this._stack[this._stack.length - 1];
    }
    get repeatnum() {
      if (this.loops.length === 0)
        return 0;
      return this.loops[this.loops.length - 1];
    }
    get loops() {
      if (this._stack.length === 0 || !this.stack.hasOwnProperty("loops"))
        return this._loops;
      return this.stack.loops;
    }
    get regex() {
      let sl = this._stack.length;
      if (sl === 0)
        return null;
      while (sl >= 0) {
        sl--;
        if (this._stack[sl].hasOwnProperty("regex"))
          return this._stack[sl].regex;
      }
      return null;
    }
    get indices() {
      let sl = this._stack.length;
      if (sl === 0)
        return [];
      while (sl >= 0) {
        sl--;
        if (this._stack[sl].hasOwnProperty("indices"))
          return this._stack[sl].indices;
      }
      return [];
    }
    get vStack() {
      if (this._vStack.length === 0)
        return {};
      return this._vStack[this._vStack.length - 1];
    }
    vStackPush(obj) {
      this._vStack.push(obj);
    }
    vStackPop() {
      this._vStack.pop();
    }
    get scrollLock() {
      return this._scrollLock;
    }
    set scrollLock(locked) {
      if (locked !== this._scrollLock) {
        this._scrollLock = locked;
        this.emit("scroll-lock", this.scrollLock);
      }
    }
    get lastTriggerExecuted() {
      return this._LastTrigger;
    }
    get lastTriggered() {
      return this._LastTriggered;
    }
    set lastTriggered(value) {
      this._LastTriggered = value;
    }
    getDiceArguments(arg, scope, fun) {
      let res = /(\d+)\s*?d(F|f|%|\d+)(\s*?[-|+|*|\/]?\s*?\d+)?/g.exec(arg.toString());
      if (!res || res.length < 3) {
        res = /(\d+)\s*?d\s*?\/\s*?(100)(\s*?[-|+|*|\/]?\s*?\d+)?/g.exec(arg.toString());
        if (!res || res.length < 3) {
          arg = arg.compile().evaluate(scope);
          res = /(\d+)\s*?d(F|f|%|\d+)(\s*?[-|+|*|\/]?\s*?\d+)?/g.exec(arg.toString());
          if (!res || res.length < 3) {
            res = /(\d+)\s*?d\s*?\/\s*?(100)(\s*?[-|+|*|\/]?\s*?\d+)?/g.exec(arg.toString());
            if (!res || res.length < 3)
              throw new Error("Invalid dice for " + (fun || "dice"));
            res[2] = "%";
          }
        } else
          res[2] = "%";
      }
      return res;
    }
    initMathJS() {
      _mathjs = math;
      const functions = {
        esc: "\x1B",
        cr: "\n",
        lf: "\r",
        crlf: "\r\n",
        diceavg: (args, math2, scope) => {
          let res;
          let c;
          let sides;
          let mod;
          let min;
          let max;
          if (args.length === 0) throw new Error("Invalid arguments for diceavg");
          if (args.length === 1) {
            res = this.getDiceArguments(args[0], scope, "diceavg");
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = args[0].compile().evaluate(scope);
            sides = args[1].toString().trim();
            if (sides !== "F" && sides !== "%")
              sides = args[1].compile().evaluate(scope);
            if (args.length > 2)
              mod = args[2].compile().evaluate(scope);
          } else
            throw new Error("Too many arguments for diceavg");
          min = 1;
          if (sides === "F" || sides === "f") {
            min = -1;
            max = 1;
          } else if (sides === "%") {
            max = 1;
            min = 0;
          } else
            max = parseInt(sides);
          if (mod)
            return math2.evaluate((min + max) / 2 * c + mod, scope);
          return (min + max) / 2 * c;
        },
        dicemin: (args, math2, scope) => {
          let res;
          let c;
          let sides;
          let mod;
          let min;
          if (args.length === 0) throw new Error("Invalid arguments for dicemin");
          if (args.length === 1) {
            res = res = this.getDiceArguments(args[0], scope, "dicemin");
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = args[0].compile().evaluate(scope);
            sides = args[1].toString().trim();
            if (sides !== "F" && sides !== "%")
              sides = args[1].compile().evaluate(scope);
            if (args.length > 2)
              mod = args[2].compile().evaluate(scope);
          } else
            throw new Error("Too many arguments for dicemin");
          min = 1;
          if (sides === "F" || sides === "f")
            min = -1;
          else if (sides === "%")
            min = 0;
          if (mod)
            return math2.evaluate(min * c + mod, scope);
          return min * c;
        },
        dicemax: (args, math2, scope) => {
          let res;
          let c;
          let sides;
          let mod;
          let max;
          if (args.length === 0) throw new Error("Invalid arguments for dicemax");
          if (args.length === 1) {
            res = this.getDiceArguments(args[0], scope, "dicemax");
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = args[0].compile().evaluate(scope);
            sides = args[1].toString().trim();
            if (sides !== "F" && sides !== "%")
              sides = args[1].compile().evaluate(scope);
            if (args.length > 2)
              mod = args[2].compile().evaluate(scope);
          } else
            throw new Error("Too many arguments for dicemax");
          if (sides === "F" || sides === "f")
            max = 1;
          else if (sides === "%")
            max = 1;
          else
            max = parseInt(sides);
          if (mod)
            return math2.evaluate(max * c + mod, scope);
          return max * c;
        },
        dicedev: (args, math2, scope) => {
          let res;
          let c;
          let sides;
          let mod;
          let max;
          if (args.length === 0) throw new Error("Invalid arguments for dicedev");
          if (args.length === 1) {
            res = this.getDiceArguments(args[0], scope, "dicedev");
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = args[0].compile().evaluate(scope);
            sides = args[1].toString().trim();
            if (sides !== "F" && sides !== "%")
              sides = args[1].compile().evaluate(scope);
            if (args.length > 2)
              mod = args[2].compile().evaluate(scope);
          } else
            throw new Error("Too many arguments for dicedev");
          if (sides === "F" || sides === "f")
            max = 6;
          else if (sides === "%")
            max = 1;
          else
            max = parseInt(sides);
          if (mod)
            return math2.evaluate(Math.sqrt((max * max - 1) / 12 * c) + mod, scope);
          return Math.sqrt((max * max - 1) / 12 * c);
        },
        zdicedev: (args, math2, scope) => {
          let res;
          let c;
          let sides;
          let mod;
          let max;
          if (args.length === 0) throw new Error("Invalid arguments for zdicedev");
          if (args.length === 1) {
            res = this.getDiceArguments(args[0], scope, "zdicedev");
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = args[0].compile().evaluate(scope);
            sides = args[1].toString().trim();
            if (sides !== "F" && sides !== "%")
              sides = args[1].compile().evaluate(scope);
            if (args.length > 2)
              mod = args[2].compile().evaluate(scope);
          } else
            throw new Error("Too many arguments for zdicedev");
          if (sides === "F" || sides === "f")
            max = 6;
          else if (sides === "%")
            max = 1;
          else
            max = parseInt(sides);
          max--;
          if (mod)
            return math2.evaluate(Math.sqrt((max * max - 1) / 12 * c) + mod, scope);
          return Math.sqrt((max * max - 1) / 12 * c);
        },
        dice: (args, math2, scope) => {
          let res;
          let c;
          let sides;
          let mod;
          if (args.length === 1) {
            res = this.getDiceArguments(args[0], scope, "dice");
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length > 1) {
            c = args[0].compile().evaluate(scope);
            sides = args[1].toString().trim();
            if (sides !== "F" && sides !== "%")
              sides = args[1].compile().evaluate(scope);
            if (args.length > 2)
              mod = args[2].compile().evaluate(scope);
          } else
            throw new Error("Invalid arguments for dice");
          let sum = 0;
          for (let i = 0; i < c; i++) {
            if (sides === "F" || sides === "f")
              sum += fudgeDice();
            else if (sides === "%")
              sum += ~~(Math.random() * 100) + 1;
            else
              sum += ~~(Math.random() * sides) + 1;
          }
          if (sides === "%")
            sum /= 100;
          if (mod)
            return math2.evaluate(sum + mod, scope);
          return sum;
        },
        isdefined: (args, math2, scope) => {
          if (args.length === 1) {
            args[0] = this.stripQuotes(args[0].toString());
            if (this.client.variables.hasOwnProperty(args[0]))
              return 1;
            if (scope.has(args[0]))
              return 1;
            return 0;
          }
          throw new Error("Invalid arguments for isdefined");
        },
        defined: (args, math2, scope) => {
          let sides;
          if (args.length === 0)
            throw new Error("Missing arguments for defined");
          else if (args.length === 1) {
            args[0] = this.stripQuotes(args[0], true);
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0) return 0;
            for (; k < kl; k++) {
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
              sides = sides.find((i) => {
                return i.pattern === args[0];
              });
              if (sides) return 1;
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
              sides = sides.find((i) => {
                return i.pattern === args[0] || i.name === args[0];
              });
              if (sides) return 1;
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].macros);
              sides = sides.find((i) => {
                return MacroDisplay(i).toLowerCase() === args[0].toLowerCase() || i.name === args[0];
              });
              if (sides) return 1;
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
              sides = sides.find((i) => {
                return i.caption === args[0] || i.name === args[0];
              });
              if (sides) return 1;
            }
            return this.client.variables.hasOwnProperty(args[0]);
          } else if (args.length === 2) {
            args[0] = this.stripQuotes(args[0].toString());
            args[0] = this.stripQuotes(args[1].toString());
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0) return 0;
            for (; k < kl; k++) {
              switch (args[1]) {
                case "alias":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
                  sides = sides.find((i) => {
                    return i.pattern === args[0];
                  });
                  if (sides) return 1;
                  return 0;
                case "event":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  sides = sides.find((i) => {
                    return i.type === 2 /* Event */ && (i.pattern === args[0] || i.name === args[0]);
                  });
                  if (sides) return 1;
                  return 0;
                case "trigger":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  sides = sides.find((i) => {
                    return i.pattern === args[0] || i.name === args[0];
                  });
                  if (sides) return 1;
                  return 0;
                case "macro":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].macros);
                  sides = sides.find((i) => {
                    return MacroDisplay(i).toLowerCase() === args[0].toLowerCase() || i.name === args[0];
                  });
                  if (sides) return 1;
                  return 0;
                case "button":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
                  sides = sides.find((i) => {
                    return i.caption === args[0] || i.name === args[0];
                  });
                  if (sides) return 1;
                  return 0;
              }
            }
            if (args[1] === "variable")
              return this.client.variables.hasOwnProperty(args[0]) || scope.has(args[0]);
          } else
            throw new Error("Too many arguments for defined");
          return 0;
        },
        time: (args, math2, scope) => {
          if (args.length > 1)
            throw new Error("Too many arguments for time");
          if (!moment) return (/* @__PURE__ */ new Date()).toISOString();
          if (args.length)
            return moment().format(args[0].compile().evaluate(scope));
          return moment().format();
        },
        clip: (args, math2, scope) => {
          if (args.length > 1)
            throw new Error("Too many arguments for clip");
          if (args.length) {
            this.client.writeClipboard(args[0].compile().evaluate(scope));
            return;
          }
          return this.client.readClipboard();
        },
        if: (args, math2, scope) => {
          if (args.length < 3)
            throw new Error("Missing arguments for if");
          if (args.length !== 3)
            throw new Error("Too many arguments for if");
          if (args[0].compile().evaluate(scope))
            return args[1].compile().evaluate(scope);
          return args[2].compile().evaluate(scope);
        },
        len: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for len");
          if (args.length !== 1)
            throw new Error("Too many arguments for len");
          return args[0].compile().evaluate(scope).toString().length;
        },
        stripansi: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for len");
          if (args.length !== 1)
            throw new Error("Too many arguments for len");
          const ansiRegex = new RegExp("[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))", "g");
          return args[0].compile().evaluate(scope).toString().replace(ansiRegex, "");
        },
        ansi: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for ansi");
          args = args.map(
            (a) => getAnsiCode(a.toString()) === -1 && a.toString() !== "current" ? a.compile().evaluate(scope).toString() : a.toString()
          );
          const c = args.length;
          let mod = [];
          let min = {};
          let sides;
          let max;
          for (sides = 0; sides < c; sides++) {
            if (args[sides].trim() === "current")
              mod.push(args[sides].trim());
            else {
              max = getAnsiCode(args[sides].trim());
              if (max === -1)
                throw new Error("Invalid color or style for ansi");
              if (max >= 0 && max < 30)
                min[max] = 1;
              else
                mod.push(args[sides]);
            }
          }
          if (mod.length > 2)
            throw new Error("Too many colors for ansi");
          if (mod.length > 1) {
            if (mod[1] === "current")
              mod[1] = "";
            else
              mod[1] = getAnsiCode(mod[1], true);
          }
          if (mod.length > 0) {
            if (min[1] && mod[0] === "white")
              mod[0] = "";
            else if (mod[0] === "current")
              mod[0] = "";
            else
              mod[0] = getAnsiCode(mod[0]);
          }
          min = [...Object.keys(min), ...mod];
          if (!min.length)
            throw new Error("Invalid colors or styles for ansi");
          min = min.filter((f) => f !== "");
          return `\x1B[${min.join(";")}m`;
        },
        color: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for color");
          args = args.map(
            (a) => getAnsiCode(a.toString()) === -1 && a.toString() !== "current" ? a.compile().evaluate(scope).toString() : a.toString()
          );
          let c;
          let sides;
          if (args.length === 1) {
            if (args[0] === "bold")
              return "370";
            c = getAnsiColorCode(args[0]);
            if (c === -1)
              throw new Error("Invalid fore color");
            return c.toString();
          } else if (args.length === 2) {
            if (args[0] === "bold")
              c = 370;
            else {
              c = getAnsiColorCode(args[0]);
              if (c === -1)
                throw new Error("Invalid fore color");
              if (args[1] === "bold")
                return (c * 10).toString();
            }
            sides = c.toString();
            c = getAnsiColorCode(args[1], true);
            if (c === -1)
              throw new Error("Invalid back color");
            return sides + "," + c.toString();
          } else if (args.length === 3) {
            if (args[0] === "bold") {
              args.shift();
              args.push("bold");
            }
            if (args[2] !== "bold")
              throw new Error("Only bold is supported as third argument for color");
            c = getAnsiColorCode(args[0]);
            if (c === -1)
              throw new Error("Invalid fore color");
            sides = (c * 10).toString();
            c = getAnsiColorCode(args[1], true);
            if (c === -1)
              throw new Error("Invalid back color");
            return sides + "," + c.toString();
          }
          throw new Error("Too many arguments");
        },
        zcolor: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for zcolor");
          else if (args.length > 1)
            throw new Error("Too many arguments for zcolor");
          return getColorCode(parseInt(args[0].compile().evaluate(scope), 10));
        },
        case: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for case");
          let i = args[0].compile().evaluate(scope);
          if (i > 0 && i < args.length)
            return args[i].compile().evaluate(scope);
          return null;
        },
        switch: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for switch");
          if (args.length % 2 === 1)
            throw new Error("All expressions must have a value for switch");
          let i = args.length;
          for (let c = 0; c < i; c += 2) {
            if (args[c].compile().evaluate(scope))
              return args[c + 1].compile().evaluate(scope);
          }
          return null;
        },
        ascii: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for ascii");
          else if (args.length > 1)
            throw new Error("Too many arguments for ascii");
          if (args[0].toString().trim().length === 0)
            throw new Error("Invalid argument, empty string for ascii");
          return args[0].toString().trim().charCodeAt(0);
        },
        char: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for char");
          else if (args.length > 1)
            throw new Error("Too many arguments for char");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for char");
          return String.fromCharCode(c);
        },
        bitand: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for bitand");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitand");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for bitand");
          let sides = args[1].compile().evaluate(scope);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1].toString() + "' must be a number for bitand");
          return c & sides;
        },
        bitnot: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for bitnot");
          else if (args.length !== 1)
            throw new Error("Too many arguments for bitnot");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for bitnot");
          return ~c;
        },
        bitor: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for bitor");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitor");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for bitor");
          let sides = args[1].compile().evaluate(scope);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1].toString() + "' must be a number for bitor");
          return c | sides;
        },
        bitset: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for bitset");
          else if (args.length > 3)
            throw new Error("Too many arguments for bitset");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for bitset");
          let sides = args[1].compile().evaluate(scope);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1].toString() + "' must be a number for bitset");
          sides--;
          let mod = 1;
          if (args.length === 3) {
            mod = args[2].compile().evaluate(scope);
            if (isNaN(mod))
              throw new Error("Invalid argument '" + args[2].toString() + "' must be a number for bitset");
          }
          return c & ~(1 << sides) | (mod ? 1 : 0) << sides;
        },
        bitshift: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for bitshift");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitshift");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for bitshift");
          let sides = args[1].compile().evaluate(scope);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1].toString() + "' must be a number for bitshift");
          if (sides < 0)
            return c >> -sides;
          return c << sides;
        },
        bittest: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for bittest");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bittest");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for bittest");
          let sides = args[1].compile().evaluate(scope);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1].toString() + "' must be a number for bittest");
          sides--;
          return (c >> sides) % 2 != 0 ? 1 : 0;
        },
        bitxor: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for bitxor");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitxor");
          let c = args[0].compile().evaluate(scope);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0].toString() + "' must be a number for bitxor");
          let sides = args[1].compile().evaluate(scope);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1].toString() + "' must be a number for bitxor");
          return c ^ sides;
        },
        tonumber: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for number");
          else if (args.length > 1)
            throw new Error("Too many arguments for number");
          args[0] = args[0].compile().evaluate(scope).toString();
          if (args[0].match(/^\s*?[-|+]?\d+\s*?$/))
            return parseInt(args[0], 10);
          else if (args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return parseFloat(args[0]);
          else if (args[0] === "true")
            return 1;
          else if (args[0] === "false")
            return 0;
          return 0;
        },
        isfloat: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for isfloat");
          else if (args.length > 1)
            throw new Error("Too many arguments for isfloat");
          args[0] = args[0].compile().evaluate(scope).toString();
          if (args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return 1;
          return 0;
        },
        isnumber: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for isnumber");
          else if (args.length > 1)
            throw new Error("Too many arguments for isnumber");
          args[0] = args[0].compile().evaluate(scope).toString();
          if (args[0].match(/^\s*?[-|+]?\d+\s*?$/) || args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return 1;
          return 0;
        },
        tostring: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for string");
          else if (args.length > 1)
            throw new Error("Too many arguments for string");
          return args[0].compile().evaluate(scope).toString();
        },
        float: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for float");
          else if (args.length > 1)
            throw new Error("Too many arguments for float");
          args[0] = args[0].compile().evaluate(scope).toString();
          if (args[0].match(/^\s*?[-|+]?\d+\s*?$/) || args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return parseFloat(args[0]);
          else if (args[0] === "true")
            return 1;
          else if (args[0] === "false")
            return 0;
          return 0;
        },
        trim: (args, math2, scope) => {
          if (args.length !== 1)
            throw new Error("Missing arguments for trim");
          return args[0].compile().evaluate(scope).toString().trim();
        },
        trimleft: (args, math2, scope) => {
          if (args.length !== 1)
            throw new Error("Missing arguments for trimleft");
          return args[0].compile().evaluate(scope).toString().trimLeft();
        },
        trimright: (args, math2, scope) => {
          if (args.length !== 1)
            throw new Error("Missing arguments for trimright");
          return args[0].compile().evaluate(scope).toString().trimRight();
        },
        pos: (args, math2, scope) => {
          if (args.length < 2)
            throw new Error("Missing arguments for pos");
          else if (args.length > 2)
            throw new Error("Too many arguments for pos");
          args[0] = args[0].compile().evaluate(scope).toString();
          args[1] = args[1].compile().evaluate(scope).toString();
          return args[1].indexOf(args[0]) + 1;
        },
        ipos: (args, math2, scope) => {
          if (args.length < 2)
            throw new Error("Missing arguments for pos");
          else if (args.length > 2)
            throw new Error("Too many arguments for pos");
          args[0] = args[0].compile().evaluate(scope).toString().toLowerCase();
          args[1] = args[1].compile().evaluate(scope).toString().toLowerCase();
          return args[1].indexOf(args[0]) + 1;
        },
        ends: (args, math2, scope) => {
          if (args.length < 2)
            throw new Error("Missing arguments for ends");
          else if (args.length > 2)
            throw new Error("Too many arguments for ends");
          args[0] = args[0].compile().evaluate(scope).toString().toLowerCase();
          args[1] = args[1].compile().evaluate(scope).toString().toLowerCase();
          return args[0].endsWith(args[1]);
        },
        begins: (args, math2, scope) => {
          if (args.length < 2)
            throw new Error("Missing arguments for begins");
          else if (args.length > 2)
            throw new Error("Too many arguments for begins");
          args[0] = args[0].compile().evaluate(scope).toString().toLowerCase();
          args[1] = args[1].compile().evaluate(scope).toString().toLowerCase();
          return args[0].startsWith(args[1]);
        },
        alarm: (args, math2, scope) => {
          let alarms;
          let a;
          let al;
          let t;
          let p;
          switch (args.length) {
            case 0:
              throw new Error("Missing arguments for alarm");
            case 1:
              args[0] = args[0].compile().evaluate(scope).toString();
              alarms = this.client.alarms;
              al = alarms.length;
              if (al === 0)
                throw new Error("No alarms set.");
              a = 0;
              for (; a < al; a++) {
                if (alarms[a].type !== 3 /* Alarm */) continue;
                if (alarms[a].name === args[0] || alarms[a].pattern === args[0]) {
                  if (alarms[a].suspended)
                    return 0;
                  return this.client.getRemainingAlarmTime(a);
                }
              }
              return;
            case 2:
              t = args[1].compile().evaluate(scope);
              args[0] = args[0].compile().evaluate(scope).toString();
              alarms = this.client.alarms;
              al = alarms.length;
              if (al === 0)
                throw new Error("No alarms set.");
              a = 0;
              if (typeof t === "string") {
                for (; a < al; a++) {
                  if (alarms[a].type !== 3 /* Alarm */) continue;
                  if (alarms[a].name === args[0] || alarms[a].pattern === args[0]) {
                    if (alarms[a].profile.name.toUpperCase() !== t.toUpperCase())
                      continue;
                    if (alarms[a].suspended)
                      return 0;
                    return this.client.getRemainingAlarmTime(a);
                  }
                }
                throw new Error("Alarm not found in profile: " + t + ".");
              } else {
                for (; a < al; a++) {
                  if (alarms[a].type !== 3 /* Alarm */) continue;
                  if (alarms[a].name === args[0] || alarms[a].pattern === args[0]) {
                    if (!alarms[a].suspended)
                      this.client.setAlarmTempTime(a, t);
                    return t;
                  }
                }
                throw new Error("Alarm not found.");
              }
            case 3:
              t = args[1].compile().evaluate(scope);
              args[0] = args[0].compile().evaluate(scope).toString();
              p = args[2].compile().evaluate(scope).toString();
              alarms = this.client.alarms;
              al = alarms.length;
              if (al === 0)
                throw new Error("No alarms set.");
              a = 0;
              for (; a < al; a++) {
                if (alarms[a].type !== 3 /* Alarm */) continue;
                if (alarms[a].name === args[0] || alarms[a].pattern === args[0]) {
                  if (alarms[a].profile.name.toUpperCase() !== p.toUpperCase())
                    continue;
                  if (!alarms[a].suspended)
                    this.client.setAlarmTempTime(a, t);
                  return t;
                }
              }
              throw Error("Could not set time, alarm not found in profile: " + args[2] + ".");
          }
          throw new Error("Too many arguments for alarm");
        },
        state: (args, math2, scope) => {
          let trigger;
          if (args.length === 0)
            throw new Error("Missing arguments for state");
          if (args.length > 2)
            throw new Error("Too many arguments for state");
          args[0] = args[0].compile().evaluate(scope).toString();
          if (args.length === 1) {
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0)
              return null;
            if (kl === 1) {
              if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                throw Error("No enabled profiles found!");
              trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
              trigger = trigger.find((t) => {
                return t.name === args[0] || t.pattern === args[0];
              });
            } else {
              for (; k < kl; k++) {
                if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                  continue;
                trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                trigger = trigger.find((t) => {
                  return t.name === args[0] || t.pattern === args[0];
                });
                if (trigger)
                  break;
              }
            }
          } else if (args.length === 2) {
            args[1] = args[1].compile().evaluate(scope);
            let profile;
            if (this.client.profiles.contains(args[1]))
              profile = this.client.profiles.items[args[1].toLowerCase()];
            else
              throw new Error("Profile not found: " + args[1]);
            trigger = SortItemArrayByPriority(profile.triggers);
            trigger = trigger.find((t) => {
              return t.name === args[0] || t.pattern === args[0];
            });
          }
          if (trigger)
            return trigger.triggers && trigger.triggers.length ? trigger.state : 0;
          throw new Error("Trigger not found");
        },
        isnull: (args, math2, scope) => {
          if (args.length === 0)
            return null;
          if (args.length !== 1)
            throw new Error("Too many arguments for null");
          return args[0].compile().evaluate(scope) ? 1 : 0;
        },
        escape: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for unescape");
          if (args.length !== 1)
            throw new Error("Too many arguments for unescape");
          let c;
          args[0] = args[0].compile().evaluate(scope).toString();
          if (this.client.getOption("allowEscape")) {
            const escape2 = this.client.getOption("allowEscape") ? this.client.getOption("escapeChar") : "";
            c = escape2;
            if (escape2 === "\\")
              c += escape2;
            if (this.client.getOption("parseDoubleQuotes"))
              c += '"';
            if (this.client.getOption("parseSingleQuotes"))
              c += "'";
            if (this.client.getOption("commandStacking"))
              c += this.client.getOption("commandStackingChar");
            if (this.client.getOption("enableSpeedpaths"))
              c += this.client.getOption("speedpathsChar");
            if (this.client.getOption("enableCommands"))
              c += this.client.getOption("commandChar");
            if (this.client.getOption("enableVerbatim"))
              c += this.client.getOption("verbatimChar");
            if (this.client.getOption("enableDoubleParameterEscaping"))
              c += this.client.getOption("parametersChar");
            if (this.client.getOption("enableNParameters"))
              c += this.client.getOption("nParametersChar");
            return args.replace(new RegExp(`[${c}]`, "g"), escape2 + "$&");
          }
          return args.replace(/[\\"']/g, "$&");
        },
        unescape: (args, math2, scope) => {
          if (args.length === 0)
            throw new Error("Missing arguments for unescape");
          if (args.length !== 1)
            throw new Error("Too many arguments for unescape");
          let c;
          args[0] = args[0].compile().evaluate(scope).toString();
          if (this.client.getOption("allowEscape")) {
            const escape2 = this.client.getOption("allowEscape") ? this.client.getOption("escapeChar") : "";
            c = escape2;
            if (escape2 === "\\")
              c += escape2;
            if (this.client.getOption("parseDoubleQuotes"))
              c += '"';
            if (this.client.getOption("parseSingleQuotes"))
              c += "'";
            if (this.client.getOption("commandStacking"))
              c += this.client.getOption("commandStackingChar");
            if (this.client.getOption("enableSpeedpaths"))
              c += this.client.getOption("speedpathsChar");
            if (this.client.getOption("enableCommands"))
              c += this.client.getOption("commandChar");
            if (this.client.getOption("enableVerbatim"))
              c += this.client.getOption("verbatimChar");
            if (this.client.getOption("enableDoubleParameterEscaping"))
              c += this.client.getOption("parametersChar");
            if (this.client.getOption("enableNParameters"))
              c += this.client.getOption("nParametersChar");
            if (escape2 === "\\")
              return args[0].replace(new RegExp(`\\\\[${c}]`, "g"), (m) => m.substr(1));
            return args[0].replace(new RegExp(`${escape2}[${c}]`, "g"), (m) => m.substr(1));
          }
          return args[0].replace(/\\[\\"']/g, (m) => m.substr(1));
        },
        prompt: (args, math2, scope) => {
          if (args.length > 3)
            throw new Error("Too many arguments");
          if (args.length === 0)
            return window.prompt();
          args = args.map((a) => a.compile().evaluate(scope).toString());
          return window.prompt(...args);
        }
        /*
        fileprompt: (args, math, scope) => {
            if (args.length > 2)
                throw new Error('Too many arguments');
            args = args.map(a => a.compile().evaluate(scope).toString());
            let f = [
                { name: 'All files (*.*)', extensions: ['*'] },
            ];
            if (args.length > 0 && args[0].trim().length > 0) {
                f.unshift({
                    name: args[0],
                    extensions: args[0].split(',').map(a => a.trim())
                })
            }
            var files = dialog.showOpenDialogSync({
                filters: f,
                properties: ['openFile', 'promptToCreate'],
                defaultPath: args.length >= 2 ? parseTemplate(args[1]) : ''
            });
            if (files && files.length) return files[0];
        }
        */
      };
      for (let fun in functions) {
        if (!functions.hasOwnProperty(fun) || typeof functions[fun] !== "function") {
          continue;
        }
        functions[fun].rawArgs = true;
      }
      _mathjs.import(functions, {});
    }
    resetExpressionEngine() {
      if (!_mathjs) return;
      _mathjs = void 0;
    }
    async initPads() {
      if (!this.client || !this.client.options) {
        setTimeout(this.initPads, 5);
        return;
      }
      this._controllers = [];
      this._controllersCount = 0;
      this._gamepadCaches = null;
      if (!this.client.getOption("gamepads")) return;
      const controllers = navigator.getGamepads();
      let ct = 0;
      const cl = controllers.length;
      for (; ct < cl; ct++) {
        if (!controllers[ct]) continue;
        this._controllers[controllers[ct].index] = { pad: controllers[ct], axes: clone(controllers[ct].axes), state: { axes: [], buttons: [] }, pState: { axes: [], buttons: [] } };
        this._controllersCount++;
      }
      this.updatePads();
    }
    updatePads() {
      if (this._controllersCount === 0 || !this.client.getOption("gamepads"))
        return;
      const controllers = navigator.getGamepads();
      let c = 0;
      const cl = controllers.length;
      if (!this._gamepadCaches && cl > 0)
        this._gamepadCaches = [];
      for (; c < cl; c++) {
        const controller = controllers[c];
        if (!controller || !this._controllers[controller.index]) continue;
        const state = this._controllers[controller.index].state;
        const axes = this._controllers[controller.index].axes;
        const bl = controller.buttons.length;
        let i;
        let macros;
        if (!this._gamepadCaches[c])
          this._gamepadCaches[c] = FilterArrayByKeyValue(this.client.macros, "gamepad", c + 1);
        macros = this._gamepadCaches[c];
        let m = 0;
        const ml = macros.length;
        if (ml === 0) continue;
        for (i = 0; i < bl; i++) {
          let val = controller.buttons[i];
          let pressed;
          if (typeof val === "object") {
            pressed = val.pressed;
            val = val.value;
          } else
            pressed = val >= 0.5;
          if (state.buttons[i]) {
            if (state.buttons[i].pressed !== pressed) {
              state.buttons[i].pressed = pressed;
              if (!pressed) {
                for (; m < ml; m++) {
                  if (!macros[m].enabled) continue;
                  if (macros[m].key !== i + 1) continue;
                  if (this.ExecuteMacro(macros[m])) {
                    if (this._controllersCount > 0 || controllers.length > 0)
                      requestAnimationFrame(() => {
                        this.updatePads();
                      });
                    return;
                  }
                }
              }
            }
          } else {
            state.buttons[i] = { pct: Math.round(val * 100), pressed };
          }
        }
        const al = controller.axes.length;
        let a = 0;
        for (i = 0; i < al; i++) {
          if (state.axes[i] !== controller.axes[i] && controller.axes[i] !== axes[i]) {
            state.axes[i] = controller.axes[i];
            if (state.axes[i] < -0.75) {
              a = -(i + 1);
            } else if (state.axes[i] > 0.75) {
              a = i + 1;
            }
          } else if (state.axes[i] < -0.75) {
            a = -(i + 1);
          } else if (state.axes[i] > 0.75) {
            a = i + 1;
          }
          if (a !== 0)
            for (; m < ml; m++) {
              if (!macros[m].enabled) continue;
              if (macros[m].gamepadAxes !== i + 1) continue;
              if (this.ExecuteMacro(macros[m])) {
                if (this._controllersCount > 0 || controllers.length > 0)
                  requestAnimationFrame(() => {
                    this.updatePads();
                  });
                return;
              }
            }
        }
      }
      if (this._controllersCount > 0 || controllers.length > 0)
        requestAnimationFrame(() => {
          this.updatePads();
        });
    }
    adjustLastLine(n, raw) {
      if (!this.client.display.lines || this.client.display.lines.length === 0)
        return 0;
      if (raw) {
        if (n === this.client.display.lines.length) {
          n--;
          if (this.client.display.lines[n].text.length === 0 && this.client.display.lines[n].raw.length)
            n--;
        } else if (n === this.client.display.lines.length - 1 && this.client.display.lines[n].text.length === 0 && this.client.display.lines[n].raw.length)
          n--;
      } else if (n === this.client.display.lines.length) {
        n--;
        if (this.client.display.lines[n].text.length === 0)
          n--;
      } else if (n === this.client.display.lines.length - 1 && this.client.display.lines[n].text.length === 0)
        n--;
      return n;
    }
    get isLocked() {
      return this._locked === 0 ? false : true;
    }
    addLock() {
      this._locked++;
    }
    removeLock() {
      this._locked--;
    }
    AddCommandToHistory(cmd) {
      if ((this._commandHistory.length < 1 || this._commandHistory[this._commandHistory.length - 1] !== cmd) && cmd.length > 0) {
        if (this._commandHistory.length >= this.client.getOption("commandHistorySize"))
          this._commandHistory.shift();
        this._commandHistory.push(cmd);
        this.emit("command-history-changed", this._commandHistory);
      }
    }
    clearCommandHistory() {
      this._commandHistory = [];
      this._historyIdx = -1;
      this.emit("command-history-changed", this._commandHistory);
    }
    setHistoryIndex(index) {
      if (index < 0 || this._commandHistory.length === 0)
        this._historyIdx = -1;
      else if (index >= this._commandHistory.length)
        this._historyIdx = this._commandHistory.length - 1;
      else
        this._historyIdx = index;
    }
    get commandHistory() {
      return this._commandHistory;
    }
    executeScript(txt) {
      if (txt == null)
        return txt;
      let state = 0;
      let idx = 0;
      let c;
      const tl = txt.length;
      let fun = "";
      let args = [];
      let arg = "";
      let raw;
      let s = 0;
      const pd = this.client.getOption("parseDoubleQuotes");
      const ps = this.client.getOption("parseSingleQuotes");
      const cmdChar = this.client.getOption("commandChar");
      for (; idx < tl; idx++) {
        c = txt.charAt(idx);
        switch (state) {
          //find name
          case 1:
            if (c === " ") {
              state = 2;
              raw += c;
            } else {
              fun += c;
              raw += c;
            }
            break;
          //find arguments
          case 2:
            if (c === "{") {
              state = 7;
              arg += c;
            } else if (c === "(") {
              state = 8;
              arg += c;
            } else if (c === " ") {
              args.push(arg);
              arg = "";
            } else {
              if (c === '"' && pd)
                state = 3;
              else if (c === "'" && ps)
                state = 4;
              arg += c;
            }
            raw += c;
            break;
          case 3:
            if (c === '"')
              state = 2;
            arg += c;
            raw += c;
            break;
          case 4:
            if (c === "'")
              state = 2;
            arg += c;
            raw += c;
            break;
          case 7:
            arg += c;
            if (c === "}") {
              if (s === 0) {
                state = 2;
              } else
                s--;
            } else if (c === "{")
              s++;
            raw += c;
            break;
          case 8:
            arg += c;
            if (c === ")") {
              if (s === 0) {
                state = 2;
              } else
                s--;
            } else if (c === "(")
              s++;
            raw += c;
            break;
          /*
          case 5:
              if (c === '"') {
                  arg += c;
                  raw += c;
              }
              else {
                  arg += '\\';
                  raw += '\\';
                  idx--;
              }
              state = 3;
              break;
          case 6:
              if (c === '\'') {
                  arg += c;
                  raw += c;
              }
              else {
                  arg += '\\';
                  raw += '\\';
                  idx--;
              }
              state = 4;
              break;
              */
          default:
            if (idx === 0 && c === cmdChar) {
              state = 1;
              fun = "";
              args = [];
              arg = "";
              raw = c;
            } else
              return txt;
            break;
        }
      }
      if (fun.length > 0) {
        if (arg.endsWith("\n"))
          arg = arg.substring(0, arg.length - 1);
        if (arg.length > 0) args.push(arg);
        return this.executeFunction(fun, args, raw, cmdChar);
      }
      return txt;
    }
    executeFunction(fun, args, raw, cmdChar) {
      let n;
      let f = false;
      let items;
      let al;
      let i;
      let tmp;
      let profile = null;
      let name2 = null;
      let item;
      let p;
      let reload;
      let trigger;
      let avg;
      let max;
      let min;
      switch (fun.toLowerCase()) {
        //spell-checker:ignore untrigger unaction
        case "unaction":
        case "untrigger":
        case "unt":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          profile = null;
          name2 = null;
          reload = true;
          if (args.length < 1 || args.length > 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "unt\x1B[0;-11;-12mrigger {pattern|name} \x1B[3mprofile\x1B[0;-11;-12m");
          if (args[0].length === 0)
            throw new Error("Invalid name or pattern");
          if (args[0].match(/^\{.*\}$/g))
            args[0] = this.parseInline(args[0].substr(1, args[0].length - 2));
          else
            args[0] = this.parseInline(this.stripQuotes(args[0]));
          if (args.length === 2) {
            profile = this.stripQuotes(args[2]);
            profile = this.parseInline(profile);
          }
          if (!profile || profile.length === 0) {
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0)
              return null;
            if (kl === 1) {
              if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                throw Error("No enabled profiles found!");
              item = this.client.profiles.items[keys[k]].findAny("triggers", { name: args[0], pattern: args[0] });
            } else {
              for (; k < kl; k++) {
                if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                  continue;
                item = this.client.profiles.items[keys[k]].findAny("triggers", { name: args[0], pattern: args[0] });
                if (item) {
                  profile = this.client.profiles.items[keys[k]];
                  break;
                }
              }
            }
            if (!item)
              throw new Error("Trigger '" + args[0] + "' not found in '" + profile.name + "'!");
            this.client.removeTrigger(item);
            this.client.echo("Trigger '" + args[0] + "' removed from '" + profile.name + "'.", -7, -8, true, true);
          } else {
            profile = this.parseInline(profile);
            if (this.client.profiles.contains(profile)) {
              profile = this.client.profiles.items[profile.toLowerCase()];
              item = profile.findAny("triggers", { name: args[0], pattern: args[0] });
              if (!item)
                throw new Error("Trigger '" + args[0] + "' not found in '" + profile.name + "'!");
              this.client.removeTrigger(item);
              this.client.echo("Trigger '" + args[0] + "' removed from '" + profile.name + "'.", -7, -8, true, true);
            } else
              throw new Error("Profile not found: " + profile);
          }
          return null;
        case "suspend":
        case "sus":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          switch (args.length) {
            case 0:
              tmp = this.client.alarms;
              if (tmp.length === 0)
                this.client.echo("No alarms defined.", -7, -8, true, true);
              else {
                this.client.setAlarmState(0, false);
                this._lastSuspend = 0;
                this.client.echo("Last alarm suspended.", -7, -8, true, true);
              }
              return null;
            case 1:
              items = this.parseInline(this.stripQuotes(args[0]));
              tmp = this.client.alarms;
              al = tmp.length;
              for (let a = tmp.length - 1; a >= 0; a--) {
                if (tmp[a].name === items || tmp[a].pattern === items) {
                  this.client.setAlarmState(a, false);
                  this.client.echo("Alarm '" + items + "' suspended.", -7, -8, true, true);
                  this._lastSuspend = a;
                  break;
                }
              }
              return null;
            default:
              throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "sus\x1B[0;-11;-12mpend id \x1B[3mprofile\x1B[0;-11;-12m or \x1B[4m" + cmdChar + "sus\x1B[0;-11;-12mpend");
          }
        case "resume":
        case "resu":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          switch (args.length) {
            case 0:
              if (this._lastSuspend === -1)
                return null;
              this.client.setAlarmState(this._lastSuspend, true);
              this.client.echo("Last alarm suspended resumed.", -7, -8, true, true);
              this._lastSuspend = -1;
              return null;
            case 1:
              items = this.parseInline(this.stripQuotes(args[0]));
              tmp = this.client.alarms;
              al = tmp.length;
              for (let a = al - 1; a >= 0; a--) {
                if (tmp[a].name === items || tmp[a].pattern === items) {
                  this.client.setAlarmState(a, true);
                  this.client.echo("Alarm '" + items + "' resumed.", -7, -8, true, true);
                  break;
                }
              }
              return null;
            default:
              throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "resu\x1B[0;-11;-12mme id \x1B[3mprofile\x1B[0;-11;-12m or \x1B[4m" + cmdChar + "resu\x1B[0;-11;-12mme");
          }
        case "action":
        case "ac":
        case "trigger":
        case "tr":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          item = {
            profile: null,
            name: null,
            pattern: null,
            commands: null,
            options: { priority: 0 }
          };
          if (args.length < 2 || args.length > 5)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "tr\x1B[0;-11;-12migger name {pattern} {commands} \x1B[3moptions profile\x1B[0;-11;-12m or \x1B[4m" + cmdChar + "tr\x1B[0;-11;-12migger {pattern} {commands} \x1B[3m{options} profile\x1B[0;-11;-12m");
          if (args[0].length === 0)
            throw new Error("Invalid trigger name or pattern");
          if (args[0].match(/^\{.*\}$/g)) {
            item.pattern = args.shift();
            item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
          } else {
            item.name = this.parseInline(this.stripQuotes(args.shift()));
            if (!item.name || item.name.length === 0)
              throw new Error("Invalid trigger name");
            if (args[0].match(/^\{.*\}$/g)) {
              item.pattern = args.shift();
              item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
            }
          }
          if (args.length !== 0) {
            if (args[0].match(/^\{[\s\S]*\}$/g)) {
              item.commands = args.shift();
              item.commands = item.commands.substr(1, item.commands.length - 2);
            }
            if (args.length === 1) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              else
                args[0] = this.stripQuotes(args[0]);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nocr":
                    case "prompt":
                    case "case":
                    case "verbatim":
                    case "disable":
                    case "enable":
                    case "cmd":
                    case "temporary":
                    case "temp":
                    case "raw":
                    case "pattern":
                    case "regular":
                    case "alarm":
                    case "event":
                    case "cmdpattern":
                    case "loopexpression":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("param=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger param option '${o.trim()}'`);
                        item.options["params"] = tmp[1];
                      } else if (o.trim().startsWith("type=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger type option '${o.trim()}'`);
                        if (!this.isTriggerType(tmp[1], 1 /* Main */))
                          throw new Error("Invalid trigger type");
                        item.options["type"] = tmp[1];
                      } else if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid trigger priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid trigger option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid trigger options");
            } else if (args.length === 2) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nocr":
                    case "prompt":
                    case "case":
                    case "verbatim":
                    case "disable":
                    case "enable":
                    case "cmd":
                    case "temporary":
                    case "temp":
                    case "raw":
                    case "pattern":
                    case "regular":
                    case "alarm":
                    case "event":
                    case "cmdpattern":
                    case "loopexpression":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("param=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger param option '${o.trim()}'`);
                        item.options["params"] = tmp[1];
                      } else if (o.trim().startsWith("type=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger type option '${o.trim()}'`);
                        if (!this.isTriggerType(tmp[1], 1 /* Main */))
                          throw new Error("Invalid trigger type");
                        item.options["type"] = tmp[1];
                      } else if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid trigger priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid trigger option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid trigger options");
              item.profile = this.stripQuotes(args[1]);
              if (item.profile.length !== 0)
                item.profile = this.parseInline(item.profile);
            }
          }
          this.createTrigger(item.pattern, item.commands, item.profile, item.options, item.name);
          return null;
        case "event":
        case "ev":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          profile = null;
          reload = true;
          item = {
            profile: null,
            name: null,
            pattern: null,
            commands: null,
            options: { priority: 0 }
          };
          if (args.length < 2 || args.length > 4)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "ev\x1B[0;-11;-12ment name {commands} \x1B[3moptions profile\x1B[0;-11;-12m");
          if (args[0].length === 0)
            throw new Error("Invalid event name");
          item.name = this.parseInline(this.stripQuotes(args.shift()));
          if (!item.name || item.name.length === 0)
            throw new Error("Invalid event name");
          if (args.length === 0)
            throw new Error("Missing commands or options");
          if (args[0].match(/^\{[\s\S]*\}$/g)) {
            item.commands = args.shift();
            item.commands = item.commands.substr(1, item.commands.length - 2);
          } else
            throw new Error("Missing commands");
          if (args.length === 1) {
            args[0] = args[0].substr(1, args[0].length - 2);
            if (args[0].length !== 0) {
              this.parseInline(args[0]).split(",").forEach((o) => {
                switch (o.trim()) {
                  case "nocr":
                  case "prompt":
                  case "case":
                  case "verbatim":
                  case "disable":
                  case "temporary":
                  case "temp":
                    item.options[o.trim()] = true;
                    break;
                  default:
                    if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                      tmp = o.trim().split("=");
                      if (tmp.length !== 2)
                        throw new Error(`Invalid event priority option '${o.trim()}'`);
                      i = parseInt(tmp[1], 10);
                      if (isNaN(i))
                        throw new Error("Invalid event priority value '" + tmp[1] + "' must be a number");
                      item.options["priority"] = i;
                    } else
                      throw new Error(`Invalid event option '${o.trim()}'`);
                }
              });
            } else
              throw new Error("Invalid event options");
          } else if (args.length === 2) {
            if (args[0].match(/^\{[\s\S]*\}$/g))
              args[0] = args[0].substr(1, args[0].length - 2);
            if (args[0].length !== 0) {
              this.parseInline(args[0]).split(",").forEach((o) => {
                switch (o.trim()) {
                  case "nocr":
                  case "prompt":
                  case "case":
                  case "verbatim":
                  case "disable":
                  case "temporary":
                  case "temp":
                    item.options[o.trim()] = true;
                    break;
                  default:
                    if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                      tmp = o.trim().split("=");
                      if (tmp.length !== 2)
                        throw new Error(`Invalid event priority option '${o.trim()}'`);
                      i = parseInt(tmp[1], 10);
                      if (isNaN(i))
                        throw new Error("Invalid event priority value '" + tmp[1] + "' must be a number");
                      item.options["priority"] = i;
                    } else
                      throw new Error(`Invalid event option '${o.trim()}'`);
                }
              });
            } else
              throw new Error("Invalid event options");
            item.profile = this.stripQuotes(args[1]);
            if (item.profile.length !== 0)
              item.profile = this.parseInline(item.profile);
          }
          if (!item.profile || item.profile.length === 0) {
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0)
              return null;
            if (kl === 1) {
              if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                throw Error("No enabled profiles found!");
              profile = this.client.profiles.items[keys[0]];
              tmp = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers.filter((t) => t.type === 2 /* Event */));
              trigger = tmp.find((t) => {
                return t.name === item.name || t.pattern === item.name;
              });
            } else {
              for (; k < kl; k++) {
                if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                  continue;
                tmp = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers.filter((t) => t.type === 2 /* Event */));
                trigger = tmp.find((t) => {
                  return t.name === item.name || t.pattern === item.name;
                });
                if (trigger) {
                  profile = this.client.profiles.items[keys[k]];
                  break;
                }
              }
              if (!profile)
                profile = this.client.activeProfile;
            }
          } else {
            if (this.client.profiles.contains(item.profile))
              profile = this.client.profiles.items[item.profile.toLowerCase()];
            else
              throw new Error("Profile not found: " + item.profile);
            trigger = tmp.find((t) => {
              return t.name === item.name || t.pattern === item.name;
            });
          }
          if (!trigger) {
            trigger = new Trigger();
            trigger.name = item.name;
            profile.triggers.push(trigger);
            this.client.echo("Event '" + trigger.name + "' added.", -7, -8, true, true);
            item.new = true;
          } else
            this.client.echo("Event '" + trigger.name + "' updated.", -7, -8, true, true);
          trigger.pattern = item.name;
          if (item.commands !== null)
            trigger.value = item.commands;
          trigger.type = 2 /* Event */;
          if (item.options.prompt)
            trigger.triggerPrompt = true;
          if (item.options.nocr)
            trigger.triggerNewline = false;
          if (item.options.case)
            trigger.caseSensitive = true;
          if (item.options.raw)
            trigger.raw = true;
          if (item.options.verbatim)
            trigger.verbatim = true;
          if (item.options.disable)
            trigger.enabled = false;
          else if (item.options.enable)
            trigger.enabled = true;
          if (item.options.temporary || item.options.temp)
            trigger.temp = true;
          trigger.priority = item.options.priority;
          this.client.saveProfiles();
          if (reload)
            this.client.clearCache();
          if (item.new)
            this.emit("item-added", "trigger", profile.name, trigger);
          else
            this.emit("item-updated", "trigger", profile.name, profile.triggers.indexOf(trigger), trigger);
          profile = null;
          return null;
        case "unevent":
        case "une":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "une\x1B[0;-11;-12mvent name or \x1B[4m" + cmdChar + "une\x1B[0;-11;-12mvent {name} \x1B[3mprofile\x1B[0;-11;-12m");
          else {
            reload = true;
            profile = null;
            if (args[0].match(/^\{.*\}$/g) || args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g)) {
              if (args.length > 2)
                throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "une\x1B[0;-11;-12mvent name or \x1B[4m" + cmdChar + "une\x1B[0;-11;-12mvent {name} \x1B[3mprofile\x1B[0;-11;-12m");
              if (args.length === 2) {
                profile = this.parseInline(this.stripQuotes(args[1])).toLowerCase();
                if (this.client.profiles.contains(profile))
                  profile = this.client.profiles.items[profile];
                else
                  throw new Error("Profile not found: " + profile);
              } else
                profile = this.client.activeProfile;
              if (args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g))
                n = this.parseInline(this.stripQuotes(args[0]));
              else
                n = this.parseInline(args[0].substr(1, args[0].length - 2));
            } else {
              n = this.parseInline(args.join(" "));
              profile = this.client.activeProfile;
            }
            items = SortItemArrayByPriority(profile.triggers.filter((t) => t.type === 2 /* Event */));
            n = this.stripQuotes(n);
            tmp = n;
            n = items.findIndex((i2) => i2.pattern === n || i2.name === n);
            f = n !== -1;
            if (!f)
              this.client.echo("Event '" + tmp + "' not found.", -7, -8, true, true);
            else {
              this.client.echo("Event '" + (items[n].name || items[n].pattern) + "' removed.", -7, -8, true, true);
              if (reload)
                this.client.removeTrigger(items[n]);
              else {
                n = profile.triggers.indexOf(items[n]);
                profile.triggers.splice(n, 1);
                this.client.saveProfiles();
                this.emit("item-removed", "trigger", profile.name, n);
              }
              profile = null;
            }
          }
          return null;
        //#endregion
        case "button":
        case "bu":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 1) {
            n = this.parseInline(this.stripQuotes(args[0]));
            items = document.getElementById("user-buttons").children;
            if (/^\s*?\d+\s*?$/.exec(n)) {
              n = parseInt(n, 10);
              if (n < 0 || n >= items.length)
                throw new Error("Button index must be >= 0 and < " + items.length);
              else
                items[n].click();
            } else if (items[n])
              items[n].click();
            else
              throw new Error(`Button '${n}' not found`);
            return null;
          }
          profile = null;
          reload = true;
          item = {
            profile: null,
            name: null,
            caption: null,
            commands: null,
            icon: null,
            options: { priority: 0 }
          };
          if (args.length < 2 || args.length > 5)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "bu\x1B[0;-11;-12mtton name|index or \x1B[4m" + cmdChar + "bu\x1B[0;-11;-12mtton name \x1B[3mcaption\x1B[0;-11;-12m {commands} \x1B[3m{icon} options profile\x1B[0;-11;-12m or \x1B[4m" + cmdChar + "by\x1B[0;-11;-12mutton \x1B[3mcaption\x1B[0;-11;-12m {commands} \x1B[3m{icon} {options} profile\x1B[0;-11;-12m");
          if (args[0].length === 0)
            throw new Error("Invalid button name, caption or commands");
          if (args[0].match(/^\{[\s\S]*\}$/g)) {
            item.commands = args.shift();
            item.commands = item.commands.substr(1, item.commands.length - 2);
          } else {
            item.name = this.parseInline(this.stripQuotes(args.shift()));
            if (!item.name || item.name.length === 0)
              throw new Error("Invalid button name or caption");
            if (args[0].match(/^\{[\s\S]*\}$/g)) {
              item.commands = args.shift();
              item.commands = item.commands.substr(1, item.commands.length - 2);
            } else {
              item.caption = this.stripQuotes(args.shift());
              if (!args[0].match(/^\{[\s\S]*\}$/g))
                throw new Error("Missing commands");
            }
          }
          if (args.length !== 0) {
            if (args[0].match(/^\{.*\}$/g)) {
              item.icon = args.shift();
              item.icon = item.icon.substr(1, item.icon.length - 2);
            }
            if (args.length === 1) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              else
                args[0] = this.stripQuotes(args[0]);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nosend":
                    case "chain":
                    case "append":
                    case "stretch":
                    case "disable":
                    case "enable":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid button priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid button priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid button option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid button options");
            } else if (args.length === 2) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nosend":
                    case "chain":
                    case "append":
                    case "stretch":
                    case "disable":
                    case "enable":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid button priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid button priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid button option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid button options");
              item.profile = this.stripQuotes(args[1]);
              if (item.profile.length !== 0)
                item.profile = this.parseInline(item.profile);
            }
          }
          if (!item.profile || item.profile.length === 0) {
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0)
              return null;
            if (kl === 1) {
              if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                throw Error("No enabled profiles found!");
              profile = this.client.profiles.items[keys[0]];
              if (item.name !== null)
                trigger = this.client.profiles.items[keys[k]].find("buttons", "name", item.name);
              else
                trigger = this.client.profiles.items[keys[k]].find("buttons", "caption", item.caption);
            } else {
              for (; k < kl; k++) {
                if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                  continue;
                if (item.name !== null)
                  trigger = this.client.profiles.items[keys[k]].find("buttons", "name", item.name);
                else
                  trigger = this.client.profiles.items[keys[k]].find("buttons", "caption", item.caption);
                if (trigger) {
                  profile = this.client.profiles.items[keys[k]];
                  break;
                }
              }
              if (!profile)
                profile = this.client.activeProfile;
            }
          } else {
            if (this.client.profiles.contains(item.profile))
              profile = this.client.profiles.items[item.profile.toLowerCase()];
            else
              throw new Error("Profile not found: " + item.profile);
            if (item.name !== null)
              trigger = profile.find("buttons", "name", item.name);
            else
              trigger = profile.find("buttons", "caption", item.caption);
          }
          if (!trigger) {
            trigger = new Button();
            trigger.name = item.name || "";
            trigger.caption = item.caption || "";
            profile.buttons.push(trigger);
            if (!item.name && !item.caption)
              this.client.echo("Button added.", -7, -8, true, true);
            else
              this.client.echo("Button '" + (trigger.name || trigger.caption || "") + "' added.", -7, -8, true, true);
            item.new = true;
          } else
            this.client.echo("Button '" + (trigger.name || trigger.caption || "") + "' updated.", -7, -8, true, true);
          if (item.caption !== null)
            trigger.caption = item.caption;
          if (item.commands !== null)
            trigger.value = item.commands;
          if (item.options.icon)
            trigger.icon = item.options.icon;
          if (item.options.nosend)
            trigger.send = false;
          if (item.options.chain)
            trigger.chain = true;
          if (item.options.append)
            trigger.append = true;
          if (item.options.stretch)
            trigger.stretch = true;
          if (item.options.disable)
            trigger.enabled = false;
          else if (item.options.enable)
            trigger.enabled = true;
          trigger.priority = item.options.priority;
          this.client.saveProfiles();
          if (reload)
            this.client.clearCache();
          if (item.new)
            this.emit("item-added", "button", profile.name, trigger);
          else
            this.emit("item-updated", "button", profile.name, profile.buttons.indexOf(trigger), trigger);
          profile = null;
          return null;
        case "unbutton":
        case "unb":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "unb\x1B[0;-11;-12mtton name or \x1B[4m" + cmdChar + "unb\x1B[0;-11;-12mtton {name} \x1B[3mprofile\x1B[0;-11;-12m");
          else {
            reload = true;
            profile = null;
            if (args[0].match(/^\{.*\}$/g) || args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g)) {
              if (args.length > 2)
                throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "unb\x1B[0;-11;-12mtton name or \x1B[4m" + cmdChar + "unb\x1B[0;-11;-12mtton {name} \x1B[3mprofile\x1B[0;-11;-12m");
              if (args.length === 2) {
                profile = this.parseInline(this.stripQuotes(args[1]));
                if (this.client.profiles.contains(profile))
                  profile = this.client.profiles.items[profile.toLowerCase()];
                else
                  throw new Error("Profile not found: " + profile);
              } else
                profile = this.client.activeProfile;
              if (args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g))
                n = this.parseInline(this.stripQuotes(args[0]));
              else
                n = this.parseInline(args[0].substr(1, args[0].length - 2));
            } else {
              n = this.parseInline(args.join(" "));
              profile = this.client.activeProfile;
            }
            items = SortItemArrayByPriority(profile.buttons);
            tmp = n;
            if (/^\s*?\d+\s*?$/.exec(n)) {
              n = parseInt(n, 10);
              if (n < 0 || n >= items.length)
                throw new Error("Button index must be >= 0 and < " + items.length);
              f = true;
            } else {
              n = this.stripQuotes(n);
              n = items.findIndex((i2) => i2.name === n || i2.caption === n);
              f = n !== -1;
            }
            if (!f)
              this.client.echo("Button '" + tmp + "' not found.", -7, -8, true, true);
            else {
              if (items[n].name.length === 0 && items[n].caption.length === 0)
                this.client.echo("Button '" + tmp + "' removed.", -7, -8, true, true);
              else
                this.client.echo("Button '" + (items[n].name || items[n].caption) + "' removed.", -7, -8, true, true);
              n = profile.buttons.indexOf(items[n]);
              profile.buttons.splice(n, 1);
              this.client.saveProfiles();
              if (reload)
                this.client.clearCache();
              this.emit("item-removed", "button", profile.name, n);
              profile = null;
            }
          }
          return null;
        //#endregion button
        case "alarm":
        case "ala":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          profile = null;
          name2 = null;
          reload = true;
          n = false;
          if (args.length < 2 || args.length > 4)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "ala\x1B[0;-11;-12mrm name {timepattern} {commands} \x1B[3mprofile\x1B[0;-11;-12m, \x1B[4m" + cmdChar + "ala\x1B[0;-11;-12mrm name {timepattern} \x1B[3mprofile\x1B[0;-11;-12m, or \x1B[4m" + cmdChar + "ala\x1B[0;-11;-12mrm {timepattern} {commands} \x1B[3mprofile\x1B[0;-11;-12m");
          if (args[0].length === 0)
            throw new Error("Invalid name or timepattern");
          if (args[0].match(/^\{.*\}$/g)) {
            if (args.length > 3)
              throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "ala\x1B[0;-11;-12mrm {timepattern} {commands} profile");
            args[0] = args[0].substr(1, args[0].length - 2);
            args[0] = this.parseInline(args[0]);
            if (args[1].match(/^\{[\s\S]*\}$/g))
              args[1] = args[1].substr(1, args[1].length - 2);
            if (args.length === 3) {
              profile = this.stripQuotes(args[2]);
              profile = this.parseInline(profile);
            }
            if (!profile || profile.length === 0)
              profile = this.client.activeProfile;
            else {
              if (this.client.profiles.contains(profile))
                profile = this.client.profiles.items[profile.toLowerCase()];
              else
                throw new Error("Profile not found: " + profile);
            }
            trigger = new Trigger();
            trigger.pattern = args[0];
            trigger.value = args[1];
            trigger.type = 3 /* Alarm */;
            profile.triggers.push(trigger);
            this.client.saveProfiles();
            if (reload) {
              this._lastSuspend = -1;
              this.client.updateAlarms();
            }
            this.client.echo("Alarm '" + trigger.pattern + "' added.", -7, -8, true, true);
            this.emit("item-added", "trigger", profile.name, trigger);
            profile = null;
            return null;
          }
          name2 = this.stripQuotes(args[0]);
          if (!name2 || name2.length === 0)
            throw new Error("Invalid alarm name");
          name2 = this.parseInline(name2);
          let pattern = args[1];
          let commands = null;
          if (pattern.match(/^\{.*\}$/g))
            pattern = pattern.substr(1, pattern.length - 2);
          pattern = this.parseInline(pattern);
          if (args.length === 3) {
            if (args[2].match(/^\{[\s\S]*\}$/g))
              commands = args[2].substr(1, args[2].length - 2);
            else
              profile = this.stripQuotes(args[2]);
          } else if (args.length === 4) {
            commands = args[2];
            profile = this.stripQuotes(args[3]);
            if (commands.match(/^\{[\s\S]*\}$/g))
              commands = commands.substr(1, commands.length - 2);
          }
          if (!profile || profile.length === 0) {
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0)
              return null;
            if (kl === 1) {
              if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                throw Error("No enabled profiles found!");
              profile = this.client.profiles.items[keys[0]];
              trigger = profile.find("triggers", "name", name2);
              if (!trigger && !commands)
                throw new Error("Alarm not found!");
              else if (!trigger) {
                trigger = new Trigger();
                trigger.name = name2;
                profile.triggers.push(trigger);
                this.client.echo("Alarm '" + trigger.name + "' added.", -7, -8, true, true);
                n = true;
              } else
                this.client.echo("Alarm '" + trigger.name + "' updated.", -7, -8, true, true);
            } else {
              for (; k < kl; k++) {
                if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                  continue;
                trigger = this.client.profiles.items[keys[k]].find("triggers", "name", name2);
                if (trigger) {
                  profile = this.client.profiles.items[keys[k]];
                  break;
                }
              }
              if (!profile && !commands)
                throw new Error("Alarm not found!");
              if (!profile)
                profile = this.client.activeProfile;
              if (!trigger) {
                trigger = new Trigger();
                n = true;
                trigger.name = name2;
                profile.triggers.push(trigger);
                this.client.echo("Alarm '" + trigger.name + "' added.", -7, -8, true, true);
              } else
                this.client.echo("Alarm '" + trigger.name + "' updated.", -7, -8, true, true);
            }
          } else {
            profile = this.parseInline(profile);
            if (this.client.profiles.contains(profile))
              profile = this.client.profiles.items[profile.toLowerCase()];
            else
              throw new Error("Profile not found: " + profile);
            trigger = profile.find("triggers", "name", name2);
            if (!trigger && !commands)
              throw new Error("Alarm not found!");
            else if (!trigger) {
              trigger = new Trigger();
              trigger.name = name2;
              profile.triggers.push(trigger);
              n = true;
              this.client.echo("Alarm '" + trigger.name + "' added.", -7, -8, true, true);
            } else
              this.client.echo("Alarm '" + trigger.name + "' updated.", -7, -8, true, true);
          }
          trigger.pattern = pattern;
          trigger.type = 3 /* Alarm */;
          if (commands)
            trigger.value = commands;
          this.client.saveProfiles();
          if (n)
            this.emit("item-added", "trigger", profile.name, trigger);
          else
            this.emit("item-updated", "trigger", profile.name, profile.triggers.indexOf(trigger), trigger);
          profile = null;
          if (reload) {
            this._lastSuspend = -1;
            this.client.updateAlarms();
          }
          return null;
        //#endregion alarm
        case "ungag":
        case "ung":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length > 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "ung\x1B[0;-11;-12mag number or \x1B[4m" + cmdChar + "ung\x1B[0;-11;-12mag");
          if (this._gagID.length) {
            clearTimeout(this._gagID.pop());
            this._gags.pop();
          }
          this._gag = 0;
          return null;
        case "gag":
        case "ga":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0) {
            if (this._gags.length && this._gags[this._gags.length - 1] == this.client.display.lines.length) {
              this._gag = 0;
              this._gags.pop();
            }
            this._gags.push(this.client.display.lines.length);
            this._gagID.push(setTimeout(() => {
              n = this.adjustLastLine(this._gags.pop());
              if (this._gags.length) {
                let gl = this._gags.length;
                while (gl >= 0) {
                  gl--;
                  if (this._gags[gl] > n)
                    this._gags[gl]--;
                }
              }
              this.client.display.removeLine(n);
            }, 0));
            this._gag = 0;
            return null;
          } else if (args.length > 1)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "ga\x1B[0;-11;-12mg number or \x1B[4m" + cmdChar + "ga\x1B[0;-11;-12mg");
          i = parseInt(args[0], 10);
          if (isNaN(i))
            throw new Error("Invalid number '" + args[0] + "'");
          if (this._gags.length && this._gags[this._gags.length - 1] == this.client.display.lines.length) {
            this._gag = 0;
            this._gags.pop();
          }
          this._gags.push(this.client.display.lines.length);
          if (i >= 0) {
            this._gagID.push(setTimeout(() => {
              n = this.adjustLastLine(this._gags.pop());
              if (this._gags.length) {
                let gl = this._gags.length;
                while (gl >= 0) {
                  gl--;
                  if (this._gags[gl] > n)
                    this._gags[gl]--;
                }
              }
              this.client.display.removeLine(n);
              this._gag = i;
            }, 0));
            this._gag = 0;
          } else {
            this._gagID.push(setTimeout(() => {
              n = this.adjustLastLine(this._gags.pop());
              i *= -1;
              if (i > this.client.display.lines.length)
                i = this.client.display.lines.length;
              this.client.display.removeLines(n - i, i);
              this._gag = 0;
            }, 0));
            this._gag = 0;
          }
          return null;
        //#endregion gag
        case "wait":
        case "wa":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = args.filter((a) => a);
          if (args.length === 0 || args.length > 1)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "wa\x1B[0;-11;-12mit number");
          i = parseInt(this.parseInline(args[0]), 10);
          if (isNaN(i))
            throw new Error("Invalid number '" + i + "' for wait");
          if (i < 1)
            throw new Error("Must be greater then zero for wait");
          return i;
        case "showclient":
        case "showcl":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.show();
          return null;
        case "hideclient":
        case "hidecl":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.hide();
          return null;
        case "toggleclient":
        case "togglecl":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.toggle();
          return null;
        case "raiseevent":
        case "raise":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (this.client.getOption("parseDoubleQuotes"))
            args.forEach((a) => {
              return a.replace(/^\"(.*)\"$/g, (v, e, w) => {
                return e.replace(/\\\"/g, '"');
              });
            });
          if (this.client.getOption("parseSingleQuotes"))
            args.forEach((a) => {
              return a.replace(/^\'(.*)\'$/g, (v, e, w) => {
                return e.replace(/\\\'/g, "'");
              });
            });
          if (args.length === 0)
            throw new Error("Invalid syntax use " + cmdChar + "\x1B[4mraise\x1B[0;-11;-12mevent name or " + cmdChar + "\x1B[4mraise\x1B[0;-11;-12mevent name arguments");
          else if (args.length === 1)
            this.client.raise(args[0]);
          else
            this.client.raise(args[0], args.slice(1));
          return null;
        case "window":
        case "win":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (this.client.getOption("parseDoubleQuotes"))
            args.forEach((a) => {
              return a.replace(/^\"(.*)\"$/g, (v, e, w) => {
                return e.replace(/\\\"/g, '"');
              });
            });
          if (this.client.getOption("parseSingleQuotes"))
            args.forEach((a) => {
              return a.replace(/^\'(.*)\'$/g, (v, e, w) => {
                return e.replace(/\\\'/g, "'");
              });
            });
          if (args.length === 0 || args.length > 3)
            throw new Error("Invalid syntax use " + cmdChar + "\x1B[4mwin\x1B[0;-11;-12mdow name \x1B[3mclose\x1B[0;-11;-12m or " + cmdChar + "\x1B[4mwin\x1B[0;-11;-12mdow new \x1B[3mcharacter\x1B[0;-11;-12m");
          else if (args.length === 3)
            this.client.emit("window", this.stripQuotes(this.parseInline(args[0])), this.stripQuotes(this.parseInline(args[1])), this.stripQuotes(this.parseInline(args.slice(2).join(" "))));
          else if (args.length === 1)
            this.client.emit("window", this.stripQuotes(this.parseInline(args[0])));
          else
            this.client.emit("window", this.stripQuotes(this.parseInline(args[0])), this.stripQuotes(this.parseInline(args.slice(1).join(" "))));
          return null;
        case "raisedelayed":
        case "raisede":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "raisede\x1B[0;-11;-12mlayed milliseconds name or \x1B[4m" + cmdChar + "raisede\x1B[0;-11;-12mlayed milliseconds name arguments");
          i = parseInt(this.stripQuotes(this.parseInline(args[0])), 10);
          if (isNaN(i))
            throw new Error("Invalid number '" + args[0] + "' for raisedelayed");
          if (i < 1)
            throw new Error("Must be greater then zero for raisedelayed");
          args.shift();
          if (this.client.getOption("parseDoubleQuotes"))
            args.forEach((a) => {
              return a.replace(/^\"(.*)\"$/g, (v, e, w) => {
                return e.replace(/\\\"/g, '"');
              });
            });
          if (this.client.getOption("parseSingleQuotes"))
            args.forEach((a) => {
              return a.replace(/^\'(.*)\'$/g, (v, e, w) => {
                return e.replace(/\\\'/g, "'");
              });
            });
          if (args.length === 1)
            this.client.raise(args[0], 0, i);
          else
            this.client.raise(args[0], args.slice(1), i);
          return null;
        case "notify":
        case "not":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "not\x1B[0;-11;-12mify title \x1B[3mmessage icon\x1B[0;-11;-12m");
          else {
            args[0] = this.stripQuotes(args[0]);
            if (args[args.length - 1].match(/^\{.*\}$/g)) {
              item = args.pop();
              n = { icon: this.parseInline(item.substr(1, item.length - 2)) };
            }
            if (args.length === 0)
              throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "not\x1B[0;-11;-12mify title \x1B[3mmessage icon\x1B[0;-11;-12m");
            if (args.length === 1)
              this.client.notify(this.parseInline(this.stripQuotes(args[0])), null, n);
            else
              this.client.notify(this.parseInline(this.stripQuotes(args[0])), this.parseInline(args.slice(1).join(" ")), n);
          }
          return null;
        case "idle":
        case "idletime":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (!this.client.lastSendTime)
            this.client.echo("Not connected", -7, -8, true, true);
          else
            this.client.echo("You have been idle: " + getTimeSpan(Date.now() - this.client.lastSendTime), -7, -8, true, true);
          return null;
        case "connect":
        case "connecttime":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (!this.client.connectTime) {
            if (!moment && this.client.disconnectTime)
              this.client.echo("Disconnected since: " + new Date(this.client.disconnectTime).toLocaleString(), -7, -8, true, true);
            else if (this.client.disconnectTime)
              this.client.echo("Disconnected since: " + new moment(this.client.disconnectTime).format("MM/DD/YYYY hh:mm:ss A"), -7, -8, true, true);
            else
              this.client.echo("Not connected", -7, -8, true, true);
          } else
            this.client.echo("You have been connected: " + getTimeSpan(Date.now() - this.client.connectTime), -7, -8, true, true);
          return null;
        case "beep":
        case "be":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.beep();
          return null;
        case "version":
        case "ve":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.echo(this.client.telnet.terminal + " v" + this.client.version, -7, -8, true, true);
          return null;
        case "showprompt":
        case "showp":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = this.parseInline(args.join(" "));
          this.client.telnet.receivedData(StringToUint8Array(args), true, true);
          this.client.telnet.prompt = true;
          return null;
        case "show":
        case "sh":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = this.parseInline(args.join(" ") + "\n");
          this.client.telnet.receivedData(StringToUint8Array(args), true, true);
          return null;
        case "sayprompt":
        case "sayp":
        case "echoprompt":
        case "echop":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = this.parseInline(args.join(" "));
          this.client.print("\x1B[-7;-8m" + args + "\x1B[0m", false);
          return null;
        case "say":
        case "sa":
        case "echo":
        case "ec":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = this.parseInline(args.join(" "));
          if (this.client.telnet.prompt)
            this.client.print("\n\x1B[-7;-8m" + args + "\x1B[0m\n", false);
          else
            this.client.print("\x1B[-7;-8m" + args + "\x1B[0m\n", false);
          this.client.telnet.prompt = false;
          return null;
        case "print":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          i = this.client.enableTriggers;
          this.client.enableTriggers = false;
          args = this.parseInline(args.join(" "));
          if (this.client.telnet.prompt)
            this.client.print("\n\x1B[-7;-8m" + args + "\x1B[0m\n", false);
          else
            this.client.print("\x1B[-7;-8m" + args + "\x1B[0m\n", false);
          this.client.telnet.prompt = false;
          this.client.enableTriggers = i;
          return null;
        case "printprompt":
        case "printp":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          i = this.client.enableTriggers;
          this.client.enableTriggers = false;
          args = this.parseInline(args.join(" "));
          this.client.print("\x1B[-7;-8m" + args + "\x1B[0m", false);
          this.client.enableTriggers = i;
          return null;
        case "alias":
        case "al":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "al\x1B[0;-11;-12mias name value or \x1B[4m" + cmdChar + "al\x1B[0;-11;-12mias name {value} \x1B[3mprofile\x1B[0;-11;-12m");
          else if (args.length === 1)
            throw new Error("Must supply an alias value");
          else {
            n = this.parseInline(this.stripQuotes(args.shift()));
            reload = true;
            profile = null;
            if (args[0].match(/^\{.*\}$/g) || args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g)) {
              if (args.length > 2)
                throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "al\x1B[0;-11;-12mias name value or \x1B[4m" + cmdChar + "al\x1B[0;-11;-12mias name {value} \x1B[3mprofile\x1B[0;-11;-12m");
              if (args.length === 2) {
                profile = this.parseInline(this.stripQuotes(args[1]));
                if (this.client.profiles.contains(profile))
                  profile = this.client.profiles.items[profile.toLowerCase()];
                else
                  throw new Error("Profile not found: " + profile);
              } else
                profile = this.client.activeProfile;
              if (args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g))
                args = this.parseInline(this.stripQuotes(args[0]));
              else
                args = this.parseInline(args[0].substr(1, args[0].length - 2));
            } else {
              args = args.join(" ");
              profile = this.client.activeProfile;
            }
            items = profile.aliases;
            args = this.stripQuotes(args);
            if (/^\s*?\d+\s*?$/.exec(n)) {
              n = parseInt(n, 10);
              if (n < 0 || n >= items.length)
                throw new Error("Alias index must be >= 0 and < " + items.length);
              else {
                items[n].value = args;
                this.client.echo("Alias '" + items[n].pattern + "' updated.", -7, -8, true, true);
              }
            } else {
              for (i = 0, al = items.length; i < al; i++) {
                if (items[i]["pattern"] === n) {
                  items[i].value = args;
                  this.client.echo("Alias '" + n + "' updated.", -7, -8, true, true);
                  this.emit("item-updated", "alias", profile.name, i, tmp);
                  f = true;
                  break;
                }
              }
              if (!f) {
                tmp = new Alias(n, args);
                items.push(tmp);
                this.emit("item-added", "alias", profile.name, tmp);
                this.client.echo("Alias '" + n + "' added.", -7, -8, true, true);
              }
            }
            profile.aliases = items;
            this.client.saveProfiles();
            profile = null;
            if (reload)
              this.client.clearCache();
          }
          return null;
        case "unalias":
        case "una":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "una\x1B[0;-11;-12mlias name or \x1B[4m" + cmdChar + "una\x1B[0;-11;-12mlias {name} \x1B[3mprofile\x1B[0;-11;-12m");
          else {
            reload = true;
            profile = null;
            if (args[0].match(/^\{.*\}$/g) || args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g)) {
              if (args.length > 2)
                throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "una\x1B[0;-11;-12mlias name or \x1B[4m" + cmdChar + "una\x1B[0;-11;-12mlias {name} \x1B[3mprofile\x1B[0;-11;-12m");
              if (args.length === 2) {
                profile = this.stripQuotes(args[1]);
                profile = this.parseInline(profile);
                if (this.client.profiles.contains(profile))
                  profile = this.client.profiles.items[profile.toLowerCase()];
                else
                  throw new Error("Profile not found: " + profile);
              } else
                profile = this.client.activeProfile;
              if (args[0].match(/^".*"$/g) || args[0].match(/^'.*'$/g))
                n = this.parseInline(this.stripQuotes(args[0]));
              else
                n = this.parseInline(args[0].substr(1, args[0].length - 2));
            } else {
              n = this.parseInline(args.join(" "));
              profile = this.client.activeProfile;
            }
            items = profile.aliases;
            n = this.stripQuotes(n);
            if (/^\s*?\d+\s*?$/.exec(n)) {
              tmp = n;
              n = parseInt(n, 10);
              if (n < 0 || n >= items.length)
                throw new Error("Alias index must be >= 0 and < " + items.length);
              else
                f = true;
            } else {
              tmp = n;
              n = items.findIndex((i2) => i2.pattern === n);
              f = n !== -1;
            }
            if (!f)
              this.client.echo("Alias '" + tmp + "' not found.", -7, -8, true, true);
            else {
              this.client.echo("Alias '" + items[n].pattern + "' removed.", -7, -8, true, true);
              items.splice(n, 1);
              profile.aliases = items;
              this.client.saveProfiles();
              if (reload)
                this.client.clearCache();
              profile = null;
              this.emit("item-removed", "alias", profile.name, n);
            }
          }
          return null;
        case "setsetting":
        case "sets":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "sets\x1B[0;-11;-12metting name value");
          else if (args.length === 1)
            throw new Error("Must supply a setsetting value");
          else {
            n = this.stripQuotes(this.parseInline(args[0]));
            args = this.stripQuotes(this.parseInline(args.slice(1).join(" ")));
            if (/^\s*?\d+\s*?$/.exec(n)) {
              tmp = n;
              n = parseInt(n, 10);
              if (n < 0 || n >= SettingList.length)
                throw new Error("Setting index must be >= 0 and < " + SettingList.length);
              f = true;
            } else {
              n = n.toLowerCase();
              for (i = 0, al = SettingList.length; i < al; i++) {
                if (SettingList[i][0].toLowerCase() === n) {
                  n = i;
                  f = true;
                  break;
                }
              }
            }
            if (!f)
              throw new Error("Unknown setting '" + tmp + "'");
            else {
              switch (SettingList[n][2]) {
                case 0:
                  if (SettingList[n][4] > 0 && args.length > SettingList[n][4])
                    throw new Error("String can not be longer then " + SettingList[n][4] + " characters");
                  else {
                    this.client.setOption(SettingList[n][1] || SettingList[n][0], args);
                    this.client.echo("Setting '" + SettingList[n][0] + "' set to '" + args + "'.", -7, -8, true, true);
                    this.client.loadOptions();
                  }
                  break;
                case 1:
                case 3:
                  switch (args.toLowerCase()) {
                    case "true":
                    case "1":
                    case "yes":
                      this.client.setOption(SettingList[n][1] || SettingList[n][0], true);
                      this.client.echo("Setting '" + SettingList[n][0] + "' set to true.", -7, -8, true, true);
                      this.client.loadOptions();
                      break;
                    case "no":
                    case "false":
                    case "0":
                      this.client.setOption(SettingList[n][1] || SettingList[n][0], false);
                      this.client.echo("Setting '" + SettingList[n][0] + "' set to false.", -7, -8, true, true);
                      this.client.loadOptions();
                      break;
                    case "toggle":
                      args = this.client.getOption(SettingList[n][1] || SettingList[n][0]) ? false : true;
                      this.client.setOption(SettingList[n][1] || SettingList[n][0], args);
                      this.client.echo("Setting '" + SettingList[n][0] + "' set to " + args + ".", -7, -8, true, true);
                      this.client.loadOptions();
                      break;
                    default:
                      throw new Error("Invalid value, must be true or false");
                  }
                  break;
                case 2:
                  i = parseInt(args, 10);
                  if (isNaN(i))
                    throw new Error("Invalid number '" + args + "'");
                  else {
                    this.client.setOption(SettingList[n][1] || SettingList[n][0], i);
                    this.client.echo("Setting '" + SettingList[n][0] + "' set to '" + i + "'.", -7, -8, true, true);
                    this.client.loadOptions();
                  }
                  break;
                case 4:
                case 5:
                  throw new Error("Unsupported setting '" + n + "'");
              }
            }
          }
          return null;
        case "getsetting":
        case "gets":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "gets\x1B[0;-11;-12metting name");
          else {
            n = this.stripQuotes(this.parseInline(args.join(" ")));
            if (/^\s*?\d+\s*?$/.exec(n)) {
              n = parseInt(n, 10);
              if (n < 0 || n >= SettingList.length)
                throw new Error("Setting index must be >= 0 and < " + SettingList.length);
              else
                f = true;
            } else {
              tmp = n;
              n = n.toLowerCase();
              if (n !== "all") {
                for (i = 0, al = SettingList.length; i < al; i++) {
                  if (SettingList[i][0].toLowerCase() === n) {
                    n = i;
                    f = true;
                    break;
                  }
                }
              }
              if (n === "all") {
                tmp = "Current settings:\n";
                for (i = 0, al = SettingList.length; i < al; i++) {
                  switch (SettingList[i][2]) {
                    case 0:
                    case 2:
                      tmp += "    " + SettingList[i][0] + ": " + this.client.getOption(SettingList[n][1] || SettingList[n][0]) + "\n";
                      break;
                    case 1:
                    case 3:
                      if (this.client.getOption(SettingList[n][1] || SettingList[n][0]))
                        tmp += "    " + SettingList[i][0] + ": true\n";
                      else
                        tmp += "    " + SettingList[i][0] + ": false\n";
                      break;
                  }
                }
                this.client.echo(tmp, -7, -8, true, true);
              } else if (!f)
                throw new Error("Unknown setting '" + n + "'");
              else {
                switch (SettingList[n][2]) {
                  case 0:
                  case 2:
                    this.client.echo("Setting '" + SettingList[n][0] + "' is '" + this.client.getOption(SettingList[n][1] || SettingList[n][0]) + "'", -7, -8, true, true);
                    break;
                  case 1:
                  case 3:
                    if (this.client.getOption(SettingList[n][1] || SettingList[n][0]))
                      this.client.echo("Setting '" + SettingList[n][0] + "' is true", -7, -8, true, true);
                    else
                      this.client.echo("Setting '" + SettingList[n][0] + "' is false", -7, -8, true, true);
                    break;
                }
              }
            }
          }
          return null;
        case "profilelist":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.echo("\x1B[4mProfiles:\x1B[0m", -7, -8, true, true);
          const files = this.client.profiles.keys;
          al = files.length;
          for (i = 0; i < al; i++) {
            if (this.client.profiles.items[files[i]] && this.client.profiles.items[files[i]].enabled)
              this.client.echo("   " + this.client.profiles.keys[i] + " is enabled", -7, -8, true, true);
            else
              this.client.echo("   " + files[i] + " is disabled", -7, -8, true, true);
          }
          return null;
        case "profile":
        case "pro":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "pro\x1B[0;-11;-12mfile name or \x1B[4m" + cmdChar + "pro\x1B[0;-11;-12mfile name enable/disable");
          else if (args.length === 1) {
            args[0] = this.parseInline(args[0]);
            this.client.toggleProfile(args[0]);
            if (!this.client.profiles.contains(args[0]))
              throw new Error("Profile not found");
            else if (this.client.profiles.length === 1)
              throw new Error(args[0] + " can not be disabled as it is the only one enabled");
            if (!this.client.profiles.contains(args[0].toLowerCase()))
              args = "Profile not found";
            else if (this.client.profiles.items[args[0].toLowerCase()].enabled)
              args = args[0] + " is enabled";
            else
              args = args[0] + " is disabled";
          } else {
            args[0] = this.parseInline(args[0]).toLowerCase();
            if (!this.client.profiles.contains(args[0]))
              throw new Error("Profile not found");
            if (!args[1])
              throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "pro\x1B[0;-11;-12mfile name or \x1B[4m" + cmdChar + "pro\x1B[0;-11;-12mfile name enable/disable");
            args[1] = this.parseInline(args[1]);
            switch (args[1].toLowerCase()) {
              case "enable":
              case "on":
              case "yes":
                if (this.client.profiles.items[args[0].toLowerCase()].enabled)
                  args = args[0] + " is already enabled";
                else {
                  this.client.toggleProfile(args[0]);
                  if (this.client.profiles.items[args[0].toLowerCase()].enabled !== -1)
                    args = args[0] + " is enabled";
                  else
                    args = args[0] + " remains disabled";
                }
                break;
              case "disable":
              case "off":
              case "no":
                if (!this.client.profiles.items[args[0].toLowerCase()].enabled)
                  args = args[0] + " is already disabled";
                else {
                  if (this.client.profiles.length === 1)
                    throw new Error(args[0] + " can not be disabled as it is the only one enabled");
                  this.client.toggleProfile(args[0]);
                  args = args[0] + " is disabled";
                }
                break;
              default:
                throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "pro\x1B[0;-11;-12mfile name or \x1B[4m" + cmdChar + "pro\x1B[0;-11;-12mfile name enable/disable");
            }
          }
          if (this.client.telnet.prompt)
            this.client.print("\n\x1B[-7;-8m" + args + "\x1B[0m\n", false);
          else
            this.client.print("\x1B[-7;-8m" + args + "\x1B[0m\n", false);
          this.client.telnet.prompt = false;
          return null;
        case "color":
        case "co":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length > 1 && args.length < 4) {
            item = {
              profile: null,
              pattern: null,
              commands: null
            };
            item.pattern = args.shift();
            if (item.pattern.match(/^\{.*\}$/g))
              item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
            else
              item.pattern = this.parseInline(this.stripQuotes(item.pattern));
            if (args.length === 2) {
              item.commands = cmdChar + "COLOR " + this.parseInline(args[0]);
              item.profile = this.stripQuotes(args[1]);
              if (item.profile.length !== 0)
                item.profile = this.parseInline(item.profile);
            } else
              item.commands = cmdChar + "COLOR " + this.parseInline(args[0]);
            this.createTrigger(item.pattern, item.commands, item.profile);
            return null;
          } else if (args.length !== 1)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "co\x1B[0;-11;-12mlor color or \x1B[4m" + cmdChar + "co\x1B[0;-11;-12mlor {pattern} color \x1B[3mprofile\x1B[0;-11;-12m");
          if (args.length !== 1)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "co\x1B[0;-11;-12mlor color or \x1B[4m" + cmdChar + "co\x1B[0;-11;-12mlor {pattern} color \x1B[3mprofile\x1B[0;-11;-12m");
          args[0] = this.parseInline(this.stripQuotes(args[0]));
          n = this.client.display.lines.length;
          if (args[0].trim().match(/^[-|+]?\d+$/g)) {
            setTimeout(() => {
              n = this.adjustLastLine(n);
              this.client.display.colorSubStrByLine(n, parseInt(args[0], 10));
            }, 0);
          } else if (args[0].trim().match(/^[-|+]?\d+\s*?,\s*?[-|+]?\d+$/g)) {
            args[0] = args[0].split(",");
            setTimeout(() => {
              n = this.adjustLastLine(n);
              this.client.display.colorSubStrByLine(n, parseInt(args[0][0], 10), parseInt(args[0][1], 10));
            }, 0);
          } else {
            args = args[0].toLowerCase().split(",");
            if (args.length === 1) {
              if (args[0] === "bold")
                i = 370;
              if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              setTimeout(() => {
                n = this.adjustLastLine(n);
                this.client.display.colorSubStrByLine(n, i);
              }, 0);
            } else if (args.length === 2) {
              if (args[0] === "bold" && args[1] === "bold")
                throw new Error("Invalid fore color");
              if (args[0] === "bold")
                i = 370;
              else if (args[0] === "current")
                i = null;
              else if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              if (args[1] === "bold") {
                setTimeout(() => {
                  n = this.adjustLastLine(n);
                  if (i === 370)
                    this.client.display.colorSubStrByLine(n, i);
                  else
                    this.client.display.colorSubStrByLine(n, i * 10);
                }, 0);
              } else {
                p = i;
                if (args[1].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                  i = args[1].trim();
                else if (args[1].trim().match(/^[-|+]?\d+$/g))
                  i = parseInt(args[1].trim(), 10);
                else {
                  i = getAnsiColorCode(args[1], true);
                  if (i === -1) {
                    if (isMXPColor(args[1]))
                      i = args[1];
                    else
                      throw new Error("Invalid back color");
                  }
                }
                setTimeout(() => {
                  n = this.adjustLastLine(n);
                  this.client.display.colorSubStrByLine(n, p, i);
                }, 0);
              }
            } else if (args.length === 3) {
              if (args[0] === "bold") {
                args.shift();
                args.push("bold");
              }
              if (args[0].trim() === "current")
                i = null;
              else if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              if (args[2] !== "bold")
                throw new Error("Only bold is supported as third argument");
              else if (!i)
                i = 370;
              else
                p = i * 10;
              if (args[1].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[1].trim();
              else if (args[1].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[1].trim(), 10);
              else {
                i = getAnsiColorCode(args[1], true);
                if (i === -1) {
                  if (isMXPColor(args[1]))
                    i = args[0];
                  else
                    throw new Error("Invalid back color");
                }
              }
              setTimeout(() => {
                n = this.adjustLastLine(n);
                this.client.display.colorSubStrByLine(n, p, i);
              }, 0);
            }
          }
          return null;
        case "cw":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          trigger = this.stack.regex;
          if (args.length > 1 && args.length < 4) {
            item = {
              profile: null,
              pattern: null,
              commands: null
            };
            item.pattern = args.shift();
            if (item.pattern.match(/^\{.*\}$/g))
              item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
            else
              item.pattern = this.parseInline(this.stripQuotes(item.pattern));
            if (args.length === 2) {
              item.commands = cmdChar + "CW " + this.parseInline(args[0]);
              item.profile = this.stripQuotes(args[1]);
              if (item.profile.length !== 0)
                item.profile = this.parseInline(item.profile);
            } else
              item.commands = cmdChar + "CW " + this.parseInline(args[0]);
            this.createTrigger(item.pattern, item.commands, item.profile);
            return null;
          } else if (args.length !== 1)
            throw new Error("Invalid syntax use " + cmdChar + "cw color or " + cmdChar + "cw {pattern} color \x1B[3mprofile\x1B[0;-11;-12m");
          if (!trigger) return null;
          args[0] = this.parseInline(this.stripQuotes(args[0]));
          n = this.client.display.lines.length;
          if (args[0].trim().match(/^[-|+]?\d+$/g)) {
            setTimeout(() => {
              n = this.adjustLastLine(n);
              if (trigger.length === 1)
                this.client.display.colorSubStrByLine(n, parseInt(args[0], 10));
              else {
                trigger[1].lastIndex = 0;
                tmp = trigger[0].matchAll(trigger[1]);
                for (const match of tmp) {
                  this.client.display.colorSubStrByLine(n, parseInt(args[0], 10), null, match.index, match[0].length);
                }
              }
            }, 0);
          } else if (args[0].trim().match(/^[-|+]?\d+,[-|+]?\d+$/g)) {
            args[0] = args[0].split(",");
            setTimeout(() => {
              n = this.adjustLastLine(n);
              if (trigger.length === 1)
                this.client.display.colorSubStrByLine(n, parseInt(args[0][0], 10), parseInt(args[0][1], 10));
              else {
                trigger[1].lastIndex = 0;
                tmp = trigger[0].matchAll(trigger[1]);
                for (const match of tmp) {
                  this.client.display.colorSubStrByLine(n, parseInt(args[0], 10), parseInt(args[0][1], 10), match.index, match[0].length);
                }
              }
            }, 0);
          } else {
            args = args[0].toLowerCase().split(",");
            if (args.length === 1) {
              if (args[0] === "bold")
                i = 370;
              if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              setTimeout(() => {
                n = this.adjustLastLine(n);
                if (trigger.length === 1)
                  this.client.display.colorSubStrByLine(n, i);
                else {
                  trigger[1].lastIndex = 0;
                  tmp = trigger[0].matchAll(trigger[1]);
                  for (const match of tmp) {
                    this.client.display.colorSubStrByLine(n, i, null, match.index, match[0].length);
                  }
                }
              }, 0);
            } else if (args.length === 2) {
              if (args[0] === "bold" && args[1] === "bold")
                throw new Error("Invalid fore color");
              if (args[0] === "bold")
                i = 370;
              else if (args[0] === "current")
                i = null;
              else if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              if (args[1] === "bold") {
                setTimeout(() => {
                  n = this.adjustLastLine(n);
                  if (i !== 370)
                    i *= 10;
                  if (trigger.length === 1)
                    this.client.display.colorSubStrByLine(n, i);
                  else {
                    trigger[1].lastIndex = 0;
                    tmp = trigger[0].matchAll(trigger[1]);
                    for (const match of tmp) {
                      this.client.display.colorSubStrByLine(n, i, null, match.index, match[0].length);
                    }
                  }
                }, 0);
              } else {
                p = i;
                if (args[1].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                  i = args[1].trim();
                else if (args[1].trim().match(/^[-|+]?\d+$/g))
                  i = parseInt(args[1].trim(), 10);
                else {
                  i = getAnsiColorCode(args[1], true);
                  if (i === -1) {
                    if (isMXPColor(args[1]))
                      i = args[1];
                    else
                      throw new Error("Invalid back color");
                  }
                }
                setTimeout(() => {
                  n = this.adjustLastLine(n);
                  if (trigger.length === 1)
                    this.client.display.colorSubStrByLine(n, p, i);
                  else {
                    trigger[1].lastIndex = 0;
                    tmp = trigger[0].matchAll(trigger[1]);
                    for (const match of tmp) {
                      this.client.display.colorSubStrByLine(n, p, i, match.index, match[0].length);
                    }
                  }
                }, 0);
              }
            } else if (args.length === 3) {
              if (args[0] === "bold") {
                args.shift();
                args.push("bold");
              }
              if (args[0].trim() === "current")
                i = null;
              else if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              if (args[2] !== "bold")
                throw new Error("Only bold is supported as third argument");
              else if (!i)
                i = 370;
              else
                p = i * 10;
              if (args[1].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[1].trim();
              else if (args[1].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[1].trim(), 10);
              else {
                i = getAnsiColorCode(args[1], true);
                if (i === -1) {
                  if (isMXPColor(args[1]))
                    i = args[0];
                  else
                    throw new Error("Invalid back color");
                }
              }
              setTimeout(() => {
                n = this.adjustLastLine(n);
                if (trigger.length === 1)
                  this.client.display.colorSubStrByLine(n, p, i);
                else {
                  trigger[1].lastIndex = 0;
                  tmp = trigger[0].matchAll(trigger[1]);
                  for (const match of tmp) {
                    this.client.display.colorSubStrByLine(n, p, i, match.index, match[0].length);
                  }
                }
              }, 0);
            }
          }
          return null;
        case "pcol":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 1 || args.length > 5)
            throw new Error("Invalid syntax use " + cmdChar + "pcol color \x1B[3mXStart, XEnd, YStart, YEnd\x1B[0;-11;-12m");
          if (args.length > 1) {
            tmp = [].concat(...args.slice(1).map((s) => this.parseInline(this.stripQuotes(s)).split(" ")));
            if (tmp.length > 4)
              throw new Error("Too many arguments use " + cmdChar + "pcol color \x1B[3mXStart, XEnd, YStart, YEnd\x1B[0;-11;-12m");
            item = { xStart: 0 };
            if (tmp.length > 0)
              item.xStart = parseInt(tmp[0], 10);
            if (tmp.length > 1)
              item.xEnd = parseInt(tmp[1], 10);
            if (tmp.length > 2)
              item.yStart = parseInt(tmp[2], 10);
            if (tmp.length > 3)
              item.yEnd = parseInt(tmp[3], 10);
            if (item.hasOwnProperty("yEnd") && item.yEnd > item.yStart)
              throw new Error("yEnd must be smaller or equal to yStart");
            if (item.hasOwnProperty("xEnd") && item.xEnd < item.xStart)
              throw new Error("xEnd must be larger or equal to xStart");
          } else
            item = { xStart: 0 };
          args[0] = this.parseInline(this.stripQuotes(args[0]));
          n = this.adjustLastLine(this.client.display.lines.length);
          if (args[0].trim().match(/^[-|+]?\d+$/g)) {
            setTimeout(() => {
              this.colorPosition(n, parseInt(args[0], 10), null, item);
            }, 0);
          } else if (args[0].trim().match(/^[-|+]?\d+\s*?,\s*?[-|+]?\d+$/g)) {
            args[0] = args[0].split(",");
            setTimeout(() => {
              this.colorPosition(n, parseInt(args[0][0], 10), parseInt(args[0][1], 10), item);
            }, 0);
          } else {
            args = args[0].toLowerCase().split(",");
            if (args.length === 1) {
              if (args[0] === "bold")
                i = 370;
              if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              setTimeout(() => {
                this.colorPosition(n, i, null, item);
              }, 0);
            } else if (args.length === 2) {
              if (args[0] === "bold" && args[1] === "bold")
                throw new Error("Invalid fore color");
              if (args[0] === "bold")
                i = 370;
              else if (args[0] === "current")
                i = null;
              else if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              if (args[1] === "bold") {
                setTimeout(() => {
                  this.colorPosition(n, i === 370 ? i : i * 10, null, item);
                }, 0);
              } else {
                p = i;
                if (args[1].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                  i = args[1].trim();
                else if (args[1].trim().match(/^[-|+]?\d+$/g))
                  i = parseInt(args[1].trim(), 10);
                else {
                  i = getAnsiColorCode(args[1], true);
                  if (i === -1) {
                    if (isMXPColor(args[1]))
                      i = args[1];
                    else
                      throw new Error("Invalid back color");
                  }
                }
                setTimeout(() => {
                  this.colorPosition(n, p, i, item);
                }, 0);
              }
            } else if (args.length === 3) {
              if (args[0] === "bold") {
                args.shift();
                args.push("bold");
              }
              if (args[0].trim() === "current")
                i = null;
              else if (args[0].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[0].trim();
              else if (args[0].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[0].trim(), 10);
              else {
                i = getAnsiColorCode(args[0]);
                if (i === -1) {
                  if (isMXPColor(args[0]))
                    i = args[0];
                  else
                    throw new Error("Invalid fore color");
                }
              }
              if (args[2] !== "bold")
                throw new Error("Only bold is supported as third argument");
              else if (!i)
                i = 370;
              else
                p = i * 10;
              if (args[1].trim().match(/^#(?:[a-f0-9]{3}|[a-f0-9]{6})\b$/g))
                i = args[1].trim();
              else if (args[1].trim().match(/^[-|+]?\d+$/g))
                i = parseInt(args[1].trim(), 10);
              else {
                i = getAnsiColorCode(args[1], true);
                if (i === -1) {
                  if (isMXPColor(args[1]))
                    i = args[0];
                  else
                    throw new Error("Invalid back color");
                }
              }
              setTimeout(() => {
                this.colorPosition(n, p, i, item);
              }, 0);
            }
          }
          return null;
        case "highlight":
        case "hi":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length > 0 && args.length < 2) {
            item = {
              profile: null,
              pattern: null,
              commands: cmdChar + "HIGHLIGHT"
            };
            item.pattern = args.shift();
            if (item.pattern.match(/^\{.*\}$/g))
              item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
            else
              item.pattern = this.parseInline(this.stripQuotes(item.pattern));
            if (args.length === 1)
              item.profile = this.parseInline(this.stripQuotes(args[0]));
            this.createTrigger(item.pattern, item.commands, item.profile);
            return null;
          } else if (args.length)
            throw new Error("Too many arguments use \x1B[4m" + cmdChar + "hi\x1B[0;-11;-12mghlight \x1B[3mpattern profile\x1B[0;-11;-12m");
          n = this.client.display.lines.length;
          setTimeout(() => {
            n = this.adjustLastLine(n);
            this.client.display.highlightSubStrByLine(n);
          }, 0);
          return null;
        case "break":
        case "br":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "br\x1B[0;-11;-12meak\x1B[0;-11;-12m");
          if (!this.loops.length)
            throw new Error("\x1B[4m" + cmdChar + "br\x1B[0;-11;-12meak\x1B[0;-11;-12m must be used in a loop.");
          if (this.stack.break)
            this.stack.break++;
          else
            this.stack.break = 1;
          return -1;
        case "continue":
        case "cont":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "cont\x1B[0;-11;-12minue\x1B[0;-11;-12m");
          if (!this.loops.length)
            throw new Error("\x1B[4m" + cmdChar + "cont\x1B[0;-11;-12minue\x1B[0;-11;-12m must be used in a loop.");
          this.stack.continue = true;
          return -2;
        case "if":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (!args.length || args.length > 3)
            throw new Error("Invalid syntax use " + cmdChar + "if {expression} {true-command} \x1B[3m{false-command}\x1B[0;-11;-12m");
          if (args[0].match(/^\{[\s\S]*\}$/g))
            args[0] = args[0].substr(1, args[0].length - 2);
          tmp = null;
          if (this.evaluate(this.parseInline(args[0]))) {
            if (args[1].match(/^\{[\s\S]*\}$/g))
              args[1] = args[1].substr(1, args[1].length - 2);
            tmp = this.parseOutgoing(args[1]);
          } else if (args.length > 2) {
            if (args[2].match(/^\{[\s\S]*\}$/g))
              args[2] = args[2].substr(1, args[2].length - 2);
            tmp = this.parseOutgoing(args[2]);
          }
          if (tmp != null && tmp.length > 0)
            return tmp;
          return null;
        case "case":
        case "ca":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (!args.length || args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "ca\x1B[0;-11;-12mse\x1B[0;-11;-12m index {command 1} \x1B[3m{command n}\x1B[0;-11;-12m");
          if (args[0].match(/^\{[\s\S]*\}$/g))
            args[0] = args[0].substr(1, args[0].length - 2);
          n = this.evaluate(this.parseInline(args[0]));
          if (typeof n !== "number")
            return null;
          if (n > 0 && n < args.length) {
            if (args[n].match(/^\{[\s\S]*\}$/g))
              args[n] = args[n].substr(1, args[n].length - 2);
            tmp = this.parseOutgoing(args[n]);
            if (tmp != null && tmp.length > 0)
              return tmp;
          }
          return null;
        case "switch":
        case "sw":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (!args.length || args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "sw\x1B[0;-11;-12mitch\x1B[0;-11;-12m (expression) {command} \x1B[3m(expression) {command} ... {else_command}\x1B[0;-11;-12m");
          if (args.length % 2 === 1)
            n = args.pop();
          else
            n = null;
          al = args.length;
          for (i = 0; i < al; i += 2) {
            if (args[i].match(/^\{[\s\S]*\}$/g))
              args[i] = args[i].substr(1, args[i].length - 2);
            if (this.evaluate(this.parseInline(args[i]))) {
              if (args[i + 1].match(/^\{[\s\S]*\}$/g))
                args[i + 1] = args[i + 1].substr(1, args[i + 1].length - 2);
              tmp = this.parseOutgoing(args[i + 1]);
              if (tmp != null && tmp.length > 0)
                return tmp;
              return null;
            }
          }
          if (n) {
            if (n.match(/^\{[\s\S]*\}$/g))
              n = n.substr(1, n.length - 2);
            tmp = this.parseOutgoing(n);
            if (tmp != null && tmp.length > 0)
              return tmp;
          }
          return null;
        case "loop":
        case "loo":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "loo\x1B[0;-11;-12mp\x1B[0;-11;-12m range {commands}");
          n = this.parseInline(args.shift()).split(",");
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          if (n.length === 1) {
            tmp = parseInt(n[0], 10);
            if (isNaN(tmp))
              throw new Error("Invalid loop range '" + n[0] + "' must be a number");
            return this.executeForLoop(0, tmp, args);
          }
          tmp = parseInt(n[0], 10);
          if (isNaN(tmp))
            throw new Error("Invalid loop min '" + n[0] + "' must be a number");
          i = parseInt(n[1], 10);
          if (isNaN(i))
            throw new Error("Invalid loop max '" + n[1] + "' must be a number");
          if (tmp > i) tmp++;
          else tmp--;
          return this.executeForLoop(tmp, i, args);
        case "repeat":
        case "rep":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "rep\x1B[0;-11;-12meat\x1B[0;-11;-12m expression {commands}");
          i = args.shift();
          if (i.match(/^\{[\s\S]*\}$/g))
            i = i.substr(1, i.length - 2);
          i = this.evaluate(this.parseInline(i));
          if (typeof i !== "number")
            throw new Error("Arguments must be a number");
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          if (i < 1)
            return this.executeForLoop(-i + 1, 1, args);
          return this.executeForLoop(0, i, args);
        case "until":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use " + cmdChar + "until expression {commands}");
          i = args.shift();
          if (i.match(/^\{[\s\S]*\}$/g))
            i = i.substr(1, i.length - 2);
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          tmp = [];
          this.loops.push(0);
          while (!this.evaluate(this.parseInline(i))) {
            let out = this.parseOutgoing(args);
            if (out != null && out.length > 0)
              tmp.push(out);
            if (this.stack.continue) {
              this.stack.continue = false;
              continue;
            }
            if (this.stack.break) {
              this.stack.break--;
              break;
            }
          }
          this.loops.pop();
          if (tmp.length > 0)
            return tmp.map((v) => v.trim()).join("\n");
          return null;
        case "while":
        case "wh":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "wh\x1B[0;-11;-12mile expression {commands}");
          i = args.shift();
          if (i.match(/^\{[\s\S]*\}$/g))
            i = i.substr(1, i.length - 2);
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          tmp = [];
          this.loops.push(0);
          while (this.evaluate(this.parseInline(i))) {
            let out = this.parseOutgoing(args);
            if (out != null && out.length > 0)
              tmp.push(out);
            if (this.stack.continue) {
              this.stack.continue = false;
              continue;
            }
            if (this.stack.break) {
              this.stack.break--;
              break;
            }
          }
          this.loops.pop();
          if (tmp.length > 0)
            return tmp.map((v) => v.trim()).join("\n");
          return null;
        case "forall":
        case "fo":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "fo\x1B[0;-11;-12mrall stringlist {commands}");
          i = args.shift();
          if (i.match(/^\{[\s\S]*\}$/g))
            i = i.substr(1, i.length - 2);
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          tmp = [];
          i = this.splitByQuotes(this.stripQuotes(this.parseInline(i)), "|");
          al = i.length;
          for (n = 0; n < al; n++) {
            this.loops.push(i[n]);
            let out = this.parseOutgoing(args);
            if (out != null && out.length > 0)
              tmp.push(out);
            if (this.stack.continue) {
              this.stack.continue = false;
              continue;
            }
            if (this.stack.break) {
              this.stack.break--;
              break;
            }
            this.loops.pop();
          }
          if (tmp.length > 0)
            return tmp.map((v) => v.trim()).join("\n");
          return null;
        case "variable":
        case "var":
        case "va":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0) {
            i = Object.keys(this.client.variables);
            al = i.length;
            tmp = [];
            for (n = 0; n < al; n++)
              tmp.push(i[n] + " = " + this.client.variables[i[n]]);
            return tmp.join("\n");
          }
          i = args.shift();
          if (i.match(/^\{.*\}$/g))
            i = i.substr(1, i.length - 2);
          i = this.parseInline(i);
          if (!isValidIdentifier(i))
            throw new Error("Invalid variable name");
          if (args.length === 0)
            return this.client.variables[i]?.toString();
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          args = this.parseInline(args);
          if (args.match(/^\s*?[-|+]?\d+\s*?$/))
            this.client.variables[i] = parseInt(args, 10);
          else if (args.match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            this.client.variables[i] = parseFloat(args);
          else if (args === "true")
            this.client.variables[i] = true;
          else if (args === "false")
            this.client.variables[i] = false;
          else
            this.client.variables[i] = this.stripQuotes(args);
          return null;
        case "unvar":
        case "unv":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length !== 1)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "unv\x1B[0;-11;-12mar name ");
          i = args.shift();
          if (i.match(/^\{[\s\S]*\}$/g))
            i = i.substr(1, i.length - 2);
          i = this.parseInline(i);
          delete this.client.variables[i];
          return null;
        case "add":
        case "ad":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "ad\x1B[0;-11;-12md name value");
          i = args.shift();
          if (i.match(/^\{[\s\S]*\}$/g))
            i = i.substr(1, i.length - 2);
          i = this.parseInline(i);
          if (this.client.variables.hasOwnProperty(i) && typeof this.client.variables[i] !== "number")
            throw new Error(i + " is not a number for add");
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          args = this.evaluate(this.parseInline(args));
          if (typeof args !== "number")
            throw new Error("Value is not a number for add");
          if (!this.client.variables.hasOwnProperty(i))
            this.client.variables[i] = args;
          else
            this.client.variables[i] += args;
          return null;
        case "math":
        case "mat":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length < 2)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "mat\x1B[0;-11;-12mh name value");
          i = args.shift();
          if (i.match(/^\{[\s\S]*\}$/g))
            i = i.substr(1, i.length - 2);
          i = this.parseInline(i);
          args = args.join(" ");
          if (args.match(/^\{[\s\S]*\}$/g))
            args = args.substr(1, args.length - 2);
          args = this.evaluate(this.parseInline(args));
          if (typeof args !== "number")
            throw new Error("Value is not a number for add");
          this.client.variables[i] = args;
          return null;
        case "evaluate":
        case "eva":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "eva\x1B[0;-11;-12mluate expression");
          args = this.evaluate(this.parseInline(args.join(" ")));
          if (this.client.getOption("ignoreEvalUndefined") && typeof args === "undefined")
            args = "";
          else
            args = "" + args;
          if (this.client.telnet.prompt)
            this.client.print("\n" + args + "\x1B[0m\n", false);
          else
            this.client.print(args + "\x1B[0m\n", false);
          this.client.telnet.prompt = false;
          return null;
        case "freeze":
        case "fr":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0) {
            this.scrollLock = !this.scrollLock;
            if (this.scrollLock) {
              if (this.client.display.scrollAtBottom)
                this.client.display.scrollUp();
            } else
              this.client.display.scrollDisplay();
          } else if (args.length === 1) {
            if (args[0] === "0" || args[0] === "false") {
              if (this.scrollLock) {
                this.scrollLock = false;
                this.client.display.scrollDisplay();
              }
            } else if (!this.scrollLock) {
              this.scrollLock = true;
              if (this.client.display.scrollAtBottom)
                this.client.display.scrollUp();
            }
          } else if (args.length > 1)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "fr\x1B[0;-11;-12meeze \x1B[3mnumber\x1B[0;-11;-12m");
          return null;
        //#endregion freeze                
        case "clr":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length)
            throw new Error("Invalid syntax use " + cmdChar + "CLR");
          if (this.client.display.lines.length === 0)
            return null;
          i = this.client.display.WindowSize.height + 2;
          n = this.client.display.lines.length;
          while (n-- && i) {
            if (this.client.display.lines[n].text.length)
              break;
            i--;
          }
          tmp = [];
          while (i--)
            tmp.push("\n");
          this.client.print(tmp.join(""), true);
          return null;
        case "fire":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = this.parseInline(args.join(" ") + "\n");
          this.ExecuteTriggers(4 /* Regular */ | 8 /* Pattern */ | 128 /* LoopExpression */, args, args, false, false);
          return null;
        case "state":
        //#STATE id state profile
        case "sta":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = args.map((m) => {
            if (!m || !m.length)
              return m;
            if (m.match(/^\{.*\}$/g))
              return this.parseInline(m.substr(1, m.length - 2));
            return this.parseInline(this.stripQuotes(m));
          });
          switch (args.length) {
            case 0:
              throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "sta\x1B[0;-11;-12mte \x1B[3m name|pattern state profile\x1B[0;-11;-12m");
            case 1:
              if (args[0].match(/^\s*?[-|+]?\d+\s*?$/)) {
                if (!this._LastTrigger)
                  throw new Error("No trigger has fired yet, unable to set state");
                trigger = this._LastTrigger;
                n = trigger.state;
                trigger.state = parseInt(args[0], 10);
              } else {
                const keys = this.client.profiles.keys;
                let k = 0;
                const kl = keys.length;
                if (kl === 0)
                  return null;
                if (kl === 1) {
                  if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                    throw Error("No enabled profiles found!");
                  trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  trigger = trigger.find((t) => {
                    return t.name === args[0] || t.pattern === args[0];
                  });
                } else {
                  for (; k < kl; k++) {
                    if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                      continue;
                    trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                    trigger = trigger.find((t) => {
                      return t.name === args[0] || t.pattern === args[0];
                    });
                    if (trigger)
                      break;
                  }
                }
                if (!trigger)
                  throw new Error("Trigger not found: " + args[0]);
                n = trigger.state;
                trigger.state = 0;
              }
              break;
            case 2:
              if (args[0].match(/^\s*?[-|+]?\d+\s*?$/))
                throw new Error("Invalid argument to " + cmdChar + "state, first argument must be name|pattern");
              if (args[1].match(/^\s*?[-|+]?\d+\s*?$/)) {
                const keys = this.client.profiles.keys;
                let k = 0;
                const kl = keys.length;
                if (kl === 0)
                  return null;
                if (kl === 1) {
                  if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                    throw Error("No enabled profiles found!");
                  trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  trigger = trigger.find((t) => {
                    return t.name === args[0] || t.pattern === args[0];
                  });
                } else {
                  for (; k < kl; k++) {
                    if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                      continue;
                    trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                    trigger = trigger.find((t) => {
                      return t.name === args[0] || t.pattern === args[0];
                    });
                    if (trigger)
                      break;
                  }
                }
                if (!trigger)
                  throw new Error("Trigger not found: " + args[0]);
                n = trigger.state;
                trigger.state = parseInt(args[1], 10);
              } else {
                profile = args[1];
                if (this.client.profiles.contains(profile))
                  profile = this.client.profiles.items[profile.toLowerCase()];
                else
                  throw new Error("Profile not found: " + args[1]);
                trigger = SortItemArrayByPriority(profile.triggers);
                trigger = trigger.find((t) => {
                  return t.name === args[0] || t.pattern === args[0];
                });
                if (!trigger)
                  throw new Error("Trigger not found: " + args[0] + " in profile: " + profile.name);
                n = trigger.state;
                trigger.state = 0;
              }
              break;
            case 3:
              if (args[0].match(/^\s*?[-|+]?\d+\s*?$/))
                throw new Error("Invalid argument to " + cmdChar + "state, first argument must be name|pattern");
              profile = args[2];
              if (this.client.profiles.contains(profile))
                profile = this.client.profiles.items[profile.toLowerCase()];
              else
                throw new Error("Profile not found: " + args[2]);
              trigger = SortItemArrayByPriority(profile.triggers);
              trigger = trigger.find((t) => {
                return t.name === args[0] || t.pattern === args[0];
              });
              if (!trigger)
                throw new Error("Trigger not found: " + args[0]);
              n = trigger.state;
              trigger.state = parseInt(args[1], 10);
              break;
            default:
              throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "sta\x1B[0;-11;-12mte \x1B[3m name|pattern state profile\x1B[0;-11;-12m");
          }
          if (trigger.state < 0 || trigger.state > trigger.triggers.length) {
            trigger.state = n;
            throw new Error("Trigger state must be greater than or equal to 0 or less than or equal to " + trigger.triggers.length);
          }
          i = trigger.fired;
          trigger.fired = false;
          this.resetTriggerState(this._TriggerCache.indexOf(trigger), n, i);
          this.client.restartAlarmState(trigger, n, trigger.state);
          this.client.saveProfiles();
          this.client.emit("item-updated", "trigger", trigger.profile.name, trigger.profile.triggers.indexOf(trigger), trigger);
          this.client.echo("Trigger state set to " + trigger.state + ".", -7, -8, true, true);
          return null;
        case "set":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = args.map((m) => {
            if (!m || !m.length)
              return m;
            if (m.match(/^\{.*\}$/g))
              return this.parseInline(m.substr(1, m.length - 2));
            return this.parseInline(this.stripQuotes(m));
          });
          n = 0;
          i = false;
          switch (args.length) {
            case 0:
              throw new Error("Invalid syntax use " + cmdChar + "set \x1B[3mname|pattern\x1B[0;-11;-12m state \x1B[3mvalue profile\x1B[0;-11;-12m");
            case 1:
              if (args[0].match(/^\s*?[-|+]?\d+\s*?$/)) {
                if (!this._LastTrigger)
                  throw new Error("No trigger has fired yet, unable to set state");
                trigger = this._LastTrigger;
                n = parseInt(args[0], 10);
                if (n < 0 || n > trigger.triggers.length)
                  throw new Error("Trigger state must be greater than or equal to 0 or less than or equal to " + trigger.triggers.length);
                if (n === 0) {
                  i = trigger.fired;
                  trigger.fired = true;
                } else {
                  i = trigger.triggers[n - 1].fired;
                  trigger.triggers[n - 1].fired = true;
                }
              } else
                throw new Error("Trigger state must be greater than or equal to 0 or less than or equal to " + trigger.triggers.length);
              break;
            case 2:
              if (args[0].match(/^\s*?[-|+]?\d+\s*?$/)) {
                if (!this._LastTrigger)
                  throw new Error("No trigger has fired yet, unable to set state");
                trigger = this._LastTrigger;
                n = parseInt(args[0], 10);
                if (n < 0 || n > trigger.triggers.length)
                  throw new Error("Trigger state must be greater than or equal to 0 or less than or equal to " + trigger.triggers.length);
                if (args[1] !== "0" && args[1] !== "1" && args[1] !== "true" && args[1] !== "false")
                  throw new Error("Value must be 0, 1, true, or false");
                if (n === 0) {
                  i = trigger.fired;
                  trigger.fired = args[1] === "1" || args[1] === "true";
                } else {
                  i = trigger.triggers[n - 1].fired;
                  trigger.triggers[n - 1].fired = args[1] === "1" || args[1] === "true";
                }
              } else {
                const keys = this.client.profiles.keys;
                let k = 0;
                const kl = keys.length;
                if (kl === 0)
                  return null;
                if (kl === 1) {
                  if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                    throw Error("No enabled profiles found!");
                  trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  trigger = trigger.find((t) => {
                    return t.name === args[0] || t.pattern === args[0];
                  });
                } else {
                  for (; k < kl; k++) {
                    if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                      continue;
                    trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                    trigger = trigger.find((t) => {
                      return t.name === args[0] || t.pattern === args[0];
                    });
                    if (trigger)
                      break;
                  }
                }
                if (!trigger)
                  throw new Error("Trigger not found: " + args[0]);
                n = parseInt(args[1], 10);
                if (n < 0 || n > trigger.triggers.length)
                  throw new Error("Trigger state must be greater than or equal to 0 or less than or equal to " + trigger.triggers.length);
                if (n === 0) {
                  i = trigger.fired;
                  trigger.fired = true;
                } else {
                  i = trigger.triggers[n - 1].fired;
                  trigger.triggers[n - 1].fired = true;
                }
              }
              break;
            case 3:
              if (args[2] === "0" && args[2] !== "1" && args[2] !== "true" && args[21] !== "false") {
                profile = args[2];
                if (this.client.profiles.contains(profile))
                  profile = this.client.profiles.items[profile.toLowerCase()];
                else
                  throw new Error("Profile not found: " + profile);
                trigger = SortItemArrayByPriority(profile.triggers);
                trigger = trigger.find((t) => {
                  return t.name === args[0] || t.pattern === args[0];
                });
                if (!trigger)
                  throw new Error("Trigger not found: " + args[0] + " in profile: " + profile.name);
                n = parseInt(args[1], 10);
                if (n < 0 || n > trigger.triggers.length)
                  throw new Error("Trigger state must be greater than or equal to 0 or less than or equal to " + trigger.triggers.length);
                if (n === 0) {
                  i = trigger.fired;
                  trigger.fired = true;
                } else {
                  i = trigger.triggers[n - 1].fired;
                  trigger.triggers[n - 1].fired = true;
                }
              } else {
                const keys = this.client.profiles.keys;
                let k = 0;
                const kl = keys.length;
                if (kl === 0)
                  return null;
                if (kl === 1) {
                  if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                    throw Error("No enabled profiles found!");
                  trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  trigger = trigger.find((t) => {
                    return t.name === args[0] || t.pattern === args[0];
                  });
                } else {
                  for (; k < kl; k++) {
                    if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                      continue;
                    trigger = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                    trigger = trigger.find((t) => {
                      return t.name === args[0] || t.pattern === args[0];
                    });
                    if (trigger)
                      break;
                  }
                }
                if (!trigger)
                  throw new Error("Trigger not found: " + args[0]);
                n = parseInt(args[1], 10);
                if (n < 0 || n > trigger.triggers.length)
                  throw new Error("Trigger state must be greater than or equal to 0 or less than or equal to " + trigger.triggers.length);
                if (n === 0) {
                  i = trigger.fired;
                  trigger.fired = args[2] === "1" || args[2] === "true";
                } else {
                  i = trigger.triggers[n - 1].fired;
                  trigger.triggers[n - 1].fired = args[2] === "1" || args[2] === "true";
                }
              }
              break;
            case 4:
              profile = args[2];
              if (this.client.profiles.contains(profile))
                profile = this.client.profiles.items[profile.toLowerCase()];
              else
                throw new Error("Profile not found: " + profile);
              trigger = SortItemArrayByPriority(profile.triggers);
              trigger = trigger.find((t) => {
                return t.name === args[0] || t.pattern === args[0];
              });
              if (!trigger)
                throw new Error("Trigger not found: " + args[0] + " in profile: " + profile.name);
              if (args[2] !== "0" && args[2] !== "1" && args[2] !== "true" && args[2] !== "false")
                throw new Error("Value must be 0, 1, true, or false");
              if (n === 0) {
                i = trigger.fired;
                trigger.fired = args[2] === "1" || args[2] === "true";
              } else {
                i = trigger.triggers[n - 1].fired;
                trigger.triggers[n - 1].fired = args[2] === "1" || args[2] === "true";
              }
              break;
            default:
              throw new Error("Invalid syntax use " + cmdChar + "set \x1B[3mname|pattern\x1B[0;-11;-12m state \x1B[3mvalue profile\x1B[0;-11;-12m");
          }
          this.client.saveProfiles();
          this.client.emit("item-updated", "trigger", trigger.profile.name, trigger.profile.triggers.indexOf(trigger), trigger);
          this.resetTriggerState(this._TriggerCache.indexOf(trigger), n, i);
          if (n === 0)
            this.client.echo("Trigger state 0 fired state set to " + trigger.fired + ".", -7, -8, true, true);
          else {
            this.client.echo("Trigger state " + n + " fired state set to " + trigger.triggers[n - 1].fired + ".", -7, -8, true, true);
            if (trigger.enabled && trigger.triggers[n - 1].enabled && trigger.triggers[n - 1].type === 65536 /* Manual */) {
              this._LastTriggered = "";
              this.ExecuteTrigger(trigger, [], false, this._TriggerCache.indexOf(trigger), 0, 0, trigger);
            }
          }
          return null;
        case "condition":
        case "cond":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          item = {
            profile: null,
            name: null,
            pattern: null,
            commands: null,
            options: { priority: 0 }
          };
          if (args.length < 2 || args.length > 5)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "cond\x1B[0;-11;-12mition name|pattern {pattern} {commands} \x1B[3moptions profile\x1B[0;-11;-12m or \x1B[4m" + cmdChar + "cond\x1B[0;-11;-12mition {pattern} {commands} \x1B[3m{options} profile\x1B[0;-11;-12m");
          if (args[0].length === 0)
            throw new Error("Invalid trigger name or pattern");
          if (args[0].match(/^\{.*\}$/g)) {
            item.pattern = args.shift();
            item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
          } else {
            item.name = this.parseInline(this.stripQuotes(args.shift()));
            if (!item.name || item.name.length === 0)
              throw new Error("Invalid trigger name");
            if (args[0].match(/^\{.*\}$/g)) {
              item.pattern = args.shift();
              item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
            }
          }
          if (args.length !== 0) {
            if (args[0].match(/^\{[\s\S]*\}$/g)) {
              item.commands = args.shift();
              item.commands = item.commands.substr(1, item.commands.length - 2);
            }
            if (args.length === 1) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              else
                args[0] = this.stripQuotes(args[0]);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nocr":
                    case "prompt":
                    case "case":
                    case "verbatim":
                    case "disable":
                    case "enable":
                    case "cmd":
                    case "temporary":
                    case "temp":
                    case "raw":
                    case "pattern":
                    case "regular":
                    case "alarm":
                    case "event":
                    case "cmdpattern":
                    case "loopexpression":
                    //case 'expression':
                    case "reparse":
                    case "reparsepattern":
                    case "manual":
                    case "skip":
                    case "looplines":
                    case "looppattern":
                    case "wait":
                    case "duration":
                    case "withinlines":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("param=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger param option '${o.trim()}'`);
                        item.options["params"] = tmp[1];
                      } else if (o.trim().startsWith("type=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger type option '${o.trim()}'`);
                        if (!this.isTriggerType(tmp[1]))
                          throw new Error("Invalid trigger type");
                        item.options["type"] = tmp[1];
                      } else if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid trigger priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid trigger option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid trigger options");
            } else if (args.length === 2) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nocr":
                    case "prompt":
                    case "case":
                    case "verbatim":
                    case "disable":
                    case "enable":
                    case "cmd":
                    case "temporary":
                    case "temp":
                    case "raw":
                    case "pattern":
                    case "regular":
                    case "alarm":
                    case "event":
                    case "cmdpattern":
                    case "loopexpression":
                    //case 'expression':
                    case "reparse":
                    case "reparsepattern":
                    case "manual":
                    case "skip":
                    case "looplines":
                    case "looppattern":
                    case "wait":
                    case "duration":
                    case "withinlines":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("param=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger param option '${o.trim()}'`);
                        item.options["params"] = tmp[1];
                      } else if (o.trim().startsWith("type=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger type option '${o.trim()}'`);
                        if (!this.isTriggerType(tmp[1]))
                          throw new Error("Invalid trigger type");
                        item.options["type"] = tmp[1];
                      } else if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid trigger priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid trigger priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid trigger option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid trigger options");
              item.profile = this.stripQuotes(args[1]);
              if (item.profile.length !== 0)
                item.profile = this.parseInline(item.profile);
            }
          }
          this.createTrigger(item.pattern, item.commands, item.profile, item.options, item.name, true);
          return null;
        case "cr":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.sendBackground("\n");
          return null;
        case "send":
        case "se":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "se\x1B[0;-11;-12mnd file \x1B[3mprefix suffix\x1B[0;-11;-12m or \x1B[4m" + cmdChar + "se\x1B[0;-11;-12mnd text");
          args = args.join(" ");
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "se\x1B[0;-11;-12mnd file \x1B[3mprefix suffix\x1B[0;-11;-12m or \x1B[4m" + cmdChar + "se\x1B[0;-11;-12mnd text");
          this.client.sendBackground(this.stripQuotes(args), this.client.getOption("allowCommentsFromCommand"));
          return null;
        //work around for send as can not access files so we open a file dialog and ask for the file they want to send instead
        case "sendfile":
        case "sendf":
          ((a, r) => {
            openFileDialog().then((files2) => {
              readFile(files2[0]).then((contents) => {
                if ((this.client.getOption("echo") & 4) === 4)
                  this.client.echo(r, -3, -4, true, true);
                p = "";
                i = "";
                if (a.length > 1)
                  p = this.stripQuotes(this.parseInline(a[0]));
                if (a.length > 2)
                  i = this.stripQuotes(this.parseInline(a[1]));
                items = contents.split(/\r?\n/);
                items.forEach((line) => {
                  this.client.sendBackground(p + line + i, null, this.client.getOption("allowCommentsFromCommand"));
                });
              }).catch(this.client.error);
            }).catch(() => {
            });
          })(args, raw);
          return null;
        //work around for sendraw as can not access files so we open a file dialog and ask for the file they want to send instead
        case "sendfileraw":
        case "sendfiler":
          ((a, r) => {
            openFileDialog().then((files2) => {
              readFile(files2[0]).then((contents) => {
                if ((this.client.getOption("echo") & 4) === 4)
                  this.client.echo(r, -3, -4, true, true);
                p = "";
                i = "";
                if (a.length > 1)
                  p = this.stripQuotes(this.parseInline(a[0]));
                if (a.length > 2)
                  i = this.stripQuotes(this.parseInline(a[1]));
                items = contents.split(/\r?\n/);
                items.forEach((line) => {
                  this.client.sendRaw(p + line + i);
                });
              }).catch(this.client.error);
            }).catch(() => {
            });
          })(args, raw);
          return null;
        case "sendraw":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use " + cmdChar + "sendraw text or " + cmdChar + "sendraw file \x1B[3mprefix suffix\x1B[0;-11;-12m");
          args = args.join(" ");
          if (args.length === 0)
            throw new Error("Invalid syntax use " + cmdChar + "sendraw text or " + cmdChar + "sendraw file \x1B[3mprefix suffix\x1B[0;-11;-12m");
          if (!args.endsWith("\n"))
            args = args + "\n";
          this.client.sendRaw(args);
          return null;
        case "sendprompt":
        case "sendp":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "sendp\x1B[0;-11;-12mrompt text");
          args = args.join(" ");
          if (args.length === 0)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "sendp\x1B[0;-11;-12mrompt text");
          this.client.sendRaw(args);
          return null;
        case "character":
        case "char":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          this.client.sendRaw(window.$character || "");
          return null;
        case "speak":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use " + cmdChar + "speak text");
          args = args.join(" ");
          if (args.length === 0)
            throw new Error("Invalid syntax use " + cmdChar + "speak text");
          args = this.stripQuotes(this.parseInline(args));
          if (args.length !== 0)
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(args));
          return null;
        case "speakstop":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length !== 0)
            throw new Error("Invalid syntax use " + cmdChar + "speakstop");
          window.speechSynthesis.cancel();
          return null;
        case "speakpause":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length !== 0)
            throw new Error("Invalid syntax use " + cmdChar + "speakpause");
          window.speechSynthesis.pause();
          return null;
        case "speakresume":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length !== 0)
            throw new Error("Invalid syntax use " + cmdChar + "speakresume");
          window.speechSynthesis.resume();
          return null;
        case "comment":
        case "comm":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          return null;
        case "noop":
        case "no":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length)
            this.parseInline(args.join(" "));
          return null;
        case "temp":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          item = {
            profile: null,
            name: null,
            pattern: null,
            commands: null,
            options: { priority: 0 }
          };
          if (args.length < 2 || args.length > 5)
            throw new Error("Invalid syntax use " + cmdChar + "temp name {pattern} {commands} \x1B[3moptions profile\x1B[0;-11;-12m or " + cmdChar + "temp {pattern} {commands} \x1B[3m{options} profile\x1B[0;-11;-12m");
          if (args[0].length === 0)
            throw new Error("Invalid temporary trigger or pattern");
          if (args[0].match(/^\{.*\}$/g)) {
            item.pattern = args.shift();
            item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
          } else {
            item.name = this.parseInline(this.stripQuotes(args.shift()));
            if (!item.name || item.name.length === 0)
              throw new Error("Invalid temporary trigger name");
            if (args[0].match(/^\{.*\}$/g)) {
              item.pattern = args.shift();
              item.pattern = this.parseInline(item.pattern.substr(1, item.pattern.length - 2));
            }
          }
          if (args.length !== 0) {
            if (args[0].match(/^\{[\s\S]*\}$/g)) {
              item.commands = args.shift();
              item.commands = item.commands.substr(1, item.commands.length - 2);
            }
            if (args.length === 1) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              else
                args[0] = this.stripQuotes(args[0]);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nocr":
                    case "prompt":
                    case "case":
                    case "verbatim":
                    case "disable":
                    case "enable":
                    case "cmd":
                    case "raw":
                    case "pattern":
                    case "regular":
                    case "alarm":
                    case "event":
                    case "cmdpattern":
                    case "loopexpression":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("param=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid temporary trigger param option '${o.trim()}'`);
                        item.options["params"] = tmp[1];
                      } else if (o.trim().startsWith("type=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid temporary trigger type option '${o.trim()}'`);
                        if (!this.isTriggerType(tmp[1], 1 /* Main */))
                          throw new Error("Invalid temporary trigger type");
                        item.options["type"] = tmp[1];
                      } else if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid temporary trigger priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid temporary trigger priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid temporary trigger option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid temporary trigger options");
            } else if (args.length === 2) {
              if (args[0].match(/^\{[\s\S]*\}$/g))
                args[0] = args[0].substr(1, args[0].length - 2);
              if (args[0].length !== 0) {
                this.parseInline(args[0]).split(",").forEach((o) => {
                  switch (o.trim()) {
                    case "nocr":
                    case "prompt":
                    case "case":
                    case "verbatim":
                    case "disable":
                    case "enable":
                    case "cmd":
                    case "raw":
                    case "pattern":
                    case "regular":
                    case "alarm":
                    case "event":
                    case "cmdpattern":
                    case "loopexpression":
                      item.options[o.trim()] = true;
                      break;
                    default:
                      if (o.trim().startsWith("param=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid temporary trigger param option '${o.trim()}'`);
                        item.options["params"] = tmp[1];
                      } else if (o.trim().startsWith("type=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid temporary trigger type option '${o.trim()}'`);
                        if (!this.isTriggerType(tmp[1], 1 /* Main */))
                          throw new Error("Invalid temporary trigger type");
                        item.options["type"] = tmp[1];
                      } else if (o.trim().startsWith("pri=") || o.trim().startsWith("priority=")) {
                        tmp = o.trim().split("=");
                        if (tmp.length !== 2)
                          throw new Error(`Invalid temporary trigger priority option '${o.trim()}'`);
                        i = parseInt(tmp[1], 10);
                        if (isNaN(i))
                          throw new Error("Invalid temporary trigger priority value '" + tmp[1] + "' must be a number");
                        item.options["priority"] = i;
                      } else
                        throw new Error(`Invalid temporary trigger option '${o.trim()}'`);
                  }
                });
              } else
                throw new Error("Invalid temporary trigger options");
              item.profile = this.stripQuotes(args[1]);
              if (item.profile.length !== 0)
                item.profile = this.parseInline(item.profile);
            }
          }
          item.options.temporary = true;
          this.createTrigger(item.pattern, item.commands, item.profile, item.options, item.name);
          return null;
        case "wrap":
        case "wr":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          args = args.filter((a) => a);
          if (args.length > 1)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "wr\x1B[0;-11;-12map or \x1B[4m" + cmdChar + "wr\x1B[0;-11;-12map number");
          if (args.length === 0) {
            this.client.setOption("display.wordWrap", !this.client.getOption("display.wordWrap"));
            this.client.display.wordWrap = this.client.getOption("display.wordWrap");
          } else {
            i = parseInt(this.parseInline(args[0]), 10);
            if (isNaN(i))
              throw new Error("Invalid number '" + i + "' for wrap");
            if (i < 0)
              throw new Error("Must be greater then or equal to zero for wrap");
            this.client.setOption("display.wordWrap", true);
            this.client.setOption("display.wordWrap", i);
            this.client.display.wordWrap = true;
            this.client.display.wrapAt = i;
          }
          return null;
        case "prompt":
        case "pr":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0 || args.length > 4)
            throw new Error("Invalid syntax use \x1B[4m" + cmdChar + "pr\x1B[0;-11;-12mompt variable \x1B[3mmessage defaultValue mask\x1B[0;-11;-12m");
          else {
            i = args.shift();
            if (i.match(/^\{.*\}$/g))
              i = i.substr(1, i.length - 2);
            i = this.parseInline(i);
            if (!isValidIdentifier(i))
              throw new Error("Invalid variable name");
            args = args.map((a) => this.parseInline(this.stripQuotes(a)));
            if (args.length === 3 && args[2] && args[2].toLowerCase() === "true")
              args[2] = true;
            args = window.prompt(...args);
            if (args?.match(/^\s*?[-|+]?\d+\s*?$/))
              this.client.variables[i] = parseInt(args, 10);
            else if (args?.match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
              this.client.variables[i] = parseFloat(args);
            else if (args === "true")
              this.client.variables[i] = true;
            else if (args === "false")
              this.client.variables[i] = false;
            else
              this.client.variables[i] = args;
          }
          return null;
        case "setmap":
          if ((this.client.getOption("echo") & 4) === 4)
            this.client.echo(raw, -3, -4, true, true);
          if (args.length === 0)
            throw new Error("Invalid syntax use " + cmdChar + "setmap file \x1B[3msetCharacter\x1B[0;-11;-12m");
          tmp = this.stripQuotes(this.parseInline(args.shift())) || "";
          if (!tmp || !tmp.length)
            throw new Error("Empty file\x1B[0;-11;-12m");
          if (args.length > 1)
            p = this.stripQuotes(this.parseInline(args.join(" "))).toLocaleLowerCase().trim();
          else
            p = "";
          this.emit("setmap", tmp, p === "true" || p === "yes", true);
          return null;
      }
      if (fun.match(/^[-|+]?\d+$/)) {
        if ((this.client.getOption("echo") & 4) === 4)
          this.client.echo(raw, -3, -4, true, true);
        i = parseInt(fun, 10);
        if (args.length === 0)
          throw new Error("Invalid syntax use " + cmdChar + "nnn commands");
        args = args.join(" ");
        if (args.match(/^\{[\s\S]*\}$/g))
          args = args.substr(1, args.length - 2);
        if (i < 1)
          return this.executeForLoop(-i + 1, 1, args);
        return this.executeForLoop(0, i, args);
      }
      const data = { name: fun, args, raw, handled: false, return: null };
      this.client.emit("function", data);
      if (data.handled) {
        if ((this.client.getOption("echo") & 4) === 4)
          this.client.echo(raw, -3, -4, true, true);
        return data.return;
      }
      if (data.raw.startsWith(cmdChar))
        return cmdChar + this.parseOutgoing(data.raw.substr(1), null, null, null, true);
      return this.parseOutgoing(data.raw + "\n", null, null, null, true);
    }
    executeForLoop(start, end, commands) {
      let tmp = [];
      let r;
      if (start > end) {
        for (r = start - 1; r >= end; r--) {
          this.loops.push(r);
          try {
            let out = this.parseOutgoing(commands);
            if (out != null && out.length > 0)
              tmp.push(out);
            if (this.stack.continue) {
              this.stack.continue = false;
              continue;
            }
            if (this.stack.break) {
              this.stack.break--;
              break;
            }
          } catch (e) {
            throw e;
          } finally {
            this.loops.pop();
          }
        }
      } else {
        for (r = start; r < end; r++) {
          this.loops.push(r + 1);
          try {
            let out = this.parseOutgoing(commands);
            if (out != null && out.length > 0)
              tmp.push(out);
            if (this.stack.continue) {
              this.stack.continue = false;
              continue;
            }
            if (this.stack.break) {
              this.stack.break--;
              break;
            }
          } catch (e) {
            throw e;
          } finally {
            this.loops.pop();
          }
        }
      }
      if (tmp.length > 0)
        return tmp.map((v) => v.trim()).join("\n");
      return null;
    }
    parseInline(text) {
      return this.parseOutgoing(text, false, null, false, true);
    }
    parseOutgoing(text, eAlias, stacking, append, noFunctions, noComments) {
      const tl = text.length;
      if (!this.enableParsing || text == null || tl === 0)
        return text;
      let str = "";
      let alias = "";
      let AliasesCached;
      let state = 0;
      const aliases = this.client.aliases;
      const stackingChar = this.client.getOption("commandStackingChar");
      const spChar = this.client.getOption("speedpathsChar");
      const ePaths = this.client.getOption("enableSpeedpaths");
      const eCmd = this.client.getOption("enableCommands");
      const cmdChar = this.client.getOption("commandChar");
      const eEscape = this.client.getOption("allowEscape");
      const escChar = this.client.getOption("escapeChar");
      const verbatimChar = this.client.getOption("verbatimChar");
      const eVerbatim = this.client.getOption("enableVerbatim");
      const eParamEscape = this.client.getOption("enableDoubleParameterEscaping");
      const paramChar = this.client.getOption("parametersChar");
      const eParam = this.client.getOption("enableParameters");
      const nParamChar = this.client.getOption("nParametersChar");
      const eNParam = this.client.getOption("enableNParameters");
      const eEval = this.client.getOption("allowEval");
      const iEval = this.client.getOption("ignoreEvalUndefined");
      const iComments = this.client.getOption("enableInlineComments") && !noComments;
      const bComments = this.client.getOption("enableBlockComments") && !noComments;
      const iCommentsStr = this.client.getOption("inlineCommentString").split("");
      const bCommentsStr = this.client.getOption("blockCommentString").split("");
      const bTrim = this.client.getOption("ignoreInputLeadingWhitespace");
      let sTrim = "";
      let args = [];
      let arg = "";
      let findAlias = true;
      let out = "";
      let a;
      let c;
      let al;
      let idx = 0;
      let tmp;
      let tmp2;
      let start = true;
      let _neg = false;
      let _pos = false;
      let _fall = false;
      let nest = 0;
      const pd = this.client.getOption("parseDoubleQuotes");
      const ps = this.client.getOption("parseSingleQuotes");
      if (eAlias == null)
        eAlias = aliases.length > 0;
      else
        eAlias = eAlias && aliases.length > 0;
      if (stackingChar.length === 0)
        stacking = false;
      else if (stacking == null)
        stacking = this.client.getOption("commandStacking");
      else
        stacking = stacking && this.client.getOption("commandStacking");
      for (idx = 0; idx < tl; idx++) {
        c = text.charAt(idx);
        switch (state) {
          case 1 /* doubleQuoted */:
            if (eEscape && c === escChar)
              state = 27 /* doubleQuotedEscape */;
            else {
              if (c === '"' && pd)
                state = 0 /* none */;
              if (eAlias && findAlias)
                alias += c;
              else
                str += c;
            }
            start = false;
            break;
          case 27 /* doubleQuotedEscape */:
            state = 1 /* doubleQuoted */;
            if (c !== '"' && c !== escChar) {
              idx--;
              if (eAlias && findAlias)
                alias += escChar;
              else
                str += escChar;
            } else if (eAlias && findAlias)
              alias += c;
            else
              str += c;
            break;
          case 2 /* singleQuoted */:
            if (eEscape && c === escChar)
              state = 27 /* doubleQuotedEscape */;
            else {
              if (c === "'" && ps)
                state = 0 /* none */;
              if (eAlias && findAlias)
                alias += c;
              else
                str += c;
            }
            start = false;
            break;
          case 28 /* singleQuotedEscape */:
            state = 2 /* singleQuoted */;
            if (c !== "'" && c !== escChar) {
              idx--;
              if (eAlias && findAlias)
                alias += escChar;
              else
                str += escChar;
            } else if (eAlias && findAlias)
              alias += c;
            else
              str += c;
            break;
          case 3 /* aliasArguments */:
            if (c === '"' && pd) {
              arg += c;
              state = 4 /* aliasArgumentsDouble */;
              start = false;
            } else if (c === "'" && ps) {
              arg += c;
              state = 5 /* aliasArgumentsSingle */;
              start = false;
            } else if (eEscape && c === escChar) {
              state = 17 /* aliasArgumentsEscape */;
              start = false;
            } else if (idx === tl - 1 || c === "\n" || stacking && c === stackingChar) {
              if (!(c === "\n" || stacking && c === stackingChar))
                arg += c;
              if (arg.length > 0)
                args.push(this.parseInline(arg));
              al = AliasesCached.length;
              for (a = 0; a < al; a++) {
                str = this.ExecuteAlias(AliasesCached[a], args);
                if (typeof str === "number") {
                  if (str >= 0)
                    this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
                  if (out.length === 0) return null;
                  return out;
                }
                if (str !== null) out += str;
                str = "";
                if (!a.multi) break;
                if (this.stack.continue || this.stack.break) {
                  if (out.length === 0) return null;
                  return out;
                }
              }
              alias = "";
              state = 0 /* none */;
              AliasesCached = null;
              start = true;
            } else if (c === " ") {
              args.push(this.parseInline(arg));
              arg = "";
              start = false;
            } else {
              arg += c;
              start = false;
            }
            break;
          case 4 /* aliasArgumentsDouble */:
            if (c === '"')
              state = 3 /* aliasArguments */;
            arg += c;
            start = false;
            break;
          case 5 /* aliasArgumentsSingle */:
            if (c === "'")
              state = 3 /* aliasArguments */;
            arg += c;
            start = false;
            break;
          case 17 /* aliasArgumentsEscape */:
            state = 3 /* aliasArguments */;
            if (c === escChar || stacking && c === stackingChar || eVerbatim && c === verbatimChar || ePaths && c === spChar || eCmd && c === cmdChar || eParamEscape && c === paramChar || eNParam && c === nParamChar)
              arg += c;
            else if (iComments && c == iCommentsStr[0])
              tmp2 = c;
            else if (bComments && c == bCommentsStr[0])
              tmp2 = c;
            else if (`"'{`.indexOf(c) !== -1)
              arg += c;
            else
              arg += escChar + c;
            break;
          case 6 /* path */:
            if (eEscape && c === escChar) {
              state = 18 /* pathEscape */;
              start = false;
            } else if (c === "\n" || stacking && c === stackingChar) {
              state = 0 /* none */;
              str = this.ProcessPath(str);
              if (str !== null) out += str;
              str = "";
              start = true;
              if (this.stack.continue || this.stack.break) {
                if (out.length === 0) return null;
                return out;
              }
            } else if (idx === 1 && c === spChar) {
              state = 0 /* none */;
              idx--;
              start = false;
            } else {
              str += c;
              start = false;
            }
            break;
          case 18 /* pathEscape */:
            state = 6 /* path */;
            if (c === escChar || stacking && c === stackingChar || eVerbatim && c === verbatimChar || ePaths && c === spChar || eCmd && c === cmdChar || eParamEscape && c === paramChar || eNParam && c === nParamChar)
              str += c;
            else if (iComments && c == iCommentsStr[0])
              tmp2 = c;
            else if (bComments && c == bCommentsStr[0])
              tmp2 = c;
            else if (`"'{`.indexOf(c) !== -1)
              str += c;
            else
              str += escChar + c;
            break;
          case 7 /* function */:
            if (c === "{") {
              start = false;
              str += c;
              nest++;
            } else if (c === "}") {
              start = false;
              str += c;
              nest--;
            } else if (nest === 0 && eEscape && c === escChar) {
              state = 19 /* functionEscape */;
              start = false;
            } else if (nest === 0 && (c === "\n" || stacking && c === stackingChar)) {
              state = 0 /* none */;
              str = this.executeScript(cmdChar + str);
              if (typeof str === "number") {
                if (str >= 0)
                  this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
                if (out.length === 0) return null;
                return out;
              }
              if (str !== null) {
                out += sTrim + str + "\n";
              }
              if (this.stack.continue || this.stack.break) {
                if (out.length === 0) return null;
                return out;
              }
              str = "";
              start = true;
            } else {
              str += c;
              start = false;
            }
            break;
          case 19 /* functionEscape */:
            state = 7 /* function */;
            str += escChar + c;
            break;
          case 8 /* paramsP */:
            if (c === "{" && arg.length === 0) {
              state = 9 /* paramsPBlock */;
              continue;
            }
            switch (c) {
              case paramChar:
                if (arg.length === 0) {
                  if (eAlias && findAlias)
                    alias += paramChar;
                  else
                    str += paramChar;
                  state = 0 /* none */;
                  if (!eParamEscape)
                    idx--;
                }
                break;
              case "*":
                if (arg.length === 0) {
                  if (this.stack.args) {
                    if (eAlias && findAlias)
                      alias += this.stack.args.slice(1).join(" ");
                    else
                      str += this.stack.args.slice(1).join(" ");
                    this.stack.used = this.stack.args.length;
                  } else if (eAlias && findAlias)
                    alias += paramChar + "*";
                  else
                    str += paramChar + "*";
                  state = 0 /* none */;
                  break;
                }
              case "-":
                if (arg.length === 0) {
                  _neg = true;
                  break;
                } else if (_pos && arg.length == 1) {
                  _neg = true;
                  break;
                } else
                  _fall = true;
              case "0":
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
              case "7":
              case "8":
              case "9":
                if (!_fall) {
                  arg += c;
                  break;
                }
              case "x":
                if (!_fall && arg.length === 0) {
                  _pos = true;
                  break;
                }
              default:
                if (this.stack.args && arg.length > 0) {
                  tmp = parseInt(arg, 10);
                  if (_pos) {
                    if (_neg && this.stack.args.indices && tmp < this.stack.args.length)
                      tmp = this.stack.indices.slice(tmp).map((v) => v ? v[0] + " " + v[1] : "0 0").join(" ");
                    else if (this.stack.args.indices && tmp < this.stack.args.length)
                      tmp = this.stack.args.indices[tmp] ? this.stack.args.indices[tmp][0] + " " + this.stack.args.indices[tmp][1] : "0 0";
                    else if (_neg)
                      tmp = paramChar + "x-" + tmp;
                    else
                      tmp = paramChar + "x" + tmp;
                  } else {
                    if (_neg && tmp < this.stack.args.length)
                      tmp = this.stack.args.slice(arg).join(" ");
                    else if (tmp < this.stack.args.length)
                      tmp = this.stack.args[tmp];
                    else if (_neg)
                      tmp = paramChar + "-" + tmp;
                    else
                      tmp = paramChar + tmp;
                    if (_neg)
                      this.stack.used = this.stack.args.length;
                    else if (arg > this.stack.used)
                      this.stack.used = parseInt(arg, 10);
                  }
                  if (eAlias && findAlias)
                    alias += tmp;
                  else
                    str += tmp;
                  idx--;
                } else {
                  if (arg.length === 0 && this.loops.length > 0) {
                    tmp = c.charCodeAt(0) - 105;
                    if (tmp >= 0 && tmp < 18 && tmp < this.loops.length) {
                      if (eAlias && findAlias)
                        alias += this.loops[tmp];
                      else
                        str += this.loops[tmp];
                      state = 0 /* none */;
                      break;
                    }
                  }
                  if (eAlias && findAlias) {
                    alias += paramChar;
                    if (_neg)
                      alias += "-";
                    if (_pos)
                      alias += "x";
                  } else {
                    str += paramChar;
                    if (_neg)
                      str += "-";
                    if (_pos)
                      str += "x";
                  }
                  idx = idx - arg.length - 1;
                }
                state = 0 /* none */;
                arg = "";
                break;
            }
            break;
          case 26 /* paramsPNamed */:
            if (c.match(/[^a-zA-Z0-9_]/g)) {
              if (this.stack.named.hasOwnProperty(arg)) {
                if (eAlias && findAlias)
                  alias += this.stack.named[arg];
                else
                  str += this.stack.named[arg];
              } else if (eAlias && findAlias)
                alias += paramChar + arg;
              else
                str += paramChar + arg;
              idx--;
              state = 0 /* none */;
              arg = "";
            } else
              arg += c;
            break;
          case 9 /* paramsPBlock */:
            if (c === "}" && nest === 0) {
              if (arg === "i")
                tmp2 = this.loops[0];
              else if (arg === "repeatnum")
                tmp2 = this.repeatnum;
              else if (this.stack.args && arg === "*") {
                tmp2 = this.stack.args.slice(1).join(" ");
                this.stack.used = this.stack.args.length;
              } else if (this.stack.named && this.stack.named.hasOwnProperty(arg))
                tmp2 = this.stack.named[arg];
              else {
                if (this.stack.args && !isNaN(arg)) {
                  tmp = parseInt(arg, 10);
                  if (tmp < 0) {
                    if (-tmp >= this.stack.args.length) {
                      if (eEval)
                        tmp2 = tmp;
                      else {
                        tmp2 = paramChar;
                        idx = idx - tmp.length - 2;
                      }
                    } else {
                      tmp2 = this.stack.args.slice(tmp).join(" ");
                      this.stack.used = this.stack.args.length;
                    }
                  } else if (tmp < this.stack.args.length) {
                    tmp2 = this.stack.args[tmp];
                    if (arg > this.stack.used)
                      this.stack.used = tmp;
                  } else if (eEval)
                    tmp2 = tmp;
                  else {
                    tmp2 = paramChar;
                    idx = idx - arg.length - 2;
                  }
                } else if (this.stack.args && this.stack.args.indices && arg.match(/^x[-|+]?\d+$/)) {
                  tmp = parseInt(arg.substring(1), 10);
                  if (tmp < 0) {
                    if (-tmp >= this.stack.args.length) {
                      tmp2 = paramChar;
                      idx = idx - tmp.length - 2;
                    } else
                      tmp2 = this.stack.indices.slice(tmp).map((v) => v ? v[0] + " " + v[1] : "0 0").join(" ");
                  } else if (tmp < this.stack.args.length)
                    tmp2 = this.stack.args.indices[tmp] ? this.stack.args.indices[tmp][0] + " " + this.stack.args.indices[tmp][1] : "0 0";
                  else {
                    tmp2 = paramChar;
                    idx = idx - arg.length - 2;
                  }
                } else {
                  tmp = this.parseVariable(arg);
                  if (tmp != null)
                    tmp2 = tmp;
                  else if (eEval) {
                    tmp2 = this.evaluate(this.parseInline(arg));
                    if (iEval && typeof tmp2 === "undefined")
                      tmp2 = null;
                    else
                      tmp2 = "" + tmp2;
                  } else {
                    tmp2 = paramChar;
                    idx = idx - arg.length - 2;
                  }
                }
              }
              if (tmp2 != null && eAlias && findAlias)
                alias += tmp2;
              else if (tmp2 != null)
                str += tmp2;
              state = 0;
              arg = "";
            } else if (c === "{") {
              nest++;
              arg += c;
            } else if (c === "}") {
              nest--;
              arg += c;
            } else
              arg += c;
            break;
          /*
          case ParseState.paramsPEscape:
              if (c === '{')
                  tmp2 = paramChar+'{';
              else if (c === escChar)
                  tmp2 = paramChar + escChar;
              else {
                  tmp2 = paramChar + escChar;
                  idx--;
              }
              if (eAlias && findAlias)
                  alias += tmp2;
              else
                  str += tmp2;
              state = ParseState.none;
              break;
          */
          case 11 /* paramsN */:
            if (c === "{")
              state = 12 /* paramsNBlock */;
            else if (c.match(/[^a-zA-Z_$]/g)) {
              state = 0 /* none */;
              idx--;
              if (eAlias && findAlias)
                alias += nParamChar;
              else
                str += nParamChar;
            } else {
              arg = c;
              state = 14 /* paramsNNamed */;
            }
            break;
          case 14 /* paramsNNamed */:
            if (c.match(/[^a-zA-Z0-9_]/g)) {
              if (this.stack.named && this.stack.named.hasOwnProperty(arg)) {
                if (eAlias && findAlias)
                  alias += this.stack.named[arg];
                else
                  str += this.stack.named[arg];
              } else if (this.client.variables.hasOwnProperty(arg)) {
                if (eAlias && findAlias)
                  alias += this.client.variables[arg];
                else
                  str += this.client.variables[arg];
              } else if (eAlias && findAlias)
                alias += nParamChar + arg;
              else
                str += nParamChar + arg;
              idx--;
              state = 0 /* none */;
              arg = "";
            } else
              arg += c;
            break;
          /*
                          case ParseState.paramsNEscape:
                              if (c === '{')
                                  tmp2 = `\{`;
                              else if (c === escChar) 
                                  tmp2 = escChar;
                              else {
                                  tmp2 = nParamChar + escChar;
                                  idx--;
                              }
                              if (eAlias && findAlias)
                                  alias += tmp2;
                              else
                                  str += tmp2;
                              state = ParseState.none;
                              break;
                              */
          case 12 /* paramsNBlock */:
            if (c === "}" && nest === 0) {
              tmp2 = null;
              if (arg === "i")
                tmp2 = this.loops[0];
              else if (arg === "repeatnum")
                tmp2 = this.repeatnum;
              else if (this.stack.args && arg === "*") {
                tmp2 = this.stack.args.slice(1).join(" ");
                this.stack.used = this.stack.args.length;
              } else if (this.stack.named && this.stack.named.hasOwnProperty(arg))
                tmp2 = this.stack.named[arg];
              else {
                if (this.stack.args && !isNaN(arg)) {
                  tmp = parseInt(arg, 10);
                  if (tmp < 0) {
                    if (-tmp >= this.stack.args.length) {
                      if (eEval)
                        tmp2 = tmp;
                      else {
                        tmp2 = nParamChar;
                        idx = idx - arg.length - 2;
                      }
                    } else {
                      tmp2 = this.stack.args.slice(tmp).join(" ");
                      this.stack.used = this.stack.args.length;
                    }
                  } else if (tmp < this.stack.args.length) {
                    tmp2 = this.stack.args[tmp];
                    if (tmp > this.stack.used)
                      this.stack.used = tmp;
                  } else if (eEval)
                    tmp2 = tmp;
                  else {
                    tmp2 = nParamChar;
                    idx = idx - arg.length - 2;
                  }
                } else if (this.stack.args && this.stack.args.indices && arg.match(/^x[-|+]?\d+$/)) {
                  tmp = parseInt(arg.substring(1), 10);
                  if (tmp < 0) {
                    if (-tmp >= this.stack.args.length) {
                      tmp2 = nParamChar;
                      idx = idx - arg.length - 2;
                    } else
                      tmp2 = this.stack.indices.slice(tmp).map((v) => v ? v[0] + " " + v[1] : "0 0").join(" ");
                  } else if (tmp < this.stack.args.length)
                    tmp2 = this.stack.args.indices[tmp] ? this.stack.args.indices[tmp][0] + " " + this.stack.args.indices[tmp][1] : "0 0";
                  else {
                    tmp2 = nParamChar;
                    idx = idx - arg.length - 2;
                  }
                } else {
                  c = this.parseVariable(arg);
                  if (c != null)
                    tmp2 = c;
                  else if (eEval) {
                    tmp2 = this.evaluate(this.parseInline(arg));
                    if (iEval && typeof tmp2 === "undefined")
                      tmp2 = null;
                    else
                      tmp2 = "" + tmp2;
                  } else {
                    tmp2 = nParamChar;
                    idx = idx - arg.length - 2;
                  }
                }
              }
              if (tmp2 != null && eAlias && findAlias)
                alias += tmp2;
              else if (tmp2 != null)
                str += tmp2;
              state = 0 /* none */;
              arg = "";
            } else if (c === "{") {
              nest++;
              arg += c;
            } else if (c === "}") {
              nest--;
              arg += c;
            } else
              arg += c;
            break;
          case 15 /* escape */:
            if (c === escChar || stacking && c === stackingChar || eVerbatim && c === verbatimChar || ePaths && c === spChar || eCmd && c === cmdChar || eParamEscape && c === paramChar || eNParam && c === nParamChar)
              tmp2 = c;
            else if (iComments && c == iCommentsStr[0])
              tmp2 = c;
            else if (bComments && c == bCommentsStr[0])
              tmp2 = c;
            else if (`"'{`.indexOf(c) !== -1)
              tmp2 = c;
            else
              tmp2 = escChar + c;
            if (eAlias && findAlias)
              alias += tmp2;
            else
              str += tmp2;
            state = 0 /* none */;
            break;
          case 16 /* verbatim */:
            if (c === "\n") {
              state = 0 /* none */;
              out += str + c;
              str = "";
              start = true;
            } else {
              str += c;
              start = false;
            }
            break;
          case 20 /* comment */:
            if (iComments && c === iCommentsStr[1])
              state = 22 /* inlineComment */;
            else if (bComments && c === bCommentsStr[1])
              state = 24 /* blockComment */;
            else {
              state = 0 /* none */;
              if (eAlias && findAlias)
                alias += iCommentsStr[0];
              else
                str += iCommentsStr[0];
              idx--;
            }
            break;
          case 21 /* inlineCommentStart */:
            if (c === iCommentsStr[1])
              state = 22 /* inlineComment */;
            else {
              state = 0 /* none */;
              if (eAlias && findAlias)
                alias += iCommentsStr[0];
              else
                str += iCommentsStr[0];
              idx--;
            }
            break;
          case 23 /* blockCommentStart */:
            if (bComments && c === bCommentsStr[1])
              state = 25 /* blockCommentEnd */;
            else {
              state = 0 /* none */;
              if (eAlias && findAlias)
                alias += bCommentsStr[0];
              else
                str += bCommentsStr[0];
              idx--;
            }
            break;
          case 22 /* inlineComment */:
            if (c === "\n") {
              state = 0 /* none */;
              if (!start)
                idx--;
              else {
                alias = "";
                findAlias = true;
                start = true;
              }
            }
            break;
          case 24 /* blockComment */:
            if (bCommentsStr.length === 1) {
              if (c === bCommentsStr[0])
                state = 0 /* none */;
            } else if (c === bCommentsStr[1])
              state = 25 /* blockCommentEnd */;
            break;
          case 25 /* blockCommentEnd */:
            if (c === bCommentsStr[0])
              state = 0 /* none */;
            else
              state = 24 /* blockComment */;
            break;
          default:
            if ((iComments || bComments) && c === iCommentsStr[0] && c === bCommentsStr[0]) {
              if (iComments && iCommentsStr.length === 1)
                state = 22 /* inlineComment */;
              else if (bComments && bCommentsStr.length === 1)
                state = 24 /* blockComment */;
              else
                state = 20 /* comment */;
              continue;
            } else if (iComments && c === iCommentsStr[0]) {
              if (iCommentsStr.length === 1)
                state = 22 /* inlineComment */;
              else
                state = 21 /* inlineCommentStart */;
              continue;
            } else if (bComments && c === bCommentsStr[0]) {
              if (bCommentsStr.length === 1)
                state = 24 /* blockComment */;
              else
                state = 23 /* blockCommentStart */;
              continue;
            } else if (eEscape && c === escChar) {
              state = 15 /* escape */;
              start = false;
              continue;
            } else if (eParam && c === paramChar) {
              state = 8 /* paramsP */;
              _neg = false;
              _pos = false;
              _fall = false;
              arg = "";
              start = false;
            } else if (eNParam && c === nParamChar) {
              state = 11 /* paramsN */;
              _neg = false;
              _pos = false;
              _fall = false;
              arg = "";
              start = false;
            } else if (!noFunctions && eCmd && start && c === cmdChar) {
              state = 7 /* function */;
              start = false;
              if (alias.length) {
                sTrim = alias;
                alias = "";
              } else {
                sTrim = str || "";
                str = "";
              }
            } else if (eVerbatim && start && c === verbatimChar) {
              state = 16 /* verbatim */;
              start = false;
            } else if (ePaths && start && c === spChar) {
              state = 6 /* path */;
              start = false;
            } else if (c === '"' && pd) {
              if (eAlias && findAlias)
                alias += c;
              else
                str += c;
              state = 1 /* doubleQuoted */;
              start = false;
            } else if (c === "'" && ps) {
              if (eAlias && findAlias)
                alias += c;
              else
                str += c;
              state = 2 /* singleQuoted */;
              start = false;
            } else if (start && bTrim && (c === " " || c === "	" || c === "\f" || c === "\r" || c === "\v" || c === " " || c === "\xA0" || c === "\u1680" || c === "\u2000-" || c === "\u200A" || c === "\u2028" || c === "\u2029" || c === "\u202F" || c === "\u205F" || c === "\u3000" || c === "\uFEFF")) {
              if (eAlias && findAlias)
                alias += c;
              else
                str += c;
            } else if (eAlias && findAlias && c === " ") {
              AliasesCached = FilterArrayByKeyValue(aliases, "pattern", bTrim ? alias.trimStart() : alias);
              if (AliasesCached.length > 0) {
                state = 3 /* aliasArguments */;
                args.length = 0;
                arg = "";
                args.push(bTrim ? alias.trimStart() : alias);
              } else {
                str += alias + " ";
                alias = "";
                AliasesCached = null;
              }
              findAlias = false;
              start = false;
            } else if (c === "\n" || stacking && c === stackingChar) {
              if (eAlias && findAlias && alias.length > 0) {
                AliasesCached = FilterArrayByKeyValue(aliases, "pattern", bTrim ? alias.trimStart() : alias);
                if (AliasesCached.length > 0) {
                  args.push(bTrim ? alias.trimStart() : alias);
                  al = AliasesCached.length;
                  for (a = 0; a < al; a++) {
                    str = this.ExecuteAlias(AliasesCached[a], args);
                    if (typeof str === "number") {
                      if (str >= 0)
                        this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
                      if (out.length === 0) return null;
                      return out;
                    }
                    if (str !== null) out += str;
                    if (!a.multi) break;
                    if (this.stack.continue || this.stack.break) {
                      if (out.length === 0) return null;
                      return out;
                    }
                  }
                  str = "";
                  args.length = 0;
                  arg = "";
                } else {
                  str = this.ExecuteTriggers(1 /* CommandInputRegular */ | 16 /* CommandInputPattern */, alias, alias, false, true);
                  if (typeof str === "number") {
                    if (str >= 0)
                      this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
                    if (out.length === 0) return null;
                    return out;
                  }
                  if (str !== null) out += str + "\n";
                  str = "";
                  AliasesCached = null;
                }
              } else {
                str = this.ExecuteTriggers(1 /* CommandInputRegular */ | 16 /* CommandInputPattern */, str, str, false, true);
                if (typeof str === "number") {
                  if (str >= 0)
                    this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
                  if (out.length === 0) return null;
                  return out;
                }
                if (str !== null) out += str + "\n";
                str = "";
              }
              if (this.stack.continue || this.stack.break) {
                if (out.length === 0) return null;
                return out;
              }
              alias = "";
              findAlias = true;
              start = true;
            } else if (eAlias && findAlias) {
              alias += c;
              start = false;
            } else {
              str += c;
              start = false;
            }
            break;
        }
      }
      if (state === 15 /* escape */)
        str += escChar;
      else if (state === 14 /* paramsNNamed */ && arg.length > 0) {
        if (this.stack.named && this.stack.named[arg])
          str += this.stack.named[arg];
        else if (this.client.variables.hasOwnProperty(arg))
          str += this.client.variables[arg];
        else {
          arg = this.parseInline(arg);
          str += nParamChar;
          if (arg != null) str += arg;
        }
      } else if (state === 8 /* paramsP */ && arg.length > 0) {
        if (this.stack.args) {
          arg = parseInt(arg, 10);
          if (_pos && this.stack.args.indices && arg < this.stack.args.length)
            str += this.stack.args.indices[arg] ? this.stack.args.indices[arg][0] + " " + this.stack.args.indices[arg][1] : "0 0";
          else {
            if (_neg && arg < this.stack.args.length)
              str += this.stack.args.slice(arg).join(" ");
            else if (arg < this.stack.args.length)
              str += this.stack.args[arg];
            if (_neg)
              this.stack.used = this.stack.args.length;
            else if (arg > this.stack.used)
              this.stack.used = arg;
          }
        } else {
          arg = this.parseInline(arg);
          str += paramChar;
          if (_neg)
            str += "-";
          if (_pos)
            str += "x";
          if (arg != null) str += arg;
        }
      } else if (state === 9 /* paramsPBlock */) {
        arg = this.parseInline(arg);
        str += paramChar + "{";
        if (arg != null) str += arg;
      } else if (state === 11 /* paramsN */ && arg.length > 0) {
        if (this.stack.named) {
          if (this.stack.named.hasOwnProperty(arg)) {
            str += this.stack.named[arg];
          } else {
            arg = this.parseInline(arg);
            str += nParamChar;
            if (arg != null) str += arg;
          }
        } else {
          arg = this.parseInline(arg);
          str += nParamChar;
          if (arg != null) str += arg;
        }
      } else if (state === 12 /* paramsNBlock */) {
        arg = this.parseInline(arg);
        str += `${nParamChar}{`;
        if (arg != null) str += arg;
      } else if (state === 6 /* path */) {
        str = this.ProcessPath(str);
        if (str !== null) out += str;
        str = "";
      } else if (state === 20 /* comment */) {
        str += iCommentsStr[0];
        idx--;
      } else if (state === 21 /* inlineCommentStart */) {
        str += iCommentsStr[0];
        idx--;
      } else if (state === 23 /* blockCommentStart */) {
        str += bCommentsStr[0];
        idx--;
      }
      if (!noFunctions && state === 7 /* function */) {
        str = this.executeScript(cmdChar + str);
        if (typeof str === "number") {
          if (str >= 0)
            this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
          if (out.length === 0) return null;
          return out;
        }
        if (str !== null) {
          if (append && eAlias && this.stack.args && this.stack.append && this.stack.args.length - 1 > 0 && this.stack.used + 1 < this.stack.args.length) {
            let r = false;
            if (str.endsWith("\n")) {
              str = str.substring(0, str.length - 1);
              r = true;
            }
            if (!str.endsWith(" "))
              str += " ";
            if (this.stack.used < 1)
              str += this.stack.args.slice(1).join(" ");
            else
              str += this.stack.args.slice(this.stack.used + 1).join(" ");
            this.stack.used = this.stack.args.length;
            if (r) str += "\n";
          }
          out += sTrim + str;
        } else if (out.length === 0) return null;
        if (this.stack.continue || this.stack.break) {
          if (out.length === 0) return null;
          return out;
        }
      } else if (state === 16 /* verbatim */) {
        if (append && eAlias && this.stack.args && this.stack.append && this.stack.args.length - 1 > 0 && this.stack.used + 1 < this.stack.args.length) {
          let r = false;
          if (str.endsWith("\n")) {
            str = str.substring(0, str.length - 1);
            r = true;
          }
          if (!str.endsWith(" "))
            str += " ";
          if (this.stack.used < 1)
            str += this.stack.args.slice(1).join(" ");
          else
            str += this.stack.args.slice(this.stack.used + 1).join(" ");
          this.stack.used = this.stack.args.length;
          if (r) str += "\n";
        }
        out += str;
      } else if (alias.length > 0 && eAlias && findAlias) {
        if (append && eAlias && this.stack.args && this.stack.append && this.stack.args.length - 1 > 0 && this.stack.used + 1 < this.stack.args.length) {
          let r = false;
          if (str.endsWith("\n")) {
            str = str.substring(0, str.length - 1);
            r = true;
          }
          if (!str.endsWith(" "))
            str += " ";
          if (this.stack.used < 1)
            str += this.stack.args.slice(1).join(" ");
          else
            str += this.stack.args.slice(this.stack.used + 1).join(" ");
          this.stack.used = this.stack.args.length;
          if (r) str += "\n";
        }
        if (str.length > 0)
          alias += str;
        AliasesCached = FilterArrayByKeyValue(aliases, "pattern", bTrim ? alias.trimStart() : alias);
        if (AliasesCached.length > 0) {
          args.push(bTrim ? alias.trimStart() : alias);
          al = AliasesCached.length;
          for (a = 0; a < al; a++) {
            str = this.ExecuteAlias(AliasesCached[a], args);
            if (typeof str === "number") {
              if (str >= 0)
                this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
              if (out.length === 0) return null;
              return out;
            }
            if (str !== null) out += str;
            else if (out.length === 0) return null;
            if (this.stack.continue || this.stack.break) {
              return out;
            }
            if (!a.multi) break;
          }
        } else {
          str = this.ExecuteTriggers(1 /* CommandInputRegular */ | 16 /* CommandInputPattern */, alias, alias, false, true);
          if (typeof str === "number") {
            if (str >= 0)
              this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
            if (out.length === 0) return null;
            return out;
          }
          if (str !== null) out += str;
          else if (out.length === 0) return null;
          if (this.stack.continue || this.stack.break) {
            return out;
          }
        }
        AliasesCached = null;
      } else if (alias.length > 0) {
        if (str.length > 0)
          alias += str;
        str = this.ExecuteTriggers(1 /* CommandInputRegular */ | 16 /* CommandInputPattern */, alias, alias, false, true);
        if (typeof str === "number") {
          if (str >= 0)
            this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
          if (out.length === 0) return null;
          return out;
        }
        if (str !== null) {
          if (append && eAlias && this.stack.args && this.stack.append && this.stack.args.length - 1 > 0 && this.stack.used + 1 < this.stack.args.length) {
            let r = false;
            if (str.endsWith("\n")) {
              str = str.substring(0, str.length - 1);
              r = true;
            }
            if (!str.endsWith(" "))
              str += " ";
            if (this.stack.used < 1)
              str += this.stack.args.slice(1).join(" ");
            else
              str += this.stack.args.slice(this.stack.used + 1).join(" ");
            this.stack.used = this.stack.args.length;
            if (r) str += "\n";
          }
          out += str;
        } else if (out.length === 0) return null;
        if (this.stack.continue || this.stack.break) {
          if (out.length === 0) return null;
          return out;
        }
      } else if (str.length > 0) {
        str = this.ExecuteTriggers(1 /* CommandInputRegular */ | 16 /* CommandInputPattern */, str, str, false, true);
        if (typeof str === "number") {
          if (str >= 0)
            this.executeWait(text.substr(idx + 1), str, eAlias, stacking, append, noFunctions, noComments);
          if (out.length === 0) return null;
          return out;
        }
        if (str !== null) {
          if (append && eAlias && this.stack.args && this.stack.append && this.stack.args.length - 1 > 0 && this.stack.used + 1 < this.stack.args.length) {
            let r = false;
            if (str.endsWith("\n")) {
              str = str.substring(0, str.length - 1);
              r = true;
            }
            if (!str.endsWith(" "))
              str += " ";
            if (this.stack.used < 1)
              str += this.stack.args.slice(1).join(" ");
            else
              str += this.stack.args.slice(this.stack.used + 1).join(" ");
            if (r) str += "\n";
          }
          out += str;
        } else if (out.length === 0) return null;
        if (this.stack.continue || this.stack.break) {
          if (out.length === 0) return null;
          return out;
        }
      }
      args.length = 0;
      args = null;
      arg = null;
      alias = null;
      return out;
    }
    parseVariable(text) {
      let c;
      switch (text) {
        case "esc":
          return "\x1B";
        case "cr":
          return "\n";
        case "lf":
          return "\r";
        case "crlf":
          return "\r\n";
        case "copied":
          return window.$copied;
        case "copied.lower":
          return window.$copied.toLowerCase();
        case "copied.upper":
          return window.$copied.toUpperCase();
        case "copied.proper":
          return ProperCase(window.$copied);
        case "i":
          return this.loops[0];
        case "repeatnum":
          return this.vStack["$repeatnum"] || this.repeatnum;
        case "character":
          return window.$character;
        case "character.lower":
          return window.$character.toLowerCase();
        case "character.upper":
          return window.$character.toUpperCase();
        case "character.proper":
          return ProperCase(window.$character);
        case "selected":
        case "selectedurl":
        case "selectedline":
        case "selectedword":
        case "selurl":
        case "selline":
        case "selword":
        case "action":
        case "trigger":
          return this.vStack["$" + text] || window["$" + text] || "";
        case "selected.lower":
        case "selectedurl.lower":
        case "selectedline.lower":
        case "selectedword.lower":
        case "selurl.lower":
        case "selline.lower":
        case "selword.lower":
          return (this.vStack["$" + text.substr(0, text.length - 6)] || window["$" + text.substr(0, text.length - 6)] || "").toLowerCase();
        case "selected.upper":
        case "selectedurl.upper":
        case "selectedline.upper":
        case "selectedword.upper":
        case "selurl.upper":
        case "selline.upper":
        case "selword.upper":
          return (this.vStack["$" + text.substr(0, text.length - 6)] || window["$" + text.substr(0, text.length - 6)] || "").toUpperCase();
        case "selected.proper":
        case "selectedurl.proper":
        case "selectedline.proper":
        case "selectedword.proper":
        case "selurl.proper":
        case "selline.proper":
        case "selword.proper":
          return ProperCase(this.vStack["$" + text.substr(0, text.length - 7)] || window["$" + text.substr(0, text.length - 7)]);
        case "random":
          return mathjs().randomInt(0, 100);
      }
      if (WindowVariables.indexOf(text) !== -1)
        return this.vStack["$" + text] || window["$" + text] || "";
      if (this.loops.length && text.length === 1) {
        let i = text.charCodeAt(0) - 105;
        if (i >= 0 && i < 18 && i < this.loops.length)
          return this.loops[i];
      }
      const re = new RegExp("^([a-zA-Z]+)\\((.*)\\)$", "g");
      let res = re.exec(text);
      if (!res || !res.length) {
        const data2 = { raw: text, name: text, args: [], handled: false, return: null };
        this.client.emit("variable", data2);
        if (data2.handled)
          return data2.return;
        return null;
      }
      let sides;
      let mod;
      let args;
      let min;
      let max;
      let escape2 = this.client.getOption("allowEscape") ? this.client.getOption("escapeChar") : "";
      switch (res[1]) {
        case "time":
          if (!moment) return (/* @__PURE__ */ new Date()).toISOString();
          if (res[2] && res[2].length > 0)
            return moment().format(this.stripQuotes(this.parseInline(res[2])));
          return moment().format();
        case "clip":
          if (res[2] && res[2].length > 0) {
            this.client.writeClipboard(this.stripQuotes(this.parseInline(res[2])));
            return null;
          }
          return this.client.readClipboard();
        case "lower":
          return this.stripQuotes(this.parseInline(res[2]).toLowerCase());
        case "upper":
          return this.stripQuotes(this.parseInline(res[2]).toUpperCase());
        case "proper":
          return ProperCase(this.stripQuotes(this.parseInline(res[2])));
        case "eval":
          args = this.evaluate(this.parseInline(res[2]));
          if (this.client.getOption("ignoreEvalUndefined") && typeof args === "undefined")
            return null;
          return "" + args;
        case "dice":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0) throw new Error("Invalid dice");
          if (args.length === 1) {
            res = /(\d+)\s*?d(F|f|%|\d+)(\s*?[-|+|*|\/]?\s*?\d+)?/g.exec(args[0]);
            if (!res || res.length < 3) return null;
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = parseInt(args[0]);
            sides = args[1].trim();
            if (args.length > 2)
              mod = args[2].trim();
          } else
            throw new Error("Too many arguments for dice");
          if (sides === "F" || sides === "f")
            sides = "F";
          else if (sides !== "%")
            sides = parseInt(sides);
          let sum = 0;
          for (let i = 0; i < c; i++) {
            if (sides === "F" || sides === "f")
              sum += fudgeDice();
            else if (sides === "%")
              sum += ~~(Math.random() * 100) + 1;
            else
              sum += ~~(Math.random() * sides) + 1;
          }
          if (sides === "%")
            sum /= 100;
          if (mod)
            return this.evaluate(sum + mod);
          return "" + sum;
        case "diceavg":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0) throw new Error("Invalid dice for diceavg");
          if (args.length === 1) {
            res = /(\d+)d(F|f|%|\d+)([-|+|*|/]?\d+)?/g.exec(args[0]);
            if (!res || res.length < 3) return null;
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = parseInt(args[0]);
            sides = args[1].trim();
            if (args.length > 2)
              mod = args[2].trim();
          } else
            throw new Error("Too many arguments for diceavg");
          min = 1;
          if (sides === "F" || sides === "f") {
            min = -1;
            max = 1;
          } else if (sides === "%") {
            min = 0;
            max = 1;
          } else
            max = parseInt(sides);
          if (mod)
            return this.evaluate((min + max) / 2 * c + mod);
          return "" + (min + max) / 2 * c;
        case "dicemin":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0) throw new Error("Invalid dice for dicemin");
          if (args.length === 1) {
            res = /(\d+)d(F|f|%|\d+)([-|+|*|/]?\d+)?/g.exec(args[0]);
            if (!res || res.length < 3) return null;
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = parseInt(args[0]);
            sides = args[1].trim();
            if (args.length > 2)
              mod = args[2];
          } else
            throw new Error("Too many arguments for dicemin");
          min = 1;
          if (sides === "F" || sides === "f")
            min = -1;
          else if (sides === "%")
            min = 0;
          if (mod)
            return this.evaluate(min * c + mod);
          return "" + min * c;
        case "dicemax":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0) throw new Error("Invalid dice for dicemax");
          if (args.length === 1) {
            res = /(\d+)d(F|f|%|\d+)([-|+|*|/]?\d+)?/g.exec(args[0]);
            if (!res || res.length < 3) return null;
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = parseInt(args[0]);
            sides = args[1].trim();
            if (args.length > 2)
              mod = args[2].trim();
          } else
            throw new Error("Too many arguments for dicemax");
          if (sides === "F" || sides === "f")
            max = 1;
          else if (sides === "%")
            max = 1;
          else
            max = parseInt(sides);
          if (mod)
            return this.evaluate(max * c + mod);
          return "" + max * c;
        case "zdicedev":
        case "dicedev":
          const fun = res[1];
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0) throw new Error("Invalid dice for " + fun);
          if (args.length === 1) {
            res = /(\d+)d(F|f|%|\d+)([-|+|*|/]?\d+)?/g.exec(args[0]);
            if (!res || res.length < 3) return null;
            c = parseInt(res[1]);
            sides = res[2];
            if (res.length > 3)
              mod = res[3];
          } else if (args.length < 4) {
            c = parseInt(args[0]);
            sides = args[1].trim();
            if (args.length > 2)
              mod = args[2].trim();
          } else
            throw new Error("Too many arguments for " + fun);
          if (sides === "F" || sides === "f")
            max = 6;
          else if (sides === "%")
            max = 1;
          else
            max = parseInt(sides);
          if (fun === "zdicedev")
            max--;
          if (mod)
            return this.evaluate(Math.sqrt((max * max - 1) / 12 * c) + mod);
          return "" + Math.sqrt((max * max - 1) / 12 * c);
        case "color":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for color");
          else if (args.length === 1) {
            if (args[0] === "bold")
              return "370";
            c = getAnsiColorCode(args[0]);
            if (c === -1)
              throw new Error("Invalid fore color");
            return c.toString();
          } else if (args.length === 2) {
            if (args[0] === "bold")
              c = 370;
            else {
              c = getAnsiColorCode(args[0]);
              if (c === -1)
                throw new Error("Invalid fore color");
              if (args[1] === "bold")
                return (c * 10).toString();
            }
            sides = c.toString();
            c = getAnsiColorCode(args[1], true);
            if (c === -1)
              throw new Error("Invalid back color");
            return sides + "," + c.toString();
          } else if (args.length === 3) {
            if (args[0] === "bold") {
              args.shift();
              args.push("bold");
            }
            if (args[2] !== "bold")
              throw new Error("Only bold is supported as third argument for color");
            c = getAnsiColorCode(args[0]);
            if (c === -1)
              throw new Error("Invalid fore color");
            sides = (c * 10).toString();
            c = getAnsiColorCode(args[1], true);
            if (c === -1)
              throw new Error("Invalid back color");
            return sides + "," + c.toString();
          }
          throw new Error("Too many arguments");
        case "zcolor":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for zcolor");
          else if (args.length > 1)
            throw new Error("Too many arguments for zcolor");
          return getColorCode(parseInt(args[0], 10));
        case "ansi":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for ansi");
          c = args.length;
          mod = [];
          min = {};
          for (sides = 0; sides < c; sides++) {
            if (args[sides].trim() === "current")
              mod.push(args[sides].trim());
            else {
              max = getAnsiCode(args[sides].trim());
              if (max === -1)
                throw new Error("Invalid color or style for ansi");
              if (max >= 0 && max < 30)
                min[max] = 1;
              else
                mod.push(args[sides]);
            }
          }
          if (mod.length > 2)
            throw new Error("Too many colors for ansi");
          if (mod.length > 1) {
            if (mod[1] === "current")
              mod[1] = "";
            else
              mod[1] = getAnsiCode(mod[1], true);
          }
          if (mod.length > 0) {
            if (min[1] && mod[0] === "white")
              mod[0] = "";
            else if (mod[0] === "current")
              mod[0] = "";
            else
              mod[0] = getAnsiCode(mod[0]);
          }
          min = [...Object.keys(min), ...mod];
          if (!min.length)
            throw new Error("Invalid colors or styles for ansi");
          min = min.filter((f) => f !== "");
          return `\x1B[${min.join(";")}m`;
        case "random":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0) throw new Error("Invalid random");
          if (args.length === 1)
            return mathjs().randomInt(0, parseInt(args[0], 10) + 1);
          else if (args.length === 2)
            return mathjs().randomInt(parseInt(args[0], 10), parseInt(args[1], 10) + 1);
          else
            throw new Error("Too many arguments for random");
        case "case":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for case");
          c = this.evaluate(this.parseInline(args[0]));
          if (typeof c !== "number")
            return "";
          if (c > 0 && c < args.length)
            return this.stripQuotes(args[c]);
          return "";
        case "switch":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for switch");
          if (args.length % 2 === 1)
            throw new Error("All expressions must have a value for switch");
          sides = args.length;
          for (c = 0; c < sides; c += 2) {
            if (this.evaluate(args[c]))
              return this.stripQuotes(args[c + 1]);
          }
          return "";
        case "if":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length < 3)
            throw new Error("Missing arguments for if");
          if (args.length !== 3)
            throw new Error("Too many arguments for if");
          if (this.evaluate(args[0]))
            return this.stripQuotes(args[1].trim());
          return this.stripQuotes(args[2].trim());
        case "ascii":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for ascii");
          else if (args.length > 1)
            throw new Error("Too many arguments for ascii");
          if (args[0].trim().length === 0)
            throw new Error("Invalid argument, empty string for ascii");
          return args[0].trim().charCodeAt(0);
        case "char":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for char");
          else if (args.length > 1)
            throw new Error("Too many arguments for char");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for char");
          return String.fromCharCode(c);
        case "begins":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length < 2)
            throw new Error("Missing arguments for begins");
          else if (args.length > 2)
            throw new Error("Too many arguments for begins");
          return this.stripQuotes(args[0]).startsWith(this.stripQuotes(args[1]));
        case "ends":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length < 2)
            throw new Error("Missing arguments for ends");
          else if (args.length > 2)
            throw new Error("Too many arguments for ends");
          return this.stripQuotes(args[0]).endsWith(this.stripQuotes(args[1]));
        case "len":
          return this.stripQuotes(this.parseInline(res[2])).length;
        case "stripansi":
          const ansiRegex = new RegExp("[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))", "g");
          return this.stripQuotes(this.parseInline(res[2])).replace(ansiRegex, "");
        case "pos":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length < 2)
            throw new Error("Missing arguments for pos");
          else if (args.length > 2)
            throw new Error("Too many arguments for pos");
          return this.stripQuotes(args[1]).indexOf(this.stripQuotes(args[0])) + 1;
        case "ipos":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length < 2)
            throw new Error("Missing arguments for ipos");
          else if (args.length > 2)
            throw new Error("Too many arguments for ipos");
          return this.stripQuotes(args[1]).toLowerCase().indexOf(this.stripQuotes(args[0]).toLowerCase()) + 1;
        case "regex":
          args = this.splitByQuotes(res[2], ",");
          if (args.length < 2)
            throw new Error("Missing arguments for regex");
          c = new RegExp(this.stripQuotes(args[1]), "gd");
          c = c.exec(this.stripQuotes(this.parseInline(args[0])));
          args.shift();
          args.shift();
          if (c == null || c.length === 0)
            return 0;
          if (args.length) {
            for (sides = 1; sides < c.length; sides++) {
              if (!args.length)
                break;
              this.client.variables[this.stripQuotes(this.parseInline(args[0]))] = c[sides];
              args.shift();
            }
            if (args.length)
              this.client.variables[this.stripQuotes(this.parseInline(args[0]))] = c[0].length;
          }
          if (!c.indices[0])
            return 1;
          return c.indices[0][0] + 1;
        case "trim":
          return this.stripQuotes(this.parseInline(res[2])).trim();
        case "trimleft":
          return this.stripQuotes(this.parseInline(res[2])).trimLeft();
        case "trimright":
          return this.stripQuotes(this.parseInline(res[2])).trimRight();
        case "bitand":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for bitand");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitand");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for bitand");
          sides = parseInt(args[1], 10);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1] + "' must be a number for bitand");
          return c & sides;
        case "bitnot":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for bitnot");
          else if (args.length !== 1)
            throw new Error("Too many arguments for bitnot");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for bitnot");
          return ~c;
        case "bitor":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for bitor");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitor");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for bitor");
          sides = parseInt(args[1], 10);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1] + "' must be a number for bitor");
          return c | sides;
        case "bitset":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for bitset");
          else if (args.length > 3)
            throw new Error("Too many arguments for bitset");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for bitset");
          sides = parseInt(args[1], 10);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1] + "' must be a number for bitset");
          sides--;
          mod = 1;
          if (args.length === 3) {
            mod = parseInt(args[2], 10);
            if (isNaN(mod))
              throw new Error("Invalid argument '" + args[2] + "' must be a number for bitset");
          }
          return c & ~(1 << sides) | (mod ? 1 : 0) << sides;
        case "bitshift":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for bitshift");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitshift");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for bitshift");
          sides = parseInt(args[1], 10);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1] + "' must be a number for bitshift");
          if (sides < 0)
            return c >> -sides;
          return c << sides;
        case "bittest":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for bittest");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bittest");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for bittest");
          sides = parseInt(args[1], 10);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1] + "' must be a number for bittest");
          sides--;
          return (c >> sides) % 2 != 0 ? 1 : 0;
        case "bitxor":
          args = this.parseInline(res[2]).split(",");
          if (args.length === 0)
            throw new Error("Missing arguments for bitxor");
          else if (args.length !== 2)
            throw new Error("Too many arguments for bitxor");
          c = parseInt(args[0], 10);
          if (isNaN(c))
            throw new Error("Invalid argument '" + args[0] + "' must be a number for bitxor");
          sides = parseInt(args[1], 10);
          if (isNaN(sides))
            throw new Error("Invalid argument '" + args[1] + "' must be a number for bitxor");
          return c ^ sides;
        case "number":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for number");
          else if (args.length > 1)
            throw new Error("Too many arguments for number");
          args[0] = this.stripQuotes(args[0], true);
          if (args[0].match(/^\s*?[-|+]?\d+\s*?$/))
            return parseInt(args[0], 10);
          else if (args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return parseFloat(args[0]);
          else if (args[0] === "true")
            return 1;
          else if (args[0] === "false")
            return 0;
          return 0;
        case "isfloat":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for isfloat");
          else if (args.length > 1)
            throw new Error("Too many arguments for isfloat");
          if (args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return 1;
          return 0;
        case "isnumber":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for isnumber");
          else if (args.length > 1)
            throw new Error("Too many arguments for isnumber");
          if (args[0].match(/^\s*?[-|+]?\d+\s*?$/) || args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return 1;
          return 0;
        case "string":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for string");
          else if (args.length > 1)
            throw new Error("Too many arguments for string");
          return `"${this.stripQuotes(args[0]), true}"`;
        case "float":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for float");
          else if (args.length > 1)
            throw new Error("Too many arguments for float");
          args[0] = this.stripQuotes(args[0], true);
          if (args[0].match(/^\s*?[-|+]?\d+\s*?$/) || args[0].match(/^\s*?[-|+]?\d+\.\d+\s*?$/))
            return parseFloat(args[0]);
          else if (args[0] === "true")
            return 1;
          else if (args[0] === "false")
            return 0;
          return 0;
        case "isdefined":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for isdefined");
          else if (args.length > 1)
            throw new Error("Too many arguments for isdefined");
          args[0] = this.stripQuotes(args[0], true);
          if (this.client.variables.hasOwnProperty(args[0]))
            return 1;
          return 0;
        case "defined":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for defined");
          else if (args.length === 1) {
            args[0] = this.stripQuotes(args[0], true);
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0) return 0;
            for (; k < kl; k++) {
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
              sides = sides.find((i) => {
                return i.pattern === args[0];
              });
              if (sides) return 1;
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
              sides = sides.find((i) => {
                return i.pattern === args[0] || i.name === args[0];
              });
              if (sides) return 1;
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].macros);
              sides = sides.find((i) => {
                return MacroDisplay(i).toLowerCase() === args[0].toLowerCase() || i.name === args[0];
              });
              if (sides) return 1;
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
              sides = sides.find((i) => {
                return i.caption === args[0] || i.name === args[0];
              });
              if (sides) return 1;
            }
            return this.client.variables.hasOwnProperty(args[0]);
          } else if (args.length === 2) {
            args[0] = this.stripQuotes(args[0], true);
            args[1] = this.stripQuotes(args[1], true).toLowerCase();
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0) return 0;
            for (; k < kl; k++) {
              switch (args[1]) {
                case "alias":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
                  sides = sides.find((i) => {
                    return i.pattern === args[0];
                  });
                  if (sides) return 1;
                  return 0;
                case "event":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  sides = sides.find((i) => {
                    return i.type === 2 /* Event */ && (i.pattern === args[0] || i.name === args[0]);
                  });
                  if (sides) return 1;
                  return 0;
                case "trigger":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                  sides = sides.find((i) => {
                    return i.pattern === args[0] || i.name === args[0];
                  });
                  if (sides) return 1;
                  return 0;
                case "macro":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].macros);
                  sides = sides.find((i) => {
                    return MacroDisplay(i).toLowerCase() === args[0].toLowerCase() || i.name === args[0];
                  });
                  if (sides) return 1;
                  return 0;
                case "button":
                  sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].aliases);
                  sides = sides.find((i) => {
                    return i.caption === args[0] || i.name === args[0];
                  });
                  if (sides) return 1;
                  return 0;
              }
            }
            if (args[1] === "variable")
              return this.client.variables.hasOwnProperty(args[0]);
          } else
            throw new Error("Too many arguments for defined");
          return 0;
        case "escape":
          args = this.stripQuotes(this.parseInline(res[2]));
          if (this.client.getOption("allowEscape")) {
            c = escape2;
            if (escape2 === "\\")
              c += escape2;
            if (this.client.getOption("parseDoubleQuotes"))
              c += '"';
            if (this.client.getOption("parseSingleQuotes"))
              c += "'";
            if (this.client.getOption("commandStacking"))
              c += this.client.getOption("commandStackingChar");
            if (this.client.getOption("enableSpeedpaths"))
              c += this.client.getOption("speedpathsChar");
            if (this.client.getOption("enableCommands"))
              c += this.client.getOption("commandChar");
            if (this.client.getOption("enableVerbatim"))
              c += this.client.getOption("verbatimChar");
            if (this.client.getOption("enableDoubleParameterEscaping"))
              c += this.client.getOption("parametersChar");
            if (this.client.getOption("enableNParameters"))
              c += this.client.getOption("nParametersChar");
            return args.replace(new RegExp(`[${c}]`, "g"), escape2 + "$&");
          }
          return args.replace(/[\\"']/g, "$&");
        case "unescape":
          args = this.stripQuotes(this.parseInline(res[2]));
          if (this.client.getOption("allowEscape")) {
            c = escape2;
            if (escape2 === "\\")
              c += escape2;
            if (this.client.getOption("parseDoubleQuotes"))
              c += '"';
            if (this.client.getOption("parseSingleQuotes"))
              c += "'";
            if (this.client.getOption("commandStacking"))
              c += this.client.getOption("commandStackingChar");
            if (this.client.getOption("enableSpeedpaths"))
              c += this.client.getOption("speedpathsChar");
            if (this.client.getOption("enableCommands"))
              c += this.client.getOption("commandChar");
            if (this.client.getOption("enableVerbatim"))
              c += this.client.getOption("verbatimChar");
            if (this.client.getOption("enableDoubleParameterEscaping"))
              c += this.client.getOption("parametersChar");
            if (this.client.getOption("enableNParameters"))
              c += this.client.getOption("nParametersChar");
            if (escape2 === "\\")
              return args.replace(new RegExp(`\\\\[${c}]`, "g"), (m) => m.substr(1));
            return args.replace(new RegExp(`${escape2}[${c}]`, "g"), (m) => m.substr(1));
          }
          return args.replace(/\\[\\"']/g, (m) => m.substr(1));
        case "alarm":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for alarm");
          if (args.length > 3)
            throw new Error("Too many arguments for alarm");
          args[0] = this.stripQuotes(args[0]);
          sides = this.client.alarms;
          max = sides.length;
          if (max === 0)
            throw new Error("No alarms set.");
          c = 0;
          if (args.length === 1) {
            for (; c < max; c++) {
              if (sides[c].type !== 3 /* Alarm */) continue;
              if (sides[c].name === args[0] || sides[c].pattern === args[0]) {
                if (sides[c].suspended)
                  return 0;
                return this.client.getRemainingAlarmTime(c);
              }
            }
          } else if (args.length === 2) {
            mod = parseInt(args[1], 10);
            if (isNaN(mod)) {
              args[1] = this.stripQuotes(args[1].trim());
              for (; c < max; c++) {
                if (sides[c].type !== 3 /* Alarm */) continue;
                if (sides[c].name === args[0] || sides[c].pattern === args[0]) {
                  if (sides[c].profile.name.toUpperCase() !== args[1].toUpperCase())
                    continue;
                  if (sides[c].suspended)
                    return 0;
                  return this.client.getRemainingAlarmTime(c);
                }
              }
              throw Error("Alarm not found in profile: " + args[1] + ".");
            } else {
              for (; c < max; c++) {
                if (sides[c].type !== 3 /* Alarm */) continue;
                if (sides[c].name === args[0] || sides[c].pattern === args[0]) {
                  if (!sides[c].suspended)
                    this.client.setAlarmTempTime(c, mod);
                  return mod;
                }
              }
              throw Error("Alarm not found.");
            }
          } else if (args.length === 3) {
            mod = parseInt(args[1], 10);
            if (isNaN(mod))
              throw new Error("Invalid time for alarm");
            args[2] = this.stripQuotes(args[2].trim());
            for (; c < max; c++) {
              if (sides[c].type !== 3 /* Alarm */) continue;
              if (sides[c].name === args[0] || sides[c].pattern === args[0]) {
                if (sides[c].profile.name.toUpperCase() !== args[2].toUpperCase())
                  continue;
                if (!sides[c].suspended)
                  this.client.setAlarmTempTime(c, mod);
                return mod;
              }
            }
            throw Error("Could not set time, alarm not found in profile: " + args[2] + ".");
          }
          return 0;
        case "state":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            throw new Error("Missing arguments for state");
          if (args.length > 2)
            throw new Error("Too many arguments for state");
          args[0] = this.stripQuotes(args[0]);
          mod = null;
          if (args.length === 1) {
            const keys = this.client.profiles.keys;
            let k = 0;
            const kl = keys.length;
            if (kl === 0)
              return null;
            if (kl === 1) {
              if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
                throw Error("No enabled profiles found!");
              sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
              sides = sides.find((t) => {
                return t.name === args[0] || t.pattern === args[0];
              });
            } else {
              for (; k < kl; k++) {
                if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
                  continue;
                sides = SortItemArrayByPriority(this.client.profiles.items[keys[k]].triggers);
                sides = sides.find((t) => {
                  return t.name === args[0] || t.pattern === args[0];
                });
                if (sides)
                  break;
              }
            }
          } else if (args.length === 2) {
            args[1] = this.stripQuotes(args[1].trim());
            if (this.client.profiles.contains(args[1]))
              mod = this.client.profiles.items[args[1].toLowerCase()];
            else
              throw new Error("Profile not found: " + args[1]);
            sides = SortItemArrayByPriority(mod.triggers);
            sides = sides.find((t) => {
              return t.name === args[0] || t.pattern === args[0];
            });
          }
          if (sides)
            return sides.triggers && sides.triggers.length ? sides.state : 0;
          throw new Error("Trigger not found");
        case "isnull":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            return null;
          if (args.length !== 1)
            throw new Error("Too many arguments for null");
          return this.evaluate(args[0]) === null ? 1 : 0;
        case "prompt":
          args = this.splitByQuotes(this.parseInline(res[2]), ",");
          if (args.length === 0)
            return window.prompt() || "";
          if (args.length > 3)
            throw new Error("Too many arguments");
          args = args.map((a) => this.stripQuotes(a));
          return window.prompt(...args) || "";
      }
      const data = { raw: text, name: res[1], args: res[2] && res[2].length ? this.parseOutgoing(res[2]).split(",") : [], handled: false, return: null };
      this.client.emit("variable", data);
      if (data.handled)
        return data.return;
      return null;
    }
    GetNamedArguments(str, args, append) {
      if (str === "*")
        return args;
      if (append == null) append = false;
      if (str == null || str.length === 0)
        return append ? args : [];
      const n = str.split(",");
      const nl = n.length;
      const al = args.length;
      if (nl === 0)
        return append ? args : [];
      let named;
      if (append)
        named = args.slice();
      else
        named = [];
      for (let s = 0; s < nl; s++) {
        n[s] = $.trim(n[s]);
        if (n[s].length < 1) continue;
        if (n[s].startsWith("$")) n[s] = n[s].substring(1);
        if (!n[s].match(/^[a-zA-Z0-9_][a-zA-Z0-9_]+$/g)) continue;
        if (!isValidIdentifier(n[s])) continue;
        if (named[n[s]]) continue;
        named[n[s]] = s + 1 < al ? args[s + 1] : "";
      }
      return named;
    }
    ExecuteAlias(alias, args) {
      if (!alias.enabled) return;
      let ret;
      if (alias.value.length)
        switch (alias.style) {
          case 1:
            this._stack.push({ loops: [], args, named: this.GetNamedArguments(alias.params, args), append: alias.append, used: 0 });
            ret = this.parseOutgoing(alias.value, null, null, true);
            this._stack.pop();
            break;
          case 2:
            if ((this.client.getOption("echo") & 2) === 2)
              this.client.echo(alias.value, -7, -8, true, true);
            const named = this.GetNamedArguments(alias.params, args);
            if (named)
              ret = Object.keys(named).map((v) => `let ${v} = this.input.stack.named["${v}"];`).join("") + "\n";
            else
              ret = "";
            const f = new Function("try { " + ret + alias.value + "\n} catch (e) { if(this.getOption('showScriptErrors')) this.error(e);}");
            this._stack.push({ loops: [], args, named, append: alias.append, used: 0 });
            try {
              ret = f.apply(this.client, args);
            } catch (e) {
              throw e;
            } finally {
              this._stack.pop();
            }
            if (typeof ret === "string")
              ret = this.parseOutgoing(ret, null, null, true);
            break;
          default:
            ret = alias.value;
            break;
        }
      if (ret == null || ret === void 0)
        return null;
      ret = this.ExecuteTriggers(1 /* CommandInputRegular */ | 16 /* CommandInputPattern */, ret, ret, false, true);
      if (ret == null || ret === void 0)
        return null;
      if (typeof ret !== "string")
        ret = ret.toString();
      if (ret.length === 0 && !this.client.getOption("returnNewlineOnEmptyValue"))
        return null;
      if (ret.endsWith("\n"))
        return ret;
      return ret + "\n";
    }
    ProcessMacros(keycode, alt, ctrl, shift, meta) {
      if (!keycode || keycode > 9 && keycode < 19) return false;
      const macros = this._MacroCache[keycode] || (this._MacroCache[keycode] = FilterArrayByKeyValue(this.client.macros, "key", keycode));
      let m = 0;
      const ml = macros.length;
      let mod = 0 /* None */;
      if (alt)
        mod |= 2 /* Alt */;
      if (ctrl)
        mod |= 4 /* Ctrl */;
      if (shift)
        mod |= 8 /* Shift */;
      if (meta)
        mod |= 16 /* Meta */;
      for (; m < ml; m++) {
        if (!macros[m].enabled || mod !== macros[m].modifiers) continue;
        if (this.ExecuteMacro(macros[m]))
          return true;
      }
      return false;
    }
    ExecuteMacro(macro) {
      if (!macro.enabled) return false;
      let ret;
      if (macro.value.length)
        switch (macro.style) {
          case 1:
            this._stack.push({ loops: [], args: 0, named: 0, used: 0 });
            try {
              ret = this.parseOutgoing(macro.value);
            } catch (e) {
              throw e;
            } finally {
              this._stack.pop();
            }
            break;
          case 2:
            if ((this.client.getOption("echo") & 2) === 2)
              this.client.echo(macro.value, -7, -8, true, true);
            const f = new Function("try { " + macro.value + "\n} catch (e) { if(this.getOption('showScriptErrors')) this.error(e);}");
            this._stack.push({ loops: [], args: 0, named: 0, used: 0 });
            try {
              ret = f.apply(this.client);
            } catch (e) {
              throw e;
            } finally {
              this._stack.pop();
            }
            break;
          default:
            ret = macro.value;
            break;
        }
      if (ret == null || ret === void 0)
        return true;
      if (typeof ret !== "string")
        ret = ret.toString();
      if (ret.length === 0 && !this.client.getOption("returnNewlineOnEmptyValue"))
        return null;
      if (macro.send) {
        if (!ret.endsWith("\n"))
          ret += "\n";
        if (macro.chain && this.client.commandInput.value.endsWith(" ")) {
          this.client.commandInput.value = this.client.commandInput.value + ret;
          this.client.sendCommand(null, null, this.client.getOption("allowCommentsFromCommand"));
        } else
          this.client.send(ret, true);
      } else if (macro.append)
        this.client.commandInput.value = this.client.commandInput.value + ret;
      return true;
    }
    ProcessPath(str, replace) {
      if (str.length === 0)
        return "";
      let out = [];
      let state = 0;
      let cmd = "";
      let num = "";
      let idx = 0;
      let c;
      let i;
      let t;
      let p;
      let n = 0;
      const tl = str.length;
      for (; idx < tl; idx++) {
        c = str.charAt(idx);
        i = str.charCodeAt(idx);
        switch (state) {
          case 1:
            if (i > 47 && i < 58)
              num += c;
            else if (c === "\\")
              state = 2;
            else {
              state = 0;
              cmd = c;
            }
            break;
          case 2:
            if (i > 47 && i < 58)
              cmd += c;
            else {
              cmd += "\\";
              idx--;
            }
            state = 0;
            break;
          case 3:
            if (n === 0 && c === ")")
              state = 0;
            else {
              if (c === "(")
                n++;
              else if (c === ")")
                n--;
              cmd += c;
            }
            break;
          case 4:
            if (n === 0 && c === "}")
              state = 0;
            else {
              if (c === "{")
                n++;
              else if (c === "}")
                n--;
              cmd += c;
            }
            break;
          default:
            if (i > 47 && i < 58) {
              if (cmd.length > 0) {
                if (num.length === 0)
                  t = 1;
                else
                  t = parseInt(num, 10);
                for (p = 0; p < t; p++)
                  out.push(cmd);
                cmd = "";
              }
              state = 1;
              num = c;
            } else if (c === "(") {
              state = 3;
              n = 0;
            } else if (c === "{") {
              state = 4;
              n = 0;
            } else if (c === "\\")
              state = 2;
            else
              cmd += c;
            break;
        }
      }
      if (cmd.length > 0) {
        if (num.length === 0)
          t = 1;
        else
          t = parseInt(num, 10);
        for (p = 0; p < t; p++)
          out.push(cmd);
      }
      if (replace && this._pathQueue.length) {
        this._pathQueue[0] = {
          id: str,
          current: out,
          previous: []
        };
      } else
        this._pathQueue.push({
          id: str,
          current: out,
          previous: []
        });
      this.ExecutePath();
      return null;
    }
    ExecutePath() {
      if (this._pathTimeout || !this._pathQueue.length || this._pathPaused) return;
      let delay = this.client.getOption("pathDelay");
      if (delay < 0) delay = 0;
      this._pathTimeout = setTimeout(() => {
        const pPath = this.client.getOption("parseSpeedpaths");
        const ePath = this.client.getOption("echoSpeedpaths");
        let cnt = this.client.getOption("pathDelayCount");
        if (cnt < 1) cnt = 1;
        const current = this._pathQueue[0];
        while (cnt--) {
          let cmd = current.current.shift();
          current.previous.push(cmd);
          if (pPath)
            this.client.sendBackground(cmd + "\n", !ePath);
          else
            this.client.send(cmd + "\n", !ePath);
          if (!current.current.length) break;
        }
        if (!current.current.length)
          this._pathQueue.shift();
        this._pathTimeout = null;
        if (this._pathQueue.length && this._pathQueue[0].manual)
          return;
        this.ExecutePath();
      }, delay);
    }
    toggleScrollLock() {
      this.scrollLock = !this.scrollLock;
    }
    hasTriggerType(types, type) {
      if (type === 3 /* Alarm */ && (types & 32 /* Alarm */) == 32 /* Alarm */)
        return true;
      if (type === 16 /* CommandInputPattern */ && (types & 16 /* CommandInputPattern */) == 16 /* CommandInputPattern */)
        return true;
      if (type === 1 /* CommandInputRegular */ && (types & 1 /* CommandInputRegular */) == 1 /* CommandInputRegular */)
        return true;
      if (type === 2 /* Event */ && (types & 2 /* Event */) == 2 /* Event */)
        return true;
      if (type === 8 /* Pattern */ && (types & 8 /* Pattern */) == 8 /* Pattern */)
        return true;
      if (type === 0 /* Regular */ && (types & 4 /* Regular */) == 4 /* Regular */)
        return true;
      if (type === 128 /* LoopExpression */ && (types & 128 /* LoopExpression */) == 128 /* LoopExpression */)
        return true;
      return false;
    }
    isSubTriggerType(type) {
      if ((type & 512 /* Skip */) == 512 /* Skip */)
        return true;
      if ((type & 1024 /* Wait */) == 1024 /* Wait */)
        return true;
      if ((type & 4096 /* LoopPattern */) == 4096 /* LoopPattern */)
        return true;
      if ((type & 8192 /* LoopLines */) == 8192 /* LoopLines */)
        return true;
      if ((type & 16384 /* Duration */) == 16384 /* Duration */)
        return true;
      if ((type & 32768 /* WithinLines */) == 32768 /* WithinLines */)
        return true;
      if ((type & 65536 /* Manual */) == 65536 /* Manual */)
        return true;
      if ((type & 131072 /* ReParse */) == 131072 /* ReParse */)
        return true;
      if ((type & 262144 /* ReParsePattern */) == 262144 /* ReParsePattern */)
        return true;
      return false;
    }
    getTriggerType(type) {
      if (type === 0 /* Regular */)
        return 4 /* Regular */;
      if (type === 3 /* Alarm */)
        return 32 /* Alarm */;
      return type;
    }
    ExecuteTriggers(type, line, raw, frag, ret, subtypes) {
      if (!this.enableTriggers || line == null) return line;
      if (ret == null) ret = false;
      if (frag == null) frag = false;
      raw = raw || line;
      this.buildTriggerCache();
      let t = 0;
      let pattern;
      let changed = false;
      let val;
      const triggers = this._TriggerCache;
      const tl = triggers.length;
      const states = this._TriggerStates;
      const rCache = this._TriggerRegExCache;
      let tType;
      for (; t < tl; t++) {
        let trigger = triggers[t];
        const parent = trigger;
        if (!trigger.enabled) continue;
        if (!parent.triggers || !parent.triggers.length || trigger.state > parent.triggers.length)
          parent.state = 0;
        if (trigger.state !== 0 && parent.triggers && parent.triggers.length) {
          trigger = parent.triggers[trigger.state - 1];
          while (!trigger.enabled && parent.state !== 0) {
            parent.state++;
            if (parent.state > parent.triggers.length) {
              parent.state = 0;
              trigger = parent;
              break;
            }
            if (parent.state)
              trigger = parent.triggers[parent.state - 1];
            else
              trigger = parent;
            changed = true;
          }
          if (changed) {
            if (this.client.getOption("saveTriggerStateChanges"))
              this.client.saveProfiles();
            this.client.emit("item-updated", "trigger", parent.profile.name, parent.profile.triggers.indexOf(parent), parent);
          }
          if (!trigger.enabled) continue;
        }
        tType = this.getTriggerType(trigger.type);
        if (trigger.type !== void 0 && (type & tType) !== tType) {
          if (!subtypes || subtypes && !this.isSubTriggerType(trigger.type))
            continue;
        }
        if (trigger.type === 65536 /* Manual */) continue;
        if (frag && !trigger.triggerPrompt) continue;
        if (!frag && !trigger.triggerNewline && trigger.triggerNewline !== void 0)
          continue;
        if (states[t]) {
          if (states[t].type === 1024 /* Wait */) {
            if (states[t].time > Date.now())
              continue;
            delete states[t];
          } else if (states[t].type === 16384 /* Duration */) {
            if (states[t].time < Date.now()) {
              delete states[t];
              this.advanceTrigger(trigger, parent, t);
              if (!states[t])
                states[t] = { reParse: true };
              else
                states[t].reParse = true;
              t = this.cleanUpTriggerState(t);
              continue;
            }
          } else if (states[t].type === 512 /* Skip */) {
            if (states[t].lineCount > 0)
              continue;
            delete states[t];
          } else if (states[t].type === 8192 /* LoopLines */) {
            if (states[t].lineCount < 1) {
              this.advanceTrigger(trigger, parent, t);
              if (!states[t])
                states[t] = { reParse: true };
              else
                states[t].reParse = true;
              t = this.cleanUpTriggerState(t);
              continue;
            }
          } else if (states[t].type === 32768 /* WithinLines */) {
            if (states[t].lineCount < 1) {
              this.advanceTrigger(trigger, parent, t);
              if (!states[t])
                states[t] = { reParse: true };
              else
                states[t].reParse = true;
              t = this.cleanUpTriggerState(t);
              continue;
            }
          }
        }
        try {
          if (trigger.type === 128 /* LoopExpression */) {
            if (this.evaluate(this.parseInline(trigger.pattern))) {
              if (!states[t]) {
                const state = this.createTriggerState(trigger, false, parent);
                if (state)
                  states[t] = state;
              } else if (states[t].loop !== -1 && states[t].lineCount < 1)
                continue;
              this._LastTriggered = trigger.raw ? raw : line;
              val = this.ExecuteTrigger(trigger, [this._LastTriggered], ret, t, [this._LastTriggered], 0, parent);
            } else {
              this.advanceTrigger(trigger, parent, t);
              continue;
            }
          } else if (trigger.verbatim) {
            if (!trigger.caseSensitive && (trigger.raw ? raw : line).toLowerCase() !== trigger.pattern.toLowerCase()) {
              if (!states[t] && (trigger.type === 131072 /* ReParse */ || trigger.type === 262144 /* ReParsePattern */)) {
                this.advanceTrigger(trigger, parent, t);
                t = this.cleanUpTriggerState(t);
              }
              continue;
            } else if (trigger.caseSensitive && (trigger.raw ? raw : line) !== trigger.pattern) {
              if (!states[t] && (trigger.type === 131072 /* ReParse */ || trigger.type === 262144 /* ReParsePattern */)) {
                this.advanceTrigger(trigger, parent, t);
                t = this.cleanUpTriggerState(t);
              }
              continue;
            }
            this._LastTriggered = trigger.raw ? raw : line;
            val = this.ExecuteTrigger(trigger, [this._LastTriggered], ret, t, [this._LastTriggered], 0, parent);
          } else {
            let re;
            if (trigger.type === 8 /* Pattern */ || trigger.type === 16 /* CommandInputPattern */ || trigger.type === 262144 /* ReParsePattern */)
              pattern = convertPattern(trigger.pattern, this.client);
            else
              pattern = trigger.pattern;
            if (trigger.caseSensitive)
              re = rCache["g" + pattern] || (rCache["g" + pattern] = new RegExp(pattern, "gd"));
            else
              re = rCache["gi" + pattern] || (rCache["gi" + pattern] = new RegExp(pattern, "gid"));
            re.lastIndex = 0;
            const res = re.exec(trigger.raw ? raw : line);
            if (!res || !res.length) {
              if (!states[t] && (trigger.type === 131072 /* ReParse */ || trigger.type === 262144 /* ReParsePattern */)) {
                this.advanceTrigger(trigger, parent, t);
                t = this.cleanUpTriggerState(t);
              }
              continue;
            }
            let args;
            this._LastTriggered = trigger.raw ? raw : line;
            if ((trigger.raw ? raw : line) === res[0] || !this.client.getOption("prependTriggeredLine"))
              args = res;
            else {
              args = [this._LastTriggered, ...res];
              args.indices = [[0, args[0].length], ...res.indices];
            }
            if (res.groups)
              Object.keys(res.groups).map((v) => this.client.variables[v] = res.groups[v]);
            val = this.ExecuteTrigger(trigger, args, ret, t, [this._LastTriggered, re], res.groups, parent);
          }
          if (states[t] && states[t].reParse) {
            if (!states[t].type || states[t].type === 131072 /* ReParse */ || states[t].type === 262144 /* ReParsePattern */)
              delete states[t];
            else
              delete states[t].reParse;
            t--;
          } else if (ret) return val;
        } catch (e) {
          if (this.client.getOption("disableTriggerOnError")) {
            trigger.enabled = false;
            setTimeout(() => {
              this.client.saveProfiles();
              this.emit("item-updated", "trigger", parent.profile, parent.profile.triggers.indexOf(parent), parent);
            });
          }
          if (this.client.getOption("showScriptErrors"))
            this.client.error(e);
          else
            this.client.debug(e);
        }
      }
      return line;
    }
    TestTrigger(trigger, parent, t, line, raw, frag) {
      let val;
      let pattern;
      try {
        if (trigger.verbatim) {
          if (!trigger.caseSensitive && (trigger.raw ? raw : line).toLowerCase() !== trigger.pattern.toLowerCase()) {
            if (!this._TriggerStates[t]) {
              this.advanceTrigger(trigger, parent, t);
              t = this.cleanUpTriggerState(t);
            }
            return t;
          } else if (trigger.caseSensitive && (trigger.raw ? raw : line) !== trigger.pattern) {
            if (!this._TriggerStates[t]) {
              this.advanceTrigger(trigger, parent, t);
              t = this.cleanUpTriggerState(t);
            }
            return t;
          }
          this._LastTriggered = trigger.raw ? raw : line;
          val = this.ExecuteTrigger(trigger, [this._LastTriggered], false, t, [this._LastTriggered], 0, parent);
        } else {
          let re;
          if (trigger.type === 8 /* Pattern */ || trigger.type === 16 /* CommandInputPattern */ || trigger.type === 262144 /* ReParsePattern */)
            pattern = convertPattern(trigger.pattern, this.client);
          else
            pattern = trigger.pattern;
          if (trigger.caseSensitive)
            re = this._TriggerRegExCache["g" + pattern] || (this._TriggerRegExCache["g" + pattern] = new RegExp(pattern, "gd"));
          else
            re = this._TriggerRegExCache["gi" + pattern] || (this._TriggerRegExCache["gi" + pattern] = new RegExp(pattern, "gid"));
          re.lastIndex = 0;
          const res = re.exec(trigger.raw ? raw : line);
          if (!res || !res.length) {
            if (!this._TriggerStates[t] && (trigger.type === 131072 /* ReParse */ || trigger.type === 262144 /* ReParsePattern */)) {
              this.advanceTrigger(trigger, parent, t);
              t = this.cleanUpTriggerState(t);
            }
            return t;
          }
          let args;
          this._LastTriggered = trigger.raw ? raw : line;
          if ((trigger.raw ? raw : line) === res[0] || !this.client.getOption("prependTriggeredLine"))
            args = res;
          else {
            args = [this._LastTriggered, ...res];
            args.indices = [[0, args[0].length], ...res.indices];
          }
          if (res.groups)
            Object.keys(res.groups).map((v) => this.client.variables[v] = res.groups[v]);
          val = this.ExecuteTrigger(trigger, args, false, t, [this._LastTriggered, re], res.groups, parent);
        }
        t = this.cleanUpTriggerState(t);
      } catch (e) {
        if (this.client.getOption("disableTriggerOnError")) {
          trigger.enabled = false;
          setTimeout(() => {
            this.client.saveProfiles();
            this.emit("item-updated", "trigger", parent.profile, parent.profile.triggers.indexOf(parent), parent);
          });
        }
        if (this.client.getOption("showScriptErrors"))
          this.client.error(e);
        else
          this.client.debug(e);
      }
      return t;
    }
    ExecuteTrigger(trigger, args, r, idx, regex, named, parent) {
      if (r == null) r = false;
      if (!trigger.enabled) return "";
      if (this._TriggerStates[idx] && this._TriggerStates[idx].type === 16384 /* Duration */)
        delete this._TriggerStates[idx];
      if (trigger.fired) {
        trigger.fired = false;
        this.advanceTrigger(trigger, parent, idx);
        if (this._TriggerStates[idx])
          this._TriggerStates[idx].reParse = true;
        else
          this._TriggerStates[idx] = { reParse: true };
        return "";
      }
      this._LastTrigger = trigger;
      let ret;
      if (trigger.temp) {
        if (parent.triggers.length) {
          if (parent.state === 0) {
            const item = parent.triggers.shift();
            item.triggers = parent.triggers;
            item.state = parent.state;
            item.name = parent.name;
            item.profile = parent.profile;
            if (item.state > item.triggers.length)
              item.state = 0;
            if (idx >= 0)
              this._TriggerCache[idx] = item;
            this.client.saveProfiles();
            const pIdx = parent.profile.triggers.indexOf(parent);
            parent.profile.triggers[pIdx] = item;
            this.client.emit("item-updated", "trigger", parent.profile.name, pIdx, item);
          } else {
            parent.triggers.splice(parent.state - 1, 1);
            if (parent.state > parent.triggers.length)
              parent.state = 0;
            this.client.saveProfiles();
            this.client.emit("item-updated", "trigger", parent.profile.name, parent.profile.triggers.indexOf(parent), parent);
          }
        } else {
          if (idx >= 0)
            this._TriggerCache.splice(idx, 1);
          if (this._TriggerStates[idx])
            this.clearTriggerState(idx);
          this.client.removeTrigger(parent);
        }
      } else if (parent.triggers.length)
        this.advanceTrigger(trigger, parent, idx);
      if ((this.client.getOption("echo") & 8) === 8)
        this.client.echo("Trigger fired: " + trigger.pattern, -7, -8, true, true);
      if (trigger.value.length)
        switch (trigger.style) {
          case 1:
            this._stack.push({ loops: [], args, named: 0, used: 0, regex });
            try {
              ret = this.parseOutgoing(trigger.value);
            } catch (e) {
              throw e;
            } finally {
              this._stack.pop();
            }
            break;
          case 2:
            if ((this.client.getOption("echo") & 2) === 2)
              this.client.echo(trigger.value, -7, -8, true, true);
            if (trigger.temp) {
              ret = new Function("try { " + trigger.value + "\n} catch (e) { if(this.getOption('showScriptErrors')) this.error(e);}");
              ret = ret.apply(this.client, args);
            } else {
              if (!this._TriggerFunctionCache[idx]) {
                if (named)
                  ret = Object.keys(named).map((v) => `let ${v} = this.variables["${v}"];`).join("") + "\n";
                else
                  ret = "";
                this._TriggerFunctionCache[idx] = new Function("try { " + ret + trigger.value + "\n} catch (e) { if(this.getOption('showScriptErrors')) this.error(e);}");
              }
              this._stack.push({ loops: [], args, named: 0, used: 0, regex, indices: args.indices });
              try {
                ret = this._TriggerFunctionCache[idx].apply(this.client, args);
              } catch (e) {
                throw e;
              } finally {
                this._stack.pop();
              }
            }
            if (typeof ret === "string")
              ret = this.parseOutgoing(ret);
            break;
          default:
            ret = trigger.value;
            break;
        }
      if (ret == null || ret === void 0)
        return null;
      if (r)
        return ret;
      if (typeof ret !== "string")
        ret = ret.toString();
      if (ret.length === 0 && !this.client.getOption("returnNewlineOnEmptyValue"))
        return null;
      if (!ret.endsWith("\n"))
        ret += "\n";
      if (this.client.connected)
        this.client.telnet.sendData(ret);
      if (this.client.telnet.echo && this.client.getOption("commandEcho")) {
        setTimeout(() => {
          this.client.echo(ret);
        }, 1);
      }
    }
    advanceTrigger(trigger, parent, idx) {
      if (this._TriggerStates[idx]) {
        if (this._TriggerStates[idx].type === 4096 /* LoopPattern */) {
          this._TriggerStates[idx].loop--;
          if (this._TriggerStates[idx].loop > 0)
            return;
          this.clearTriggerState(idx);
        } else if (this._TriggerStates[idx].type === 8192 /* LoopLines */) {
          if (this._TriggerStates[idx].lineCount > 0)
            return;
          this.clearTriggerState(idx);
        } else if (this._TriggerStates[idx].type === 32768 /* WithinLines */)
          this.clearTriggerState(idx);
        else if (this._TriggerStates[idx].type === 128 /* LoopExpression */) {
          if (this._TriggerStates[idx].loop === -1)
            return;
          if (this._TriggerStates[idx].lineCount > 0)
            return;
        }
      }
      parent.state++;
      if (parent.state > parent.triggers.length)
        parent.state = 0;
      if (this.client.getOption("saveTriggerStateChanges"))
        this.client.saveProfiles();
      this.client.emit("item-updated", "trigger", parent.profile.name, parent.profile.triggers.indexOf(parent), parent);
      if (parent.state !== 0) {
        const state = this.createTriggerState(parent.triggers[parent.state - 1]);
        if (state)
          this._TriggerStates[idx] = state;
      }
    }
    createTriggerState(trigger, reparse, parent) {
      let params;
      let state;
      switch (trigger.type) {
        case 131072 /* ReParse */:
        case 262144 /* ReParsePattern */:
          state = { reParse: true };
          break;
        case 16384 /* Duration */:
        case 1024 /* Wait */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 0;
          } else
            params = 0;
          state = { time: Date.now() + params };
          break;
        case 32768 /* WithinLines */:
        case 8192 /* LoopLines */:
        case 512 /* Skip */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 1;
          } else
            params = 1;
          state = { lineCount: params + 1 };
          break;
        /*          
            params = trigger.params;
            if (params && params.length) {
                params = parseInt(params, 10);
                if (isNaN(params))
                    params = 1;
            }
            else
                params = 1;
            state = { remoteCount: params + 1 };
            break;
        */
        case 4096 /* LoopPattern */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 0;
          } else
            params = 0;
          state = { loop: params };
          break;
        case 128 /* LoopExpression */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 1;
            if (parent === trigger)
              state = { lineCount: params - 1 };
            else
              state = { lineCount: params };
          } else
            state = { loop: -1 };
          break;
      }
      if (state)
        state.type = trigger.type;
      if (!state && reparse)
        return { reParse: true };
      else if (reparse)
        state.reparse = true;
      return state;
    }
    updateTriggerState(trigger, idx) {
      if (!this._TriggerStates[idx]) return;
      let params;
      switch (this._TriggerStates[idx].type) {
        case 1024 /* Wait */:
        case 16384 /* Duration */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 0;
          } else
            params = 0;
          this._TriggerStates[idx].time = Date.now() + params;
          break;
        case 32768 /* WithinLines */:
        case 512 /* Skip */:
        case 8192 /* LoopLines */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 0;
          } else
            params = 0;
          this._TriggerStates[idx].lineCount = params;
          break;
        /*
                        params = trigger.params;
                        if (params && params.length) {
                            params = parseInt(params, 10);
                            if (isNaN(params))
                                params = 0;
                        }
                        else
                            params = 0;
                        this._TriggerStates[idx].remoteCount = params;
                        break;
        */
        case 4096 /* LoopPattern */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 0;
          } else
            params = 0;
          this._TriggerStates[idx].loop = params;
          break;
        case 128 /* LoopExpression */:
          params = trigger.params;
          if (params && params.length) {
            params = parseInt(params, 10);
            if (isNaN(params))
              params = 1;
            this._TriggerStates[idx].lineCount = params + 1;
          } else
            this._TriggerStates[idx].loop = -1;
          break;
      }
    }
    getTriggerState(idx) {
      return this._TriggerStates[idx];
    }
    cleanUpTriggerState(idx) {
      if (this._TriggerStates[idx] && this._TriggerStates[idx].reParse) {
        if (!this._TriggerStates[idx].type || this._TriggerStates[idx].type === 131072 /* ReParse */ || this._TriggerStates[idx].type === 262144 /* ReParsePattern */)
          delete this._TriggerStates[idx];
        else
          delete this._TriggerStates[idx].reParse;
        if (idx < 0)
          idx++;
        else
          idx--;
      }
      return idx;
    }
    clearTriggerState(idx) {
      delete this._TriggerStates[idx];
    }
    setTriggerState(idx, data) {
      this._TriggerStates[idx] = data;
    }
    clearTriggerCache() {
      this._TriggerCache = null;
      this._TriggerStates = {};
      this._TriggerFunctionCache = {};
      this._TriggerRegExCache = {};
    }
    resetTriggerState(idx, oldState, oldFire) {
      if (idx === -1) return;
      if (idx < 0 || idx >= this._TriggerCache.length) return;
      let trigger = this._TriggerCache[idx];
      let oTrigger;
      const parent = trigger;
      let params;
      let reParse = false;
      if (parent.state !== 0)
        trigger = parent.triggers[parent.state - 1];
      if (oldState === 0)
        oTrigger = parent;
      else
        oTrigger = parent.triggers[oldState - 1];
      if (oldState === parent.state) {
        if (this._TriggerStates[idx]) {
          if (!trigger.fired)
            this.updateTriggerState(trigger, idx);
          else
            this.clearTriggerState(idx);
        } else {
          if (!trigger.fired)
            this.updateTriggerState(trigger, idx);
        }
      } else {
        if (this._TriggerStates[idx]) {
          if (!this._TriggerStates[idx].type || this._TriggerStates[idx].type !== 262144 /* ReParsePattern */ && this._TriggerStates[idx].type !== 131072 /* ReParse */)
            reParse = this._TriggerStates[idx].reParse;
        }
        this.clearTriggerState(idx);
        if (!trigger.fired) {
          const state = this.createTriggerState(trigger, reParse);
          if (state)
            this._TriggerStates[idx] = state;
        } else
          this._TriggerStates[idx] = { reParse: true };
      }
    }
    buildTriggerCache() {
      if (this._TriggerCache == null) {
        this._TriggerCache = $.grep(this.client.triggers, (a) => {
          if (a && a.enabled && a.triggers.length) {
            if (a.type !== 3 /* Alarm */) return true;
            for (let s = 0, sl = a.triggers.length; s < sl; s++)
              if (a.triggers[s].enabled && a.triggers[s].type !== 3 /* Alarm */)
                return true;
            return false;
          }
          return a.enabled && a.type !== 3 /* Alarm */;
        });
      }
    }
    clearCaches() {
      this._TriggerCache = null;
      this._TriggerStates = {};
      this._TriggerFunctionCache = {};
      this._TriggerRegExCache = {};
      this._gamepadCaches = null;
      this._lastSuspend = -1;
      this._MacroCache = {};
    }
    triggerEvent(event, args) {
      if (!this.enableTriggers) return;
      this.buildTriggerCache();
      let t = 0;
      if (!args)
        args = [event];
      else if (!Array.isArray(args))
        args = [event, args];
      else
        args.unshift(event);
      const tl = this._TriggerCache.length;
      for (; t < tl; t++) {
        let trigger = this._TriggerCache[t];
        const parent = trigger;
        let changed = false;
        if (!trigger.enabled) continue;
        if (trigger.state > parent.triggers.length)
          trigger.state = 0;
        if (trigger.state !== 0 && parent.triggers && parent.triggers.length) {
          trigger = parent.triggers[trigger.state - 1];
          while (!trigger.enabled && parent.state !== 0) {
            parent.state++;
            if (parent.state > parent.triggers.length) {
              parent.state = 0;
              trigger = parent;
              break;
            }
            if (parent.state)
              trigger = parent.triggers[parent.state - 1];
            else
              trigger = parent;
            changed = true;
          }
          if (changed) {
            if (this.client.getOption("saveTriggerStateChanges"))
              this.client.saveProfiles();
            this.client.emit("item-updated", "trigger", parent.profile.name, parent.profile.triggers.indexOf(parent), parent);
          }
          if (!trigger.enabled) continue;
        }
        if (trigger.type === 131072 /* ReParse */ || trigger.type === 262144 /* ReParsePattern */) {
          const val = this.adjustLastLine(this.client.display.lines.length, true);
          const line = this.client.display.lines[val];
          t = this.TestTrigger(trigger, parent, t, line, this.client.display.lines[val].raw || line, val === this.client.display.lines.length - 1);
          continue;
        }
        if (trigger.type !== 2 /* Event */) continue;
        if (trigger.caseSensitive && event !== trigger.pattern) continue;
        if (!trigger.caseSensitive && event.toLowerCase() !== trigger.pattern.toLowerCase()) continue;
        this._LastTriggered = event;
        this.ExecuteTrigger(trigger, args, false, t, 0, 0, parent);
        t = this.cleanUpTriggerState(t);
      }
    }
    executeWait(text, delay, eAlias, stacking, append, noFunctions, noComments) {
      if (!text || text.length === 0) return;
      const s = { loops: this.loops.splice(0), args: 0, named: 0, used: this.stack.used, append: this.stack.append };
      if (this.stack.args)
        s.args = this.stack.args.slice();
      if (this.stack.named)
        s.named = this.stack.named.slice();
      if (delay < 0)
        delay = 0;
      setTimeout(() => {
        this._stack.push(s);
        let ret = this.parseOutgoing(text, eAlias, stacking, append, noFunctions, noComments);
        this._stack.pop();
        if (ret == null || typeof ret === "undefined" || ret.length === 0) return;
        if (!ret.endsWith("\n"))
          ret = ret + "\n";
        this.client.send(ret, true);
      }, delay);
    }
    buildScript(str) {
      if (!str) return "";
      let lines;
      if (this.client.getOption("commandStacking") && this.client.getOption("commandStackingChar") && this.client.getOption("commandStackingChar").length > 0)
        lines = str.splitQuote("\n" + this.client.getOption("commandStackingChar"));
      else
        lines = str.splitQuote("\n");
      let l = 0;
      const ll = lines.length;
      const code = [];
      const b = [];
      const cmdChar = this.client.getOption("commandChar");
      for (; l < ll; l++) {
        if (lines[l].trim().startsWith(cmdChar + "wait ")) {
          code.push("setTimeout(()=> {");
          b.unshift(parseInt(lines[l].trim().substr(5), 10) || 0);
        } else {
          code.push("client.sendCommand('");
          code.push(lines[l]);
          code.push("\\n');");
        }
      }
      const bl = b.length;
      for (l = 0; l < bl; l++) {
        code.push("}, ");
        code.push(b[l]);
        code.push(");");
      }
      return code.join("");
    }
    stripQuotes(str, force, forceSingle) {
      if (!str || str.length === 0)
        return str;
      if (force || this.client.getOption("parseDoubleQuotes"))
        str = str.replace(/^\"(.*)\"$/g, (v, e, w) => {
          return e.replace(/\\\"/g, '"');
        });
      if (forceSingle || this.client.getOption("parseSingleQuotes"))
        str = str.replace(/^\'(.*)\'$/g, (v, e, w) => {
          return e.replace(/\\\'/g, "'");
        });
      return str;
    }
    splitByQuotes(str, sep, force, forceSingle) {
      let t = 0;
      let e = 0;
      if (!str || str.length === 0)
        return [];
      if (force || this.client.getOption("parseDoubleQuotes")) {
        t |= 2;
        e |= this.client.getOption("allowEscape") ? 2 : 0;
      }
      if (forceSingle || this.client.getOption("parseSingleQuotes")) {
        t |= 1;
        e |= this.client.getOption("allowEscape") ? 1 : 0;
      }
      return splitQuoted(str, sep, t, e, this.client.getOption("escapeChar"));
    }
    createTrigger(pattern, commands, profile, options, name2, subTrigger) {
      let trigger;
      let sTrigger;
      let reload = true;
      let isNew = false;
      if (!pattern && !name2)
        throw new Error(`Trigger '${name2 || ""}' not found`);
      if (!profile) {
        const keys = this.client.profiles.keys;
        let k = 0;
        const kl = keys.length;
        if (kl === 0)
          return;
        if (kl === 1) {
          if (!this.client.profiles.items[keys[0]].enabled || !this.client.profiles.items[keys[0]].enableTriggers)
            throw Error("No enabled profiles found!");
          profile = this.client.profiles.items[keys[0]];
          if (subTrigger) {
            if (!name2) {
              if (!this.client.profiles.items[keys[k]].triggers.length)
                throw new Error(`No triggers exist`);
              trigger = this.client.profiles.items[keys[k]].triggers[this.client.profiles.items[keys[k]].triggers.length - 1];
            } else
              trigger = this.client.profiles.items[keys[k]].findAny("triggers", { name: name2, pattern: name2 });
          } else if (name2 !== null)
            trigger = this.client.profiles.items[keys[k]].find("triggers", "name", name2);
          else
            trigger = this.client.profiles.items[keys[k]].find("triggers", "pattern", pattern);
        } else {
          for (; k < kl; k++) {
            if (!this.client.profiles.items[keys[k]].enabled || !this.client.profiles.items[keys[k]].enableTriggers || this.client.profiles.items[keys[k]].triggers.length === 0)
              continue;
            if (subTrigger) {
              if (!name2) {
                if (!this.client.profiles.items[keys[k]].triggers.length)
                  throw new Error(`No triggers exist`);
                trigger = this.client.profiles.items[keys[k]].triggers[this.client.profiles.items[keys[k]].triggers.length - 1];
              } else
                trigger = this.client.profiles.items[keys[k]].findAny("triggers", { name: name2, pattern: name2 });
            } else if (name2 !== null)
              trigger = this.client.profiles.items[keys[k]].find("triggers", "name", name2);
            else
              trigger = this.client.profiles.items[keys[k]].find("triggers", "pattern", pattern);
            if (trigger) {
              profile = this.client.profiles.items[keys[k]];
              break;
            }
          }
          if (!profile)
            profile = this.client.activeProfile;
        }
      } else if (typeof profile === "string") {
        if (this.client.profiles.contains(profile.toLowerCase()))
          profile = this.client.profiles.items[profile.toLowerCase()];
        else
          throw new Error("Profile not found: " + profile);
        if (subTrigger) {
          if (!name2) {
            if (!profile.triggers.length)
              throw new Error(`No triggers exist`);
            trigger = profile.triggers[profile.triggers.length - 1];
          } else
            trigger = profile.findAny("triggers", { name: name2, pattern: name2 });
        } else if (name2 !== null)
          trigger = profile.find("triggers", "name", name2);
        else
          trigger = profile.find("triggers", "pattern", pattern);
      }
      if (subTrigger) {
        if (!trigger)
          throw new Error(`Trigger '${name2 || ""}' not found`);
        sTrigger;
        sTrigger = new Trigger();
        sTrigger.pattern = pattern;
        reload = false;
        if (pattern !== null)
          sTrigger.pattern = pattern;
        if (commands !== null)
          sTrigger.value = commands;
        if (options) {
          if (options.cmd)
            sTrigger.type = 1 /* CommandInputRegular */;
          if (options.pattern)
            sTrigger.type = 8 /* Pattern */;
          if (options.regular)
            sTrigger.type = 0 /* Regular */;
          if (options.alarm)
            sTrigger.type = 3 /* Alarm */;
          if (options.event)
            sTrigger.type = 2 /* Event */;
          if (options.cmdpattern)
            sTrigger.type = 16 /* CommandInputPattern */;
          if (options.loopexpression)
            sTrigger.type = 128 /* LoopExpression */;
          if (options.reparse)
            sTrigger.type = 131072 /* ReParse */;
          if (options.reparsepattern)
            sTrigger.type = 262144 /* ReParsePattern */;
          if (options.manual)
            sTrigger.type = 65536 /* Manual */;
          if (options.skip)
            sTrigger.type = 512 /* Skip */;
          if (options.looplines)
            sTrigger.type = 8192 /* LoopLines */;
          if (options.looppattern)
            sTrigger.type = 4096 /* LoopPattern */;
          if (options.wait)
            sTrigger.type = 1024 /* Wait */;
          if (options.duration)
            sTrigger.type = 16384 /* Duration */;
          if (options.withinlines)
            sTrigger.type = 32768 /* WithinLines */;
          if (options.prompt)
            sTrigger.triggerPrompt = true;
          if (options.nocr)
            sTrigger.triggerNewline = false;
          if (options.case)
            sTrigger.caseSensitive = true;
          if (options.raw)
            sTrigger.raw = true;
          if (options.verbatim)
            sTrigger.verbatim = true;
          if (options.disable)
            sTrigger.enabled = false;
          else if (options.enable)
            sTrigger.enabled = true;
          if (options.temporary || options.temp)
            sTrigger.temp = true;
          if (options.params)
            sTrigger.params = options.params;
          if (options.type) {
            if (this.isTriggerType(options.type))
              sTrigger.type = this.convertTriggerType(options.type);
            else
              throw new Error("Invalid trigger type");
          }
        }
        trigger.triggers.push(sTrigger);
        this.client.echo("Trigger sub state added.", -7, -8, true, true);
      } else {
        if (!trigger) {
          if (!pattern)
            throw new Error(`Trigger '${name2 || ""}' not found`);
          trigger = new Trigger();
          trigger.name = name2 || "";
          trigger.pattern = pattern;
          profile.triggers.push(trigger);
          this.client.echo("Trigger added.", -7, -8, true, true);
          isNew = true;
        } else
          this.client.echo("Trigger updated.", -7, -8, true, true);
        if (pattern !== null)
          trigger.pattern = pattern;
        if (commands !== null)
          trigger.value = commands;
        if (options) {
          if (options.cmd)
            trigger.type = 1 /* CommandInputRegular */;
          if (options.pattern)
            trigger.type = 8 /* Pattern */;
          if (options.regular)
            trigger.type = 0 /* Regular */;
          if (options.alarm)
            trigger.type = 3 /* Alarm */;
          if (options.event)
            trigger.type = 2 /* Event */;
          if (options.cmdpattern)
            trigger.type = 16 /* CommandInputPattern */;
          if (options.loopexpression)
            trigger.type = 128 /* LoopExpression */;
          if (options.prompt)
            trigger.triggerPrompt = true;
          if (options.nocr)
            trigger.triggerNewline = false;
          if (options.case)
            trigger.caseSensitive = true;
          if (options.raw)
            trigger.raw = true;
          if (options.verbatim)
            trigger.verbatim = true;
          if (options.disable)
            trigger.enabled = false;
          else if (options.enable)
            trigger.enabled = true;
          if (options.temporary || options.temp)
            trigger.temp = true;
          if (options.params)
            trigger.params = options.params;
          if (options.type) {
            if (this.isTriggerType(options.type, 1 /* Main */))
              trigger.type = this.convertTriggerType(options.type);
            else
              throw new Error("Invalid trigger type");
          }
          trigger.priority = options.priority;
        } else
          trigger.priority = 0;
      }
      this.client.saveProfiles();
      if (reload)
        this.client.clearCache();
      if (isNew)
        this.emit("item-added", "trigger", profile.name, trigger);
      else
        this.emit("item-updated", "trigger", profile.name, profile.triggers.indexOf(trigger), trigger);
      profile = null;
    }
    isTriggerType(type, filter) {
      if (!filter) filter = 3 /* All */;
      switch (type.replace(/ /g, "").toUpperCase()) {
        case "REGULAREXPRESSION":
        case "COMMANDINPUTREGULAREXPRESSION":
          return (filter & 1 /* Main */) === 1 /* Main */ ? true : false;
        case "0":
        case "1":
        case "2":
        case "3":
        case "8":
        case "16":
        //case '64':
        case "128":
        case "REGULAR":
        case "COMMANDINPUTREGULAR":
        case "EVENT":
        case "ALARM":
        case "COMMAND":
        case "COMMANDINPUTPATTERN":
        case "LOOPEXPRSSION":
          return (filter & 1 /* Main */) === 1 /* Main */ ? true : false;
        case "SKIP":
        case "512":
        case "WAIT":
        case "1024":
        case "LOOPPATTERN":
        case "4096":
        case "LOOPLINES":
        case "8192":
        case "DURATION":
        case "16384":
        case "WITHINLINES":
        case "32768":
        case "MANUAL":
        case "65536":
        case "REPARSE":
        case "131072":
        case "REPARSEPATTERN":
        case "262144":
          return (filter & 2 /* Sub */) === 2 /* Sub */ ? true : false;
      }
      return false;
    }
    convertTriggerType(type) {
      switch (type.replace(/ /g, "").toUpperCase()) {
        case "REGULAREXPRESSION":
          return 0 /* Regular */;
        case "COMMANDINPUTREGULAREXPRESSION":
          return 1 /* CommandInputRegular */;
        case "0":
        case "1":
        case "2":
        case "3":
        case "8":
        case "16":
        case "128":
          return TriggerType[parseInt(type, 10)];
        case "REGULAR":
        case "COMMANDINPUTREGULAR":
        case "EVENT":
        case "ALARM":
        case "COMMAND":
        case "COMMANDINPUTPATTERN":
        case "LOOPEXPRSSION":
          return TriggerType[type];
        case "512":
        case "1024":
        case "4096":
        case "8192":
        case "16384":
        case "32768":
        case "65536":
        case "131072":
        case "262144":
          return SubTriggerTypes[parseInt(type, 10)];
        case "SKIP":
        case "WAIT":
        case "LOOPPATTERN":
        case "LOOPLINES":
        case "DURATION":
        case "WITHINLINES":
        case "MANUAL":
        case "REPARSE":
        case "REPARSEPATTERN":
          return SubTriggerTypes[type];
      }
      throw new Error("Invalid trigger type");
    }
    colorPosition(n, fore, back, item) {
      n = this.adjustLastLine(n);
      if (!item.hasOwnProperty("yStart"))
        this.client.display.colorSubStringByLine(n, fore, back, item.xStart, item.hasOwnProperty("xEnd") && item.xEnd >= 0 ? item.xEnd : null);
      else {
        const xEnd = item.hasOwnProperty("xEnd") && item.xEnd >= 0 ? item.xEnd : null;
        const xStart = item.xStart;
        let line = n - item.yStart;
        let end = n;
        if (item.hasOwnProperty("yEnd"))
          end = n - item.yEnd;
        while (line <= end) {
          this.client.display.colorSubStringByLine(line, fore, back, xStart, xEnd);
          line++;
        }
      }
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

  // src/parser.ts
  var MXPTag = /* @__PURE__ */ ((MXPTag2) => {
    MXPTag2[MXPTag2["None"] = 0] = "None";
    MXPTag2[MXPTag2["B"] = 1] = "B";
    MXPTag2[MXPTag2["BOLD"] = 2] = "BOLD";
    MXPTag2[MXPTag2["STRONG"] = 3] = "STRONG";
    MXPTag2[MXPTag2["I"] = 4] = "I";
    MXPTag2[MXPTag2["ITALIC"] = 5] = "ITALIC";
    MXPTag2[MXPTag2["EM"] = 6] = "EM";
    MXPTag2[MXPTag2["U"] = 7] = "U";
    MXPTag2[MXPTag2["UNDERLINE"] = 8] = "UNDERLINE";
    MXPTag2[MXPTag2["S"] = 9] = "S";
    MXPTag2[MXPTag2["STRIKEOUT"] = 10] = "STRIKEOUT";
    MXPTag2[MXPTag2["STRIKE"] = 11] = "STRIKE";
    MXPTag2[MXPTag2["C"] = 12] = "C";
    MXPTag2[MXPTag2["COLOR"] = 13] = "COLOR";
    MXPTag2[MXPTag2["H"] = 14] = "H";
    MXPTag2[MXPTag2["HIGH"] = 15] = "HIGH";
    MXPTag2[MXPTag2["FONT"] = 16] = "FONT";
    MXPTag2[MXPTag2["HR"] = 17] = "HR";
    MXPTag2[MXPTag2["NOBR"] = 18] = "NOBR";
    MXPTag2[MXPTag2["P"] = 19] = "P";
    MXPTag2[MXPTag2["BR"] = 20] = "BR";
    MXPTag2[MXPTag2["SBR"] = 21] = "SBR";
    MXPTag2[MXPTag2["A"] = 22] = "A";
    MXPTag2[MXPTag2["SEND"] = 23] = "SEND";
    MXPTag2[MXPTag2["EXPIRE"] = 24] = "EXPIRE";
    MXPTag2[MXPTag2["VERSION"] = 25] = "VERSION";
    MXPTag2[MXPTag2["SUPPORT"] = 26] = "SUPPORT";
    MXPTag2[MXPTag2["RESET"] = 27] = "RESET";
    MXPTag2[MXPTag2["H1"] = 28] = "H1";
    MXPTag2[MXPTag2["H2"] = 29] = "H2";
    MXPTag2[MXPTag2["H3"] = 30] = "H3";
    MXPTag2[MXPTag2["H4"] = 31] = "H4";
    MXPTag2[MXPTag2["H5"] = 32] = "H5";
    MXPTag2[MXPTag2["H6"] = 33] = "H6";
    MXPTag2[MXPTag2["V"] = 34] = "V";
    MXPTag2[MXPTag2["VAR"] = 35] = "VAR";
    MXPTag2[MXPTag2["USER"] = 36] = "USER";
    MXPTag2[MXPTag2["PASSWORD"] = 37] = "PASSWORD";
    MXPTag2[MXPTag2["Custom"] = 38] = "Custom";
    MXPTag2[MXPTag2["GAUGE"] = 39] = "GAUGE";
    MXPTag2[MXPTag2["STAT"] = 40] = "STAT";
    return MXPTag2;
  })(MXPTag || {});
  var MXPState = class {
    constructor() {
      this.on = false;
      this.lineType = 0;
      this.locked = false;
      this.paragraph = false;
      this.noBreak = false;
      this.expanded = false;
      this.lineExpanded = false;
      this.capture = 0;
      this.captured = [];
      this.gagged = false;
    }
  };
  var Entity = class {
    constructor(remote) {
      this.name = "";
      this.value = "";
      this.description = "";
      this.publish = false;
      this.remote = false;
      this.remote = remote == null ? false : remote;
    }
  };
  var Element = class {
    constructor(remote) {
      this.name = "";
      this.definition = "";
      this.closeDefinition = "";
      this.attributes = {};
      this.attributeIndexes = [];
      this.tag = -1 /* None */;
      this.flag = "";
      this.open = false;
      this.empty = false;
      this.remote = false;
      this.gagged = false;
      this.remote = remote == null ? false : remote;
    }
  };
  var Tag = class {
    constructor(index, fore, back, remote) {
      this.index = -1 /* None */;
      this.window = "";
      this.gag = false;
      this.fore = "";
      this.back = "";
      this.enabled = true;
      this.remote = false;
      this.element = "";
      this.definition = "";
      this.closeDefinition = "";
      if (index != null) this.index = index;
      if (fore != null) this.fore = fore;
      if (back != null) this.back = back;
      if (remote != null) this.remote = remote;
    }
  };
  var MXPStyle = class {
    constructor(style, fore, back, high, open) {
      this.tag = 0 /* None */;
      this.custom = "";
      this.font = null;
      this.fontSize = null;
      this.style = 0 /* None */;
      this.fore = "";
      this.back = "";
      this.high = false;
      this.obj = null;
      this.gagged = false;
      this.open = false;
      this.properties = null;
      if (style != null) this.style = style;
      if (fore != null) this.fore = fore;
      if (back != null) this.back = back;
      this.high = high || false;
      this.open = open || false;
    }
  };
  var Parser = class extends EventEmitter {
    constructor(options) {
      super();
      /** @private */
      this.parsing = [];
      /** @private */
      /* Web detection protocols that are just followed by a :*/
      this.protocols = [["m", "a", "i", "l", "t", "o"], ["s", "k", "y", "p", "e"], ["a", "i", "m"], ["c", "a", "l", "l", "t", "o"], ["g", "t", "a", "l", "k"], ["i", "m"], ["i", "t", "m", "s"], ["m", "s", "n", "i", "m"], ["t", "e", "l"], ["y", "m", "s", "g", "r"]];
      /** @private */
      this._ColorTable = null;
      /** @private */
      this._CurrentForeColor = 37;
      /** @private */
      this._CurrentBackColor = 40;
      /** @private */
      this._CurrentAttributes = 0 /* None */;
      /** @private */
      this._SplitBuffer = "";
      /** @private */
      this.mxpState = new MXPState();
      /** @private */
      this.mxpStyles = [];
      /** @private */
      this.mxpEntities = {};
      /** @private */
      this.mxpElements = {};
      /** @private */
      this.mxpLines = [];
      /** @private */
      this.iMXPDefaultMode = 0 /* Open */;
      this.displayControlCodes = false;
      this.emulateControlCodes = true;
      this.StyleVersion = "";
      this.EndOfLine = false;
      this.textLength = 0;
      this.rawLength = 0;
      this.enableMXP = true;
      this.DefaultImgUrl = "";
      this.enableDebug = false;
      this.showInvalidMXPTags = false;
      this.enableLinks = true;
      this.enableMSP = true;
      this.enableURLDetection = true;
      this.window = new Size(0, 0);
      this.enableFlashing = false;
      this.emulateTerminal = false;
      this.enableBell = true;
      this.display = null;
      this.tabWidth = 8;
      this.busy = false;
      if (options != null) {
        if (options.DefaultImageURL)
          this.DefaultImgUrl = options.DefaultImageURL;
        if (options.enableMXP != null)
          this.enableMXP = options.enableMXP;
        if (options.enableDebug != null)
          this.enableDebug = options.enableDebug;
        if (options.showInvalidMXPTags != null)
          this.showInvalidMXPTags = options.showInvalidMXPTags;
        if (options.enableMSP != null)
          this.enableMSP = options.enableMSP;
        if (options.enableURLDetection != null)
          this.enableURLDetection = options.enableURLDetection;
        if (options.window != null)
          this.window = options.window;
        if (options.enableFlashing != null)
          this.enableFlashing = options.enableFlashing;
        if (options.emulateTerminal != null)
          this.emulateTerminal = options.emulateTerminal;
        if (options.enableBell != null)
          this.enableBell = options.enableBell;
        if (options.display != null)
          this.display = options.display;
        if (options.enableLinks)
          this.enableLinks = options.enableLinks;
      }
    }
    getColors(mxp) {
      if (typeof mxp === "undefined")
        mxp = this.GetCurrentStyle();
      let f;
      let b;
      let fc = -1;
      let bc = -1;
      if (mxp.fore.length > 0) {
        if ((this._CurrentAttributes & 1 /* Bold */) === 1 /* Bold */)
          f = this.IncreaseColor(mxp.fore, 0.5);
        else if ((this._CurrentAttributes & 2 /* Faint */) === 2 /* Faint */)
          f = this.DecreaseColor(mxp.fore, 0.5);
        else
          f = mxp.fore;
      } else if (typeof this._CurrentForeColor === "string")
        f = "rgb(" + this._CurrentForeColor.replace(/;/g, ",") + ")";
      else {
        f = this._CurrentForeColor;
        if ((this._CurrentAttributes & 1 /* Bold */) === 1 /* Bold */) {
          if (f > 999)
            f /= 1e3;
          if (f >= 0 && f < 99)
            f *= 10;
          fc = f;
          if (f <= -16)
            f = this.IncreaseColor(this.GetColor(f), 0.5);
        } else if ((this._CurrentAttributes & 2 /* Faint */) === 2 /* Faint */) {
          if (f > 99 && f < 999)
            f /= 10;
          if (f >= 0 && f < 999)
            f *= 100;
          fc = f;
          if (f <= -16)
            f = this.DecreaseColor(this.GetColor(f), 0.15);
        } else {
          fc = f;
        }
      }
      if (mxp.high) {
        if (typeof f === "number")
          f = this.IncreaseColor(this.GetColor(f), 0.25);
        else
          f = this.IncreaseColor(f, 0.25);
      }
      if (mxp.back.length > 0)
        b = mxp.back;
      else if (typeof this._CurrentBackColor === "string")
        b = "rgb(" + this._CurrentBackColor.replace(/;/g, ",") + ")";
      else
        b = bc = this._CurrentBackColor;
      if ((this._CurrentAttributes & 64 /* Inverse */) === 64 /* Inverse */ || (mxp.style & 64 /* Inverse */) === 64 /* Inverse */)
        return { fore: b, back: f, foreCode: bc, backCode: fc };
      return { fore: f, back: b, foreCode: fc, backCode: bc };
    }
    getFormatBlock(offset) {
      const mxp = this.GetCurrentStyle();
      const colors = this.getColors(mxp);
      return {
        formatType: 0 /* Normal */,
        offset,
        color: colors.fore || 0,
        background: colors.back || 0,
        size: mxp.fontSize || 0,
        font: mxp.font || 0,
        style: mxp.style | this._CurrentAttributes & ~1 /* Bold */,
        unicode: false
      };
    }
    ResetColors() {
      this._CurrentForeColor = 37;
      this._CurrentBackColor = 40;
      this._CurrentAttributes = 0 /* None */;
    }
    ProcessAnsiColorParams(params) {
      let p = 0;
      const pl = params.length;
      let i;
      let rgb;
      for (; p < pl; p++) {
        i = +params[p] || 0;
        switch (i) {
          case 0:
            this.ResetColors();
            break;
          case 1:
            this._CurrentAttributes |= 1 /* Bold */;
            this._CurrentAttributes &= ~2 /* Faint */;
            break;
          case 2:
            this._CurrentAttributes |= 2 /* Faint */;
            this._CurrentAttributes &= ~1 /* Bold */;
            break;
          case 3:
            this._CurrentAttributes |= 4 /* Italic */;
            break;
          case 4:
            this._CurrentAttributes |= 8 /* Underline */;
            break;
          case 5:
            this._CurrentAttributes |= 16 /* Slow */;
            break;
          case 6:
            this._CurrentAttributes |= 32 /* Rapid */;
            break;
          case 7:
            this._CurrentAttributes |= 64 /* Inverse */;
            break;
          case 8:
            this._CurrentAttributes |= 128 /* Hidden */;
            break;
          case 9:
            this._CurrentAttributes |= 256 /* Strikeout */;
            break;
          /*
          10 primary(default) font
          11 first alternative font
          12 second alternative font
          13 third alternative font
          14 fourth alternative font
          15 fifth alternative font
          16 sixth alternative font
          17 seventh alternative font
          18 eighth alternative font
          19 ninth alternative font
          20 Fraktur(Gothic)
          */
          case 21:
            this._CurrentAttributes |= 512 /* DoubleUnderline */;
            break;
          case 22:
            this._CurrentAttributes &= ~1 /* Bold */;
            this._CurrentAttributes &= ~2 /* Faint */;
            break;
          case 23:
            this._CurrentAttributes &= ~4 /* Italic */;
            break;
          case 24:
            this._CurrentAttributes &= ~8 /* Underline */;
            this._CurrentAttributes &= ~512 /* DoubleUnderline */;
            break;
          case 25:
            this._CurrentAttributes &= ~16 /* Slow */;
            break;
          case 26:
            this._CurrentAttributes &= ~32 /* Rapid */;
            break;
          case 27:
            this._CurrentAttributes &= ~64 /* Inverse */;
            break;
          case 28:
            this._CurrentAttributes &= ~128 /* Hidden */;
            break;
          case 29:
            this._CurrentAttributes &= ~256 /* Strikeout */;
            break;
          case -11:
          //error color
          case -7:
          //info color
          case -3:
          //local echo
          case 30:
          //set foreground color to black
          case 31:
          //set foreground color to red
          case 32:
          //set foreground color to green
          case 33:
          //set foreground color to yellow
          case 34:
          //set foreground color to blue
          case 35:
          //set foreground color to magenta (purple)
          case 36:
          //set foreground color to cyan
          case 37:
            this._CurrentForeColor = i;
            break;
          case 38:
            if (p + 2 < pl && params[p + 1] === "5") {
              this._CurrentForeColor = +params[p + 2];
              if (isNaN(this._CurrentForeColor))
                this._CurrentForeColor = 37;
              else {
                this._CurrentForeColor += 16;
                this._CurrentForeColor *= -1;
              }
              p += 2;
            } else if (p + 4 < pl && params[p + 1] === "2") {
              i = +params[p + 2] || 0;
              if (i < 0 || i > 255)
                continue;
              rgb = i + ";";
              i = +params[p + 3] || 0;
              if (i < 0 || i > 255)
                continue;
              rgb += i + ";";
              i = +params[p + 4] || 0;
              if (i < 0 || i > 255)
                continue;
              rgb += i;
              this._CurrentForeColor = rgb;
              p += 4;
            }
            break;
          case 39:
            this._CurrentForeColor = -1;
            break;
          case -12:
          //error color
          case -8:
          case -4:
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
            this._CurrentBackColor = i;
            break;
          case 48:
            if (p + 2 < pl && params[p + 1] === "5") {
              this._CurrentBackColor = +params[p + 2];
              if (isNaN(this._CurrentBackColor))
                this._CurrentBackColor = 40;
              else {
                this._CurrentBackColor += 16;
                this._CurrentBackColor *= -1;
              }
              p += 2;
            } else if (p + 4 < pl && params[p + 1] === "2") {
              i = +params[p + 2] || 0;
              if (i < 0 || i > 255)
                continue;
              rgb = i + ";";
              i = +params[p + 3] || 0;
              if (i < 0 || i > 255)
                continue;
              rgb += i + ";";
              i = +params[p + 4] || 0;
              if (i < 0 || i > 255)
                continue;
              rgb += i;
              this._CurrentBackColor = rgb;
              p += 4;
            }
            break;
          case 49:
            this._CurrentBackColor = -2;
            break;
          //zMUD log colors, seems zMUD uses the 50s for display info for bold colors, standards use it to control borders and other effects
          //don't need zMUD colors here as we never need to open fonts, replace with the frames/overlined/etc... if it can be done in css
          case 53:
            this._CurrentAttributes |= 1024 /* Overline */;
            break;
          case 55:
            this._CurrentAttributes &= ~1024 /* Overline */;
            break;
          case 50:
          //Reserved
          case 51:
          //Framed believe this adds a border all the way around block of text
          case 52:
          //Encircled, not sure maybe draws a circle around text?
          case 54:
          //Not framed or encircled, turns off framed/encircled
          case 56:
          //Reserved
          case 57:
          //Reserved
          case 58:
          //Reserved
          case 59:
            this._CurrentForeColor = i - 20;
            this._CurrentAttributes |= 1 /* Bold */;
            break;
          //xterm 16 but color
          //Assume that xterm?s resources are set so that the ISO color codes are the first 8 of a set of 16.
          //Then the aixterm colors are the bright versions of the ISO colors:
          case 90:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 97:
            this._CurrentForeColor = i;
            break;
          case 100:
          case 101:
          case 102:
          case 103:
          case 104:
          case 105:
          case 106:
          case 107:
            this._CurrentBackColor = i;
            break;
        }
      }
    }
    buildColorTable() {
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
      this._ColorTable = _ColorTable;
    }
    GetColor(code) {
      if (this._ColorTable == null)
        this.buildColorTable();
      switch (code) {
        case -12:
          return this._ColorTable[279];
        //ErrorBack
        case -11:
          return this._ColorTable[278];
        //ErrorFore
        case -10:
          return this._ColorTable[280];
        //DefaultBrightFore
        case -8:
          return this._ColorTable[272];
        //InfoBackground
        case -7:
          return this._ColorTable[273];
        //InfoText
        case -4:
          return this._ColorTable[274];
        //LocalEchoBackground
        case -3:
          return this._ColorTable[275];
        //LocalEchoText
        case 49:
        case -2:
          return this._ColorTable[276];
        //DefaultBack
        case 39:
        case -1:
          return this._ColorTable[277];
        //DefaultBack
        case 0:
        case 30:
          return this._ColorTable[0];
        case 1:
        case 31:
          return this._ColorTable[1];
        case 2:
        case 32:
          return this._ColorTable[2];
        case 3:
        case 33:
          return this._ColorTable[3];
        case 4:
        case 34:
          return this._ColorTable[4];
        case 5:
        case 35:
          return this._ColorTable[5];
        case 6:
        case 36:
          return this._ColorTable[6];
        case 7:
        case 37:
          return this._ColorTable[7];
        case 40:
          return this._ColorTable[264];
        case 41:
          return this._ColorTable[265];
        case 42:
          return this._ColorTable[266];
        case 43:
          return this._ColorTable[267];
        case 44:
          return this._ColorTable[268];
        case 45:
          return this._ColorTable[269];
        case 46:
          return this._ColorTable[270];
        case 47:
          return this._ColorTable[271];
        case 8:
        case 90:
        case 100:
        case 300:
        //set foreground color to black
        case 400:
          return this._ColorTable[8];
        case 9:
        case 91:
        case 101:
        case 310:
        //set foreground color to red
        case 410:
          return this._ColorTable[9];
        case 10:
        case 92:
        case 102:
        case 320:
        //set foreground color to green
        case 420:
          return this._ColorTable[10];
        case 11:
        case 93:
        case 103:
        case 330:
        //set foreground color to yellow
        case 430:
          return this._ColorTable[11];
        case 12:
        case 94:
        case 104:
        case 340:
        //set foreground color to blue
        case 440:
          return this._ColorTable[12];
        case 13:
        case 95:
        case 105:
        case 350:
        //set foreground color to magenta (purple)
        case 450:
          return this._ColorTable[13];
        case 14:
        case 96:
        case 106:
        case 360:
        //set foreground color to cyan
        case 460:
          return this._ColorTable[14];
        case 15:
        case 97:
        case 107:
        case 370:
        //set foreground color to white
        case 470:
          return this._ColorTable[15];
        case 4e3:
        case 3e3:
          return this._ColorTable[256];
        case 4100:
        case 3100:
          return this._ColorTable[257];
        case 4200:
        case 3200:
          return this._ColorTable[258];
        case 4300:
        case 3300:
          return this._ColorTable[259];
        case 4400:
        case 3400:
          return this._ColorTable[260];
        case 4500:
        case 3500:
          return this._ColorTable[261];
        case 4600:
        case 3600:
          return this._ColorTable[262];
        case 4700:
        case 3700:
          return this._ColorTable[263];
        default:
          if (code <= -16) {
            code += 16;
            code *= -1;
          }
          if (code >= 0 && code < 281)
            return this._ColorTable[code];
          return this._ColorTable[277];
      }
    }
    SetColor(code, color) {
      if (this._ColorTable == null)
        this.buildColorTable();
      if (code < 0 || code >= this._ColorTable.length)
        return;
      color = new RGBColor(color);
      if (!color.ok) return;
      this._ColorTable[code] = color.toRGB();
    }
    AddLine(line, raw, fragment, skip, formats, remote) {
      const data = { raw, line, fragment, gagged: skip, formats: this.pruneFormats(formats, line.length, fragment), remote };
      this.emit("add-line", data);
      this.EndOfLine = !fragment;
    }
    pruneFormats(formats, textLen, fragment) {
      if (!formats || formats.length < 2) return formats;
      const l = formats.length;
      const nF = [];
      for (let f = 0; f < l; f++) {
        const format = formats[f];
        let end;
        if (f < l - 1) {
          const nFormat = formats[f + 1];
          if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
            continue;
          end = nFormat.offset;
          if (format.formatType === 1 /* Link */ && end - format.offset === 0 && nFormat.formatType === 2 /* LinkEnd */)
            continue;
          if (format.formatType === 7 /* MXPSend */ && end - format.offset === 0 && nFormat.formatType === 8 /* MXPSendEnd */)
            continue;
          if (format.formatType === 3 /* MXPLink */ && end - format.offset === 0 && nFormat.formatType === 4 /* MXPLinkEnd */)
            continue;
        } else if (!fragment && format.offset === textLen && textLen !== 0 && (format.formatType === 0 /* Normal */ && !format.hr || format.formatType === 1 /* Link */ || format.formatType === 7 /* MXPSend */ || format.formatType === 3 /* MXPLink */))
          continue;
        nF.push(format);
      }
      return nF;
    }
    GetEntity(entity) {
      if (entity === "text")
        return entity;
      if (this.mxpEntities[entity]) {
        this.mxpState.expanded = true;
        return this.mxpEntities[entity].value;
      }
      return entity;
    }
    ClearMXPToTag(tag, custom, secure) {
      if (custom == null) custom = "";
      let tmp = new MXPStyle();
      tmp.tag = 0 /* None */;
      let ml = this.mxpStyles.length - 1;
      for (; ml >= 0; ml--) {
        if (this.mxpStyles[ml].tag !== tag && this.mxpStyles[ml].custom !== custom) {
          if (!this.mxpStyles[ml].open && !secure) continue;
          tmp = this.mxpStyles.splice(ml, 1)[0];
        } else
          break;
      }
      if (ml >= 0 && this.mxpStyles.length > 0)
        tmp = this.mxpStyles.splice(ml, 1)[0];
      else if (this.mxpStyles.length === 0)
        this.ResetMXP();
      return tmp;
    }
    ClearMXPOpen() {
      let ml = this.mxpStyles.length;
      while (ml--) {
        if (!this.mxpStyles[ml].open) continue;
        this.mxpStyles.splice(ml, 1);
      }
      if (this.mxpStyles.length === 0)
        this.ResetMXP();
    }
    getMXPOpenFormatBlocks() {
      if (!this.mxpState.on) return [];
      let m = 0;
      const ml = this.mxpStyles.length;
      const formats = [];
      for (; m < ml; m++) {
        if (this.mxpStyles[m].tag === 22 /* A */ || this.mxpStyles[m].tag === 23 /* SEND */)
          formats.push(Object.assign({}, this.mxpStyles[m].properties));
      }
      return formats;
    }
    getMXPCloseFormatBlocks() {
      if (!this.mxpState.on) return [];
      let ml = this.mxpStyles.length;
      const formats = [];
      while (ml--) {
        if (this.mxpStyles[ml].tag === 22 /* A */)
          formats.push({ formatType: 4 /* MXPLinkEnd */ });
        else if (this.mxpStyles[ml].tag === 23 /* SEND */)
          formats.push({ formatType: 8 /* MXPSendEnd */ });
      }
      return formats;
    }
    getMXPBlock(tag, args, remote, oTag, blocks) {
      let tmp;
      let arg;
      let sArg;
      let sArgs;
      let color;
      let x;
      let xl = args.length;
      let e;
      let sl;
      let s;
      let href = "";
      let hint = "";
      let expire = "";
      let prompt = false;
      tag = tag.toUpperCase();
      if (this.enableDebug) {
        this.emit("debug", "MXP Tag: " + tag);
        this.emit("debug", "MXP Tag Args: " + args);
      }
      switch (tag) {
        case "C":
        case "COLOR":
          tmp = this.CloneCurrentStyle();
          tmp.tag = MXPTag[tag];
          tmp.open = true;
          if (xl > 0) {
            arg = args[0].split("=");
            if (arg.length > 1) {
              color = new RGBColor(stripQuotes(arg[1]));
              if (!color.ok) return null;
              if (arg[0].toUpperCase() === "BACK")
                tmp.back = color.toRGB();
              else
                tmp.fore = color.toRGB();
            } else {
              color = new RGBColor(stripQuotes(arg[0]));
              if (color.ok)
                tmp.fore = color.toRGB();
            }
          }
          if (xl > 1) {
            arg = args[1].split("=");
            if (arg.length > 1) {
              color = new RGBColor(stripQuotes(arg[1]));
              if (!color.ok) return null;
              if (arg[0].toUpperCase() === "FORE")
                tmp.fore = color.toRGB();
              else
                tmp.back = color.toRGB();
            } else {
              color = new RGBColor(stripQuotes(arg[0]));
              if (color.ok)
                tmp.back = color.toRGB();
            }
          }
          tmp.custom = "";
          this.mxpStyles.push(tmp);
          return null;
        case "B":
        case "BOLD":
        case "STRONG":
          tmp = this.CloneCurrentStyle();
          tmp.open = true;
          tmp.tag = MXPTag[tag];
          tmp.style |= 1 /* Bold */;
          tmp.custom = "";
          this.mxpStyles.push(tmp);
          return null;
        case "FONT":
          tmp = this.CloneCurrentStyle();
          tmp.open = true;
          tmp.tag = MXPTag[tag];
          for (x = 0; x < xl; x++) {
            arg = args[x].split("=");
            if (arg.length > 1) {
              switch (arg[0].toUpperCase()) {
                case "SIZE":
                  if (this.isNumber(arg[1]))
                    tmp.fontSize = arg[1] + "pt";
                  else
                    tmp.fontSize = arg[1] || 0;
                  break;
                case "COLOR":
                  sArgs = arg[1].split(",");
                  color = new RGBColor(stripQuotes(sArgs[0]));
                  if (color.ok) tmp.fore = color.toRGB();
                  for (s = 1, sl = sArgs.length; s < sl; s++) {
                    switch (sArgs[s].toLowerCase()) {
                      case "bold":
                        tmp.style |= 1 /* Bold */;
                        break;
                      case "italic":
                        tmp.style |= 4 /* Italic */;
                        break;
                      case "underline":
                        tmp.style |= 8 /* Underline */;
                        break;
                      case "blink":
                        tmp.style |= 16 /* Slow */;
                        break;
                      case "inverse":
                        tmp.style |= 64 /* Inverse */;
                        break;
                      case "hidden":
                        tmp.style |= 128 /* Hidden */;
                        break;
                      case "strikeout":
                        tmp.style |= 256 /* Strikeout */;
                        break;
                      case "overline":
                        tmp.style |= 1024 /* Overline */;
                        break;
                      case "doubleunderline":
                        tmp.style |= 512 /* DoubleUnderline */;
                        break;
                    }
                  }
                  break;
                case "BACK":
                  color = new RGBColor(stripQuotes(arg[1]));
                  if (color.ok) tmp.back = color.toRGB();
                  break;
                case "FACE":
                  tmp.font = stripQuotes(arg[1]) || 0;
                  break;
                default:
                  if (this.enableDebug) this.emit("debug", "Invalid Argument for " + tag + ": " + arg[0]);
                  break;
              }
            } else if (x === 0) {
              tmp.font = stripQuotes(args[x]) || 0;
            } else if (x === 1) {
              if (this.isNumber(args[x]))
                tmp.fontSize = args[x] + "pt";
              else
                tmp.fontSize = args[x] || 0;
            } else if (x === 2) {
              color = new RGBColor(stripQuotes(args[x]));
              if (color.ok) tmp.fore = color.toRGB();
            } else if (x === 3) {
              color = new RGBColor(stripQuotes(args[x]));
              if (color.ok) tmp.back = color.toRGB();
            }
          }
          tmp.custom = "";
          this.mxpStyles.push(tmp);
          return null;
        case "H":
        case "HIGH":
          tmp = this.CloneCurrentStyle();
          tmp.open = true;
          tmp.tag = MXPTag[tag];
          tmp.high = true;
          tmp.custom = "";
          this.mxpStyles.push(tmp);
          return null;
        case "I":
        case "ITALIC":
        case "EM":
          tmp = this.CloneCurrentStyle();
          tmp.open = true;
          tmp.tag = MXPTag[tag];
          tmp.style |= 4 /* Italic */;
          tmp.custom = "";
          this.mxpStyles.push(tmp);
          return null;
        case "U":
        case "UNDERLINE":
          tmp = this.CloneCurrentStyle();
          tmp.open = true;
          tmp.tag = MXPTag[tag];
          tmp.style |= 8 /* Underline */;
          tmp.custom = "";
          this.mxpStyles.push(tmp);
          return null;
        case "S":
        case "STRIKEOUT":
          tmp = this.CloneCurrentStyle();
          tmp.open = true;
          tmp.tag = MXPTag[tag];
          tmp.style |= 256 /* Strikeout */;
          tmp.custom = "";
          this.mxpStyles.push(tmp);
          return null;
        case "/B":
        case "/BOLD":
        case "/STRONG":
        case "/H":
        case "/HIGH":
        case "/I":
        case "/ITALIC":
        case "/EM":
        case "/U":
        case "/UNDERLINE":
        case "/S":
        case "/STRIKEOUT":
        case "/C":
        case "/COLOR":
        case "/FONT":
          this.ClearMXPToTag(MXPTag[tag.substring(1)]);
          return null;
      }
      if (this.mxpState.lineType === 1 /* Secure */ || this.mxpState.lineType === 6 /* LockSecure */ || this.mxpState.lineType === 4 /* TempSecure */) {
        switch (tag) {
          case "IMAGE":
            e = {
              formatType: 5 /* Image */,
              name: "",
              url: this.DefaultImgUrl,
              t: "",
              h: "",
              w: "",
              hspace: "",
              vspace: "",
              align: "bottom",
              ismap: false
            };
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              switch (arg[0].toUpperCase()) {
                case "FNAME":
                  e.name = stripQuotes(arg[1]);
                  break;
                case "URL":
                  e.url = stripQuotes(arg[1]);
                  break;
                case "TYPE":
                case "T":
                  if (arg[1].length > 0)
                    e.type = arg[1];
                  break;
                case "HEIGHT":
                case "H":
                  e.h = stripQuotes(arg[1]);
                  break;
                case "WIDTH":
                case "W":
                  e.w = stripQuotes(arg[1]);
                  break;
                case "HSPACE":
                  e.hspace = arg[1];
                  break;
                case "VSPACE":
                  e.vspace = arg[1];
                  break;
                case "ALIGN":
                  e.align = arg[1].toLowerCase();
                  break;
                case "ISMAP":
                  e.ismap = true;
                  break;
                default:
                  if (x === 0)
                    e.name = stripQuotes(args[x]);
                  else if (x === 1)
                    e.url = stripQuotes(args[x]);
                  else if (x === 2 && args[x].length > 0)
                    e.type = args[x];
                  else if (x === 3)
                    e.h = stripQuotes(args[x]);
                  else if (x === 4)
                    e.w = stripQuotes(args[x]);
                  else if (x === 5)
                    e.hspace = args[x];
                  else if (x === 6)
                    e.vspace = args[x];
                  else if (x === 7)
                    e.align = args[x].toLowerCase();
                  break;
              }
            }
            return { format: e, text: null };
          case "!AT":
          case "!ATTLIST":
            if (args.length === 0) return null;
            e = args[0];
            if (!this.mxpElements[e] || this.mxpEntities[e].remote !== e.remote && !this.mxpEntities[e].open)
              return null;
            this.mxpElements[e].attributes = {};
            this.mxpElements[e].attributeIndexes = [];
            for (x = 1; x < xl; x++) {
              sArgs = args[x].split("=");
              if (sArgs.length > 1)
                this.mxpElements[e].attributes[sArgs[0].toLowerCase()] = sArgs[1];
              else
                this.mxpElements[e].attributes[sArgs[0].toLowerCase()] = "";
              this.mxpElements[e].attributeIndexes.push(sArgs[0].toLowerCase());
            }
            break;
          case "!TAG":
            e = new Tag();
            e.remote = remote;
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              switch (arg[0].toUpperCase()) {
                case "WINDOWNAME":
                  e.window = stripQuotes(arg[1]);
                  break;
                case "FORE":
                  color = new RGBColor(stripQuotes(arg[1]));
                  if (color.ok) e.fore = color.toRGB();
                  break;
                case "BACK":
                  color = new RGBColor(stripQuotes(arg[1]));
                  if (color.ok) e.back = color.toRGB();
                  break;
                case "GAG":
                  e.gag = true;
                  break;
                case "ENABLE":
                  e.enabled = true;
                  break;
                case "DISABLE":
                  e.enabled = false;
                  break;
                default:
                  if (x === 0) {
                    tmp = +args[x];
                    if (!isNaN(tmp)) e.index = tmp;
                  } else if (x === 1)
                    e.window = stripQuotes(args[x]);
                  else if (x === 2) {
                    color = new RGBColor(stripQuotes(args[x]));
                    if (color.ok) e.fore = color.toRGB();
                  } else if (x === 3) {
                    color = new RGBColor(stripQuotes(args[x]));
                    if (color.ok) e.back = color.toRGB();
                  }
                  break;
              }
            }
            if (e.fore.length > 0 && e.back.length > 0)
              e.definition = `<C "${e.fore}" "${e.back}">`;
            else if (e.fore.length > 0)
              e.definition = `<C "${e.fore}">`;
            else if (e.back.length > 0)
              e.definition = `<C BACK="${e.fore}">`;
            if (e.definition.length > 0)
              e.closeDefinition = "</C>";
            if (this.mxpLines[e.index]) {
              if (e.remote || this.mxpLines[e.index].remote === e.remote)
                this.mxpLines[e.index] = e;
            } else
              this.mxpLines[e.index] = e;
            break;
          case "!EL":
          case "!ELEMENT":
            e = new Element(remote);
            for (x = 0; x < xl; x++) {
              if (args[x].toUpperCase().startsWith("ATT=")) {
                arg = stripQuotes(args[x]).substring(4).split(" ");
                for (s = 0, sl = arg.length; s < sl; s++) {
                  sArgs = stripQuotes(arg[s]).split("=");
                  if (sArgs.length > 1)
                    e.attributes[sArgs[0].toLowerCase()] = stripQuotes(sArgs[1]);
                  else
                    e.attributes[sArgs[0].toLowerCase()] = "";
                  e.attributeIndexes.push(sArgs[0].toLowerCase());
                }
                continue;
              }
              arg = args[x].split("=");
              switch (arg[0].toUpperCase()) {
                case "TAG":
                  tmp = +arg[1];
                  if (!isNaN(tmp)) e.tag = tmp;
                  break;
                case "FLAG":
                  e.flag = stripQuotes(arg[1]);
                  break;
                case "OPEN":
                  e.open = true;
                  break;
                case "DELETE":
                  if (this.mxpElements[e.name] && (this.mxpEntities[e.name].remote === e.remote || this.mxpEntities[e.name].open))
                    delete this.mxpEntities[e.name];
                  return null;
                case "EMPTY":
                  e.empty = true;
                  break;
                /*
                case "HIDDEN":
                  e.hidden = true;
                  break;
                  */
                case "SECURE":
                  e.open = false;
                  break;
                default:
                  if (x === 0)
                    e.name = stripQuotes(args[x]).toUpperCase();
                  else if (x === 1) {
                    e.definition = stripQuotes(args[x]);
                    e.closeDefinition = this.GetCloseTags(e.definition);
                    if (this.enableDebug) this.emit("debug", "MXP close definition: " + e.closeDefinition);
                  } else if (x === 2) {
                    arg = args[x].substring(4).split(" ");
                    for (s = 0, sl = arg.length; s < sl; s++) {
                      sArgs = arg[s].split("=");
                      if (sArgs.length > 1)
                        e.attributes[sArgs[0]] = sArgs[1];
                      else
                        e.attributes[sArgs[0]] = "";
                      e.attributeIndexes.push(sArgs[0]);
                    }
                  } else if (x === 3) {
                    tmp = +args[x];
                    if (!isNaN(tmp)) e.tag = tmp;
                  } else if (x === 4)
                    e.flag = stripQuotes(args[x]);
                  break;
              }
            }
            if (e.tag > 19 && e.tag < 100) {
              tmp = new Tag(e.tag);
              tmp.element = e.name;
              if (this.mxpLines[tmp.index]) {
                if (e.remote || this.mxpLines[tmp.index].remote === e.remote)
                  this.mxpLines[tmp.index] = tmp;
              } else
                this.mxpLines[tmp.index] = tmp;
            }
            if (this.mxpElements[e.name]) {
              if (this.mxpElements[e.name].remote === e.remote || this.mxpEntities[e.name].open)
                this.mxpElements[e.name] = e;
            } else
              this.mxpElements[e.name] = e;
            break;
          case "!EN":
          case "!ENTITY":
            e = new Entity(remote);
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              switch (arg[0].toUpperCase()) {
                case "DESC":
                  e.description = stripQuotes(arg[1]);
                  break;
                case "PRIVATE":
                  e.publish = false;
                  break;
                case "PUBLISH":
                  e.publish = true;
                  break;
                case "DELETE":
                  if (this.mxpEntities[e.name] && this.mxpEntities[e.name].remote === e.remote)
                    delete this.mxpEntities[e.name];
                  return null;
                case "ADD":
                  if (this.mxpEntities[e.name] && this.mxpEntities[e.name].remote === e.remote) {
                    if (!this.mxpEntities[e.name].value)
                      this.mxpEntities[e.name].value = e.value;
                    else
                      this.mxpEntities[e.name].value += "|" + e.value;
                    return null;
                  }
                  break;
                case "REMOVE":
                  if (this.mxpEntities[e.name] && this.mxpEntities[e.name].remote === e.remote) {
                    if (this.mxpEntities[e.name].value) {
                      sArgs = this.mxpEntities[e.name].value.split("|");
                      sArg = [];
                      for (s = 0, sl = sArgs.length; s < sl; s++) {
                        if (sArgs[s] !== e.value)
                          sArg.push(sArgs[s]);
                      }
                      this.mxpEntities[e.name].value = sArg.join("|");
                    }
                  }
                  return null;
                default:
                  if (x === 0)
                    e.name = stripQuotes(args[x]);
                  else if (x === 1)
                    e.value = stripQuotes(args[x]);
                  else if (x === 2)
                    e.description = stripQuotes(args[x]);
                  break;
              }
            }
            if (this.mxpEntities[e.name]) {
              if (this.mxpEntities[e.name].remote === e.remote)
                this.mxpEntities[e.name] = e;
            } else
              this.mxpEntities[e.name] = e;
            break;
          case "/V":
          case "/VAR":
            tmp = this.ClearMXPToTag(MXPTag[tag.substring(1)]);
            e = new Entity(remote);
            if (this.mxpState.captured.length > 0)
              e.value = this.mxpState.captured.pop().join("");
            else
              e.value = "";
            this.mxpState.capture--;
            if (this.enableDebug) this.emit("debug", "MXP captured: " + e.value);
            args = tmp.obj;
            xl = args.length;
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              switch (arg[0].toUpperCase()) {
                case "DESC":
                  e.description = stripQuotes(arg[1]);
                  break;
                case "PRIVATE":
                  e.publish = false;
                  break;
                case "PUBLISH":
                  e.publish = true;
                  break;
                case "DELETE":
                  if (this.mxpEntities[e.name] && this.mxpEntities[e.name].remote === e.remote)
                    delete this.mxpEntities[e.name];
                  return null;
                case "ADD":
                  if (this.mxpEntities[e.name] && this.mxpEntities[e.name].remote === e.remote) {
                    if (!this.mxpEntities[e.name].value)
                      this.mxpEntities[e.name].value = e.value;
                    else
                      this.mxpEntities[e.name].value += "|" + e.value;
                    return null;
                  }
                  break;
                case "REMOVE":
                  if (this.mxpEntities[e.name] && this.mxpEntities[e.name].remote === e.remote) {
                    if (this.mxpEntities[e.name].value) {
                      sArgs = this.mxpEntities[e.name].value.split("|");
                      sArg = [];
                      for (s = 0, sl = sArgs.length; s < sl; s++) {
                        if (sArgs[s] !== e.value)
                          sArg.push(sArgs[s]);
                      }
                      this.mxpEntities[e.name].value = sArg.join("|");
                    }
                  }
                  return null;
                default:
                  if (x === 0)
                    e.name = stripQuotes(args[x]);
                  else if (x === 1)
                    e.description = stripQuotes(args[x]);
                  break;
              }
            }
            if (this.mxpEntities[e.name]) {
              if (this.mxpEntities[e.name].remote === e.remote)
                this.mxpEntities[e.name] = e;
            } else
              this.mxpEntities[e.name] = e;
            break;
          case "V":
          case "VAR":
            this.mxpState.captured.push([]);
            this.mxpState.capture++;
            tmp = this.CloneCurrentStyle();
            tmp.open = false;
            tmp.tag = MXPTag[tag];
            tmp.obj = args;
            tmp.custom = "";
            this.mxpStyles.push(tmp);
            return null;
          case "GAUGE":
            e = { value: 0, max: 1, caption: "", color: 0 };
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              if (arg.length > 1) {
                switch (arg[0].toUpperCase()) {
                  case "VALUE":
                    tmp = parseFloat(this.GetEntity(arg[1]));
                    if (isNaN(tmp))
                      tmp = this.GetEntity(arg[1]);
                    e.value = tmp;
                    break;
                  case "MAX":
                    tmp = parseFloat(this.GetEntity(arg[1]));
                    if (isNaN(tmp))
                      tmp = this.GetEntity(arg[1]);
                    e.max = tmp;
                    break;
                  case "CAPTION":
                    if (arg[1].length > 0)
                      e.caption = stripQuotes(arg[1]);
                    break;
                  case "COLOR":
                    color = new RGBColor(stripQuotes(arg[1]));
                    if (color.ok) e.color = color.toRGB();
                    break;
                }
              } else if (x === 0) {
                tmp = parseFloat(this.GetEntity(args[x]));
                if (isNaN(tmp))
                  tmp = this.GetEntity(args[x]);
                e.value = tmp;
              } else if (x === 1) {
                tmp = parseFloat(this.GetEntity(args[x]));
                if (isNaN(tmp))
                  tmp = this.GetEntity(args[x]);
                e.max = tmp;
              } else if (x === 2 && args[x].length > 0)
                e.caption = stripQuotes(args[x]);
              else if (x === 3 && args[x].length > 0) {
                color = new RGBColor(stripQuotes(arg[1]));
                if (color.ok) e.color = color.toRGB();
              }
            }
            this.mxpState.expanded = false;
            this.emit("gauge", e);
            break;
          case "STAT":
            e = { value: 0, max: 1, caption: "" };
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              if (arg.length > 1) {
                switch (arg[0].toUpperCase()) {
                  case "VALUE":
                    tmp = parseFloat(this.GetEntity(arg[1]));
                    if (isNaN(tmp))
                      tmp = this.GetEntity(arg[1]);
                    e.value = tmp;
                    break;
                  case "MAX":
                    tmp = parseFloat(this.GetEntity(arg[1]));
                    if (isNaN(tmp))
                      tmp = this.GetEntity(arg[1]);
                    e.max = tmp;
                    break;
                  case "CAPTION":
                    if (arg[1].length > 0)
                      e.caption = stripQuotes(arg[1]);
                    break;
                }
              } else if (x === 0) {
                tmp = parseFloat(this.GetEntity(args[x]));
                if (isNaN(tmp))
                  tmp = this.GetEntity(args[x]);
                e.value = tmp;
              } else if (x === 1) {
                tmp = parseFloat(this.GetEntity(args[x]));
                if (isNaN(tmp))
                  tmp = this.GetEntity(args[x]);
                e.max = tmp;
              } else if (x === 2 && args[x].length > 0)
                e.caption = stripQuotes(args[x]);
            }
            this.mxpState.expanded = false;
            this.emit("stat", e);
            break;
          case "MUSIC":
            e = { off: false, file: "", url: "", volume: 100, repeat: 1, priority: 50, type: "", continue: true };
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              if (arg.length > 1) {
                switch (arg[0].toUpperCase()) {
                  case "FNAME":
                    e.file = stripQuotes(arg[1]);
                    if (e.file.toLowerCase() === "off") {
                      e.off = true;
                      e.file = "";
                    }
                    break;
                  case "V":
                    tmp = +arg[1];
                    if (isNaN(tmp))
                      tmp = 100;
                    e.volume = tmp;
                    break;
                  case "L":
                    tmp = +arg[1];
                    if (isNaN(tmp))
                      tmp = 1;
                    e.repeat = tmp;
                    break;
                  case "C":
                    e.continue = arg[1] !== "0";
                    break;
                  case "T":
                    if (arg[1].length > 0)
                      e.type = arg[1];
                    break;
                  case "U":
                    e.url = stripQuotes(arg[1]);
                    if (!e.url.endsWith("/") && e.url.length > 0)
                      e.url += "/";
                    break;
                }
              } else if (x === 0) {
                e.file = stripQuotes(args[x]);
                if (e.file.toLowerCase() === "off") {
                  e.off = true;
                  e.file = "";
                }
              } else if (x === 1) {
                tmp = +args[x];
                if (isNaN(tmp))
                  tmp = 100;
                e.volume = tmp;
              } else if (x === 2) {
                tmp = +args[x];
                if (isNaN(tmp))
                  tmp = 1;
                e.repeat = tmp;
              } else if (x === 3)
                e.continue = args[x] !== "0";
              else if (x === 4) {
                if (args[x].length > 0)
                  e.type = args[x];
              } else if (x === 5) {
                e.url = stripQuotes(args[x]);
                if (!e.url.endsWith("/") && e.url.length > 0)
                  e.url += "/";
              }
            }
            this.emit("music", e);
            break;
          case "SOUND":
            e = { off: false, file: "", url: "", volume: 100, repeat: 1, priority: 50, type: "", continue: true };
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              if (arg.length > 1) {
                switch (arg[0].toUpperCase()) {
                  case "FNAME":
                    e.file = stripQuotes(arg[1]);
                    if (e.file.toLowerCase() === "off") {
                      e.off = true;
                      e.file = "";
                    }
                    break;
                  case "V":
                    tmp = +arg[1];
                    if (isNaN(tmp))
                      tmp = 100;
                    e.volume = tmp;
                    break;
                  case "L":
                    tmp = +arg[1];
                    if (isNaN(tmp))
                      tmp = 1;
                    e.repeat = tmp;
                    break;
                  case "P":
                    tmp = +arg[1];
                    if (isNaN(tmp))
                      tmp = 1;
                    e.priority = tmp;
                    break;
                  case "T":
                    if (arg[1].length > 0)
                      e.type = arg[1];
                    break;
                  case "U":
                    e.url = stripQuotes(arg[1]);
                    if (!e.url.endsWith("/") && e.url.length > 0)
                      e.url += "/";
                    break;
                }
              } else if (x === 0) {
                e.file = stripQuotes(args[x]);
                if (e.file.toLowerCase() === "off") {
                  e.off = true;
                  e.file = "";
                }
              } else if (x === 1) {
                tmp = +args[x];
                if (isNaN(tmp))
                  tmp = 100;
                e.volume = tmp;
              } else if (x === 2) {
                tmp = +args[x];
                if (isNaN(tmp))
                  tmp = 1;
                e.repeat = tmp;
              } else if (x === 3) {
                tmp = +args[x];
                if (isNaN(tmp))
                  tmp = 1;
                e.priority = tmp;
              } else if (x === 4) {
                if (args[x].length > 0)
                  e.type = args[x];
              } else if (x === 5) {
                e.url = stripQuotes(args[x]);
                if (!e.url.endsWith("/") && e.url.length > 0)
                  e.url += "/";
              }
            }
            this.emit("sound", e);
            break;
          case "EXPIRE":
            this.emit("expire-links", args);
            this.cleanMXPExpired(blocks, args?.[0] || "");
            break;
          case "VERSION":
            if (xl > 0)
              this.StyleVersion = args[0];
            else
              this.emit("MXP-tag-reply", tag, []);
            break;
          case "USER":
          case "PASSWORD":
            this.emit("MXP-tag-reply", tag, args);
            break;
          case "SUPPORT":
            sArgs = [];
            if (xl > 0) {
              for (x = 0; x < xl; x++) {
                arg = stripQuotes(args[x]);
                if (arg.indexOf(".") === -1) {
                  arg = arg.toUpperCase();
                  switch (arg) {
                    //TODO re-enable once font size/face  are supported
                    //case 'FONT':
                    case "IMAGE":
                    case "HR":
                    case "A":
                    case "SEND":
                    case "B":
                    case "I":
                    case "COLOR":
                    case "C":
                    case "EM":
                    case "ITALIC":
                    case "STRONG":
                    case "BOLD":
                    case "UNDERLINE":
                    case "U":
                    case "S":
                    case "STRIKEOUT":
                    case "STRIKE":
                    case "H":
                    case "HIGH":
                    case "EXPIRE":
                    case "VERSION":
                    case "SUPPORT":
                    case "NOBR":
                    case "P":
                    case "BR":
                    case "SBR":
                    case "SOUND":
                    case "MUSIC":
                    case "VAR":
                    case "USER":
                    case "PASSWORD":
                    case "H1":
                    case "H2":
                    case "H3":
                    case "H4":
                    case "H5":
                    case "H6":
                    case "RESET":
                    case "GAUGE":
                    case "STAT":
                      sArgs.push("+" + name);
                      break;
                    default:
                      sArgs.push("-" + name);
                      break;
                  }
                } else {
                  arg = args[x].split(".");
                  arg[0] = arg[0].toUpperCase();
                  switch (arg[0]) {
                    case "IMAGE":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+image.fname");
                        sArgs.push("+image.url");
                        sArgs.push("+image.t");
                        sArgs.push("+image.h");
                        sArgs.push("+image.w");
                        sArgs.push("+image.hspace");
                        sArgs.push("+image.vspace");
                        sArgs.push("+image.align");
                        sArgs.push("+image.ismap");
                      }
                      break;
                    case "SOUND":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+sound.v");
                        sArgs.push("+sound.l");
                        sArgs.push("+sound.p");
                        sArgs.push("+sound.t");
                        sArgs.push("+sound.u");
                      }
                      break;
                    case "MUSIC":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+music.v");
                        sArgs.push("+music.l");
                        sArgs.push("+music.c");
                        sArgs.push("+music.t");
                        sArgs.push("+music.u");
                      }
                      break;
                    case "A":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+a.href");
                        sArgs.push("+a.hint");
                        sArgs.push("+a.expire");
                      }
                      break;
                    case "SEND":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+send.href");
                        sArgs.push("+send.hint");
                        sArgs.push("+send.prompt");
                        sArgs.push("+send.expire");
                      }
                      break;
                    case "COLOR":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+color.fore");
                        sArgs.push("+color.back");
                      }
                      break;
                    case "C":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+c.fore");
                        sArgs.push("+c.back");
                      }
                      break;
                    case "FONT":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("-font.face");
                        sArgs.push("-font.size");
                        sArgs.push("+font.color");
                        sArgs.push("+font.back");
                      }
                      break;
                    case "EXPIRE":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else
                        sArgs.push("+expire.Name");
                      break;
                    case "GAUGE":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+gauge.max");
                        sArgs.push("+gauge.caption");
                        sArgs.push("+gauge.color");
                      }
                      break;
                    case "STAT":
                      if (arg[1] !== "*")
                        sArgs.push("+" + arg[0] + "." + arg[1]);
                      else {
                        sArgs.push("+stat.max");
                        sArgs.push("+stat.caption");
                      }
                      break;
                    default:
                      if (arg[1] !== "*")
                        sArgs.push("-" + arg[0] + "." + arg[1]);
                      else
                        sArgs.push("-" + arg[0]);
                      break;
                  }
                }
              }
            } else
              sArgs = ["+A", "+SEND", "+B", "+I", "+COLOR", "+C", "+EM", "+ITALIC", "+STRONG", "+BOLD", "+UNDERLINE", "+U", "+S", "+STRIKEOUT", "+H", "+HIGH", "-FONT", "+EXPIRE", "+VERSION", "+SUPPORT", "+NOBR", "+P", "+BR", "+SBR", "+VAR", "+SOUND", "+MUSIC", "+USER", "+PASSWORD", "+RESET", "+STRIKE", "+H1", "+H2", "+H3", "+H4", "+H5", "+H6", "+IMAGE", "+STAT", "+GAUGE"];
            this.emit("MXP-tag-reply", tag, sArgs);
            break;
          case "A":
            tmp = this.CloneCurrentStyle();
            tmp.open = false;
            tmp.tag = MXPTag[tag];
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              if (arg.length > 1) {
                switch (arg[0].toUpperCase()) {
                  case "HREF":
                    href = stripQuotes(arg[1]);
                    break;
                  case "HINT":
                    hint = stripQuotes(arg[1]);
                    break;
                  case "EXPIRE":
                    expire = stripQuotes(arg[1]);
                    break;
                  default:
                    if (this.enableDebug) this.emit("debug", "Invalid Argument for " + tag + ": " + arg[0]);
                    break;
                }
              } else if (x === 0)
                href = stripQuotes(args[x]);
              else if (x === 1)
                hint = stripQuotes(args[x]);
              else if (x === 2)
                expire = stripQuotes(args[x]);
            }
            tmp.custom = "";
            tmp.properties = {
              formatType: 3 /* MXPLink */,
              href,
              hint,
              expire
            };
            this.mxpStyles.push(tmp);
            if (hint.length === 0)
              hint = href;
            return {
              format: {
                formatType: 3 /* MXPLink */,
                href,
                hint,
                expire
              },
              text: null
            };
          case "SEND":
            tmp = this.CloneCurrentStyle();
            tmp.open = false;
            tmp.tag = MXPTag[tag];
            for (x = 0; x < xl; x++) {
              arg = args[x].split("=");
              if (arg[0] === "PROMPT")
                prompt = true;
              else if (arg.length > 1) {
                switch (arg[0].toUpperCase()) {
                  case "HREF":
                    href = stripQuotes(arg[1]);
                    break;
                  case "HINT":
                    hint = stripQuotes(arg[1]);
                    break;
                  case "EXPIRE":
                    expire = stripQuotes(arg[1]);
                    break;
                  case "PROMPT":
                    prompt = true;
                    break;
                  default:
                    if (this.enableDebug) this.emit("debug", "Invalid Argument for " + tag + ": " + arg[0]);
                    break;
                }
              } else if (x === 0)
                href = stripQuotes(args[x]);
              else if (x === 1)
                hint = stripQuotes(args[x]);
              else if (x === 2)
                prompt = true;
              else if (x === 3)
                expire = stripQuotes(args[x]);
            }
            tmp.custom = "";
            this.mxpStyles.push(tmp);
            if (href.length === 0)
              href = "&text;";
            if (hint.length === 0)
              hint = href;
            const cmds = href.split("|");
            let tt;
            if (cmds.length > 1) {
              const caps = hint.split("|");
              if (caps.length === cmds.length + 1) {
                hint = caps[0];
                caps.shift();
                tt = "['" + caps.join("','") + "']";
              }
              href = "['" + cmds.join("','") + "']";
            } else
              href = "'" + href + "'";
            tmp.properties = {
              formatType: 7 /* MXPSend */,
              href,
              hint,
              expire,
              prompt,
              tt: tt || ""
            };
            return {
              format: {
                formatType: 7 /* MXPSend */,
                href,
                hint,
                expire,
                prompt,
                tt: tt || ""
              },
              text: null
            };
          case "H1":
          case "H2":
          case "H3":
          case "H4":
          case "H5":
          case "H6":
            tmp = this.CloneCurrentStyle();
            tmp.open = true;
            tmp.tag = MXPTag[tag];
            tmp.style |= 1 /* Bold */;
            tmp.custom = "";
            this.mxpStyles.push(tmp);
            return null;
          case "/A":
            this.ClearMXPToTag(MXPTag[tag.substring(1)]);
            return {
              format: {
                formatType: 4 /* MXPLinkEnd */
              },
              text: null
            };
          case "/SEND":
            this.ClearMXPToTag(MXPTag[tag.substring(1)]);
            return {
              format: {
                formatType: 8 /* MXPSendEnd */
              },
              text: null
            };
          case "/H1":
          case "/H2":
          case "/H3":
          case "/H4":
          case "/H5":
          case "/H6":
            this.ClearMXPToTag(MXPTag[tag.substring(1)]);
            return null;
          case "NOBR":
            this.mxpState.noBreak = true;
            return null;
          case "/P":
            this.ClearMXPToTag(MXPTag[tag.substring(1)]);
            this.mxpState.paragraph = false;
            return null;
          case "P":
            tmp = this.CloneCurrentStyle();
            tmp.open = false;
            tmp.tag = MXPTag[tag];
            tmp.custom = "";
            this.mxpStyles.push(tmp);
            this.mxpState.paragraph = true;
            return null;
          case "SBR":
            return {
              format: null,
              text: " \u200B"
            };
          case "RESET":
            this.ResetMXP();
            return null;
          case "HR":
            const mxp = this.GetCurrentStyle();
            const colors = this.getColors(mxp);
            return {
              format: {
                formatType: 0 /* Normal */,
                offset: 0,
                color: colors.fore,
                background: colors.back,
                size: mxp.fontSize,
                font: mxp.font,
                style: mxp.style | this._CurrentAttributes & ~1 /* Bold */,
                hr: true
              },
              text: null
            };
        }
      }
      if (this.mxpElements[tag]) {
        e = this.mxpElements[tag];
        if (!e.open && this.mxpState.lineType !== 1 /* Secure */ && this.mxpState.lineType !== 6 /* LockSecure */ && this.mxpState.lineType !== 4 /* TempSecure */)
          return null;
        tmp = this.CloneCurrentStyle();
        tmp.open = e.open;
        tmp.tag = 38 /* Custom */;
        tmp.custom = e.name;
        arg = e.definition;
        sArgs = {};
        for (s = 0, sl = e.attributeIndexes.length; s < sl; s++)
          sArgs[e.attributeIndexes[s]] = e.attributes[e.attributeIndexes[s]];
        for (x = 0; x < xl; x++) {
          sArg = args[x].split("=");
          sArg[0] = sArg[0].toLowerCase();
          if (e.attributes[sArg[0]])
            sArgs[sArg[0]] = sArg[1];
          else if (x < e.attributeIndexes.length)
            sArgs[e.attributeIndexes[x]] = sArg[0];
        }
        for (sArg in sArgs) {
          if (!sArgs.hasOwnProperty(sArg)) continue;
          arg = arg.replace("&" + sArg + ";", sArgs[sArg]);
        }
        if (!e.empty) {
          this.mxpState.captured.push([]);
          this.mxpState.capture++;
        }
        if (e.tag > 19 && e.tag < 100 && this.mxpLines[e.tag].enabled && this.mxpLines[e.tag].definition.length > 0) {
          arg = this.mxpLines[e.tag].definition + arg;
          tmp.gagged = this.mxpLines[e.tag].gag;
        }
        this.mxpState.gagged = tmp.gagged;
        this.mxpState.expanded = true;
        return { format: null, text: arg };
      } else if (tag.startsWith("/") && this.mxpElements[tag.substring(1)] && !this.mxpElements[tag.substring(1)].empty) {
        tag = tag.substring(1);
        e = this.mxpElements[tag];
        if (!e.open && this.mxpState.lineType !== 1 /* Secure */ && this.mxpState.lineType !== 6 /* LockSecure */ && this.mxpState.lineType !== 4 /* TempSecure */)
          return null;
        if (!e.empty && this.mxpState.capture > 0) {
          if (this.mxpState.captured.length > 0)
            sArg = this.mxpState.captured.pop().join("");
          this.mxpState.capture--;
        }
        arg = e.closeDefinition;
        if (e.flag.length > 0) {
          if (e.flag.length > 4 && e.flag.toLowerCase().startsWith("set "))
            this.emit("set-variable", e.flag.substring(4), sArg);
          this.emit("MXP-flag", e.flag, sArg);
        }
        if (e.tag > 19 && e.tag < 100 && this.mxpLines[e.tag].enabled && this.mxpLines[e.tag].closeDefinition.length > 0)
          arg += this.mxpLines[e.tag].closeDefinition;
        this.mxpState.gagged = !e.gagged;
        if (e.empty)
          return null;
        this.mxpState.expanded = true;
        return { format: null, text: arg };
      }
      if (this.showInvalidMXPTags) {
        switch (tag) {
          case "IMAGE":
          case "!AT":
          case "!ATTLIST":
          case "!TAG":
          case "!EL":
          case "!ELEMENT":
          case "!EN":
          case "!ENTITY":
          case "/V":
          case "/VAR":
          case "V":
          case "VAR":
          case "GAUGE":
          case "STAT":
          case "MUSIC":
          case "SOUND":
          case "EXPIRE":
          case "VERSION":
          case "USER":
          case "PASSWORD":
          case "SUPPORT":
          case "A":
          case "SEND":
          case "H1":
          case "H2":
          case "H3":
          case "H4":
          case "H5":
          case "H6":
          case "/A":
          case "/SEND":
          case "/H1":
          case "/H2":
          case "/H3":
          case "/H4":
          case "/H5":
          case "/H6":
          case "NOBR":
          case "/P":
          case "P":
          case "SBR":
          case "RESET":
          case "HR":
            return null;
        }
        return { format: null, text: "<" + oTag + ">" };
      }
      return null;
    }
    cleanMXPExpired(blocks, args) {
      if (!blocks || blocks.length === 0 || args === null)
        return;
      const bl = blocks.length;
      for (let b = 0; b < bl; b++) {
        let format = blocks[b];
        if (format.formatType !== 7 /* MXPSend */ && format.formatType !== 3 /* MXPLink */)
          continue;
        if (args.length === 0 || format.expire === args) {
          let eType, n = 0, f = 0;
          let type = format.formatType;
          if (format.formatType === 3 /* MXPLink */)
            eType = 4 /* MXPLinkEnd */;
          else
            eType = 8 /* MXPSendEnd */;
          format.formatType = 9 /* MXPExpired */;
          for (; f < bl; f++) {
            if (blocks[f].formatType === eType) {
              if (n === 0) {
                blocks[f].formatType = 10 /* MXPSkip */;
                break;
              } else
                n--;
            } else if (blocks[f] === type)
              n++;
          }
        }
      }
    }
    GetCloseTags(tag) {
      if (typeof tag === "undefined" || tag.length === 0)
        return "";
      let idx = 0;
      const tl = tag.length;
      const ts = [];
      let str = [];
      let c;
      let state = 0;
      for (; idx < tl; idx++) {
        c = tag.charAt(idx);
        switch (state) {
          case 1:
            if (c === " ") {
              ts.push(str.join(""));
              str = [];
              state = 2;
            } else if (c === ">") {
              ts.push(str.join(""));
              str = [];
              state = 0;
            } else
              str.push(c);
            break;
          case 2:
            if (c === ">")
              state = 0;
            break;
          default:
            if (c === "<")
              state = 1;
            break;
        }
      }
      if (state === 1)
        ts.push(str.join(""));
      if (ts.length === 0)
        return "";
      return "</" + ts.reverse().join("></") + ">";
    }
    CloneCurrentStyle() {
      let tmp;
      if (this.mxpStyles.length === 0)
        this.mxpStyles.push(new MXPStyle(0 /* None */, "", "", false));
      tmp = this.mxpStyles[this.mxpStyles.length - 1];
      if (this.mxpLines[this.mxpState.lineType] && this.mxpLines[this.mxpState.lineType].enabled)
        tmp.gagged = this.mxpLines[this.mxpState.lineType].gag;
      return Object.assign({}, tmp);
    }
    GetCurrentStyle() {
      let tmp;
      if (this.mxpStyles.length === 0)
        this.mxpStyles.push(new MXPStyle(0 /* None */, "", "", false));
      tmp = this.mxpStyles[this.mxpStyles.length - 1];
      if (this.mxpLines[this.mxpState.lineType] && this.mxpLines[this.mxpState.lineType].enabled)
        tmp.gagged = this.mxpLines[this.mxpState.lineType].gag;
      return tmp;
    }
    DecreaseColor(clr, p) {
      const color = new RGBColor(clr);
      if (!color.ok) return clr;
      color.b -= Math.ceil(color.b * p);
      if (color.b < 0)
        color.b = 0;
      color.g -= Math.ceil(color.g * p);
      if (color.g < 0)
        color.g = 0;
      color.r -= Math.ceil(color.r * p);
      if (color.r < 0)
        color.r = 0;
      return color.toRGB();
    }
    IncreaseColor(clr, p) {
      const color = new RGBColor(clr);
      if (!color.ok) return clr;
      color.b += Math.ceil(color.b * p);
      if (color.b > 255)
        color.b = 255;
      color.g += Math.ceil(color.g * p);
      if (color.g > 255)
        color.g = 255;
      color.r += Math.ceil(color.r * p);
      if (color.r > 255)
        color.r = 255;
      return color.toRGB();
    }
    MXPCapture(str) {
      if (this.mxpState.capture < 1) return;
      const il = this.mxpState.captured.length;
      for (let i = 0; i < il; i++)
        this.mxpState.captured[i].push(str);
    }
    MXPDeCapture(cnt) {
      if (this.mxpState.capture < 1) return;
      const il = this.mxpState.captured.length;
      for (let i = 0; i < il; i++) {
        for (let p = 0; p < cnt; p++)
          this.mxpState.captured[i].pop();
      }
    }
    isNumber(str) {
      return /^\d+$/.test(str);
    }
    /**
     * CurrentAnsiCode - return an ansi formatted code based on current ansi state
     *
     * @returns {String}
     */
    CurrentAnsiCode() {
      let ansi = "\x1B[";
      if (typeof this._CurrentForeColor === "string")
        ansi += "38;2;" + this._CurrentForeColor;
      else if (this._CurrentForeColor <= -16)
        ansi += "38;5;" + (this._CurrentForeColor * -1 - 16) + ";";
      else
        ansi += this._CurrentForeColor + ";";
      if (typeof this._CurrentBackColor === "string")
        ansi += "48;2;" + this._CurrentBackColor;
      else if (this._CurrentBackColor <= -16)
        ansi += "38;5;" + (this._CurrentBackColor * -1 - 16) + ";";
      else
        ansi += this._CurrentBackColor + ";";
      if (this._CurrentAttributes > 0) {
        if ((this._CurrentAttributes & 64 /* Inverse */) === 64 /* Inverse */)
          ansi += "7;";
        if ((this._CurrentAttributes & 1 /* Bold */) === 1 /* Bold */)
          ansi += "1;";
        if ((this._CurrentAttributes & 4 /* Italic */) === 4 /* Italic */)
          ansi += "3;";
        if ((this._CurrentAttributes & 8 /* Underline */) === 8 /* Underline */)
          ansi += "4;";
        if ((this._CurrentAttributes & 16 /* Slow */) === 16 /* Slow */)
          ansi += "5;";
        if ((this._CurrentAttributes & 32 /* Rapid */) === 32 /* Rapid */)
          ansi += "6;";
        if ((this._CurrentAttributes & 256 /* Strikeout */) === 256 /* Strikeout */)
          ansi += "9;";
        if ((this._CurrentAttributes & 2 /* Faint */) === 2 /* Faint */)
          ansi += "2;";
        if ((this._CurrentAttributes & 512 /* DoubleUnderline */) === 512 /* DoubleUnderline */)
          ansi += "21;";
        if ((this._CurrentAttributes & 1024 /* Overline */) === 1024 /* Overline */)
          ansi += "53;";
      }
      return ansi + "m";
    }
    get parseQueueLength() {
      return this.parsing.length;
    }
    get parseQueueEndOfLine() {
      if (this.parsing.length)
        return this.parsing[this.parsing.length - 1][0].endsWith("\n");
      return false;
    }
    parse(text, remote, force, prependSplit) {
      if (text == null || text.length === 0)
        return text;
      if (remote == null) remote = false;
      if (this.parsing.length > 0 && !force) {
        this.parsing.push([text, remote, prependSplit]);
        return;
      }
      let _TermTitle = "";
      let _TermTitleType = null;
      let _AnsiParams = null;
      let stringBuilder = [];
      let formatBuilder = [];
      let rawBuilder = [];
      let state = 0 /* None */;
      let pState = 0 /* None */;
      let lineLength = 0;
      let iTmp;
      let mOffset = 0;
      let _MXPTag;
      let _MXPOTag;
      let _MXPEntity;
      let _MXPComment;
      let _MXPArgs;
      let skip = false;
      this.busy = true;
      this.parsing.unshift([text, remote, prependSplit]);
      let format;
      if (this._SplitBuffer.length > 0) {
        if (prependSplit)
          text = text + this._SplitBuffer;
        else
          text = this._SplitBuffer + text;
        this._SplitBuffer = "";
      }
      if (!this.EndOfLine && (this.textLength > 0 || this.rawLength > 0)) {
        let lines = this.display.lines;
        if (lines.length > 0) {
          iTmp = this.display.lines[lines.length - 1].text;
          _MXPComment = this.display.lines[lines.length - 1].raw;
          formatBuilder.push.apply(formatBuilder, this.display.lines[lines.length - 1].formats);
          this.display.removeLine(lines.length - 1, true);
          format = formatBuilder[formatBuilder.length - 1];
          if (format.formatType === 1 /* Link */) {
            formatBuilder.pop();
            format = formatBuilder[formatBuilder.length - 1];
          }
          format.width = 0;
          format.height = 0;
          format.marginWidth = 0;
          format.marginHeight = 0;
          lineLength = format.offset;
          if (format.offset !== 0) {
            stringBuilder.push(iTmp.substring(0, format.offset));
            iTmp = iTmp.substring(format.offset);
            if (this.mxpState.locked || this.mxpState.on)
              mOffset = iTmp.length;
            text = iTmp + text;
          } else {
            if (this.mxpState.locked || this.mxpState.on)
              mOffset = iTmp.length;
            text = iTmp + text;
          }
          if (_MXPComment.endsWith(iTmp))
            rawBuilder.push(_MXPComment.substr(0, _MXPComment.length - iTmp.length));
          else
            rawBuilder.push(_MXPComment);
        } else
          formatBuilder.push(format = this.getFormatBlock(lineLength));
        lines = null;
      } else
        formatBuilder.push(format = this.getFormatBlock(lineLength));
      let idx = 0;
      let tl = text.length;
      let c;
      let i;
      const e = this.emulateControlCodes;
      const d = this.displayControlCodes;
      const f = this.emulateTerminal;
      const u = this.enableURLDetection;
      const s = this.enableMSP;
      const tabWidth = this.tabWidth;
      let lnk = 0;
      let fLnk = 0;
      let lnkOffset = 0;
      let lLnk = 0;
      let lNest = null;
      let p;
      const pl = this.protocols.length;
      try {
        for (idx = 0; idx < tl; idx++) {
          c = text.charAt(idx);
          i = text.charCodeAt(idx);
          if (idx >= mOffset)
            rawBuilder.push(c);
          this.rawLength++;
          switch (state) {
            case 2 /* AnsiParams */:
              if (c === "C" || //Move cursor # spaces
              c === "K" || //Clear screen Left/Right
              c === "s" || //save cursor position: non-standard
              c === "u" || //save cursor position: non-standard
              c === "l" || //XTerm ?#l Private Mode Reset/Reset Mode #l
              c === "h" || //XTerm ?#h Private Mode/Set Mode #h
              c === "A" || //Move cursor up N lines
              c === "B" || //Move cursor down N lines
              c === "D" || //Move cursor left N spaces
              c === "E" || //Moves cursor to beginning of the line n (default 1) lines down (next line).
              c === "F" || //Moves cursor to beginning of the line n (default 1) lines up (previous line).
              c === "f" || //Moves the cursor to row n, column m. Both default to 1 if omitted. Same as CUP
              c === "G" || //Moves the cursor to column n.
              c === "H" || //Moves the cursor to row n, column m. The values are 1-based, and default to 1 (top left corner) if omitted. A sequence such as CSI ;5H is a synonym for CSI 1;5H as well as CSI 17;H is the same as CSI 17H and CSI 17;1H
              c === "n" || //Reports the cursor position to the application as (as though typed at the keyboard) ESC[n;mR, where n is the row and m is the column. (May not work on MS-DOS.)
              c === "S" || //Scroll whole page up by n (default 1) lines. New lines are added at the bottom. (not ANSI.SYS)
              c === "T" || //Scroll whole page down by n (default 1) lines. New lines are added at the top. (not ANSI.SYS)
              c === "r") {
                this.ClearMXPOpen();
                this._SplitBuffer = "";
                _AnsiParams = null;
                state = 0 /* None */;
              } else if (c === "z") {
                _MXPTag = _AnsiParams.split(";");
                _AnsiParams = 0;
                for (let mt = _MXPTag.length - 1; mt >= 0; mt--) {
                  if (_MXPTag[mt].length > 0) {
                    _AnsiParams = _MXPTag[0];
                    break;
                  }
                }
                iTmp = +_AnsiParams;
                if (isNaN(iTmp)) iTmp = 0;
                this.mxpState.on = true;
                this.mxpState.noBreak = false;
                this.mxpState.paragraph = false;
                if (this.mxpState.lineType === 0 /* Open */)
                  this.ClearMXPOpen();
                switch (iTmp) {
                  case 2:
                    this.mxpState.on = false;
                    this.mxpState.locked = false;
                    this.mxpState.lineType = 2 /* Locked */;
                    this.ClearMXPOpen();
                    break;
                  case 3:
                    this.ResetMXP();
                    break;
                  case 4:
                    this.mxpState.lineType = 4 /* TempSecure */;
                    if (idx + 1 >= tl) {
                      this._SplitBuffer += c;
                      break;
                    }
                    const ct = text.charAt(idx + 1);
                    if (ct !== "<") {
                      this.mxpState.lineType = 0 /* Open */;
                      this.mxpState.on = false;
                    }
                    this.mxpState.locked = false;
                    this.ClearMXPOpen();
                    break;
                  case 5:
                    this.iMXPDefaultMode = 0 /* Open */;
                    this.mxpState.locked = true;
                    this.mxpState.lineType = 5 /* LockOpen */;
                    this.ClearMXPOpen();
                    break;
                  case 6:
                    this.iMXPDefaultMode = 1 /* Secure */;
                    this.mxpState.lineType = 6 /* LockSecure */;
                    this.mxpState.locked = true;
                    this.ClearMXPOpen();
                    break;
                  case 7:
                    this.iMXPDefaultMode = 2 /* Locked */;
                    this.mxpState.lineType = 7 /* LockLocked */;
                    this.mxpState.locked = true;
                    this.ClearMXPOpen();
                    break;
                  default:
                    if (iTmp < 0 || iTmp > 99)
                      this.ClearMXPOpen();
                    else {
                      this.mxpState.lineType = iTmp;
                      this.mxpState.locked = false;
                      if (this.mxpLines[this.mxpState.lineType] && this.mxpLines[this.mxpState.lineType].enabled) {
                        iTmp = "";
                        if (this.mxpLines[this.mxpState.lineType].element.length > 0)
                          iTmp += "<" + this.mxpLines[this.mxpState.lineType].element + ">";
                        if (this.mxpLines[this.mxpState.lineType].definition.length > 0)
                          iTmp += this.mxpLines[this.mxpState.lineType].definition;
                        if (iTmp.length > 0) {
                          text = text.splice(idx + 1, iTmp);
                          tl = text.length;
                        }
                      }
                    }
                    break;
                }
                this._SplitBuffer = "";
                _AnsiParams = null;
                state = 0 /* None */;
              } else if (c === "J") {
                this.ClearMXPOpen();
                if (_AnsiParams.length > 0) {
                  if (+_AnsiParams === 2) {
                    lineLength = 0;
                    iTmp = this.window.height;
                    formatBuilder.push(...this.getMXPCloseFormatBlocks());
                    this.AddLine(stringBuilder.join(""), rawBuilder.join(""), false, false, formatBuilder, remote);
                    stringBuilder = [];
                    rawBuilder = [];
                    formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength), ...this.getMXPCloseFormatBlocks()];
                    for (let j = 0; j < iTmp; j++) {
                      this.AddLine("", "\n", false, false, formatBuilder, remote);
                      this.MXPCapture("\n");
                    }
                    this.textLength += iTmp;
                    this.mxpState.noBreak = false;
                  }
                }
                formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                this._SplitBuffer = "";
                _AnsiParams = null;
                state = 0 /* None */;
              } else if (c === "m") {
                this.ProcessAnsiColorParams(_AnsiParams.split(";"));
                formatBuilder.push(format = this.getFormatBlock(lineLength));
                this._SplitBuffer = "";
                _AnsiParams = null;
                state = 0 /* None */;
              } else if (c === "\n" || c === "\x1B") {
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                state = 0 /* None */;
                this._SplitBuffer = "";
                if (this.mxpState.on && c === "\n")
                  this.ClearMXPOpen();
              } else {
                this._SplitBuffer += c;
                _AnsiParams += c;
              }
              break;
            case 3 /* XTermTitle */:
              if (i === 7) {
                this._SplitBuffer = "";
                this.emit("set-title", _TermTitle, _TermTitleType == null ? 0 : _TermTitleType);
                _TermTitle = "";
                _TermTitleType = null;
                state = 0 /* None */;
              } else if (c === ";" && _TermTitleType == null) {
                _TermTitleType = +_TermTitle;
                if (isNaN(_TermTitleType))
                  _TermTitleType = 0;
                _TermTitle = "";
                this._SplitBuffer += c;
              } else if (c === "\x1B") {
                if (this._SplitBuffer.charAt(this._SplitBuffer.length - 1) === "\n")
                  this._SplitBuffer = "";
              } else {
                this._SplitBuffer += c;
                _TermTitle += c;
              }
              break;
            case 1 /* Ansi */:
              if (c === "[") {
                this._SplitBuffer += c;
                _AnsiParams = "";
                state = 2 /* AnsiParams */;
              } else if (c === "]") {
                this._SplitBuffer += c;
                _TermTitle = "";
                state = 3 /* XTermTitle */;
              } else if (c === "D" || //Index ( down one line, scroll if at bottom )
              c === "E" || //Next line ( move to column 1 of next line, scroll up if at bottom )
              c === "M" || //Reverse index	( up one line, scroll down if at top )
              c === "1" || //Graphic proc. option ON
              c === "2" || //Graphic proc. option OFF
              c === "7" || //Save cursor & attributes
              c === "8" || //Restore cursor & attributes
              c === ">" || //Keypad mode		Numeric
              c === "=" || //Keypad mode		Application
              /*
              *LINE SIZE COMMANDS
              *<ESC>#3 Change current line to double-height top half
              *<ESC>#4 Change current line to double-height bottom half
              *<ESC>#5 Change current line to single-width single-height (normal)
              *<ESC>#6 Change current line to double-width single-height
              */
              c === "#") {
                if (d) {
                  stringBuilder.push("\u241B");
                  if (i < 16) {
                    stringBuilder.push(String.fromCharCode(parseInt("240" + i.toString(16), 16)));
                    this.MXPCapture("&#x241B&#x240" + i.toString(16) + ";");
                  } else {
                    stringBuilder.push(String.fromCharCode(parseInt("24" + i.toString(16), 16)));
                    this.MXPCapture("&#x241B&#x24" + i.toString(16) + ";");
                  }
                  lineLength += 2;
                  this.textLength += 2;
                  this.mxpState.noBreak = false;
                }
                state = 0 /* None */;
                this._SplitBuffer = "";
              }
              break;
            case 4 /* MXPTag */:
              if (_MXPTag === "!--") {
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                pState = 0 /* None */;
                state = 8 /* MXPComment */;
                _MXPComment = "<!--";
                _MXPTag = "";
                _MXPArgs = [];
              } else if (_MXPTag.endsWith("<!--")) {
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                pState = state;
                state = 8 /* MXPComment */;
                _MXPComment = "<!--";
                _MXPTag = _MXPTag.substring(0, _MXPTag.length - 4);
                _MXPArgs = [];
              } else if (c === '"') {
                state = 6 /* MXPTagDblQuoted */;
                _MXPArgs[_MXPArgs.length - 1] += c;
                this._SplitBuffer += c;
              } else if (c === "'") {
                state = 5 /* MXPTagQuoted */;
                _MXPArgs[_MXPArgs.length - 1] += c;
                this._SplitBuffer += c;
              } else if (c === "&") {
                _MXPEntity = "";
                pState = state;
                state = 7 /* MXPEntity */;
                this._SplitBuffer = "";
              } else if (c === "\n" || c === "\x1B") {
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                state = 0 /* None */;
                this._SplitBuffer = "";
                if (this.mxpState.on && c === "\n")
                  this.ClearMXPOpen();
              } else if (c === " ") {
                state = 9 /* MXPTagArg */;
                _MXPArgs.push("");
                this._SplitBuffer += c;
              } else if (c === ">") {
                _MXPOTag = _MXPTag;
                _MXPTag = _MXPTag.toUpperCase();
                if (_MXPTag === "HR" && (this.mxpState.lineType === 1 /* Secure */ || this.mxpState.lineType === 6 /* LockSecure */ || this.mxpState.lineType === 4 /* TempSecure */)) {
                  if (lineLength > 0) {
                    lineLength = 0;
                    this.MXPCapture("\n");
                    formatBuilder.push(...this.getMXPCloseFormatBlocks());
                    this.AddLine(stringBuilder.join(""), rawBuilder.join(""), false, false, formatBuilder, remote);
                    stringBuilder = [];
                    rawBuilder = [];
                    formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                  }
                  _MXPTag = this.getMXPBlock(_MXPTag, [], remote);
                  if (_MXPTag && _MXPTag.format) {
                    _MXPTag.format.offset = lineLength;
                    formatBuilder.push(_MXPTag.format);
                    formatBuilder[0].hr = _MXPTag.format.hr;
                  }
                  formatBuilder.push(...this.getMXPCloseFormatBlocks());
                  this.AddLine(stringBuilder.join(""), rawBuilder.join(""), false, false, formatBuilder, remote);
                  this.textLength++;
                  stringBuilder = [];
                  rawBuilder = [];
                  formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                } else if (_MXPTag === "BR" && (this.mxpState.lineType === 1 /* Secure */ || this.mxpState.lineType === 6 /* LockSecure */ || this.mxpState.lineType === 4 /* TempSecure */)) {
                  this.MXPCapture("\n");
                  formatBuilder.push(...this.getMXPCloseFormatBlocks());
                  this.AddLine(stringBuilder.join(""), rawBuilder.join(""), false, false, formatBuilder, remote);
                  skip = false;
                  lineLength = 0;
                  stringBuilder = [];
                  rawBuilder = [];
                  formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                  this.textLength++;
                } else if (_MXPTag === "IMAGE" && (this.mxpState.lineType === 1 /* Secure */ || this.mxpState.lineType === 6 /* LockSecure */ || this.mxpState.lineType === 4 /* TempSecure */)) {
                  _MXPTag = this.getMXPBlock(_MXPTag, _MXPArgs, remote);
                  if (_MXPTag && _MXPTag.format !== null) {
                    formatBuilder.push(_MXPTag.format);
                    lineLength += _MXPTag.length;
                    this.textLength += _MXPTag.length;
                  }
                  formatBuilder.push(format = this.getFormatBlock(lineLength));
                } else {
                  _MXPTag = this.getMXPBlock(_MXPTag, [], remote, _MXPOTag, formatBuilder);
                  if (this.mxpState.expanded) {
                    if (_MXPTag && _MXPTag.text !== null) text = text.splice(idx + 1, _MXPTag.text);
                    tl = text.length;
                    this.mxpState.expanded = false;
                    state = 0 /* None */;
                    _MXPTag = "";
                    this._SplitBuffer = "";
                    continue;
                  }
                  if (_MXPTag) {
                    if (_MXPTag.format) {
                      _MXPTag.format.offset = lineLength;
                      formatBuilder.push(_MXPTag.format);
                    }
                    formatBuilder.push(format = this.getFormatBlock(lineLength));
                    if (_MXPTag.text !== null && _MXPTag.text.length > 0) {
                      stringBuilder.push(_MXPTag.text);
                      lineLength += _MXPTag.text.length;
                      this.textLength += _MXPTag.text.length;
                    }
                  } else
                    formatBuilder.push(format = this.getFormatBlock(lineLength));
                }
                state = 0 /* None */;
                this._SplitBuffer = "";
              } else if (c === "<") {
                if (this.enableDebug)
                  this.emit("debug", "Malformed MXP Tag: " + _MXPTag);
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                stringBuilder.push("<" + _MXPTag);
                lineLength += _MXPTag.length + 1;
                this.textLength += _MXPTag.length + 1;
                state = 0 /* None */;
                this._SplitBuffer = "";
              } else {
                this._SplitBuffer += c;
                _MXPTag += c;
              }
              break;
            case 5 /* MXPTagQuoted */:
              if (c === "'") {
                state = 9 /* MXPTagArg */;
                this._SplitBuffer += c;
                _MXPArgs[_MXPArgs.length - 1] += c;
              } else {
                this._SplitBuffer += c;
                _MXPArgs[_MXPArgs.length - 1] += c;
              }
              break;
            case 6 /* MXPTagDblQuoted */:
              if (c === '"') {
                state = 9 /* MXPTagArg */;
                this._SplitBuffer += c;
                _MXPArgs[_MXPArgs.length - 1] += c;
              } else {
                this._SplitBuffer += c;
                _MXPArgs[_MXPArgs.length - 1] += c;
              }
              break;
            case 9 /* MXPTagArg */:
              if (c === "'") {
                state = 5 /* MXPTagQuoted */;
                _MXPArgs[_MXPArgs.length - 1] += c;
                this._SplitBuffer += c;
              } else if (c === '"') {
                state = 6 /* MXPTagDblQuoted */;
                _MXPArgs[_MXPArgs.length - 1] += c;
                this._SplitBuffer += c;
              } else if (c === "\n" || c === "\x1B") {
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                state = 0 /* None */;
                this._SplitBuffer = "";
                if (this.mxpState.on && c === "\n")
                  this.ClearMXPOpen();
              } else if (c === " ") {
                state = 9 /* MXPTagArg */;
                _MXPArgs.push("");
                this._SplitBuffer += c;
              } else if (c === ">") {
                if (_MXPTag.toUpperCase() === "IMAGE" && (this.mxpState.lineType === 1 /* Secure */ || this.mxpState.lineType === 6 /* LockSecure */ || this.mxpState.lineType === 4 /* TempSecure */)) {
                  _MXPTag = this.getMXPBlock(_MXPTag, _MXPArgs, remote, _MXPTag);
                  if (_MXPTag !== null && _MXPTag.format !== null) {
                    _MXPTag.format.offset = lineLength;
                    formatBuilder.push(_MXPTag.format);
                  }
                  formatBuilder.push(format = this.getFormatBlock(lineLength));
                } else {
                  _MXPTag = this.getMXPBlock(_MXPTag, _MXPArgs, remote, _MXPTag, formatBuilder);
                  if (this.mxpState.expanded) {
                    if (_MXPTag !== null) text = text.splice(idx + 1, _MXPTag.text);
                    tl = text.length;
                    this.mxpState.expanded = false;
                    state = 0 /* None */;
                    this._SplitBuffer = "";
                    continue;
                  }
                  if (_MXPTag !== null) {
                    if (_MXPTag !== null && _MXPTag.format) {
                      _MXPTag.format.offset = lineLength;
                      formatBuilder.push(_MXPTag.format);
                    }
                    formatBuilder.push(format = this.getFormatBlock(lineLength));
                    if (_MXPTag.text !== null) {
                      stringBuilder.push(_MXPTag.text);
                      lineLength += _MXPTag.text.length;
                      this.textLength += _MXPTag.text.length;
                    }
                  } else
                    formatBuilder.push(format = this.getFormatBlock(lineLength));
                }
                state = 0 /* None */;
                this._SplitBuffer = "";
              } else {
                this._SplitBuffer += c;
                _MXPArgs[_MXPArgs.length - 1] += c;
              }
              break;
            case 7 /* MXPEntity */:
              if (c === "\n" || c === "\x1B") {
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                if (this.enableDebug) this.emit("debug", "MXP Entity: " + _MXPEntity);
                if (pState === 4 /* MXPTag */) {
                  _MXPTag += "&" + _MXPEntity;
                  state = pState;
                } else {
                  _MXPEntity = this.GetEntity(_MXPEntity);
                  if (this.mxpState.expanded) {
                    if (_MXPTag !== null)
                      text = text.splice(idx + 1, _MXPEntity);
                    tl = text.length;
                    this.mxpState.expanded = false;
                    state = 0 /* None */;
                    this._SplitBuffer = "";
                    continue;
                  }
                  _MXPOTag = htmlDecode("&" + _MXPEntity);
                  stringBuilder.push(_MXPOTag);
                  this.MXPCapture("&" + _MXPEntity);
                  lineLength += _MXPOTag.length;
                  this.textLength += _MXPOTag.length;
                  this.mxpState.noBreak = false;
                  state = 0 /* None */;
                  this._SplitBuffer = "";
                  format.unicode = true;
                }
                if (this.mxpState.on && c === "\n")
                  this.ClearMXPOpen();
              } else if (c === ";") {
                if (this.enableDebug) this.emit("debug", "MXP Entity: " + _MXPEntity);
                if (pState !== 4 /* MXPTag */) {
                  _MXPEntity = this.GetEntity(_MXPEntity);
                  if (this.mxpState.expanded) {
                    text = text.splice(idx + 1, _MXPEntity);
                    tl = text.length;
                    this.mxpState.expanded = false;
                    state = pState;
                    this._SplitBuffer = "";
                    continue;
                  }
                  _MXPOTag = htmlDecode("&" + _MXPEntity + ";");
                  stringBuilder.push(_MXPOTag);
                  this.MXPCapture("&");
                  this.MXPCapture(_MXPEntity);
                  this.MXPCapture(";");
                  lineLength += _MXPOTag.length;
                  this.textLength += _MXPOTag.length;
                  this.mxpState.noBreak = false;
                  this._SplitBuffer = "";
                } else
                  _MXPTag += "&" + _MXPEntity + ";";
                format.unicode = true;
                state = pState;
              } else if (c === "&") {
                if (this.enableDebug) this.emit("debug", "Malformed MXP Entity: " + _MXPEntity);
                if (pState !== 4 /* MXPTag */) {
                  stringBuilder.push("&" + _MXPEntity);
                  this.MXPCapture("&");
                  this.MXPCapture(_MXPEntity);
                  lineLength += _MXPEntity.length + 1;
                  this.textLength += _MXPEntity.length + 1;
                  this.mxpState.noBreak = false;
                  this._SplitBuffer = "";
                  idx--;
                  rawBuilder.pop();
                  this.rawLength--;
                } else
                  _MXPTag += "&" + _MXPEntity;
                format.unicode = true;
                state = pState;
              } else {
                this._SplitBuffer += c;
                _MXPEntity += c;
              }
              break;
            case 8 /* MXPComment */:
              if (_MXPComment.endsWith("-->")) {
                if (this.enableDebug) this.emit("debug", "MXP Comment: " + _MXPComment);
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                state = pState;
                if (state === 0 /* None */)
                  this._SplitBuffer = "";
                _MXPComment = "";
              } else if (c === "\n" || c === "\x1B") {
                if (this.enableDebug) this.emit("debug", "MXP Comment: " + _MXPComment);
                idx--;
                rawBuilder.pop();
                this.rawLength--;
                state = pState;
                _MXPComment = "";
                if (this.mxpState.on && c === "\n")
                  this.ClearMXPOpen();
              } else
                _MXPComment += c;
              break;
            case 10 /* URL */:
              if (idx > lnk + 2) {
                stringBuilder.pop();
                stringBuilder.pop();
                rawBuilder.pop();
                rawBuilder.pop();
                this.rawLength -= 2;
                lineLength -= 2;
                this.textLength -= 2;
                this.MXPDeCapture(2);
                idx = lnk;
                state = 0 /* None */;
              } else if (c === "/") {
                stringBuilder.push(c);
                this.MXPCapture(c);
                lineLength++;
                this.textLength++;
                if (idx === lnk + 2) {
                  state = 11 /* URLFound */;
                  lnk = stringBuilder.length - 4;
                  lLnk = stringBuilder.length - 1;
                  fLnk = formatBuilder.length;
                  lnkOffset -= 2;
                  while (lnk > 0 && CharAllowedInURL(stringBuilder[lnk], true)) {
                    lnk--;
                    lnkOffset--;
                  }
                  if (!CharAllowedInURL(stringBuilder[lnk], true)) {
                    lnk++;
                    lnkOffset++;
                  }
                  lNest = [];
                  if (lnk > 0 && stringBuilder[lnk - 1] === "(")
                    lNest.push(")");
                  if (lnk > 0 && stringBuilder[lnk - 1] === "[")
                    lNest.push("]");
                }
              } else if (idx > lnk + 1) {
                stringBuilder.pop();
                rawBuilder.pop();
                this.rawLength--;
                lineLength--;
                this.textLength--;
                this.MXPDeCapture(1);
                idx = lnk;
                state = 0 /* None */;
              } else {
                idx = lnk;
                state = 0 /* None */;
                rawBuilder.pop();
                this.rawLength--;
              }
              break;
            case 11 /* URLFound */:
              if (!CharAllowedInURL(c, false)) {
                if (lLnk !== stringBuilder.length - 1) {
                  _MXPComment += stringBuilder.slice(lnk).join("");
                  if (this.enableDebug) this.emit("debug", "URL Found: " + _MXPComment);
                  formatBuilder.splice(
                    fLnk,
                    0,
                    {
                      formatType: 1 /* Link */,
                      offset: lnkOffset,
                      href: _MXPComment
                    }
                  );
                  formatBuilder.push({
                    formatType: 2 /* LinkEnd */,
                    offset: lineLength,
                    href: _MXPComment
                  });
                  formatBuilder.push(format = this.getFormatBlock(lineLength));
                }
                state = 0 /* None */;
                idx--;
                rawBuilder.pop();
                this.rawLength--;
              } else {
                if (lNest.length > 1 && lNest[lNest.length - 1] === c) {
                  lNest.pop();
                  stringBuilder.push(c);
                  this.MXPCapture(c);
                  lineLength++;
                  this.textLength++;
                  if (i > 255)
                    format.unicode = true;
                } else if (lNest.length > 0 && c === "(") {
                  lNest.push(")");
                  stringBuilder.push(c);
                  this.MXPCapture(c);
                  lineLength++;
                  this.textLength++;
                  if (i > 255)
                    format.unicode = true;
                } else if (lNest.length > 0 && c === "[") {
                  lNest.push("]");
                  stringBuilder.push(c);
                  this.MXPCapture(c);
                  lineLength++;
                  this.textLength++;
                  if (i > 255)
                    format.unicode = true;
                } else if (lNest.length === 1 && lNest[lNest.length - 1] === c) {
                  if (lLnk !== stringBuilder.length - 1) {
                    _MXPComment += stringBuilder.slice(lnk).join("");
                    if (this.enableDebug) this.emit("debug", "URL Found: " + _MXPComment);
                    formatBuilder.splice(
                      fLnk,
                      0,
                      {
                        formatType: 1 /* Link */,
                        href: _MXPComment,
                        offset: lnkOffset
                      }
                    );
                    formatBuilder.push({
                      formatType: 2 /* LinkEnd */,
                      href: _MXPComment,
                      offset: lineLength
                    });
                    formatBuilder.push(format = this.getFormatBlock(lineLength));
                  }
                  state = 0 /* None */;
                  idx--;
                  rawBuilder.pop();
                  this.rawLength--;
                } else {
                  if (i > 255)
                    format.unicode = true;
                  stringBuilder.push(c);
                  this.MXPCapture(c);
                  lineLength++;
                  this.textLength++;
                }
              }
              break;
            case 12 /* MSPSound */:
              if (c === ")") {
                lnk = this.mxpState.lineType;
                this.mxpState.lineType = 4 /* TempSecure */;
                this.getMXPBlock("SOUND", _MXPArgs, remote);
                this.mxpState.lineType = lnk;
                state = 0 /* None */;
                if (idx + 1 < tl && text.charAt(idx + 1) === "\n") {
                  idx++;
                  skip = false;
                  stringBuilder = [];
                  formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                  this.mxpState.noBreak = false;
                  lineLength = 0;
                } else if (idx + 2 < tl && text[idx + 1] === "\r" && text[idx + 2] === "\n") {
                  idx += 2;
                  skip = false;
                  stringBuilder = [];
                  formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                  this.mxpState.noBreak = false;
                  lineLength = 0;
                }
              } else if (c === " ")
                _MXPArgs.push("");
              else
                _MXPArgs[_MXPArgs.length - 1] += c;
              break;
            case 13 /* MSPMusic */:
              if (c === ")") {
                lnk = this.mxpState.lineType;
                this.mxpState.lineType = 4 /* TempSecure */;
                this.getMXPBlock("MUSIC", _MXPArgs, remote);
                this.mxpState.lineType = lnk;
                state = 0 /* None */;
                if (idx + 1 < tl && text.charAt(idx + 1) === "\n") {
                  idx++;
                  skip = false;
                  stringBuilder = [];
                  formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                  this.mxpState.noBreak = false;
                  lineLength = 0;
                } else if (idx + 2 < tl && text[idx + 1] === "\r" && text[idx + 2] === "\n") {
                  idx += 2;
                  skip = false;
                  stringBuilder = [];
                  formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                  this.mxpState.noBreak = false;
                  lineLength = 0;
                }
              } else if (c === " ")
                _MXPArgs.push("");
              else
                _MXPArgs[_MXPArgs.length - 1] += c;
              break;
            default:
              if (e && i === 7) {
                if (f) {
                  c = "\u2407";
                  stringBuilder.push(c);
                  this.MXPCapture(c);
                  lineLength++;
                  this.textLength++;
                  this.mxpState.noBreak = false;
                } else if (d) {
                  stringBuilder.push(c);
                  this.MXPCapture("&#x2407;");
                  lineLength++;
                  this.textLength++;
                  this.mxpState.noBreak = false;
                }
                this.emit("bell");
              } else if (e && c === "\b") {
                skip = false;
                if (lineLength > 0) {
                  if (stringBuilder.length) {
                    while (stringBuilder[stringBuilder.length - 1].length === 0)
                      stringBuilder.pop();
                    if (stringBuilder[stringBuilder.length - 1].length === 1)
                      stringBuilder.pop();
                    else
                      stringBuilder[stringBuilder.length - 1] = stringBuilder[stringBuilder.length - 1].substring(0, stringBuilder[stringBuilder.length - 1].length - 1);
                  }
                  if (format.offset === lineLength)
                    format.offset--;
                  lineLength--;
                  this.textLength--;
                }
                if (d) {
                  c = "\u25D8";
                  stringBuilder.push(c);
                  this.MXPCapture(c);
                  lineLength++;
                  this.textLength++;
                }
                this.mxpState.noBreak = false;
              } else if (e && c === "	") {
                const _Tab = tabWidth - lineLength % tabWidth;
                if (_Tab > 0) {
                  stringBuilder.push(Array(_Tab + 1).join(" "));
                  this.MXPCapture(Array(_Tab + 1).join(" "));
                  lineLength += _Tab;
                  this.textLength += _Tab;
                  this.mxpState.noBreak = false;
                }
              } else if (c === "\n") {
                if (this.mxpState.noBreak || this.mxpState.paragraph) continue;
                if (!this.mxpState.locked) {
                  if (this.mxpState.lineType !== 0 /* Open */)
                    this.emit("MXP-tag-end", this.mxpState.lineType, stringBuilder.join(""), formatBuilder);
                  if (!this.mxpState.lineExpanded && this.mxpLines[this.mxpState.lineType] && this.mxpLines[this.mxpState.lineType].enabled) {
                    iTmp = "";
                    if (this.mxpLines[this.mxpState.lineType].element.length > 0)
                      iTmp += "</" + this.mxpLines[this.mxpState.lineType].element + ">";
                    if (this.mxpLines[this.mxpState.lineType].closeDefinition.length > 0)
                      iTmp += this.mxpLines[this.mxpState.lineType].closeDefinition;
                    if (iTmp.length > 0) {
                      text = text.splice(idx, iTmp);
                      tl = text.length;
                      idx--;
                      rawBuilder.pop();
                      this.rawLength--;
                      this.mxpState.lineExpanded = true;
                      continue;
                    }
                  }
                  this.mxpState.lineExpanded = false;
                  formatBuilder.push(...this.getMXPCloseFormatBlocks());
                  if (this.mxpState.on)
                    this.ClearMXPOpen();
                  this.mxpState.on = false;
                  if (this.mxpLines[this.mxpState.lineType] && this.mxpLines[this.mxpState.lineType].enabled && this.mxpLines[this.mxpState.lineType].gag)
                    skip = true;
                  this.mxpState.lineType = this.iMXPDefaultMode;
                  if (this.mxpState.lineType !== 2 && !this.enableMXP)
                    this.ResetMXP();
                } else {
                  formatBuilder.push(...this.getMXPCloseFormatBlocks());
                  if (this.mxpState.on)
                    this.ClearMXPOpen();
                }
                lineLength = 0;
                if (!skip)
                  this.MXPCapture("\n");
                this.AddLine(stringBuilder.join(""), rawBuilder.join(""), false, skip, formatBuilder, remote);
                skip = false;
                stringBuilder = [];
                rawBuilder = [];
                formatBuilder = [...this.getMXPOpenFormatBlocks(), format = this.getFormatBlock(lineLength)];
                this.textLength++;
                this.mxpState.noBreak = false;
              } else if (e && c === "\r") {
                continue;
              } else if (e && c === "\x1B") {
                this._SplitBuffer += c;
                state = 1 /* Ansi */;
              } else if (i < 32 || i === 127) {
                if (f) {
                  if (i === 1)
                    c = "\u263A";
                  else if (i === 2)
                    c = "\u263B";
                  else if (i === 3)
                    c = "\u2665";
                  else if (i === 4)
                    c = "\u2666";
                  else if (i === 5)
                    c = "\u2663";
                  else if (i === 6)
                    c = "\u2660";
                  else if (i === 7)
                    c = "\u2407";
                  else if (i === 8)
                    c = "\u25D8";
                  else if (i === 9)
                    c = "\u25CB";
                  else if (i === 10)
                    c = "\u25D9";
                  else if (i === 11)
                    c = "\u2642";
                  else if (i === 12)
                    c = "\u2640";
                  else if (i === 13)
                    c = "\u266A";
                  else if (i === 14)
                    c = "\u266B";
                  else if (i === 15)
                    c = "\u263C";
                  else if (i === 16)
                    c = "\u25BA";
                  else if (i === 17)
                    c = "\u25C4";
                  else if (i === 18)
                    c = "\u2195";
                  else if (i === 19)
                    c = "\u203C";
                  else if (i === 20)
                    c = "\xB6";
                  else if (i === 21)
                    c = "\xA7";
                  else if (i === 22)
                    c = "\u25AC";
                  else if (i === 23)
                    c = "\u21A8";
                  else if (i === 24)
                    c = "\u2191";
                  else if (i === 25)
                    c = "\u2193";
                  else if (i === 26)
                    c = "\u2192";
                  else if (i === 27)
                    c = "\u2190";
                  else if (i === 28)
                    c = "\u221F";
                  else if (i === 29)
                    c = "\u2194";
                  else if (i === 30)
                    c = "\u25B2";
                  else if (i === 31)
                    c = "\u25BC";
                  else if (i === 127)
                    c = "\u2302";
                  stringBuilder.push(c);
                  this.MXPCapture(c);
                  lineLength++;
                  this.textLength++;
                  this.mxpState.noBreak = false;
                } else if (d) {
                  i = 9216 + i;
                  stringBuilder.push(String.fromCharCode(i));
                  this.MXPCapture("&#");
                  this.MXPCapture(i.toString());
                  this.MXPCapture(";");
                  lineLength++;
                  this.textLength++;
                  this.mxpState.noBreak = false;
                } else
                  continue;
              } else if (c === " " || this._CurrentAttributes > 0 && (this._CurrentAttributes & 128 /* Hidden */) === 128 /* Hidden */) {
                stringBuilder.push(" ");
                this.MXPCapture(" ");
                lineLength++;
                this.textLength++;
                this.mxpState.noBreak = false;
              } else if (c === "<" && idx >= mOffset) {
                if (this.enableMXP && this.mxpState.on) {
                  _MXPTag = "";
                  _MXPArgs = [];
                  this._SplitBuffer += c;
                  state = 4 /* MXPTag */;
                } else {
                  stringBuilder.push("<");
                  this.MXPCapture("&lt;");
                  lineLength++;
                  this.textLength++;
                }
              } else if (c === ">") {
                stringBuilder.push(">");
                this.MXPCapture("&gt;");
                lineLength++;
                this.textLength++;
                this.mxpState.noBreak = false;
              } else if (c === "&" && idx >= mOffset) {
                if (this.enableMXP && this.mxpState.on) {
                  _MXPEntity = "";
                  this._SplitBuffer += c;
                  pState = state;
                  state = 7 /* MXPEntity */;
                } else {
                  stringBuilder.push(c);
                  lineLength++;
                  this.textLength++;
                  this.mxpState.noBreak = false;
                }
              } else if (c === '"') {
                stringBuilder.push(c);
                this.MXPCapture("&quot;");
                lineLength++;
                this.textLength++;
                this.mxpState.noBreak = false;
              } else if (c === "'") {
                stringBuilder.push(c);
                this.MXPCapture("&apos;");
                lineLength++;
                this.textLength++;
                this.mxpState.noBreak = false;
              } else if (c === ":") {
                stringBuilder.push(c);
                this.MXPCapture(c);
                lineLength++;
                this.textLength++;
                this.mxpState.noBreak = false;
                if (u) {
                  _MXPComment = "";
                  let psk;
                  let pFnd = false;
                  for (p = 0; p < pl; p++) {
                    if (idx - this.protocols[p].length < 0)
                      continue;
                    psk = false;
                    const nl = this.protocols[p].length;
                    for (let n = 0; n < nl; n++) {
                      if (text[idx - (nl - n)] !== this.protocols[p][n]) {
                        psk = true;
                        break;
                      }
                    }
                    if (psk)
                      continue;
                    lnk = stringBuilder.length;
                    lnkOffset = lineLength;
                    fLnk = formatBuilder.length;
                    if (lnk > 1 + nl && stringBuilder[lnk - (2 + nl)].length === 1 && /\S/.test(stringBuilder[lnk - (2 + nl)]) && stringBuilder[lnk - (2 + nl)] !== "(" && stringBuilder[lnk - (2 + nl)] !== "[")
                      continue;
                    lNest = [];
                    lnk = stringBuilder.length - (1 + nl);
                    lnkOffset -= 1 + nl;
                    lLnk = stringBuilder.length - 1;
                    if (lnk > 0 && stringBuilder[lnk - 1] === "(")
                      lNest.push(")");
                    if (lnk > 0 && stringBuilder[lnk - 1] === "[")
                      lNest.push("]");
                    state = 11 /* URLFound */;
                    pFnd = true;
                    if (pFnd)
                      break;
                  }
                  if (!pFnd) {
                    state = 10 /* URL */;
                    lnk = idx;
                    lnkOffset = lineLength;
                  }
                }
              } else if (c === ".") {
                stringBuilder.push(c);
                this.MXPCapture(c);
                lineLength++;
                this.textLength++;
                this.mxpState.noBreak = false;
                if (u && idx - 3 >= 0) {
                  _MXPComment = "http://";
                  if ((text[idx - 1] === "w" || idx[lnk - 1] === "W") && (text[idx - 2] === "w" || idx[lnk - 2] === "W") && (text[idx - 3] === "w" || idx[lnk - 3] === "W")) {
                    lnk = stringBuilder.length;
                    lnkOffset = lineLength;
                    fLnk = formatBuilder.length;
                    if (lnk > 4 && stringBuilder[lnk - 5].length === 1 && /\S/.test(stringBuilder[lnk - 5]) && stringBuilder[lnk - 5] !== "(" && stringBuilder[lnk - 5] !== "[")
                      continue;
                    lNest = [];
                    lnk = stringBuilder.length - 4;
                    lnkOffset -= 4;
                    lLnk = stringBuilder.length - 1;
                    if (lnk > 0 && stringBuilder[lnk - 1] === "(")
                      lNest.push(")");
                    if (lnk > 0 && stringBuilder[lnk - 1] === "[")
                      lNest.push("]");
                    state = 11 /* URLFound */;
                  }
                }
              } else if (s && lineLength === 0 && text.substring(idx, idx + 8) === "!!MUSIC(") {
                _MXPArgs = [""];
                state = 13 /* MSPMusic */;
                idx += 7;
                this.mxpState.noBreak = false;
              } else if (s && lineLength === 0 && text.substring(idx, idx + 8) === "!!SOUND(") {
                _MXPArgs = [""];
                state = 12 /* MSPSound */;
                idx += 7;
                this.mxpState.noBreak = false;
              } else {
                if (f && i > 127 && i < 255) {
                  if (i === 128)
                    c = "\xC7";
                  else if (i === 129)
                    c = "\xFC";
                  else if (i === 130)
                    c = "\xE9";
                  else if (i === 131)
                    c = "\xE2";
                  else if (i === 132)
                    c = "\xE4";
                  else if (i === 133)
                    c = "\xE0";
                  else if (i === 134)
                    c = "\xE5";
                  else if (i === 135)
                    c = "\xE7";
                  else if (i === 136)
                    c = "\xEA";
                  else if (i === 137)
                    c = "\xEB";
                  else if (i === 138)
                    c = "\xE8";
                  else if (i === 139)
                    c = "\xEF";
                  else if (i === 140)
                    c = "\xEE";
                  else if (i === 141)
                    c = "\xEC";
                  else if (i === 142)
                    c = "\xC4";
                  else if (i === 143)
                    c = "\xC5";
                  else if (i === 144)
                    c = "\xC9";
                  else if (i === 145)
                    c = "\xE6";
                  else if (i === 146)
                    c = "\xC6";
                  else if (i === 147)
                    c = "\xF4";
                  else if (i === 148)
                    c = "\xF6";
                  else if (i === 149)
                    c = "\xF2";
                  else if (i === 150)
                    c = "\xFB";
                  else if (i === 151)
                    c = "\xF9";
                  else if (i === 152)
                    c = "\xFF";
                  else if (i === 153)
                    c = "\xD6";
                  else if (i === 154)
                    c = "\xDC";
                  else if (i === 155)
                    c = "\xA2";
                  else if (i === 156)
                    c = "\xA3";
                  else if (i === 157)
                    c = "\xA5";
                  else if (i === 158)
                    c = "\u20A7";
                  else if (i === 159)
                    c = "\u0192";
                  else if (i === 160)
                    c = "\xE1";
                  else if (i === 161)
                    c = "\xED";
                  else if (i === 162)
                    c = "\xF3";
                  else if (i === 163)
                    c = "\xFA";
                  else if (i === 164)
                    c = "\xF1";
                  else if (i === 165)
                    c = "\xD1";
                  else if (i === 166)
                    c = "\xAA";
                  else if (i === 167)
                    c = "\xBA";
                  else if (i === 168)
                    c = "\xBF";
                  else if (i === 169)
                    c = "\u2310";
                  else if (i === 170)
                    c = "\xAC";
                  else if (i === 171)
                    c = "\xBD";
                  else if (i === 172)
                    c = "\xBC";
                  else if (i === 173)
                    c = "\xA1";
                  else if (i === 174)
                    c = "\xAB";
                  else if (i === 175)
                    c = "\xBB";
                  else if (i === 176)
                    c = "\u2591";
                  else if (i === 177)
                    c = "\u2592";
                  else if (i === 178)
                    c = "\u2593";
                  else if (i === 179)
                    c = "\u2502";
                  else if (i === 180)
                    c = "\u2524";
                  else if (i === 181)
                    c = "\u2561";
                  else if (i === 182)
                    c = "\u2562";
                  else if (i === 183)
                    c = "\u2556";
                  else if (i === 184)
                    c = "\u2555";
                  else if (i === 185)
                    c = "\u2563";
                  else if (i === 186)
                    c = "\u2551";
                  else if (i === 187)
                    c = "\u2557";
                  else if (i === 188)
                    c = "\u255D";
                  else if (i === 189)
                    c = "\u255C";
                  else if (i === 190)
                    c = "\u255B";
                  else if (i === 191)
                    c = "\u2510";
                  else if (i === 192)
                    c = "\u2514";
                  else if (i === 193)
                    c = "\u2534";
                  else if (i === 194)
                    c = "\u252C";
                  else if (i === 195)
                    c = "\u251C";
                  else if (i === 196)
                    c = "\u2500";
                  else if (i === 197)
                    c = "\u253C";
                  else if (i === 198)
                    c = "\u255E";
                  else if (i === 199)
                    c = "\u255F";
                  else if (i === 200)
                    c = "\u255A";
                  else if (i === 201)
                    c = "\u2554";
                  else if (i === 202)
                    c = "\u2569";
                  else if (i === 203)
                    c = "\u2566";
                  else if (i === 204)
                    c = "\u2560";
                  else if (i === 205)
                    c = "\u2550";
                  else if (i === 206)
                    c = "\u256C";
                  else if (i === 207)
                    c = "\u2567";
                  else if (i === 208)
                    c = "\u2568";
                  else if (i === 209)
                    c = "\u2564";
                  else if (i === 210)
                    c = "\u2565";
                  else if (i === 211)
                    c = "\u2559";
                  else if (i === 212)
                    c = "\u2558";
                  else if (i === 213)
                    c = "\u2552";
                  else if (i === 214)
                    c = "\u2553";
                  else if (i === 215)
                    c = "\u256B";
                  else if (i === 216)
                    c = "\u256A";
                  else if (i === 217)
                    c = "\u2518";
                  else if (i === 218)
                    c = "\u250C";
                  else if (i === 219)
                    c = "\u2588";
                  else if (i === 220)
                    c = "\u2584";
                  else if (i === 221)
                    c = "\u258C";
                  else if (i === 222)
                    c = "\u2590";
                  else if (i === 223)
                    c = "\u2580";
                  else if (i === 224)
                    c = "\u03B1";
                  else if (i === 225)
                    c = "\u03B2";
                  else if (i === 226)
                    c = "\u0393";
                  else if (i === 227)
                    c = "\u03C0";
                  else if (i === 228)
                    c = "\u03A3";
                  else if (i === 229)
                    c = "\u03C3";
                  else if (i === 230)
                    c = "\xB5";
                  else if (i === 231)
                    c = "\u03C4";
                  else if (i === 232)
                    c = "\u03A6";
                  else if (i === 233)
                    c = "\u0398";
                  else if (i === 234)
                    c = "\u03A9";
                  else if (i === 235)
                    c = "\u03B4";
                  else if (i === 236)
                    c = "\u221E";
                  else if (i === 237)
                    c = "\u2205";
                  else if (i === 238)
                    c = "\u2208";
                  else if (i === 239)
                    c = "\u2229";
                  else if (i === 240)
                    c = "\u2261";
                  else if (i === 241)
                    c = "\xB1";
                  else if (i === 242)
                    c = "\u2265";
                  else if (i === 243)
                    c = "\u2264";
                  else if (i === 244)
                    c = "\u2320";
                  else if (i === 245)
                    c = "\u2321";
                  else if (i === 246)
                    c = "\xF7";
                  else if (i === 247)
                    c = "\u2248";
                  else if (i === 248)
                    c = "\xB0";
                  else if (i === 249)
                    c = "\u2219";
                  else if (i === 250)
                    c = "\xB7";
                  else if (i === 251)
                    c = "\u221A";
                  else if (i === 252)
                    c = "\u207F";
                  else if (i === 253)
                    c = "\xB2";
                  else if (i === 254)
                    c = "\u25A0";
                } else if (i > 255)
                  format.unicode = true;
                stringBuilder.push(c);
                this.MXPCapture(c);
                lineLength++;
                this.textLength++;
                this.mxpState.noBreak = false;
              }
              break;
          }
        }
        if (this._SplitBuffer.length) {
          this.rawLength -= this._SplitBuffer.length;
          rawBuilder.splice(rawBuilder.length - this._SplitBuffer.length, this._SplitBuffer.length);
        }
        formatBuilder.push(...this.getMXPCloseFormatBlocks());
        if (state === 11 /* URLFound */) {
          formatBuilder.splice(
            fLnk,
            0,
            {
              formatType: 1 /* Link */,
              offset: lnkOffset,
              href: _MXPComment += stringBuilder.slice(lnk).join("")
            }
          );
        }
        this.AddLine(stringBuilder.join(""), rawBuilder.join(""), true, false, formatBuilder, remote);
      } catch (ex) {
        if (this.enableDebug) this.emit("debug", ex);
      }
      this.busy = false;
      this.emit("parse-done");
      this.parsing.shift();
      if (this.parsing.length > 0)
        setTimeout(this.parseNext(), 0);
    }
    parseNext() {
      const iTmp = this.parsing.shift();
      return () => {
        this.parse(iTmp[0], iTmp[1], true, iTmp[2]);
      };
    }
    updateWindow(width, height) {
      this.window = { width, height };
    }
    Clear() {
      this.ResetColors();
      this.textLength = 0;
      this._SplitBuffer = "";
    }
    ClearMXP() {
      this.mxpEntities = {};
      this.ResetMXP();
      this.mxpElements = {};
      this.mxpState = new MXPState();
    }
    ResetMXP() {
      this.mxpStyles = [];
      this.mxpStyles.push(new MXPStyle(0 /* None */, "", "", false));
    }
    ResetMXPLine() {
      this.iMXPDefaultMode = 0 /* Open */;
      this.mxpState.lineType = 0 /* Open */;
    }
    //public interface, as client can only access publicly marked entities
    GetPublicEntity(entity) {
      if (this.mxpEntities[entity] && this.mxpEntities[entity].publish)
        return this.mxpEntities[entity].value;
      return entity;
    }
  };

  // src/display.ts
  var Display = class extends EventEmitter {
    //#endregion
    constructor(container, options) {
      super();
      this._updating = 0 /* none */;
      this._enableDebug = false;
      this._maxView = 0;
      this._padding = [0, 0, 0, 0];
      this._enableColors = true;
      this._enableBackgroundColors = true;
      this._hideTrailingEmptyLine = true;
      this._maxLines = 500;
      this._wordWrap = false;
      this._indent = 4;
      this._indentPadding = 0;
      this._wrapAt = 0;
      this._scrollAtEnd = false;
      this._lineCache = [];
      this._expireCache = [];
      this._timestamp = 0 /* None */;
      this._timestampFormat = "[[]MM-DD HH:mm:ss.SSS[]] ";
      this._timestampWidth = (/* @__PURE__ */ new Date()).toISOString().length + 1;
      //#endregion
      //#region Public properties
      this.scrollLock = false;
      if (!container)
        throw new Error("Container must be a selector, element or jquery object");
      if (typeof container === "object" && "container" in container) {
        options = Object.assign(options || {}, container);
        container = options.container;
        delete options.container;
      }
      if (typeof container === "string") {
        this._container = document.querySelector(container);
        if (!this._container)
          throw new Error("Invalid selector for display.");
      } else if (container instanceof $)
        this._container = container[0];
      else if (container instanceof HTMLElement)
        this._container = container;
      else
        throw new Error("Container must be a selector, element or jquery object");
      this._styles = document.createElement("style");
      this._container.appendChild(this._styles);
      this._character = document.createElement("span");
      this._character.id = this.id + "-Character";
      this._character.className = "line";
      this._character.innerHTML = '<span style="border-bottom: 1px solid rgb(0, 0, 0);">W</span>';
      this._character.style.visibility = "hidden";
      this._container.appendChild(this._character);
      this._view = document.createElement("div");
      this._view.className = "view";
      this._view.addEventListener("scroll", () => {
        this._scrollAtEnd = this._view.clientHeight + this._view.scrollTop >= this._view.scrollHeight;
      });
      this._view.addEventListener("click", (e) => {
        this.emit("click", e);
      });
      this._container.appendChild(this._view);
      this._charHeight = parseFloat(window.getComputedStyle(this._character).height);
      this._charWidth = parseFloat(window.getComputedStyle(this._character.firstElementChild).width);
      if (!options)
        options = { display: this };
      else
        options.display = this;
      this.model = new DisplayModel(options);
      this._wResize = (e) => {
        if (this._scrollAtEnd)
          this.scrollDisplay();
        debounce(() => {
          this.doUpdate(1 /* update */ | 16 /* updateWindow */);
        }, 250, "resize");
      };
      window.addEventListener("resize", this._wResize.bind(this));
      this._resizeObserver = new ResizeObserver((entries, observer) => {
        if (entries.length === 0) return;
        if (!entries[0].contentRect || entries[0].contentRect.width === 0 || entries[0].contentRect.height === 0)
          return;
        debounce(() => {
          if (!this._resizeObserverCache || this._resizeObserverCache.width !== entries[0].contentRect.width || this._resizeObserverCache.height !== entries[0].contentRect.height) {
            if (this._scrollAtEnd)
              this.scrollDisplay();
            this._resizeObserverCache = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
            this.doUpdate(1 /* update */ | 16 /* updateWindow */);
            this.emit("resize");
          }
        }, 250, "resize");
      });
      this._resizeObserver.observe(this._container);
      this._observer = new MutationObserver((mutationsList) => {
        let mutation;
        for (mutation of mutationsList) {
          if (mutation.type === "attributes" && mutation.attributeName === "style") {
            if (this._scrollAtEnd)
              this.scrollDisplay();
            this.doUpdate(1 /* update */ | 16 /* updateWindow */);
            this.emit("resize");
          }
        }
      });
      this._observer.observe(this._container, { attributes: true, attributeOldValue: true, attributeFilter: ["style"] });
      if (!moment || this._timestamp !== 2 /* Format */)
        this._timestampWidth = (/* @__PURE__ */ new Date()).toISOString().length + 1;
      else
        this._timestampWidth = moment().format(this._timestampFormat).length;
      this.updateFont();
    }
    get showTimestamp() {
      return this._timestamp;
    }
    set showTimestamp(value) {
      if (value === this._timestamp) return;
      this._timestamp = value;
      if (!moment || this._timestamp !== 2 /* Format */)
        this._timestampWidth = (/* @__PURE__ */ new Date()).toISOString().length + 1;
      else
        this._timestampWidth = moment().format(this._timestampFormat).length;
      this.buildStyleSheet();
      this.doUpdate(2 /* display */ | 1 /* update */ | 32 /* rebuildLines */);
    }
    get timestampFormat() {
      return this._timestampFormat;
    }
    set timestampFormat(value) {
      if (this._timestampFormat === value) return;
      this._timestampFormat = value;
      if (!moment || this._timestamp !== 2 /* Format */)
        this._timestampWidth = (/* @__PURE__ */ new Date()).toISOString().length + 1;
      else
        this._timestampWidth = moment().format(this._timestampFormat).length;
      this.doUpdate(2 /* display */ | 32 /* rebuildLines */ | 16 /* updateWindow */ | 1 /* update */);
    }
    get wordWrap() {
      return this._wordWrap;
    }
    set wordWrap(value) {
      if (value === this._wordWrap) return;
      this._wordWrap = value;
      this.buildStyleSheet();
      this.doUpdate(1 /* update */);
    }
    get wrapAt() {
      return this._wrapAt;
    }
    set wrapAt(value) {
      if (value === this._wrapAt) return;
      this._wrapAt = value;
      this.buildStyleSheet();
      this.doUpdate(1 /* update */ | 2 /* display */);
    }
    get indent() {
      return this._indent;
    }
    set indent(value) {
      if (value === this._indent)
        return;
      this._indent = value;
      this.buildStyleSheet();
      this.doUpdate(1 /* update */ | 2 /* display */);
    }
    get linkFunction() {
      return this._linkFunction || "doLink";
    }
    set linkFunction(val) {
      this._linkFunction = val;
    }
    get mxpLinkFunction() {
      return this._mxpLinkFunction || "doMXPLink";
    }
    set mxpLinkFunction(val) {
      this._mxpLinkFunction = val;
    }
    get mxpSendFunction() {
      return this._mxpSendFunction || "doMXPSend";
    }
    set mxpSendFunction(val) {
      this._mxpSendFunction = val;
    }
    get mxpTooltipFunction() {
      return this._mxpTooltipFunction || "doMXPTooltip";
    }
    set mxpTooltipFunction(val) {
      this._mxpTooltipFunction = val;
    }
    get id() {
      if (this._container) return this._container.id;
      return "";
    }
    get container() {
      return this._container;
    }
    get lines() {
      return this._model.lines;
    }
    get model() {
      return this._model;
    }
    set model(value) {
      if (this._model === value) return;
      if (this._model)
        this._model.removeAllListeners();
      this._model = value;
      this._model.on("debug", this.debug);
      this._model.on("bell", () => {
        this.emit("bell");
      });
      this._model.on("add-line", (data) => {
        this.emit("add-line", data);
      });
      this._model.on("add-line-done", (data) => {
        this.emit("add-line-done", data);
      });
      this._model.on("line-added", (data, noUpdate) => {
        this._lineCache.push(this.getLineHTML(data.idx));
      });
      this._model.on("expire-links", (args) => {
        if (this._expireCache.length) {
          let id;
          let elLine;
          for (let x = 0, xl = this._expireCache.length; x < xl; x++)
            this.rebuildLine(this._expireCache[x]);
        }
        this._expireCache = [];
        this.emit("expire-links");
      });
      this._model.on("parse-done", () => {
        this._view.insertAdjacentHTML("beforeend", this._lineCache.join(""));
        this._lineCache = [];
        this.doUpdate(2 /* display */);
        this.emit("parse-done");
      });
      this._model.on("set-title", (title, type) => {
        this.emit("set-title", title, type);
      });
      this._model.on("music", (data) => {
        this.emit("music", data);
      });
      this._model.on("sound", (data) => {
        this.emit("sound", data);
      });
      this._model.on("MXP-tag-reply", (tag, args) => {
        this.emit("MXP-tag-reply", tag, args);
      });
      this._model.on("expire-link-line", (idx) => {
        this._expireCache.push(idx);
        this.doUpdate(2 /* display */);
      });
    }
    get maxLines() {
      return this._maxLines;
    }
    set maxLines(value) {
      if (value !== this._maxLines) {
        this._maxLines = value;
        this.doUpdate(4 /* trim */);
      }
    }
    get enableDebug() {
      return this._enableDebug;
    }
    get enableColors() {
      return this._enableColors;
    }
    set enableColors(value) {
      if (value === this._enableColors) return;
      this._enableColors = value;
      this.buildStyleSheet();
    }
    get enableBackgroundColors() {
      return this._enableBackgroundColors;
    }
    set enableBackgroundColors(value) {
      if (value === this._enableBackgroundColors) return;
      this._enableBackgroundColors = value;
      this.buildStyleSheet();
    }
    get hideTrailingEmptyLine() {
      return this._hideTrailingEmptyLine;
    }
    set hideTrailingEmptyLine(value) {
      if (value === this._hideTrailingEmptyLine) return;
      this._hideTrailingEmptyLine = value;
      this.doUpdate(2 /* display */);
    }
    set enableDebug(enable) {
      this._enableDebug = enable;
      this._model.enableDebug = enable;
    }
    get tabWidth() {
      return this._model.tabWidth;
    }
    set tabWidth(value) {
      this._model.tabWidth = value;
    }
    get textLength() {
      return this._model.textLength;
    }
    get EndOfLine() {
      return this._model.EndOfLine;
    }
    get parseQueueLength() {
      return this._model.parseQueueLength;
    }
    get parseQueueEndOfLine() {
      return this._model.parseQueueEndOfLine;
    }
    get EndOfLineLength() {
      if (this.lines.length === 0)
        return 0;
      return this.lines[this.lines.length - 1].text.length;
    }
    set enableFlashing(value) {
      this._model.enableFlashing = value;
    }
    get enableFlashing() {
      return this._model.enableFlashing;
    }
    set enableMXP(value) {
      this._model.enableMXP = value;
    }
    get enableMXP() {
      return this._model.enableMXP;
    }
    set showInvalidMXPTags(value) {
      this._model.showInvalidMXPTags = value;
    }
    get showInvalidMXPTags() {
      return this._model.showInvalidMXPTags;
    }
    set enableBell(value) {
      this._model.enableBell = value;
    }
    get enableBell() {
      return this._model.enableBell;
    }
    set enableURLDetection(value) {
      this._model.enableURLDetection = value;
    }
    get enableURLDetection() {
      return this._model.enableURLDetection;
    }
    set enableMSP(value) {
      this._model.enableMSP = value;
    }
    get enableMSP() {
      return this._model.enableMSP;
    }
    set displayControlCodes(value) {
      this._model.displayControlCodes = value;
    }
    get displayControlCodes() {
      return this._model.displayControlCodes;
    }
    set emulateTerminal(value) {
      this._model.emulateTerminal = value;
    }
    get emulateTerminal() {
      return this._model.emulateTerminal;
    }
    set MXPStyleVersion(value) {
      this._model.MXPStyleVersion = value;
    }
    get MXPStyleVersion() {
      return this._model.MXPStyleVersion;
    }
    get WindowSize() {
      return new Size(this.WindowWidth, this.WindowHeight);
    }
    get WindowWidth() {
      return Math.trunc(this._maxView / this._charWidth);
    }
    get WindowHeight() {
      if (this._view.scrollWidth > this._view.clientWidth)
        return Math.trunc((this._innerHeight - getScrollbarWidth() - this._padding[0] - this._padding[2]) / this._charHeight);
      return Math.trunc((this._innerHeight - this._padding[0] - this._padding[2]) / this._charHeight);
    }
    get html() {
      const l = this.lines.length;
      const html = [];
      for (let idx = 0; idx < l; idx++)
        html.push(this.getLineHTML(idx));
      return html.join("");
    }
    get text() {
      return this._model.text;
    }
    get raw() {
      return this._model.raw;
    }
    get scrollAtBottom() {
      return this._scrollAtEnd;
    }
    debug(msg) {
      this.emit("debug", msg);
    }
    scrollDisplay() {
      if (!this.scrollLock)
        this._view.scrollTop = this._view.scrollHeight;
    }
    scrollTo(x, y) {
      this._view.scrollTo(x, y);
    }
    scrollToCharacter(x, y) {
      this._view.scrollTo(x * this._charHeight, y * this._charWidth);
    }
    scrollBy(x, y) {
      this._view.scrollBy(x, y);
    }
    scrollUp() {
      this._view.scrollBy(0, -this._charHeight);
    }
    scrollDown() {
      this._view.scrollBy(0, this._charHeight);
    }
    pageUp() {
      this._view.scrollBy(0, -this._view.clientHeight);
    }
    pageDown() {
      this._view.scrollBy(0, this._view.clientHeight);
    }
    trimLines() {
      if (this._maxLines === -1)
        return;
      if (this.lines.length > this._maxLines) {
        const amt = this.lines.length - this._maxLines;
        let r = amt;
        while (r-- > 0)
          this._view.removeChild(this._view.firstChild);
        this._model.removeLines(0, amt);
      }
    }
    append(txt, remote, force, prependSplit) {
      this._model.append(txt, remote || false, force || false, prependSplit || false);
    }
    CurrentAnsiCode() {
      return this._model.CurrentAnsiCode();
    }
    removeLine(line, noUpdate) {
      if (line < 0 || line >= this.lines.length) return;
      this.emit("line-removed", line, this.lines[line].text);
      const id = this._model.getLineID(line);
      const elLine = document.querySelector(`[data-id="${id}"]`);
      this._view.removeChild(elLine);
      this._model.removeLine(line);
    }
    removeLines(line, amt) {
      if (line < 0 || line >= this.lines.length) return;
      if (amt < 1) amt = 1;
      this.emit("lines-removed", line, this.lines.slice(line, line + amt - 1));
      this._view.replaceChildren(...[].slice.call(this._view.children, 0, line), ...[].slice.call(this._view.children, line + amt));
      this._model.removeLines(line, amt);
    }
    updateDisplay() {
      this._view.classList.remove("animate");
      this.doUpdate(4 /* trim */);
      if (this._hideTrailingEmptyLine && this.lines.length && this.lines[this.lines.length - 1].text.length === 0)
        this._view.lastChild.style.display = "none";
      this.doUpdate(8 /* scrollEnd */ | 16 /* updateWindow */);
      this._view.classList.add("animate");
    }
    updateWindow(width, height) {
      if (width === void 0) {
        width = this.WindowWidth;
        height = this.WindowHeight;
      }
      this._model.updateWindow(width, height);
      this.emit("update-window", width, height);
    }
    clear() {
      this._model.clear();
      this._view.innerHTML = "";
    }
    dispose() {
      document.body.removeChild(this._character);
      document.body.removeChild(this._styles);
      while (this._container.firstChild)
        this._view.removeChild(this._view.firstChild);
      window.removeEventListener("resize", this._wResize);
    }
    update() {
      const scrollWidth = getScrollbarWidth();
      this._maxView = this._view.clientWidth - this._padding[1] - this._padding[3] - scrollWidth - this._indentPadding;
      if (this._timestamp !== 0 /* None */)
        this._maxView -= this._timestampWidth * this._charWidth;
      this._innerHeight = this._view.clientHeight;
    }
    updateFont(font, size) {
      if (!font || font.length === 0)
        font = '"Courier New", Courier, monospace';
      else
        font += ", monospace";
      if (!size || size.length === 0)
        size = "1em";
      if (font !== this._container.style.fontFamily || size !== this._container.style.fontSize) {
        this._container.style.fontSize = size;
        this._container.style.fontFamily = font;
        this._character.style.fontSize = size;
        this._character.style.fontFamily = font;
        this._charHeight = parseFloat(window.getComputedStyle(this._character).height);
        this._charWidth = parseFloat(window.getComputedStyle(this._character.firstElementChild).width);
        setTimeout(() => {
          this._charHeight = parseFloat(window.getComputedStyle(this._character).height);
          this._charWidth = parseFloat(window.getComputedStyle(this._character.firstElementChild).width);
        }, 250);
        this.buildStyleSheet();
        this.doUpdate(8 /* scrollEnd */ | 16 /* updateWindow */ | 1 /* update */);
      }
      const pc = window.getComputedStyle(this._view);
      const padding = [
        parseInt(pc.getPropertyValue("padding-top")) || 0,
        parseInt(pc.getPropertyValue("padding-right")) || 0,
        parseInt(pc.getPropertyValue("padding-bottom")) || 0,
        parseInt(pc.getPropertyValue("padding-left")) || 0
      ];
      if (padding[0] !== this._padding[0] || padding[1] !== this._padding[1] || padding[2] !== this._padding[2] || padding[3] !== this._padding[3]) {
        this._padding = padding;
        this.doUpdate(1 /* update */);
      }
    }
    buildStyleSheet() {
      let styles = "";
      if (!this._enableColors)
        styles += ".view > span span {color: inherit !important;}";
      if (!this._enableColors || !this._enableBackgroundColors)
        styles += ".background > span span {background-color: inherit !important;}";
      if (this._wordWrap)
        styles += ".view {white-space: break-spaces; }";
      else if (this._wrapAt > 0)
        styles += `.view {white-space: break-spaces; } .line {width: ${this._wrapAt * this._charWidth}px !important;max-width:  ${this._wrapAt * this._charWidth}px;min-width:  ${this._wrapAt * this._charWidth}px;display: block;}`;
      if ((this._wordWrap || this._wrapAt > 0) && this._indent > 0)
        styles += `.view {  padding-left: 0px !important; text-indent: ${this._indent * this._charWidth}px hanging; }`;
      styles += `.line > span { min-height: ${this._charHeight}}`;
      if (this._timestamp !== 0 /* None */)
        styles += ".timestamp { display: inline-block; }";
      this._styles.innerHTML = styles;
      if ((this._wordWrap || this._wrapAt > 0) && this._indent > 0)
        this._indentPadding = parseFloat(window.getComputedStyle(this._view).paddingLeft) / 2;
      else
        this._indentPadding = 0;
    }
    getLineHTML(idx, start, len, inner) {
      if (idx === void 0 || idx >= this.lines.length)
        idx = this.lines.length - 1;
      else if (idx < 0)
        idx = 0;
      if (start === void 0 || start < 0)
        start = 0;
      if (len === void 0 || len === -1)
        len = this.lines[idx].text.length;
      const parts = [];
      let offset = 0;
      let style = "";
      let fCls = "";
      const text = this.lines[idx].text;
      const formats = this.lines[idx].formats;
      const fLen = formats.length;
      let right = false;
      const id = this._model.getLineID(idx);
      if (this._timestamp === 2 /* Format */ && moment)
        parts.push('<span class="timestamp" style="color:', this._model.GetColor(-7), ";background:", this._model.GetColor(-8), ';"', fCls, ">", moment(this.lines[idx].timestamp).format(this._timestampFormat), "</span>");
      else if (this._timestamp === 1 /* Simple */)
        parts.push('<span class="timestamp" style="color:', this._model.GetColor(-7), ";background:", this._model.GetColor(-8), ';"', fCls, ">", new Date(this.lines[idx].timestamp).toISOString(), " </span>");
      for (let f = 0; f < fLen; f++) {
        const format = formats[f];
        let nFormat;
        let end;
        const td = [];
        if (f < fLen - 1) {
          nFormat = formats[f + 1];
          if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
            continue;
          end = nFormat.offset;
        } else
          end = text.length;
        offset = format.offset;
        if (end > len)
          end = len;
        if (offset < start)
          offset = start;
        if (format.formatType === 0 /* Normal */) {
          style = [];
          fCls = [];
          if (typeof format.background === "number")
            style.push("background:", this._model.GetColor(format.background), ";");
          else if (format.background)
            style.push("background:", format.background, ";");
          if (typeof format.color === "number")
            style.push("color:", this._model.GetColor(format.color), ";");
          else if (format.color)
            style.push("color:", format.color, ";");
          if (format.font)
            style.push("font-family: ", format.font, ";");
          if (format.size)
            style.push("font-size: ", format.size, ";");
          if (format.style !== 0 /* None */) {
            if ((format.style & 1 /* Bold */) === 1 /* Bold */)
              style.push("font-weight: bold;");
            if ((format.style & 4 /* Italic */) === 4 /* Italic */)
              style.push("font-style: italic;");
            if ((format.style & 1024 /* Overline */) === 1024 /* Overline */)
              td.push("overline ");
            if ((format.style & 512 /* DoubleUnderline */) === 512 /* DoubleUnderline */ || (format.style & 8 /* Underline */) === 8 /* Underline */)
              td.push("underline ");
            if ((format.style & 512 /* DoubleUnderline */) === 512 /* DoubleUnderline */)
              style.push("border-bottom: 1px solid ", typeof format.color === "number" ? this._model.GetColor(format.color) : format.color, ";");
            else
              style.push("border-bottom: 1px solid ", typeof format.background === "number" ? this._model.GetColor(format.background) : format.background, ";");
            if ((format.style & 32 /* Rapid */) === 32 /* Rapid */ || (format.style & 16 /* Slow */) === 16 /* Slow */) {
              if (this.enableFlashing)
                fCls.push(" ansi-blink");
              else if ((format.style & 512 /* DoubleUnderline */) !== 512 /* DoubleUnderline */ && (format.style & 8 /* Underline */) !== 8 /* Underline */)
                td.push("underline ");
            }
            if ((format.style & 256 /* Strikeout */) === 256 /* Strikeout */)
              td.push("line-through ");
            if (td.length > 0)
              style.push("text-decoration:", td.join("").trim(), ";");
          } else
            style.push("border-bottom: 1px solid ", typeof format.background === "number" ? this._model.GetColor(format.background) : format.background, ";");
          if (offset < start || end < start)
            continue;
          style = style.join("").trim();
          if (fCls.length !== 0)
            fCls = ' class="' + fCls.join("").trim() + '"';
          else
            fCls = "";
          if (format.hr)
            parts.push('<span style="', style, 'min-width:100%;width:100%;"', fCls, '><div style="position:relative;top: 50%;transform: translateY(-50%);height:4px;width:100%; background-color:', typeof format.color === "number" ? this._model.GetColor(format.color) : format.color, '"></div></span>');
          else if (end - offset !== 0)
            parts.push('<span style="', style, '"', fCls, ">", htmlEncode(text.substring(offset, end)), "</span>");
        } else if (format.formatType === 1 /* Link */) {
          if (offset < start || end < start)
            continue;
          parts.push('<a draggable="false" class="URLLink" href="javascript:void(0);" title="');
          parts.push(format.href.replace(/"/g, "&quot;"));
          parts.push('" onclick="', this.linkFunction, "('", format.href.replace(/\\/g, "\\\\").replace(/"/g, "&quot;"), `');return false;">`);
          if (end - offset === 0) continue;
          parts.push('<span style="', style, '"', fCls, ">");
          parts.push(htmlEncode(text.substring(offset, end)));
          parts.push("</span>");
        } else if (format.formatType === 2 /* LinkEnd */ || format.formatType === 4 /* MXPLinkEnd */ || format.formatType === 8 /* MXPSendEnd */) {
          if (offset < start || end < start)
            continue;
          parts.push("</a>");
        } else if (format.formatType === 3 /* MXPLink */) {
          if (offset < start || end < start)
            continue;
          parts.push('<a draggable="false" class="MXPLink" href="javascript:void(0);" title="');
          parts.push(format.href.replace(/"/g, "&quot;"));
          parts.push('"');
          if (format.expire && format.expire.length)
            parts.push(` data-expire="${format.expire}"`);
          parts.push(' onclick="', this.mxpLinkFunction, "(this, '", format.href.replace(/\\/g, "\\\\").replace(/"/g, "&quot;"), `');return false;">`);
          if (end - offset === 0) continue;
          parts.push('<span style="', style, '"', fCls, ">");
          parts.push(htmlEncode(text.substring(offset, end)));
          parts.push("</span>");
        } else if (format.formatType === 7 /* MXPSend */) {
          if (offset < start || end < start)
            continue;
          parts.push('<a draggable="false" class="MXPLink" href="javascript:void(0);" title="');
          parts.push(format.hint.replace(/"/g, "&quot;"));
          parts.push('"');
          if (format.expire && format.expire.length)
            parts.push(` data-expire="${format.expire}"`);
          parts.push(' onmouseover="', this.mxpTooltipFunction, '(this);"');
          parts.push(' onclick="', this.mxpSendFunction, "(event||window.event, this, ", format.href.replace(/\\/g, "\\\\").replace(/"/g, "&quot;"), ", ", format.prompt ? "1" : "0", ", ", format.tt.replace(/\\/g, "\\\\").replace(/"/g, "&quot;"), ');return false;">');
          if (end - offset === 0) continue;
          parts.push('<span style="', style, '"', fCls, ">");
          parts.push(htmlEncode(text.substring(offset, end)));
          parts.push("</span>");
        } else if (format.formatType === 9 /* MXPExpired */ && end - offset !== 0) {
          if (offset < start || end < start)
            continue;
          parts.push('<span style="', style, '"', fCls, ">");
          parts.push(htmlEncode(text.substring(offset, end)));
          parts.push("</span>");
        } else if (format.formatType === 5 /* Image */) {
          if (offset < start || end < start)
            continue;
          let tmp = "";
          parts.push('<img src="');
          if (format.url.length > 0) {
            parts.push(format.url);
            tmp += format.url;
            if (!format.url.endsWith("/")) {
              parts.push("/");
              tmp += "/";
            }
          }
          if (format.t.length > 0) {
            parts.push(format.t);
            tmp += format.t;
            if (!format.t.endsWith("/")) {
              parts.push("/");
              tmp += "/";
            }
          }
          tmp += format.name;
          parts.push(format.name, '"  style="');
          if (format.w.length > 0)
            parts.push("width:", formatUnit(format.w, this._charWidth), ";");
          if (format.h.length > 0)
            parts.push("height:", formatUnit(format.h, this._charHeight), ";");
          switch (format.align.toLowerCase()) {
            case "left":
              parts.push("float:left;");
              break;
            case "right":
              parts.push("float:right;");
              right = true;
              break;
            case "top":
            case "middle":
            case "bottom":
              parts.push("vertical-align:", format.align, ";");
              break;
          }
          if (format.hspace.length > 0 && format.vspace.length > 0) {
            parts.push("margin:");
            parts.push(formatUnit(format.vspace, this._charWidth), " ");
            parts.push(formatUnit(format.hspace, this._charHeight), ";");
          } else if (format.hspace.length > 0) {
            parts.push("margin:");
            parts.push("0px ", formatUnit(format.hspace, this._charHeight), ";");
          } else if (format.vspace.length > 0) {
            parts.push("margin:");
            parts.push(formatUnit(format.vspace, this._charWidth), " 0px;");
          }
          parts.push('"');
          if (format.ismap) parts.push(' ismap onclick="return false;"');
          parts.push(`src="${tmp}"/>`);
        }
      }
      if (inner) {
        if (right && len < this.lines[idx].text.length)
          return parts.join("");
        if (right)
          return parts.join("") + "<br>";
        if (len < this.lines[idx].text.length)
          return parts.join("");
        return parts.join("") + "<br>";
      }
      if (right && len < this.lines[idx].text.length)
        return `<span data-id="${id}" class="line" style="min-width:100%">${parts.join("")}</span>`;
      if (right)
        return `<span data-id="${id}" class="line" style="min-width:100%">${parts.join("")}<br></span>`;
      if (len < this.lines[idx].text.length)
        return `<span data-id="${id}" class="line">${parts.join("")}</span>`;
      return `<span  data-id="${id}" class="line">${parts.join("")}<br></span>`;
    }
    getLineText(line, full) {
      if (line < 0 || line >= this.lines.length || !this.lines[line]) return "";
      return this.lines[line].text;
    }
    rebuildLine(start) {
      this.rebuildLines(start, start);
    }
    rebuildLines(start, end) {
      if (!this.lines.length) return;
      if (start === void 0 || start < 0)
        start = 0;
      if (end === void 0 || end === -1 || end >= this.lines.length)
        end = this.lines.length - 1;
      const lines = this.lines;
      let _html = [];
      let line = start;
      for (; line <= end; line++) {
        _html.push(this.getLineHTML(line));
      }
      if (start === 0 && end === this.lines.length - 1)
        this._view.innerHTML = _html.join("");
      else {
        this._view.replaceChildren(...[].slice.call(this._view.children, 0, start), ...[].slice.call(this._view.children, end + 1));
        if (start === 0)
          this._view.firstElementChild.insertAdjacentHTML("beforebegin", _html.join(""));
        else {
          this._view.children[start - 1].insertAdjacentHTML("afterend", _html.join(""));
        }
      }
    }
    doUpdate(type) {
      if (!type) return;
      this._updating |= type;
      if (this._updating === 0 /* none */)
        return;
      window.requestAnimationFrame(() => {
        if (this._updating === 0 /* none */)
          return;
        if ((this._updating & 32 /* rebuildLines */) === 32 /* rebuildLines */) {
          this.rebuildLines();
          this._updating &= ~32 /* rebuildLines */;
        }
        if ((this._updating & 1 /* update */) === 1 /* update */) {
          this.update();
          this._updating &= ~1 /* update */;
        }
        if ((this._updating & 2 /* display */) === 2 /* display */) {
          this.updateDisplay();
          this._updating &= ~2 /* display */;
        }
        if ((this._updating & 4 /* trim */) === 4 /* trim */) {
          this.trimLines();
          this._updating &= ~4 /* trim */;
        }
        if ((this._updating & 8 /* scrollEnd */) === 8 /* scrollEnd */) {
          this.scrollDisplay();
          this._updating &= ~8 /* scrollEnd */;
        }
        if ((this._updating & 16 /* updateWindow */) === 16 /* updateWindow */) {
          this.updateWindow();
          this._updating &= ~16 /* updateWindow */;
        }
        this.doUpdate(this._updating);
      });
    }
    colorSubStrByLine(idx, fore, back, start, len, style) {
      this.colorSubStringByLine(idx, fore, back, start, (start || 0) + (len || 0), style);
    }
    colorSubStringByLine(idx, fore, back, start, end, style) {
      if (!this._model.colorSubStringByLine(idx, fore, back, start, end, style))
        return;
      this.rebuildLine(idx);
    }
    removeStyleSubStrByLine(idx, style, start, len) {
      this.removeStyleSubStringByLine(idx, style, start, (start || 0) + (len || 0));
    }
    //color like javascript.substring using 0 index for start and end
    removeStyleSubStringByLine(idx, style, start, end) {
      if (!this._model.removeStyleSubStringByLine(idx, style, start, end))
        return;
      this.rebuildLine(idx);
    }
    highlightSubStrByLine(idx, start, len) {
      this.highlightStyleSubStringByLine(idx, start, (start || 0) + (len || 0));
    }
    //color like javascript.substring using 0 index for start and end
    highlightStyleSubStringByLine(idx, start, end, color) {
      if (!this._model.highlightStyleSubStringByLine(idx, start, end, color))
        return;
      this.rebuildLine(idx);
    }
    SetColor(code, color) {
      this._model.SetColor(code, color);
    }
    ClearMXP() {
      this._model.ClearMXP();
    }
    ResetMXPLine() {
      this._model.ResetMXPLine();
    }
    /*
        get hasSelection(): boolean {
            const sel = this._currentSelection;
            if (sel.start.x === sel.end.x && sel.start.y === sel.end.y)
                return false;
            return true;
        }
    
        get selection(): string {
            if (this._lines.length === 0) return '';
            const sel = this._currentSelection;
            let s = sel.start.x;
            let e = sel.end.x;
            let sL = sel.start.y;
            let eL = sel.end.y;
            if ((sL === -1 && eL === -1) || sL === null || eL === null)
                return '';
            if (sL < 0)
                sL = 0;
            else if (sL >= this._lines.length)
                sL = this._lines.length - 1;
            if (eL < 0)
                eL = 0;
            else if (eL >= this._lines.length)
                eL = this._lines.length - 1;
            //convert wrap offset to text offsets
            s = this._lines[sL].startOffset + s;
            e = this._lines[eL].startOffset + e;
            //convert wrap lines to text lines
            sL = this._model.getLineFromID(this._lines[sL].id);
            eL = this._model.getLineFromID(this._lines[eL].id);
            if (sL > eL) {
                sL = sel.end.y;
                eL = sel.start.y;
                s = sel.end.x;
                e = sel.start.x;
            }
            else if (sL < eL) {
                sL = sel.start.y;
                eL = sel.end.y;
                s = sel.start.x;
                e = sel.end.x;
            }
            else if (s === e) {
                return '';
            }
            else if (sel.start.y > 0 && sel.start.y < this._lines.length && this._lines[sel.start.y].hr)
                return '---';
            else
                return this._model.getText(sL, Math.min(s, e), Math.max(s, e));
            const len = this._lines.length;
    
            if (sL < 0)
                sL = 0;
            if (eL >= len) {
                eL = len - 1;
                e = this.getLineText(eL).length;
            }
            if (s < 0)
                s = 0;
            if (e > this.getLineText(eL).length)
                e = this.getLineText(eL).length;
    
            //convert wrap offset to text offsets
            s = this._lines[sL].startOffset + s;
            e = this._lines[eL].startOffset + e;
            //convert wrap lines to text lines
            sL = this._model.getLineFromID(this._lines[sL].id);
            eL = this._model.getLineFromID(this._lines[eL].id);
            const txt: string[] = [];
            const lines = this._model.lines;
            if (this.lines[sL].formats[0].hr)
                txt.push('---');
            else
                txt.push(lines[sL].text.substring(s));
            sL++;
            while (sL < eL) {
                if (lines[sL].formats[0].hr)
                    txt.push('---');
                else
                    txt.push(lines[sL].text);
                sL++;
            }
            if (lines[eL].formats[0].hr)
                txt.push('---');
            else
                txt.push(lines[eL].text.substring(0, e));
            return txt.join('\n');
        }
    
        get selectionAsHTML(): string {
            if (this._lines.length === 0) return '';
            const sel = this._currentSelection;
            let s = sel.start.x;
            let e = sel.end.x;
            let sL = sel.start.y;
            let eL = sel.end.y;
            if (sL < 0)
                sL = 0;
            else if (sL >= this._lines.length)
                sL = this._lines.length - 1;
            if (eL < 0)
                eL = 0;
            else if (eL >= this._lines.length)
                eL = this._lines.length - 1;
            //convert wrap offset to text offsets
            s = this._lines[sL].startOffset + s;
            e = this._lines[eL].startOffset + e;
            //convert wrap lines to text lines
            sL = this._model.getLineFromID(this._lines[sL].id);
            eL = this._model.getLineFromID(this._lines[eL].id);
            if (sL > eL) {
                sL = sel.end.y;
                eL = sel.start.y;
                s = sel.end.x;
                e = sel.start.x;
            }
            else if (sL < eL) {
                sL = sel.start.y;
                eL = sel.end.y;
                s = sel.start.x;
                e = sel.end.x;
            }
            else if (sel.start.x === sel.end.x) {
                return '';
            }
            else {
                sL = sel.start.y;
                if (sL < 0) sL = 0;
                if (sL >= this._lines.length)
                    sL = this._lines.length - 1;
                //convert wrap offset to text offsets
                s = this._lines[sL].startOffset + s;
                e = this._lines[eL].startOffset + e;
                s = Math.min(sel.start.x, sel.end.x);
                e = Math.max(sel.start.x, sel.end.x);
                //convert wrap lines to text lines
                sL = this._model.getLineFromID(this._lines[sel.start.y].id);
                return this.getLineHTML(sL, s, e);
            }
            const len = this._lines.length;
    
            if (sL < 0)
                sL = 0;
            if (eL >= len) {
                eL = len - 1;
                e = this.getLineText(eL).length;
            }
            if (s < 0)
                s = 0;
            if (e > this.getLineText(eL).length)
                e = this.getLineText(eL).length;
            //convert wrap offset to text offsets
            s = this._lines[sL].startOffset + s;
            e = this._lines[eL].startOffset + e;
            //convert wrap lines to text lines
            sL = this._model.getLineFromID(this._lines[sL].id);
            eL = this._model.getLineFromID(this._lines[eL].id);
    
            const txt = [this.getLineHTML(sL, s)];
            sL++;
            while (sL < eL) {
                txt.push(this.getLineHTML(sL));
                sL++;
            }
            txt.push(this.getLineHTML(eL, 0, e));
            return txt.join('\n');
        }
    
        public selectAll() {
            let ll = this._lines.length;
            if (ll === 0) return;
            ll--;
            this._currentSelection = {
                start: { x: 0, y: 0, lineID: this._lines[0].id, lineOffset: 0 },
                end: { x: this.getLineText(ll).length, y: ll, lineID: this._lines[ll].id, lineOffset: this._lines[ll].endOffset },
                scrollTimer: -1,
                drag: false
            };
            this.emit('selection-changed');
            this.emit('selection-done');
            this.updateSelection();
        }
    
        public clearSelection() {
            this._currentSelection = {
                start: { x: -1, y: -1, lineID: -1, lineOffset: 0 },
                end: { x: -1, y: -1, lineID: -1, lineOffset: 0 },
                scrollTimer: -1,
                drag: false
            };
            this.emit('selection-changed');
            this.emit('selection-done');
            this.updateSelection();
        }
        
        */
  };
  var DisplayModel = class extends EventEmitter {
    constructor(options) {
      super();
      this._lineID = 0;
      this.lines = [];
      this.lineIDs = [];
      this._expire = {};
      this._expire2 = [];
      this._parser = new Parser(options);
      this._parser.on("debug", (msg) => {
        this.emit(msg);
      });
      this._parser.on("bell", () => {
        this.emit("bell");
      });
      this._parser.on("add-line", (data) => {
        this.addParserLine(data, true);
      });
      this._parser.on("expire-links", (args) => {
        let lines;
        let line;
        let expire;
        if (!args || args.length === 0) {
          for (line in this._expire2) {
            if (!this._expire2.hasOwnProperty(line))
              continue;
            this.expireLineLinkFormat(this._expire2[line], +line);
          }
          for (expire in this._expire) {
            if (!this._expire.hasOwnProperty(expire))
              continue;
            lines = this._expire[expire];
            for (line in lines) {
              if (!lines.hasOwnProperty(line))
                continue;
              this.expireLineLinkFormat(lines[line], +line);
            }
          }
          this._expire2 = [];
          this._expire = {};
          this.emit("expire-links", args);
        } else if (this._expire[args]) {
          lines = this._expire[args];
          for (line in lines) {
            if (!lines.hasOwnProperty(line))
              continue;
            this.expireLineLinkFormat(lines[line], +line);
          }
          delete this._expire[args];
          this.emit("expire-links", args);
        }
      });
      this._parser.on("parse-done", () => {
        this.emit("parse-done");
      });
      this._parser.on("set-title", (title, type) => {
        this.emit("set-title", title, type);
      });
      this._parser.on("music", (data) => {
        this.emit("music", data);
      });
      this._parser.on("sound", (data) => {
        this.emit("sound", data);
      });
      this._parser.on("MXP-tag-reply", (tag, args) => {
        this.emit("MXP-tag-reply", tag, args);
      });
    }
    get enableDebug() {
      return this._parser.enableDebug;
    }
    set enableDebug(value) {
      this._parser.enableDebug = value;
    }
    get tabWidth() {
      return this._parser.tabWidth;
    }
    set tabWidth(value) {
      this._parser.tabWidth = value;
    }
    get textLength() {
      return this._parser.textLength;
    }
    get EndOfLine() {
      return this._parser.EndOfLine;
    }
    get parseQueueLength() {
      return this._parser.parseQueueLength;
    }
    get parseQueueEndOfLine() {
      return this._parser.parseQueueEndOfLine;
    }
    set enableFlashing(value) {
      this._parser.enableFlashing = value;
    }
    get enableFlashing() {
      return this._parser.enableFlashing;
    }
    set enableMXP(value) {
      this._parser.enableMXP = value;
    }
    get enableMXP() {
      return this._parser.enableMXP;
    }
    set showInvalidMXPTags(value) {
      this._parser.showInvalidMXPTags = value;
    }
    get showInvalidMXPTags() {
      return this._parser.showInvalidMXPTags;
    }
    set enableBell(value) {
      this._parser.enableBell = value;
    }
    get enableBell() {
      return this._parser.enableBell;
    }
    set enableURLDetection(value) {
      this._parser.enableURLDetection = value;
    }
    get enableURLDetection() {
      return this._parser.enableURLDetection;
    }
    set enableMSP(value) {
      this._parser.enableMSP = value;
    }
    get enableMSP() {
      return this._parser.enableMSP;
    }
    set displayControlCodes(value) {
      this._parser.displayControlCodes = value;
    }
    get displayControlCodes() {
      return this._parser.displayControlCodes;
    }
    set emulateTerminal(value) {
      this._parser.emulateTerminal = value;
    }
    get emulateTerminal() {
      return this._parser.emulateTerminal;
    }
    set emulateControlCodes(value) {
      this._parser.emulateControlCodes = value;
    }
    get emulateControlCodes() {
      return this._parser.emulateControlCodes;
    }
    set MXPStyleVersion(value) {
      this._parser.StyleVersion = value;
    }
    get MXPStyleVersion() {
      return this._parser.StyleVersion;
    }
    addParserLine(data, noUpdate) {
      data.timestamp = Date.now();
      this.emit("add-line", data);
      if (data == null || typeof data === "undefined" || data.line == null || typeof data.line === "undefined")
        return;
      this.emit("add-line-done", data);
      if (data.gagged)
        return;
      const line = {
        text: data.line === "\n" || data.line.length === 0 ? "" : data.line,
        raw: data.raw,
        formats: data.formats,
        id: this._lineID,
        timestamp: data.timestamp
      };
      this.lines.push(line);
      this.lineIDs.push(this._lineID);
      this._lineID++;
      this.buildLineExpires(this.lines.length - 1);
      this.emit("line-added", data, noUpdate);
    }
    expireLineLinkFormat(formats, idx) {
      let f;
      let fs;
      let fl;
      let fsl;
      let type;
      let eType;
      let format;
      let n = 0;
      for (fs = 0, fsl = formats.length; fs < fsl; fs++) {
        fl = this.lines[idx].formats.length;
        f = formats[fs];
        format = this.lines[idx].formats[f];
        type = format.formatType;
        if (format.formatType === 3 /* MXPLink */)
          eType = 4 /* MXPLinkEnd */;
        else
          eType = 8 /* MXPSendEnd */;
        format.formatType = 9 /* MXPExpired */;
        f++;
        for (; f < fl; f++) {
          if (this.lines[idx].formats[f] === eType) {
            if (n === 0) {
              this.lines[idx].formats[f].formatType = 10 /* MXPSkip */;
              break;
            } else
              n--;
          } else if (this.lines[idx].formats[f] === type)
            n++;
        }
      }
      this.emit("expire-link-line", idx);
    }
    clear() {
      this._parser.Clear();
      this.lines = [];
      this._expire = {};
      this._expire2 = [];
      this.lineIDs = [];
      this._lineID = 0;
    }
    IncreaseColor(color, percent) {
      return this._parser.IncreaseColor(color, percent);
    }
    GetColor(color) {
      return this._parser.GetColor(color);
    }
    append(txt, remote, force, prependSplit) {
      this._parser.parse(txt, remote || false, force || false, prependSplit || false);
    }
    CurrentAnsiCode() {
      return this._parser.CurrentAnsiCode();
    }
    updateWindow(width, height) {
      this._parser.updateWindow(width, height);
    }
    SetColor(code, color) {
      this._parser.SetColor(code, color);
    }
    ClearMXP() {
      this._parser.ClearMXP();
    }
    ResetMXPLine() {
      this._parser.ResetMXPLine();
    }
    get busy() {
      return this._parser.busy;
    }
    removeLine(line) {
      this.lines.splice(line, 1);
      this.lineIDs.splice(line, 1);
      this._expire2.splice(line, 1);
    }
    removeLines(line, amt) {
      this.lines.splice(line, amt);
      this.lineIDs.splice(line, amt);
      this._expire2.splice(line, amt);
      for (let ol in this._expire) {
        if (!this._expire.hasOwnProperty(ol) || this._expire[ol].length === 0 || line >= this._expire[ol].length)
          continue;
        this._expire[ol].splice(line, amt);
      }
    }
    getLineID(line) {
      if (line < 0 || line >= this.lineIDs.length) return -1;
      return this.lineIDs[line];
    }
    get getNextLineID() {
      return this._lineID;
    }
    getLineFromID(id) {
      return this.lineIDs.indexOf(id);
    }
    buildLineExpires(idx) {
      if (idx === void 0)
        idx = this.lines.length - 1;
      const formats = this.lines[idx].formats;
      for (const ol in this._expire) {
        if (!this._expire.hasOwnProperty(ol))
          continue;
        if (this._expire[ol][idx])
          delete this._expire[ol][idx];
      }
      delete this._expire2[idx];
      let f = formats.length;
      let format;
      while (f--) {
        format = formats[f];
        if (format.formatType === 7 /* MXPSend */ || format.formatType === 3 /* MXPLink */) {
          if (format.expire && format.expire.length > 0) {
            if (!this._expire[format.expire])
              this._expire[format.expire] = [];
            if (!this._expire[format.expire][idx])
              this._expire[format.expire][idx] = [];
            this._expire[format.expire][idx].push(f);
          } else {
            if (!this._expire2[idx])
              this._expire2[idx] = [];
            this._expire2[idx].push(f);
          }
        }
      }
    }
    //color like javascript.substr using 0 index and length
    colorSubStrByLine(idx, fore, back, start, len, style) {
      return this.colorSubStringByLine(idx, fore, back, start, start + len, style);
    }
    //color like javascript.substring using 0 index for start and end
    colorSubStringByLine(idx, fore, back, start, end, style) {
      if (idx < 0 || idx >= this.lines.length) return false;
      const lineLength = this.lines[idx].text.length;
      if (start >= lineLength) return false;
      if (!start || start < 0) start = 0;
      if (!end || end > lineLength)
        end = lineLength;
      if (start === end)
        return false;
      const formats = this.lines[idx].formats;
      let len = formats.length;
      let found = false;
      if (start === 0 && end >= lineLength) {
        for (let f = 0; f < len; f++) {
          const format = formats[f];
          if (format.formatType !== 0 /* Normal */)
            continue;
          found = true;
          if (format.bStyle) {
            format.bStyle = 0;
            format.fStyle = 0;
            format.fCls = 0;
          }
          format.color = fore || format.color;
          format.background = back || format.background;
          format.style |= style || 0 /* None */;
        }
        if (!found) {
          formats.unshift({
            formatType: 0 /* Normal */,
            offset: 0,
            color: fore || 0,
            background: back || 0,
            size: 0,
            font: 0,
            style: style || 0 /* None */,
            unicode: false
          });
        }
      } else {
        let nFormat;
        let formatEnd;
        for (let f = 0; f < len; f++) {
          const format = formats[f];
          if (format.formatType !== 0 /* Normal */)
            continue;
          if (f < len - 1) {
            let nF = f + 1;
            nFormat = formats[nF];
            if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
              continue;
            while (format.offset === nFormat.offset && nFormat.formatType === format.formatType && nF < len - 1)
              nFormat = formats[++nF];
            if (nF === len && format.offset === nFormat.offset)
              formatEnd = lineLength;
            else
              formatEnd = nFormat.offset;
          } else
            formatEnd = lineLength;
          if (start < format.offset) continue;
          if (start >= formatEnd) continue;
          found = true;
          if (format.bStyle) {
            format.bStyle = 0;
            format.fStyle = 0;
            format.fCls = 0;
          }
          if (end < formatEnd) {
            format.width = 0;
            formats.splice(f + 1, 0, {
              formatType: format.formatType,
              offset: end,
              color: format.color,
              background: format.background,
              size: format.size,
              font: format.font,
              style: format.style,
              unicode: format.unicode
            });
            len++;
          }
          if (start != format.offset) {
            format.width = 0;
            formats.splice(f + 1, 0, {
              formatType: format.formatType,
              offset: start,
              color: fore || format.color,
              background: back || format.background,
              size: format.size,
              font: format.font,
              style: format.style | (style || 0 /* None */),
              unicode: format.unicode
            });
            len++;
          } else {
            format.color = fore || format.color;
            format.background = back || format.background;
            format.style |= style || 0 /* None */;
          }
          if (end > formatEnd)
            start = formatEnd;
        }
        this.lines[idx].formats = this.pruneFormats(formats, this.textLength);
      }
      return true;
    }
    removeStyleSubStrByLine(idx, style, start, len) {
      return this.removeStyleSubStringByLine(idx, style, start, start + len);
    }
    //color like javascript.substring using 0 index for start and end
    removeStyleSubStringByLine(idx, style, start, end) {
      if (idx < 0 || idx >= this.lines.length) return false;
      const lineLength = this.lines[idx].text.length;
      if (start >= lineLength) return false;
      if (!start || start < 0) start = 0;
      if (!end || end > lineLength)
        end = lineLength;
      const formats = this.lines[idx].formats;
      let len = formats.length;
      let found = false;
      if (start === 0 && end >= lineLength) {
        for (let f = 0; f < len; f++) {
          const format = formats[f];
          if (format.formatType !== 0 /* Normal */)
            continue;
          found = true;
          if (format.bStyle) {
            format.bStyle = 0;
            format.fStyle = 0;
            format.fCls = 0;
          }
          format.style &= ~(style || 0 /* None */);
        }
        if (!found) {
          formats.unshift({
            formatType: 0 /* Normal */,
            offset: 0,
            color: 0,
            background: 0,
            size: 0,
            font: 0,
            style: 0 /* None */,
            unicode: false
          });
        }
      } else {
        let nFormat;
        let formatEnd;
        for (let f = 0; f < len; f++) {
          const format = formats[f];
          if (format.formatType !== 0 /* Normal */)
            continue;
          if (f < len - 1) {
            let nF = f + 1;
            nFormat = formats[nF];
            if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
              continue;
            while (format.offset === nFormat.offset && nFormat.formatType === format.formatType && nF < len - 1)
              nFormat = formats[++nF];
            if (nF === len && format.offset === nFormat.offset)
              formatEnd = lineLength;
            else
              formatEnd = nFormat.offset;
          } else
            formatEnd = lineLength;
          if (start < format.offset) continue;
          if (start >= formatEnd) continue;
          found = true;
          if (format.bStyle) {
            format.bStyle = 0;
            format.fStyle = 0;
            format.fCls = 0;
          }
          if (end < formatEnd) {
            format.width = 0;
            formats.splice(f + 1, 0, {
              formatType: format.formatType,
              offset: end,
              color: format.color,
              background: format.background,
              size: format.size,
              font: format.font,
              style: format.style,
              unicode: format.unicode
            });
            len++;
          }
          if (start != format.offset) {
            format.width = 0;
            formats.splice(f + 1, 0, {
              formatType: format.formatType,
              offset: start,
              color: format.color,
              background: format.background,
              size: format.size,
              font: format.font,
              style: format.style & ~(style || 0 /* None */),
              unicode: format.unicode
            });
            len++;
          } else {
            format.style &= ~(style || 0 /* None */);
          }
          if (end > formatEnd)
            start = formatEnd;
        }
        this.lines[idx].formats = this.pruneFormats(formats, this.textLength);
      }
      return true;
    }
    highlightSubStrByLine(idx, start, len) {
      return this.highlightStyleSubStringByLine(idx, start, start + len);
    }
    //color like javascript.substring using 0 index for start and end
    highlightStyleSubStringByLine(idx, start, end, color) {
      if (idx < 0 || idx >= this.lines.length) return false;
      const lineLength = this.lines[idx].text.length;
      if (start >= lineLength) return false;
      if (!start || start < 0) start = 0;
      if (!end || end > lineLength)
        end = lineLength;
      const formats = this.lines[idx].formats;
      let len = formats.length;
      let found = false;
      if (start === 0 && end >= lineLength) {
        for (let f = 0; f < len; f++) {
          const format = formats[f];
          if (format.formatType !== 0 /* Normal */)
            continue;
          found = true;
          if (format.bStyle) {
            format.bStyle = 0;
            format.fStyle = 0;
            format.fCls = 0;
          }
          if (color || (format.style & 1 /* Bold */) === 1 /* Bold */) {
            if (typeof format.color === "number")
              format.color = this._parser.IncreaseColor(this._parser.GetColor(format.color), 0.25);
            else
              format.color = this._parser.IncreaseColor(format.color, 0.25);
          } else
            format.style |= 1 /* Bold */;
        }
        if (!found) {
          formats.unshift({
            formatType: 0 /* Normal */,
            offset: 0,
            color: color ? 370 : 0,
            background: 0,
            size: 0,
            font: 0,
            style: color ? 0 /* None */ : 1 /* Bold */,
            unicode: false
          });
        }
      } else {
        let nFormat;
        let formatEnd;
        for (let f = 0; f < len; f++) {
          const format = formats[f];
          if (format.formatType !== 0 /* Normal */)
            continue;
          if (f < len - 1) {
            let nF = f + 1;
            nFormat = formats[nF];
            if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
              continue;
            while (format.offset === nFormat.offset && nFormat.formatType === format.formatType && nF < len - 1)
              nFormat = formats[++nF];
            if (nF === len && format.offset === nFormat.offset)
              formatEnd = lineLength;
            else
              formatEnd = nFormat.offset;
          } else
            formatEnd = lineLength;
          if (start < format.offset) continue;
          if (start >= formatEnd) continue;
          found = true;
          if (format.bStyle) {
            format.bStyle = 0;
            format.fStyle = 0;
            format.fCls = 0;
          }
          if (end < formatEnd) {
            format.width = 0;
            formats.splice(f + 1, 0, {
              formatType: format.formatType,
              offset: end,
              color: format.color,
              background: format.background,
              size: format.size,
              font: format.font,
              style: format.style,
              unicode: format.unicode
            });
            len++;
          }
          if (start != format.offset) {
            format.width = 0;
            nFormat = {
              formatType: format.formatType,
              offset: start,
              color: format.color,
              background: format.background,
              size: format.size,
              font: format.font,
              style: format.style,
              unicode: format.unicode
            };
            if (color || (format.style & 1 /* Bold */) === 1 /* Bold */) {
              if (typeof format.color === "number")
                nFormat.color = this._parser.IncreaseColor(this._parser.GetColor(format.color), 0.25);
              else
                nFormat.color = this._parser.IncreaseColor(format.color, 0.25);
            } else
              nFormat.style |= 1 /* Bold */;
            formats.splice(f + 1, 0, nFormat);
            len++;
          } else if (color || (format.style & 1 /* Bold */) === 1 /* Bold */) {
            if (typeof format.color === "number")
              format.color = this._parser.IncreaseColor(this._parser.GetColor(format.color), 0.25);
            else
              format.color = this._parser.IncreaseColor(format.color, 0.25);
          } else
            format.style |= 1 /* Bold */;
          if (end > formatEnd)
            start = formatEnd;
        }
        this.lines[idx].formats = this.pruneFormats(formats, this.textLength);
      }
      return true;
    }
    pruneFormats(formats, textLen) {
      if (!formats || formats.length < 2) return formats;
      const l = formats.length;
      const nF = [];
      for (let f = 0; f < l; f++) {
        const format = formats[f];
        let end;
        if (f < l - 1) {
          const nFormat = formats[f + 1];
          if (format.offset === nFormat.offset && nFormat.formatType === format.formatType)
            continue;
          end = nFormat.offset;
          if (format.formatType === 1 /* Link */ && end - format.offset === 0 && nFormat.formatType === 2 /* LinkEnd */)
            continue;
          if (format.formatType === 7 /* MXPSend */ && end - format.offset === 0 && nFormat.formatType === 8 /* MXPSendEnd */)
            continue;
          if (format.formatType === 3 /* MXPLink */ && end - format.offset === 0 && nFormat.formatType === 4 /* MXPLinkEnd */)
            continue;
          if (format.formatType === nFormat.formatType && format.color === nFormat.color && format.background === nFormat.background && format.size === nFormat.size && format.font === nFormat.font && format.style === nFormat.style && format.unicode === nFormat.unicode) {
            nFormat.offset = format.offset;
            nFormat.width = 0;
            continue;
          }
        } else if (format.offset === textLen && textLen !== 0 && (format.formatType === 0 /* Normal */ && !format.hr || format.formatType === 1 /* Link */ || format.formatType === 7 /* MXPSend */ || format.formatType === 3 /* MXPLink */))
          continue;
        nF.push(format);
      }
      return nF;
    }
    get text() {
      return this.lines.map((line) => line.text).join("\n");
    }
    get raw() {
      return this.lines.map((line) => line.raw).join("");
    }
    getText(line, start, end) {
      if (line < 0 || line >= this.lines.length) return "";
      if (start < 0) start = 0;
      if (typeof end === "undefined" || end > this.lines[line].text.length)
        return this.lines[line].text.substring(start);
      return this.lines[line].text.substring(start, end);
    }
  };

  // package.json
  var version = "0.0.1";

  // src/plugins/msp.ts
  var buzz = __toESM(require_buzz());

  // src/plugin.ts
  var Plugin = class extends EventEmitter {
    #client;
    get client() {
      return this.#client;
    }
    set client(value) {
      if (value === this.#client) return;
      this.remove();
      this.#client = value;
      this.initialize();
    }
    constructor(client) {
      super();
      this.#client = client;
    }
  };

  // src/plugins/msp.ts
  var SoundState = class extends EventEmitter {
    constructor() {
      super(...arguments);
      this._file = "";
      this._repeats = 1;
      this._volume = 100;
      this._priority = 50;
      this._retries = 0;
      this.current = 0;
      this.sound = null;
      this.playing = false;
      this.url = "";
      this.continue = true;
      this.maxErrorRetries = 0;
    }
    set file(file) {
      if (!this.continue)
        this.close();
      this._file = file;
    }
    get file() {
      return this._file;
    }
    set repeats(repeats) {
      if (repeats >= -1)
        this._repeats = repeats;
      else
        this._repeats = 1;
      this.current = 0;
    }
    get repeats() {
      return this._repeats;
    }
    set volume(volume) {
      if (volume >= 0 && volume <= 100)
        this._volume = volume;
      else
        this._volume = 1;
    }
    get volume() {
      return this._volume;
    }
    set priority(priority) {
      if (priority >= 0 && priority <= 100)
        this._priority = priority;
      else
        this._priority = 50;
    }
    get priority() {
      return this._priority;
    }
    play() {
      this.playing = true;
      if (this._repeats > 0 && this.current < this._repeats) {
        this.current++;
        this.close();
        this.open().then(() => {
          this._retries = 0;
          this.sound.setVolume(this._volume).play();
          if (this.current < this._repeats) {
            this.sound.bind("ended abort", (e) => {
              this.play();
            });
          } else
            this.sound.bind("ended abort", (e) => {
              this.playing = false;
              this.emit("ended");
            });
          if (this.sound.isEnded())
            this.playing = false;
        }).catch((err) => {
          if (this._retries < this.maxErrorRetries) {
            this.current--;
            this.play();
            this._retries++;
          } else
            this._retries = 0;
        });
      } else if (this._repeats === -1) {
        this.close();
        this.open().then(() => {
          this._retries = 0;
          this.sound.setVolume(this._volume).loop().play();
          if (this.sound.isEnded())
            this.playing = false;
        }).catch((err) => {
          if (this._retries < this.maxErrorRetries) {
            this.play();
            this._retries++;
          } else
            this._retries = 0;
        });
      } else
        this.playing = false;
    }
    async open() {
      this.close();
      return new Promise((resolve, reject) => {
        this.sound = new buzz.sound()(this.url + this._file);
        this.sound.bind("loadeddata", (e) => {
          this.emit("playing", { file: this._file, sound: this.sound, state: this, duration: buzz.toTimer(this.sound.getDuration()) });
          resolve(1);
        });
        this.sound.bind("error", (e) => {
          if (e && e.currentTarget && e.currentTarget.error) {
            switch (e.currentTarget.error.code) {
              case 1:
                this.emit("error", new Error(`MSP - Aborted: ${this.url}${this._file}`));
                break;
              case 2:
                this.emit("error", new Error(`MSP - Network error: ${this.url}${this._file}`));
                break;
              case 3:
                this.emit("error", new Error(`MSP - Could not decode: ${this.url}${this._file}`));
                break;
              case 4:
                this.emit("error", new Error(`MSP - Source not supported: ${this.url}${this._file}`));
                break;
            }
          } else if (e && e.currentTarget && e.currentTarget.networkState === 3)
            this.emit("error", new Error(`MSP - Source not found or unable to play: ${this.url}${this._file}`));
          else
            this.emit("error", new Error("MSP - Unknown error"));
          reject();
        });
        this.emit("opened");
      });
    }
    close() {
      if (this.sound) {
        this.stop();
        delete this.sound;
        this.sound = null;
      } else if (this.playing)
        this.playing = false;
      this.emit("closed");
    }
    stop() {
      if (this.sound)
        this.sound.stop();
      this.playing = false;
      this.emit("stopped");
    }
  };
  var MSP = class extends Plugin {
    constructor(options) {
      super(options instanceof Client ? options : options?.client);
      this._enabled = true;
      this._enableSound = true;
      this._maxErrorRetries = 1;
      this.server = false;
      this.enableDebug = false;
      this.defaultSoundURL = "";
      this.defaultMusicURL = "";
      this.forcedDefaultMusicURL = "http://" + window.location.hostname + "/sounds/";
      this.forcedDefaultSoundURL = "http://" + window.location.hostname + "/sounds/";
      this.defaultSoundExt = ".m4a";
      this.defaultMusicExt = ".m4a";
      this.MusicState = new SoundState();
      this.SoundState = new SoundState();
      this.parseMode = 0 /* default */;
      if (options && !(options instanceof Client)) {
        if ("forcedDefaultMusicURL" in options)
          this.forcedDefaultMusicURL = options.forcedDefaultMusicURL;
        if ("forcedDefaultSoundURL" in options)
          this.forcedDefaultSoundURL = options.forcedDefaultSoundURL;
      }
      this.MusicState.on("playing", (data) => {
        data.type = 1;
        this.emit("playing", data);
      });
      this.SoundState.on("playing", (data) => {
        data.type = 0;
        this.emit("playing", data);
      });
      this.MusicState.on("error", (err) => {
        this.emit("error", err);
      });
      this.SoundState.on("error", (err) => {
        this.emit("error", err);
      });
      this.MusicState.maxErrorRetries = this._maxErrorRetries;
      this.SoundState.maxErrorRetries = this._maxErrorRetries;
    }
    remove() {
      if (!this.client) return;
      this.client.off("connecting", this.reset);
      this.client.off("close", this.reset);
      this.client.off("received-option", this.processOption);
      this.client.off("received-GMCP", this.processGMCP);
      this.client.off("music", this.music);
      this.client.off("sound", this.sound);
      this.client.off("options-loaded", this.loadOptions);
      this.client.off("option-loaded", this.setOption);
      this.client.off("function", this.processFunction);
      this.off("error", this.client.error);
      this.off("debug", this.client.debug);
    }
    initialize() {
      if (!this.client) return;
      this.client.on("connecting", this.reset);
      this.client.on("close", this.reset);
      this.client.on("received-option", this.processOption);
      this.client.on("received-GMCP", this.processGMCP);
      this.client.on("music", this.music);
      this.client.on("sound", this.sound);
      this.client.on("options-loaded", this.loadOptions);
      this.client.on("option-loaded", this.setOption);
      this.client.on("function", this.processFunction);
      this.on("playing", (data) => {
        if (!this.client) return;
        this.debug("MSP " + (data.type ? "Music" : "Sound") + " Playing " + data.file + " for " + data.duration);
        this.debug(data);
        if (!this.client.getOption("notifyMSPPlay")) return;
        this.client.echo((data.type ? "Music" : "Sound") + " Playing " + data.file + " for " + data.duration, -7 /* InfoText */, -8 /* InfoBackground */, true, true);
      });
      this.on("debug", this.client.debug);
      this.on("error", this.client.error);
      this.loadOptions();
    }
    get menu() {
      return [];
    }
    loadOptions() {
      this.enableDebug = this.client.getOption("enableDebug");
      this.enabled = this.client.getOption("enableMSP");
      this.enableSound = this.client.getOption("enableSound");
      this.maxErrorRetries = this.client.getOption("mspMaxRetriesOnError");
    }
    setOption(option, value) {
      switch (option) {
        case "enableMSP":
          this.enabled = this.client.getOption("enableMSP");
          break;
        case "mspMaxRetriesOnError":
          this.maxErrorRetries = this.client.getOption("mspMaxRetriesOnError");
          break;
        case "enableSound":
        case "enableDebug":
          this[option] = value;
          break;
      }
    }
    /**
     * enable or disable MSP
     *
     * @type {boolean}
     * @memberof MSP
     */
    get enabled() {
      return this._enabled;
    }
    set enabled(value) {
      if (value === this._enabled) return;
      this._enabled = value;
      this.MusicState?.close();
      this.SoundState?.close();
    }
    /**
     * the number of retries to try before stopping when an error happens MSP
     *
     * @type {boolean}
     * @memberof MSP
     */
    get maxErrorRetries() {
      return this._maxErrorRetries;
    }
    set maxErrorRetries(value) {
      if (value === this._maxErrorRetries) return;
      this._maxErrorRetries = value;
      if (this.MusicState)
        this.MusicState.maxErrorRetries = value;
      if (this.SoundState)
        this.SoundState.maxErrorRetries = value;
    }
    /**
     * enable or disable enableSound, allow processing of msp
     *
     * @type {boolean}
     * @memberof MSP
     */
    get enableSound() {
      return this._enableSound;
    }
    set enableSound(value) {
      if (value === this._enableSound) return;
      this._enableSound = value;
      this.MusicState?.close();
      this.SoundState?.close();
    }
    /**
     * getArguments - process a line of text and extract any arguments and return
     * them as an object for consuming and handle it due to being a web browser can't
     * save sounds, so they either need a url or be on the local http server using
     * the default url set
     *
     * @param {String} text the line of text extract arguments from
     * @param {Number} type the type of arguments to process, 0 SOUND, 1 MUSIC
     * @returns {Object} return a MUSIC or SOUND argument object
     */
    getArguments(text, type) {
      const e = { off: false, file: "", url: "", volume: 100, repeat: 1, priority: 50, type: "", continue: true };
      const args = [];
      let state = 0;
      let str = [];
      let x = 0;
      let xl = text.length;
      let c;
      let arg;
      let tmp;
      for (; x < xl; x++) {
        c = text.charAt(x);
        switch (state) {
          case 1:
            if (c === "'") {
              state = 0;
              str.push(c);
            } else
              str.push(c);
            break;
          case 2:
            if (c === "'") {
              state = 0;
              str.push(c);
            } else
              str.push(c);
            break;
          default:
            if (c === " ") {
              args.push(str.join(""));
              str = [];
            } else if (c === "'") {
              state = 1;
              str.push(c);
            } else if (c === "'") {
              state = 2;
              str.push(c);
            } else
              str.push(c);
            break;
        }
      }
      if (str.length > 0) {
        args.push(str.join(""));
        str = [];
      }
      x = 0;
      xl = args.length;
      this.debug("MSP arguments found: " + args);
      for (x = 0; x < xl; x++) {
        arg = args[x].split("=");
        if (arg.length > 1) {
          switch (arg[0].toUpperCase()) {
            case "FNAME":
              e.file = stripQuotes(arg[1]);
              if (e.file.toLowerCase() === "off") {
                e.off = true;
                e.file = "";
              }
              break;
            case "V":
              tmp = parseInt(arg[1], 10);
              if (isNaN(tmp))
                tmp = 100;
              e.volume = tmp;
              break;
            case "L":
              tmp = parseInt(arg[1], 10);
              if (isNaN(tmp))
                tmp = 1;
              e.repeat = tmp;
              break;
            //Sound only
            case "P":
              tmp = parseInt(arg[1], 10);
              if (isNaN(tmp))
                tmp = 1;
              e.priority = tmp;
              break;
            //Music only
            case "C":
              e.continue = arg[1] !== "0";
              break;
            case "T":
              if (arg[1].length > 0)
                e.type = arg[1];
              break;
            case "U":
              e.url = stripQuotes(arg[1]);
              if (!e.url.endsWith("/") && e.url.length > 0)
                e.url += "/";
              break;
          }
        } else if (x === 0) {
          e.file = stripQuotes(args[x]);
          if (e.file.toLowerCase() === "off") {
            e.off = true;
            e.file = "";
          }
        } else if (x === 1) {
          tmp = parseInt(args[x], 10);
          if (isNaN(tmp))
            tmp = 100;
          e.volume = tmp;
        } else if (x === 2) {
          tmp = parseInt(args[x], 10);
          if (isNaN(tmp))
            tmp = 1;
          e.repeat = tmp;
        } else if (x === 3 && type === 1)
          e.continue = args[x] !== "0";
        else if (x === 3) {
          tmp = parseInt(args[x], 10);
          if (isNaN(tmp))
            tmp = 1;
          e.priority = tmp;
        } else if (x === 4) {
          if (args[x].length > 0)
            e.type = args[x];
        } else if (x === 5) {
          e.url = stripQuotes(args[x]);
          if (!e.url.endsWith("/") && e.url.length > 0)
            e.url += "/";
        }
      }
      this.debug(e);
      return e;
    }
    reset() {
      this.server = false;
    }
    /**
     * music - process music object and player/stop based on object options
     *
     * @param {Object} data Music argument object, contains all settings
     */
    music(data) {
      if (!this.enabled && !this.enableSound) return false;
      if (!data.file || data.file.length === 0) {
        if (data.off && data.url && data.url.length > 0)
          this.defaultMusicURL = data.url;
        else if (data.off)
          this.MusicState.stop();
        return;
      } else if (data.off) {
        this.MusicState.stop();
        return;
      }
      this.MusicState.volume = data.volume;
      this.MusicState.repeats = data.repeat;
      this.MusicState.continue = data.continue;
      const old = this.MusicState.file;
      if (data.file.lastIndexOf(".") === -1)
        this.MusicState.file = data.file + this.defaultMusicExt;
      else
        this.MusicState.file = data.file;
      if (data.url && data.url.length > 0)
        this.MusicState.url = data.url;
      else if (this.forcedDefaultMusicURL && this.forcedDefaultMusicURL.length > 0)
        this.MusicState.url = this.forcedDefaultMusicURL;
      else if (this.defaultMusicURL && this.defaultMusicURL.length > 0)
        this.MusicState.url = this.defaultMusicURL;
      else
        this.MusicState.url = "";
      if (this.MusicState.url.length > 0 && !this.MusicState.url.endsWith("/"))
        this.MusicState.url += "/";
      if (data.type && data.type.length > 0) {
        this.MusicState.url += data.type;
        if (this.MusicState.url.length > 0 && !this.MusicState.url.endsWith("/"))
          this.MusicState.url += "/";
      }
      if (old !== this.MusicState.file || !data.continue || !this.MusicState.playing) {
        if (this.enableSound)
          this.MusicState.play();
        else
          this.emit("playing", { type: 1, file: this.MusicState.file, sound: this.MusicState.sound, state: this.MusicState, duration: "--:--" });
      }
    }
    /**
     * sound - process music object and player/stop based on object options
     *
     * @param {Object} data Sound argument object, contains all settings
     * @todo make it play/stop sound
     */
    sound(data) {
      if (!this.enabled && !this.enableSound) return false;
      if (!data.file || data.file.length === 0) {
        if (data.off && data.url && data.url.length > 0)
          this.defaultSoundURL = data.url;
        else if (data.off)
          this.SoundState.stop();
        return;
      } else if (data.off) {
        this.SoundState.stop();
        return;
      }
      if (this.SoundState.playing && data.priority < this.SoundState.priority)
        return false;
      this.SoundState.volume = data.volume;
      this.SoundState.repeats = data.repeat;
      this.SoundState.priority = data.priority;
      if (data.file.lastIndexOf(".") === -1)
        this.SoundState.file = data.file + this.defaultSoundExt;
      else
        this.SoundState.file = data.file;
      if (data.url && data.url.length > 0)
        this.SoundState.url = data.url;
      else if (this.forcedDefaultSoundURL && this.forcedDefaultSoundURL.length > 0)
        this.SoundState.url = this.forcedDefaultSoundURL;
      else if (this.defaultSoundURL && this.defaultSoundURL.length > 0)
        this.SoundState.url = this.defaultSoundURL;
      else
        this.SoundState.url = "";
      if (this.SoundState.url.length > 0 && !this.SoundState.url.endsWith("/"))
        this.SoundState.url += "/";
      if (data.type && data.type.length > 0) {
        this.SoundState.url += data.type;
        if (this.SoundState.url.length > 0 && !this.SoundState.url.endsWith("/"))
          this.SoundState.url += "/";
      }
      if (this.enableSound)
        this.SoundState.play();
      else
        this.emit("playing", { type: 0, file: this.SoundState.file, sound: this.SoundState.sound, state: this.SoundState, duration: "--:--" });
    }
    /**
     * processOption - process telnet options, if its MSP handle it and correctly reply yes we support MSP or no don't
     *
     * @param {Object} data Telnet#replyToOption event object
     */
    processOption(data) {
      if (data.option === 90) {
        this.debug("<MSP>");
        if (data.verb === 253) {
          this.server = true;
          if (this.enabled) {
            this.debug("REPLY: <IAC><WILL><MSP>");
            data.telnet.sendData([255, 251, 90], true);
          } else {
            this.debug("REPLY: <IAC><DONT><MSP>");
            data.telnet.sendData([255, 254, 90], true);
          }
        } else if (data.verb === 254) {
          this.server = false;
          this.debug("REPLY: <IAC><WONT><MSP>");
          data.telnet.sendData([255, 252, 90], true);
        } else if (data.verb === 251) {
          this.server = true;
          if (this.enabled) {
            this.debug("REPLY: <IAC><DO><MSP>");
            data.telnet.sendData([255, 253, 90], true);
          } else {
            this.debug("REPLY: <IAC><DONT><MSP>");
            data.telnet.sendData([255, 254, 90], true);
          }
        } else if (data.verb === 252) {
          this.server = false;
          this.debug("REPLY: <IAC><DONT><MSP>");
          data.telnet.sendData([255, 254, 90], true);
        }
        data.handled = true;
      }
    }
    /**
     * processGMCP - process incoming GMCP for Client.Media events
     * @param {string} mod Client#received-GMCP module
     * @param {Object} data Client#received-GMCP data object
     */
    async processGMCP(mod, data) {
      switch (mod) {
        case "Client.Media.Default":
          if (data.type === "sound" || !data.type)
            this.sound({ off: true, url: data.url });
          else if (data.type === "music")
            this.music({ off: true, url: data.url });
          break;
        //as we don't support loading and caching of media ignore this
        case "Client.Media.Load":
          break;
        case "Client.Media.Play":
          const sound2 = { off: false, file: data.name, url: "", volume: 50, repeat: 1, priority: 50, type: "", continue: true };
          if (data.hasOwnProperty("url"))
            sound2.url = data.url;
          if (data.hasOwnProperty("tag"))
            sound2.type = data.tag;
          if (data.hasOwnProperty("volume"))
            sound2.volume = data.volume;
          if (data.hasOwnProperty("loops"))
            sound2.repeat = data.loops;
          if (data.hasOwnProperty("priority"))
            sound2.priority = data.priority;
          if (data.type === "sound" || !data.type)
            this.sound(sound2);
          else if (data.type === "music") {
            if (data.hasOwnProperty("continue") && (data.continue === "false" || !data.continue))
              sound2.continue = false;
            this.music(sound2);
          }
          break;
        case "Client.Media.Stop":
          if (data.type === "sound" || !data.type)
            this.sound({ off: true });
          else if (data.type === "music")
            this.music({ off: true });
          break;
      }
    }
    /**
     * debug - emit debug event if enabledDebug on
     * @param {string | object} e The debug message or an object of data 
     */
    debug(e) {
      if (!this.enableDebug) return;
      this.emit("debug", e);
    }
    /**
     * Process function event to execute custom text functions
     * @param data {FunctionEvent} The data about the function to execute
     */
    processFunction(data) {
      let args;
      let tmp;
      let i;
      if (!data) return;
      switch (data.name.toLowerCase()) {
        case "soundinfo":
          if (this.SoundState.playing)
            this.client.echo("Playing Sound - " + this.SoundState.file + " - " + buzz.toTimer(this.SoundState.sound.getTime()) + "/" + buzz.toTimer(this.SoundState.sound.getDuration()), -7, -8, true, true);
          else
            this.client.echo("No sound currently playing.", -7, -8, true, true);
          data.handled = true;
          break;
        case "musicinfo":
          if (this.MusicState.playing)
            this.client.echo("Playing Music - " + this.MusicState.file + " -  " + buzz.toTimer(this.MusicState.sound.getTime()) + "/" + buzz.toTimer(this.MusicState.sound.getDuration()), -7, -8, true, true);
          else
            this.client.echo("No music currently playing.", -7, -8, true, true);
          data.handled = true;
          break;
        case "playmusic":
        case "playm":
          args = this.client.input.parseOutgoing(data.args.join(" "), false);
          tmp = { off: false, file: "", url: "", volume: 100, repeat: 1, priority: 50, type: "", continue: true };
          i = args.lastIndexOf("/");
          if (i === -1)
            tmp.file = args;
          else {
            tmp.file = args.substring(i + 1);
            tmp.url = args.substring(0, i + 1);
          }
          this.music(tmp);
          data.handled = true;
          break;
        case "playsound":
        case "plays":
          args = this.client.input.parseOutgoing(data.args.join(" "), false);
          tmp = { off: false, file: "", url: "", volume: 100, repeat: 1, priority: 50, type: "", continue: true };
          i = args.lastIndexOf("/");
          if (i === -1)
            tmp.file = args;
          else {
            tmp.file = args.substring(i + 1);
            tmp.url = args.substring(0, i + 1);
          }
          this.sound(tmp);
          data.handled = true;
          break;
        case "stopmusic":
        case "stopm":
          this.MusicState.close();
          data.handled = true;
          break;
        case "stopsound":
        case "stops":
          this.SoundState.close();
          data.handled = true;
          break;
        case "stopallsound":
        case "stopa":
          this.MusicState.close();
          this.SoundState.close();
          data.handled = true;
          break;
      }
    }
  };

  // src/plugins/test.ts
  var Test = class extends Plugin {
    constructor(client) {
      super(client);
      /**
       * Contains a list of functions
       * @type {object}
       * @memberof Tests
       */
      this.functions = {};
      this._event = (data) => this.processFunction(data);
      this.functions["testfile"] = (data) => {
        if (data && data.args && data.args.length)
          throw new Error("Invalid syntax use " + this.client.getOption("commandChar") + "testfile");
        openFileDialog().then((files) => {
          console.time("testfile readFile");
          readFile(files[0]).then((contents) => {
            console.timeEnd("testfile readFile");
            if (data && data.raw && (this.client.getOption("echo") & 4) === 4)
              this.client.echo(data.raw, -3, -4, true, true);
            let n = this.client.getOption("enableCommands");
            this.client.setOption("enableCommands", true);
            let i = (/* @__PURE__ */ new Date()).getTime();
            console.time("testfile parse");
            this.client.sendCommand(contents, null, this.client.getOption("allowCommentsFromCommand"));
            console.timeEnd("testfile parse");
            let p = (/* @__PURE__ */ new Date()).getTime();
            this.client.setOption("enableCommands", n);
            this.client.print(`Time: ${p - i}
`, true);
          }).catch(this.client.error);
        }).catch(() => {
        });
      };
      this.functions["testspeedfile"] = (data) => {
        if (data && data.args && data.args.length)
          throw new Error("Invalid syntax use " + this.client.getOption("commandChar") + "testspeedfile");
        openFileDialog().then((files) => {
          console.time("testspeedfile readFile");
          readFile(files[0]).then((contents) => {
            console.timeEnd("testspeedfile readFile");
            if (data && data.raw && (this.client.getOption("echo") & 4) === 4)
              this.client.echo(data.raw, -3, -4, true, true);
            let avg = 0;
            let max = 0;
            let min = 0;
            let items = [];
            let p;
            console.time(`testspeedfile`);
            for (let i = 0; i < 10; i++) {
              const start = (/* @__PURE__ */ new Date()).getTime();
              console.time(`testspeedfile parse ${i}`);
              this.client.sendCommand(contents, null, this.client.getOption("allowCommentsFromCommand"));
              console.timeEnd(`testspeedfile parse ${i}`);
              const end = (/* @__PURE__ */ new Date()).getTime();
              p = end - start;
              avg += p;
              if (p > max) max = p;
              if (!min || p < min) min = p;
              items.push(`${i} - ${p}`);
            }
            console.timeEnd(`testspeedfile`);
            items.push(`Total - ${avg}`);
            items.push(`Average - ${avg / 10}`);
            items.push(`Min - ${min}`);
            items.push(`Max - ${max}`);
            this.client.print(items.join("\n") + "\n", true);
          }).catch(this.client.error);
        }).catch(() => {
        });
      };
      this.functions["testspeedfiler"] = (data) => {
        if (data && data.args && data.args.length)
          throw new Error("Invalid syntax use " + this.client.getOption("commandChar") + "testspeedfiler");
        openFileDialog().then((files) => {
          console.time("testspeedfile readFile");
          readFile(files[0]).then((contents) => {
            console.timeEnd("testspeedfile readFile");
            if (data && data.raw && (this.client.getOption("echo") & 4) === 4)
              this.client.echo(data.raw, -3, -4, true, true);
            let avg = 0;
            let max = 0;
            let min = 0;
            let items = [];
            let p;
            console.time(`testspeedfile`);
            for (let i = 0; i < 10; i++) {
              const start = (/* @__PURE__ */ new Date()).getTime();
              console.time(`testspeedfile parse ${i}`);
              this.client.telnet.receivedData(StringToUint8Array(contents), true, true);
              console.timeEnd(`testspeedfile parse ${i}`);
              const end = (/* @__PURE__ */ new Date()).getTime();
              p = end - start;
              avg += p;
              if (p > max) max = p;
              if (!min || p < min) min = p;
              items.push(`${i} - ${p}`);
            }
            console.timeEnd(`testspeedfile`);
            items.push(`Total - ${avg}`);
            items.push(`Average - ${avg / 10}`);
            items.push(`Min - ${min}`);
            items.push(`Max - ${max}`);
            this.client.print(items.join("\n") + "\n", true);
          }).catch(this.client.error);
        }).catch(() => {
        });
      };
      this.functions["testlist"] = () => {
        let sample = "Test commands:\n";
        let t;
        for (t in this.functions) {
          if (!this.functions.hasOwnProperty(t)) continue;
          sample += `	${this.client.getOption("commandChar") + t}
`;
        }
        sample += `	${this.client.getOption("commandChar")}testfile file
`;
        sample += `	${this.client.getOption("commandChar")}testspeedfile file
`;
        sample += `	${this.client.getOption("commandChar")}testspeedfiler file
`;
        this.client.print(sample, true);
      };
      this.functions["testcolors"] = () => {
        let r;
        let sample = "Colors and Styles\n-------------------------------------------------------------------------------------------\n";
        for (r = 30; r < 38; r++) {
          sample += "\x1B[" + r + ";0m" + r + "\x1B[0m ";
          sample += "\x1B[" + r + ";1mBold\x1B[0m ";
          sample += "\x1B[" + r + ";2mFaint\x1B[0m ";
          sample += "\x1B[" + r + ";3mItalic\x1B[0m ";
          sample += "\x1B[" + r + ";4mUnderline\x1B[0m ";
          sample += "\x1B[" + r + ";5mFlash\x1B[0m ";
          sample += "\x1B[" + r + ";7mInverse\x1B[0m ";
          sample += "\x1B[" + r + ";8mConceal\x1B[0m ";
          sample += "\x1B[" + r + ";9mStrikeout\x1B[0m ";
          sample += "\x1B[" + r + ";21mDoubleUnderline\x1B[0m ";
          sample += "\x1B[" + r + ";53mOverline\x1B[0m ";
          sample += "\x1B[" + r + ";1;2;3;4;5;9;21;53mAll\x1B[0m";
          sample += "\x1B[0m\n";
        }
        for (r = 40; r < 48; r++) {
          sample += "\x1B[" + r + ";0m" + r + "\x1B[0m ";
          sample += "\x1B[" + r + ";1mBold\x1B[0m ";
          sample += "\x1B[" + r + ";2mFaint\x1B[0m ";
          sample += "\x1B[" + r + ";3mItalic\x1B[0m ";
          sample += "\x1B[" + r + ";4mUnderline\x1B[0m ";
          sample += "\x1B[" + r + ";5mFlash\x1B[0m ";
          sample += "\x1B[" + r + ";7mInverse\x1B[0m ";
          sample += "\x1B[" + r + ";8mConceal\x1B[0m ";
          sample += "\x1B[" + r + ";9mStrikeout\x1B[0m ";
          sample += "\x1B[" + r + ";21mDoubleUnderline\x1B[0m ";
          sample += "\x1B[" + r + ";53mOverline\x1B[0m ";
          sample += "\x1B[" + r + ";1;2;3;4;5;9;21;53mAll\x1B[0m";
          sample += "\x1B[0m\n";
        }
        sample += "-------------------------------------------------------------------------------------------\n";
        this.client.print(sample, true);
      };
      this.functions["testcolorsdetails"] = () => {
        let sample = "";
        if (this.client.telnet.prompt)
          sample = "\n";
        sample += "Table for 16-color terminal escape sequences.\n";
        sample += "\n";
        sample += "Background        | Foreground colors\n";
        sample += "------------------------------------------------------------------------------------\n";
        for (let bg = 40; bg <= 47; bg++) {
          let a;
          for (a in Ansi) {
            if (typeof Ansi[a] !== "number") continue;
            if (a === "Rapid") continue;
            if (a === "None")
              sample += "\x1B[0m " + AnsiColorCode[bg - 10].toString().padEnd(16) + " | ";
            else
              sample += "\x1B[0m " + a.padEnd(16) + " | ";
            for (let fg = 30; fg <= 37; fg++) {
              if (a === "None")
                sample += "\x1B[" + bg + "m\x1B[" + fg + "m " + ("[" + fg + "m").padEnd(7);
              else
                sample += "\x1B[" + bg + "m\x1B[" + Ansi[a] + ";" + fg + "m " + ("[" + Ansi[a] + ";" + fg + "m").padEnd(7);
            }
            sample += "\x1B[0m\n";
          }
          sample += "------------------------------------------------------------------------------------\n";
        }
        this.client.print(sample, true);
      };
      this.functions["testxterm"] = (title) => {
        let r;
        let g;
        let b;
        let c;
        let sample = "";
        if (typeof title !== "undefined" && title.length > 0) {
          sample += "Set Title: ";
          sample += title;
          sample += "\x1B]0;";
          sample += title;
          sample += "\x07\n";
        }
        sample += "System colors:\n";
        for (c = 0; c < 8; c++)
          sample += "\x1B[48;5;" + c + "m  ";
        sample += "\x1B[0m\n";
        for (c = 8; c < 16; c++)
          sample += "\x1B[48;5;" + c + "m  ";
        sample += "\x1B[0m\n\n";
        sample += "Color cube, 6x6x6:\n";
        for (g = 0; g < 6; g++) {
          for (r = 0; r < 6; r++) {
            for (b = 0; b < 6; b++) {
              c = 16 + r * 36 + g * 6 + b;
              sample += "\x1B[48;5;" + c + "m  ";
            }
            sample += "\x1B[0m ";
          }
          sample += "\n";
        }
        sample += "Grayscale ramp:\n";
        for (c = 232; c < 256; c++)
          sample += "\x1B[48;5;" + c + "m  ";
        sample += "\x1B[0m\n";
        this.client.print(sample, true);
      };
      this.functions["testmxp"] = () => {
        let sample = "Text Formatting\n";
        sample += "	\x1B[6z";
        sample += "<!--Test-->&lt;!--Test--&gt;\n";
        sample += "	<!--Test>-->&lt;!--Test&gt;--&gt;\n";
        sample += "	<STRONG>STRONG</STRONG>\n";
        sample += "	<BOLD>BOLD</BOLD>\n";
        sample += "	<B>B</B>\n";
        sample += "	<I>I</I>\n";
        sample += "	<ITALIC>ITALIC</ITALIC>\n";
        sample += "	<EM>EM</EM>\n";
        sample += "	<U>U</U>\n";
        sample += "	<UNDERLINE>UNDERLINE</UNDERLINE>\n";
        sample += "	<S>S</S>\n";
        sample += "	<STRIKEOUT>STRIKEOUT</STRIKEOUT>\n";
        sample += "	<H>H</H>\n";
        sample += "	<HIGH>HIGH</HIGH>\n";
        sample += "	<C RED>C RED</C>\n";
        sample += "	<COLOR #F00>COLOR #F00</COLOR>\n";
        sample += "	<C Maroon>C Maroon</C>\n";
        sample += "	<COLOR #800000>COLOR #800000</COLOR>\n";
        sample += "	<H><C Maroon>H C Maroon</C></H>\n";
        sample += "	<H><COLOR #800000>H COLOR #800000</COLOR></H>\n";
        sample += "	Run <send PROMPT>#testmxpcolors</send> for a detailed list.\n";
        sample += '	<FONT "Times New Roman">FONT "Times New Roman"</FONT>\n';
        sample += '	<FONT "Webdings">FONT "Webdings"</FONT>\n';
        sample += "	<FONT COLOR=Red,Blink>FONT COLOR=Red,Blink</FONT>\n";
        sample += '	<FONT "Times New Roman" 24 RED GREEN>FONT "Times New Roman" 24 RED GREEN</FONT>\n';
        sample += "Line Spacing\n";
        sample += "	NOBR<NOBR>\n";
        sample += " Continued<NOBR>\n";
        sample += " More\n";
        sample += "	<P>P\n";
        sample += "	1\n";
        sample += "	2\n";
        sample += "	3\n";
        sample += "	4</P>\n";
        sample += "	BR Line<BR>Break\n";
        sample += "	SBR Soft<SBR>Break\n";
        sample += "Links\n";
        sample += '	<A "http://shadowmud.com">Click here for ShadowMUD</A> \n';
        sample += "	<send>test command</send>\n";
        sample += '	<send href="command2">test command2</send>\n';
        sample += '	<send "command1|command2|command3" hint="click to see menu|Item 1|Item 2|Item 3">this is a menu link</SEND>\n';
        sample += '	<SEND "sample" PROMPT EXPIRE=prompt>Prompt sample</SEND>\n';
        sample += '	<send PROMPT href="#testmxpexpire">&lt;EXPIRE&gt; - #testmxpexpire</send> \n';
        sample += "Horizontal Rule\n";
        sample += "<hr>\n";
        sample += "<hr>Text After\n";
        sample += "Text Before<hr>\n";
        sample += "<c red blue><hr></c>\n";
        sample += "Text Before<hr>Text After\n";
        sample += "Custom Element\n";
        sample += `	<!ELEMENT help '<send href="help &text;">'>&lt;!ELEMENT help '&lt;send href="help &amp;text;"&gt;'&gt;
`;
        sample += "	&lt;help&gt;test&lt;/help&gt; = <help>test</help>\n";
        sample += "	<!ELEMENT redbu '<c red><b><u>'>&lt;!ELEMENT redbu '&lt;c red&gt;&lt;b&gt;&lt;u&gt;'&gt;\n";
        sample += "	&lt;redbu&gt;test&lt;/redbu&gt; = <redbu>test</redbu>\n";
        sample += "Entities\n";
        sample += "	&#243;&brvbar;&copy;&plusmn;&sup3;&para;&frac34;&infin;&Dagger;&dagger;&spades;&clubs;&hearts;&diams;\n";
        sample += "Custom Entity\n";
        sample += '	<!ENTITY version "' + this.client.version + '">&lt;!ENTITY version "' + this.client.version + '"&gt;\n';
        sample += "	&amp;version; = &version;\n";
        sample += "	&lt;V Hp&gt;<V Hp>100</V>&lt;/V&gt; &amp;Hp; = &Hp; &amp;hp; = &hp;\n";
        sample += "	&lt;VAR Sp&gt;<VAR Sp>200</VAR>&lt;/VAR&gt; &amp;Sp; = &Sp; &amp;sp; = &sp;\n";
        sample += "Image\n";
        sample += 'default      <image 48x48.png URL="./../assets/icons/png/" w=48 h=48>\n';
        sample += 'align left <image 48x48.png URL="./../assets/icons/png/" align=left w=48 h=48> align left\n';
        sample += 'align right  <image 48x48.png URL="./../assets/icons/png/" align=right w=48 h=48> align right\n';
        sample += 'align top    <image 48x48.png URL="./../assets/icons/png/" align=top w=48 h=48> align top \n';
        sample += 'align middle <image 48x48.png URL="./../assets/icons/png/" align=middle w=48 h=48> align middle\n';
        sample += 'align bottom <image 48x48.png URL="./../assets/icons/png/" align=bottom w=48 h=48> align bottom\n';
        sample += 'map          <send showmap><image 48x48.png URL="./../assets/icons/png/" ismap w=48 h=48></send>\n';
        sample += "<STAT Hp version Test>";
        sample += "<GAUGE Hp version Test>";
        sample += "\x1B[0z";
        this.client.print(sample, true);
      };
      this.functions["testmxp2"] = () => {
        let sample = "\x1B[6z";
        sample += "<!-- Elements to support the Auto mapper -->";
        sample += `<!ELEMENT RName '<FONT COLOR=Red><B>' FLAG="RoomName">`;
        sample += "<!ELEMENT RDesc FLAG='RoomDesc'>";
        sample += "<!ELEMENT RExits '<FONT COLOR=Blue>' FLAG='RoomExit'>";
        sample += "<!-- The next element is used to define a room exit link that sends ";
        sample += "the exit direction to the MUD if the user clicks on it -->";
        sample += "<!ELEMENT Ex '<SEND>'>";
        sample += "<!ELEMENT Chat '<FONT COLOR=Gray>' OPEN>";
        sample += "<!ELEMENT Gossip '<FONT COLOR=Cyan>' OPEN>";
        sample += "<!-- in addition to standard HTML Color specifications, you can use ";
        sample += "color attribute names such as blink -->";
        sample += "<!ELEMENT ImmChan '<FONT COLOR=Red,Blink>'>";
        sample += "<!ELEMENT Auction '<FONT COLOR=Purple>' OPEN>";
        sample += "<!ELEMENT Group '<FONT COLOR=Blue>' OPEN>";
        sample += "<!-- the next elements deal with the MUD prompt -->";
        sample += '<!ELEMENT Prompt FLAG="Prompt">';
        sample += '<!ELEMENT Hp FLAG="Set hp">';
        sample += '<!ELEMENT MaxHp FLAG="Set maxhp">';
        sample += '<!ELEMENT Mana FLAG="Set mana">';
        sample += '<!ELEMENT MaxMana FLAG="Set maxmana">';
        sample += "<!-- now the MUD text -->";
        sample += "<RName>The Main Temple</RName>\n";
        sample += "<RDesc>This is the main hall of the MUD where everyone starts.\n";
        sample += "Marble arches lead south into the town, and there is a <i>lovely</i>\n";
        sample += '<send "drink &text;">fountain</send> in the center of the temple,</RDesc>\n';
        sample += "<RExits>Exits: <Ex>N</Ex>, <Ex>S</Ex>, <Ex>E</Ex>, <Ex>W</Ex></RExits>\n\n";
        sample += "<Prompt>[<Hp>100</Hp>/<MaxHp>120</MaxHp>hp <Mana>50</Mana>/<MaxMana>55</MaxMana>mana]</Prompt>\n<hr>";
        sample += "<!ELEMENT boldtext '<COLOR &col;><B>' ATT='col=red'>";
        sample += "<boldtext>This is bold red</boldtext>\n";
        sample += "<boldtext col=blue>This is bold blue text</boldtext>\n";
        sample += "<boldtext blue>This is also bold blue text</boldtext>\n";
        sample += "\x1B[0z";
        this.client.print(sample, true);
      };
      this.functions["testmxpexpire"] = () => {
        this.client.print('	\x1B[6z<SEND "sample" PROMPT EXPIRE=prompt>Expire sample</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire sample2</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire sample3</SEND>\x1B[0z\n', true);
        this.client.print('	\x1B[6z\x1B[36m<SEND "sample" PROMPT EXPIRE=prompt>Expire sample</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire sample2</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire sample3</SEND>\x1B[0z\x1B[0m\n', true);
        this.client.print('	\x1B[6z\x1B[46;30m<SEND "sample" PROMPT EXPIRE=prompt>Expire sample</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire sample2</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire sample3</SEND>\x1B[0z\x1B[0m\n', true);
        this.client.print('	\x1B[6z<SEND "sample" PROMPT EXPIRE=prompt>Expire \x1B[36msample\x1B[0m</SEND> <SEND "sample" PROMPT EXPIRE=prompt2>Expire \x1B[36msample2\x1B[0m</SEND><EXPIRE prompt> <SEND "sample" PROMPT EXPIRE=prompt>Expire \x1B[36msample3\x1B[0m</SEND>\x1B[0z\n', true);
      };
      this.functions["testmxpcolors"] = () => {
        const colors = [
          "IndianRed",
          "LightCoral",
          "Salmon",
          "DarkSalmon",
          "LightSalmon",
          "Crimson",
          "Red",
          "FireBrick",
          "DarkRed",
          "Pink",
          "LightPink",
          "HotPink",
          "DeepPink",
          "MediumVioletRed",
          "PaleVioletRed",
          "LightSalmon",
          "Coral",
          "Tomato",
          "OrangeRed",
          "DarkOrange",
          "Orange",
          "Gold",
          "Yellow",
          "LightYellow",
          "LemonChiffon",
          "LightGoldenrodYellow",
          "PapayaWhip",
          "Moccasin",
          "PeachPuff",
          "PaleGoldenrod",
          "Khaki",
          "DarkKhaki",
          "Lavender",
          "Thistle",
          "Plum",
          "Violet",
          "Orchid",
          "Fuchsia",
          "Magenta",
          "MediumOrchid",
          "MediumPurple",
          "BlueViolet",
          "DarkViolet",
          "DarkOrchid",
          "DarkMagenta",
          "Purple",
          "Indigo",
          "SlateBlue",
          "DarkSlateBlue",
          "MediumSlateBlue",
          "GreenYellow",
          "Chartreuse",
          "LawnGreen",
          "Lime",
          "LimeGreen",
          "PaleGreen",
          "LightGreen",
          "MediumSpringGreen",
          "SpringGreen",
          "MediumSeaGreen",
          "SeaGreen",
          "ForestGreen",
          "Green",
          "DarkGreen",
          "YellowGreen",
          "OliveDrab",
          "Olive",
          "DarkOliveGreen",
          "MediumAquamarine",
          "DarkSeaGreen",
          "LightSeaGreen",
          "DarkCyan",
          "Teal",
          "Aqua",
          "Cyan",
          "LightCyan",
          "PaleTurquoise",
          "Aquamarine",
          "Turquoise",
          "MediumTurquoise",
          "DarkTurquoise",
          "CadetBlue",
          "SteelBlue",
          "LightSteelBlue",
          "PowderBlue",
          "LightBlue",
          "SkyBlue",
          "LightSkyBlue",
          "DeepSkyBlue",
          "DodgerBlue",
          "CornflowerBlue",
          "MediumSlateBlue",
          "RoyalBlue",
          "Blue",
          "MediumBlue",
          "DarkBlue",
          "Navy",
          "MidnightBlue",
          "Cornsilk",
          "BlanchedAlmond",
          "Bisque",
          "NavajoWhite",
          "Wheat",
          "BurlyWood",
          "Tan",
          "RosyBrown",
          "SandyBrown",
          "Goldenrod",
          "DarkGoldenrod",
          "Peru",
          "Chocolate",
          "SaddleBrown",
          "Sienna",
          "Brown",
          "Maroon",
          "White",
          "Snow",
          "Honeydew",
          "MintCream",
          "Azure",
          "AliceBlue",
          "GhostWhite",
          "WhiteSmoke",
          "Seashell",
          "Beige",
          "OldLace",
          "FloralWhite",
          "Ivory",
          "AntiqueWhite",
          "Linen",
          "LavenderBlush",
          "MistyRose",
          "Gainsboro",
          "LightGrey",
          "Silver",
          "DarkGray",
          "Gray",
          "DimGray",
          "LightSlateGray",
          "SlateGray",
          "DarkSlateGray",
          "Black"
        ];
        let sample = "\x1B[6z";
        const cl = colors.length - 1;
        for (let c = 0; c < cl; c++) {
          sample += "" + colors[c] + ": ";
          sample += Array(22 - colors[c].length).join(" ");
          sample += "<C " + colors[c] + ">Fore</C> ";
          sample += "<C black " + colors[c] + ">Back</C> ";
          sample += "<h><C " + colors[c] + ">High</C></h> ";
          sample += "<b><C " + colors[c] + ">Bold</C></b> ";
          sample += "<C " + colors[c] + ">\x1B[1mAnsiBold\x1B[0m ";
          sample += "\x1B[2mFaint\x1B[0m ";
          sample += "\x1B[3mItalic\x1B[0m ";
          sample += "\x1B[4mUnderline\x1B[0m ";
          sample += "\x1B[5mFlash\x1B[0m ";
          sample += "\x1B[7mInverse\x1B[0m ";
          sample += "\x1B[8mConceal\x1B[0m ";
          sample += "\x1B[9mStrikeout\x1B[0m ";
          sample += "\x1B[21mDoubleUnderline\x1B[0m ";
          sample += "\x1B[53mOverline\x1B[0m";
          sample += "</C>\n";
        }
        sample += "Black: ";
        sample += Array(17).join(" ");
        sample += "<C Black silver>Fore</C> ";
        sample += "<C silver Black>Back</C> ";
        sample += "<h><C Black silver>High</C></h> ";
        sample += "<b><C Black silver>Bold</C></b> ";
        sample += "<C Black silver>\x1B[1mAnsiBold\x1B[0m ";
        sample += "\x1B[2mFaint\x1B[0m ";
        sample += "\x1B[3mItalic\x1B[0m ";
        sample += "\x1B[4mUnderline\x1B[0m ";
        sample += "\x1B[5mFlash\x1B[0m ";
        sample += "\x1B[7mInverse\x1B[0m ";
        sample += "\x1B[8mConceal\x1B[0m ";
        sample += "\x1B[9mStrikeout\x1B[0m ";
        sample += "\x1B[21mDoubleUnderline\x1B[0m ";
        sample += "\x1B[53mOverline\x1B[0m";
        sample += "</C>\n";
        sample += "\x1B[0z";
        this.client.print(sample, true);
      };
      this.functions["testmxpelements"] = () => {
        let sample = "\x1B[6z";
        sample += "Custom Element\n";
        sample += `	<!ELEMENT help '<send href="help &text;">'>&lt;!ELEMENT help '&lt;send href="help &amp;text;"&gt;'&gt;
`;
        sample += "	&lt;help&gt;test&lt;/help&gt; = <help>test</help>\n";
        sample += "	<!ELEMENT redbu '<c red><b><u>'>&lt;!ELEMENT redbu '&lt;c red&gt;&lt;b&gt;&lt;u&gt;'&gt;\n";
        sample += "	&lt;redbu&gt;test&lt;/redbu&gt; = <redbu>test</redbu>\n";
        sample += "\x1B[0z";
        this.client.print(sample, true);
      };
      this.functions["testmxpLines"] = () => {
        let sample = "\x1B[6z";
        sample += "<!ELEMENT Auction '<FONT COLOR=red>' TAG=20 OPEN>";
        sample += "\x1B[20zA nice shiny sword is being auctioned.\n";
        sample += "\x1B[6z<Auction>Also, a gold ring is being auctioned.</Auction>";
        sample += "<!ELEMENT Auction TAG=20>\n";
        sample += "<!TAG 20 Fore=red>\n";
        sample += "\x1B[20zA nice shiny sword is being auctioned.\n";
        sample += "\x1B[6z<Auction>Also, a gold ring is being auctioned.</Auction>\n";
        sample += "\x1B[6z<!TAG 20 Fore=blue>\n";
        sample += "\x1B[20zA nice shiny sword is being auctioned.\n";
        sample += "\x1B[6z<Auction>Also, a gold ring is being auctioned.</Auction>\n";
        sample += "\x1B[0z";
        this.client.print(sample, true);
      };
      this.functions["testmapper"] = () => {
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: 0, dir: "", area: "" },
          area: "Doc Build Samples Area",
          exits: {
            south: { num: 87723359, dir: "south", area: "Doc Build Samples Area", isdoor: 0 },
            east: { num: -329701270, dir: "east", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 1",
          num: 1968208336,
          indoors: 0
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: 1968208336, dir: "east", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          environment: "wood",
          exits: {
            south: { num: 1916648905, dir: "south", area: "Doc Build Samples Area", isdoor: 0 },
            east: { num: -1688332036, dir: "east", area: "Doc Build Samples Area", isdoor: 0 },
            west: { num: 1968208336, dir: "west", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 2",
          num: -329701270,
          indoors: 0
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: -329701270, dir: "east", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          environment: "jungle",
          exits: {
            south: { num: -348853133, dir: "south", area: "Doc Build Samples Area", isdoor: 0 },
            west: { num: -329701270, dir: "west", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 3",
          num: -1688332036,
          indoors: 0
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: -1688332036, dir: "south", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          environment: "grass",
          exits: {
            north: { num: -1688332036, dir: "north", area: "Doc Build Samples Area", isdoor: 0 },
            south: { num: 2072768994, dir: "south", area: "Doc Build Samples Area", isdoor: 0 },
            west: { num: 1916648905, dir: "west", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 6",
          num: -348853133,
          indoors: 0
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: -348853133, dir: "west", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          environment: "desert",
          exits: {
            north: { num: -329701270, dir: "north", area: "Doc Build Samples Area", isdoor: 0 },
            south: { num: 210551156, dir: "south", area: "Doc Build Samples Area", isdoor: 0 },
            east: { num: -348853133, dir: "east", area: "Doc Build Samples Area", isdoor: 0 },
            west: { num: 87723359, dir: "west", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 5",
          num: 1916648905,
          indoors: 1
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: 1916648905, dir: "west", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          environment: "tundra",
          exits: {
            north: { num: 1968208336, dir: "north", area: "Doc Build Samples Area", isdoor: 0 },
            south: { num: -1674322715, dir: "south", area: "Doc Build Samples Area", isdoor: 0 },
            east: { num: 87723359, dir: "east", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 4",
          num: 87723359,
          indoors: 0
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: 87723359, dir: "south", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          environment: "water",
          exits: {
            north: { num: 87723359, dir: "north", area: "Doc Build Samples Area", isdoor: 0 },
            east: { num: 210551156, dir: "east", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 7",
          num: -1674322715,
          indoors: 0
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: -1674322715, dir: "east", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          environment: "jungle",
          exits: {
            north: { num: 1916648905, dir: "north", area: "Doc Build Samples Area", isdoor: 0 },
            east: { num: 2072768994, dir: "east", area: "Doc Build Samples Area", isdoor: 0 },
            west: { num: -1674322715, dir: "west", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 8",
          num: 210551156,
          indoors: 0
        });
        this.client.emit("received-GMCP", "Room.Info", {
          details: [],
          doors: {},
          prevroom: { num: 210551156, dir: "east", area: "Doc Build Samples Area" },
          area: "Doc Build Samples Area",
          exits: {
            north: { num: -348853133, dir: "north", area: "Doc Build Samples Area", isdoor: 0 },
            west: { num: 210551156, dir: "west", area: "Doc Build Samples Area", isdoor: 0 }
          },
          name: "Sample room 9",
          num: 2072768994,
          indoors: 0
        });
      };
      this.functions["testfansi"] = () => {
        let sample = "";
        let i;
        sample = String.fromCharCode(1);
        for (i = 3; i <= 6; i++)
          sample += String.fromCharCode(i);
        for (i = 14; i <= 26; i++)
          sample += String.fromCharCode(i);
        for (i = 28; i <= 31; i++)
          sample += String.fromCharCode(i);
        for (i = 127; i <= 254; i++)
          sample += String.fromCharCode(i);
        sample += "\n";
        const dcc = this.client.display.displayControlCodes;
        this.client.display.displayControlCodes = true;
        if (!this.client.display.emulateTerminal) {
          this.client.print(sample, true);
          this.client.display.emulateTerminal = true;
          this.client.print(sample, true);
          this.client.display.emulateTerminal = false;
        } else {
          this.client.display.emulateTerminal = false;
          this.client.print(sample, true);
          this.client.display.emulateTerminal = true;
          this.client.print(sample, true);
        }
        this.client.display.displayControlCodes = dcc;
      };
      this.functions["testcontrolchars"] = () => {
        let i;
        let sample = "1:  " + String.fromCharCode(1) + ",";
        for (i = 3; i <= 9; i++)
          sample += `${i}: ${String.fromCharCode(i)},`;
        for (i = 11; i <= 27; i++)
          sample += `${i}: ${String.fromCharCode(i)},`;
        for (i = 28; i <= 31; i++)
          sample += `${i}: ${String.fromCharCode(i)},`;
        for (i = 127; i <= 254; i++)
          sample += `${i}: ${String.fromCharCode(i)},`;
        sample += "\n";
        const dcc = this.client.display.displayControlCodes;
        this.client.display.displayControlCodes = true;
        this.client.print(sample, true);
        this.client.display.displayControlCodes = dcc;
      };
      this.functions["testurldetect"] = () => {
        let sample = "\x1B[0mhttp://www.google.com\n";
        sample += "	http://www.google.com\x1B[44m\n";
        sample += "http://www.google.com\n";
        sample += "	try this http://www.google.com\n";
        sample += "http://www.google.com try this\n";
        sample += "	try this http://www.google.com try this\n";
        sample += "\x1B[36mhttp://www.google.com\n";
        sample += "	\x1B[0mhttp://www.google.com\n";
        sample += "http://www.google.com\x1B[44m\n";
        sample += "	http://www.google.com\n";
        sample += "try this http://www.google.com\n";
        sample += "	http://www.google.com try this\n";
        sample += "try this http://www.google.com try this\n";
        sample += "	\x1B[36mhttp://www.google.com\n";
        sample += "	https://localhost telnet://localhost\n";
        sample += "	news://test.edu/default.asp?t=1#1111 torrent://localhost/\n";
        sample += "	ftp://localhost gopher://localhost im://talk\n";
        sample += "	mailto:address@localhost irc://<host>[:<port>]/[<channel>[?<password>]]\n";
        sample += "awww... www.google.com awww.com\n";
        sample += "www.google.com www.google.com\x1B[0m";
        this.client.print(sample, true);
      };
      this.functions["testxtermrgb"] = () => {
        let sample = "";
        let r;
        let g;
        let b;
        let i = 0;
        for (r = 0; r < 256; r += 16) {
          for (g = 0; g < 256; g += 16) {
            for (b = 0; b < 256; b += 16) {
              sample += "\x1B[48;2;" + r + ";" + g + ";" + b + "m  ";
              if (i % 63 === 0)
                sample += "\n";
              i++;
            }
          }
        }
        sample += "\x1B[0m";
        this.client.print(sample, true);
      };
      this.functions["testsize"] = () => {
        const ws = this.client.display.WindowSize;
        let sample = ws.width + "x" + ws.height + " ";
        ws.width -= sample.length;
        for (let w = 0; w < ws.width; w++)
          sample += "w";
        for (let h = 1; h < ws.height; h++)
          sample += "\n" + h;
        this.client.print(sample, true);
      };
      this.functions["testspeed"] = () => {
        const sample = [];
        const commands = this.client.getOption("commandChar") + ["testmxpcolors", "testmxp", "testcolors", "testcolorsdetails", "testxterm", "testxtermrgb"].join("\n" + this.client.getOption("commandChar"));
        const e = this.client.getOption("enableCommands");
        this.client.setOption("enableCommands", true);
        let avg = 0;
        let max = 0;
        let min = 0;
        let t;
        for (let i = 0; i < 10; i++) {
          const start = (/* @__PURE__ */ new Date()).getTime();
          this.client.sendCommand(commands);
          const end = (/* @__PURE__ */ new Date()).getTime();
          t = end - start;
          avg += t;
          if (t > max) max = t;
          if (!min || t < min) min = t;
          sample.push(`${i} - ${t}`);
        }
        sample.push(`Total - ${avg}`);
        sample.push(`Average - ${avg / 10}`);
        sample.push(`Min - ${min}`);
        sample.push(`Max - ${max}`);
        this.client.print(sample.join("\n") + "\n", true);
        this.client.setOption("enableCommands", e);
      };
      this.functions["testperiod"] = () => {
        if (window["periodID"]) {
          clearInterval(window["periodID"]);
          delete window["period"];
          delete window["periodID"];
          return;
        }
        window["period"] = 0;
        window["periodID"] = setInterval(() => {
          if (window["period"] % 3 === 1)
            this.client.sendCommand("#testcolors");
          else if (window["period"] % 3 === 2)
            this.client.sendCommand("#testxterm");
          else
            this.client.sendCommand("#testlist");
          window["period"]++;
        }, 2e3);
      };
      this.functions["testutf8"] = () => {
        const sample = `Armenian
\u0531 \u0532 \u0533 \u0534 \u0535 \u0536 \u0537 \u0538 \u0539 \u053A \u053B \u053C \u053D \u053E \u053F \u0540 \u0541 \u0542 \u0543 \u0544 \u0545 \u0546 \u0547 \u0548 \u0549 \u054A \u054B \u054C \u054D \u054E \u054F \u0550 \u0551 \u0552 \u0553 \u0554 \u0555 \u0556 \u0559 \u055A \u055B \u055C \u055D \u055E \u055F \u0561 \u0562 \u0563 \u0564 \u0565 \u0566 \u0567 \u0568 \u0569 \u056A \u056B \u056C \u056D \u056E \u056F \u0570 \u0571 \u0572 \u0573 \u0574 \u0575 \u0576 \u0577 \u0578 \u0579 \u057A \u057B \u057C \u057D \u057E \u057F \u0580 \u0581 \u0582 \u0583 \u0584 \u0585 \u0586 \u0587 \u0589
Hebrew
\u0591 \u0592 \u0593 \u0594 \u0595 \u0596 \u0597 \u0598 \u0599 \u059A \u059B \u059C \u059D \u059E \u059F \u05A0 \u05A1 \u05A3 \u05A4 \u05A5 \u05A6 \u05A7 \u05A8 \u05A9 \u05AA \u05AB \u05AC \u05AD \u05AE \u05AF \u05B0 \u05B1 \u05B2 \u05B3 \u05B4 \u05B5 \u05B6 \u05B7 \u05B8 \u05B9 \u05BB \u05BC \u05BD \u05BE \u05BF \u05C0 \u05C1 \u05C2 \u05C3 \u05C4 \u05D0 \u05D1 \u05D2 \u05D3 \u05D4 \u05D5 \u05D6 \u05D7 \u05D8 \u05D9 \u05DA \u05DB \u05DC \u05DD \u05DE \u05DF \u05E0 \u05E1 \u05E2 \u05E3 \u05E4 \u05E5 \u05E6 \u05E7 \u05E8 \u05E9 \u05EA \u05F0 \u05F1 \u05F2 \u05F3 \u05F4
Arabic
\u060C \u061B \u061F \u0621 \u0622 \u0623 \u0624 \u0625 \u0626 \u0627 \u0628 \u0629 \u062A \u062B \u062C \u062D \u062E \u062F \u0630 \u0631 \u0632 \u0633 \u0634 \u0635 \u0636 \u0637 \u0638 \u0639 \u063A \u0640 \u0641 \u0642 \u0643 \u0644 \u0645 \u0646 \u0647 \u0648 \u0649 \u064A \u064B \u064C \u064D \u064E \u064F \u0650 \u0651 \u0652 \u0660 \u0661 \u0662 \u0663 \u0664 \u0665 \u0666 \u0667 \u0668 \u0669 \u066A \u066B \u066C \u066D \u0670 \u0671 \u0672 \u0673 \u0674 \u0675 \u0676 \u0677 \u0678 \u0679 \u067A \u067B \u067C \u067D \u067E \u067F \u0680 \u0681 \u0682 \u0683 \u0684 \u0685 \u0686 \u0687 \u0688 \u0689 \u068A \u068B \u068C \u068D \u068E \u068F \u0690 \u0691 \u0692 \u0693 \u0694 \u0695 \u0696 \u0697 \u0698 \u0699 \u069A \u069B \u069C \u069D \u069E \u069F \u06A0 \u06A1 \u06A2 \u06A3 \u06A4 \u06A5 \u06A6 \u06A7 \u06A8 \u06A9 \u06AA \u06AB \u06AC \u06AD \u06AE \u06AF \u06B0 \u06B1 ...
Devanagari
\u0901 \u0902 \u0903 \u0905 \u0906 \u0907 \u0908 \u0909 \u090A \u090B \u090C \u090D \u090E \u090F \u0910 \u0911 \u0912 \u0913 \u0914 \u0915 \u0916 \u0917 \u0918 \u0919 \u091A \u091B \u091C \u091D \u091E \u091F \u0920 \u0921 \u0922 \u0923 \u0924 \u0925 \u0926 \u0927 \u0928 \u0929 \u092A \u092B \u092C \u092D \u092E \u092F \u0930 \u0931 \u0932 \u0933 \u0934 \u0935 \u0936 \u0937 \u0938 \u0939 \u093C \u093D \u093E \u093F \u0940 \u0941 \u0942 \u0943 \u0944 \u0945 \u0946 \u0947 \u0948 \u0949 \u094A \u094B \u094C \u094D \u0950 \u0951 \u0952 \u0953 \u0954 \u0958 \u0959 \u095A \u095B \u095C \u095D \u095E \u095F \u0960 \u0961 \u0962 \u0963 \u0964 \u0965 \u0966 \u0967 \u0968 \u0969 \u096A \u096B \u096C \u096D \u096E \u096F \u0970
Armenian
\u0531 \u0532 \u0533 \u0534 \u0535 \u0536 \u0537 \u0538 \u0539 \u053A \u053B \u053C \u053D \u053E \u053F \x1B[33m\u0540 \u0541 \u0542 \u0543 \u0544 \u0545 \u0546 \u0547 \u0548 \u0549 \u054A \u054B \u054C \u054D \u054E \u054F \u0550 \u0551 \u0552 \x1B[34m\u0553 \u0554 \u0555 \u0556 \u0559 \u055A \u055B \u055C \u055D \u055E \u055F \u0561 \u0562 \u0563 \u0564 \u0565 \u0566 \u0567 \u0568 \u0569 \u056A \u056B \u056C \u056D \u056E \u056F \u0570\x1B[35m \u0571 \u0572 \u0573 \u0574 \u0575 \u0576 \u0577 \u0578 \u0579 \u057A \u057B \u057C \u057D \u057E \u057F \u0580 \u0581 \u0582 \u0583 \u0584 \u0585 \u0586 \u0587 \u0589\x1B[0m
Hebrew
\u0591 \u0592 \u0593 \u0594 \u0595 \u0596 \u0597 \u0598 \u0599 \u059A \u059B \u059C \u059D \u059E\x1B[33m \u059F \u05A0 \u05A1 \u05A3 \u05A4 \u05A5 \u05A6 \u05A7 \u05A8 \u05A9 \u05AA \u05AB \u05AC \u05AD \u05AE \u05AF \u05B0 \u05B1 \u05B2 \u05B3 \u05B4 \u05B5 \u05B6 \u05B7 \u05B8 \u05B9 \u05BB \u05BC \u05BD \u05BE \u05BF \u05C0 \u05C1 \u05C2 \u05C3 \u05C4 \u05D0 \u05D1 \u05D2 \u05D3 \u05D4 \u05D5 \u05D6 \u05D7 \u05D8 \u05D9 \u05DA \u05DB \u05DC\x1B[34m \u05DD \u05DE \u05DF \u05E0 \u05E1 \u05E2 \u05E3 \u05E4 \u05E5 \u05E6 \u05E7 \u05E8 \u05E9 \u05EA \u05F0 \u05F1 \u05F2 \u05F3 \u05F4\x1B[0m
\u0591 \u0592 \u0593 \u0594 \u0595 \u0596 \u0597 \u0598 \u0599 \u059A \u059B \u059C \u059D \u059E\x1B[33m \u059F \u05A0 \u05A1 \u05A3 \u05A4 \u05A5 \u05A6 \u05A7 \u05A8 \u05A9 \u05AA \u05AB \u05AC \u05AD \u05AE \u05AF \u05B0 \u05B1 \u05B2 \u05B3 \u05B4 \u05B5 \u05B6 \u05B7 \u05B8 \u05B9 \u05BB \u05BC \u05BD \u05BE \u05BF \u05C0 \u05C1 \u05C2 \u05C3 \u05C4 \u05D0 \u05D1 \u05D2 \u05D3 \u05D4 \u05D5 \u05D6 \u05D7 \u05D8 \u05D9 \u05DA \u05DB \u05DCa\x1B[34m \u05DD \u05DE \u05DF \u05E0 \u05E1 \u05E2 \u05E3 \u05E4 \u05E5 \u05E6 \u05E7 \u05E8 \u05E9 \u05EA \u05F0 \u05F1 \u05F2 \u05F3 \u05F4\x1B[0m
Arabic
\u060C \u061B \u061F \u0621 \u0622 \u0623 \u0624 \u0625 \u0626 \u0627 \u0628 \u0629 \u062A \u062B \u062C \u062D \u062E \u062F \u0630 \u0631 \u0632 \u0633 \u0634 \u0635 \u0636 \u0637 \u0638 \u0639\x1B[34m \u063A \u0640 \u0641 \u0642 \u0643 \u0644 \u0645 \u0646 \u0647 \u0648 \u0649 \u064A \u064B \u064C \u064D \u064E \u064F \u0650 \u0651 \u0652 \u0660 \u0661 \u0662 \u0663 \u0664 \u0665 \u0666 \u0667 \u0668 \u0669 \u066A \u066B \u066C \u066D \u0670 \u0671 \u0672 \u0673 \u0674 \u0675 \u0676 \u0677 \u0678 \u0679 \u067A \u067B \u067C \u067D \u067E \u067F \u0680 \u0681 \u0682 \u0683 \u0684 \u0685 \u0686 \u0687 \u0688 \u0689 \u068A \u068B \u068C \u068D \u068E \u068F \u0690 \u0691 \u0692 \u0693 \u0694 \u0695 \u0696 \u0697 \u0698 \u0699 \u069A \u069B \u069C \u069D \u069E \u069F \u06A0 \u06A1 \u06A2 \u06A3 \u06A4 \u06A5 \u06A6 \x1B[33m\u06A7 \u06A8 \u06A9 \u06AA \u06AB \u06AC \u06AD \u06AE \u06AF \u06B0 \u06B1 ...\x1B[0m
Devanagari
\u0901 \u0902 \u0903 \u0905 \u0906 \u0907 \u0908 \u0909 \u090A \u090B \u090C \u090D \u090E \u090F \u0910 \u0911 \u0912 \u0913 \u0914 \u0915 \u0916 \u0917 \u0918 \u0919 \u091A \u091B \u091C \u091D \u091E \u091F \u0920 \u0921 \u0922 \u0923 \u0924 \u0925 \u0926 \u0927 \u0928 \u0929 \u092A \x1B[33m\u092B \u092C \u092D \u092E \u092F \u0930 \u0931 \u0932 \u0933 \u0934 \u0935 \u0936 \u0937 \u0938 \u0939 \u093C \u093D \u093E \u093F \u0940 \u0941 \u0942 \u0943 \u0944 \u0945 \u0946 \u0947 \u0948 \u0949 \u094A \u094B \u094C \u094D \u0950 \u0951 \u0952 \u0953 \u0954 \u0958 \u0959 \u095A \u095B\x1B[34m \u095C \u095D \u095E \u095F \u0960 \u0961 \u0962 \u0963 \u0964 \u0965 \u0966 \u0967 \u0968 \u0969 \u096A \u096B \u096C \u096D \u096E \u096F \u0970\x1B[0m`;
        this.client.print(sample, true);
      };
      this.functions["testunicodeemoji"] = () => {
        let sample = "";
        var emojiRange = [
          [128513, 128591],
          //Emoticons ( 1F601 - 1F64F ) 
          [9986, 10160],
          //Dingbats ( 2702 - 27B0 ) 
          [128640, 128704],
          //Transport and map symbols ( 1F680 - 1F6C0 ) 
          //[0x24C2, 0x1F251], //Enclosed characters ( 24C2 - 1F251 ) 
          [128512, 128566],
          //Additional emoticons ( 1F600 - 1F636 )
          [128641, 128709],
          //Additional transport and map symbols ( 1F681 - 1F6C5 ) 
          [127757, 128359]
          //Other additional symbols ( 1F30D - 1F567 ) 
        ];
        var n = 0;
        for (var i = 0; i < emojiRange.length; i++) {
          var range = emojiRange[i];
          for (var x = range[0]; x < range[1]; x++) {
            sample += String.fromCodePoint(x);
            n++;
            if (n == 36) {
              sample += "\n";
              n = 0;
            }
          }
          sample += "\x1B[4z<hr>";
          n = 0;
        }
        let sample2 = `\x1B[4z<hr>\xA9\xAE\u203C\u2049#\u20E38\u20E39\u20E37\u20E30\u20E36\u20E35\u20E34\u20E33\u20E32\u20E31\u20E3\u2122\u2139\u2194\u2195\u2196\u2197\u2198\u2199\u21A9\u21AA\u231A\u231B\u23E9\u23EA\u23EB\u23EC\u23F0\u23F3\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FD\u25FE\u2600\u2601\u260E\u2611\u2614\u2615
\u261D\u263A\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2693\u26A0\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5
\u26FA\u26FD\u2934\u2935\u2B05\u2B06\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299\u{1F004}\u{1F0CF}\u{1F300}\u{1F301}\u{1F302}\u{1F303}\u{1F304}\u{1F305}\u{1F306}\u{1F307}\u{1F308}\u{1F309}\u{1F30A}\u{1F30B}\u{1F30C}\u{1F30F}\u{1F311}\u{1F313}\u{1F314}\u{1F315}
\u{1F319}\u{1F31B}\u{1F31F}\u{1F320}\u{1F330}\u{1F331}\u{1F334}\u{1F335}\u{1F337}\u{1F338}\u{1F339}\u{1F33A}\u{1F33B}\u{1F33C}\u{1F33D}\u{1F33E}\u{1F33F}\u{1F340}\u{1F341}\u{1F342}\u{1F343}\u{1F344}\u{1F345}\u{1F346}\u{1F347}\u{1F348}\u{1F349}\u{1F34A}\u{1F34C}\u{1F34D}\u{1F34E}\u{1F34F}\u{1F351}
\u{1F352}\u{1F353}\u{1F354}\u{1F355}\u{1F356}\u{1F357}\u{1F358}\u{1F359}\u{1F35A}\u{1F35B}\u{1F35C}\u{1F35D}\u{1F35E}\u{1F35F}\u{1F360}\u{1F361}\u{1F362}\u{1F363}\u{1F364}\u{1F365}\u{1F366}\u{1F367}\u{1F368}\u{1F369}\u{1F36A}\u{1F36B}\u{1F36C}\u{1F36D}\u{1F36E}\u{1F36F}\u{1F370}\u{1F371}\u{1F372}
\u{1F373}\u{1F374}\u{1F375}\u{1F376}\u{1F377}\u{1F378}\u{1F379}\u{1F37A}\u{1F37B}\u{1F380}\u{1F381}\u{1F382}\u{1F383}\u{1F384}\u{1F385}\u{1F386}\u{1F387}\u{1F388}\u{1F389}\u{1F38A}\u{1F38B}\u{1F38C}\u{1F38D}\u{1F38E}\u{1F38F}\u{1F390}\u{1F391}\u{1F392}\u{1F393}\u{1F3A0}\u{1F3A1}\u{1F3A2}\u{1F3A3}\u{1F3A4}
\u{1F3A5}\u{1F3A6}\u{1F3A7}\u{1F3A8}\u{1F3A9}\u{1F3AA}\u{1F3AB}\u{1F3AC}\u{1F3AD}\u{1F3AE}\u{1F3AF}\u{1F3B0}\u{1F3B1}\u{1F3B2}\u{1F3B3}\u{1F3B4}\u{1F3B5}\u{1F3B6}\u{1F3B7}\u{1F3B8}\u{1F3B9}\u{1F3BA}\u{1F3BB}\u{1F3BC}\u{1F3BD}\u{1F3BE}\u{1F3BF}\u{1F3C0}\u{1F3C1}\u{1F3C2}\u{1F3C3}\u{1F3C4}
\u{1F3C6}\u{1F3C8}\u{1F3CA}\u{1F3E0}\u{1F3E1}\u{1F3E2}\u{1F3E3}\u{1F3E5}\u{1F3E6}\u{1F3E7}\u{1F3E8}\u{1F3E9}\u{1F3EA}\u{1F3EB}\u{1F3EC}\u{1F3ED}\u{1F3EE}\u{1F3EF}\u{1F3F0}\u{1F40C}\u{1F40D}\u{1F40E}\u{1F411}\u{1F412}\u{1F414}\u{1F417}\u{1F418}\u{1F419}\u{1F41A}\u{1F41B}\u{1F41C}\u{1F41D}
\u{1F41E}\u{1F41F}\u{1F420}\u{1F421}\u{1F422}\u{1F423}\u{1F424}\u{1F425}\u{1F426}\u{1F427}\u{1F428}\u{1F429}\u{1F42B}\u{1F42C}\u{1F42D}\u{1F42E}\u{1F42F}\u{1F430}\u{1F431}\u{1F432}\u{1F433}\u{1F434}\u{1F435}\u{1F436}\u{1F437}\u{1F438}\u{1F439}\u{1F43A}\u{1F43B}\u{1F43C}\u{1F43D}\u{1F43E}
\u{1F440}\u{1F442}\u{1F443}\u{1F444}\u{1F445}\u{1F446}\u{1F447}\u{1F448}\u{1F449}\u{1F44A}\u{1F44B}\u{1F44C}\u{1F44D}\u{1F44E}\u{1F44F}\u{1F450}\u{1F451}\u{1F452}\u{1F453}\u{1F454}\u{1F455}\u{1F456}\u{1F457}\u{1F458}\u{1F459}\u{1F45A}\u{1F45B}\u{1F45C}\u{1F45D}\u{1F45E}\u{1F45F}\u{1F460}\u{1F461}\u{1F462}
\u{1F463}\u{1F464}\u{1F466}\u{1F467}\u{1F468}\u{1F469}\u{1F46A}\u{1F46B}\u{1F46E}\u{1F46F}\u{1F470}\u{1F471}\u{1F472}\u{1F473}\u{1F474}\u{1F475}\u{1F476}\u{1F477}\u{1F478}\u{1F479}\u{1F47A}\u{1F47B}\u{1F47C}\u{1F47D}\u{1F47E}\u{1F47F}\u{1F480}\u{1F481}\u{1F482}\u{1F483}\u{1F484}\u{1F485}\u{1F486}
\u{1F487}\u{1F488}\u{1F489}\u{1F48A}\u{1F48B}\u{1F48C}\u{1F48D}\u{1F48E}\u{1F48F}\u{1F490}\u{1F491}\u{1F492}\u{1F493}\u{1F494}\u{1F495}\u{1F496}\u{1F497}\u{1F498}\u{1F499}\u{1F49A}\u{1F49B}\u{1F49C}\u{1F49D}\u{1F49E}\u{1F49F}\u{1F4A0}\u{1F4A1}\u{1F4A2}\u{1F4A3}\u{1F4A4}\u{1F4A5}\u{1F4A6}\u{1F4A7}
\u{1F4A8}\u{1F4A9}\u{1F4AA}\u{1F4AB}\u{1F4AC}\u{1F4AE}\u{1F4AF}\u{1F4B0}\u{1F4B1}\u{1F4B2}\u{1F4B3}\u{1F4B4}\u{1F4B5}\u{1F4B8}\u{1F4B9}\u{1F4BA}\u{1F4BB}\u{1F4BC}\u{1F4BD}\u{1F4BE}\u{1F4BF}\u{1F4C0}\u{1F4C1}\u{1F4C2}\u{1F4C3}\u{1F4C4}\u{1F4C5}\u{1F4C6}\u{1F4C7}\u{1F4C8}\u{1F4C9}\u{1F4CA}\u{1F4CB}
\u{1F4CC}\u{1F4CD}\u{1F4CE}\u{1F4CF}\u{1F4D0}\u{1F4D1}\u{1F4D2}\u{1F4D3}\u{1F4D4}\u{1F4D5}\u{1F4D6}\u{1F4D7}\u{1F4D8}\u{1F4D9}\u{1F4DA}\u{1F4DB}\u{1F4DC}\u{1F4DD}\u{1F4DE}\u{1F4DF}\u{1F4E0}\u{1F4E1}\u{1F4E2}\u{1F4E3}\u{1F4E4}\u{1F4E5}\u{1F4E6}\u{1F4E7}\u{1F4E8}\u{1F4E9}\u{1F4EA}\u{1F4EB}\u{1F4EE}\u{1F4F0}
\u{1F4F1}\u{1F4F2}\u{1F4F3}\u{1F4F4}\u{1F4F6}\u{1F4F7}\u{1F4F9}\u{1F4FA}\u{1F4FB}\u{1F4FC}\u{1F503}\u{1F50A}\u{1F50B}\u{1F50C}\u{1F50D}\u{1F50E}\u{1F50F}\u{1F510}\u{1F511}\u{1F512}\u{1F513}\u{1F514}\u{1F516}\u{1F517}\u{1F518}\u{1F519}\u{1F51A}\u{1F51B}\u{1F51C}\u{1F51D}\u{1F51E}\u{1F51F}\u{1F520}
\u{1F521}\u{1F522}\u{1F523}\u{1F524}\u{1F525}\u{1F526}\u{1F527}\u{1F528}\u{1F529}\u{1F52A}\u{1F52B}\u{1F52E}\u{1F52F}\u{1F530}\u{1F531}\u{1F532}\u{1F533}\u{1F534}\u{1F535}\u{1F536}\u{1F537}\u{1F538}\u{1F539}\u{1F53A}\u{1F53B}\u{1F53C}\u{1F53D}\u{1F550}\u{1F551}\u{1F552}\u{1F553}\u{1F554}\u{1F555}
\u{1F556}\u{1F557}\u{1F558}\u{1F559}\u{1F55A}\u{1F55B}\u{1F5FB}\u{1F5FC}\u{1F5FD}\u{1F5FE}\u{1F5FF}`;
        this.client.print(sample, true);
        this.client.print(sample2, true);
      };
      this.functions["testlines"] = () => {
        const maxLines = this.client.display.maxLines;
        let sample = "";
        const id = this.client.display.model.getNextLineID;
        for (let h = 0; h < maxLines; h++)
          sample += `Line: ${h}, LineID: ${id + h}
`;
        this.client.print(sample, true);
      };
    }
    remove() {
      if (!this.client) return;
      this.client.off("function", this._event);
    }
    initialize() {
      if (!this.client) return;
      this.client.on("function", this._event);
    }
    get menu() {
      return [];
    }
    /**
     * Process function event to execute custom text functions
     * @param data {FunctionEvent} The data about the function to execute
     */
    processFunction(data) {
      let name2;
      if (!data) return;
      name2 = data.name.toLowerCase();
      if (name2.endsWith("()"))
        name2 = name2.substring(0, name2.length - 2);
      if (this.functions[name2]) {
        console.time(name2);
        this.functions[name2].apply(this, data || {});
        console.timeEnd(name2);
        data.handled = true;
      }
    }
  };

  // src/client.ts
  var Client = class extends EventEmitter {
    constructor(options) {
      super();
      //#region Private properties
      this._enableDebug = false;
      this._itemCache = {
        triggers: null,
        aliases: null,
        macros: null,
        buttons: null,
        alarms: null,
        alarmPatterns: []
      };
      this._variables = {};
      this._options = {};
      //#endregion
      //#region Public properties
      this.active = true;
      this.connecting = false;
      this.version = version;
      this.connectTime = 0;
      this.disconnectTime = 0;
      this.lastSendTime = 0;
      this.defaultTitle = "oiMUD";
      this.errored = false;
      window.client = this;
      window.oiMUD = this;
      this._plugins = [];
      options = Object.assign({ display: "#display", commandInput: "#commandInput" }, options || {});
      if (!("display" in options) || typeof options.display === void 0)
        options.display = "#display";
      if (!("commandInput" in options) || typeof options.commandInput === void 0)
        options.commandInput = "#commandInput";
      this._display = new Display(options.display);
      this.display.on("click", (e) => {
        if (this.getOption("CommandonClick"))
          this._commandInput.focus();
      });
      this.display.on("update-window", (width, height) => {
        this.telnet.updateWindow(width, height);
      });
      this.display.on("update-window", (width, height) => {
        this.telnet.updateWindow(width, height);
      });
      this.display.on("debug", (msg) => {
        this.debug(msg);
      });
      this.display.on("add-line", (data) => {
        this.emit("add-line", data);
      });
      this.display.on("add-line-done", (data) => {
        this.emit("add-line-done", data);
      });
      this.display.on("MXP-tag-reply", (tag, args) => {
        const e = { tag, args, preventDefault: false };
        this.emit("MXP-tag-reply", e);
        if (e.preventDefault)
          return;
        switch (tag) {
          case "VERSION":
            if (this.display.MXPStyleVersion && this.display.MXPStyleVersion.length) {
              this.debug(`MXP Tag REPLY: <VERSION MXP=1.0 STYLE=${this.display.MXPStyleVersion} CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>`);
              this.send(`\x1B[1z<VERSION MXP=1.0 STYLE=${this.display.MXPStyleVersion} CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>\r
`);
            } else {
              this.debug(`MXP Tag REPLY: <VERSION MXP=1.0 CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>`);
              this.send(`\x1B[1z<VERSION MXP=1.0 CLIENT=jiMUD VERSION=${this.version} REGISTERED=no>\r
`);
            }
            break;
          case "SUPPORT":
            this.debug(`MXP Tag REPLY: <SUPPORTS ${args.join(" ")}>`);
            this.send(`\x1B[1z<SUPPORTS ${args.join(" ")}>\r
`);
            break;
          case "USER":
            this.emit("sendUsername", e);
            break;
          case "PASSWORD":
            this.emit("sendPassword", e);
            break;
        }
      });
      this.display.on("expire-links", (args) => {
        this.emit("expire-links", args);
      });
      this.display.on("parse-done", () => {
        this.emit("parse-done");
      });
      this.display.on("set-title", (title, type) => {
        if (typeof title === "undefined" || title == null || title.length === 0)
          window.document.title = this.getOption("defaultTitle");
        else if (type !== 1)
          window.document.title = this.getOption("title").replace("$t", title);
      });
      this.display.on("music", (data) => {
        this.emit("music", data);
      });
      this.display.on("sound", (data) => {
        this.emit("sound", data);
      });
      this.display.on("bell", () => {
        this.emit("bell");
      });
      if (typeof options.commandInput === "string") {
        this._commandInput = document.querySelector(options.commandInput);
        if (!this._commandInput)
          throw new Error("Invalid selector for command input.");
      } else if (options.commandInput instanceof $)
        this._commandInput = options.commandInput[0];
      else if (options.commandInput instanceof HTMLElement)
        this._commandInput = options.commandInput;
      else
        throw new Error("Command input must be a selector, element or jquery object");
      this._telnet = new Telnet({ protocol: options.protocol, scheme: options.scheme });
      this._telnet.terminal = "oiMUD";
      this._telnet.version = this.version;
      this._telnet.GMCPSupports.push("oMUD 1");
      this._telnet.GMCPSupports.push("Client.Media 1");
      this._telnet.on("error", (err) => {
        if (err) {
          if (err.type == "close" && err.code == 1006)
            return;
          var msg = [];
          if (err.type)
            msg.push(err.type);
          if (err.text)
            msg.push(err.text);
          if (err.message)
            msg.push(err.message);
          if (err.reason)
            msg.push(err.reason);
          if (err.code)
            this.error(err.code + " - " + msg.join(", "));
          else
            this.error(msg.join(", "));
        } else
          this.error("Unknown telnet error.");
        if (this.getOption("autoConnect") && !this._telnet.connected)
          setTimeout(() => {
            this.connect();
          }, 600);
      });
      this.telnet.on("connecting", () => {
        this.connecting = true;
        this.echo("Trying to connect to " + this.host + ":" + this.port, -7 /* InfoText */, -8 /* InfoBackground */, true, true);
      });
      this.telnet.on("connect", () => {
        this.connecting = false;
        this.echo("Connected...", -7 /* InfoText */, -8 /* InfoBackground */, true, true);
        this.connectTime = Date.now();
        this.disconnectTime = 0;
        this.lastSendTime = Date.now();
        this.emit("connected");
        this.raise("connected");
      });
      this.telnet.on("debug", (msg) => {
        this.debug(msg);
      });
      this.telnet.on("receive-option", (data) => {
        this.emit("received-option", data);
      });
      this._telnet.on("close", () => {
        this.connecting = false;
        this.echo("Connection closed to " + this.host + ":" + this.port, -7 /* InfoText */, -8 /* InfoBackground */, true, true);
        this.disconnectTime = Date.now();
        this.emit("closed");
        this.raise("disconnected");
        this.connectTime = 0;
        this.lastSendTime = 0;
      });
      this.telnet.on("received-data", (data) => {
        data = { value: data };
        this.emit("received-data", data);
        if (data === null || typeof data == "undefined" || data.value === null || typeof data.value == "undefined")
          return;
        this.printInternal(data.value, false, true);
        this.debug("Latency: " + this.telnet.latency + "ms");
        this.debug("Latency: " + this.telnet.latency / 1e3 + "s");
      });
      this.telnet.on("received-MSDP", (data) => {
        this.emit("received-MSDP", data);
      });
      this.telnet.on("received-GMCP", (data) => {
        let val = data.value;
        let mod;
        let idx = 0;
        const dl = val.length;
        let c;
        if (dl === 0) return;
        for (idx = 0; idx < dl; idx++) {
          c = val.charAt(idx);
          if (c === " " || c === "{" || c === "[")
            break;
        }
        mod = val.substr(0, idx).trim();
        val = val.substr(idx).trim();
        this.debug("GMCP Module: " + mod);
        this.debug("GMCP Data: " + val);
        let obj;
        if (mod.toLowerCase() === "client.gui") {
          obj = val.split("/n");
          if (val.length >= 2) {
            obj = {
              version: parseInt(obj[0], 10),
              url: obj[1]
            };
          } else if (val.length > 0) {
            obj = {
              version: parseInt(obj[0], 10),
              url: obj[1]
            };
          } else
            obj = { version: obj, url: "" };
          this.emit("received-GMCP", mod, obj);
          return;
        }
        try {
          if (val.length > 0)
            obj = JSON.parse(val);
        } catch (e) {
          this.error("Invalid GMCP");
          return;
        }
        this.emit("received-GMCP", mod, obj);
      });
      this.telnet.on("windowSize", () => {
        this.UpdateWindow();
      });
      let tmp = getParameterByName("host");
      if (tmp !== null && tmp.length)
        this.host = tmp;
      else if (options && "host" in options)
        this.host = options.host;
      else
        this.host = "127.0.0.1";
      tmp = +getParameterByName("port");
      if (!isNaN(tmp) && tmp > 0)
        this.port = tmp;
      else if (options && "port" in options)
        this.port = options.port;
      else
        this.port = 23;
      this._input = new Input(this);
      this._input.on("scroll-lock", (lock) => {
        this.display.scrollLock = lock;
        this.emit("scroll-lock", lock);
      });
      this._input.on("command-history-changed", (history) => this.emit("command-history-changed", history));
      this._input.on("item-added", (type, profile, item) => {
        this.emit("item-added", type, profile, item);
      });
      this._input.on("item-updated", (type, profile, idx, item) => {
        this.emit("item-updated", type, profile, idx, item);
      });
      this._input.on("item-removed", (type, profile, idx) => {
        this.emit("item-removed", type, profile, idx);
      });
      this.loadOptions();
      this._commandInput.value = "";
      this._commandInput.focus();
      window.addEventListener("blur", () => {
        this.active = false;
        this.emit("blur");
        this.raise("blur");
      });
      window.addEventListener("focus", () => {
        this.active = true;
        this.emit("focus");
        this.raise("focus");
      });
      window.addEventListener("beforeunload", (e) => {
        if (this.connected) {
          if (e)
            e.returnValue = "Closing or reloading will disconnect you from the mud.";
          return "Closing or reloading will disconnect you from the mud.";
        }
        this.raise("closed");
      });
      window.addEventListener("unload", () => {
        if (this.connected)
          this.close();
      });
      this.addPlugin(new MSP(this));
      if (true)
        this.addPlugin(new Test(this));
      if (this.options.autoConnect)
        setTimeout(() => {
          this.connect();
        }, 600);
      this.emit("initialized");
    }
    //#endregion
    //#region Public setter/getters
    get telnet() {
      return this._telnet;
    }
    get variables() {
      return this._variables;
    }
    get commandInput() {
      return this._commandInput;
    }
    get display() {
      return this._display;
    }
    get profiles() {
      return this._profiles;
    }
    get plugins() {
      return this._plugins;
    }
    get options() {
      return this._options;
    }
    get input() {
      return this._input;
    }
    set simpleAlarms(value) {
      this.setOption("simpleAlarms", value);
    }
    get simpleAlarms() {
      return this.getOption("simpleAlarms");
    }
    set enableParsing(value) {
      this.setOption("enableParsing", value);
      this._input.enableParsing = value;
    }
    get enableParsing() {
      return this.getOption("enableParsing");
    }
    set enableTriggers(value) {
      this.setOption("enableTriggers", value);
      this._input.enableTriggers = value;
      this.startAlarms();
    }
    get enableTriggers() {
      return this.getOption("enableTriggers");
    }
    get enableDebug() {
      return this._enableDebug;
    }
    set enableDebug(enable) {
      this._enableDebug = enable;
      this._telnet.enableDebug = enable;
      this._display.enableDebug = enable;
    }
    get host() {
      return this._telnet.host;
    }
    set host(host) {
      this._telnet.host = host;
    }
    get port() {
      return this._telnet.port;
    }
    set port(port) {
      this._telnet.port = port;
    }
    get connected() {
      return this._telnet.connected;
    }
    get activeProfile() {
      return this._profiles.active;
    }
    get commandHistory() {
      return this._input.commandHistory;
    }
    get aliases() {
      if (this._itemCache.aliases)
        return this._itemCache.aliases;
      const keys = this.profiles.keys;
      const tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableAliases)
          this._itemCache.aliases = [];
        else
          this._itemCache.aliases = SortItemArrayByPriority(this.profiles.items[keys[k]].aliases);
        return this._itemCache.aliases;
      }
      for (; k < kl; k++) {
        if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableAliases || this.profiles.items[keys[k]].aliases.length === 0)
          continue;
        tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].aliases));
      }
      this._itemCache.aliases = tmp;
      return this._itemCache.aliases;
    }
    get macros() {
      if (this._itemCache.macros)
        return this._itemCache.macros;
      const keys = this.profiles.keys;
      const tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableMacros)
          this._itemCache.macros = [];
        else
          this._itemCache.macros = SortItemArrayByPriority(this.profiles.items[keys[k]].macros);
        return this._itemCache.macros;
      }
      for (; k < kl; k++) {
        if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableMacros || this.profiles.items[keys[k]].macros.length === 0)
          continue;
        tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].macros));
      }
      this._itemCache.macros = tmp;
      return this._itemCache.macros;
    }
    get triggers() {
      if (this._itemCache.triggers)
        return this._itemCache.triggers;
      const keys = this.profiles.keys;
      const tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableTriggers)
          this._itemCache.triggers = [];
        else
          this._itemCache.triggers = SortItemArrayByPriority(this.profiles.items[keys[0]].triggers);
        return this._itemCache.triggers;
      }
      for (; k < kl; k++) {
        if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableTriggers || this.profiles.items[keys[k]].triggers.length === 0)
          continue;
        tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].triggers));
      }
      this._itemCache.triggers = tmp;
      return this._itemCache.triggers;
    }
    removeTrigger(trigger) {
      const keys = this.profiles.keys;
      let k = 0;
      const kl = keys.length;
      let idx = -1;
      if (kl === 0)
        return;
      if (kl === 1) {
        if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableTriggers)
          return;
        idx = this.profiles.items[keys[k]].triggers.indexOf(trigger);
      } else
        for (; k < kl && idx !== -1; k++) {
          if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableTriggers || this.profiles.items[keys[k]].triggers.length === 0)
            continue;
          idx = this.profiles.items[keys[k]].triggers.indexOf(trigger);
          if (idx !== -1)
            break;
        }
      if (idx === -1)
        return;
      this.profiles.items[keys[k]].triggers.splice(idx, 1);
      this._itemCache.triggers = null;
      if ((trigger.triggers.length || trigger.type === 3 /* Alarm */) && this._itemCache.alarms) {
        idx = this._itemCache.alarms.indexOf(trigger);
        if (idx !== -1) {
          this._itemCache.alarms.splice(idx, 1);
          this._itemCache.alarmPatterns.splice(idx, 1);
        }
      }
      this.saveProfiles();
      this.emit("item-removed", "trigger", keys[k], idx);
    }
    get alarms() {
      if (this._itemCache.alarms)
        return this._itemCache.alarms;
      const keys = this.profiles.keys;
      const tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableTriggers)
          this._itemCache.alarms = [];
        else
          this._itemCache.alarms = $.grep(SortItemArrayByPriority(this.profiles.items[keys[k]].triggers), (a) => {
            if (a && a.enabled && a.triggers.length) {
              if (a.type === 3 /* Alarm */) return true;
              for (let s = 0, sl = a.triggers.length; s < sl; s++)
                if (a.triggers[s].enabled && a.triggers[s].type === 3 /* Alarm */)
                  return true;
              return false;
            }
            return a && a.enabled && a.type === 3 /* Alarm */;
          });
        this._itemCache.alarms.reverse();
        return this._itemCache.alarms;
      }
      for (; k < kl; k++) {
        if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableTriggers || this.profiles.items[keys[k]].triggers.length === 0)
          continue;
        tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].triggers));
      }
      this._itemCache.alarms = $.grep(tmp, (a) => {
        if (a && a.enabled && a.triggers.length) {
          if (a.type === 3 /* Alarm */) return true;
          for (let s = 0, sl = a.triggers.length; s < sl; s++)
            if (a.triggers[s].enabled && a.triggers[s].type === 3 /* Alarm */)
              return true;
          return false;
        }
        return a && a.enabled && a.type === 3 /* Alarm */;
      });
      this._itemCache.alarms.reverse();
      return this._itemCache.alarms;
    }
    get buttons() {
      if (this._itemCache.buttons)
        return this._itemCache.buttons;
      const keys = this.profiles.keys;
      const tmp = [];
      let k = 0;
      const kl = keys.length;
      if (kl === 0) return [];
      if (kl === 1) {
        if (!this.profiles.items[keys[0]].enabled || !this.profiles.items[keys[0]].enableButtons)
          this._itemCache.buttons = [];
        else
          this._itemCache.buttons = SortItemArrayByPriority(this.profiles.items[keys[k]].buttons);
        return this._itemCache.buttons;
      }
      for (; k < kl; k++) {
        if (!this.profiles.items[keys[k]].enabled || !this.profiles.items[keys[k]].enableButtons || this.profiles.items[keys[k]].buttons.length === 0)
          continue;
        tmp.push.apply(tmp, SortItemArrayByPriority(this.profiles.items[keys[k]].buttons));
      }
      this._itemCache.buttons = tmp;
      return this._itemCache.buttons;
    }
    //#endregion    
    addPlugin(plugin) {
      if (!plugin) return;
      this.plugins.push(plugin);
      plugin.initialize();
    }
    removePlugin(plugin) {
      if (!this.plugins.length) return;
      const idx = this.plugins.indexOf(plugin);
      if (idx !== -1) {
        plugin.remove();
        this.plugins.splice(idx, 1);
      }
    }
    getVariable(name2) {
      return this.variables[name2];
    }
    setVariable(name2, value) {
      this.variables[name2] = value;
    }
    setVariables(variables) {
      const names = Object.keys(variables);
      if (names.length === 0) return;
      const nl = names.length;
      let name2;
      for (let n = 0; n < nl; n++) {
        name2 = names[n];
        this.variables[name2] = variables[name2];
      }
    }
    hasVariable(name2) {
      return this.variables.hasOwnProperty(name2);
    }
    removeVariable(name2) {
      if (!this.variables.hasOwnProperty(name2))
        return;
      delete this.variables[name2];
    }
    setHistoryIndex(index) {
      this._input.setHistoryIndex(index);
    }
    clearCommandHistory() {
      this._input.clearCommandHistory();
    }
    AddCommandToHistory(txt) {
      this._input.AddCommandToHistory(txt);
    }
    loadProfiles() {
      this._profiles = new ProfileCollection();
      this._profiles.load().then(() => {
        if (!this.profiles.contains("default")) {
          this.profiles.add(Profile.Default);
          this.saveProfiles();
        }
        this.clearCache();
        this.startAlarms();
        this.emit("profiles-loaded");
      });
    }
    removeProfile(profile) {
      if (!profile) return;
      this.profiles.remove(profile);
      this.clearCache();
      this.startAlarms();
      this.emit("profile-removed", profile);
    }
    saveProfiles() {
      this._profiles.save();
      this.clearCache();
      this.emit("profiles-updated");
    }
    toggleProfile(profile) {
      this.profiles.toggle(profile);
      this.saveProfiles();
      this.clearCache();
      this.startAlarms();
      this.emit("profile-toggled", profile, this.profiles[profile].enabled);
    }
    startAlarms() {
      const al = this.alarms.length;
      if ((al === 0 || !this.getOption("enableTriggers")) && this._alarm) {
        clearInterval(this._alarm);
        this._alarm = null;
      } else if (al && !this._alarm)
        this._alarm = setInterval((client) => {
          client.process_alarms();
        }, 1e3, this);
    }
    setAlarmState(idx, state) {
      if (typeof idx === "object")
        idx = this.alarms.indexOf(idx);
      if (idx === -1 || idx >= this.alarms.length)
        return;
      let pattern = this._itemCache.alarmPatterns[idx];
      if (!pattern) {
        pattern = {};
        if (this.alarms[idx].type === 3 /* Alarm */)
          pattern[0] = Alarm.parse(this.alarms[idx]);
        for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
          if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === 3 /* Alarm */)
            pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
        }
        this._itemCache.alarmPatterns[idx] = pattern;
      }
      for (const p in pattern) {
        if (!pattern.hasOwnProperty(p)) continue;
        if (state) {
          pattern[p].startTime += Date.now() - pattern[p].suspended;
          pattern[p].prevTime += Date.now() - pattern[p].suspended;
          if (pattern[p].tempTime)
            pattern[p].tempTime += Date.now() - pattern[p].suspended;
          pattern[p].suspended = 0;
        } else
          pattern[p].suspended = Date.now();
      }
    }
    setAlarmTempTime(idx, temp) {
      if (typeof idx === "object")
        idx = this.alarms.indexOf(idx);
      if (idx === -1 || idx >= this.alarms.length)
        return;
      let pattern = this._itemCache.alarmPatterns[idx];
      if (!pattern) {
        pattern = {};
        if (this.alarms[idx].type === 3 /* Alarm */)
          pattern[0] = Alarm.parse(this.alarms[idx]);
        for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
          if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === 3 /* Alarm */)
            pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
        }
        this._itemCache.alarmPatterns[idx] = pattern;
      }
      if (pattern[0])
        pattern[0].setTempTime(temp);
    }
    restartAlarmState(idx, oldState, newState) {
      if (oldState === newState)
        return;
      if (typeof idx === "object")
        idx = this.alarms.indexOf(idx);
      if (idx === -1 || idx >= this.alarms.length)
        return;
      let pattern = this._itemCache.alarmPatterns[idx];
      if (!pattern) {
        pattern = {};
        if (this.alarms[idx].type === 3 /* Alarm */)
          pattern[0] = Alarm.parse(this.alarms[idx]);
        for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
          if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === 3 /* Alarm */)
            pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
        }
        this._itemCache.alarmPatterns[idx] = pattern;
      }
      if (pattern[oldState])
        pattern[oldState].restart = Date.now();
      if (pattern[newState])
        pattern[newState].restart = Date.now();
    }
    getRemainingAlarmTime(idx) {
      if (typeof idx === "object")
        idx = this.alarms.indexOf(idx);
      if (idx === -1 || idx >= this.alarms.length)
        return 0;
      if (!this.alarms[idx].enabled)
        return 0;
      let pattern = this._itemCache.alarmPatterns[idx];
      if (!pattern) {
        pattern = {};
        if (this.alarms[idx].type === 3 /* Alarm */)
          pattern[0] = Alarm.parse(this.alarms[idx]);
        for (let s = 0, sl = this.alarms[idx].triggers.length; s < sl; s++) {
          if (this.alarms[idx].triggers[s].enabled && this.alarms[idx].triggers[s].type === 3 /* Alarm */)
            pattern[s] = Alarm.parse(this.alarms[idx].triggers[s]);
        }
        this._itemCache.alarmPatterns[idx] = pattern;
      }
      if (pattern[0]) {
        const alarm = pattern[0];
        const now = Date.now();
        const dNow = /* @__PURE__ */ new Date();
        let future = now;
        let fend = future + 9e7;
        let mod = 1e3;
        if (alarm.seconds !== -1)
          mod = 1e3;
        else if (alarm.minutes !== -1)
          mod = 6e4;
        else if (alarm.hours !== -1)
          mod = 36e5;
        if (alarm.tempTime) {
          if (alarm.tempTime - now > 0)
            return alarm.tempTime - now;
          return 0;
        } else {
          while (future < fend) {
            if (this.alarm_match(alarm, future, dNow))
              return future - now;
            future += mod;
            dNow.setTime(dNow.getTime() + mod);
          }
          return -1;
        }
      }
      return 0;
    }
    updateAlarms() {
      if (this._itemCache.alarmPatterns) {
        const old = this._itemCache.alarmPatterns;
        const oAlarms = this.alarms;
        this._itemCache.alarmPatterns = [];
        this._itemCache.alarms = null;
        const al = this.alarms.length;
        let idx = -1;
        for (let a = 0; a < al; a++) {
          idx = oAlarms.indexOf(this.alarms[a]);
          if (idx !== -1)
            this._itemCache.alarmPatterns[a] = old[idx];
        }
      }
      this.startAlarms();
    }
    process_alarms() {
      if (!this.getOption("enableTriggers"))
        return;
      let a = 0;
      let changed = false;
      const al = this.alarms.length;
      if (al === 0 && this._alarm) {
        clearInterval(this._alarm);
        this._alarm = null;
        return;
      }
      const patterns = this._itemCache.alarmPatterns;
      const now = Date.now();
      const alarms = this.alarms;
      const dNow = /* @__PURE__ */ new Date();
      for (a = al - 1; a >= 0; a--) {
        let trigger = alarms[a];
        const parent = trigger;
        if (!trigger.enabled) continue;
        if (trigger.state > trigger.triggers.length)
          trigger.state = 0;
        if (trigger.state !== 0 && trigger.triggers && trigger.triggers.length) {
          trigger = trigger.triggers[trigger.state - 1];
          while (!trigger.enabled && parent.state !== 0) {
            parent.state++;
            if (parent.state > parent.triggers.length) {
              parent.state = 0;
              trigger = trigger.triggers[parent.state - 1];
              break;
            }
            if (parent.state)
              trigger = trigger.triggers[parent.state - 1];
            else
              trigger = parent;
            changed = true;
          }
          if (changed) {
            if (this.getOption("saveTriggerStateChanges"))
              this.saveProfiles();
            this.emit("item-updated", "trigger", parent.profile.name, parent.profile.triggers.indexOf(parent));
          }
          if (!trigger.enabled) continue;
        }
        if (trigger.type === 131072 /* ReParse */ || trigger.type === 262144 /* ReParsePattern */) {
          const val = this._input.adjustLastLine(this.display.lines.length, true);
          const line = this.display.lines[val];
          a = this._input.TestTrigger(trigger, parent, a, line, this.display.lines[val].raw || line, val === this.display.lines.length - 1);
          continue;
        }
        if (trigger.type !== 3 /* Alarm */) continue;
        let alarm = patterns[a];
        if (!alarm) {
          try {
            patterns[a] = {};
            if (trigger.type === 3 /* Alarm */)
              patterns[a][0] = Alarm.parse(trigger);
            for (let s = 0, sl = trigger.triggers.length; s < sl; s++) {
              if (trigger.triggers[s].type === 3 /* Alarm */)
                patterns[a][s] = Alarm.parse(trigger.triggers[s]);
            }
          } catch (e) {
            patterns[a] = null;
            if (this.getOption("disableTriggerOnError")) {
              trigger.enabled = false;
              setTimeout(() => {
                this.saveProfiles();
                this.emit("item-updated", "trigger", parent.profile, parent.profile.triggers.indexOf(parent), parent);
              });
            }
            throw e;
          }
          alarm = patterns[a];
          if (!alarm) continue;
        }
        alarm = alarm[trigger.state];
        if (alarm.restart) {
          alarm.startTime = Date.now();
          alarm.prevTime = alarm.startTime;
          if (alarm.tempTime)
            alarm.tempTime += Date.now() - alarm.restart;
          alarm.restart = 0;
        }
        let match = true;
        if (alarm.tempTime) {
          match = now >= alarm.tempTime;
          if (match)
            alarm.tempTime = 0;
        } else
          match = this.alarm_match(alarm, now, dNow);
        if (match && !alarm.suspended) {
          alarm.prevTime = now;
          const state = parent.state;
          this._input.lastTriggered = alarm.pattern;
          this._input.ExecuteTrigger(trigger, [alarm.pattern], false, -a, null, null, parent);
          if (state !== parent.state)
            alarm.restart = Date.now();
          if (alarm.temp) {
            if (parent.triggers.length) {
              if (state === 0) {
                const item = parent.triggers.shift();
                item.state = state;
                item.priority = parent.priority;
                item.name = parent.name;
                item.profile = parent.profile;
                if (item.state > item.triggers.length)
                  item.state = 0;
                item.triggers = parent.triggers;
                alarms[a] = item;
                patterns[a] = null;
                this.saveProfiles();
                const idx = parent.profile.triggers.indexOf(parent);
                parent.profile.triggers[idx] = item;
                this.emit("item-updated", "trigger", parent.profile.name, idx, item);
              } else {
                parent.triggers.splice(state - 1, 1);
                patterns[a].splice(state - 1, 1);
                parent.state = state;
                if (parent.state > parent.triggers.length)
                  parent.state = 0;
                this.saveProfiles();
                const idx = parent.profile.triggers.indexOf(parent);
                this.emit("item-updated", "trigger", parent.profile.name, idx, parent);
              }
            } else {
              this._input.clearTriggerState(a);
              this.removeTrigger(parent);
            }
          }
          a = -this._input.cleanUpTriggerState(-a);
        }
      }
    }
    alarm_match(alarm, now, dNow) {
      if (!alarm || alarm.suspended) return false;
      let match = true;
      let ts;
      let sec;
      let min;
      let hr;
      let hours;
      let minutes;
      let seconds;
      if (!moment || this.simpleAlarms) {
        ts = now - this.connectTime;
        if (ts < 1e3)
          return false;
        sec = Math.round(ts / 1e3);
        min = Math.floor(sec / 60);
        hr = Math.floor(min / 60);
        hours = hr;
        minutes = Math.floor(min % 60);
        seconds = Math.floor(sec % 60);
      } else {
        if (alarm.start)
          ts = moment.duration(now - this.connectTime);
        else
          ts = moment.duration(now - alarm.startTime);
        if (ts.asMilliseconds() < 1e3)
          return false;
        sec = Math.round(ts.asMilliseconds() / 1e3);
        min = Math.floor(sec / 60);
        hr = Math.floor(min / 60);
        hours = ts.hours();
        minutes = ts.minutes();
        seconds = ts.seconds();
      }
      if (alarm.hoursWildCard) {
        if (alarm.hours === 0)
          match = match && hours === 0;
        else if (alarm.hours !== -1)
          match = match && hr !== 0 && hr % alarm.hours === 0;
      } else if (alarm.hours !== -1)
        match = match && alarm.hours === (alarm.start ? hours : dNow.getHours());
      if (alarm.minutesWildcard) {
        if (alarm.minutes === 0)
          match = match && minutes === 0;
        else if (alarm.minutes !== -1)
          match = match && min !== 0 && min % alarm.minutes === 0;
      } else if (alarm.minutes !== -1)
        match = match && alarm.minutes === (alarm.start ? minutes : dNow.getMinutes());
      if (alarm.secondsWildcard) {
        if (alarm.seconds === 0)
          match = match && seconds === 0;
        else if (alarm.seconds !== -1)
          match = match && sec % alarm.seconds === 0;
      } else if (alarm.seconds !== -1)
        match = match && alarm.seconds === (alarm.start ? seconds : dNow.getSeconds());
      return match;
    }
    loadOptions() {
      this._options = new Settings();
      this.loadProfiles();
      this.enableDebug = this._options.enableDebug;
      this.display.maxLines = this._options.bufferSize;
      this.display.enableFlashing = this._options.flashing;
      this.display.enableMXP = this._options.enableMXP;
      this.display.showInvalidMXPTags = this._options["display.showInvalidMXPTags"];
      this.display.enableURLDetection = this._options.enableURLDetection;
      this.display.enableMSP = this._options.enableMSP;
      this.display.enableColors = this._options["display.enableColors"];
      this.display.enableBackgroundColors = this._options["display.enableBackgroundColors"];
      if (this._options.colors && this._options.colors?.length > 0) {
        var clrs = this._options.colors;
        for (var c = 0, cl = clrs.length; c < cl; c++) {
          if (!clrs[c] || clrs[c].length === 0) continue;
          this.display.SetColor(c, clrs[c]);
        }
      }
      if (this._telnet) {
        this._telnet.options.MCCP = this._options.enableMCCP;
        this._telnet.options.MXP = this._options.enableMXP;
        this._telnet.UTF8 = this._options.enableUTF8;
        this._telnet.options.ECHO = this._options.enableEcho;
        this._telnet.enableLatency = this._options.lagMeter;
        this._telnet.enablePing = this._options.enablePing;
      }
      this._input.scrollLock = this._options.scrollLocked;
      this._input.enableParsing = this._options.enableParsing;
      this._input.enableTriggers = this._options.enableTriggers;
      this.display.scrollLock = this._options.scrollLocked;
      this.display.hideTrailingEmptyLine = this._options["display.hideTrailingEmptyLine"];
      if (this.UpdateFonts) this.UpdateFonts();
      this.display.scrollDisplay();
      this.emit("options-loaded");
    }
    setOption(name2, value) {
      if (name2 === -1 || name2 === "-1")
        return;
      this._options[name2] = value;
      Settings.setValue(name2, value);
      this.emit("option=changed", name2, value);
    }
    getOption(name2) {
      if (this._options && name2 in this._options)
        return this._options[name2];
      return this._options[name2] = Settings.getValue(name2);
    }
    UpdateFonts() {
      if (!this.display) return;
      this.display.updateFont(this._options.font, this._options.fontSize);
      this._commandInput.style.fontSize = this._options.cmdfontSize;
      this._commandInput.style.fontFamily = this._options.cmdfont + ", monospace";
    }
    parse(txt) {
      this.parseInternal(txt, false, false, true);
    }
    parseInternal(txt, remote, force, prependSplit) {
      this.display.append(txt, remote, force, prependSplit);
    }
    error(err) {
      if (this.enableDebug) this.debug(err);
      let msg = "";
      if (err == null || typeof err === "undefined")
        err = new Error("Unknown");
      else if (typeof err === "string" && err.length === 0)
        err = new Error("Unknown");
      if (err.stack && this.getOption("showErrorsExtended"))
        msg = err.stack;
      else if (err instanceof Error || err instanceof TypeError)
        msg = err.name + ": " + err.message;
      else if (err.message)
        msg = err.message;
      else
        msg = "" + err;
      if (msg.match(/^.*Error: /g) || msg.match(/^.*Error - /g))
        this.echo(msg, -11 /* ErrorText */, -12 /* ErrorBackground */, true, true);
      else
        this.echo("Error: " + msg, -11 /* ErrorText */, -12 /* ErrorBackground */, true, true);
      if (this.getOption("logErrors")) {
        if (!this.getOption("showErrorsExtended")) {
          if (err.stack)
            msg = err.stack;
          else {
            err = new Error(err || msg);
            msg = err.stack;
          }
        } else if (!err.stack) {
          err = new Error(err || msg);
          msg = err.stack;
        }
        window.console.log((/* @__PURE__ */ new Date()).toLocaleString());
        window.console.log(msg);
      }
      if (err === "Error: ECONNRESET - read ECONNRESET." && this.telnet.connected)
        this.close();
      this.raise("error", msg);
    }
    echo(str, fore, back, newline, forceLine) {
      if (str == null) str = "";
      if (newline == null) newline = false;
      if (forceLine == null) forceLine = false;
      if (fore == null) fore = -3 /* LocalEcho */;
      if (back == null) back = -4 /* LocalEchoBack */;
      const codes = "\x1B[0m" + this.display.CurrentAnsiCode() + "\n";
      str = "" + str;
      if (str.endsWith("\n"))
        str = str.substr(0, str.length - 1);
      if (this.telnet.prompt && forceLine) {
        this.print("\n\x1B[" + fore + ";" + back + "m" + str + codes, newline);
        this.telnet.prompt = false;
      } else
        this.print("\x1B[" + fore + ";" + back + "m" + str + codes, newline);
    }
    print(txt, newline) {
      this.printInternal(txt, newline, false, true);
    }
    printInternal(txt, newline, remote, prependSplit) {
      if (txt == null || typeof txt === "undefined") return;
      if (newline == null) newline = false;
      if (remote == null) remote = false;
      if (newline && this.display.textLength > 0 && !this.display.EndOfLine && this.display.EndOfLineLength !== 0 && !this.telnet.prompt && !this.display.parseQueueEndOfLine)
        txt = "\n" + txt;
      this.parseInternal(txt, remote, false, prependSplit);
    }
    send(data, echo) {
      this.telnet.sendData(data);
      this.lastSendTime = Date.now();
      if (echo && this.telnet.echo && this.getOption("commandEcho"))
        this.echo(data);
      else if (echo)
        this.echo("\n");
    }
    sendRaw(data) {
      this.telnet.sendData(data, true);
      this.lastSendTime = Date.now();
    }
    sendGMCP(data) {
      this.telnet.sendGMCP(data);
      this.lastSendTime = Date.now();
    }
    debug(str, style) {
      const data = { value: str };
      this.emit("debug", data);
      if (!this._enableDebug || data == null || typeof data === "undefined" || data.value == null || typeof data.value === "undefined" || data.value.length === 0)
        return;
      if (window.console) {
        if (style)
          window.console.log("%c" + str, style);
        else
          window.console.log(data.value);
      }
    }
    sendCommand(txt, noEcho, comments) {
      if (txt == null) {
        txt = this._commandInput.value;
        if (!this.telnet.echo)
          this._commandInput.value = "";
        else
          this._input.AddCommandToHistory(txt);
      }
      txt = "" + txt;
      if (!txt.endsWith("\n"))
        txt = txt + "\n";
      const data = { value: txt, handled: false, comments };
      this.emit("parse-command", data);
      if (data == null || typeof data === "undefined") return;
      if (data.handled || data.value == null || typeof data.value === "undefined") return;
      if (data.value.length > 0)
        this.send(data.value, !noEcho);
      if (this.getOption("keepLastCommand"))
        selectAll(this._commandInput);
      else
        this._commandInput.value = "";
    }
    sendBackground(txt, noEcho, comments) {
      if (txt == null) {
        txt = this._commandInput.value;
        if (!this.telnet.echo)
          this._commandInput.value = "";
        else
          this._input.AddCommandToHistory(txt);
      }
      txt = "" + txt;
      if (!txt.endsWith("\n"))
        txt = txt + "\n";
      const data = { value: txt, handled: false, comments };
      this.emit("parse-command", data);
      if (data == null || typeof data === "undefined") return;
      if (data.value == null || typeof data.value === "undefined") return;
      if (!data.handled && data.value.length > 0)
        this.send(data.value, !noEcho);
    }
    get scrollLock() {
      return this._input.scrollLock;
    }
    set scrollLock(enabled) {
      this._input.scrollLock = enabled;
    }
    toggleScrollLock() {
      this._input.toggleScrollLock();
    }
    UpdateWindow() {
      this.display.updateWindow();
    }
    close() {
      this.telnet.close();
    }
    connect() {
      this.errored = false;
      this.emit("connecting");
      this.display.ClearMXP();
      this.display.ResetMXPLine();
      this.telnet.connect();
      this.emit("connect");
      this._commandInput.focus();
    }
    receivedData(data) {
      this.telnet.receivedData(data);
    }
    notify(title, message, options) {
      if (this.enableDebug) {
        this.emit("debug", "notify title: " + title);
        this.emit("debug", "notify msg: " + message);
      }
      this.emit("notify", title, message, options);
    }
    clear() {
      this.display.clear();
      this.emit("cleared");
    }
    parseInline(text) {
      return this._input.parseInline(text);
    }
    parseOutgoing(text, eAlias, stacking, noFunction) {
      return this._input.parseOutgoing(text, eAlias, stacking, noFunction);
    }
    clearCache() {
      this._input.clearCaches();
      this._itemCache = {
        triggers: null,
        aliases: null,
        macros: null,
        buttons: null,
        alarms: null,
        alarmPatterns: []
      };
    }
    beep() {
      this.emit("bell");
    }
    raise(event, args, delay) {
      if (!delay || delay < 1)
        this._input.triggerEvent(event, args);
      else
        setTimeout(() => {
          this._input.triggerEvent(event, args);
        }, delay);
    }
    show() {
      this.emit("show");
    }
    hide() {
      this.emit("hide");
    }
    toggle() {
      this.emit("toggle");
    }
  };
  window.Client = Client;
  window.Display = Display;
})();
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */