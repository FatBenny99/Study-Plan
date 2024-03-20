"use strict"
const User = require("../models/User");
const db = require("./Database");
const crypto = require('crypto');
let instance;

class UserDAO {
    #db;
 
    constructor() {
       this.#db = db;
    }
 
    static getInstance() {
       if(!instance)
          instance = new UserDAO();
 
       return instance;
    }
 
    getUser(username, password) {
       return new Promise((resolve, reject) => {
          this.#db.get("SELECT * FROM users WHERE email=?", [username], (err, row) => {
             if(err) {
                console.log(err);
                reject(err);
             }
             else if (!row) {
                resolve(null); // email not found
             }
             else {
                let user = new User(row.id, row.email, row.name,undefined,undefined,row.studyplan);
 
                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                   if(err) 
                      reject(err);
                   else if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                      resolve(false);   // password not correct
                   else
                      resolve(user);    // email and password correct
                });
             }
          });
       });
    }
    updateUserPlan(newPlan,userId) {
      
      return new Promise((resolve, reject) => {
         const sqlStatement = `UPDATE users 
                               SET studyplan=?
                               WHERE id=?`;

         const params = [newPlan,userId];

         this.#db.run(sqlStatement, params, function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });
   }

   getStudyPlan(id){
      return new Promise((resolve, reject) => {
         this.#db.get("SELECT StudyPlan FROM users WHERE id=?", [id], (err, row) => {
            if(err) {
               console.log(err);
               reject(err);
            }
            else if (!row) {
               resolve(null); // User not found
            }
            else {
               resolve(row.studyplan);
               };
            })
         });
   };

   

 }
 
 module.exports = UserDAO.getInstance;