var fs = require('fs');
var path = require('path');
var Mustache = require('mustache');
var mandrill = require('mandrill-api/mandrill');

const FROM_EMAIL = 'hi@timezone.io';
const FROM_NAME = 'Dan from Timezone.io';

/*
  createMessage('Welcome to Timezone.io!', '<p>My message</p>', 'test@yo.com', {
    tags: ['signup'],
    campaign: 'sometracking',
    metadata: {
      userId: someUser._id.toString()
    }
  });
*/
var createMessage = function(subject, html, to, options) {
  return {
    html: html,
    subject: subject,
    from_email: FROM_EMAIL,
    from_name: FROM_NAME,
    to: [{
      email: to
      // name: "Recipient Name"
    }],
    headers: {
      'Reply-To': FROM_EMAIL
    },
    // google_analytics_domains: ['timezone.io'],
    // google_analytics_campaign: options.campaign || 'timezone',
    // metadata: options.metadata,
    // tags: options.tags
  };
};


var EMAIL_TYPES = {
  'welcome': {
    subject: 'Welcome to Timezone.io!',
    tags: ['signup']
  },
  'invite': {
    // params: inviteUrl, adminName, teamName
    subject: function(p) {
      return `${p.adminName} wants you to join the ${p.teamName} team on Timezone.io!`;
    },
    tags: ['invite']
  },
  'passwordReset': {
    subject: 'Reset your Timezone.io password',
  }
};

var transport = {};

// We use Mandrill for production then nodemailer during dev
if (process.env.NODE_ENV === 'production') {

  var mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_KEY);

  transport.send = function(message) {
    return new Promise(function(resolve, reject) {
      mandrillClient.messages.send({ message: message }, function(result) {
        // NOTE - May want to reject on mail bouncing
        resolve(result);
      }, function(e) {
        console.info(e);
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        reject(e.message);
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
            name: message.from_name,
            address: message.from_email
          },
          to: message.to[0].email,
          subject: message.subject,
          html: message.html,
          replyTo: message.headers['Reply-To']
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
      tags: EMAIL_TYPES[type].tags
    });

    transport
      .send(message)
      .then(resolve, reject);

    // mandrillClient.messages.send({ message: message }, function(result) {
    //   // NOTE - May want to reject on mail bouncing
    //   resolve(result);
    // }, function(e) {
    //   console.info(e);
    //   // Mandrill returns the error as an object with name and message keys
    //   console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    //   // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    //   reject(e.message);
    // });
  });
};
