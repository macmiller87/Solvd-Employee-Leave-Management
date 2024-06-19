import postgresSql from "../../../database/service/postgService.js";
import { randomUUID } from "node:crypto";

export class BossRepository {

    async create(datas) {
        const bossId = randomUUID();
        const { name, password } = datas;  

        const insert = await postgresSql `INSERT INTO boss(boss_id, name, password) VALUES(${bossId}, ${name}, ${password}) RETURNING *`;
        return insert;
    }

    async findBossByName(name) {
        const find = await postgresSql `SELECT name FROM boss WHERE name = ${name}`;

        const queryResult = find.count === 1 ? true : false;
        return queryResult;
    }

    async findBossById(boss_id) {
        const find = await postgresSql `SELECT boss_id FROM boss WHERE boss_id = ${boss_id}`;
        
        const queryResult = find.count === 1 ? true : false;
        return queryResult;
    }

    async getBossPassword(boss_id) {
        const find = await postgresSql `SELECT password FROM boss WHERE boss_id = ${boss_id}`;

        const queryResult = find.count === 1 ? find[0].password : false;
        return queryResult;
    }

    async getBossById(boss_id) {
        const find = await postgresSql `SELECT * FROM boss WHERE boss_id = ${boss_id}`;

        const queryResult = find.count === 1 ? find : false;
        return queryResult;
    }

    async deleteBossById(boss_id) {
        await postgresSql `DELETE FROM boss WHERE boss_id = ${boss_id}`;
    }
    
}