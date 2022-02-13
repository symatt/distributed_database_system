const mysql = require("mysql");

const db = {
    con1 : mysql.createConnection({
        host: "stadvdb-mco2-central-node.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "stadvdb12345",
        port: "3306",
        database: "imdb_small",
    }),

    con2 : mysql.createConnection({
        host: "stadvdb-mco2-node2.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "stadvdb12345",
        port: "3303",
        database: "imdb_small",
    }),

    con3 : mysql.createConnection({
        host: "stadvdb-mco2-node3.c8pv2rlf7hct.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "stadvdb12345",
        port: "3300",
        database: "imdb_small",
    }),
}

module.exports = db;