// dbEmployees.js

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,    // the number of connections node.js will hold open to our database
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
 
});
 
let db = {};
 
db.getAllEmployees = () =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM Employee ',  (error, employees)=>{
            if(error){
                return reject(error);
            }
            return resolve(employees);
        });
    });
};
 
db.getOneEmployee = (id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM Employee WHERE id= ?', [id], (error, employee)=>{
            if(error){
                return reject(error);
            }
            return resolve(employee);
        });
    });
};
 
db.insertEmployee = (name, position, wage) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO Employee (name, position, wage) VALUES (?, ?, ?)', [name, position, wage], (error, result)=>{
            if(error){
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};
 
 
db.updateEmployee = (name, position, wage, id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE Employee SET name = ?, position= ?, wage= ? WHERE id = ?', [name, position, wage, id], (error)=>{
            if(error){
                return reject(error);
            }
             
              return resolve();
        });
    });
};
 
db.deleteEmployee = (id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('DELETE Employee WHERE id= ?', [id], (error)=>{
            if(error){
                return reject(error);
            }
              return resolve();
         
        });
    });
};
  
module.exports = db;