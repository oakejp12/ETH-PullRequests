const GithubApi = require('github');
const config = require('../../config/config');

const github = new GithubApi({
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
 * Retrieve a repository.
 */
let getRepoFromUser = (repository, owner, callback) => {
    console.log(`Grabbing repository ${owner}\\${repository}.`);

    github.repo.get(
        { repo: repository, owner: owner },
        (err, res) => callback(err, res)
    );
}

/** 
 * List all issues accross a particular repository.
 * 
 * @param {string} repository - Name of the repository to query issues from.
 * @param {function} callback - Handle the response data.
*/
let getAllIssuesForRepo = (repository, owner, callback) => {
    console.log(`Grabbing issues for ${owner}\\${repository}.`);

    github.issues.getForRepo(
        { repo: repository, owner: owner }, 
        (err, res) => callback(err, res)
    );
}

module.exports = {
    getRepoFromUser: getRepoFromUser,
    getAllIssuesForRepo: getAllIssuesForRepo
}