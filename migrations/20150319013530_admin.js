'use strict';

exports.up = function(knex, Promise) {
  return knex('users').insert({
    email: 'daniel.j.farrelly@gmail.com',
    password: 'password',
    username: 'dan',
    first_name: 'Dan'
  });
};

exports.down = function(knex, Promise) {
  
};
