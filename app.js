const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");
const path = require("path");
const controller = require("./controllers/controller");
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
	controller.connectToNode1(req, res);
});
app.get("/node1_getAll", (req, res) => {
	controller.getAllMoviesNode1(req, res);
});
app.post("/node1-q", (req, res) => {
	controller.queryNode1(req, res);
});

// node 2 routes
app.get(`/node2`, (req, res) => {
	controller.connectToNode2(req, res);
});
app.get("/node2_getAll", (req, res) => {
	controller.getAllMoviesNode2(req, res);
});
app.post("/node2-q", (req, res) => {
	controller.queryNode2(req, res);
});

// node 3 routes
app.get(`/node3`, (req, res) => {
	controller.connectToNode3(req, res);
});
app.get("/node3_getAll", (req, res) => {
	controller.getAllMoviesNode3(req, res);
});
app.post("/node3-q", (req, res) => {
	controller.queryNode3(req, res);
});

app.listen(port, hostname, () => {
	console.log(`Server running at: http://${hostname}:${port}`);
});
