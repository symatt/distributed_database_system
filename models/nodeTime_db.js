const db = require("./db");

const nodeTime_db = {
	getUpdateTimes: function (callback) {
		let q = "SELECT * FROM nodes;";
		db.conTime.getConnection(function (err, connection) {
			if (err) throw err;
			db.conTime.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
				console.log(results);
				console.log(results.length);
				return callback(results);
			});
		});
	},

	updateTime: function (node, time) {
		let q = `UPDATE nodes SET time = '${time}' WHERE node = ${node};`;
		db.conTime.getConnection(function (err, connection) {
			if (err) throw err;
			db.conTime.query(q, function (err, results, fields) {
				connection.release();
				if (err) console.log(err.message);
			});
		});
	},
};

module.exports = nodeTime_db;
