# ethpull

An ethereum-powered pull request system.

### Documentation TODO:
- [ ] Describe technical roadmap and how code could be tied to a smart contract.
- [ ] How can third-party version controls rely on Ethereum to act as an DAO in order to accept merge/pull requests?

### Development TODO:
- [ ] Provide a landing page so that an organization can retrieve a repository to a smart contract.
- [ ] Defer initialization of smart contract in `app.js` to after an organization selects the repository or a new smart contract is deployed.


## Plan

Original idea: since merge/pull requests are sometimes a source of contention, I plan to build a decentralized voting system that takes advantage of third-party version control systems in order to approve merge/pull requests.

Secondary idea: Display repository issues and submit proposals in order to vote and handle the issues.
* Lock the issue for voting.
* Contributors submit their proposals.
* Issue gets assigned to the contributor with the winning proposal.

### Ideas: 

#### Original Idea
* Merge request could be completed once voting is done and some conditions are met.
    * Conditions:
        * Past repository contributors have a stake in voting.
        * The merge request doesn't complete once team members have voted or a specified time has ended.
* A merge request acts as a proposal, which is in the form of an ethereum transaction, and other members can vote in support or against the proposal. 
* Have JS code call the voting proposal and initialize a merge request using a Github API

#### Issues Idea
* From a landing page, a user would submit an applicable repository.
* Load the issues for the selected repository.
* User will select the issue to view.
* Once the issue is selected, a list of current proposals will appear.
* Voting on proposals proceed with a user having to submit a transaction on a proposal.
* New proposals could be submitted with a transaction.