import { Octokit } from 'octokit';

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

export default octokit;
