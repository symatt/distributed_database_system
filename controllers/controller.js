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

	connectToNode2: function (req, res) {
		node2_db.connectToDatabase();
	},

	disconnectFromNode2: function (req, res) {
		node2_db.disconnectFromDatabase();
	},

    connectToNode3: function (req, res) {
		node3_db.connectToDatabase();
	},

	disconnectFromNode3: function (req, res) {
		node3_db.disconnectFromDatabase();
	},
};

module.exports = controller;
