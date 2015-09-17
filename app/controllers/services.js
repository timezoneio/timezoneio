var aws = require('aws-sdk');

// TODO - Enure these are on the server!
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var services = module.exports = {};

services.signS3 = function(req, res) {
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });

  var s3 = new aws.S3();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: req.query.file_name,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if (err) return res.status(500).send({ message: 'Could not sign url' });

    var returnData = {
      signedRequest: data,
      url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name
    };
    res.json(returnData);
  });


};
