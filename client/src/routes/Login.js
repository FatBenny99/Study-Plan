import ExamNavbar from "../components/ExamNavbar";
import {Row,Col,Form,Button} from "react-bootstrap";
import { useState } from "react";
import ErrorBox from "../components/ErrorBox";
import SuccessBox from "../components/SuccessBox";
import { useNavigate } from "react-router-dom";




function Login(props){
   
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();


function validateEmail(email) {
   return /^.+@.+\..+$/.test(email);
}

async function handleSubmit(event){
    event.preventDefault();

      props.setFailMessage("");
      props.setSuccessMessage("");

    //validation of emails    
    if (!validateEmail(email)) {
        props.setFailMessage("Email format not correct (example@domain.com)");
        return;
     }
    props.handleLogin({username : email, password : password});
    navigate("/");
return ;
}

const header=<Row><ExamNavbar></ExamNavbar> </Row>;

const formContent =
<Row className="mt-3">
   <Col></Col>
   <Col as="main" xs={8} sm={6} lg={5} xl={4}>
      <div style={{
         borderColor: 'grey', borderWidth: 2, borderStyle: 'dotted',
         borderRadius: 10, padding: '0.5em 1.75em'
      }}>
         <Form onSubmit={handleSubmit}>
            <Form.Group className='my-3'>
               <Form.Label>Email</Form.Label>
               <Form.Control type="email" value={email} required={true} placeholder={"email"}
                  onChange={event => setEmail(event.target.value)} />
            </Form.Group>

            <Form.Group className='my-3'>
               <Form.Label>Password</Form.Label>
               <Form.Control type="password" value={password} required={true} placeholder={"password"}
                  onChange={event => setPassword(event.target.value)} />
            </Form.Group>

            <Form.Group className='my-4' align="center">
               <Button variant='outline-success' type="submit" className="mt-1">Login</Button>
            </Form.Group>
         </Form>
      </div>
   </Col>
   <Col></Col>
</Row>;


return (<>
        {header}    
        {props.successmessage && <SuccessBox>{props.successmessage}</SuccessBox>}
        {props.failmessage && <ErrorBox>{props.failmessage}</ErrorBox>} 
        {formContent}
        </>);

}

export default Login;