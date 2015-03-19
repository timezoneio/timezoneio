// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host     : '192.168.99.100',
      database: 'timezoneio',
      user:     'admin',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }

};
