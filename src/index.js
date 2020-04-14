//* MODULES
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

//* INIT
const port = 3000;
const app = express();
app.listen(port, console.log(`Server listening on port: ${port}`));

//! HANDLER
let handleRequest = (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	fs.readFile('src/index.html', null, function(err, data) {
		if (err) {
			res.writeHead(404);
			res.write('File not found.');
		} else {
			res.write(data);
		}
		res.end();
	});
};

//* CFG
app.use(
	cors({
		origin: '*',
		methods: 'GET,PUT,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 204,
		exposedHeaders: 'Authorization'
	})
);
app.use(bodyParser.json());
app.use(express.static(__dirname + 'src/../public'));

//? WELL-FORMED JSON ? NEXT() : { ERR }
app.use((err, _req, res, next) => {
	if (err) return res.status(err.status).send([{err: err.message}]);
	next();
});

//* ROUTES
app.use(require('./routes/products'));
app.use(require('./routes/users'));
app.use(require('./routes/orders'));
app.get('/', handleRequest);