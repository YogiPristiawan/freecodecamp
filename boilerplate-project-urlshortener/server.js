require("dotenv").config();
const dns = require("dns");
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const shortHash = require("short-hash");
const { url } = require("inspector");

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose
	.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.catch((error) => console.log(error));

const urlSchema = new mongoose.Schema({
	hash: String,
	original_url: String,
});

const Url = mongoose.model("Url", urlSchema, process.env.DB_COLLECTION);

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/shorturl/:hash?", function (req, res) {
	const hash = req.params.hash;

	if (!hash) return res.sendStatus(404);

	Url.findOne({ hash: hash }, (err, data) => {
		if (err) return console.log(err);

		if (!data) return res.sendStatus(404);

		res.redirect(data.original_url);
	});
});

app.post("/api/shorturl/new", (req, res) => {
	try {
		const u = new URL(req.body.url);

		dns.lookup(u.host, (err, address) => {
			if (err) return console.log(err);

			if (address == undefined)
				return res.json({ error: "invalid hostname" });

			const hash = shortHash(u.origin);

			Url.findOne({ hash: hash }, (err, data) => {
				if (err) return console.log(err);

				if (data) {
					return res.json({
						original_url: data.original_url,
						short_url: data.hash,
					});
				}

				const url = new Url({ original_url: u.origin, hash: hash });

				url.save((err, data) => {
					if (err) return console.log(err);

					return res.json({
						original_url: u.origin,
						short_url: data.hash,
					});
				});
			});
		});
	} catch (error) {
		if (error instanceof TypeError) {
			res.json({ error: "invalid url" });
		}
	}
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
