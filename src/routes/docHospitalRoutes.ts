import express, { Request, Response } from 'express';
import DocHospital from '../models/docHospital';

const router = express.Router();

// Get all doctor-hospital associations
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const docHospitals = await DocHospital.find();
        res.json(docHospitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new doctor-hospital association
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const newDocHospital = new DocHospital(req.body);
    try {
        await newDocHospital.save();
        res.status(201).json(newDocHospital);
    } catch (error: any) {
        console.error('Error saving doctor-hospital association:', error);
        res.status(400).json({ message: 'Failed to save association', error: error.message });
    }
});

// Get a doctor-hospital association by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const docHospital = await DocHospital.findById(req.params.id);
        if (!docHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.json(docHospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a doctor-hospital association by ID
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedDocHospital = await DocHospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDocHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.json(updatedDocHospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a doctor-hospital association by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedDocHospital = await DocHospital.findByIdAndDelete(req.params.id);
        if (!deletedDocHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.json({ message: 'Association deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;