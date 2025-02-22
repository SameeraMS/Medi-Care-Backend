import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';

const router = express.Router();

// Get all users
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a user by email
router.get('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password');
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
        ).select('-password');
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


// @ts-ignore
export async function registerUser(user: User) {
    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return false;
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const newUser = new User({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: hashedPassword
        });

        let savedUser = await newUser.save();

        if (!savedUser) {
            return false;
        }

        return true;
    } catch (error: any) {
        console.error('Error saving user:', error);
        return false;
    }
}


export async function verifyUser(email: string, password: string) {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        return false;
    }

    return await bcrypt.compare(password, user.password);

}

export default router;
