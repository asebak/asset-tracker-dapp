import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import logo from '../../logo.png'

class Home extends Component {
  render() {
    return (
          <div className="pure-u-1-1">
            <h2>Calorie Tracker</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>
            <p><strong>Stored Value</strong>: <ContractData contract="CalorieTracker" method="settings"  methodArgs={[this.props.accounts[0]]} /></p>
            <ContractForm contract="CalorieTracker" method="addSettings" />
            <br/><br/>
          </div>
    )
  }
}

export default Home
