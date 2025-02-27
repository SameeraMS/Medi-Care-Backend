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
const docHospital_1 = __importDefault(require("../models/docHospital"));
const router = express_1.default.Router();
// Get all doctor-hospital associations
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docHospitals = yield docHospital_1.default.find().populate('hospitalId').populate('docId');
        res.status(200).json(docHospitals);
    }
    catch (error) {
        console.error('Error fetching doctor-hospital associations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Create a new doctor-hospital association
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { hospitalId, category, docId, fee, days, timeStart, timeEnd } = req.body;
        // Validate required fields
        if (!hospitalId || !category || !docId || fee === undefined || !days || !timeStart || !timeEnd) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const newDocHospital = new docHospital_1.default({ hospitalId, category, docId, fee, days, timeStart, timeEnd });
        yield newDocHospital.save();
        res.status(201).json(newDocHospital);
    }
    catch (error) {
        console.error('Error creating doctor-hospital association:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}));
// Get a doctor-hospital association by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docHospital = yield docHospital_1.default.findById(req.params.id).populate('hospitalId').populate('docId');
        if (!docHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.status(200).json(docHospital);
    }
    catch (error) {
        console.error('Error fetching doctor-hospital association:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a doctor-hospital association by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hospitalId, category, docId, fee, days, timeStart, timeEnd } = req.body;
        // Validate required fields
        if (!hospitalId || !category || !docId || fee === undefined || !days || !timeStart || !timeEnd) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const updatedDocHospital = yield docHospital_1.default.findOneAndUpdate({ docId, hospitalId }, { hospitalId, category, docId, fee, days, timeStart, timeEnd }, { new: true, runValidators: true });
        if (!updatedDocHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.status(200).json(updatedDocHospital);
    }
    catch (error) {
        console.error('Error updating doctor-hospital association:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a doctor-hospital association by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedDocHospital = yield docHospital_1.default.findByIdAndDelete(req.params.id);
        if (!deletedDocHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.status(200).json({ message: 'Association deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting doctor-hospital association:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.delete('/hospital/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedDocHospitals = yield docHospital_1.default.deleteMany({ hospitalId: req.params.id });
        res.status(200).json({ message: 'Associations deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting doctor-hospital associations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
