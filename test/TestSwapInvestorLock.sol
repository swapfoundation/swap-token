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
    // 2019-6-26 08:00:00 AM 北京时间，解锁20%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1561507200), (2000000 * 10 ** 18), "锁仓未成功！");
    // 2019-7-26 08:00:00 AM 北京时间，解锁30%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1564099200), (3000000 * 10 ** 18), "锁仓未成功！");
    // 2019-8-26 07:59:59 AM 北京时间，解锁40%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1566777599), (3000000 * 10 ** 18), "锁仓未成功！");
    // 2019-8-26 08:00:00 AM 北京时间，解锁40%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1566777600), (4000000 * 10 ** 18), "锁仓未成功！");
    // 2019-8-26 08:00:01 AM 北京时间，解锁40%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1566777601), (4000000 * 10 ** 18), "锁仓未成功！");
    // 2019-9-26 07:59:59 AM 北京时间，解锁40%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1569455999), (4000000 * 10 ** 18), "锁仓未成功！");
    // 2019-9-26 08:00:00 AM 北京时间，解锁50%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1569456000), (5000000 * 10 ** 18), "锁仓未成功！");
    // 2019-10-26 08:00:00 AM 北京时间，解锁60%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1572048000), (6000000 * 10 ** 18), "锁仓未成功！");
    // 2019-11-26 08:00:00 AM 北京时间，解锁70%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1574726400), (7000000 * 10 ** 18), "锁仓未成功！");
    // 2019-12-26 08:00:00 AM 北京时间，解锁80%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1577318400), (8000000 * 10 ** 18), "锁仓未成功！");
    // 2020-1-26 08:00:00 AM 北京时间，解锁90%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1579996800), (9000000 * 10 ** 18), "锁仓未成功！");
    // 2020-2-26 08:00:00 AM 北京时间，解锁100%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1582675200), (10000000 * 10 ** 18), "锁仓未成功！");
    // 2020-3-26 08:00:00 AM 北京时间，解锁100%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1585180800), (10000000 * 10 ** 18), "锁仓未成功！");
    // 2020-5-26 08:00:00 AM 北京时间，解锁100%
    Assert.equal(investors.calculateUnlockedAmount(0xD9018C7EF5020CD200d1ff508391fA2A440280Bc, 1590451200), (10000000 * 10 ** 18), "锁仓未成功！");

    // 2019-7-26 08:00:00 AM 北京时间，解锁30%
    Assert.equal(investors.calculateUnlockedAmount(0xb5d702F56BE396038189f75a14481C6d2e45Ad33, 1564099200), (90000 * 10 ** 18), "锁仓未成功！");
  }
}
