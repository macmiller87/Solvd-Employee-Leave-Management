import { BossRepository } from "../repository/bossRepository.js";
import { Router } from "express";

export const deleteBossRouter = Router();

const bossRepository = new BossRepository();

deleteBossRouter.delete("/deleteBoss", async (request, response) => {

    const { boss_id } = request.query;

    const findBossById = await bossRepository.findBossById(boss_id);

    if(findBossById === false) {
        return response.status(404).json({ message: "Boss_id not found, or Incorrect !" });
    }

    await bossRepository.deleteBossById(boss_id);

    return response.status(200).json({ message: "Boss deleted with success !" });
    
});