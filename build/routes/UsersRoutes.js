"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var pick_1 = __importDefault(require("lodash/pick"));
var middleware_1 = require("./../middleware");
var models_1 = require("./../models");
var UsersRoutes = /** @class */ (function () {
    function UsersRoutes(app) {
        app.route('/users')
            .post(function (req, res) {
            var body = pick_1.default(req.body, ['email', 'password']);
            var user = new models_1.User(body);
            user.save()
                .then(function () {
                return user.generateAuthToken();
            })
                .then(function (token) {
                return res.header('x-auth', token).send(user);
            })
                .catch(function (err) {
                res.status(400).send();
            });
        });
        app.route('/users/me')
            .get(middleware_1.authenticate, function (req, res) {
            res.send(req.user);
        });
    }
    return UsersRoutes;
}());
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=UsersRoutes.js.map