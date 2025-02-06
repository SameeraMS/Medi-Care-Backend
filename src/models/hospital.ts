import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function() {
            return `H${Math.floor(Math.random() * 90000) + 10000}`;
        }
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, default: '' },
    rating: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
    _id: false
});

export default mongoose.model('Hospital', hospitalSchema);