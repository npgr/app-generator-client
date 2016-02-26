#!/bin/sh

rm -r deploy/*

cp key_server.js deploy/
mkdir deploy/node_modules/
cp -r node_modules/sntp deploy/node_modules/sntp

cd deploy/

../../jx package key_server.js "key_server" -native

rm key_server.jxp
rm key_server.js
rm -r node_modules

mkdir license
cp ../license/key license/key

# MOVE Deploy Objects to server 

#cp key ../../../server/license/key  #not tested

cp key_server.exe ../../../server/api/services/service1.exe