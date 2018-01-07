import request from '../src/js/github_data';

/*
* Expose API for the client to query
*/

module.exports = function(app) {

  /**
   * Retrieve all issues from a repository...
   */
  app.get("/issues", (req, res) => {
    console.log("Hitting the repo path...");

    // TODO: TAKE OUT HARDCODED VALUES!
    request.getAllIssuesForRepo('contracts', 'git-token', (err, response) => {
      if (err) throw new Error(`Error hitting Github API: ${err}`);
      res.json(response);
    });
  });


};  