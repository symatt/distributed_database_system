const db = require("./db");

const node1_db = {
	// selects all the movies from node 1 that are not null and limits it to 5000 rows
	getAll: function (callback) {
		let q =
			"SELECT * FROM movies WHERE movies.rank IS NOT NULL LIMIT 5000;";
		db.con1.getConnection(function (err, connection) {
			if (err) throw err;
			db.con1.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
				console.log(results);
				console.log(results.length);
				return callback(results);
			});
		});
	},

	// executes queries made for node 1
	query: function (q, callback) {
		db.con1.getConnection(function (err, connection) {
			if (err) throw err;
			let qString = `${q}`;
			db.con1.query(qString, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
				return callback(results);
			});
		});
	},

	// replicates queries made for node 1 to node 2
	queryToNode2: function (q) {
		db.con2.getConnection(function (err, connection) {
			if (err) throw err;
			db.con2.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	// replicates queries made for node 1 to node 3
	queryToNode3: function (q) {
		db.con3.getConnection(function (err, connection) {
			if (err) throw err;
			db.con3.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	// set the session isolation level of node 1
	setIsoLevel: function (iso) {
		db.con1.getConnection(function (err, connection) {
			if (err) throw err;
			db.con1.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL ${iso};`,
				function (err, result, fields) {
					connection.release();
					if (err) console.log(err.message);
				}
			);
		});
	},
};

module.exports = node1_db;
