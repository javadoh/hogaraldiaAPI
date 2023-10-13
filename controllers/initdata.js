console.log('## CARGADO CONTROLLER DE INIT DATA ##');
var mongoose = require('mongoose');

var InitDataSchema = require('.././models/initdata');
mongoose.set('debug', true);

//TODOS LOS CONDOMINIOS
exports.findAll = function(req, res){
  console.log('##### FIND ALL INIT DATA #####');
  InitDataSchema.find({},'OnBoard MainServices GastosComunes Decisiones Reservas Seguridad AdsConvivencia',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});
};