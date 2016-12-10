export default function inputInit() {
  const body = document.body;
  const $input = Array.from(document.querySelectorAll('input'));
  const $textarea = Array.from(document.querySelectorAll('textarea'));

  const addClass = function ADDCLASS({target}) {
    target.classList.add('input-viewed');
  };

  const addListeners = function ADDLISTENERS(el) {
    el.addEventListener('blur', addClass);
    el.addEventListener('invalid', addClass);
    el.addEventListener('valid', addClass);
  };

  const inputChange = function INPUTCHANGE(e) {
    const { target } = e;
    let el = target;

    while (el !== body && !el.classList.contains('input')) {
      el = el.parentElement;
    }

    if (el.classList.contains('input')) {
      const value = target.value.trim();
      const isOpen = el.classList.contains('input--open');
      if (value === '' && isOpen) {
        el.classList.remove('input--open');
      } else if (value !== '' && !isOpen) {
        el.classList.add('input--open');
      }
    }

  };

  $input.forEach(addListeners);
  $textarea.forEach(addListeners);

  document.addEventListener('change', inputChange, false);
};
