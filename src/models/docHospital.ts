import mongoose from 'mongoose';

const docHospitalSchema = new mongoose.Schema({
    hospitalId: { type: String, required: true, ref: 'Hospital' },
    category: { type: String, required: true },
    docId: { type: String, required: true, ref: 'Doctor' },
    fee: { type: Number, required: true, min: 0 },
    days: { type: [String], required: true }, // Array of days (e.g., ["Monday", "Wednesday"])
    timeStart: { type: String, required: true }, // Start time (e.g., "09:00")
    timeEnd: { type: String, required: true }, // End time (e.g., "17:00")
}, {
    timestamps: true
});

export default mongoose.model('Doc_Hospital', docHospitalSchema);