const getExamDAOInstance=require("../dao/ExamDAO");
const getUserDAOInstance=require ("../dao/UserDAO")

const examDAO=getExamDAOInstance();
const userDAO=getUserDAOInstance();


async function getAllExams(req, res) {
    try {
       
       const exams = await examDAO.getAll();
       return res.status(200).json(exams);
    }
    catch (err) {
       console.log(err);
       return res.status(500).json({
          error: "Internal Server Error",
       });
    }
 }

 async function getStudyPlanExams(req,res){
   try {
       
      const exams = await examDAO.getStudyPlan(req.params.id);
      return res.status(200).json(exams);
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error",
      });
   }

 }

 async function getAllIncompatibilities(req, res) {
   try {
      const exams = await examDAO.getIncompatibilities(req.params.id);
      return res.status(200).json(exams);
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error",
      });
   }
}

async function createPlan(req,res)
{ 
   try{
      if(req.body.studyplan!=="PartTime" && req.body.studyplan!=="FullTime")
      {
         return res.status(422).json({error : "StudyPlan Not in the correct Format"});
      }
      await userDAO.updateUserPlan(req.body.studyplan,req.params.id);
      return res.status(200).end();

   }
   catch(err)
   {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error",
      });
   }


}

async function deletePlan(req, res) {
   try {
   
      const courses = await examDAO.getStudyPlan(req.params.id);

      if(courses.length===0) {
         await userDAO.updateUserPlan(null,req.params.id);
         return res.status(200).end();
      }
      //if the courses are present i delete them
      await examDAO.deletePlan(req.params.id);
      //i remove a userplan
      await userDAO.updateUserPlan(null,req.params.id);

      return res.status(204).end();
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server Error" }).end();
   }
}

async function getUserStudyPlan(req,res){

   try {
       const plan = await userDAO.getStudyPlan(req.params.id)
       return res.status(200).json({studyplan: plan});
    }
    catch (err) {
       console.log(err);
       return res.status(500).json({
          error: "Internal Server Error",
       });
    }
}

async function createPlanExam(req, res) {
   try {
      
      let result=await examDAO.addPlanExam(req.body.UserId,req.body.ExamCode);
      if (!result) {   // a generic error occurred during creation
         return res.status(503).json({
            error: "Internal Server Error - Generic error occurred during creation"
         });
      }

      return res.status(201).end();
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error"
      });
   }
}

async function deleteExamFromPlan(req, res) {
   try {
   
      const exams = await examDAO.getPlanExam(req.user.id,req.params.code);
      if(exams.length===0) {
         return res.status(204).end();
      }
      
      await examDAO.deletePlanExam(req.user.id,req.params.code);
      return res.status(204).end();
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server Error" }).end();
   }
}

async function moreEnrolled(req, res) {
   try {

      // check exam existence 

      const exam = await examDAO.getExam(req.body.code);
      if (!exam) {    // exam not found
         return res.status(404).json({
            error: "Exam not found"
         });
      }

      // * update exam *
      const wasExamUpdated = await  examDAO.moreStudents(req.body.code);

      if (!wasExamUpdated) {   // a generic error occurred during update
         return res.status(503).json({
            error: "Internal Server Error - Generic error occurred during update"
         });
      }
      return res.status(200).end();
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error"
      });
   }
}

async function lessEnrolled(req, res) {
   try {

      // check exam existence 
      const exam = await examDAO.getExam(req.body.code);

      if (!exam) {    // exam not found
         return res.status(404).json({
            error: "Exam not found"
         });
      }

      // * update exam *
      const wasExamUpdated = await  examDAO.lessStudents(req.body.code);

      if (!wasExamUpdated) {   // a generic error occurred during update
         return res.status(500).json({
            error: "Internal Server Error - Generic error occurred during update"
         });
      }
      return res.status(200).end();
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error"
      });
   }
}

 
module.exports={
getAllExams,
getAllIncompatibilities,
getStudyPlanExams,
deletePlan,
createPlan,
getUserStudyPlan,
createPlanExam,
deleteExamFromPlan,
moreEnrolled,
lessEnrolled
};



