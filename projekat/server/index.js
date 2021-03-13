const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const korisniciRouter = require("./routes/korisnici");
const rasadniciRouter = require("./routes/rasadnici");
const sadniceRouter = require("./routes/sadnice");
const magacinRouter = require("./routes/magacin");
const rassadRouter = require("./routes/rassad");
const prodavnicaRouter = require("./routes/prodavnica");
const komentariRouter = require("./routes/komentari");
const narucioRouter = require("./routes/narucio");
const kuririRouter = require("./routes/kuriri");
const statistikaRouter = require("./routes/statistika");
const mysqlKonekcija = require("./konekcija");
var nodemailer = require('nodemailer');

var server = express();
server.use(bodyparser.json());
server.use(cors());
server.use("/korisnici", korisniciRouter);
server.use("/rasadnici", rasadniciRouter);
server.use("/sadnice", sadniceRouter);
server.use("/magacin", magacinRouter);
server.use("/rassad", rassadRouter);
server.use("/prodavnica", prodavnicaRouter);
server.use("/komentari", komentariRouter);
server.use("/narucio", narucioRouter);
server.use("/kuriri", kuririRouter);
server.use("/statistika", statistikaRouter);

server.listen(3000, () => console.log("Server osluskuje na portu 3000"));

function azurRas() {
    mysqlKonekcija.query("UPDATE rasadnici SET Voda=Voda-1,Temperatura=Temperatura-0.5 WHERE Voda>0 AND Temperatura>0", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("SELECT * FROM rasadnici WHERE Voda<75 OR Temperatura<12;", (err1, rows1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    mysqlKonekcija.query("SELECT * FROM korisnici;", (err2, rows2) => {
                        if (err2) {
                            console.log(err2);
                        } else {
                            rows1.forEach(element => {
                                let mejl;
                                rows2.forEach(elem => {
                                    if (element.IdK == elem.IdK) {
                                        mejl = elem.Email;
                                    }
                                });
                                let transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'piaprojekat123@gmail.com',
                                        pass: '***********'
                                    }
                                });
                                let mailOptions = {
                                    from: 'piaprojekat123@gmail.com',
                                    to: mejl,
                                    subject: 'AgroWeb - Upozorenje',
                                    text: 'Rasadnik ' + element.ImeRas + " zahteva održavanje"
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                            });
                        }
                    })
                }
            })
        }
    })
};

function azurSad() {
    mysqlKonekcija.query("UPDATE sadnice SET Progres=Progres+1 WHERE Progres<BrojDana;", (err) => {
        if (err) {
            console.log(err);
        }
    })
};

function azurKurire() {
    mysqlKonekcija.query("UPDATE kuriri SET Vreme=Vreme-1 WHERE Vreme>0;", (err) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("SELECT * FROM kuriri JOIN korisnici USING(IdK) WHERE Vreme=0;", (err1, rows1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    mysqlKonekcija.query("DELETE FROM kuriri WHERE Vreme=0;", (err4) => {
                        if (err4) {
                            console.log(err4);
                        } else {
                            mysqlKonekcija.query("SELECT * FROM preduzeca;", (err5, rows5) => {
                                if (err5) {
                                    console.log(err5);
                                } else {
                                    rows5.forEach(element => {
                                        rows1.forEach(elem => {
                                            if (element.IdK == elem.IdK) {
                                                mysqlKonekcija.query("UPDATE preduzeca SET BrKurira=BrKurira+1 WHERE IdK=?;", [elem.IdK], (err6) => {
                                                    if (err6) {
                                                        console.log(err6);
                                                    }
                                                })
                                            }
                                        });
                                    });
                                }
                            })
                        }
                    })
                    mysqlKonekcija.query("SELECT * FROM magacin WHERE Aktivan=2;", (err2, rows2) => {
                        if (err2) {
                            console.log(err2);
                        } else {
                            rows1.forEach(element => {
                                rows2.forEach(elem => {
                                    if (element.Narudzbina == elem.Narudzbina) {
                                        mysqlKonekcija.query("UPDATE magacin SET Aktivan=3 WHERE Narudzbina=? AND Proizvodjac=?;", [element.Narudzbina, element.Username], (err3) => {
                                            if (err3) {
                                                console.log(err3);
                                            }
                                        })
                                    }
                                });
                            });
                        }
                    })
                }
            })
        }
    })
};

function azurMag() {
    mysqlKonekcija.query("SELECT * FROM magacin WHERE Aktivan=0;", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            mysqlKonekcija.query("SELECT * FROM magacin WHERE Aktivan=3;", (err1, rows1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    mysqlKonekcija.query("DELETE FROM magacin WHERE Aktivan=3;", (err3) => {
                        if (err3) {
                            console.log(err3);
                        }
                    })
                    rows.forEach(element => {
                        rows1.forEach(elem => {
                            if (element.IdR == elem.IdR && element.Proizvodjac == elem.Proizvodjac && element.Naziv == elem.Naziv && element.Tip == elem.Tip) {
                                rows1[0].Aktivan = 4;
                                mysqlKonekcija.query("UPDATE magacin SET Kolicina=Kolicina+1 WHERE IdM=?;", [element.IdM], (err2) => {
                                    if (err2) {
                                        console.log(err2);
                                    }
                                })
                            }
                        });
                    });
                    rows1.forEach(element => {
                        if (element.Aktivan != 4) {
                            rows1.forEach(elem => {
                                if (element.Proizvodjac == elem.Proizvodjac && element.Naziv == elem.Naziv && element.Tip == elem.Tip && element.IdR == elem.IdR && element.IdM != elem.IdM && elem.Aktivan != 4) {
                                    element.Kolicina++;
                                    elem.Aktivan = 4;
                                }
                            });
                            mysqlKonekcija.query("INSERT INTO magacin VALUES(?,?,?,?,?,?,?,?,?,0,0);", [element.IdM, element.Naziv, element.Tip, element.Proizvodjac, element.BrojDana, element.Kolicina, element.IdR, element.Narudzbina, element.DatumNar], (err5) => {
                                if (err5) {
                                    console.log(err5);
                                }
                            })
                        }
                    });
                }
            })
        }
    })
};

setInterval(azurRas, 60000);
setInterval(azurSad, 86400000);
setInterval(azurKurire, 1000);
setInterval(azurMag, 10000);
