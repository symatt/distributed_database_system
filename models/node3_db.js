const mysql = require("mysql");
const db = require("./db");

const node3_db = {
	connectToDatabase: function () {
		db.con1.connect(function (err) {
			if (err) {
				console.log("Error connecting to node 1 :" + err.stack);
				return;
			}
			console.log("Connected to Node 1.");
		});

		db.con2.connect(function (err) {
			if (err) {
				console.log("Error connecting to node 2 :" + err.stack);
				return;
			}
			console.log("Connected to Node 2.");
		});

		db.con3.connect(function (err) {
			if (err) {
				console.log("Error connecting to node 3 :" + err.stack);
				return;
			}
			console.log("Connected to Node 3.");
		});
	},

	disconnectFromDatabase: function () {
		db.con1.end(function (err) {
			if (err) {
				console.log("Error disconnecting from node 1 :" + err.stack);
				return;
			}
			console.log("Disconnected from Node 1.");
		});

		db.con2.end(function (err) {
			if (err) {
				console.log("Error disconnecting from node 2 :" + err.stack);
				return;
			}
			console.log("Disconnected from Node 2.");
		});

		db.con3.end(function (err) {
			if (err) {
				console.log("Error disconnecting from node 3 :" + err.stack);
				return;
			}
			console.log("Disconnected from Node 3.");
		});
	},

	getAll: function (callback) {
		let q = "SELECT * FROM movies;";
		db.con3.query(q, function (err, results, fields) {
			if (err) console.log(err.message);
			console.log(results);
			console.log(results.length);
			return callback(results);
		});
	},

	query: function (q, callback) {
		db.con3.query(q, function (err, results, fields) {
			if (err) console.log(err.message);
			console.log(results);
			console.log(results.length);
			return callback(results);
		});
	},

	queryToOthers: function (q) {
		db.con1.query(q, function (err, results, fields) {
			if (err) console.log(err.message);
		});

		db.con2.query(q, function (err, results, fields) {
			if (err) console.log(err.message);
		});
	},

	cleanDB: function () {
		let q = "DELETE FROM movies WHERE movies.year<1980;";
		db.con3.query(q, function (err, results, fields) {
			if (err) console.log(err.message);
		});
	},

	setIsoLevel: function (iso) {
		db.con3.query(
			`SET SESSION TRANSACTION ISOLATION LEVEL ${iso};`,
			function (err, result, fields) {
				if (err) console.log(err.message);
			}
		);
	},
};

module.exports = node3_db;
