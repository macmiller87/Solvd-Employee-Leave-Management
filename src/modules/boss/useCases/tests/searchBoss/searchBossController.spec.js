import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Search Boss Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to searching a boss", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "4466"
        });

        const search = await request(app).get("/searchBoss").query({
            boss_id: boss.body.boss.boss_id
        }); 

        expect(search.body.boss).toHaveProperty("boss_id");
        expect(search.body.boss.name).toBe("First Boss");
        expect(search.status).toBe(200);
    });

    it("shouldn't be able to searching a boss, if 'boss_id' parameter isn't correct", async () => {

        await request(app).post("/createBoss").send({
            name: "Second Boss",
            password: "7722"
        });

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        const search = await request(app).get("/searchBoss").query({
            boss_id: fakeId
        }); 

        expect(search.body).toStrictEqual({ message: "Boss_id not found, or Incorrect !" });
        expect(search.status).toBe(404);
    });

});