const fs = require('fs')
const glob = require('glob')
const path=require('path')

const serverInfoFolder=path.join(__dirname,"../hosts/servers/")
const serverInfoFolderVPN=path.join(serverInfoFolder,"VPN/")

let servers={
	direct:{},
	vpn:{}
}
let server = {
	name:"",
	host:"",
	os:"linux",
	distro:"",
	updated:"",
	space:"",
	lastUpdate:""
}

directServers=glob.sync(serverInfoFolder+"*.json")
vpnServers=glob.sync(serverInfoFolderVPN+"*.json")

function loadServers(direct,vpn,result){	
	direct.forEach(function(server){
		servers=loadServerInfo(server, "direct", result)
	})
	vpn.forEach(function(server){
		result=loadServerInfo(server, "vpn", result)
	})
	return result
}
function loadServerInfo(file,type,info){
	let data=fs.readFileSync(file,'utf8')
	let name=path.basename(file, ".json")

	data=JSON.parse(data)
	let currentServer=populateObject(server,data)
	currentServer.name=name
	currentServer.file=file
	currentServer.elapsedCheck=elapsedDays(currentServer.updated)
	info[type][name]=currentServer
	return info
}
function populateObject(base,source){
	return Object.assign({}, base,source) 
}

function saveData(name,type,lastUpdate,space){
	let data=servers[type][name]
	data.lastUpdate=lastUpdate
	data.space=space
	data.updated=new Date()
	stringObject=JSON.stringify(data)
	fs.writeFileSync(data.file, stringObject, "utf8")
}
function elapsedDays(refDate){
	let now=new Date()
	refDate=refDate.replace("\n","")
	refDate=new Date(refDate)
	elapsedtime=now-refDate
	return Math.round(elapsedtime/(1000*3600*24))
}

module.exports={
	load:loadServers(directServers,vpnServers,servers),
	save:saveData
}