import { Octokit } from '@octokit/rest';
import { v4 as uuidv4 } from 'uuid';

// Create personal access token (with repo --> public rights) at https://github.com/settings/tokens
let octokit: Octokit;
const ownersRepos = getRepos();

function getRepos() {
    try {
        return JSON.parse(process.env['GITHUB_REPOS']);
    }
    catch (e) {
        return [];
    }
}

export async function getStats() {
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

        const yesterdayRow = getTodayRow(ownerRepo, clones, forks, views);
        stats.push(yesterdayRow);
    }

    return stats;
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
        console.log(`${ownerRepo.owner}/${ownerRepo.repo} clones:`, data.count);
        return data;
    }
    catch (e) {
        console.log(`Unable to get clones for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getTotalForks(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/repos/forks
        const { data } = await octokit.rest.repos.get(ownerRepo);
        const forksCount = (data) ? data.forks_count : 0;
        console.log(`${ownerRepo.owner}/${ownerRepo.repo} forks:`, forksCount);
        return forksCount
    }
    catch (e) {
        console.log(e);
        console.log(`Unable to get forks for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getPageViews(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-page-views
        const { data } = await await octokit.rest.repos.getViews(ownerRepo);
        console.log(`${ownerRepo.owner}/${ownerRepo.repo} visits:`, data.count);
        return data;
    }
    catch (e) {
        console.log(`Unable to get page views for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
        console.log(e);
    }
    return 0;
}