"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: function () {
            return `A${Math.floor(Math.random() * 90000) + 10000}`;
        }
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
    _id: false
});
exports.default = mongoose_1.default.model('Admin', adminSchema);
