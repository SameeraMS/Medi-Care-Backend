"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const doctorRoutes_1 = __importDefault(require("./routes/doctorRoutes"));
const hospitalRoutes_1 = __importDefault(require("./routes/hospitalRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const docHospitalRoutes_1 = __importDefault(require("./routes/docHospitalRoutes"));
const appointmentsRoutes_1 = __importDefault(require("./routes/appointmentsRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const auth_routes_2 = require("./routes/auth-routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth', auth_routes_1.default);
app.use(auth_routes_2.authenticateToken);
app.use('/api/doctors', doctorRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/hospitals', hospitalRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/admins', adminRoutes_1.default);
app.use('/api/dochospitals', docHospitalRoutes_1.default);
app.use('/api/appointments', appointmentsRoutes_1.default);
const mongoURI = process.env.MONGODB_URI;
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
