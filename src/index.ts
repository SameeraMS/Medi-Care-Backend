import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import doctorRouter from "./routes/doctorRoutes";
import hospitalRouter from './routes/hospitalRoutes';
import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';
import docHospitalRouter from './routes/docHospitalRoutes';
import appointmentsRouter from './routes/appointmentsRoutes';
import mongoose from "mongoose";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});


app.use('/api/doctors', doctorRouter);
app.use('/api/hospitals', hospitalRouter);
app.use('/api/users', userRouter);
app.use('/api/admins', adminRouter);
app.use('/api/dochospitals', docHospitalRouter);
app.use('/api/appointments', appointmentsRouter);

const mongoURI = process.env.MONGODB_URI as string;

mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error: unknown) => console.error("MongoDB connection error:", error));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});