import postgresSql from "../service/postgService.js";

const createTables = async () => {
       
    await postgresSql`

        CREATE TABLE IF NOT EXISTS "boss" (
            "boss_id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL UNIQUE,
            "password" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

    `.then(() => console.log("boss table  was created !"));

    await postgresSql`

        CREATE TABLE IF NOT EXISTS "bosstoken" (
            "boss_id" TEXT NOT NULL,
            "token_id" TEXT NOT NULL PRIMARY KEY,
            "token" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "bosstoken_boss_id_fkey" FOREIGN KEY("boss_id") REFERENCES "boss"("boss_id") ON DELETE CASCADE ON UPDATE CASCADE
        );

    `.then(() => console.log("bossToken table was created !"));

    await postgresSql`

        CREATE TABLE IF NOT EXISTS "employee" (
            "boss_id" TEXT NOT NULL,
            "employee_id" TEXT NOT NULL PRIMARY KEY,
            "employeename" TEXT NOT NULL UNIQUE,
            "jobtitle" TEXT NOT NULL,
            "basesalary" REAL NOT NULL,
            "startdate" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "employee_boss_id_fkey" FOREIGN KEY("boss_id") REFERENCES "boss"("boss_id") ON DELETE CASCADE ON UPDATE CASCADE
        );

    `.then(() => console.log("employee table was created !"));

    await postgresSql`

        CREATE TABLE IF NOT EXISTS "vacation" (
            "vacation_id" TEXT NOT NULL PRIMARY KEY,
            "employee_id" TEXT NOT NULL,
            "employee_name" TEXT NOT NULL UNIQUE,
            "employee_jobtitle" TEXT NOT NULL,
            "qtty_paid_vacation" INT NOT NULL,
            "qtty_days_on_vacation" INT NOT NULL,
            "value_to_recieve" REAL NOT NULL,
            "time_worked_amount" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "vacation_employee_id_fkey" FOREIGN KEY("employee_id") REFERENCES "employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE
        );

    `.then(() => console.log("vacation table was created !"));

};

const run = async () => {
    await createTables();
    process.exit();
}

run();



