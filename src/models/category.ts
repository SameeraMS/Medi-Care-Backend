import mongoose from 'mongoose';


export function generateCategoryId() {;
    const randomNumbers = Math.floor(Math.random() * 90000) + 10000;
    return `C${randomNumbers}`;
}

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function() {
            return generateCategoryId();
        }
    },
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
    _id: false
});

export default mongoose.model('Category', categorySchema);