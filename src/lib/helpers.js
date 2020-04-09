const { sequelize } = require('../../database/database');
const { privateKey } = require('../../src/private.key');
const jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
	if (!req.headers.authorization) return res.sendStatus(401);
	let token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, privateKey, (err, data) => {
		if (err) return res.status(400).send([{ err: err.message }]);
		if (!data.is_admin) return res.sendStatus(401);
		next();
	});
}

function isLogged(req, res, next) {
	if (!req.headers.authorization) return res.sendStatus(401);
	let token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, privateKey, async (err, data) => {
		if (err) return res.status(400).send([{ err: err.message }]);
		let query = `SELECT username FROM users WHERE id = ${data.id}`;
		let answer = await sequelize.query(query);
		if (!answer[0][0]) return res.sendStatus(401);
		next();
	});
}

function isAccesingOwnData(req, res, next) {
	if (!req.params.username) return res.sendStatus(400);
	let token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, privateKey, async (err, data) => {
		if (err) return res.status(400).send([{ err: err.message }]);
		if (req.params.username !== data.username) return res.sendStatus(401);
		next();
	});
}

module.exports = { isAdmin, isLogged, isAccesingOwnData };

// function authUser(req, res, next) {
// 	const header = req.headers.authorization;

// 	if (header) {
// 		const token = header.split(' ')[1];
// 		jwt.verify(token, secret, (err, data) => {
// 			if (data) {
// 				req.user = data;
// 				next();
// 			} else {
// 				res.status(401).json({ err: 'Invalid token.' });
// 			}
// 		});
// 	} else {
// 		res.status(401).json({ err: 'Null token.' });
// 	}
// }

// async function isLoggedIn(req, res, next) {
// 	try {
// 		console.log(req.headers);
// 		if (req.headers.authorization !== '') {
// 			const token = req.headers.authorization;
// 			let username = jwt.verify(token, privateKey);
// 			let query = `SELECT * FROM users WHERE username = "${username}"`;
// 			let answer = await sequelize.query(query);
// 			if (!answer[0]) return next();
// 			return res.json([{ err: 'You are already logged.' }]);
// 		} else return res.json({ err: 'Not logged in.' });
// 	} catch (err) {
// 		res.status(401).json({ err });
// 	}
// }
