const { Octokit } = require("@octokit/rest");
const { v4: uuidv4 } = require('uuid');

// Create personal access token (with repo --> public rights) at https://github.com/settings/tokens
let octokit;
let ownersRepos;
let context;
getStats(context);

async function getStats(ctx) {
    context = ctx || { log: console.log }; // Doing this to simulate what's it like in Azure Functions
    ownersRepos = getRepos();
    context.log(ownersRepos);
    const stats = [];
    for (const repo of ownersRepos) {
        octokit = new Octokit({
            auth: repo.token
        });
        const ownerRepo = {
            owner: repo.owner,
            repo: repo.repo
        }

        const clones = await getClones(ownerRepo);
        const forks = await getTotalForks(ownerRepo);
        const views = await getPageViews(ownerRepo);

        stats.push(getTodayRow(ownerRepo, clones, forks, views));
    }
    context.log(stats);
    return stats;
}

function getRepos() {
    try {
        console.log(context);
        // Need to set env variable GITHUB_REPOS
        // export GITHUB_REPOS="[ { \"owner\": \"microsoft\", \"repo\": \"MicrosoftCloud\", \"token\": \"token_value\" } ]"
        const repos = JSON.parse(process.env['GITHUB_REPOS']);
        context.log('Repos:', repos);
        return repos;
    }
    catch (e) {
        context.log(e);
        return [];
    }
}

function getTodayRow(ownerRepo, clones, forks, views) {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      .toISOString().split('T')[0] + 'T00:00:00Z';

    const todayClonesViewsForks ={
        id: uuidv4(),
        timestamp: yesterday,
        owner: ownerRepo.owner,
        repo: ownerRepo.repo,
        clones: 0,
        forks: forks,
        views: 0
    };
    const todayClones = clones.clones.find(c => c.timestamp === yesterday);
    const todayViews = views.views.find(v => v.timestamp === yesterday);
    if (todayClones) {
        todayClonesViewsForks.clones = todayClones.count;
    }
    if (todayViews) {
        todayClonesViewsForks.views = todayViews.count;
    }
    return todayClonesViewsForks;
}

async function getClones(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-repository-clones
        const { data } = await octokit.rest.repos.getClones(ownerRepo);
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} clones:`, data.count);
        return data;
    }
    catch (e) {
        context.log(`Unable to get clones for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getTotalForks(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/repos/forks
        const { data } = await octokit.rest.repos.get(ownerRepo);
        const forksCount = (data) ? data.forks_count : 0;
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} forks:`, forksCount);
        return forksCount
    }
    catch (e) {
        context.log(e);
        context.log(`Unable to get forks for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getPageViews(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-page-views
        const { data } = await await octokit.rest.repos.getViews(ownerRepo);
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} visits:`, data.count);
        return data;
    }
    catch (e) {
        context.log(`Unable to get page views for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
        context.log(e);
    }
    return 0;
}