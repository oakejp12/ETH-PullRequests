/**
 * Handles deploying the contract to observe
 * subsequent smart contract migrations, and ensures
 * we don't double-migrate unchanged contracts in the future
 */

const Congress = artifacts.require("./Congress.sol");

module.exports = function(deployer) {
    
    /**
    * Construct a Congress of minimum 2 people, 10 minutes to vote on an issue, and
    * 0 added margin for majority voting
    * 
    * Return Contract address for caching purposes
    * 
    * TODO: This is for demo purposes only, we should be deploying Congress contracts
    * based on user input.
    */
    
    // deployer.deploy(Congress, 2, 10, 0).then(() => {
    //     return Congress.address;
    // });
};