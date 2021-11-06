var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var session = require('cookie-session');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-east-04.cleardb.com',  // us-cdbr-east-04.cleardb.com
  user     : 'b4cd7d6552f2a8',  // b4cd7d6552f2a8
  password : '3f933e43',  // 3f933e43
  database : 'heroku_3b662f0c2000bbd'  // heroku_3b662f0c2000bbd
});
  
connection.connect();
 
global.db = connection;

app.set('trust proxy', 1);
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
      secure: true
    }
}));
 
app.get('/', routes.index);
app.get('/signup', user.signup);
app.post('/signup', user.signup);
app.get('/login', routes.index);
app.post('/login', user.login);
app.get('/home/dashboard', user.dashboard);
app.get('/home/logout', user.logout);
app.get('/home/profile', user.profile);
app.get('/home/classes', user.classes);
app.post('/home/classes', user.classes);
app.get('/home/class', user.class);
app.post('/home/class', user.class);
app.get('/home/edit', user.edit);
app.post('/home/edit', user.edit);
app.get('/home/add', user.add);
app.post('/home/add', user.add);
app.post('/home/edit/success', user.crudSuccess);
app.listen(process.env.PORT || 8000);

module.exports = app;