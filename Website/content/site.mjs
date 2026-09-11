/**
 * Every word of marketing copy on this site, in one place.
 *
 * Kept out of the templates so the writing can be read, argued with and
 * corrected without going through markup, and so a claim can be checked
 * against the product by looking at one file. The build's validator reads
 * this too: it refuses to produce a site containing a claim on its banned
 * list, or a term from the engineering side of the project.
 *
 * Everything here has to be true of the current build. Where the product
 * cannot yet do something, the copy says what it can do instead.
 */

export const hero = {
  eyebrow: 'Onceaway for Mac · Preview',
  headline: 'Make repeated work go away.',
  standfirst:
    'Onceaway quietly notices the work you repeat on your Mac, helps you see which of it is actually worth reducing, and can help you do something about it — when you ask.',
  primary: { label: 'See how Onceaway works', href: '#how-it-works' },
  secondary: { label: 'Read the Help guide', href: 'help' },
  note: 'Onceaway is an early Mac build, currently with invited testers.',
}

/**
 * The words attached to the animated tour in the hero.
 *
 * The alt text describes what the recording shows rather than what the
 * product promises. Someone who cannot see it should come away knowing which
 * screens exist, not be sold to a second time.
 */
export const heroLoopCopy = {
  frames: [
    { file: '1-home.webp' },
    { file: '2-patterns.webp' },
    { file: '3-opportunity.webp' },
    { file: '4-insights.webp' },
  ],
  alt: 'Onceaway moving through four of its screens: Home, where a noticed repeat waits for a yes or no; Patterns, the list of everything noticed so far; a single opportunity opened, showing its stages from noticed through to reduction; and Insights, where the counts are charted over time.',
  // Named for what it stops. The app has a Pause button of its own, visible
  // in the first screen, and that one stops observation — a control sitting
  // on top of the picture must not be mistakable for it. "Recording" is out
  // for the same reason: the strip below the hero promises there is none.
  pause: 'Pause animation',
  play: 'Play animation',
}

/**
 * The differentiation block, and the strongest argument on the site: the
 * problem is not building automation, it is knowing what to build.
 */
export const lateStart = {
  eyebrow: 'The problem',
  heading: 'Automation usually starts too late.',
  standfirst:
    'Most automation software begins at the moment you already know the workflow you want to automate. Getting to that moment is the hard part.',
  chain: [
    { step: 'First', text: 'you have to notice the repetition yourself.' },
    { step: 'Then', text: 'decide it happens often enough to be worth changing.' },
    { step: 'Then', text: 'be able to describe what you actually do, step by step.' },
    { step: 'Then', text: 'work out which tool could do it.' },
    { step: 'Then', text: 'build the thing, and keep it working.' },
  ],
  turn: 'Onceaway starts one step earlier. It notices the repetition first.',
  pullQuote: 'The hardest part of automation is knowing what should disappear.',
  pullQuoteAnswer: 'Onceaway starts there.',
}

/**
 * How it works, in plain verbs. Deliberately not a named, numbered funnel:
 * the product's own vocabulary for these stages is still settling, and a
 * marketing page that fixed it early would be one more version to reconcile.
 */
export const howItWorks = {
  eyebrow: 'How it works',
  heading: 'Five plain steps, and you are in every one of them.',
  steps: [
    {
      title: 'Onceaway notices',
      text: 'It watches privacy-safe activity on your Mac: which applications you move between, coarse file events in the folders it watches, and — only for browsers you switch on — the website host of the tab in front of you.',
    },
    {
      title: 'You confirm',
      text: 'It shows you the shape of what it thinks it saw and asks one question: was that really the same piece of work? Nothing moves forward until you answer.',
    },
    {
      title: 'Onceaway weighs it up',
      text: 'Doing something twice is not a reason to change how you work. Onceaway separates “this happened again” from “this might be worth reducing”, and shows you why.',
    },
    {
      title: 'You decide',
      text: 'You say whether you would like help reducing it. Anything you would rather leave alone is left alone.',
    },
    {
      title: 'Onceaway helps',
      text: 'For the one kind of task it currently supports, it can carry out a single, bounded action — after you have seen exactly what will happen and approved it.',
    },
  ],
}

