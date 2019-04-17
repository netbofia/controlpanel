#!/usr/bin/env node

//Cron Job Script to check if servers are up.
var ghp=require('./../helpers/get_host_params')
const { writeLog }=require('./../helpers/log_data')
var expectedResponse="yes"; //on server


var parameters=ghp.getHostParameters()
ghp.getAllHostResponses(parameters,callback)


function callback(hostResponse){
	let response = hostResponse.response
	let code = hostResponse.code
	let host = hostResponse.host
	response==expectedResponse ? writeLog(host,code) : writeLog(host,code)
}