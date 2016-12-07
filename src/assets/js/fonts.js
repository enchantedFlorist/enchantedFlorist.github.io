import FontFaceObserver from 'fontfaceobserver';

export default function FONTINIT() {
const openSans = new FontFaceObserver('Open Sans');
const libreB = new FontFaceObserver('Libre Baskerville');
const root = document.documentElement;

  Promise.all([
    openSans.load(),
    libreB.load(),
  ]).then(function () {
    root.classList.add('fonts-loaded');
  });
};