export const patterns = {
  eyebrow: 'Patterns',
  heading: 'It notices repeated structure, then asks whether it understood.',
  body: [
    'A Pattern is a sequence Onceaway has seen more than once: the same applications, the same kind of file event, the same website host, in the same order.',
    'It does not assume it has understood you. Every Pattern comes with a plain question — was this really the same thing? — and three honest answers: yes, no, or not sure. Your answer is the one that counts.',
  ],
  points: [
    'Detection is local and deterministic. No model decides whether something repeated.',
    'A Pattern you reject stops being offered.',
    'You can give it your own words for what the work actually was.',
  ],
}

export const opportunities = {
  eyebrow: 'Opportunities',
  heading: 'Repeating something is not the same as it being worth changing.',
  body: [
    'Once you have confirmed a Pattern, Onceaway looks at how much evidence there really is: how often it happened, across how many days, in how many separate stretches of work, and how much of it was real file or browser activity rather than flicking between windows.',
    'That produces a coarse, transparent read — low signal, promising, or a strong opportunity — with the reasons shown. There is no score behind it and no forecast in front of it.',
  ],
  points: [
    'No invented time-saved figures, because nothing here could honestly measure them.',
    'You choose whether you want help reducing it, and “no” is a normal answer.',
  ],
}

export const insights = {
  eyebrow: 'Insights',
  heading: 'History is what happened. Insights is what Onceaway learned.',
  body: [
    'Insights shows how your repeated work is changing: how many patterns were noticed, how many you confirmed, how many became opportunities, and how many you asked for help with.',
    'It groups repeated work by the kind of thing it involved — websites, files, or moving between applications — and shows recurrence over time.',
  ],
  points: [
    'No productivity score. No focus score. No hours-saved number.',
    'Every figure is a count of something that actually happened.',
  ],
}

export const recommendations = {
  eyebrow: 'Recommendations',
  heading: 'It is allowed to say there is not enough evidence yet.',
  body: [
    'When you ask, Onceaway can suggest ways to reduce a repeated task. It aims for a small number of strong ideas rather than a list, prefers the simplest and most reversible first, and states what each one assumes rather than pretending to know.',
    'If the evidence does not support a suggestion, it says so, and may ask one question that would change the answer. That restraint is deliberate: filler advice about work you know better than any software is worse than nothing.',
  ],
  points: [
    'At most three approaches, and often fewer.',
    'At most one question, and only when it would actually change the suggestion.',
    'Nothing is described as certain to work.',
  ],
}

export const assist = {
  eyebrow: 'Assist',
  heading: 'Onceaway asks before it acts.',
  principle:
    'No observed event, AI answer or recommendation can directly cause an action.',
  body: [
    'Assist is the part of Onceaway that can do something rather than suggest something, and it is deliberately the most constrained part of the product.',
    'You choose the file. You choose where it goes. You see exactly what will happen, written out. You approve it. Only then does anything run, and it runs once.',
  ],
  limitation: {
    heading: 'What Assist can do today',
    text: 'One thing: moving a single file you have chosen, to a place you have chosen, after you have approved the exact move. Broader help is the direction of the product, not a description of it.',
  },
}

export const privacy = {
  eyebrow: 'Privacy',
  heading: 'Privacy before observation.',
  principle:
    'Privacy decides whether observation may happen. Observation never decides privacy for itself.',
  standfirst:
    'That sounds like a slogan; it is actually the order the code runs in. Protection is checked first, and when it applies, the detail is never collected — not collected and then filtered.',
  cards: [
    {
      title: 'Password managers are always protected',
      text: 'Credential apps are treated as private whenever they are in front, and that cannot be switched off. Nothing in Onceaway records what you type, in any application.',
    },
    {
      title: 'It records the kind of thing, not the thing',
      text: 'That a PDF was created in Downloads — not which PDF. That a website was open — not the page, the address or a word of its contents.',
    },
    {
      title: 'Your history stays on your Mac',
      text: 'What Onceaway noticed lives in a file on your Mac. There is no account, nothing to sign in to, and your history is never uploaded.',
    },
    {
      title: 'AI is off until you turn it on',
      text: 'Two things can leave your Mac, and only when you ask: an AI suggestion, which needs an API key you add yourself, and feedback you choose to send.',
    },
  ],
}

