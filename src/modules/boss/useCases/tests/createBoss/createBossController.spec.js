import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Create Boss Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to create a boss", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "8888"
        });

        expect(boss.body.boss).toHaveProperty("boss_id");
        expect(boss.body.boss.name).toBe("First Boss");
        expect(boss.status).toBe(201);
    });

    it("shouldn't be able to create a boss, if the type of the parameters isn't a string", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Second Boss",
            password: 8888
        });

        expect(boss.body).toStrictEqual({ message: "The field's, must to be a string !"});
        expect(boss.status).toBe(405);

        const boss2 = await request(app).post("/createBoss").send({
            name: 1441413,
            password: "8888"
        });

        expect(boss2.body).toStrictEqual({ message: "The field's, must to be a string !"});
        expect(boss2.status).toBe(405);
    });

    it("shouldn't be able to create a boss, with the same name", async () => {

        await request(app).post("/createBoss").send({
            name: "Third Boss",
            password: "8888"
        });

        const boss = await request(app).post("/createBoss").send({
            name: "Third Boss",
            password: "9999"
        });

        expect(boss.body).toStrictEqual({ message: "The bossName already exists !"});
        expect(boss.status).toBe(401);
    });

});

