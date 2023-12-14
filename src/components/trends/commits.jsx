import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getCommits } from '../../api';
import { ReactComponent as CommitIcon } from '../../assets/commit.svg';
import LineChart from '../charts/lineChart';

const options = {
    scales: {
        x: {
            time: {
                unit: 'month',
                tooltipFormat: 'MMM DD',
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

        Promise.all(repos.map((repo) => getCommits(repo.fullName))).then(
            (result) => {
                const totalWeeks = result[0].data.length;
                const labels = getLabels(totalWeeks);
                const datasets = getDatasets(result);

                setData({
                    labels,
                    datasets,
                });
            },
        );
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
    return repos.map(({ name, data }) => ({
        label: name,
        data,
        spanGaps: true,
        cubicInterpolationMode: 'monotone',
    }));
}

export default Commits;
