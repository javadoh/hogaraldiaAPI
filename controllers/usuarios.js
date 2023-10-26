console.log('##### LLEGO A CONTROLLER #####');

var mongoose = require('mongoose');
var UsuarioSchema = require('.././models/usuarios');
var UsuarioVisitaSchema = require('.././models/usuariosvisita');
mongoose.set('debug', true);
var fs = require('fs');
var Utils = require('./utils');

//############## ON BOARD ################//
//FUNCION ONBOARD PUT DE EMAIL, RUT E IMEI, VALIDADOR DE RUT Y RESPUESTA CLIENTE, CLIENTE REPETIDO O VISITANTE.
exports.getDniUserOnBoard = async function (req, res){
console.log('#### GET INIT DNI ON BOARD');
console.log(req.headers);

//VALIDACION DE TOKEN DE CABECERA ESTATICO
const token = req.headers["authorization"];
const contentype = req.headers["content-type"];

  if(!token || token != 'sRrAup0z^k+!W~t~u^=lme/Re&=^Sof8e.><q{4q@_G4ExVgXH`Kry2n|CS_Z'){
    return res.status(401).send("¡Acceso denegado!");
  }
  if(!contentype || !contentype.indexOf('application/json') == -1){
    return res.status(400).send("Contenido no permitido");
  }

//RETORNA OBJETO DE USUARIO SI EXISTE DNI
var dni = req.params.dni;
console.log("DNI: "+dni);
var dniNumber = parseInt(dni);
console.log("DNI NUMBER: "+dniNumber);

 const getDniUserOnBoard = await UsuarioSchema.findOne({'dni': dniNumber},'usuario_id nombres apellidos email dni dv unidad rol profesion ocupacion telefono_contacto servicios_productos condominio_id telefono_asignado sugerencias reclamos').catch((error) => {
    console.log('ERROR: '+error);
    return res.status(500).send(error);
  });
  
  console.log("RESPONSE BACKENDDDDDDDDDDDDDDDDDDDDDDDDDDDDD: "+JSON.stringify(getDniUserOnBoard));

  if(getDniUserOnBoard != null){
    return res.status(200).send(getDniUserOnBoard);
  }else{
    return res.status(404).send('No se encontró el usuario');
  }
};

//FUNCION POST DE DATOS EMAIL, DNI, IMEI DE USUARIO NO ENCONTRADO EN BASE DE DATOS COMO CLIENTE
exports.postUserGuessOnBoard = async function (req, res){
  console.log('ADD USUARIO VISITANTE ON BOARD');

  req.get.headers
//VALIDACION DE TOKEN DE CABECERA ESTATICO
const token = req.headers["authorization"];
const contentype = req.headers["content-type"];
  if(!token || token != 'sRrAup0z^k+!W~t~u^=lme/Re&=^Sof8e.><q{4q@_G4ExVgXH`Kry2n|CS_Z'){
    return res.status(401).send("¡Acceso denegado!");
  }
  if(!contentype || !contentype.indexOf('application/json') == -1){
    return res.status(400).send("Contenido no permitido");
  }

  var data = req.body;
	const postUserGuessOnBoard = await UsuarioVisitaSchema.create(data).catch((error) => {
    console.log(error);
		if (error.name === 'MongoError' && error.code === 11000) {
        // Duplicate username
        return res.status(500).send('Error agregando el usuario visitante a la base de datos, ya existe.');
      }
      // Some other error
      return res.status(500).send('Ocurrió un error, '+error);
	});
    return res.send(postUserGuessOnBoard);
}

