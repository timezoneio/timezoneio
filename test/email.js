var sendEmail = require('../app/email/send');

const TO = 'timezone.io.app+test@gmail.com';

console.info('Testing send email');

// sendEmail('welcome', TO)
sendEmail('invite', TO, { adminName: 'Bohdi', teamName: 'Ex-presidents', inviteUrl: 'test' })
  .then(function(result) {
    console.info('Send test succeded: ', result);
  }, function(err) {
    console.error('Send test failed: %s', err);
  });
