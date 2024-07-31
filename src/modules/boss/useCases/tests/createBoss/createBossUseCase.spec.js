import { InMemoryBossRepository } from "../../../repository/in-memory/in-memory-bossRepository.js";
import postgresSql from "../../../../../database/service/postgService.js";
import { AppError } from "../../../../../error/appError.js";

const inMemoryBossRepository = new InMemoryBossRepository();

describe("Create Boss (Unit test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to create a boss", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "8888"
        });

        expect(boss).toHaveProperty("boss_id");
        expect(boss.name).toBe("First Boss");
    });

    it("shouldn't be able to create a boss, if the type of the parameters isn't a string", async () => {

        await expect(
            inMemoryBossRepository.createBoss({
                name: "Second Boss",
                password: 8888
            })
            
        ).rejects.toEqual(new AppError("The field's, must to be a string !", 405));

        await expect(
            inMemoryBossRepository.createBoss({
                name: 1441413,
                password: "8888"
            })

        ).rejects.toEqual(new AppError("The field's, must to be a string !", 405));

    });

    it("shouldn't be able to create a boss, with the same name", async () => {

        await inMemoryBossRepository.createBoss({
            name: "Third Boss",
            password: "8888"
        });

        await expect(
            inMemoryBossRepository.createBoss({
                name: "Third Boss",
                password: "9999"
            })

        ).rejects.toEqual(new AppError("The bossName already exists !", 401));
        
    });

});