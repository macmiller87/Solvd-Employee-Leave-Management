import postgresSql from "../../../../../database/service/postgService.js";
import { app } from "../../../../../app.js";
import request from "supertest";

describe("Calculate Vacation Controller", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to calculate an employee's vacation, if he have one or more years of work", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "First Boss",
            password: "8822"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "8822"
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
        }) 

        expect(calcVacation.body.employee).toHaveProperty("boss_id");
        expect(calcVacation.body.employee).toHaveProperty("employee_id");
        expect(calcVacation.body.employee.employeeName).toEqual("First Employee");
        expect(calcVacation.body.employee.jobTitle).toEqual("BackEnd developer");
        expect(calcVacation.body.employee.baseSalary).toEqual(3100.80);
        expect(calcVacation.body.employee.startDate).toEqual("7/26/2023");
        expect(calcVacation.body.employee).toHaveProperty("created_at");
        expect(calcVacation.body.employee.vacation[0]).toHaveProperty("vacation_id");
        expect(calcVacation.body.employee.vacation[0]).toHaveProperty("employee_id");
        expect(calcVacation.body.employee.vacation[0].employee_name).toEqual("First Employee");
        expect(calcVacation.body.employee.vacation[0].employee_jobtitle).toEqual("BackEnd developer");
        expect(calcVacation.body.employee.vacation[0].qtty_paid_vacation).toEqual(1);
        expect(calcVacation.body.employee.vacation[0].qtty_days_on_vacation).toEqual(30);
        expect(calcVacation.body.employee.vacation[0]).toHaveProperty("value_to_recieve");
        expect(calcVacation.body.employee.vacation[0]).toHaveProperty("time_worked_amount");
        expect(calcVacation.body.employee.vacation[0]).toHaveProperty("created_at");
        expect(calcVacation.status).toBe(201);
    });

    it("should be able to send informations trought renponse about employee's vacation, if he have less than one year of work", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Second Boss",
            password: "2398"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "2398"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Second Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2024"

        }).set({
            authorization: `Bearer ${token}`
        });

        const calcVacation = await request(app).post("/calculateVacation").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        }) 

        expect(calcVacation.body.info).toStrictEqual({ message: "You don't have enough company time to take and calculate vacations !" });
        expect(calcVacation.body.employee).toHaveProperty("boss_id");
        expect(calcVacation.body.employee).toHaveProperty("employee_id");
        expect(calcVacation.body.employee.employeeName).toEqual("Second Employee");
        expect(calcVacation.body.employee.jobTitle).toEqual("BackEnd developer");
        expect(calcVacation.body.employee.baseSalary).toEqual(3100.80);
        expect(calcVacation.body.employee.startDate).toEqual("1/26/2024");
        expect(calcVacation.body.employee).toHaveProperty("created_at");
        expect(calcVacation.body.vacation.qttyPaidVacation).toEqual(0);
        expect(calcVacation.body.vacation.qttyDaysOnVacation).toEqual(0);
        expect(calcVacation.body.vacation.valueToRecieve).toEqual(0);
        expect(calcVacation.body.vacation).toHaveProperty("timeWorkedAmount");
        expect(calcVacation.status).toBe(200);
    });

    it("shouldn't be able to calculate employee's vacation, if 'employee_id' parameter aren't correct", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Third Boss",
            password: "9988"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "9988"
        });

        const { token } = sign.body;

        await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Third Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2024"

        }).set({
            authorization: `Bearer ${token}`
        });

        const fakeId = "20611e33-469b-4cb5-a88b-51adacd9f070";

        const calcVacation = await request(app).post("/calculateVacation").query({
            employee_id: fakeId

        }).set({
            authorization: `Bearer ${token}`
        }) 

        expect(calcVacation.body).toStrictEqual({ message: "Employee Not Found !" });
        expect(calcVacation.status).toBe(404);
    });

    it("shouldn't be able to calculate employee's vacation, if the same employee are trying to do it for the second time", async () => {

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
            employeeName: "Fourth Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2022"

        }).set({
            authorization: `Bearer ${token}`
        });

        await request(app).post("/calculateVacation").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        })
        
        const secondCallTocalcVacation = await request(app).post("/calculateVacation").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${token}`
        }) 

        expect(secondCallTocalcVacation.body).toStrictEqual({ message: "You can only calculate 1 vacation for each employee !" });
        expect(secondCallTocalcVacation.status).toBe(401);
    });

    it("shouldn't be able to calculate employee's vacation, if 'token' parameter isn't valid", async () => {

        const boss = await request(app).post("/createBoss").send({
            name: "Fifth Boss",
            password: "4565"
        });

        const sign = await request(app).post("/createToken").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            name: boss.body.boss.name,
            password: "4565"
        });

        const { token } = sign.body;

        const employee = await request(app).post("/createEmployee").query({
            boss_id: boss.body.boss.boss_id

        }).send({
            employeeName: "Fifth Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2022"

        }).set({
            authorization: `Bearer ${token}`
        });
        
        const fakeToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        const calcVacation = await request(app).post("/calculateVacation").query({
            employee_id: employee.body.employee.employee_id

        }).set({
            authorization: `Bearer ${fakeToken}`
        }) 

        expect(calcVacation.body).toStrictEqual({ message: "Invalid Token !" });
        expect(calcVacation.status).toBe(401);
    });

});