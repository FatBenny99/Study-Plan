import './App.css';
import { useState, useEffect } from 'react';
import Home from "./routes/Home"
import Login from './routes/Login';
import Plan from './routes/Plan'
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {loadExamHeaders} from './models/Exam';

import {
 fetchAllExams,
 fetchAllIncompatibilities,
 logIn,
 logOut,
 getUserInfo,
 fetchStudyPlanExams,
 getUserPlan,
 fetchDeletePlan
} from './API';


function App() {

  //STATES FOR ALL THE EXAMS
  const [exams, setExams] = useState([]);
  const [headers,setHeaders]=useState([]);
  //STATE FOR LOGINS
  const [login,setLoggedIn]=useState(false);
  const [id,setId]=useState("");
  //STATES FOR ALL THE MESSAGES IN THE APPLICATION
  const [successmessage,setSuccessMessage]=useState("");
  const [failmessage,setFailMessage]=useState("");
  //STATES FOR THE STUDYPLAN
  const [planExams,setPlanExams]=useState([]);
  const [newPlan,setNewPlan]=useState(false);
  const [existPlan,setExistPlan]=useState(false);
  const [lowthreshold,setLowThreshold]=useState(0);
  const [hightreshold,setHighThreshold]=useState(0);
  const [edit,setEdit]=useState(true);



//Inizial fetch of the exams database with all the dependencies
  async function getAllExams(){
    try {
      
      const exams= await fetchAllExams();
         

         for(let exam of exams){
           const list= await fetchAllIncompatibilities(exam.code);
            for(let x of list)
            {
              exam.incompatibility.push(x);
            }
          }

      setExams(exams);
      return exams;
   }
   catch (err) {
      throw err;
   }
  }


  

  //Functions to Handle Login/Logout

  const handleLogin = async (credentials) => {
    try {
      const user = await logIn(credentials);
      setFailMessage("");
      setLoggedIn(true);
      setId(user.id);
      setSuccessMessage(`Welcome ${user.name}`);
    }catch(err) {
      console.log(err);
      setFailMessage("Errore nel login");
    }
  };
  const handleLogout = async () => {
    
    let exams=await fetchStudyPlanExams(id);
    if(exams.length===0)
    {
    await fetchDeletePlan(id);
    }


    await logOut();
    setLoggedIn(false);
    setId("");
    setExistPlan(false);
    setNewPlan(false);
    setPlanExams([]);
    setSuccessMessage('');
    setEdit(false);

  };



  //Effect at the start of the render to check if the user is already logged, if so i set the infos
  useEffect(() => {
    const checkAuth = async () => {
      await getUserInfo(); // we have the user info here
      setLoggedIn(true);
    };
    checkAuth();
    console.log(login);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //i fetch all the exams to show for the initial rendering
  useEffect(()=>
  {
    getAllExams();
    setHeaders(loadExamHeaders());
  
  },[]); 
  
  //useEffect for  handle logins and logout operations
  useEffect( ()=>{

    const fun = async() =>{
      
      if(login===true)
      {
   
        const planex=await fetchStudyPlanExams(id);
        const studyplan= await getUserPlan(id)
        //settings when the user logs
        if(studyplan!==null)
        {
          if(studyplan==="FullTime"){
            setHighThreshold(80);
            setLowThreshold(60);
          }
          else if(studyplan==="PartTime"){
            setHighThreshold(40);
            setLowThreshold(20);
          }

          setPlanExams(planex);
          setExistPlan(true);
          setNewPlan(false);
        }
        else
        {
          setPlanExams([]);
          setExistPlan(false);
          setNewPlan(false)
        }
      }

    }

   try{
    fun();
   }
   catch(err){
    console.log(err);
   }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[login])

  

//ROUTE HOME: Page when the user is anonymous(not logged) and when the user is logged but without a Plan Created
//ROUTE LOGIN: Page for the Login Operations
//ROUTE PLAN: Page for when the user has already selected which kind of plan he wants

  return (<>

  <BrowserRouter>
      <Container fluid className="vh-100">
        <Routes>
            <Route index element=
                {<Home 
                      exams={exams}
                      headers={headers}
                      login={login}
                      setLoggedIn={login}
                      failmessage={failmessage}
                      setFailMessage={setFailMessage}
                      successmessage={successmessage}
                      setSuccessMessage={setSuccessMessage}
                      handleLogout={handleLogout}        
                      newPlan={newPlan}     
                      setNewPlan={setNewPlan}       
                      setLowThreshold={setLowThreshold}
                      existPlan={existPlan}
                      setExistPlan={setExistPlan}
                      setHighThreshold={setHighThreshold}
                      id={id}
                  />}>
            </Route>

            <Route path="/login" element=
              {<Login
                      login={login}
                      setLoggedIn={login}
                      headers={headers} 
                      failmessage={failmessage}
                      setFailMessage={setFailMessage}
                      successmessage={successmessage}
                      setSuccessMessage={setSuccessMessage}
                      handleLogin={handleLogin}      
              />}>
            </Route>
            <Route path="/plan" element=
              {<Plan
                    exams={exams}
                    getAllExams={getAllExams}
                    headers={headers}
                    login={login}
                    setLoggedIn={login}
                    failmessage={failmessage}
                    setFailMessage={setFailMessage}
                    successmessage={successmessage}
                    setSuccessMessage={setSuccessMessage}
                    handleLogout={handleLogout}        
                    planExams={planExams}
                    setPlanExams={setPlanExams}
                    id={id}
                    edit={edit}
                    setEdit={setEdit}
                    setExistPlan={setExistPlan}
                    setNewPlan={setNewPlan}     
                    lowthreshold={lowthreshold}
                    hightreshold={hightreshold}
              />}>
            </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  </>);
}

export default App;
