const SwapCoin = artifacts.require("Swap");

contract('Swap', (accounts) => {
  it('should put 3100000000 SwapCoin in the first account', async () => {
    const SwapCoinInstance = await SwapCoin.deployed();
    const balance = await SwapCoinInstance.balanceOf.call(accounts[0]);
    var expected = 3100000000;
    var actual = web3.fromWei(balance.toNumber(), "ether");

    assert.equal(actual, expected, "3100000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const SwapCoinInstance = await SwapCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = web3.toWei(100, "ether");
    await SwapCoinInstance.transfer(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await SwapCoinInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await SwapCoinInstance.balanceOf.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
});
