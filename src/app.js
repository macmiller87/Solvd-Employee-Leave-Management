import express from "express";
import cors from "cors";
import { bossRoutes } from "./routes/boss.routes.js";

export const app = express();

app.use(express.json());
app.use(cors());

app.use(bossRoutes);
