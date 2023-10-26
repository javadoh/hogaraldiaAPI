console.log('##### CARGANDO CONTROLLER GASTO_COMUN #####');

var mongoose = require('mongoose');
const _ = require("lodash");

var GastoComunSchema = require('.././models/gastocomun');
var PagoSchema = require('.././models/pagos');
var ServicioSchema = require('.././models/servicios');
mongoose.set('debug', true);

//TODOS LOS GASTOS COMUNES
exports.findAll = async function(req, res){
  console.log('##### FIND ALL GASTO COMUN #####');
  const findAllGc = await GastoComunSchema.find({},'condominio_id gastos_comunes').catch((error) => { 

  console.log(error);
  return res.send(error);
});
  console.log(findAllGc);
  return res.send(findAllGc);
};

//UN GASTO COMUN POR ID Y CONDOMINIO
exports.findByCondo = async function(req, res) {
  console.log('##### FIND GASTO COMUN BY ID #####');
 var idCondo = req.query.idCondo;
 var dni = req.query.dni;
 var result;

 //BUSCAMOS VISITA POR ID Y CONDOMINIO
 const findByCondo = await GastoComunSchema.find({'condominio_id': idCondo},'condominio_id gastos_comunes').catch((error) => { 
    console.log(error);
    return res.sendStatus(500);
  });
  if(findByCondo == null || findByCondo.length == 0){
    result += findByCondo;
    //BUSCAMOS LOS SERVICIOS ASOCIADOS
    const findServicio = await ServicioSchema.find({'servicio_id': result.servicio_id}, 'servicio_id condominio_id descripcion tipo identificador numero_factura_actual monto_factura_actual saldo_pendiente_pagar saldo_pagado fecha_emision fecha_vencimiento documentos observaciones saldo_historia detalle').catch((error) => { 
      
        console.log(error);
        return res.sendStatus(500);
    });
      if(findServicio == null || findServicio.length == 0){
        result += findServicio;

      //VALIDAMOS SI YA SE ENCUENTRA PAGADO EL ULTIMO GASTO COMUN POR EL USUARIO 
      const pagos = await PagoSchema.find({$and: [{'condominio_id': idCondo}, {'pagos.dni': dni}]}, 'pagos').catch((error) => { 

        console.log(error);
        return res.sendStatus(500);
      });
      if(pagos == null || pagos.length == 0){
        result += pagos;
        //ENVIAMOS LAS TRES INFORMACIONES GC, PAGO, SERVICIOS
        return res.status(200).send(result);
      }else{
        console.log('ERROR cargando los pagos de dni: '+dni);
        return res.sendStatus(500);
      }

    }else{
        console.log('ERROR cargando el servicio');
        return res.sendStatus(500);
    }
    
  }else{
    console.log('ERROR cargando el gasto común del condominio: '+idCondo);
    return res.sendStatus(500);
  }

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
exports.update = async function(req, res) {
  console.log('#### UPDATE GASTO COMUN ####');
  req.header("Content-Type", "application/json");

  var data = req.body;
  var idGastoComun = data._id;
  var idCondo = data.condominio_id;
  
  const updateGc = await GastoComunSchema.update({$and: [{'condominio_id': idCondo}, {'gastos_comunes._id':idGastoComun}]}, 
  
  {'$set': {'gastos_comunes.$.fecha_vencimiento': data.fecha_vencimiento, 
  'gastos_comunes.$.documento': data.documento, 
  'gastos_comunes.$.servicio_id': data.servicio_id
  }}).catch((error) => {
          console.log(error);
          return res.send(error);
        });      
        console.log('Updated %d gastos_comunes', updateGc);
        return res.sendStatus(202);
  };
    
    //FUNCION DE AGREGAR GASTOS COMUNES
    exports.add = async function (req, res){
      console.log('#### AGREGAR GASTOS COMUNES ####');

      req.header("Content-Type", "application/json");
      var idCondo = req.params.id;
      var data = req.body;

      const addGc = await GastoComunSchema.updateOne({'condominio_id': idCondo}, {$push: {'gastos_comunes': data} }).catch((error) => { 
        
        console.log("Error actualizando documento. Error fue: "+error);
          return res.sendStatus(500);
      });
        console.log("numberAffected: "+JSON.stringify(addGc));

        if(addGc.nModified == 1){
        console.log("Updated gastos comunes de condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(addGc));
        return res.sendStatus(202);
        }else{
          //INTENTAMOS LA CREACION DEL DOCUMENTO POR PRIMERA VEZ
          //MANIPULACION DE JSON PARA CREACION DEL NUEVO DOCUMENTO SI NO EXISTE
          var dataStringify = JSON.stringify(data);
          dataStringify = "{\"condominio_id\":"+idCondo+", \"gastos_comunes\":["+dataStringify+"]}";
          console.log(dataStringify);
          var dataBody = JSON.parse(dataStringify);

          const addGcCreate = await GastoComunSchema.create(dataBody).catch((error) => { 
            console.log(error);        
                if (error.name === 'MongoError' && error.code === 11000) {
                // Duplicate condominio
                return res.status(500).send('El condominio ya existe.');
              }
              // Some other error
              return res.status(500).send('Ocurrió un error, '+error);
            });
            console.log("Creado condominio: "+idCondo+", con data de gasto comun: "+data+"...... ", addGcCreate);
            return res.sendStatus(200);
        } 
    }

    
    //FUNCION DE ELIMINAR GASTO COMUN
    exports.delete = async function(req, res) {
    console.log('#### DELETE GASTO COMUN ####');
    req.header("Content-Type", "application/json");

    var data = req.body;
    var idCondo = data.condominio_id;
    var idGastoComun = data._id;

    const deleteGc = await GastoComunSchema.update(
      {'condominio_id': idCondo},
      { $pull: { gastos_comunes: { '_id': idGastoComun }}}).catch((error) => { 
        console.log(error);
      });
        return res.send(deleteGc);
    };

