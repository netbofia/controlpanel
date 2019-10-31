var axios = require('axios');
var glob = require('glob');
var path = require('path')

function getHostFiles(){
	var hostsFiles=glob.sync(__dirname+'/../hosts/*.json')
	return hostsFiles
}

//Loads host parameter files
function getHostParameters(){
	let hostsFiles=getHostFiles()
	var result=[]
	hostsFiles.forEach(function(hostFile){
		hostFileName=path.basename(hostFile, ".json")
		result.push(Object.assign(require(hostFile),{hostFileName:hostFileName}))
	})
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
	console.log()
	return Promise.allSettled(hostResponses)
}

function parseResponse(res){
	let response; //possible error???? initiation only!!! 
	if(res instanceof Error){ //Accepts anything as an error
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
	let response= typeof hr.response == "object" ? `| ${hr.response.state}%` : null
	const bot=telegram.bot(false)
	msg=`${hr.host} | Problem detected: ${hr.code} ${response}`
	telegram.sendMSG(bot,msg)
}


module.exports={
//	getHosts:getHosts,
	getHostParameters:getHostParameters,
	getAllHostResponses:getAllHostResponses,
	parseResponse:parseResponse,
	notifyFailure:notifyFailure,
	getSpecificHostParameters:getSpecificHostParameters,
	getHostResponse:getHostResponse,
	hostsList:hostsList,
	removeServerFromList:removeServerFromList,
}