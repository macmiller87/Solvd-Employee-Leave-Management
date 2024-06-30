import { app } from "./app.js";

const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOST;

app.listen(port, console.log(`Server is running at ${host}:${port}`));