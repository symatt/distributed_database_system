const node1_db = require("../models/node1_db");
const node2_db = require("../models/node2_db");
const node3_db = require("../models/node3_db");

const controller = {
	connectToNode1: function (req, res) {
		node1_db.connectToDatabase();
	},

	disconnectFromNode1: function (req, res) {
		node1_db.disconnectFromDatabase();
	},

	getAllMoviesNode1: function (req, res) {
		node1_db.getAll((results) => {
			if (results != null) {
				console.log("movies result from select all");
				let movies = {
					datalength: results.length,
					data: [],
				};
				results.forEach((RowDataPacket) => {
					movies.data.push(RowDataPacket);
				});
				console.log("update node1 page");
				res.send(movies);
			} else console.log("error with query all node 1");
		});
	},

	queryNode1: function (req, res) {
		let q = req.body.queryInput;
		console.log(q);
		console.log("querying transactions in node 1");
		node1_db.query(q, (results) => {
			if (results != null) {
				console.log("movies result from select");
				let movies = {
					datalength: results.length,
					data: [],
				};
				results.forEach((RowDataPacket) => {
					movies.data.push(RowDataPacket);
				});
				console.log(movies);
				console.log("update node1 page with query");
				res.send(movies);
			} else {
				console.log("insert/delete has been made");
			}
		});
	},

	connectToNode2: function (req, res) {
		node2_db.connectToDatabase();
	},

	disconnectFromNode2: function (req, res) {
		node2_db.disconnectFromDatabase();
	},

	queryNode2: function (req, res) {
		let q = req.body.query;
		console.log("querying transactions in node 2");
		node1_db.query(q);
	},

	connectToNode3: function (req, res) {
		node3_db.connectToDatabase();
	},

	disconnectFromNode3: function (req, res) {
		node3_db.disconnectFromDatabase();
	},

	queryNode3: function (req, res) {
		let q = req.body.query;
		console.log("querying transactions in node 3");
		node1_db.query(q);
	},
};

module.exports = controller;
