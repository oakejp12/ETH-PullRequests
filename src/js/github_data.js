const GithubApi = require('github');

const github = new GitHubApi({
    protocol: "https",
    host: "api.github.com", // Note: Adding HTTPS:// gives a DNSLookup Error
    headers: {
        "Content-Type":  "application/json",
        "Accept": "application/vnd.github.v3.full+json",
        "User-Agent": config.gh_username
    },
    followRedirects: false,
    timeout: 5000,
});

github.authenticate({
    type: "oauth",
    token: config.gh_creds,
});

/**
 * TODO: I want to grab a repo and be able to submit a merge request. If the 
 * Ethereum-voted proposal successfully went through.
 * 
 * Get count for how many repos I have
 * @param {*} requestOptions
 * @param {*} callback 
*/
let grabRepoCount = (requestOptions, callback) => {
    console.log("Grabbing repo count");
    github.repos.getAll({ visibility: "all", }, (err, res) => callback(err, JSON.stringify(res)));
}


module.exports = {

}