export const observes = {
  eyebrow: 'What it sees',
  heading: 'A short list, and a shorter one.',
  notices: {
    title: 'What Onceaway notices',
    items: [
      'The applications you move between, and when.',
      'Coarse file events in the folders it watches — Downloads and Desktop unless you change them: that a file of some type was created, renamed or moved, and roughly where.',
      'The website host of the active tab — only for browsers you switch on, and only the host, never the address.',
    ],
  },
  never: {
    title: 'What it never does',
    items: [
      'No screen recording, and no screenshots.',
      'No keystrokes, and no clipboard.',
      'No page contents, and no web addresses.',
      'No filenames and no file paths.',
      'No microphone, and no camera.',
    ],
  },
}

export const notSurveillance = {
  eyebrow: 'What this is not',
  heading: 'Onceaway is not employee surveillance.',
  body: [
    'There is no productivity score. No focus score. No time-wasted metric. No ranking, no league table, and nothing that reports on anyone to anyone.',
    'It is a single-person tool that runs on your own Mac and answers to you.',
    'Buying licences for a team would change who pays and nothing else. What Onceaway noticed stays on the Mac that noticed it, and none of it reaches whoever bought the licence. There is no manager view, and nothing for one to show.',
  ],
  line: 'The goal is to reduce repeated work, not to judge your workday.',
}

export const ai = {
  eyebrow: 'AI',
  heading: 'Useful without AI. Better with it, when you choose.',
  body: [
    'Finding repetition does not involve a model at all: it is ordinary, local, deterministic comparison, and it works with AI switched off entirely.',
    'If you add your own API key, AI can put a name to what a pattern probably was, and suggest ways to reduce it. You choose the provider. You see what is sent before it is sent.',
  ],
  points: [
    'Onceaway works with no AI configured, and most of it always will.',
    'AI is asked a question only when you press something.',
    'AI can never trigger Assist. It suggests; you decide.',
  ],
}

export const useCases = {
  eyebrow: 'Examples',
  heading: 'The kind of work that quietly repeats.',
  standfirst:
    'These are examples of the sort of thing Onceaway is built to notice — not a list of workflows it can already carry out for you.',
  items: [
    { title: 'Saving and filing downloads', text: 'Download, find it in Downloads, move it somewhere sensible. Again.' },
    { title: 'Repeated report exports', text: 'The same export from the same tool, on roughly the same day each week.' },
    { title: 'Moving information between apps', text: 'Reading something in one place and re-entering it in another.' },
    { title: 'Repeated dashboard checks', text: 'Going back to the same page through the day to see whether anything changed.' },
    { title: 'Client and project setup', text: 'The same records, folders and invitations created in several places for every new job.' },
    { title: 'Repeated research', text: 'The same handful of sources consulted, and the findings written up somewhere else.' },
  ],
}

export const audience = {
  eyebrow: 'Who it is for',
  heading: 'People whose day is made of small repeated things.',
  standfirst:
    'If your work moves between applications, files, browsers and admin more than it stays in one place, Onceaway has something to look at.',
  examples: [
    'Agency owners',
    'Consultants',
    'Accountants and bookkeepers',
    'Recruiters',
    'Marketers',
    'Professional services',
    'Small business owners',
  ],
}

export const macNative = {
  eyebrow: 'Built for Mac',
  heading: 'A Mac app, not a browser tab with a wrapper around it.',
  items: [
    { title: 'A quiet menu-bar companion', text: 'A small ring near the clock tells you whether Onceaway is observing. Solid while it is, dashed while it is not.' },
    { title: 'Light and Dark Mode', text: 'It follows your Mac. Both are designed, not one and a filter.' },
    { title: 'Keys in the Keychain', text: 'If you add an AI key, it goes into the macOS Keychain — never a file, never a preference, never a log.' },
    { title: 'Your data, in a file, on your Mac', text: 'One local database in your own Application Support folder. Delete the folder and it is gone.' },
  ],
}

