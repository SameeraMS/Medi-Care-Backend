"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDoctorId = generateDoctorId;
const mongoose_1 = __importDefault(require("mongoose"));
function generateDoctorId() {
    ;
    const randomNumbers = Math.floor(Math.random() * 90000) + 10000;
    return `D${randomNumbers}`;
}
const doctorSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: function () {
            return generateDoctorId();
        }
    },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    image: { type: String, default: '' },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
    _id: false
});
exports.default = mongoose_1.default.model('Doctor', doctorSchema);
