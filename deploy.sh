#!/bin/sh
git checkout master && git pull
npm install --production
pm2 restart web