export const preview = {
  eyebrow: 'Preview',
  heading: 'Onceaway is an early build, and says so.',
  body: [
    'It is being tested on real Macs doing real work. Some parts are deliberately limited, some will change, and the feedback coming back is shaping what gets built next.',
    'Access is currently limited to invited testers, so there is nothing to download here yet.',
  ],
  state: {
    platform: 'Mac',
    label: 'Preview access is currently limited.',
    detail:
      'When Onceaway is ready for a wider release, this is where it will be. Until then you can put your name on the waiting list.',
    // The button only appears when config.preview.invitationURL is set. It
    // says waiting list rather than anything about access, because that is
    // what joining it gets you: a message when there is something to say.
    action: 'Join the waiting list',
  },

  /**
   * The waiting-list form.
   *
   * The note under the field is not a disclaimer, it is the point. This site
   * spends a page explaining that Onceaway sends nothing anywhere, and then
   * asks for an email address; not saying plainly where that address goes
   * would undo more than the form is worth. The validator will not render the
   * field without it.
   */
  signup: {
    legend: 'Join the Onceaway waiting list',
    placeholder: 'you@example.com',
    action: 'Join the waiting list',
    note: 'We use your address to tell you about Onceaway, and nothing else. It is held by Loops, our email provider, and you can leave the list at any time.',
    success: 'You are on the list. We will be in touch when there is something worth telling you.',
    failure: 'That did not go through. Try again, or email us from the Help site.',
  },
  help: {
    heading: 'Onceaway Help',
    text: 'The full guide: what it observes, what it never records, how AI fits in, and how Assist asks before it acts.',
    label: 'Open Onceaway Help',
  },
}

export const footer = {
  tagline: 'Make repeated work go away.',
  note: 'Onceaway is in Preview. Everything on this page describes the current build.',
}

/**
 * Works offline.
 *
 * The careful bit is the claim itself: the core of Onceaway runs without a
 * connection, which is not the same as never needing one. Saying the second
 * would be quicker and would not be true.
 */
export const offline = {
  eyebrow: 'Offline',
  heading: 'Works locally, even offline.',
  body: [
    'Noticing repeated work happens on your Mac. Onceaway does not need an internet connection to see that something recurred, or to keep building the history of what it noticed — that is ordinary local comparison, not a question sent to a server.',
    'A connection is needed only when you use something that requires one: asking for an AI suggestion, sending feedback, or opening the Help guide.',
  ],
  strip: [
    'Core observation works offline',
    'History stays on your Mac',
    'Internet only for the features that need it',
  ],
  line: 'Not “never needs the internet” — that would not be true. Its core observation works without one.',
}

/**
 * The five-second version, directly under the hero.
 *
 * Every line here is stated properly further down the page. Nothing appears
 * in this strip that is not made good somewhere else: a scannable claim is
 * still a claim.
 */
export const trustStrip = {
  label: 'What Onceaway does not do',
  items: [
    'No screen recording',
    'No keystroke capture',
    'No microphone',
    'No camera',
    'Activity stays on your Mac',
  ],
}

/**
 * What Send Feedback sends.
 *
 * This is the one routine thing that leaves the Mac, so it is written out in
 * full rather than summarised. If the list ever grows, this is the file that
 * has to change first.
 */
export const feedback = {
  eyebrow: 'Feedback',
  heading: 'The one thing that leaves your Mac, written out in full.',
  standfirst:
    'Send Feedback goes straight to us. So that a report can be made sense of, a short list of diagnostics travels with the message.',
  sends: {
    title: 'What goes with your message',
    items: [
      'Which version of Onceaway you are running.',
      'Which screen you were on.',
      'Whether observation was on or off.',
      'Your macOS version and Mac architecture.',
      'A screenshot — only if you attach one yourself.',
    ],
  },
  withheld: {
    title: 'What is never attached',
    items: [
      'What Onceaway noticed.',
      'Your files, or anything about them.',
      'Your browsing.',
      'Your API key, and anything AI was asked or answered.',
    ],
  },
  line: 'Onceaway never takes a screenshot on its own. The only screenshot it can send is one you chose.',
}

/**
 * The question a cautious business owner actually asks, answered with
 * architecture rather than reassurance.
 */
