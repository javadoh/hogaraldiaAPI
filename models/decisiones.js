var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
mongoose.set('debug', true);

var DecisionSchemaChild = new Schema({
  titulo: String, 
  descripcion: String,
  fecha_creacion: String, 
  fecha_cierre: String, 
  fecha_actualizacion: String, 
  image: String, 
  costo: Number,
  votos: Array, 
  opciones_respuestas: Array, 
  usuario_registra: Number
});

var DecisionesSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  condominio_id: Number,
  encuestas: [DecisionSchemaChild]
});

//DecisionSchemaChild.plugin(AutoIncrement, {id: 'decisiones_seq', inc_field: 'encuesta_id'});

var DecisionesSchema = mongoose.model('DecisionesSchema', DecisionesSchema, 'encuestas_votaciones');

module.exports = DecisionesSchema;