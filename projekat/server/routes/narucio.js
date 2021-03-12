const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.get("/:username", (req, res) => {
    mysqlKonekcija.query("SELECT Username,IdP FROM narucio WHERE Username=?", [req.params.username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.post("/", (req, res) => {
    let nar = req.body;
    mysqlKonekcija.query("INSERT INTO narucio (Username,IdP) VALUES(?,?)", [nar.Username, nar.IdP], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

module.exports = Router;