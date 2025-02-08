import express, { Request, Response } from 'express';
import Appointments from '../models/appointments';

const router = express.Router();

// Get all appointments
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const appointments = await Appointments.find();
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new appointment
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const newAppointment = new Appointments(req.body);
    try {
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error: any) {
        console.error('Error saving appointment:', error);
        res.status(400).json({ message: 'Failed to save appointment', error: error.message });
    }
});

// Get an appointment by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const appointment = await Appointments.findById(req.params.id);
        if (!appointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }
        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an appointment by ID
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedAppointment = await Appointments.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAppointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }
        res.json(updatedAppointment);
    } catch (error) {
        console.error(error);
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
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;