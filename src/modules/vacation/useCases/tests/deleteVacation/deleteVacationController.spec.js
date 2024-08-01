import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Delete Vacation Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to delete an employee's vacation", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "6644"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "6644"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "First Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "07/26/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        const calcVacation = await request(app).post("/calculateVacation").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        }); 

        const del = await request(app).delete("/deleteVacation").query({
            vacation_id: calcVacation.body.employee.vacation[0].vacation_id

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(del.body).toStrictEqual({ message: "Vacation deleted with success !" });
        expect(del.status).toBe(200);
    });

    it("shouldn't be able to delete an employee's vacation, if 'vacation_id' parameter aren't correct", async () => {

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

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Second Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "07/26/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        await request(app).post("/calculateVacation").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        }); 

        const fakeId = "20611e33-469b-4cb5-a88b-51adacd9f070";

        const del = await request(app).delete("/deleteVacation").query({
            vacation_id: fakeId

        }).set({
            authorization: `Bearer ${token}`
        });

        expect(del.body).toStrictEqual({ message: "Vacation not found !" });
        expect(del.status).toBe(404);
    });

    it("shouldn't be able to delete an employee's vacation, if 'token' parameter isn't valid", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Third Boss",
            password: "1199"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "1199"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Third Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "07/26/2023"

        }).set({
            authorization: `Bearer ${token}`
        });

        const calcVacation = await request(app).post("/calculateVacation").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        }); 

        const fakeToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        const del = await request(app).delete("/deleteVacation").query({
            vacation_id: calcVacation.body.employee.vacation[0].vacation_id

        }).set({
            authorization: `Bearer ${fakeToken}`
        });

        expect(del.body).toStrictEqual({ message: "Invalid Token !" });
        expect(del.status).toBe(401);
    });

});