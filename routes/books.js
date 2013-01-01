/**
 * New node file
 */

var mongoose = require('mongoose');
var Books = mongoose.model('Books');
var utils = require( 'connect' ).utils;

var create = function(req, res, next){
	var uuid = utils.uid(32);
	new Books({
		owner_email: req.body.email,
		uuid: uuid,
		name: req.body.name,
		description: req.body.description
	}).save(function(err, book, count){
		console.log('books.save ' + err);
		res.redirect('/books/list'); //FIXME
	});
};

var list = function(req, res, next){
	Books.find().exec(function(err, books){
		if(err){
			return next;
		}
		res.render('books', {title: 'Ponpon\'s Accounting', books: books});
	});
};

exports.create = create;
exports.list = list;