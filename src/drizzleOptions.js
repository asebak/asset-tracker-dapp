import AssetTracker from './../build/contracts/AssetTracker.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545'
    }
  },
  contracts: [
      AssetTracker
  ],
  events: {
      AssetTracker: ['AssetEventCreated', "AssetCreated"]
  },
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions