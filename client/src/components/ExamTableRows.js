import "bootstrap/dist/css/bootstrap.min.css";

function ExamRow(props)
{
    let exam=props.exam;
return (
<tr>
    <td> {exam.code}</td>
    <td> {exam.name}</td>
    <td> {exam.credits}</td>
    <td>{exam.maxstudents?  exam.maxstudents : "None"}</td>
    <td>{exam.enrolledstudents}</td>
</tr>);

}

export default ExamRow;