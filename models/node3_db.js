const mysql = require("mysql");

var con1 = mysql.createConnection({
	host: "stadvdb-mco2-node3.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
	user: "admin",
	password: "stadvdb12345",
	port: "3300",
});

const node3_db = {
	connectToDatabase: function () {
		con1.connect(function (err) {
			if (err) {
				console.log("Error connecting to node 3 :" + err.stack);
				return;
			}
			console.log("Connected to Node 3.");
		});
	},

	disconnectFromDatabase: function () {
		con1.end(function (err) {
			if (err) {
				console.log("Error disconnecting from node 3 :" + err.stack);
				return;
			}
			console.log("Disconnected from Node 3.");
		});
	},
};

module.exports = node3_db;
