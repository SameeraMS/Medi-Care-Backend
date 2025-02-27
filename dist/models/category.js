"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCategoryId = generateCategoryId;
const mongoose_1 = __importDefault(require("mongoose"));
function generateCategoryId() {
    ;
    const randomNumbers = Math.floor(Math.random() * 90000) + 10000;
    return `C${randomNumbers}`;
}
const categorySchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: function () {
            return generateCategoryId();
        }
    },
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
    _id: false
});
exports.default = mongoose_1.default.model('Category', categorySchema);
