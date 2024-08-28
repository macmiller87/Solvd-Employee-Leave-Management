import { InMemoryBossRepository } from "../../../../boss/repository/in-memory/in-memory-bossRepository";
import { InmemoryEmployeeRepository } from "../../../../employee/repository/in-memory/in-memory-employeeRepository";
import { InMemoryVacationRepository } from "../../../repository/in-memory/in-memory-vacationRepository";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError";

const inMemoryBossRepository = new InMemoryBossRepository();
const inMemoryEmployeeRepository = new InmemoryEmployeeRepository();
const inMemoryVacationRepository = new InMemoryVacationRepository();

describe("Search Vacation (Unit Test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to searching an employee's vacation", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "6644"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
             name: boss.name,
            password: "6644"
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

        const search = await inMemoryVacationRepository.searchVacation({
            vacation_id: calcVacation.vacation[0].vacation_id,
            token: token
        });

        expect(search[0]).toHaveProperty("vacation_id");
        expect(search[0]).toHaveProperty("employee_id");
        expect(search[0].employee_name).toEqual("First Employee");
        expect(search[0].employee_jobtitle).toEqual("BackEnd developer");
        expect(search[0].qtty_paid_vacation).toEqual(1);
        expect(search[0].qtty_days_on_vacation).toEqual(30);
        expect(search[0]).toHaveProperty("value_to_recieve");
        expect(search[0]).toHaveProperty("time_worked_amount");
        expect(search[0]).toHaveProperty("created_at");
    });

    it("shouldn't be able to searching an employee's vacation, if 'vacation_id' parameter aren't correct", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Second Boss",
            password: "4488"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "4488"
        });

        const { token } = sign;

        const employee = await inMemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Second Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "07/26/2023",
            token: token
        });

        await inMemoryVacationRepository.calculateVacation({
            employee_id: employee.employee_id,
            token: token
        });

        const fakeId = "20611e33-469b-4cb5-a88b-51adacd9f070";

        await expect(
            inMemoryVacationRepository.searchVacation({
                vacation_id: fakeId,
                token: token
            })

        ).rejects.toEqual(new AppError("Vacation not found !", 404));

    });

    it("shouldn't be able to searching an employee's vacation, if 'token' parameter isn't valid", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Third Boss",
            password: "1199"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "1199"
        });

        const { token } = sign;

        const employee = await inMemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Third Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 3100.80,
            startDate: "07/26/2023",
            token: token
        });

        const calcVacation = await inMemoryVacationRepository.calculateVacation({
            employee_id: employee.employee_id,
            token: token
        }); 

        const fakeToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        await expect(
            inMemoryVacationRepository.searchVacation({
                vacation_id: calcVacation.vacation[0].vacation_id,
                token: fakeToken
            })

        ).rejects.toEqual(new AppError("Invalid Token !", 401));

    });

});