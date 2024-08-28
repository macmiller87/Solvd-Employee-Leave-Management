import { InMemoryBossRepository } from "../../../../boss/repository/in-memory/in-memory-bossRepository.js";
import { InmemoryEmployeeRepository } from "../../../repository/in-memory/in-memory-employeeRepository.js";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError.js";

const inMemoryBossRepository = new InMemoryBossRepository();
const inmemoryEmployeeRepository = new InmemoryEmployeeRepository();

describe("Create Employee (Unit Test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to create a employee", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "8899"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "8899"
        });

        const { token } = sign;

        const employee = await inmemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "First Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023",
            token: token
        });

        expect(employee).toHaveProperty("employee_id");
        expect(employee.employeeName).toBe("First Employee");
        expect(employee.baseSalary).toEqual(2800.55);
        expect(employee).toHaveProperty("created_at");
    });

    it("shouldn't be able to create a employee, if the type of the parameters isn't a string", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Second Boss",
            password: "2233"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "2233"
        });

        const { token } = sign;

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: boss.boss_id,
                employeeName: 184365,
                jobTitle: "BackEnd developer",
                baseSalary: 2800.55,
                startDate: "04/07/2023",
                token: token
            })

        ).rejects.toEqual(new AppError("The fields, must to be a string !", 405));

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: boss.boss_id,
                employeeName: "Second Employee",
                jobTitle: 826586,
                baseSalary: 2800.55,
                startDate: "04/07/2023",
                token: token
            })

        ).rejects.toEqual(new AppError("The fields, must to be a string !", 405));

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: boss.boss_id,
                employeeName: "Second Employee",
                jobTitle: "BackEnd developer",
                baseSalary: 2800.55,
                startDate: 4072023,
                token: token
            })

        ).rejects.toEqual(new AppError("The fields, must to be a string !", 405));

    });

    it("shouldn't be able to create a employee, if 'baseSalary' parameter aren't a number", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Third Boss",
            password: "4499"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "4499"
        });

        const { token } = sign;

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: boss.boss_id,
                employeeName: "Third Employee",
                jobTitle: "developer",
                baseSalary: "2800.55",
                startDate: "04/07/2023",
                token: token
            })

        ).rejects.toEqual(new AppError("The baseSalary field , must to be a number int or float !", 405));

    });

    it("shouldn't be able to create a employee, if 'startDate' parameter are different of US standard format mm/dd/yyyy", async () => {

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

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: boss.boss_id,
                employeeName: "Third Employee",
                jobTitle: "QA",
                baseSalary: 2800.55,
                startDate: "04-07-2023",
                token: token
            })

        ).rejects.toEqual(new AppError("The startDate field  isn't in the rigth format mm/dd/yyyy, please change !", 401));

    });

    it("shouldn't be able to create a employee, with the same name", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Fifth  Boss",
            password: "9944"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "9944"
        });

        const { token } = sign;

        await inmemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Fifth Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023",
            token: token
        });

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: boss.boss_id,
                employeeName: "Fifth Employee",
                jobTitle: "FrontEnd developer",
                baseSalary: 2400.55,
                startDate: "08/08/2023",
                token: token
            })

        ).rejects.toEqual(new AppError("The employeeName already exists !", 401));

    });

    it("shouldn't be able to create a employee, if 'boss_id' parameter aren't correct", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Sixth  Boss",
            password: "4664"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "4664"
        });

        const { token } = sign;

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: fakeId,
                employeeName: "Fourth Employee",
                jobTitle: "BackEnd developer",
                baseSalary: 2800.55,
                startDate: "04/07/2023",
                token: token
            })

        ).rejects.toEqual(new AppError("Boss ID Not Found !", 404));

    });

    it("shouldn't be able to create a employee, if 'token' parameter isn't valid", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Seventh  Boss",
            password: "6633"
        });

        await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "6633"
        });

        const fakeToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        await expect(
            inmemoryEmployeeRepository.createEmployee({
                boss_id: boss.boss_id,
                employeeName: "Fourth Employee",
                jobTitle: "BackEnd developer",
                baseSalary: 2800.55,
                startDate: "04/07/2023",
                token: fakeToken
            })

        ).rejects.toEqual(new AppError("Invalid Token !", 401));

    });

});