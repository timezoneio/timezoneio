# Setup

This is a guide on how to get Timezone.io up and running for development.

## Dependencies

This project requires you have a few things installed and running:

- [Node.js](https://nodejs.org/en/) 5.x - our runtime (I'd recommend using
[nvm](https://github.com/creationix/nvm)))
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

Next we run our main node app using Nodemon which will automatically restart the
app on file change.

```shell
$ nodemon
```

Lastly, we run the [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
which will sit in front of our node app, serve our JavaScript bundles and
automatically compile them on file changes. We run this using Gulp.

```shell
$ gulp webpack-dev-server
```

**BOOM!** Now go head over to http://localhost:8888 and you should see the homepage

## Initial data

The first time you run Timezone.io, you'll need some initial data in the DB.

> TODO - grab a dump of the data

