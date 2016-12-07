export default function LIGHTBOXINIT() {
  const $lightbox = document.createElement('DIV');
  $lightbox.className = 'lightbox';
  $lightbox.innerHTML = `
    <div class="lightbox__inner">
      <button class="lightbox__close"></button>
      <div class="lightbox__content"></div>
    </div>
  `;

  const $close = $lightbox.querySelector('.lightbox__Close');
  const $content = $lightbox.querySelector('.lightbox__content');
};
