$(document).ready(function () {
	$("#node2-connect-btn").click(() => {
		console.log("connecting to node 2...");
		$.get("/node2-connect", (result) => {});
	});

	$("#node2-disconnect-btn").click(() => {
		console.log("disconnecting from node 2...");
		$.get("/node2-disconnect", (result) => {});
	});

    $("#node2-qAll-btn").click(() => {
		console.log("getting all data from node 2...");
		$.get("/node2_getAll", (result) => {
			console.log(result.datalength);
			$("#data-length").text(result.datalength);
			$("#movie-table").find("tbody").empty();

			$("#movie-table")
				.find("tbody")
				.append(
					$("<tr>")
						.append($("<td>").append("ID"))
						.append($("<td>").append("NAME"))
						.append($("<td>").append("YEAR"))
						.append($("<td>").append("RANK"))
				);
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

	$("#node2-submit").click(() => {
		$.ajax({
			type: "POST",
			url: "/node2-q",
			data: { queryInput: $("#queryInput").val() },
			success: function (result) {
				console.log("JQUERY");
				console.log(result.datalength);
				console.log(result.data);
				$("#data-length").text(result.datalength);

				$("#movie-table").find("tbody").empty();

				$("#movie-table")
					.find("tbody")
					.append(
						$("<tr>")
							.append($("<td>").append("ID"))
							.append($("<td>").append("NAME"))
							.append($("<td>").append("YEAR"))
							.append($("<td>").append("RANK"))
					);

				result.data.forEach((d) => {
					$("#movie-table")
						.find("tbody")
						.append(
							$("<tr>")
								.append($("<td>").append(d.id))
								.append($("<td>").append(d.name))
								.append($("<td>").append(d.year))
								.append($("<td>").append(d.rank))
						);
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(
					"Error, status = " +
						textStatus +
						", " +
						"error thrown: " +
						errorThrown
				);
			},
		});
	});

    $("#isolevel").change(() => {
		console.log("changed iso level");
		$.ajax({
			type: "POST",
			url: "/node2-isolevel",
			data: { iso: $("#isolevel").val() },
			success: function (result) {
				console.log("CHANGED ISO LEVEL");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(
					"Error, status = " +
						textStatus +
						", " +
						"error thrown: " +
						errorThrown
				);
			},
		});
	});
});
