const mysql = require("mysql");

const db = {
	con1: mysql.createPool({
		connectionLimit: 20,
		host: "stadvdb-mco2-central-node.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
		user: "admin",
		password: "stadvdb12345",
		port: "3306",
		multipleStatements: true,
		database: "imdb_small",
	}),

	con2: mysql.createPool({
		connectionLimit: 20,
		host: "stadvdb-mco2-node2.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
		user: "admin",
		password: "stadvdb12345",
		port: "3303",
		multipleStatements: true,
		database: "imdb_small",
	}),

	con3: mysql.createPool({
		connectionLimit: 20,
		host: "stadvdb-mco2-node3.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
		user: "admin",
		password: "stadvdb12345",
		port: "3300",
		multipleStatements: true,
		database: "imdb_small",
	}),

	conTime: mysql.createPool({
		connectionLimit: 20,
		host: "stadvdb-mco2-node-times.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
		user: "admin",
		password: "stadvdb12345",
		port: "3309",
		multipleStatements: true,
		database: "node_times",
	}),
};

module.exports = db;
