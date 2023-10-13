var mongoose = require('mongoose'), 
Schema = mongoose.Schema, 
AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.set('debug', true);

var UsuarioSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  //usuario_id: Number,  AUTO INCREMENT
  nombres: String,
  apellidos: String, 
  email: String,  
  dni: Number,
  dv: String,  
  telefono_contacto: String, 
  unidad: String, 
  rol: String, 
  profesion: String, 
  ocupacion: String, 
  servicios_productos: Array, 
  condominio_id: Number,
  telefono_asignado: String,
  sugerencias: Array,
  reclamos: Array
});

UsuarioSchema.index({
  dni: 1,
},{
  unique: true,
});

UsuarioSchema.plugin(AutoIncrement, {inc_field: 'usuario_id'});//MONGOOSE SEQUENCE
//UsuarioSchema.plugin(autoIncrement, {field: 'usuario_id', collection: 'users_counter'});//FUNCIONA EXCELENTE

var UsuarioSchema = mongoose.model('UsuarioSchema', UsuarioSchema, 'usuarios');

module.exports = UsuarioSchema;