const { Octokit } = require("@octokit/rest");

// Create personal access token (with repo --> public rights) at https://github.com/settings/tokens
let octokit;
const ownersRepos = getRepos();

getStats();

function getRepos() {
    try {
        // Need to set env variable GITHUB_REPOS
        // export GITHUB_REPOS="[ { \"owner\": \"microsoft\", \"repo\": \"MicrosoftCloud\", \"token\": \"token_value\" } ]"
        return JSON.parse(process.env['GITHUB_REPOS']);
    }
    catch (e) {
        return [];
    }
}

async function getStats() {
    const stats = [];
    for (const repo of ownersRepos) {
        octokit = new Octokit({
            auth: repo.token
        });
        const ownerRepo = {
            owner: repo.owner,
            repo: repo.repo
        }
        const clones = await getCloneCount(ownerRepo);
        const forks = await getForkCount(ownerRepo);
        const views = await getPageViews(ownerRepo);
        const today = new Date();
        const fourteenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
        const repoStats = {
            startDate: fourteenDaysAgo,
            endDate: today,
            owner: repo.owner,
            repo: repo.repo,
            clones,
            forks,
            views
        };
        // console.log(repoStats);
        stats.push(repoStats);
    }
    return stats;
}

async function getCloneCount(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-repository-clones
        const { data } = await octokit.rest.repos.getClones(ownerRepo);
        console.log(`${ownerRepo.owner}/${ownerRepo.repo} clones:`, data.count);
        return data.count;
    }
    catch (e) {
        console.log(`Unable to get clones for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getForkCount(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/repos/forks
        const { data } = await octokit.rest.repos.listForks(ownerRepo);
        console.log(`${ownerRepo.owner}/${ownerRepo.repo} forks:`, (data && data.length) ? data.length : 0);
        return (data && data.length) ? data.length : 0;
    }
    catch (e) {
        console.log(`Unable to get forks for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getPageViews(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-page-views
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/traffic/views', ownerRepo);
        console.log(`${ownerRepo.owner}/${ownerRepo.repo} visits:`, data.count);
        return data.count;
    }
    catch (e) {
        console.log(`Unable to get page views for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
        console.log(e);
    }
    return 0;
}