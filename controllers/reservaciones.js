console.log('##### CARGANDO CONTROLLER RESERVACIONES #####');

var mongoose = require('mongoose');
const _ = require("lodash");

var ReservaSchema = require('.././models/reservaciones');
mongoose.set('debug', true);

//TODAS LAS RESERVAS
exports.findAll = function(req, res){
  console.log('##### FIND ALL RESERVAS #####');
  ReservaSchema.find({},'condominio_id reservaciones',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});
};

//TODAS LAS RESERVAS DEL CONDOMINIO EN EL AÑO
exports.findAllQuinchosByCondoYear = function(req, res){
  var idCondo = req.query.idCondo;
  var idQuincho = req.query.idQuincho;

  ReservaSchema.aggregate([
  {$unwind:"$reservaciones"},
  {$match:{"condominio_id": Number(idCondo), "reservaciones.reserva_tipo":'quincho', "reservaciones.id_reserva_tipo": Number(idQuincho)}},
  {$project: {_id: 0, condominio_id: 0, 'reservaciones.reserva_tipo': 0, 'reservaciones.fecha_solicitada': 0, 'reservaciones.fecha_cancelacion_reserva': 0}}
  ], function (err, results){
  if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
      console.log(results);
      return res.status(200).send(results);
  });
}

//TODAS LAS RESERVAS DEL CONDOMINIO EN EL AÑO
exports.findAllEstacionamientosByCondoYear = function(req, res){
  var idCondo = req.query.idCondo;
  var idEstacionamiento = req.query.idEstacionamiento;

  ReservaSchema.aggregate([
    {$unwind:"$reservaciones"},
    {$match:{"condominio_id": Number(idCondo), "reservaciones.reserva_tipo":'estacionamiento', "reservaciones.id_reserva_tipo": Number(idEstacionamiento)}},
    {$project: {_id: 0, condominio_id: 0, 'reservaciones.reserva_tipo': 0, 'reservaciones.fecha_solicitada': 0, 'reservaciones.fecha_cancelacion_reserva': 0}}
    ], function (err, results){
  if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
      return res.status(200).send(results);
  });
}

//TODAS LAS RESERVAS DEL CONDOMINIO EN EL AÑO
exports.findAllPartHallByCondoYear = function(req, res){
  var idCondo = req.query.idCondo;
  var maxDate = req.query.maxDate;

  ReservaSchema.aggregate([
    {$unwind:"$reservaciones"},
    {$match:{"condominio_id": Number(idCondo), "reservaciones.reserva_tipo":'salaFiesta'}},
    {$project: {_id: 0, condominio_id: 0, 'reservaciones.reserva_tipo': 0, 'reservaciones.fecha_solicitada': 0, 'reservaciones.fecha_cancelacion_reserva': 0}}
    ], function (err, results){
  if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
      return res.status(200).send(results);
  });
}

//TODAS LAS RESERVAS DEL CONDOMINIO EN EL AÑO
exports.findAllByCondoAndUserYear = function(req, res){
  var idCondo = req.query.idCondo;
  var idUserDni = req.query.idUserDni;

  ReservaSchema.aggregate([
   {$unwind:"$reservaciones"},
   {$match:{"condominio_id": Number(idCondo), "reservaciones.dni":Number(idUserDni)}},
   {$project: {_id: 0, condominio_id: 0}}
 ], function (err, results){
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
      return res.status(200).send(results);
  });
}

//UNA RESERVA POR ID Y CONDOMINIO
exports.findById = function(req, res) {
  console.log('##### FIND RESERVA BY ID #####');
 var idReserva = req.query.idReserva;
 var idCondo = req.query.idCondo;
 //BUSCAMOS RESERVA POR ID Y CONDOMINIO
 ReservaSchema.find({'condominio_id': idCondo},'condominio_id reservaciones',function(err, result) {
  if (err){
    console.log(err);
    return res.send(err);
  }
  if(result == null || result.length == 0){
    return res.sendStatus(404);
  }

  return res.send(filterReserva(result, idReserva));
  });
};

function filterReserva(reservasCondominio, idReserva) {
  var jsonObject;
    _.filter(reservasCondominio, function(element) {
      _.forEach(element.reservaciones, function(entry) {
          if (entry._id == idReserva) {
              jsonObject = JSON.stringify(entry);
          }
      });
  });
  return JSON.parse(jsonObject);
}


//FUNCION DE ACTUALIZAR DATOS DE RESERVAS
exports.update = function(req, res) {
  console.log('#### UPDATE RESERVAS ####');
  req.header("Content-Type", "application/json");

  var data = req.body;
  var idCondo = req.params.idCondo;
  
  ReservaSchema.updateOne({'condominio_id': idCondo}, 
  {$push: {'reservaciones': data}
  }, function (err, numberAffected) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
            
        console.log('Updated %d reservas', numberAffected);
        return res.sendStatus(202);
    });
  };
    
    //FUNCION DE AGREGAR RESERVAS
    exports.add = function (req, res){
      console.log('#### AGREGAR RESERVA ####');

      req.header("Content-Type", "application/json");
      var idCondo = req.params.idCondo;
      var data = req.body;

      ReservaSchema.updateOne({'condominio_id': idCondo}, {$push: {'reservaciones': data} }, function (err, numberAffected) {
        
        console.log("numberAffected: "+JSON.stringify(numberAffected));
        
        if (err){
          console.log("Error actualizando documento. Error fue: "+err);
          //return res.sendStatus(500);
        }

        if(numberAffected.nModified == 1){
        console.log("Updated reserva de condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(numberAffected));
        return res.sendStatus(202);
        }else{
          //INTENTAMOS LA CREACION DEL DOCUMENTO POR PRIMERA VEZ
          //MANIPULACION DE JSON PARA CREACION DEL NUEVO DOCUMENTO SI NO EXISTE
          var dataStringify = JSON.stringify(data);
          dataStringify = "{\"condominio_id\":"+idCondo+", \"reservaciones\":["+dataStringify+"]}";
          console.log(dataStringify);
          var dataBody = JSON.parse(dataStringify);

          ReservaSchema.create(dataBody, function (err, result) {
            if (err) {
            console.log(err);        
                if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate condominio
                return res.status(500).send('El condominio ya existe.');
              }
              // Some other error
              return res.status(500).send('Ocurrió un error, '+err);
            }
            console.log("Creado condominio: "+idCondo+", con data de reserva: "+data+"...... ", result);
            return res.sendStatus(200);
          });  
        }
      });
    }

    
    //FUNCION DE ELIMINAR RESERVAS
    exports.delete = function(req, res) {
    console.log('#### DELETE RESERVA ####');
    req.header("Content-Type", "application/json");

    var idCondo = req.query.idCondo;
    var idReserva = req.query.idReserva;

    ReservaSchema.updateOne(
      {'condominio_id': idCondo},
      { $pull: { reservaciones: { '_id': idReserva }}} ,function(err, result) {
        if (err) {
          console.log(err);
          return res.status(404).send(err);
        }
        return res.sendStatus(202);
    });
    };