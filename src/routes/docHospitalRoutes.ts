import express, { Request, Response } from 'express';
import DocHospital from '../models/docHospital';

const router = express.Router();

// Get all doctor-hospital associations
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const docHospitals = await DocHospital.find().populate('hospitalId').populate('docId');
        res.status(200).json(docHospitals);
    } catch (error) {
        console.error('Error fetching doctor-hospital associations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new doctor-hospital association
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body);
        const { hospitalId, category, docId, fee, days, timeStart, timeEnd } = req.body;

        // Validate required fields
        if (!hospitalId || !category || !docId || fee === undefined || !days || !timeStart || !timeEnd) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const newDocHospital = new DocHospital({ hospitalId, category, docId, fee, days, timeStart, timeEnd });
        await newDocHospital.save();
        res.status(201).json(newDocHospital);
    } catch (error: any) {
        console.error('Error creating doctor-hospital association:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Get a doctor-hospital association by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const docHospital = await DocHospital.findById(req.params.id).populate('hospitalId').populate('docId');
        if (!docHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.status(200).json(docHospital);
    } catch (error) {
        console.error('Error fetching doctor-hospital association:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a doctor-hospital association by ID
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { hospitalId, category, docId, fee, days, timeStart, timeEnd } = req.body;

        // Validate required fields
        if (!hospitalId || !category || !docId || fee === undefined || !days || !timeStart || !timeEnd) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const updatedDocHospital = await DocHospital.findByIdAndUpdate(
            req.params.id,
            { hospitalId, category, docId, fee, days, timeStart, timeEnd },
            { new: true, runValidators: true }
        );

        if (!updatedDocHospital) {
            res.status(404).json({ message: 'Association not found' });
            return;
        }
        res.status(200).json(updatedDocHospital);
    } catch (error) {
        console.error('Error updating doctor-hospital association:', error);
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
        res.status(200).json({ message: 'Association deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor-hospital association:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/hospital/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedDocHospitals = await DocHospital.deleteMany({ hospitalId: req.params.id });
        res.status(200).json({ message: 'Associations deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor-hospital associations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;