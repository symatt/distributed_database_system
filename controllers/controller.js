const node1_db = require("../models/node1_db");
const node2_db = require("../models/node2_db");
const node3_db = require("../models/node3_db");
const nodeTime_db = require("../models/nodeTime_db");

const controller = {
	// initiates the connection to node 1 by udpating its data if needed
	connectToNode1: function (req, res) {
		var node1UpdateTime;
		var node2UpdateTime;
		var node3UpdateTime;

		nodeTime_db.getUpdateTimes((results) => {
			// get the time when the nodes were last updated
			node1UpdateTime = results[0].time;
			console.log(node1UpdateTime);
			node2UpdateTime = results[1].time;
			console.log(node2UpdateTime);
			node3UpdateTime = results[2].time;
			console.log(node3UpdateTime);

			// NODE 2 -> NODE 1 REPLICATION
			// occurs if node 2 is the latest version
			if (node2UpdateTime > node1UpdateTime) {
				// Remove movies from node 1 with year < 1980
				node1_db.query(
					`DELETE FROM movies WHERE movies.year < 1980;`,
					(result) => {}
				);
				console.log("[NODE 1] deleted movies (<1980)");
				// clean node 2
				node2_db.cleanDB();
				console.log("[NODE 2] clean DB");
				// get all the movies inside node 2
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
						// create insert string to node 1
						var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES `;
						movies.data.forEach((row) => {
							console.log(row);
							insertString = insertString.concat(
								`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
							);
							console.log("Added to string node 2");
						});
						insertString = insertString.slice(0, -2);
						console.log(insertString);
						// replicate data to node 1 from node 2
						node1_db.query(insertString, (results) => {
							console.log(
								"[NODE 1] replication of 1 row from node 2 complete."
							);
						});
						// update the time of node 1
						let currTime = new Date()
							.toISOString()
							.slice(0, 19)
							.replace("T", " ");
						nodeTime_db.updateTime(1, currTime);
					} else console.log("[NODE 2] error with select all");
				});
			} else console.log("Node 1 upto date from node 2."); // node 1 is the latest version, don't replicate from node 2

			// NODE 3 -> NODE 1 REPLICATION
			// occurs if node 3 is the latest version
			if (node3UpdateTime > node1UpdateTime) {
				// Remove movies from node 1 with year >= 1980
				node1_db.query(
					`DELETE FROM movies WHERE movies.year >= 1980;`,
					(result) => {}
				);
				console.log("[NODE 1] deleted movies (>=1980)");
				// clean node 3
				node3_db.cleanDB();
				console.log("[NODE 3] clean DB");
				// get all the movies inside node 3
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
						// create insert string to node 1
						var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) 
                                        VALUES `;
						movies.data.forEach((row) => {
							console.log(row);
							insertString = insertString.concat(
								`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
							);
							console.log("Added to string node 3");
						});
						insertString = insertString.slice(0, -2);
						console.log(insertString);
						// replicate data to node 1 from node 3
						node1_db.query(insertString, (results) => {
							console.log(
								"[NODE 1] replication of 1 row from node 3 complete."
							);
						});
						// update the time of node 1
						let currTime = new Date()
							.toISOString()
							.slice(0, 19)
							.replace("T", " ");
						nodeTime_db.updateTime(1, currTime);
					} else console.log("[NODE 3] error with select all");
				});
			} else console.log("Node 1 upto date from node 3."); // node 1 is the latest version, don't replicate from node 3

			res.render("node1");
		});
	},

	// gets all the movies inside node 1
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

	// queries q using the query input by user from node 1
	// NOTE: update time is not updated when the user executes both read and write in a query.
	queryNode1: function (req, res) {
		let q = req.body.queryInput;
		console.log(q);
		// if empty, send an error
		if (q === "") {
			console.log("QUERY EMPTY");
			res.status(404).end();
		} else {
			console.log("[NODE 1] querying transactions");
			node1_db.query(q, (results) => {
				// check if the result is an array, this means select query
				if (results.length != null) {
					console.log(results);
					// find the first select query result
					let len = 0;
					while (
						len < results.length &&
						results[len].length == null
					) {
						len++;
					}

					if (len >= results.length) {
						let movies = {
							datalength: 0,
							data: [],
						};
						res.send(movies);
					} else {
						// if movies was found, send it to the page
						let movies = {
							datalength: results[len].length,
							data: [],
						};
						results[len].forEach((RowDataPacket) => {
							movies.data.push(RowDataPacket);
						});
						console.log("[NODE 1] Reloading table");
						console.log(movies);
						res.send(movies);
					}
				}
				// check if the result is an object, no select query was made
				else if (results.length == null) {
					// get the current time
					let currTime = new Date()
						.toISOString()
						.slice(0, 19)
						.replace("T", " ");
					// update node 1's last updated time
					nodeTime_db.updateTime(1, currTime);
					console.log("[NODE 1] update TIME");
					console.log(results);
					console.log("[NODE 1] insert/delete/update has been made");
					let fail = req.body.fail;
					// check if node 2 was failed
					if (fail != 2 && fail != 10) {
						node1_db.queryToNode2(q);
						console.log(
							"[NODE 2] insert/delete/update has been made"
						);
						node2_db.cleanDB();
						console.log("[NODE 2] clean DB");
						// update node 2's last updated time
						nodeTime_db.updateTime(2, currTime);
						console.log("[NODE 2] update TIME");
					}
					// check if node 3 was failed
					if (fail != 3 && fail != 10) {
						node1_db.queryToNode3(q);
						console.log(
							"[NODE 3] insert/delete/update has been made"
						);
						node3_db.cleanDB();
						console.log("[NODE 3] clean DB");
						// update node 3's last updated time
						nodeTime_db.updateTime(3, currTime);
						console.log("[NODE 3] update TIME");
					}
					res.status(200).end();
				} else {
					console.log("[NODE 1] ERROR QUERY");
				}
			});
		}
	},

	// sets the session isolation level of node 1
	setIsoLevel1: function (req, res) {
		let iso = req.body.iso;
		console.log(iso);
		node1_db.setIsoLevel(iso);
		console.log("[NODE 1] changed session isolation level");
		res.status(200).end();
	},

	// initiates the connection to node 2 by udpating its data if needed
	connectToNode2: function (req, res) {
		var node1UpdateTime;
		var node2UpdateTime;

		// clean node 2
		node2_db.cleanDB();
		console.log("[NODE 2] cleaning up node 2...");

		nodeTime_db.getUpdateTimes((results) => {
			// get the time when the nodes were last updated
			node1UpdateTime = results[0].time;
			console.log(node1UpdateTime);
			node2UpdateTime = results[1].time;
			console.log(node2UpdateTime);
			// NODE 1 -> NODE 2 REPLICATION
			// occurs if node 1 is the latest version
			if (node1UpdateTime > node2UpdateTime) {
				// Remove movies from node 2
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
							// create insert string to node 2
							var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES `;
							movies.data.forEach((row) => {
								console.log(row);
								insertString = insertString.concat(
									`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
								);
								console.log("Added to string node 1");
							});
							insertString = insertString.slice(0, -2);
							console.log(insertString);

							// replicate data to node 2 from node 1
							node2_db.query(insertString, (results) => {
								console.log(
									"[NODE 2] finished replication from node 1."
								);
							});
							// update the time of node 2
							let currTime = new Date()
								.toISOString()
								.slice(0, 19)
								.replace("T", " ");
							nodeTime_db.updateTime(2, currTime);
						} else
							console.log(
								"[NODE 1] error with select movies year < 1980"
							);
					}
				);
			} else console.log("Node 2 upto date from node 1."); // node 2 is the latest version, don't replicate from node 1

			res.render("node2");
		});
	},

	// gets all the movies inside node 2
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

	// queries q using the query input by user from node 2
	// NOTE: update time is not updated when the user executes both read and write in a query.
	queryNode2: function (req, res) {
		node2_db.cleanDB();

		let q = req.body.queryInput;
		console.log(q);
		// if empty, send an error
		if (q === "") {
			console.log("QUERY EMPTY");
			res.status(404).end();
		} else {
			console.log("[NODE 2] querying transactions");
			node2_db.query(q, (results) => {
				// check if the result is an array, this means select query
				if (results.length != null) {
					console.log(results);
					let len = 0;
					while (
						len < results.length &&
						results[len].length == null
					) {
						len++;
					}
					if (len >= results.length) {
						let movies = {
							datalength: 0,
							data: [],
						};
						res.send(movies);
					} else {
						// if movies was found, send it to the page
						let movies = {
							datalength: results[len].length,
							data: [],
						};
						results[len].forEach((RowDataPacket) => {
							movies.data.push(RowDataPacket);
						});
						console.log("[NODE 2] Reloading table");
						console.log(movies);
						res.send(movies);
					}
				}
				// check if the result is an object, no select query was made
				else if (results.length == null) {
					// get the current time
					let currTime = new Date()
						.toISOString()
						.slice(0, 19)
						.replace("T", " ");

					nodeTime_db.updateTime(2, currTime);
					console.log("[NODE 2] update TIME");
					console.log("[NODE 2] insert/delete/update has been made");
					let fail = req.body.fail;
					// check if node 1 was failed
					if (fail != 1 && fail != 10) {
						node2_db.queryToNode1(q);
						console.log(
							"[NODE 1] insert/delete/update has been made"
						);
						// update node 1's last updated time
						nodeTime_db.updateTime(1, currTime);
						console.log("[NODE 1] update TIME");
					}
					// check if node 3 was failed
					if (fail != 3 && fail != 10) {
						node2_db.queryToNode3(q);
						console.log(
							"[NODE 3] insert/delete/update has been made"
						);
						node3_db.cleanDB();
						console.log("[NODE 3] clean DB");
						// update node 3's last updated time
						nodeTime_db.updateTime(3, currTime);
						console.log("[NODE 3] update TIME");
					}
					res.status(200).end();
				} else {
					console.log("[NODE 2] ERROR QUERY");
				}
			});
		}
	},

	// sets the session isolation level of node 2
	setIsoLevel2: function (req, res) {
		let iso = req.body.iso;
		console.log(iso);
		node2_db.setIsoLevel(iso);
		console.log("[NODE 2] changed isolation level");
		res.status(200).end();
	},

	// initiates the connection to node 3 by udpating its data if needed
	connectToNode3: function (req, res) {
		var node1UpdateTime;
		var node3UpdateTime;

		// clean node 3
		node3_db.cleanDB();
		console.log("[NODE 3] cleaning up node 3...");

		nodeTime_db.getUpdateTimes((results) => {
			// get the time when the nodes were last updated
			node1UpdateTime = results[0].time;
			console.log(node1UpdateTime);
			node3UpdateTime = results[2].time;
			console.log(node3UpdateTime);
			// NODE 1 -> NODE 3 REPLICATION
			// occurs if node 1 is the latest version
			if (node1UpdateTime > node3UpdateTime) {
				// Remove movies from node 3
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
							// create insert string to node 3
							var insertString = `INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES `;
							movies.data.forEach((row) => {
								console.log(row);
								insertString = insertString.concat(
									`(${row.id}, "${row.name}", ${row.year}, ${row.rank}), `
								);
								console.log("Added to string node 1");
							});
							insertString = insertString.slice(0, -2);
							console.log(insertString);

							// replicate data to node 3 from node 1
							node3_db.query(insertString, (results) => {
								console.log(
									"[NODE 3] finished replication from node 1."
								);
							});

							// update the time of node 3
							let currTime = new Date()
								.toISOString()
								.slice(0, 19)
								.replace("T", " ");
							nodeTime_db.updateTime(3, currTime);
						} else
							console.log(
								"[NODE 1] error with select movies where year >= 1980"
							);
					}
				);
			} else console.log("Node 3 upto date from node 1."); // node 3 is the latest version, don't replicate from node 1

			res.render("node3");
		});
	},

	// gets all the movies inside node 3
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

	// queries q using the query input by user from node 3
	// NOTE: update time is not updated when the user executes both read and write in a query.
	queryNode3: function (req, res) {
		node3_db.cleanDB();

		let q = req.body.queryInput;
		console.log(q);
		// if empty, send an error
		if (q === "") {
			console.log("QUERY EMPTY");
			res.status(404).end();
		} else {
			console.log("[NODE 3] querying transactions");
			node3_db.query(q, (results) => {
				// check if the result is an array, this means select query
				if (results.length != null) {
					console.log(results);
					let len = 0;
					while (
						len < results.length &&
						results[len].length == null
					) {
						console.log(results[len]);
						len++;
					}
					if (len >= results.length) {
						let movies = {
							datalength: 0,
							data: [],
						};
						res.send(movies);
					} else {
						// if movies was found, send it to the page
						let movies = {
							datalength: results[len].length,
							data: [],
						};
						results[len].forEach((RowDataPacket) => {
							movies.data.push(RowDataPacket);
						});
						console.log("[NODE 3] Reloading table");
						console.log(movies);
						res.send(movies);
					}
				} // check if the result is an object, no select query was made
				else if (results.length == null) {
					// get the current time
					let currTime = new Date()
						.toISOString()
						.slice(0, 19)
						.replace("T", " ");
					// update node 3's last updated time
					nodeTime_db.updateTime(3, currTime);
					console.log("[NODE 3] update TIME");
					console.log("[NODE 3] insert/delete/update has been made");
					let fail = req.body.fail;
					// check if node 1 was failed
					if (fail != 1 && fail != 10) {
						node3_db.queryToNode1(q);
						console.log(
							"[NODE 1] insert/delete/update has been made"
						);
						// update node 1's last updated time
						nodeTime_db.updateTime(1, currTime);
						console.log("[NODE 1] update TIME");
					}
					// check if node 2 was failed
					if (fail != 2 && fail != 10) {
						node3_db.queryToNode2(q);
						console.log(
							"[NODE 2] insert/delete/update has been made"
						);
						node2_db.cleanDB();
						console.log("[NODE 2] clean DB");
						// update node 3's last updated time
						nodeTime_db.updateTime(2, currTime);
						console.log("[NODE 2] update TIME");
					}
					res.status(200).end();
				} else {
					console.log("[NODE 3] ERROR QUERY");
				}
			});
		}
	},

	// sets the session isolation level of node 3
	setIsoLevel3: function (req, res) {
		let iso = req.body.iso;
		console.log(iso);
		node3_db.setIsoLevel(iso);
		console.log("[NODE 3] changed isolation level");
		res.status(200).end();
	},
};

module.exports = controller;
