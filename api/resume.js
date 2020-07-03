const mysql = require("mysql");
const { DB, Response } = require("node-backend-utils/lib");
const { DBConfig } = require("../utils/constants");

async function list(event, context) {
  const sql = `
    SELECT * FROM experience;
  `;

  const db = DB.getConnection(DBConfig);
  let response;
  try {
    const data = await DB.query(db, sql);
    console.log(data);
    response = Response.withPayload(200, data);
  } catch (e) {
    response = Response.basic(500, "Failed database query");
  } finally {
    db.destroy();
  }

  return response;
}

async function create(event, context) {
  const { body } = event;
  const params = JSON.parse(body);

  const sql = `
    INSERT INTO EXPERIENCE (
      name, 
      datestring,
      description,
      tags
    ) VALUES (
      ${mysql.escape(params.name)},
      ${mysql.escape(params.datestring)},
      ${mysql.escape(params.description)},
      ${mysql.escape(params.tags)}
    );
  `;

  const db = DB.getConnection(DBConfig);
  let response;
  try {
    await DB.query(db, sql);
    response = Response.basic(201, "Resume item successfully created");
  } catch (e) {
    response = Response.basic(500, "Failed database query");
  } finally {
    db.destroy();
  }

  return response;
}

async function update(event, context) {}

async function destroy(event, context) {}

module.exports = {
  list,
  create,
  update,
  destroy,
};
