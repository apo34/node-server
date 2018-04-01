"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var mongoDbAdress = process.env.MONGO_URL || 'mongodb://localhost:27017/TodoApp';
var Db = /** @class */ (function () {
    function Db() {
    }
    Db.connect = function () {
        return mongoose.connect(mongoDbAdress);
    };
    return Db;
}());
exports.Db = Db;
//# sourceMappingURL=db.js.map