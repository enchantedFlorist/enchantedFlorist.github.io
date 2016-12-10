import Promise from 'promise-polyfill';
export default function POLYYFILLSINIT() {
  if (!window.Promise) {
    window.Promise = Promise;
  }
};
