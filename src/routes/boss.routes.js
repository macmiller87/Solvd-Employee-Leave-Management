import { CreateBoss } from "../modules/boss/useCases/createBossUseCase.js";
import { CreateBossToken } from "../modules/boss/useCases/createBossTokenUseCase.js";
import { SearchBoss } from "../modules/boss/useCases/searchBoss.js";
import { DeleteBoss } from "../modules/boss/useCases/deleteBossUseCase.js";
import { Router } from "express";

export const bossRoutes = Router();

const createBossRouter = new CreateBoss();
const createBossTokenRouter = new CreateBossToken();
const searchBossRouter = new SearchBoss();
const deleteBossRouter = new DeleteBoss();

bossRoutes.post("/createBoss", createBossRouter.execute);
bossRoutes.post("/createToken", createBossTokenRouter.execute);
bossRoutes.get("/searchBoss", searchBossRouter.execute);
bossRoutes.delete("/deleteBoss", deleteBossRouter.execute);