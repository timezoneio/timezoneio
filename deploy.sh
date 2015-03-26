#!/bin/sh
git checkout master && git pull
npm install
pm2 restart web