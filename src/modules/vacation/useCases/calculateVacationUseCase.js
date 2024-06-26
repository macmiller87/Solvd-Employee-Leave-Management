import { EmployeeRepository } from "../../employee/repository/employeeRepository.js"
import { VacationRepository } from "../repository/vacationRepository.js";
import { EnsureUserAuthenticate } from "../../../auth/EnsureBossAuthenticate.js";
import { AppError } from "../../../error/appError.js";
import { Router } from "express";

export const calculteEmployeeVacationRoute = Router();

const employeeRepository = new EmployeeRepository();
const vacationRepository = new VacationRepository();

calculteEmployeeVacationRoute.post("/calculateVacation", async (request, response) => {

    const { employee_id } = request.query;

    const findEmployeeById = await employeeRepository.findEmployeeById(employee_id);
    const searchEmployee = await employeeRepository.findAllEmployeeInformationsById(employee_id);

    if(findEmployeeById === false || searchEmployee === false) {
        throw new AppError("Employee Not Found !", 404);
    }

    const checkEmployeeName = await vacationRepository.findEmployeeByName(searchEmployee[0].employeename);

    if(checkEmployeeName === true) {
        throw new AppError("You can only calculate 1 vacation for each employee !", 401);
    }

    const checkAuth = await EnsureUserAuthenticate(request, response);

    if(checkAuth === true) {

        const presentDay = parseInt(new Date().getUTCDate());
        const presentMonth = parseInt(new Date().getUTCMonth()) + 1;
        const presentYear = parseInt(new Date().getUTCFullYear());

        const employeeBaseSalary = searchEmployee[0].basesalary;
        const employeeStarteDate = searchEmployee[0].startdate.split("/");

        let day = 0;
        let month = 0;
        let year = 0;

        for(let index = 0; index < employeeStarteDate.length; index++) {
            
            if(index === 0) {
                month = parseInt(employeeStarteDate[index]);
            }else if(index === 1) {
                day = parseInt(employeeStarteDate[index]);
            }else {
                year = parseInt(employeeStarteDate[index]);
            }

        }

        const checkAndCalcMonth = presentMonth > month ? presentMonth - month : month - presentMonth;
        const checkAndCalcDays = presentDay > day ? presentDay - day : day - presentDay;
        const checkAndCalcYears = presentYear > year ? presentYear - year : year - presentYear;

        if(checkAndCalcYears >= 1) {

            const qttyStandardVacationDays = 30;
            const qttyVacationStandardPaid = 1;
            
            const timeWorkedAmount = `Working time: ${checkAndCalcMonth} months, ${checkAndCalcDays} days, and ${checkAndCalcYears} year (s) ..`;

            const calcPercentVacation = employeeBaseSalary / 3;
            const vacationValue = employeeBaseSalary + calcPercentVacation;

            const createVacation = await vacationRepository.insert({
                employee_id,
                employeeName: searchEmployee[0].employeename,
                employeeJobTitle: searchEmployee[0].jobtitle,
                qttyPaidVacation: qttyVacationStandardPaid,
                qttyDaysOnVacation: qttyStandardVacationDays,
                valueToRecieve: vacationValue.toFixed(2),
                timeWorkedAmount: timeWorkedAmount
            });

            return response.status(201).json({
                employee: {
                    boss_id: searchEmployee[0].boss_id,
                    employee_id: searchEmployee[0].employee_id,
                    jobTitle: searchEmployee[0].jobtitle,
                    baseSalary: searchEmployee[0].basesalary,
                    startDate: searchEmployee[0].startdate,
                    createdAt: searchEmployee[0].createdAt,
                    vacation: [createVacation]
                }
            });

        }else {

            const qttyStandardVacationDays = 0;
            const qttyVacationStandardPaid = 0;

            const timeWorkedAmount = `Working time: ${checkAndCalcMonth} months, ${checkAndCalcDays} days, and ${checkAndCalcYears} years ..`;

            const createVacation = await vacationRepository.insert({
                employee_id,
                employeeName: searchEmployee[0].employeename,
                employeeJobTitle: searchEmployee[0].jobtitle,
                qttyPaidVacation: qttyVacationStandardPaid,
                qttyDaysOnVacation: qttyStandardVacationDays,
                valueToRecieve: 0,
                timeWorkedAmount: timeWorkedAmount
            });

            return response.status(201).json({
                employee: {
                    boss_id: searchEmployee[0].boss_id,
                    employee_id: searchEmployee[0].employee_id,
                    jobTitle: searchEmployee[0].jobtitle,
                    baseSalary: searchEmployee[0].basesalary,
                    startDate: searchEmployee[0].startdate,
                    createdAt: searchEmployee[0].createdAt,
                    vacation: [createVacation]
                }
            });
            
        }

    }

});