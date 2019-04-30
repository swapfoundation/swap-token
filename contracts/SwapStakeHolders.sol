pragma solidity >=0.4.25 <0.6.0;

import './SafeMath.sol';
import './ILocker.sol';

contract SwapStakeHolders is ILocker {
    using SafeMath for uint256;
    address private _admin;
    ILocker[] private _strategies;

    constructor(address admin) public {
        _admin = admin;
    }

    function addLockStrategy(ILocker locker) public {
        require(msg.sender == _admin);
        _strategies.push(locker);
    }

    function lockedBalanceOf(address holder) public view returns (uint256) {
        uint locked = 0;
        for (uint i = 0; i < _strategies.length; ++i) {
            uint l = _strategies[i].lockedBalanceOf(holder);
            if (l > 0) {
                locked = locked.add(l);
            }
        }

        return locked;
    }
}