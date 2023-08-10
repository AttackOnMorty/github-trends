/* eslint-disable camelcase */
import { Octokit } from 'octokit';

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

export const getRepositories = async (value) => {
    const res = await octokit.request('GET /search/repositories{?q}', {
        q: value,
    });

    if (res.status !== 200) {
        return [];
    }

    return res.data.items.map(
        ({
            full_name,
            owner: { avatar_url },
            description,
            stargazers_count,
            html_url,
        }) => ({
            fullName: full_name,
            avatarUrl: avatar_url,
            description,
            currentStars: stargazers_count,
            htmlUrl: html_url,
        }),
    );
};

export const getStargazerFirstStaredAt = async (options) => {
    const { owner, repo, page } = options;
    const res = await octokit.request('GET /repos/{owner}/{repo}/stargazers', {
        headers: {
            accept: 'application/vnd.github.star+json',
        },
        owner,
        repo,
        per_page: 1,
        page,
    });

    if (res.status !== 200) {
        return null;
    }

    return res.data[0]?.starred_at;
};

export const getCommits = async (options) => {
    const { owner, repo } = options;
    const res = await octokit.request(
        'GET /repos/{owner}/{repo}/stats/participation',
        {
            owner,
            repo,
        },
    );

    if (res.status !== 200) {
        return [];
    }

    return res.data.all;
};

export const getReleases = async (options) => {
    const result = [];
    const page = 1;

    await getReleasesBy(page);

    return result;

    async function getReleasesBy(page) {
        const { owner, repo } = options;
        const res = await octokit.request(
            'GET /repos/{owner}/{repo}/releases',
            {
                owner,
                repo,
                per_page: 100,
                page,
            },
        );

        if (res.status !== 200 || res.data.length === 0) {
            return;
        }

        const mappedData = res.data.map(({ tag_name, published_at }) => ({
            tagName: tag_name,
            publishedAt: published_at,
        }));

        result.push(...mappedData);
        await getReleasesBy(page + 1);
    }
};
