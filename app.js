const express = require("express");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cookierParser = require("cookie-parser");
const app = express();
const mongoConnection = require('./configs/database-connection');

/* Database connection */
mongoConnection(process.env.MONGO_STRING_CONNECTION);
/* Own mail server */
//ownMailServer.connect();
//Api routes
const mediaRoutes = require("./routes/mediaRoutes")

/** Configuración de la vista interna del server*/
//app.set('views', path.join(__dirname, '/views'));
//app.set('view engine', 'hbs');

app.use('/node_modules', express.static(__dirname + '/node_modules'));
/* Vistas del proyecto angularjs */
//app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));
app.use(cookierParser());

//This block is for avoid any CORS(Cross Origin RequestS) erros
//Request coming from different origin than the server
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

//API routes
app.use('/api/media', mediaRoutes);

/** Configuración de la vista interna del server*/
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

/* error handlers*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log("404")
    return res.send('error');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log("error: " + err)
        console.log("error value: " + err.status)
        res.status(err.status || 500).send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
        message: err.message,
        error: err
    });
});

module.exports = app;