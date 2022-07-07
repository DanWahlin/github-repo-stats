const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
    auth: 'your-github-person-token',
    baseUrl: 'https://api.github.com',
});

// You need pull access to get the clone count from these repos
const ownersRepos = [
     { owner: '', repo: ''}
];

async function getCloneCount(owner, repo) {
    try {
        const { data} = await octokit.rest.repos.getClones({
            owner: owner,
            repo: repo
        });
        console.log(`${owner}/${repo}`, data.count);
    }
    catch (e) {
        console.log(`Unable to get clones for ${owner}/${repo}. You probably don't have push access.`);
    }

}

for (const ownerRepo of ownersRepos) {
    getCloneCount(ownerRepo.owner, ownerRepo.repo);
}