import React, { Component } from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import HomeContainer from './layouts/home/HomeContainer'


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
              <Link to="/" className="pure-menu-heading pure-menu-link">Health Promoter</Link>
              <ul className="pure-menu-list navbar-left">
                  <li className="pure-menu-item">
                      <Link to="/profile" className="pure-menu-link">Profile</Link>
                  </li>
              </ul>
          </nav>
        <Route exact path="/" component={HomeContainer}/>
      </div>
    );
  }
}

export default App
