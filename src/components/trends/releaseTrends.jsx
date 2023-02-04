import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getReleases } from '../../api';
import LineChart from '../lineChart';

const options = {
    scales: {
        x: {
            time: {
                unit: 'year',
                tooltipFormat: 'MMM DD, YYYY',
            },
        },
        y: {
            ticks: {
                stepSize: 10000,
                callback(value, index, ticks) {
                    return value / 10000;
                },
            },
        },
    },
    plugins: {
        tooltip: {
            callbacks: {
                label(context) {
                    const { label } = context.dataset;
                    const versionString = getVersionString(context.raw);
                    return `${label}: ${versionString}`;

                    function getVersionString(versionNumber) {
                        const major = Math.floor(versionNumber / 10000) % 100;
                        const minor = Math.floor(versionNumber / 100) % 100;
                        const patch = versionNumber % 100;
                        return `${major}.${minor}.${patch}`;
                    }
                },
            },
        },
    },
};

function ReleaseTrends({ repos }) {
    const [data, setData] = useState();

    useEffect(() => {
        if (repos.length === 0) {
            setData(null);
            return;
        }

        Promise.all(repos.map(getData)).then((data) =>
            setData(getDataBy(data, repos))
        );
    }, [repos]);

    return <LineChart title="🚀 Releases" options={options} data={data} />;
}

function getData({ fullName }) {
    const [owner, repo] = fullName.split('/');
    return getReleases({ owner, repo });
}

function getDataBy(data, repos) {
    const DATE_FORMAT = 'YYYY-MM-DD';
    const dates = data.map((item) => item.map((item) => item.publishedAt));

    const versions = data.map((versionList) =>
        versionList.map((item) => {
            const versionString =
                item.tagName[0] === 'v' ? item.tagName.slice(1) : item.tagName;
            const arr = versionString.split('.').map((str) => Number(str));
            return arr[0] * 10000 + arr[1] * 100 + arr[2];
        })
    );

    const transformedDates = dates.map((dateList) =>
        dateList.map((date) => dayjs(date).format(DATE_FORMAT))
    );
    const minDate = dayjs
        .min(transformedDates.map((dates) => dayjs(dates[dates.length - 1])))
        .format(DATE_FORMAT);
    const totalDays = dayjs().diff(minDate, 'day');

    const labels = getLabels();
    const datasets = getDatasetsBy(repos, transformedDates);

    return {
        labels,
        datasets,
    };

    function getLabels() {
        const res = [];
        let current = minDate;

        for (let i = 0; i < totalDays; i++) {
            res.push(current);
            current = dayjs(current).add(1, 'day').format(DATE_FORMAT);
        }

        return res;
    }

    function getDatasetsBy(repos, dates) {
        const res = [];

        for (let i = 0; i < repos.length; i++) {
            const { fullName: label } = repos[i];
            const data = getDataBy(dates[i], versions[i]);

            res.push({
                label,
                data,
                spanGaps: true,
                cubicInterpolationMode: 'monotone',
            });
        }

        return res;
    }

    function getDataBy(dates, versions) {
        const res = [];
        let current = minDate;

        for (let i = 0; i < totalDays; i++) {
            if (dates.includes(current)) {
                const index = dates.indexOf(current);
                res.push(versions[index]);
            } else {
                res.push(null);
            }
            current = dayjs(current).add(1, 'day').format(DATE_FORMAT);
        }

        return res;
    }
}

export default ReleaseTrends;
