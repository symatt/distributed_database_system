const node1_db = require("../models/node1_db");
const node2_db = require("../models/node2_db");
const node3_db = require("../models/node3_db");

const controller = {
	connectToNode1: function (req, res) {
		node1_db.connectToDatabase();
		node1_db.connectToDatabase2();
		node1_db.connectToDatabase3();
		// delete all contents
		node1_db.query(`DELETE FROM movies;`, (result) => {});
		console.log("[NODE 1] deleted movies");
		// select all from node 2
		node2_db.cleanDB();
		console.log("[NODE 2] clean DB");
		node2_db.getAll((results) => {
			if (results != null) {
				console.log("[NODE 2] select all movies");
				let movies = {
					datalength: results.length,
					data: [],
				};
				results.forEach((RowDataPacket) => {
					movies.data.push(RowDataPacket);
				});
				// insert to central
				var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) 
                        VALUES `;
				movies.data.forEach((row) => {
					console.log(row);
					//let q = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank)
					//VALUES (${row.id}, "${row.name}", ${row.year}, ${row.rank});`;

					insertString = insertString.concat(
						`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
					);
					console.log("Added to string node 2");
				});

				insertString = insertString.slice(0, -2);
				console.log(insertString);

				node1_db.query(insertString, (results) => {
					console.log(
						"[NODE 1] replication of 1 row from node 2 complete."
					);
				});
			} else console.log("[NODE 2] error with select all");
		});

		// select all from node 3
		node3_db.cleanDB();
		console.log("[NODE 3] clean DB");
		node3_db.getAll((results) => {
			if (results != null) {
				console.log("[NODE 3] select all movies");
				let movies = {
					datalength: results.length,
					data: [],
				};
				results.forEach((RowDataPacket) => {
					movies.data.push(RowDataPacket);
				});
				// insert to central
				var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) 
                        VALUES `;
				movies.data.forEach((row) => {
					console.log(row);
					//let q = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank)
					//VALUES (${row.id}, "${row.name}", ${row.year}, ${row.rank});`;

					insertString = insertString.concat(
						`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
					);
					console.log("Added to string node 3");
				});

				insertString = insertString.slice(0, -2);
				console.log(insertString);

				node1_db.query(insertString, (results) => {
					console.log(
						"[NODE 1] replication of 1 row from node 3 complete."
					);
				});
			} else console.log("[NODE 3] error with select all");
		});

		console.log("[NODE 1] finished replication from node 2 and 3.");
		res.status(200).end();
	},

	disconnectFromNode1: function (req, res) {
		node1_db.disconnectFromDatabase();
		res.status(200).end();
	},

	getAllMoviesNode1: function (req, res) {
		node1_db.getAll((results) => {
			if (results != null) {
				console.log("[NODE 1] select all transaction");
				let movies = {
					datalength: results.length,
					data: [],
				};
				results.forEach((RowDataPacket) => {
					movies.data.push(RowDataPacket);
				});
				console.log("[NODE 1] Reloading table");
				res.send(movies);
			} else console.log("[NODE 1] error with select all");
		});
	},

	queryNode1: function (req, res) {
		let q = req.body.queryInput;
		console.log(q);
		if (q === "") {
			console.log("QUERY EMPTY");
			res.status(404).end();
		} else {
			console.log("[NODE 1] querying transactions");
			node1_db.query(q, (results) => {
				if (results.length != null) {
					console.log(results);
					let movies = {
						datalength: results.length,
						data: [],
					};
					results.forEach((RowDataPacket) => {
						movies.data.push(RowDataPacket);
					});
					console.log("[NODE 1] Reloading table");
					res.send(movies);
				} else if (results.length == null) {
					console.log(results);
					console.log("[NODE 1] insert/delete/update has been made");
					node1_db.queryToOthers(q);
					console.log("[NODE 2] insert/delete/update has been made");
					console.log("[NODE 3] insert/delete/update has been made");
				} else {
					console.log("[NODE 1] ERROR QUERY");
				}
			});
		}
	},

	setIsoLevel1: function (req, res) {
		let iso = req.body.iso;
		console.log(iso);
		node1_db.setIsoLevel(iso);
		console.log("changed isolation level");
		res.status(200).end();
	},

	failNode1: function (req, res) {
		node1_db.disconnectFromDatabase2();
		console.log("[NODE 1] crashed node 2");
		node1_db.disconnectFromDatabase3();
		console.log("[NODE 1] crashed node 3");
		res.status(200).end();
	},

	connectToNode2: function (req, res) {
		node2_db.connectToDatabase();
		node2_db.connectToDatabase1();
		node2_db.connectToDatabase3();
		console.log("[NODE 2] connecting to node 2...");
		node2_db.cleanDB();
		console.log("[NODE 2] cleaning up node 2...");

		// delete all contents
		node2_db.query(`DELETE FROM movies;`, (result) => {});
		console.log("[NODE 2] deleted movies");
		// select movies from node 1 where year < 1980
		node1_db.query(
			"SELECT * FROM movies WHERE movies.year<1980 AND movies.rank IS NOT NULL;",
			(results) => {
				if (results != null) {
					console.log("[NODE 1] select movies year < 1980");
					let movies = {
						datalength: results.length,
						data: [],
					};
					results.forEach((RowDataPacket) => {
						movies.data.push(RowDataPacket);
					});
					// insert to node 2
					var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) 
                        VALUES `;
					movies.data.forEach((row) => {
						console.log(row);
						//let q = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank)
						//VALUES (${row.id}, "${row.name}", ${row.year}, ${row.rank});`;

						insertString = insertString.concat(
							`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
						);
						console.log("Added to string node 1");
					});

					insertString = insertString.slice(0, -2);
					insertString = insertString.concat(`;`);
					console.log(insertString);

					node2_db.query(insertString, (results) => {
						console.log(
							"[NODE 2] finished replication from node 1."
						);
					});
				} else
					console.log(
						"[NODE 1] error with select movies year < 1980"
					);
			}
		);
		res.status(200).end();
	},

	disconnectFromNode2: function (req, res) {
		node2_db.disconnectFromDatabase();
		res.status(200).end();
	},

	getAllMoviesNode2: function (req, res) {
		node2_db.getAll((results) => {
			node2_db.cleanDB();

			if (results != null) {
				console.log("[NODE 2] select all transaction");
				let movies = {
					datalength: results.length,
					data: [],
				};
				results.forEach((RowDataPacket) => {
					movies.data.push(RowDataPacket);
				});
				console.log("[NODE 2] Reloading table");
				res.send(movies);
			} else console.log("[NODE 2] error with select all");
		});
	},

	queryNode2: function (req, res) {
		node2_db.cleanDB();

		let q = req.body.queryInput;
		console.log(q);
		if (q === "") {
			console.log("QUERY EMPTY");
			res.status(404).end();
		} else {
			console.log("[NODE 2] querying transactions");
			node2_db.query(q, (results) => {
				//console.log(results);
				if (results.length != null) {
					let movies = {
						datalength: results.length,
						data: [],
					};
					results.forEach((RowDataPacket) => {
						movies.data.push(RowDataPacket);
					});
					console.log("[NODE 2] Reloading table");
					res.send(movies);
				} else if (results.length == null) {
					console.log("[NODE 2] insert/delete/update has been made");
					node2_db.queryToOthers(q);
					console.log("[NODE 1] insert/delete/update has been made");
					console.log("[NODE 3] insert/delete/update has been made");
				} else {
					console.log("[NODE 2] ERROR QUERY");
				}
			});
		}
	},

	setIsoLevel2: function (req, res) {
		let iso = req.body.iso;
		console.log(iso);
		node2_db.setIsoLevel(iso);
		res.status(200).end();
	},

	failNode2: function (req, res) {
		node2_db.disconnectFromDatabase1();
		console.log("[NODE 2] crashed node 1");
		node2_db.disconnectFromDatabase3();
		console.log("[NODE 2] crashed node 3");
		res.status(200).end();
	},

	connectToNode3: function (req, res) {
		node3_db.connectToDatabase();
		node3_db.connectToDatabase1();
		node3_db.connectToDatabase2();
		console.log("[NODE 3] connecting to node 3...");
		node3_db.cleanDB();
		console.log("[NODE 3] cleaning up node 3...");

		// delete all contents
		node3_db.query(`DELETE FROM movies;`, (result) => {});
		console.log("[NODE 3] deleted movies");
		// select movies from node 1 where year >= 1980
		node1_db.query(
			"SELECT * FROM movies WHERE movies.year>=1980 AND movies.rank IS NOT NULL;",
			(results) => {
				if (results != null) {
					console.log("[NODE 1] select movies year >= 1980");
					let movies = {
						datalength: results.length,
						data: [],
					};
					results.forEach((RowDataPacket) => {
						movies.data.push(RowDataPacket);
					});
					// insert to node 3
					var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) 
                        VALUES `;
					movies.data.forEach((row) => {
						console.log(row);
						//let q = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank)
						//VALUES (${row.id}, "${row.name}", ${row.year}, ${row.rank});`;

						insertString = insertString.concat(
							`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
						);
						console.log("Added to string node 1");
					});

					insertString = insertString.slice(0, -2);
					insertString = insertString.concat(`;`);
					console.log(insertString);

					node3_db.query(insertString, (results) => {
						console.log(
							"[NODE 3] finished replication from node 1."
						);
					});
				} else
					console.log(
						"[NODE 1] error with select movies where year >= 1980"
					);
			}
		);
		res.status(200).end();
	},

	disconnectFromNode3: function (req, res) {
		node3_db.disconnectFromDatabase();
		res.status(200).end();
	},

	getAllMoviesNode3: function (req, res) {
		node3_db.getAll((results) => {
			node3_db.cleanDB();

			if (results != null) {
				console.log("[NODE 3] select all transaction");
				let movies = {
					datalength: results.length,
					data: [],
				};
				results.forEach((RowDataPacket) => {
					movies.data.push(RowDataPacket);
				});
				console.log("[NODE 3] Reloading table");
				res.send(movies);
			} else console.log("[NODE 3] error with select all");
		});
	},

	queryNode3: function (req, res) {
		node3_db.cleanDB();

		let q = req.body.queryInput;
		console.log(q);
		if (q === "") {
			console.log("QUERY EMPTY");
			res.status(404).end();
		} else {
			console.log("[NODE 3] querying transactions");
			node3_db.query(q, (results) => {
				if (results.length != null) {
					let movies = {
						datalength: results.length,
						data: [],
					};
					results.forEach((RowDataPacket) => {
						movies.data.push(RowDataPacket);
					});
					console.log("[NODE 3] Reloading table");
					res.send(movies);
				} else if (results.length == null) {
					console.log("[NODE 3] insert/delete/update has been made");
					node3_db.queryToOthers(q);
					console.log("[NODE 1] insert/delete/update has been made");
					console.log("[NODE 2] insert/delete/update has been made");
				} else {
					console.log("[NODE 3] ERROR QUERY");
				}
			});
		}
	},

	setIsoLevel3: function (req, res) {
		let iso = req.body.iso;
		console.log(iso);
		node3_db.setIsoLevel(iso);
		res.status(200).end();
	},

	failNode3: function (req, res) {
		node3_db.disconnectFromDatabase1();
		console.log("[NODE 3] crashed node 1");
		node3_db.disconnectFromDatabase2();
		console.log("[NODE 3] crashed 2");
		res.status(200).end();
	},
};

module.exports = controller;
