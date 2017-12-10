import request from '../src/js/github_data';

module.exports = function(app) {

  app.get("/issues", (req, res) => {
    console.log("Hitting the repo path...");

    // TODO: TAKE OUT HARDCODED VALUES!
    request.getAllIssuesForRepo('ethpull', 'oakejp12', (err, response) => {
      if (err) throw new Error("Error hitting Github API: " + err);
      res.json(response);
    });
  });
};  