var app = process.argv[2]
var path = process.argv[3]

// check for App
console.log('Path: '+path+'\\'+app)
console.log('')

var AdmZip = require('adm-zip')

//var zip = new AdmZip();
//zip.addLocalFolder('./templates/crud5')
//zip.writeZip('./templates/crud5.zip')
console.log('Getting Objects to Decompress')
console.log('')

var zip = new AdmZip("./templates/webserver.zip");

//var zipEntries = zip.getEntries(); // an array of ZipEntry records 

var entries = [
	'.gitignore',
	'.sailsrc',
	'app.js',
	'Gruntfile.js',
	'package.json',
	'README.md',
	'start.sh',
	'stop.sh',
	'.tmp/',
	'api/',
	'assets/',
	'config/',
	'deploy/',
	'logs/',
	'tasks/',
	'views/'
] 

var i=1
entries.forEach(function(entry) {
	console.log('Extracting ('+i+'/17): '+entry)
	zip.extractEntryTo(entry, path+'\\'+app, /*maintain path*/true, /*overwrite*/false);
	i++
})

delete zip

// Extracting node_modules

var zip2 = new AdmZip("./templates/node_modules.zip");

entries = [ 'node_modules/' ]
//entries = [ ]
/*entries = [
	'node_modules/.bin/',
	'node_modules/bcrypt/',
	'node_modules/data2xml/',
	'node_modules/ejs/',
	'node_modules/grunt/',
	'node_modules/grunt-contrib-clean/',
	'node_modules/grunt-contrib-coffee/',
	'node_modules/grunt-contrib-concat/',
	'node_modules/grunt-contrib-copy/',
	'node_modules/grunt-contrib-cssmin/',
	'node_modules/grunt-contrib-jst/',
	'node_modules/grunt-contrib-less/',
	'node_modules/grunt-contrib-uglify/',
	'node_modules/grunt-contrib-watch/',
	'node_modules/grunt-sails-linker/',
	'node_modules/grunt-sync/',
	'node_modules/include-all/',
	'node_modules/jsonic/',
	'node_modules/lodash/',
	'node_modules/nodemon/',
	'node_modules/rc/',
//	'node_modules/sails/',
	'node_modules/sails-disk/',
	'node_modules/sails-postgresql/',
	'node_modules/string-template/',
	'node_modules/winston/'
] */

entries.forEach(function(entry) {
	console.log('Extracting ('+i+'/17): '+entry + '  .It can take about 3 minutes (Running...)')
	zip2.extractEntryTo(entry, path+'\\'+app, /*maintain path*/true, /*overwrite*/false);
	i++
})

delete zip2

// Extracting sails/

/*var zip3 = new AdmZip("./templates/sails.zip");

console.log('Extracting ('+i+'/40): node_modules/sails')
zip3.extractEntryTo('node_modules/sails/', path+'\\'+app, true, false);

delete zip3 */

console.log('')
console.log('Finished')

/*process.exit()

var i = 0

zipEntries.forEach(function(zipEntry) {

	console.log('EntryName: '+zipEntry.entryName)
	
	//zip.extractEntryTo(zipEntry.entryName, "./templates/webserver", true, true);
	i++
	if (i == 20) process.exit()
})*/

//zip.extractAllTo(/*target path*/"./templates/prueba2", /*overwrite*/true);