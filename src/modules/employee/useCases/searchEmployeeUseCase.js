import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { EmployeeRepository } from "../repository/employeeRepository.js";
import { AppError } from "../../../error/appError.js";

const employeeRepository = new EmployeeRepository();

export class SearchEmployee {

    async execute(request, response) {

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
                    employeeName: getEmployee[0].employeename,
                    jobTitle: getEmployee[0].jobtitle,
                    baseSalary: getEmployee[0].basesalary,
                    startDate: getEmployee[0].startdate,
                    created_at: getEmployee[0].created_at,
                }
            });
            
        }

    }

}