const SwapCoin = artifacts.require("Swap");
const BatchAddStakeHolders = artifacts.require("BatchAddStakeHolders");
const SwapStakeHolders = artifacts.require("SwapStakeHolders");
const HolderLockStrategy = artifacts.require("HolderLockStrategy");

contract('CheckOwnerShip', (accounts) => {
  it('should forbid no-owner do owner operation', async () => {
    const bash = await BatchAddStakeHolders.new();
    const stakes = await SwapStakeHolders.new();

    var owner = accounts[0];
    // investors
    // 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc
    const accountOne = accounts[1];
    // 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F
    const accountTwo = accounts[2];
    var response = await bash.investors(owner);
    var investors = await HolderLockStrategy.at(response.logs[0].args.addr);
    response = await bash.teamMembers(owner);
    var teams = await HolderLockStrategy.at(response.logs[0].args.addr);
    response = await bash.funds(owner);
    var funds = await HolderLockStrategy.at(response.logs[0].args.addr);    
    const SwapCoinInstance = await SwapCoin.new();

    // 2020-5-3 8:00:00 AM，
    var today = new Date(2020, 4, 3, 8, 0, 0).getTime() / 1000;
    // 非owner无法设置锁仓代码要求的时间
    try {
        await investors.setToday(today, {from: accountTwo});
        assert.fail("非owner不应该可以设置锁仓的时间！");
    } catch (e) {}
    try {
        await teams.setToday(today, {from: accountTwo});
        assert.fail("非owner不应该可以锁仓的时间！");
    } catch (e) {}
    try {
        await funds.setToday(today, {from: accountTwo});
        assert.fail("非owner不应该可以锁仓的时间！");
    } catch (e) {}

    // 非owner无法设置stakehold
    try {
        await stakes.addLockStrategy(investors.address, {from: accountTwo});
        assert.fail("非owner不应该可以添加stakehold！");
    } catch (e) {}
    try {
        await stakes.addLockStrategy(teams.address, {from: accountTwo});
        assert.fail("非owner不应该可以添加stakehold！");
    } catch (e) {}
    try {
        await stakes.addLockStrategy(funds.address, {from: accountTwo});
        assert.fail("非owner不应该可以添加stakehold！");
    } catch (e) {}

    // 非owner不可以设置锁仓规则
    try {
        await SwapCoinInstance.setLockStrategy(stakes.address, {from: accountTwo});
        assert.fail("非owner不应该可以设置锁仓规则！");
    } catch (e) {}

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
    const bash = await BatchAddStakeHolders.new();
    const stakes = await SwapStakeHolders.new();

    var owner = accounts[0];
    // investors
    // 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc
    const accountOne = accounts[1];
    // 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F
    const accountTwo = accounts[2];
    var response = await bash.investors(owner);
    var investors = await HolderLockStrategy.at(response.logs[0].args.addr);
    response = await bash.teamMembers(owner);
    var teams = await HolderLockStrategy.at(response.logs[0].args.addr);
    response = await bash.funds(owner);
    var funds = await HolderLockStrategy.at(response.logs[0].args.addr);    
    const SwapCoinInstance = await SwapCoin.new();

    // 2020-5-3 8:00:00 AM，
    var today = new Date(2020, 4, 3, 8, 0, 0).getTime() / 1000;
    // owner可以设置锁仓代码要求的时间
    await investors.setToday(today, {from: owner});
    var actual = await investors.getDate();
    assert.equal(today, actual, "owner无法设置锁仓的时间！");
    await teams.setToday(today, {from: owner});
    actual = await teams.getDate();
    assert.equal(today, actual, "owner无法设置锁仓的时间！");
    await funds.setToday(today, {from: owner});
    actual = await funds.getDate();
    assert.equal(today, actual, "owner无法设置锁仓的时间！");

    // owner可以设置stakehold
    await stakes.addLockStrategy(investors.address, {from: owner});
    await stakes.addLockStrategy(teams.address, {from: owner});
    await stakes.addLockStrategy(funds.address, {from: owner});

    // owner可以设置锁仓规则
    await SwapCoinInstance.setLockStrategy(stakes.address, {from: owner});

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
