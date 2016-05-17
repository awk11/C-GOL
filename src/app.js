//gets all of the libraries
var path = require('path'); 
var express = require('express');
var compression = require('compression'); 
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose'); 
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var csrf = require('csurf');


//attachs app to the mongo database
var dbURL = process.env.MONGODB_URI || "mongodb://localhost/C-GOL";

//connects to the database
var db = mongoose.connect(dbURL, function(err) {
    if(err) {
        console.log("Could not connect to database");
        throw err;
    }
});

//connects the app to redis
var redisURL = {
	hostname: 'localhost',
	port: 6379
};

var redisPASS;

if(process.env.REDISCLOUD_URL) {
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisPASS = redisURL.auth.split(":")[1];
}

//sets up router
var router = require('./router.js'); 

//defines the port, which will depend on where the server is being run
var port = process.env.PORT || process.env.NODE_PORT || 3000;

//attaches express
var app = express();
//moves all of the client side stuff to an assets folder while on the server
app.use('/assets', express.static(path.resolve(__dirname + '/../client')));

//sets up all the app session stuff
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	key: "sessionid",
	store: new RedisStore({
		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPASS
	}),
	secret: 'Game of Life',
	resave: true,
	saveUninitialized: true,
	cookie: {
		httpOnly: true
	}
}));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(favicon(__dirname + '/../client/img/favicon.png'));
app.disable('x-powered-by');
app.use(cookieParser());

app.use(csrf());
app.use(function (err, req, res, next) {
	if (err.code !== 'EBADCSRFTOKEN') return next(err);
	return;
});

router(app);

//sets up the actual server
var http = app.listen(port, function(err) {
    if (err) {
      throw err;
    }
    console.log('Listening on port ' + port);
});


//the fallen socket.io code, lost to the waves of time, or rather lack of time
//var io = require('socket.io')(http);
//var users = { };
//io.on('connection', function(socket) {
//	console.log(socket.request._query['room']);
//	socket.join(socket.request._query['room']);
//	console.log(socket.request._query['user']);
//	users[socket.request._query['user']] = socket.request._query['user'];
//	console.log('There are ' + (Object.keys(users).length) + ' user(s) online');
//	
//	socket.on('update', function(cells, room){
//		//put room name in data and use that to update by room
//		//data must include:
//		//-room name(host username)
//		//-cells array
//		//-rules
//		//-user history
//		//-bools for pausing and drawing
//		
//		io.sockets.in(room).emit('getUpdate', cells);
//	});
//	
//	socket.on('selectSetup', function(data){
//		//requires room name and setup selected
//	});
//	
//	
//	socket.on('disconnect', function(data) {
//		socket.leave(socket.request._query['room']);
//		delete users[socket.name];
//	});
//});

