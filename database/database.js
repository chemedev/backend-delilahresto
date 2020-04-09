const { db } = require('./keys');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	`mysql://${db.user}:${db.password}@${db.host}:3306/${db.database}`,
	{ logging: false }
);

function sql(query, ...params) {
	return sequelize
		.query(query, {
			replacements: [...params],
			type: sequelize.QueryTypes.SELECT,
		})
		.catch((e) => console.log({e, Query: e.sql, Message: e.message }));
}

sequelize
	.authenticate()
	.then(() => console.log('Conexión establecida.'))
	.catch((err) => console.log('Error:', err));

(async () => {
	try {
		console.log('Users:', await sql('SELECT COUNT(*) FROM users'));
		console.log('Products', await sql('SELECT COUNT(*) FROM products'));
		console.log('Orders', await sql('SELECT COUNT(*) FROM orders'));
		console.log('Details', await sql('SELECT COUNT(*) FROM order_details'));
	} catch (err) {
		console.log('Hubo un error:', err.message);
	}
})();

module.exports = { sequelize, sql};