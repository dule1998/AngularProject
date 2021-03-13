const mysql = require("mysql");

var mysqlKonekcija = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "**********",
    database: "agroweb",
    multipleStatements: true
});

mysqlKonekcija.connect((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Server je povezan sa MySQL serverom");
    }
})

module.exports = mysqlKonekcija;
