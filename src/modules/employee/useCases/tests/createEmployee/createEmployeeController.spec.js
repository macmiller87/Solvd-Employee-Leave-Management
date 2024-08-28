import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Create Employee Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to create a employee", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "8899"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "8899"
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

        expect(employee.body.employee).toHaveProperty("employee_id");
        expect(employee.body.employee.employeeName).toBe("First Employee");
        expect(employee.body.employee.baseSalary).toEqual(2800.55);
        expect(employee.body.employee).toHaveProperty("created_at");
        expect(employee.status).toBe(201);
    });

    it("shouldn't be able to create a employee, if the type of the parameters isn't a string", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Second Boss",
            password: "2233"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "2233"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: 184365,
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(employee.body).toStrictEqual({ message: "The fields, must to be a string !" });
        expect(employee.status).toBe(405);

        const employee2 = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Second Employee",
            jobTitle: 826586,
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(employee2.body).toStrictEqual({ message: "The fields, must to be a string !" });
        expect(employee2.status).toBe(405);

        const employee3 = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Second Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: 4072023

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(employee3.body).toStrictEqual({ message: "The fields, must to be a string !" });
        expect(employee3.status).toBe(405);
    });

    it("shouldn't be able to create a employee, if 'baseSalary' parameter aren't a number", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Third Boss",
            password: "4499"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "4499"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Third Employee",
            jobTitle: "developer",
            baseSalary: "2800.55",
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(employee.body).toStrictEqual({ message: "The baseSalary field , must to be a number int or float !" });
        expect(employee.status).toBe(405);
    });

    it("shouldn't be able to create a employee, if 'startDate' parameter are different of US standard format mm/dd/yyyy", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Fourth Boss",
            password: "1122"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "1122"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Third Employee",
            jobTitle: "QA",
            baseSalary: 2800.55,
            startDate: "04-07-2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(employee.body).toStrictEqual({ message: "The startDate field  isn't in the rigth format mm/dd/yyyy, please change !" });
        expect(employee.status).toBe(401);
    });

    it("shouldn't be able to create a employee, with the same name", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Fifth  Boss",
            password: "9944"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "9944"
        });

        const { token } = sign.body;

        await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "First Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        const employee2 = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "First Employee",
            jobTitle: "FrontEnd developer",
            baseSalary: 2400.55,
            startDate: "08/08/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(employee2.body).toStrictEqual({ message: "The employeeName already exists !" });
        expect(employee2.status).toBe(401);
    });

    it("shouldn't be able to create a employee, if 'boss_id' parameter aren't correct", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Sixth  Boss",
            password: "4664"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "4664"
        });

        const { token } = sign.body;

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        const employee = await request(app).post("/createEmployee").query({
            boss_id: fakeId

        }).send({
            employeeName: "Fourth Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(employee.body).toStrictEqual({ message: "Boss ID Not Found !" });
        expect(employee.status).toBe(404);
    });

    it("shouldn't be able to create a employee, if 'token' parameter isn't valid", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Seventh  Boss",
            password: "6633"
        });

        await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "6633"
        });

        const { fakeToken } = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Fourth Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023"

        }).set({
            authorization: `Bearer ${fakeToken}`
        });

        expect(employee.body).toStrictEqual({ message: "Invalid Token !" });
        expect(employee.status).toBe(401);
    });

});