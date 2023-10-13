var fs = require('fs');

module.exports = {
 writeFile: function (serverImagesPath, nombreArchivo, stringEncoded){

    fs.writeFile(serverImagesPath + nombreArchivo, stringEncoded, 'base64', function(err) {
      if(err) {
      console.log("Error al guardar la imágen en el servidor: ",err);
      return 1;
    } else {
      console.log("Imagen grabada correctamente: "+serverImagesPath + nombreArchivo);
      return 0;
    }
  });
  },

  validateHeaders: function(req){
    //VALIDACION DE TOKEN DE CABECERA ESTATICO
  const token = req.headers["authorization"];
  const contentype = req.headers["content-type"];

  if(!token || token != 'sRrAup0z^k+!W~t~u^=lme/Re&=^Sof8e.><q{4q@_G4ExVgXH`Kry2n|CS_Z'){
    return 401;
  }
  if(!contentype || !contentype.indexOf('application/json') == -1){
    return 400;
  }

  return 200;
  }
}