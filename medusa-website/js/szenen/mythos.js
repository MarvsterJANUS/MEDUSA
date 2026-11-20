/* Β Mythos – großer Moment: Das Bild bleibt stehen, drei Fassungen ziehen vorbei.
   Bei Ovid frisst sich Stein von den Rändern über das Bild (Farbe → Grau). */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  M.scene = function () {
    const imgs = gsap.utils.toArray('.v-img');
    const caps = gsap.utils.toArray('.v-cap');
    let active = 0;

    const show = (v) => {
      if (v === active) return;
      active = v;
      imgs.forEach((el, i) => gsap.to(el, { opacity: i === v ? 1 : 0, scale: i === v ? 1 : 0.97, duration: 1, ease: 'power3.out', overwrite: 'auto' }));
      caps.forEach((el, i) => gsap.to(el, { opacity: i === v ? 1 : 0, duration: 0.6, overwrite: 'auto' }));
    };

    gsap.utils.toArray('.version').forEach((art) => {
      const v = +art.dataset.v;
      ScrollTrigger.create({
        trigger: art, start: 'top 55%', end: 'bottom 55%',
        onEnter: () => show(v), onEnterBack: () => show(v)
      });
      // römische Ziffer driftet langsamer als der Text
      gsap.fromTo(art.querySelector('.version__no'), { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Versteinerung: drei Stein-Ebenen mit immer kleinerem Loch – von außen nach innen
    const ovid = document.querySelector('.version[data-v="1"]');
    const stone = gsap.timeline({ scrollTrigger: { trigger: ovid, start: 'top 35%', end: 'bottom 65%', scrub: 0.8 } });
    stone.to('.v-s1', { opacity: 1, duration: 1, ease: 'none' })
      .to('.v-s2', { opacity: 1, duration: 1, ease: 'none' })
      .to('.v-s3', { opacity: 1, duration: 1, ease: 'none' })
      .to('.v-img--stone', { scale: 0.985, duration: 1, ease: 'none' }, 0);
  };
})();
