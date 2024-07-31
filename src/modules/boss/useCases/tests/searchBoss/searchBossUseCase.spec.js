import { InMemoryBossRepository } from "../../../repository/in-memory/in-memory-bossRepository";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError";

const inMemoryBossRepository = new InMemoryBossRepository();

describe("Search Boss (Unit test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to searching a boss", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "4466"
        });

        const search = await inMemoryBossRepository.searchBoss({
            boss_id: boss.boss_id
        }); 

        expect(search).toHaveProperty("boss_id");
        expect(search.name).toBe("First Boss");
    });

    it("shouldn't be able to searching a boss, if 'boss_id' parameter isn't correct", async () => {

        await inMemoryBossRepository.createBoss({
            name: "Second Boss",
            password: "7722"
        });

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        await expect(
            inMemoryBossRepository.searchBoss({
                boss_id: fakeId
            })

        ).rejects.toEqual(new AppError("Boss_id not found, or Incorrect !", 404));
        
    });

});