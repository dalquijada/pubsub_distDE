const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const ordersRoute = require("./routes/orders");
const helmet = require("helmet");
const cors = require("cors");
var mysql = require("mysql");

var myconnection = require("express-myconnection");

var config = require("./config");
var dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.db,
};

var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("express-flash");

app.use(cookieParser("keyboard cat"));
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
    })
);
app.use(flash());
app.use(myConnection(mysql, dbOptions, "pool"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { MAIN_PORT, NODE_ENV } = process.env;
NODE_ENV !== "production"
    ? app.use(morgan("dev"))
    : app.use(morgan("combined"));

app.use(helmet());
app.use(cors());
app.use("/api/orders", ordersRoute);

app.listen(MAIN_PORT);
if (NODE_ENV !== "production") {
    console.log(`Orders service is running at http://localhost:${MAIN_PORT}`);
}
