const { db } = require('./keys');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	`mysql://${db.user}:${db.password}@${db.host}:3306/${db.database}`,
	{ logging: false }
);

sequelize
	.authenticate()
	.then(() => console.log('Conexión establecida.'))
	.catch(err => console.log('Error:', err));

(async () => {
	let count = 0;
	try {
		[count] = await sequelize.query(`SELECT COUNT(*) FROM users`);
		console.log('Users:', count);
		[count] = await sequelize.query(`SELECT COUNT(*) FROM products`);
		console.log('Products:', count);
		[count] = await sequelize.query(`SELECT COUNT(*) FROM orders`);
		console.log('Orders', count);
	} catch (err) {
		console.log('Hubo un error:', err.parent.code);
	}
})();

module.exports = sequelize;