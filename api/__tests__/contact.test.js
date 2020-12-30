const apisauce = require("apisauce");

describe("Contact endpoint", () => {
  const api = apisauce.create({
    baseURL: "http://localhost:3000",
  });

  test("Sends an email", async (done) => {
    const MOCK_PAYLOAD = {
      email: "foo@goo.com",
      content: "hello",
      name: "foo",
    };
    const response = await api.post("/contact", MOCK_PAYLOAD);
    expect(response.status).toBe(200);
  });
});
