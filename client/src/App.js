import React, {useState, useEffect}from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import './App.css';

//components
import Header from './component/header'
import Landing from './component/pages/landing'
import Signinpage from './component/pages/signinPage'
import Homepage from './component/pages/home'
import ProtectedRoute from './component/privateRoute'
//includes
import './Assets/css/styles.min.css'//css file

//Firebase
import firebase from 'firebase/app'
import 'firebase/auth';

export const AuthContext = React.createContext(null);

function onAuthStateChange(callback1,callback2,callback3) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      callback1(true);
      callback2(user.displayName)
      callback3(false)
    } else {

      callback1(false);
      callback2('')
      callback3(false)
    }
  });
}
function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [isLoading, setLoad] = useState(true)
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setLoggedIn,setUser,setLoad);
    return () => {
      unsubscribe();
    };
  }, []);
  if(isLoading){
    return <div className="loading">
    <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66">
      <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
        </div>
  }
  return(
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn,user, setUser }}>
      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/signin" component={Signinpage} />
            {/* <PrivateRoute exact path="/home" component={Homepage} />  */}
            <ProtectedRoute exact path="/home" component={Homepage} /> 
          </Switch>

        </div>
      </Router> 
   </AuthContext.Provider>
  )
  
}

export default App;
