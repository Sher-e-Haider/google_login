import React,{useState} from 'react'
import './App.css';
import { GoogleLogin } from 'react-google-login'



function App() {
  const [loginData,setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      :null
  );
  
  const handleFailure=(res)=>{
      alert(res)
  }
  const handleLogin=async(googleData)=>{
       console.log(googleData);
       const res = await fetch('/api/google-login',{
         method:'POST',
         body: JSON.stringify({
           token:googleData.tokenId,
         }),
         headers:{
           'Content-Type':'application/json'
         }
       })
       const data = await res.json()
       setLoginData(data)
       localStorage.setItem('loginData',JSON.stringify(data))
  }
  const handleLogout=()=>{
    localStorage.removeItem('loginData')
    setLoginData(null)
  }
  return (
    <div className="App">
      <header className="App-header">
       <h1>React Google Login App</h1>
       <div>
         {
           loginData?(
             <div>
               <h3>You logged in as {loginData.email}</h3>
               <button onClick={handleLogout} >Logout</button>
             </div>
              
           ):(
              <GoogleLogin 
                      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                      buttonText="Log in with google"
                      onSuccess={handleLogin}
                      onFailure={handleFailure}
                     
                    >
              </GoogleLogin> 
           )
         }
        
       </div>
       
       </header>
    
    </div>
  );
}

export default App;
