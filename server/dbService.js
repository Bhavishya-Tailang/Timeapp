const express = require('express');
const mysql = require('mysql');
let instance = null;


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tiger",
    database: "timeapp"
});


connection.connect((err) => {
    if (err) throw err;
    console.log("Database connected");
  });

class Dbservice {
    static getInstance() {
        return instance ? instance : new Dbservice();
    }

    //create
    async createUser(name, username, role, encryptionkey, password) {
        console.log(password)
        try {
            const dateAdded = new Date();
            const insertUser = await new Promise((resolve, reject) => {
                const query = "INSERT INTO userdetails (name, username, role, date) VALUES (?,?,?,?);";
                
                connection.query(query, [name, username, role, dateAdded], (err, result) => {
                    resolve(result.insertUser);
                    if(err) reject(new Error(err.message));
                });
            });
            const createKey = await new Promise((resolve, reject) => {
                const query = "INSERT INTO encryptionkeydetails (username, encryptionKey, date) VALUES (?,?,?);";

                connection.query(query, [username, encryptionkey, dateAdded], (err, result) => {
                    resolve(result.createKey);
                    if(err) reject(new Error(err.message));
                });
            });
            const showDetails = await new Promise((resolve, reject) => {
                const query = "INSERT INTO usercredentialdetails (encryptionKey, password, date) VALUES (?,?,?);";

                connection.query(query, [encryptionkey, password, dateAdded], (err, result) => {
                    resolve(result.showDetails);
                    if(err) reject(new Error(err.message));
                });
            });
            const areApiSuccessful = await Promise.all([insertUser, createKey, showDetails]);
            return {
                id: areApiSuccessful,
                name: name,
                username: username,
                password: password,
                role: role,
                dateAdded: dateAdded,
            }
        } catch (error) {
            console.log(error);
        }
    }

    //check login
    async checkLogin(username, role, password) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT ud.username, ud.role, cd.password, ed.encryptionKey
                    FROM userdetails ud 
                    INNER JOIN encryptionkeydetails ed ON ud.id = ed.id 
                    INNER JOIN usercredentialdetails cd ON ed.encryptionKey = cd.encryptionKey 
                    WHERE ud.username=? and ud.role=?;`

                connection.query(query, [username, role, password], (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    //get role
    async getUserDetails(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT name, role, username FROM userdetails WHERE username =?;`

                connection.query(query, [username], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    //check for duplicate user
    async checkUserExists(username) {
        const response = await new Promise((resolve, reject) => {
            const query = `SELECT 1 FROM userdetails WHERE username = ?;`

            connection.query(query, [username], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            })
        })
        return response;
    } catch (error) {
        console.log(error);
    }

    // getting all users
    async getAllUsers() {
        const response = await new Promise((resolve, reject) => {
            const query = `SELECT * FROM userdetails where role != "admin";`

            connection.query(query, [], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            })
        })
        return response;
    } catch (error) {
        console.log(error);
    }
}


  module.exports = Dbservice;
