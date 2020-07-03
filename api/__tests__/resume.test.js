const apisauce = require("apisauce");

describe("Resume endpoint", () => {
  const api = apisauce.create({
    baseURL: "http://localhost:3000",
  });

  test("Lists resume items", async () => {
    const results = await api.get("/resume");

    expect(results.status).toBe(200);
    expect(results.data).toBeDefined();
  });

  test("Creates a new resume item");

  test("Updates an existing resume item");

  test("Deletes an existing resume item");
});
