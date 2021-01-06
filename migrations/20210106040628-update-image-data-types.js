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
    MODIFY image MEDIUMTEXT;

    ALTER TABLE blog
    MODIFY image MEDIUMTEXT;

    COMMIT;
  `;

  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    START TRANSACTION;

    ALTER TABLE work
    MODIFY image BINARY;

    ALTER TABLE blog
    MODIFY image BINARY;

    COMMIT;
  `;

  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
