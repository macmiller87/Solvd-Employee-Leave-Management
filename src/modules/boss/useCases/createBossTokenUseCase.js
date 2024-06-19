import { BossRepository } from "../repository/bossRepository.js";
import { authConfig } from "../../../auth/authConfig.js";
import { BossTokenRepository } from "../repository/bossTokenRepository.js";
import { Router } from "express";
import signn from 'jsonwebtoken';
const { sign } = signn;
import pkg from 'bcryptjs';
const { compare } = pkg;

export const createBossTokenRouter = Router();

const bossRepository = new BossRepository();
const bossTokenRepository = new BossTokenRepository();

createBossTokenRouter.post("/createToken", async (request, response) => {

    const { boss_id } = request.query;
    const { name, password } = request.body;

    if(name === "" || password === "") {
        return response.status(401).json({ message: "Null Data is Not Allowed, Please fill in All Datas !" });

    }else if(typeof(name) !== "string" || typeof(password) !== "string") {
        return response.status(401).json({ message: "The field's, must to be a string !" });

    }else {

        const findBossById = await bossRepository.findBossById(boss_id);

        if(findBossById === false) {
            return response.status(404).json({ message: "Boss_id not found, or Incorrect !" });
        }

        const findBossByName = await bossRepository.findBossByName(name);

        if(findBossByName === false) {
            return response.status(404).json({ message: "BossName not found, or Incorrect !" });
        }

        const getBossPassword = await bossRepository.getBossPassword(boss_id);

        const passwordMatch = await compare(password, getBossPassword);

        if(!passwordMatch) {
            return response.status(404).json({ message: "Incorrect password !" });
        }

        const { secret_Token, expiresIn } = authConfig.jwt;

        const token = sign({ boss_id }, secret_Token, {
            subject: boss_id,
            expiresIn: expiresIn,
            audience: "boss",
            issuer: "bossLoginToken"
        });

        await bossTokenRepository.create(boss_id, token);

        const getBossById = await bossRepository.getBossById(boss_id);

        return response.status(201).json({
            boss: {
                boss_id: getBossById[0].boss_id,
                name: getBossById[0].name,
                createdAt: getBossById[0].createdAt
            }, 
            token: token
        });
    }

});