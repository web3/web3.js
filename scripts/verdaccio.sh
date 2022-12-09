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
    yarn dlx npm-auth-to-token \
        -u test \
        -p test \
        -e test@test.com \
        -r http://localhost:4873
}

yarnUpdatePackageVersions() {
    yarn workspaces foreach -vp version 5.0.0 -i
}

yarnBuildAndCommit() {
    yarn build

    git add .
    git commit -m "Comitting for black box publish"
}

yarnPublish() {
    echo npmRegistryServer: "http://localhost:4873" >> ./.yarnrc.yml
    yarn workspaces foreachnpm publish \
        --tolerate-republish \
        --tag blackbox \
        --access public \
}

publish() {
    echo "Publishing to verdaccio ..."
    yarn dlx wait-port -t 60000 4873

    createVerdaccioNPMUser
    loginNPMUser
    yarnUpdatePackageVersions
    yarnBuildAndCommit
    yarnPublish
}

startBackgroundAndPublish() {
    corepack enable
    startBackground && publish
}

case $1 in
start) start ;;
stop) stop ;;
publish) publish ;;
startBackgroundAndPublish) startBackgroundAndPublish ;;
createVerdaccioNPMUser) createVerdaccioNPMUser ;;
loginNPMUser) loginNPMUser ;;
yarnUpdatePackageVersions) yarnUpdatePackageVersions ;;
yarnBuildAndCommit) yarnBuildAndCommit ;;
yarnPublish) yarnPublish ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
