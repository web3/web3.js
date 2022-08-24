#!/usr/bin/env bash

ORIGARGS=("$@")

helpFunction() {
	echo "Usage: $0 [start|stop|publish|startAndPublish] [background]"
	exit 1 # Exit script after printing help
}

start() {
	. scripts/env.sh
	if [[ ${ORIGARGS[1]} == "background" ]]; then
        startBackground
	else
		echo "Starting verdaccio..."
        docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
	fi
}

startBackground() {
    echo "Starting verdaccio in background..."
    docker run -d --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
}

stop() {
	echo "Stopping verdaccio ..."
    docker ps -q --filter ancestor="verdaccio/verdaccio" | xargs -r docker stop
}

createVerdaccioNPMUser() {
    curl -XPUT \
        -H "Content-type: application/json" \
        -d '{ "name": "test", "password": "test" }' \
        'http://localhost:4873/-/user/org.couchdb.user:test'
}

loginNPMUser() {
    npm-auth-to-token \
        -u test \
        -p test \
        -e test@test.com \
        -r http://localhost:4873
}

lernaUpdatePackageVersions() {
    lerna version 5.0.0 \
        --ignore-scripts \
        --no-push \
        --no-private \
        --no-git-tag-version \
        --yes
}

lernaBuildAndCommit() {
    yarn build

    git add .
    git commit -m "Comitting for black box publish"
}

lernaPublish() {
    lerna publish from-package \
        --dist-tag blackbox \
        --no-git-tag-version \
        --no-push \
        --registry http://localhost:4873 \
        --ignore-scripts \
        --yes
}

publish() {
    echo "Publishing to verdaccio ..."

    npx wait-port -t 60000 4873

    createVerdaccioNPMUser
    loginNPMUser
    lernaUpdatePackageVersions
    lernaBuildAndCommit
    lernaPublish
}

startBackgroundAndPublish() {
    startBackground && publish
}

case $1 in
start) start ;;
stop) stop ;;
publish) publish ;;
startBackgroundAndPublish) startBackgroundAndPublish ;;
createVerdaccioNPMUser) createVerdaccioNPMUser ;;
loginNPMUser) loginNPMUser ;;
lernaUpdatePackageVersions) lernaUpdatePackageVersions ;;
lernaBuildAndCommit) lernaBuildAndCommit ;;
lernaPublish) lernaPublish ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
