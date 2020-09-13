const mysql = require("mysql");
const { DB, Response } = require("node-backend-utils/lib");

const { DBConfig } = require("../utils/constants");

async function list(event, context) {
  const sql = `
    SELECT * FROM work;
  `;

  const db = DB.getConnection(DBConfig);
  let response;
  try {
    const data = await DB.query(db, sql);
    const parsedData = data.map((item) => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    }));
    response = Response.withPayload(200, parsedData);
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
    INSERT INTO work (
      name,
      datestring,
      description,
      tags,
      icons,
      image
    ) VALUES (
      ${mysql.escape(params.name)},
      ${mysql.escape(params.datestring)},
      ${mysql.escape(params.description)},
      ${mysql.escape(params.tags)},
      ${mysql.escape(params.icons)},
      ${mysql.escape(params.image)}
    );
  `;

  const db = DB.getConnection(DBConfig);
  let response;
  try {
    await DB.query(db, sql);
    response = Response.basic(201, "Work item successfully created");
  } catch (e) {
    response = Response.basic(500, "Failed database query");
  } finally {
    db.destroy();
  }

  return response;
}

async function update(event, context) {
  const { pathParameters, body } = event;
  const { workId } = pathParameters;
  const params = JSON.parse(body);

  const sql = `
    UPDATE work 
    SET
      name = ${mysql.escape(params.name)},
      datestring = ${mysql.escape(params.datestring)},
      description = ${mysql.escape(params.description)},
      tags = ${mysql.escape(params.tags)},
      icons = ${mysql.escape(params.icons)},
      image = ${mysql.escape(params.image)}
    WHERE id = ${mysql.escape(workId)};
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
  const { pathParameters, body } = event;
  const { workId } = pathParameters;

  const sql = `
    DELETE FROM work WHERE id = ${mysql.escape(workId)};
  `;

  const db = DB.getConnection(DBConfig);
  let response;
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
