
/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('./db')
  , routes = require('./routes')
  , index = require('./routes/index')
  , books = require('./routes/books')
  , user = require('./routes/user')
  , transactions = require('./routes/transactions')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/books', books.list);
app.get('/books/list', books.list);
app.get('/book/:bookid', transactions.list);
app.get('/book/:bookid/:accountname', transactions.account);
app.post('/book/:bookid/transaction', transactions.transaction);
app.post('/books/create', books.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
