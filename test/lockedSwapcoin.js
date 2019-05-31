const SwapCoin = artifacts.require("Swap");
const HolderLockStrategy = artifacts.require("HolderLockStrategy");
const SwapTeamMemberLockContract = artifacts.require("SwapTeamMemberLockContract");
const FundLockContract = artifacts.require("FundLockContract");

contract('LockSwap', (accounts) => {
  it('should locked team member and fund coin correctly before 2019-5-3 8:00:00 AM', async () => {
    const SwapCoinInstance = await SwapCoin.new();

    var owner = accounts[0];
    // team member
    // 0x622F7546Ea541d56d9781160b2ffde89832a9DB4
    const team = '0x622F7546Ea541d56d9781160b2ffde89832a9DB4';
    const fund = '0x5F432F600222dC0c91bac3887659B2a67A8f99e5';
    var teamLocker = await SwapTeamMemberLockContract.new(SwapCoinInstance.address);
    var fundLocker = await FundLockContract.new(SwapCoinInstance.address);

    // 给两个账号转账
    await SwapCoinInstance.transfer(teamLocker.address, web3.toWei(310000000, "ether"), { from: owner });
    await SwapCoinInstance.transfer(fundLocker.address, web3.toWei(930000000, "ether"), { from: owner });
    var balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "转账数额错了！");

    var balance = (await SwapCoinInstance.balanceOf.call(teamLocker.address)).toNumber();
    assert.equal(web3.toWei(310000000, "ether"), balance, "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(fundLocker.address)).toNumber();
    assert.equal(web3.toWei(930000000, "ether"), balance, "转账数额错了！");

    // 2019-5-3 8:00:00 AM，没有人能够转币,Date的构造函数月份是从0开始的
    var today = new Date(2019, 4, 3, 8, 0, 0).getTime() / 1000;
    await teamLocker.setToday(today);
    await fundLocker.setToday(today);

    var available = await teamLocker.availableBalance.call();
    assert.isTrue(available.eq(0), "账户1的可用余额不对！");
    available = await fundLocker.availableBalance.call();
    assert.isTrue(available.eq(0), "账户2的可用余额不对！");

    await teamLocker.withdraw(team, { from: owner });
    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "转账数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "转账数额错了！");
  });

  it('should locked team member coin correctly after 2020-5-1 8:00:00 AM', async () => {
    const SwapCoinInstance = await SwapCoin.new();

    var owner = accounts[0];
    // team member
    // 0xDe4c503708520F595E74e2628490d8Db62B8Fd58
    const team = '0xDe4c503708520F595E74e2628490d8Db62B8Fd58';
    var teamLocker = await SwapTeamMemberLockContract.new(SwapCoinInstance.address);

    // 给两个账号转账
    await SwapCoinInstance.transfer(teamLocker.address, web3.toWei(310000000, "ether"), { from: owner });
    var balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "转账数额错了！");

    var balance = (await SwapCoinInstance.balanceOf.call(teamLocker.address)).toNumber();
    assert.equal(web3.toWei(310000000, "ether"), balance, "转账数额错了！");

    // 2020-4-30 7:59:59 AM，没有人能够转币,Date的构造函数月份是从0开始的
    var today = new Date(2020, 3, 30, 7, 59, 59).getTime() / 1000;
    await teamLocker.setToday(today);

    var available = await teamLocker.availableBalance.call();
    assert.isTrue(available.eq(0), "2020-4-30 7:59:59 AM 团队的可用余额不对！");

    await teamLocker.withdraw(team, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "2020-4-30 7:59:59 AM 转账数额错了！");

    // 2020-5-1 12:00:01 AM，解锁20%
    today = new Date('2020-5-1 12:10:01 AM').getTime() / 1000;
    await teamLocker.setToday(today);

    available = (await teamLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(310000000 * .2, "ether"), available, "2020-5-1 12:00:01 AM解锁可用数额错了！");

    await teamLocker.withdraw(team, { from: owner });
    // assert.isTrue(ret, "提现失败！");
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(310000000 * .2, "ether"), balance, "2020-5-1 12:00:01 AM解锁数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(teamLocker.address)).toNumber();
    assert.equal(web3.toWei(310000000 * .8, "ether"), balance, "2020-5-1 12:00:01 AM转账数额错了！");

    // 2020-11-1 8:00:00 AM，解锁40%
    await teamLocker.setToday(new Date(2020, 10, 1, 8, 0, 0).getTime() / 1000);
    available = (await teamLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(310000000 * .2, "ether"), available, "2020-11-1 8:00:00 AM解锁可用数额错了！");

    await teamLocker.withdraw(team, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(310000000 * .4, "ether"), balance, "2020-11-1 8:00:00 AM解锁数额错了！");

    // 2021-5-1 12:00:00 AM，解锁60%
    await teamLocker.setToday(new Date(2021, 4, 1, 8, 0, 0).getTime() / 1000);
    available = (await teamLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(310000000 * .2, "ether"), available, "解锁可用数额错了！");

    await teamLocker.withdraw(team, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(310000000 * .6, "ether"), balance, "解锁数额错了！");

    // 2021-10-31 12:00:00 AM，解锁60%
    await teamLocker.setToday(new Date(2021, 9, 31, 12, 0, 0).getTime() / 1000);
    available = (await teamLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(0, "ether"), available, "解锁可用数额错了！");

    await teamLocker.withdraw(team, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(310000000 * .6, "ether"), balance, "解锁数额错了！");

    // 2021-11-1 8:00:00 AM，解锁80%
    await teamLocker.setToday(new Date(2021, 10, 1, 8, 0, 0).getTime() / 1000);
    available = (await teamLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(310000000 * .2, "ether"), available, "解锁可用数额错了！");

    await teamLocker.withdraw(team, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(310000000 * .8, "ether"), balance, "解锁数额错了！");

    // 2022-5-1 8:00:00 AM，解锁100%
    await teamLocker.setToday(new Date(2022, 4, 1, 8, 0, 0).getTime() / 1000);
    available = (await teamLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(310000000 * .2, "ether"), available, "解锁可用数额错了！");

    await teamLocker.withdraw(team, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(310000000, "ether"), balance, "解锁数额错了！");

    // 2022-6-1 8:00:00 AM，解锁100%
    await teamLocker.setToday(new Date(2022, 5, 1, 8, 0, 0).getTime() / 1000);
    available = await teamLocker.availableBalance.call();
    assert.equal(web3.toWei(0, "ether"), available, "解锁可用数额错了！");

    await teamLocker.withdraw(team, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(team)).toNumber();
    assert.equal(web3.toWei(310000000, "ether"), balance, "解锁数额错了！");
  });

  it('should locked fund member coin correctly after 2022-5-1 8:00:00 AM', async () => {
    const SwapCoinInstance = await SwapCoin.new();

    var owner = accounts[0];
    // fund
    // 0x5F432F600222dC0c91bac3887659B2a67A8f99e5
    const fund = '0xDe4c503708520F595E74e2628490d8Db62B8Fd58';
    var fundLocker = await FundLockContract.new(SwapCoinInstance.address);

    // 给两个账号转账
    await SwapCoinInstance.transfer(fundLocker.address, web3.toWei(930000000, "ether"), { from: owner });
    var balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "转账数额错了！");

    var balance = (await SwapCoinInstance.balanceOf.call(fundLocker.address)).toNumber();
    assert.equal(web3.toWei(930000000, "ether"), balance, "转账数额错了！");

    // 2022-4-30 7:59:59 AM，没有人能够转币,Date的构造函数月份是从0开始的
    await fundLocker.setToday(new Date('2022-4-30 7:59:59 AM').getTime() / 1000);

    var available = await fundLocker.availableBalance.call();
    assert.isTrue(available.eq(0), "2022-4-30 7:59:59 AM 团队的可用余额不对！");
    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(0, "ether"), balance, "2022-4-30 7:59:59 AM 转账数额错了！");

    // 2022-5-1 12:00:01 AM，解锁20%
    today = new Date('2022-5-1 12:10:01 AM').getTime() / 1000;
    await fundLocker.setToday(today);

    available = (await fundLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(930000000 * .2, "ether"), available, "2022-5-1 12:00:01 AM解锁可用数额错了！");

    await fundLocker.withdraw(fund, { from: owner });
    // assert.isTrue(ret, "提现失败！");
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(930000000 * .2, "ether"), balance, "2022-5-1 12:00:01 AM解锁数额错了！");
    balance = (await SwapCoinInstance.balanceOf.call(fundLocker.address)).toNumber();
    assert.equal(web3.toWei(930000000 * .8, "ether"), balance, "2022-5-1 12:00:01 AM转账数额错了！");

    // 2022-11-1 8:00:00 AM，解锁40%
    await fundLocker.setToday(new Date('2022-11-1 12:10:01 AM').getTime() / 1000);
    available = (await fundLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(930000000 * .2, "ether"), available, "2022-11-1 8:00:00 AM解锁可用数额错了！");
    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(930000000 * .4, "ether"), balance, "2020-11-1 8:00:00 AM解锁数额错了！");

    // 2023-5-1 12:00:00 AM，解锁60%
    await fundLocker.setToday(new Date('2023-5-1 12:10:01 AM').getTime() / 1000);
    available = (await fundLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(930000000 * .2, "ether"), available, "2023-5-1 12:10:01 AM解锁可用数额错了！");

    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(930000000 * .6, "ether"), balance, "2023-5-1 12:10:01 AM解锁数额错了！");

    // 2023-10-31 12:00:00 AM，解锁60%
    await fundLocker.setToday(new Date('2023-10-31 12:10:01 AM').getTime() / 1000);
    available = (await fundLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(0, "ether"), available, "2023-10-31 12:10:01 AM解锁可用数额错了！");

    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(930000000 * .6, "ether"), balance, "2023-10-31 12:10:01 AM解锁数额错了！");

    // 2023-11-1 8:00:00 AM，解锁80%
    await fundLocker.setToday(new Date('2023-11-1 12:10:01 AM').getTime() / 1000);
    available = (await fundLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(930000000 * .2, "ether"), available, "2023-11-1 12:10:01 AM解锁可用数额错了！");

    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(930000000 * .8, "ether"), balance, "2023-11-1 12:10:01 AM解锁数额错了！");

    // 2024-5-1 8:00:00 AM，解锁100%
    await fundLocker.setToday(new Date('2024-5-1 12:10:01 AM').getTime() / 1000);
    available = (await fundLocker.availableBalance.call()).toNumber();
    assert.equal(web3.toWei(930000000 * .2, "ether"), available, "2024-5-1 12:10:01 AM解锁可用数额错了！");

    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(930000000, "ether"), balance, "2024-5-1 12:10:01 AM解锁数额错了！");

    // 2024-6-1 8:00:00 AM，解锁100%
    await fundLocker.setToday(new Date('2024-6-1 12:10:01 AM').getTime() / 1000);
    available = await fundLocker.availableBalance.call();
    assert.equal(web3.toWei(0, "ether"), available, "2024-6-1 12:10:01 AM解锁可用数额错了！");

    await fundLocker.withdraw(fund, { from: owner });
    balance = (await SwapCoinInstance.balanceOf.call(fund)).toNumber();
    assert.equal(web3.toWei(930000000, "ether"), balance, "2024-6-1 12:10:01 AM解锁数额错了！");
  });
});