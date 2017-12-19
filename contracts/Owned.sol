pragma solidity ^0.4.2;

contract Owned {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

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
