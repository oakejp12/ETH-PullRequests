App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load any necessary data (i.e. git repo related data...)
        // i.e. load all the current proposals being voted on...

        // Grab issues JSON
        $.getJSON('/issues', function(data) {
            console.log('Retrieving issues from /issues endpoint.');
            
            let issuesRow = $('#issuesRow');
            let issueTemplate = $('#issueTemplate');

            const data_arr = data.data;
    
            data_arr.forEach(element => {
                // Populate template with issues description
                issueTemplate.find('.panel-title').text(element.title);
                issueTemplate.find('.issue-description').text(element.body_text);
                issueTemplate.find('.issue-author').text(element.user.login);
                issueTemplate.find('.btn-vote').attr('data-id', element.id);

                issuesRow.append(issueTemplate.html())
            });
        });

        return App.initWeb3();
    },

    initWeb3: function() {
        /**
         * Check to see if there's a web3 instance already active
         * Mist or Chrome with MetaMask extension will inject their own web3 instance
         * If not, create a web3 object based on local provided.
         */

        App.web3Provider = (typeof web3 !== 'undefined') 
            ? web3.currentProvider 
            : new Web3.providers.HttpProvider('http://localhost:7545'); 

        web3 = new Web3(App.web3Provider)

        return App.initContract();
    },

    initContract: function() {
        
        $.getJSON('../../build/Congress.json', (data) => {

            /**
             * Artifacts are info about our contract such as its deployed
             * address and ABI (JS object defining how to interact with the
             * contract including its variables, function and their params).
             */

            // Get the necessary contract artifact file and instantiate it with truffle-contract
            let CongressArtifact = data;

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

            // Use our contract to retrieve and mark the voted proposals
            // in the case some are already voted on from a previous visit
            // return App.markVoted();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-vote', App.handleVote);
    },

    /**
     * Mark existing proposals with the correct metrics.
     * 
     * @param {*} votedMembers
     * @param {*} account
     */
    markVoted: function(votedMembers, account) {
        let congressInstance;

        App.contracts.Congress.deployed().then((instance) => {
            congressInstance = instance;

            // Using call allows us to read data from the blockchain without
            // having to send a full transaction (i.e. no Ether spent)
            return congressInstance.getVoters().call();
        }).then((voters) => {
            for (i = 0; i < voters.length; i++) {
                if (voters[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                }
            }
        }).catch((err) => console.error(err.message));
    },

    /**
     * Strike a vote on an existing proposal.
     * 
     * @param {*} event
     */
    handleVote: function(event) {
        event.preventDefault();

        var proposalId = parseInt($(event.target).data('id'));

        var congressInstance;

        // Use web3 to get the user's accounts...
        web3.eth.getAccounts((err, accounts) => {
            if (err) console.error(err.message);

            var account = accounts[0];

            // Send a transaction instead of a call..
            // Transactions require a "from" address and have
            // and assoc. cost paid in ether (i.e. gas)
            // The gas cost is the fee for performing computation and/or
            // storing data in a smart contract
            App.contracts.Congress.deployed().then((instance) => {
                congressInstance = instance;

                // Execute vote as a transaction by sending account
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
