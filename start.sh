#!/bin/sh
# wait for istio network setup to be complete before starting
# https://github.com/istio/istio/issues/11659#issuecomment-544432185
trap "curl --max-time 2 -s -f -XPOST http://127.0.0.1:15020/quitquitquit" EXIT
while ! curl -s -f http://127.0.0.1:15020/healthz/ready; do echo "waiting for istio..." && sleep 1; done
echo "Ready!"
node index.js