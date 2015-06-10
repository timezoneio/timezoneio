var qs = require('querystring');

// we rely on global csrf token for now, grab first so it can't be modified
var CSRF = typeof window !== 'undefined' && window.appData.csrf_token;

var json = function(res) {
  return res.json();
};

var getData = function(data) {
  if (!data) data = {};
  data._csrf = CSRF;
  return data;
};

var appendQueryString = function(url, data) {
  return url + '?' + qs.stringify(data);
};

var getOptions = function(method, data) {
  return {
    method: method || 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(getData(data))
  };
};

var api = module.exports = {

  get: function(url, data) {
    return fetch(appendQueryString(url, data)).then(json);
  },

  post: function(url, data) {
    return fetch(url, getOptions('POST', data)).then(json);
  },

  put: function(url, data) {
    return fetch(url, getOptions('PUT', data)).then(json);
  }

};
