const express = require('express');
const router = express.Router();
const sequelize = require('../../database');
const jwt = require('jsonwebtoken');
const { privateKey } = require('../../private.key');
const { alreadyLogged, isAdmin } = require('../lib/helpers');

//! ROUTES /USERS
router.get('/users', isAdmin, async (req, res) => {
	const query = 'SELECT * FROM users WHERE is_deleted = 0';
	const answer = await sequelize.query(query);
	res.status(200).send(answer[0]);
});

router.post('/signup', async (req, res) => {
	let answer;
	let user = req.body;
	let query = `INSERT INTO users (username, fullname, email, phone, address, password) VALUES("${user.username}", "${user.fullname}", "${user.email}", "${user.phone}", "${user.address}", "${user.password}");`;
	answer = await sequelize.query(query);
	query = `SELECT * FROM users WHERE id = ${answer[0]}`;
	answer = await sequelize.query(query);
	const token = jwt.sign(answer[0][0].username, privateKey);
	answer[0][0].token = token;
	res.status(201).json(answer[0]);
});

router.post('/signin', alreadyLogged, async (req, res) => {
	let { username, password } = req.body;
	let query = `SELECT * FROM users WHERE username = "${username}" AND password = "${password}" AND is_deleted = 0`;
	const answer = await sequelize.query(query);
	if (answer[0].length !== 0) {
		const token = jwt.sign(username, privateKey);
		res.json({ token });
	} else res.status(403).send({ Error: 'Invalid credentials.' });
});

router.get('/users/:id', async (req, res) => {
	let { id } = req.params;
	const query = `SELECT * FROM users WHERE id = ${id} AND is_deleted = 0`;

	const answer = await sequelize.query(query);
	res.status(200).send(answer[0]);
});

router.delete('/users/:id', async (req, res) => {
	let { id } = req.params;
	const query = `UPDATE users SET is_deleted = 1 WHERE id = ${id}`;
	await sequelize.query(query);
	res.sendStatus(204);
});

router.put('/users/:id', async (req, res) => {
	let { id } = req.params;
	let user = req.body;
	let query = `UPDATE users SET username = "${user.username}",	fullname = "${user.fullname}",	email = "${user.email}", phone = "${user.phone}", address = "${user.address}", password = "${user.password}"  WHERE id = "${id}"`;
	await sequelize.query(query);

	query = `SELECT * FROM users WHERE id = ${id} AND is_deleted = 0`;
	const answer = await sequelize.query(query);

	res.status(200).send(answer[0]);
});

module.exports = router;
