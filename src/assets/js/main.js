import fontInit from './fonts';
import galleryInit from './components/gallery';
import lightboxInit from './components/lightbox';
import mobileMenuInit from './components/mobileMenu';
import inputInit from './components/input';
import formspreeForm from './components/formspreeForm';
import './vendor/modernizr';
const controls = lightboxInit();
fontInit();
galleryInit(controls);
inputInit();
mobileMenuInit();

formspreeForm({
  form: document.querySelector('.form'),
  email: 'thisguy+enchantedFlorist@jimmythompson.me',
  isValid: form => form.checkValidity(),
  done: () => {
    controls.changeHTML(`<h2 class='lightbox__title'>Form Sent</h2><p>Thank you for reaching out. I will get back to you as soon as possible.`);
    controls.open();
  },
  error: () => {
    controls.changeHTML(`<h2 class='lightbox__title'>Form Error</h2><p>An error occoured when trying to send the form. Please try again.</p>`);
    controls.open();
  },
});
