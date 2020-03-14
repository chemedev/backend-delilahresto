const express = require('express');
const bodyParser = require('body-parser');

const app = express();

function logRequest(req, res, next) {
	console.log(`Middleware logRequest: At ${new Date()} user access ${req.path}`);
	next();
}

function intercept(req, res, next) {
	res.send('You shall not pass!');
}

app.use(logRequest);
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hola Mundo!');
});

app.get('/error', (req, res) => {
	res.status(500);
	res.json({ error: 'Hubo un error :(' });
});

app.get('/gandalf', intercept, (req, res) => {
	res.send("I'm Gandalf");
});

app.post('/contact', (req, res) => {
	res.json(req.body);
});

let items = [
	{
		id: 1,
		title: 'Esta es una tarea',
		completed: false
	},
	{
		id: 2,
		title: 'Esta es otra tarea',
		completed: false
	}
];

app.get('/items', (req, res) => {
	res.json(items);
});

app.post('/items', (req, res) => {
	items.push(req.body);
	console.log('New task added.');
	res.json(req.body);
});

app.put('/items/:id:title:completed', (req, res) => {
	console.log(req.params);
	const { id } = req.params.id;
	const { title } = req.params.title;
	const { completed } = req.params.completed;
	const item = {
		id: id,
		title: title,
		completed: completed
	};
	items.forEach((e, i) => {
		if (e.id == id) items.splice(i, 1, item);
	});
	console.log('Task changed.');
	res.json(req.body);
});

app.delete('/items/:id', (req, res) => {
	const { id } = req.params;
	items.forEach((e, i) => {
		if (e.id == id) items.splice(i, 1);
	});
	console.log('Task deleted.');
	res.json(req.body);
});

// curl -X POST \
//   http://localhost:3000/contact \
//   -H 'Content-Type: application/json' \
//   -d '{
// 	"fullname": "Juan Chemello",
// 	"email": "juanchemell@gmail.com"
// }'

app.listen(3000, () => {
	console.log('Servidor Iniciado en localhost:3000.');
});
