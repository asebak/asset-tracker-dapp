import React, { Component } from 'react'
import {AccountData} from "drizzle-react-components";
import PropTypes from 'prop-types'
import {Link} from "react-router-dom";

class Profile extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.web3 = context.drizzle.web3;
        this.account = props.accounts[0];
        this.state = {
          assetIds: []
        };
        this.viewAssetHistory();
    }

     viewAssetHistory() {
        var that = this;
         this.contracts.AssetTracker.methods.getAssetIds().call()
             .then(function (r) {
                 that.setState({
                     assetIds: r
                 });
             }).catch(function (e) {
             console.log(e);
         });
     }

  render() {
    return(
          <div className="pure-u-1-1">
            <h2>Profile</h2>
              <AccountData accountIndex="0" units="ether" precision="3"/>
            <h2>Asset's Created</h2>
              <table hidden={this.state.assetIds.length === 0} className="pure-table pure-table-bordered">
                  <thead>
                  <tr>
                      <th>Asset Id</th>
                      <th>View</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.createTableRows()}
                  </tbody>
              </table>
          </div>
    )
  }

    createTableRows = () => {
            let row = [];
            for (let i = 0; i < this.state.assetIds.length; i++) {
                let children = [];
                children.push(<td key={i + 'id'}>{this.web3.utils.toUtf8(this.state.assetIds[i])}</td>);
                children.push(<td key={i + 'history'}><Link to={'/assethistory/' + this.state.assetIds[i]} className="pure-menu-link">View</Link></td>);
                row.push(<tr key={i}>{children}</tr>)
            }
            return row;
        }
}

Profile.contextTypes = {
    drizzle: PropTypes.object
};

export default Profile
