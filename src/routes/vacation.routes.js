import { calculteEmployeeVacationRoute } from "../modules/vacation/useCases/calculateVacationUseCase.js";
import { searchVacationRoute } from "../modules/vacation/useCases/searchVacationUseCase.js";
import { deleteVacationRoute } from "../modules/vacation/useCases/deleteVacationUseCase.js";
import { Router } from "express";

export const vacationRoutes = Router();

vacationRoutes.use(calculteEmployeeVacationRoute);
vacationRoutes.use(searchVacationRoute);
vacationRoutes.use(deleteVacationRoute);