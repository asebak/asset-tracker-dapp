import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Link} from "react-router-dom";

class Home extends Component {
    constructor(props, context) {
        super(props);
        this.handleViewHistory = this.handleViewHistory.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.contracts = context.drizzle.contracts;
        this.state = {
            identifier: '',
            asset: {
                date: '',
                name: '',
                id: '',
                rawId: ''
            }
        };
        this.web3 = context.drizzle.web3;
        this.account = props.accounts[0];
    }

    handleViewHistory() {
        const that = this;
        this.contracts.AssetTracker.methods.fetchAsset(this.web3.utils.fromAscii(this.state.identifier)).call()
            .then(function (result) {
                that.setState({
                    asset: {
                        name: result[0],
                        rawId: result[1],
                        id: that.web3.utils.toUtf8(result[1]),
                        date: new Date(result[2] * 1000).toISOString()
                    }
                });
                console.log(result);
            }).catch(function (e) {
            console.log(e);
        });
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
                        <legend>Search an asset</legend>
                        <input value={this.state.identifier} onChange={this.handleInputChange} type="text"
                               placeholder="Id"/>
                        <button type="button" onClick={this.handleViewHistory}
                                className="pure-button pure-button-primary">View Asset
                        </button>
                            <br/>
                        <br/>
                        <table hidden={this.state.asset.name === ''} className="pure-table pure-table-bordered">
                            <thead>
                            <tr>
                                <th>Asset Id</th>
                                <th>Name</th>
                                <th>Date Created</th>
                                <th>History</th>
                            </tr>
                            </thead>

                            <tbody>
                            <tr>
                                <td>{this.state.asset.id}</td>
                                <td>{this.state.asset.name}</td>
                                <td>{this.state.asset.date}</td>
                                <td>
                                    <Link to={'/assethistory/' + this.state.asset.rawId} className="pure-menu-link">View</Link>
                                </td>
                            </tr>
                            </tbody>
                        </table>
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
