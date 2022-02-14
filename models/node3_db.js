const db = require("./db");

const node3_db = {
	// connectToDatabase1: function () {
	// 	db.con1.connect(function (err) {
	// 		if (err) {
	// 			console.log("Error connecting to node 1 :" + err.stack);
	// 			return;
	// 		}
	// 		console.log("Connected to Node 1.");
	// 	});
	// },

	// connectToDatabase2: function () {
	// 	db.con2.connect(function (err) {
	// 		if (err) {
	// 			console.log("Error connecting to node 2 :" + err.stack);
	// 			return;
	// 		}
	// 		console.log("Connected to Node 2.");
	// 	});
	// },

	// connectToDatabase: function () {
	// 	db.con3.connect(function (err) {
	// 		if (err) {
	// 			console.log("Error connecting to node 3 :" + err.stack);
	// 			return;
	// 		}
	// 		console.log("Connected to Node 3.");
	// 	});
	// },

	// disconnectFromDatabase1: function () {
	// 	db.con1.end(function (err) {
	// 		if (err) {
	// 			console.log("Error disconnecting from node 1 :" + err.stack);
	// 			return;
	// 		}
	// 		console.log("Disconnected from Node 1.");
	// 	});
	// },

	// disconnectFromDatabase2: function () {
	// 	db.con2.end(function (err) {
	// 		if (err) {
	// 			console.log("Error disconnecting from node 2 :" + err.stack);
	// 			return;
	// 		}
	// 		console.log("Disconnected from Node 2.");
	// 	});
	// },

	// disconnectFromDatabase: function () {
	// 	db.con3.end(function (err) {
	// 		if (err) {
	// 			console.log("Error disconnecting from node 3 :" + err.stack);
	// 			return;
	// 		}
	// 		console.log("Disconnected from Node 3.");
	// 	});
	// },

	getAll: function (callback) {
		let q =
			"SELECT * FROM movies WHERE movies.rank IS NOT NULL LIMIT 5000;";
		db.con3.getConnection(function (err, connection) {
			if (err) throw err;
			db.con3.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
				console.log(results);
				console.log(results.length);
				return callback(results);
			});
		});
	},

	query: function (q, callback) {
		db.con3.getConnection(function (err, connection) {
			if (err) throw err;
			let qString = `${q}`;
			db.con3.query(qString, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
				return callback(results);
			});
		});
	},

	queryToNode1: function (q) {
		db.con1.getConnection(function (err, connection) {
			if (err) throw err;
			db.con1.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	queryToNode2: function (q) {
		db.con2.getConnection(function (err, connection) {
			if (err) throw err;
			db.con2.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	cleanDB: function () {
		let q =
			"DELETE FROM movies WHERE movies.year<1980 AND movies.rank IS NOT NULL;";
		db.con3.getConnection(function (err, connection) {
			if (err) throw err;
			db.con3.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},

	setIsoLevel: function (iso) {
		db.con3.getConnection(function (err, connection) {
			if (err) throw err;
			db.con3.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL ${iso};`,
				function (err, result, fields) {
					connection.release();
					if (err) console.log(err.message);
				}
			);
		});
	},

	getLastUpdateTime: function (callback) {
		db.con3.getConnection(function (err, connection) {
			if (err) throw err;
			db.con3.query(
				`SELECT UPDATE_TIME as utime FROM information_schema.tables WHERE TABLE_SCHEMA='imdb_small' AND TABLE_NAME='movies';`,
				function (err, results, fields) {
					connection.release();
					if (err) console.log(err.message);
					return callback(results);
				}
			);
		});
	},
};

module.exports = node3_db;
