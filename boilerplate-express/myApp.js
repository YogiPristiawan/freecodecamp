var express = require("express");
var app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.route("/name")
	.get((req, res) => {
		res.json({ name: `${req.query.first} ${req.query.last}` });
	})
	.post((req, res, next) => {
		console.log(`{"name": ${req.body.first} ${req.body.last}}`);
		next();
	});
module.exports = app;
