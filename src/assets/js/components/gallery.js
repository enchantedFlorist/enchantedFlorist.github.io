export default function GALLERYINIT({open, close, changeImage}) {
  const $gallery = document.querySelector('.gallery');
  const body = document.body;
  if ($gallery.length === 0) return;
  const Modernizr = window.Modernizr;
  const $item = Array.from($gallery.querySelectorAll('.gallery__item'));

  $item.forEach(($el) => {
    const $img = $el.querySelector('.gallery__item__img');
    const src = $img.getAttribute('data-src');
    const alt = $img.getAttribute('alt');
    const img = new Image();

    const imgLoad = function IMGLOAD() {
      if (Modernizr.objectfit) {
       $img.src = src;
      } else {
        const div = document.createElement('DIV');
        div.className = 'gallery__item__background-image';
        div.setAttribute('aria-label', alt);
        div.style.backgroundImage = `url('${src}')`;
      }
    };

    $el.setAttribute('data-src', src);

    img.onload = imgLoad;
    img.src = src;


  });


  const galleryClick = function GALLERYCLICK(e) {
    const { target } = e;
    let el = target;

    while (el !== body && !(el.classList.contains('gallery__item'))) {
      el = el.parentElement;
    }

    if (el.classList.contains('gallery__item')) {
      changeImage(el.getAttribute('data-src'));
    }
  };

  document.addEventListener('click', galleryClick, false);

};
