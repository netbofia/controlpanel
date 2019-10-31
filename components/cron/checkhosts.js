#!/usr/bin/env node

//Cron Job Script to check if servers are up.
var ghp=require('./../helpers/get_host_params')
const { writeLog }=require('./../helpers/log_data')
const expectedResponse=require('./../../config.js').expectedResponse
const STATE_MIN = require('./../../config.js').state_min

var parameters=ghp.getHostParameters()
ghp.getAllHostResponses(parameters,callback).then(function(values){
	//Stuffing the fileNames in the same order as the params array
	for (i in values){
		try{
			if(values[i].status == "fulfilled"){
				let hostResponse;
				hostResponse=ghp.parseResponse(values[i].value)
				parameters.forEach(function(param){
					if(param.host == hostResponse.host) hostResponse.hostFileName=param.hostFileName
				})
				let response = hostResponse.response
				if( typeof response == "object" ){
					parseInt(response.state) > STATE_MIN ? null : ghp.notifyFailure(hostResponse)
					callback(hostResponse)
				}else{
					callback(hostResponse)
				}
			}else{
				failure(values[i].reason,callback)
			}
		}catch(err){
			console.log(err)
		}
	}
}).catch(function(err){
	//wasn't tested is this still used?
	failure(err,callback)
})



function callback(hostResponse){
	let response = hostResponse.response
	if (typeof response == "object" ){
		response.state > STATE_MIN ? writeLog(hostResponse,parseResponse=true) : writeLog(hostResponse)
	}else{
		//Not implemented 
		response==expectedResponse ? writeLog(hostResponse) : writeLog(hostResponse)
	}
}


function failure(err,callback){
	let hostResponse=ghp.parseResponse(err)	
	parameters.forEach(function(param){
		if(param.host == hostResponse.host) hostResponse.hostFileName=param.hostFileName
	})
	callback(hostResponse)
	//The following logic should be done by the callback based on the response
	ghp.notifyFailure(hostResponse)
	

}