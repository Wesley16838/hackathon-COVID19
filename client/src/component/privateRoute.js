import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from "./../App";

  const ProtectedRoute = ({ component: Component, ...rest }) => (  
    <AuthContext.Consumer>    
        {({ isLoggedIn }) => (      
            <Route        
                render={ props => isLoggedIn? <Component {...props} /> : <Redirect to="/signin" />}{...rest}/>)}
    </AuthContext.Consumer>)

export default ProtectedRoute;