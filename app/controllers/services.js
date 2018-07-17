var aws = require('aws-sdk');
const ENV = require('../../env.js');

var AWS_ACCESS_KEY = ENV.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = ENV.AWS_SECRET_KEY;
var S3_BUCKET = ENV.S3_BUCKET;

var services = module.exports = {};

services.signS3 = function(req, res) {
  if (!req.user) {
    return res.status(500).send({ message: 'Could not sign url' })
  }

  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });

  const s3 = new aws.S3();
  const params = {
    Bucket: S3_BUCKET,
    Conditions: [
      ['starts-with', '$key', `avatar/${req.user._id}`],
      ['starts-with', '$Content-Type', req.query.file_type],
      { acl: 'public-read' },
    ],
    Key: req.query.file_name,
    Expires: 300,
  }

  s3.createPresignedPost(params, (err, data) => {
    if (err)
      return res.status(500).send({ message: 'Could not sign url' })

    const fields = Object.assign({}, data.fields, {
      Key: req.query.file_name,
      'Content-type': req.query.file_type,
      acl: 'public-read',
    })
    const returnData = {
      fields,
      postURL: 'https://' + S3_BUCKET + '.s3.amazonaws.com/',
      fileURL: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name,
    };
    res.json(returnData);
  })
};
