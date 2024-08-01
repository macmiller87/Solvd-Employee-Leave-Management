import { InMemoryBossRepository } from "../../../../boss/repository/in-memory/in-memory-bossRepository";
import { InmemoryEmployeeRepository } from "../../../repository/in-memory/in-memory-employeeRepository";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError";

const inMemoryBossRepository = new InMemoryBossRepository();
const inmemoryEmployeeRepository = new InmemoryEmployeeRepository();

describe("Delete Employee (Unit Test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to delete a employee", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "5445"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "5445"
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

        const del = await inmemoryEmployeeRepository.deleteEmployee({
            employee_id: employee.employee_id,
            token: token
        });

        expect(del).toStrictEqual({ message: "Employee deleted with success !" });
    });

    it("shouldn't be able to delete a employee, if 'employee_id' parameter isn't correct", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Second Boss",
            password: "7654"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "7654"
        })

        const { token } = sign;

        await inmemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Second Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023",
            token: token
        });

        const fakeId = "c97d733e-4d92-485c-a8a3-f652a59bc7b2";

        await expect(
            inmemoryEmployeeRepository.deleteEmployee({
                employee_id: fakeId,
                token: token
            })
        
        ).rejects.toEqual(new AppError("Employee Not Found !", 404));

    });

    it("shouldn't be able to delete a employee, if 'token' parameter isn't valid", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Third  Boss",
            password: "2364"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "2364"
        });

        const { token } = sign;

        const employee = await inmemoryEmployeeRepository.createEmployee({
            boss_id: boss.boss_id,
            employeeName: "Third Employee",
            jobTitle: "BackEnd developer",
            baseSalary: 2800.55,
            startDate: "04/07/2023",
            token: token
        });

        const fakeToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";

        await expect(
            inmemoryEmployeeRepository.deleteEmployee({
                employee_id: employee.employee_id,
                token: fakeToken
            })

        ).rejects.toEqual(new AppError("Invalid Token !", 401));

    });

});