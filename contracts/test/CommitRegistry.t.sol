// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {CommitRegistry} from "../src/CommitRegistry.sol";

contract CommitRegistryTest is Test {
    CommitRegistry registry;

    address user = address(0x1);
    address attacker = address(0x2);

    bytes32 commitHash = keccak256("my-secret");

    function setUp() public {
        registry = new CommitRegistry();
    }

    /*//////////////////////////////////////////////////////////////
                            COMMIT TESTS
    //////////////////////////////////////////////////////////////*/

    function testCommitSuccess() public {
        vm.prank(user);

        vm.expectEmit(true, true, false, true);
        emit CommitRegistry.Committed(commitHash, user, block.timestamp);

        registry.commit(commitHash);

        (address storedUser, uint256 ts, bool revealed) = registry.getCommit(
            commitHash
        );

        assertEq(storedUser, user);
        assertEq(revealed, false);
        assertEq(ts, block.timestamp);
    }

    function testCommitTwiceReverts() public {
        vm.prank(user);
        registry.commit(commitHash);

        vm.prank(user);
        vm.expectRevert(CommitRegistry.AlreadyCommitted.selector);
        registry.commit(commitHash);
    }

    /*//////////////////////////////////////////////////////////////
                        MARK REVEALED TESTS
    //////////////////////////////////////////////////////////////*/

    function testRevealSuccess() public {
        vm.prank(user);
        registry.commit(commitHash);

        vm.prank(user);

        vm.expectEmit(true, true, false, true);
        emit CommitRegistry.Revealed(commitHash, user, block.timestamp);

        registry.markRevealed(commitHash);

        (, , bool revealed) = registry.getCommit(commitHash);
        assertTrue(revealed);
    }

    function testRevealUnknownCommitReverts() public {
        vm.prank(user);

        vm.expectRevert(CommitRegistry.UnknownCommit.selector);
        registry.markRevealed(commitHash);
    }

    function testRevealByNonOwnerReverts() public {
        vm.prank(user);
        registry.commit(commitHash);

        vm.prank(attacker);

        vm.expectRevert(CommitRegistry.NotOwner.selector);
        registry.markRevealed(commitHash);
    }

    function testRevealTwiceReverts() public {
        vm.prank(user);
        registry.commit(commitHash);

        vm.prank(user);
        registry.markRevealed(commitHash);

        vm.prank(user);

        vm.expectRevert(CommitRegistry.AlreadyRevealed.selector);
        registry.markRevealed(commitHash);
    }

    /*//////////////////////////////////////////////////////////////
                        GETTER EDGE CASES
    //////////////////////////////////////////////////////////////*/

    function testGetUnknownCommitReturnsZero() public view {
        (address u, uint256 ts, bool revealed) = registry.getCommit(commitHash);

        assertEq(u, address(0));
        assertEq(ts, 0);
        assertEq(revealed, false);
    }
}
