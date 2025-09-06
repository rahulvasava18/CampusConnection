import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/Db.js';
import { protect } from './middlewares/authMiddleware.js';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import postRouter from './router/postRouter.js';
import feedRouter from './router/feedRouter.js';
import eventRouter from './router/eventRouter.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true                // allow cookies if needed
}));

app.use("/api/auth/", authRouter);
app.use("/api/user/", protect, userRouter);
app.use("/api/post/", protect, postRouter);
app.use("/api/feed/", protect, feedRouter);
app.use("/api/events/", protect, eventRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
