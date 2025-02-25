import express, { Request, Response } from 'express';
import Appointments from '../models/appointments';

const router = express.Router();

// Get all appointments
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const appointments = await Appointments.find()
            .populate('userId') // Populate user details
            .populate('docId') // Populate doctor details
            .populate('hospitalId'); // Populate hospital details
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new appointment
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { userId, docId, hospitalId, date, time, fee } = req.body;

    if (!userId || !docId || !hospitalId || !date || !time || !fee) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        const newAppointment = new Appointments({
            userId,
            docId,
            hospitalId,
            date,
            time,
            fee,
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error: any) {
        console.error('Error saving appointment:', error);
        res.status(500).json({ message: 'Failed to save appointment', error: error.message });
    }
});

// Get an appointment by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const appointment = await Appointments.findById(req.params.id)
            .populate('userId')
            .populate('docId')
            .populate('hospitalId');

        if (!appointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an appointment by ID
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { userId, docId, hospitalId, date, time, fee } = req.body;

    if (!userId || !docId || !hospitalId || !date || !time || !fee) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        const updatedAppointment = await Appointments.findByIdAndUpdate(
            req.params.id,
            { userId, docId, hospitalId, date, time, fee },
            { new: true, runValidators: true }
        ).populate('userId')
            .populate('docId')
            .populate('hospitalId');

        if (!updatedAppointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an appointment by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedAppointment = await Appointments.findByIdAndDelete(req.params.id);

        if (!deletedAppointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get appointments by userId
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const appointments = await Appointments.find({ userId })
            .populate('userId')
            .populate('docId')
            .populate('hospitalId');

        if (!appointments || appointments.length === 0) {
            res.status(200).json(appointments);
            return;
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments by userId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;