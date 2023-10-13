console.log('##### CARGANDO CONTROLLER PAGOS #####');
"use strict";

//MONGODB
var mongoose = require('mongoose');
const _ = require("lodash");
var PagoSchema = require('.././models/pagos');
mongoose.set('debug', true);
//WEBPAY
const WebPay = require('../lib/WebPay');
const onError = require('./onError');
let transactions = {};
let transactionsByToken = {};
const cert = require('./cert/normal');

/**
 * 1. Instanciamos la clase WebPay.
 *
 * Notar que los certificados son simples strings, no buffer de archivos ni nada esotérico o místico.
 *
 * @type {WebPay}
 */
let wp = new WebPay({
  commerceCode: cert.commerceCode,
  publicKey: cert.publicKey,
  privateKey: cert.privateKey,
  webpayKey: cert.webpayKey,
  verbose: true,
  env: WebPay.ENV.INTEGRACION
});


//TODOS LOS PAGOS
exports.findAllPayByUserCondo = function(req, res){
  console.log('##### FIND ALL PAGOS BY USER CONDO #####');
  var idCondo = req.query.idCondo;
  var idUser = req.query.idUser;
  PagoSchema.find({"condominio_id": Number(idCondo), "pagos.dni": idUser},'condominio_id pagos',function(err, results){
  
if (err) {
  console.log(err);
  return res.send(err);
}
  console.log(results);
  return res.send(results);
});
};

