import { BossRepository } from "../repository/bossRepository.js";
import { AppError } from "../../../error/appError.js"

const bossRepository = new BossRepository();

export class SearchBoss {

    async execute(request, response) {

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
                created_at: searchBoss[0].created_at
            }
        });

    }

}