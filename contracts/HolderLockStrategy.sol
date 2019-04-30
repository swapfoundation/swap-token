pragma solidity >=0.4.25 <0.6.0;

import './SafeMath.sol';
import './ILocker.sol';

contract HolderLockStrategy is ILocker {
    using SafeMath for uint256;
    string public name;
    mapping (address => uint256) private _lockedBalances;
    uint private _unlockBegin;
    uint private _period;
    uint private _unlockPercent;
    uint private _unlockEnd;
    address private _admin;

    event Locked(address indexed owner, uint amount);
    event Unlocked(address indexed owner, uint amount);

    // unlockPercent_: 0 - 100的整数
    constructor(string memory title, uint unlockBegin, uint period, uint unlockPercent, uint unlockEnd, address admin) public {
        name = title;
        _unlockBegin = unlockBegin;
        _period = period;
        _unlockPercent = unlockPercent;
        _unlockEnd = unlockEnd;
        _admin = admin;
    }

    function add(address holder, uint256 lockedAmount) public {
        require(msg.sender == _admin);
        _lockedBalances[holder] = lockedAmount;
    }

    function remove(address holder) public {
        require(msg.sender == _admin);
        _lockedBalances[holder] = 0;
    }

    function lockedBalanceOf(address holder) public view returns (uint256) {
        uint locked = _lockedBalances[holder];
        if (locked > 0) {
            uint today = now;
            uint unlockable = calculateUnlockedAmount(holder, today);
            return locked - unlockable;
        } else {
            return 0;
        }
    }

    function calculateUnlockedAmount(address holder, uint today) public view returns (uint256) {
        if (today < _unlockBegin) {
            return 0;
        } else if (today >= _unlockBegin && today <= _unlockEnd) {
            uint diff =  today.sub(_unlockBegin).div(_period);
            uint canUnlockPercent = diff.add(1).mul(_unlockPercent);
            if (canUnlockPercent > 100) 
                canUnlockPercent = 100;

            return _lockedBalances[holder].mul(canUnlockPercent).div(100);
        } else if (today > _unlockEnd) {
            return _lockedBalances[holder];
        }
    }
}