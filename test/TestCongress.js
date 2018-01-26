const Congress = artifacts.require('./Congress.sol');

contract('Congress', function(accounts) {
    
    // Simulating adding a test member
    it('should add a test member', function() {
        var congressInstance;

        return Congress.deployed().then(instance => {
            congressInstance = instance;
            
            return instance.addMember(accounts[0], "oakejp12", { from: accounts[0] });
        }).then(id => {
            const members = congressInstance.getNumberOfMembers.call();

            assert.equal(members, 3, "Test user oakejp12 wasn't added as a member");
        });
    });
});