const SwapCoin = artifacts.require("Swap");
const BatchAddStakeHolders = artifacts.require("BatchAddStakeHolders");
const SwapStakeHolders = artifacts.require("SwapStakeHolders");
const HolderLockStrategy = artifacts.require("HolderLockStrategy");

contract('LockSwap', (accounts) => {
  it('should locked investor coin correctly before 2019-5-3 8:00:00 AM', async () => {
    const bash = await BatchAddStakeHolders.new();
    const stakes = await SwapStakeHolders.new();

    var owner = accounts[0];
    // investors
    // 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc
    const accountOne = accounts[1];
    // 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F
    const accountTwo = accounts[2];
    var response = await bash.investors(owner);
    // console.log(response);
    // console.log(response.logs[0].args);
    var investors = await HolderLockStrategy.at(response.logs[0].args.addr);
    response = await bash.teamMembers(owner);
    var teams = await HolderLockStrategy.at(response.logs[0].args.addr);
    response = await bash.funds(owner);
    var funds = await HolderLockStrategy.at(response.logs[0].args.addr);

    const SwapCoinInstance = await SwapCoin.new();
    // 给两个账号转账
    await SwapCoinInstance.transfer(accountOne, web3.toWei(10000000, "ether"), { from: owner });
    await SwapCoinInstance.transfer(accountTwo, web3.toWei(2000000, "ether"), { from: owner });

    // 2019-5-3 8:00:00 AM，没有人能够转币,Date的构造函数月份是从0开始的
    var today = new Date(2019, 4, 3, 8, 0, 0).getTime() / 1000;
    // console.log('name: ' + (await investors.name.call()));
    await investors.setToday(today, {from: owner});
    await teams.setToday(today);
    await funds.setToday(today);
    await stakes.addLockStrategy(investors.address);
    await stakes.addLockStrategy(teams.address);
    await stakes.addLockStrategy(funds.address);
    await SwapCoinInstance.setLockStrategy(stakes.address);

    var available = await SwapCoinInstance.availableBalanceOf.call(accountOne);
    assert.isTrue(available.eq(0), "账户1的可用余额不对！");
    available = await SwapCoinInstance.availableBalanceOf.call(accountTwo);
    assert.isTrue(available.eq(0), "账户2的可用余额不对！");

    const amount = web3.toWei(100, "ether");
    try {
      await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });
      assert.fail("不应该可以转账！");
    } catch (error) {}

    var balance = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    assert.equal(web3.toWei(10000000, "ether"), balance, "转账数额错了！");
  });

  it('should locked investor coin correctly after 2019-5-27 8:00:00 AM', async () => {
    const bash = await BatchAddStakeHolders.new();
    const stakes = await SwapStakeHolders.new();

    var owner = accounts[0];
    // 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc
    const accountOne = accounts[1];
    // 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F
    const accountTwo = accounts[2];
    var response = await bash.investors(owner);
    var investors = await HolderLockStrategy.at(response.logs[0].args.addr);
    const SwapCoinInstance = await SwapCoin.new();

    // var today = new Date('2019-5-27 08:00:00').getTime() / 1000;
    // 2019-5-27 8:00:00 AM，Date的构造函数月份是从0开始的
    var today = new Date(2019, 4, 27, 8, 0, 0).getTime() / 1000;
    // console.log(new Date(2019, 5, 27, 8, 0, 0).toString());
    // console.log(new Date('2019-5-27 08:00:00').toString());
    await investors.setToday(today, {from: owner});
    await stakes.addLockStrategy(investors.address);
    await SwapCoinInstance.setLockStrategy(stakes.address);

    // 给两个账号转账
    await SwapCoinInstance.transfer(accountOne, web3.toWei(10000000, "ether"), { from: owner });
    await SwapCoinInstance.transfer(accountTwo, web3.toWei(2000000, "ether"), { from: owner });

    // 设置预授权
    var contractAddr = accounts[9];
    var approveAmount = web3.toWei(1000000, "ether");
    await SwapCoinInstance.approve(contractAddr, approveAmount, {from: accountOne});
    var actualApprovedAmount = await SwapCoinInstance.allowance.call(accountOne, contractAddr);
    assert.isTrue(actualApprovedAmount.eq(approveAmount), "预授权的数额不对！");
    actualApprovedAmount = await SwapCoinInstance.allowance.call(accountTwo, contractAddr);
    assert.equal(0, actualApprovedAmount, "预授权的地址数额不对！");

    var available = await SwapCoinInstance.availableBalanceOf.call(accountOne);
    assert.isTrue(available.eq(web3.toWei(1000000, "ether")), "账户1的可用余额不对！");
    available = await SwapCoinInstance.availableBalanceOf.call(accountTwo);
    assert.isTrue(available.eq(web3.toWei(200000, "ether")), "账户2的可用余额不对！");

    // 只能动10%
    var amount = web3.toWei(1000001, "ether");
    try {
      await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });
      assert.fail("不应该可以转账！");
    } catch (error) {}

    // 验证用户的余额
    var balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    var expected = web3.toWei(10000000, "ether");
    assert.isTrue(balance.eq(expected), "锁仓失败！");

    // 验证不能使用transferFrom转账
    var amount = web3.toWei(1000001, "ether");
    try {
      await SwapCoinInstance.transferFrom(accountOne, accountTwo, amount, { from: contractAddr });
      assert.fail("不应该可以转账！");
    } catch (error) {}

    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    expected = web3.toWei(10000000, "ether");
    assert.isTrue(balance.eq(expected), "锁仓失败！");

    var amount = web3.toWei(900000, "ether");
    await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });

    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    expected = web3.toWei(9100000, "ether");
    assert.isTrue(balance.eq(expected), "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();
    assert.equal(web3.toWei(2900000, "ether"), balance, "转账数额错了！");

    // 可以使用transferFrom转账
    amount = web3.toWei(60000, "ether");
    await SwapCoinInstance.transferFrom(accountOne, accountTwo, amount, { from: contractAddr });
    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    expected = web3.toWei(9040000, "ether");
    assert.isTrue(balance.eq(expected), "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();
    assert.equal(web3.toWei(2960000, "ether"), balance, "转账数额错了！");

    //transferFrom转账只能在锁仓限额之内
    amount = web3.toWei(40001, "ether");
    try {
      await SwapCoinInstance.transferFrom(accountOne, accountTwo, amount, { from: contractAddr });
      assert.fail("不应该可以转账！");
    } catch (error) {}
    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    expected = web3.toWei(9040000, "ether");
    assert.isTrue(balance.eq(expected), "锁仓失败！");

    amount = web3.toWei(40000, "ether");
    await SwapCoinInstance.transferFrom(accountOne, accountTwo, amount, { from: contractAddr });
    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    expected = web3.toWei(9000000, "ether");
    assert.isTrue(balance.eq(expected), "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();
    assert.equal(web3.toWei(3000000, "ether"), balance, "转账数额错了！");
  });

  it('should locked investor coin correctly after 2019-8-27 8:00:00 AM', async () => {
    const bash = await BatchAddStakeHolders.new();
    const stakes = await SwapStakeHolders.new();

    var owner = accounts[0];
    // 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc
    const accountOne = accounts[1];
    // 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F
    const accountTwo = accounts[2];
    var response = await bash.investors(owner);
    var investors = await HolderLockStrategy.at(response.logs[0].args.addr);
    const SwapCoinInstance = await SwapCoin.new();

    var today = new Date('2019-8-27 08:00:00').getTime() / 1000;
    await investors.setToday(today, {from: owner});
    await stakes.addLockStrategy(investors.address);
    await SwapCoinInstance.setLockStrategy(stakes.address);

    // 给两个账号转账
    await SwapCoinInstance.transfer(accountOne, web3.toWei(10000000, "ether"), { from: owner });
    await SwapCoinInstance.transfer(accountTwo, web3.toWei(2000000, "ether"), { from: owner });

    var available = await SwapCoinInstance.availableBalanceOf.call(accountOne);
    assert.isTrue(available.eq(web3.toWei(4000000, "ether")), "账户1的可用余额不对！");
    available = await SwapCoinInstance.availableBalanceOf.call(accountTwo);
    assert.isTrue(available.eq(web3.toWei(800000, "ether")), "账户2的可用余额不对！");

    // 能动40%
    var amount = web3.toWei(4000001, "ether");
    try {
      await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });
      assert.fail("不应该可以转账！");
    } catch (error) {}

    // 验证用户的余额
    var balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    var expected = web3.toWei(10000000, "ether");
    assert.isTrue(balance.eq(expected), "锁仓失败！");

    var amount = web3.toWei(4000000, "ether");
    await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });

    // 验证用户的余额
    var balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    var expected = web3.toWei(6000000, "ether");
    assert.isTrue(balance.eq(expected), "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();
    assert.equal(web3.toWei(6000000, "ether"), balance, "转账数额错了！");
  });

  it('should not locked investor coin when no locker available', async () => {
    const bash = await BatchAddStakeHolders.new();
    const stakes = await SwapStakeHolders.new();

    var owner = accounts[0];
    // 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc
    const accountOne = accounts[1];
    // 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F
    const accountTwo = accounts[2];
    var response = await bash.investors(owner);
    var investors = await HolderLockStrategy.at(response.logs[0].args.addr);
    const SwapCoinInstance = await SwapCoin.new();

    var today = new Date('2019-5-22 08:00:00').getTime() / 1000;
    await investors.setToday(today, {from: owner});
    await stakes.addLockStrategy(investors.address);
    await SwapCoinInstance.setLockStrategy(stakes.address);

    // 给两个账号转账
    await SwapCoinInstance.transfer(accountOne, web3.toWei(10000000, "ether"), { from: owner });
    await SwapCoinInstance.transfer(accountTwo, web3.toWei(2000000, "ether"), { from: owner });

    // 只能动10%
    var amount = web3.toWei(1000001, "ether");
    try {
      await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });
      assert.fail("不应该可以转账！");
    } catch (error) {}

    // 验证用户的余额
    var balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    var expected = web3.toWei(10000000, "ether");
    assert.isTrue(balance.eq(expected), "锁仓失败！");

    // 去掉锁仓机制locker
    await SwapCoinInstance.setLockStrategy('0');
    var amount = web3.toWei(2000000, "ether");
    await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });

    // 验证用户的余额
    var balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    var expected = web3.toWei(8000000, "ether");
    assert.isTrue(balance.eq(expected), "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();
    assert.equal(web3.toWei(4000000, "ether"), balance, "转账数额错了！");
  });

  it('should pause coin correctly', async () => {
    const bash = await BatchAddStakeHolders.new();
    const stakes = await SwapStakeHolders.new();

    var owner = accounts[0];
    // 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc
    const accountOne = accounts[1];
    // 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F
    const accountTwo = accounts[2];
    var response = await bash.investors(owner);
    var investors = await HolderLockStrategy.at(response.logs[0].args.addr);
    const SwapCoinInstance = await SwapCoin.new();

    // 给两个账号转账
    await SwapCoinInstance.transfer(accountOne, web3.toWei(10000000, "ether"), { from: owner });
    await SwapCoinInstance.transfer(accountTwo, web3.toWei(2000000, "ether"), { from: owner });

    await SwapCoinInstance.pause({from: owner});
    // 只能动10%
    var amount = web3.toWei(1000001, "ether");
    try {
      await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });
      assert.fail("被中断不可以转账！");
    } catch (error) {}
    // 验证用户的余额
    var balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    var expected = web3.toWei(10000000, "ether");
    assert.isTrue(balance.eq(expected), "停止转账失败！");
    
    var amount = web3.toWei(1000001, "ether");
    try {
      await SwapCoinInstance.transfer(accountTwo, amount, { from: owner });
      assert.fail("被中断不可以转账！");
    } catch (error) {}
    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountTwo)), 'wei');
    expected = web3.toWei(2000000, "ether");
    assert.isTrue(balance.eq(expected), "停止转账失败！");

    var today = new Date('2019-5-27 08:00:00').getTime() / 1000;
    await investors.setToday(today, {from: owner});
    await stakes.addLockStrategy(investors.address);
    await SwapCoinInstance.setLockStrategy(stakes.address);

    // 只能动10%
    amount = web3.toWei(100000, "ether");
    try {
      await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });
      assert.fail("不应该可以转账！");
    } catch (error) {}

    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    expected = web3.toWei(10000000, "ether");
    assert.isTrue(balance.eq(expected), "停止转账失败！");

    await SwapCoinInstance.unpause({from: owner});
    assert.isFalse(await SwapCoinInstance.paused.call());
    await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });
    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    assert.isTrue(balance.eq(web3.toWei(10000000 - 100000, "ether")), "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();
    assert.equal(web3.toWei(2000000 + 100000, "ether"), balance, "转账数额错了！");

    // 去掉锁仓机制locker
    await SwapCoinInstance.setLockStrategy('0');
    var amount = web3.toWei(2000000, "ether");
    await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });

    // 验证用户的余额
    balance = web3.fromWei((await SwapCoinInstance.balanceOf.call(accountOne)), 'wei');
    assert.isTrue(balance.eq(web3.toWei(10000000 - 100000 - 2000000, "ether")), "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();
    assert.equal(web3.toWei(2000000 + 100000 + 2000000, "ether"), balance, "转账数额错了！");
  });
});
