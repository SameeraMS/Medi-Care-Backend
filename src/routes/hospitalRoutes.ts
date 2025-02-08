import express, { Request, Response } from 'express';
import Hospital from '../models/hospital';

const router = express.Router();

// Get all hospitals
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new hospital
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const newHospital = new Hospital(req.body);
    try {
        await newHospital.save();
        res.status(201).json(newHospital);
    } catch (error: any) {
        console.error('Error saving hospital:', error);
        res.status(400).json({ message: 'Failed to save hospital', error: error.message });
    }
});

// Get a hospital by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }
        res.json(hospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a hospital by ID
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedHospital) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }
        res.json(updatedHospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a hospital by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!deletedHospital) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }
        res.json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;