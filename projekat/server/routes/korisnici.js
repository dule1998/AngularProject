const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.get("/", (req, res) => {
    mysqlKonekcija.query("SELECT * FROM korisnici LEFT OUTER JOIN poljoprivrednici USING(IdK) LEFT OUTER JOIN preduzeca USING(IdK) ORDER BY IdK ASC", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.get("/pred/:username", (req, res) => {
    mysqlKonekcija.query("SELECT BrKurira,Mesto FROM preduzeca JOIN korisnici USING(IdK) WHERE Username=?", [req.params.username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.get("/:u/:p", (req, res) => {
    mysqlKonekcija.query("SELECT IdK, Username, Tip FROM korisnici WHERE Username=? AND Password=? AND Prihvacen=1", [req.params.u, req.params.p], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.delete("/:u", (req, res) => {
    mysqlKonekcija.query("SELECT Naziv,m.Tip AS Tip,Proizvodjac,Narudzbina,Kolicina FROM magacin m JOIN rasadnici r USING(IdR) JOIN korisnici k USING(IdK) WHERE Username=? AND Aktivan>0 AND Aktivan<3", [req.params.u], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("SELECT p.Tip AS Tip,Naziv,Username,IdP FROM proizvodi p JOIN korisnici k USING(IdK)", (err1, rows1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    rows1.forEach(element => {
                        rows.forEach(elem => {
                            if (element.Naziv == elem.Naziv && element.Tip == elem.Tip && element.Username == elem.Proizvodjac) {
                                mysqlKonekcija.query("UPDATE proizvodi SET Kolicina=Kolicina+? WHERE IdP=?", [elem.Kolicina, element.IdP], (err2) => {
                                    if (err2) {
                                        console.log(err2);
                                    }
                                })
                            }
                        });
                    });
                    mysqlKonekcija.query("SELECT Narudzbina,ku.IdK AS IdK FROM magacin m JOIN rasadnici r USING(IdR) JOIN korisnici k USING(IdK) JOIN kuriri ku USING(Narudzbina) WHERE Username=? AND Aktivan=2 GROUP BY Narudzbina", [req.params.u], (err7, rows7) => {
                        if (err7) {
                            console.log(err7);
                        } else {
                            rows7.forEach(element => {
                                mysqlKonekcija.query("UPDATE preduzeca SET BrKurira=BrKurira+1 WHERE IdK=?", [element.IdK], (err6) => {
                                    if (err6) {
                                        console.log(err6);
                                    } else {
                                        mysqlKonekcija.query("DELETE FROM kuriri WHERE Narudzbina=?", [element.Narudzbina], (err4) => {
                                            if (err4) {
                                                console.log(err4);
                                            }
                                        })
                                    }
                                })
                            });
                            mysqlKonekcija.query("DELETE FROM korisnici WHERE Username=?;DELETE FROM narucio WHERE Username=?;DELETE FROM magacin WHERE Proizvodjac=?", [req.params.u, req.params.u, req.params.u], (err3, rows3) => {
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

        }
    })

});

Router.post("/polj", (req, res) => {
    let kor = req.body;
    mysqlKonekcija.query("SELECT * FROM korisnici WHERE Username=? OR Email=?;", [kor.korIme, kor.email], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            if (rows[0] == null) {
                mysqlKonekcija.query("INSERT INTO korisnici (Username, Password, Datum, Mesto, Email, Tip, Prihvacen) VALUES(?,?,?,?,?,'Poljoprivrednik',?);\
                INSERT INTO poljoprivrednici (IdK, Ime, Prezime, Telefon)\
                 VALUES ((SELECT IdK FROM korisnici WHERE Username=?),?,?,?)", [kor.korIme, kor.lozinka, kor.rodjendan, kor.mesto, kor.email, kor.prihvacen, kor.korIme, kor.ime, kor.prezime, kor.telefon], (err1, rows1) => {
                    if (err1) {
                        console.log(err1);
                    } else {
                        res.send(rows1);
                    }
                })
            } else {
                res.send(null);
            }
        }
    })

});

Router.post("/pred", (req, res) => {
    let kor = req.body;
    mysqlKonekcija.query("SELECT * FROM korisnici WHERE Username=? OR Email=?;", [kor.korIme, kor.email], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            if (rows[0] == null) {
                mysqlKonekcija.query("INSERT INTO korisnici (Username, Password, Datum, Mesto, Email, Tip, Prihvacen) VALUES(?,?,?,?,?,'Preduzece',?);\
                INSERT INTO preduzeca (IdK, ImePred)\
                 VALUES ((SELECT IdK FROM korisnici WHERE Username=?),?)", [kor.skr, kor.lozinka, kor.datumOsn, kor.mesto, kor.email, kor.prihvacen, kor.skr, kor.imePred], (err, rows) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(rows);
                    }
                })
            } else {
                res.send(null);
            }
        }
    })

});

Router.put("/", (req, res) => {
    let kor = req.body;
    mysqlKonekcija.query("UPDATE korisnici SET Prihvacen=1 WHERE Username=?", [kor.Username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/polj", (req, res) => {
    let kor = req.body;
    mysqlKonekcija.query("UPDATE korisnici SET Username=?,Password=?,Datum=?,Mesto=?,Email=? WHERE IdK=?;\
    UPDATE poljoprivrednici SET Ime=?,Prezime=?,Telefon=? WHERE=?", [kor.Username, kor.Password, kor.Datum, kor.Mesto, kor.Email, kor.IdK, kor.Ime, kor.Prezime, kor.Telefon, kor.IdK], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/pred", (req, res) => {
    let kor = req.body;
    mysqlKonekcija.query("UPDATE korisnici SET Username=?,Password=?,Datum=?,Mesto=?,Email=? WHERE IdK=?;\
    UPDATE preduzeca SET ImePred=? WHERE IdK=?", [kor.Username, kor.Password, kor.Datum, kor.Mesto, kor.Email, kor.IdK, kor.ImePred, kor.IdK], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/admin", (req, res) => {
    let kor = req.body;
    mysqlKonekcija.query("UPDATE korisnici SET Username=?,Password=?,Datum=?,Mesto=?,Email=? WHERE IdK=?", [kor.Username, kor.Password, kor.Datum, kor.Mesto, kor.Email, kor.IdK], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/sifra", (req, res) => {
    let kor = req.body;
    mysqlKonekcija.query("UPDATE korisnici SET Password=? WHERE Username=?", [kor.password, kor.username], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

module.exports = Router;