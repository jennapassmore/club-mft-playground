/* Club MFT Playground: tiny hash-routed shell + Experiment 01.
   No framework, no storage, no network. */
(function () {
  var stage = document.getElementById("stage");
  var barTag = document.getElementById("bar-tag");

  /* ---------- helpers ---------- */

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === false || v == null) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return el;
  }

  // Illustrations: the five Club MFT icons are drawn as a mask over a flat
  // color (see assets.css), so any palette color can fill them. "bulb" is a
  // stand-in drawn here until MFT has a sixth icon.
  var SVG_NS = "http://www.w3.org/2000/svg";
  var MASKS = { feel: 1, move: 1, play: 1, learn: 1, together: 1 };
  var SHAPES = {
    bulb:
      '<circle class="f" cx="50" cy="42" r="26"/><rect class="f" x="38" y="62" width="24" height="12" rx="3"/><rect class="f" x="40" y="78" width="20" height="9" rx="4.5"/>' +
      '<path class="kl" d="M41 50l9-12 9 12"/>' +
      '<path class="ln" d="M50 4v6M17 14l5 5M83 14l-5 5M7 42h6M87 42h6"/>'
  };
  function shape(name) {
    if (MASKS[name]) return h("div", { class: "m shape i-" + name, "aria-hidden": "true" });
    var s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 100 100");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    s.setAttribute("class", "shape");
    s.innerHTML = SHAPES[name];
    return s;
  }

  // A loose pile of stickers (absolutely placed, decorative).
  function pile(kind) {
    var el = h("div", { class: "pile pile-" + kind, "aria-hidden": "true" });
    el.innerHTML = (window.HOME_STICKERS || {})[kind] || "";
    return el;
  }

  // Stickers can be picked up and moved with a finger or mouse. Positions are
  // not saved: reload and they're back where they started.
  var zTop = 10;
  function enableDrag(root) {
    [].forEach.call(root.querySelectorAll(".sticker"), function (el) {
      var sx, sy, ox, oy, held = false;
      el.addEventListener("animationend", function () { el.classList.add("placed"); });
      el.addEventListener("pointerdown", function (e) {
        if (e.button > 0) return;
        held = true;
        el.setPointerCapture(e.pointerId);
        sx = e.clientX; sy = e.clientY;
        ox = parseFloat(el.style.getPropertyValue("--dx")) || 0;
        oy = parseFloat(el.style.getPropertyValue("--dy")) || 0;
        el.style.zIndex = ++zTop;
        el.classList.add("placed", "held");
        e.preventDefault();
      });
      el.addEventListener("pointermove", function (e) {
        if (!held) return;
        var nx = ox + e.clientX - sx, ny = oy + e.clientY - sy;
        el.style.setProperty("--dx", nx + "px");
        el.style.setProperty("--dy", ny + "px");
        // keep at least part of the sticker on the page
        var r = el.getBoundingClientRect(), W = document.documentElement.clientWidth;
        var H = document.documentElement.scrollHeight - window.scrollY;
        if (r.left < -r.width * 0.4) nx += -r.width * 0.4 - r.left;
        if (r.right > W + r.width * 0.4) nx -= r.right - (W + r.width * 0.4);
        if (r.top < -window.scrollY - r.height * 0.4) ny += -window.scrollY - r.height * 0.4 - r.top;
        if (r.bottom > H + r.height * 0.4) ny -= r.bottom - (H + r.height * 0.4);
        el.style.setProperty("--dx", nx + "px");
        el.style.setProperty("--dy", ny + "px");
      });
      function drop() { held = false; el.classList.remove("held"); }
      el.addEventListener("pointerup", drop);
      el.addEventListener("pointercancel", drop);
    });
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  var haloEl = null;
  function mount(view, opts) {
    [].slice.call(stage.children).forEach(function (c) { if (c !== haloEl) stage.removeChild(c); });
    if (opts && opts.halo) {
      if (!haloEl) haloEl = makeHalo();
      if (haloEl.parentNode !== stage) stage.insertBefore(haloEl, stage.firstChild);
    } else if (haloEl) { haloEl.remove(); haloEl = null; stage.removeAttribute("data-mood"); }
    stage.appendChild(view);
    enableDrag(view);
    var focusEl = view.querySelector("[data-focus]");
    window.scrollTo(0, 0);
    if (focusEl) {
      focusEl.setAttribute("tabindex", "-1");
      focusEl.focus({ preventScroll: true });
    }
  }

  /* ---------- home ---------- */

  var COMING = [
    { n: "02", name: "OH, HEY", q: "What if coming back didn\u2019t mean catching up?" },
    { n: "03", name: "GIMME FIVE", q: "What if five minutes was actually enough?" },
    { n: "04", name: "ABSOLUTELY NOT", q: "What if the product knew when to leave you alone?" },
    { n: "05", name: "AFTER PARTY", q: "What if the dance floor was just the beginning?" },
    { n: "06", name: "HOUSE PARTY", q: "What if finding your mom community didn\u2019t require a group chat with 87 unread messages?" }
  ];

  // The landing page is a binder cover: logo + voice on the left, stickers
  // slapped on (decorative, so hidden from assistive tech).
  function cover() {
    function stickers(cls, markup) {
      var el = h("div", { class: cls, "aria-hidden": "true" });
      el.innerHTML = markup;
      return el;
    }
    var S = window.HOME_STICKERS || { fly: "", row: "" };
    return h("header", { class: "cover" }, [
      h("span", { class: "holes", "aria-hidden": "true" }, [h("i"), h("i"), h("i")]),
      h("div", { class: "cover-inner" }, [
        h("div", { class: "cover-main" }, [
          h("h1", { class: "hero", "data-focus": true }, [
            h("span", { class: "sr", text: "Club MFT Playground" }),
            h("span", { class: "m logo hero-logo", "aria-hidden": "true" }),
            h("span", { class: "hero-sub", "aria-hidden": "true", text: "PLAYGROUND" })
          ]),
          h("p", { class: "voice", text: "Little experiments for helping moms come back to themselves." })
        ]),
        stickers("cover-fly", S.fly)
      ])
    ]);
  }

  function renderHome() {
    barTag.textContent = "";
    var view = h("div", { class: "view home" }, [
      cover(),
      h("p", { class: "sticker-hint", text: "Stickers are for sticking. Drag \u2019em anywhere." }),

      h("details", { class: "blurb" }, [
        h("summary", {}, [
          h("span", { class: "blurb-title", text: "What is this?" }),
          h("span", { class: "blurb-toggle", "aria-hidden": "true" })
        ]),
        h("div", { class: "blurb-body" }, [
          h("p", { text: "Club MFT is a monthly membership from Moms Feelin\u2019 Themselves. Each month has one theme and one practice a week." }),
          h("p", { class: "blurb-hook", text: "But what about the moments in between, when a mom is on her own?" }),
          h("p", { text: "That\u2019s what this playground is for. We\u2019re trying out new ideas for Club MFT, and each experiment asks a small question about one big one: what would a wellness product look like if it refused to become another thing moms have to keep up with?" }),
          h("p", { text: "They\u2019re not the real thing, so tap around and tell us what you\u2019d keep!" })
        ])
      ]),

      h("section", { "aria-labelledby": "avail" }, [
        h("h2", { class: "label", id: "avail", text: "Open now" }),
        h("a", { class: "exp exp-live", href: "#/01" }, [
          h("span", { class: "exp-num", text: "01" }),
          h("span", { class: "exp-body" }, [
            h("span", { class: "exp-name", text: "Club MFT Mood Ring" }),
            h("span", { class: "exp-desc", text: "What if figuring out what you need wasn\u2019t another thing you had to figure out?" }),
            h("span", { class: "soon-tag play-tag", text: "Play with it" })
          ]),
          h("span", { class: "mood-ring", "aria-hidden": "true" }, [h("i", { class: "pupil" })])
        ])
      ]),

      h("section", { "aria-labelledby": "soon" }, [
        h("h2", { class: "label", id: "soon", text: "Coming soon" }),
        h("ul", { class: "soon-list" }, COMING.map(function (c) {
          return h("li", { class: "exp exp-soon" }, [
            h("span", { class: "exp-num", text: c.n }),
            h("span", { class: "exp-body" }, [
              h("span", { class: "exp-name", text: c.name }),
              h("span", { class: "exp-desc", text: c.q }),
              h("span", { class: "soon-tag", text: "Coming soon" })
            ])
          ]);
        }))
      ]),

      h("section", { "aria-labelledby": "also" }, [
        h("h2", { class: "label", id: "also", text: "Also in here" }),
        h("a", { class: "exp exp-board", href: "brand.html" }, [
          h("span", { class: "exp-body" }, [
            h("span", { class: "exp-name", text: "Brand Board" }),
            h("span", { class: "exp-desc", text: "What if a brand felt like a messy bun and a trapper keeper?" })
          ]),
          h("span", { class: "board-chips", "aria-hidden": "true" },
            ["#D33141", "#F7D1E8", "#ED79B9", "#443055", "#E0CEFB", "#F4B84F", "#F5EDE2"].map(function (c) {
              return h("i", { style: "background:" + c });
            }))
        ])
      ]),

      h("section", { class: "pile-wrap", "aria-label": "Stickers" }, [
        pile("bottom")
      ])
    ]);
    mount(view);
    lookAtPointer(view.querySelector(".exp-live"));
  }

  // The mood ring on the card looks toward the cursor (it drifts on its own otherwise).
  function lookAtPointer(card) {
    var ring = card && card.querySelector(".mood-ring");
    if (!ring) return;
    card.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = ring.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 140);
      ring.style.setProperty("--px", (dx / d * k * 13) + "px");
      ring.style.setProperty("--py", (dy / d * k * 13) + "px");
      ring.classList.add("looking");
    });
    card.addEventListener("pointerleave", function () {
      ring.classList.remove("looking");
      ring.style.removeProperty("--px"); ring.style.removeProperty("--py");
    });
  }

  /* ---------- experiment 01 ---------- */

  var state;
  function resetState() {
    state = { step: "need", need: null, time: null, variant: 0, feeling: null, revealed: false };
  }
  resetState();

  function needById(id) { return NEEDS.filter(function (n) { return n.id === id; })[0]; }
  function currentActivity() {
    var list = ACTIVITIES[state.need][state.time];
    return list[state.variant % list.length];
  }

  function go(step) { state.step = step; renderExp(); }

  function backLink(label, step) {
    return h("button", { class: "quiet", type: "button", onclick: function () { go(step); } }, [
      h("span", { "aria-hidden": "true", text: "← " }), label
    ]);
  }

  function stepNeed() {
    return h("div", { class: "view step" }, [
      h("p", { class: "kicker", text: "Club MFT Mood Ring" }),
      h("h1", { class: "headline", "data-focus": true, text: "What do you need today?" }),
      h("h2", { class: "ask", id: "ask-need", text: "I need to..." }),
      h("ul", { class: "tiles", "aria-labelledby": "ask-need" }, NEEDS.map(function (n) {
        return h("li", {}, [
          h("button", {
            class: "tile", type: "button",
            onclick: function (e) {
              flipHaloFrom(e.currentTarget.querySelector(".halo-tile"), n.id);
              state.need = n.id; state.variant = 0; go("time");
            }
          }, [tileRing(n.id), h("span", { class: "tile-text", text: n.label })])
        ]);
      }))
    ]);
  }

  function stepTime() {
    var need = needById(state.need);
    return h("div", { class: "view step" }, [
      h("p", { class: "chosen", style: "--c:" + need.color + ";--tx:" + need.tx }, [
        h("span", { text: "I need to " }), h("strong", { text: need.label })
      ]),
      h("h1", { class: "headline", "data-focus": true, text: "How much time do you have?" }),
      h("ul", { class: "times", "aria-label": "Time available" }, TIMES.map(function (t) {
        return h("li", {}, [
          h("button", {
            class: "time" + (t.id === "long" ? " time-long" : ""), type: "button",
            style: "--c:" + need.color + ";--tx:" + need.tx,
            "aria-label": t.label,
            onclick: function () { state.time = t.id; state.variant = 0; state.revealed = false; go("result"); }
          }, [
            h("span", { class: "time-num", "aria-hidden": "true", text: t.num }),
            h("span", { class: "time-unit", "aria-hidden": "true", text: t.unit }),
            h("span", { class: "time-arrow", "aria-hidden": "true", text: "→" })
          ])
        ]);
      })),
      backLink("change what I need", "need")
    ]);
  }

  function stepResult() {
    var need = needById(state.need);
    var act = currentActivity();
    var timeLabel = TIMES.filter(function (t) { return t.id === state.time; })[0].label;
    var quick = state.revealed;      // "eh, give me another" skips the entrance
    state.revealed = true;
    return h("div", { class: "view step" }, [
      h("div", { class: "reveal" + (quick ? " now" : "") }, [
        h("p", { class: "kicker vibe-kicker", text: "Your vibe \u00B7 " + timeLabel.toLowerCase() }),
        h("article", { class: "result", style: "--c:" + need.color + ";--tx:" + need.tx + ";--ic:" + need.ic }, [
          shape(need.shape),
          h("h1", { class: "result-title", "data-focus": true, text: act.title }),
          h("p", { class: "result-detail", text: act.detail })
        ]),
        h("div", { class: "actions" }, [
          h("button", { class: "btn", type: "button", onclick: function () { go("doing"); } }, ["LET'S GO"]),
          h("button", {
            class: "quiet quiet-big", type: "button",
            onclick: function () { state.variant += 1; renderExp(); }
          }, ["eh, give me another"])
        ]),
        h("div", { class: "back-row" }, [
          backLink("change my time", "time")
        ])
      ])
    ]);
  }

  function stepDoing() {
    var act = currentActivity();
    var need = needById(state.need);
    return h("div", { class: "view step doing" }, [
      h("h1", { class: "mega-sm", "data-focus": true, text: "Okay. Go." }),
      h("p", { class: "doing-act", style: "--c:" + need.color + ";--tx:" + need.tx, text: act.title }),
      h("p", { class: "voice", text: "No timer. Nobody's watching. Come back whenever, or don't." }),
      h("div", { class: "actions" }, [
        h("button", { class: "btn", type: "button", onclick: function () { go("feel"); } }, ["I'M BACK"]),
        h("button", { class: "quiet quiet-big", type: "button", onclick: function () { go("notnow"); } }, ["not right now"])
      ])
    ]);
  }

  function stepNotNow() {
    return h("div", { class: "view step end" }, [
      h("h1", { class: "mega-sm", "data-focus": true, text: "That's okay." }),
      h("p", { class: "voice", text: "Not now is a real answer. Nothing here expires." }),
      endLinks(),
      pile("end")
    ]);
  }

  function stepFeel() {
    return h("div", { class: "view step" }, [
      h("p", { class: "kicker", text: "Totally optional" }),
      h("h1", { class: "headline", "data-focus": true, text: "How did that feel?" }),
      h("ul", { class: "feelings", "aria-label": "How did that feel" }, FEELINGS.map(function (f) {
        return h("li", {}, [
          h("button", {
            class: "feeling", type: "button",
            onclick: function () { state.feeling = f.id; go(f.id === "thoughts" ? "reply" : "end"); }
          }, [
            h("span", { class: "emoji", "aria-hidden": "true", text: f.emoji }),
            h("span", { text: f.label })
          ])
        ]);
      })),
      h("button", { class: "quiet", type: "button", onclick: function () { state.feeling = null; go("end"); } }, ["skip it"])
    ]);
  }

  function stepReply() {
    var f = FEELINGS.filter(function (x) { return x.id === state.feeling; })[0];
    var kids = [
      h("h1", { class: "reply-line", "data-focus": true, text: f.reply })
    ];
    if (f.id === "thoughts") {
      kids.push(
        h("label", { class: "label", for: "thoughts", text: "Say it. It stays on this screen." }),
        h("textarea", { id: "thoughts", rows: "4", class: "thoughts" })
      );
    }
    kids.push(h("div", { class: "actions" }, [
      h("button", { class: "btn", type: "button", onclick: function () { go("end"); } }, ["OKAY"])
    ]));
    return h("div", { class: "view step" }, kids);
  }

  function endLinks() {
    return h("div", { class: "end-links" }, [
      h("button", { class: "quiet", type: "button", onclick: function () { resetState(); renderExp(); } }, ["start over"]),
      h("a", {
        class: "quiet", href: "#/",
        onclick: function (e) {
          if (IS_EMBED) { e.preventDefault(); window.parent.location.hash = "#/"; }
        }
      }, ["back to the playground"])
    ]);
  }

  function stepEnd() {
    return h("div", { class: "view step end" }, [
      h("h1", { class: "mega-sm", "data-focus": true, text: "That's it. Go live your life." }),
      endLinks(),
      pile("end")
    ]);
  }

  var STEPS = {
    need: stepNeed, time: stepTime, result: stepResult, doing: stepDoing,
    notnow: stepNotNow, feel: stepFeel, reply: stepReply, end: stepEnd
  };

  /* ---------- the halo: a ring that responds to how she's showing up ---------- */

  function sealPoints() {
    var pts = [], n = 16;
    for (var i = 0; i < n * 2; i++) {
      var r = i % 2 === 0 ? 97 : 84, a = (-90 + 180 * i / n) * Math.PI / 180;
      pts.push((100 + r * Math.cos(a)).toFixed(1) + "," + (100 + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(" ");
  }
  function makeHalo() {
    var el = h("div", { class: "halo", "aria-hidden": "true" });
    el.innerHTML =
      '<div class="halo-ring"></div>' +
      '<svg class="halo-seal" viewBox="0 0 200 200" focusable="false"><polygon points="' + sealPoints() + '"/></svg>' +
      '<div class="halo-ring halo-pair"></div>' +
      '<div class="halo-orbit"><i></i></div>';
    return el;
  }

  // On the first screen every ring type is a button. These are static copies
  // of the halo markup, each wearing its own mood.
  function tileRing(id) {
    var r = makeHalo();
    r.classList.add("halo-tile");
    r.setAttribute("data-need", id);
    return r;
  }

  // When she taps a ring, the big halo starts life exactly where that ring was,
  // then glides off to its place in the corner.
  function flipHaloFrom(ringEl, id) {
    if (!haloEl || !ringEl) return;
    var sr = stage.getBoundingClientRect(), r = ringEl.getBoundingClientRect();
    haloEl.style.transition = "none";
    haloEl.setAttribute("data-need", id);
    haloEl.style.width = haloEl.style.height = r.width + "px";
    haloEl.style.left = (r.left - sr.left) + "px";
    haloEl.style.top = (r.top - sr.top) + "px";
    haloEl.style.opacity = ".9";
    void haloEl.offsetWidth;
    haloEl.style.transition = "";
  }

  var SIZES = { none: 200, "2": 130, "5": 180, "15": 240, long: 330 };

  // Place the halo: tucked behind the top-right corner while she answers,
  // then wrapped around the result card once it appears.
  function layoutHalo() {
    if (!haloEl) return;
    var W = stage.getBoundingClientRect().width;
    var k = Math.min(W, 420) / 390;
    var size = (SIZES[state.time || "none"]) * k, cx, cy;
    var wrap = stage.querySelector(".result");
    if (state.step === "result" && wrap) {
      var sr = stage.getBoundingClientRect(), r = wrap.getBoundingClientRect();
      var rev = wrap.closest(".reveal"), ty = 0;
      if (rev) { var m = new DOMMatrix(getComputedStyle(rev).transform); ty = m.f; }
      size = Math.max(r.width * 1.2, r.height * 1.25);
      cx = r.left - sr.left + r.width / 2;
      cy = r.top - sr.top - ty + r.height / 2;
    } else {
      cx = W - size * 0.1;
      cy = 46 * k + size * 0.08;
    }
    haloEl.style.width = haloEl.style.height = size + "px";
    haloEl.style.left = (cx - size / 2) + "px";
    haloEl.style.top = (cy - size / 2) + "px";
  }
  window.addEventListener("resize", layoutHalo);

  function syncMood() {
    var moody = { time: 1, result: 1, doing: 1, feel: 1, reply: 1 }[state.step];
    if (moody && state.need) stage.setAttribute("data-mood", state.need); else stage.removeAttribute("data-mood");
    if (!haloEl) return;
    haloEl.setAttribute("data-need", state.need || "none");
    haloEl.setAttribute("data-time", state.time || "none");
    haloEl.setAttribute("data-step", state.step);
    layoutHalo();
    requestAnimationFrame(function () { layoutHalo(); haloEl.style.removeProperty("opacity"); });
  }

  function renderExp() {
    barTag.textContent = "Mood Ring";
    mount(STEPS[state.step](), { halo: true });
    syncMood();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutHalo);
  }

  /* ---------- desktop phone frame ---------- */

  // On wide screens Experiment 01 is shown inside a phone-shaped frame. The
  // frame holds an iframe of this same page (flagged ?embed) so the experiment
  // gets a real phone-width viewport and its responsive CSS behaves as on a phone.
  var IS_EMBED = /[?&]embed\b/.test(location.hash);
  var WIDE = window.matchMedia("(min-width: 900px)");
  if (IS_EMBED) document.body.classList.add("embed");

  function renderPhoneStage() {
    barTag.textContent = "";
    var frame = h("iframe", {
      class: "phone-screen", src: "index.html#/01?embed",
      title: "Club MFT Mood Ring on a phone"
    });
    var view = h("div", { class: "view stage-desk" }, [
      h("div", { class: "stage-note" }, [
        h("p", { class: "kicker", text: "Experiment 01" }),
        h("h1", { class: "mega-sm", "data-focus": true, text: "Club MFT Mood Ring" }),
        h("p", { class: "voice", text: "What if figuring out what you need wasn\u2019t another thing you had to figure out?" }),
        h("p", { class: "stage-aside", text: "Shown on a phone, because that's where she'll be. Go ahead, tap around." }),
        h("a", { class: "quiet", href: "#/" }, [h("span", { "aria-hidden": "true", text: "← " }), "back to the playground"])
      ]),
      h("div", { class: "phone" }, [
        h("span", { class: "phone-notch", "aria-hidden": "true" }),
        frame
      ])
    ]);
    mount(view);
    fitPhone();
  }

  // Shrink the phone to fit short windows; its inner screen keeps true phone width.
  function fitPhone() {
    var fit = Math.min(1, Math.max(0.5, (window.innerHeight - 130) / 868));
    document.documentElement.style.setProperty("--fit", fit);
  }
  window.addEventListener("resize", fitPhone);

  /* ---------- router ---------- */

  function route() {
    var hash = (location.hash || "#/").split("?")[0];
    if (hash === "#/01") {
      // re-entering from home always starts fresh
      if (!route.inExp) resetState();
      route.inExp = true;
      if (WIDE.matches && !IS_EMBED) renderPhoneStage();
      else renderExp();
    } else {
      route.inExp = false;
      renderHome();
    }
    document.title = route.inExp ? "Club MFT Mood Ring · Club MFT Playground" : "Club MFT Playground";
  }
  window.addEventListener("hashchange", route);
  if (!IS_EMBED) WIDE.addEventListener("change", route);
  route();
})();
