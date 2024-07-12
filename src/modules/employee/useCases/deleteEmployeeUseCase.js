import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { EmployeeRepository } from "../repository/employeeRepository.js";
import { AppError } from "../../../error/appError.js";

const employeeRepository = new EmployeeRepository();

export class DeleteEmployee {

    async execute(request, response) {

        const { employee_id } = request.query;

        const findEmployeeById = await employeeRepository.findEmployeeById(employee_id);

        if(findEmployeeById === false) {
            throw new AppError("Employee Not Found !", 404);
        }

        const checkAuth = await EnsureUserAuthenticate(request, response);

        if(checkAuth === true) {

            await employeeRepository.deletEmployee(employee_id);

            return response.status(200).json({ message: "Employee deleted with success !" });
        }

    }

}