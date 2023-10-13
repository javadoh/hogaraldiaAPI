var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
mongoose.set('debug', true);

var InitDataSchema = new Schema({
  OnBoard: Array,
  MainServices: Array,
  GastosComunes: Array,
  Decisiones: Array,
  Reservas: Array,
  Seguridad: Array,
  AdsConvivencia: Array
});

var InitDataSchema = mongoose.model('InitDataSchema', InitDataSchema, 'init_data');

module.exports = InitDataSchema;