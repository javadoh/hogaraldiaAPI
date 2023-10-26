console.log('## CARGADO CONTROLLER DE INIT DATA ##');
var mongoose = require('mongoose');

var InitDataSchema = require('.././models/initdata');
mongoose.set('debug', true);

//TODOS LOS CONDOMINIOS
exports.findAll = async function(req, res){
  console.log('##### FIND ALL INIT DATA #####');
  const findAllInit = await InitDataSchema.find({},'OnBoard MainServices GastosComunes Decisiones Reservas Seguridad AdsConvivencia').catch((error) => {
    console.log(error);
  return res.send(error);
  });
  console.log(findAllInit);
  return res.send(findAllInit);
};