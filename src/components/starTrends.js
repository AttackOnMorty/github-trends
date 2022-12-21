import {
    CategoryScale,
    Chart as ChartJS,
    Colors,
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
    Colors,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
);

const options = {
    responsive: true,
    scales: {
        y: {
            ticks: {
                callback: function (value, index, ticks) {
                    console.log(value, index, ticks);
                    return value === 0 ? 0 : value / 1000 + 'k';
                },
            },
        },
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
            },
        },
        title: {
            display: true,
            text: 'Star Trends',
        },
        colors: {
            forceOverride: true,
        },
    },
};

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
    const DATE_FORMAT = 'YYYY-MM';
    const transformedDates = dates.map((dateList) =>
        dateList.map((date) => dayjs(date).format(DATE_FORMAT))
    );
    const minDate = dayjs
        .min(transformedDates.map((dates) => dayjs(dates[0])))
        .format(DATE_FORMAT);

    let labels;
    let datasets = [];

    for (let i = 0; i < transformedRepos.length; i++) {
        const { full_name, pages, stargazers_count } = transformedRepos[i];

        const res = getLabelsAndDataBy(
            minDate,
            transformedDates[i],
            pages,
            stargazers_count
        );

        labels = res.labels;

        datasets.push({
            label: full_name,
            data: res.data,
            spanGaps: true,
        });
    }

    return {
        labels,
        datasets,
    };

    function getLabelsAndDataBy(minDate, dates, pages, stargazers_count) {
        const totalMonths = dayjs().diff(minDate, 'month');

        const labels = [];
        const data = [];
        let currentDate = minDate;

        for (let i = 0; i < totalMonths; i++) {
            labels.push(currentDate);

            if (dates.includes(currentDate)) {
                const index = dates.indexOf(currentDate);
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
