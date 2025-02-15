import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin';

const router = express.Router();

// Get all admins (excluding passwords)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const admins = await Admin.find().select('-password'); // Exclude password field
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new admin with hashed password
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ message: 'Admin already exists' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', admin: {name, email} });
    } catch (error: any) {
        console.error('Error saving admin:', error);
        res.status(400).json({ message: 'Failed to save admin', error: error.message });
    }
});

// Login admin (no JWT, just success message)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        res.status(200).json({ message: 'Login successful', admin: { name: admin.name, email: admin.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get an admin by email (excluding password)
router.get('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = await Admin.findOne({ email: req.params.email }).select('-password');
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
        const { password, ...updateFields } = req.body;

        if (password) {
            // Hash the new password if provided
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedAdmin = await Admin.findOneAndUpdate(
            { email: req.params.email },
            updateFields,
            { new: true }
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
