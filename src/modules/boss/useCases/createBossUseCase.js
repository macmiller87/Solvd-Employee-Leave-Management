import { BossRepository } from "../repository/bossRepository.js"
import { AppError } from "../../../error/appError.js";
import pkg from 'bcryptjs';
const { hash } = pkg;

const bossRepository = new BossRepository();

export class CreateBoss {

    async execute(request, response) {

        const { name, password } = request.body;

        if(name === "" || password === "") {
            throw new AppError("Null Data is Not Allowed, Please fill in All Datas !", 400);

        }else if(typeof (name) !== "string" || typeof (password) !== "string") {
            throw new AppError("The field's, must to be a string !", 405);

        }else {

            const findBossByName = await bossRepository.findBossByName(name);

            if(findBossByName === true) {
                throw new AppError("The bossName already exists !", 401);
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
                    created_at: createBoss[0].created_at
                }
            });
        }

    }

}