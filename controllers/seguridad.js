console.log('##### CARGANDO CONTROLLER SEGURIDAD #####');

var mongoose = require('mongoose');
const _ = require("lodash");

var SeguridadSchema = require('.././models/seguridad');
mongoose.set('debug', true);

//TODOS LOS ITEMS DE SEGURIDAD
exports.findAll = function(req, res){
  console.log('##### FIND ALL ITEMS SEGURIDAD #####');
  SeguridadSchema.find({},'condominio_id seguridad_items',function(err, results){

if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});
};

//UN ITEM SEGURIDAD POR ID Y CONDOMINIO
exports.findById = function(req, res) {
  console.log('##### FIND ITEM SEGURIDAD BY ID #####');
 var idItem = req.query.labelItem;
 var idCondo = req.query.idCondo;
 //BUSCAMOS ITEM SEGURIDAD POR ID Y CONDOMINIO
 SeguridadSchema.find({'condominio_id': idCondo},'condominio_id seguridad_items',function(err, result) {
  if (err){
    console.log(err);
    return res.send(err);
  }
  if(result == null || result.length == 0){
    return res.sendStatus(404);
  }

  var filtroItems = filterSeguridad(result, idItem);
  console.log(filtroItems);
  return filtroItems != null ? res.send(filtroItems) : res.sendStatus(404);

  });
};

function filterSeguridad(seguridadCondominio, idItem) {
  var jsonObject;

  try{
    _.filter(seguridadCondominio, function(element) {
      _.forEach(element.seguridad_items, function(entry) {

        if(entry['botonPanico']){
          if('botonPanico' == idItem){
            jsonObject = JSON.stringify(entry.botonPanico);
          }
        }

        if(entry['path_hardware_portal']){
          if('path_hardware_portal' == idItem){
            jsonObject = JSON.stringify(entry.path_hardware_portal);
          }
        }

        if(entry['policia']){
          if('policia' == idItem){
            jsonObject = JSON.stringify(entry.policia);
          }
        }

        if(entry['bomberos']){
          if('bomberos' == idItem){
            jsonObject = JSON.stringify(entry.bomberos);
          }
        }

        if(entry['emergencias']){
          if('emergencias' == idItem){
            jsonObject = JSON.stringify(entry.emergencias);
          }
        }

      });
  });
  if(jsonObject != null){
  return JSON.parse(jsonObject);
  }else{
    return null;
  }

}catch(err){
  console.log(err);
  return null;}
}
    
   //FUNCION DE AGREGAR SEGURIDAD ITEMS // DEBE RECIBIR SIEMPRE EL CONDOMINIO_ID EN EL BODY
   exports.add = function (req, res){
    console.log('#### AGREGAR ITEMS SEGURIDAD ####');
    req.header("Content-Type", "application/json");
    var data = req.body;

    SeguridadSchema.create(data, function (err, result) {
          if (err) {
          console.log(err);        
              if (err.name === 'MongoError' && err.code === 11000) {
              // Duplicate condominio
              return res.status(500).send('El condominio/seguridad ya existe.');
            }
            // Some other error
            return res.status(500).send('Ocurrió un error, '+err);
          }
          console.log("Creado items de seguridad de condominio con data: "+data+"...... ", result);
          return res.sendStatus(200);
        });    
  }


  //FUNCION QUE AGREGA TODO TIPO DE ITEMS DE SEGURIDAD DINAMICAMENTE HACIENDO PUSH AL ARREGLO SEGURIDAD ITEMS
  exports.update = function(req, res){
      console.log('#### UPDATE ITEMS SEGURIDAD ####');

      req.header("Content-Type", "application/json");
      var data = req.body;
      var idCondo = req.params.id;

      SeguridadSchema.updateOne({'condominio_id': idCondo}, {$push: {'seguridad_items': data} }, function (err, numberAffected) {
        
        console.log("numberAffected: "+JSON.stringify(numberAffected));
        
        if (err){
          console.log("Error actualizando documento seguridad. Error fue: "+err);
          return res.sendStatus(500);
        }

        if(numberAffected.nModified == 1){
        console.log("Updated de seguridad condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(numberAffected));
        return res.sendStatus(202);
        }else{
        return res.sendStatus(404);
        }
      });  
  }
    
  //FUNCION DE ELIMINAR GASTO COMUN
  exports.delete = function(req, res) {
    console.log('#### DELETE SEGURIDAD ITEMS ####');
    req.header("Content-Type", "application/json");

    var data = req.body;
    var idCondo = data.condominio_id;
    var idSeguridadItem = data.item;
    var idLabelItem = data.labelItem;

    if(idLabelItem == 'botonPanico'){
          SeguridadSchema.update({'condominio_id': idCondo},
          { $pull: { seguridad_items: { botonPanico: idSeguridadItem }}} ,function(result) {
            return res.send(result);
        });
    }
    
    if(idLabelItem == 'path_hardware_portal'){
        SeguridadSchema.update({'condominio_id': idCondo},
        { $pull: { seguridad_items: { path_hardware_portal: idSeguridadItem }}} ,function(result) {
          return res.send(result);
      });
    }
    
    if(idLabelItem == 'policia'){
      SeguridadSchema.update({'condominio_id': idCondo},
      { $pull: { seguridad_items: { 'policia.nombre': idSeguridadItem }}} ,function(result) {
        return res.send(result);
      });
    }
    
    if(idLabelItem == 'bomberos'){
      SeguridadSchema.update({'condominio_id': idCondo},
      { $pull: { seguridad_items: { 'bomberos.id': idSeguridadItem }}} ,function(result) {
        return res.send(result);
      });
    }
    
    if(idLabelItem == 'emergencias'){
      SeguridadSchema.update({'condominio_id': idCondo},
      { $pull: { seguridad_items: { 'emergencias.id': idSeguridadItem }}} ,function(result) {
        return res.send(result);
      });
    }
  };

