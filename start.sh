#!/bin/sh
trap "curl --max-time 2 -s -f -XPOST http://127.0.0.1:15020/quitquitquit" EXIT
while ! curl -s -f http://127.0.0.1:15020/healthz/ready; do sleep 1; done
echo "Ready!"
node index.js