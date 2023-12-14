import { Octokit } from 'octokit';

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

export const getRepositories = async (value) => {
    const res = await octokit.request('GET /search/repositories{?q}', {
        q: value,
        per_page: 20,
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

const ISSUE_STATE = {
    OPEN: 'open',
    CLOSED: 'closed',
};

export const getIssues = async (options) => {
    const {
        owner,
        repo,
        dateRange: [startDate, endDate],
    } = options;

    const result = [];
    const PER_PAGE = 100;
    let page = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        // TODO: Use total_count to do parallel requests
        // eslint-disable-next-line no-await-in-loop
        const res = await octokit.request('GET /search/issues{?q}', {
            q: `repo:${owner}/${repo} is:issue created:${startDate}..${endDate}`,
            per_page: PER_PAGE,
            page,
        });

        if (res.status !== 200) {
            return result;
        }

        result.push(...res.data.items);

        if (res.data.items.length < PER_PAGE || result.length === 1000) {
            break;
        }

        page++;
    }

    const issues = result.reduce((acc, { created_at, state }) => {
        const [year, month] = created_at.split('-');
        const key = `${year}-${month}`;

        if (!acc[key]) {
            acc[key] = [0, 0];
        }

        if (state === ISSUE_STATE.OPEN) {
            acc[key][0]++;
        } else {
            acc[key][1]++;
        }

        return acc;
    }, {});

    return issues;
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
    const PER_PAGE = 100;
    let page = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { owner, repo } = options;
        // eslint-disable-next-line no-await-in-loop
        const res = await octokit.request(
            'GET /repos/{owner}/{repo}/releases',
            {
                owner,
                repo,
                per_page: PER_PAGE,
                page,
            },
        );

        if (res.status !== 200) {
            return result;
        }

        result.push(...res.data);

        if (res.data.length < PER_PAGE) {
            break;
        }

        page++;
    }

    return result.map(({ tag_name, published_at }) => ({
        tagName: tag_name,
        publishedAt: published_at,
    }));
};
