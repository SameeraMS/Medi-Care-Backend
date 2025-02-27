"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointments_1 = __importDefault(require("../models/appointments"));
const router = express_1.default.Router();
// Get all appointments
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield appointments_1.default.find()
            .populate('userId') // Populate user details
            .populate('docId') // Populate doctor details
            .populate('hospitalId'); // Populate hospital details
        res.status(200).json(appointments);
    }
    catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Create a new appointment
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, docId, hospitalId, date, time, fee } = req.body;
    if (!userId || !docId || !hospitalId || !date || !time || !fee) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    try {
        const newAppointment = new appointments_1.default({
            userId,
            docId,
            hospitalId,
            date,
            time,
            fee,
        });
        yield newAppointment.save();
        res.status(201).json(newAppointment);
    }
    catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).json({ message: 'Failed to save appointment', error: error.message });
    }
}));
// Get an appointment by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = yield appointments_1.default.findById(req.params.id)
            .populate('userId')
            .populate('docId')
            .populate('hospitalId');
        if (!appointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }
        res.status(200).json(appointment);
    }
    catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update an appointment by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, docId, hospitalId, date, time, fee } = req.body;
    if (!userId || !docId || !hospitalId || !date || !time || !fee) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    try {
        const updatedAppointment = yield appointments_1.default.findByIdAndUpdate(req.params.id, { userId, docId, hospitalId, date, time, fee }, { new: true, runValidators: true }).populate('userId')
            .populate('docId')
            .populate('hospitalId');
        if (!updatedAppointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }
        res.status(200).json(updatedAppointment);
    }
    catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete an appointment by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedAppointment = yield appointments_1.default.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get appointments by userId
router.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const appointments = yield appointments_1.default.find({ userId })
            .populate('userId')
            .populate('docId')
            .populate('hospitalId');
        if (!appointments || appointments.length === 0) {
            res.status(200).json(appointments);
            return;
        }
        res.status(200).json(appointments);
    }
    catch (error) {
        console.error('Error fetching appointments by userId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
