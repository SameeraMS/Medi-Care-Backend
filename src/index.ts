import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});