$(document).ready(function () {
	$("#node3-connect-btn").click(() => {
		console.log("connecting to node 3...");
		$.get("/node3-connect", (result) => {});
	});

	$("#node3-disconnect-btn").click(() => {
		console.log("disconnecting from node 3...");
		$.get("/node3-disconnect", (result) => {});
	});
});
