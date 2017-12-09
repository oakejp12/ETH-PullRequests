import request from '../src/js/github_data';

module.exports = function(app) {

  app.get("/issues", (req, res) => {
    console.log("Hitting the repo path...");
    request.getAllIssuesForRepo({
        owner: 'oakejp12', // TODO: Take out hardcoded values!
        repository: 'ethpull'
    }, (err, response) => {
      if (err) throw new Error("Error hitting Github API: " + err);
      res.json(response);
    });
  });
};  