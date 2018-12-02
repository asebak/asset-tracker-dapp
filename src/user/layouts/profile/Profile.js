import React, { Component } from 'react'
import {AccountData} from "drizzle-react-components";

class Profile extends Component {
  render() {
    return(
          <div className="pure-u-1-1">
            <h2>Profile</h2>
              <AccountData accountIndex="0" units="ether" precision="3"/>
            <h2>Asset History</h2>
          </div>
    )
  }
}

export default Profile
