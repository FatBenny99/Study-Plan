import ExamNavbar from "../components/ExamNavbar"
import SuccessBox from "../components/SuccessBox";
import ErrorBox from "../components/ErrorBox";
import {Row ,Col,Button, Container}from "react-bootstrap";
import ExamTable from "../components/ExamTable";
import { useNavigate } from "react-router-dom";
import { checkExam,numberOfCredits,checkRemoveExam,textcheckExam } from "../utils";
import {
    fetchDeletePlan,
    fetchStudyPlanExams,
    addExamToPlan,
    deletePlanExam,
    UpdateExamEnrolledStudents,
    
   } from '../API';


function Plan(props)
{
    const getAllExams=props.getAllExams;
    const exams=props.exams;
    const headers=props.headers;
    const setPlanExams=props.setPlanExams;
    const navigate = useNavigate();

    let Content;


//Function that add an exam to the StudyPlan
function addExam(exam){
    //if the can be inserted i update the PlanExams State
    if(checkExam(props.planExams,exam)===true)
    {
        props.setSuccessMessage("Exam "+exam.code+" added!");
        props.setFailMessage("");
        setPlanExams((oldexams)=>[...oldexams,exam]);
    }
    else
    {
        props.setSuccessMessage("");
        props.setFailMessage("This exam cannot be added because "+textcheckExam(props.planExams,exam));
    }
}

//function that remove an exam from the StudyPlan
function removeExam(exam){
    //if an Exam can be removed i remove it from the PlanExams
    if(checkRemoveExam(props.planExams,exam)===true)
    {
        setPlanExams((old)=>old.filter((x)=>x!==exam));
        props.setSuccessMessage("Exam "+ exam.code + " removed!" );
        props.setFailMessage("");
    }
    else{
        props.setSuccessMessage("");
        props.setFailMessage("This Exam can't be removed because it violates a preparatory constraint");
    }
}

//function that deletes the plan from the DB
async function DeletePlan(id){

    try {

        //checks for all plans to remove the enrolled student from each of them
        for (let exam of props.planExams)
        {
        await UpdateExamEnrolledStudents(exam.code,"-");
        }
        props.getAllExams();
        await fetchDeletePlan(id);
        setPlanExams([]);
        props.setNewPlan(false);
        props.setExistPlan(false);
        props.setFailMessage("");
        await getAllExams();
        props.setSuccessMessage("Plan Deleted!");
        props.setEdit(true);
        navigate("/");

    }
    catch (err) {
        console.log(err)
        throw err;
    }
}


async function HandleSave(id,studyplan)
{
    function isPresent(exams,exam)
    {
        for (let x of exams)
        {
            if(x.code.trim()===exam.code.trim()){
                return true;
            }
        }
        return false;
    }
    
    //checks for the number of credits constraint

    if(numberOfCredits(studyplan)<props.lowthreshold || numberOfCredits(studyplan)>props.hightreshold)
    {
        props.setSuccessMessage("");
        props.setFailMessage("Error! I can't save a plan that doesnt respect the credits requirement!")
        return;

    }
    

    try{

    props.getAllExams();
    props.setEdit(false);
    let oldexams=await fetchStudyPlanExams(id)
    
    //filtering only the exams that must be added or inserted into the plan, the ones that were already present are not modified in any way
    let toremove=oldexams.filter((x)=>!isPresent(studyplan,x));
    let toinsert=studyplan.filter((x)=>!isPresent(oldexams,x))

    //deletes the element from the previous plan
    for(let exam of toremove)
    {
        await deletePlanExam(exam.code);
        await UpdateExamEnrolledStudents(exam.code,"-");

    }
    //adds the element to the new plan
    for(let exam2 of toinsert)
    {
        await addExamToPlan(exam2,props.id);
        await UpdateExamEnrolledStudents(exam2.code,"+");

    }
    props.setSuccessMessage("Plan Saved!");
    props.setFailMessage("");
    //i get again the new StudyPlans to get the new infos from the DB(enrolled Students)
    let examsadded= await fetchStudyPlanExams(id);
    await getAllExams()
    props.setPlanExams(examsadded);
    }
    catch(err)
    {
        console.log(err);
        return;
    }
}

async function handleCancel(){

    //setting the old exams plan in the state
    let exams=await fetchStudyPlanExams(props.id)
    setPlanExams(exams);
    props.setFailMessage("");
    props.setSuccessMessage("All the modification were cancelled!");
    props.setEdit(false);
}


//Content1 shows all the exams on the left in the plan Route with the buttons if we are in edit mode
if(props.edit)
{
    Content=<Col>
                <Row>
                   <Row> 
                        <h1 style={{color : "maroon"}}>Your Plan</h1>
                   </Row>
                        <Container>
                        <Row>
                            <Col> <h4 style={{color: "navy"}}>Min Credits : {props.lowthreshold} </h4> </Col>
                            <Col> <h4 style={{color: "navy"}}> Max Credits : {props.hightreshold}</h4> </Col>
                            <Col> <h4 style={{color: "navy"}}> Actual Credits: {numberOfCredits(props.planExams)}</h4>   </Col>
                        </Row>
                        </Container>
                    </Row>
                <Row>
                    <ExamTable exams={props.planExams}
                                headers={headers}
                                buttons={true}
                                text={"-"}
                                fn={removeExam}/>

                </Row>
                <Container>
                    <Row>
                        <Col><Button variant="success" onClick={()=>HandleSave(props.id,props.planExams)}>Save</Button></Col>
                        <Col><Button variant= "danger" onClick={()=>handleCancel()}> Cancel</Button></Col>

                    </Row>
                </Container>

            </Col>
}
else
{
    Content=<Col>
                <Row>  
                    <Row> 
                        <h1 style={{color : "maroon"}}>Your Plan</h1>
                    </Row>
                        <Container>
                            <Row>
                                <Col> <h4 style={{color: "navy"}}>Min Credits : {props.lowthreshold} </h4> </Col>
                                <Col> <h4 style={{color: "navy"}}> Max Credits : {props.hightreshold}</h4> </Col>
                                <Col> <h4 style={{color: "navy"}}> Actual Credits: {numberOfCredits(props.planExams)}</h4></Col>
                            </Row>
                        </Container>
                    </Row>
                <Row>
                    <ExamTable exams={props.planExams}
                                headers={headers}
                                buttons={false}>
                    </ExamTable>
                </Row>
                <Container>
                    <Row>
                        <Col><Button variant="warning" onClick={()=>{ props.setSuccessMessage("Edit Mode!");
                                                                      props.setEdit(true)}}>Edit</Button></Col>
                        <Col><Button variant="danger" onClick={()=>DeletePlan(props.id)}>Delete Plan</Button></Col>

                    </Row>
                </Container>

            </Col>;
}

//the content2 Adds the exams alongside with the buttons if we are in edit mode, or without them if we aren't

let Content2=
        <Col>
            {props.edit?
                            <ExamTable  exams={exams}
                                        headers={headers}
                                        buttons={true}
                                        setPlanExams={setPlanExams}
                                        text={"+"}
                                        fn={addExam}
                                        planExams={props.planExams}/>
                        :
                            <ExamTable  exams={exams}
                                        headers={headers}
                                        buttons={false}/>
            }
        </Col>  


const Final=<Row className="h-100">
    {Content}
    {Content2}
</Row>


return (
    <Row as="header">
        <ExamNavbar handleLogout={props.handleLogout} login={props.login} 
                    setSuccessMessage={props.setSuccessMessage} setFailMessage={props.setFailMessage
                    }>
        </ExamNavbar> 
        {props.successmessage && <SuccessBox>{props.successmessage}</SuccessBox>}
        {props.failmessage && <ErrorBox>{props.failmessage}</ErrorBox>} 
       {Final}
    </Row>)

}

export default Plan;