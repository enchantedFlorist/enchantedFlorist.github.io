export default function GALLERYINIT({open, close, changeImage}) {
  const $gallery = document.querySelector('.gallery');
  const body = document.body;
  if ($gallery.length === 0) return;
  const Modernizr = window.Modernizr;
  const $item = Array.from($gallery.querySelectorAll('.gallery__item'));
  const $seeMore = document.querySelector('#gallery-see-more');
  const noImages = matchMedia('screen and (min-width:62.5em)').matches ? 8 : 4;

  if ($item.length > noImages) {
    $seeMore.style.display = 'inline-block';
  }

  const loadImage = function LOADIMAGE($el) {
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
  };

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

  const seeMoreClick = function SEEMORECLICK(e) {
    e.preventDefault();
    const $hiddenItem = Array.from($gallery.querySelectorAll('.gallery__item--hidden'));
    $hiddenItem.forEach(($el) => {
      $el.classList.remove('gallery__item--hidden');
      $el.classList.add('gallery__item--block');
      loadImage($el);
    });
    $seeMore.style.display = 'none';
  };

  $item.forEach(($el, i) => {

    if ( i < noImages ) {
      $el.classList.add('gallery__item--block');
      loadImage($el);
    } else {
      $el.classList.add('gallery__item--hidden');
    }

  });

  $seeMore.addEventListener('click', seeMoreClick, false);

  document.addEventListener('click', galleryClick, false);

};
