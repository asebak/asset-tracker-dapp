import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Home extends Component {
    constructor(props, context) {
        super(props);
        this.handleViewHistory = this.handleViewHistory.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.contracts = context.drizzle.contracts;
        this.state = {
            identifier: ''
        };
        this.web3 = context.drizzle.web3;
        this.account = props.accounts[0];

    }

    async handleViewHistory() {
        const result = await this.contracts.AssetTracker.methods.fetchAsset(this.web3.utils.fromAscii(this.state.identifier)).call({from: this.account});
        debugger;
    }

    handleInputChange(event) {
        this.setState({identifier: event.target.value})
    }

    render() {
        return (
            <div className="pure-u-1-1">
                <h2>Asset Tracker</h2>
                <form className="pure-form">
                    <fieldset>
                        <legend>View an asset's history</legend>
                        <input value={this.state.identifier} onChange={this.handleInputChange} type="text"
                               placeholder="Id"/>
                        <button type="button" onClick={this.handleViewHistory}
                                className="pure-button pure-button-primary">View History
                        </button>
                    </fieldset>
                </form>
            </div>
        )
    }
}

Home.contextTypes = {
    drizzle: PropTypes.object
};

export default Home
