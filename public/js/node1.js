$(document).ready(function () {
	
	var con = mysql.createConnection({
		host: process.env.NODE1_HOST,
		user: process.env.NODE1_USER,
		password: process.env.NODE1_PASS,
	});

	$("#node1-connect-btn").click(() => {
		console.log("connecting to node 1...");
		con.connect(function (err) {
			if (err) throw err;
			console.log("Connected to Node 1.");
		});
	});
});
