const SwapCoin = artifacts.require("Swap");
const TestLocker = artifacts.require("TestLocker");

contract('CheckOwnerShip', (accounts) => {
  it('should forbid no-owner do owner operation', async () => {
    var owner = accounts[0]; 
    var accountOne = accounts[1];
    const SwapCoinInstance = await SwapCoin.new();

    // 非owner不可以设置锁仓合约
    var lockerAddr = '0x1';
    try {
        await SwapCoinInstance.setLockStrategy(lockerAddr, {from: accountOne});
        assert.fail("非owner不应该可以设置锁仓合约！");
    } catch (e) {}
  });

  it('允许owner设置锁仓合约', async () => {
    var owner = accounts[0];
    var accountOne = accounts[1];
    const SwapCoinInstance = await SwapCoin.new();
    const TestLockerInstance = await TestLocker.deployed();

    // owner可以增发
    var balanceBefore = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(0, balanceBefore, "账户1的余额不对！");

    console.log(TestLockerInstance.address);
    await SwapCoinInstance.setLockStrategy(TestLockerInstance.address, {from: owner});
    var available = (await SwapCoinInstance.availableBalanceOf.call(owner)).toNumber();
    assert.equal(web3.toWei(100000000, "ether"), available, "锁仓规则设置无效！");

    // Make transaction from first account to second.
    var amount = web3.toWei(100000001, "ether");
    try {
      await SwapCoinInstance.transfer(accountOne, amount, { from: owner });
      assert.fail("锁仓规则设置无效！");
    } catch (e) {}

    amount = web3.toWei(10000000, "ether");
    await SwapCoinInstance.transfer(accountOne, amount, { from: owner });
    available = (await SwapCoinInstance.availableBalanceOf.call(owner)).toNumber();
    assert.equal(web3.toWei(100000000 - 10000000, "ether"), available, "锁仓转账后无法获取正确的可用余额！");
    available = (await SwapCoinInstance.balanceOf.call(owner)).toNumber();
    assert.equal(web3.toWei(3100000000 - 10000000, "ether"), available, "锁仓转账后无法获取正确的余额！");
    available = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(web3.toWei(10000000, "ether"), available, "锁仓转账失败！");
  });
});
