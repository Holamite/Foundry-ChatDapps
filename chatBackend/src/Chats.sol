// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IENS, Struct} from "./Interface/IENS.sol";

contract Chats {
    struct Message {
        address sender;
        address receiver;
        string content;
    }

    mapping(address => mapping(address => Message[])) chatHistory;

    IENS public nameService;

    event MessageSent(address indexed sender, address indexed receiver, string);

    Struct.DomainDetails[] registeredName;

    constructor(address _contractAdrr) {
        nameService = IENS(_contractAdrr);
    }

    function sendMessage(
        string memory _receiverEnsName,
        string memory _content
    ) external {
        // Get receiver's details from NameService
        (address receiverAddress, , ) = nameService.getEnsDetails(
            _receiverEnsName
        );
        require(receiverAddress != address(0), "Receiver not registered");

        Message memory _message = Message(
            msg.sender,
            receiverAddress,
            _content
        );
        chatHistory[msg.sender][receiverAddress].push(_message);

        emit MessageSent(msg.sender, receiverAddress, _content);
    }

    function getMessages(
        string memory _senderEnsName,
        string memory _receiverEnsName
    ) external view returns (Message[] memory) {
        // Get sender's and receiver's details from NameService
        (address senderAddress, , ) = nameService.getEnsDetails(_senderEnsName);
        require(senderAddress != address(0), "Sender not registered");

        (address receiverAddress, , ) = nameService.getEnsDetails(
            _receiverEnsName
        );
        require(receiverAddress != address(0), "Receiver not registered");

        return chatHistory[msg.sender][receiverAddress];
    }

    function getRegisteredUsers()
        public
        view
        returns (Struct.DomainDetails[] memory)
    {
        return nameService.getAllRegisterUser();
    }
}
