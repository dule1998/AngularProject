const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.get("/:id", (req, res) => {
    mysqlKonekcija.query("SELECT IdS,Progres,Naziv,BrojDana,Stanje,Pozicija,Proizvodjac,IdR FROM sadnice JOIN rasadnici USING(IdR) WHERE IdR=?", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/", (req, res) => {
    let sad = req.body;
    mysqlKonekcija.query("UPDATE sadnice SET Progres=?,Stanje=? WHERE IdS=?", [sad.Progres, sad.Stanje, sad.IdS], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.post("/", (req, res) => {
    let sad = req.body;
    mysqlKonekcija.query("SELECT (MAX(IdS)+1) AS IdS FROM sadnice", (err1, rows1) => {
        if (err1) {
            console.log(err1);
        } else {
            mysqlKonekcija.query("INSERT INTO sadnice(IdS,Progres,Naziv,BrojDana,Stanje,Pozicija,IdR,Proizvodjac) VALUES(?,?,?,?,?,?,?,?)", [rows1[0].IdS, sad.Progres, sad.Naziv, sad.BrojDana, sad.Stanje, sad.Pozicija, sad.IdR, sad.Proizvodjac], (err, rows) => {
                if (err) {
                    console.log(err);
                }
            })
            res.send(rows1);
        }
    })
});




module.exports = Router;