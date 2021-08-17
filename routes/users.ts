import { defaultCoreCipherList } from 'constants';
import {Router} from 'express'
const router=Router();
const p=require('../services/db')
const pool=p.pool;

router.get('/', (req, res) => {
    res.send('Welcome to Our Customer API');
 });
router.get('/customer', (req, res) => {
    pool.connect((err:any, client:any, done:any) => {
        const query = 'SELECT * FROM customer';
        client.query(query, (error:any, result:any) => {
          done();
          if (error) {
            res.status(400).json({error})
          } 
          if(result.rows < '1') {
            res.status(404).send({
            status: 'Failed',
            message: 'No customer information found',
            });
          } else {
            res.status(200).send({
            status: 'Successful',
            message: 'Customer Information retrieved',
            students: result.rows,
            });
          }
        });
      });
    });
 router.post('/customer', (req, res) => {
        const data = {
         
          name: req.body.name,
          website : req.body.website,
          address : req.body.address,
         
        }
      
        pool.connect((err:any, client:any, done:any) => {
          const query = 'INSERT INTO customer(customerName, website, address) VALUES($1,$2,$3) RETURNING *';
          const values = [ data.name, data.website, data.address];
      
          client.query(query, values, (error:any, result:any) => {
            done();
            if (error) {
              res.status(400).json({error});
            }
            res.status(202).send({
              status: 'SUccessful',
              result: result.rows[0],
            });
          });
        });
      });  
router.get('/role', (req, res) => {
        pool.connect((err:any, client:any, done:any) => {
            const query = 'SELECT * FROM roletable';
            client.query(query, (error:any, result:any) => {
              done();
              if (error) {
                res.status(400).json({error})
              } 
              if(result.rows < '1') {
                res.status(404).send({
                status: 'Failed',
                message: 'No Role information found',
                });
              } else {
                res.status(200).send({
                status: 'Successful',
                message: 'Role Information retrieved',
                students: result.rows,
                });
              }
            });
          });
        });
router.post('/role', (req, res) => {
            const data = {
             
             roleName:req.body.roleName,
             rolekey:req.body.rolekey,
             description:req.body.description,
            }
          
            pool.connect((err:any, client:any, done:any) => {
              const query = 'INSERT INTO roletable(roleName, role_key, description) VALUES($1,$2,$3) RETURNING *';
              const values = [ data.roleName, data.rolekey, data.description];
          
              client.query(query, values, (error:any, result:any) => {
                done();
                if (error) {
                  res.status(400).json({error});
                }
                res.status(202).send({
                  status: 'SUccessful',
                  result: result.rows[0],
                });
              });
            });
          });      
router.get('/user', (req, res) => {
            pool.connect((err:any, client:any, done:any) => {
                const query = 'SELECT * FROM usertable';
                client.query(query, (error:any, result:any) => {
                  done();
                  if (error) {
                    res.status(400).json({error})
                  } 
                  if(result.rows < '1') {
                    res.status(404).send({
                    status: 'Failed',
                    message: 'No customer information found',
                    });
                  } else {
                    res.status(200).send({
                    status: 'Successful',
                    message: 'Customer Information retrieved',
                    students: result.rows,
                    });
                  }
                });
              });
            });
router.post('/user', (req, res) => {
                const data = {
                 
                  firstName:req.body.firstName,
                  middleName:req.body.middleName,
                  lastName: req.body.lastName,
                  email : req.body.email,
                  phone:req.body.phone,
                  address : req.body.address,
                  customerid:req.body.customer_id,
                  roleid:req.body.role_id,
                }
              
                pool.connect((err:any, client:any, done:any) => {
                  const query = 'INSERT INTO usertable(firstName,middleName,lastName,email,phone,address,customer_id,role_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
                  const values = [ data.firstName, data.middleName, data.lastName,data.email,data.phone,data.address,data.customerid,data.roleid];
              
                  client.query(query, values, (error:any, result:any) => {
                    done();
                    if (error) {
                      res.status(400).json({error});
                    }
                    res.status(202).send({
                      status: 'SUccessful',
                      result: result.rows[0],
                    });
                  });
                });
              });  
