import { BossRepository } from "../bossRepository";
import { BossTokenRepository } from "../bossTokenRepository";
import { authConfig } from "../../../../auth/authConfig";
import { GenerateJWT } from "../../../../auth/generateToken";
import { AppError } from "../../../../error/appError";
import pkg from 'bcryptjs';
const { hash, compare } = pkg;

const jwtToken = new GenerateJWT();

export class InMemoryBossRepository  {

    _bossRepository;
    _bossTokenRepository;

    constructor(
        bossRepository = new BossRepository(),
        bossTokenRepository = new BossTokenRepository()
    ) {
        this._bossRepository = bossRepository;
        this._bossTokenRepository = bossTokenRepository;
    }

    async createBoss(datas) {

        if(typeof (datas.name) !== "string" || typeof (datas.password) !== "string") {
            throw new AppError("The field's, must to be a string !", 405);

        }else {

            const findBossByName = await this._bossRepository.findBossByName(datas.name);

            if(findBossByName === true) {
                throw new AppError("The bossName already exists !", 401);
            }

            const passwordHash = await hash(datas.password, 8);

            const createBoss = await this._bossRepository.create({
                name: datas.name,
                password: passwordHash
            })

            const boss = {
                boss_id: createBoss[0].boss_id,
                name: createBoss[0].name,
                created_at: createBoss[0].created_at
            }

            return boss;
        }

    }

    async createToken(datas) {

        if(typeof(datas.name) !== "string" || typeof(datas.password) !== "string") {
            throw new AppError("The field's, must to be a string !", 405);

        }else {

            const findBossById = await this._bossRepository.findBossById(datas.boss_id);

            if(findBossById === false) {
                throw new AppError("Boss_id not found, or Incorrect !", 404);
            }

            const findBossByName = await this._bossRepository.findBossByName(datas.name);

            if(findBossByName === false) {
                throw new AppError("BossName not found, or Incorrect !", 404);
            }

            const getBossPassword = await this._bossRepository.getBossPassword(datas.boss_id);
            const searchBoss = await this._bossRepository.getBossById(datas.boss_id);

            const passwordMatch = await compare(datas.password, getBossPassword);

            if(!passwordMatch) {
                throw new AppError("Incorrect password !", 401);
            }

            const payload = {
                id: datas.boss_id,
                name: searchBoss[0].name 
            }

            const { secret_Token } = authConfig.jwt;

            const token = await jwtToken.generateJWT(payload, secret_Token);

            await this._bossTokenRepository.create(datas.boss_id, token);

            const boss = {
                boss_id: searchBoss[0].boss_id,
                name: searchBoss[0].name,
                created_at: searchBoss[0].created_at
            }

            return {
                boss,
                token
            }

        }

    }

    async searchBoss(datas) {

        const findBossById = await this._bossRepository.findBossById(datas.boss_id);

        if(findBossById === false) {
            throw new AppError("Boss_id not found, or Incorrect !", 404);
        }

        const searchBoss = await this._bossRepository.getBossById(datas.boss_id);

        const boss = {
            boss_id: searchBoss[0].boss_id,
            name: searchBoss[0].name,
            created_at: searchBoss[0].created_at
        }

        return boss;
    }

    async DeleteBoss(datas) {

        const findBossById = await this._bossRepository.findBossById(datas.boss_id);

        if(findBossById === false) {
            throw new AppError("Boss_id not found, or Incorrect !", 404);
        }

        await this._bossRepository.deleteBossById(datas.boss_id);

        return { message: "Boss deleted with success !" };
    }

}