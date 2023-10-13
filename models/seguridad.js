var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
mongoose.set('debug', true);

var SeguridadSchema = new Schema({
  condominio_id: { type : Number , unique : true, required : true, dropDups: true },
  seguridad_items: Array
});

var SeguridadSchema = mongoose.model('SeguridadSchema', SeguridadSchema, 'seguridad');

module.exports = SeguridadSchema;