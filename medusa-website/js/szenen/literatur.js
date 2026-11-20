/* Ζ Literatur – großer Moment: reine Typografie. Zitate bauen sich beim Scrollen Wort für Wort auf.
   Bei Dante schieben sich zwei dunkle Hände über den Bildschirm; im Dunkeln erscheint die Übersetzung,
   dann geben die Hände den Blick wieder frei. */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  // Wörter eines Textes: blass → voll, gekoppelt an den Scrollweg
  function wordReveal(el, trigger, start, end) {
    const split = new SplitText(el, { type: 'words', wordsClass: 'w' });
    return gsap.fromTo(split.words, { opacity: 0.12, y: 14 }, {
      opacity: 1, y: 0, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: trigger || el, start: start || 'top 78%', end: end || 'bottom 45%', scrub: 0.6 }
    });
  }

  M.scene = function () {
    /* ---------- Zitate (Homer, Goethe, Shelley) ---------- */
    gsap.utils.toArray('.q').forEach((q) => {
      wordReveal(q.querySelector('.q__text'), q.querySelector('.q__inner'), 'top 72%', 'bottom 62%');
      const rest = q.querySelectorAll('.q__de, .q__src');
      gsap.fromTo(rest, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: q.querySelector('.q__inner'), start: 'bottom 70%', once: true }
      });
    });

    /* ---------- Dante: Hände verdecken die Augen ---------- */
    const pin = document.querySelector('.dante__pin');
    if (!pin) return;
    const split = new SplitText(pin.querySelector('.dante__it'), { type: 'words', wordsClass: 'w' });
    const handL = pin.querySelector('.dante__hand--l');
    const handR = pin.querySelector('.dante__hand--r');
    const dark = pin.querySelector('.dante__dark');
    const darkSplit = new SplitText(dark, { type: 'words', wordsClass: 'w' });

    gsap.set(handL, { x: 0, xPercent: -101 });
    gsap.set(handR, { x: 0, xPercent: 101 });
    gsap.set(dark, { opacity: 1 });
    gsap.set(darkSplit.words, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.fromTo(split.words, { opacity: 0.12, y: 14 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, 0)
      .fromTo(pin.querySelector('.dante__fig img'), { scale: 1.08 }, { scale: 1, duration: 2.6 }, 0)
      .to({}, { duration: 0.4 })
      // die Hände schließen sich
      .to(handL, { xPercent: 0, duration: 1, ease: 'power2.inOut' })
      .to(handR, { xPercent: 0, duration: 1, ease: 'power2.inOut' }, '<')
      // im Dunkeln: die Übersetzung
      .to(darkSplit.words, { opacity: 1, stagger: 0.04, duration: 0.3 }, '>-0.1')
      .to({}, { duration: 0.8 })
      .to(darkSplit.words, { opacity: 0, duration: 0.4 })
      // die Hände geben den Blick wieder frei
      .to(handL, { xPercent: -101, duration: 1, ease: 'power2.inOut' }, '<0.1')
      .to(handR, { xPercent: 101, duration: 1, ease: 'power2.inOut' }, '<')
      .to({}, { duration: 0.6 });   // kurz mit freiem Blick stehen lassen

    ScrollTrigger.create({
      trigger: pin, start: 'top top', end: '+=320%',
      pin: true, scrub: 0.6, animation: tl, invalidateOnRefresh: true
    });
  };
})();
