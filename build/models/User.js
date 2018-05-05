"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var pick_1 = __importDefault(require("lodash/pick"));
var mongoose_1 = require("mongoose");
var config_1 = require("./../config");
var UserSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                // tslint:disable-next-line:max-line-length
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
            },
            message: '{VALUE} is not a valid email!'
        },
        trim: true
    },
    tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }]
}, {
    timestamps: true
});
// Event hooks
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcryptjs_1.default.hash(user.password, 10)
            .then(function (hash) {
            user.password = hash;
            next();
        });
    }
    else {
        next();
    }
});
// Stock methods overrides
UserSchema.methods.toJSON = function () {
    var userObject = this.toObject();
    return pick_1.default(userObject, ['_id', 'email']);
};
// Custom methods declarations
UserSchema.methods.generateAuthToken = function () {
    var access = 'auth';
    var token = jsonwebtoken_1.default.sign({
        _id: this._id.toHexString(),
        access: access
    }, config_1.config.JWTsecret);
    var tokens = this.tokens || [];
    var index = tokens.findIndex(function (token) { return token.access === access; });
    this.tokens = index === -1
        ? tokens.concat([{ access: access, token: token }]) : tokens.splice(index, 1, { access: access, token: token });
    return this.save().then(function () {
        return token;
    });
};
UserSchema.statics.findByToken = function (token) {
    var decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, config_1.config.JWTsecret);
    }
    catch (e) {
        return mongoose_1.Promise.reject();
    }
    return this.findOne({
        '_id': decodedToken._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
UserSchema.statics.verifyPassword = function (password, hash) {
    return bcryptjs_1.default.compare(password, hash);
};
exports.User = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=User.js.map