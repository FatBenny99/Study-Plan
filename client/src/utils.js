
//boolean function that checks if an exam can be added to the planExam or not
function checkExam(planExams,exam)
{
    if(planExams===undefined)
    {
        return true;
    }
    //check exam already present

    let check1=planExams.filter((a)=>a.code.trim()===exam.code.trim())
    
    if(check1.length>0){
        return false;
    }

    //check aviableplaces
    if(exam.maxstudents===exam.enrolledstudents)
    {
        return false;

    }

    //check preparatory constraints
    if(exam.preparatory!==null)
    {
    let check=false;
    for(let planex of planExams)
    {
        if(planex.code===exam.preparatory)
        {
            check=true;
        }
        
    }
    if(!check)
        {
            return false;
        }
    }

    //check incompatibility
    if(exam.incompatibility!==null)
    {
    
    for(let ex of exam.incompatibility)
    {
        let flag=0;
        planExams.forEach(element => {
            if(element.code.trim()===ex.trim())
            {
                flag=1;
                return;
            }
        });
        if(flag===1) return false;
    }
    }




    return true;
    
}

//function to establish the exam text error in the insertion
function textcheckExam(planExams,exam)
{
    
    //check exam already present

    let check1=planExams.filter((a)=>a.code.trim()===exam.code.trim())
    
    if(check1.length>0){
        return "the exam is already in your Plan";
    }

    //check aviableplaces
    if(exam.maxstudents===exam.enrolledstudents)
    {
        return "the exam has already the maximum number of students";

    }


    if(exam.preparatory!==null)
    {
    let check=false;
    for(let planex of planExams)
    {
        if(planex.code===exam.preparatory)
        {
            check=true;
        }
        
    }
    if(!check)
        {
            return "the exams violates the preparatory constraint";
        }
    }

    //check incompatibility
    if(exam.incompatibility!==null)
    {
    for(let ex of exam.incompatibility)
    {
        ex=ex.toString().replace(/[\n\r]+/g, ' ');

        let flag=0;
        planExams.forEach(element => {
            if(element.code.trim()===ex.trim())
            {
                flag=1;
                return;
            }
        });
        if(flag===1) return "the exam is incompatible with the others";
    }
    }




    return "";

}


//checks if an exam can be removed from the plan
function checkRemoveExam(exams,ex){


    for(let x of exams)
    {
    
        if(x.preparatory===ex.code.trim()){
         return false;
        }
    }
    return true;

}

//gives the number of credits of the studyplan
function numberOfCredits(exams){

    let i=0;
    for( let exam of exams)
    {
        i=i+exam.credits;
    }
return i;
}

export{checkExam,numberOfCredits,checkRemoveExam,textcheckExam};