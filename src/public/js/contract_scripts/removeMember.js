/**
 * Remove a member to the Congress
 */

const Congress = artifacts.require("./Congress.sol");

const owner = "0x913954dd92e1a0cd4cbd452698b63c499f1c4290";

const joakes = "0xae6b2b4e1ea7b1d1d8bb15bb439bfc07e6f5969a";

module.exports = function(callback) {

    return Congress.deployed().then(instance => {
        
        return instance.removeMember(joakes, { from: owner });
    }).then(result => {
        console.log("Member removed successfully!");
    }).catch(err => console.error(err));
};