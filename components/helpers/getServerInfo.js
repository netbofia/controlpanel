let cmd = require('./execCommands')
let fs = require('fs')
var servers = require('./../parsing/serverInfo')

module.exports=function(params){
	return new Promise(function(res,rej){
		try{
			let serverList=servers.load
			let name=params.name
			let type=params.type
			let currentServer=serverList[type][name]
			let host=currentServer.alias || currentServer.host
			let command = ""
			let distro=currentServer.distro
			let paths=currentServer.paths || ["/$","/home"]
			if(host == "") rej("no host")
			if(distro=="ubuntu"){
				command=`ssh ${host} "stat -c %y /var/lib/apt/periodic/update-success-stamp;`
			}else if(distro=="arch"){
				command=`ssh ${host} "lastUpgrade;`
			}else{
				command="echo 'Error! No command sent';"
			}
			paths.forEach(function(path){
				command+=`df -h | grep '${path}';`
			})
			command+=`"`;
			console.log(command)
			cmd(command, callback)
		
			function callback(err, stdout, stderr){
				console.log("execCommands outputs: "+err+" "+stdout+" "+stderr)
				if (err) rej(err)
				if (stderr) rej(stderr)
				result=stdout.split("\n")
				saveResult(result,name,type)
				res(result)
			}
		}catch(err){
			rej(err)
		}
	})
}



function saveResult(result,name,type){
	let lastUpdate=result[0]
	let space=result.splice(1)
	servers.save(name,type,lastUpdate,space)
}