# Product screenshots

Drop real captures of Onceaway in here and the site uses them. Until one
exists for a given screen, the build draws that screen from the app's own
words instead — see `content/screens.mjs` for what each frame contains and
why both exist.

Nothing in this directory is required for the site to build.

## What to capture

| File | Screen | Where |
|---|---|---|
| `home.png` | Home | the app's first screen |
| `patterns.png` | Patterns | sidebar → Patterns |
| `opportunity.png` | An opportunity, opened | Opportunities → View opportunity |
| `insights.png` | Insights | sidebar → Insights |

## How

1. Run Onceaway in **Light Mode**, with the window at its default size —
   1180 × 760 points, which is 2360 × 1520 pixels on a Retina display.
2. Capture the window, not the screen: **⌘⇧4**, then **space**, then click the
   window. Hold **⌥** while clicking to leave out the drop shadow.
3. Save as PNG with the names above.

## Before you commit one

These go on a public website. Check every capture for:

- **Real activity.** Pattern names, application names and website hosts in a
  capture are whatever that Mac was actually doing. Use a machine whose
  history you are content to publish, or crop the rows out.
- **File names and paths.** Nothing in the window should show one.
- **API keys.** The AI pane never displays a stored key, but check anyway.
- **Personal details.** Account name, email address, notification contents.

If a capture needs redacting to be safe, it is not the right capture. Take a
different one.

## Note on the current set

There are none yet. The site was built on a machine where the only Onceaway
install held its owner's real activity, and screen captures of application
windows could not be written to disk from the build environment. The drawn
frames were made instead, from the running app, and they carry no one's data
at all. Replacing them is a five-minute job on any Mac with the app on it.
