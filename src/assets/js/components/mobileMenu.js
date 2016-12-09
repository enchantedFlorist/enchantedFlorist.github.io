export default function mobileMenuInit() {
  const body = document.body;
  const $header = document.querySelector('.header');
  const $menu = $header.querySelector('.header__menu');
  const $checkbox = $header.querySelector('.header__checkbox');
  const $trigger = $header.querySelector('.header__trigger');

  let state = 'CLOSED';

  if ($checkbox.checked) {
    state = 'OPEN';
  }

  const documentClick = function DOCUMENTCLICK(e) {
    const { target } = e;

    if (state === 'CLOSED') return; // don't need to do anything here
    let el = target;

    while (el !== body && el !== $trigger && el !== $menu && el !== $checkbox) {
      el = el.parentElement;
    }


    if (el === body) {
      $checkbox.checked = false;
      state = 'CLOSED';
      body.style.overflow = null;
    }
  };

  const checkboxChange = function CHECKBOXCHANGE(e) {
    const open = $checkbox.checked;
    if (open) {
      state = 'OPEN';
      body.style.overflow = 'hidden';
    } else {
      state = 'CLOSED';
      body.style.overflow = null;
    }
  };

  $menu.classList.add('header__menu--enchanced');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $menu.classList.add('header__menu--animateable');
    });
  });


  $checkbox.addEventListener('change', checkboxChange, false);
  document.addEventListener('click', documentClick, false);
};
