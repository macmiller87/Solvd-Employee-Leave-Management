import postgresSql from "../../../database/service/postgService.js";
import { randomUUID } from "node:crypto";

export class EmployeeRepository  {

    async createEmployee(datas) {
        const userId = randomUUID();
        const { boss_id, employeeName, jobTitle, baseSalary, startDate } = datas;

        const splitDate = startDate.split("/");

        const arrDate = [];

        for(let index = 0; index < splitDate.length; index++) {
            
            if(index === 0) {
                arrDate.push(Math.abs(splitDate[index]).toString());
            }else if(index === 1) {
                arrDate.push(Math.abs(splitDate[index]).toString());
            }else {
                arrDate.push(Math.abs(splitDate[index]).toString());
            }

        }

        const aux = arrDate.toString();

        const joinDate = aux.split(",").join("/");

        const date = new Date(joinDate);

        const dateOptions =  {
            month: "numeric",
            day: "numeric",
            year: "numeric"
        }
        
        const normalizeDate = date.toLocaleDateString(process.env.LOCALE, dateOptions);

        const insert = await postgresSql`INSERT INTO employee(boss_id, employee_id, employeename, jobtitle, basesalary, startdate) VALUES(${boss_id}, ${userId}, ${employeeName}, ${jobTitle}, ${baseSalary}, ${normalizeDate}) RETURNING *`;

        return insert;
    }

    async findEmployeeByName(employeeName) {
        const find = await postgresSql`SELECT employeename FROM employee WHERE employeename = ${employeeName}`;
        
        const queryResult = find.count === 1 ? true : false;
        return queryResult;
    }

    async findEmployeeById(employee_id) {
        const find = await postgresSql`SELECT employee_id FROM employee WHERE employee_id = ${employee_id}`;
        
        const queryResult = find.count === 1 ? true : false;
        return queryResult;
    }

    async findAllEmployeeInformationsById(employee_id) {
        const find = await postgresSql`SELECT * FROM employee WHERE employee_id = ${employee_id}`;
        
        const queryResult = find.count === 1 ? find : false;
        return queryResult;
    }

    async getEmployee(employee_id) {
        const find = await postgresSql`SELECT * FROM employee WHERE employee_id = ${employee_id}`;
        
        const queryResult = find.count === 1 ? find : false;
        return queryResult;
    }

    async deletEmployee(employee_id) {
        await postgresSql`DELETE FROM employee WHERE employee_id = ${employee_id}`;
    }
    
}