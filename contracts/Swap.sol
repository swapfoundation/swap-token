pragma solidity >=0.4.25 <0.6.0;

import './SafeMath.sol';
import './ILocker.sol';

contract Ownable {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

contract ERC20 {
    uint256 public totalSupply;
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Swap is Ownable, ERC20 {
    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint8 public decimals;
    ILocker private _locker;

    mapping (address => uint256) private balances;
    mapping (address => mapping (address => uint256)) internal allowed;

    constructor() public {
        name = "SWAP";
        symbol = "SWAP";
        decimals = 18;
        totalSupply = 3100000000 * 10 ** uint256(decimals);
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function setLockStrategy(ILocker locker) onlyOwner public {
        _locker = locker;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));

        address _from = msg.sender;
        uint available = availableBalanceOf(_from);

        if (_value <= available)
        {
            balances[_from] = balances[_from].sub(_value);
            balances[_to] = balances[_to].add(_value);
            emit Transfer(_from, _to, _value);
            return true;
        }
        else
        {
            return false;
        }
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function availableBalanceOf(address _owner) public view returns (uint256 balance) {
        uint locked = 0;

        if (address(_locker) != address(0))
            locked = _locker.lockedBalanceOf(_owner);

        return balances[_owner].sub(locked);
    }
}