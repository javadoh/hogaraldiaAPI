module.exports = function(app){
    var initDataController = require('.././controllers/initdata');
    var usuarioController = require('.././controllers/usuarios');
    var publicidadController = require('.././controllers/publicidad');
    var condominioController = require('.././controllers/condominios');
    var encuestaDecisionController = require('.././controllers/decisiones');
    var reservacionController = require('.././controllers/reservaciones');
    var visitaController = require('.././controllers/visitas');
    var serviciosController = require('.././controllers/servicios');
    var gastoComunController = require('.././controllers/gastocomun');
    var seguridadController = require('.././controllers/seguridad');
    app.set('port', process.env.PORT || 8000);
    //INIT DATA
    app.get('/condominios/initdata/getInitData', initDataController.findAll);
    //USUARIOS
    app.get('/condominios/usuarios/getUserByDni/:dni', usuarioController.getDniUserOnBoard);
    app.put('/condominios/usuarios/updateUserOnBoard/:usuarioId', usuarioController.putEmailImeiOnBoard);
    app.put('/condominios/usuarios/updateUserSugerencias/:usuarioId', usuarioController.putUserSugerencia);
    app.put('/condominios/usuarios/updateUserReclamos/:usuarioId', usuarioController.putUserReclamo);
    app.get('/condominios/usuarios/getAll', usuarioController.findAll);
    app.get('/condominios/usuarios/getAllUsersByCondo/:id', usuarioController.findAllByCondo);
    app.get('/condominios/usuarios/getUser/:id', usuarioController.findById);
	//app.get('/condominios/usuarios/loginUser', usuarioController.login);
    app.post('/condominios/usuarios/newUser', usuarioController.add);
    app.put('/condominios/usuarios/updateUser/:id', usuarioController.update);
    app.delete('/condominios/usuarios/deleteUser/:id', usuarioController.delete);
    //app.get('/condominios/usuarios/forgotPassHelp/:email', usuarioController.findUserForgotPassword);
    //USUARIOS_VISITANTES
    app.post('/condominios/usuariosVisita/newUserVisita', usuarioController.postUserGuessOnBoard);
    app.get('/condominios/usuariosVisita/getVisitasAll', usuarioController.findVisitasAll);
    //PUBLICIDAD
    app.get('/condominios/publicidad/getInitPromos/:condominio_id', publicidadController.findAll);
    //CONDOMINIOS
    app.get('/condominios/condos/getAll', condominioController.findAll);
    app.get('/condominios/condos/getCondo/:id', condominioController.findById);
    app.post('/condominios/condos/newCondo', condominioController.add);//SERAN MANUALES VERSION 1
    app.put('/condominios/condos/updateCondo/:id', condominioController.update);//SERAN MANUALES VERSION 1
    //ENCUESTAS DECISIONES
    app.get('/condominios/decisiones/getAll', encuestaDecisionController.findAll);
    app.get('/condominios/decisiones/getAllByCondo/:id', encuestaDecisionController.findAllByCondo);
    app.post('/condominios/decisiones/newDecision', encuestaDecisionController.add);
    app.put('/condominios/decisiones/updateDecision/:idCondo', encuestaDecisionController.update);
    app.post('/condominios/decisiones/newVote', encuestaDecisionController.addVote);

    app.get('/condominios/decisiones/getDecision', encuestaDecisionController.findById);
    app.delete('/condominios/decisiones/deleteDecision', encuestaDecisionController.delete);
    //RESERVACIONES
    app.get('/condominios/reservaciones/getAll', reservacionController.findAll);
    app.get('/condominios/reservaciones/getAllQuinchosByCondoYear', reservacionController.findAllQuinchosByCondoYear);
    app.get('/condominios/reservaciones/getAllEstacionamientosByCondoYear', reservacionController.findAllEstacionamientosByCondoYear);
    app.get('/condominios/reservaciones/getAllPartHallByCondoYear', reservacionController.findAllPartHallByCondoYear);
    app.get('/condominios/reservaciones/getAllByCondoUserYear', reservacionController.findAllByCondoAndUserYear);
    app.get('/condominios/reservaciones/getReserva', reservacionController.findById);
    app.post('/condominios/reservaciones/newReserva/:idCondo', reservacionController.add);
    app.put('/condominios/reservaciones/updateReserva/:idCondo', reservacionController.update);
    app.delete('/condominios/reservaciones/deleteReserva', reservacionController.delete);
    //VISITAS
    app.get('/condominios/visitas/getAll', visitaController.findAll);
    app.get('/condominios/visitas/getVisita', visitaController.findById);
    app.put('/condominios/visitas/updateVisita', visitaController.update);
    app.post('/condominios/visitas/newVisita/:id', visitaController.add);
    app.delete('/condominios/visitas/deleteVisita', visitaController.delete);
    //SERVICIOS
    app.get('/condominios/servicios/getAll', serviciosController.findAll);
    app.get('/condominios/servicios/getServicio', serviciosController.findById);
    app.put('/condominios/servicios/updateServicio', serviciosController.update);
    app.put('/condominios/servicios/updateHistoriaServicio', serviciosController.updateHistoriaServicio);
    app.put('/condominios/servicios/updateDetalleServicio', serviciosController.updateDetalleServicio);
    app.post('/condominios/servicios/newServicio', serviciosController.add);
    app.delete('/condominios/servicios/deleteServicio', serviciosController.delete);
    //GASTO COMUN
    app.get('/condominios/gastocomun/getAll', gastoComunController.findAll);
    //app.get('/condominios/gastocomun/getLastGcByCondo', gastoComunController.findLastGcByCondo);
	app.get('/condominios/gastocomun/getLastGastoComun', gastoComunController.findByCondo);
    //app.get('/condominios/gastocomun/getGastoComun', gastoComunController.findById);
    app.put('/condominios/gastocomun/updateGastoComun', gastoComunController.update);
    app.post('/condominios/gastocomun/newGastoComun/:id', gastoComunController.add);
    app.delete('/condominios/gastocomun/deleteGastoComun', gastoComunController.delete);
    //SEGURIDAD
    app.get('/condominios/seguridad/getAll', seguridadController.findAll);
    app.get('/condominios/seguridad/getSeguridadItem', seguridadController.findById);
    app.post('/condominios/seguridad/newSeguridadItem', seguridadController.add);
    app.put('/condominios/seguridad/update/:id', seguridadController.update);
    app.delete('/condominios/seguridad/deleteSeguridadItem', seguridadController.delete);
	//PAGOS
    app.get('/condominios/pagos/getAllPayByUserCondo', pagosController.findAllPayByUserCondo);
	app.post('/condominios/pagos/add', pagosController.addNormalPay);
	app.post('/condominios/pagos/verificar', pagosController.verifyNormalPay);
	app.post('/condominios/pagos/comprobante', pagosController.postComprobante);
	//app.post('/condominios/pagos/anular', pagosController.postAnularPay); NO SALE EN PRIMERA FASE




}