import mongoose from 'mongoose';

const appointmentsSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    docId: { type: String, required: true, ref: 'Doctor' },
    hospitalId: { type: String, required: true, ref: 'Hospital' },
    date: { type: Date, required: true }, // Appointment date
    time: { type: String, required: true }, // Appointment time (e.g., "10:00")
    fee: { type: Number, required: true, min: 0 }, // Fee for the appointment
}, {
    timestamps: true
});

export default mongoose.model('Appointments', appointmentsSchema);