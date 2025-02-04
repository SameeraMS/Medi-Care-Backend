import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import doctorRoutes from "./routes/doctorRoutes";
import mongoose from "mongoose";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});


app.use('/api/doctors', doctorRoutes);


const mongoURI = process.env.MONGODB_URI as string;

mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error: unknown) => console.error("MongoDB connection error:", error));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});