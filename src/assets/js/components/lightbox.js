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
  const $inner = $lightbox.querySelector('.lightbox__inner');

  const info = {
    state: 'CLOSED', // CLOSED, CLOSING, OPEN, OPENING
    imgNaturalWidth: false,
    imgNaturalHeight: false,
  };

  const setDimensions = function SETDIMENSIONS(width, height) {
    $inner.style.width = `${width}px`;
    $inner.style.height = `${height}px`;
  };

  const lightboxDimensions = function LIGHTBOXDIMENSIONS(naturalWidth, naturalHeight) {
    const ratio = naturalHeight / naturalWidth;
    const maxWidth = window.innerWidth - 32;
    const maxHeight = window.innerHeight - 32;



    let width = naturalWidth < maxWidth ? naturalWidth : maxWidth;
    let height = width * ratio;
    if (height > maxHeight) {
      const heightRatio = height / maxHeight;
      height = maxHeight;
      width = width / heightRatio;
    }
    return {
      width,
      height,
    }

  };

  const changeMode = function CHANGEMODE(mode) {
    if ( mode === 'HTML') {
      $lightbox.classList.add('lightbox--html-mode');
      $inner.style.width = 'auto';
      $inner.style.height = 'auto';
    } else {
      $lightbox.classList.remove('lightbox--html-mode');
    }

  }


  const changeImage = function CHANGEIMAGE(src) {
    changeMode('IMAGE');
    const now = Date.now();
    const img = new Image();
    const imgLoad = function IMGLOAD(e) {
      if (now === info.now) {
        const ratio = img.naturalHeight / img.naturalWidth;
        const maxWidth = window.innerWidth - 32;
        const maxHeight = window.innerHeight - 32;
        const { width, height } = lightboxDimensions(img.naturalWidth, img.naturalHeight);

        info.imgNaturalWidth = img.naturalWidth;
        info.imgNaturalHeight = img.naturalHeight;

        setDimensions(width, height);

        $content.innerHTML = `
          <img src="${img.src}" />
        `;
      }
    };
    info.now = now;
    $content.innerHTML = `
      <div class="loader"></div>
    `;
    setDimensions(200, 200);
    open();
    img.onload = imgLoad;
    img.src = src;
  };

  const changeHTML = function CHANGEHTML(html) {
    changeMode('HTML');
    $content.innerHTML = html;
  };



  const open = function OPEN() {
    if (info.state === 'OPEN') return;
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
    if (info.state === 'CLOSED') return;
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

  const windowResizeHandler = {
    handleEvent: function() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const { width, height } = lightboxDimensions(info.imgNaturalWidth, info.imgNaturalHeight);
        setDimensions(width, height);
      },100);
    },
    timeout: null,
  };

  $lightbox.addEventListener('transitionend', transitionEnd, false);
  $lightbox.addEventListener('click', lightboxClick, false);
  window.addEventListener('resize', windowResizeHandler, false);

  document.body.appendChild($lightbox);


  return {
    changeImage,
    open,
    close,
    changeHTML,
  };
};
