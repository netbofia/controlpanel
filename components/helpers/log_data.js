var fs = require('fs');

function writeLog(hostResponse){
	let logInfo = typeof hostResponse.response == "object" ? hostResponse.response.state : hostResponse.code
	let code = hostResponse.code
	let host = hostResponse.host
	let hostFileName = hostResponse.hostFileName
	var iso = new Date()
	var now = Date.now()
	
	let output=iso+"\t"+now+"\t"+host+"\t"+logInfo
	fs.appendFile(__dirname+'/../hosts/'+hostFileName+'.log', output+"\n", function (err) {
	  if (err) throw err;
	  console.log('Saved!: '+output);
	});
}

module.exports={
	writeLog:writeLog
}