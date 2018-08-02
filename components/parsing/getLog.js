var fs=require('fs');



exports.getMatrix=function(file){
  var result=new Promise((res,rej)=>{
    parseFile(file,res,rej)
  })

  return result
}


function parseFile(file,res,rej){
  try{
    var data=fs.readFileSync(file,'utf8');
    data=data.trim().split("\n")
    let result={}
    for (i in data){
      let line=data[i].split("\t")
      let ms=line[1]
      let label=line[0].split(" ")
      label=label[0]+"\n"+label[1]+" "+label[2]
      let response=line[3]
      var date=convertTime(ms)
      var hour=getHour(ms) 
      if(!result[date]){
        result[date]={}
      }
      result[date][hour]=response
      result[date].label=label
    }

    res(result)
  }catch(err){
    rej(err) 
  }
}

function getHour(time){
  let d=new Date();
  d.setTime(time)
  return pad(d.getHours(),2)
}
function convertTime(time){
  let d=new Date();
  d.setTime(time)
  let yy=d.getFullYear()
  let mm=pad(d.getMonth()+1,2)
  let dd=pad(d.getDate(),2)  
  return yy+mm+dd
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}