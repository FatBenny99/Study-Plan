'use strict'

import  {Exam}  from "./models/Exam"
const APIurl = "http://localhost:3001/api/";


async function fetchAllExams() {
    try {
       // GET
       const response = await fetch(APIurl+"exams"); 
       if (response.ok) {
         // process the response
         const list = await response.json();
         const examsList = list.map((ex)=>new Exam(ex.code, ex.name, ex.credits,ex.maxstudents,ex.enrolledstudents,ex.preparatory));
         return examsList;
     } else {
         // application error (404, 500, ...)
         const text = await response.text();
         throw new TypeError(text);
     }
 
    }
    catch (error) {
       // network error...
       console.log(error);
       throw error;
    }
 }

 async function fetchStudyPlanExams(id) {
  try {
     // GET
     const response = await fetch(APIurl+"exams/studyplan/"+id,{
      method : "GET",
      credentials : "include"
     }); 
     if (response.ok) {
       // process the response
       const list = await response.json();
       const examsList = list.map((ex)=>new Exam(ex.code, ex.name, ex.credits,ex.maxstudents,ex.enrolledstudents,ex.preparatory));
       return examsList;
   } else {
       // application error (404, 500, ...)
       const text = await response.text();
       throw new TypeError(text);
   }

  }
  catch (error) {
     // network error...
     console.log(error);
     throw error;
  }
}

async function getUserPlan(id){

  try {
    // GET
    const response = await fetch(APIurl+"exams/user/studyplan/"+id,{
      method : "GET",
      credentials:"include"
    }); 
    if (response.ok) {
      // process the response
      const ret= await response.json();

      return ret.studyplan;
  } else {
      // application error (404, 500, ...)
      const text = await response.text();
      throw new TypeError(text);
  }

 }
 catch (error) {
    // network error...
    console.log(error);
    throw error;
 }

}

async function createPlan(id,studyplan){
  
  try {
    const response = await fetch(APIurl+"exams/studyplan/"+id, {
       method: "PUT",
       headers: {
          "Content-Type": "application/json"
       },
       body: JSON.stringify({
          studyplan: studyplan
       }),
       credentials: 'include'
    });

    if (response.status === 404) {
       return null;
    }
    else if (!response.ok) {
       // application error
       const errorText = await response.text();
       throw TypeError(errorText);
    }

    return true;
 }
 catch (err) {
    // network connection error
    console.log(err);
    throw err;
 }

}

async function fetchDeletePlan(id) {
  try {
    const response = await fetch(APIurl+"exams/studyplan/"+id, {
       method: "DELETE",
       credentials: 'include'
    });

    if (response.status === 404) {
       return null;
    }
    else if (!response.ok) {
       // application error
       const errorText = await response.text();
       throw TypeError(errorText);
    }

    return true;
 }
 catch (err) {
    console.log(err);
    throw err;
 }
}



 async function fetchAllIncompatibilities(id)
 {
    try {
        // GET
        const response = await fetch(APIurl+"exams/incompatibilities/"+id,{method : "GET",credentials: "include"}); 
        if (response.ok) {
          // process the response
          const list = await response.json();
          const exams=list.map(a=> a.IncompatibleCode);
          return exams;
      } else {
          // application error (404, 500, ...)
          const text = await response.text();
          throw new TypeError(text);
      }
  
     }
     catch (error) {
        // network error...
        console.log(error);
        throw error;
     }

 }



 async function logIn(credentials) {
    const response = await fetch(APIurl + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };
 
 async function logOut (){
    const response = await fetch(APIurl + 'logout', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }
  
 async function getUserInfo (){
    const response = await fetch(APIurl + 'sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
  };

  async function addExamToPlan(Exam,userid) {
   try {
      const response = await fetch(APIurl+"exams/add", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            UserId: userid,
            ExamCode: Exam.code
         }),
         credentials: 'include'
      });

      if (!response.ok) {
         // application error
         const errorText = await response.text();
         throw TypeError(errorText);
      }

      return true;
   }
   catch (err) {
      // network connection error
      console.log(err);
      throw err;
   }
}

async function deletePlanExam(code) {
   try {

     const response = await fetch(APIurl+"exams/studyplan/del/"+code, {
        method: "DELETE",
        credentials: 'include'
     });
 
 
     if (response.status === 404) {
        return null;
     }
     else if (!response.ok) {
        // application error
        const errorText = await response.text();
        throw TypeError(errorText);
     }
 
     return true;
  }
  catch (err) {
     console.log(err);
     throw err;
  }
 }

 async function UpdateExamEnrolledStudents(code,mode){
  
   if(mode==="+")
   {
   try {
     const response = await fetch(APIurl+"exams/plusenroll", {
        method: "PUT",
        headers: {
           "Content-Type": "application/json"
        },
        body: JSON.stringify({
         code: code
         }),
        credentials: 'include'
     });
 
     if (response.status === 404) {
        return null;
     }
     else if (!response.ok) {
        // application error
        const errorText = await response.text();
        throw TypeError(errorText);
     }
 
     return true;
  }
  catch (err) {
     // network connection error
     console.log(err);
     throw err;
  }
}

else if(mode==="-")
{
   try {
      const response = await fetch(APIurl+"exams/lessenroll", {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            code : code
         }),
         credentials: 'include'
      });
  
      if (response.status === 404) {
         return null;
      }
      else if (!response.ok) {
         // application error
         const errorText = await response.text();
         throw TypeError(errorText);
      }
  
      return true;
   }
   catch (err) {
      // network connection error
      console.log(err);
      throw err;
   }

}
 }



 export{
     fetchAllExams,
     fetchAllIncompatibilities,
     logIn,
     logOut,
     getUserInfo,
     fetchStudyPlanExams,
     fetchDeletePlan,
     createPlan,
     getUserPlan,
     addExamToPlan,
     deletePlanExam,
     UpdateExamEnrolledStudents
 };