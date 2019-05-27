const SwapCoin = artifacts.require("Swap");
const TestLocker = artifacts.require("TestLocker");
const TestLocker2 = artifacts.require("TestLocker2");

module.exports = function(deployer) {
  deployer.deploy(SwapCoin);
  deployer.deploy(TestLocker);
  deployer.deploy(TestLocker2);
};
