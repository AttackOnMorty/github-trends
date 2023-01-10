import octokit from '../utils/octokit';

export const getRepositories = async (value) => {
    const res = await octokit.request('GET /search/repositories{?q}', {
        q: value,
    });

    if (res.status !== 200) {
        return;
    }

    return res.data.items.map(
        ({
            full_name,
            owner: { avatar_url },
            description,
            stargazers_count,
        }) => ({
            fullName: full_name,
            avatarUrl: avatar_url,
            description,
            currentStars: stargazers_count,
        })
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
        return;
    }

    return res.data[0]?.starred_at;
};

export const getCommitCountWeekly = async (options) => {
    const { owner, repo } = options;
    const res = await octokit.request(
        'GET /repos/{owner}/{repo}/stats/participation',
        {
            owner,
            repo,
        }
    );

    if (res.status !== 200) {
        return;
    }

    return res.data.all;
};
