"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcryptjs");
var JWT = require("jsonwebtoken");
var pick_1 = require("lodash/pick");
var mongoose_1 = require("mongoose");
var config_1 = require("./../config");
var UserSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
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
        bcrypt.hash(user.password, 10)
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
    var token = JWT.sign({
        _id: this._id.toHexString(),
        access: access
    }, config_1.config.JWTsecret);
    var tokens = this.tokens || [];
    this.tokens = tokens.concat([{ access: access, token: token }]);
    return this.save().then(function () {
        return token;
    });
};
UserSchema.statics.findByToken = function (token) {
    var decodedToken;
    try {
        decodedToken = JWT.verify(token, config_1.config.JWTsecret);
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
exports.User = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=User.js.map