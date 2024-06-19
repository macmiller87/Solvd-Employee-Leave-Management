import { BossRepository } from "../repository/bossRepository.js"
import { Router } from "express";
import pkg from 'bcryptjs';
const { hash } = pkg;

export const createBossRouter = Router();

const bossRepository = new BossRepository();

createBossRouter.post("/createBoss",  async (request, response) => {

    const { name, password } = request.body;

    if(name === "" || password === "") {
        return response.status(401).json({ message: "Null Data is Not Allowed, Please fill in All Datas !" });

    }else if(typeof(name) !== "string" || typeof(password) !== "string") {
        return response.status(401).json({ message: "The filed's, must to be a string !" });

    }else {

        const findBossByName = await bossRepository.findBossByName(name);

        if(findBossByName === true) {
            return response.status(401).json({ message: "The bossName already exists !" });
        }

        const passwordHash = await hash(password, 8);

        const createBoss = await bossRepository.create({
            name,
            password: passwordHash
        });

        return response.status(201).json({
            boss: {
                boss_id: createBoss[0].boss_id,
                name: createBoss[0].name,
                createdAt: createBoss[0].createdAt
            }
        });
    }

});