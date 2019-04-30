pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BatchAddStakeHolders.sol";
import "../contracts/Swap.sol";

contract TestSwapTeamLock {
  function testTeamLockRule() public {
    address owner = tx.origin;
    BatchAddStakeHolders bash = new BatchAddStakeHolders();
    HolderLockStrategy teams = bash.teamMembers(owner);
    // 2019-4-30号，应该没有解锁的钱
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1556610990), 0, "锁仓未成功！");
    // 2019-5-25 07:59:59 AM 北京时间，应该没有解锁的钱
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1558828799), 0, "锁仓未成功！");
    // 2020-5-1 12:00:00 AM 北京时间，解锁20%
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1588262400), (8000 * 10 ** 18), "锁仓未成功！");
    // 2020-11-1 12:00:00 AM 北京时间，解锁40%
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1604160000), (16000 * 10 ** 18), "锁仓未成功！");
    // 2021-5-1 12:00:00 AM 北京时间，解锁60%
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1619798400), (24000 * 10 ** 18), "锁仓未成功！");
    // 2021-10-31 11:59:59 PM 北京时间，解锁60%
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1635695999), (24000 * 10 ** 18), "锁仓未成功！");
    // 2021-11-1 12:00:00 AM 北京时间，解锁80%
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1635696000), (32000 * 10 ** 18), "锁仓未成功！");
    // 2022-5-1 12:00:00 AM 北京时间，解锁100%
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1651334400), (40000 * 10 ** 18), "锁仓未成功！");
    // 2022-7-1 12:00:00 AM 北京时间，解锁100%
    Assert.equal(teams.calculateUnlockedAmount(0xDe4c503708520F595E74e2628490d8Db62B8Fd58, 1656604800), (40000 * 10 ** 18), "锁仓未成功！");

    // 2021-10-31 11:59:59 PM 北京时间，解锁60%
    Assert.equal(teams.calculateUnlockedAmount(0x0211a7D1250a75635f65E5872F7C664F89097597, 1635696000 - 1), (30000 * 10 ** 18), "锁仓未成功！");
    // 2022-5-1 12:00:00 AM 北京时间，解锁100%
    Assert.equal(teams.calculateUnlockedAmount(0x0211a7D1250a75635f65E5872F7C664F89097597, 1651334400), (50000 * 10 ** 18), "锁仓未成功！");
  }
}
