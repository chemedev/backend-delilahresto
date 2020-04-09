const express = require('express');
const { sql, sequelize } = require('../../database/database');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const { privateKey } = require('../../src/private.key');
const { isAdmin, isLogged, isAccesingOwnData } = require('../lib/helpers');

//TODO: Revisar err 404 si hace falta o no.

//! ROUTES /USERS

Router.post('/users', async (req, res) => {
	try {
		let { username, fullname, email, mobile, address, password } = req.body;
		if (!username || !fullname || !email || !mobile || !address || !password)
			return res.sendStatus(400);
		let query = `SELECT username, email, mobile FROM users WHERE is_deleted = 0 && (email = "${email}" || mobile = "${mobile}" || username = "${username}")`;
		let answer = await sequelize.query(query);
		if (answer[0][0])
			return res
				.status(409)
				.send([{ err: 'Email, username or mobile already used.' }]);
		query = `INSERT INTO users (username, fullname, email, mobile, address, password) VALUES("${username}", "${fullname}", "${email}", "${mobile}", "${address}", "${password}");`;
		answer = await sequelize.query(query);
		query = `SELECT username, fullname, email, mobile, address FROM users WHERE id = ${answer[0]}`;
		answer = await sequelize.query(query);
		res.status(201).json(answer[0]);
	} catch {
		res.sendStatus(500);
	}
});

Router.get('/users', isAdmin, async (_req, res) => {
	try {
		const query =
			'SELECT id, username, fullname, email, mobile, address FROM users WHERE is_deleted = 0';
		const answer = await sequelize.query(query);
		res.status(200).send(answer[0]);
	} catch {
		res.sendStatus(500);
	}
});

Router.get(
	'/users/:username',
	isLogged,
	isAccesingOwnData,
	async (req, res) => {
		try {
			let { username } = req.params;
			let regex = new RegExp('^[\\w]+$');
			if (!regex.test(username)) return res.sendStatus(400);
			const answer = await sql(
				'SELECT username, fullname, email, mobile, address FROM users WHERE username = ? AND is_deleted = 0',
				username
			);
			// if (!answer[0]) return res.sendStatus(404);		//! No hace falta comprobar...
			res.send(answer);
		} catch {
			res.sendStatus(500);
		}
	}
);

Router.put(
	'/users/:username',
	isLogged,
	isAccesingOwnData,
	async (req, res) => {
		try {
			let { username } = req.params;
			let regex = new RegExp('^[\\w]+$');
			if (!regex.test(username)) return res.sendStatus(400);
			let {
				usernameBody,
				fullname,
				email,
				mobile,
				address,
				password,
			} = req.body;
			if (
				!usernameBody ||
				!fullname ||
				!email ||
				!mobile ||
				!address ||
				!password
			)
				return res.sendStatus(400);
			let query = `SELECT * FROM users WHERE username = ${username} AND is_deleted = 0`;
			let answer = await sequelize.query(query);
			if (!answer[0][0]) return res.sendStatus(404);
			query = `UPDATE users SET username = "${usernameBody}",	fullname = "${fullname}",	email = "${email}", mobile = "${mobile}", address = "${address}", password = "${password}"  WHERE username = "${username}"`;
			[answer] = await sequelize.query(query);
			if (!answer.changedRows)
				return res.status(409).send([{ err: 'Nothing changed.' }]);
			query = `SELECT * FROM users WHERE username = ${usernameBody}`;
			answer = await sequelize.query(query);
			res.send(answer[0]);
		} catch {
			res.sendStatus(500);
		}
	}
);

Router.delete('/users/:id', isAdmin, async (req, res) => {
	try {
		let { id } = req.params;
		let regex = new RegExp('^[0-9]+$');
		if (!regex.test(id)) return res.sendStatus(400);
		let query = `SELECT * FROM users WHERE id = ${id} AND is_deleted = 0`;
		let answer = await sequelize.query(query);
		if (!answer[0][0]) return res.sendStatus(404);
		query = `UPDATE users SET is_deleted = 1 WHERE id = ${id}`;
		await sequelize.query(query);
		res.sendStatus(204);
	} catch {
		res.sendStatus(500);
	}
});

Router.post('/signin', async (req, res) => {
	let query, user, payload;
	let { username, email, password } = req.body;
	if ((!username || !email) && !password) return res.sendStatus(400);
	if (username)
		query = `SELECT id, is_admin, fullname, address FROM users WHERE username = "${username}" AND password = "${password}" AND is_deleted = 0`;
	else
		query = `SELECT id, is_admin, fullname, address FROM users WHERE email = "${email}" AND password = "${password}" AND is_deleted = 0`;
	const answer = await sequelize.query(query);
	if (!answer[0])
		return res.status(401).send([{ err: 'Invalid credentials.' }]);
	user = answer[0][0];
	payload = {
		id: user.id,
		username: username,
		is_admin: user.is_admin,
	};
	const token = jwt.sign(payload, privateKey);
	res.set('Authorization', `Bearer ${token}`);
	res.send([{ fullname: user.fullname, address: user.address }]);
});

module.exports = Router;
