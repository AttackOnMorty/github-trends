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
import dayjs from 'dayjs';
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

        const transformedRepos = repos.map(transformRepo);

        Promise.all(transformedRepos.map(getDate)).then((dates) =>
            setData(getDataBy(dates, transformedRepos))
        );
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

function transformRepo(repo) {
    const { full_name, stargazers_count } = repo;
    const pages = getPagesBy(stargazers_count);

    return {
        full_name,
        pages,
        stargazers_count,
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
}

function getDate({ full_name, pages }) {
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
}

function getDataBy(dates, transformedRepos) {
    let labels;
    let datasets = [];

    for (let i = 0; i < transformedRepos.length; i++) {
        const { full_name, pages, stargazers_count } = transformedRepos[i];

        const res = getLabelsAndDataBy(dates[0], pages, stargazers_count);

        // TODO:
        labels = res.labels;

        datasets.push({
            label: full_name,
            data: res.data,
            spanGaps: true,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        });
    }

    return {
        labels,
        datasets,
    };

    function getLabelsAndDataBy(dates, pages, stargazers_count) {
        const DATE_FORMAT = 'YYYY-MM';
        const monthDates = dates.map((date) => dayjs(date).format(DATE_FORMAT));
        const firstDate = monthDates[0];
        const totalMonths = dayjs().diff(firstDate, 'month');

        const labels = [];
        const data = [];
        let currentDate = firstDate;

        for (let i = 0; i < totalMonths; i++) {
            labels.push(currentDate);

            if (monthDates.includes(currentDate)) {
                const index = monthDates.indexOf(currentDate);
                data.push(pages[index]);
            } else {
                data.push(null);
            }

            currentDate = dayjs(currentDate)
                .add(1, 'month')
                .format(DATE_FORMAT);
        }

        labels.push(dayjs().format(DATE_FORMAT));
        data.push(stargazers_count);

        return {
            labels,
            data,
        };
    }
}

export default StarTrends;
