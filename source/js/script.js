document.querySelector('body').classList.remove('nojs');

let pageHeader = document.querySelector('.page-header');
let navToggle = document.querySelector('.main-nav__toggle');

navToggle.addEventListener('click', function () {
  if (!pageHeader.classList.contains('page-header--nav-open')) {
    pageHeader.classList.add('page-header--nav-open');
  } else {
    pageHeader.classList.remove('page-header--nav-open');
  }
});
