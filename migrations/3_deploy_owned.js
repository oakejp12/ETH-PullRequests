/**
 * Handles deploying the contract to obserrve
 * subsequent smart contract migrations, and ensures
 * we don't double-migrate unchanged contracts in the future
 */

const Owned = artifacts.require("./Owned.sol");

module.exports = function(deployer) {
    deployer.deploy(Owned);
};
