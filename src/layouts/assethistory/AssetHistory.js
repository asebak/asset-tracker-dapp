import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

class AssetHistory extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.onEventCreated = this.onEventCreated.bind(this);
        this.onContractError = this.onContractError.bind(this);
        this.getAssetDetails = this.getAssetDetails.bind(this);
        this.getEvent = this.getEvent.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.assetId = props.match.params.assetId;
        this.state = {
            showTxMsg: false,
            txMsg: '',
            txClassName: '',
            asset: {
                name: '',
                rawId: '',
                id: '',
                date: '',
                eventIds: []
            },
            newEvent: {
                assetId: this.assetId,
                eventId: '',
                name: '',
                type: 1,
                data: [],
                timestamp: ''

            },
            eventDetails: []
        };

        this.contracts.AssetTracker.events
            .AssetEventCreated({/* eventOptions */}, this.onEventCreated)
            .on('error', this.onContractError);
        this.getAssetDetails();
    }

    getAssetDetails() {
        const that = this;
        this.contracts.AssetTracker.methods.fetchAsset(this.assetId).call()
            .then(function (result) {
                // debugger;
                that.setState({
                    asset: {
                        name: result[0],
                        rawId: result[1],
                        id: that.web3.utils.toUtf8(result[1]),
                        date: new Date(result[2] * 1000).toISOString(),
                        eventIds: result[3]
                    }
                });
                that.getEvent();
            }).catch(function (e) {
            console.log(e);
        });
    }

    createEvent() {

    }

    async getEvent() {
        for (let i = 0; i < this.state.asset.eventIds.length; i++) {
            const result = await this.contracts.AssetTracker.methods.fetchEvent(this.assetId).call();
            const eventDetails = this.state.eventDetails;
            eventDetails.push({
                name: result[0],
                type: result[1],
                data: result[2],
                date: new Date(result[2] * 1000).toISOString()
            });
            this.setState({
                eventDetails: eventDetails
            })
        }
        this.createTimeline();
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

//ddEvent(bytes32 _assetId, bytes32 _eventId, string _name, uint _type, bytes32[] _data, uint256 _timestamp)
    render() {
        return (
            <div className="pure-u-1-1">
                <h2>History for Asset: {this.web3.utils.toUtf8(this.assetId)}</h2>
                <br/><br/>
                <VerticalTimeline>
                    {this.createTimeline()}
                </VerticalTimeline>
                <form className="pure-form pure-form-aligned">
                    <legend>Add Event to Asset</legend>
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="assetid">Asset Id</label>
                            <input id="assetid" type="text" value={this.web3.utils.toUtf8(this.assetId)}
                                   readOnly={true}/>
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="eventtype">Event Type</label>
                            <select id="eventtype"> /
                                <option>LOCATION</option>
                                <option>QUALITY</option>
                                <option>TEMPERATURE</option>
                                <option>HUMIDITY</option>
                                <option>ACCELEROMETER</option>
                                <option>CUSTOM</option>
                            </select>
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="eventname">Event Name</label>
                            <input id="eventname" type="text"/>
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="eventdata">Event Data</label>
                            <textarea id="eventdata" className="pure-input-1-1"/>
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="eventdate">Event Date</label>
                            <input id="eventdate" type="date"/>
                        </div>
                    </fieldset>

                </form>
                <button type="button" onClick={this.createEvent} className="pure-button pure-button-primary">Add Event
                </button>
                <span hidden={!this.state.showTxMsg}
                      className={'pure-form-message ' + this.state.txClassName}>{this.state.txMsg}</span>
            </div>
        )
    }

    createTimeline() {
        var timeline = [];
        for (let i = 0; i < this.state.eventDetails.length; i++) {
            timeline.push(<VerticalTimelineElement className="vertical-timeline-element--work" date={this.state.eventDetails[i].date} key={i} iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}>
                <h3 className="vertical-timeline-element-title">{this.state.eventDetails[i].name}</h3>
                <p>
                    {JSON.stringify(this.state.eventDetails[i].data)}
                </p>
            </VerticalTimelineElement>)
        }
        return timeline;
    }
}

AssetHistory.contextTypes = {
    drizzle: PropTypes.object
};

export default AssetHistory
