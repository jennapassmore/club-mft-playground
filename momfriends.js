/* MOM FRIENDS (Experiment 03)
   A tiny experience that turns "we should hang" into an actual plan.
   Every gathering below is made up: fictional people, places and times.
   Nothing is stored, sent, scheduled or located. */
(function () {
  "use strict";

  var api, h, S;
  function reduced() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }

  /* ---------- the questions ---------- */

  var KINDS = [
    { id: "coffee", label: "Coffee", sub: "classic, caffeinated" },
    { id: "drinks", label: "Drinks", sub: "adult beverages optional" },
    { id: "walk",   label: "A walk", sub: "moving, but gently" },
    { id: "fun",    label: "Something fun", sub: "bad art, karaoke, who knows" },
    { id: "any",    label: "Surprise me", sub: "you pick, we’ll go" }
  ];
  var KIDS = [
    { id: "yes",    label: "Yep, little plus-one", sub: "they’re coming, snacks and all" },
    { id: "no",     label: "Dear god, no kids",    sub: "sit down. be a person." },
    { id: "either", label: "Either works",         sub: "whatever the day brings" }
  ];
  var CREWS = [
    { id: "one",   label: "Just one, please", sub: "one new human, tops" },
    { id: "small", label: "A small crew",     sub: "three or four of us" },
    { id: "big",   label: "Throw me in",      sub: "the more the louder" }
  ];
  var WHENS = [
    { id: "week",    label: "This week" },
    { id: "weekend", label: "This weekend" },
    { id: "next",    label: "Next week" },
    { id: "flex",    label: "I’m flexible" }
  ];
  var CREW_N = { one: 2, small: 4, big: 8 };

  /* ---------- fictional gatherings (made up, on purpose) ---------- */

  var PLANS = [
    { id: 1,  kind: "coffee", crew: "one",   kids: true,  slot: "week",    day: "TUESDAY",   time: "10:00 AM", title: "Coffee, just the two of you", place: "A café with good chairs",              note: "bring nothing. seriously." },
    { id: 2,  kind: "coffee", crew: "small", kids: true,  slot: "weekend", day: "SATURDAY",  time: "10:00 AM", title: "Coffee + a walk",             place: "A stroller-friendly patio",                  note: "yes, the kids can scream." },
    { id: 3,  kind: "coffee", crew: "one",   kids: false, slot: "week",    day: "WEDNESDAY", time: "1:15 PM",  title: "One long, uninterrupted coffee", place: "A quiet corner table",                    note: "finish a sentence. then another." },
    { id: 4,  kind: "coffee", crew: "big",   kids: true,  slot: "weekend", day: "SATURDAY",  time: "9:30 AM",  title: "Coffee, the loud version",    place: "A café with room for strollers",       note: "nobody is counting the muffins." },
    { id: 5,  kind: "drinks", crew: "small", kids: false, slot: "week",    day: "THURSDAY",  time: "7:30 PM",  title: "Drinks. Nobody needs a snack.", place: "A bar with a back booth",                  note: "wear the good jeans. or don't." },
    { id: 6,  kind: "drinks", crew: "one",   kids: false, slot: "weekend", day: "SATURDAY",  time: "6:00 PM",  title: "One drink, one real conversation", place: "A bar that plays old songs",           note: "you can leave at 8:15." },
    { id: 7,  kind: "drinks", crew: "big",   kids: false, slot: "weekend", day: "SATURDAY",  time: "8:00 PM",  title: "A loud table in the back",    place: "A place with big tables",                    note: "someone will order fries." },
    { id: 8,  kind: "drinks", crew: "small", kids: true,  slot: "weekend", day: "SUNDAY",    time: "4:00 PM",  title: "Early drinks on a patio",     place: "A patio with a kids’ menu",             note: "juice boxes count as a round." },
    { id: 9,  kind: "walk",   crew: "small", kids: true,  slot: "weekend", day: "SUNDAY",    time: "10:00 AM", title: "A park lap + snacks",         place: "A park with a decent bench",                 note: "snacks are communal." },
    { id: 10, kind: "walk",   crew: "one",   kids: false, slot: "week",    day: "MONDAY",    time: "6:30 PM",  title: "A walk with a grown-up",      place: "A neighborhood loop",                        note: "no destination. no pace." },
    { id: 11, kind: "walk",   crew: "big",   kids: true,  slot: "weekend", day: "SATURDAY",  time: "11:00 AM", title: "A very slow group walk",      place: "A flat, shady trail",                        note: "slow is the whole point." },
    { id: 12, kind: "walk",   crew: "one",   kids: true,  slot: "week",    day: "THURSDAY",  time: "9:30 AM",  title: "A stroller lap for two",      place: "A park with a good loop",                    note: "talk. or don't." },
    { id: 13, kind: "fun",    crew: "small", kids: true,  slot: "weekend", day: "SATURDAY",  time: "2:00 PM",  title: "Craft table. Bad art encouraged.", place: "A table, some paint, a lot of paper",   note: "no one is judging the horse." },
    { id: 14, kind: "fun",    crew: "big",   kids: false, slot: "week",    day: "FRIDAY",    time: "7:00 PM",  title: "Karaoke. You don’t have to sing.", place: "A private room with a tambourine",     note: "tambourine is a valid role." },
    { id: 15, kind: "fun",    crew: "one",   kids: false, slot: "weekend", day: "SUNDAY",    time: "1:00 PM",  title: "Mini golf, low stakes",       place: "A windmill, probably",                       note: "keeping score is optional." },
    { id: 16, kind: "fun",    crew: "small", kids: false, slot: "week",    day: "WEDNESDAY", time: "7:00 PM",  title: "Trivia for people who haven’t read since 2019", place: "A bar with a quiz night", note: "team name: you pick." }
  ];

  /* ---------- state ---------- */

  function reset() {
    S = { step: "invite", kind: null, kids: null, crew: null, when: null, shown: [], cur: null, head: "Cool. We made a plan.", alt: false, adjust: null, cal: false };
  }
  function find(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }

  function choosePlan() {
    var pool = PLANS.filter(function (p) { return S.shown.indexOf(p.id) < 0; });
    if (!pool.length) { S.shown = []; pool = PLANS.slice(); }
    var best = -99, top = [];
    pool.forEach(function (p) {
      var sc = 0;
      if (S.kind === "any") sc += 1; else if (p.kind === S.kind) sc += 4;
      if (p.crew === S.crew) sc += 2;
      if (S.kids === "yes") sc += p.kids ? 3 : -6;
      else if (S.kids === "no") sc += p.kids ? -6 : 3;
      else sc += 1;
      if (S.when === "week" && p.slot === "week") sc += 2;
      else if (S.when === "weekend" && p.slot === "weekend") sc += 2;
      else if (S.when === "week" || S.when === "weekend") sc -= 1;
      else sc += 1;
      if (sc > best) { best = sc; top = [p]; } else if (sc === best) top.push(p);
    });
    var plan = pickRandom(top);
    S.shown.push(plan.id);
    S.cur = plan;
  }

  /* ---------- helpers ---------- */

  function go(step) { S.step = step; draw(); }
  function draw() {
    var views = { invite: viewInvite, kind: viewKind, kids: viewKids, crew: viewCrew, when: viewWhen, making: viewMaking, plan: viewPlan, "in": viewIn };
    api.setTag("Mom Friends");
    api.mount(views[S.step]());
  }
  function back(label, step) {
    return h("button", { class: "quiet", type: "button", onclick: function () { go(step); } }, [h("span", { "aria-hidden": "true", text: "← " }), label]);
  }
  function homeLink() {
    return h("a", {
      class: "quiet", href: "#/",
      onclick: function (e) { if (api.isEmbed) { e.preventDefault(); window.parent.location.hash = "#/"; } }
    }, ["back to the playground"]);
  }
  function dayLabel(p) { return (S.when === "next" ? "NEXT " : "") + p.day; }

  // A row of big invitation-style answers. Picking one moves on.
  function picks(label, list, onPick, cls) {
    return h("ul", { class: "mf-picks " + (cls || ""), "aria-label": label }, list.map(function (o, i) {
      return h("li", {}, [
        h("button", {
          class: "mf-pick", type: "button", style: "--r:" + (i % 2 ? 0.8 : -0.8) + "deg",
          onclick: function (e) {
            var b = e.currentTarget;
            b.classList.add("chosen");
            if (reduced()) onPick(o); else setTimeout(function () { onPick(o); }, 240);
          }
        }, [
          h("span", { class: "mf-pick-label", text: o.label }),
          o.sub ? h("span", { class: "mf-pick-sub", text: o.sub }) : null
        ])
      ]);
    }));
  }

  function question(kicker, q, label, list, onPick, backLabel, backStep, cls) {
    return h("div", { class: "view mf-view" }, [
      h("p", { class: "kicker", text: kicker }),
      h("h1", { class: "mf-q", "data-focus": true, text: q }),
      picks(label, list, onPick, cls),
      h("div", { class: "back-row" }, [back(backLabel, backStep)])
    ]);
  }

  /* ---------- steps ---------- */

  function viewInvite() {
    return h("div", { class: "view mf-view mf-invite" }, [
      h("span", { class: "mf-tape", "aria-hidden": "true" }),
      h("p", { class: "kicker", text: "Mom Friends" }),
      h("h1", { class: "mf-hero", "data-focus": true, text: "Making mom friends shouldn’t be a part-time job." }),
      h("p", { class: "voice", text: "Tell us what sounds good. We’ll handle the awkward part." }),
      h("div", { class: "actions" }, [
        h("button", { class: "btn", type: "button", onclick: function () { go("kind"); } }, ["LET’S HANG"])
      ]),
      h("p", { class: "mf-fine", text: "Every plan in here is made up. No real people, places or reservations." })
    ]);
  }

  function viewKind() {
    return question("1 of 4", "What kind of hanging are we talking?", "Kind of hang", KINDS,
      function (o) { S.kind = o.id; go("kids"); }, "back", "invite");
  }
  function viewKids() {
    return question("2 of 4", "Kids coming?", "Kids", KIDS,
      function (o) { S.kids = o.id; go("crew"); }, "back", "kind");
  }
  function viewCrew() {
    return question("3 of 4", "How many new humans can you handle?", "Group size", CREWS,
      function (o) { S.crew = o.id; go("when"); }, "back", "kids");
  }
  function viewWhen() {
    return question("4 of 4", "When could you escape?", "When", WHENS,
      function (o) { S.when = o.id; S.shown = []; S.head = "Cool. We made a plan."; S.alt = false; S.adjust = null; S.cal = false; choosePlan(); go("making"); },
      "back", "crew", "mf-picks-short");
  }

  // a beat of "doing the awkward part", so the plan feels made for her
  function viewMaking() {
    var lines = ["Picking a place…", "Finding people…", "Doing the awkward part…"];
    var box = h("div", { class: "mf-making", role: "status" });
    var view = h("div", { class: "view mf-view mf-making-view" }, [
      h("h1", { class: "sr", "data-focus": true, text: "Making a plan" }),
      box
    ]);
    function done() { if (S.step === "making") go("plan"); }
    if (reduced()) {
      box.appendChild(h("p", { class: "mf-making-line", text: lines[2] }));
      setTimeout(done, 700);
    } else {
      lines.forEach(function (t, i) {
        setTimeout(function () {
          if (S.step !== "making") return;
          var p = h("p", { class: "mf-making-line", text: t });
          box.appendChild(p);
          if (i > 0) box.children[i - 1].classList.add("old");
        }, i * 650);
      });
      setTimeout(done, 2250);
    }
    return view;
  }

  /* ---------- the ticket ---------- */

  function ticket(p, stamp) {
    var n = CREW_N[p.crew];
    return h("article", { class: "mf-ticket" + (stamp ? " has-stamp" : ""), "aria-label": "Plan: " + dayLabel(p) + ", " + p.time + ", " + p.title }, [
      h("div", { class: "mf-t-top" }, [
        h("p", { class: "mf-t-admit", text: "ADMIT YOU" }),
        h("p", { class: "mf-t-day", text: dayLabel(p) }),
        h("p", { class: "mf-t-time", text: p.time })
      ]),
      h("div", { class: "mf-t-perf", "aria-hidden": "true" }),
      h("div", { class: "mf-t-body" }, [
        h("h2", { class: "mf-t-title", text: p.title }),
        h("p", { class: "mf-t-place", text: p.place }),
        h("ul", { class: "mf-t-facts" }, [
          h("li", { text: n + " moms" }),
          h("li", { text: p.kids ? "Kids welcome" : "No kids" }),
          h("li", { text: "Your neighborhood" })
        ]),
        h("p", { class: "mf-t-note", text: "“" + p.note + "”" })
      ]),
      h("div", { class: "mf-t-stub", "aria-hidden": "true" }, [h("span", { class: "mf-bars" })]),
      h("span", { class: "mf-demo-stamp", text: "Demo plan" }),
      stamp ? h("span", { class: "mf-in-stamp", "aria-hidden": "true", text: "You’re in" }) : null
    ]);
  }

  function viewPlan() {
    var p = S.cur;
    var adj = h("div", { class: "mf-adjust" });
    function drawAdjust() {
      clear(adj);
      if (!S.alt) return;
      if (!S.adjust) {
        adj.appendChild(h("p", { class: "mf-adj-lead", text: "Or change one thing:" }));
        adj.appendChild(h("div", { class: "mf-chips" }, [["kind", "different hang"], ["crew", "different crew"], ["when", "different day"]].map(function (c) {
          return h("button", { class: "mf-chip", type: "button", onclick: function () { S.adjust = c[0]; drawAdjust(); } }, [c[1]]);
        })));
        return;
      }
      var lists = { kind: KINDS, crew: CREWS, when: WHENS }, labels = { kind: "Kind of hang", crew: "Group size", when: "When" };
      adj.appendChild(h("p", { class: "mf-adj-lead", text: labels[S.adjust] + ":" }));
      adj.appendChild(h("div", { class: "mf-chips" }, lists[S.adjust].map(function (o) {
        return h("button", { class: "mf-chip", type: "button", onclick: function () {
          S[S.adjust] = o.id; S.adjust = null; S.head = "Okay. How about this?"; choosePlan(); go("plan");
        } }, [o.label]);
      })));
    }
    var view = h("div", { class: "view mf-view mf-plan" }, [
      h("h1", { class: "mf-q", "data-focus": true, text: S.head }),
      ticket(p),
      h("p", { class: "mf-lines" }, ["We picked the place.", h("br"), "We found the people.", h("br"), "All you have to do is show up."]),
      h("div", { class: "actions" }, [
        h("button", { class: "btn", type: "button", onclick: function () { go("in"); } }, ["I’M IN"]),
        h("button", { class: "btn btn-ghost", type: "button", onclick: function () { S.alt = true; S.adjust = null; S.head = "Fair. Let’s try another."; choosePlan(); go("plan"); } }, ["NOT MY VIBE"])
      ]),
      adj,
      h("p", { class: "mf-fine", text: "Demo plan. Fictional people, place and time: nobody has signed up and nothing is reserved." }),
      h("div", { class: "back-row" }, [back("change my answers", "kind")])
    ]);
    drawAdjust();
    return view;
  }

  function viewIn() {
    var p = S.cur;
    var calBtn = h("button", { class: "btn btn-ghost mf-cal-btn", type: "button", "aria-pressed": "false", onclick: function () {
      S.cal = !S.cal;
      calBtn.setAttribute("aria-pressed", S.cal ? "true" : "false");
      calBtn.textContent = S.cal ? "ADDED. (NOT REALLY.)" : "PRETEND-ADD TO CALENDAR";
    } }, [S.cal ? "ADDED. (NOT REALLY.)" : "PRETEND-ADD TO CALENDAR"]);
    return h("div", { class: "view mf-view mf-in" }, [
      h("h1", { class: "mf-hero", "data-focus": true }, ["Well, look at you.", h("br"), "You have plans."]),
      ticket(p, true),
      h("p", { class: "mf-lines mf-nots" }, ["No scheduling spreadsheet.", h("br"), "No 47-message group chat.", h("br"), "No “we should totally do this sometime.”"]),
      h("section", { class: "mf-demo", "aria-label": "Demo previews" }, [
        h("p", { class: "mf-demo-tag", text: "Demo only · nothing is created or sent" }),
        h("div", { class: "mf-cal" }, [
          h("span", { class: "mf-cal-day", text: dayLabel(p).replace("NEXT ", "") .slice(0, 3) }),
          h("span", { class: "mf-cal-main" }, [
            h("strong", { text: p.title }),
            h("span", { text: p.time + " · " + p.place })
          ])
        ]),
        h("p", { class: "mf-bubble", text: "“" + dayLabel(p).toLowerCase() + ", " + p.time.toLowerCase() + ". " + p.title.toLowerCase() + ". you in? — club mft”" }),
        calBtn
      ]),
      h("div", { class: "end-links" }, [homeLink()]),
      api.pile("end")
    ]);
  }

  /* ---------- public ---------- */

  window.MomFriends = {
    reset: reset,
    render: function (a) { api = a; h = a.h; if (!S) reset(); draw(); }
  };
  reset();
})();
