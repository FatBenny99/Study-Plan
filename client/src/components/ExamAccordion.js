
import {Accordion,Table} from "react-bootstrap"
import ExamTableHeader from "./ExamTableHeader";
import ExamRow from "./ExamTableRows";
import {checkExam} from "../utils";

function ExamAccordion(props){

    let exam=props.exam;
    let headers=props.headers;
    
return <Accordion>
            <Accordion.Item eventKey={exam.code}>
            <Accordion.Header>
                <Table key={exam.code} className={checkExam(props.planExams,exam)? "table-dark" :"table-danger"} striped bordered hover>
                    <thead>
                        <ExamTableHeader key="head" headers={headers}/>
                    </thead>
                    <tbody>
                        <ExamRow  key={"ExamRow"} exam={exam}> </ExamRow>
                    </tbody>
                </Table> 

                </Accordion.Header>
            <Accordion.Body>
                <Table  className={checkExam(props.planExams,exam)? "table-info" :"table-danger"} striped bordered hover>
                    <thead key={"accordion body head"}>
                        <tr>
                        <th scope="col" key={`Preparatory`} >Preparatory Course</th>
                        <th scope="col" key={`Incompatible`} >Incompatible Courses</th>
                        </tr>
                    </thead>
                    <tbody key={"accordion Body row"}>
                        <tr>
                        <td> {exam.preparatory? exam.preparatory: "None"}</td>
                        <td> {exam.incompatibility.length!==0? exam.incompatibility.toString() : "None"}</td>
                        </tr>
                    </tbody>
                </Table>
            </Accordion.Body>
            </Accordion.Item>
        </Accordion>};

export default ExamAccordion