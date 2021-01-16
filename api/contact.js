"use strict";

const Email = require("email-templates");
const { Response } = require("node-backend-utils/lib");

const { transporter } = require("../utils/transporter");

async function sendMessage(event, context) {
  const { body, requestContext } = event;
  const { identity } = requestContext;
  const { sourceIp } = identity;

  const params = JSON.parse(body);
  const { name, email, content } = params;

  const emailInstance = new Email({
    views: { root: "api/emails" },
    message: {
      from: process.env.EMAIL,
    },
    send: true,
    transport: transporter,
  });

  try {
    await emailInstance.send({
      template: "generic",
      message: {
        to: process.env.EMAIL,
      },
      locals: {
        name,
        email,
        content,
        sourceIp,
      },
    });

    return Response.basic(200, "Message processed");
  } catch (e) {
    console.log(e);
    return Response.basic(500, "An error occurred processing message");
  }
}

module.exports = {
  sendMessage,
};
