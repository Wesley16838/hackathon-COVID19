import React, { useState, useContext,useEffect } from 'react';
import firebase from "../firebase";
import {
  withRouter
} from 'react-router-dom'
import { AuthContext } from "./../App";

import axios from 'axios'

function Signup(props) {

    const Auth = useContext(AuthContext);
 
    const handleForm = e => {
      e.preventDefault();
     

    };
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    useEffect(() => {
      if ("geolocation" in navigator) {
        // check if geolocation is supported/enabled on current browser
        navigator.geolocation.getCurrentPosition(
            function success(position) {
                // for when getting location is a success
             
                setLat(position.coords.latitude)
                setLng(position.coords.longitude)
                localStorage.setItem('lat',position.coords.latitude)
                localStorage.setItem('lng',position.coords.longitude)
            }.bind(this),
            function error(error_message) {
                // for when getting location results in an error
                console.error('An error has occured while retrievinglocation', error_message)
            }
        );
    } else {
        // geolocation is not supported
        // get your location some other way
        console.log('geolocation is not enabled on this browser')
    }
    }, []);
    
    return (
      <div className="signup">
        <h2>Sign Up</h2>
        <form onSubmit={e => handleForm(e)}>  
        <div className="form-group">
            <label htmlFor='displayName' >Username:</label>
            <input
              type="text"
              name="displayName"
              onChange={event => {
                setUsername(event.target.value);
              }}
              value={username}
              id='displayName'
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor='email' >Email:</label>
            <input
              autoComplete="email"
              type="email"
              name="email"
              onChange={event => {
                setEmail(event.target.value);
              }}
              value={email}
              id='email'
            />
          </div>
          
          <div className="form-group">
            <label htmlFor='password' >Password:</label>
            <input
              autoComplete="new-password"
              type="password"
              name="password"
              onChange={event => {
                setPassword(event.target.value);
              }}
              value={password}
              id='password'
            />
          </div>
          <div className="form-group">
            <button type="submit" className="basicBtn"  onClick={onRegister}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
    async function onRegister(){
      try{
        if(username==''){
          throw new Error('Please input your Username');
        }
        await firebase.register(username, email, password)
        let user = await axios.post('/add_user',{
          username:username,
          password:password,
          email:email,
          Lat:lat,
          Long_:lng
        })   
        Auth.setLoggedIn(true);
        localStorage.setItem('userId',user.data._id)
        props.history.push('/home')
      }catch(e){
        alert(e.message)
      }
    }
  }

  export default withRouter(Signup)
