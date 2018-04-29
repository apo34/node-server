"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pick = require("lodash/pick");
var mongodb_1 = require("mongodb");
var models_1 = require("./../models");
var UsersRoutes = /** @class */ (function () {
    function UsersRoutes(app) {
        console.log('UserRoutes constructor');
        app.route('/users')
            .post(function (req, res) {
            var body = pick(req.body, ['email', 'password']);
            var user = new models_1.User(body);
            console.log('users post');
            user.save()
                .then(function (userModel) {
                console.log(userModel);
                userModel.generateAuthToken().then(function (a) {
                    console.log(a);
                });
                res.send(user);
            })
                .catch(function () {
                console.log('err?');
                res.status(400).send();
            });
        });
    }
    UsersRoutes.prototype._validateId = function (request, response) {
        var givenId = request.params.id;
        if (!mongodb_1.ObjectId.isValid(givenId)) {
            response.status(422).send();
            return false;
        }
        return true;
    };
    return UsersRoutes;
}());
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=UsersRoutes.js.map