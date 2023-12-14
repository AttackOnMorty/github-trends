import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getReleases } from '../../api';
import LineChart from '../lineChart';

const DATE_FORMAT = 'YYYY-MM-DD';

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
                precision: 0,
                callback(value) {
                    if (value > 0 && value < 10000) {
                        return 1;
                    }

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

function Releases({ repos }) {
    const [data, setData] = useState();

    useEffect(() => {
        if (repos.length === 0) {
            setData(null);
            return;
        }

        Promise.all(repos.map(transformRepoAsync)).then((repos) => {
            const labels = getLabels(repos);
            const datasets = getDatasets(repos, labels);

            setData({
                labels,
                datasets,
            });
        });
    }, [repos]);

    return (
        <LineChart
            title={
                <div className="flex items-center">
                    <span>🚀 Releases</span>
                </div>
            }
            options={options}
            data={data}
        />
    );
}

async function transformRepoAsync({ fullName }) {
    const [owner, repo] = fullName.split('/');
    const releases = await getReleases({ owner, repo });

    return {
        fullName,
        releases: transformReleases(releases),
    };
}

function transformReleases(releases) {
    return releases.reverse().map(({ tagName, publishedAt }) => ({
        tagName: transformTagName(tagName),
        publishedAt: transformDate(publishedAt),
    }));
}

function transformTagName(tagName) {
    const regex = /(\d+\.\d+(\.\d+)?)/;
    const matches = tagName.match(regex);

    if (!matches) {
        return null;
    }

    const versionNumber = matches[0];
    const arr = versionNumber.split('.').map((str) => Number(str));

    return arr[0] * 10000 + arr[1] * 100 + arr[2];
}

function transformDate(date) {
    return dayjs(date).format(DATE_FORMAT);
}

function getLabels(repos) {
    if (repos.every((repo) => repo.releases.length === 0)) {
        return [];
    }

    const minDate = dayjs
        .min(repos.map((repo) => dayjs(repo.releases[0].publishedAt)))
        .format(DATE_FORMAT);
    const totalDays = dayjs().diff(minDate, 'day');

    const res = [];
    let current = dayjs().format(DATE_FORMAT);

    // NOTE: using <= to include today
    for (let i = 0; i <= totalDays; i++) {
        res.unshift(current);
        current = dayjs(current).add(-1, 'day').format(DATE_FORMAT);
    }

    return res;
}

function getDatasets(repos, labels) {
    return repos.map(({ fullName, releases }) => ({
        label: fullName,
        data: getData(releases, labels),
        spanGaps: true,
        cubicInterpolationMode: 'monotone',
    }));
}

function getData(releases, labels) {
    const res = [];

    const dates = releases.map((release) => release.publishedAt);
    const versions = releases.map((release) => release.tagName);

    for (let i = 0; i < labels.length; i++) {
        const index = dates.lastIndexOf(labels[i]);
        res.push(index === -1 ? null : versions[index]);
    }

    return res;
}

export default Releases;
