import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function() {
            return `U${Math.floor(Math.random() * 90000) + 10000}`;
        }
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
    _id: false
});

export default mongoose.model('User', userSchema);