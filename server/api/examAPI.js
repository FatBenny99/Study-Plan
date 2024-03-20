const express=require("express");
const router=express.Router();

const{
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
}= require("../controller/examController");


//middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
  }
  

router.get("/",getAllExams);
router.get("/incompatibilities/:id",getAllIncompatibilities)
router.get("/studyplan/:id",isLoggedIn,getStudyPlanExams)
router.delete("/studyplan/:id",isLoggedIn,deletePlan)
router.put("/studyplan/:id",isLoggedIn,createPlan);
router.get("/user/studyplan/:id",isLoggedIn,getUserStudyPlan);
router.post("/add",isLoggedIn,createPlanExam);
router.delete("/studyplan/del/:code",isLoggedIn,deleteExamFromPlan)
router.put("/plusenroll",isLoggedIn,moreEnrolled);
router.put("/lessenroll",isLoggedIn,lessEnrolled);

module.exports = router;