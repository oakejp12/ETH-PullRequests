/**
 * Add a member to the Congress
 */

const Congress = artifacts.require("./Congress.sol");

const account = "0xae6b2b4e1ea7b1d1d8bb15bb439bfc07e6f5969a";

module.exports = function(callback) {

    return Congress.deployed().then(instance => {
        
        return instance.addMember(account, 'joakes', { from: account });
    }).then(result => {
        console.log("Member added successfully!");
    }).catch(err => console.error(err));
};