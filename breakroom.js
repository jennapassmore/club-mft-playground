/* BREAK ROOM (Experiment 02)
   A tiny room for being pissed for a minute. Four doors, four harmless things
   to do with it. Nothing typed here is saved, stored or sent anywhere: it
   lives in memory while the screen is open and then it's gone.
   No score, no streaks, no "how do you feel." Just: okay, bye. */
(function () {
  "use strict";

  var api, h, room;
  function reduced() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* ---------- content ---------- */

  var PLATES = [
    "The fucking dishes",
    "“What’s for dinner?”",
    "The school email I forgot to read",
    "Being the one who knows where everything is",
    "The mental load",
    "The 4:47 pm meltdown",
    "Whoever moved the wipes",
    "“Can you just…”"
  ];
  var PLATE_LOOKS = [
    { pc: "var(--sand)",     pr: "var(--red)",      pt: "var(--midnight)" },
    { pc: "var(--petal)",    pr: "var(--lipstick)", pt: "var(--midnight)" },
    { pc: "var(--sunshine)", pr: "var(--red)",      pt: "var(--midnight)" },
    { pc: "var(--lilac)",    pr: "var(--midnight)", pt: "var(--red)" }
  ];
  var QUIPS = ["Yeah. We know.", "Another one.", "Fair.", "Next.", "Oh, that one’s been waiting.", "Go on."];
  var SONGS = [
    "The song you only play when you’re alone in the car.",
    "Whatever you got ready to when you were 22.",
    "Anything with a bassline that rattles the dishes.",
    "The loudest thing on your phone. Go.",
    "A song with a key change. You know what to do.",
    "The one your kids would be embarrassed by."
  ];
  var DOORS = [
    { id: "scream", label: "Scream",           c: "var(--red)",      tx: "var(--sand)",     tilt: "-1.4deg", fs: 23, glow: ["#FFC2B0", "#E8505B", "#7A1E2C"] },
    { id: "smash",  label: "Smash\nit",  c: "var(--sunshine)", tx: "var(--midnight)", tilt: "1.2deg", fs: 26, glow: ["#FFE3A3", "#F4B84F", "#8E4A3B"] },
    { id: "type",   label: "Type\nit\nout",      c: "var(--lipstick)", tx: "var(--midnight)", tilt: "1deg", fs: 26, glow: ["#FFE0F1", "#ED79B9", "#7A3563"] },
    { id: "shake",  label: "Shake\nit\noff",     c: "var(--lilac)",    tx: "var(--midnight)", tilt: "-1.2deg", fs: 26, glow: ["#F6EEFF", "#B79CF0", "#4F3C86"] }
  ];

  function resetRoom() {
    room = { step: "doors", queue: PLATES.map(function (t, i) { return { t: t, look: PLATE_LOOKS[i % PLATE_LOOKS.length] }; }), cur: null, song: -1 };
    room.cur = room.queue.shift();
  }
  var SVG_NS = "http://www.w3.org/2000/svg";
  function rand(a, b) { return a + Math.random() * (b - a); }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* optional */ } }

  function sealPoints(n, ro, ri) {
    var pts = [];
    for (var i = 0; i < n * 2; i++) {
      var r = i % 2 === 0 ? ro : ri, a = (-90 + 180 * i / n) * Math.PI / 180;
      pts.push((100 + r * Math.cos(a)).toFixed(1) + "," + (100 + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(" ");
  }
  function burstEl(cls) {
    var s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 200 200");
    s.setAttribute("class", cls);
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    s.innerHTML = '<polygon points="' + sealPoints(14, 98, 70) + '"/>';
    return s;
  }

  /* ---------- shared bits ---------- */

  function go(step) { room.step = step; draw(); }
  function draw() {
    var views = { doors: viewDoors, scream: viewScream, smash: viewSmash, type: viewType, shake: viewShake, after: viewAfter, bye: viewBye };
    api.setTag("Break Room");
    var live = { scream: 1, smash: 1, type: 1, shake: 1 };
    if (live[room.step]) room.last = room.step;
    if (room.step === "doors") room.last = null;
    // the room's color follows her through the whole thing, including the way out
    document.body.setAttribute("data-room", live[room.step] ? room.step : (room.last || "doors"));
    document.body.classList.add("in-room");
    api.mount(views[room.step]());
  }
  function backToDoors() {
    return h("button", { class: "quiet", type: "button", onclick: function () { go("doors"); } }, [
      h("span", { "aria-hidden": "true", text: "← " }), "back to the doors"
    ]);
  }
  function homeLink() {
    return h("a", {
      class: "quiet", href: "#/",
      onclick: function (e) { if (api.isEmbed) { e.preventDefault(); window.parent.location.hash = "#/"; } }
    }, ["back to the playground"]);
  }
  function shake(el, big) {
    if (reduced() || !el.animate) return;
    var a = big ? 12 : 7;
    el.animate([
      { transform: "translate(0,0) rotate(0)" },
      { transform: "translate(" + (-a) + "px," + (a * .4) + "px) rotate(-.6deg)" },
      { transform: "translate(" + a + "px," + (-a * .5) + "px) rotate(.5deg)" },
      { transform: "translate(" + (-a * .6) + "px," + (a * .3) + "px) rotate(-.3deg)" },
      { transform: "translate(" + (a * .3) + "px,-2px) rotate(.2deg)" },
      { transform: "translate(0,0) rotate(0)" }
    ], { duration: big ? 380 : 300, easing: "ease-out" });
  }

  /* ---------- the four doors ---------- */

  // The door swings open, light spills out, then we walk in.
  function openDoor(btn, id, glow) {
    if (room.opening) return;
    if (reduced() || !btn.animate) { go(id); return; }
    room.opening = true;
    document.body.classList.add("entering");
    btn.parentNode.parentNode.classList.add("picked");
    btn.classList.add("open");
    buzz(15);
    // door swings open, then we walk through it: zoom into the light
    setTimeout(function () { btn.classList.add("zoom"); }, 520);
    setTimeout(function () {
      room.opening = false;
      document.body.classList.remove("entering");
      if (room.step !== "doors") return;
      var flash = h("div", { class: "light-flash", "aria-hidden": "true", style: "background:radial-gradient(circle at 50% 60%," + glow[0] + "," + glow[1] + ")" });
      document.body.appendChild(flash);
      flash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: "ease-out" }).onfinish = function () { flash.remove(); };
      go(id);
    }, 1150);
  }

  function viewDoors() {
    return h("div", { class: "view room-view doors-view" }, [
      h("p", { class: "kicker room-kicker", text: "Break Room" }),
      h("h1", { class: "room-title", "data-focus": true }, ["What’s ", h("span", { class: "hl", text: "pissing" }), " you off?"]),
      h("p", { class: "room-voice", text: "Nobody’s going to tell you to breathe." }),
      h("h2", { class: "room-ask", id: "ask-doors", text: "I want to..." }),
      h("ul", { class: "doors", "aria-labelledby": "ask-doors" }, DOORS.map(function (d) {
        return h("li", {}, [
          h("button", {
            class: "door", type: "button",
            style: "--c:" + d.c + ";--tx:" + d.tx + ";--tilt:" + d.tilt + ";--fs:" + d.fs + ";--g1:" + d.glow[0] + ";--g2:" + d.glow[1] + ";--g3:" + d.glow[2],
            onclick: function (e) { openDoor(e.currentTarget, d.id, d.glow); }
          }, [
            h("span", { class: "door-leaf" }, [
              h("span", { class: "door-label", text: d.label }),
              h("span", { class: "door-knob", "aria-hidden": "true" })
            ])
          ])
        ]);
      }))
    ]);
  }

  /* ---------- 1. scream ---------- */

  function viewScream() {
    var held = false, t0 = 0, raf = 0, maxT = 0;
    var lines = [h("div", { text: "AAAAA" }), h("div", { text: "AAAAAAAAAAAA" }), h("div", { text: "AAAAAAAAAAAAAAAAAAAAAA" })];
    var text = h("div", { class: "scream-text idle", "aria-hidden": "true" }, lines);
    var burst = burstEl("scream-burst");
    var stage = h("div", { class: "scream-stage" }, [burst, text]);
    var label = h("span", { class: "scream-label", "aria-hidden": "true", text: "HOLD TO SCREAM" });
    var btn = h("button", { class: "scream-btn", type: "button", "aria-label": "Hold to scream" }, [label]);
    var hint = h("p", { class: "room-voice scream-hint", text: "Nobody’s listening. We’re not either." });
    var shell = h("div", { class: "shake-shell" }, [stage, btn]);
    var tail = h("div", { class: "scream-tail" }, [hint]);
    var view = h("div", { class: "view room-view scream-view" }, [
      h("p", { class: "kicker room-kicker", text: "Scream" }),
      h("h1", { class: "sr", "data-focus": true, text: "Scream" }),
      shell, tail, h("div", { class: "back-row" }, [backToDoors()])
    ]);

    function paint(t) {
      var a = 3 + Math.floor(t * 9), b = 6 + Math.floor(t * 20), c = 10 + Math.floor(t * 38);
      lines[0].textContent = new Array(a + 3).join("A");
      lines[1].textContent = new Array(b + 7).join("A");
      lines[2].textContent = new Array(c + 11).join("A");
      text.classList.remove("idle");
      text.dataset.heat = t < 0.34 ? "1" : t < 0.67 ? "2" : "3";
      if (!reduced()) {
        var s = 1 + t * 0.22;
        text.style.transform = "scale(" + s.toFixed(3) + "," + (s * (1 + t * 0.12)).toFixed(3) + ") rotate(" + (Math.sin(t * 40) * t * 2).toFixed(2) + "deg)";
        burst.style.opacity = Math.min(1, t * 1.4).toFixed(2);
        burst.style.transform = "scale(" + (0.3 + t * 0.8).toFixed(3) + ") rotate(" + (t * 40).toFixed(1) + "deg)";
        var amp = t * 9;
        shell.style.transform = "translate(" + rand(-amp, amp).toFixed(1) + "px," + rand(-amp, amp).toFixed(1) + "px) rotate(" + (rand(-amp, amp) * 0.12).toFixed(2) + "deg)";
      }
      label.textContent = t > 0.8 ? "LET IT OUT" : t > 0.35 ? "KEEP GOING" : "AAAAA…";
    }
    function frame(now) {
      if (!held) return;
      var t;
      if (reduced()) t = Math.min(1, Math.floor((now - t0) / 650) / 4);
      else t = Math.min(1, Math.pow((now - t0) / 2800, 1.15));
      if (t > maxT) maxT = t;
      paint(t);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (held) return; held = true; maxT = 0; t0 = performance.now(); btn.classList.add("held"); raf = requestAnimationFrame(frame); buzz(12); }
    function stop() {
      if (!held) return;
      held = false; cancelAnimationFrame(raf); btn.classList.remove("held"); shell.style.transform = "";
      if (maxT < 0.12) {
        lines[0].textContent = "AAAAA"; lines[1].textContent = "AAAAAAAAAAAA"; lines[2].textContent = "AAAAAAAAAAAAAAAAAAAAAA";
        text.classList.add("idle"); text.style.transform = ""; burst.style.opacity = 0;
        label.textContent = "HOLD TO SCREAM"; hint.textContent = "Hold it. Longer.";
        return;
      }
      btn.remove();
      clear(tail);
      tail.appendChild(h("p", { class: "better", "data-focus": true, text: "Better?" }));
      tail.appendChild(h("div", { class: "actions" }, [
        h("button", { class: "btn btn-alt", type: "button", onclick: function () { go("after"); } }, ["A LITTLE"]),
        h("button", { class: "btn", type: "button", onclick: function () { go("scream"); } }, ["AGAIN"])
      ]));
      tail.querySelector("[data-focus]").setAttribute("tabindex", "-1");
      tail.querySelector("[data-focus]").focus({ preventScroll: true });
    }
    btn.addEventListener("pointerdown", function (e) { e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch (x) { /* fine */ } start(); });
    btn.addEventListener("pointerup", stop);
    btn.addEventListener("pointercancel", stop);
    btn.addEventListener("blur", stop);
    btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    btn.addEventListener("keydown", function (e) { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } });
    btn.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); stop(); } });
    return view;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /* ---------- 2. smash it ---------- */

  function pfs(t) { var n = t.length; return n <= 14 ? 13 : n <= 24 ? 10.5 : n <= 36 ? 8.8 : 7.2; }

  // Irregular shards of a round plate: wedges, each split into an outer chunk and a center chunk.
  function makeShards() {
    var W = 6 + Math.floor(Math.random() * 3), cuts = [], start = Math.random() * Math.PI * 2, sum = 0, segs = [], i;
    for (i = 0; i < W; i++) { segs.push(rand(0.6, 1.4)); sum += segs[i]; }
    var acc = start;
    for (i = 0; i < W; i++) { cuts.push(acc); acc += segs[i] / sum * Math.PI * 2; }
    var shards = [];
    function P(r, a, j) { var d = j ? rand(-2.2, 2.2) : 0; return [50 + 50 * r * Math.cos(a) + d, 50 + 50 * r * Math.sin(a) + d]; }
    for (i = 0; i < W; i++) {
      var a0 = cuts[i], a1 = i === W - 1 ? cuts[0] + Math.PI * 2 : cuts[i + 1], rho = rand(0.36, 0.5), span = a1 - a0;
      var outer = [P(rho, a0, 1), P(rho, a0 + span / 2, 1), P(rho, a1, 1), P(1, a1, 0), P(1, a1 - span * 0.33, 0), P(1, a1 - span * 0.66, 0), P(1, a0, 0)];
      var inner = [[50 + rand(-2, 2), 50 + rand(-2, 2)], P(rho, a0, 1), P(rho, a0 + span / 2, 1), P(rho, a1, 1)];
      shards.push(outer, inner);
    }
    return shards.map(function (pts) {
      var cx = 0, cy = 0; pts.forEach(function (p) { cx += p[0]; cy += p[1]; });
      return { pts: pts, cx: cx / pts.length, cy: cy / pts.length };
    });
  }
  function poly(pts) { return "polygon(" + pts.map(function (p) { return p[0].toFixed(1) + "% " + p[1].toFixed(1) + "%"; }).join(",") + ")"; }

  function viewSmash() {
    var shelf = h("div", { class: "shelf" });
    var shell = h("div", { class: "shake-shell" }, [shelf]);
    var hint = h("p", { class: "room-voice smash-hint", text: "Press. Hold. Let go." });
    var actions = h("div", { class: "smash-actions" });
    var view = h("div", { class: "view room-view smash-view" }, [
      h("p", { class: "kicker room-kicker", text: "Smash it" }),
      h("h1", { class: "sr", "data-focus": true, text: "Smash it" }),
      shell, hint, actions
    ]);
    var busy = false, writing = false;

    function plateButton(p) {
      var face = h("div", { class: "plate-face", style: "--pc:" + p.look.pc + ";--pr:" + p.look.pr + ";--pt:" + p.look.pt + ";--pfs:" + pfs(p.t) }, [
        h("span", { class: "plate-text", text: p.t })
      ]);
      var crack = document.createElementNS(SVG_NS, "svg");
      crack.setAttribute("viewBox", "0 0 100 100"); crack.setAttribute("class", "plate-crack"); crack.setAttribute("aria-hidden", "true"); crack.setAttribute("focusable", "false");
      crack.innerHTML = ['M50 50L44 38L48 28L42 14L45 4', 'M50 50L62 44L70 34L84 30L96 22', 'M50 50L58 62L56 74L66 86L64 97', 'M50 50L38 58L26 56L16 66L5 64', 'M50 50L40 46L30 40L20 42', 'M62 44L66 54L78 58']
        .map(function (d) { return '<path d="' + d + '" pathLength="100"/>'; }).join("");
      var btn = h("button", { class: "plate", type: "button", "aria-label": "Smash: " + p.t }, [face, crack]);
      var down = false, w = 0, raf = 0, t0 = 0;
      function wind(now) {
        if (!down) return;
        w = Math.min(1, (now - t0) / 650);
        crack.style.setProperty("--w", w.toFixed(3));
        if (!reduced()) face.style.transform = "rotate(" + (Math.sin(now / 22) * w * 2.2).toFixed(2) + "deg) scale(" + (1 + w * 0.035).toFixed(3) + ")";
        raf = requestAnimationFrame(wind);
      }
      function start() { if (down || busy) return; down = true; t0 = performance.now(); w = 0; btn.classList.add("winding"); raf = requestAnimationFrame(wind); buzz(10); }
      function release() { if (!down) return; down = false; cancelAnimationFrame(raf); face.style.transform = ""; shatter(btn, face, w); }
      function cancel() { if (!down) return; down = false; cancelAnimationFrame(raf); face.style.transform = ""; crack.style.setProperty("--w", 0); btn.classList.remove("winding"); }
      btn.addEventListener("pointerdown", function (e) { e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch (x) { /* fine */ } start(); });
      btn.addEventListener("pointerup", release);
      btn.addEventListener("pointercancel", cancel);
      btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      btn.addEventListener("keydown", function (e) { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } });
      btn.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); release(); } });
      btn.addEventListener("blur", cancel);
      // assistive tech activates with a plain click
      btn.addEventListener("click", function (e) { if (e.detail === 0 && !down && !busy) shatter(btn, face, 0.6); });
      return btn;
    }

    function drawShelf() {
      clear(shelf);
      if (!room.cur) {
        shelf.appendChild(h("div", { class: "plate-empty" }, [h("span", { text: "That’s the whole shelf." })]));
        return null;
      }
      var backs = Math.min(2, room.queue.length);
      for (var i = backs; i >= 1; i--) {
        var look = room.queue[i - 1].look;
        shelf.appendChild(h("i", { class: "stack-back", "aria-hidden": "true", style: "--pc:" + look.pc + ";--sy:" + (i * 9) + "px;--ss:" + (1 - i * 0.055) }));
      }
      var b = plateButton(room.cur);
      shelf.appendChild(b);
      if (!reduced() && b.animate) b.animate([{ transform: "translateY(26px) scale(.9)", opacity: 0 }, { transform: "translateY(0) scale(1)", opacity: 1 }], { duration: 360, easing: "cubic-bezier(.3,1.4,.5,1)" });
      return b;
    }

    function drawActions() {
      clear(actions);
      if (writing) {
        var input = h("input", { id: "own", class: "own-input", type: "text", maxlength: "60", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-describedby": "own-note" });
        var form = h("form", { class: "own-form", onsubmit: function (e) {
          e.preventDefault();
          var text = input.value.replace(/\s+/g, " ").trim();
          input.value = "";
          if (!text) { input.focus(); return; }
          if (room.cur) room.queue.unshift(room.cur);
          room.cur = { t: text, look: PLATE_LOOKS[0], custom: true };
          writing = false; drawActions(); var b = drawShelf(); setHint("It’s your plate. Break it."); if (b) b.focus();
        } }, [
          h("label", { class: "own-label", for: "own", text: "What’s pissing you off?" }),
          h("div", { class: "own-row" }, [input, h("button", { class: "btn btn-alt", type: "submit" }, ["PUT IT ON A PLATE"])]),
          h("p", { class: "own-note", id: "own-note", text: "WE DON’T SAVE THIS SHIT." }),
          h("button", { class: "quiet", type: "button", onclick: function () { writing = false; drawActions(); } }, ["never mind"])
        ]);
        actions.appendChild(form);
        input.focus();
        return;
      }
      actions.appendChild(h("button", { class: "btn btn-alt own-btn", type: "button", onclick: function () { writing = true; drawActions(); } }, ["+ WRITE YOUR OWN"]));
      actions.appendChild(h("div", { class: "smash-links" }, [
        h("button", { class: "quiet", type: "button", onclick: function () { go("after"); } }, ["I’m done"]),
        backToDoors()
      ]));
    }
    function setHint(t) { hint.textContent = t; }

    function shatter(btn, face, wound) {
      if (busy) return;
      busy = true;
      buzz([20, 30, 40]);
      var burst = burstEl("smash-burst");
      shelf.insertBefore(burst, btn);
      face.style.visibility = "hidden";
      btn.querySelector(".plate-crack").style.display = "none";
      btn.disabled = true;
      var done = 1000;
      if (reduced()) {
        // calm version: the plate just splits in two and fades, text and all
        [["polygon(0 0,53% 0,47% 22%,55% 40%,46% 62%,54% 82%,49% 100%,0 100%)", "-5px,2px", "-3deg"],
         ["polygon(53% 0,100% 0,100% 100%,49% 100%,54% 82%,46% 62%,55% 40%,47% 22%)", "6px,3px", "4deg"]].forEach(function (half) {
          var s = h("div", { class: "shard static", "aria-hidden": "true", style: "clip-path:" + half[0] + ";transform:translate(" + half[1] + ") rotate(" + half[2] + ")" });
          var c = face.cloneNode(true); c.style.visibility = "visible"; c.style.transform = ""; s.appendChild(c); shelf.appendChild(s);
        });
        burst.style.opacity = 0;
        done = 650;
      } else {
        burst.animate([{ transform: "scale(.3) rotate(0deg)", opacity: 0.95 }, { transform: "scale(1.55) rotate(14deg)", opacity: 0 }], { duration: 440, easing: "ease-out" });
        shake(shell, true);
        makeShards().forEach(function (sh) {
          var s = h("div", { class: "shard", "aria-hidden": "true" });
          s.style.clipPath = poly(sh.pts);
          var c = face.cloneNode(true); c.style.visibility = "visible"; c.style.transform = ""; s.appendChild(c); shelf.appendChild(s);
          var dx = sh.cx - 50, dy = sh.cy - 50, len = Math.sqrt(dx * dx + dy * dy) || 1;
          var sp = rand(120, 300), vx = dx / len * sp + rand(-40, 40), vy = dy / len * sp * 0.6 - rand(30, 110);
          var fall = rand(380, 760), rot = rand(-170, 170);
          s.animate([
            { transform: "translate(0,0) rotate(0deg)", opacity: 1, offset: 0 },
            { transform: "translate(" + (vx * 0.5) + "px," + (vy * 0.5) + "px) rotate(" + (rot * 0.35) + "deg)", opacity: 1, offset: 0.26 },
            { transform: "translate(" + (vx * 1.1) + "px," + (vy + fall) + "px) rotate(" + rot + "deg)", opacity: 0, offset: 1 }
          ], { duration: rand(950, 1350), delay: rand(0, 50), easing: "cubic-bezier(.3,.5,.55,1)", fill: "forwards" });
        });
        done = 1250;
      }
      setTimeout(function () {
        if (room.step !== "smash") return;                  // she already left
        room.cur = room.queue.shift() || null;
        busy = false; clear(shelf);
        var b = drawShelf();
        if (room.cur) setHint(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
        else setHint("There’s always more.");
        if (b) b.focus({ preventScroll: true }); else { var own = actions.querySelector(".own-btn"); if (own) own.focus({ preventScroll: true }); }
      }, done);
    }

    drawShelf(); drawActions();
    return view;
  }

  /* ---------- 3. type it out ---------- */

  function viewType() {
    var area = h("textarea", { class: "sheet", id: "rant", rows: "9", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-describedby": "rant-note" });
    var wrap = h("div", { class: "sheet-wrap" }, [area]);
    var btn = h("button", { class: "btn", type: "button", disabled: true, onclick: shred }, ["GET IT OUT OF HERE"]);
    var view = h("div", { class: "view room-view type-view" }, [
      h("p", { class: "kicker room-kicker", text: "Type it out" }),
      h("h1", { class: "room-title room-title-sm", "data-focus": true, id: "rant-label", text: "Go ahead. Say the thing you’re not supposed to say." }),
      wrap,
      h("p", { class: "own-note", id: "rant-note", text: "We don’t save this shit. Not even a little." }),
      h("div", { class: "actions" }, [btn]),
      h("div", { class: "back-row" }, [backToDoors()])
    ]);
    area.setAttribute("aria-labelledby", "rant-label");
    area.addEventListener("input", function () { btn.disabled = !area.value.trim(); });

    function shred() {
      var text = area.value;
      if (!text.trim()) return;
      area.value = ""; btn.disabled = true; area.disabled = true;
      var r = area.getBoundingClientRect(), wr = wrap.getBoundingClientRect(), cs = getComputedStyle(area);
      if (reduced() || !document.body.animate) {
        area.style.visibility = "hidden";
        setTimeout(function () { if (room.step === "type") go("after"); }, 450);
        return;
      }
      var N = 14, box = h("div", { class: "shred", "aria-hidden": "true", style: "left:" + (r.left - wr.left) + "px;top:" + (r.top - wr.top) + "px;width:" + r.width + "px;height:" + r.height + "px" });
      for (var i = 0; i < N; i++) {
        var strip = h("div", { class: "strip" });
        var sheet = h("div", { class: "strip-sheet", text: text, style: "font:" + cs.font + ";padding:" + cs.padding + ";line-height:" + cs.lineHeight });
        strip.appendChild(sheet);
        strip.style.clipPath = "inset(0 " + ((1 - (i + 1) / N) * 100).toFixed(2) + "% 0 " + (i / N * 100).toFixed(2) + "%)";
        box.appendChild(strip);
      }
      wrap.appendChild(box); area.style.visibility = "hidden";
      shake(wrap, false);
      [].forEach.call(box.children, function (strip, i) {
        var dx = rand(-14, 14), rot = rand(-16, 16), fall = r.height + 220;
        strip.animate([
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + (dx * 0.3) + "px,-10px) rotate(" + (rot * 0.2) + "deg)", opacity: 1, offset: 0.12 },
          { transform: "translate(" + dx + "px," + fall + "px) rotate(" + rot + "deg)", opacity: 0.6 }
        ], { duration: rand(650, 1000), delay: i * 38 + rand(0, 60), easing: "cubic-bezier(.5,0,.9,.5)", fill: "forwards" });
      });
      setTimeout(function () { box.remove(); }, 1700);
      setTimeout(function () { if (room.step === "type") go("after"); }, 2100);
    }
    return view;
  }

  /* ---------- 4. shake it off ---------- */

  function viewShake() {
    var out = h("div", { class: "song-out" });
    var cta = h("button", { class: "btn", type: "button", onclick: function () { pick(); } }, ["GIVE ME A SONG"]);
    var actions = h("div", { class: "actions" }, [cta]);
    function pick() {
      var i; do { i = Math.floor(Math.random() * SONGS.length); } while (i === room.song && SONGS.length > 1);
      room.song = i;
      clear(out);
      out.appendChild(h("div", { class: "song-card" }, [
        h("p", { class: "song-text", "data-song": true, text: SONGS[i] }),
        h("p", { class: "own-note", text: "(Pretend this opens an MFT playlist.)" })
      ]));
      clear(actions);
      actions.appendChild(h("button", { class: "btn btn-alt", type: "button", onclick: function () { pick(); } }, ["ANOTHER ONE"]));
      actions.appendChild(h("button", { class: "btn", type: "button", onclick: function () { go("after"); } }, ["OKAY"]));
    }
    return h("div", { class: "view room-view shake-view" }, [
      h("p", { class: "kicker room-kicker", text: "Shake it off" }),
      h("h1", { class: "room-title wiggle", "data-focus": true, text: "Okay. Get up." }),
      h("p", { class: "room-voice big", text: "One song. Shake your arms. Shake your ass. Nobody’s watching." }),
      out, actions,
      h("div", { class: "back-row" }, [backToDoors()])
    ]);
  }

  /* ---------- the way out ---------- */

  function viewAfter() {
    return h("div", { class: "view room-view after-view" }, [
      h("h1", { class: "room-mega", "data-focus": true, text: "Okay." }),
      h("p", { class: "room-voice big", text: "That was a lot." }),
      h("div", { class: "actions" }, [
        h("button", { class: "btn", type: "button", onclick: function () { go("bye"); } }, ["I’M GOOD"]),
        h("button", { class: "btn btn-alt", type: "button", onclick: function () { go("doors"); } }, ["I’VE GOT MORE"])
      ])
    ]);
  }

  function viewBye() {
    return h("div", { class: "view room-view bye-view" }, [
      h("h1", { class: "room-mega", "data-focus": true, text: "Cool. Get outta here." }),
      h("div", { class: "end-links" }, [homeLink()]),
      api.pile("end")
    ]);
  }

  /* ---------- public ---------- */

  window.BreakRoom = {
    reset: resetRoom,
    render: function (a) { api = a; h = a.h; if (!room) resetRoom(); draw(); }
  };
  resetRoom();
})();
