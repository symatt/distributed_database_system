$(document).ready(function () {
	$("#node1-connect-btn").click(() => {
		console.log("connecting to node 1...");
		$.get("/node1-connect", (result) => {});
	});

	$("#node1-disconnect-btn").click(() => {
		console.log("disconnecting from node 1...");
		$.get("/node1-disconnect", (result) => {});
	});

	$("#node1-qAll-btn").click(() => {
		console.log("getting all data from node 1...");
		$.get("/node1_getAll", (result) => {
			console.log(result.datalength);
			$("#data-length").text(result.datalength);
			result.data.forEach((data) => {
				$("#movie-table")
					.find("tbody")
					.append(
						$("<tr>")
							.append($("<td>").append(data.id))
							.append($("<td>").append(data.name))
							.append($("<td>").append(data.year))
							.append($("<td>").append(data.rank))
					);
			});
		});
	});

	$("#node1-submit").click(() => {
		console.log("INPUT querying transaction node 1...");
		let q = $("#queryInput").val();
		$.post("/node1-q", { queryInput: q }, (result) => {
			console.log("JQUERY");
			console.log(result.datalength);
			$("#data-length").text(result.datalength);
			result.data.forEach((data) => {
				$("#movie-table")
					.find("tbody")
					.append(
						$("<tr>")
							.append($("<td>").append(data.id))
							.append($("<td>").append(data.name))
							.append($("<td>").append(data.year))
							.append($("<td>").append(data.rank))
					);
			});
		});
	});
});