//ACTUALIZA DATOS DE UN USUARIO EXISTENTE AGREGANDO EL IMEI Y EL EMAIL SEGUN DNI
exports.putEmailImeiOnBoard = async function (req, res){
console.log('UPDATE IMEI Y EMAIL DE USUARIO EXISTENTE ON BOARD');

//VALIDACION DE TOKEN DE CABECERA ESTATICO
const token = req.headers["authorization"];
const contentype = req.headers["content-type"];
  if(!token || token != 'sRrAup0z^k+!W~t~u^=lme/Re&=^Sof8e.><q{4q@_G4ExVgXH`Kry2n|CS_Z'){
    return res.status(401).send("¡Acceso denegado!");
  }
  if(!contentype || !contentype.indexOf('application/json') == -1){
    return res.status(400).send("Contenido no permitido");
  }

var usuarioId = req.params.usuarioId;
var data = req.body;

console.log('usuarioId: '+usuarioId+', data: '+JSON.stringify(data));

const putEmailImeiOnBoard = await UsuarioSchema.updateOne({"usuario_id":usuarioId}, {telefono_asignado: data.telefonoAsignado, email: data.email}).catch((error) => { 
		console.log(error);
		return res.send(error);
	  });
    return res.send(putEmailImeiOnBoard);
};
//############## FIN ON BOARD ################//

//TODOS LOS USUARIOS
exports.findVisitasAll = async function(req, res){
  console.log('##### FIND USUARIOS VISITA ALL #####');
  const findVisitasAll = await UsuarioVisitaSchema.find({},'email dni dv').catch((error) => { 
  
  console.log(error);
  return res.send(error);
});
  console.log(findVisitasAll);
  return res.send(findVisitasAll);
};

//TODOS LOS USUARIOS
exports.findAll = async function(req, res){
  console.log('##### FIND ALL #####');
  const findAllUsers = await UsuarioSchema.find({},'usuario_id nombres apellidos email dni dv unidad rol profesion ocupacion telefono_contacto servicios_productos condominio_id telefono_asignado sugerencias reclamos').catch((error) => {
  
  console.log(error);
  return res.send(error);
});
  console.log(findAllUsers);
  return res.send(findAllUsers);
};

exports.findAllByCondo = async function (req, res){
  var id = req.params.id;
  console.log('##### FIND ALL BY CONDO #####');
 const findAllByCondo = await UsuarioSchema.find({'condominio_id': id},'usuario_id nombres apellidos email dni dv unidad rol profesion ocupacion telefono_contacto servicios_productos condominio_id telefono_asignado sugerencias reclamos').catch((error) => {
  
  console.log(error);
  return res.send(error);
 });
  console.log(findAllByCondo);
  return res.send(findAllByCondo);
}

//UN USUARIO POR ID
exports.findById = async function(req, res) {
  console.log('##### FIND BY ID #####');
 var id = req.params.id;
 const findById = await UsuarioSchema.findOne({'usuario_id':id},'usuario_id nombres apellidos email dni dv unidad rol profesion ocupacion telefono_contacto servicios_productos condominio_id telefono_asignado sugerencias reclamos').catch((error) => { 

    console.log(error);
    return res.send(error);
  });
    return res.send(findById);
};

exports.putUserSugerencia = async function(req, res){
  console.log('###### ADD NEW SUGERENCIA ######');

  //VALIDACION DE TOKEN DE CABECERA ESTATICO
const token = req.headers["authorization"];
const contentype = req.headers["content-type"];
console.log("CONTENT TYPE EN REST PUT USER SUGERENCIA: "+contentype);

  if(!token || token != 'sRrAup0z^k+!W~t~u^=lme/Re&=^Sof8e.><q{4q@_G4ExVgXH`Kry2n|CS_Z'){
    return res.status(401).send("¡Acceso denegado!");
  }
  if(!contentype || !contentype.indexOf('application/json') == -1){
    return res.status(400).send("Contenido no permitido");
  }

  var userId = req.params.usuarioId;
  var data = req.body;

  try{
  
    const putUserSugerencia = await UsuarioSchema.updateOne({'usuario_id':userId}, {$push: {'sugerencias': data} }).catch((error) => { 
       return console.log(error);
      });
       console.log("Updated usuario sugerencia: "+userId+", con data: "+data+"...... ", putUserSugerencia);
       return res.send(putUserSugerencia);
   
   }catch(err){console.log(err);}

}

