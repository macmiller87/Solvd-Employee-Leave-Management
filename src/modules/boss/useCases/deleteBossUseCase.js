import { BossRepository } from "../repository/bossRepository.js";
import { AppError } from "../../../error/appError.js";
import { Router } from "express";

export const deleteBossRouter = Router();

const bossRepository = new BossRepository();

deleteBossRouter.delete("/deleteBoss", async (request, response) => {

    const { boss_id } = request.query;

    const findBossById = await bossRepository.findBossById(boss_id);

    if(findBossById === false) {
        throw new AppError("Boss_id not found, or Incorrect !", 404);
    }

    await bossRepository.deleteBossById(boss_id);

    return response.status(200).json({ message: "Boss deleted with success !" });
    
});