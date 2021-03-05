// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
const { response } = require("express");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/:endpoint/:date?", (req, res) => {
	if (req.params.endpoint == "timestamp") {
		if (!req.params.date)
			res.json({ unix: Date.now(), utc: new Date().toUTCString() });

		let date_string = req.params.date;

		if (!/[^\d]/g.test(date_string)) date_string = Number(date_string);

		const d = new Date(date_string);

		if (d.toString() == "Invalid Date") res.json({ error: "Invalid Date" });

		res.json({ unix: d.getTime(), utc: d.toUTCString() });
	}

	res.sendStatus(404);
});

// listen for requests :)
var listener = app.listen(8080, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
