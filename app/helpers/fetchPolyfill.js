// Currently, the fetch API doesn't reliably parse the UTF-8 encoded json
// correctly. Here we just force the polyfill
if (typeof window !== 'undefined') {
  window.fetch = void 0;
  require('whatwg-fetch');
}
