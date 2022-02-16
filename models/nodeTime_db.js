const db = require("./db");

const nodeTime_db = {
	// gets the table of times
	getUpdateTimes: function (callback) {
		let q = "SELECT nodes.node, nodes.time FROM nodes;";
		db.conTime.getConnection(function (err, connection) {
			if (err) throw err;
			db.conTime.query(q, function (err, results, fields) {
				connection.destroy();
				if (err) console.log(err.message);
				console.log(results);
				console.log(results.length);
				return callback(results);
			});
		});
	},

	// get the table of status
	getStatus: function (callback) {
		let q = "SELECT nodes.node, nodes.online FROM nodes;";
		db.conTime.getConnection(function (err, connection) {
			if (err) throw err;
			db.conTime.query(q, function (err, results, fields) {
				connection.destroy();
				if (err) console.log(err.message);
				console.log(results);
				console.log(results.length);
				return callback(results);
			});
		});
	},

	// updates a certain node's last time updated
	updateTime: function (node, time, callback) {
		let q = `UPDATE nodes SET time = '${time}' WHERE node = ${node};`;
		db.conTime.getConnection(function (err, connection) {
			if (err) throw err;
			db.conTime.query(q, function (err, results, fields) {
				connection.destroy();
				if (err) console.log(err.message);
                return;
			});
		});
	},

	// updates a certain node's status (on or off)
	updateOnline: function (node, online) {
		let q = `UPDATE nodes SET online = ${online} WHERE node = ${node};`;
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
