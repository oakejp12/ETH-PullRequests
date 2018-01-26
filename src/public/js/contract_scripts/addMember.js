/**
 * Add a member to the Congress
 */

const Congress = artifacts.require("./Congress.sol");

const account = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
const accountToAdd = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";

module.exports = function(callback) {

    return Congress.deployed().then(instance => {
        
        return instance.addMember(accountToAdd, "joakes", { from: account });
    }).then(result => {
        console.log("Member added successfully!");
    }).catch(err => console.error(err));
};