// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CommitRegistry} from "../src/CommitRegistry.sol";

contract DeployCommitRegistry is Script {
    function run() external returns (CommitRegistry) {
        vm.startBroadcast();

        CommitRegistry registry = new CommitRegistry();

        vm.stopBroadcast();

        console.log("CommitRegistry deployed at:", address(registry));

        return registry;
    }
}
