var mongoose = require('mongoose'), 
Schema = mongoose.Schema,
AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.set('debug', true);

var CondominioSchema = new Schema({
  //condominio_id: { type: Schema.Types.Number, max: 10 },
  descripcion: String, 
  direccion: String, 
  ciudad: Object, 
  estado: Object, 
  municipio: Object, 
  pais: Object, 
  latitud: String, 
  longitud: String, 
  total_unidades: Number, 
  total_unidades_habitadas: Number, 
  unidades: Array, 
  administradores: Array, 
  personal: Array,
  datos_pago: Array,
  servicios_app: Object,
  reserva_quincho: Object, 
  reserva_estacionamiento: Object,
  reserva_salaFiesta: Object,
  reserva_salaCine: Object,
  reserva_salaJuegos: Object
});

CondominioSchema.plugin(AutoIncrement, {inc_field: 'condominio_id'});//MONGOOSE SEQUENCE

var CondominioSchema = mongoose.model('CondominioSchema', CondominioSchema, 'condominios');

module.exports = CondominioSchema;