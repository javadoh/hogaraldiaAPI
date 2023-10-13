console.log('##### CARGANDO CONTROLLER DECISIONES #####');

var mongoose = require('mongoose');
const _ = require("lodash");

var DecisionesSchema = require('.././models/decisiones');
var fs = require('fs');
var Utils = require('./utils');

mongoose.set('debug', true);

//TODAS LAS DECISIONES
exports.findAll = function(req, res){
  console.log('##### FIND ALL DECISIONES #####');
  DecisionesSchema.find({},'condominio_id encuestas',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});

};

//TODAS LAS DECISIONES DE UN CONDOMINIO
exports.findAllByCondo = function(req, res){
  console.log('##### FIND ALL DECISIONES BY CONDO #####');
  var idCondo = req.params.id;

  DecisionesSchema.find({'condominio_id': idCondo},'condominio_id encuestas',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}

if(results == null || results.length == 0){
  console.log("RESPONSE: "+JSON.stringify(results));
  return res.status(404).send('Ocurrió un error el resultado es nulo, no existen decisiones.');
  //ESTO SE DEBE MANEJAR PARA NUEVOS
}

console.log("RESPONSE: "+JSON.stringify(results));
  return res.send(results);
});

};

//UNA DECISION POR ID Y CONDOMINIO
exports.findById = function(req, res) {
  console.log('##### FIND DECISION BY ID AND CONDO #####');
 var idDecision = req.query.idDecision;
 var idCondo = req.query.idCondo;
 //BUSCAMOS DECISION POR ID Y CONDOMINIO
 DecisionesSchema.find({$and: [{'condominio_id': idCondo}, {'encuestas._id': idDecision}]}, 'condominio_id encuestas' ,function(err, result) {
  if (err){
    console.log(err);
    return res.send(err);
    
  } 
  if(result == null || result.length == 0){
    return res.sendStatus(404);
  }

  return res.send(filterDecision(result, idDecision));
});
};

function filterDecision(decisionesCondominio, idDecision) {
  var jsonObject;
    _.filter(decisionesCondominio, function(element) {
      _.forEach(element.encuestas, function(entry) {
          if (entry._id == idDecision) {
              jsonObject = JSON.stringify(entry);
          }
      });
  });
  return JSON.parse(jsonObject);
}

