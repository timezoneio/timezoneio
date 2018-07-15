#!/bin/bash

# Copy all environment variables from the source app to the target app

SOURCE="timezoneio"
TARGET="timezoneio-staging"

heroku config -s -a $SOURCE > config.txt
cat config.txt | tr '\n' ' ' | xargs heroku config:set -a $TARGET
rm config.txt
