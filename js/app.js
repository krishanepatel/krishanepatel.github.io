// General Utility Functions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// ===== Responsive Navbar Toggle ===== //
const hamburger = document.querySelector(".hamburger");
const navBar = document.querySelector(".nav-bar");

if (hamburger && navBar) {
  hamburger.addEventListener("click", () => navBar.classList.toggle("open"));
}

// ===== Intersection Observer for Scroll Animations ===== //
const observerOptions = {
  rootMargin: "0px 0px -100px 0px"
};

const textRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('show', entry.isIntersecting));
}, observerOptions);

document.querySelectorAll('.hidden, .from-left, .from-right').forEach(el => textRevealObserver.observe(el));

// ===== Portfolio Filtering ===== //
const filterContainer = document.querySelector(".portfolio-filter");
const galleryItems = document.querySelectorAll(".portfolio_item");

if (filterContainer && galleryItems.length) {
  filterContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("filter-item")) {
      filterContainer.querySelector(".active")?.classList.remove("active");
      event.target.classList.add("active");

      const filterValue = event.target.getAttribute("data-filter");
      galleryItems.forEach(item => {
        const shouldShow = item.classList.contains(filterValue) || filterValue === 'all';
        item.classList.toggle("show", shouldShow);
        item.classList.toggle("hide", !shouldShow);
      });
    }
  });
}

// ===== Shuffle Portfolio Items ===== //
function shufflePortfolio() {
  if (galleryItems.length) {
    const container = document.getElementById("portfolio_grid");
    const shuffledItems = shuffleArray(Array.from(galleryItems));

    container.innerHTML = ''; // Clear the container
    shuffledItems.forEach(item => container.appendChild(item));
  }
}

// ===== Adjust references in blog ====== //
// Select the references list container
const referencesList = document.querySelector('.references_list');

if (referencesList) {
    // Get all the <li> elements as an array
    const listItems = Array.from(referencesList.querySelectorAll('li'));

    // Sort the <li> elements alphabetically based on their text content
    listItems.sort((a, b) => {
        const textA = a.textContent.trim().toLowerCase();
        const textB = b.textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    // Clear the original list
    referencesList.innerHTML = '';

    // Append the sorted <li> elements back to the list
    listItems.forEach(item => referencesList.appendChild(item));

    console.log('References list sorted successfully.');
} else {
    console.warn('No element with class "references_list" found.');
}

// ===== Collapsible Sections ===== //
document.querySelectorAll(".topics").forEach(section => {
  section.addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
    content.style.maxHeight = content.style.display === "block" ? `${content.scrollHeight}px` : null;
  });
});

// ===== Smooth Scroll for Anchor Links ===== //
function handleAnchorLinkScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = event.currentTarget.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop + 120; // Adjust offset
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
}

if (window.location.pathname.includes('/work_')) {
  handleAnchorLinkScroll();
}

// ===== Active State on Scroll (for Case Study Pages) ===== //
// GSAP version for smooth scrolling with navbar height adjustment
window.onload = function() {
  const pageNavLinks = Array.from(document.querySelectorAll('.page-nav a'));
  const navbar = document.querySelector('.header'); // Assuming your navbar has the class '.header'

  function getNavbarHeight() {
      return navbar ? navbar.offsetHeight : 0;
  }

  pageNavLinks.forEach((pageNavLink) => {
      pageNavLink.addEventListener('click', (event) => {
          event.preventDefault();  // Prevent default link behavior

          // Remove 'active' class from all links
          pageNavLinks.forEach(link => link.classList.remove('active'));

          // Add 'active' class to the clicked link
          pageNavLink.classList.add('active');

          // Get the href value (target section)
          const targetId = pageNavLink.getAttribute('href');
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
              const navbarHeight = getNavbarHeight();
              const extraOffset = 20;  // Adjust this value as needed

              // Manually calculate the position to scroll to, adjusting for navbar height and extra offset
              const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - extraOffset;

              // Use Anime.js for smooth scrolling
              anime({
                  targets: [document.documentElement, document.body],
                  scrollTop: targetPosition,  // Scroll to the calculated position
                  duration: 200,  // Duration of scrolling animation in milliseconds
                  easing: 'easeInQuad'  // Easing function for smooth scrolling
              });
          }
      });
  });
};

