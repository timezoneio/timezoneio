# Database

Install knex globally to handle migrations

    $ npm i -g knex

Make sure your DB is on the latest by running

    $ knex migrate:latest

To make a migration, first have knex create the file, w/ a name

    $ knex migrate:make add_user_avatars

Then in the `migrations` folder, edit the new file to add an up/down migration.
The [Knex#Schema](http://knexjs.org/#Schema) docs are helpful. Example

    exports.up = function(knex, Promise) {
      return knex.schema.createTable('users', function (t) {
        t.increments();
        t.string('email');
        t.string('password');
      });
    };

Run this migration against your db:

    $ knex migrate:latest