"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JWT = require("jsonwebtoken");
var mongoose_1 = require("mongoose");
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
UserSchema.pre('save', function (next) {
    console.log('pre save hook');
    next();
});
UserSchema.methods.generateAuthToken = function () {
    var access = 'auth';
    var token = JWT.sign({
        _id: this._id.toHexString(),
        access: access
    }, 'abc');
    var tokens = this.tokens || [];
    tokens.concat([{ access: access, token: token }]);
    this.tokens = tokens;
    return this.save().then(function () {
        return token;
    });
};
exports.User = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=User.js.map