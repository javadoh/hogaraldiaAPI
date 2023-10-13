const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

var mongoUri = 'mongodb://127.0.0.1/condominios';

//const connection = await Mongoose.createConnection('mongodb://...');
//const AutoIncrement = AutoIncrementFactory(connection);mongoose.set('useCreateIndex', true);

Mongoose.connect(mongoUri);
var db = Mongoose.connection;
db.on('error', function (error) {
	console.log('Error: '+error);
  throw new Error('unable to connect to database at ' + mongoUri);
});

// CONNECTION EVENTS
// When successfully connected
Mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to condominios database');
}); 

// If the connection throws an error
Mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
Mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  Mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination to the database condominios'); 
    process.exit(0); 
  }); 
});

/*var app = express();

app.configure(function(){
  app.use(express.bodyParser());
});*/

//app.use(BodyParser.json());
//app.use(BodyParser.urlencoded({ extended: true }));
//SE AGREGA LIMIT POR EL ERROR AL SUBIR IMAGENES BASE 64
app.use(BodyParser.json({limit: '5mb'}));
app.use(BodyParser.urlencoded({limit: '5mb', extended: true}));

//OBTENEMOS LOS MODELOS DE BD
require('./models/initdata');
require('./models/usuarios');
require('./models/usuariosvisita');
require('./models/condominios');
require('./models/decisiones');
require('./models/publicidad');
require('./models/reservaciones');
require('./models/visitas');
require('./models/servicios');
require('./models/gastocomun');
require('./models/seguridad');
require('./models/pagos');
//REQUERIMOS MODULO WEBPAY
//require('./webpay/lib/WebPay');

require('./routes/routes')(app);

app.listen(app.get('port'), '0.0.0.0');
//app.listen(8000);
console.log('Listening on port 8000...');