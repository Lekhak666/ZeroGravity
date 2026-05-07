// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {CommitRegistry} from "../src/CommitRegistry.sol";

contract CommitRegistryTest is Test {
    CommitRegistry registry;

    address alice = address(1);
    address bob = address(2);

    address to = address(99);
    uint256 amount = 100;
    uint256 nonce = 123;
    bytes32 salt = keccak256("salt");

    bytes32 commitHash;

    event Committed(
        bytes32 indexed commitHash,
        address indexed user,
        uint256 timestamp
    );

    event Revealed(bytes32 indexed commitHash, address indexed user);

    function setUp() public {
        registry = new CommitRegistry();

        commitHash = keccak256(abi.encode(to, amount, nonce, salt));
    }

    /*//////////////////////////////////////////////////////////////
                              COMMIT TESTS
    //////////////////////////////////////////////////////////////*/

    function testCommitStoresData() public {
        vm.prank(alice);
        registry.commit(commitHash);

        (
            address user,
            bytes32 storedHash,
            uint256 timestamp,
            bool revealed
        ) = registry.commitments(commitHash);

        assertEq(user, alice);
        assertEq(storedHash, commitHash);
        assertEq(timestamp, block.timestamp);
        assertEq(revealed, false);
    }

    function testCommitEmitsEvent() public {
        vm.prank(alice);

        vm.expectEmit(true, true, false, true);

        emit Committed(commitHash, alice, block.timestamp);

        registry.commit(commitHash);
    }

    function testCannotCommitSameHashTwice() public {
        vm.prank(alice);
        registry.commit(commitHash);

        vm.prank(alice);

        vm.expectRevert(
            CommitRegistry.CommitRegistry__AlreadyCommitted.selector
        );

        registry.commit(commitHash);
    }

    /*//////////////////////////////////////////////////////////////
                              REVEAL TESTS
    //////////////////////////////////////////////////////////////*/

    function testRevealWorks() public {
        vm.prank(alice);
        registry.commit(commitHash);

        vm.warp(block.timestamp + 16 seconds);

        vm.prank(alice);

        registry.reveal(to, amount, nonce, salt);

        (, , , bool revealed) = registry.commitments(commitHash);

        assertTrue(revealed);
    }

    function testRevealEmitsEvent() public {
        vm.prank(alice);
        registry.commit(commitHash);

        vm.warp(block.timestamp + 16 seconds);

        vm.expectEmit(true, true, false, true);

        emit Revealed(commitHash, alice);

        vm.prank(alice);

        registry.reveal(to, amount, nonce, salt);
    }

    function testRevealFailsIfUnknownCommit() public {
        vm.prank(alice);

        vm.expectRevert(CommitRegistry.CommitRegistry__UnknownCommit.selector);

        registry.reveal(to, amount, nonce, salt);
    }

    function testRevealFailsIfNotOwner() public {
        vm.prank(alice);
        registry.commit(commitHash);

        vm.warp(block.timestamp + 16 seconds);

        vm.prank(bob);

        vm.expectRevert(CommitRegistry.CommitRegistry__NotOwner.selector);

        registry.reveal(to, amount, nonce, salt);
    }

    function testRevealFailsTooEarly() public {
        vm.prank(alice);
        registry.commit(commitHash);

        vm.warp(block.timestamp + 10 seconds);

        vm.prank(alice);

        vm.expectRevert(CommitRegistry.CommitRegistry__RevealTooEarly.selector);

        registry.reveal(to, amount, nonce, salt);
    }

    function testCannotRevealTwice() public {
        vm.prank(alice);
        registry.commit(commitHash);

        vm.warp(block.timestamp + 16 seconds);

        vm.prank(alice);
        registry.reveal(to, amount, nonce, salt);

        vm.prank(alice);

        vm.expectRevert(
            CommitRegistry.CommitRegistry__AlreadyRevealed.selector
        );

        registry.reveal(to, amount, nonce, salt);
    }

    /*//////////////////////////////////////////////////////////////
                               FUZZ TESTS
    //////////////////////////////////////////////////////////////*/

    function testFuzzCommitAndReveal(
        address user,
        address _to,
        uint256 _amount,
        uint256 _nonce,
        bytes32 _salt
    ) public {
        vm.assume(user != address(0));

        bytes32 hash = keccak256(abi.encode(_to, _amount, _nonce, _salt));

        vm.prank(user);
        registry.commit(hash);

        vm.warp(block.timestamp + 16 seconds);

        vm.prank(user);

        registry.reveal(_to, _amount, _nonce, _salt);

        (, , , bool revealed) = registry.commitments(hash);

        assertTrue(revealed);
    }

    function testFuzzOnlyCommitOwnerCanReveal(
        address user,
        address attacker,
        address _to,
        uint256 _amount,
        uint256 _nonce,
        bytes32 _salt
    ) public {
        vm.assume(user != address(0));
        vm.assume(attacker != address(0));
        vm.assume(user != attacker);

        bytes32 hash = keccak256(abi.encode(_to, _amount, _nonce, _salt));

        vm.prank(user);
        registry.commit(hash);

        vm.warp(block.timestamp + 16 seconds);

        vm.prank(attacker);

        vm.expectRevert(CommitRegistry.CommitRegistry__NotOwner.selector);

        registry.reveal(_to, _amount, _nonce, _salt);
    }
}
