"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Db = /** @class */ (function () {
    function Db() {
    }
    Db.connect = function () {
        return mongoose.connect(this._determineDbAdress());
    };
    Db._determineDbAdress = function () {
        switch (process.env.NODE_ENV) {
            case 'production':
                return process.env.MONGO_URL;
            case 'development':
                return 'mongodb://localhost:27017/TodoApp';
            case 'test':
                return 'mongodb://localhost:27017/TestDb';
            default:
                console.log("UNSUPPORTED ENVIRONMENT " + process.env.NODE_ENV + ", USING LOCAL");
                return 'mongodb://localhost:27017/TodoApp';
        }
    };
    return Db;
}());
exports.Db = Db;
//# sourceMappingURL=db.js.map