const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.post("/", (req, res) => {
    let kurir = req.body;
    mysqlKonekcija.query("INSERT INTO kuriri (IdK,Narudzbina,Vreme) VALUES(?,?,?);UPDATE preduzeca SET BrKurira=BrKurira-1 WHERE IdK=?;", [kurir.IdK, kurir.Narudzbina, kurir.Vreme, kurir.IdK], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("SELECT Username FROM preduzeca JOIN korisnici USING(IdK) WHERE IdK=?", [kurir.IdK], (err1, rows1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    mysqlKonekcija.query("UPDATE magacin SET Aktivan=2 WHERE Proizvodjac=? AND Narudzbina=?", [rows1[0].Username, kurir.Narudzbina], (err2) => {
                        if (err2) {
                            console.log(err2);
                        }
                    })
                }
            })
            res.send(rows);
        }
    })
});

module.exports = Router;