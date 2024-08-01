import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Delete Employee Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to delete a employee", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "5445"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "5445"
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

        const del = await request(app).delete("/deleteEmployee").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(del.body).toStrictEqual({ message: "Employee deleted with success !" });
        expect(del.status).toBe(200);
    });

    it("shouldn't be able to delete a employee, if 'employee_id' parameter isn't correct", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Second Boss",
            password: "7654"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "7654"
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

        const del = await request(app).delete("/deleteEmployee").query({
            employee_id: fakeId

        }).set({
            authorization: `Bearer ${token}`
        }); 

        expect(del.body).toStrictEqual({ message: "Employee Not Found !" });
        expect(del.status).toBe(404);
    });

    it("shouldn't be able to delete a employee, if 'token' parameter isn't valid", async () => {

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

        const del = await request(app).delete("/deleteEmployee").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${fakeToken}`
        }); 

        expect(del.body).toStrictEqual({ message: "Invalid Token !" });
        expect(del.status).toBe(401);
    });

});