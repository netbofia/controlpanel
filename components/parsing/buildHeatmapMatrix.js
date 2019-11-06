var data=require('./getLog')
var glob=require('glob')
var path=require('path')
//var pal = require('nice-color-palettes')
var pal=["#2dc937","#99c140","#e7b416","#db7b2b","#cc3232"] 
const days=7
const hours=24
const hosts=getHostNames()


exports.matrices=function(){
	return new Promise(function(resolve,reject){
		try{
			result={hosts:hosts,matrices:[]}
			for(h in hosts){
				file=__dirname+"/../hosts/"+hosts[h]+".log"
				console.log(file)
				result.matrices.push(data.getMatrix(file).then((res)=>{

					var datelist=Object.keys(res).sort()
					var numOfdates=datelist.length
					var matrix={}
					matrix.data=generateMatrix(days,hours)
					labels={
					  	rows:[],
					  	cols:[]
					}

					//Convert Comments to functions
					//iterDays
					for (var i=0; i<days; i++){
						let col = getColumn(numOfdates,days,i)
						currentDate=datelist.pop()
						labels.cols.unshift(res[currentDate].label)
						delete res[currentDate].label
						let keys=Object.keys(res[currentDate])

						//iterHours
						for (j in keys){
							let key=keys[j]
							let row=parseInt(key)
							//Add values to matrix
							response=res[currentDate][key]
							if (response=="200"){
								color="green"
							}else{

								color = typeof parseInt(response) == "number"  && parseInt(response) != 0 ? pal[parseInt(response)/20] : "red"

							}
							matrix.data[row][col]={
								color:color,
								title:res[currentDate][key]
							}
						}

						if((i+1) >= numOfdates ) break;
					}
					
					matrix.labels=organizeLabels(labels,days,hours)
					return matrix
				}))
			}
			resolve(result)
		}catch(err){
			reject(err)
		}
	})
}

function organizeLabels(labels,cols,rows){
	if(labels.cols.length<cols){
		for (i=labels.cols.length;i<cols;i++){
			labels.cols.push('')
		}
	}
	return labels
}

function generateMatrix(cols,rows){
	let row=[]
	let matrix=[]
	for (var i=0; i<cols; i++){
		row=row.concat([{color:'grey',title:'NA'}])
	}
	for (var i=0; i<rows; i++){
		matrix.push(Object.assign([],row))
	}
	return matrix	
}


function getColumn(arraySize,limit,iter){
	if(arraySize > limit){
		return limit-1-iter
	}else{
		//Can generate negative numbers
		return arraySize-1-iter
	}
}

function getHostNames(){
	let hosts=glob.sync('components/hosts/*.json')
	for(i in hosts){
		hosts[i]=path.basename(hosts[i],'.json')
	}
	return hosts
}