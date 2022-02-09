$(document).ready(function () {
	$("#node2-connect-btn").click(() => {
		console.log("connecting to node 2...");
		$.get("/node2-connect", (result) => {});
	});

	$("#node2-disconnect-btn").click(() => {
		console.log("disconnecting from node 2...");
		$.get("/node2-disconnect", (result) => {});
	});
});
