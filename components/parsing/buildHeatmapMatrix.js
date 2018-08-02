var data=require('./getLog')

var file="/home/brunocosta/Transferências/git/controlpanel/components/parsing/../hosts/srna-portal.biodata.pt.log"
const days=7
const hours=24

exports.matrix=data.getMatrix(file).then((res)=>{

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
			if (res[currentDate][key]=="200"){
				color="green"
			}else{
				color="red"
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
})

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