# Onceaway — public marketing site

The source of the Onceaway website.

Onceaway is a Mac app that notices the work you repeat, helps you see which of
it is worth reducing, and can help you do something about it when you ask.

- The site: <https://kevsinfield.github.io/onceaway-site/>
- Onceaway Help: <https://kevsinfield.github.io/onceaway-help/>

Onceaway is in Preview. There is no public download yet.

## Building it

```bash
cd Website
npm ci
npm run dev      # http://localhost:4321
npm run build    # static output in Website/dist
```

Node 20 or newer. One dependency, used to render the release notes.

GitHub Actions builds and publishes the site on every push to `main`.

## About this repository

This is a mirror. The site is written in a private repository and copied here
by a publish script, so nothing in this repository is edited by hand.

It contains the website and the release notes it renders, and nothing else:
no application source, and no history from the project it comes from.
