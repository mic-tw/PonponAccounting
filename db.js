/**
 * New node file
 */
 
 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 var ObjectId = Schema.ObjectId;
 
 var Books = new Schema({
 	name: String,
 	uuid: String,
 	owner_email	: String,
 	description: String,
 	public	: {
 		type: Boolean,
 		default: false
 	}
 });
 mongoose.model('Books', Books);
 
 var Accounts = new Schema({
 	book	: {type: ObjectId, ref: Books, required: true},
 	name	: {type: String, required: true},
 	description	: String
 });
 mongoose.model('Accounts', Accounts);
 
 //var Tags = new Schema({
// 	content	: String
 //}); 
 //mongoose.model('Tags', Tags);
 
 var Transactions = new Schema({
 	book	: {type: ObjectId, ref: Books, required: true},
 	account	: {type: ObjectId, ref: Accounts, required: true},
 	target	: {type: ObjectId, ref: Accounts},
 	type	: {type: String, required: true},
 	money	: {type: Number, required: true},
 	fee		: {type: Number, default: 0},
 	tags	: {type: String, default: ''},
 	description	: {type: String, default: ''},
 	date	: {type: Date, default: Date.now},
 	ordinal	: Number
 });
 mongoose.model('Transactions', Transactions);
 
 exports.Books = Books;
 exports.Accounts = Accounts;
 //exports.Tags = Tags; 
 exports.Transations = Transactions; 

 mongoose.connect('mongodb://localhost/ponpon-accounting');