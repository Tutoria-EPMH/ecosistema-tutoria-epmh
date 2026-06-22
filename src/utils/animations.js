// /src/utils/animations.js

export function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
  
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el, index) => {
      if(el.getBoundingClientRect().top < window.innerHeight) {
        setTimeout(() => el.classList.add('active'), index * 100); 
      }
    });
  }, 100);
}