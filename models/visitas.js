var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
mongoose.set('debug', true);

var VisitaSchemaChild = new Schema({
  dni: String, 
  nombres: String, 
  apellidos: String, 
  fecha: String, 
  hora: String, 
  vehiculo_id: String, 
  usuario_registra: Number, 
  unidad_visitada: Array 
});

var VisitaSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  condominio_id: Number,
  visitas: [VisitaSchemaChild]
});

//VisitaSchema.plugin(AutoIncrement, {inc_field: 'visita_id'});//MONGOOSE SEQUENCE

var VisitaSchema = mongoose.model('VisitaSchema', VisitaSchema, 'visitas');

module.exports = VisitaSchema;