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
exports.authenticateToken = authenticateToken;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRoutes_1 = require("./userRoutes");
const user_1 = __importDefault(require("../models/user"));
const adminRoutes_1 = require("./adminRoutes");
const admin_1 = __importDefault(require("../models/admin"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/user/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const isVerified = yield (0, userRoutes_1.verifyUser)(email, password);
        if (isVerified) {
            const user = yield (0, userRoutes_1.getUserByEmail)(email);
            const token = jsonwebtoken_1.default.sign({ email }, process.env.SECRET_KEY, { expiresIn: "7d" });
            const refreshToken = jsonwebtoken_1.default.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: "70d" });
            res.json({ accessToken: token, refreshToken: refreshToken, user: user });
        }
        else {
            res.status(403).send('Invalid credentials');
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
        return;
    }
}));
router.post("/user/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, password } = req.body;
    const newUser = new user_1.default({
        name,
        email,
        phone,
        password
    });
    try {
        const isRegistered = yield (0, userRoutes_1.registerUser)(newUser);
        if (!isRegistered) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
}));
router.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const isVerified = yield (0, adminRoutes_1.verifyAdmin)(email, password);
        if (isVerified) {
            const admin = yield (0, adminRoutes_1.getAdminByEmail)(email);
            const token = jsonwebtoken_1.default.sign({ email }, process.env.SECRET_KEY, { expiresIn: "7d" });
            const refreshToken = jsonwebtoken_1.default.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: "70d" });
            res.json({ accessToken: token, refreshToken: refreshToken, admin: admin });
        }
        else {
            res.status(403).send('Invalid credentials');
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}));
router.post("/admin/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const newAdmin = new admin_1.default({
        name,
        email,
        password
    });
    try {
        const isRegistered = yield (0, adminRoutes_1.registerAdmin)(newAdmin);
        if (!isRegistered) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
}));
router.post("/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!refresh_token)
        res.status(401).send('No token provided');
    try {
        const payload = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        const token = jsonwebtoken_1.default.sign({ email: payload.email }, process.env.SECRET_KEY, { expiresIn: "7d" });
        res.json({ accessToken: token });
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
}));
function authenticateToken(req, res, next) {
    if (req.method === "GET") {
        return next();
    }
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send('No token provided');
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.body.email = payload.email;
        next();
    }
    catch (err) {
        res.status(401).send(err);
    }
}
exports.default = router;
