
import ExamNavbar from "../components/ExamNavbar"
import {Row ,Col,Button, Container}from "react-bootstrap";
import SuccessBox from "../components/SuccessBox";
import ErrorBox from "../components/ErrorBox";
import { useNavigate,Navigate } from "react-router-dom";
import {createPlan} from '../API';
import ExamTable from "../components/ExamTable";

function Home(props){

    const exams=props.exams;
    const headers=props.headers;
    const login=props.login;
    const newPlan=props.newPlan
    const exist=props.existPlan
    const navigate = useNavigate();
    let Content;
    
async function planCreation(id,studyplan)
{
try {
    await createPlan(id,studyplan);
    props.setNewPlan(false);
    props.setExistPlan(true);      
    }
catch (err) {
    console.log(err)
    throw err;
    }
}

    //At first i check if i'm logged in, if im logged i check if i have to create a new plan or not
    //if i dont have created a newPlan i check if there is already one existing or if i have to render the button to create it
    //if i'm not online i dont render anything but only the exam list
Content= 
    <Row className='h-100'>
                {login? <Col>
                            <Container className="mt-5">
                                {newPlan?   <Row>
                                                <Col> 
                                                    <Button  variant="info" onClick={()=>{  props.setLowThreshold(20);
                                                                                            props.setHighThreshold(40);
                                                                                            props.setNewPlan(false);
                                                                                            planCreation(props.id,"PartTime");
                                                                                            navigate("/plan")}}>
                                                        Part-Time 20-40 credits
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button variant="warning" onClick={()=>{ 
                                                                                            props.setLowThreshold(60);
                                                                                            props.setHighThreshold(80);
                                                                                            props.setNewPlan(false);
                                                                                            planCreation(props.id,"FullTime");
                                                                                            navigate("/plan")}}>
                                                        Full-Time 60-80 credits
                                                    </Button>
                                                </Col> 
                                                <Col>
                                                    <Button variant="secondary" onClick={()=>props.setNewPlan(false)}>
                                                        Go Back
                                                    </Button>
                                                </Col>
                                            </Row>
                
                                        :
                                            <Container>
                                                {exist ? 
                                                        <Navigate to="/plan"/>
                                                    :
                                                        <Button variant="success" onClick={()=>{   props.setSuccessMessage("");
                                                                                                props.setFailMessage("");
                                                                                                props.setNewPlan(true)}}>
                                                            New StudyPlan
                                                        </Button>
                                                }
                            
                                            </Container>
                
                                }
                            </Container>
                        </Col> 
                    : 
                    <></>
                }
     
                <Col>
                    <ExamTable  key="Not Logged"
                                exams={exams}
                                headers={headers}
                                buttons={false}/>
                </Col>
    </Row>;

    return (
    <Row as="header">
        <ExamNavbar handleLogout={props.handleLogout} login={props.login} setSuccessMessage={props.setSuccessMessage} setFailMessage={props.setFailMessage}></ExamNavbar> 
        {props.successmessage && <SuccessBox>{props.successmessage}</SuccessBox>}
        {props.failmessage && <ErrorBox>{props.failmessage}</ErrorBox>} 
        {Content}
    </Row>);
}

export default Home;