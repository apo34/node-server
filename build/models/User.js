"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        trim: true
    },
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
        trim: true
    }
}, {
    timestamps: true
});
UserSchema.pre('save', function (next) {
    // console.log('pre save hook');
    next();
});
exports.User = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=User.js.map