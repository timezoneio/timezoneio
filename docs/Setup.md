# Setup

This is a guide on how to get Timezone.io up and running for development.

## Dependencies

This project requires you have a few things installed and running:

- [Node.js](https://nodejs.org/en/) 4.x-5.x - our runtime (I'd recommend using
[nvm](https://github.com/creationix/nvm)), 4.2.1 currently in production)
- [npm](https://www.npmjs.com/package/npm) - our most favorite package manager
(comes w/ Node)
- [MongoDB](https://www.mongodb.org/) 2.6, 3.2+ - our database
- [Redis](http://redis.io/) 3.x - our in memory db
- [Gulp](https://www.npmjs.com/package/gulp) 3.9 - our build system
- [Nodemon](https://www.npmjs.com/package/nodemon) 1.x - for running node in development

You'll also need some of your own keys for various services we use:

> TODO - Try to remove these deps if we can for development!

- AWS
- Twitter
- Mandrill

## Steps

This could definitely be scripted up a bit better, but for now. This works ;)

First we ensure Mongo and Redis are running w/ default settings.

```shell
$ mongod
# in another terminal window
$ redis-server
```

Next we run the main app in watch mode. This one command runs `nodemon` and
[`webpack-dev-server`](https://webpack.github.io/docs/webpack-dev-server.html).
Nodemon will automatically restart our server on file changes and webpack-dev-server
will automatically compile our bundled assets for the browser on file change.

```shell
$ npm run watch
```

**BOOM!** Now go head over to http://localhost:8888 and you should see the homepage

## Initial data

The first time you run Timezone.io, you'll need some initial data in the DB.

> TODO - grab a dump of the data

