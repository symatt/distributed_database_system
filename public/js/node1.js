$(document).ready(function () {
	$("#node1-connect-btn").click(() => {
		console.log("connecting to node 1...");
		$.get("/node1-connect", (result) => {});
	});

	$("#node1-disconnect-btn").click(() => {
		console.log("disconnecting from node 1...");
		$.get("/node1-disconnect", (result) => {});
	});
});