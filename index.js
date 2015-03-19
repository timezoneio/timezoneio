require('./lib/server.js');

var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '192.168.99.100', //process.env.DB_PORT_5432_TCP_ADDR,
    user     : 'admin', //process.env.DB_ENV_POSTGRES_USER,
    password : 'password', //process.env.DB_ENV_POSTGRES_PASSWORD,
    database : 'timezoneio',
    charset  : 'utf8'
  },
  migrations: {
    tableName: 'migrations'
  }
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users'
});
