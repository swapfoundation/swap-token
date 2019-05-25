const SwapCoin = artifacts.require("Swap");
const TestLocker = artifacts.require("TestLocker");

module.exports = function(deployer) {
  deployer.deploy(SwapCoin);
  deployer.deploy(TestLocker);
};
