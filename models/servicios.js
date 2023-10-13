var mongoose = require('mongoose'), 
Schema = mongoose.Schema,
AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.set('debug', true);

var SaldoHistoriaSchemaChild = new Schema({
  fecha_emision: String, 
  fecha_vencimiento: String, 
  numero_factura: String, 
  monto_factura: Number, 
  saldo_pagado: Number, 
  saldo_pendiente_pagar: Number, 
  documentos: Array
});

var ServicioSchema = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  condominio_id: Number,
  descripcion: String, 
  tipo: String, 
  identificador: String, 
  numero_factura_actual: String, 
  monto_factura_actual: Number, 
  saldo_pendiente_pagar: Number, 
  saldo_pagado: Number, 
  fecha_emision: String, 
  fecha_vencimiento: String, 
  documentos: Array, 
  observaciones: String, 
  saldo_historia: [SaldoHistoriaSchemaChild], 
  detalle: Array
});

ServicioSchema.plugin(AutoIncrement, {id: 'servicio_seq', inc_field: 'servicio_id', reference_fields: ['condominio_id']});//MONGOOSE SEQUENCE

var ServicioSchema = mongoose.model('ServicioSchema', ServicioSchema, 'servicios');

module.exports = ServicioSchema;