const apisauce = require("apisauce");
const mysql = require("mysql");

const { DB } = require("node-backend-utils/lib");

const { DBConfig } = require("../../utils/constants");
const { ADMIN_JWT } = require("../../mock");

describe("Work endpoint", () => {
  const api = apisauce.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: ADMIN_JWT,
    },
  });

  const DUMMY_PAYLOAD = {
    name: "jest-test",
    datestring: "September 2018",
    description: "jest",
    tags: JSON.stringify(["foo", "bar"]),
  };

  async function getDummyPayloadID() {
    const db = DB.getConnection(DBConfig);

    const sql = `SELECT id FROM work WHERE name = ${mysql.escape(
      DUMMY_PAYLOAD.name
    )};`;

    const results = await DB.query(db, sql);
    const ID = results[0].id;

    db.destroy();

    return ID;
  }

  test("Lists work items", async (done) => {
    const results = await api.get("/work");

    expect(results.status).toBe(200);
    expect(results.data).toBeDefined();

    done();
  });

  test("Creates work items", async (done) => {
    const results = await api.post("/work", DUMMY_PAYLOAD);

    expect(results.status).toBe(201);

    const confirmationSql = `SELECT * FROM work WHERE name = ${mysql.escape(
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

    done();
  });

  test("Updates work items", async (done) => {
    const modifiedDummyPayload = {
      ...DUMMY_PAYLOAD,
      description: "updated",
    };

    const dummyID = await getDummyPayloadID();
    const results = await api.put(`/work/${dummyID}`, modifiedDummyPayload);

    expect(results.status).toBe(204);

    const confirmationSql = `SELECT * FROM work WHERE name = ${mysql.escape(
      DUMMY_PAYLOAD.name
    )};`;

    const db = DB.getConnection(DBConfig);
    const confirmationResults = await DB.query(db, confirmationSql);

    expect(confirmationResults[0].description).toEqual(
      modifiedDummyPayload.description
    );

    db.destroy();
    done();
  });

  test("Deletes work items", async (done) => {
    const dummyID = await getDummyPayloadID();
    const results = await api.delete(`/work/${dummyID}`);

    expect(results.status).toBe(204);

    const confirmationSql = `SELECT * FROM work WHERE name = ${mysql.escape(
      DUMMY_PAYLOAD.name
    )};`;

    const db = DB.getConnection(DBConfig);
    const confirmationResults = await DB.query(db, confirmationSql);

    expect(confirmationResults).toHaveLength(0);

    db.destroy();
    done();
  });
});
