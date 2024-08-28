import { EnsureUserAuthenticate } from "../../../../auth/in-memory/in-memory-ensureBossAuthenticate";
import { EmployeeRepository } from "../../../employee/repository/employeeRepository";
import { VacationRepository } from "../vacationRepository";
import { AppError } from "../../../../error/appError";

export class InMemoryVacationRepository {

    _employeeRepository;
    _vacationRepository;

    constructor(
        employeeRepository = new EmployeeRepository(),
        vacationRepository = new VacationRepository()
    ) {
        this._employeeRepository = employeeRepository;
        this._vacationRepository = vacationRepository;
    }

    async calculateVacation(datas) {

        const findEmployeeById = await this._employeeRepository.findEmployeeById(datas.employee_id);
        const searchEmployee = await this._employeeRepository.findAllEmployeeInformationsById(datas.employee_id);

        if(findEmployeeById === false || searchEmployee === false) {
            throw new AppError("Employee Not Found !", 404);
        }

        const checkEmployeeName = await this._vacationRepository.findEmployeeByName(searchEmployee[0].employeename);

        if(checkEmployeeName === true) {
            throw new AppError("You can only calculate 1 vacation for each employee !", 401);
        }

        const checkAuth = await EnsureUserAuthenticate(datas.token);

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
                
                const timeWorkedAmount = `Time calculated based on today's date .... Working time: ${checkAndCalcMonth} months, ${checkAndCalcDays} days, and ${checkAndCalcYears} year (s) ..`;

                const calcPercentVacation = employeeBaseSalary / 3;
                const vacationValue = employeeBaseSalary + calcPercentVacation;

                const createVacation = await this._vacationRepository.insert({
                    employee_id: datas.employee_id,
                    employeeName: searchEmployee[0].employeename,
                    employeeJobTitle: searchEmployee[0].jobtitle,
                    qttyPaidVacation: qttyVacationStandardPaid,
                    qttyDaysOnVacation: qttyStandardVacationDays,
                    valueToRecieve: vacationValue.toFixed(2),
                    timeWorkedAmount: timeWorkedAmount
                });

                const employee = {
                    boss_id: searchEmployee[0].boss_id,
                    employee_id: searchEmployee[0].employee_id,
                    employeeName: searchEmployee[0].employeename,
                    jobTitle: searchEmployee[0].jobtitle,
                    baseSalary: searchEmployee[0].basesalary,
                    startDate: searchEmployee[0].startdate,
                    created_at: searchEmployee[0].created_at,
                    vacation: createVacation
                }

                return employee;

            }else {

                const qttyStandardVacationDays = 0;
                const qttyVacationStandardPaid = 0;

                const timeWorkedAmount = `Time calculated based on today's date ... Working time: ${checkAndCalcMonth} months, ${checkAndCalcDays} days, and ${checkAndCalcYears} years ..`;

                return {

                    info: {
                        message: `You don't have enough company time to take and calculate vacations !`
                    },

                    employee: {
                        boss_id: searchEmployee[0].boss_id,
                        employee_id: searchEmployee[0].employee_id,
                        employeeName: searchEmployee[0].employeename,
                        jobTitle: searchEmployee[0].jobtitle,
                        baseSalary: searchEmployee[0].basesalary,
                        startDate: searchEmployee[0].startdate,
                        created_at: searchEmployee[0].created_at,
                    },
                    vacation: {
                        qttyPaidVacation: qttyVacationStandardPaid,
                        qttyDaysOnVacation: qttyStandardVacationDays,
                        valueToRecieve: 0,
                        timeWorkedAmount: timeWorkedAmount
                    }
                    
                };
                
            }

        }

    }

    async searchVacation(datas) {

        const findVacationById = await this._vacationRepository.findVacationById(datas.vacation_id);

        if(findVacationById === false) {
            throw new AppError("Vacation not found !", 404);
        }

        const checkAuth = await EnsureUserAuthenticate(datas.token);

        if(checkAuth === true) {

            const getVacation = await this._vacationRepository.getVacation(datas.vacation_id);

            return getVacation;
        }

    }

    async deleteVacation(datas) {

        const findVacationById = await this._vacationRepository.findVacationById(datas.vacation_id);

        if(findVacationById === false) {
            throw new AppError("Vacation not found !", 404);
        }

        const checkAuth = await EnsureUserAuthenticate(datas.token);

        if(checkAuth === true) {

            await this._vacationRepository.deleteVacation(datas.vacation_id);

            return { message: "Vacation deleted with success !" };
        }

    }

}