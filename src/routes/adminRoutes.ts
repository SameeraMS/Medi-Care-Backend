import express, { Request, Response } from 'express';
import Admin from '../models/admin';

const router = express.Router();

// Get all admins
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new admin
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const newAdmin = new Admin(req.body);
    try {
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error: any) {
        console.error('Error saving admin:', error);
        res.status(400).json({ message: 'Failed to save admin', error: error.message });
    }
});

// Get an admin by email
router.get('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = await Admin.findOne({ email: req.params.email }); // Use findOne with email
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an admin by email
router.put('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            { email: req.params.email }, // Find admin by email
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedAdmin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }

        res.json(updatedAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an admin by email
router.delete('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedAdmin = await Admin.findOneAndDelete({ email: req.params.email });

        if (!deletedAdmin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;