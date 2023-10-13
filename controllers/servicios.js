console.log('##### CARGANDO CONTROLLER SERVICIOS #####');

var mongoose = require('mongoose');

var ServicioSchema = require('.././models/servicios');
mongoose.set('debug', true);

//TODAS LOS SERVICIOS
exports.findAll = function(req, res){
  console.log('##### FIND ALL SERVICIOS #####');
  ServicioSchema.find({},'servicio_id condominio_id descripcion tipo identificador numero_factura_actual monto_factura_actual saldo_pendiente_pagar saldo_pagado fecha_emision fecha_vencimiento documentos observaciones saldo_historia detalle',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});

};

//UN SERVICIO POR ID Y CONDOMINIO
exports.findById = function(req, res) {
  console.log('##### FIND SERVICIO BY ID #####');
 var idServicio = req.query.idServicio;
 var idCondo = req.query.idCondo;
 //BUSCAMOS SERVICIO POR ID Y CONDOMINIO
 ServicioSchema.find({$and: [{'condominio_id': idCondo}, {'servicio_id': idServicio}]},'servicio_id condominio_id descripcion tipo identificador numero_factura_actual monto_factura_actual saldo_pendiente_pagar saldo_pagado fecha_emision fecha_vencimiento documentos observaciones saldo_historia detalle',function(err, result) {
  if (err){
    console.log(err);
    return res.send(err);
  }
  if(result == null || result.length == 0){
    return res.sendStatus(404);
  }

  return res.send(result);
  });
};

//FUNCION DE ACTUALIZAR DATOS DE SERVICIOS
exports.update = function(req, res) {
  console.log('#### UPDATE SERVICIOS ####');
  req.header("Content-Type", "application/json");
  
  //ESTO SE HACE MES A MES
  var data = req.body;
  var idServicio = data.servicio_id;
  var idCondo = data.condominio_id;
  
  ServicioSchema.update({$and: [{'condominio_id': idCondo}, {'servicio_id':idServicio}]}, 
  
  {'$set': {'descripcion': data.descripcion, 
  'tipo': data.tipo, 
  'identificador': data.identificador,
  'numero_factura_actual': data.numero_factura_actual,
  'monto_factura_actual': data.monto_factura_actual,
  'saldo_pendiente_pagar': data.saldo_pendiente_pagar,
  'saldo_pagado': data.saldo_pagado,
  'fecha_emision': data.fecha_emision,
  'fecha_vencimiento': data.fecha_vencimiento,
  'documentos': data.documentos, //con la data de sesion se envian existentes con nuevo string url del doc 
  'observaciones': data.observaciones, //saldo_historia necesita un push nuevo doc
  'detalle': data.detalle //De igual forma se envian los de sesion y se agrega el nuevo detalle
}}, function (err, numberAffected) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
            
        console.log('Updated %d servicios', numberAffected);
        return res.sendStatus(202);
    });
  };
    
    //FUNCION DE AGREGAR SERVICIOS // DEBE RECIBIR SIEMPRE EL CONDOMINIO_ID EN EL BODY Y SEQUENCIA VA EN FUNCION A ESE ID
    exports.add = function (req, res){
      console.log('#### AGREGAR SERVICIOS ####');
      req.header("Content-Type", "application/json");
      var data = req.body;

          ServicioSchema.create(data, function (err, result) {
            if (err) {
            console.log(err);        
                if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate condominio
                return res.status(500).send('El condominio/servicio ya existe.');
              }
              // Some other error
              return res.status(500).send('Ocurrió un error, '+err);
            }
            console.log("Creado servicio de condominio con data: "+data+"...... ", result);
            return res.sendStatus(200);
          });    
    }


    exports.updateHistoriaServicio = function(req, res){
        console.log('#### UPDATE HISTORIA SERVICIO ####');

        req.header("Content-Type", "application/json");
        var data = req.body;
        var idCondo = data.condominio_id;
        var idServcio = data.servicio_id;
  
        ServicioSchema.updateOne({$and: [{'condominio_id': idCondo},{'servicio_id': idServcio}]}, {$push: {'saldo_historia': data.historia_servicio} }, function (err, numberAffected) {
          
          console.log("numberAffected: "+JSON.stringify(numberAffected));
          
          if (err){
            console.log("Error actualizando documento saldo_historia servicio. Error fue: "+err);
            return res.sendStatus(500);
          }
  
          if(numberAffected.nModified == 1){
          console.log("Updated saldo_historia de condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(numberAffected));
          return res.sendStatus(202);
          }else{
          return res.sendStatus(404);
          }
        });  
    }

    exports.updateDetalleServicio = function(req, res){
        console.log('#### UPDATE DETALLE COMENTARIOS SERVICIO ####');

        req.header("Content-Type", "application/json");
        var data = req.body;
        var idCondo = data.condominio_id;
        var idServcio = data.servicio_id;
  
        ServicioSchema.updateOne({$and: [{'condominio_id': idCondo},{'servicio_id': idServcio}]}, {$push: {'detalle': data.detalle} }, function (err, numberAffected) {
          
          console.log("numberAffected: "+JSON.stringify(numberAffected));
          
          if (err){
            console.log("Error actualizando documento detalle de servicio. Error fue: "+err);
            return res.sendStatus(500);
          }
  
          if(numberAffected.nModified == 1){
          console.log("Updated detalle comentario de condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(numberAffected));
          return res.sendStatus(202);
          }else{
          return res.sendStatus(404);
          }
        });  
    }

    
    //FUNCION DE ELIMINAR SERVICIO
    exports.delete = function(req, res) {
    console.log('#### DELETE SERVICIO ####');
    req.header("Content-Type", "application/json");

    var data = req.body;
    var idCondo = data.condominio_id;
    var idServicio = data.servicio_id;

    ServicioSchema.remove(
      {$and: [{'condominio_id': idCondo, 'servicio_id': idServicio}]},function(result) {
        return res.send(result);
    });
    };

