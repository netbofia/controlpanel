#!/usr/bin/env node

//Cron Job Script to check if servers are up.
var ghp=require('./../helpers/get_host_params')
const { writeLog }=require('./../helpers/log_data')
var expectedResponse=require('./../../config.js').expectedResponse


var parameters=ghp.getHostParameters()

ghp.getAllHostResponses(parameters,callback).then(function(values){
	for (i in values){
		let hostResponse=ghp.parseResponse(values[i])
		callback(hostResponse)
	}
}).catch(function(err){
	let hostResponse=ghp.parseResponse(err,true)
	callback(hostResponse)
	//The following logic should be done by the callback based on the response
	ghp.notifyFailure(hostResponse)
	
	parameters=ghp.removeServerFromList(parameters,hostResponse.host)
	ghp.getAllHostResponses(parameters,callback)
	//########end callback logic############
})



function callback(hostResponse){
	let response = hostResponse.response
	let code = hostResponse.code
	let host = hostResponse.host
	response==expectedResponse ? writeLog(host,code) : writeLog(host,code)
}