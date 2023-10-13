var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
//AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.set('debug', true);

var ReservaSchemaChild = new Schema({
  reserva_tipo: String, 
  id_reserva_tipo: Number,
  unidad: String, 
  dni: Number, 
  fecha_reserva: Object, 
  fecha_solicitada: String,
  fecha_cancelacion_reserva: String
});

var ReservacionSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  condominio_id: Number,
  reservaciones: [ReservaSchemaChild]
});

//ReservaSchemaChild.plugin(AutoIncrement, {inc_field: 'reservacion_id'});//MONGOOSE SEQUENCE

var ReservacionSchema = mongoose.model('ReservacionSchema', ReservacionSchema, 'reservaciones');

module.exports = ReservacionSchema;