import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const admins = await Admin.find().select('-password'); // Exclude password field
        res.json(admins);
    } catch (error) {
        console.error(error);
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

// @ts-ignore
export async function registerAdmin(admin: Admin) {
    try {
        const existingAdmin = await Admin.findOne({ email: admin.email });
        if (existingAdmin) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);

        const newAdmin = new Admin({
            name: admin.name,
            email: admin.email,
            password: hashedPassword
        });

        let savedAdmin = await newAdmin.save();

        if (!savedAdmin) {
            return false;
        }

        return true;
    } catch (error: any) {
        console.error('Error saving user:', error);
        return false;
    }
}


export async function verifyAdmin(email: string, password: string) {
    const admin = await Admin.findOne({ email });

    if (!admin) {
        return false;
    }

    return await bcrypt.compare(password, admin.password);
}

export async function getAdminByEmail(email: string) {
    return Admin.findOne({email}).select('-password');
}


export default router;
