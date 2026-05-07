// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CommitRegistry - A simple commit-reveal registry for off-chain commitments.
 * @author Khushi Barnwal
 * @notice
 */
contract CommitRegistry {
    error CommitRegistry__AlreadyCommitted();
    error CommitRegistry__NotOwner();
    error CommitRegistry__AlreadyRevealed();
    error CommitRegistry__RevealTooEarly();
    error CommitRegistry__InvalidReveal();
    error CommitRegistry__UnknownCommit();

    uint256 public constant MIN_DELAY = 15 seconds;

    struct Commitment {
        address user; // who committed
        bytes32 commitHash; // the hash they submitted
        uint256 timestamp; // when they committed
        bool revealed; // has it been revealed yet?
    }

    mapping(bytes32 commitHash => Commitment) public commitments;

    event Committed(
        bytes32 indexed commitHash,
        address indexed user,
        uint256 timestamp
    );

    event Revealed(bytes32 indexed commitHash, address indexed user);

    function commit(bytes32 commitHash) external {
        if (commitments[commitHash].timestamp != 0) {
            revert CommitRegistry__AlreadyCommitted();
        }

        commitments[commitHash] = Commitment({
            user: msg.sender,
            commitHash: commitHash,
            timestamp: block.timestamp,
            revealed: false
        });

        emit Committed(commitHash, msg.sender, block.timestamp);
    }

    function reveal(
        address to,
        uint256 amount,
        uint256 nonce,
        bytes32 salt
    ) external {
        bytes32 computedHash = keccak256(abi.encode(to, amount, nonce, salt));

        Commitment storage c = commitments[computedHash];

        if (c.timestamp == 0) {
            revert CommitRegistry__UnknownCommit();
        }

        if (c.user != msg.sender) {
            revert CommitRegistry__NotOwner();
        }

        if (c.revealed) {
            revert CommitRegistry__AlreadyRevealed();
        }

        if (block.timestamp < c.timestamp + MIN_DELAY) {
            revert CommitRegistry__RevealTooEarly();
        }

        if (computedHash != c.commitHash) {
            revert CommitRegistry__InvalidReveal();
        }

        c.revealed = true;

        emit Revealed(computedHash, c.user);
    }
}
