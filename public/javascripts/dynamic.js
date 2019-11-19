const MIN=10

const INTERVAL=MIN*1000*60



setInterval(function(){ 
		location.reload(); 
	}, 
	INTERVAL);

$(document).ready(function(){
	$('button.btn.update-server-info').click(function(){
		console.log("You pressed me")
		let that=$(this)
		let name =that.attr("name")
		let type =that.attr("type")
		let path =`/get/info/${type}/${name}`
		console.log(that)

		$.ajax({
			url:path,
			type:"GET",
			success: function(data,textStatus,jqXHR){
				//location.reload()
			}
		})
	})

})