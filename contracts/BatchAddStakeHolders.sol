pragma solidity >=0.4.25 <0.6.0;

import './SafeMath.sol';
import './HolderLockStrategy.sol';
import './SwapStakeHolders.sol';

contract BatchAddStakeHolders {
    function add(address owner) public {
        addInvestors(owner);
        addTeamMembers(owner);
    }

    function addTeamMembers(address owner) private returns (HolderLockStrategy teamLocker) {
        teamLocker = new HolderLockStrategy(
            'Team',             // 团队
            1588193950,         // 2020-4-27 12:00:00 AM
            26 weeks,            // 勉强一个月
            20,                 // 每次释放10%
            1585238400,         // 2020-3-27 12:00:00 AM
            owner);
        
        address payable[3] memory teams = [
            0xDe4c503708520F595E74e2628490d8Db62B8Fd58,
            0x0211a7D1250a75635f65E5872F7C664F89097597,
            0x69d5Af900651B0299b8f40e230fF76A9A2026360
        ];
        uint[3] memory amounts = [
            uint(40000 * 10 ** 18),
            uint(50000 * 10 ** 18),
            uint(40000 * 10 ** 18)
        ];
        
        for (uint i = 0; i < teams.length; ++i) {
            teamLocker.add(teams[i], amounts[i]);
        }
    }

    function addInvestors(address owner) private returns (HolderLockStrategy investerLocker) {
        investerLocker = new HolderLockStrategy(
            'Instituition',     // 机构捐赠
            1558886400,         // 2019-5-27 12:00:00 AM
            30 days,            // 勉强一个月
            10,                 // 每次释放10%
            1585238400,         // 2020-3-27 12:00:00 AM
            owner);
        
        address payable[3] memory investers = [
            0xD9018C7EF5020CD200d1ff508391fA2A440280Bc,
            0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F,
            0xb5d702F56BE396038189f75a14481C6d2e45Ad33
        ];
        uint[3] memory amounts = [
            uint(10000000 * 10 ** 18),
            uint(2000000 * 10 ** 18),
            uint(300000 * 10 ** 18)
        ];
        
        for (uint i = 0; i < investers.length; ++i) {
            investerLocker.add(investers[i], amounts[i]);
        }
    }
}