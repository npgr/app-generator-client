rm -r deploy/node_modules

cp node_modules deploy/node_modules

#Remove unnecesary files & folders 

find deploy/node_modules -iname 'examples' -exec rm -r {} \;

find deploy/node_modules -iname 'docs' -exec rm -r {} \;

find deploy/node_modules -iname 'test' -exec rm -r {} \;

find deploy/node_modules -iname '*.md' -exec rm {} \;

find deploy/node_modules -iname 'License*' -exec rm {} \;

find deploy/node_modules -iname 'changelog' -exec rm {} \;

find deploy/node_modules -iname 'readme*' -exec rm {} \;

# Compact all .js files
# node_modules -> it takes about 1 hour
find deploy/node_modules -iname '*.js' -exec uglifyjs --compress --mangle -o {} -- {} \;

# Obfuscate *.html in pages/ folder from pagen_orig

# Move files to deploy folder

cp app.js deploy/       
cp app_util.js deploy/  
cp zip_util.js deploy/  
cp package.json deploy/
cp -r pages deploy/

# Obfuscate app.js, app_util.js & zip_util.js in deploy folder

# test npm run on deploy folder  / (OPTIONAL)  needs copy config.json

cd deploy

# build exec

npm run build

npm run asar

cd App-win32-x64

rm -r resources/app

cp ../../config.json config.json
mkdir apps
cp -r ../../generator deploy/generator
mkdir templates
cp ../../tempates/*zip templates/

App.exe  # test: navigate + create app + start app + generate model + generate function 
