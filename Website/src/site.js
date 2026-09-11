/*
 * The only script on this site. It does two things: it fades a section in the
 * first time it comes into view, and it lets the hero's animation be stopped.
 * No analytics, no tracking, no third party, no cookies, nothing stored,
 * nothing sent.
 *
 * Nothing is ever hidden waiting to be revealed. A section is visible from the
 * moment it is parsed; the script only asks it to animate in as it arrives.
 * A browser that never runs this, a tab that never paints and an observer
 * that never fires all produce the same thing: the whole page, readable.
 *
 * Anyone who has asked for reduced motion gets none of it.
 */

/*
 * The hero's pause control.
 *
 * The button ships hidden and is revealed here, so a browser with no
 * JavaScript never shows one that would do nothing.
 *
 * The tour is a CSS animation, so stopping it is one class: the stylesheet
 * owns the behaviour and this only flips a switch. Anyone who has asked for
 * reduced motion is already being shown a single still by the stylesheet, so
 * there is nothing to pause and no button to show.
 */
;(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var toggle = document.querySelector('.loop-toggle')
  if (!toggle || reduced) return

  var loop = toggle.closest ? toggle.closest('.loop') : null
  var figure = loop && loop.querySelector('.frame--loop')
  if (!figure) return

  var playing = true
  toggle.hidden = false
  toggle.addEventListener('click', function () {
    playing = !playing
    figure.classList.toggle('is-paused', !playing)
    toggle.textContent = toggle.getAttribute(playing ? 'data-pause' : 'data-play')
  })
})()

;(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !('IntersectionObserver' in window)) return

  var bands = document.querySelectorAll('.band:not(.hero)')
  if (!bands.length) return

  var each = function (fn) {
    Array.prototype.forEach.call(bands, fn)
  }
  var reveal = function (band) {
    band.classList.add('is-visible')
  }

  each(function (band) {
    band.classList.add('reveal')
  })

  // Anything already on screen when the page loads is simply there. Fading in
  // the first screenful means the reader waits for content that had already
  // arrived, which is the opposite of the point.
  var settled = false
  window.setTimeout(function () {
    settled = true
  }, 350)

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        if (settled) reveal(entry.target)
        else entry.target.classList.remove('reveal')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.02 }
  )

  each(function (band) {
    observer.observe(band)
  })
})()
