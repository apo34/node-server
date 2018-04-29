"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pick_1 = require("lodash/pick");
var mongodb_1 = require("mongodb");
var models_1 = require("./../models");
var TodoRoutes = /** @class */ (function () {
    function TodoRoutes(app) {
        var _this = this;
        app.route('/todos')
            .get(function (req, res) {
            models_1.Todo.find()
                .then(function (todos) {
                res.send({ todos: todos });
            })
                .catch(function (err) {
                res.status(400).send(err);
            });
        }).post(function (req, res) {
            var todo = new models_1.Todo({
                text: req.body.text
            });
            todo.save()
                .then(function (doc) {
                res.send(doc);
            })
                .catch(function () {
                res.status(400).send();
            });
        });
        app.route('/todos/:id')
            .get(function (req, res) {
            if (!_this._validateId(req, res)) {
                return;
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
                    .catch(function () {
                    res.status(500).send();
                });
            }
        })
            .delete(function (req, res) {
            if (!_this._validateId(req, res)) {
                return;
            }
            else {
                models_1.Todo.findByIdAndRemove(req.params.id)
                    .then(function (todo) {
                    if (!todo) {
                        res.status(404).send();
                    }
                    else {
                        res.send({ todo: todo });
                    }
                })
                    .catch(function () {
                    res.status(500).send();
                });
            }
        }).patch(function (req, res) {
            var body = pick_1.pick(req.body, ['text', 'completed']);
            if (!_this._validateId(req, res)) {
                return;
            }
            else {
                if (body.completed === true) {
                    body.completedAt = new Date().getTime();
                }
                else {
                    body.completed = false;
                    body.completedAt = null;
                }
                models_1.Todo.findByIdAndUpdate(req.params.id, {
                    $set: body
                }, {
                    new: true
                })
                    .then(function (todo) {
                    if (!todo) {
                        res.status(404).send();
                    }
                    else {
                        res.send({ todo: todo });
                    }
                })
                    .catch(function () {
                    res.status(500).send();
                });
            }
        });
    }
    TodoRoutes.prototype._validateId = function (request, response) {
        var givenId = request.params.id;
        if (!mongodb_1.ObjectId.isValid(givenId)) {
            response.status(422).send();
            return false;
        }
        return true;
    };
    return TodoRoutes;
}());
exports.TodoRoutes = TodoRoutes;
//# sourceMappingURL=TodoRoutes.js.map