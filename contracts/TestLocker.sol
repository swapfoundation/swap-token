pragma solidity >=0.4.25 <0.6.0;

import './SafeMath.sol';
import './ILocker.sol';

contract TestLocker 
{
    function lockedBalanceOf(address holder_) public pure returns (uint256)
    {
        holder_;
        return 3000000000 * 10 ** uint256(18);
    }
}