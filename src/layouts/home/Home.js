import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Home extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
    }
  render() {
    return (
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

Home.contextTypes = {
    drizzle: PropTypes.object
};

export default Home
