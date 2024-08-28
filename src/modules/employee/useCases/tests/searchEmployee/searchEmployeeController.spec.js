import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Search Employee Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to searching a employee", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "2998"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "2998"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "First Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        const search = await request(app).get("/searchEmployee").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(search.body.employee).toHaveProperty("employee_id");
        expect(search.body.employee.employeeName).toBe("First Employee");
        expect(search.body.employee.baseSalary).toEqual(2800.55);
        expect(search.body.employee).toHaveProperty("startDate");
        expect(search.body.employee).toHaveProperty("created_at");
        expect(search.status).toBe(200);
    });

    it("shouldn't be able to searching a employee, if 'employee_id' parameter isn't correct", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Second Boss",
            password: "4488"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "4488"
        });

        const { token } = sign.body;

        await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Second Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        const search = await request(app).get("/searchEmployee").query({
            employee_id: fakeId

        }).set({
            authorization: `Bearer ${token}`
        }); 

        expect(search.body).toStrictEqual({ message: "Employee Not Found !" });
        expect(search.status).toBe(404);
    });

    it("shouldn't be able to searching a employee, if 'token' parameter isn't valid", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Third  Boss",
            password: "2364"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "2364"
        });

        const { token } = sign.body;


        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Third Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        const { fakeToken } = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        const search = await request(app).get("/searchEmployee").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${fakeToken}`
        });

        expect(search.body).toStrictEqual({ message: "Invalid Token !" });
        expect(search.status).toBe(401);
    });

});