import express, { Request, Response, Application, application } from "express";
import http from 'http';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from "../src/routes/userRoute";
import adminRouter from "../src/routes/adminRoute";
import recruiterRouter from "../src/routes/recruiterRoute";
import chatRouter from "../src/routes/chatRoute";


export const createServer = () => {
    try {
        const app: Application | undefined = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
        app.use(cookieParser())


        app.use('/api/user', userRouter);
        app.use('/api/admin', adminRouter);
        app.use('/api/recruiter', recruiterRouter);
        app.use('/api/chat', chatRouter);

        return app;

    } catch (error) {
        console.log(error);
        console.log('error caught from app.ts');
    }
}