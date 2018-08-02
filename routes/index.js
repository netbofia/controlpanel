var express = require('express');
var router = express.Router();
var data = require('./../components/parsing/buildHeatmapMatrix')
/* GET home page. */
router.get('/', function(req, res, next) {
 
  data.matrix.then((matrix)=>{
  	console.log(matrix.labels.cols)
    res.render('index', { title: 'Express', matrix: matrix });
  })
});

module.exports = router;
