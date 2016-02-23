rm ../generator/*

cp -r templates/ ../generator/
cp -r node_modules/ ../generator/

cp create.js ../generator/
cp generate.js ../generator/

cd ../generator

../jx package create.js "generate" -native

rm generate.jxp
rm *.js
rm -r templates/
rm -r node_modules/


cp ../generator_orig/data.json data.json
cp ../generator_orig/key key