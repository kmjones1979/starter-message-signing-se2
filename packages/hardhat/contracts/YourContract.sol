// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract is Ownable {

    constructor(address _owner) Ownable(_owner) {}

    function getMessageHash(string memory message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(message));
    }

    function getEthSignedMessageHash(bytes32 messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }

    function verify(
        address signer,
        string memory message,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == signer;
    }

    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory signature)
        public
        pure
        returns (address)
    {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        return ecrecover(ethSignedMessageHash, v, r, s);
    }
}