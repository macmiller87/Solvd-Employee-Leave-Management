import postgresSql from "../../../database/service/postgService.js";
import { randomUUID } from "node:crypto";

export class BossTokenRepository {

    async create(boss_id, token) {
        const tokenId = randomUUID();

        const insert = await postgresSql `INSERT INTO bosstoken(token_id, boss_id, token) VALUES(${tokenId}, ${boss_id}, ${token})`;
        return insert;
    }
    
}
