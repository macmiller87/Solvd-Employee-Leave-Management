import { EnsureUserAuthenticate } from "../../../../auth/in-memory/in-memory-ensureBossAuthenticate";
import { BossRepository } from "../../../boss/repository/bossRepository";
import { EmployeeRepository } from "../employeeRepository";
import { AppError } from "../../../../error/appError";

export class InmemoryEmployeeRepository {

    _bossRepository;
    _employeeRepository;

    constructor(
        bossRepository = new BossRepository(),
        employeeRepository = new EmployeeRepository()
    ) {
        this._bossRepository = bossRepository;
        this._employeeRepository = employeeRepository;
    }

    async createEmployee(datas) {

        if(typeof(datas.employeeName) !== "string" || typeof(datas.jobTitle) !== "string" ||typeof(datas.startDate) !== "string") {
            throw new AppError("The fields, must to be a string !", 405);

        }else if(typeof(datas.baseSalary) !== "number") {
            throw new AppError("The baseSalary field , must to be a number int or float !", 405);

        }else {

            let regexDate = /^\d{2}\/\d{2}\/\d{4}$/;

            if(!regexDate.test(datas.startDate)) {
                throw new AppError("The startDate field  isn't in the rigth format mm/dd/yyyy, please change !", 401);
            }

            const employee = await this._employeeRepository.findEmployeeByName(datas.employeeName);

            if(employee === true) {
                throw new AppError("The employeeName already exists !", 401);
            }

            const boss = await this._bossRepository.findBossById(datas.boss_id);

            if(boss === false) {
                throw new AppError("Boss ID Not Found !", 404);
            }

            const checkAuth = await EnsureUserAuthenticate(datas.token);

            if(checkAuth === true) {

                const createEmployee = await this._employeeRepository.createEmployee({
                    boss_id: datas.boss_id,
                    employeeName: datas.employeeName,
                    jobTitle: datas.jobTitle,
                    baseSalary: datas.baseSalary,
                    startDate: datas.startDate
                });

                const employee = {
                    boss_id: createEmployee[0].boss_id,
                    employee_id: createEmployee[0].employee_id,
                    employeeName: createEmployee[0].employeename,
                    jobTitle: createEmployee[0].jobtitle,
                    baseSalary: createEmployee[0].basesalary,
                    startDate: createEmployee[0].startdate,
                    created_at: createEmployee[0].created_at,
                }
        
                return employee;
            }

        }

    }

    async searchEmployee(datas) {

        const findBossById = await this._employeeRepository.findEmployeeById(datas.employee_id);

        if(findBossById === false) {
            throw new AppError("Employee Not Found !", 404);
        }

        const checkAuth = await EnsureUserAuthenticate(datas.token);

        if(checkAuth === true) {

            const getEmployee = await this._employeeRepository.getEmployee(datas.employee_id);

            const employee = {
                boss_id: getEmployee[0].boss_id,
                employee_id: getEmployee[0].employee_id,
                employeeName: getEmployee[0].employeename,
                jobTitle: getEmployee[0].jobtitle,
                baseSalary: getEmployee[0].basesalary,
                startDate: getEmployee[0].startdate,
                created_at: getEmployee[0].created_at,
            }

            return employee;
        }

    }

    async deleteEmployee(datas) {

        const findEmployeeById = await this._employeeRepository.findEmployeeById(datas.employee_id);

        if(findEmployeeById === false) {
            throw new AppError("Employee Not Found !", 404);
        }

        const checkAuth = await EnsureUserAuthenticate(datas.token);

        if(checkAuth === true) {

            await this._employeeRepository.deletEmployee(datas.employee_id);

            return { message: "Employee deleted with success !" };
        }

    }

}