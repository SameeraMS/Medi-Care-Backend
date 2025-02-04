import mongoose from 'mongoose';


export function generateDoctorId() {;
    const randomNumbers = Math.floor(Math.random() * 90000) + 10000;
    return `D${randomNumbers}`;
}

const doctorSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function() {
            return generateDoctorId();
        }
    },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    image: { type: String, default: '' },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
    _id: false
});

export default mongoose.model('Doctor', doctorSchema);