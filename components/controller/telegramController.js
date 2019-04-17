var telegram = require('./../helpers/telegram')
var execCommands = require('./../helpers/execCommands')

var servers={}
var callback={}

const bot = telegram.bot(polling=true)
telegram.listen(servers,callback).then(function(res){
	if(res.action){
		console.log(res)
		restartServer(res.server)
	}
	
}).catch(function(err){

})


function callback(){

}



function restartServer(host){
	return Promise(function(res,rej){

		var command="ssh "+host+" sudo restartWebServer"
		execCommands(command, callback)
	
		function callback(err, stdout, stderr){
			if (err) rej(err)
			if (stderr) rej(stderr)
			res(stdout)
		}
	})

}




module.exports={

}

