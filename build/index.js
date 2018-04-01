"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var mongodb_1 = require("mongodb");
var db_1 = require("./db/db");
var models_1 = require("./models");
exports.app = express();
var port = process.env.PORT || 3000;
exports.app.use(bodyParser.json());
exports.app.listen(port, function () {
    console.log("Started on port " + port);
    db_1.Db.connect()
        .then(function () {
        console.log("Connected to db");
        console.log("");
        exports.app.emit('appStarted');
    });
});
exports.app.route('/todos')
    .get(function (req, res) {
    models_1.Todo.find()
        .then(function (todos) {
        res.send({ todos: todos });
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
})
    .post(function (req, res) {
    var todo = new models_1.Todo({
        text: req.body.text
    });
    todo.save()
        .then(function (doc) {
        res.send(doc);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
});
exports.app.route('/todos/:id')
    .get(function (req, res) {
    var givenId = req.params.id;
    if (!mongodb_1.ObjectId.isValid(givenId)) {
        res.status(422).send();
    }
    else {
        models_1.Todo.findById(req.params.id)
            .then(function (todo) {
            if (!todo) {
                res.status(404).send();
            }
            else {
                res.send({ todo: todo });
            }
        })
            .catch(function (err) {
            res.status(500).send();
        });
    }
});
//# sourceMappingURL=index.js.map