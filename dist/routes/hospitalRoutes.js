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
const hospital_1 = __importDefault(require("../models/hospital"));
const router = express_1.default.Router();
// Get all hospitals
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospitals = yield hospital_1.default.find();
        res.status(200).json(hospitals);
    }
    catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Create a new hospital
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location, rating } = req.body;
        console.log(name, location, rating);
        // Validate required fields
        if (!name || !location || rating === undefined) {
            res.status(400).json({ message: 'Name, location, and rating are required' });
            return;
        }
        const newHospital = new hospital_1.default({ name, location, rating, image: req.body.image || '' });
        yield newHospital.save();
        res.status(201).json(newHospital);
    }
    catch (error) {
        console.error('Error creating hospital:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}));
// Get a hospital by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hospital = yield hospital_1.default.findById(req.params.id);
        if (!hospital) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }
        res.status(200).json(hospital);
    }
    catch (error) {
        console.error('Error fetching hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a hospital by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location, rating, image } = req.body;
        // Validate required fields
        if (!name || !location || rating === undefined) {
            res.status(400).json({ message: 'Name, location, and rating are required' });
            return;
        }
        const updatedHospital = yield hospital_1.default.findByIdAndUpdate(req.params.id, { name, location, rating, image }, { new: true, runValidators: true });
        if (!updatedHospital) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }
        res.status(200).json(updatedHospital);
    }
    catch (error) {
        console.error('Error updating hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a hospital by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedHospital = yield hospital_1.default.findByIdAndDelete(req.params.id);
        if (!deletedHospital) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }
        res.status(200).json({ message: 'Hospital deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
