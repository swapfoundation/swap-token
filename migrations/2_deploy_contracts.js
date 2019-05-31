const SwapCoin = artifacts.require("Swap");
const FundLockContract = artifacts.require("FundLockContract");
const SwapTeamMemberLockContract = artifacts.require("SwapTeamMemberLockContract");
const HolderLockStrategy = artifacts.require("HolderLockStrategy");

module.exports = function(deployer) {
  deployer.deploy(SwapCoin).then(function() {
    deployer.deploy(SwapTeamMemberLockContract, SwapCoin.address);
    deployer.deploy(FundLockContract, SwapCoin.address);
  });
  deployer.deploy(HolderLockStrategy);
};
