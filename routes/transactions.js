/**
 * New node file
 */

 var mongoose = require('mongoose');
 var Books = mongoose.model('Books');
 var Accounts = mongoose.model('Accounts');
 var Transactions = mongoose.model('Transactions');
 
 var Types = {income: 'Income', expense: 'Expense', transfer: 'Transfer', reset: 'BalanceReset'}; 
 
 
 var find_book = function(uuid, callback){
 	Books.find({uuid: uuid}, callback);
 };
 
 var convert_tags = function(input_str){
 	var arr = [], out = [];
 	if(input_str){
 		arr = input_str.split(' ');
 	}
 	for(var i = 0 ; i < arr.length ; i++){
 		out.push({content: arr[i]});
 	}
 	return out;
 };
  
 var ensure_account = function(book_uuid, accountName, callback){
 	Books.find({uuid: book_uuid}, function(err, books){
 		if(err || null == books || 0 == books.length){
 			console.log('ensure_account ' + err);
 			callback(books, null);
 			return;
 		}
 		Accounts.find({name: accountName}, function(err, accounts){
 			console.log('Account with name: ' + accountName + ": " + accounts+ '\t' + err);
 			if(null == accounts || 0 == accounts.length){
	 			new Accounts({
	 				book: books[0],
 					name: accountName
 				}).save(function(err, account, count){
 					console.log('transactions.ensure_account.find.save ' + err);
 					callback(books[0], account);
 					return account;
 				});
 			}else{
 				callback(books[0], accounts[0]);
 			}
 		});
 	});
 };
 
 var income = function(req, res, next){
 	console.log('income: ' + req.params.bookid);
 	ensure_account(req.params.bookid, req.body.account, function(book, account){
 		console.log('transaction.income book: ' + book + ' account ' + account + ' tags: ' + req.body.tags + ' date:' + req.body.record_date);

 		Transactions.find({
 		}, function(err, transactions){
 			new Transactions({
 				book: book,
 				account: account,
 				type: Types.income,
 				money: req.body.money,
 				tags: convert_tags(req.body.tags),
 				description: req.body.description,
 				record_time: new Date(req.body.record_date),
 				taken_time: new Date(req.body.taken_date)
 			}).save(function(err, transaction){
 				console.log('transaction.income ' + err);
 				console.log(transaction);
 				res.redirect('/book/' + req.params.bookid);
 			});
 		});
 	});
 };
 
 var expense = function(req, res, next){
 	console.log('expense: ' + req.body);
 	ensure_account(req.params.bookid, req.body.account, function(book, account){
 		Transactions.find({
 		}, function(err, transactions){
 			new Transactions({
 				book: book,
 				account: account,
 				type: Types.expense,
 				money: req.body.money,
 				tags: convert_tags(req.body.tags),
 				description: req.body.description,
 				record_time: new Date(req.body.record_date),
 				taken_time: new Date(req.body.taken_date)
 			}).save(function(err, transaction, count){
 				res.redirect('/book/' + req.params.bookid);
 			});
 		});
 	});
 };
 
 var transfer = function(req, res, next){
 	ensure_account(req.params.bookid, req.body.account, function(book, account){
 		console.log('transaction.transfer 1');
 		ensure_account(req.params.bookid, req.body.target_account, function(book, target){
 			Transactions.find({
 			}, function(err, transactions){
 				new Transactions({
 					book: book,
 					account: account,
 					target: target,
 					type: Types.transfer,
 					money: req.body.money,
 					tags: convert_tags(req.body.tags),
 					fee: req.body.fee,
 					description: req.body.description,
 					record_time: new Date(req.body.record_date),
 					taken_time: new Date(req.body.taken_date)
 				}).save(function(err, transaction, count){
 					res.redirect('/book/' + req.params.bookid);
 				});
 			});
 		});
 	});
 };
 
 var balance_reset = function(req, res, next){
 	console.log('balance reset: ' + req.body);
 	ensure_account(req.params.bookid, req.body.account, function(book, account){
 		Transactions.find({
 		}, function(err, transactions){
 			new Transactions({
 				book: book,
 				account: account,
 				type: Types.reset,
 				money: req.body.money,
 				tags: convert_tags(req.body.tags),
 				description: req.body.description,
 				record_time:  new Date(req.body.record_date),
 				taken_time:  new Date(req.body.record_date),
 				ordinal: transactions.length,
 			}).save(function(err, transaction){
 				res.redirect('/book/' + req.params.bookid);
 			});
 		});
 	});
 };
 
 var transaction = function(req, res, next){
 	console.log('transactions.transaction ' + req.params.bookid);
 	switch(req.body.type){
 		case 'income':
 			return income(req, res, next);
 		case 'expense':
 			return expense(req, res, next);
 		case 'transfer':
 			return transfer(req, res, next);
 		case 'reset':
 			return balance_reset(req, res, next);
 		//default:
 			//return list();
 	}
 };
  
 var list = function(req, res, next){
 	console.log('transactions.list ' + req.params.bookid);
 	Books.find({uuid: req.params.bookid}, function(err, books){
 		if(err){
 			return next(err);
 		}else if(null == books || 0 == books.length){
 			return res.redirect('/'); //FIXME
 		}
 		Transactions.find({
 			book: books[0],
 		}, function(err, transactions){
 			if(err){
 				return next(err);
 			}
 			
 			Accounts.find(
 				{book: books[0]}, 
 				function(err, accounts){
 					if(null != err || null == accounts){
 						accounts = [];
 					}
					res.render('transactions', {
						title: books[0].name,
						accounts: accounts,
						book: {name: books[0].name, uuid: req.params.bookid},
						types: Types,
						transactions: transactions
					});
 				}
 			);
		});
 	});
 };
 
 var list_account = function(req, res, next){
 	console.log('transactions.list_account ' + req.params.bookid + ', ' + + req.params.accountname);
 	Books.find({uuid: req.params.bookid}, function(err, books){
 		if(err){
 			return next(err);
 		}else if(null == books || 0 == books.length){
 			return res.redirect('/'); //FIXME
 		}
 		Accounts.find({book: books[0]}, function(err, accounts){
 			if(err){
 				return next(err);
 			}else if(null == accounts || 0 == accounts.length){
 				return res.redirect('/book/' + req.params.bookid); //FIXME
 			}
 			var account = null;
 			for(var i = 0 ; i < accounts.length ; i++){
 				if(accounts[i].name == req.params.accountname){
 					account = accounts[i];
 					break;
 				}
 			}
 			if(null == account){
 				return res.redirect('/book/' + req.params.bookid); //FIXME
 			}
 			Transactions.find({
 				account: account,
 			}, function(err, transactions){
 				if(err){
 					return next(err);
 				}
 				for(var idx = 0 ; idx < transactions.length ; idx++){
 					if(transactions[idx].tags){
 						transactions[idx].tags_array =  transactions[idx].tags.split(' ');
 					}
 				}
				res.render('transactions', {
					title: books[0].name,
					book: {name: books[0].name, uuid: books[0].uuid},
					accounts: accounts,
					account: account,
					types: Types,
					transactions: transactions
				});
			});
 		});
 	});
 };
 
 //exports.income = income;
 //exports.expense = expense;
 //exports.transfer = transfer;
 //exports.balance_reset = balance_reset;
 exports.list = list;
 exports.account = list_account;
 exports.transaction = transaction; 
 