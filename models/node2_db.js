const mysql = require("mysql");

var con2 = mysql.createConnection({
	host: "stadvdb-mco2-node2.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
	user: "admin",
	password: "stadvdb12345",
	port: "3303",
	database: "imdb_small",
});

const node2_db = {
	connectToDatabase: function () {
		con2.connect(function (err) {
			if (err) {
				console.log("Error connecting to node 2 :" + err.stack);
				return;
			}
			console.log("Connected to Node 2.");
		});
	},

	disconnectFromDatabase: function () {
		con2.end(function (err) {
			if (err) {
				console.log("Error disconnecting from node 2 :" + err.stack);
				return;
			}
			console.log("Disconnected from Node 2.");
		});
	},
};

module.exports = node2_db;
