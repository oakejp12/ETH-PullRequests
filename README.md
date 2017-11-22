# ethpull

An ethereum-powered pull request system.

## Plan

Since merge/pull requests are sometimes a source of contention, I plan to build a decentralized voting system that takes advantage of third-party version control systems in order to approve merge/pull requests.

### Where Ethereum and Dapps make sense: 
* Need for multiple parties to coordinate and/or agree.
* Parties are competing so they don't trust each other.
* It wouldbe hard to trust a third party to run the infrastructure fairly and not abuse a monopoly position.

### TODO:
- [ ] Describe technical roadmap and how code could be tied to a smart contract.
- [ ] How can third-party version controls rely on Ethereum to act as an DAO in order to accept merge/pull requests?

### Ideas: 
* Merge request could be completed once voting is done and some conditions are met.
    * Conditions:
        * Past repository contributors have a stake in voting.
        * The merge request doesn't complete once team members have voted or a specified time has ended.
* A merge request acts as a proposal, which is in the form of an ethereum transaction, and other members can vote in support or against the proposal. 
* Have JS code call the voting proposal and initialize a merge request using a Github API
