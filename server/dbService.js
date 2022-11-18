const { response } = require('express');
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
    async createUser(name, username, role, encryptionkey, password, defaultPasswordChanged) {
        console.log(password)
        try {
            const dateAdded = new Date();
            const insertUser = await new Promise((resolve, reject) => {
                const query = "INSERT INTO userdetails (name, username, role, date, defaultPasswordChanged) VALUES (?,?,?,?,?);";
                
                connection.query(query, [name, username, role, dateAdded, defaultPasswordChanged], (err, result) => {
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
                const query = `SELECT name, role, username, defaultPasswordChanged FROM userdetails WHERE username =?;`

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
    //update users 
    async updateUsers(id, name, username, role) {
        console.log("id, name, username, role:::", id, name, username, role)
        const response = await new Promise((resolve, reject) => {
            const query = `UPDATE userdetails SET name=?, role=? WHERE id=? and username=?;`

            connection.query(query, [name, role, id, username], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            })
        })
        return response;
    } catch(error) {
        console.log(error);
    }

    //delete users 
    async deleteUsers(username, id) {
        const response = await new Promise((resolve, reject) => {
            const query = `DELETE FROM userdetails WHERE username=? AND id=?;`

            connection.query(query, [username, id], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results.affectedRows);
            })
        })
        return response > 0
    } catch(error) {
        console.log(error);
    }

    //check password
    async checkPassword(defaultPasswordChanged, encryptionKey, password) {
        try {
            const userdetails =await new Promise((resolve, reject) => {
                const query = `UPDATE userdetails SET defaultPasswordChanged=? WHERE username=?;`

                connection.query(query, [defaultPasswordChanged]), (err, results) => {
                    resolve(results.userdetails);
                    if(err) reject(new Error(err.message));
                }
            })
            const encryptionkeydetails =await new Promise((resolve, reject) => {
                const query = `UPDATE userdetails SET encryptionKey=? WHERE username=?;`

                connection.query(query, [encryptionKey]), (err, results) => {
                    resolve(results.encryptionkeydetails);
                    if(err) reject(new Error(err.message));
                }
            })
            const usercredentialdetails =await new Promise((resolve, reject) => {
                const query = `UPDATE userdetails SET password=? WHERE username=?;`

                connection.query(query, [password]), (err, results) => {
                    resolve(results.usercredentialdetails);
                    if(err) reject(new Error(err.message));
                }
            })
            const areApiSuccessful = await Promise.all([userdetails, encryptionkeydetails, usercredentialdetails]);
            return {
                id: areApiSuccessful,
                defaultPasswordChanged: defaultPasswordChanged,
                encryptionKey: encryptionKey,
                password: password
            }
        } catch (error) {
            console.log(error)
        }
    }
}



  module.exports = Dbservice;
