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

  // Marquee - pas logo klientów
  var track = document.getElementById('clientsTrack');
  if (track) {
    // Duplikuj loga tyle razy żeby track był wystarczająco szeroki na każdym urządzeniu
    var logos = Array.from(track.children);
    var copies = window.innerWidth < 600 ? 3 : 2;
    for (var c = 0; c < copies; c++) {
      logos.forEach(function(logo) {
        var clone = logo.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
    // Ustaw offset proporcjonalnie do liczby kopii (oryginał / łączna liczba zestawów)
    var totalSets = copies + 1;
    track.style.setProperty('--marquee-offset', '-' + (100 / totalSets).toFixed(4) + '%');
    track.classList.add('is-animating');
  }


});
