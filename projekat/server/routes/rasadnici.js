const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");
var nodemailer = require('nodemailer');

Router.get("/:id", (req, res) => {
    mysqlKonekcija.query("SELECT IdR,ImeRas,r.Mesto AS Mesto,BrZas,Duzina,Sirina,Voda,Temperatura,IdK FROM rasadnici r JOIN poljoprivrednici p USING(IdK) WHERE IdK=?", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/vodapl", (req, res) => {
    let ras = req.body;
    mysqlKonekcija.query("UPDATE rasadnici SET Voda=? WHERE IdR=?", [ras.Voda, ras.IdR], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/vodamn", (req, res) => {
    let ras = req.body;
    mysqlKonekcija.query("UPDATE rasadnici SET Voda=? WHERE IdR=? AND Voda>0", [ras.Voda, ras.IdR], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            if (ras.Voda < 75) {
                mysqlKonekcija.query("SELECT * FROM korisnici WHERE IdK=?", [ras.IdK], (err1, rows1) => {
                    if (err1) {
                        console.log(err1);
                    } else {
                        let mejl = rows1[0].Email;
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'piaprojekat123@gmail.com',
                                pass: '**********'
                            }
                        });
                        let mailOptions = {
                            from: 'piaprojekat123@gmail.com',
                            to: mejl,
                            subject: 'AgroWeb - Upozorenje',
                            text: 'Rasadnik ' + ras.ImeRas + " zahteva održavanje"
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }
                })

            }
            res.send(rows);
        }
    })
});

Router.put("/temperaturapl", (req, res) => {
    let ras = req.body;
    mysqlKonekcija.query("UPDATE rasadnici SET Temperatura=? WHERE IdR=?", [ras.Temperatura, ras.IdR], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.put("/temperaturamn", (req, res) => {
    let ras = req.body;
    mysqlKonekcija.query("UPDATE rasadnici SET Temperatura=? WHERE IdR=? AND Temperatura>0", [ras.Temperatura, ras.IdR], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            if (ras.Temperatura < 12) {
                mysqlKonekcija.query("SELECT * FROM korisnici WHERE IdK=?", [ras.IdK], (err1, rows1) => {
                    if (err1) {
                        console.log(err1);
                    } else {
                        let mejl = rows1[0].Email;
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'piaprojekat123@gmail.com',
                                pass: '**********'
                            }
                        });
                        let mailOptions = {
                            from: 'piaprojekat123@gmail.com',
                            to: mejl,
                            subject: 'AgroWeb - Upozorenje',
                            text: 'Rasadnik ' + ras.ImeRas + " zahteva održavanje"
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }
                })
            }
            res.send(rows);
        }
    })
});

Router.put("/zas", (req, res) => {
    let ras = req.body;
    mysqlKonekcija.query("UPDATE rasadnici SET BrZas=BrZas+1 WHERE IdR=?", [ras.IdR], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

Router.post("/", (req, res) => {
    let ras = req.body;
    mysqlKonekcija.query("SELECT * FROM rasadnici WHERE ImeRas=?", [ras.ImeRas], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            if (rows[0] != null) {
                res.send(null);
            } else {
                mysqlKonekcija.query("INSERT INTO rasadnici (ImeRas,Mesto,BrZas,Duzina,Sirina,Voda,Temperatura,IdK) VALUES(?,?,0,?,?,200,18,?)", [ras.ImeRas, ras.Mesto, ras.Duzina, ras.Sirina, ras.IdK], (err1, rows1) => {
                    if (err) {
                        console.log(err1);
                    } else {
                        mysqlKonekcija.query("SELECT * FROM rasadnici WHERE ImeRas=? AND IdK=?", [ras.ImeRas, ras.IdK], (err2, rows2) => {
                            if (err2) {
                                console.log(err2);
                            } else {
                                res.send(rows2);
                            }
                        })
                    }
                })
            }
        }
    })

});




module.exports = Router;
