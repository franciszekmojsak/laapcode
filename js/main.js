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

  // Formularz kontaktowy — tymczasowo mailto (do zamiany na realny Formspree ID)
  var contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var imie = (contactForm.querySelector('#imie') || {}).value || '';
      var email = (contactForm.querySelector('#email') || {}).value || '';
      var telefon = (contactForm.querySelector('#tel') || {}).value || '';
      var wiadomosc = (contactForm.querySelector('#wiadomosc') || {}).value || '';
      var uslugi = Array.prototype.map.call(
        contactForm.querySelectorAll('input[name="usluga"]:checked'),
        function (el) { return el.value; }
      ).join(', ');

      var bodyLines = [
        'Imię i nazwisko: ' + imie.trim(),
        'Email: ' + email.trim(),
        'Telefon: ' + (telefon.trim() || '—'),
        'Usługi: ' + (uslugi || '—'),
        '',
        'Opis projektu:',
        wiadomosc.trim() || '—'
      ];

      var subject = encodeURIComponent('Zapytanie z formularza — Laap Code');
      var body = encodeURIComponent(bodyLines.join('\n'));

      window.location.href = 'mailto:mojsakfranciszek@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

});
