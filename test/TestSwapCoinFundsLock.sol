pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BatchAddStakeHolders.sol";
import "../contracts/Swap.sol";

contract TestSwapCoinFundsLock {
  function testFundsLockRule() public {
    address owner = tx.origin;
    BatchAddStakeHolders bash = new BatchAddStakeHolders();
    HolderLockStrategy funds = bash.funds(owner);
    
    Assert.equal(funds.calculatePhase(1556610990), uint(0), "出错啦");
    Assert.equal(funds.calculatePhase(1651334399), uint(1), "出错啦");
    Assert.equal(funds.calculatePhase(1651334400), uint(2), "出错啦");
    Assert.equal(funds.calculatePhase(1667232000), uint(3), "出错啦");

    // 2019-4-30号，应该没有解锁的钱
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1556610990), 0, "锁仓未成功！");
    // 2019-5-25 07:59:59 AM 北京时间，应该没有解锁的钱
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1558828799), 0, "锁仓未成功！");
    // 2022-5-1 12:00:00 AM 北京时间，解锁20%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1651334400), (1600000 * 10 ** 18), "锁仓未成功！");
    // 2022-11-1 12:00:00 AM 北京时间，解锁40%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1667232000), (3200000 * 10 ** 18), "锁仓未成功！");
    // 2023-5-1 12:00:00 AM 北京时间，解锁60%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1682870400), (4800000 * 10 ** 18), "锁仓未成功！");
    // 2023-5-1 12:00:01 AM 北京时间，解锁60%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1682870400 + 1), (4800000 * 10 ** 18), "锁仓未成功！");
    // 2023-10-31 11:59:59 AM 北京时间，解锁80%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1698768000 - 1), (4800000 * 10 ** 18), "锁仓未成功！");
    // 2023-11-1 12:00:00 AM 北京时间，解锁80%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1698768000), (6400000 * 10 ** 18), "锁仓未成功！");
    // 2024-5-1 12:00:00 AM 北京时间，解锁100%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1714492800), (8000000 * 10 ** 18), "锁仓未成功！");
    // 2024-7-1 12:00:00 AM 北京时间，解锁100%
    Assert.equal(funds.calculateUnlockedAmount(0xB73B30D19A58c745D765b40171C03b5918E7B41D, 1719763200), (8000000 * 10 ** 18), "锁仓未成功！");
  }
}
