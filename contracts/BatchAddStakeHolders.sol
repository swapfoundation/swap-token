pragma solidity >=0.4.25 <0.6.0;

import './SafeMath.sol';
import './HolderLockStrategy.sol';
import './SwapStakeHolders.sol';

contract BatchAddStakeHolders {
    event StrategyCreation(address addr);

    function funds(address owner) public returns (HolderLockStrategy) {
        uint[] memory unlockDate = new uint[](6);
        unlockDate[0] = uint(1558828800);     // 2019-5-26 08:00:00 AM 北京时间
        unlockDate[1] = uint(1651334400);     // 2022-5-1 12:00:00 AM 北京时间
        unlockDate[2] = uint(1667232000);     // 2022-11-1 12:00:00 AM 北京时间
        unlockDate[3] = uint(1682870400);     // 2023-5-1 12:00:00 AM 北京时间
        unlockDate[4] = uint(1698768000);     // 2023-11-1 12:00:00 AM 北京时间
        unlockDate[5] = uint(1714492800);     // 2024-5-1 12:00:00 AM 北京时间
        
        uint[] memory unlockPercents = new uint[](6);
        uint i = 0;
        for (i = 0; i < unlockPercents.length; ++i) {
            unlockPercents[i] = 20 * i;
        }
        
        HolderLockStrategy fundLocker = new HolderLockStrategy(
            'Funds',             // 团队
            unlockDate,
            unlockPercents,
            owner);
        emit StrategyCreation(address(fundLocker));
        
        address[] memory fundAddrs = new address[](1);
        fundAddrs[0] = address(0xB73B30D19A58c745D765b40171C03b5918E7B41D);
        
        uint[1] memory amounts = [
            uint(8000000 * 10 ** 18)
        ];
        
        for (i = 0; i < fundAddrs.length; ++i) {
            fundLocker.add(fundAddrs[i], amounts[i]);
        }
        return fundLocker;
    }

    function teamMembers(address owner) public returns (HolderLockStrategy teamLocker) {
        uint[] memory unlockDate = new uint[](6);
        unlockDate[0] = uint(1558828800);     // 2019-5-26 08:00:00 AM 北京时间
        unlockDate[1] = uint(1588262400);     // 2020-5-1 12:00:00 AM 北京时间
        unlockDate[2] = uint(1604160000);     // 2020-11-1 12:00:00 AM 北京时间
        unlockDate[3] = uint(1619798400);     // 2021-5-1 12:00:00 AM 北京时间
        unlockDate[4] = uint(1635696000);     // 2021-11-1 12:00:00 AM 北京时间
        unlockDate[5] = uint(1651334400);     // 2022-5-1 12:00:00 AM 北京时间
        
        uint[] memory unlockPercents = new uint[](6);
        uint i = 0;
        for (i = 0; i < unlockPercents.length; ++i) {
            unlockPercents[i] = 20 * i;
        }
        
        teamLocker = new HolderLockStrategy(
            'Team',             // 团队
            unlockDate,
            unlockPercents,
            owner);
        emit StrategyCreation(address(teamLocker));
        
        address[] memory teams = new address[](2);
        
        teams[0] = 0xDe4c503708520F595E74e2628490d8Db62B8Fd58;
        teams[1] = 0x0211a7D1250a75635f65E5872F7C664F89097597;
        
        uint[2] memory amounts = [
            uint(40000 * 10 ** 18),
            uint(50000 * 10 ** 18)
        ];
        
        for (i = 0; i < teams.length; ++i) {
            teamLocker.add(teams[i], amounts[i]);
        }
    }

    function investors(address owner) public returns (HolderLockStrategy) {
        uint[] memory unlockDate = new uint[](11);
        unlockDate[0] = uint(1558828799);     // 2019-5-25 07:59:59 AM 北京时间
        unlockDate[1] = uint(1558828800);     // 2019-5-26 08:00:00 AM 北京时间
        unlockDate[2] = uint(1561507200);     // 2019-6-26 08:00:00 AM 北京时间
        unlockDate[3] = uint(1564099200);     // 2019-7-26 08:00:00 AM 北京时间
        unlockDate[4] = uint(1566777600);     // 2019-8-26 08:00:00 AM 北京时间
        unlockDate[5] = uint(1569456000);     // 2019-9-26 08:00:00 AM 北京时间
        unlockDate[6] = uint(1572048000);     // 2019-10-26 08:00:00 AM 北京时间
        unlockDate[7] = uint(1574726400);     // 2019-11-26 08:00:00 AM 北京时间
        unlockDate[8] = uint(1577318400);     // 2019-12-26 08:00:00 AM 北京时间
        unlockDate[9] = uint(1579996800);     // 2020-1-26 08:00:00 AM 北京时间
        unlockDate[10] = uint(1582675200);     // 2020-2-26 08:00:00 AM 北京时间

        uint[] memory unlockPercents = new uint[](11);
        uint i = 0;
        for (i = 0; i < unlockPercents.length; ++i) {
            unlockPercents[i] = 10 * i;
        }
        
        HolderLockStrategy investorLocker = new HolderLockStrategy(
            'Instituition',     // 机构捐赠
            unlockDate,
            unlockPercents,
            owner);
        
        emit StrategyCreation(address(investorLocker));

        address[] memory investorAddrs = new address[](3);
        investorAddrs[0] = 0xD9018C7EF5020CD200d1ff508391fA2A440280Bc;
        investorAddrs[1] = 0xfC6d6e78A016b27d2D4E903a118cE8562F99f73F;
        investorAddrs[2] = 0xb5d702F56BE396038189f75a14481C6d2e45Ad33;
        
        uint[3] memory amounts = [
            uint(10000000 * 10 ** 18),
            uint(2000000 * 10 ** 18),
            uint(300000 * 10 ** 18)
        ];
        
        for (i = 0; i < investorAddrs.length; ++i) {
            investorLocker.add(investorAddrs[i], amounts[i]);
        }

        return investorLocker;
    }
}