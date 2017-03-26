var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



/** --- html to node setup --- */
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');

var outFile = 'demo.wav';



/** --- generated code --- */
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next){
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/** --- end generated code --- */



/** --- binary server --- */
binaryServer = BinaryServer({
    port: 9001
});

binaryServer.on('connection', function(client){
    console.log('new connection');

    var fileWriter = new wav.FileWriter(outFile,{
        channels: 1,
        sampleRate: 48000,
        bitDepth: 16
    });

    client.on('stream', function(stream, meta){
        console.log('new stream');

        stream.pipe(fileWriter);
        stream.on('end', function(){
            fileWriter.end();

            console.log('wrote to file ' + outFile);
        });
    });
});


module.exports = app;









