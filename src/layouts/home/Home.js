import React, { Component } from 'react'
//import { ContractData, ContractForm } from 'drizzle-react-components'

class Home extends Component {
  render() {
    return (
          /*<div className="pure-u-1-1">
            <h2>Calorie Tracker</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>
            <p><strong>Stored Value</strong>: <ContractData contract="CalorieTracker" method="settings"  methodArgs={[this.props.accounts[0]]} /></p>
            <ContractForm contract="CalorieTracker" method="addSettings" />
            <br/><br/>
          </div>
          */
        <div className="pure-u-1-1">
            <h2>Asset Tracker</h2>
            <form className="pure-form">
                <fieldset>
                    <legend>View an asset's history</legend>
                    <input type="text" placeholder="Id"/>
                    <button type="submit" className="pure-button pure-button-primary">View History</button>
                </fieldset>
            </form>
        </div>
    )
  }
}

export default Home
