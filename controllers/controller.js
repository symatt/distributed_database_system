const node1_db = require("../models/node1_db");

const controller = {
	connectToNode1: function (req, res) {
		node1_db.connectToDatabase();
		res.send(null);
	},
};

module.exports = controller;
