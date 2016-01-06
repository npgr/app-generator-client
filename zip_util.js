var app = process.argv[2]

// check for App
console.log('Creating App: '+app)
console.log('Creating App: '+app)
console.log('')
console.log('It Takes Between 3 and 4 Minutes. Depending on the speed of this PC')
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
	'.tmp/',
	'api/',
	'assets/',
	'config/',
	'deploy/',
	'logs/',
	'tasks/',
	'views/',
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
	'node_modules/sails/',
	'node_modules/sails-disk/',
	'node_modules/sails-postgresql/',
	'node_modules/string-template/',
	'node_modules/winston/'
] 

var i=1
entries.forEach(function(entry) {
	console.log('Extracting ('+i+'/'+entries.length+'): '+entry)
	zip.extractEntryTo(entry, "./apps/"+app, /*maintain path*/true, /*overwrite*/false);
	i++
})
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