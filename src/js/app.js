App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load any necessary data (i.e. git repo related data...)

        return App.initWeb3();
    },

    initWeb3: function() {
        /**
         * Check to see if there's a web3 instance already active
         * Mist or Chrome with MetaMask extension will inject their
         *  own web3 instance
         */

        if (typeof web3 !== 'undefined') // If there is an injected web3 instance
            App.web3Provider = web3.currentProvider;
        else // Create our web3 object based on our local provider
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')

        web3 = new Web3(App.web3Provider)

        return App.initContract();
    },

    initContract: function() {
        $.getJSON('Congress.json', (data) => {

            /**
             * Artifacts are info about our contract such as its deployed
             * address and ABI (JS object defining how to interact with the
             * contract including its variables, function and their params).
             */

            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var CongressArtifact = data;

            /**
            * truffle-contract keeps information about the contract in sync
            * with migrations so you don't need to change the contract's
            * deployed address manually
            *
            * Creates an instance of the contract we can interact with
            */
            App.contracts.Congress = TruffleContract(CongressArtifact);

            // Set the provider for our contract
            App.contracts.Congress.setProvider(App.web3Provider)

            // Use our contract to retrieve and mark the adopted pets
            // in the case some are already adopted from a previous visit
            // return App.markVoted();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

    /**
     * Mark existing proposals with the correct metrics.
     */
    markVoted: function(votedMembers, account) {
        var congressInstance;

        App.contracts.Congress.deployed().then((instance) => {
            congressInstance = instance;

        // Using call allows us to read data from the blockchain without
        // having to send a full transaction (i.e. no Ether spent)
        return congressInstance.getVoters().call();
    }).then((adopters) => {
            for (i = 0; i < voters.length; i++) {
            if (voters[i] !== '0x0000000000000000000000000000000000000000') {
                $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
            }
        }
    }).catch((err) => console.error(err.message));
    },

    handleVote: function(event) {
        event.preventDefault();

        var proposalId = parseInt($(event.target).data('id'));

        var congressInstance;

        // Use web3 to get the user's accounts...
        web3.eth.getAccounts((error, accounts) => {
            if (error) console.error(error.message);

            var account = accounts[0];

            // Send a transaction instead of a call..
            // Transactions require a "from" address and have
            // and assoc. cost paid in ether (i.e. gas)
            // The gas cost is the fee for performing computation and/or
            // storing data in a smart contract
            App.contracts.Congress.deployed().then((instance) => {
                congressInstance = instance;

                // Execute adopt as a transaction by sending account
                return congressInstance.vote(proposalId, {from: account});
            }).then((result) => {
            return App.markVoted();
            }).catch((err) => console.error(err.message));
        });
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});
