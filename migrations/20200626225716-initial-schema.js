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
    
    CREATE TABLE work (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      datestring VARCHAR(50) NOT NULL,
      created TIMESTAMP NOT NULL DEFAULT NOW(),
      modified TIMESTAMP,
      description TEXT,
      tags JSON,
      icons JSON,
      image BINARY
    );

    CREATE TABLE experience (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      datestring VARCHAR(50) NOT NULL,
      created TIMESTAMP NOT NULL DEFAULT NOW(),
      modified TIMESTAMP,
      description TEXT,
      tags JSON
    );

    CREATE TABLE blog (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      created TIMESTAMP NOT NULL DEFAULT NOW(),
      modified TIMESTAMP,
      tags JSON,
      image BINARY
    );

    COMMIT;
  `;

  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    DROP TABLE IGNORE work;
    DROP TABLE IGNORE experience;
    DROP TABLE IGNORE blog;
  `;

  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
