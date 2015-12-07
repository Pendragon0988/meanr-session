var express      = require('express'),
    redis        = require('redis'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    redisStore   = require('connect-redis')(session),
    logger       = require('morgan'),
    bodyParser   = require('body-parser'),
    client       = redis.createClient(), // CREATE REDIS CLIENT
    router       = express.Router(),
    app          = express();

app.use(cookieParser('137BAB574D'))
app.use(session(
	{
		secret: '137BAB574D',
		store: new redisStore({ host: '127.0.0.1', port: 6379, client: client }),
		saveUninitialized: false, // don't create session until something stored,
		resave: false // don't save session if unmodified
	}
));

 app.use(logger('tiny'))
 app.use(bodyParser.urlencoded({ extended: true }))
 app.use(bodyParser.json())

 router.get('/session/set/:value', function(req,res){
   req.session.redSess = req.params.value
   res.send('Session written in Redis successfully')
 })

 app.get('/session/get/', function(req, res){
   if(req.session.redSess)
    res.send('The session value stored in Redis is: ' + req.session.redSess)
  else
    res.send('No session value stored in Redis')
 })

app.use('/', router)
var server = app.listen(8097, function(){
  console.log('REDIS SESSION server is listening on port %d', server.address().port);
})
