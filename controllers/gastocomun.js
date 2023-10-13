console.log('##### CARGANDO CONTROLLER GASTO_COMUN #####');

var mongoose = require('mongoose');
const _ = require("lodash");

var GastoComunSchema = require('.././models/gastocomun');
var PagoSchema = require('.././models/pagos');
var ServicioSchema = require('.././models/servicios');
mongoose.set('debug', true);

//TODOS LOS GASTOS COMUNES
exports.findAll = function(req, res){
  console.log('##### FIND ALL GASTO COMUN #####');
  GastoComunSchema.find({},'condominio_id gastos_comunes',function(err, results){

if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});
};

//UN GASTO COMUN POR ID Y CONDOMINIO
exports.findByCondo = function(req, res) {
  console.log('##### FIND GASTO COMUN BY ID #####');
 var idCondo = req.query.idCondo;
 var dni = req.query.dni;

 //BUSCAMOS VISITA POR ID Y CONDOMINIO
 GastoComunSchema.find({'condominio_id': idCondo},'condominio_id gastos_comunes',function(err, result) {
  if (err){
    console.log(err);
    return res.sendStatus(500);
  }
  if(result == null || result.length == 0){
    //BUSCAMOS LOS SERVICIOS ASOCIADOS
    ServicioSchema.find({'servicio_id': result.servicio_id}, 'servicio_id condominio_id descripcion tipo identificador numero_factura_actual monto_factura_actual saldo_pendiente_pagar saldo_pagado fecha_emision fecha_vencimiento documentos observaciones saldo_historia detalle', function(err, resultServicio){
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      if(resultServicio == null || resultServicio.length == 0){
        result += resultServicio;

      //VALIDAMOS SI YA SE ENCUENTRA PAGADO EL ULTIMO GASTO COMUN POR EL USUARIO 
      PagoSchema.find({$and: [{'condominio_id': idCondo}, {'pagos.dni': dni}]}, 'pagos', function(err, resultPagos){
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      if(resultPagos == null || resultPagos.length == 0){
        result += resultPagos;
        //ENVIAMOS LAS TRES INFORMACIONES GC, PAGO, SERVICIOS
        return res.status(200).send(result);
      }else{
        console.log('ERROR cargando los pagos de dni: '+dni);
        return res.sendStatus(500);
      }
      });

      }else{
        console.log('ERROR cargando el servicio: '+result.servicio_id);
        return res.sendStatus(500);
      }

    });
    
  }else{
    console.log('ERROR cargando el gasto común del condominio: '+idCondo);
    return res.sendStatus(500);
  }

  });
};

function filterGastoComun(gastoComunCondominio, idGastoComun) {
  var jsonObject;
    _.filter(gastoComunCondominio, function(element) {
      _.forEach(element.gastos_comunes, function(entry) {
          if (entry._id == idGastoComun) {
              jsonObject = JSON.stringify(entry);
          }
      });
  });
  return JSON.parse(jsonObject);
}

//FUNCION DE ACTUALIZAR DATOS DE GASTO COMUN 
exports.update = function(req, res) {
  console.log('#### UPDATE GASTO COMUN ####');
  req.header("Content-Type", "application/json");

  var data = req.body;
  var idGastoComun = data._id;
  var idCondo = data.condominio_id;
  
  GastoComunSchema.update({$and: [{'condominio_id': idCondo}, {'gastos_comunes._id':idGastoComun}]}, 
  
  {'$set': {'gastos_comunes.$.fecha_vencimiento': data.fecha_vencimiento, 
  'gastos_comunes.$.documento': data.documento, 
  'gastos_comunes.$.servicio_id': data.servicio_id
  }}, function (err, numberAffected) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
            
        console.log('Updated %d gastos_comunes', numberAffected);
        return res.sendStatus(202);
    });
  };
    
    //FUNCION DE AGREGAR GASTOS COMUNES
    exports.add = function (req, res){
      console.log('#### AGREGAR GASTOS COMUNES ####');

      req.header("Content-Type", "application/json");
      var idCondo = req.params.id;
      var data = req.body;

      GastoComunSchema.updateOne({'condominio_id': idCondo}, {$push: {'gastos_comunes': data} }, function (err, numberAffected) {
        
        console.log("numberAffected: "+JSON.stringify(numberAffected));
        
        if (err){
          console.log("Error actualizando documento. Error fue: "+err);
          return res.sendStatus(500);
        }

        if(numberAffected.nModified == 1){
        console.log("Updated gastos comunes de condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(numberAffected));
        return res.sendStatus(202);
        }else{
          //INTENTAMOS LA CREACION DEL DOCUMENTO POR PRIMERA VEZ
          //MANIPULACION DE JSON PARA CREACION DEL NUEVO DOCUMENTO SI NO EXISTE
          var dataStringify = JSON.stringify(data);
          dataStringify = "{\"condominio_id\":"+idCondo+", \"gastos_comunes\":["+dataStringify+"]}";
          console.log(dataStringify);
          var dataBody = JSON.parse(dataStringify);

          GastoComunSchema.create(dataBody, function (err, result) {
            if (err) {
            console.log(err);        
                if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate condominio
                return res.status(500).send('El condominio ya existe.');
              }
              // Some other error
              return res.status(500).send('Ocurrió un error, '+err);
            }
            console.log("Creado condominio: "+idCondo+", con data de gasto comun: "+data+"...... ", result);
            return res.sendStatus(200);
          });  
        }
      });  
    }

    
    //FUNCION DE ELIMINAR GASTO COMUN
    exports.delete = function(req, res) {
    console.log('#### DELETE GASTO COMUN ####');
    req.header("Content-Type", "application/json");

    var data = req.body;
    var idCondo = data.condominio_id;
    var idGastoComun = data._id;

    GastoComunSchema.update(
      {'condominio_id': idCondo},
      { $pull: { gastos_comunes: { '_id': idGastoComun }}} ,function(result) {
        return res.send(result);
    });
    };

