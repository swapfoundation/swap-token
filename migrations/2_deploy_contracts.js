const SwapCoin = artifacts.require("Swap");
const SwapStakeHolders = artifacts.require("SwapStakeHolders");
const BatchAddStakeHolders = artifacts.require("BatchAddStakeHolders");

module.exports = function(deployer) {
  deployer.deploy(SwapCoin);
  deployer.deploy(SwapStakeHolders);
  deployer.deploy(BatchAddStakeHolders);
};
