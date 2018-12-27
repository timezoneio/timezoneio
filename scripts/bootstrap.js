#!/usr/local/bin/node
const mongoose = require('mongoose')
const User = require('../app/models/user')

const MONGO_URL = 'mongodb://db:27017/timezone'

mongoose.connect(MONGO_URL, { useNewUrlParser: true })

mongoose.connection.once('open', () => {
  console.log('Connected to database')

  const admin = new User({
    username: 'admin',
    name: 'Dan Admin',
    email: 'admin@timezone.io',
    password: 'password',
    location: 'Brooklyn',
    tz: 'America/New_York',
  })
  admin.save().then(() => {
    console.log('Created admin@timezone.io user w/ passsword:"password"')
    mongoose.connection.close()
    console.log('Database connection closed')
  })
})