export const breach = {
  eyebrow: 'The hard question',
  heading: 'What if Onceaway gets hacked?',
  body: [
    'It is a fair question to ask of anything you let near your work, and the honest answer is about what there would be to take.',
    'Onceaway does not run a central database of everyone’s computer activity. What it noticed on your Mac is in a file on your Mac. If the service that receives feedback were compromised, your record of how you work would not be sitting in it, because it was never sent there.',
    'What could be exposed is what you deliberately sent: the words of any feedback, the diagnostics above, and any screenshot you attached. That is worth knowing before you attach one.',
  ],
  line: 'Local because of how it is built, not because of a setting you have to find.',
}

/** The questions people ask before installing. Longer answers on the Privacy page. */
export const faq = {
  eyebrow: 'Before you install',
  heading: 'The questions people actually ask.',
  items: [
    {
      question: 'Does Onceaway record my screen?',
      answer:
        'No. No screen recording and no automatic screenshots. The only screenshot it can send is one you attach to feedback yourself.',
    },
    {
      question: 'Does it record what I type?',
      answer: 'No. Nothing in Onceaway records keystrokes, in any application.',
    },
    {
      question: 'Can it see passwords or banking details?',
      answer:
        'No. Credential apps are always treated as private. In a browser it may see that a site was open and, if you switched that browser on, its host — never the address, the page, or anything on it.',
    },
    {
      question: 'Is my activity uploaded?',
      answer:
        'No. What Onceaway noticed stays in a file on your Mac. There is no account and nothing to sign in to.',
    },
    {
      question: 'Does it use my camera or microphone?',
      answer: 'No. Onceaway uses neither.',
    },
    {
      question: 'Can Onceaway do something without asking me?',
      answer:
        'No. No observation, AI answer or suggestion can cause an action on its own. You see the exact action written out, and you approve it.',
    },
    {
      question: 'What happens when I send feedback?',
      answer:
        'Your message goes to us with a short list of diagnostics, and a screenshot only if you attach one. What Onceaway noticed, your files and your browsing are not attached.',
    },
    {
      question: 'Does it need an internet connection?',
      answer:
        'Not to do its main job. Noticing repeated work and keeping your history happen on your Mac. A connection is needed only for an AI suggestion, sending feedback, or opening Help.',
    },
    {
      question: 'Can I buy Onceaway for my team?',
      answer:
        'There is nothing to buy yet. When there is, a team licence would make billing simpler and nothing else — it would not let you watch anyone. Each install observes on that person’s own Mac and answers to them. There is no manager dashboard, and no way for one person to see another’s activity.',
    },
    {
      question: 'Can I delete what Onceaway has stored?',
      answer:
        'Yes. It is one local database in your Application Support folder. Delete the folder and it is gone.',
    },
  ],
  more: 'Longer answers to all of these, and a few more',
}

/**
 * The Privacy and Security page: the same answers at length, for the person
 * who wants them before they will install anything.
 */
