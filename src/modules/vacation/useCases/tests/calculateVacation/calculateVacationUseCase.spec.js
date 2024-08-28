import { InMemoryBossRepository } from "../../../../boss/repository/in-memory/in-memory-bossRepository.js";
import { InmemoryEmployeeRepository } from "../../../../employee/repository/in-memory/in-memory-employeeRepository.js";
import { InMemoryVacationRepository } from "../../../repository/in-memory/in-memory-vacationRepository";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError.js";

const inMemoryBossRepository = new InMemoryBossRepository();
const inMemoryEmployeeRepository = new InmemoryEmployeeRepository();
const inMemoryVacationRepository = new InMemoryVacationRepository();

describe("Calculate Vacation (Unit Test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to calculate an employee's vacation, if he have one or more years of work", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "8822"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "8822"
        });

        const { token } = sign;

        const employee = await inMemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "First Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "07/26/2023",
            token: token
        });

        const calcVacation = await inMemoryVacationRepository.calculateVacation({
            employee_id: employee.employee_id,
            token: token
        });

        expect(calcVacation).toHaveProperty("boss_id");
        expect(calcVacation).toHaveProperty("employee_id");
        expect(calcVacation.employeeName).toEqual("First Employee");
        expect(calcVacation.jobTitle).toEqual("BackEnd developer");
        expect(calcVacation.baseSalary).toEqual(3100.80);
        expect(calcVacation.startDate).toEqual("7/26/2023");
        expect(calcVacation).toHaveProperty("created_at");
        expect(calcVacation.vacation[0]).toHaveProperty("vacation_id");
        expect(calcVacation.vacation[0]).toHaveProperty("employee_id");
        expect(calcVacation.vacation[0].employee_name).toEqual("First Employee");
        expect(calcVacation.vacation[0].employee_jobtitle).toEqual("BackEnd developer");
        expect(calcVacation.vacation[0].qtty_paid_vacation).toEqual(1);
        expect(calcVacation.vacation[0].qtty_days_on_vacation).toEqual(30);
        expect(calcVacation.vacation[0]).toHaveProperty("value_to_recieve");
        expect(calcVacation.vacation[0]).toHaveProperty("time_worked_amount");
        expect(calcVacation.vacation[0]).toHaveProperty("created_at");
    });

    it("should be able to send informations trought renponse about employee's vacation, if he have less than one year of work", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Second Boss",
            password: "2398"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "2398"
        });
        
        const { token } = sign;

        const employee = await inMemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Second Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2024",
            token: token
        });

        const calcVacation = await inMemoryVacationRepository.calculateVacation({
            employee_id: employee.employee_id,
            token: token
        });

        expect(calcVacation.info).toStrictEqual({ message: "You don't have enough company time to take and calculate vacations !" });
        expect(calcVacation.employee).toHaveProperty("boss_id");
        expect(calcVacation.employee).toHaveProperty("employee_id");
        expect(calcVacation.employee.employeeName).toEqual("Second Employee");
        expect(calcVacation.employee.jobTitle).toEqual("BackEnd developer");
        expect(calcVacation.employee.baseSalary).toEqual(3100.80);
        expect(calcVacation.employee.startDate).toEqual("1/26/2024");
        expect(calcVacation.employee).toHaveProperty("created_at");
        expect(calcVacation.vacation.qttyPaidVacation).toEqual(0);
        expect(calcVacation.vacation.qttyDaysOnVacation).toEqual(0);
        expect(calcVacation.vacation.valueToRecieve).toEqual(0);
        expect(calcVacation.vacation).toHaveProperty("timeWorkedAmount");
    });

    it("shouldn't be able to calculate employee's vacation, if 'employee_id' parameter aren't correct", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Third Boss",
            password: "9988"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "9988"
        });

        const { token } = sign;

        await inMemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Third Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2024",
            token: token
        });

        const fakeId = "20611e33-469b-4cb5-a88b-51adacd9f070";

        await expect(
            inMemoryVacationRepository.calculateVacation({
                employee_id: fakeId,
                token: token
            })
            
        ).rejects.toEqual(new AppError("Employee Not Found !", 404));

    });

    it("shouldn't be able to calculate employee's vacation, if the same employee are trying to do it for the second time", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Fourth Boss",
            password: "1122"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "1122"
        });

        const { token } = sign;

        const employee = await inMemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Fourth Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2022",
            token: token
        });

        await inMemoryVacationRepository.calculateVacation({
            employee_id: employee.employee_id,
            token: token
        });
        
        await expect(
            inMemoryVacationRepository.calculateVacation({
                employee_id: employee.employee_id,
                token: token
            })
            
        ).rejects.toEqual(new AppError("You can only calculate 1 vacation for each employee !", 401));

    });

    it("shouldn't be able to calculate employee's vacation, if 'token' parameter isn't valid", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Fifth Boss",
            password: "4565"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "4565"
        });

        const { token } = sign;

        const employee = await inMemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Fifth Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "01/26/2022",
            token: token
        });
        
        const fakeToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        await expect(
            inMemoryVacationRepository.calculateVacation({
                employee_id: employee.employee_id,
                token: fakeToken
            })

        ).rejects.toEqual(new AppError("Invalid Token !", 401));

    });

});