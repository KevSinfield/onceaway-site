/**
 * The Onceaway screens shown on this site.
 *
 * Each screen has two possible renderings, and the build prefers the first
 * one that exists:
 *
 *  1. A photograph of the real app, dropped into `public/screenshots/`.
 *  2. A faithful frame built from the app's own words, rendered as HTML.
 *
 * The second exists because a marketing site should show the product from
 * the first day it has one, and because a rendered frame is easier to keep
 * private: every string here was read off the running app, and nothing in it
 * came from anybody's activity. Nothing here describes a capability the app
 * does not have — the frames are the same screens, drawn rather than
 * photographed, and the moment a real capture lands beside them it wins.
 *
 * See `public/screenshots/README.md` for how to capture them.
 */

/** The sidebar, exactly as the app orders it. */
export const sidebar = {
  sections: ['Home', 'Patterns', 'Opportunities', 'Recommendations', 'Insights', 'History'],
  secondary: ['Settings', 'Help'],
  status: 'Observation on',
}

export const screens = {
  home: {
    screenshot: 'home.png',
    alt: 'The Onceaway Home screen, headed “Here’s what Onceaway noticed”, showing a confirmed repeated activity called “Saving images from the browser” marked as promising.',
    active: 'Home',
    title: 'Here’s what Onceaway noticed',
    subtitle: 'Observation is on.',
    cards: [
      {
        heading: 'Needs your attention',
        note: 'Nothing needs your attention right now. New repeats will appear here for a quick yes or no.',
      },
      {
        heading: 'Opportunities',
        note: 'Confirmed repeats with enough evidence to be worth a look.',
        rows: [
          {
            title: 'Saving images from the browser',
            meta: 'Seen 4 times · last seen today',
            tags: [{ label: 'Promising', tone: 'green' }],
            trailing: 'You’d like help reducing this.',
            action: 'View opportunity',
          },
        ],
      },
      {
        heading: 'Ready to explore',
        note: 'Repeated work you’d like help reducing. Onceaway suggests possible ways when you ask.',
        rows: [
          {
            title: 'Saving images from the browser',
            meta: 'Seen 4 times · last seen today',
            tags: [{ label: 'Promising', tone: 'green' }],
            action: 'Explore ideas',
          },
        ],
      },
    ],
  },

  patterns: {
    screenshot: 'patterns.png',
    alt: 'The Patterns screen, listing repeated activity Onceaway has noticed with filters for needs review, confirmed, rejected and not sure.',
    active: 'Patterns',
    title: 'Patterns',
    subtitle: 'Repeated activity Onceaway has noticed. Tell it whether each one was really the same thing.',
    filters: ['All', 'Needs review', 'Confirmed', 'Rejected', 'Not sure'],
    activeFilter: 'All',
    cards: [
      {
        rows: [
          {
            title: 'Saving images from the browser',
            meta: 'Seen 4 times · last seen today',
            tags: [
              { label: 'Confirmed', tone: 'ink' },
              { label: 'Promising', tone: 'green' },
            ],
            trailing: 'You’d like help reducing this.',
          },
          {
            title: 'Exporting the weekly report',
            meta: 'Seen 3 times · last seen yesterday',
            tags: [{ label: 'Needs review', tone: 'amber' }],
            trailing: 'Was this the same piece of work?',
          },
        ],
      },
    ],
  },

  opportunity: {
    screenshot: 'opportunity.png',
    alt: 'An opportunity in Onceaway called “Saving images from the browser”, showing the observed pattern, the person’s own review and why it looks worth reducing.',
    active: 'Opportunities',
    title: 'Saving images from the browser',
    subtitle: 'Confirmed repeated activity · Seen 4 times · 3 days',
    tags: [
      { label: 'Promising', tone: 'green' },
      { label: 'Interested', tone: 'ink' },
    ],
    detail: [
      { heading: 'Pattern', trailing: '5 steps' },
      { heading: 'Your review', trailing: 'Same activity' },
      { heading: 'Interpretation', trailing: 'Not asked yet' },
      {
        heading: 'Opportunity',
        trailing: 'Promising',
        body: 'Repeated often enough, with real file or browser work involved, to be worth a look.',
      },
    ],
  },

  insights: {
    screenshot: 'insights.png',
    alt: 'The Insights screen, showing counts of patterns noticed, confirmed, opportunities and those the person wants reduced, with repeated work grouped by category.',
    active: 'Insights',
    title: 'Insights',
    subtitle: 'See how your repeated work is changing over time.',
    stats: [
      { value: '6', label: 'Patterns noticed' },
      { value: '4', label: 'Confirmed' },
      { value: '2', label: 'Opportunities' },
      { value: '1', label: 'Want reduced' },
    ],
    funnel: {
      heading: 'From noticed to worth reducing',
      note: 'Each step is a smaller group of the one above it.',
      rows: [
        { label: 'Noticed', value: 6, of: 6 },
        { label: 'Confirmed', value: 4, of: 6 },
        { label: 'Opportunity', value: 2, of: 6 },
        { label: 'Want reduced', value: 1, of: 6 },
      ],
    },
    categories: {
      heading: 'Repeated work by category',
      note: 'Grouped from what was observed: websites, files, or moving between apps.',
      rows: [
        { label: 'Files', value: 4, of: 6 },
        { label: 'Websites', value: 2, of: 6 },
      ],
    },
  },

}
