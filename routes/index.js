var express = require('express');
var router = express.Router();
var data = require('./../components/parsing/buildHeatmapMatrix')
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
