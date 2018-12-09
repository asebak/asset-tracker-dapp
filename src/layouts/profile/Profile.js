import React, { Component } from 'react'
import {AccountData} from "drizzle-react-components";
import PropTypes from 'prop-types'

class Profile extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.web3 = context.drizzle.web3;
        this.account = props.accounts[0];
        this.viewAssetHistory();
    }

     viewAssetHistory() {
         this.contracts.AssetTracker.methods.getAssetIds().call()
             .then(function (r) {
                 debugger;
                 console.log(r);
             }).catch(function (e) {
             console.log(e);
         });
     }

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

Profile.contextTypes = {
    drizzle: PropTypes.object
};

export default Profile
