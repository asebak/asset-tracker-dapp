import RegisterAsset from './RegisterAsset'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    AssetTracker: state.contracts.AssetTracker,
    drizzleStatus: state.drizzleStatus
  }
};

const RegisterAssetContainer = drizzleConnect(RegisterAsset, mapStateToProps);

export default RegisterAssetContainer
