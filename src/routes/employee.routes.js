import { createEmployeeRouter } from "../modules/employee/useCases/createEmployeeUseCase.js";
import { searchEmployeeRouter } from "../modules/employee/useCases/searchEmployeeUseCase.js";
import { deleteEmployeeRouter } from "../modules/employee/useCases/deleteEmployeeUseCase.js";
import { Router } from "express";

export const employeeRoutes = Router();

employeeRoutes.use(createEmployeeRouter);
employeeRoutes.use(searchEmployeeRouter);
employeeRoutes.use(deleteEmployeeRouter);