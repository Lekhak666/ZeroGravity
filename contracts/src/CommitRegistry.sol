// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CommitRegistry
 * @author Khushi Barnwal, Nayab Khan
 *
 * @notice A minimal commit-reveal registry for off-chain commitments.
 *
 * @dev
 * Users submit a cryptographic commitment hash on-chain and may reveal the
 * original preimage after a fixed minimum delay.
 *
 * The commitment is computed as:
 * `keccak256(abi.encode(to, amount, nonce, salt))`
 *
 * This enables delayed execution guarantees for workflows where sensitive
 * transaction intent should remain private until reveal time.
 *
 * Requirements:
 * - A commitment hash can only be registered once.
 * - Only the original committer may reveal.
 * - Reveal must occur after `MIN_DELAY`.
 * - Each commitment may only be revealed once.
 */
contract CommitRegistry {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    /// @notice Thrown when attempting to reuse an existing commitment hash.
    error CommitRegistry__AlreadyCommitted();

    /// @notice Thrown when a caller is not the original committer.
    error CommitRegistry__NotOwner();

    /// @notice Thrown when attempting to reveal an already revealed commitment.
    error CommitRegistry__AlreadyRevealed();

    /// @notice Thrown when reveal is attempted before the delay expires.
    error CommitRegistry__RevealTooEarly();

    /// @notice Thrown when ETH is mistakenly sent to `commit`.
    error CommitRegistry__SendEth();

    /// @notice Thrown when the reveal transfer fails.
    error CommitRegistry__TransferFailed();

    /// @notice Thrown when revealing an unknown commitment.
    error CommitRegistry__UnknownCommit();

    /*//////////////////////////////////////////////////////////////
                               CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Minimum waiting period before reveal.
    uint256 public constant MIN_DELAY = 15 seconds;

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Stores metadata for a submitted commitment.
     * @param user Address that created the commitment
     * @param commitHash Commitment hash
     * @param timestamp Block timestamp when commitment was recorded
     * @param revealed Whether reveal has occurred
     */
    struct Commitment {
        address user;
        bytes32 commitHash;
        uint256 timestamp;
        bool revealed;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice Maps commitment hash to commitment metadata.
    mapping(bytes32 commitHash => Commitment) public commitments;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Emitted when a commitment is submitted.
     * @param commitHash Submitted hash
     * @param user Committer address
     * @param timestamp Commit timestamp
     */
    event Committed(bytes32 indexed commitHash, address indexed user, uint256 timestamp);

    /**
     * @notice Emitted when a commitment is successfully revealed.
     * @param commitHash Revealed commitment hash
     * @param user Original committer
     */
    event Revealed(bytes32 indexed commitHash, address indexed user);

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Submit a commitment hash.
     *
     * @dev
     * Reverts if:
     * - commitment already exists
     * - ETH is sent
     *
     * @param commitHash Commitment hash to register
     */
    function commit(bytes32 commitHash) external payable {
        if (commitments[commitHash].timestamp != 0) {
            revert CommitRegistry__AlreadyCommitted();
        }

        if (msg.value > 0) {
            revert CommitRegistry__SendEth();
        }

        commitments[commitHash] =
            Commitment({user: msg.sender, commitHash: commitHash, timestamp: block.timestamp, revealed: false});

        emit Committed(commitHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Reveal a commitment and execute ETH transfer.
     *
     * @dev
     * Recomputes the commitment hash from reveal parameters and validates:
     * - commitment exists
     * - caller is owner
     * - not already revealed
     * - minimum delay elapsed
     *
     * Transfers `amount` wei to `to`.
     *
     * @param to Recipient address
     * @param amount ETH amount to transfer
     * @param nonce Unique nonce used during commitment
     * @param salt Random salt used during commitment
     */
    function reveal(address to, uint256 amount, uint256 nonce, bytes32 salt) external {
        bytes32 computedHash = keccak256(abi.encode(to, amount, nonce, salt));

        Commitment storage c = commitments[computedHash];

        if (c.timestamp == 0) revert CommitRegistry__UnknownCommit();
        if (c.user != msg.sender) revert CommitRegistry__NotOwner();
        if (c.revealed) revert CommitRegistry__AlreadyRevealed();
        if (block.timestamp < c.timestamp + MIN_DELAY) {
            revert CommitRegistry__RevealTooEarly();
        }

        c.revealed = true;

        (bool sent,) = to.call{value: amount}("");

        if (!sent) revert CommitRegistry__TransferFailed();

        emit Revealed(computedHash, c.user);
    }
}
