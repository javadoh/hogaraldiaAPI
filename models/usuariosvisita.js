var mongoose = require('mongoose'), 
Schema = mongoose.Schema, 
AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.set('debug', true);

var UsuarioVisitaSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  //usuario_id: Number,  AUTO INCREMENT
  dni: Number,
  dv: String, 
  email: String
});

UsuarioVisitaSchema.index({
  dni: 1,
},{
  unique: true,
});

UsuarioVisitaSchema.plugin(AutoIncrement, {inc_field: 'app_visita_id'});//MONGOOSE SEQUENCE
//UsuarioSchema.plugin(autoIncrement, {field: 'usuario_id', collection: 'users_counter'});//FUNCIONA EXCELENTE

var UsuarioVisitaSchema = mongoose.model('UsuarioVisitaSchema', UsuarioVisitaSchema, 'usuarios_visita');

module.exports = UsuarioVisitaSchema;