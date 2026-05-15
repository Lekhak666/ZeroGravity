// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {DeployCommitRegistry} from "../../script/DeployCommitRegistry.s.sol";
import {CommitRegistry} from "../../src/CommitRegistry.sol";

contract DeployCommitRegistryTest is Test {
    DeployCommitRegistry deployer;
    CommitRegistry registry;

    function setUp() public {
        deployer = new DeployCommitRegistry();
    }

    /*//////////////////////////////////////////////////////////////
                            DEPLOYMENT TESTS
    //////////////////////////////////////////////////////////////*/

    function testRunDeploysRegistry() public {
        registry = deployer.run();

        assertTrue(address(registry) != address(0));
    }

    function testDeployedRegistryHasCorrectMinDelay() public {
        registry = deployer.run();

        assertEq(registry.MIN_DELAY(), 15 seconds);
    }

    function testDeployedRegistryStartsEmpty() public {
        registry = deployer.run();

        bytes32 randomHash = keccak256("random");

        (address user, bytes32 commitHash, uint256 timestamp, bool revealed) = registry.commitments(randomHash);

        assertEq(user, address(0));
        assertEq(commitHash, bytes32(0));
        assertEq(timestamp, 0);
        assertFalse(revealed);
    }

    function testEachRunDeploysFreshContract() public {
        CommitRegistry first = deployer.run();
        CommitRegistry second = deployer.run();

        assertTrue(address(first) != address(second));
    }
}
