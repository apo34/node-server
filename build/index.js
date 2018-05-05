"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = __importStar(require("body-parser"));
var express_1 = __importDefault(require("express"));
var db_1 = require("./db/db");
var config_1 = require("./config");
var routes_1 = require("./routes");
exports.app = express_1.default();
var port = process.env.PORT || config_1.config.defaultPort;
exports.app.use(bodyParser.json());
var TodoRoutesInstance = new routes_1.TodoRoutes(exports.app);
var UserRoutesInstance = new routes_1.UsersRoutes(exports.app);
exports.app.listen(port, function () {
    console.log("Started on port " + port);
    db_1.Db.connect()
        .then(function (status) {
        if (status) {
            console.log("Connected to db");
            console.log("");
            exports.app.emit('appStarted');
        }
        else {
            console.log('App terminating...');
            process.exit(1);
        }
    });
});
//# sourceMappingURL=index.js.map