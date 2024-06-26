import { VacationRepository } from "../repository/vacationRepository.js";
import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { AppError } from "../../../error/appError.js";
import { Router } from "express";

export const deleteVacationRoute = Router();

const vacationRepository = new VacationRepository();

deleteVacationRoute.delete("/deleteVacation", async (request, response) => {

    const { vacation_id } =  request.query;

    const findVacationById = await vacationRepository.findVacationById(vacation_id);

    if(findVacationById === false) {
        throw new AppError("Vacation not found !", 404);
    }

    const checkAuth = await EnsureUserAuthenticate(request, response);

    if(checkAuth === true) {

        await vacationRepository.deleteVacation(vacation_id);

        return response.status(200).json({ message: "Vacation deleted with success !" });
    }

});