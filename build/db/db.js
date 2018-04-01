"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Db = /** @class */ (function () {
    function Db() {
    }
    Db.connect = function () {
        return mongoose.connect('mongodb://localhost:27017/TodoApp');
    };
    return Db;
}());
exports.Db = Db;
//# sourceMappingURL=db.js.map