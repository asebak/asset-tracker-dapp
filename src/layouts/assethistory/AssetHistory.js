import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import TimelineIcon from '@material-ui/icons/Timeline';
import GpsIcon from '@material-ui/icons/LocationOn';
import QualityIcon from '@material-ui/icons/Healing';
import TemperatureIcon from '@material-ui/icons/AcUnit';
import HumidityIcon from '@material-ui/icons/Cloud';
import AccelerometerIcon from '@material-ui/icons/Cached';
import CustomIcon from '@material-ui/icons/Help';

class AssetHistory extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onEventCreated = this.onEventCreated.bind(this);
        this.onContractError = this.onContractError.bind(this);
        this.getAssetDetails = this.getAssetDetails.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.getEvent = this.getEvent.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
                eventName: '',
                type: "1",
                data: "",
                timestamp: ''
            },
            eventDetails: [],
            isEnabled: false
        };

        this.contracts.AssetTracker.events
            .AssetEventCreated({/* eventOptions */}, this.onEventCreated)
            .on('error', this.onContractError);
        this.getAssetDetails();
    }

    handleInputChange(event) {
        let targetName = event.target.name;
        let currentNewEvent = this.state.newEvent;
        currentNewEvent[targetName] = event.target.value;
        let isEnabled = false;
        if( this.state.newEvent.eventName && this.state.newEvent.timestamp) {
            isEnabled =
                this.state.newEvent.eventName.length > 0 &&
                this.state.newEvent.timestamp.length > 0;

        }
        this.setState({
            newEvent: currentNewEvent,
            isEnabled: isEnabled
        });
    }


    getAssetDetails() {
        const that = this;
        this.contracts.AssetTracker.methods.fetchAsset(this.assetId).call()
            .then(function (result) {
                that.setState({
                    asset: {
                        name: result[0],
                        rawId: result[1],
                        id: that.web3.utils.toUtf8(result[1]),
                        date: new Date(result[2] * 1000).toISOString(),
                        eventIds: result[3]
                    }
                });
                that.getEvents();
            }).catch(function (e) {
            console.log(e);
        });
    }

    createEvent() {
        let eventDate = Math.floor(new Date(this.state.newEvent.timestamp).getTime() / 1000);
        let data = [];
        if (this.state.newEvent.data) {
            data = this.state.newEvent.data.split("\n");
        }
        this.contracts.AssetTracker.methods.addEvent(this.assetId, this.web3.utils.fromAscii(Date.now().toLocaleString()), this.state.newEvent.eventName, this.state.newEvent.type,
            data.map((arg) => this.web3.utils.toHex(arg)), eventDate).send()
            .on('error', this.onContractError);
    }

    async getEvents() {
        const eventDetails = [];
        for (let i = 0; i < this.state.asset.eventIds.length; i++) {
            const result = await this.contracts.AssetTracker.methods.fetchEvent(this.state.asset.eventIds[i]).call();
            eventDetails.push({
                name: result[0],
                type: result[1],
                data: result[2].map((arg) => this.web3.utils.toUtf8(arg)),
                date: new Date(result[3] * 1000).toISOString()
            });
            this.setState({
                eventDetails: eventDetails
            })
        }
    }

    async getEvent(eventId) {
        let eventIds = this.state.asset.eventIds;
        var containsEventId = (eventIds.indexOf(eventId) > -1);
        if (!containsEventId) {
            var eventDetails = this.state.eventDetails;
            eventIds.push(eventId);
            const result = await this.contracts.AssetTracker.methods.fetchEvent(eventId).call();
            eventDetails.push({
                name: result[0],
                type: result[1],
                data: result[2].map((arg) => this.web3.utils.toUtf8(arg)),
                date: new Date(result[3] * 1000).toISOString()
            });
            this.setState({
                asset: {
                    eventIds: eventIds
                },
                eventDetails: eventDetails
            });
        }
    }

    onEventCreated(error, event) {
        if (!error) {
            this.setState({
                showTxMsg: true,
                txMsg: 'Event was created.',
                txClassName: "success",
                newEvent: {
                    assetId: this.assetId,
                    eventId: '',
                    eventName: '',
                    type: "1",
                    data: "",
                    timestamp: ''
                },
            });
            this.getEvent(event.raw.data);
        } else {
            this.onContractError(error);
        }
    }

    onContractError(error) {
        this.setState({
            showTxMsg: true,
            txMsg: 'An error occured: ' + error.message,
            txClassName: "error"
        });
    }

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
                            <select id="eventtype" onChange={this.onSelectChange}>
                                <option value="1">Location</option>
                                <option value="2">Quality</option>
                                <option value="3">Temperature</option>
                                <option value="4">Humidity</option>
                                <option value="5">Accelerometer</option>
                                <option value="6">Custom</option>
                            </select>
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="eventname">Event Name</label>
                            <input name="eventName" id="eventname" type="text" onChange={this.handleInputChange}/>
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="eventdata">Event Data</label>
                            <textarea name="data" id="eventdata" className="pure-input-1-1"
                                      onChange={this.handleInputChange}/>
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="eventdate">Event Date</label>
                            <input name="timestamp" id="eventdate" type="date" onChange={this.handleInputChange}/>
                        </div>
                    </fieldset>

                </form>
                <button type="button" disabled={!this.state.isEnabled} onClick={this.createEvent}
                        className="pure-button pure-button-primary">Add Event
                </button>
                <span hidden={!this.state.showTxMsg}
                      className={'pure-form-message ' + this.state.txClassName}>{this.state.txMsg}</span>
            </div>
        )
    }

    createTimeline() {
        this.state.eventDetails.sort(function(a,b){
            return new Date(a.date) - new Date(b.date);
        });
        let timeline = [];
        for (let i = 0; i < this.state.eventDetails.length; i++) {
            let icon = {};
            switch (this.state.eventDetails[i].type) {
                case "0":
                    icon = <TimelineIcon/>;
                    break;
                case "1":
                    icon = <GpsIcon/>;
                    break;
                case "2":
                    icon = <QualityIcon/>;
                    break;
                case "3":
                    icon = <TemperatureIcon/>;
                    break;
                case "4":
                    icon = <HumidityIcon/>;
                    break;
                case "5":
                    icon = <AccelerometerIcon/>;
                    break;
                case "6":
                    icon = <CustomIcon/>;
                    break;
                default:
                    break;
            }
            timeline.push(<VerticalTimelineElement className="vertical-timeline-element--work"
                                                   date={this.state.eventDetails[i].date} key={i}
                                                   iconStyle={{background: 'rgb(33, 150, 243)', color: '#fff'}}
                                                   icon={icon}>
                <h3 className="vertical-timeline-element-title">{this.state.eventDetails[i].name}</h3>
                <p>
                    {JSON.stringify(this.state.eventDetails[i].data)}
                </p>
            </VerticalTimelineElement>)
        }
        return timeline;
    }

    onSelectChange(event) {
        this.setState({
            newEvent: {
                type: event.target.value
            }
        });
    }
}

AssetHistory.contextTypes = {
    drizzle: PropTypes.object
};

export default AssetHistory
