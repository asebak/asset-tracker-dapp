import CalorieTracker from './../build/contracts/CalorieTracker.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545'
    }
  },
  contracts: [
      CalorieTracker
  ],
  events: {
      CalorieTracker: ['CalorieSettingsSet']
  },
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions