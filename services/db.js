"use strict";
var pg = require('pg');
var config = {
    user: 'rahul',
    database: 'assignment',
    password: 'admin',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};
var pool = new pg.Pool(config);
pool.on('connect', function () {
    console.log('connected to the Database');
});
var createTables = function () {
    var customerTable = "CREATE TABLE IF NOT EXISTS\n    customer\n    (\n    id SERIAL NOT NULL PRIMARY KEY,\n    customerName VARCHAR(50) NOT NULL,\n    website VARCHAR(50) NOT NULL,\n    address VARCHAR(100) NOT NULL,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );";
    pool.query(customerTable)
        .then(function (res) {
        console.log(res);
        pool.end();
    })
        .catch(function (err) {
        console.log(err);
        pool.end();
    });
};
var roleTables = function () {
    var roleEnum = "CREATE TYPE role AS ENUM('super_admin','admin','subscriber');";
    var roleTable = "CREATE TABLE IF NOT EXISTS roletable\n    (\n    id SERIAL NOT NULL PRIMARY KEY,\n    roleName VARCHAR(50) NOT NULL,\n    role_key role,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    description VARCHAR(100) NOT NULL\n    );";
    var userTable = "CREATE TABLE usertable\n    (\n    u_id SERIAL NOT NULL PRIMARY KEY,\n    firstName VARCHAR(50) NOT NULL,\n    middleName VARCHAR(50) NOT NULL,\n    lastName VARCHAR(50) NOT NULL,\n    email VARCHAR(50) NOT NULL,\n    phone VARCHAR(50) NOT NULL,\n    address VARCHAR(100) NOT NULL,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    customer_id INT NOT NULL REFERENCES customer(id),\n    role_id INT NOT NULL REFERENCES roletable(id)\n    );";
    pool.query(roleEnum)
        .then(function (res) {
        console.log(res);
        pool.query(roleTable)
            .then(function (res) {
            console.log(res);
            pool.query(userTable)
                .then(function (res) {
                console.log(res);
                pool.end();
            })
                .catch(function (err) {
                console.log(err);
                pool.end();
            });
        })
            .catch(function (err) {
            console.log(err);
            pool.end();
        });
    })
        .catch(function (err) {
        console.log(err);
        pool.end();
    });
};
var triggerTables = function () {
    var triggerFunction = "CREATE OR REPLACE FUNCTION trigger_set_timestamp()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      NEW.updated_at = NOW();\n      RETURN NEW;\n    END;\n    $$ LANGUAGE plpgsql;";
    var userTrigger = "CREATE TRIGGER set_timestamp\n    BEFORE UPDATE ON usertable\n    FOR EACH ROW\n    EXECUTE PROCEDURE trigger_set_timestamp();";
    var roleTrigger = "CREATE TRIGGER set_timestamp\n    BEFORE UPDATE ON roletable\n    FOR EACH ROW\n    EXECUTE PROCEDURE trigger_set_timestamp();";
    var customerTrigger = "CREATE TRIGGER set_timestamp\n    BEFORE UPDATE ON customer\n    FOR EACH ROW\n    EXECUTE PROCEDURE trigger_set_timestamp();";
    pool.query(triggerFunction)
        .then(function (res) {
        console.log(res);
        pool.query(userTrigger).then(function (res) {
            console.log(res);
            pool.query(customerTrigger).then(function (res) {
                console.log(res);
                pool.query(roleTrigger).then(function (res) {
                    console.log(res);
                    pool.end();
                });
            });
        });
    }).catch(function (err) {
        console.log(err);
        pool.end();
    });
};
//   pool.on('remove', () => {
//     console.log('client removed');
//     process.exit(0);
//   });
//export pool and createTables to be accessible  from an where within the application
module.exports = {
    createTables: createTables,
    roleTables: roleTables,
    triggerTables: triggerTables,
    pool: pool,
};
require('make-runnable');
