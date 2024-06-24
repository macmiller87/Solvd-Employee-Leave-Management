import { BossRepository } from "../repository/bossRepository.js";
import { AppError } from "../../../error/appError.js"
import { Router } from "express";

export const searchBossRouter = Router();

const bossRepository = new BossRepository();

searchBossRouter.get("/searchBoss", async (request, response) => {

    const { boss_id } = request.query;

    const findBossById = await bossRepository.findBossById(boss_id);

    if(findBossById === false) {
        throw new AppError("Boss_id not found, or Incorrect !", 404);
    }

    const searchBoss = await bossRepository.getBossById(boss_id);

    return response.status(200).json({
        boss: {
            boss_id: searchBoss[0].boss_id,
            name: searchBoss[0].name,
            createdAt: searchBoss[0].createdAt
        }
    });

});