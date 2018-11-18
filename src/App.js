import React, { Component } from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import HomeContainer from './layouts/home/HomeContainer'
import { AccountData } from 'drizzle-react-components'
import logo from './logo.png'


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import JournalContainer from "./layouts/journal/JournalContainer";
import Profile from "./user/layouts/profile/Profile";

class App extends Component {
    render() {
        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <img className="main-logo" src={logo} alt="Logo"/>
                    <Link to="/" className="pure-menu-heading">Health Promoter</Link>
                    <ul className="pure-menu-list navbar-right">
                        <li className="pure-menu-item">
                            <Link to="/profile" className="pure-menu-link">Profile</Link>
                        </li>
                    </ul>
                    <ul className="pure-menu-list navbar-right">
                        <li className="pure-menu-item">
                            <Link to="/journal" className="pure-menu-link">Journal</Link>
                        </li>

                    </ul>
                </nav>
                <br/>
                <br/>
                <AccountData accountIndex="0" units="ether" precision="3"/>
                <main className="container">
                    <div className="pure-g">
                    <Switch>
                            <Route exact={true} path="/" component={HomeContainer}/>
                            <Route exact={true} path="/journal" component={JournalContainer}/>
                            <Route exact={true} path="/profile" component={Profile}/>
                    </Switch>
                    </div>

                </main>
            </div>
        );
    }
}

export default App
