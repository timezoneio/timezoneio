'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (t) {
    t.increments();
    t.string('email');
    t.string('password');
    t.string('username');
    t.string('first_name');
    t.string('last_name');
    t.string('avatar');
    t.string('location');
    t.string('tz');
    t.string('tz_offset');
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
