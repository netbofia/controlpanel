#!/usr/bin/env node

//Cron Job Script to check if servers are up.
var glob = require('glob');
var ghp=require('./../helpers/get_host_params')
var writeLog=require('./../helpers/log_data').writeLog
var expectedResponse="yes"; //on server

//Possible problem in path
var hosts=glob.sync(__dirname+'/../hosts/*.json')
var parameters=ghp.getHostParameters(hosts)
ghp.getAllHostResponses(parameters,callback)

function callback(hostResponse){
	let response = hostResponse.response
	let code = hostResponse.code
	let host = hostResponse.host
	response==expectedResponse ? writeLog(host,code) : writeLog(host,code)
}