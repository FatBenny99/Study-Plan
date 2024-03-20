"use strict"

const Exam =require("../models/Exam");
const connection = require("./Database");
const PlanExam=require("../models/PlanExam");


class ExamDAO{

    #db;

    static instance;    // singleton instance

    constructor() {
       this.#db = connection;
    }
 
    static getExamDAOInstance() {
       if (!ExamDAO.instance) {
          ExamDAO.instance = new ExamDAO();
       }
       return ExamDAO.instance;
    }

    getAll(){
        return new Promise((resolve, reject) => {
            const sql ="SELECT * FROM exams ORDER BY Name";
   
            this.#db.all(sql, [], (err, rows) => {
               if (err)
                  reject(err);
               else
                  resolve(rows.map(row =>
                     new Exam(row.Code, row.Name,row.Credits,row.MaxStudents,row.EnrolledStudents,row.PreparatoryCourse)));
            });
         });
    }

    getIncompatibilities(id){

      return new Promise((resolve, reject) => {
         const sql ="SELECT IncompatibleCode FROM Constrictions WHERE ExamCode=?";

         this.#db.all(sql, [id], (err, rows) => {
            if (err)
               reject(err);
            else{
               resolve(rows);
      
            }
         });
      });

    }

    getStudyPlan(id){

      return new Promise((resolve, reject) => {
         const sql ="SELECT ExamCode,Name,Credits,MaxStudents,EnrolledStudents,PreparatoryCourse FROM StudyPlan,Exams WHERE UserId=? AND Code=ExamCode";

         this.#db.all(sql, [id], (err, rows) => {
            if (err)
               reject(err);
            else
               resolve(rows.map(row =>
                  new Exam(row.ExamCode, row.Name,row.Credits,row.MaxStudents,row.EnrolledStudents,row.PreparatoryCourse)));
         });
      });
    }

    deletePlan(id) {
      return new Promise((resolve, reject) => {
         const sql = `DELETE FROM StudyPlan 
                      WHERE UserId=?`;
         
         this.#db.run(sql, [id], function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });
   }
   addPlanExam(id,coursecode){
      return new Promise((resolve, reject) => {
         const sql = `INSERT INTO StudyPlan(UserId,ExamCode) VALUES(?,?)`;
         
         this.#db.run(sql, [id,coursecode], function (err) {
            if (err)
               reject(err);
            else
               resolve(true);
         });
      });

   }

   getPlanExam(id,code){
      return new Promise((resolve, reject) => {
         const sql ="SELECT * FROM StudyPlan WHERE UserId=? AND ExamCode=?";

         this.#db.all(sql, [id,code], (err, rows) => {
            if (err)
               reject(err);
            else
               resolve(rows.map(row =>
                  new PlanExam(row.UserId,row.ExamCode)));
         });
      });

   }
   getExam(code){
      return new Promise((resolve, reject) => {
         const sql ="SELECT * FROM Exams WHERE Code=?";

         this.#db.all(sql, [code], (err, rows) => {
            if (err)
               reject(err);
            else
               resolve(rows.map(row =>
                  new Exam(row.Code,row.Name,row.Credits,row.MaxStudents,row.EnrolledStudents,row.PreparatoryCourse)));
         });
      });

   }

   deletePlanExam(id,code)
   {

      return new Promise((resolve, reject) => {
         const sql = `DELETE FROM StudyPlan 
                      WHERE UserId=? AND ExamCode=?`;
         
         this.#db.run(sql, [id,code], function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });

   }

   moreStudents(code) {
     
      return new Promise((resolve, reject) => {
         const sqlStatement = `UPDATE Exams 
                               SET EnrolledStudents=EnrolledStudents +1
                               WHERE code=?`;

         const params = [code];

         this.#db.run(sqlStatement, params, function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });
   }

   lessStudents(code) {
     
      return new Promise((resolve, reject) => {
         const sqlStatement = `UPDATE Exams 
                               SET EnrolledStudents=EnrolledStudents -1
                               WHERE code=?`;

         const params = [code];

         this.#db.run(sqlStatement, params, function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });
   }

   

}

module.exports=ExamDAO.getExamDAOInstance;