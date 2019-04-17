var express = require('express');
var router = express.Router();
var data = require('./../components/parsing/buildHeatmapMatrix')

//This is called on start server so its ok but if not used here maybe should pass on to app.js
var telegramController = require('./../components/controller/telegramController')


/* GET home page. */
router.get('/', function(req, res, next) {
 
  data.matrices().then((result)=>{
  	Promise.all(result.matrices).then(function(values){
  		
    	res.render('index', { title: 'Control Panel',titles:result.hosts, matrices: values });
  	})
  }).catch(function(err){
  	res.status(statusCode).json(err);  
  })
});

module.exports = router;
