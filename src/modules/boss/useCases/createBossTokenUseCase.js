import { BossRepository } from "../repository/bossRepository.js";
import { authConfig } from "../../../auth/authConfig.js";
import { BossTokenRepository } from "../repository/bossTokenRepository.js";
import { AppError } from "../../../error/appError.js";
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
        throw new AppError("Null Data is Not Allowed, Please fill in All Datas !", 400);

    }else if(typeof(name) !== "string" || typeof(password) !== "string") {
       throw new AppError("The field's, must to be a string !", 405);

    }else {

        const findBossById = await bossRepository.findBossById(boss_id);

        if(findBossById === false) {
            throw new AppError("Boss_id not found, or Incorrect !", 404);
        }

        const findBossByName = await bossRepository.findBossByName(name);

        if(findBossByName === false) {
            throw new AppError("BossName not found, or Incorrect !", 404);
        }

        const getBossPassword = await bossRepository.getBossPassword(boss_id);

        const passwordMatch = await compare(password, getBossPassword);

        if(!passwordMatch) {
            throw new AppError("Incorrect password !", 401);
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