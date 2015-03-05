// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var geocoder = require('geocoder');
var fs = require('fs');
var request = require('request');


// MongoDB
mongoose.connect('mongodb://IbmCloud_jgfdj3qk_5d1of68f_qckimth7:BBORU9RitH3o72WoJQ1oMIx7wkXs1Fcv@ds055110.mongolab.com:55110/IbmCloud_jgfdj3qk_5d1of68f');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Configure Push with twilio
var twilioSid, twilioToken;
twilioSid = "AC1f26578824ec9c19b902e9a3861d435d";
twilioToken = "2c76f53cdcfee7a639d385c904930926";


// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.use('/api/v1', require('./routes/api'));

app.get("/generar", function(req, res){
  request('http://my-report.mybluemix.net/api/v1/reportes', function (error, response, body) {
    if (!error && response.statusCode == 200) {
       fs.writeFile("reporte.json", body, function(err) {
            if(err) {
                res.redirect("/");
            } else {
                res.redirect("/");
            }
        });
      }
    });
});

app.get('/reporte.json',function(req,res){
  res.sendfile('reporte.json');
});

app.get('/maps',function(req,res){
  res.render('pages/map');
});

app.get('/analytics',function(req,res){
  res.render('pages/map')
});

app.get('/api/v1/reportes/call/:tipo/:lat/:long', function(req, res) {
    var client = new twilio.RestClient(twilioSid, twilioToken);
    //Configure geo localization
    //20.7328469,-103.4561331 -> Tec de monterrey
    geocoder.reverseGeocode(req.params.lat,req.params.long, function ( err, data ) {
      client.sendMessage({
          to:'+5213171060735',
          from:'+14804852321',
          body:'Issue reported '+req.params.tipo +' at '+data.results[0].formatted_address+'!'
      }, function(err, message) {
          request('http://my-report.mybluemix.net/api/v1/reportes', function (error, response, body) {
              if (!error && response.statusCode == 200) {
               fs.writeFile("reporte.json", body, function(err) {
                  if(err) {
                      res.redirect("/");
                  } else {
                      res.redirect("/");
                  }
              });
            }
        });
    });
  });
});

/*
API Endpoint

    http://my-report.mybluemix.net/api/v1/reportes
	 -> GET
	 -> POST
*/


// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('App started on port ' + port);

/* Start server
app.listen(3000);
console.log('API is running on port 3000');
*/
