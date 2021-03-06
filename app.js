const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();

let database = null;

const initializeDatabaseAndStartServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5001, () => {
      console.log("server is running at http://localhost:5001");
    });
  } catch (error) {
    console.log(`Database Error : ${error.message}`);
    process.exit(1);
  }
};

initializeDatabaseAndStartServer();

app.get("/todos/", async (request, response) => {
  const {
    status = "",
    priority = "",
    search_q = "",
    category = "",
  } = request.query;
  const getTODOSQuery = `
    SELECT
    *
    FROM
     todo
    WHERE todo like '%${search_q}%' and status like '%${status}%' and priority like '%${priority}%' and category like '%${category}%';
    `;

  const getTodosResponse = await database.all(getTODOSQuery);
  response.status(200);
  response.send(getTodosResponse);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
        SELECT
        *
        FROM
         todo
        WHERE todo.id like '${todoId}';    
    `;
  const getTodoResponse = await database.get(getTodoQuery);
  response.status(200);
  response.send(getTodoResponse);
});
