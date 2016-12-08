export default function LIGHTBOXINIT() {
  const $lightbox = document.createElement('DIV');
  $lightbox.className = 'lightbox';
  $lightbox.innerHTML = `
    <div class="lightbox__inner">
      <button class="lightbox__close">Close</button>
      <div class="lightbox__content"></div>
    </div>
  `;

  const $close = $lightbox.querySelector('.lightbox__close');
  const $content = $lightbox.querySelector('.lightbox__content');

  const info = {
    state: 'CLOSED', // CLOSED, CLOSING, OPEN, OPENING
    imgNaturalWidth: false,
    imgNaturalHeight: false,
  };

  const changeImage = function CHANGEIMAGE(src) {
    const now = Date.now();
    const img = new Image();
    const imgLoad = function IMGLOAD(e) {
      info.imgNaturalHeight = img.naturalHeight;
      info.imgNaturalWidth = img.naturalWidth;
      if (now === info.now) {
        $content.innerHTML = `
          <img src="${img.src}" />
        `;
      }
    };
    info.now = now;
    $content.innerHTML = `
      <div class="loader"></div>
    `;
    open();
    img.onload = imgLoad;
    img.src = src;
  };



  const open = function OPEN() {
    info.state = 'OPENING';
    $lightbox.classList.add('lightbox--block');
    requestAnimationFrame(() => {
      if (info.state !== 'OPENING') return;
      requestAnimationFrame(() => {
        if (info.state !== 'OPENING') return;
        $lightbox.classList.add('lightbox--show');
        info.state = 'OPEN';
      });
    });
  };

  const close = function CLOSE() {
    info.state = 'CLOSING';
    $lightbox.classList.remove('lightbox--show');
  };

  const transitionEnd = function TRANSITIONEND() {
    if (info.state === 'CLOSING') {
      $lightbox.classList.remove('lightbox--block');
      info.state = 'CLOSED';
    }
  };

  const lightboxClick = function LIGHTBOXCLICK(e) {
    const { target } = e;
    if (target === $close || target === $lightbox) {
      close();
    }
  };

  $lightbox.addEventListener('transitionend', transitionEnd, false);
  $lightbox.addEventListener('click', lightboxClick, false);

  document.body.appendChild($lightbox);

  return {
    changeImage,
    open,
    close,
  };
};
