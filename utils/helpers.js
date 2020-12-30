"use strict";

const jwtDecode = require("jwt-decode");

function parseHeaders(headers) {
  const parsedHeaders = {};
  Object.keys(headers).map((key) => {
    const parsedKey = key.toLowerCase();
    parsedHeaders[parsedKey] = headers[key];
  });

  return parsedHeaders;
}

function validateAdmin(event) {
  let { headers = {} } = event;

  let isAdmin = true;
  try {
    headers = parseHeaders(headers);
    const { authorization } = headers;
    const jwt = jwtDecode(authorization);

    if (
      !("cognito:groups" in jwt) ||
      !jwt["cognito:groups"].includes("admin")
    ) {
      throw Error("Insufficient permissions");
    }
  } catch (e) {
    console.log(`Failed to validate admin ${e}`);
    isAdmin = false;
  }

  return isAdmin;
}

module.exports = {
  validateAdmin,
};
