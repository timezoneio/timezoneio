#!/bin/sh

read -p "Did you run the gulp predeploy script & commit it (y/n)? " answer
case ${answer:0:1} in
    y|Y )
        echo "Awesome...time to deploy"
        ssh root@timezone.io "cd /root/timezoneio && ./deploy.sh";
    ;;
    * )
        echo "Deploy aborted"
    ;;
esac
