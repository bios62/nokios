const express = require('express') 
const path = require('path') 
var bodyParser = require('body-parser');
const fs = require('fs');
var serveStatic = require('serve-static');
var vhost = require('vhost');
const version='102124V1';

const app = express() ;

const resultFile='results.txt';
const logFile='access.log';
const portNumber=7001;
const serverName='www.nokios.flat4u.no';

var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Static Middleware 
app.use((req, res, next) => {
	// Log an info message for each incoming request
	console.log(`Received a ${req.method} request for ${req.url}`);
	fs.appendFile(logFile, `Received a ${req.method} request for ${req.url}`+'\n', function (err)
	{
		if (err) throw err;
	  });

	next();
  });

app.use(vhost(serverName,express.static(path.join(__dirname, 'public')))) 
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.json())

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 



app.post('/processdata', urlencodedParser, function (req, res) {  
		// Prepare output in JSON format  
		response = {  
			email:req.body.email,  
			phone:req.body.phone,  
			q1:req.body.q1,
			q2:req.body.q2,
			q3:req.body.q3
		};  
		console.log(response);  
		fs.appendFile(resultFile, JSON.stringify(response)+'\n', function (err) {
			if (err) throw err;
		  });
		//
		// Check the result
		//
		numRes=0;
		if (response.q1 == 3) {
			numRes++;
		}
		if (response.q2 == 2) {
			numRes++;
		}
		if (response.q3 == 1) {
			numRes++;
		}
		
		if (portNumber == 80 || portNumber == 8080) {
			urlPrefix='http://';
		} else if (portNumber == 443 || portNumber == 8443) {
			urlPrefix='https://';
		}
		/* if (portNumber == 80 || portNumber == 443) {
		 	newPage=urlPrefix+serverName+'/nokios_takk'+numRes+'.html';
		} else {
			newPage=urlPrefix+serverName+':'+portNumber+'/nokios_takk'+numRes+'.html';
		} */
		newPage=urlPrefix+serverName+'/nokios_takk'+numRes+'.html';
		//res.end(JSON.stringify(response));  
		console.log('Redirect to: '+newPage);
		res.redirect(newPage);
	 })

var server = app.listen(portNumber, function(error){ 
	if(error) throw error 
	var host = server.address().address  
	var port = server.address().port  
	console.log('Nokios server '+version+' listening at http://%s:%s', host, port);
}) 

