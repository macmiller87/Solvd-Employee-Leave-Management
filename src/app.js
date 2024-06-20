import express from "express";
import cors from "cors";
import { bossRoutes } from "./routes/boss.routes.js";
import { employeeRoutes } from "./routes/employee.routes.js";

export const app = express();

app.use(express.json());
app.use(cors());

app.use(bossRoutes);
app.use(employeeRoutes);
