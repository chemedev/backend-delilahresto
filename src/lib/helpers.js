const sequelize = require('../../database');
const jwt = require('jsonwebtoken');
const { privateKey } = require('../../private.key');

function authUser(req, res, next) {
	const header = req.headers.authorization;

	if (header) {
		const token = header.split(' ')[1];
		jwt.verify(token, secret, (err, data) => {
			if (data) {
				req.user = data;
				next();
			} else {
				res.status(401).json({ error: 'Invalid token.' });
			}
		});
	} else {
		res.status(401).json({ error: 'Null token.' });
	}
}

async function alreadyLogged(req, res, next) {
	const { token } = req.body;
	if (!token) return next();
	try {
		username = jwt.verify(token, privateKey);
		query = `SELECT * FROM users WHERE username = "${username}"`;
		answer = await sequelize.query(query);
		if (answer[0].length !== 0) res.json({ token: token });
	} catch (err) {
		res.status(401).json({ err });
	}
}

async function isAdmin(req, res, next) {
	const { username } = req.body;
	query = `SELECT is_admin FROM users WHERE username = "${username}"`;
	answer = await sequelize.query(query);
	console.log(answer[0]);
	if (answer[0].length !== 0) {
		if (answer[0].isAdmin) return next();
	}
}

module.exports = { alreadyLogged, isAdmin };
