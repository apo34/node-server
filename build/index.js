"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var db_1 = require("./db/db");
var routes_1 = require("./routes");
var JWT = require("jsonwebtoken");
exports.app = express();
var port = process.env.PORT || 3000;
exports.app.use(bodyParser.json());
var TodoRoutesInstance = new routes_1.TodoRoutes(exports.app);
var UserRoutesInsctance = new routes_1.UsersRoutes(exports.app);
exports.app.listen(port, function () {
    console.log("Started on port " + port);
    db_1.Db.connect()
        .then(function () {
        console.log("Connected to db");
        console.log("");
        exports.app.emit('appStarted');
    });
});
JWT.sign('s', 's');
//# sourceMappingURL=index.js.map