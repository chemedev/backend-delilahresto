const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


//INIT
const app = express();
app.listen(3000, console.log('Server UP on port 3000.'));

// HANDLER
let handleRequest = (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	fs.readFile('index.html', null, function(err, data) {
		if (err) {
			res.writeHead(404);
			res.write('File not found.');
		} else {
			res.write(data);
		}
		res.end();
	});
};

// MIDDLEWARES
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

function log (req, res, next) {
	console.log(req.path, req.body, req.query);
	next();
}

// ROUTES
app.get('/', log, handleRequest);