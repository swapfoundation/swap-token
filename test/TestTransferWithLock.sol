pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BatchAddStakeHolders.sol";
import "../contracts/Swap.sol";

contract TestTransferWithLock {
  function testInitialBalanceWithNewSwapCoin() public {
    address owner = tx.origin;
    BatchAddStakeHolders bash = new BatchAddStakeHolders();
    SwapStakeHolders stakes = new SwapStakeHolders();
    HolderLockStrategy investors = bash.investors(owner);
    HolderLockStrategy teams = bash.teamMembers(owner);
    HolderLockStrategy funds = bash.funds(owner);

    // 2019-5-27 12:00:00 AM，没有人能够转币
    uint today = 1556668800;
    investors.setToday(today);
    teams.setToday(today);
    funds.setToday(today);
    stakes.addLockStrategy(investors);
    stakes.addLockStrategy(teams);
    stakes.addLockStrategy(funds);

    Swap swap = new Swap();
    swap.setLockStrategy(stakes);

    Assert.equal(stakes.lockedBalanceOf(0xB73B30D19A58c745D765b40171C03b5918E7B41D), 8000000 * 10 ** 18, "基金锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xDe4c503708520F595E74e2628490d8Db62B8Fd58), 40000 * 10 ** 18, "团队锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0x0211a7D1250a75635f65E5872F7C664F89097597), 50000 * 10 ** 18, "团队锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc), 10000000 * 10 ** 18, "机构锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F), 2000000 * 10 ** 18, "机构锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xb5d702F56BE396038189f75a14481C6d2e45Ad33), 300000 * 10 ** 18, "机构锁仓失败！");

    // 2019-5-27 12:00:00 AM，机构可以动10%
    today = 1558886400;
    investors.setToday(today);
    teams.setToday(today);
    funds.setToday(today);

    Assert.equal(stakes.lockedBalanceOf(0xB73B30D19A58c745D765b40171C03b5918E7B41D), 8000000 * 10 ** 18, "基金锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xDe4c503708520F595E74e2628490d8Db62B8Fd58), 40000 * 10 ** 18, "团队锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0x0211a7D1250a75635f65E5872F7C664F89097597), 50000 * 10 ** 18, "团队锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc), 1000000 * 10 ** 18 * 9, "机构锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F), 200000 * 10 ** 18 * 9, "机构锁仓失败！");
    Assert.equal(stakes.lockedBalanceOf(0xb5d702F56BE396038189f75a14481C6d2e45Ad33), 30000 * 10 ** 18 * 9, "机构锁仓失败！");
  }
}
