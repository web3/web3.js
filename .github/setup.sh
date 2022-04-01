#!/usr/bin/bash

# Quit on error.
set -e
# Treat undefined variables as errors.
set -u


function main {
    local uwsgi_uid="${1:-}"
    local uwsgi_gid="${2:-}"

    # Change the uid
    if [[ -n "${uwsgi_uid:-}" ]]; then
        usermod -u "${uwsgi_uid}" uwsgi
    fi
    # Change the gid
    if [[ -n "${uwsgi_gid:-}" ]]; then
        groupmod -g "${uwsgi_gid}" uwsgi
    fi

    # Setup permissions on the run directory where the sockets will be
    # created, so we are sure the app will have the rights to create them.

    # Make sure the folder exists.
    mkdir /var/run/uwsgi
    # Set owner.
    chown root:uwsgi /var/run/uwsgi
    # Set permissions.
    chmod u=rwX,g=rwX,o=--- /var/run/uwsgi
}


main "$@"