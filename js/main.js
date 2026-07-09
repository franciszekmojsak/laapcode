// Laap Code — main.js (szkielet)

document.addEventListener('DOMContentLoaded', function () {

  // Hamburger menu (mobile nav)
  var hamburger = document.getElementById('navHamburger');
  var mobileNav = document.getElementById('navMobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Zamknij menu po kliknięciu linku
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Rok w footerze
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


});
