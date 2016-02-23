#!/bin/sh

rm deploy/*

cp key_server.js deploy/

cd deploy/

../../jx package key_server.js "key_server" -native

rm key_server.jxp
rm key_server.js

cp ../key key