import { createBossRouter } from "../modules/boss/useCases/createBossUseCase.js";
import { createBossTokenRouter } from "../modules/boss/useCases/createBossTokenUseCase.js";
import { searchBossRouter } from "../modules/boss/useCases/searchBoss.js";
import { deleteBossRouter } from "../modules/boss/useCases/deleteBossUseCase.js";
import { Router } from "express";

export const bossRoutes = Router();

bossRoutes.use(createBossRouter);
bossRoutes.use(createBossTokenRouter);
bossRoutes.use(searchBossRouter);
bossRoutes.use(deleteBossRouter);