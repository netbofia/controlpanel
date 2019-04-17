const { exec } = require("child_process")


module.exports=function(command, options, callback){
	var callback=callback || options
    exec(command,callback)
}