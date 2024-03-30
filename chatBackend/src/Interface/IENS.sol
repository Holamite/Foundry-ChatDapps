// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library Struct {
    struct DomainDetails {
        address owner;
        string ensName;
        string DisplayPictureURI;
    }
}

interface IENS {
    function getEnsDetails(
        string memory _ensName
    ) external view returns (address, string memory, string memory);

    function getAllRegisterUser()
        external
        view
        returns (Struct.DomainDetails[] memory);
}
