// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "../lib/forge-std/src/Script.sol";
import "../src/Chats.sol";
import "../src/ENS.sol";

contract ENSChatScript is Script {
    ENS _nameService;
    Chats _chatDapp;

    function setUp() public {}

    function run() external {
        vm.startBroadcast();

        _nameService = new ENS();

        _chatDapp = new Chats(address(_nameService));

        console2.log(address(_nameService));
        console2.log(address(_chatDapp));

        vm.stopBroadcast();
    }
}
