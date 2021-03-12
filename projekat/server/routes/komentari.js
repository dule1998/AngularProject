const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.get("/:id", (req, res) => {
    mysqlKonekcija.query("SELECT Tekst,Ocena,Username,IdP FROM komentari JOIN proizvodi USING(IdP) WHERE IdP=?", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.post("/", (req, res) => {
    let kom = req.body;
    mysqlKonekcija.query("INSERT INTO komentari (Tekst,Ocena,Username,IdP) VALUES(?,?,?,?);\
    UPDATE proizvodi SET ProOcena=(ProOcena*BrOcena+?)/(BrOcena+1),BrOcena=BrOcena+1 WHERE IdP=?", [kom.Tekst, kom.Ocena, kom.Username, kom.IdP, kom.Ocena, kom.IdP], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

module.exports = Router;