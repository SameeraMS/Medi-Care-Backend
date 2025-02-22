import express from "express";
import dotenv from "dotenv";
import jwt, {Secret} from "jsonwebtoken";
import {getUserByEmail, registerUser, verifyUser} from "./userRoutes";
import user from "../models/user";
import {getAdminByEmail, registerAdmin, verifyAdmin} from "./adminRoutes";
import admin from "../models/admin";

dotenv.config();

const router = express.Router();

router.post("/user/login",async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const isVerified = await verifyUser(email, password);

        if(isVerified){
            const user = await getUserByEmail(email);
            const token = jwt.sign({ email }, process.env.SECRET_KEY as Secret, {expiresIn: "7d"});
            const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN as Secret, {expiresIn: "70d"});
            res.json({accessToken : token, refreshToken : refreshToken, user : user});
        }else{
            res.sendStatus(403).send('Invalid credentials')
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/user/register",async (req, res) => {
    const { name, email, phone, password } = req.body;

    const newUser = new user({
        name,
        email,
        phone,
        password
    });

    try {
        const isRegistered = await registerUser(newUser);

        if (!isRegistered) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err)
        res.status(401).json(err);
    }
});

router.post("/admin/login",async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const isVerified = await verifyAdmin(email, password);

        if(isVerified){
            const admin = await getAdminByEmail(email);
            const token = jwt.sign({ email }, process.env.SECRET_KEY as Secret, {expiresIn: "7d"});
            const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN as Secret, {expiresIn: "70d"});
            res.json({accessToken : token, refreshToken : refreshToken, admin : admin});
        }else{
            res.sendStatus(403).send('Invalid credentials')
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/admin/register",async (req, res) => {
    const { name, email, phone, password } = req.body;

    const newAdmin = new admin({
        name,
        email,
        password
    });

    try {
        const isRegistered = await registerAdmin(newAdmin);

        if (!isRegistered) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err)
        res.status(401).json(err);
    }
});


router.post("/refresh-token", async (req, res) => {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader?.split(' ')[1];

    if(!refresh_token)res.status(401).send('No token provided');

    try{
        const payload = jwt.verify(refresh_token as string, process.env.REFRESH_TOKEN as Secret) as {email: string, iat: number};
        const token = jwt.sign({ email: payload.email }, process.env.SECRET_KEY as Secret, {expiresIn: "7d"});
        res.json({accessToken : token});
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
})

export function authenticateToken(req : express.Request, res : express.Response, next : express.NextFunction){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    console.log(token);
    if(!token) {
        res.status(401).send('No token provided');
        return;
    }

    try{
        const payload = jwt.verify(token as string, process.env.SECRET_KEY as Secret) as {email: string, iat: number};
        console.log(payload.email);
        req.body.email = payload.email;
        next();
    }catch(err){
        res.status(401).send(err);
    }
}
export default router;
