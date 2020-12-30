const helpers = require("../helpers");
const { ADMIN_JWT } = require("../../mock");

describe("validateAdmin", () => {
  test("returns false without jwt", () => {
    const isAdmin = helpers.validateAdmin({});

    expect(isAdmin).toBe(false);
  });

  test("returns false with non-admin jwt", () => {
    const isAdmin = helpers.validateAdmin({
      headers: { authorization: "not-a-real-jwt" },
    });

    expect(isAdmin).toBe(false);
  });

  test("returns true with admin jwt", () => {
    const isAdmin = helpers.validateAdmin({
      headers: { authorization: ADMIN_JWT },
    });

    expect(isAdmin).toBe(true);
  });
});
