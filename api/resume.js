"use strict";

const mysql = require("mysql");
const { DB, Response } = require("node-backend-utils/lib");

const { validateAdmin } = require("../utils/helpers");
const { DBConfig } = require("../utils/constants");

async function list(event, context) {
  const sql = `
    SELECT * FROM experience;
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
  if (!validateAdmin(event)) {
    return Response.basic(401, "Unauthorized");
  }

  const { body } = event;
  const params = JSON.parse(body);

  const sql = `
    INSERT INTO experience (
      name, 
      datestring,
      description,
      achievements,
      tags
    ) VALUES (
      ${mysql.escape(params.name)},
      ${mysql.escape(params.datestring)},
      ${mysql.escape(params.description)},
      ${mysql.escape(params.achievements)},
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

async function update(event, context) {
  if (!validateAdmin(event)) {
    return Response.basic(401, "Unauthorized");
  }

  const { pathParameters, body } = event;
  const { resumeId } = pathParameters;
  const params = JSON.parse(body);

  const sql = `
    UPDATE experience
    SET 
      name = ${mysql.escape(params.name)},
      datestring = ${mysql.escape(params.datestring)},
      description = ${mysql.escape(params.description)},
      achievements = ${mysql.escape(params.achievements)},
      tags = ${mysql.escape(params.tags)},
      modified = CURRENT_TIMESTAMP()
    WHERE id = ${mysql.escape(resumeId)};
  `;

  const db = DB.getConnection(DBConfig);
  let response;
  try {
    await DB.query(db, sql);
    response = Response.basic(204, "Item successfully updated");
  } catch (e) {
    response = Response.basic(500, "Failed to update item");
  } finally {
    db.destroy();
  }

  return response;
}

async function destroy(event, context) {
  if (!validateAdmin(event)) {
    return Response.basic(401, "Unauthorized");
  }

  const { pathParameters } = event;
  const { resumeId } = pathParameters;

  const sql = `
    DELETE FROM experience WHERE id = ${mysql.escape(resumeId)};
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
