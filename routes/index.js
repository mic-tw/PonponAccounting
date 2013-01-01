
/*
 * GET home page.
 */

var mongoose = require('mongoose');
var Books = mongoose.model('Books');

var index = function(req, res, next){
	Books.find().exec(function(err, books){
		if(err){
			return next;
		}
		res.render('index', {title: 'Ponpon\'s Accounting', books: books});
	});
};

exports.index = index;