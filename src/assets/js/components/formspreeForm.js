export default function FORMSPREEFORM({
  form,
  error = e => console.log(e),
  done = msg => console.log(msg),
  isValid = form => true,
  email,
  classPrefix = 'form',
}) {
  if (form.nodeType !== 1) throw new Error('Incorrect item passed into form field');
  if (typeof email !== 'string') throw new Error('Email must be a string');

  const button = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');


  const formSubmit = function FORMSUBMIT(e) {
    e.preventDefault();

    if (!isValid(form)) return;

    const formData = new FormData(form);
    const xmlhttp = new XMLHttpRequest();
    const readyStateChange = function READYSTATECHANGE() {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {

        form.classList.remove(`${classPrefix}--sending`);
        if (button) {
          button.disabled = false;
        }

        if (xmlhttp.status === 200) {
          // NOTE: Sent form succesfully
          // lightbox.changeHTML('<h2 class="lightbox__title">Form Sent</h2><p>Thanks for reaching out, I\'ll get back to you as soon as possible</p>');
          // lightbox.open();
          done(xmlhttp.responseText);

        } else {
          // NOTE: Form failed sending
          // lightbox.changeHTML('<h2 class="lightbox__title">Form Error</h2><p>There was an unexpected error sending the form</p>');
          // lightbox.open();
          error(xmlhttp.responseText);
        }

      }
    };
    xmlhttp.open('POST', `https://formspree.io/${email}`);
    xmlhttp.setRequestHeader('accept', 'application/json');
    xmlhttp.onreadystatechange = readyStateChange;
    xmlhttp.send(formData);
    if (button) {
      button.disabled = true;
    }
    form.classList.add(`${classPrefix}--sending`);

  };

  form.addEventListener('submit', formSubmit, false);
}
