import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getStargazerFirstStaredAt } from '../../api';
import LineChart from '../lineChart';

const GITHUB_COUNT_LIMIT = 40000;
const MAX_REQUEST_AMOUNT = 15;

const options = {
    scales: {
        x: {
            time: {
                unit: 'year',
                tooltipFormat: 'MMM YYYY',
            },
        },
        y: {
            ticks: {
                precision: 0,
                callback(value) {
                    return value < 1000 ? value : `${value / 1000}k`;
                },
            },
        },
    },
};

function Stars({ repos }) {
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

    return <LineChart title="⭐ Stars" options={options} data={data} />;
}

function transformRepo(repo) {
    const { fullName, currentStars } = repo;
    const pages = getPagesBy(currentStars);

    return {
        fullName,
        pages,
        currentStars,
    };

    function getPagesBy(currentStars) {
        const res = [];
        let index = 1;

        const count =
            currentStars > GITHUB_COUNT_LIMIT
                ? GITHUB_COUNT_LIMIT
                : currentStars;
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
        pages.map((page) => getStargazerFirstStaredAt({ owner, repo, page }))
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
    const totalMonths = dayjs().diff(minDate, 'month');

    const labels = getLabels();
    const datasets = getDatasetsBy(transformedRepos, transformedDates);

    return {
        labels,
        datasets,
    };

    function getLabels() {
        const res = [];
        let current = minDate;

        for (let i = 0; i < totalMonths; i++) {
            res.push(current);
            current = dayjs(current).add(1, 'month').format(DATE_FORMAT);
        }

        res.push(dayjs().format(DATE_FORMAT));

        return res;
    }

    function getDatasetsBy(repos, dates) {
        const res = [];

        for (let i = 0; i < repos.length; i++) {
            const { fullName, pages, currentStars } = repos[i];
            const data = getDataBy(dates[i], pages, currentStars);

            res.push({
                label: fullName,
                data,
                spanGaps: true,
                cubicInterpolationMode: 'monotone',
            });
        }

        return res;
    }

    function getDataBy(dates, stars, currentStars) {
        const res = [];
        let current = minDate;

        for (let i = 0; i < totalMonths; i++) {
            if (dates.includes(current)) {
                const index = dates.indexOf(current);
                res.push(stars[index]);
            } else {
                res.push(null);
            }
            current = dayjs(current).add(1, 'month').format(DATE_FORMAT);
        }

        res.push(currentStars);

        return res;
    }
}

export default Stars;
