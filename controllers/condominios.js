console.log('## CARGADO CONTROLLER DE CONDOMINIOS ##');
var mongoose = require('mongoose');

var CondominioSchema = require('.././models/condominios');
mongoose.set('debug', true);

//TODOS LOS CONDOMINIOS
exports.findAll = function(req, res){
  console.log('##### FIND ALL CONDOS #####');
  CondominioSchema.find({},'condominio_id descripcion direccion ciudad estado municipio pais latitud longitud total_unidades total_unidades_habitadas unidades administradores personal datos_pago, servicios_app reserva_quincho reserva_estacionamiento reserva_salaFiesta reserva_salaCine reserva_salaJuegos',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});
};

exports.findById = function(req, res) {

  /*
{
    "unidades": [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
    ],
    "administradores": [
        {
            "id": 1,
            "nombres": "Luis Eduardo",
            "apellidos": "Liberal Rojas",
            "cargo": "Presidente Junta"
        },
        {
            "id": 2,
            "nombres": "Pamela Alejandra",
            "apellidos": "Martin Cid",
            "cargo": "Tesorera Junta"
        }
    ],
    "personal": [
        {
            "id": 1,
            "dni": "8492384-2",
            "nombres": "Juan Pablo",
            "apellidos": "Loyola",
            "cargo": "conserje"
        },
        {
            "id": 2,
            "dni": "3296282-4",
            "nombres": "Mario",
            "apellidos": "Contreras",
            "cargo": "conserje"
        },
        {
            "id": 3,
            "dni": "32424323-4",
            "nombres": "Maria",
            "apellidos": "Villa",
            "cargo": "limpieza"
        },
        {
            "id": 4,
            "dni": "4634683-5",
            "nombres": "William",
            "apellidos": "Rojas",
            "cargo": "Mantenimiento ascensores"
        }
    ],
    "datos_pago": [
        {
            "dni": "9887222-1",
            "descripcion": "Condominio Los Lagos",
            "banco": "Estado",
            "tipo_cta": "Corriente",
            "nro_cta": "028947832",
            "condo_email": "condominioA@gmail.com"
        },
        {
            "dni": "9887222-1",
            "descripcion": "Condominio Los Lagos",
            "banco": "ScotiaBank",
            "tipo_cta": "Corriente",
            "nro_cta": "124453777",
            "condo_email": "condominioA@gmail.com"
        }
    ],
    "_id": "5d25012c139a583a78cf3a53",
    "descripcion": "CONDOMINIO LOS BOLDOS",
    "direccion": "General San Martin 2000, estancia Liray, calle Los Alamos, Colina, Santiago, Chile.",
    "ciudad": {
        "id": 187,
        "descripcion": "Santiago de Chile",
        "desc": "STGO"
    },
    "estado": {
        "id": 10,
        "descripcion": "Región Metropolitana",
        "desc": "RMIXX"
    },
    "municipio": {
        "id": 3,
        "descripcion": "Colina",
        "desc": "Col"
    },
    "pais": {
        "id": 32,
        "descripcion": "Chile",
        "desc": "CL"
    },
    "latitud": "56464658432121",
    "longitud": "121312515656",
    "total_unidades": 54,
    "total_unidades_habitadas": 27,
    "condominio_id": 1,
    "servicios_app": {
            "gastos_comunes": "true",
            "decisiones": "true",
            "reservas": "true",
            "seguridad": "true",
            "emergencias": "true",
            "contrataciones": "true",
            "localizacion": "true",
            "corretaje": "false",
            "trabajos_emprendimientos": "false",
            "internet_of_things": "false"
        },
        "reserva_piscina": {
            "cantidad": 1,
            "hora_inicio": 10,
            "hora_media": 18,
            "hora_fin": 0,
            "hora_fin_finde": 3
        },
        "reserva_quincho": {
            "cantidad": 4,
            "hora_inicio": 10,
            "hora_media": 18,
            "hora_fin": 0,
            "hora_fin_finde": 3
        },
        "reserva_salaFiesta": {
            "cantidad": 1,
            "hora_inicio": 9,
            "hora_media": 17,
            "hora_fin": 0,
            "hora_fin_finde": 3
        },
        "reserva_salaCine": {
            "cantidad": 1,
            "hora_inicio": 10,
            "hora_media": 16,
            "hora_fin": 0,
            "hora_fin_finde": 2
        },
        "reserva_salaJuegos": {
            "cantidad": 2,
            "hora_inicio": 9,
            "hora_media": 15,
            "hora_fin": 11,
            "hora_fin_finde": 0
        }
}
  */

  //********** Busca condominio por id ********//
  /*CONDICIONES:
  */
    console.log('##### FIND CONDO BY ID #####');
   var id = req.params.id;
   CondominioSchema.findOne({'condominio_id':id},'condominio_id descripcion direccion ciudad estado municipio pais latitud longitud total_unidades total_unidades_habitadas unidades administradores personal datos_pago, servicios_app reserva_quincho reserva_estacionamiento reserva_salaFiesta reserva_salaCine reserva_salaJuegos',function(err, result) {
  
    if (err){
      console.log(err);
      return res.send(err);
    }
      return res.send(result);
    });
  };

//FUNCION DE ACTUALIZAR DATOS DEL CONDOMINIO
exports.update = function(req, res) {
    var id = req.params.id;
    var data = req.body;

    console.log('#### UPDATE CONDOMINIO '+id+' ####');
    
    req.header("Content-Type", "application/json");
    
    CondominioSchema.update({"condominio_id":id}, data, function (err, numberAffected) {
          if (err) {
            console.log(err);
            return res.send(err);
          }
              
          console.log('Updated %d condominios', numberAffected);
          return res.sendStatus(202);
      });
    };
    
//FUNCION DE AGREGAR USUARIOS A LA APLICACION
exports.add = function (req, res){
      console.log('#### AGREGANDO NUEVO CONDOMINIO ####');
      req.header("Content-Type", "application/json");
      var data = req.body;

      console.log("NUEVO CONDOMINIO DATA: "+data);
      CondominioSchema.create(data, function (err, result) {
        if (err) {
        console.log(err);
            if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate condominio
            return res.status(500).send('El condominio ya existe.');
          }
          // Some other error
          return res.status(500).send('Ocurrió un error, '+err);
        }
        return res.send(result);
      });  
};