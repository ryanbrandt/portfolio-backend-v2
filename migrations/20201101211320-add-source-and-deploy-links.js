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
    ADD COLUMN source VARCHAR(100),
    ADD COLUMN deploy VARCHAR(100);

    ALTER TABLE experience
    ADD COLUMN achievements TEXT;

    COMMIT;
  `;

  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    START TRANSACTION; 

    ALTER TABLE work 
    DROP COLUMN source,
    DROP COLUMN deploy;
    
    ALTER TABLE experience
    DROP COLUMN achievements;

    COMMIT;
  `;

  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
