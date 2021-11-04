var express = require('express');
var router = express.Router();

/* GET home page. */
exports.index = function (req, res) {
  var message = '';
  res.render('index', {
    message: message,
    data: req.session
  });
}