//################# NUEVO PAGO CON WEBPAY #######################//
exports.addNormalPay = function(req, res){
  
  const token = req.headers["authorization"];
  const contentype = req.headers["content-type"];
  //TOKEN DE ACCESO ESTATICO
  if(!token || token != 'sRrAup0z^k+!W~t~u^=lme/Re&=^Sof8e.><q{4q@_G4ExVgXH`Kry2n|CS_Z'){
    return res.status(401).send("¡Acceso denegado!");
  }
  //CONTENT TYPE 
  if(!contentype || !contentype.indexOf('application/json') == -1){
    return res.status(400).send("Contenido no permitido");
  }

    let buyOrden = Date.now();
    let data = req.body;
    let amount = data.amount;
    transactions[buyOrden] = { amount: amount};
    let url = 'http://207.244.75.230:8400/condominios/pagos'; //+ req.get('host');
  
    /**
     * 2. Enviamos una petición a Transbank para que genere
     * una transacción, como resultado tendremos un token y una url.
     *
     * Nuestra misión es redireccionar al usuario a dicha url y token.
     * 
     */
    wp.initTransaction({
      buyOrder: buyOrden,
      sessionId: data.sessionId,
      returnURL: url + '/verificar',
      finalURL: url + '/comprobante?cid='+data.idCondo+'&d='+data.dni+'&u='+data.unidad+'&gcid='+data.gastoComunId+'&rid='+data.reservaId+'&fp='+data.fechaPago,
      amount: amount
    }).then((data) => {
      // Al ser un ejemplo, se está usando GET.
      // Transbank recomienda POST, el cual se debe hacer por el lado del cliente, obteniendo
      // esta info por AJAX... al final es lo mismo, así que no estresarse.
      res.redirect(data.url + '?token_ws=' + data.token);
    }).catch(onError(res));
  }
  
  //############### VERIFICACION DE PAGO REQUERIDO POR WEBPAY #########################//
  exports.verifyNormalPay = function(req, res){
    let token = req.body.token_ws;
    let transaction;
  
    // Si toodo está ok, Transbank realizará esta petición para que le vuelvas a confirmar la transacción.
  
    /**
     * 3. Cuando el usuario ya haya pagado con el banco, Transbank realizará una petición a esta url,
     * porque así se definió en initTransaction
     */
    console.log('pre token', token);
    wp.getTransactionResult(token).then((transactionResult) => {
      transaction = transactionResult;
      transactions[transaction.buyOrder] = transaction;
      transactionsByToken[token] = transactions[transaction.buyOrder];
  
      console.log('transaction', transaction);
      /**
       * 4. Como resultado, obtendras transaction, que es un objeto con la información de la transacción.
       * Independiente de si la transacción fue correcta o errónea, debes siempre
       * hacer un llamado a acknowledgeTransaction con el token... Cosas de Transbank.
       *
       * Tienes 30 amplios segundos para hacer esto, sino la transacción se reversará.
       */
      console.log('re acknowledgeTransaction', token)
      return wp.acknowledgeTransaction(token);
  
    }).then((result2) => {
      console.log('pos acknowledgeTransaction', result2);
      // Si llegas aquí, entonces la transacción fue confirmada.
      // Este es un buen momento para guardar la información y actualizar tus registros (disminuir stock, etc).
  
      // Por reglamento de Transbank, debes retornar una página en blanco con el fondo
      // psicodélico de WebPay. Debes usar este gif: https://webpay3g.transbank.cl/webpayserver/imagenes/background.gif
      // o bien usar la librería.
      res.send(WebPay.getHtmlTransitionPage(transaction.urlRedirection, token));
    }).catch(onError(res));
  }
  
  //###################### EMISION DE COMPROBANTE HOGAR AL DIA EN FUNCION DE RESULTADO WEBPAY #######################//
  exports.postComprobante = function(req, res){
    console.log('Mostrar el comprobante');
    var idCondo = req.query.cid;
    var dni = req.query.d;
    var unidad = req.query.u;
    var gastoComunId = req.query.gcid;
    var reservaId = req.query.rid;
    var fechaPago = req.query.fp;

    console.log('idCondo: '+idCondo+' ,dni: '+dni);

    const transaction = transactionsByToken[req.body.token_ws];
    
    console.log('TRANSACTION: '+JSON.stringify(transaction));
    console.log('ACCOUNTING DATE: '+transaction.accountingDate);
    console.log('BUY ORDER: '+transaction.buyOrder);

    //##### CON EL COMPROBANTE EMITIDO Y ENVIADO POR EMAIL SE PROCEDE A REGISTRAR EN BASE DE DATOS LA TRANSACCION #####//
    //EN CASO DE QUE POR ALGUNA RAZON FALLE LA TRANSACCION NO HABRA COMPROBANTE
    //EN CASO DE QUE FALLE EL REGISTRO EN BD DE LA TRANSACCION EXITOSA, EL COMPROBANTE ES EL RESPALDO Y DEBE INGRESARSE MANUAL
    
    let registerBdCode = addPayToMongo(idCondo, dni, unidad, fechaPago, gastoComunId, reservaId, transaction);

    console.log('CODE REGISTRO PAGO EN BD: '+registerBdCode);

    //OBJETO HTML DEL COMPROBANTE
    let html = '<html><head> <meta charset="utf-8"> <title>Comprobante de Pago</title> <style>.invoice-box{max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; '+
    'box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; color: #555;}'+
    '.invoice-box table{width: 100%; line-height: inherit; text-align: left;}.invoice-box table td{padding: 5px; vertical-align: top;}.invoice-box table tr td:nth-child(2)'+
    '{text-align: right;}.invoice-box table tr.top table td{padding-bottom: 20px;}.invoice-box table tr.top table td.title{font-size: 45px; line-height: 45px; color: #333;}'+
    '.invoice-box table tr.information table td{padding-bottom: 40px;}.invoice-box table tr.heading td{background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;}'+
    '.invoice-box table tr.details td{padding-bottom: 20px;}.invoice-box table tr.item td{border-bottom: 1px solid #eee;}.invoice-box table tr.item.last td{border-bottom: none;}'+
    '.invoice-box table tr.total td:nth-child(2){border-top: 2px solid #eee; font-weight: bold;}@media only screen and (max-width: 600px){ .invoice-box { max-width: 500;'+
    'margin: auto; padding: 15px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 12px; line-height: 16px; font-family: "Helvetica Neue", "Helvetica",'+
    '"Helvetica", Arial, sans-serif; color: #555;} .invoice-box table tr.top table td.title { font-size: 20px; line-height: 24px; color: #333; } /*.invoice-box table tr.top table td'+
    '{width: 100%; display: block; text-align: center;}.invoice-box table tr.information table td{width: 100%; display: block; text-align: center;}*/}/** RTL **/ .rtl{direction: rtl;'+
    '  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;}.rtl table{text-align: right;}.rtl table tr td:nth-child(2){text-align: left;}'+
    '</style></head><body> <div class="invoice-box"> <table cellpadding="0" cellspacing="0"> <tr class="top"> <td colspan="2"> <table> <tr> <td class="title"> '+
    '<img src="http://hogaraldia.cl/app/images/logo.png" style="width:100%; max-width:300px;"> </td><td><b> Comprobante de pago N°:</b> 123<br><b>Fecha:</b> January 1, 2015<br></td>'+
    '</tr></table></td></tr><tr class="information"> <td colspan="2"> <table> <tr> <td> <b>Emisor</b><br> Hogar Al Día SPA.<br>Los Alamos 186, Colina.<br>Región Metropolitana, Chile.'+
    '</td><td> <b>Cliente</b><br> Casa 3<br>Luis Eduardo Liberal<br>luiseliberal.cl@gmail.com </td></tr></table> </td></tr><tr class="heading"> <td colspan="2"><table> <tr> <td>'+
    '<b>Método de Pago Empleado</b> </td><td> <b>WebPay</b> </td></tr></table> </td></tr><tr class="details"> <td colspan="2"><table> <tr> <td>RedCompra<br></td><td> $34.234 CLP<br>'+
    '</td></tr></table> </td></tr><tr class="heading"> <td colspan="3"><table> <tr> <td><b>Item</b> </td><td style="text-align: right"> <b>Fecha</b> </td>'+
    '<td style="text-align: right"> <b>SubTotal</b> </td></tr></table> </td></tr><tr class="item"><td colspan="3"><table> <tr> <td>Gasto Común</td>'+
    '<td style="text-align: right; width: 15%">11/2019</td><td style="text-align: right">$ 34.234 CLP</td></tr></table> </td></tr><tr class="total"><td></td><td> Total: $34.234 CLP'+
    '</td></tr></table> </div></body></html>';
    
    /* PRIMERA FASE SALIMOS SIN ANULACION 
    html += '<form action="/anular" method="post"><input type="hidden" name="buyOrden" value="' + transaction.buyOrder +
      '"><input type="submit" value="Anular"></form>';*/
    return res.send(html);
  }


