export default function inputInit() {
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

  $input.forEach(addListeners);
  $textarea.forEach(addListeners);
};
