const apisauce = require("apisauce");

const { DB } = require("node-backend-utils/lib");

const { DBConfig } = require("../../utils/constants");
const { ADMIN_JWT } = require("../../mock");

describe("Upload endpoint", () => {
  const api = apisauce.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: ADMIN_JWT,
    },
  });

  test("Returns a signed url", async () => {
    const MOCK_PAYLOAD = {
      bucket: "mock",
      filename: "mock-file",
      ContentType: "plain/text",
    };

    const { status, data } = await api.post("/upload", MOCK_PAYLOAD);
    expect(status).toBe(200);
    expect(data).toHaveProperty("url");
  });
});
