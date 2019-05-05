pragma solidity >=0.4.25 <0.6.0;

import './SafeMath.sol';
import './ILocker.sol';

contract HolderLockStrategy is ILocker {
    using SafeMath for uint256;
    string public name;
    mapping (address => uint256) private _lockedBalances;
    uint[] private _unlockDates;
    uint[] private _unlockPercents;
    address private _admin;
    uint private _today;

    event Locked(address indexed owner, uint amount);
    event Unlocked(address indexed owner, uint amount);

    // event Log(uint value, string m);

    // unlockPercent_: 0 - 100的整数
    constructor(string memory title, uint[] memory unlockDates, uint[] memory unlockPercents, address admin) public {
        name = title;
        require(unlockDates.length == unlockPercents.length);
        
        for (uint i = 0; i < unlockPercents.length; ++i) {
            _unlockDates.push(unlockDates[i]);
            _unlockPercents.push(unlockPercents[i]);
        }
        
        _admin = admin;
    }

    function add(address holder, uint256 lockedAmount) public {
        require(tx.origin == _admin);
        _lockedBalances[holder] = lockedAmount;
    }

    function remove(address holder) public {
        require(tx.origin == _admin);
        _lockedBalances[holder] = 0;
    }

    function lockedBalanceOf(address holder) public 
        view 
        returns (uint256) {
        uint locked = _lockedBalances[holder];
        if (locked > 0) {
            uint today = getDate();
            uint unlockable = calculateUnlockedAmount(holder, today);
            return locked - unlockable;
        } else {
            return 0;
        }
    }

    function setToday(uint today) public {
        require(tx.origin == _admin);
        _today = today;
    }
    
    function getDate() public
        view
        returns (uint256) {
        if (_today == 0)
            return now;
        else
            return _today;
    }

    function calculatePhase(uint today) public view returns (uint256) {
        uint idx = 0;
        for (; idx < _unlockDates.length; ++idx) {
            if (today < _unlockDates[idx])  break;
        } 

        return idx;
    }

    function calculateUnlockedAmount(address holder, uint today) public view returns (uint256) {
        uint idx = calculatePhase(today);

        if (idx == 0) {
            return 0;
        } else if (idx >= _unlockDates.length) {
            return _lockedBalances[holder];
        } else {
            uint unlock = _unlockPercents[idx - 1];
            if (unlock > 100) 
                unlock = 100;
            return _lockedBalances[holder].mul(unlock).div(100);
        }
    }
}