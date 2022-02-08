const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");
const path = require("path");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME;

// render hbs files when res.render is called
app.set("view engine", "hbs");

app.use(express.static("public"));

app.get(`/`, (req, res) => {
	res.render("index");
});

app.get(`/node1`, (req, res) => {
	res.render("node1");
});
app.get(`/node2`, (req, res) => {
	res.render("node2");
});
app.get(`/node3`, (req, res) => {
	res.render("node3");
});

app.listen(port, hostname, () => {
	console.log("Server running at: ");
	console.log(`http://${hostname}:${port}`);
});
