var telegram = require('./../helpers/telegram')
var execCommands = require('./../helpers/execCommands')
var ghp=require('./../helpers/get_host_params')

var hostParams=ghp.getHostParameters()
var hosts=[]
hostParams.forEach(function(host){
	hosts.push(host.host)
})
var callback={}

const bot = telegram.bot(polling=true)  //Does this work?

telegram.listen(bot,hosts,callback).then(function(res){
	if(res.action){
		console.log(res)
		restartServer(res.server).then(function(stout){
			console.log(stout)
		})
	}
	
}).catch(function(err){
	console.log(err)
})


function callback(){

}



function restartServer(host){
	return new Promise(function(res,rej){

		var command="ssh "+host+" sudo restartWebServer"
		execCommands(command, callback)
	
		function callback(err, stdout, stderr){
			console.log(err+" "+stdout+" "+stderr)
			if (err) rej(err)
			if (stderr) rej(stderr)
			res(stdout)
		}
	})

}




module.exports={

}

