// -- CREATE TABLE orders(
// -- 	id INT NOT NULL AUTO_INCREMENT = 10000,
// --   created_at DATETIME NOT NULL,
// --   description VARCHAR(255) NOT NULL,
// --   payment VARCHAR(100) NOT NULL,
// -- 	status VARCHAR(25) NOT NULL,
// -- 	is_deleted TINYINT(1) NOT NULL DEFAULT 0,
// -- 	user_id INT NOT NULL,
// --   PRIMARY KEY(id),
// --   FOREIGN KEY(user_id) REFERENCES users(id)
// -- );

const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const sequelize = require('../../database');

//! ROUTES /ORDERS
router.get('/orders', async (req, res) => {
	const query = 'SELECT * FROM orders WHERE is_deleted = 0';
	const answer = await sequelize.query(query);
	res.status(200).send(answer[0]);
});

router.post('/orders', async (req, res) => {
	let answer;
	let order = req.body;
	let query = `INSERT INTO orders (created_at, description, payment, status, user_id) VALUES("${order.created_at}", "${order.description}", "${order.payment}", "${order.status}", "${order.user_id}");`;
	[answer] = await sequelize.query(query);
	query = `SELECT * FROM orders WHERE id = ${answer}`;
	answer = await sequelize.query(query);
	res.status(201).json(answer[0]);
});

router.get('/orders/:id', async (req, res) => {
	let { id } = req.params;
	const query = `SELECT * FROM orders WHERE id = ${id} AND is_deleted = 0`;

	const answer = await sequelize.query(query);
	res.status(200).send(answer[0]);
});

router.delete('/orders/:id', async (req, res) => {
	let { id } = req.params;
	const query = `UPDATE orders SET is_deleted = 1 WHERE id = ${id}`;
	await sequelize.query(query);
	res.sendStatus(204);
});

router.put('/orders/:id', async (req, res) => {
	let { id } = req.params;
	let order = req.body;
	let query = `UPDATE orders SET description = "${order.description}",	payment = "${order.payment}",	status = "${order.status}" WHERE id = "${id}"`;
	await sequelize.query(query);

	query = `SELECT * FROM orders WHERE id = ${id} AND is_deleted = 0`;
	const answer = await sequelize.query(query);

	res.status(200).send(answer[0]);
});

module.exports = router;