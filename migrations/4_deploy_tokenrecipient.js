/**
 * Handles deploying the contract to obserrve
 * subsequent smart contract migrations, and ensures
 * we don't double-migrate unchanged contracts in the future
 */

const TokenRecipient = artifacts.require("./TokenRecipient.sol");

module.exports = function(deployer) {
    deployer.deploy(TokenRecipient);
};