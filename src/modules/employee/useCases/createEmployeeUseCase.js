import { EmployeeRepository  } from "../repository/employeeRepository.js";
import { BossRepository } from "../../boss/repository/bossRepository.js";
import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { Router } from "express";

export const createEmployeeRouter = Router();

const bossRepository = new BossRepository();
const employeeRepository = new EmployeeRepository();

createEmployeeRouter.post("/createEmployee", async (request, response) => {

    const { boss_id } = request.query;
    const { employeeName, jobTitle, baseSalary, startDate } = request.body;

    if(employeeName === "" || jobTitle === "" || baseSalary === "" || startDate === "") {
        return response.status(401).json({ message: "Null Data is Not Allowed, Please fill in All Datas !" });

    }else if(typeof(employeeName) !== "string" ||  typeof(jobTitle) !== "string" ||typeof(startDate) !== "string") {
        return response.status(401).json({ message: "The fields, must to be a string !" });

    }else if(typeof(baseSalary) !== "number") {
        return response.status(401).json({ message: "The baseSalary field , must to be a number int or float !" });

    }else {

        const employee = await employeeRepository.findEmployeeByName(employeeName);

        if(employee === true) {
            return response.status(401).json({ message: "The employeeName already exists !" });
        }

        const boss = await bossRepository.findBossById(boss_id);

        if(boss === false) {
            return response.status(404).json({ message: "Boss ID Not Found !" });
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
                    jobTitle: createEmployee[0].jobtitle,
                    baseSalary: createEmployee[0].basesalary,
                    startDate: createEmployee[0].startdate,
                    createdAt: createEmployee[0].createdAt,
                }
            });
        }
    }

});

