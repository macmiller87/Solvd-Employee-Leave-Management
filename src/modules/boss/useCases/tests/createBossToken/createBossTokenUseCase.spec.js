import { InMemoryBossRepository } from "../../../repository/in-memory/in-memory-bossRepository";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError";

const inMemoryBossRepository = new InMemoryBossRepository();

describe("Create Token (Unit test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to generate a token, if the boss parameters are correct ", async () => {
       
        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "8888"
        });

        const generateToken = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "8888"
        });
    
        expect(generateToken.boss).toHaveProperty("boss_id");
        expect(generateToken.boss.name).toBe("First Boss");
        expect(generateToken).toHaveProperty("token");
    });

    it("shouldn't be able to generate a token, if the type of the parameters isn't a string", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Some Boss",
            password: "8888"
        })

        await expect(
            inMemoryBossRepository.createToken({
                boss_id: boss.boss_id,
                name: 7647646,
                password: "8888"
            })
        
        ).rejects.toEqual(new AppError("The field's, must to be a string !", 405));

        await expect(
            inMemoryBossRepository.createToken({
                boss_id: boss.boss_id,
                name: boss.name,
                password: 8888
            })
        
        ).rejects.toEqual(new AppError("The field's, must to be a string !", 405));

    });

    it("shouldn't be able to generate a token, if 'boss_id' parameter isn't correct", async () => {
       
        const boss = await inMemoryBossRepository.createBoss({
            name: "Second Boss",
            password: "1234"
        });

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        await expect(
            inMemoryBossRepository.createToken({
                boss_id: fakeId,
                name: boss.name,
                password: "1234"
            })

        ).rejects.toEqual(new AppError("Boss_id not found, or Incorrect !", 404));

    });

    it("shouldn't be able to generate a token, if 'name' parameter isn't correct", async () => {
       
        const boss = await inMemoryBossRepository.createBoss({
            name: "Third Boss",
            password: "5678"
        });

        const fakeName = "Some name";

        await expect(
            inMemoryBossRepository.createToken({
                boss_id: boss.boss_id,
                name: fakeName,
                password: "5678"

            })

        ).rejects.toEqual(new AppError("BossName not found, or Incorrect !", 404));

    });

    it("shouldn't be able to generate a token, if 'password' parameter isn't correct", async () => {
       
        const boss = await inMemoryBossRepository.createBoss({
            name: "fourth Boss",
            password: "6677"
        });

        const fakePassword = "Some password";

        await expect(
            inMemoryBossRepository.createToken({
                boss_id: boss.boss_id,
                name: boss.name,
                password: fakePassword

            })
            
        ).rejects.toEqual(new AppError("Incorrect password !", 401));

    });

});