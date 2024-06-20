import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { EmployeeRepository } from "../repository/employeeRepository.js";
import { AppError } from "../../../error/appError.js";
import { Router } from "express";

export const searchEmployeeRouter = Router();

const employeeRepository = new EmployeeRepository();

searchEmployeeRouter.get("/searchEmployee", async (request, response) => {

    const { employee_id } = request.query;

    const findBossById = await employeeRepository.findEmployeeById(employee_id);

    if(findBossById === false) {
        throw new AppError("Employee Not Found !", 404);
    }

    const checkAuth = await EnsureUserAuthenticate(request, response);

    if(checkAuth === true) {

        const getEmployee = await employeeRepository.getEmployee(employee_id);

        return response.status(200).json({
            employee: {
                boss_id: getEmployee[0].boss_id,
                employee_id: getEmployee[0].employee_id,
                jobTitle: getEmployee[0].jobtitle,
                baseSalary: getEmployee[0].basesalary,
                startDate: getEmployee[0].startdate,
                createdAt: getEmployee[0].createdAt,
            }
        });
    }

});