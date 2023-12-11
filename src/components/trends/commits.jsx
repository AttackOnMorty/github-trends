import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getCommits } from '../../api';
import { ReactComponent as CommitIcon } from '../../assets/commit.svg';
import LineChart from '../lineChart';

const options = {
    scales: {
        x: {
            time: {
                unit: 'month',
                tooltipFormat: 'MMM DD',
            },
        },
        y: {
            ticks: {
                precision: 0,
            },
        },
    },
    interaction: {
        mode: 'index',
    },
    plugins: {
        tooltip: {
            position: 'nearest',
            callbacks: {
                title(context) {
                    return `The week of ${context[0].label}`;
                },
            },
        },
    },
};

function Commits({ repos }) {
    const [data, setData] = useState();

    useEffect(() => {
        if (repos.length === 0) {
            setData(null);
            return;
        }

        Promise.all(repos.map(transformRepoAsync)).then((repos) => {
            const totalWeeks = repos[0].commits.length;
            const labels = getLabels(totalWeeks);
            const datasets = getDatasets(repos);

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
                    <CommitIcon className="mr-1 inline fill-green-600" />
                    <span>Commits</span>
                </div>
            }
            options={options}
            data={data}
        />
    );
}

async function transformRepoAsync({ fullName }) {
    const [owner, repo] = fullName.split('/');
    const commits = await getCommits({ owner, repo });

    return {
        fullName,
        commits,
    };
}

function getLabels(totalWeeks) {
    const res = [];
    let current = dayjs().weekday(0);

    for (let i = 0; i < totalWeeks; i++) {
        res.unshift(current.format());
        current = current.weekday(-7);
    }

    return res;
}

function getDatasets(repos) {
    return repos.map(({ fullName, commits }) => ({
        label: fullName,
        data: commits,
        spanGaps: true,
        cubicInterpolationMode: 'monotone',
    }));
}

export default Commits;
