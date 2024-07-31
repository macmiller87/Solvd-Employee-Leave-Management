import { InMemoryBossRepository } from "../../../repository/in-memory/in-memory-bossRepository";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError";

const inMemoryBossRepository = new InMemoryBossRepository();

describe("Delete Boss (Unit Test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to delete a boss", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "2288"
        });

        const del = await inMemoryBossRepository.DeleteBoss({
            boss_id: boss.boss_id
        }); 

        expect(del).toStrictEqual({ message: "Boss deleted with success !" });
    });

    it("shouldn't be able to delete a boss, if 'boss_is' parameter isn't correct", async () => {

        await inMemoryBossRepository.createBoss({
            name: "Second Boss",
            password: "1199"
        });

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        await expect(
            inMemoryBossRepository.DeleteBoss({
                boss_id: fakeId
            })
        
        ).rejects.toEqual(new AppError("Boss_id not found, or Incorrect !", 404));

    });

});