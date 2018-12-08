import React, { Component } from 'react'
import PropTypes from 'prop-types'

class RegisterAsset extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.handleRegisterAsset = this.handleRegisterAsset.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this)
        this.state = {
            identifier: '',
            assetName: '',
            date: Math.floor(new Date().getTime() / 1000)
        };
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    render() {
        return (
            <div className="pure-u-1-1">
                <h2>Register Asset</h2>
                <br/><br/>
                <form className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="identifier">Id</label>
                            <input name="identifier" type="text" value={this.state.id} onChange={this.handleInputChange}
                                   placeholder="Asset Id" required={true}/>
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Name</label>
                            <input name="assetName" type="text" value={this.state.name}
                                   onChange={this.handleInputChange} placeholder="Asset Name" required={true}/>
                        </div>

                        <div className="pure-controls">
                            <button type="button" className="pure-button pure-button-primary"
                                    onClick={() => this.handleRegisterAsset()}>Submit
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }

    handleRegisterAsset() {
        debugger;
        this.contracts.AssetTracker.methods.registerAsset(this.state.date, this.state.assetName, this.web3.utils.fromAscii(this.state.identifier)).send();
    }

}

RegisterAsset.contextTypes = {
    drizzle: PropTypes.object
};

export default RegisterAsset
