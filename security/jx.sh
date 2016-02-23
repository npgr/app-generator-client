#!/bin/sh

rm key_server.exe 
rm deploy/*

cp key_server.js deploy/

cd deploy/

../../jx package key_server.js "key_server" -native

mv key_server.exe ../key_server.exe