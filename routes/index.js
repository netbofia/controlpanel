var express = require('express');
var router = express.Router();
var data = require('./../components/parsing/buildHeatmapMatrix')
var servers = require('./../components/parsing/serverInfo').load
let getInfo = require('./../components/helpers/getServerInfo')

//This is called on start server so its ok but if not used here maybe should pass on to app.js
var telegramController = require('./../components/controller/telegramController')

/* GET home page. */
router.get('/', function(req, res, next) {
 
  data.matrices().then((result)=>{
  	Promise.all(result.matrices).then(function(values){
    	res.render('index', { title: 'Control Panel',titles:result.hosts, matrices: values,servers:servers });
  	})
  }).catch(function(err){
  	res.status(statusCode).json(err);  
  })
});
router.get('/get/info/:type/:name', function(req, res, next){
	let params=req.params
	getInfo(params).then(function(data){
		res.json(data)
	}).catch(function(err){
		res.render("error",{error:err})
	})
})

module.exports = router;