export const privacyPage = {
  eyebrow: 'Privacy and Security',
  headline: 'What Onceaway sees, and what it does not.',
  standfirst:
    'Your Mac may hold banking information, customer details, business records and a good deal that is nobody else’s business. Onceaway was designed around that rather than apologising for it afterwards.',
  note: 'This is the plain-English version rather than the legal one. It is here so you can decide before you install anything.',
  sections: [
    {
      id: 'observes',
      question: 'What does Onceaway actually observe?',
      body: [
        'The shape of your work rather than its content: which applications you move between and when, coarse file events in the folders it watches, and — only for browsers you switch on — the host of the site in the active tab.',
        'A coarse file event means that a file of some type was created, renamed or moved, and roughly where. Not which file, and not what was in it.',
        'From that it looks for sequences that occur more than once. It does not need to know what was inside any of those applications to see the same shape recurring.',
      ],
    },
    {
      id: 'typing',
      question: 'Does Onceaway see what I type?',
      answer: 'No',
      body: [
        'Nothing in Onceaway records keystrokes, in any application. Not the words, not the field they went into, not passwords, and not what you paste.',
      ],
    },
    {
      id: 'banking',
      question: 'Can Onceaway see my banking information?',
      answer: 'No',
      body: [
        'Password managers and credential apps are treated as private whenever they are in front, and that cannot be switched off.',
        'If you bank in a browser, Onceaway may record that the browser was the application in front of you and — only if you switched that browser on — the host of the site. Not the address, not the page, not a balance, not a login, and nothing displayed on screen.',
        'That you spent twenty minutes in a browser is the kind of thing it notices. What you did in there is not.',
      ],
    },
    {
      id: 'screen',
      question: 'Does Onceaway record my screen?',
      answer: 'No',
      body: [
        'There is no screen recording, and Onceaway never takes a screenshot on its own.',
        'A screenshot can only reach us if you attach one yourself when sending feedback.',
      ],
    },
    {
      id: 'camera',
      question: 'Does it use my microphone or camera?',
      answer: 'No',
      body: ['Onceaway uses neither. There is no audio or video capture of any kind.'],
    },
    {
      id: 'stored',
      question: 'Where is what it noticed stored?',
      body: [
        'In one local database in your own Application Support folder, on the Mac that produced it. There is no account and nothing to sign in to.',
        'If you add an AI key it goes into the macOS Keychain — never a file, never a preference, never a log.',
      ],
    },
    {
      id: 'uploaded',
      question: 'Is my activity uploaded to Onceaway?',
      answer: 'No',
      body: [
        'What Onceaway noticed is not uploaded, and there is no central database of it to upload into.',
        'To be precise rather than absolute: two things can leave your Mac, and both because you asked. An AI suggestion, if you have added your own API key and pressed something. And feedback, if you send it. Neither happens in the background.',
      ],
    },
    {
      id: 'offline',
      question: 'Does Onceaway need an internet connection?',
      body: [
        'Not for the part that matters. Noticing that a sequence has recurred is ordinary local comparison on your own machine, and the history it builds is a file on that machine. Both work with the connection off.',
        'A connection is needed when you ask for something that requires one: an AI suggestion, sending feedback, or opening the Help guide. None of those happen on their own.',
        'Which is worth stating precisely: Onceaway’s core observation works without an internet connection. That is not the same as never needing the internet, and it would be easy but untrue to say so.',
      ],
    },
    {
      id: 'feedback',
      question: 'What is sent when I use Send Feedback?',
      body: [
        'Your message, and a short list of diagnostics so the report can be made sense of: which version of Onceaway you are running, which screen you were on, whether observation was on or off, and your macOS version and Mac architecture.',
        'A screenshot is included only if you attached one. What Onceaway noticed, your files, your browsing and your API key are not attached, and there is no option that would attach them.',
      ],
    },
    {
      id: 'breach',
      question: 'What happens if Onceaway’s servers are compromised?',
      body: [
        'Onceaway does not operate a central database containing what it noticed on your Mac, so there is no copy of it on a server to lose. It is in a file on your own machine.',
        'What could be exposed is what you deliberately sent: the words of any feedback, the diagnostics above, and any screenshot you attached. Worth knowing before you attach one.',
      ],
    },
    {
      id: 'actions',
      question: 'Can Onceaway do things on my Mac without asking?',
      answer: 'No',
      body: [
        'No observed event, AI answer or recommendation can directly cause an action. That is the rule the product is built around rather than a setting inside it.',
        'Today the one thing it can do is move a single file you have chosen, to a place you have chosen, after you have seen the exact move written out and approved it. Then it runs, once.',
      ],
    },
    {
      id: 'delete',
      question: 'Can I delete what Onceaway has stored?',
      answer: 'Yes',
      body: [
        'Everything Onceaway noticed is one local database in your Application Support folder. Delete the folder and it is gone.',
        'The Help guide covers removing Onceaway properly, step by step.',
      ],
    },
  ],
  help: {
    heading: 'Still not answered?',
    text: 'The Help guide goes further: what it observes, what it never records, how AI fits in, and how it asks before it acts.',
  },
}

/**
 * Claims this site must never make. The build fails if any of them appear in
 * a generated page, which is cheaper than remembering not to write them.
 * Each one is either untrue of the product or unmeasurable.
 */
export const bannedClaims = [
  'automatically automates',
  'fully autonomous',
  'saves you hours',
  'save hours every',
  'guaranteed',
  'sees everything on your Mac',
  'never sees sensitive data',
  'boost your productivity',
  'work smarter',
  '10x',
  'effortlessly automate',
  'powered by AI',
  'AI-powered productivity',
  'set it and forget it',
  'zero effort',
]
