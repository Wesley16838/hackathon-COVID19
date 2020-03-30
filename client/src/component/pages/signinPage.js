import React, {useCallback} from 'react';
import LoginView from "../signin"
import Signup from "../signup"
import firebase from 'firebase/app';

function login(username, password) {
  firebase.auth().signInWithEmailAndPassword(username, password);
}

export default function Signinpage() {

  const requestLogin = useCallback((username, password) => {
    login(username, password);
  });
    return(
          <div className="signin-container">
            <section>
              <LoginView onClick={requestLogin}/>
              <div className="or">
                <h2>Or</h2>
              </div>
         
                <Signup/>
            
            </section>
          </div>

    )
  
}


