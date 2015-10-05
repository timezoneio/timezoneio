// NOTE - must require fetch polyfill in app script
if (typeof Promise === 'undefined') require('es6-promise').polyfill();
var qs = require('querystring');

// we rely on global csrf token for now, grab first so it can't be modified
var CSRF = typeof window !== 'undefined' && window.appData.csrf_token;

// TOOD - Need promise polyfill
var status = function(res) {
  if (res.status >= 200 && res.status < 300) {
    return Promise.resolve(res);
  } else {
    return new Promise(function(resolve, reject) {
      res.json().then(reject, reject);
    });
  }
};

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

  if (method === 'GET')
    return { credentials: 'include' };

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
    return fetch('/api' + appendQueryString(url, data), getOptions('GET'))
      .then(status)
      .then(json);
  },

  post: function(url, data) {
    return fetch('/api' + url, getOptions('POST', data))
      .then(status)
      .then(json);
  },

  put: function(url, data) {
    return fetch('/api' + url, getOptions('PUT', data))
      .then(status)
      .then(json);
  },

  delete: function(url, data) {
    return fetch('/api' + url, getOptions('DELETE', data))
      .then(status)
      .then(json);
  }

};
