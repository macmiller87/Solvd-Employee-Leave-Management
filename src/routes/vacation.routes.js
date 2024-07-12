import { CalculteEmployeeVacation } from "../modules/vacation/useCases/calculateVacationUseCase.js";
import { SearchVacation } from "../modules/vacation/useCases/searchVacationUseCase.js";
import { DeleteVacation } from "../modules/vacation/useCases/deleteVacationUseCase.js";
import { Router } from "express";

export const vacationRoutes = Router();

const calculteEmployeeVacationRoute = new CalculteEmployeeVacation();
const searchVacationRoute = new SearchVacation();
const deleteVacationRoute = new DeleteVacation();

vacationRoutes.post("/calculateVacation", calculteEmployeeVacationRoute.execute);
vacationRoutes.get("/searchVacation", searchVacationRoute.execute);
vacationRoutes.delete("/deleteVacation", deleteVacationRoute.execute);