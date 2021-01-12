"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const sql = `
    START TRANSACTION;

    ALTER TABLE work
    ADD COLUMN s3_image_secondary VARCHAR(200);

    ALTER TABLE work
    ADD COLUMN s3_image_primary VARCHAR(200);
  
    ALTER TABLE work
    DROP COLUMN image;

    ALTER TABLE blog
    ADD COLUMN s3_image_secondary VARCHAR(200);

    ALTER TABLE blog
    ADD COLUMN s3_image_primary VARCHAR(200);
  
    ALTER TABLE blog
    DROP COLUMN image;

    COMMIT;
  `;

  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    START TRANSACTION;

    ALTER TABLE work
    DROP COLUMN s3_image_secondary;

    ALTER TABLE work
    DROP COLUMN s3_image_primary;
  
    ALTER TABLE work
    ADD COLUMN image MEDIUMTEXT;

    ALTER TABLE blog
    DROP COLUMN s3_image_secondary;

    ALTER TABLE blog
    DROP COLUMN s3_image_primary;
  
    ALTER TABLE blog
    ADD COLUMN image MEDIUMTEXT;

    COMMIT;
  `;

  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
