import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import { userRouter } from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectDB } from "./config/db.js";
dotenv.config();

const port = process.env.PORT || 5001;

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({message: "hello"})
})


app.use("/api/v1/user", userRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server started on port ${port}`))