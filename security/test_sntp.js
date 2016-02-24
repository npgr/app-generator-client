
 
// Request server time 
function prueba() {	

	var Sntp = require('sntp');
 
	// All options are optional 
	var options = {
		//host: 'nist1-sj.ustiming.org',  // Defaults to pool.ntp.org 
		//port: 123,                      // Defaults to 123 (NTP) 
		//resolveReference: true,         // Default to false (not resolving) 
		timeout: 2000                   // Defaults to zero (no timeout) 
	};
	
	var promise = new Promise();
	
	Sntp.time(options, function (err, time) {
 
		if (err) {
			//console.log('Failed: ' + err.message);
			//process.exit(1);
			promise.reject()
		}
 
		//console.log('object time: ', time)
		//console.log('Local clock is off by: ' + time.t + ' milliseconds');

		/*var date = new Date(time.referenceTimestamp)
		console.log('referenceTimestamp: ', date)
		var date2 = new Date(time.originateTimestamp)
		console.log('originateTimestamp: ', date2)*/
		var date3 = new Date(time.receiveTimestamp)   /** Time to be Used **/
		promise.resolve(date3)
		//console.log('receiveTimestamp: ', date3)  
		/*var date4 = new Date(time.transmitTimestamp)
		console.log('transmitTimestamp: ', date4)*/
	})

	return promise
}

var promise1 = prueba()
promise1.then(function(result) {
	console.log('fechaaa: ', result)
})



