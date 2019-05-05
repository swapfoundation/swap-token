pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BatchAddStakeHolders.sol";
import "../contracts/Swap.sol";

contract TestSwapInvestorLock {
  function testInvestorLockRule() public {
    address owner = tx.origin;
    BatchAddStakeHolders bash = new BatchAddStakeHolders();
    HolderLockStrategy investors = bash.investors(owner);
    // 2019-4-30号，应该没有解锁的钱
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1556610990), 0, "锁仓未成功！");
    // 2019-5-25 07:59:59 AM 北京时间，应该没有解锁的钱
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1558828799), 0, "锁仓未成功！");
    // 2019-5-26 08:00:00 AM 北京时间，解锁10%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1558828800), (1000000 * 10 ** 18), "锁仓未成功！");
    // 2019-6-26 08:00:00 AM 北京时间，解锁10%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1561507200), (1000000 * 10 ** 18), "锁仓未成功！");
    // 2019-6-27 08:00:00 AM 北京时间，解锁20%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1561622400), (2000000 * 10 ** 18), "锁仓未成功！");
    // 2019-7-27 12:30:00 AM 北京时间，解锁20%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1564158600), (2000000 * 10 ** 18), "锁仓未成功！");
    // 2019-7-27 08:30:00 AM 北京时间，解锁30%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1564187400), (3000000 * 10 ** 18), "锁仓未成功！");
    // 2019-8-27 12:59:59 AM 北京时间，解锁30%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1566838799), (3000000 * 10 ** 18), "锁仓未成功！");
    // 2019-8-27 08:00:00 AM 北京时间，解锁40%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1566892800), (4000000 * 10 ** 18), "锁仓未成功！");
    // 2019-8-27 08:00:01 AM 北京时间，解锁40%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1566892801), (4000000 * 10 ** 18), "锁仓未成功！");
    // 2019-9-27 12:29:00 AM 北京时间，解锁40%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1569515340), (4000000 * 10 ** 18), "锁仓未成功！");
    // 2019-9-27 08:00:00 AM 北京时间，解锁50%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1569571200), (5000000 * 10 ** 18), "锁仓未成功！");
    // 2019-10-27 08:00:00 AM 北京时间，解锁60%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1572163200), (6000000 * 10 ** 18), "锁仓未成功！");
    // 2019-11-27 08:00:00 AM 北京时间，解锁70%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1574841600), (7000000 * 10 ** 18), "锁仓未成功！");
    // 2019-12-27 08:00:00 AM 北京时间，解锁80%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1577433600), (8000000 * 10 ** 18), "锁仓未成功！");
    // 2020-1-27 08:00:00 AM 北京时间，解锁90%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1580112000), (9000000 * 10 ** 18), "锁仓未成功！");
    // 2020-2-27 08:00:00 AM 北京时间，解锁100%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1582790400), (10000000 * 10 ** 18), "锁仓未成功！");
    // 2020-3-27 08:00:00 AM 北京时间，解锁100%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1585296000), (10000000 * 10 ** 18), "锁仓未成功！");
    // 2020-5-27 08:00:00 AM 北京时间，解锁100%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1590566400), (10000000 * 10 ** 18), "锁仓未成功！");

    // 2019-7-28 08:00:00 AM 北京时间，解锁30%
    Assert.equal(investors.calculateUnlockedAmount(0xb5d702F56BE396038189f75a14481C6d2e45Ad33, 1564300800), (90000 * 10 ** 18), "锁仓未成功！");
  }
}
