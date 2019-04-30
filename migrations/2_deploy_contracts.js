const SwapCoin = artifacts.require("Swap");

module.exports = function(deployer) {
  deployer.deploy(SwapCoin);
};
