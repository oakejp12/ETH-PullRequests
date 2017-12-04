pragma solidity ^0.4.2;

import "./Owned.sol";
import "./TokenRecipient.sol";

contract Congress is Owned, TokenRecipient {
    
    // Contract variables
    uint public minimumQuorum; // Minimum number of members required to vote on a Proposal
    uint public debatingPeriodInMinutes; // Debating period for a Proposal
    int public majorityMargin;

    Proposal[] public proposals; // Issues being debated on...
    uint public numProposals;

    mapping (address => uint) public memberId;
    Member[] public members;

    // Contract Events
    event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, address voter, string justification);
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

    // Modifier that allows only shareholders to vote and create new proposals
    // Functions that include this modifier will only have an effect if they
    //  satisfy the condition that the sender is a member
    modifier onlyMembers {
        require(memberId[msg.sender] != 0);
        _;
    }

    /**
     * Constructor function
     * 
     * It is important to also provide the "payable" keyword here, otherwise
     * the function will auto. reject all Ether sent to it.
     */
     function Congress(uint minimumQuorumForProposals, uint minutesForDebate, int marginOfVotesForMajority) payable public {
         changeVotingRules(minimumQuorumForProposals, minutesForDebate, marginOfVotesForMajority);

         addMember(0, ""); // Add an empty first member

         addMember(owner, "founder"); // TODO: Why is this added?
     }

    /**
     * Add a member.
     *
     * @param targetMember Eth address to be added
     * @param memberName public name for that member (TODO: Could be Github repo name)
     */
    function addMember(address targetMember, string memberName) onlyOwner public {
        uint id = memberId[targetMember]; // Check to see if member is already present
        if (id == 0) { // If member isn't the founder
            memberId[targetMember] = members.length; 
            id = members.length++;
        }

        members[id] = Member({member: targetMember, memberSince: now, name:memberName});
        MembershipChanged(targetMember, true);
    }

     /**
      * Remove a member.
      *
      * @notice Remove membership from 'targetMember'
      *
      * @param targetMember ethereum address to be removed
      */
    function removeMember(address targetMember) onlyOwner public {
        require(memberId[targetMember] != 0); // Make sure founder isn't removed

        // For all members after the member to remove, push them back one spot
        for (uint i = memberId[targetMember]; i < members.length; i++) {
            members[i] = members[i + 1]; // The first iteration replaces the member to remove
        }

        delete members[members.length - 1];
        members.length--;
    } 

    /**
     * Change voting rules
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
     * Add Proposal
     * 
     * Propose to send `weiamount / 1e18` ether to `beneficiary` for `jobDescription`.
     * `transactionBytecode` ? Contains : Does not contain code.
     * 
     * NOTE: The smallest denomination aka base unit of ether is called Wei.
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
     * Add proposal in Ether
     *
     * Propose to send 'etherAmount' ether to 'beneficiary' for 'jobDescription'. 
     * `transactionBytecode ? Contains : Does not contain` code.
     * Utility function to use if the amount to be given is in round numbers.
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
    


}
