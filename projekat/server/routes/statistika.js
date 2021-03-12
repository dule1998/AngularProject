const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.get("/:id", (req, res) => {
    mysqlKonekcija.query("SELECT IdStat,Datum,BrNar,IdK FROM statistika WHERE IdK=?", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/", (req, res) => {
    let stat = req.body;
    mysqlKonekcija.query("UPDATE statistika SET BrNar=? WHERE IdStat=?", [stat.BrNar, stat.IdStat], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.post("/", (req, res) => {
    let stat = req.body;
    mysqlKonekcija.query("INSERT INTO statistika (IdK,Datum,BrNar) VALUES(?,?,?)", [stat.IdK, stat.Datum, stat.BrNar], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

module.exports = Router;