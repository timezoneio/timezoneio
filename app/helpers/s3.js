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
          uploadFileToS3(file, response.postURL, response.fields, response.fileURL)
            .then(resolve);
        } else{
          reject('Could not get signed url');
        }
      }
    };
    xhr.send();
  });
};

var uploadFileToS3 = function(file, postURL, fields, fileURL) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postURL);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(fileURL);
      } else {
        reject('Failed to upload, bad response');
      }
    };
    xhr.onerror = function() {
      reject('Failed to upload!');
    };

    var formData = new FormData()
    for (var k in fields) {
      formData.append(k, fields[k]);
    }
    formData.append('file', file)
    xhr.send(formData)
  });
};

// Main export
s3.uploadFile = getSignedRequest;
