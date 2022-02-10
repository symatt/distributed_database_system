const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");
const path = require("path");
const controller = require("../distributed_database_system/controllers/controller");
const req = require("express/lib/request");
const res = require("express/lib/response");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME;

// render hbs files when res.render is called
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get(`/`, (req, res) => {
	res.render("index");
});

// node 1 routes
app.get(`/node1`, (req, res) => {
	let movies = {
		datalength: 0,
		data: [],
	};
	res.render("node1", movies);
});
app.get("/node1-connect", (req, res) => {
	controller.connectToNode1();
});
app.get("/node1-disconnect", (req, res) => {
	controller.disconnectFromNode1();
});
app.get("/node1_getAll", (req, res) => {
	controller.getAllMoviesNode1(req, res);
});
app.post("/node1", (req, res) => {
	controller.queryNode1(req, res);
});

// node 2 routes
app.get(`/node2`, (req, res) => {
	res.render("node2");
});
app.get("/node2-connect", (req, res) => {
	controller.connectToNode2();
});
app.get("/node2-disconnect", (req, res) => {
	controller.disconnectFromNode2();
});

// node 3 routes
app.get(`/node3`, (req, res) => {
	res.render("node3");
});
app.get("/node3-connect", (req, res) => {
	controller.connectToNode3();
});
app.get("/node3-disconnect", (req, res) => {
	controller.disconnectFromNode3();
});

app.listen(port, hostname, () => {
	console.log("Server running at: ");
	console.log(`http://${hostname}:${port}`);
});
