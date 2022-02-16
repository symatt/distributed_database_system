$(document).ready(function () {
	$("#close_node1").click(() => {
		console.log("closing to node 1...");
		$.get("/close_node1", (result) => {
			console.log(result);
		});
	});
    
	$("#close_node2").click(() => {
		console.log("closing to node 2...");
		$.get("/close_node2", (result) => {
			console.log(result);
		});
	});

	$("#close_node3").click(() => {
		console.log("closing to node 3...");
		$.get("/close_node3", (result) => {
			console.log(result);
		});
	});

    $("#reconn_all").click(() => {
		console.log("reconnecting to all nodes...");
		$.get("/reconn_all", (result) => {
			console.log(result);
		});
	});

	$("#reconn_node1").click(() => {
		console.log("reconnecting to node 1...");
		$.get("/reconn_node1", (result) => {
			console.log(result);
		});
	});

	$("#reconn_node2").click(() => {
		console.log("reconnecting to node 2...");
		$.get("/reconn_node2", (result) => {
			console.log(result);
		});
	});

	$("#reconn_node3").click(() => {
		console.log("reconnecting to node 3...");
		$.get("/reconn_node3", (result) => {
			console.log(result);
		});
	});
});
