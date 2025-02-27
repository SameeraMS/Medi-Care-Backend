"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentsSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, ref: 'User' },
    docId: { type: String, required: true, ref: 'Doctor' },
    hospitalId: { type: String, required: true, ref: 'Hospital' },
    date: { type: Date, required: true }, // Appointment date
    time: { type: String, required: true }, // Appointment time (e.g., "10:00")
    fee: { type: Number, required: true, min: 0 }, // Fee for the appointment
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Appointments', appointmentsSchema);
