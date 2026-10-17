/* Sample content for Experiment 01. All mocked, all local.
   Shape: ACTIVITIES[needId][timeId] = [ {title, detail}, {title, detail} ]  */

window.NEEDS = [
  { id: "head",   label: "get out of my head",    color: "var(--lilac)",    ic: "var(--midnight)", tx: "var(--midnight)", shape: "learn" },
  { id: "body",   label: "move my body",          color: "var(--red)",      ic: "var(--sand)",     tx: "var(--sand)",     shape: "move" },
  { id: "feel",   label: "feel something",        color: "var(--petal)",    ic: "var(--red)",      tx: "var(--midnight)", shape: "feel" },
  { id: "fun",    label: "have some fucking fun", color: "var(--sunshine)", ic: "var(--midnight)", tx: "var(--midnight)", shape: "play" },
  { id: "people", label: "talk to another adult", color: "var(--lipstick)", ic: "var(--midnight)", tx: "var(--midnight)", shape: "together" },
  { id: "learn",  label: "learn something",       color: "var(--midnight)", ic: "var(--sunshine)", tx: "var(--sand)",     shape: "bulb" }
];

window.TIMES = [
  { id: "2",    num: "2",  unit: "MIN",  label: "2 MIN" },
  { id: "5",    num: "5",  unit: "MIN",  label: "5 MIN" },
  { id: "15",   num: "15", unit: "MIN",  label: "15 MIN" },
  { id: "long", num: "∞",  unit: "I ACTUALLY HAVE TIME", label: "I ACTUALLY HAVE TIME" }
];

window.FEELINGS = [
  { id: "more",    emoji: "😍", label: "more of this",
    reply: "Noted. Glad that one landed." },
  { id: "needed",  emoji: "😌", label: "needed that",
    reply: "Good. You get to have that." },
  { id: "nah",     emoji: "😐", label: "not for me",
    reply: "Totally fair. Not everything is. Next time we'll try a different flavor." },
  { id: "toomuch", emoji: "😵‍💫", label: "too much right now",
    reply: "Okay. Nothing was owed here. Put it down, drink some water, or don't." },
  { id: "thoughts", emoji: "💭", label: "I have thoughts",
    reply: "We'd love to hear them. (In this prototype they go nowhere. Say it anyway.)" }
];

