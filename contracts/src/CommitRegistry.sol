// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CommitRegistry {
    struct Commit {
        address user;
        uint256 timestamp;
        bool revealed;
    }

    mapping(bytes32 => Commit) public commits;

    event Committed(
        bytes32 indexed commitHash,
        address indexed user,
        uint256 ts
    );
    event Revealed(
        bytes32 indexed commitHash,
        address indexed user,
        uint256 ts
    );

    error AlreadyCommitted();
    error NotOwner();
    error AlreadyRevealed();
    error UnknownCommit();

    function commit(bytes32 commitHash) external {
        if (commits[commitHash].timestamp != 0) revert AlreadyCommitted();

        commits[commitHash] = Commit({
            user: msg.sender,
            timestamp: block.timestamp,
            revealed: false
        });

        emit Committed(commitHash, msg.sender, block.timestamp);
    }

    function markRevealed(bytes32 commitHash) external {
        Commit storage c = commits[commitHash];

        if (c.timestamp == 0) revert UnknownCommit();
        if (c.user != msg.sender) revert NotOwner();
        if (c.revealed) revert AlreadyRevealed();

        c.revealed = true;

        emit Revealed(commitHash, msg.sender, block.timestamp);
    }

    function getCommit(
        bytes32 commitHash
    ) external view returns (address user, uint256 timestamp, bool revealed) {
        Commit memory c = commits[commitHash];
        return (c.user, c.timestamp, c.revealed);
    }
}
