if (typeof Promise === 'undefined') require('es6-promise').polyfill();

// source: https://devcenter.heroku.com/articles/s3-upload-node

var s3 = module.exports = {};

var getSignedRequest = function(file, filename) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/sign-s3?file_name=' + (filename || file.name) + '&file_type=' + file.type);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          uploadFileToS3(file, response.signedRequest, response.url)
            .then(resolve);
        } else{
          reject('Could not get signed url');
        }
      }
    };
    xhr.send();
  });
};

var uploadFileToS3 = function(file, signedRequest, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(url);
      } else {
        reject('Failed to upload, bad response');
      }
    };
    xhr.onerror = function() {
      reject('Failed to upload!');
    };
    xhr.send(file);
  });
};

// Main export
s3.uploadFile = getSignedRequest;
