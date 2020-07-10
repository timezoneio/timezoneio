var fs = require('fs');
var path = require('path');
var Mustache = require('mustache');
const ENV = require('../../env.js');
var sendgrid  = require('sendgrid')(ENV.SENDGRID_KEY);

const FROM_EMAIL = 'no-reply@mail.timezone.io';
const FROM_NAME = 'Timezone.io';

/*
  createMessage('Welcome to Timezone.io!', '<p>My message</p>', 'test@yo.com', {
    category: 'signup'
  });
*/
var createMessage = function(subject, html, to, options) {
  return {
    to: to,
    from: FROM_EMAIL,
    fromname: FROM_NAME,
    subject: subject,
    html: html,
    smtpapi: new sendgrid.smtpapi({
      category: options.category
    })
  };
};


var EMAIL_TYPES = {
  'welcome': {
    subject: 'Welcome to Timezone.io!',
    category: 'signup'
  },
  'invite': {
    // params: inviteUrl, adminName, teamName
    subject: function(p) {
      return `${p.adminName} wants you to join the ${p.teamName} team on Timezone.io!`;
    },
    category: 'invite'
  },
  'passwordReset': {
    subject: 'Reset your Timezone.io password',
    category: 'passwordReset'
  },
  accountDeleteAdminNotification: {
    subject: function (p) {
      return `User Account Deleted: ${p.userEmail}`
    },
    category: 'accountDeleteAdminNotification'
  }
};

var transport = {};

// We use Sendgrid for production then nodemailer during dev
if (process.env.NODE_ENV === 'production') {

  transport.send = function(message) {
    return new Promise(function(resolve, reject) {
      sendgrid.send(message, function(err, json) {
        if (err) return reject(err.message);
        resolve(json);
      });
    });
  };

} else {

  // Use with MailDev
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    port: 1025,
    ignoreTLS: true
  });

  transport.send = function(message) {
    return new Promise(function(resolve, reject) {
      transporter.sendMail({
          from: {
            name: message.fromname,
            address: message.from
          },
          to: message.to,
          subject: message.subject,
          html: message.html,
          replyTo: message.replyto
      }, function(err, info) {
        if (err) {
          console.log(err);
          return reject(err.message);
        }
        resolve(info);
      });
    });
  };
}


module.exports = function sendEmail(type, to, params) {
  return new Promise(function(resolve, reject) {

    if (!(type in EMAIL_TYPES))
      return reject('Email type not valid');

    var template;
    try {
      template = fs.readFileSync(path.join(__dirname, '../templates/email/' + type + '.hbs'), 'utf8');
    } catch(err) {
      return reject('Email template not found');
    }

    // Add basic style - double quotes to not break style tags
    params.style = {
      body: [
        "font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;",
        "font-size: 13px;",
        "line-height: 1.5;",
        "max-width: 600px;"
      ].join('')
    };

    var html = Mustache.render(template, params || {});
    var subject = EMAIL_TYPES[type].subject;
    subject = typeof subject === 'function' ?
              subject(params) :
              subject;
    var message = createMessage(subject, html, to, {
      category: EMAIL_TYPES[type].category
    });

    transport
      .send(message)
      .then(resolve, reject);
  });
};
