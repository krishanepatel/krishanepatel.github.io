document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);
  
    gsap.utils.toArray('.about_section').forEach((section, i) => {
      gsap.fromTo(section, 
        { x: i === 0 ? '0%' : '100%', opacity: i === 0 ? 1 : 0 }, 
        { 
          x: '0%', 
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=100%',
            scrub: true,
            snap: 1 / (gsap.utils.toArray('.about_section').length - 1),
            onEnter: () => section.classList.add('show'),
            onLeaveBack: () => section.classList.remove('show')
          }
        }
      );
    });
  });
  