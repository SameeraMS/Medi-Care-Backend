import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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

// Create a new user (Signup)
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: { name, email, phone } });
    } catch (error: any) {
        console.error('Error saving user:', error);
        res.status(400).json({ message: 'Failed to save user', error: error.message });
    }
});

// User Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a user by email
router.get('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({ email: req.params.email });
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
            { email: req.params.email },
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
        const deletedUser = await User.findOneAndDelete({ email: req.params.email });
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