//FUNCION DE ACTUALIZAR DATOS DE CONDOMINIO CON PROPUESTAS YA EXISTENTES Y AGREGAR NUEVA
exports.update = function(req, res) {
    console.log('#### UPDATE CONDOMINIO DECISIONES ####');
    req.header("Content-Type", "application/json");

    var data = req.body;
    var idCondo = req.params.idCondo;

  try{
     
    var nombreArchivo = "";
//****************************** SECCION DE COPIADO DE IMAGEN EN SERVIDOR ************************/
  var fileUrl = data._parts[1] != null ? String(data._parts[1]) : null;
  var mkdirp = require('mkdirp');
  //PATH PREDEFINIDO PARA CARGA DE IMAGENES DE EXAMENES INCLUYENDO EL USUARIO POR PARAMETRO
  var serverImagesPath = ".././upload/propuestas/"+idCondo; //"/home/workspace/portal_pitutos/landings/topquiztestpoll/content/"+userLogin;//"./../portal_pitutos/landings/topquiztestpoll/content/"
  try{

    console.log('FILE URL: '+fileUrl);
        //DESDE EL BODY INTENTAMOS CAPTURAR Y ESCRIBIR LAS IMAGENES
        //var base64Data = req.body.replace(/^data:image\/png;base64,/, "");
        //nombreArchivo = fileUrl.substring(fileUrl.lastIndexOf('/', +1), fileUrl.length-1);

        if(fileUrl != null){

        nombreArchivo = fileUrl.substring(fileUrl.lastIndexOf('/'), fileUrl.length-1);
        var stringEncoded = data._parts[2] != null ? String(data._parts[2]) : null;
        var formatoArchivo = nombreArchivo.split('.').pop();
        /*
        var stringEncoded = String(data._parts[3]);
        var formatoArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf(".", +1), nombreArchivo.length);*/
        stringEncoded = stringEncoded.replace(/^data:image\/formatoArchivo;base64,/, "");

        console.log('Nombre Archivo: '+nombreArchivo+' ,Formato Archivo: '+formatoArchivo);
      
        fs.writeFile(serverImagesPath + "/"+"nuevo.png", stringEncoded, 'base64', function(err) {
          if(err) {
          console.log("Error al guardar la imágen en el servidor: ",err);
          return console.log('ERROR no se pudo guardar la imagen en el servidor: ',err);
        } else {
          console.log("Imagen grabada correctamente: "+serverImagesPath + nombreArchivo);
        }
      });

      }else{
        console.log('No vino una imagen para copiar');
      }

  }catch(err){
   console.log("Error general en guardado de imagen: ",err);
  }

  //INGRESO DE DATOS A LA BASE DE DATOS
      var jsonBody = String(data._parts[3]);
      jsonBody = jsonBody.substring(0, jsonBody.length-1);
      console.log(jsonBody);
    
    DecisionesSchema.updateOne({'condominio_id': idCondo}, {$push: {'encuestas': JSON.parse(jsonBody)}}, function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
              
          console.log('Updated condominio, agregada decision: ', JSON.stringify(result));
          return res.status(202).send('Propuesta creada con éxito');
      });
    }catch(err){
      console.log("Error general: ",err);
      return res.status(500).send('Ocurrió un error');
     }
};
    
    //FUNCION DE AGREGAR PRIMERA PROPUESTA Y CREAR EL OBJETO DE CONDOMINIO EN LA COLECCION DECISIONES
exports.add = function (req, res){
  console.log('#### AGREGAR PRIMERA PROPUESTA EN CONDOMINIO PARA DECISION ####');
  var data = req.body;

  try{
      var nombreArchivo = "";
//****************************** SECCION DE COPIADO DE IMAGEN EN SERVIDOR ************************/
  var fileUrl = String(data._parts[1]);
  var idCondo = String(data._parts[4]);
  idCondo = idCondo.substring(0, idCondo.length-1);

  var mkdirp = require('mkdirp');
  //PATH PREDEFINIDO PARA CARGA DE IMAGENES DE EXAMENES INCLUYENDO EL USUARIO POR PARAMETRO
  var serverImagesPath = ".././upload/propuestas/"+idCondo; //"/home/workspace/portal_pitutos/landings/topquiztestpoll/content/"+userLogin;//"./../portal_pitutos/landings/topquiztestpoll/content/"
  try{
      if (!fs.existsSync(serverImagesPath)){
            //CREAMOS EL DIRECTORIO DEL USUARIO
            console.log("no existe el directorio de condominio");
            mkdirp(serverImagesPath, function (err) {
              if (err){ console.error(err);
                console.log('Error: ',err);
              }else {console.log('directorio de condominio: '+idCondo+ ' creado!');
      }
            });
      }
      else{console.log("Ya existe el directorio de condominio");
      }

        //DESDE EL BODY INTENTAMOS CAPTURAR Y ESCRIBIR LAS IMAGENES
        //var base64Data = req.body.replace(/^data:image\/png;base64,/, "");
        //nombreArchivo = fileUrl.substring(fileUrl.lastIndexOf('/', +1), fileUrl.length-1);
        nombreArchivo = fileUrl.substring(fileUrl.lastIndexOf('/'), fileUrl.length-1);
        var stringEncoded = String(data._parts[2]);
        var formatoArchivo = nombreArchivo.split('.').pop();
        /*
        var stringEncoded = String(data._parts[3]);
        var formatoArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf(".", +1), nombreArchivo.length);*/
        stringEncoded = stringEncoded.replace(/^data:image\/formatoArchivo;base64,/, "");

        console.log('Nombre Archivo: '+nombreArchivo+' ,Formato Archivo: '+formatoArchivo);
      
        fs.writeFile(serverImagesPath + "/"+"nuevo.png", stringEncoded, 'base64', function(err) {
          if(err) {
          console.log("Error al guardar la imágen en el servidor: ",err);
          return console.log('ERROR no se pudo guardar la imagen en el servidor: ',err);
        } else {
          console.log("Imagen grabada correctamente: "+serverImagesPath + nombreArchivo);
        }
      });
  }catch(err){
   console.log("Error general en guardado de imagen: ",err);
  }

  //INGRESO DE DATOS A LA BASE DE DATOS
      var jsonBody = String(data._parts[3]);
      jsonBody = jsonBody.substring(0, jsonBody.length-1);
      console.log(jsonBody);
      DecisionesSchema.create(JSON.parse(jsonBody), function (err, result) {
        
        if (err){
          if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate condominio
            return res.status(500).send('El condominio ya existe.');
          }

          console.log("Error actualizando documento. Error fue: "+err);
          return res.status(500).send('Ha ocurrido un error en el servidor.');
        }   

        return res.status(202).send(result);
      });   
    }catch(err){
      console.log("Error general: ",err);
      return response;
     }
}
    
    //FUNCION DE ELIMINAR DECISIONES
    exports.delete = function(req, res) {
        console.log('#### DELETE DECISION ####');
        req.header("Content-Type", "application/json");

    var data = req.body;
    var idCondo = data.condominio_id;
    var idDecision = data._id;

    DecisionesSchema.updateOne(
      {'condominio_id': idCondo},
      { $pull: { encuestas: { '_id': idDecision }}} ,function(result) {
        return res.send(result);
    });
    };


