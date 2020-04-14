//* MODULES
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//* INIT
const port = 3000;
const app = express();
app.listen(port, console.log(`Server listening on port: ${port}`));

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

//? WELL-FORMED JSON ? NEXT() : { ERR }
app.use((err, _req, res, next) => {
	if (err) return res.status(err.status).send([{err: err.message}]);
	next();
});

//* ROUTES
app.use(require('./routes/products'));
app.use(require('./routes/users'));
app.use(require('./routes/orders'));
app.get('/', (_req, res) => res.send('Welcome to Delilah Restó'));