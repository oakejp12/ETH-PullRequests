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
         if (id == 0) { // If not, add to memberId array
             memberId[targetMember] = members.length;
             id = members.length++;
         }

         members[id] = Member({member: targetMember, memberSince: now, name:memberName});
         MembershipChanged(targetMember, true);
     }

    /**
     * Change voting rules
     *
     * Make so that proposals need tobe discussed for at least `minutesForDebate/60` hours,
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



}
