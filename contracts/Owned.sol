pragma solidity ^0.4.2;

contract Owned {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    // Modifiers are inheritable properties of contracts
    // and may be overridden by derived contracts.
    // The function body is inserted where "_;" appears.
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // This contract inherits the "onlyOwner"-modifier from
    // "Owned" and applies it to the "transferOwnership"-function which
    // causes that calls to "transferOwnership" only have an effect is
    // they are made by the stored owner...
    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}
