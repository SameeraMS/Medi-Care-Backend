"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hospitalSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: function () {
            return `H${Math.floor(Math.random() * 90000) + 10000}`;
        }
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, default: '' },
    rating: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
    _id: false
});
exports.default = mongoose_1.default.model('Hospital', hospitalSchema);
