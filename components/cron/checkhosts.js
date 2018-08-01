#!/usr/bin/env node

//Cron Job Script to check if servers are up.


var fs = require('fs');
var glob = require('glob');
var axios = require('axios');



//Possible problem in path
var hosts=glob.sync(__dirname+'/../hosts/*.json')
var parameters=getParameters(hosts)
getAllResponses(parameters)



function getParameters(hosts){
	var result=[]
	for (i in hosts){
		result.push(require(hosts[i]))
	}
	return result
}

function getAllResponses(parameters){
	console.log(parameters)
	var promises=[]
	for (i in parameters){
		let param=parameters[i]
		let host=param.host;
		let path=param.path;
		let scheme=param.scheme;
		let port=param.port;
		promises.push(axios(scheme+"://"+host+"/"+path))
	}
	Promise.all(promises).then(function(values){
		for (i in values){
			let host=values[i].request.socket.servername 
			let response=values[i].data
			let code=values[i].status
			response=="yes" ? writeLog(host,code) : writeLog(host,"UNKNOWN_ERROR")
		}

	}).catch(function(err){
		let host=err.request._options.hostname
		let response=err.code
		notifyFailure(host,response)
		writeLog(host,response)
		testOtherServers(parameters,host)
	})
}

function writeLog(host,res){
	var iso = new Date()
	var now = Date.now()
	
	let output=iso+"\t"+now+"\t"+host+"\t"+res
	fs.appendFile(__dirname+'/../hosts/'+host+'.log', output+"\n", function (err) {
	  if (err) throw err;
	  console.log('Saved!: '+output);
	});
}

function testOtherServers(parameters,host){
		for (i in parameters){
			if (parameters[i].host==host)
				parameters.splice(i,1)
		}
		getAllResponses(parameters)
}

function nofityFailure(host,res){
	let telegram=require('./components/cron/sendtelegram')
	msg=host+"| Problem detected: "+res
	telegram.sendMSG(msg)
}