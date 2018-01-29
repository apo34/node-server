"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var hbs = require("hbs");
var fs = require("fs");
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this._maintenanceInProgress = false;
        this._app = express();
        hbs.registerPartials(__dirname + '/../views/partials');
        this._app.set('view engine', 'hbs');
        this._app.use(express.static(__dirname + '/../public'));
        hbs.registerHelper('getCurrentYear', function () { return new Date().getFullYear(); });
        hbs.registerHelper('getPageName', function () { return 'Awesome Website'; });
        hbs.registerHelper('capitalize', function (text) { return text.toUpperCase(); });
        this._app.use(function (req, res, next) {
            var now = new Date().toString();
            var log = now + ": " + req.method + " " + req.path;
            fs.appendFile('server.log', log + '\n', function (error) {
                if (error) {
                    console.log('Unable to write log');
                }
            });
            next();
        });
        this._app.use(function (req, res, next) {
            if (_this._maintenanceInProgress) {
                res.render('maintenance.hbs');
            }
            else {
                next();
            }
        });
        // console.log(this._app);  
        this._app.get('/', function (req, res) {
            res.render('home.hbs', {
                pageTitle: 'Home Page',
                message: 'Welcome home!'
            });
        });
        this._app.get('/about', function (req, res) {
            res.render('about.hbs', {
                pageTitle: 'About Page',
            });
        });
        this._app.get('/bad', function (req, res) {
            res.send({
                status: false,
                error: {
                    message: {
                        code: '1.2.3',
                        msg: 'Something went wrong'
                    }
                }
            });
        });
        this._app.listen(3000, function () {
            console.log('Server is running!');
        });
    }
    return Main;
}());
exports.Main = Main;
new Main();
