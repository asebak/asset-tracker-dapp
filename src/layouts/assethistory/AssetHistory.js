import React, { Component } from 'react'
import PropTypes from 'prop-types'

class AssetHistory extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.onEventCreated = this.onEventCreated.bind(this);
        this.onContractError = this.onContractError.bind(this);
        this.assetId = props.match.params.assetId;
        this.state = {
            showTxMsg: false,
            txMsg: '',
            txClassName: '',
        };
        this.contracts.AssetTracker.events
            .AssetEventCreated({/* eventOptions */}, this.onEventCreated)
            .on('error', this.onContractError);
    }

    onEventCreated(error, event) {
        if (!error) {
            this.setState({
                showTxMsg: true,
                txMsg: 'Event was created with Id: ' + this.web3.utils.toUtf8(event.raw.data),
                txClassName: "success"
            });
        } else {
            this.onContractError(error);
        }
    }

    onContractError(error) {
        this.setState({
            showTxMsg: true,
            txMsg: 'An error occured: ' + JSON.stringify(error),
            txClassName: "error"
        });
    }

    render() {
        return (
            <div className="pure-u-1-1">
                <h2>History for Asset: {this.web3.utils.toUtf8(this.assetId)}</h2>
                <br/><br/>
            </div>
        )
    }

}

AssetHistory.contextTypes = {
    drizzle: PropTypes.object
};

export default AssetHistory
