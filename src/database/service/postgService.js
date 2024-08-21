import postgres from 'postgres'; 

const setHost = process.env.POSTGRES_HOST_DOCKER;

const postgresSql = postgres({
    host: setHost,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE_DOCKER,
    username: process.env.POSTGRES_USER_DOCKER,
    password: process.env.POSTGRES_PASSWORD_DOCKER
});

export default postgresSql;