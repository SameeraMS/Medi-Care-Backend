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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = registerAdmin;
exports.verifyAdmin = verifyAdmin;
exports.getAdminByEmail = getAdminByEmail;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_1 = __importDefault(require("../models/admin"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield admin_1.default.find().select('-password'); // Exclude password field
        res.json(admins);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get an admin by email (excluding password)
router.get('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_1.default.findOne({ email: req.params.email }).select('-password');
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.json(admin);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update an admin by email
router.put('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { password } = _a, updateFields = __rest(_a, ["password"]);
        if (password) {
            // Hash the new password if provided
            const salt = yield bcryptjs_1.default.genSalt(10);
            updateFields.password = yield bcryptjs_1.default.hash(password, salt);
        }
        const updatedAdmin = yield admin_1.default.findOneAndUpdate({ email: req.params.email }, updateFields, { new: true });
        if (!updatedAdmin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.json(updatedAdmin);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete an admin by email
router.delete('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedAdmin = yield admin_1.default.findOneAndDelete({ email: req.params.email });
        if (!deletedAdmin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.json({ message: 'Admin deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// @ts-ignore
function registerAdmin(admin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingAdmin = yield admin_1.default.findOne({ email: admin.email });
            if (existingAdmin) {
                return false;
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(admin.password, salt);
            const newAdmin = new admin_1.default({
                name: admin.name,
                email: admin.email,
                password: hashedPassword
            });
            let savedAdmin = yield newAdmin.save();
            if (!savedAdmin) {
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
function verifyAdmin(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield admin_1.default.findOne({ email });
        if (!admin) {
            return false;
        }
        return yield bcryptjs_1.default.compare(password, admin.password);
    });
}
function getAdminByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return admin_1.default.findOne({ email }).select('-password');
    });
}
exports.default = router;
