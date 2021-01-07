"use strict";

const AWS = require("aws-sdk");

const { Response } = require("node-backend-utils/lib");

const { validateAdmin } = require("../utils/helpers");
const { DBConfig } = require("../utils/constants");

function getSignedUploadUrl(bucket, filename, fileType) {
  const s3 = new AWS.S3();
  const s3Params = {
    Bucket: bucket,
    Key: filename,
    ContentType: fileType,
  };

  return new Promise((resolve, reject) =>
    s3.getSignedUrl("putObject", s3Params, function(e, data) {
      if (e) {
        console.log(`s3 getSignedUploadUrl failure ${e}`);
        reject(e);
      }

      resolve(data);
    })
  );
}

async function getUploadUrl(event, context) {
  if (!validateAdmin(event)) {
    return Response.basic(401, "Unauthorized");
  }

  const { body } = event;
  const params = JSON.parse(body);

  const { bucket, filename, fileType } = params;

  let response;
  try {
    const signedUrl = await getSignedUploadUrl(bucket, filename, fileType);
    response = Response.withPayload(200, { url: signedUrl });
  } catch (e) {
    console.log(e);
    response = Response.basic(500, "Failed to generate presigned url");
  }

  return response;
}

module.exports = {
  getUploadUrl,
};
