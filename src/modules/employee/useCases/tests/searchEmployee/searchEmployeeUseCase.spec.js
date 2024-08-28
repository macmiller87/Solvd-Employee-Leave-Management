import { InMemoryBossRepository } from "../../../../boss/repository/in-memory/in-memory-bossRepository";
import { InmemoryEmployeeRepository } from "../../../repository/in-memory/in-memory-employeeRepository";
import postgresSql from "../../../../../database/service/postgService";
import { AppError } from "../../../../../error/appError";

const inMemoryBossRepository = new InMemoryBossRepository();
const inmemoryEmployeeRepository = new InmemoryEmployeeRepository();

describe("Search Employee (Unit Test)", () => {

    beforeAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    afterAll(async () => {
        await postgresSql`DELETE FROM boss`;
    });

    it("should be able to searching a employee", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "First Boss",
            password: "2998"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "2998"
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

        const search =  await inmemoryEmployeeRepository.searchEmployee({
            employee_id: employee.employee_id,
            token: token
        });

        expect(search).toHaveProperty("employee_id");
        expect(search.employeeName).toBe("First Employee");
        expect(search.baseSalary).toEqual(2800.55);
        expect(search).toHaveProperty("startDate");
        expect(search).toHaveProperty("created_at");
    });

    it("shouldn't be able to searching a employee, if 'employee_id' parameter isn't correct", async () => {

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
            inmemoryEmployeeRepository.searchEmployee({
                employee_id: fakeId,
                token: token
            })

        ).rejects.toEqual(new AppError("Employee Not Found !", 404));

    });

    it("shouldn't be able to searching a employee, if 'token' parameter isn't valid", async () => {

        const boss = await inMemoryBossRepository.createBoss({
            name: "Third  Boss",
            password: "2364"
        });

        const sign = await inMemoryBossRepository.createToken({
            boss_id: boss.boss_id,
            name: boss.name,
            password: "2364"
        })

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
            inmemoryEmployeeRepository.searchEmployee({
                employee_id: employee.employee_id,
                token: fakeToken
            })
        ).rejects.toEqual(new AppError("Invalid Token !", 401));
        
    });

});