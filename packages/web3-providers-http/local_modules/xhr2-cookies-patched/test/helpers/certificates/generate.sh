#!/usr/bin/env bash

rm localhost.key.pem localhost.cert.pem
openssl req -nodes -newkey rsa:2048 -keyout localhost.key2.pem -x509 -days 1024 -out localhost.cert.pem
openssl rsa -in localhost.key2.pem -out localhost.key.pem
