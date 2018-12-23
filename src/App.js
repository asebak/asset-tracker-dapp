import React, { Component } from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import HomeContainer from './layouts/home/HomeContainer'


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import RegisterAssetContainer from "./layouts/registerasset/RegisterAssetContainer";
import ProfileContainer from "./layouts/profile/ProfileContainer";
import AssetHistoryContainer from "./layouts/assethistory/AssetHistoryContainer";

class App extends Component {
    render() {
        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <Link to="/" className="pure-menu-heading">Asset Tracker</Link>
                    <ul className="pure-menu-list navbar-right">
                        <li className="pure-menu-item">
                            <Link to="/profile" className="pure-menu-link">Profile</Link>
                        </li>
                    </ul>
                    <ul className="pure-menu-list navbar-right">
                        <li className="pure-menu-item">
                            <Link to="/register" className="pure-menu-link">Register Asset</Link>
                        </li>
                    </ul>
                </nav>
                <br/>
                <br/>
                <main className="container">
                    <div className="pure-g">
                    <Switch>
                            <Route exact={true} path="/" component={HomeContainer}/>
                            <Route exact={true} path="/register" component={RegisterAssetContainer}/>
                            <Route exact={true} path="/profile" component={ProfileContainer}/>
                            <Route path="/assethistory/:assetId" component={AssetHistoryContainer}/>
                    </Switch>
                    </div>

                </main>
            </div>
        );
    }
}

export default App
