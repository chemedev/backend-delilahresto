//! MODULES
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

//! INIT
const privateKey = fs.readFileSync('private.key').toString();

const port = 3000;
const app = express();
app.listen(port, console.log(`Server UP on port ${port}.`));

//! HANDLER
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

//! CONFIG
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// function log (req, res, next) {
// 	console.log(req.path, req.body, req.query);
// 	next();
// }

//! ROUTES
app.use(require('./src/routes/users'))
app.use(require('./src/routes/products'))
app.use(require('./src/routes/orders'))
app.get('/', handleRequest);