#!/usr/bin/env bash

ORIGARGS=("$@")

helpFunction() {
	echo "Usage: $0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}

start() {
	. scripts/env.sh
	if [ -z "${ORIGARGS[1]}" ]; then
		echo "Starting verdaccio..."
        docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
	else
		echo "Starting verdaccio..."
	fi
}

stop() {
	echo "Stopping verdaccio ..."
    docker ps -q --filter ancestor="verdaccio/verdaccio" | xargs -r docker stop
}

publish() {
    echo "Publishing to verdaccio ..."

    npx wait-port 4873

    # `npm add user`
    curl -XPUT \
        -H "Content-type: application/json" \
        -d '{ "name": "test", "password": "test" }' \
        'http://localhost:4873/-/user/org.couchdb.user:test'

    # `npm login`
    npm-auth-to-token \
        -u test \
        -p test \
        -e test@test.com \
        -r http://localhost:4873

    #
    # lerna version 5.0.0 \
    #     --ignore-scripts \
    #     --no-push \
    #     --no-private \
    #     --no-git-tag-version \
    #     --yes

    # yarn build

    git add .
    git commit -m "Comitting for black box publish"

    # Lerna publish to alpha tag
    lerna publish from-package \
        --no-git-tag-version \
        --no-push \
        --registry http://localhost:4873 \
        --ignore-scripts
}

case $1 in
start) start ;;
stop) stop ;;
publish) publish ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
