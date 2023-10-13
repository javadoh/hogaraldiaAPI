var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
mongoose.set('debug', true);

var PublicidadSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  publicidad_id: Number,
  path_publicidad_imagen: String, 
  fecha_inicio_publicidad: String,  
  fecha_fin_publicidad: String, 
  path_publicidad_webpage: String,
  tipo: String, 
  titulo: String, 
  descripcion: String,
  condominio_id: Number
});

var PublicidadSchema = mongoose.model('PublicidadSchema', PublicidadSchema, 'publicidad');

module.exports = PublicidadSchema;