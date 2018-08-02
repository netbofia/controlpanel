var express = require('express');
var router = express.Router();
var data = require('./../components/parsing/buildHeatmapMatrix')
/* GET home page. */
router.get('/', function(req, res, next) {
  
  matrix={
  	data:[],
  	labels:{
  		rows:[],
  		columns:[]
  	}
  }
  matrix.labels.rows=["01","02"]
  matrix.labels.cols=["Thu\nAug 02","Fri\nAug 01"]
  
  matrix.data.push([200,200,22])
  matrix.data.push([400,200,300])
  matrix.data.push([400,200])
  data.matrix.then((matrix)=>{
  	console.log(matrix.labels.cols)
    res.render('index', { title: 'Express', matrix: matrix });
  })
});

module.exports = router;
