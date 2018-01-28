import { getAllIssuesForRepo }  from '../github_data';
import { cache, setContractDetails } from '../contract_deployment';

/*
* Expose API for the client to query
*/

module.exports = function(app) {

  /**
   * Retrieve all issues from a repository...
   */
  app.post("/api/issues", (req, res) => {
    console.log("Hitting the repo path...");
  
    const organization = req.body.organization;
    const repo = req.body.repo;

    // TODO: TAKE OUT HARDCODED VALUES!
    getAllIssuesForRepo(organization, repo, (err, response) => {
      if (err) throw new Error(`Error hitting Github API: ${err}`);
      res.json(response);
    });
  });

  /**
   * Retrieve the cached smart contract
   */
  app.get("/api/contract", cache, setContractDetails);

}; 