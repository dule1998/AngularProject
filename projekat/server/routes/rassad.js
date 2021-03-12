const express = require("express");
const Router = express.Router();
const mysqlKonekcija = require("../konekcija");

Router.get("/:idr/:ids", (req, res) => {
    mysqlKonekcija.query("UPDATE rasadnici SET BrZas=BrZas-1 WHERE IdR=?;", [req.params.idr], (err) => {
        if(err) {
            console.log(err);
        }
    });
    setTimeout(function() {
        mysqlKonekcija.query("DELETE FROM sadnice WHERE IdS=?;", [req.params.ids], (err) => {
            if(err) {
                console.log(err);
            }
        })
    }, 86400000);
    res.send("");
});

module.exports = Router;