# Deploy

Deploying changes to the code requires access to the Heroku production app
as well as AWS credentials to upload static assets.

## Setup Heroku

Install the [Heroku cli](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).

```
curl https://cli-assets.heroku.com/install.sh | sh
```

Login to Heroku with `heroku login` then add the Heroku remote for production:

```
heroku git:remote -a timezoneio
```


## Uploading static assets

Prior to deploy you'll need to upload all the js and css bundles as well as
images to the CDN. First create a file called `aws.json` with valid AWS
credentials in the following format:

```json
{
  "params": { "Bucket": "timezoneio" },
  "accessKeyId": "AKIA...",
  "secretAccessKey": "<your secret key>"
}
```

To upload the static assets run `npm run predeploy`. After this, the
`rev-manifest.json` file will be updated with any new file versions. You
should commit this change before pushing to Github and Heroku.

## Deploying to production

Now with Heroku setup and your new js and css bundles uploaded to the CDN,
we can deploy the code changes which have been merged into master:

```
git push heroku master
```
