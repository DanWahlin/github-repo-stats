const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
    auth: 'personal-access-token'
});

const ownersRepos = [
     { owner: '', repo: ''}
];

async function getCloneCount(owner, repo) {
    try {
        const { data } = await octokit.rest.repos.getClones({
            owner: owner,
            repo: repo
        });
        console.log(`${owner}/${repo} clones:`, data.count);
    }
    catch (e) {
        console.log(`Unable to get clones for ${owner}/${repo}. You probably don't have push access.`);
    }

}

async function getPageViews(owner, repo) {
    try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/traffic/views', {
            owner: owner,
            repo: repo
        });
        console.log(`${owner}/${repo} visits:`, data);
    }
    catch (e) {
        console.log(`Unable to get page views for ${owner}/${repo}. You probably don't have push access.`);
        console.log(e);
    }

}

for (const ownerRepo of ownersRepos) {
    getCloneCount(ownerRepo.owner, ownerRepo.repo);
    getPageViews(ownerRepo.owner, ownerRepo.repo);
}