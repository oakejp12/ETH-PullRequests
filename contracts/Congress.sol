pragma solidity ^0.4.2;

import "./TokenRecipient.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Congress is Ownable, TokenRecipient {

    // Contract variables
    uint public minimumQuorum;  // Minimum number of members required to vote on a Proposal
    uint public debatingPeriodInMinutes; // Debating period for a Proposal
    int public majorityMargin; // Added margin to win majority on top of 50%

    Proposal[] public proposals; // Proposals being debated on...
    uint public numProposals;

    mapping (address => uint) public memberId;
    Member[] public members;

    // Contract Events
    event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, bool position, address voter, string justification);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
    event MembershipChanged(address member, bool isMember);
    event ChangeOfRules(uint newMinimumQuorum, uint newDebatingPeriodInMinutes, int newMajorityMargin);

    struct Proposal {
        address recipient;
        uint amount;
        string description;
        uint votingDeadline;
        bool executed;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        bytes32 proposalHash;
        Vote[] votes;

        /// Mappings can be seen as hash tables which are virtually initialized such that
        /// every possible key exists and is mapped to a value whose byte-representation is all zeros : a type's default value.
        /// The key data is not actually stored in a mapping, only its keccak256 hash used to look up the value.
        mapping (address => bool) voted;
    }

    struct Member {
        address member;
        string name;
        uint memberSince;
    }

    struct Vote {
        bool inSupport;
        address voter;
        string justification;
    }

    /**
    * @dev Modifier that allows only shareholders to vote and create new proposals.
    */
    modifier onlyMembers {
        require(memberId[msg.sender] != 0);
        _;
    }

    /**
     * @dev Constructor.
     * 
     * A Congress will be created for each issue.
     * 
     * @notice It is important to also provide the "payable" keyword here, otherwise
     * the function will automatically reject all ether sent to it.
    */
    function Congress(uint minimumQuorumForProposals, uint minutesForDebate, int marginOfVotesForMajority) payable public {
        changeVotingRules(minimumQuorumForProposals, minutesForDebate, marginOfVotesForMajority);

        addMember(0, ""); // Add an empty first member

        addMember(owner, "founder"); // User who created issue or voting on issue is the founder of the `Congress`
    }

    /**
    * @dev Adds a member to the Congress. Members should only be contributors to the repository.
    * 
    * Make `targetMember` a member named `memberName`
    *
    * TODO: Check if member with `memberName` already exists 
    * 
    * @param targetMember  the Eth address to be added
    * @param memberName    the Github name for that member
    */
    function addMember(address targetMember, string memberName) onlyOwner public {        
        uint id = memberId[targetMember]; // Retrieve the id mapped to the address of `targetMember`
        
        if (id == 0) { // If the `targetMember` doesn't exist
            memberId[targetMember] = members.length;
            id = members.length++;
        }

        members[id] = Member({member: targetMember, memberSince: now, name:memberName});
        MembershipChanged(targetMember, true);
    }

    /**
    * @dev Remove a member.
    *
    * @notice Remove membership from 'targetMember'
    *
    * @param targetMember ethereum address to be removed
    */
    function removeMember(address targetMember) onlyOwner public {
        require(memberId[targetMember] != 0); // Make `targetMember` is already a member

        // For all members after the member to remove, push them back one spot
        for (uint i = memberId[targetMember]; i < members.length - 1; i++) {
            members[i] = members[i + 1]; // The first iteration replaces the member to remove
        }

        delete members[members.length - 1];
        members.length--;

        MembershipChanged(targetMember, false);
    }

    /**
     * @dev Gets a view of the members in the Congress
     *
     * @return members currently in session
     */
    function getNumberOfMembers() public view returns (uint) {
        return members.length;
    }

    /**
     * @dev Changes voting rules
     *
     * Make so that proposals need to be discussed for at least `minutesForDebate/60` hours,
     * have at least `minimumQuorumForProposals` votes, and have 50% + `marginOfVotesForMajority` votes to be executed
     *
     * @param minimumQuorumForProposals Number of members required to vote on a proposal for it to be executed
     * @param minutesForDebate Minimum amount of delay between when a proposal is made and when it can be executed
     * @param marginOfVotesForMajority the proposal needs to have 50% plus this number
     */
     function changeVotingRules(uint minimumQuorumForProposals, uint minutesForDebate, int marginOfVotesForMajority) onlyOwner public {
         minimumQuorum = minimumQuorumForProposals;
         debatingPeriodInMinutes = minutesForDebate;
         majorityMargin = marginOfVotesForMajority;

         ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
     }

    /**
     * @dev Adds a Proposal
     * 
     * Propose to send `weiamount / 1e18` ether to `beneficiary` for `jobDescription`.
     * `transactionBytecode` ? Contains : Does not contain code.
     * 
     * @notice The smallest denomination aka base unit of ether is called Wei.
     *
     * @param beneficiary who to send the ether to
     * @param weiAmount amount of ether to send, in wei
     * @param jobDescription Description of job
     * @param transactionBytecode bytecode of transaction
     */
    function newProposal(
        address beneficiary,
        uint weiAmount,
        string jobDescription,
        bytes transactionBytecode
    )
        onlyMembers public
        returns (uint proposalID)
    {
        proposalID = proposals.length++;

        Proposal storage p = proposals[proposalID];
        p.recipient = beneficiary;
        p.amount = weiAmount;
        p.description = jobDescription;

        /// Computes the Ethereum-SHA-3 hash of the (tightly packed) arguments
        /// Tightly packed -> arguments are concatenated without padded (e.g. "ab", "c" -> "abc" | 0x616263)
        p.proposalHash = keccak256(beneficiary, weiAmount, transactionBytecode);

        p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;

        ProposalAdded(proposalID, beneficiary, weiAmount, jobDescription);
        numProposals = proposalID + 1;

        return proposalID;
    }

    /**
     *
     * @dev Adds proposal in Ether
     *
     * Propose to send 'etherAmount' ether to 'beneficiary' for 'jobDescription'. 
     * `transactionBytecode ? Contains : Does not contain` code.
     * 
     * @notice Utility function to use if the amount to be given is in round numbers.
     *
     * @param beneficiary who to send ether to
     * @param etherAmount amount of ether to send
     * @param jobDescription Description of job
     * @param transactionBytecode bytecode of transaction
     */
    function newProposalInEther(
        address beneficiary,
        uint etherAmount,
        string jobDescription,
        bytes transactionBytecode
    )
        onlyMembers public
        returns (uint proposalID)
    {
        return newProposal(beneficiary, etherAmount * 1 ether, jobDescription, transactionBytecode);
    }

    /**
    * @dev Checks if proposal code matches
    *
    * @param proposalNumber ID number of the proposal to query
    * @param beneficiary who to send the ether to
    * @param weiAmount amount of ether to send
    * @param transactionBytecode bytecode of transaction
    */
    function checkProposalCode(
        uint proposalNumber,
        address beneficiary,
        uint weiAmount,
        bytes transactionBytecode
    )
        constant public
            returns (bool codeChecksOut)
    {
        Proposal storage p = proposals[proposalNumber];
        return p.proposalHash == keccak256(beneficiary, weiAmount, transactionBytecode);
    }

    /**
    * @dev Logs a vote for a proposal
    *
    * Vote `supportsProposal` ? In support : against # `proposalNumber`
    *
    * @param proposalNumber number of proposal
    * @param supportsProposal either in favor or against it
    * @param justificationText optional justification text
    */
    function vote(
        uint proposalNumber,
        bool supportsProposal,
        string justificationText
    )
        onlyMembers public
        returns (uint voteID)
    {
        Proposal storage p = proposals[proposalNumber]; // Get the correct proposal
        require(!p.voted[msg.sender]); // Make sure the person hasn't voted yet

        p.voted[msg.sender] = true;
        p.numberOfVotes++;
        
        if (supportsProposal) {
            p.currentResult++;
        } else {
            p.currentResult--;
        }

        // Register the voting event
        Voted(proposalNumber, supportsProposal, msg.sender, justificationText);

        return p.numberOfVotes;
    }

    /**
    * Finishes voting.
    *
    * Count the votes proposal # `proposalNumber` and execute it if approved
    *
    * @param proposalNumber proposal number
    * @param transactionBytecode optional: if the transaction contained a bytecode, send it!
    */
    function executeProposal(uint proposalNumber, bytes transactionBytecode) public {
        Proposal storage p = proposals[proposalNumber];

        require(now > p.votingDeadline && !p.executed && p.proposalHash == keccak256(p.recipient, p.amount, transactionBytecode) && p.numberOfVotes >= minimumQuorum);

        // Execute proposal
        if (p.currentResult > majorityMargin) {
            
            p.executed = true; // Avoid recursive calling
            
            require(p.recipient.call.value(p.amount)(transactionBytecode));

            p.proposalPassed = true;
        } else {
            // Failure of proposal
            p.proposalPassed = false;
        }

        // Fire events
        ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
    }
}
