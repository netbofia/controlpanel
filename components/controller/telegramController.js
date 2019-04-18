const telegram = require('./../helpers/telegram')
const bot = telegram.bot(polling=true)
const execCommands = require('./../helpers/execCommands')
const ghp=require('./../helpers/get_host_params')

var expectedResponse=require('./../../config.js').expectedResponse
var hosts=ghp.hostsList()
var callback={} //not defined telegram might be remodelled

var retry=0

telegram.listen(bot,hosts,callback).then(function(res){
	if(res.action){
		checkHost(res.server,checkhostCallBack)
	}	
}).catch(function(err){
	//Notify telegram user?
	console.log("Telegram Listen - Error: "+err)
})

////////////////////////////////////////////////////

function restartServer(host){
	return new Promise(function(res,rej){

		var command="ssh "+host+" sudo restartWebServer"
		execCommands(command, callback)
	
		function callback(err, stdout, stderr){
			console.log("execCommands outputs: "+err+" "+stdout+" "+stderr)
			if (err) rej(err)
			if (stderr) rej(stderr)
			res(stdout)
		}
	})
}

function retryAction(host){
	retry++
	let time=calculateTime(retry)
	function action(){
		checkHost(host,checkhostCallBack)
	}
	setTimeout(action,time)
}

function calculateTime(retry){
	return Math.exp(retry+2)*1000
}

/////////////////////////Check Host///////////////////////////////7


function checkHost(host,processResponse){
	let param=ghp.getSpecificHostParameters(host)
	ghp.getHostResponse(param).then(function(response){
		let parsedResponse=ghp.parseResponse(response)
		processResponse(parsedResponse)	
	}).catch(function(err){
		let parsedResponse=ghp.parseResponse(err)
		processResponse(parsedResponse)
	})
}



////////////////Actions for checkHost Response /////
function checkhostCallBack(response){
	let host=response.host
	if(response.response==expectedResponse){
		msg=host+" is online"
		telegram.sendMSG(bot,msg)
		retry=0
		//notify restart worked as expected
	}else{
		restartServer(host).catch(function(err){
			telegram.sendMSG(bot,err)
		})
		let retryTime=parseTime()
		msg=host+" isn't ready yet! Reset will be executed again in "+retryTime.time+" "+retryTime.unit
		if (retry>0) telegram.sendMSG(bot,msg)
		retryAction(host)
	}
}

function parseTime(){
	let time=calculateTime(retry+1)/1000 // retry starts by incrementing
	result={time:0,unit:"seconds"}
	if(time>60){
		result.time=Math.round(time/60)
		result.unit="minutes"
	}else{
		result.time=Math.round(time)
	}
	return result
}



module.exports={

}

