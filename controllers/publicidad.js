console.log('##### CARGANDO CONTROLLER DE PUBLICIDAD #####');

var mongoose = require('mongoose');

var PublicidadSchema = require('.././models/publicidad');
mongoose.set('debug', true);

//TODAS LAS PUBLICIDADES
exports.findAll = function(req, res){
  console.log('##### FIND ALL PUBLICIDAD #####');
  var condominio_id = req.params.condominio_id;

  /*db.publicidad.find({$and: [{$or: [{'condominio_id':1 },{'condominio_id':0}]}, {$expr: {$gte: 
    [
        {$dateFromString: {dateString: "$fecha_fin_publicidad", 'format':'%m-%d-%Y'}},
        ISODate("2019-10-10T23:59:59Z")
        ]
    }}
    ]})
       .sort({'fecha_inicio_publicidad' : -1})
       .limit(10)*/


  //********** Busca publicidades propias del condominio o aquellas generales sin un condominio específico ********//
  /*CONDICIONES:
    - Publicidades pueden ser promociones (imagen) o noticias (imagen, titulo y desc)
    - Retorna las últimas 10 publicidades generales (condominio_id = 0) y locales (condominio_id = condominio_id)
    - Ordena las publicidades a partir de la fecha más reciente (Al vender se debe elaborar un esquema basado en las fechas para la posición del item)
    - Las publicidades con fecha fin menor al día de hoy no se muestran.
  */
  PublicidadSchema.find(
  {$and: [{$or: [{'condominio_id':condominio_id },{'condominio_id':0}]}, {$expr: {$gte: 
    [
        {$dateFromString: {dateString: "$fecha_fin_publicidad", 'format':'%m-%d-%Y'}},
        new Date()
        ]
    }}
    ]}
  ,'publicidad_id path_publicidad_imagen fecha_inicio_publicidad fecha_fin_publicidad path_publicidad_webpage tipo titulo descripcion condominio_id',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
}

).sort({'fecha_inicio_publicidad' : -1})
.limit(10);
};
