#!/bin/sh
jsonlint people.json -q
LINT_RESULT=$?
if [ $LINT_RESULT -ne 0 ] ; then
    exit 1
fi
rsync -avz ./people.json root@timezone.io:/root/timezoneio/people.json
ssh root@timezone.io "cd /root/timezoneio && ./deploy.sh"