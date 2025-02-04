import express, { Request, Response } from 'express';
import Doctor, { generateDoctorId } from '../models/Doctor';

const router = express.Router();

// Get all doctors
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new doctor
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const newDoctor = new Doctor(req.body);
    try {
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (error: any) {
        if (error.code === 11000) {
            try {
                newDoctor._id = generateDoctorId();
                await newDoctor.save();
                res.status(201).json(newDoctor);
            } catch (retryError: any) {
                console.error('Retry save failed:', retryError);
                res.status(400).json({ message: 'Failed to save doctor after retry', error: retryError.message });
            }
        } else {
            console.error('Error saving doctor:', error);
            res.status(400).json({ message: 'Failed to save doctor', error: error.message });
        }
    }
});

// Get a doctor by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a doctor by ID
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDoctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json(updatedDoctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a doctor by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!deletedDoctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
