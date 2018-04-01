"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TodoSchema = new mongoose_1.Schema({
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    text: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    }
}, {
    timestamps: true
});
TodoSchema.pre('save', function (next) {
    // console.log('pre save hook');
    next();
});
exports.Todo = mongoose_1.model('Todo', TodoSchema);
//# sourceMappingURL=ToDo.js.map