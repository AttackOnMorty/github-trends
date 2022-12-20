import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { GITHUB_COUNT_LIMIT, MAX_REQUEST_AMOUNT } from '../constants';

import octokit from '../utils/octokit';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StarTrends = ({ repos }) => {
    const [data, setData] = useState();

    useEffect(() => {
        if (repos.length === 0) {
            setData(null);
            return;
        }

        const transformedRepos = repos.map((item) => {
            const { full_name, stargazers_count } = item;
            const pages = getPagesBy(stargazers_count);

            return {
                full_name,
                pages,
            };
        });

        Promise.all(
            transformedRepos.map(({ full_name, pages }) => {
                const [owner, repo] = full_name.split('/');
                return Promise.all(
                    pages.map((page) =>
                        octokit
                            .request('GET /repos/{owner}/{repo}/stargazers', {
                                headers: {
                                    accept: 'application/vnd.github.star+json',
                                },
                                owner,
                                repo,
                                per_page: 1,
                                page,
                            })
                            .then((res) => res.data[0].starred_at)
                    )
                );
            })
        ).then((dates) => {
            const labels = dates[0];
            let datasets = [];

            for (let i = 0; i < repos.length; i++) {
                const { full_name, pages } = transformedRepos[i];
                datasets.push({
                    label: full_name,
                    data: pages,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                });
            }

            console.log({
                labels,
                datasets,
            });

            setData({
                labels,
                datasets,
            });
        });
    }, [repos]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Star Trends',
            },
        },
    };

    return <div>{data && <Line options={options} data={data} />}</div>;
};

function getPagesBy(stargazersCount) {
    const res = [];
    let index = 1;

    const count =
        stargazersCount > GITHUB_COUNT_LIMIT
            ? GITHUB_COUNT_LIMIT
            : stargazersCount;
    const interval = Math.floor(count / MAX_REQUEST_AMOUNT);

    res.push(index);

    for (let i = 0; i < MAX_REQUEST_AMOUNT; i++) {
        index += interval;
        res.push(index <= count ? index : count);
    }

    return res;
}

export default StarTrends;
