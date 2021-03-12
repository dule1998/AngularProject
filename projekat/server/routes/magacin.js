const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");


Router.get("/:id", (req, res) => {
    mysqlKonekcija.query("SELECT IdM,Naziv,Tip,Proizvodjac,BrojDana,Kolicina,IdR,Narudzbina,DatumNar,Aktivan FROM magacin JOIN rasadnici USING(IdR) WHERE IdR=? AND Aktivan<3", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.get("/mag/:id", (req, res) => {
    mysqlKonekcija.query("SELECT IdM,Naziv,Tip,Proizvodjac,BrojDana,Kolicina,IdR,Narudzbina,DatumNar,Aktivan FROM magacin JOIN rasadnici USING(IdR) WHERE IdR=? AND Aktivan=0", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.get("/nar/:username", (req, res) => {
    mysqlKonekcija.query("SELECT IdR,ImeRas,Narudzbina,DatumNar,Username,r.Mesto AS Mesto, Proizvodjac, Status FROM magacin m JOIN rasadnici r USING(IdR) JOIN korisnici k USING(IdK) WHERE Aktivan=1 AND Proizvodjac=? GROUP BY Narudzbina ORDER BY Status DESC", [req.params.username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.delete("/:id", (req, res) => {
    mysqlKonekcija.query("DELETE FROM magacin WHERE IdM=?", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.get("/drugi/:id", (req, res) => {
    mysqlKonekcija.query("SELECT * FROM magacin WHERE IdM=?;", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("DELETE FROM magacin WHERE IdM=?;", [req.params.id], (err1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    mysqlKonekcija.query("SELECT * FROM magacin WHERE Narudzbina=? AND Proizvodjac=? AND Aktivan=2;", [rows[0].Narudzbina, rows[0].Proizvodjac], (err2, rows2) => {
                        if (err2) {
                            console.log(err2);
                        } else {
                            if (rows2[0] == null) {
                                mysqlKonekcija.query("SELECT IdK FROM preduzeca JOIN korisnici USING(IdK) WHERE Username=?;", [rows[0].Proizvodjac], (err3, rows3) => {
                                    if (err3) {
                                        console.log(err3);
                                    } else {
                                        mysqlKonekcija.query("SELECT * FROM kuriri WHERE Narudzbina=? AND IdK=?", [rows[0].Narudzbina, rows3[0].IdK], (err4, rows4) => {
                                            if (err4) {
                                                console.log(err4);
                                            } else {
                                                if (rows4[0] != null) {
                                                    mysqlKonekcija.query("DELETE FROM kuriri WHERE Narudzbina=?;UPDATE preduzeca SET BrKurira=BrKurira+1 WHERE IdK=?", [rows[0].Narudzbina, rows3[0].IdK], (err5) => {
                                                        if (err5) {
                                                            console.log(err5);
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                            res.send(rows2);
                        }
                    })
                }
            });
        }
    })
});

Router.put("/", (req, res) => {
    let mag = req.body;
    mysqlKonekcija.query("UPDATE magacin SET Kolicina=? WHERE IdM=?", [mag.Kolicina, mag.IdM], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.post("/", (req, res) => {
    let mag = req.body;
    mysqlKonekcija.query("INSERT INTO magacin (Naziv,Tip,Proizvodjac,BrojDana,Kolicina,IdR,Narudzbina,DatumNar,Aktivan,Status) VALUES(?,?,?,?,?,?,?,?,?,0)", [mag.Naziv, mag.Tip, mag.Proizvodjac, mag.BrojDana, mag.Kolicina, mag.IdR, mag.Narudzbina, mag.DatumNar, mag.Aktivan], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/nar", (req, res) => {
    let nar = req.body;
    mysqlKonekcija.query("UPDATE magacin SET Status=1 WHERE Proizvodjac=? AND Narudzbina=?", [nar.Proizvodjac, nar.Narudzbina], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.delete("/nar/:nar/:username", (req, res) => {
    mysqlKonekcija.query("SELECT * FROM magacin WHERE Narudzbina=?", [req.params.nar, req.params.username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("SELECT Username,p.Tip AS Tip,Naziv,IdK FROM proizvodi p JOIN korisnici k USING(IdK) WHERE Username=?", [req.params.username], (err1, rows1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    rows.forEach(element => {
                        rows1.forEach(elem => {
                            if (element.Proizvodjac == elem.Username && element.Naziv == elem.Naziv && element.Tip == elem.Tip) {
                                mysqlKonekcija.query("UPDATE proizvodi SET Kolicina=Kolicina+1 WHERE IdK=? AND Naziv=? AND Tip=?", [elem.IdK, elem.Naziv, elem.Tip], (err2) => {
                                    if (err2) {
                                        console.log(err2);
                                    }
                                })
                            }
                        });
                    });
                    mysqlKonekcija.query("DELETE FROM magacin WHERE Narudzbina=? AND Proizvodjac=?", [req.params.nar, req.params.username], (err3, rows3) => {
                        if (err3) {
                            console.log(err3);
                        } else {
                            res.send(rows3);
                        }
                    })
                }
            })
        }
    })
});

module.exports = Router;