//FUNCION DE ACTUALIZAR VOTOS DE DECISIONES
exports.addVote = function(req, res) {
  console.log('#### UPDATE DECISION FOR VOTE ####');
  req.header("Content-Type", "application/json");

  var idCondo = req.query.idCondominio;
  var idDecision = req.query.idPropuesta;
  var data = req.body;

  //VALIDACION DE TOKEN DE CABECERA ESTATICO
  const token = req.headers["authorization"];
  const contentype = req.headers["content-type"];

  if(!token || token != 'sRrAup0z^k+!W~t~u^=lme/Re&=^Sof8e.><q{4q@_G4ExVgXH`Kry2n|CS_Z'){
    return res.status(401).send("¡Acceso denegado!");
  }
  if(!contentype || !contentype.indexOf('application/json') == -1){
    return res.status(400).send("Contenido no permitido");
  }
  
  DecisionesSchema.updateOne({$and: [{'condominio_id': idCondo}, {'encuestas._id':idDecision}]},  
  {'$push': {'encuestas.$.votos': data}}, function (err, numberAffected) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
            
        console.log('Updated %d decisiones voto', numberAffected);
        return res.sendStatus(202);
    });
  };


  /**
   * 
   * exports.update = function(req, res) {
    console.log('#### UPDATE CONDOMINIO DECISIONES ####');
    req.header("Content-Type", "application/json");

    var data = req.body;
    var idDecision = data._id;
    var idCondo = data.condominio_id;
    
    DecisionesSchema.update({$and: [{'condominio_id': idCondo}, {'encuestas._id':idDecision}]}, 
    
    {'$set': {'encuestas.$.titulo': data.titulo, 
    'encuestas.$.fecha_actualizacion': data.fecha_actualizacion, 
    'encuestas.$.votos': data.votos,
    'encuestas.$.opciones_respuestas': data.opciones_respuestas,
    'encuestas.$.usuario_registra': data.usuario_registra}}, function (err, numberAffected) {
          if (err) {
            console.log(err);
            return res.send(err);
          }
              
          console.log('Updated %d decisiones', numberAffected);
          return res.sendStatus(202);
      });
    };
   */