window.ACTIVITIES = {
  head: {
    "2": [
      { title: "Put your phone face-down and look at something that isn't a screen.",
        detail: "A window, a wall, the dog. Two minutes of looking at nothing in particular. Nothing is required of you." },
      { title: "Exhale like you're fogging a mirror. Three times.",
        detail: "Slow, dramatic, a little ridiculous. Your shoulders will figure out the rest." }
    ],
    "5": [
      { title: "Write down every single thing in your head. Then ignore the list.",
        detail: "Messy is fine. Spelling is optional. You're emptying the bag, not organizing the closet." },
      { title: "Go stand outside with nothing in your hands.",
        detail: "No phone, no coffee, no laundry basket. Five minutes of weather." }
    ],
    "15": [
      { title: "Lie on the floor. The floor, not the couch.",
        detail: "Knees up, eyes closed, or staring at the ceiling. Fifteen minutes of being a person-shaped puddle." },
      { title: "Walk around the block with no podcast and no destination.",
        detail: "Turn whichever way you feel like turning. Nobody is timing this." }
    ],
    "long": [
      { title: "Go somewhere you can't be found.",
        detail: "The car in the driveway counts. So does the bathroom with the fan on. Take the long version and don't explain yourself." },
      { title: "Do one slow, boring thing with your hands.",
        detail: "Water a plant. Wash one pan like it's a ritual. Let your brain wander off while your hands stay busy." }
    ]
  },
  body: {
    "2": [
      { title: "Roll your shoulders back ten times, then shake out your hands like they're wet.",
        detail: "Big dramatic arm circles encouraged. Make a noise if you need to." },
      { title: "Do the stretch your body has been begging for all day.",
        detail: "You know the one. Neck, hips, whatever is screaming. Hold it until it lets go." }
    ],
    "5": [
      { title: "Stretch on the floor like a cat that pays rent.",
        detail: "Slow, unbothered, a lot of yawning. Five minutes. The floor is yours." },
      { title: "March in place like a 1980s power walker.",
        detail: "Swing your arms. Add a headband in your mind. Stop when you feel like a person again." }
    ],
    "15": [
      { title: "Walk fast like you have somewhere to be. You don't.",
        detail: "Good shoes optional. Pace is yours. Turn around whenever." },
      { title: "Follow a workout video. Leave whenever.",
        detail: "Leaving at minute 9 is allowed. Leaving at minute 2 is allowed. The video will survive." }
    ],
    "long": [
      { title: "Go for a real walk. Long, aimless, snack-adjacent.",
        detail: "Bring a snack. Skip the step count. Look at other people's gardens." },
      { title: "Move however feels good for as long as it does. Then stop.",
        detail: "Stretch, dance, swim, lie in a sunbeam and flex. Your body will tell you when." }
    ]
  },
  feel: {
    "2": [
      { title: "Name the feeling you're having right now. Any word. “Meh” counts.",
        detail: "No fixing. No solving. Just say it out loud to the room." },
      { title: "Put a hand on your chest and say “yeah, this is a lot.”",
        detail: "Not a pep talk. Just agreement." }
    ],
    "5": [
      { title: "Put on the song that makes you cry in the car. Let it.",
        detail: "Volume up. Door closed. Nobody needs your face to be fine right now." },
      { title: "Find an old photo of yourself from before kids. Say hi.",
        detail: "She's still in there. She'd probably like to know you're doing okay." }
    ],
    "15": [
      { title: "Write a letter to yourself at 22. Don't send it. Don't even keep it.",
        detail: "Tell her what you wish she knew. Or what you're glad she didn't." },
      { title: "Watch the one scene from the movie that always gets you.",
        detail: "Just that scene. Not the whole movie. Cry if it's there." }
    ],
    "long": [
      { title: "Have a good cry or a good laugh. Whichever one is waiting.",
        detail: "Put on the sad movie, the funny movie, or the one you've seen forty times. Tissues nearby. Snacks nearby." },
      { title: "Sit with a hot drink and ask yourself one question: what do I miss?",
        detail: "Answer honestly. Don't solve it. Don't tell anyone unless you want to." }
    ]
  },
  fun: {
    "2": [
      { title: "Do your best villain laugh. Out loud. Twice.",
        detail: "Throw your head back. Mwahaha. The house has heard worse." },
      { title: "Text your friend the most unhinged emoji combo you can think of.",
        detail: "No context. No explanation. Watch what happens." }
    ],
    "5": [
      { title: "Put on the song you played approximately 700 times when you were 22.",
        detail: "Kitchen dance floor. Five minutes. Nobody needs anything from you." },
      { title: "Lip sync the whole chorus in the bathroom mirror.",
        detail: "Hairbrush microphone. Full commitment. Take a bow at the end." }
    ],
    "15": [
      { title: "Build your dream pizza order. Then decide if you're actually ordering it.",
        detail: "Toppings no one else would approve of. This is a safe space for pineapple and worse." },
      { title: "Make a playlist called “Songs I Am Not Embarrassed By Anymore.”",
        detail: "Include at least one that would have gotten you roasted in 2009." }
    ],
    "long": [
      { title: "Plan a ridiculous night out you will probably not take.",
        detail: "Outfit, venue, the exact snack order. Commit to the details. Taking it is optional." },
      { title: "Pick up something you used to love and do it badly.",
        detail: "Paint, skate, karaoke, a terrible craft. Quality is not on the menu." }
    ]
  },
  people: {
    "2": [
      { title: "Send a voice memo to a friend that says nothing important.",
        detail: "“Thinking of you, saw a dog in a sweater.” That's the whole assignment." },
      { title: "Text someone: “tell me one thing that made you laugh this week.”",
        detail: "Then put your phone down. Replies can find you later." }
    ],
    "5": [
      { title: "Call someone and say, “I have five minutes and zero news. You?”",
        detail: "Short calls count. Ending a call at five minutes is not rude, it's efficient." },
      { title: "Reply to the group chat you've been avoiding.",
        detail: "One emoji counts. A thumbs-up counts. You don't owe anyone a catch-up essay." }
    ],
    "15": [
      { title: "Call the friend who knew you before. Let it ramble.",
        detail: "No agenda. If it turns into a story about someone's cousin, even better." },
      { title: "Walk and talk: phone a friend and go around the block.",
        detail: "Two things at once, which for once is a good use of that skill." }
    ],
    "long": [
      { title: "Invite someone over without cleaning first.",
        detail: "Messy house. Takeout. Lowest bar possible. Say “come as you are” and mean it." },
      { title: "Have the long, tangent-heavy call you keep putting off.",
        detail: "Get comfortable. Snacks nearby. Wander wherever the conversation wants to go." }
    ]
  },
  learn: {
    "2": [
      { title: "Learn one weird fact about an animal. Tell someone who didn't ask.",
        detail: "Octopuses have three hearts. You're welcome. Go tell somebody." },
      { title: "Look up where one word you say all the time actually comes from.",
        detail: "Two minutes, one tiny mystery solved." }
    ],
    "5": [
      { title: "Read one random Wikipedia page. Stop whenever.",
        detail: "Hit “random article” and see where you land. No quiz afterward." },
      { title: "Watch a 5-minute video about something you know nothing about.",
        detail: "Lock-making, volcanoes, the history of the fork. Pick whichever makes you curious." }
    ],
    "15": [
      { title: "Take a beginner lesson in something that has nothing to do with kids.",
        detail: "A chord, a knitting stitch, a phrase in Portuguese. Fifteen minutes, zero expectations." },
      { title: "Listen to a podcast episode on something you're curious about, not something you should know.",
        detail: "Weird is good. Useful is not required." }
    ],
    "long": [
      { title: "Start the book you bought for yourself. Read until it stops being fun.",
        detail: "Stopping when it stops being fun is the whole rule." },
      { title: "Fall down a rabbit hole. Pick a topic and follow it wherever it goes.",
        detail: "No syllabus. No quiz. If you end up on a page about medieval bread, that's a win." }
    ]
  }
};

