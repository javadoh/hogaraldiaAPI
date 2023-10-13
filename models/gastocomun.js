var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
mongoose.set('debug', true);

var GastoComunSchemaChild = new Schema({
  fecha_creacion: String, 
  fecha_vencimiento: String, 
  documento: String, 
  servicios_id: Number
});

var GastoComunSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  condominio_id: Number,
  gastos_comunes: [GastoComunSchemaChild]
});

var GastoComunSchema = mongoose.model('GastoComunSchema', GastoComunSchema, 'gasto_comun');

module.exports = GastoComunSchema;