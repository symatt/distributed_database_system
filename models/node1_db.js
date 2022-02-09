const mysql = require("mysql");

var con1 = mysql.createConnection({
	host: "stadvdb-mco2-central-node.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
	user: "admin",
	password: "stadvdb12345",
	port: "3306",
});

const node1_db = {
	connectToDatabase: function () {
		con1.connect(function (err) {
			if (err) {
				console.log("Error connecting to node 1 :" + err.stack);
				return;
			}
			console.log("Connected to Node 1.");
		});
	},

	disconnectFromDatabase: function () {
		con1.end(function (err) {
			if (err) {
				console.log("Error disconnecting from node 1 :" + err.stack);
				return;
			}
			console.log("Disconnected from Node 1.");
		});
	},
};

module.exports = node1_db;
