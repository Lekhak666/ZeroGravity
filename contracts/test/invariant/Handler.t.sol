// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CommitRegistry} from "../../src/CommitRegistry.sol";

contract Handler {
    CommitRegistry public registry;

    bytes32[] public hashes;

    constructor(CommitRegistry _registry) {
        registry = _registry;
    }

    function commit(address to, uint256 amount, uint256 nonce, bytes32 salt) public {
        bytes32 hash = keccak256(abi.encode(to, amount, nonce, salt));

        try registry.commit(hash) {
            hashes.push(hash);
        } catch {}
    }

    function reveal(uint256 index, address to, uint256 amount, uint256 nonce, bytes32 salt) public {
        if (hashes.length == 0) return;

        index = index % hashes.length;

        vmWarp();

        try registry.reveal(to, amount, nonce, salt) {} catch {}
    }

    function vmWarp() internal view {
        // enough delay for invariant engine
        uint256 ts = block.timestamp + 20 seconds;

        assembly {
            pop(staticcall(gas(), 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D, add(ts, 0x20), 0x20, 0, 0))
        }
    }
}
