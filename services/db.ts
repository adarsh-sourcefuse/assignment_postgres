const pg = require('pg');

const config = {
  user: 'rahul', //this is the db user credential
  database: 'assignment',
  password: 'admin',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});
const createTables = () => {
    const customerTable = `CREATE TABLE IF NOT EXISTS
    customer
    (
    id SERIAL NOT NULL PRIMARY KEY,
    customerName VARCHAR(50) NOT NULL,
    website VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;
    pool.query(customerTable)
    .then((res:any) => {
      console.log(res);
       pool.end();
    })
    .catch((err:any) => {
      console.log(err);
      pool.end();
    });
    
    
    
  
  };
  const roleTables=()=> {
    const roleEnum=`CREATE TYPE role AS ENUM('super_admin','admin','subscriber');`
    const roleTable=`CREATE TABLE IF NOT EXISTS roletable
    (
    id SERIAL NOT NULL PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL,
    role_key role,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description VARCHAR(100) NOT NULL
    );`
    const userTable=`CREATE TABLE usertable
    (
    u_id SERIAL NOT NULL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    middleName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer_id INT NOT NULL REFERENCES customer(id),
    role_id INT NOT NULL REFERENCES roletable(id)
    );` 
      
    
    pool.query(roleEnum)
    .then((res:any) => {
      console.log(res);
      pool.query(roleTable)
      .then((res:any) => {
        console.log(res);
        pool.query(userTable)
        .then((res:any) => {
          console.log(res);
           pool.end()
        })
        .catch((err:any) => {
          
          console.log(err);
          pool.end();
        });
      })
      .catch((err:any) => {
        console.log(err);
        pool.end();
      });
    })
    .catch((err:any) => {
      console.log(err);
      pool.end();
    });
    
    
  }
  const triggerTables=()=>
  {
    const triggerFunction=`CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`
    const  userTrigger=`CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON usertable
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();`
    const  roleTrigger=`CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON roletable
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();`
    const  customerTrigger=`CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON customer
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();`
    
    
    
    pool.query(triggerFunction)
    .then((res:any) => {
      console.log(res);
      pool.query(userTrigger).then((res:any) => {
        console.log(res);
        pool.query(customerTrigger).then((res:any) => {
          console.log(res);
          pool.query(roleTrigger).then((res:any) => {
            console.log(res);
            pool.end();})
        })
      })
    }).catch((err:any) => {
      console.log(err);
      pool.end();
    })
   
    
    
    
    
    
    
    
 
  }
//   pool.on('remove', () => {
//     console.log('client removed');
//     process.exit(0);
//   });
  
  
  //export pool and createTables to be accessible  from an where within the application
  module.exports = {
    createTables,
    roleTables,
    triggerTables,
    pool,
  };
  
  require('make-runnable');