"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Doctor_1 = __importStar(require("../models/Doctor"));
const router = express_1.default.Router();
// Get all doctors
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield Doctor_1.default.find();
        res.json(doctors);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Create a new doctor
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newDoctor = new Doctor_1.default(req.body);
    try {
        yield newDoctor.save();
        res.status(201).json(newDoctor);
    }
    catch (error) {
        if (error.code === 11000) {
            try {
                newDoctor._id = (0, Doctor_1.generateDoctorId)();
                yield newDoctor.save();
                res.status(201).json(newDoctor);
            }
            catch (retryError) {
                console.error('Retry save failed:', retryError);
                res.status(400).json({ message: 'Failed to save doctor after retry', error: retryError.message });
            }
        }
        else {
            console.error('Error saving doctor:', error);
            res.status(400).json({ message: 'Failed to save doctor', error: error.message });
        }
    }
}));
// Get a doctor by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = yield Doctor_1.default.findById(req.params.id);
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json(doctor);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a doctor by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedDoctor = yield Doctor_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDoctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json(updatedDoctor);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a doctor by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedDoctor = yield Doctor_1.default.findByIdAndDelete(req.params.id);
        if (!deletedDoctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json({ message: 'Doctor deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
