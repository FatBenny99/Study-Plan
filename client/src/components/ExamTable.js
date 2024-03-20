
import { Col,Row, Button, Container } from "react-bootstrap";
import ExamAccordion from "./ExamAccordion";
import { checkExam } from "../utils";



function ExamTable(props){
let exams=props.exams;
let headers= props.headers;

//buttons is a prop that defines if we are in the edit mode or not!
if(props.buttons)
{
  return exams.map(ex=><Container >
                          <Row> 
                            <Col sm={11}> <ExamAccordion key={ex.code} exam={ex} headers={headers} planExams={props.planExams}/> 
                            </Col>
                            <Col> 
                              <Button key={props.text} variant= {checkExam(props.planExams,ex)? "success" : "danger"} onClick={()=>props.fn(ex) }> {props.text} </Button>  
                            </Col>
                          </Row> 
                        </Container>)
}                  
else
{
  return exams.map(ex=><ExamAccordion key={ex.code} exam={ex} headers={headers} />);
}
}

export default ExamTable;