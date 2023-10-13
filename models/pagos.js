
var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.set('debug', true);

var PagoSchemaChild = new Schema({
  dni: String,
  unidad: String, 
  fecha: String,
  gastocomun_id: Number, 
  reserva_id: Number, 
  webpay_data: Array
});

var PagoSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  condominio_id: Number,
  pagos: [PagoSchemaChild]
});

PagoSchemaChild.plugin(AutoIncrement, {inc_field: 'pago_id'});//MONGOOSE SEQUENCE

var PagoSchema = mongoose.model('PagoSchema', PagoSchema, 'pagos');

module.exports = PagoSchema;