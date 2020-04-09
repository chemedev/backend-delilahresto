const express = require('express');
const { sql, sequelize } = require('../../database/database');
const Router = express.Router();
const { isAdmin, isLogged, isAccesingOwnData } = require('../lib/helpers');

//! ROUTES /ORDERS

Router.get('/orders', isAdmin, async (_req, res) => {
	const query = 'SELECT * FROM orders WHERE is_deleted = 0';
	const answer = await sequelize.query(query);
	res.status(200).send(answer[0]);
});

Router.get(
	'/orders/:username',
	isLogged,
	isAccesingOwnData,
	async (req, res) => {
		try {
			let { username } = req.params;
			let regex = new RegExp('^[\\w]+$');
			if (!regex.test(username)) return res.sendStatus(400);
			const answer = await sql(
				`SELECT orders.id, products.description, orders.created_at, users.fullname, orders.status, orders.payment
										FROM users
										JOIN orders ON orders.user_id = users.id
										JOIN orders_detail ON orders.id = orders_detail.order_id
										JOIN products ON orders_detail.product_id = products.id
										WHERE username = ?;`,
				username
			);
			console.table(answer);
			if (!answer[0]) return res.sendStatus(404);
			res.send(answer);
		} catch (e) {
			console.log(e.message);
			res.sendStatus(500);
		}
	}
);

Router.post('/orders', isLogged, async (req, res) => {
	let answer;
	let order = req.body;
	let query = `INSERT INTO orders (description, payment, status, user_id) VALUES("${order.description}", "${order.payment}", "${order.status}", "${order.user_id}");`;
	[answer] = await sequelize.query(query);
	query = `SELECT * FROM orders WHERE id = ${answer}`;
	answer = await sequelize.query(query);
	res.status(201).json(answer[0]);
});

// Router.get('/orders/:id', async (req, res) => {
// 	let { id } = req.params;
// 	const query = `SELECT * FROM orders WHERE id = ${id} AND is_deleted = 0`;

// 	const answer = await sequelize.query(query);
// 	res.status(200).send(answer[0]);
// });

Router.delete('/orders/:id', async (req, res) => {
	let { id } = req.params;
	const query = `UPDATE orders SET is_deleted = 1 WHERE id = ${id}`;
	await sequelize.query(query);
	res.sendStatus(204);
});

Router.put('/orders/:id', async (req, res) => {
	let { id } = req.params;
	let order = req.body;
	let query = `UPDATE orders SET description = "${order.description}",	payment = "${order.payment}",	status = "${order.status}" WHERE id = "${id}"`;
	await sequelize.query(query);

	query = `SELECT * FROM orders WHERE id = ${id} AND is_deleted = 0`;
	const answer = await sequelize.query(query);

	res.status(200).send(answer[0]);
});

module.exports = Router;
