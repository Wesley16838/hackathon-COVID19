import React,{useContext} from 'react';
import { BrowserRouter as Router,  Route, Link } from "react-router-dom"
import {
  withRouter
} from 'react-router-dom'
import { AuthContext } from "./../App";
import firebase from './../firebase'
function Header(props) {
  const Auth = useContext(AuthContext);
  return (
    <header>
      <AuthContext.Consumer>
      {({ isLoggedIn, user }) => (
        <React.Fragment>
          <div className='headerLeft'>
          <div className="logo">
              {
                  isLoggedIn
                  ?  <Link to="/home"><h1>HeartTrade</h1></Link>
                  :  <Link to="/"><h1>HeartTrade</h1></Link>
              }
          </div>
          </div>
          
          <nav>
              <ul>
                  <li>
                  
                  {
                      isLoggedIn
                      ? <div className='headerRight'>
                          <p>Hello {user} </p>
                          <Link className="basicBtn" to='/' onClick={logout}>Log Out</Link> 
                        </div>
                      : <Link className="basicBtn" to='/signin' >Sign In</Link> 
                  }
                    
                  </li>
              </ul>
          </nav>
        </React.Fragment>
      )}
      
      </AuthContext.Consumer>
    </header>
  );
  async function logout() {
    await firebase.logout()
    Auth.setLoggedIn(false);
    localStorage.removeItem('userId')
    localStorage.removeItem('lat')
    localStorage.removeItem('lng')
		props.history.push('/')
	}
}



export default  withRouter(Header);