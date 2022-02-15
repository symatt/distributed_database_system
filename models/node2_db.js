const db = require("./db");

const node2_db = {
	// selects all the movies from node 2 that are not null and limits it to 5000 rows
	getAll: function (callback) {
		let q =
			"SELECT * FROM movies WHERE movies.rank IS NOT NULL LIMIT 5000;";
		db.con2.getConnection(function (err, connection) {
			if (err) throw err;
			db.con2.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
				console.log(results);
				console.log(results.length);
				return callback(results);
			});
		});
	},

	// executes queries made for node 2
	query: function (q, callback) {
		db.con2.getConnection(function (err, connection) {
			if (err) throw err;
			let qString = `${q}`;
			db.con2.query(qString, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
				return callback(results);
			});
		});
	},

	// replicates queries made for node 2 to node 1
	queryToNode1: function (q) {
		db.con1.getConnection(function (err, connection) {
			if (err) throw err;
			db.con1.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	// replicates queries made for node 2 to node 3
	queryToNode3: function (q) {
		db.con3.getConnection(function (err, connection) {
			if (err) throw err;
			db.con3.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	// deletes the data not supported by node 2
	cleanDB: function () {
		let q =
			"DELETE FROM movies WHERE movies.year>=1980 AND movies.rank IS NOT NULL;";
		db.con2.getConnection(function (err, connection) {
			if (err) throw err;
			db.con2.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	// set the session isolation level of node 2
	setIsoLevel: function (iso) {
		db.con2.getConnection(function (err, connection) {
			if (err) throw err;
			db.con2.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL ${iso};`,
				function (err, result, fields) {
					connection.release();
					if (err) console.log(err.message);
				}
			);
		});
	},
};

module.exports = node2_db;
