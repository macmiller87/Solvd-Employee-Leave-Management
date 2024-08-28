import { BossRepository } from "../repository/bossRepository.js";
import { authConfig } from "../../../auth/authConfig.js";
import { BossTokenRepository } from "../repository/bossTokenRepository.js";
import { GenerateJWT } from "../../../auth/generateToken.js";
import { AppError } from "../../../error/appError.js";
import pkg from 'bcryptjs';
const { compare } = pkg;

const bossRepository = new BossRepository();
const bossTokenRepository = new BossTokenRepository();
const jwtToken = new GenerateJWT();

export class CreateBossToken {

    async execute(request, response) {

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
            const searchBoss = await bossRepository.getBossById(boss_id);

            const passwordMatch = await compare(password, getBossPassword);

            if(!passwordMatch) {
                throw new AppError("Incorrect password !", 401);
            }

            const payload = {
                id: boss_id,
                name: searchBoss[0].name 
            }

            const { secret_Token } = authConfig.jwt;

            const token = await jwtToken.generateJWT(payload, secret_Token);

            await bossTokenRepository.create(boss_id, token);

            return response.status(201).json({
                boss: {
                    boss_id: searchBoss[0].boss_id,
                    name: searchBoss[0].name,
                    created_at: searchBoss[0].created_at
                }, 
                token: token
            });

        }

    }
    
}