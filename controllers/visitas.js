console.log('##### CARGANDO CONTROLLER VISITAS #####');

var mongoose = require('mongoose');
const _ = require("lodash");

var VisitaSchema = require('.././models/visitas');
mongoose.set('debug', true);

//TODAS LAS VISITAS
exports.findAll = function(req, res){
  console.log('##### FIND ALL VISITAS #####');
  VisitaSchema.find({},'condominio_id visitas',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});

};

//UNA VISITA POR ID Y CONDOMINIO
exports.findById = function(req, res) {
  console.log('##### FIND VISITA BY ID #####');
 var idVisita = req.query.idVisita;
 var idCondo = req.query.idCondo;
 //BUSCAMOS VISITA POR ID Y CONDOMINIO
 VisitaSchema.find({'condominio_id': idCondo},'condominio_id visitas',function(err, result) {
  if (err){
    console.log(err);
    return res.send(err);
  }
  if(result == null || result.length == 0){
    return res.sendStatus(404);
  }

  return res.send(filterVisita(result, idVisita));
  });
};

function filterVisita(visitasCondominio, idVisita) {
  var jsonObject;
    _.filter(visitasCondominio, function(element) {
      _.forEach(element.visitas, function(entry) {
          if (entry._id == idVisita) {
              jsonObject = JSON.stringify(entry);
          }
      });
  });
  return JSON.parse(jsonObject);
}


//FUNCION DE ACTUALIZAR DATOS DE VISITAS
exports.update = function(req, res) {
  console.log('#### UPDATE VISITAS ####');
  req.header("Content-Type", "application/json");

  var data = req.body;
  var idVisita = data._id;
  var idCondo = data.condominio_id;
  
  VisitaSchema.update({$and: [{'condominio_id': idCondo}, {'visitas._id':idVisita}]}, 
  
  {'$set': {'visitas.$.dni': data.dni, 
  'visitas.$.nombres': data.nombres, 
  'visitas.$.apellidos': data.apellidos,
  'visitas.$.hora': data.hora,
  'visitas.$.vehiculo_id': data.vehiculo_id}}, function (err, numberAffected) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
            
        console.log('Updated %d visitas', numberAffected);
        return res.sendStatus(202);
    });
  };
    
    //FUNCION DE AGREGAR VISITAS
    exports.add = function (req, res){
      console.log('#### AGREGAR VISITA ####');

      req.header("Content-Type", "application/json");
      var idCondo = req.params.id;
      var data = req.body;

      VisitaSchema.updateOne({'condominio_id': idCondo}, {$push: {'visitas': data} }, function (err, numberAffected) {
        
        console.log("numberAffected: "+JSON.stringify(numberAffected));
        
        if (err){
          console.log("Error actualizando documento. Error fue: "+err);
          return res.sendStatus(500);
        }

        if(numberAffected.nModified == 1){
        console.log("Updated visita de condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(numberAffected));
        return res.sendStatus(202);
        }else{
          //INTENTAMOS LA CREACION DEL DOCUMENTO POR PRIMERA VEZ
          //MANIPULACION DE JSON PARA CREACION DEL NUEVO DOCUMENTO SI NO EXISTE
          var dataStringify = JSON.stringify(data);
          dataStringify = "{\"condominio_id\":"+idCondo+", \"visitas\":["+dataStringify+"]}";
          console.log(dataStringify);
          var dataBody = JSON.parse(dataStringify);

          VisitaSchema.create(dataBody, function (err, result) {
            if (err) {
            console.log(err);        
                if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate condominio
                return res.status(500).send('El condominio ya existe.');
              }
              // Some other error
              return res.status(500).send('Ocurrió un error, '+err);
            }
            console.log("Creado condominio: "+idCondo+", con data de visita: "+data+"...... ", result);
            return res.sendStatus(200);
          });  
        }
      });   
    }

    
    //FUNCION DE ELIMINAR VISITAS
    exports.delete = function(req, res) {
    console.log('#### DELETE VISITA ####');
    req.header("Content-Type", "application/json");

    var data = req.body;
    var idCondo = data.condominio_id;
    var idVisita = data._id;

    VisitaSchema.update(
      {'condominio_id': idCondo},
      { $pull: { visitas: { '_id': idVisita }}} ,function(result) {
        return res.send(result);
    });
    };

