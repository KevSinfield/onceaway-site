# Release notes

One file per release, and this is the only copy of it. The updater's "what's
new", a public changelog and any Help page about a release are all rendered
from these files rather than written again, so there is never a second version
of the same release note to keep in step.

## Shape

A file is named for the release it describes:

```
<version>-<label>.md   a pre-release, e.g. 0.5.0-test2.md
<version>.md           a stable release, e.g. 0.6.0.md
```

Inside:

```markdown
# Onceaway <version> (<label>)

One or two sentences saying what this release is for.

## Added
## Improved
## Fixed
## Known limitations
```

All four sections are present in every file. A section with nothing in it says
so in one line rather than being deleted, because "nothing was fixed" and
"we forgot to say" read identically otherwise.

`Scripts/verify-release.sh` refuses to package a release whose note is missing
or malformed.

## What goes in them

These are read by whoever installs the release. Write for them:

- **Added** — something that was not there before.
- **Improved** — something that already worked and now works better.
- **Fixed** — something that was wrong.
- **Known limitations** — what this release still cannot do, and anything a
  person might otherwise report as a bug.

Not in them: task numbers, commit hashes, internal file names, refactors
nobody can see, or anything that only makes sense to whoever wrote the code.
Engineering-facing material belongs in `Docs/Release/`.
