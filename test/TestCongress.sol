pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Congress.sol";

contract TestCongress {

    // Define a contract-wide variable containing the
    // smart contract to be tested where DeployedAddresses
    // get its address
    Congress congress = Congress(DeployedAddresses.Congress());




}