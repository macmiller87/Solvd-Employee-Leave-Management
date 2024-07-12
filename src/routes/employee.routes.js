import { CreateEmployee } from "../modules/employee/useCases/createEmployeeUseCase.js";
import { SearchEmployee } from "../modules/employee/useCases/searchEmployeeUseCase.js";
import { DeleteEmployee } from "../modules/employee/useCases/deleteEmployeeUseCase.js";
import { Router } from "express";

export const employeeRoutes = Router();

const createEmployeeRouter = new CreateEmployee();
const searchEmployeeRouter = new SearchEmployee();
const deleteEmployeeRouter = new DeleteEmployee();

employeeRoutes.post("/createEmployee", createEmployeeRouter.execute);
employeeRoutes.get("/searchEmployee", searchEmployeeRouter.execute);
employeeRoutes.delete("/deleteEmployee", deleteEmployeeRouter.execute);