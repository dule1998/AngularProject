const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.get("/", (req, res) => {
    mysqlKonekcija.query("SELECT IdP,Naziv,Username,p.Tip AS Tip,Kolicina,ProOcena,BrOcena,IdK,BrDana,Cena FROM proizvodi p JOIN korisnici k USING(IdK)", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.get("/:username", (req, res) => {
    mysqlKonekcija.query("SELECT IdP,Naziv,Username,p.Tip AS Tip,Kolicina,ProOcena,BrOcena,IdK,BrDana,Cena FROM proizvodi p JOIN korisnici k USING(IdK) WHERE Username=?", [req.params.username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.get("/posebno/:id", (req, res) => {
    mysqlKonekcija.query("SELECT IdP,Naziv,Username,p.Tip AS Tip,Kolicina,ProOcena,BrOcena,IdK,BrDana,Cena FROM proizvodi p JOIN korisnici k USING(IdK) WHERE IdP=?", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/", (req, res) => {
    let prod = req.body;
    mysqlKonekcija.query("UPDATE proizvodi SET Kolicina=? WHERE IdP=?", [prod.Kolicina, prod.IdP], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/vrati", (req, res) => {
    let prod = req.body;
    mysqlKonekcija.query("SELECT IdK FROM korisnici WHERE Username=?", [prod.Username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            let idk = rows[0].IdK;
            mysqlKonekcija.query("UPDATE proizvodi SET Kolicina=Kolicina+1 WHERE IdK=? AND Naziv=? AND Tip=?", [idk, prod.Naziv, prod.Tip], (err1, rows1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    res.send(rows1);
                }
            })
        }
    })
});

Router.delete("/:id", (req, res) => {
    mysqlKonekcija.query("SELECT Username,Naziv,p.Tip AS Tip FROM proizvodi p JOIN korisnici k USING(IdK) WHERE IdP=?", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("DELETE FROM proizvodi WHERE IdP=?", [req.params.id], (err1) => {
                if (err1) {
                    console.log(err1);
                }
            })
            mysqlKonekcija.query("DELETE FROM magacin WHERE Proizvodjac=? AND Naziv=? AND Tip=? AND Aktivan=1", [rows[0].Username, rows[0].Naziv, rows[0].Tip], (err2, rows2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    res.send(rows2);
                }
            })

        }
    })
});

Router.post("/", (req, res) => {
    let prod = req.body;
    mysqlKonekcija.query("INSERT INTO proizvodi (Naziv,Tip,Kolicina,ProOcena,BrOcena,IdK,BrDana,Cena) VALUES(?,?,?,0,0,?,?,?)", [prod.Naziv, prod.Tip, prod.Kolicina, prod.IdK, prod.BrDana, prod.Cena], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

module.exports = Router;