//FUNCION DE INGRESAR REGISTRO DE PAGO A LA BD MONGO
function addPayToMongo(idCondo, dni, unidad, fechaPago, gastoComunId, reservaId, dataWebPay){
    console.log('#### AGREGAR PAGO A BD MONGO ####');

    var dataReconstructed = JSON.stringify(dataWebPay);
    dataReconstructed = "{\"dni\":"+dni+", \"unidad\":"+unidad+", \"fecha\":"+fechaPago+", \"gastocomun_id\":"+gastoComunId+", \"reserva_id\":"+reservaId+", \"webpay_data\":"+dataReconstructed+"}";

    console.log('DATA RECONSTRUCTED: '+dataReconstructed);

      PagoSchema.updateOne({'condominio_id': idCondo}, {$push: {'pagos' : dataReconstructed}}, function (err, numberAffected) {

      if (err){
        console.log("Error actualizando documento de pago en BD. Error fue: "+err);
        return 500;
      }
      console.log("numberAffected: "+JSON.stringify(numberAffected));

      if(numberAffected.nModified == 1){
      console.log("Updated reserva de condominio: "+idCondo+", con data: "+dataReconstructed+"...... ", JSON.stringify(numberAffected));
      return 202;

      }else{
        //INTENTAMOS LA CREACION DEL DOCUMENTO POR PRIMERA VEZ
        //MANIPULACION DE JSON PARA CREACION DEL NUEVO DOCUMENTO SI NO EXISTE
        var dataReconstructed = JSON.stringify(dataWebPay);
        dataReconstructed = "{\"dni\":"+dni+", \"unidad\":"+unidad+", \"fecha\":"+fechaPago+", \"gastocomun_id\":"+gastoComunId+", \"reserva_id\":"+reservaId+", \"webpay_data\":"+dataReconstructed+"}";

        var dataNewObject = "{\"condominio_id\":"+idCondo+", \"pagos\":["+dataReconstructed+"]}";
        console.log(dataNewObject);

        var dataBody = JSON.parse(dataNewObject);

        PagoSchema.create(dataBody, function (err, result) {
          if (err) {
          console.log(err);        
              if (err.name === 'MongoError' && err.code === 11000) {
              // Duplicate condominio
              console.log('Error: Ya existe el condominio en la colección de pago');
              return 500;
            }
            // Some other error
            console.log('Error: '+err);
            return 500;
          }
          console.log("Creado condominio: "+idCondo+", con data de pago: "+dataNewObject+"...... ", result);
          return 200;
        });  
      }
    });

       /* PagoSchema.updateOne({'condominio_id': idCondo}, {$push: {'pagos' : data}}, function (err, numberAffected) {
        
                console.log("numberAffected: "+JSON.stringify(numberAffected));
                
                if (err){
                  console.log("Error actualizando documento con nuevo pago. Error fue: "+err);
                  return 500;
                }

                if(numberAffected.nModified == 1){
                console.log("Updated pago de condominio: "+idCondo+", con data: "+data+"...... ", JSON.stringify(numberAffected));
                return 202;
                }else{
                return 404;
                }
        });  */
};
  