/* Vibe readouts (written, currently not shown on the result screen): playful, affectionate, never diagnostic. One line per need is
   picked at random, then a short tag for the time she has is added. */
window.VIBES = {
  head: [
    "Needs to get the fuck out of her head.",
    "Has fourteen tabs open in there. Needs a window.",
    "Is a little loud up there. Needs some quiet."
  ],
  body: [
    "Needs to move before she turns into furniture.",
    "Is wearing her stress as a posture.",
    "Has a body that's been waiting very patiently."
  ],
  feel: [
    "Wants to feel something besides tired.",
    "Is full of feelings and needs somewhere to put them.",
    "Is ready to feel it, whatever it is."
  ],
  fun: [
    "Is overdue for some fucking fun.",
    "Is feeling a little feral. In a good way.",
    "Wants to be unreasonable for a while."
  ],
  people: [
    "Needs a grown-up who doesn't need a snack.",
    "Wants words with someone who finishes sentences.",
    "Is craving a person who just gets it."
  ],
  learn: [
    "Wants to know something that isn't about naps.",
    "Is curious again. Quietly alarming.",
    "Has a brain that wants a snack of its own."
  ]
};
window.VIBE_TAILS = {
  "2": "Two minutes. Easy.",
  "5": "Five minutes, tops.",
  "15": "A solid fifteen.",
  "long": "And, shockingly, time."
};
