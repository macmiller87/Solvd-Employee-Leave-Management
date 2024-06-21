import postgresSql from "../../../database/service/postgService.js";
import { randomUUID } from "node:crypto";

export class VacationRepository {

    async insert(datas) {
        const vacationId = randomUUID();
        const { employee_id, employeeName, employeeJobTitle, qttyPaidVacation, qttyDaysOnVacation, valueToRecieve, timeWorkedAmount } = datas;

        const insert = await postgresSql`INSERT INTO vacation(vacation_id, employee_id, employee_name, employee_jobtitle, qtty_paid_vacation, qtty_days_on_vacation, value_to_recieve, time_worked_amount) VALUES(${vacationId}, ${employee_id}, ${employeeName}, ${employeeJobTitle}, ${qttyPaidVacation}, ${qttyDaysOnVacation}, ${valueToRecieve}, ${timeWorkedAmount}) RETURNING *`;

        return insert;
    }
    
    async findEmployeeByName(employeeName) {
        const find = await postgresSql`SELECT employee_name FROM vacation WHERE employee_name = ${employeeName}`;
        
        const queryResult = find.count === 1 ? true : false;
        return queryResult;
    }

    async findVacationById(vacation_id) {
        const find = await postgresSql`SELECT vacation_id FROM vacation WHERE vacation_id = ${vacation_id}`;
        
        const queryResult = find.count === 1 ? true : false;
        return queryResult;
    }

    async getVacation(vacation_id) {
        const find = await postgresSql`SELECT * FROM vacation WHERE vacation_id = ${vacation_id}`;
        
        const queryResult = find.count === 1 ? find : false;
        return queryResult;
    }

}