// dbAirports.js

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT, // the number of connections node.js will hold open to our database
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

let db = {};

db.list = (queryValue) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM airports where `name` like ? limit 10',  ['%' + queryValue + '%'], (error, airports)=>{
            if(error){
                return reject(error);
            }
            return resolve(airports);
        });
    });
};

db.get = (id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM airports WHERE icao= ?', [icao], (error, airport)=>{
            if(error){
                return reject(error);
            }
            return resolve(airport);
        });
    });
};

// NEED TO HAVE AUTHORIZATION ON THIS METHOD
db.insert = (name, position, wage) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO airports (icao, iata, name, city, state, country, elevation, lat, lon, tz) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [icao, iata, name, city, state, country, elevation, lat, lon, tz], (error, result)=>{
            if(error){
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};

// NEED TO HAVE AUTHORIZATION ON THIS METHOD
db.update = (name, position, wage, id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE airports SET iata= ?, name= ?, city=?, state=?,country=?,elevation=?,lat=?,lon=?, tz=?     WHERE icao = ?', [iata, name, city, state, country, elevation, lat, lon, tz, icao], (error)=>{
            if(error){
                return reject(error);
            }
             
              return resolve();
        });
    });
};

// NEED TO HAVE AUTHORIZATION ON THIS METHOD
db.delete = (id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('DELETE airports WHERE iata= ?', [iata], (error)=>{
            if(error){
                return reject(error);
            }
              return resolve();
         
        });
    });
};

module.exports = db;