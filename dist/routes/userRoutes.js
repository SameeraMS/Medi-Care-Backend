"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.getUserByEmail = getUserByEmail;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
// Get all users
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().select('-password');
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a user by email
router.get('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: req.params.email }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a user by email
router.put('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield user_1.default.findOneAndUpdate({ email: req.params.email }, req.body, { new: true }).select('-password');
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a user by email
router.delete('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield user_1.default.findOneAndDelete({ email: req.params.email });
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// @ts-ignore
function registerUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingUser = yield user_1.default.findOne({ email: user.email });
            if (existingUser) {
                return false;
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(user.password, salt);
            const newUser = new user_1.default({
                name: user.name,
                email: user.email,
                phone: user.phone,
                password: hashedPassword
            });
            let savedUser = yield newUser.save();
            if (!savedUser) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    });
}
function verifyUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if user exists
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return false;
        }
        return yield bcryptjs_1.default.compare(password, user.password);
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_1.default.findOne({ email }).select('-password');
    });
}
exports.default = router;
