export default function GALLERYINIT() {
  const $gallery = document.querySelector('.gallery');
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

    img.onload = imgLoad;
    img.src = src;


  });

};