// ===== Smooth Scroll ===== //
document.addEventListener("DOMContentLoaded", () => {
  const parallaxElement = document.querySelector(".flex_column");

  window.addEventListener("scroll", () => {
      const scrollY = window.scrollY; // Get the vertical scroll position
      const speed = 0.001; // Adjust this value to control the parallax speed (lower is slower)

      // Calculate the new background position
      const offset = scrollY * speed;

      // Apply the background position for parallax effect
      parallaxElement.style.backgroundPosition = `center ${-offset}px`;
  });
});


 //Code for linking pagenav links to sections
 document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section"); // Match your HTML structure
  const navLinks = document.querySelectorAll(".page-nav ul li a");

  const updateActiveClass = () => {
      let current = null; // Start with no active section

      sections.forEach((section) => {
          const sectionTop = section.offsetTop - 100; // Adjust offset as needed
          const sectionHeight = section.offsetHeight;

          if (
              window.scrollY >= sectionTop &&
              window.scrollY < sectionTop + sectionHeight
          ) {
              current = section.getAttribute("id");
          }
      });

      // Update navigation links
      navLinks.forEach((link) => {
          link.classList.remove("active");
          if (current && link.getAttribute("href").includes(current)) {
              link.classList.add("active");
          }
      });
  };

  window.addEventListener("scroll", updateActiveClass);
  updateActiveClass(); // Call on page load to handle initial state
});



// document.addEventListener('DOMContentLoaded', () => {
//   const caseStudy = document.querySelector(".blog_post");
//   const subSections = caseStudy ? Array.from(caseStudy.getElementsByTagName('div')) : [];
//   const pageNavLinks = Array.from(document.querySelectorAll('.page-nav a'));

//   if (subSections.length && pageNavLinks.length) {
//     const viewer = new IntersectionObserver(entries => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           const index = subSections.indexOf(entry.target);
//           pageNavLinks.forEach(link => link.classList.remove('active'));
//           if (index !== -1) pageNavLinks[index].classList.add('active');
//         }
//       });
//     }, { threshold: 1 });

//     subSections.forEach(section => viewer.observe(section));
//   }
// });

// ===== GSAP Animations ===== //
// Register the ScrollTrigger plugin
// gsap.registerPlugin(ScrollTrigger);

// // Hero Section Animations
// const hero_section = document.getElementsByClassName('hero_section_image');
// if (hero_section) {
// window.addEventListener('load', () => {

  
//   gsap.from('.hero_section_image', { duration: 2, y: -1800, opacity: 0.3, ease: 'sine.out' });
//   gsap.from('.hero_section_text_A', { duration: 3.5, x: -850, opacity: 0, ease: 'circ.out' });
//   gsap.from('.hero_section_text_B', { duration: 3.5, x: 1600, opacity: 0, ease: 'circ.out' });

//   // ScrollTrigger for Hero Section
//   gsap.to(".hero_section", {
//     scrollTrigger: { trigger: ".hero_section_wrapper", start: "top top", end: "bottom top", scrub: true },
//     opacity: 0.1,
//     ease: 'circ.out'
//   });
// });


// // Contact Section Animations
// document.addEventListener('DOMContentLoaded', () => {
//   gsap.registerPlugin(ScrollTrigger);
//   gsap.fromTo('.contact_image', { opacity: 0, x: '-100%' }, {
//     opacity: 1, x: '0%', duration: 1,
//     scrollTrigger: { trigger: '.contact_container', start: 'top 80%', end: 'top 30%', scrub: true }
//   });
//   gsap.fromTo('.contact_form', { opacity: 0, x: '100%' }, {
//     opacity: 1, x: '0%', duration: 1,
//     scrollTrigger: { trigger: '.contact_container', start: 'top 80%', end: 'top 30%', scrub: true }
//   });
// });



// // Mail Icon Animation
// // Check if 'formSubmit' element exists before attaching event listener
// const formSubmit = document.getElementById('formSubmit');
// if (formSubmit) {
//   formSubmit.addEventListener('click', function(event) {
//     event.preventDefault();
//     document.querySelector('.mail__letter').classList.toggle('move');
//     document.querySelector('.mail__top').classList.toggle('closed');
    
//     setTimeout(() => document.querySelector('.container-mail').classList.add('whisk-away'), 1500);
//   });
// }

// // Form Input Focus Effects
// document.querySelectorAll('input').forEach(input => {
//   input.addEventListener('focus', () => input.parentElement.classList.add('active'));
//   input.addEventListener('blur', () => {
//     input.parentElement.classList.toggle('active', input.value !== '');
//   });
// });


// Scroll animation on About page
