// Scroll to the header section after page refresh
window.addEventListener("load", function() {
  const headerSection = document.querySelector('.parallax-header');
  if (headerSection) {
      headerSection.scrollIntoView({ behavior: 'smooth' });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

document.body.style.userSelect = 'none';

