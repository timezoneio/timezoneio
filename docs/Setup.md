# Setup

This is a guide on how to get Timezone.io up and running for development.

## Dependencies

This project requires you have a few things installed and running:

- [Node.js](https://nodejs.org/en/) 4.x or 6.x - our runtime (I'd recommend using
[nvm](https://github.com/creationix/nvm)), 4.2.1 currently in production)
- [npm](https://www.npmjs.com/package/npm) - our most favorite package manager
(comes w/ Node)
- [Docker](https://www.docker.com/products/docker) - How we'll run everything during development

## Steps

This could definitely be scripted up a bit better, but for now. This works ;)

First, copy the [`nodemon.json.example`](https://github.com/timezoneio/timezoneio/blob/master/nodemon.json.example)
file into your own `nodemon.json` file and add your own keys for AWS and Twitter.
> TODO - Add more guidance on how to get your own keys or remove the need for
these at all

Kick everything off using Docker Compose:

```shell
$ docker-compose up -d
```

It will take a little bit to download the node, mongo, and redis images, but when it's complete,
the app should be available at http://localhost:80. Note - it takes a little bit for the server
to start up initially.

## Initial data

The first time you run Timezone.io, you'll need some initial data in the DB.

> TODO - grab a dump of the data

