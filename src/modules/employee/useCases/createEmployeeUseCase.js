import { EmployeeRepository  } from "../repository/employeeRepository.js";
import { BossRepository } from "../../boss/repository/bossRepository.js";
import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { AppError } from "../../../error/appError.js";
import { Router } from "express";

export const createEmployeeRouter = Router();

const bossRepository = new BossRepository();
const employeeRepository = new EmployeeRepository();

createEmployeeRouter.post("/createEmployee", async (request, response) => {

    const { boss_id } = request.query;
    const { employeeName, jobTitle, baseSalary, startDate } = request.body;

    if(employeeName === "" || jobTitle === "" || baseSalary === "" || startDate === "") {
        throw new AppError("Null Data is Not Allowed, Please fill in All Datas !", 400);

    }else if(typeof(employeeName) !== "string" ||  typeof(jobTitle) !== "string" ||typeof(startDate) !== "string") {
        throw new AppError("The fields, must to be a string !", 405);

    }else if(typeof(baseSalary) !== "number") {
        throw new AppError("The baseSalary field , must to be a number int or float !", 405);

    }else {

        const employee = await employeeRepository.findEmployeeByName(employeeName);

        if(employee === true) {
            throw new AppError("The employeeName already exists !", 401);
        }

        const boss = await bossRepository.findBossById(boss_id);

        if(boss === false) {
            throw new AppError("Boss ID Not Found !", 404);
        }

        const checkAuth = await EnsureUserAuthenticate(request, response);

        if(checkAuth === true) {

            const createEmployee = await employeeRepository.createEmployee({
                boss_id,
                employeeName,
                jobTitle,
                baseSalary,
                startDate
            });
    
            return response.status(201).json({
                employee: {
                    boss_id: createEmployee[0].boss_id,
                    employee_id: createEmployee[0].employee_id,
                    employeeName: createEmployee[0].employeename,
                    jobTitle: createEmployee[0].jobtitle,
                    baseSalary: createEmployee[0].basesalary,
                    startDate: createEmployee[0].startdate,
                    createdAt: createEmployee[0].createdAt,
                }
            });
        }
    }

});

