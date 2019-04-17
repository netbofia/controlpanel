var axios = require('axios');
var glob = require('glob');

function getHosts(){
	var hosts=glob.sync(__dirname+'/../hosts/*.json')
	return hosts
}

//Loads host parameter files
function getHostParameters(hosts){
	var result=[]
	for (i in hosts){
		result.push(require(hosts[i]))
	}
	return result
}


function getAllHostResponses(parameters,callback){
	var promises=[]
	for (i in parameters){
		let p=parameters[i]
		promises.push(axios(p.scheme+"://"+p.host+"/"+p.path))
	}
	Promise.all(promises).then(function(values){
		for (i in values){
			let hostResponse=parseResponse(values[i])
			callback(hostResponse)
		}
	}).catch(function(err){
		let hostResponse=parseResponse(err,true)
		callback(hostResponse)
		//The following logic should be done by the callback based on the response
		notifyFailure(hostResponse)
		testOtherServers(parameters,hostResponse.host,callback)
		//########end callback logic############
	})
}

function parseResponse(res,err){
	let response; //possible error???? initiation only!!! 
	if(err){ //Accepts anything as an error
		response={
			host:res.request._options.hostname || "UNKNOWN_HOST",
			code:res.code || "UNKNOWN_ERROR",
			response:"err"
		}
	}else{
		response={
			host:res.request.socket._host, 
			response:res.data, 
			code:res.status || "UNKNOWN_ERROR"
		}
	}
	return response
}


function testOtherServers(parameters,host,callback){
		for (i in parameters){
			if (parameters[i].host==host)
				parameters.splice(i,1)
		}
		getAllHostResponses(parameters,callback)
}

function notifyFailure(hr){
	let telegram=require('./telegram')
	const bot=telegram.bot(false)
	msg=hr.host+" | Problem detected: "+hr.code
	telegram.sendMSG(bot,msg)
}


module.exports={
	getHosts:getHosts,
	getHostParameters:getHostParameters,
	getAllHostResponses:getAllHostResponses
}