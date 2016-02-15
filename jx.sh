rm generate.exe

mv data.json ../data.json

../jx package create.js "generate" -native

rm generate.jxp

mv ../data.json data.json