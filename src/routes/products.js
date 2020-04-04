const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const sequelize = require('../../database');

//! ROUTES /PRODUCTS
router.get('/products', async (req, res) => {
	const query = 'SELECT * FROM products WHERE is_deleted = 0';
	const answer = await sequelize.query(query);
	res.status(200).send(answer[0]);
});

router.post('/products', async (req, res) => {
	let answer;
	let product = req.body;
	let query = `INSERT INTO products (description, picture, price) VALUES("${product.description}", "${product.picture}", "${product.price}");`;
	[answer] = await sequelize.query(query);
	query = `SELECT * FROM products WHERE id = ${answer}`;
	answer = await sequelize.query(query);
	res.status(201).json(answer[0]);
});

router.get('/products/:id', async (req, res) => {
	let { id } = req.params;
	const query = `SELECT * FROM products WHERE id = ${id} AND is_deleted = 0`;

	const answer = await sequelize.query(query);
	res.status(200).send(answer[0]);
});

router.put('/products/:id', async (req, res) => {
	let { id } = req.params;
	let product = req.body;
	let query = `UPDATE products SET description = "${product.description}",	picture = "${product.picture}",	price = "${product.price}" WHERE id = "${id}"`;
	await sequelize.query(query);

	query = `SELECT * FROM products WHERE id = ${id} AND is_deleted = 0`;
	const answer = await sequelize.query(query);

	res.status(200).send(answer[0]);
});

router.delete('/products/:id', async (req, res) => {
	let { id } = req.params;
	const query = `UPDATE products SET is_deleted = 1 WHERE id = ${id}`;
	await sequelize.query(query);
	res.sendStatus(204);
});

module.exports = router;