router.get('/customer/:cId', (req, res) => {
  
                const uid= req.params.cId;
                pool.connect((err:any, client:any, done:any) => {
                  const query = `SELECT * FROM customer WHERE id=${uid}`;
                  client.query(query, (error:any, result:any) => {
                    done();
                    if (error) {
                      res.status(400).json({error})
                    } 
                    if(result.rows < '1') {
                      res.status(404).send({
                      status: 'Failed',
                      message: 'No customer information found',
                      });
                    } else {
                      res.status(200).send({
                      status: 'Successful',
                      message: 'Customer Information retrieved',
                      students: result.rows[0],
                      });
                    }
                  });
                });
                            });  
 router.get('/user/:rId', (req, res) => {
                              const uid= req.params.rId;
                              pool.connect((err:any, client:any, done:any) => {
                                const query = `SELECT * FROM usertable WHERE u_id=${uid}`;
                                client.query(query, (error:any, result:any) => {
                                  done();
                                  if (error) {
                                    res.status(400).json({error})
                                  } 
                                  if(result.rows < '1') {
                                    res.status(404).send({
                                    status: 'Failed',
                                    message: 'Role information found',
                                    });
                                  } else {
                                    res.status(200).send({
                                    status: 'Successful',
                                    message: 'Role Information retrieved',
                                    students: result.rows[0],
                                    });
                                  }
                                });
                              });
                                          });   
router.get('/role/:rId', (req, res) => {
                              const uid= req.params.rId;
                              pool.connect((err:any, client:any, done:any) => {
                                const query = `SELECT * FROM roletable WHERE id=${uid}`;
                                client.query(query, (error:any, result:any) => {
                                  done();
                                  if (error) {
                                    res.status(400).json({error})
                                  } 
                                  if(result.rows < '1') {
                                    res.status(404).send({
                                    status: 'Failed',
                                    message: 'Role information found',
                                    });
                                  } else {
                                    res.status(200).send({
                                    status: 'Successful',
                                    message: 'Role Information retrieved',
                                    students: result.rows[0],
                                    });
                                  }
                                });
                              });
                                          });                                          
router.put('/user/:userId', (req, res) => {
  const uid= req.params.userId;
                const data = {
                 
                  firstName:req.body.firstName,
                  middleName:req.body.middleName,
                  lastName: req.body.lastName,
                  email : req.body.email,
                  phone:req.body.phone,
                  address : req.body.address,
                  
                  roleid:req.body.roleid,
                }
                console.log("server")
                console.log(data)
              
                pool.connect((err:any, client:any, done:any) => {
                  const query = `UPDATE usertable SET firstName=($1),middleName=($2),lastName=($3),email=($4),phone=($5),address=($6),role_id=($7) WHERE  u_id=${uid} RETURNING *`;
                  const values = [ data.firstName, data.middleName, data.lastName,data.email,data.phone,data.address,data.roleid];
              
                  client.query(query, values, (error:any, result:any) => {
                    done();
                    if (error) {
                      res.status(400).json({error});
                    }
                    res.status(202).send({
                      status: 'SUccessful',
                      result: result.rows,
                    });
                  });
                });
              });  
router.delete('/user/:userId', (req, res) => {
                const uid= req.params.userId;
                             
                            
                              pool.connect((err:any, client:any, done:any) => {
                                const query = `DELETE FROM usertable  WHERE  u_id=${uid} RETURNING *`;
                               // const values = [ data.firstName, data.middleName, data.lastName,data.email,data.phone,data.address,data.customerid,data.roleid];
                            
                                client.query(query, (error:any, result:any) => {
                                  done();
                                  if (error) {
                                    res.status(202).send({
                                      status: 'No rows to delete',
                                      result: result.rows,
                                    });
                                  }
                                  res.status(202).send({
                                    status: 'SUccessful',
                                    result: result.rows,
                                  });
                                });
                              });
                            });                
export default router;