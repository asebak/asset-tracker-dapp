var CalorieTracker = artifacts.require("CalorieTracker");

module.exports = function(deployer) {
  deployer.deploy(CalorieTracker);
};
