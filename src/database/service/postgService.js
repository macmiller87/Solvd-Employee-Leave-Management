import postgres from 'postgres'; 

const postgresSql = postgres({
    host: process.env.POSTGRES_HOST ?? process.env.PGHOST_DEPLOY,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE ?? process.env.PGDATABASE_DEPLOY,
    username: process.env.POSTGRES_USER ?? process.env.PGUSER_DEPLOY,
    ssl: "require"
});

async function getPostgresVersion() {

    const result = await postgresSql `SELECT VERSION()`;
    console.log(result);
}
  
getPostgresVersion();

export default postgresSql;