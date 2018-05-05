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
        app.route('/users/login')
            .post(function (req, res) {
            var body = pick_1.default(req.body, ['email', 'password']);
            models_1.User.findOne({ email: body.email })
                .then(function (user) {
                if (!user) {
                    return res.status(404).send();
                }
                models_1.User.verifyPassword(body.password, user.password)
                    .then(function (isVerified) {
                    if (isVerified) {
                        user.generateAuthToken()
                            .then(function (token) {
                            res.status(200).header('x-auth', token).send();
                        });
                    }
                    else {
                        res.status(403).send();
                    }
                });
            });
        });
    }
    return UsersRoutes;
}());
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=UsersRoutes.js.map