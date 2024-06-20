import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { EmployeeRepository } from "../repository/employeeRepository.js";
import { Router } from "express";

export const deleteEmployeeRouter = Router();

const employeeRepository = new EmployeeRepository();

deleteEmployeeRouter.delete("/deleteEmployee", async (request, response) => {

    const { employee_id } = request.query;

    const findEmployeeById = await employeeRepository.findEmployeeById(employee_id);

    if(findEmployeeById === false) {
        return response.status(404).json({ message: "Employee Not Found !" });
    }

    const checkAuth = await EnsureUserAuthenticate(request, response);

    if(checkAuth === true) {

        await employeeRepository.deletEmployee(employee_id);

        return response.status(200).json({ message: "Employee deleted with success !" });
    }
    
});