exports.putUserReclamo = async function(req, res){
  console.log('###### ADD NEW RECLAMO ######');
  var userId = req.params.usuarioId;
  var data = req.body;

  try{
    //console.log(req.file);//this will be automatically set by multer
    //console.log(data);
    //below code will read the data from the upload folder. Multer     will automatically upload the file in that folder with an  autogenerated name
    /*fs.readFile(req.file.path,(err, contents)=> {
    if (err) {
    console.log('Error: ', err);
    }else{
    console.log('File contents ',contents);
    }
    });*/
  
    //console.log('DATA: '+JSON.stringify(data));
    console.log('DATA PARTS MESSAGE: '+data._parts[0]);

    console.log("DATA PARTS LENGTH: "+data._parts.length);

    var message = String(data._parts[0]);
    var nombreArchivo = "";

//****************************** SECCION DE COPIADO DE IMAGEN EN SERVIDOR ************************/
if(data._parts.length > 2){

  var fileUrl = String(data._parts[2]);

  var mkdirp = require('mkdirp');
  //PATH PREDEFINIDO PARA CARGA DE IMAGENES DE EXAMENES INCLUYENDO EL USUARIO POR PARAMETRO
  var serverImagesPath = ".././upload/reclamos/"+userId; //"/home/workspace/portal_pitutos/landings/topquiztestpoll/content/"+userLogin;//"./../portal_pitutos/landings/topquiztestpoll/content/"
  try{
      if (!fs.existsSync(serverImagesPath)){
            //CREAMOS EL DIRECTORIO DEL USUARIO
            console.log("no existe el directorio de usuario");
            mkdirp(serverImagesPath, function (err) {
              if (err){ console.error(err);
                console.log('Error: ',err);
              }else {console.log('directorio de usuario: '+userId+ ' creado!');
      }
            });
      }
      else{console.log("Ya existe el directorio de usuario");
      }

        //DESDE EL BODY INTENTAMOS CAPTURAR Y ESCRIBIR LAS IMAGENES
        //var base64Data = req.body.replace(/^data:image\/png;base64,/, "");
        //nombreArchivo = fileUrl.substring(fileUrl.lastIndexOf('/', +1), fileUrl.length-1);
        nombreArchivo = fileUrl.substring(fileUrl.lastIndexOf('/'), fileUrl.length-1);

        var stringEncoded = String(data._parts[3]);
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

}
      //***********************************************************************************************/

      var dataBody = "{\"message\":\""+message.substring(0, message.length-1)+"\", \"imageUrl\":\""+nombreArchivo+"\"}";
      console.log('DataBody: '+dataBody);
      var dataBodyJson = JSON.parse(dataBody);

      const putUserReclamo = await UsuarioSchema.updateOne({'usuario_id':userId}, {$push: {reclamos: dataBodyJson} }).catch((error) => { 
        console.log("Updated usuario reclamo: "+userId+", Rows: "+ putUserReclamo);
        return res.send(error);
      });
        return res.send(putUserReclamo);
   
   }catch(err){console.log(err);}
}


/*exports.putImage = function(req, res){
  console.log('###### ADD NEW RECLAMO ######');
  var userId = req.params.usuarioId;
  var data = req.body;

  try{

    console.log(req.file);//this will be automatically set by multer
    console.log(data);
    //below code will read the data from the upload folder. Multer     will automatically upload the file in that folder with an  autogenerated name
    fs.readFile(req.file.path,(err, contents)=> {
    if (err) {
    console.log('Error: ', err);
    }else{
    console.log('File contents ',contents);
    }
    });
  
    UsuarioSchema.updateOne({'usuario_id':userId}, {$push: {'reclamos.message': data.message, 'reclamos.image': data.fileData.name} }, function (err, numberAffected) {
       if (err) return console.log(err);
       console.log("Updated usuario reclamo: "+userId+", con data: "+data+"...... ", numberAffected);
       return res.send(numberAffected);
   });
   
   }catch(err){console.log(err);}
}*/


//FUNCION DE LOGIN
/*exports.login = function(req, res) {
  console.log('##### LOGIN #####');
 var userLogin = req.query.login;
 var userPassword = req.query.password;
 
 UsuarioSchema.findOne({$and: [{'login':userLogin },{'password':userPassword}]},'usuario_id nombres apellidos email dni login password unidad rol profesion ocupacion servicios_productos condominio_id',function(err, result) {
  if (err) {
    console.log(err);
	return res.send(err);
  }
  
  if(result == null){
    return  res.sendStatus(404);
  }
    return res.send(result);
  });
};*/

//FUNCION DE ACTUALIZAR DATOS DE USUARIOS EN LA APLICACION
exports.update = async function(req, res) {
console.log('#### UPDATE USER ####');
var id = req.params.id;
var data = req.body;

const updateUser = await UsuarioSchema.update({"usuario_id":id}, data).catch((error) => { 
		console.log(error);
		return res.send(error);
	  });
		  
      console.log('Updated %d usuarios', updateUser);
      return res.sendStatus(202);
};

//FUNCION DE AGREGAR USUARIOS A LA APLICACION
exports.add = async function (req, res){
  var data = req.body;
	const addUser = await UsuarioSchema.create(data).catch((error) => { 
    console.log(error);
		
		if (error.name === 'MongoError' && error.code === 11000) {
        // Duplicate username
        return res.status(500).send('El email o el login del usuario ya existe, por favor escoge otro.');
      }
      // Some other error
      return res.status(500).send('Ocurrió un error, '+error);
	  });
    return res.send(addUser);
};

//FUNCION DE ELIMINAR USUARIOS EN LA APLICACION POR USER_ID
exports.delete = async function(req, res) {
var id = req.params.id;
const deleteUser = await UsuarioSchema.remove({'usuario_id':id}).catch((error) => { 
    return res.send(error);
  });
  return res.send(deleteUser);
};


function copyImageToServer (userId, dataBody) {
  console.log("############### ENTRO EN COPYEXAMIMAGESTOSERVER ######################");
  var mkdirp = require('mkdirp');
  //PATH PREDEFINIDO PARA CARGA DE IMAGENES DE EXAMENES INCLUYENDO EL USUARIO POR PARAMETRO
  var serverImagesPath = ".././upload/reclamos/"+userId; //"/home/workspace/portal_pitutos/landings/topquiztestpoll/content/"+userLogin;//"./../portal_pitutos/landings/topquiztestpoll/content/"
  var response = false;
  try{
  if (!fs.existsSync(serverImagesPath)){
        //CREAMOS EL DIRECTORIO DEL USUARIO
        console.log("no existe el directorio de usuario");
        mkdirp(serverImagesPath, function (err) {
          if (err){ console.error(err);
          return response;
          }else {console.log('directorio de usuario creado!');
  }
        });
  }
  else{console.log("Ya existe el directorio de usuario");
  }

  let fileUrlStr = String(dataBody._parts[2]);
    //DESDE EL BODY INTENTAMOS CAPTURAR Y ESCRIBIR LAS IMAGENES
    //var base64Data = req.body.replace(/^data:image\/png;base64,/, "");
    var nombreArchivo = fileUrlStr.substring(fileUrlStr.lastIndexOf('/'), fileUrlStr.length-1);
    var stringEncoded = String(dataBody._parts[3]);
    var formatoArchivo = nombreArchivo.lastIndexOf(".", +1);
    stringEncoded = stringEncoded.replace(/^data:image\/formatoArchivo;base64,/, "");
  
    fs.writeFile(serverImagesPath + nombreArchivo, stringEncoded, 'base64', function(err) {
      if(err) {
      console.log("Error al guardar la imágen en el servidor: ",err);
    } else {
      console.log("Imagen grabada correctamente: "+serverImagesPath + nombreArchivo);
    }
  });
  
  }catch(err){
   console.log("Error general: ",err);
   return response;
  }
};
  

//FUNCION DE AYUDA PARA ENVIAR PASSWORD A EMAIL
/*exports.findUserForgotPassword = function(req, res) {
console.log('# FIND USER FORGOT PASSWORD #');
 var email = req.params.email;
 var emailPrefix, emailSufix;
 var prefixEmailDivision = email.indexOf("@");
 emailPrefix = email.substring(0, prefixEmailDivision);
 var emailSufix = email.substring(prefixEmailDivision, email.length);
 console.log("EmailPrefix: " +email+ ", EmailSufix: "+emailSufix);

 if(emailPrefix.length == 0 || emailSufix.length <= 1){//TEMPORAL VALIDACION DE AMBAS CADENAS ANTES Y DESPUES DEL @
   return res.sendStatus(404);
 }
 
 UsuarioSchema.findOne({$text: {$search: email}},'usuario_id nombres apellidos email dni dv unidad rol imei profesion ocupacion telefono_contacto servicios_productos condominio_id', function(err, result) {

  if (err) {
	  console.log(err);
		return res.send(err);
    }
    return res.send(result);
  })
};*/

//FUNCION DE ACTUALIZACION DE DATOS DEL USUARIO INCLUYENDO PRODUCTOS COMPRADOS
/*exports.updateProduct = function(req, res) {

console.log("##### ACTUALIZANDO PRODUCTOS POR COMPRA ######");

var id = req.query.userId;
var product = req.query.productId;

//FECHA 
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var minutes = today.getMinutes();
        if(dd<10) {dd='0'+dd} 
        if(mm<10) {mm='0'+mm} 
        today = dd+'/'+mm+'/'+yyyy;
    var hora = hour+":"+minutes;
	var monthExpire = mm!=12?mm+1:'01';
	var expireDate = dd + '/' + monthExpire + '/'+ yyyy;
    //FIN FECHA
 
 if(product == '1'){//ADS DISABLED BOUGHT
  UserTest.update({"user_id":id}, {$set: {"user_ads_disabled": true}}, function (err, numberAffected) {
      if (err) {
    console.log(err);
    return res.send(err);
    }
      
      console.log('Updated user_ads_disabled true del usuario '+id, numberAffected);
      return res.send(202);
  });
 }else if(product == '2'){//UNLIMITED TESTS SURVEYS BOUGHT
	UserTest.update({"user_id":id}, {$set: {"user_unlimited_exams": true, "exp_date_unlimited_tests": expireDate}}, function (err, numberAffected) {
      if (err) {
    console.log(err);
    return res.send(err);
    }
      
      console.log('Updated exp_date_unlimited_tests true del usuario '+id+', fecha expiración: '+expireDate, numberAffected);
      return res.send(202);
  });  
 }else if(product == '3'){//MULTIPLE ANSWERS BOUGHT 
	UserTest.update({"user_id":id}, {$set: {"user_exams_multi_answers": true}}, function (err, numberAffected) {
      if (err) {
    console.log(err);
    return res.send(err);
    }
      
      console.log('Updated user_exams_multi_answers true del usuario '+id, numberAffected);
      return res.send(202);
  });  
 }else if(product == '4'){//PREMIUM REPORTS BOUGHT
	UserTest.update({"user_id":id}, {$set: {"user_has_premium_reports": true, "exp_date_premium_reports": expireDate}}, function (err, numberAffected) {
      if (err) {
    console.log(err);
    return res.send(err);
    }
      
      console.log('Updated user_has_premium_reports true del usuario '+id+', fecha expiración: '+expireDate, numberAffected);
      return res.send(202);
  });  
 }
 
};*/