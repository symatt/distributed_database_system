$(document).ready(function () {
	
	

	$("#node1-connect-btn").click(() => {
		console.log("connecting to node 1...");
		con.connect(function (err) {
			if (err) throw err;
			console.log("Connected to Node 1.");
		});
	});
});
