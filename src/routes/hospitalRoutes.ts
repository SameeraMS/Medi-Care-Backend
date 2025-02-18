import express, { Request, Response } from 'express';
import Hospital from '../models/hospital';

const router = express.Router();

// Get all hospitals
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new hospital
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, location, rating } = req.body;
        console.log(name, location, rating);

        // Validate required fields
        if (!name || !location || rating === undefined) {
            res.status(400).json({ message: 'Name, location, and rating are required' });
            return;
        }

        const newHospital = new Hospital({ name, location, rating, image: req.body.image || '' });
        await newHospital.save();
        res.status(201).json(newHospital);
    } catch (error: any) {
        console.error('Error creating hospital:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
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
        res.status(200).json(hospital);
    } catch (error) {
        console.error('Error fetching hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a hospital by ID
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, location, rating, image } = req.body;

        // Validate required fields
        if (!name || !location || rating === undefined) {
            res.status(400).json({ message: 'Name, location, and rating are required' });
            return;
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            { name, location, rating, image },
            { new: true, runValidators: true }
        );

        if (!updatedHospital) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }
        res.status(200).json(updatedHospital);
    } catch (error) {
        console.error('Error updating hospital:', error);
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
        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        console.error('Error deleting hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;