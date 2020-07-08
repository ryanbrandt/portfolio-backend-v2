const apisauce = require("apisauce");
const mysql = require("mysql");

const { DB } = require("node-backend-utils/lib");

const { DBConfig } = require("../../utils/constants");

describe("Resume endpoint", () => {
  const api = apisauce.create({
    baseURL: "http://localhost:3000",
  });

  const DUMMY_PAYLOAD = {
    name: "jest-resume-item",
    datestring: "July 2020",
    description: "dummy item",
    tags: JSON.stringify(["fake", "tags"]),
  };

  async function getDummyPayloadID() {
    const db = DB.getConnection(DBConfig);

    const sql = `SELECT id FROM experience WHERE name = ${mysql.escape(
      DUMMY_PAYLOAD.name
    )};`;

    const results = await DB.query(db, sql);
    const ID = results[0].id;

    db.destroy();

    return ID;
  }

  test("Lists resume items", async () => {
    const results = await api.get("/resume");

    expect(results.status).toBe(200);
    expect(results.data).toBeDefined();
  });

  test("Creates a new resume item", async () => {
    const results = await api.post("/resume", DUMMY_PAYLOAD);

    expect(results.status).toBe(201);

    const confirmationSql = `SELECT * FROM experience WHERE name = ${mysql.escape(
      DUMMY_PAYLOAD.name
    )};`;

    const db = DB.getConnection(DBConfig);
    const confirmationResults = await DB.query(db, confirmationSql);

    expect(confirmationResults[0].name).toEqual(DUMMY_PAYLOAD.name);
    expect(confirmationResults[0].datestring).toEqual(DUMMY_PAYLOAD.datestring);
    expect(confirmationResults[0].description).toEqual(
      DUMMY_PAYLOAD.description
    );
    expect(confirmationResults[0].tags).toEqual(DUMMY_PAYLOAD.tags);

    db.destroy();
  });

  test("Updates an existing resume item", async () => {
    const modifiedDummyPayload = {
      ...DUMMY_PAYLOAD,
      description: "updated",
    };

    const dummyID = await getDummyPayloadID();
    const results = await api.put(`/resume/${dummyID}`, modifiedDummyPayload);

    expect(results.status).toBe(204);

    const confirmationSql = `SELECT * FROM experience WHERE name = ${mysql.escape(
      DUMMY_PAYLOAD.name
    )};`;

    const db = DB.getConnection(DBConfig);
    const confirmationResults = await DB.query(db, confirmationSql);

    expect(confirmationResults[0].description).toEqual(
      modifiedDummyPayload.description
    );

    db.destroy();
  });

  test("Deletes an existing resume item", async () => {
    const dummyID = await getDummyPayloadID();
    const results = await api.delete(`/resume/${dummyID}`);

    expect(results.status).toBe(204);

    const confirmationSql = `SELECT * FROM experience WHERE name = ${mysql.escape(
      DUMMY_PAYLOAD.name
    )};`;

    const db = DB.getConnection(DBConfig);
    const confirmationResults = await DB.query(db, confirmationSql);

    expect(confirmationResults).toHaveLength(0);

    db.destroy();
  });
});
