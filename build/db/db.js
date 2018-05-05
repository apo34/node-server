"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Db = /** @class */ (function () {
    function Db() {
    }
    Db.connect = function () {
        return mongoose_1.default.connect(this._determineDbAdress())
            .then(function () { return true; })
            .catch(function (reason) {
            console.log('Could not connect to db!');
            console.log('Reason:', reason.message);
            return false;
        });
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