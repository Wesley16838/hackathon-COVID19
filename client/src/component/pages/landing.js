import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import help from '../../Assets/img/help.png'
import complete from '../../Assets/img/complete.png'
import handshake from '../../Assets/img/handshake.png'
import search from '../../Assets/img/search.png'
export default function Landing() {

  return (
    <div>
      <div className="header">
          <section className="headerLeft">
            <div className="leftContent">
             <h1>Search Help Trade Request</h1>
             <h2>Around of You</h2>
             <h3>Trade anywhere &amp; anytime</h3>
             <Link className="basicBtn" to='/signin'>Get Started</Link>
            </div>
          </section>
          <section className="headerRight">
            <img src={help} alt='help hand'/>
          </section>
      </div>
      <div className="bodyContent">
        <section>
          <h1>We Are Feature In</h1>
          <div className="bodyDetail">
            <div className="detail">
                <img src={search} alt='first step'/>
                <h2>Search Help</h2>
                <h3>Search Help Request Around of You</h3>
            </div>
            <div className="detail">
                <img src={handshake} alt='second step'/>
                <h2>Do Transaction</h2>
                <h3>Trading item with another user</h3>
            </div>
            <div className="detail">
                <img src={complete} alt='third step'/>
                <h2>Transaction Complete</h2>
                <h3>Completing transaction and help each other</h3>
            
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}