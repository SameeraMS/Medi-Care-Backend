import express, { Request, Response } from 'express';
import User from '../models/user';

const router = express.Router();

// Get all users
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new user
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error('Error saving user:', error);
        res.status(400).json({ message: 'Failed to save user', error: error.message });
    }
});

// Get a user by email
router.get('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({ email: req.params.email }); // Corrected query
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a user by email
router.put('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email }, // Corrected query
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a user by email
router.delete('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await User.findOneAndDelete({ email: req.params.email }); // Corrected query
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;