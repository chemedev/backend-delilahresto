if (process.env.NODE_ENV === 'production') {
	require('dotenv').config();
}

//* MODULES
const express = require('express');
const cors = require('cors');

//* INIT
const app = express();
app.set('port', process.env.PORT || 3000);
app.listen(
	app.get('port'),
	console.log(`Server listening on port ${app.get('port')}`)
);

//* CFG
app.use(
	cors({
		origin: '*',
		methods: 'GET,PUT,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 204,
		exposedHeaders: 'Authorization',
	})
);

app.use(express.json());

//? WELL-FORMED JSON ? NEXT() : { ERR }
app.use((err, _req, res, next) => {
	if (err) return res.status(err.status).send([{ err: err.message }]);
	next();
});

//* ROUTES
app.use(require('./routes/users'));
app.use(require('./routes/products'));
app.use(require('./routes/orders'));

//* STATIC FILES
app.use(express.static(__dirname + '/public'));

app.get('/admin', (_, res) => {
	res.sendFile(__dirname + '/public/admin.html');
});
