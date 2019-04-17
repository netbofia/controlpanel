var fs = require('fs');

function writeLog(host,res){
	var iso = new Date()
	var now = Date.now()
	
	let output=iso+"\t"+now+"\t"+host+"\t"+res
	fs.appendFile(__dirname+'/../hosts/'+host+'.log', output+"\n", function (err) {
	  if (err) throw err;
	  console.log('Saved!: '+output);
	});
}

module.exports={

}