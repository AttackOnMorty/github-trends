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

import { getStargazerFirstStaredAt } from '../api';
import { GITHUB_COUNT_LIMIT, MAX_REQUEST_AMOUNT } from '../constants';

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
    const { fullName, stargazersCount } = repo;
    const pages = getPagesBy(stargazersCount);

    return {
        fullName,
        pages,
        stargazersCount,
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

function getDate({ fullName, pages }) {
    const [owner, repo] = fullName.split('/');
    return Promise.all(
        pages.map(
            async (page) =>
                await getStargazerFirstStaredAt({ owner, repo, page })
        )
    );
}

function getDataBy(dates, repos) {
    const DATE_FORMAT = 'YYYY-MM';
    const transformedDates = dates.map((dateList) =>
        dateList.map((date) => dayjs(date).format(DATE_FORMAT))
    );
    const minDate = dayjs
        .min(transformedDates.map((dates) => dayjs(dates[0])))
        .format(DATE_FORMAT);

    let labels;
    let datasets = [];

    for (let i = 0; i < repos.length; i++) {
        const { fullName, pages, stargazersCount } = repos[i];

        const res = getLabelsAndDataBy(
            minDate,
            transformedDates[i],
            pages,
            stargazersCount
        );

        labels = res.labels;

        datasets.push({
            label: fullName,
            data: res.data,
            spanGaps: true,
        });
    }

    return {
        labels,
        datasets,
    };

    function getLabelsAndDataBy(minDate, dates, pages, stargazersCount) {
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
        data.push(stargazersCount);

        return {
            labels,
            data,
        };
    }
}

export default StarTrends;
