import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Create boss Token Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to generate a token, if the boss parameters are correct ", async () => {
       
        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "8888"
        });

        const generateToken = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "8888"
        });
    
        expect(generateToken.body.boss).toHaveProperty("boss_id");
        expect(generateToken.body.boss.name).toBe("First Boss");
        expect(generateToken.body).toHaveProperty("token");
        expect(generateToken.status).toBe(201);
    });

    it("shouldn't be able to generate a token, if the type of the parameters isn't a string", async () => {
       
        const boss = await request(app).post("/createBoss").send({
            name: "Some Boss",
            password: "8888"
        });

        const generateToken = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: 6464784,
            password: "8888"
        });
    
        expect(generateToken.body).toStrictEqual({ message: "The field's, must to be a string !"});
        expect(generateToken.status).toBe(405);

        const generateToken2 = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: 8888
        });

        expect(generateToken2.body).toStrictEqual({ message: "The field's, must to be a string !"});
        expect(generateToken2.status).toBe(405);
    });

    it("shouldn't be able to generate a token, if 'boss_id' parameter isn't correct", async () => {
       
        const boss = await request(app).post("/createBoss").send({
            name: "Second Boss",
            password: "1234"
        });

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        const generateToken = await request(app).post("/createToken").query({
            boss_id: fakeId

        }).send({
            name: boss.body.boss.name,
            password: "1234"
        });
    
        expect(generateToken.body).toStrictEqual({ message: "Boss_id not found, or Incorrect !"});
        expect(generateToken.status).toBe(404);
    });

    it("shouldn't be able to generate a token, if 'name' parameter isn't correct", async () => {
       
        const boss = await request(app).post("/createBoss").send({
            name: "Third Boss",
            password: "5678"
        });

        const fakeName = "Some name";

        const generateToken = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: fakeName,
            password: "5678"
        });
    
        expect(generateToken.body).toStrictEqual({ message: "BossName not found, or Incorrect !"});
        expect(generateToken.status).toBe(404);
    });

    it("shouldn't be able to generate a token, if 'password' parameter isn't correct", async () => {
       
        const boss = await request(app).post("/createBoss").send({
            name: "fourth Boss",
            password: "6677"
        });

        const fakePassword = "Some password";

        const generateToken = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: fakePassword
        });
    
        expect(generateToken.body).toStrictEqual({ message: "Incorrect password !"});
        expect(generateToken.status).toBe(401);
    });

});