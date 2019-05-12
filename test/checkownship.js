const SwapCoin = artifacts.require("Swap");

contract('CheckOwnerShip', (accounts) => {
  it('should forbid no-owner do owner operation', async () => {
    var owner = accounts[0]; 
    var accountOne = accounts[1];
    const SwapCoinInstance = await SwapCoin.new();

    // 非owner不可以增发
    var balanceBefore = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    try {
        await SwapCoinInstance.mint(accountOne, web3.toWei(10000000, "ether"), {from: accountOne});
        assert.fail("非owner不应该可以增发！");
    } catch (e) {}
    var balanceAfter = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(balanceBefore, balanceAfter, "非owner不应该可以增发！");

    // 非owner不可以销毁
    try {
        await SwapCoinInstance.burn(accountOne, web3.toWei(10000000, "ether"), {from: accountOne});
        assert.fail("非owner不应该可以销毁！");
    } catch (e) {}
    var balanceAfter = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(balanceBefore, balanceAfter, "非owner不应该可以销毁！");

    // 非owner不可以停止
    try {
        await SwapCoinInstance.pause({from: accountOne});
        assert.fail("非owner不应该可以停止！");
    } catch (e) {}
    var paused = (await SwapCoinInstance.paused.call());
    assert.isFalse(paused, "非owner不应该可以停止！");
  });

  it('should allow owner do owner operation', async () => {
    var owner = accounts[0];
    var accountOne = accounts[1];
    const SwapCoinInstance = await SwapCoin.new();

    // owner可以增发
    var balanceBefore = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(0, balanceBefore, "账户1的余额不对！");
    await SwapCoinInstance.mint(accountOne, web3.toWei(10000000, "ether"), {from: owner});
    var balanceAfter = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(web3.toWei(10000000, "ether"), balanceAfter, "owner无法增发！");
    var totalSupplyAfter = (await SwapCoinInstance.totalSupply.call()).toNumber();
    assert.equal(web3.toWei(3100000000 + 10000000, "ether"), totalSupplyAfter, "owner无法增发！");

    // owner可以销毁
    await SwapCoinInstance.burn(accountOne, web3.toWei(10000000, "ether"), {from: owner});
    balanceAfter = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(balanceBefore, balanceAfter, "owner无法销毁！");
    assert.equal(0, balanceAfter, "owner无法销毁！");
    totalSupplyAfter = (await SwapCoinInstance.totalSupply.call()).toNumber();
    assert.equal(web3.toWei(3100000000, "ether"), totalSupplyAfter, "owner无法增发！");

    // owner可以停止
    await SwapCoinInstance.pause({from: owner});
    var paused = (await SwapCoinInstance.paused.call());
    assert.isTrue(paused, "owner无法停止！");
  });
});
