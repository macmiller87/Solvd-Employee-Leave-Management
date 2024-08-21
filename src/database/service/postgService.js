import postgres from 'postgres'; 

const setHost = process.env.POSTGRES_HOST_LOCAL ?? process.env.POSTGRES_HOST_DOCKER;

const postgresSql = postgres({
    host: setHost,
    port: process.env.POSTGRES_PORT,
    database: setHost === "localhost" ? process.env.POSTGRES_DATABASE_LOCAL : process.env.POSTGRES_DATABASE_DOCKER,
    username: setHost === "localhost" ? process.env.POSTGRES_USER_LOCAL : process.env.POSTGRES_USER_DOCKER,
    password: setHost === "localhost" ? process.env.POSTGRES_PASSWORD_LOCAL : process.env.POSTGRES_PASSWORD_DOCKER
});

export default postgresSql;