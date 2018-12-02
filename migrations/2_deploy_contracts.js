var AssetTracker = artifacts.require("AssetTracker.sol");

module.exports = function(deployer) {
    deployer.deploy(AssetTracker);
};
