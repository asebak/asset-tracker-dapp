import React, { Component } from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import HomeContainer from './layouts/home/HomeContainer'
import { AccountData } from 'drizzle-react-components'
import logo from './logo.png'


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <img className="main-logo" src={logo} alt="Logo"></img>
              <Link to="/" className="pure-menu-heading">Health Promoter</Link>
              <ul className="pure-menu-list navbar-right">
                  <li className="pure-menu-item">
                      <Link to="/journal" className="pure-menu-link">Journal</Link>
                  </li>

              </ul>
              <ul className="pure-menu-list navbar-right">
                  <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
                      <a href="#" id="menuLink1" className="pure-menu-link">Profile</a>
                      <ul className="pure-menu-children">
                          <AccountData accountIndex="0" units="ether" precision="3" />
                      </ul>
                  </li>
              </ul>
          </nav>
        <Route exact path="/" component={HomeContainer}/>
      </div>
    );
  }
}

export default App
