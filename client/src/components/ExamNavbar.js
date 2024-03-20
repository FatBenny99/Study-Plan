import { Container, Navbar,Button } from "react-bootstrap";
import {Mortarboard, PersonCircle} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css"
import { useNavigate } from "react-router-dom";

function ExamNavbar(props){

    
const navigate = useNavigate();

function handleLogin(){
    props.setSuccessMessage("");
    props.setFailMessage("");
    navigate("/login");
}

async function  handleLogOut(){
    props.setSuccessMessage("");
    props.setFailMessage("");
    await  props.handleLogout();
    navigate("/");
}


return <div>
            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand className="d-flex align-items-center"> 
                    <Mortarboard size="1.2em" onClick={()=>navigate("/")} className="action-icon"></Mortarboard>
                    Home
                    </Navbar.Brand>

                    <Navbar.Brand className="pointer" style={{cursor:"default"}}><span className="pointer" style={{cursor:"default"}}>ExamList</span></Navbar.Brand>
            
                    <Navbar.Brand>
                        <Button variant="dark" className="action-icon" onClick={()=> props.login ? handleLogOut() : handleLogin()}>{props.login ? "LogOut": "LogIn"}</Button>
                        <PersonCircle color="white" size="1.6em" className="action-icon" />
                    </Navbar.Brand>
                </Container>

            </Navbar>
        </div>;
}

export default ExamNavbar;