import fontInit from './fonts';
import galleryInit from './components/gallery';
import lightboxInit from './components/lightbox';
import './vendor/modernizr';
const controls = lightboxInit();
fontInit();
galleryInit(controls);
