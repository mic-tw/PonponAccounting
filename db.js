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
// 	content	: String,
// 	transactions: [Transactions]
 //}); 
 //mongoose.model('Tags', Tags);
 
 var Transactions = new Schema({
 	book	: {type: ObjectId, ref: Books, required: true},
 	account	: {type: ObjectId, ref: Accounts, required: true},
 	target	: {type: ObjectId, ref: Accounts},
 	type	: {type: String, required: true},
 	money	: {type: Number, required: true},
 	fee		: {type: Number, default: 0},
 	tags	: [{content: String}],
 	description	: {type: String, default: ''},
 	record_time	: {type: Date, required: true},
 	taken_time : {type: Date, required: true},
 	updated_time: {type: Date, default: Date.now}
 });
 mongoose.model('Transactions', Transactions);
 
 exports.Books = Books;
 exports.Accounts = Accounts;
 //exports.Tags = Tags; 
 exports.Transations = Transactions; 

 mongoose.connect('mongodb://localhost/ponpon-accounting');