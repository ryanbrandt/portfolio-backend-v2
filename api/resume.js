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
      tags,
      accomplishments
    ) VALUES (
      ${mysql.escape(params.name)},
      ${mysql.escape(params.datestring)},
      ${mysql.escape(params.description)},
      ${mysql.escape(params.tags)},
      ${mysql.escape(params.accomplishments)}
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

async function update(event, context) {
  const { pathParameters, body } = event;
  const { resumeId } = pathParameters;
  const params = JSON.parse(body);

  const sql = `
    UPDATE experience
    SET 
      name = ${mysql.escape(params.name)},
      datestring = ${mysql.escape(params.datestring)},
      description = ${mysql.escape(params.description)},
      tags = ${mysql.escape(params.tags)},
      accomplishments = ${mysql.escape(params.accomplishments)}
    WHERE id = ${resumeId};
  `;

  const db = DB.getConnection(DBConfig);
  let response;
  try {
    await DB.query(db, sql);
    response = Response.basic(204, "Item successfully updated");
  } catch (e) {
    response = Response.simple(500, "Failed to update item");
  } finally {
    db.destroy();
  }

  return response;
}

async function destroy(event, context) {
  const { pathParameters } = event;
  const { resumeId } = pathParameters;

  const sql = `
    DELETE FROM experience WHERE id = ${resumeId};
  `;

  try {
    await DB.query(db, sql);
    response = Response.basic(204, "Item successfully deleted");
  } catch (e) {
    response = Response.basic(500, "Failed to delete item");
  } finally {
    db.destroy();
  }

  return response;
}

module.exports = {
  list,
  create,
  update,
  destroy,
};
