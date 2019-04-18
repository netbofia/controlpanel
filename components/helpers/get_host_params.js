var axios = require('axios');
var glob = require('glob');

function getHosts(){
	var hosts=glob.sync(__dirname+'/../hosts/*.json')
	return hosts
}

//Loads host parameter files
function getHostParameters(){
	let hosts=getHosts()
	var result=[]
	for (i in hosts){
		result.push(require(hosts[i]))
	}
	return result
}

function getSpecificHostParameters(host){
	let params=getHostParameters()
	let hostParams={}
	params.forEach(function(param){
		if(param.host==host){
			hostParams=param
		}
	})
	return hostParams
}

function getHostResponse(p){  
	//@returns Promise
	return axios(p.scheme+"://"+p.host+"/"+p.path)
}

function getAllHostResponses(parameters,callback){
	//@return Array of promises
	var hostResponses=[]
	for (i in parameters){
		let param=parameters[i]
		hostResponses.push(getHostResponse(param))
	}
	return Promise.all(hostResponses)
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


function hostsList(){
	var hostParams=getHostParameters()
	var hosts=[]
	hostParams.forEach(function(host){
		hosts.push(host.host)
	})
	return hosts
}

function removeServerFromList(parameters,host){
	for (i in parameters){
		if (parameters[i].host==host)
			parameters.splice(i,1)
	}
	return parameters
}



/////////////// telegram functions

function notifyFailure(hr){
	let telegram=require('./telegram')
	const bot=telegram.bot(false)
	msg=hr.host+" | Problem detected: "+hr.code
	telegram.sendMSG(bot,msg)
}


module.exports={
	getHosts:getHosts,
	getHostParameters:getHostParameters,
	getAllHostResponses:getAllHostResponses,
	parseResponse:parseResponse,
	notifyFailure:notifyFailure,
	getSpecificHostParameters:getSpecificHostParameters,
	getHostResponse:getHostResponse,
	hostsList:hostsList,
	removeServerFromList:removeServerFromList,
}