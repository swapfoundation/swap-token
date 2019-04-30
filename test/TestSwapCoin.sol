pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Swap.sol";

contract TestSwapCoin {

 /*
  function testInitialBalanceUsingDeployedContract() public {
    Swap meta = Swap(DeployedAddresses.Swap());

    uint expected = 3100000000 * 10**18;

    Assert.equal(meta.balanceOf(tx.origin), expected, "Owner should have 10000 SwapCoin initially");
  }
  */

  function testInitialBalanceWithNewSwapCoin() public {
    Swap swap = new Swap();

    uint expected = 3100000000 * 10**18;

    // Assert.equal(swap.name, "SWAP", "Owner should have 31 Billion SwapCoin initially");
    // Assert.equal(swap.totalSupply, expected, "Owner should have 31 Billion SwapCoin initially");
    Assert.equal(swap.balanceOf(tx.origin), expected, "Owner should have 31 Billion SwapCoin initially");
  }

}
